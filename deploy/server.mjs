/**
 * Servidor estático do FisioAtlas, sem dependências além do Node.
 *
 * O app usa BrowserRouter, então qualquer rota que não seja arquivo precisa
 * devolver o index.html; sem isso, abrir /atlas direto ou apertar F5 dá 404.
 *
 * Uso local:      node deploy/server.mjs
 * No Pterodactyl: node server.mjs   (a porta vem de SERVER_PORT)
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { createBrotliCompress, createGzip, constants as zlib } from "node:zlib";

const RAIZ = resolve(process.env.WEB_ROOT || "dist");
const PORTA = Number(process.env.SERVER_PORT || process.env.PORT || 8080);
const HOST = process.env.SERVER_HOST || "0.0.0.0";

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
  ".blend": "application/octet-stream",
};
// Só vale comprimir texto. Os .glb já saem comprimidos com Meshopt: passar
// gzip neles gasta CPU e devolve quase nada.
const COMPRIMIVEL = /^(text\/|application\/(json|wasm)|image\/svg)/;

function tipoDe(caminho) {
  return TIPOS[extname(caminho).toLowerCase()] || "application/octet-stream";
}

function cacheDe(url) {
  // Vite põe hash no nome dos arquivos de /assets: podem ser cacheados para sempre.
  if (url.startsWith("/assets/")) return "public, max-age=31536000, immutable";
  if (url.startsWith("/models/") || url.startsWith("/lessons/"))
    return "public, max-age=86400";
  return "no-cache";
}

/** Resolve a URL para um arquivo dentro da raiz, barrando travessia de diretório. */
function resolverArquivo(url) {
  let caminho;
  try {
    caminho = decodeURIComponent(new URL(url, "http://x").pathname);
  } catch {
    return null;
  }
  if (caminho.endsWith("/")) caminho += "index.html";
  const destino = resolve(join(RAIZ, caminho));
  if (destino !== RAIZ && !destino.startsWith(RAIZ + sep)) return null;
  return destino;
}

function enviar(req, res, arquivo, status, cache) {
  const info = statSync(arquivo);
  const tipo = tipoDe(arquivo);
  const etag = `W/"${info.size}-${Number(info.mtimeMs).toString(36)}"`;
  const base = {
    "Content-Type": tipo,
    "Cache-Control": cache,
    ETag: etag,
    "Last-Modified": info.mtime.toUTCString(),
    "X-Content-Type-Options": "nosniff",
  };

  if (req.headers["if-none-match"] === etag) {
    res.writeHead(304, base);
    return res.end();
  }

  // Range: permite ao navegador retomar os modelos grandes.
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
  if (range && status === 200) {
    const inicio = range[1] ? Number(range[1]) : 0;
    const fim = range[2] ? Number(range[2]) : info.size - 1;
    if (inicio > fim || fim >= info.size) {
      res.writeHead(416, { "Content-Range": `bytes */${info.size}` });
      return res.end();
    }
    res.writeHead(206, {
      ...base,
      "Content-Range": `bytes ${inicio}-${fim}/${info.size}`,
      "Content-Length": fim - inicio + 1,
      "Accept-Ranges": "bytes",
    });
    if (req.method === "HEAD") return res.end();
    return createReadStream(arquivo, { start: inicio, end: fim }).pipe(res);
  }

  const aceita = req.headers["accept-encoding"] || "";
  const comprimir = COMPRIMIVEL.test(tipo) && info.size > 1024;
  const codec =
    comprimir && /\bbr\b/.test(aceita)
      ? ["br", () => createBrotliCompress({ params: { [zlib.BROTLI_PARAM_QUALITY]: 5 } })]
      : comprimir && /\bgzip\b/.test(aceita)
        ? ["gzip", () => createGzip({ level: 6 })]
        : null;

  if (codec) {
    res.writeHead(status, {
      ...base,
      "Content-Encoding": codec[0],
      Vary: "Accept-Encoding",
    });
    if (req.method === "HEAD") return res.end();
    return createReadStream(arquivo).pipe(codec[1]()).pipe(res);
  }

  res.writeHead(status, { ...base, "Content-Length": info.size, "Accept-Ranges": "bytes" });
  if (req.method === "HEAD") return res.end();
  return createReadStream(arquivo).pipe(res);
}

