#!/bin/bash
# Instalação do FisioAtlas 3D no Pterodactyl.
#
# Roda no contêiner instalador (node:22-bookworm-slim) com o volume do servidor
# montado em /mnt/server. Compila numa pasta temporária dentro do próprio
# volume e publica só o resultado, apagando a área de compilação no final.
set -euo pipefail

SERVIDOR=/mnt/server
# Compilar dentro do volume do servidor, e não em /tmp.
#
# O Wings monta /tmp do contêiner instalador como tmpfs, com 100 MiB por padrão
# (docker.tmpfs_size no config.yml). O node_modules deste projeto passa de 300
# MiB, então compilar em /tmp estoura com ENOSPC mesmo havendo dezenas de GB
# livres na VPS: o tmpfs não enxerga o disco. O volume do servidor tem o
# tamanho definido na alocação, e é apagado ao final.
COMPILACAO="$SERVIDOR/.build"

echo "=========================================="
echo " FisioAtlas 3D — instalação"
echo "=========================================="

mkdir -p "$SERVIDOR"

# Sobra de uma instalação anterior que falhou no meio.
rm -rf "$COMPILACAO"
# Não deixar centenas de MiB para trás se algo quebrar no caminho.
trap 'rm -rf "$COMPILACAO"' EXIT

echo "Espaço disponível:"
df -h "$SERVIDOR" /tmp 2>/dev/null | sed 's/^/  /' || true
echo

if [ -z "${GIT_REPO:-}" ]; then
  echo
  echo "GIT_REPO está vazio: nada será compilado."
  echo "Envie o conteúdo de dist/ para a pasta dist/ do servidor por SFTP."
  echo "Para compilar automaticamente, preencha GIT_REPO e reinstale."
  mkdir -p "$SERVIDOR/dist"
else
  echo "[1/5] Instalando git"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq git ca-certificates >/dev/null

  echo "[2/5] Clonando ${GIT_REPO} (branch ${GIT_BRANCH:-main})"
  rm -rf "$COMPILACAO"
  if [ -n "${GIT_USER:-}" ] && [ -n "${GIT_TOKEN:-}" ]; then
    # Repositório privado: injeta as credenciais só na URL do clone.
    ENDERECO=$(echo "$GIT_REPO" | sed -E "s#^https://#https://${GIT_USER}:${GIT_TOKEN}@#")
  else
    ENDERECO="$GIT_REPO"
  fi
  git clone --depth 1 --branch "${GIT_BRANCH:-main}" "$ENDERECO" "$COMPILACAO"

  # O projeto pode estar numa subpasta do repositório.
  RAIZ="$COMPILACAO/${PROJECT_DIR:-}"
  RAIZ="${RAIZ%/}"
  if [ ! -f "$RAIZ/package.json" ]; then
    echo "ERRO: package.json não encontrado em ${RAIZ}"
    echo "Ajuste a variável PROJECT_DIR para a subpasta do projeto."
    exit 1
  fi
  cd "$RAIZ"

  echo "[3/5] Instalando dependências"
  # O cache do npm vai junto para o volume: /root/.npm fica na camada
  # gravável do contêiner, que também é apertada.
  export npm_config_cache="$COMPILACAO/.npm-cache"
  if [ -f package-lock.json ]; then
    npm ci --no-audit --no-fund
  else
    npm install --no-audit --no-fund
  fi

  echo "[4/5] Compilando"
  npm run build

  echo "[5/5] Publicando o build"
  rm -rf "$SERVIDOR/dist"
  cp -r dist "$SERVIDOR/dist"
  if [ -f deploy/server.mjs ]; then
    cp deploy/server.mjs "$SERVIDOR/server.mjs"
  fi

  # node_modules, cache e fontes já cumpriram seu papel. Sem isso, sobrariam
  # centenas de MiB no volume sem nenhum uso em produção.
  cd "$SERVIDOR"
  rm -rf "$COMPILACAO"
  echo "Área de compilação removida."
fi

# server.mjs vem do repositório quando existe; senão, é escrito aqui para o
# egg funcionar sozinho, sem depender de nada externo.
if [ ! -f "$SERVIDOR/server.mjs" ]; then
  echo "Escrevendo servidor estático embutido"
  cat > "$SERVIDOR/server.mjs" <<'FIM_DO_SERVIDOR'
__SERVIDOR__
FIM_DO_SERVIDOR
fi

# Modelos de uma etapa anterior do projeto que o app não carrega mais.
# Ocupam ~10 MiB no volume sem serem servidos a ninguém.
for ORFAO in musculos.glb ossos.glb tendoes.glb; do
  if [ -f "$SERVIDOR/dist/models/$ORFAO" ]; then
    rm -f "$SERVIDOR/dist/models/$ORFAO"
    echo "Removido modelo órfão: $ORFAO"
  fi
done
# Arquivo-fonte do Blender: não é usado pelo navegador.
rm -f "$SERVIDOR/dist/lessons/synovial.blend" 2>/dev/null || true

if [ -f "$SERVIDOR/dist/index.html" ]; then
  echo
  echo "Pronto. Conteúdo servido: $(du -sh "$SERVIDOR/dist" | cut -f1)"
else
  echo
  echo "ATENÇÃO: dist/index.html ainda não existe."
  echo "O servidor não vai subir enquanto você não enviar o build por SFTP."
fi
echo "=========================================="
