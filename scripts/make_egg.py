"""Monta o egg do Pterodactyl a partir de deploy/server.mjs e deploy/install.sh.

O servidor estático é embutido no script de instalação para que o egg funcione
sozinho, mesmo sem repositório configurado. Gerar por script evita divergência
entre o arquivo real e a cópia embutida, e resolve o escape do JSON.

Uso: python scripts/make_egg.py
"""
import json
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
DEPLOY = RAIZ / "deploy"
MARCADOR = "__SERVIDOR__"


def variavel(nome, descricao, env, padrao, regras, editavel=True, visivel=True):
    return {
        "name": nome,
        "description": descricao,
        "env_variable": env,
        "default_value": padrao,
        "user_viewable": visivel,
        "user_editable": editavel,
        "rules": regras,
        "field_type": "text",
    }


def main():
    servidor = (DEPLOY / "server.mjs").read_text(encoding="utf8")
    instalacao = (DEPLOY / "install.sh").read_text(encoding="utf8")

    if MARCADOR not in instalacao:
        raise SystemExit(f"install.sh não contém o marcador {MARCADOR}")
    # O heredoc do install.sh usa 'FIM_DO_SERVIDOR' entre aspas, então nada
    # dentro do servidor é expandido pelo shell. Só é preciso garantir que o
    # próprio servidor não contenha a linha de fechamento.
    if "\nFIM_DO_SERVIDOR" in servidor:
        raise SystemExit("server.mjs contém a linha de fechamento do heredoc")
    instalacao = instalacao.replace(MARCADOR, servidor.rstrip("\n"))

    egg = {
        "_comment": (
            "FisioAtlas 3D — atlas de anatomia para estudo de fisioterapia. "
            "Aplicação estática (Vite + React) servida por um servidor Node sem "
            "dependências. A porta vem da alocação do painel, via SERVER_PORT."
        ),
        "meta": {"version": "PTDL_v2", "update_url": None},
        "exported_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+00:00"),
        "name": "FisioAtlas 3D",
        "author": "zyypjl@gmail.com",
        "description": (
            "Atlas de anatomia em 3D com 441 fichas de ossos, músculos, tendões, "
            "ligamentos, articulações e nervos, além de 38 movimentos animados. "
            "Servido como site estático; o build pode ser compilado a partir de um "
            "repositório Git ou enviado pronto por SFTP."
        ),
        "features": None,
        "docker_images": {
            "Node 22": "ghcr.io/pterodactyl/yolks:nodejs_22",
            "Node 20": "ghcr.io/pterodactyl/yolks:nodejs_20",
            "Node 18": "ghcr.io/pterodactyl/yolks:nodejs_18",
        },
        "file_denylist": [],
        "startup": "node server.mjs",
        "config": {
            "files": "{}",
            "startup": '{"done": "[FisioAtlas] pronto"}',
            "logs": "{}",
            "stop": "^C",
        },
        "scripts": {
            "installation": {
                "script": instalacao,
                "container": "node:22-bookworm-slim",
                "entrypoint": "bash",
            }
        },
        "variables": [
            variavel(
                "Repositório Git",
                "URL do repositório com o projeto. Deixe em branco para não compilar "
                "nada e apenas servir a pasta dist/ enviada por SFTP.",
                "GIT_REPO",
                "",
                "nullable|string|max:255",
            ),
            variavel(
                "Branch",
                "Branch a clonar. Usado apenas quando há repositório configurado.",
                "GIT_BRANCH",
                "main",
                "required|string|max:64",
            ),
            variavel(
                "Subpasta do projeto",
                "Caminho do projeto dentro do repositório, caso o package.json não "
                "esteja na raiz. Exemplo: fisioatlas",
                "PROJECT_DIR",
                "",
                "nullable|string|max:128",
            ),
            variavel(
                "Usuário do Git",
                "Somente para repositório privado por HTTPS. Deixe em branco se for público.",
                "GIT_USER",
                "",
                "nullable|string|max:64",
            ),
            variavel(
                "Token do Git",
                "Token de acesso para repositório privado. Deixe em branco se for público.",
                "GIT_TOKEN",
                "",
                "nullable|string|max:255",
            ),
            variavel(
                "Pasta servida",
                "Pasta com o site compilado, relativa à raiz do servidor.",
                "WEB_ROOT",
                "dist",
                "required|string|max:64",
                editavel=False,
            ),
        ],
    }

    destino = DEPLOY / "fisioatlas.egg.json"
    destino.write_text(json.dumps(egg, ensure_ascii=False, indent=4) + "\n", encoding="utf8")

    # Confere que o resultado é JSON válido e que o script embutido reconstrói
    # o servidor byte a byte.
    lido = json.loads(destino.read_text(encoding="utf8"))
    embutido = lido["scripts"]["installation"]["script"]
    assert servidor.rstrip("\n") in embutido, "servidor não foi embutido corretamente"
    print(f"OK  {destino.relative_to(RAIZ)}")
    print(f"    script de instalação: {len(embutido.splitlines())} linhas")
    print(f"    variáveis: {len(lido['variables'])}")
    print(f"    startup: {lido['startup']!r}  done: {lido['config']['startup']}")


if __name__ == "__main__":
    main()
