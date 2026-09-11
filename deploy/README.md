# FisioAtlas no Pterodactyl

Egg pronto em [`fisioatlas.egg.json`](fisioatlas.egg.json).

O app é um site estático (Vite + React). O egg sobe um servidor Node sem
dependências, escrito em [`server.mjs`](server.mjs), que resolve o que um
servidor estático comum erraria aqui:

- **Fallback de SPA.** O app usa `BrowserRouter`. Sem fallback, abrir
  `151.244.40.191:1028/atlas` direto, ou apertar F5 em qualquer ficha, dá 404.
- **`model/gltf-binary`** nos `.glb`, senão o carregador do Three.js recusa.
- **gzip/brotli no texto.** O bundle cai de 1,2 MiB para 302 KiB.
- **Range**, para o navegador retomar o modelo de músculos, que tem 7 MiB.
- **Cache imutável** em `/assets/` (o Vite já põe hash no nome) e `no-cache`
  no `index.html`, para uma atualização aparecer na hora.

## Deixar no IP 151.244.40.191:1028

O egg não define IP nem porta — quem define é a alocação do painel. A porta
chega ao servidor pela variável `SERVER_PORT`, e o processo escuta em
`0.0.0.0`, então atende em qualquer IP do nó.

1. **Importar o egg.** Painel → *Admin* → *Nests* → *Import Egg* → envie
   `fisioatlas.egg.json`. Escolha um nest (serve o "Others").
2. **Criar a alocação.** *Admin* → *Nodes* → seu nó → aba *Allocation*.
   Em *IP Address* ponha `151.244.40.191` e em *Ports* ponha `1028`. Criar.
3. **Criar o servidor** com o egg *FisioAtlas 3D* e escolha essa alocação como
   *Primary Allocation*. Não precisa de alocação extra.
4. **Liberar a porta** no firewall do host:
   ```bash
   sudo ufw allow 1028/tcp
   ```
   Se o nó estiver atrás de NAT, redirecione a 1028 também no roteador.
5. **Imagem do Docker.** Em *Startup* → *Docker Image*, deixe **Node 20**
   (`ghcr.io/pterodactyl/yolks:nodejs_20`). Não existe `nodejs_22` no yolks: o
   repositório do Pterodactyl vai até o `nodejs_20` e o do parkervcp até o
   `nodejs_21`. Pedir uma tag inexistente faz o pull falhar na hora de subir.
6. **Iniciar.** O console deve terminar com:
   ```
   [FisioAtlas] escutando em 0.0.0.0:1028
   [FisioAtlas] pronto
   ```

Depois é só abrir `http://151.244.40.191:1028`.

Se ainda não houver build lá, o servidor sobe assim mesmo e a página explica o
que falta, em vez de cair em erro. Isso é de propósito: um servidor que morre
faz o painel marcar *crashed* e esconder o motivo real, que é só arquivo
faltando. Assim que o `dist/` chegar, basta atualizar a página — não precisa
reiniciar.

## Duas formas de colocar o build lá

### A) Sem repositório — enviar o build pronto

É o caminho mais rápido, e funciona hoje, já que o projeto ainda não está em
nenhum Git. Deixe a variável **Repositório Git** em branco.

```bash
npm run build
```

Depois envie o conteúdo de `dist/` para a pasta `dist/` do servidor, por SFTP
(o painel mostra host, porta e usuário na aba *Settings*). A cada nova versão,
reenvie e reinicie.

### B) Com repositório — compila sozinho

Preencha **Repositório Git** com a URL. Se o `package.json` não estiver na raiz
do repositório, preencha **Subpasta do projeto** (no seu caso, provavelmente
`fisioatlas`). Para repositório privado, preencha usuário e token.

A instalação clona, roda `npm ci`, compila e publica só o `dist/`, apagando a
área de compilação no final. O volume fica com **17 MiB**: `dist/` e
`server.mjs`.

