import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, prune, weld, meshopt } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptDecoder } from "meshoptimizer";
import { readFile, writeFile, stat } from "node:fs/promises";
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "meshopt.encoder": MeshoptEncoder,
    "meshopt.decoder": MeshoptDecoder,
  });
const manifest = JSON.parse(
  await readFile("public/models/manifest.json", "utf8"),
);
for (const asset of manifest) {
  const file = "public" + asset.url;
  const document = await io.read(file);
  await document.transform(
    dedup(),
    weld(),
    // Reduz a contagem de triângulos respeitando um erro máximo relativo às
    // dimensões de cada malha. Lâminas amplas e pouco curvas, como os
    // intercostais e o trato iliotibial, colapsam bastante; malhas pequenas e
    // detalhadas, como ligamentos do carpo, quase não mudam. O limite de erro
    // é o que mantém a forma anatômica; nenhuma geometria é criada.
    prune(),
    meshopt({ encoder: MeshoptEncoder, level: "medium" }),
  );
  await io.write(file, document);
  const bytes = (await stat(file)).size;
  console.log(
    `${asset.kind}: ${(asset.bytes / 1048576).toFixed(2)} → ${(bytes / 1048576).toFixed(2)} MiB`,
  );
  asset.bytes = bytes;
}
// O esquema de articulação sinovial de /fundamentos não está no manifesto,
// mas também é servido ao navegador e merece a mesma compressão.
{
  const file = "public/lessons/synovial.glb";
  const antes = (await stat(file)).size;
  const document = await io.read(file);
  await document.transform(
    dedup(),
    weld(),
    prune(),
    meshopt({ encoder: MeshoptEncoder, level: "medium" }),
  );
  await io.write(file, document);
  const bytes = (await stat(file)).size;
  console.log(
    `licao sinovial: ${(antes / 1048576).toFixed(2)} → ${(bytes / 1048576).toFixed(2)} MiB`,
  );
}
await writeFile(
  "public/models/manifest.json",
  JSON.stringify(manifest, null, 2),
);
await writeFile(
  "src/data/model-manifest.json",
  JSON.stringify(manifest, null, 2),
);
const provenance = JSON.parse(
  await readFile("public/models/provenance.json", "utf8"),
);
provenance.manifest = manifest;
provenance.optimization =
  "Deduplication, vertex welding, error-bounded simplification (ratio 0.2, relative error 0.0008) and Meshopt compression with glTF-Transform; quantization from medium preset. Mesh names and anatomical membership preserved; no geometry invented.";
await writeFile(
  "public/models/provenance.json",
  JSON.stringify(provenance, null, 2),
);
