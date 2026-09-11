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
    if (!extname(arquivo) && existsSync(index))
      return enviar(req, res, index, 200, "no-cache");

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Não encontrado");
  } catch (erro) {
    console.error("[erro]", req.url, erro.message);
    if (!res.headersSent) res.writeHead(500);
    res.end("Erro interno");
  }
});

if (!existsSync(join(RAIZ, "index.html"))) {
  console.error(`[FisioAtlas] index.html não encontrado em ${RAIZ}`);
  console.error("[FisioAtlas] Envie a pasta dist/ por SFTP ou rode a instalação com GIT_REPO.");
  process.exit(1);
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