A compilação acontece numa pasta `.build` dentro do próprio volume do servidor,
e **não em `/tmp`**. O Wings monta o `/tmp` do contêiner instalador como tmpfs
de 100 MiB por padrão (`docker.tmpfs_size` no `config.yml` do Wings), e o
`node_modules` deste projeto precisa de ~246 MiB. Compilar em `/tmp` dá
`ENOSPC` mesmo com dezenas de GB livres na VPS, porque o tmpfs não enxerga o
disco — ele vive na RAM.

Reinstalar (*Settings* → *Reinstall Server*) puxa a versão mais nova.

## Testado onde vai rodar

A instalação e a execução foram verificadas nos contêineres reais, com o mesmo
limite de tmpfs que o Wings aplica:

```
docker run --tmpfs /tmp:size=100m -v volume:/mnt/server   --entrypoint bash node:22-bookworm-slim /mnt/install/install.sh
docker run -v volume:/home/container -e SERVER_PORT=1028   --entrypoint sh ghcr.io/pterodactyl/yolks:nodejs_20 -c "node server.mjs"
```

Resultado: build completo, volume com 17 MiB, e `/`, `/atlas`,
`/movimentos/flexao-de-tronco` e `/anatomia/musculos/diafragma` respondendo 200,
com os modelos em `model/gltf-binary`.

## Peso

| | |
|---|---|
| `dist/` como sai do build | 27,6 MiB |
| removido na instalação | 10,8 MiB |
| efetivamente servido | **16,9 MiB** |

Os 10,8 MiB removidos são `musculos.glb`, `ossos.glb` e `tendoes.glb` — sobras
do pipeline BodyParts3D anterior, que o app não carrega mais desde a migração
para os `z-*.glb` — mais o `synovial.blend`, que é arquivo-fonte do Blender e
não serve para o navegador. Nada disso é referenciado pelo código; conferi. Se
quiser, dá para apagá-los de `public/models/` de vez e o egg nem precisa podar.

E os 16,9 MiB não são baixados de uma vez: o app carrega os modelos por camada,
conforme você liga ossos, músculos, ligamentos e assim por diante.

## Variáveis do egg

| Variável | Padrão | Para quê |
|---|---|---|
| `GIT_REPO` | vazio | URL do repositório. Vazio = modo SFTP |
| `GIT_BRANCH` | `main` | Branch a clonar |
| `PROJECT_DIR` | vazio | Subpasta do projeto dentro do repositório |
| `GIT_USER` | vazio | Só para repositório privado |
| `GIT_TOKEN` | vazio | Só para repositório privado |
| `WEB_ROOT` | `dist` | Pasta servida |

## Rodar o servidor local, igual ao da produção

```bash
SERVER_PORT=8099 node deploy/server.mjs
```

## Regerar o egg

O `server.mjs` fica embutido dentro do script de instalação, para o egg não
depender de nada externo. Depois de mexer em `deploy/server.mjs` ou
`deploy/install.sh`, rode:

```bash
python scripts/make_egg.py --verificar
```

O gerador confere que o JSON é válido, que o servidor embutido bate byte a byte
com o arquivo real e — com `--verificar` — que toda imagem citada existe mesmo
no registro. Vale usar a flag antes de publicar: um egg com tag inexistente
importa sem reclamar e só falha quando alguém tenta subir o servidor.

## Se não abrir

| Sintoma | Provável causa |
|---|---|
| `failed to pull ... not found` ao iniciar | Imagem inexistente. Use **Node 20**; não há `nodejs_22` no yolks |
| Página diz "ainda não há site para servir" | `dist/` vazio: envie o build por SFTP ou configure `GIT_REPO` |
| Abre a home, mas F5 em `/atlas` dá 404 | Não é este servidor; algum proxy na frente sem fallback de SPA |
| Corpo 3D não aparece, console do navegador reclama de MIME | Idem: proxy servindo `.glb` como `application/octet-stream` |
| `ENOSPC: no space left on device` durante `npm ci` | Compilação caindo em `/tmp`, que é tmpfs de 100 MiB. Esta versão do egg compila no volume; se persistir, aumente `docker.tmpfs_size` no Wings |
| Nada responde de fora, mas `/healthz` responde no host | Firewall ou NAT bloqueando a 1028 |