/** Página mostrada enquanto dist/ ainda não tem o build.
 *
 *  Sair com erro aqui faria o painel marcar o servidor como "crashed" e
 *  esconder o motivo real, que é só falta de arquivo. Melhor subir e explicar. */
function paginaSemBuild() {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>FisioAtlas — aguardando o build</title>
<style>
 :root{color-scheme:light dark}
 body{margin:0;min-height:100vh;display:grid;place-items:center;
      font:16px/1.6 system-ui,-apple-system,Segoe UI,sans-serif;
      background:#f7f7f5;color:#22201d}
 @media(prefers-color-scheme:dark){body{background:#17171a;color:#e9e6e1}}
 main{max-width:44rem;padding:2rem}
 h1{font-size:1.5rem;margin:0 0 .5rem}
 p{margin:.75rem 0}
 code{background:rgba(128,128,128,.18);padding:.15em .4em;border-radius:.25rem}
 pre{background:rgba(128,128,128,.14);padding:1rem;border-radius:.5rem;overflow-x:auto}
 ol{padding-left:1.25rem}
</style></head><body><main>
<h1>O servidor está no ar, mas ainda não há site para servir</h1>
<p>O FisioAtlas está rodando e escutando nesta porta. Falta o conteúdo
compilado: não encontrei <code>index.html</code> em <code>${RAIZ}</code>.</p>
<p>Para resolver, escolha um caminho:</p>
<ol>
<li><strong>Enviar o build pronto.</strong> Na sua máquina, rode
<pre>npm run build</pre>
e envie o conteúdo da pasta <code>dist/</code> para a pasta <code>dist/</code>
deste servidor, por SFTP.</li>
<li><strong>Compilar aqui.</strong> Preencha a variável
<code>GIT_REPO</code> nas configurações do servidor e reinstale.</li>
</ol>
<p>Assim que os arquivos chegarem, basta atualizar esta página: o servidor
passa a servir o atlas sem precisar reiniciar.</p>
</main></body></html>`;
}

const servidor = createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    return res.end("Método não permitido");
  }
  if (req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("ok");
  }

  const arquivo = resolverArquivo(req.url);
  if (!arquivo) {
    res.writeHead(400);
    return res.end("Caminho inválido");
  }

  try {
    if (existsSync(arquivo) && statSync(arquivo).isFile())
      return enviar(req, res, arquivo, 200, cacheDe(new URL(req.url, "http://x").pathname));

    // Rota do BrowserRouter: devolve o index.html para o React resolver.
    // Arquivo com extensão que não existe é 404 de verdade, não rota.
    const index = join(RAIZ, "index.html");
    const temBuild = existsSync(index);
    // "/" já virou "/index.html" no resolverArquivo e por isso tem extensão:
    // sem contar esse caso, a raiz do site cairia no 404 em vez da rota.
    const querDocumento = !extname(arquivo) || arquivo === index;
    if (querDocumento && temBuild)
      return enviar(req, res, index, 200, "no-cache");

    // Sem build ainda: explica o que falta em vez de devolver um 404 seco.
    // A checagem é por requisição, então o site aparece assim que o dist/
    // chegar, sem reiniciar.
    if (!temBuild && querDocumento) {
      const corpo = paginaSemBuild();
      res.writeHead(503, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Retry-After": "30",
      });
      return res.end(req.method === "HEAD" ? undefined : corpo);
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Não encontrado");
  } catch (erro) {
    console.error("[erro]", req.url, erro.message);
    if (!res.headersSent) res.writeHead(500);
    res.end("Erro interno");
  }
});

if (!existsSync(join(RAIZ, "index.html"))) {
  console.warn(`[FisioAtlas] ATENÇÃO: index.html não encontrado em ${RAIZ}`);
  console.warn("[FisioAtlas] Envie a pasta dist/ por SFTP ou reinstale com GIT_REPO preenchido.");
  console.warn("[FisioAtlas] O servidor vai subir e mostrar uma página explicando isso.");
}

servidor.listen(PORTA, HOST, () => {
  console.log(`[FisioAtlas] servindo ${RAIZ}`);
  console.log(`[FisioAtlas] escutando em ${HOST}:${PORTA}`);
  console.log("[FisioAtlas] pronto");
});

for (const sinal of ["SIGINT", "SIGTERM"])
  process.on(sinal, () => {
    console.log(`[FisioAtlas] recebido ${sinal}, encerrando`);
    servidor.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  });
