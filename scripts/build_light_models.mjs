import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { weld, simplify, prune, meshopt } from "@gltf-transform/functions";
import {
  MeshoptEncoder,
  MeshoptDecoder,
  MeshoptSimplifier,
} from "meshoptimizer";
import { readFile, writeFile, stat } from "node:fs/promises";

// Precompute LODs on the workstation. Tablets never run mesh simplification,
// download the detailed meshes, or keep two copies of the atlas in memory.
await Promise.all([
  MeshoptEncoder.ready,
  MeshoptDecoder.ready,
  MeshoptSimplifier.ready,
]);
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "meshopt.encoder": MeshoptEncoder,
    "meshopt.decoder": MeshoptDecoder,
  });
const manifest = JSON.parse(
  await readFile("public/models/manifest.json", "utf8"),
);
const light = [];
const report = [];
function inventory(document) {
  return document
    .getRoot()
    .listNodes()
    .filter((node) => node.getMesh())
    .map((node) => ({
      name: node.getName(),
      id: node.getExtras().structureId,
      triangles: node
        .getMesh()
        .listPrimitives()
        .reduce((sum, p) => sum + p.getIndices().getCount() / 3, 0),
    }));
}
for (const asset of manifest) {
  const document = await io.read("public" + asset.url);
  const before = inventory(document);
  await document.transform(
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.18, error: 0.004 }),
    prune({ keepLeaves: true }),
    meshopt({ encoder: MeshoptEncoder, level: "medium" }),
  );
  const after = inventory(document);
  if (
    JSON.stringify(before.map((n) => [n.name, n.id])) !==
      JSON.stringify(after.map((n) => [n.name, n.id])) ||
    after.some((n) => n.triangles < 1)
  ) {
    throw new Error(
      "Simplification lost an anatomical component: " + asset.kind,
    );
  }
  const url = asset.url.replace(".glb", "-light.glb");
  await io.write("public" + url, document);
  const bytes = (await stat("public" + url)).size;
  light.push({ ...asset, url, bytes });
  const sum = (nodes) => nodes.reduce((total, n) => total + n.triangles, 0);
  report.push({
    kind: asset.kind,
    components: after.length,
    trianglesBefore: sum(before),
    trianglesAfter: sum(after),
    bytesBefore: asset.bytes,
    bytesAfter: bytes,
  });
  console.log(
    `${asset.kind}: ${sum(before)} → ${sum(after)} triangles; ${asset.bytes} → ${bytes} bytes`,
  );
}
await writeFile(
  "public/models/manifest-light.json",
  JSON.stringify(light, null, 2) + "\n",
);
await writeFile(
  "public/models/light-report.json",
  JSON.stringify(
    {
      method:
        "Meshopt simplification, target ratio 0.18, relative error limit 0.004 of each mesh radius. Original component names and structure IDs retained. Detailed models unchanged.",
      systems: report,
    },
    null,
    2,
  ) + "\n",
);
