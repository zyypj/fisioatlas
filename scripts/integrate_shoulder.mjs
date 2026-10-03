/** Integrate the settled Higgsfield GLB into the six existing atlas layers.
 * Geometry is baked into the atlas frame; context bones/cameras/lights are omitted.
 * Re-running replaces the complements, never duplicates them.
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import {
  copyToDocument,
  dedup,
  prune,
  weld,
  meshopt,
} from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";
import { readFile, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Vector3, Matrix4, Matrix3 } from "three";

await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });
const load = async (p) => JSON.parse(await readFile(p, "utf8"));
const save = async (p, v) => writeFile(p, JSON.stringify(v, null, 2) + "\n");
const catalog = await load("src/data/structures.json"),
  byId = Object.fromEntries(catalog.map((s) => [s.id, s]));
const shoulder = await load("src/data/shoulder.json"),
  ids = new Set(shoulder.generated);
const manifest = await load("public/models/manifest.json"),
  coverage = await load("public/models/coverage.json"),
  bounds = await load("public/models/bounds.json");
const sourcePath = "public/models/shoulder-higgsfield-source.glb",
  source = await io.read(sourcePath);
const sourceNodes = source
  .getRoot()
  .listNodes()
  .filter((n) =>
    ids.has(n.getExtras().structureId || n.getName().split("__")[0]),
  );
if (sourceNodes.length !== ids.size)
  throw new Error(
    `Expected ${ids.size} complements, got ${sourceNodes.length}`,
  );
for (const s of catalog.filter((s) => ids.has(s.id))) {
  for (const eid of s.modelIds) delete bounds[eid];
  s.modelIds = [];
  s.modelComponents = [];
  s.modelSource = "higgsfield-shoulder";
  s.modelNote =
    s.fields["Estudo 3D"] ||
    "Complemento topográfico didático criado no Higgsfield, sem segmentação anatômica. Lado esquerdo espelhado do direito.";
  s.modelNote += " Lado esquerdo espelhado do direito.";
}
for (const asset of manifest) {
  const needed = sourceNodes.filter(
    (n) =>
      byId[n.getExtras().structureId || n.getName().split("__")[0]].kind ===
      asset.kind,
  );
  if (!needed.length) continue;
  const doc = await io.read("public" + asset.url),
    scene = doc.getRoot().listScenes()[0];
  for (const n of [...doc.getRoot().listNodes()])
    if (ids.has(n.getExtras().structureId || n.getName().split("__")[0]))
      n.dispose();
  for (const original of needed) {
    const sid =
        original.getExtras().structureId || original.getName().split("__")[0],
      entry = byId[sid];
    for (const side of ["r", "l"]) {
      // Copy only mesh data. Bake the source world transform, then mirror X for the left.
      const map = copyToDocument(doc, source, [original.getMesh()]),
        mesh = map.get(original.getMesh());
      const transform = new Matrix4().fromArray(original.getWorldMatrix());
      if (side === "l")
        transform.premultiply(new Matrix4().makeScale(-1, 1, 1));
      const normalTransform = new Matrix3().getNormalMatrix(transform);
      const min = [Infinity, Infinity, Infinity],
        max = [-Infinity, -Infinity, -Infinity];
      for (const p of mesh.listPrimitives()) {
        const position = p.getAttribute("POSITION"),
          normal = p.getAttribute("NORMAL");
        const data = new Float32Array(position.getCount() * 3),
          normals = normal ? new Float32Array(normal.getCount() * 3) : null;
        for (let i = 0; i < position.getCount(); i++) {
          const v = new Vector3()
            .fromArray(position.getElement(i, []))
            .applyMatrix4(transform);
          v.toArray(data, i * 3);
          for (let k = 0; k < 3; k++) {
            min[k] = Math.min(min[k], data[i * 3 + k]);
            max[k] = Math.max(max[k], data[i * 3 + k]);
          }
          if (normal)
            new Vector3()
              .fromArray(normal.getElement(i, []))
              .applyNormalMatrix(normalTransform)
              .toArray(normals, i * 3);
        }
        const buffer = doc.getRoot().listBuffers()[0];
        p.setAttribute(
          "POSITION",
          doc.createAccessor().setBuffer(buffer).setType("VEC3").setArray(data),
        );
        if (normals)
          p.setAttribute(
            "NORMAL",
            doc
              .createAccessor()
              .setBuffer(buffer)
              .setType("VEC3")
              .setArray(normals),
          );
        if (transform.determinant() < 0) {
          const a = new Uint32Array(p.getIndices().getArray());
          for (let i = 0; i < a.length; i += 3)
            [a[i + 1], a[i + 2]] = [a[i + 2], a[i + 1]];
          p.setIndices(
            doc
              .createAccessor()
              .setBuffer(buffer)
              .setType("SCALAR")
              .setArray(a),
          );
        }
      }
      const eid = `HG-${sid}-${side}`,
        name = sid + "__" + eid;
      mesh.setName(name);
      const node = doc
        .createNode(name)
        .setMesh(mesh)
        .setExtras({
          structureId: sid,
          elementId: eid,
          sourceObject: original.getName() + "." + side,
          source: "Higgsfield 3D Jutsu",
          representation: "didactic approximation",
        });
      scene.addChild(node);
      entry.modelIds.push(eid);
      entry.modelComponents.push(
        "Complemento didático: " + entry.name + "." + side,
      );
      bounds[eid] = {
        id: sid,
        min,
        max,
        sourceObject: original.getName(),
        representation: "didactic approximation",
      };
    }
  }
  await doc.transform(
    dedup(),
    weld(),
    prune(),
    meshopt({ encoder: MeshoptEncoder, level: "medium" }),
  );
  await io.write("public" + asset.url, doc);
  asset.bytes = (await stat("public" + asset.url)).size;
  asset.meshes = doc
    .getRoot()
    .listNodes()
    .filter((n) => n.getMesh()).length;
}
for (const s of catalog) {
  if (!ids.has(s.id)) {
    delete coverage[s.id].source;
    delete coverage[s.id].representation;
    continue;
  }
  coverage[s.id] = {
    name: s.name,
    kind: s.kind,
    sourceObjects: s.modelComponents || [],
    modelIds: s.modelIds,
    source: s.modelSource || null,
    representation: "didactic approximation",
  };
}
const provenance = await load("public/models/provenance.json");
provenance.manifest = manifest;
provenance.shoulder = {
  projectId: "b80fd313-010f-4c2c-bd02-95f9d13b5ffe",
  revision: 2,
  created: "2026-10-03",
  sourceFile: sourcePath,
  sha256: createHash("sha256")
    .update(await readFile(sourcePath))
    .digest("hex"),
  script: "scripts/higgsfield_shoulder.py",
  integration: "scripts/integrate_shoulder.mjs",
  structures: [...ids],
  representation:
    "15 approximate topographic complements; no patient segmentation. Right geometry mirrored for left. Context bones omitted. Metre scale; glTF Y-up frame matches Z-Anatomy atlas.",
};
provenance.unmapped = catalog
  .filter((s) => !s.modelIds.length)
  .map((s) => [s.name, s.english]);
await save("src/data/structures.json", catalog);
await save("public/models/coverage.json", coverage);
await writeFile("public/models/bounds.json", JSON.stringify(bounds));
await save("public/models/manifest.json", manifest);
await save("src/data/model-manifest.json", manifest);
await save("public/models/provenance.json", provenance);
console.log(
  `Integrated ${ids.size} Higgsfield complements, bilateral. ${shoulder.groups.flatMap((g) => g.ids).filter((id) => byId[id].modelIds.length).length}/${shoulder.groups.flatMap((g) => g.ids).length} module entries with 3D.`,
);
