import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { AtlasApp } from "../src/App";
import { structures, byId, searchStructures, structurePath, regions } from "../src/data";
import { rigs, rigBounds, rigPivot, rigMoves, onAnimatedSide, weightHeight, chainRegions } from "../src/features/viewer/animationRigs";
import { movements } from "../src/data/movements";
import { sources } from "../src/data/sources";
import { parseStudy, emptyStudy } from "../src/services/studyStorage";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";
import * as THREE from "three";
import { attachSoftMotion, motionWeight } from "../src/features/viewer/softMotion";
import { activationStep, ligamentForce, muscleEquilibrium, nerveResponse, tendonForce, forceVelocity } from '../src/features/movements/biomechanics';
import { centerlineRig, deformedPathLength } from '../src/features/viewer/tissueRig';
import { pickableMeshes, fadeOpacity } from '../src/features/viewer/renderPerformance';

test("Catálogo: IDs únicos, cobertura, campos musculares e relações resolvidas", () => {
  assert.equal(new Set(structures.map((s) => s.id)).size, structures.length);
  assert.ok(structures.length >= 150);
  assert.ok(structures.filter((s) => s.kind === "musculos").length >= 60);
  for (const s of structures) {
    assert.ok(s.summary.length > 10, s.id);
    for (const id of s.related) assert.ok(byId[id], `${s.id} -> ${id}`);
    for (const source of s.sources)
      assert.ok(
        sources.find((r) => r.id === source),
        `${s.id}: ${source}`,
      );
    if (s.kind === "musculos")
      for (const key of [
        "Origem",
        "Inserção",
        "Inervação",
        "Ação",
        "Na prática",
      ])
        assert.ok(s.fields[key]?.length > 10, `${s.id}: ${key}`);
  }
  for (const m of movements) {
    assert.ok(byId[m.joint]);
    assert.ok(m.maxAngle !== 0);
    for (const id of [...m.agonists, ...m.antagonists])
      assert.equal(byId[id]?.kind, "musculos");
  }
});
test("Busca sem acentos, abreviações, sinônimos e filtros de região", () => {
  assert.equal(searchStructures("biceps braquial")[0].id, "biceps-braquial");
  assert.equal(searchStructures("femur")[0].id, "femur");
  assert.equal(searchStructures("LCA")[0].id, "ligamento-cruzado-anterior");
  assert.equal(searchStructures("Aquiles")[0].id, "tendao-calcaneo");
  assert.equal(searchStructures("supraespinhoso")[0].id, "supraespinal");
  assert.ok(
    searchStructures("", "musculos", "Ombro").every(
      (s) => s.region === "Ombro" && s.kind === "musculos",
    ),
  );
  assert.equal(searchStructures("estrutura inexistente xyz").length, 0);
});
test("Persistência: dados inválidos e parciais não quebram o estudo", () => {
  assert.deepEqual(parseStudy("{"), emptyStudy);
  assert.deepEqual(parseStudy(null), emptyStudy);
  const valid = {
    favorites: ["femur"],
    history: ["supraespinal"],
    searches: ["femur"],
    quiz: { correct: 2, total: 3 },
    cards: { femur: { correct: 1, wrong: 2 } },
    onboarded: true,
  };
  assert.deepEqual(parseStudy(JSON.stringify(valid)), valid);
  const malformed = parseStudy(
    JSON.stringify({
      favorites: [false, "femur", "femur"],
      history: null,
      quiz: { correct: 20, total: 3 },
      cards: { femur: { correct: -5, wrong: "x" } },
    }),
  );
  assert.deepEqual(malformed.favorites, ["femur"]);
  assert.equal(malformed.quiz.correct, 3);
  assert.deepEqual(malformed.cards.femur, { correct: 0, wrong: 0 });
});
test("Todas as fichas, movimentos e seções renderizam em suas rotas", () => {
  const routes = [
    ...structures.map((s) => ({ path: structurePath(s), text: s.name })),
    ...movements.map((m) => ({ path: "/movimentos/" + m.id, text: m.name })),
    ...[
      "atlas",
      "regioes",
      "quiz",
      "planos",
      "flashcards",
      "meus-estudos",
      "comparar",
      "fundamentos",
      "fontes",
    ].map((s) => ({ path: "/" + s, text: "" })),
  ];
  for (const route of routes) {
    const html = renderToString(
      <MemoryRouter initialEntries={[route.path]}>
        <AtlasApp />
      </MemoryRouter>,
    );
    assert.ok(html.includes("Fisio"), route.path);
    assert.ok(!html.includes("Vamos voltar ao atlas?"), route.path);
    if (route.text) assert.ok(html.includes(route.text), route.path);
  }
  const missing = renderToString(
    <MemoryRouter initialEntries={["/anatomia/ossos/nao-existe"]}>
      <AtlasApp />
    </MemoryRouter>,
  );
  assert.ok(missing.includes("Vamos voltar ao atlas?"));
  console.log(`${routes.length} rotas renderizadas sem erro.`);
});
test("GLB: decodificação Meshopt, geometria, nomes e tamanho do manifesto", async () => {
  const manifest = JSON.parse(
    await readFile("public/models/manifest.json", "utf8"),
  );
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ "meshopt.decoder": MeshoptDecoder });
  const actual = new Set<string>();
  const elements = new Set<string>();
  let count = 0,
    triangles = 0;
  for (const asset of manifest) {
    const file = "public" + asset.url;
    const bytes = await readFile(file);
    assert.equal(bytes.length, asset.bytes);
    const doc = await io.read(file);
    let systemMeshes = 0;
    for (const node of doc.getRoot().listNodes()) {
      const mesh = node.getMesh();
      if (!mesh) continue;
      const id = String(
        node.getExtras().structureId || node.getName().split("__")[0],
      );
      assert.ok(byId[id], node.getName());
      assert.equal(byId[id].kind, asset.kind);
      const element = String(node.getExtras().elementId);
      assert.ok(byId[id].modelIds.includes(element), node.getName());
      assert.ok(!elements.has(element), `Malha atribuída duas vezes: ${element}`);
      elements.add(element);
      assert.ok(mesh.listPrimitives().length > 0);
      systemMeshes++;
      actual.add(id);
      count++;
      for (const primitive of mesh.listPrimitives()) {
        const pos = primitive.getAttribute("POSITION")!,
          indices = primitive.getIndices()!;
        assert.ok(pos.getCount() > 2, node.getName());
        assert.ok(indices.getCount() >= 3);
        for (const i of indices.getArray()!)
          assert.ok(i < pos.getCount(), node.getName());
        triangles += indices.getCount() / 3;
      }
    }
    assert.equal(systemMeshes, asset.meshes);
  }
  for (const s of structures.filter((s) => s.modelIds.length))
    {assert.ok(actual.has(s.id), `Ficha anuncia malha inexistente: ${s.id}`);
    for(const element of s.modelIds) assert.ok(elements.has(element), element);}
  assert.deepEqual(manifest.map((x: {kind:string})=>x.kind).sort(),["articulacoes","ligamentos","musculos","nervos","ossos","tendoes"]);
  // A etapa de simplificação foi removida do pipeline a pedido, para privilegiar
  // a fidelidade das malhas no estudo: ela descartava 43% dos triângulos para
  // economizar 8,4 MiB. O peso subiu de 14,6 para cerca de 23 MiB, com
  // 3,43 milhões de triângulos em vez de 1,97 milhão. O modelo é carregado por
  // camada, sob demanda, e não de uma vez. O limite abaixo continua guardando o
  // orçamento, agora no novo patamar, e a contagem de malhas garante que ele não
  // seja respeitado às custas de conteúdo removido.
  assert.ok(count > 1400);
  assert.ok(triangles > 3_000_000, `triângulos: ${triangles}`);
  assert.ok(
    manifest.reduce((n: number, x: { bytes: number }) => n + x.bytes, 0) <
      26 * 1024 * 1024,
  );
  console.log(
    `${actual.size} estruturas, ${count} malhas, ${triangles} triângulos.`,
  );
});
test("Novas camadas: representação identificada e registro de cobertura consistente", async () => {
  const coverage = JSON.parse(await readFile("public/models/coverage.json", "utf8"));
  for(const s of structures){
    assert.deepEqual(coverage[s.id].modelIds,s.modelIds);
    if(s.modelIds.length){assert.equal(s.modelSource,"z-anatomy");assert.ok(s.modelComponents?.length);}
  }
  for(const id of ['ligamento-cruzado-anterior','ligamento-cruzado-posterior','menisco-medial','menisco-lateral','nervo-mediano','nervo-ciatico','glenoumeral','joelho']) assert.ok(byId[id].modelIds.length,id);
  assert.ok(byId['nervo-mediano'].modelIds.length>2,'Ramos do nervo mediano preservados');
  assert.ok(byId.joelho.modelNote?.includes('cápsula'));
});
test("Lição de articulação sinovial: oito componentes locais, sem dependências externas", async () => {
  const doc=await new NodeIO().registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({"meshopt.decoder": MeshoptDecoder})
    .read('public/lessons/synovial.glb');
  const names=doc.getRoot().listNodes().filter(n=>n.getMesh()).map(n=>n.getName());
  assert.equal(names.length,8);
  for(const prefix of ['Osso','Cartilagem','Capsula','Membrana','Ligamento'])assert.ok(names.some(n=>n.startsWith(prefix)),prefix);
  assert.equal(doc.getRoot().listTextures().length,0);
});

test("Tecidos: extremidade proximal preservada, distal acompanha rotação e repouso é reversível", () => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute([0,1.2,0, 0,1,0, 0,0.8,0],3));
  const mesh = new THREE.Mesh(geometry,new THREE.MeshStandardMaterial());
  const uniforms = attachSoftMotion(mesh);
  const weights = geometry.getAttribute('tissueWeight');
  for(let i=0;i<3;i++) weights.setX(i,motionWeight(geometry.getAttribute('position').getY(i),1));
  uniforms.tissuePivot.value.set(0,1,0);
  uniforms.tissueAngle.value = Math.PI/2;
  const p = new THREE.Vector3();
  assert.ok(mesh.getVertexPosition(0,p).distanceTo(new THREE.Vector3(0,1.2,0))<1e-6);
  assert.ok(mesh.getVertexPosition(2,p).distanceTo(new THREE.Vector3(0,1,-0.2))<1e-6);
  assert.equal(weights.getX(1),0.5);
  uniforms.tissueAngle.value = 0;
  assert.ok(mesh.getVertexPosition(2,p).distanceTo(new THREE.Vector3(0,0.8,0))<1e-6);
  assert.equal(geometry.getAttribute('position').getZ(2),0);
  geometry.dispose();mesh.material.dispose();
});

test("Ampliação: ligamentos, nervos e tendões adicionais possuem malhas, sem marcadores de inserção", () => {
  assert.ok(structures.filter(s=>s.kind==='ligamentos' && s.modelIds.length).length>=45);
  assert.ok(structures.filter(s=>s.kind==='nervos' && s.modelIds.length).length>=34);
  for(const id of ['tendao-do-extensor-longo-dos-dedos','tendao-intermediario-do-digastrico']) {
    assert.ok(byId[id].modelIds.length===2,id);
    assert.ok(byId[id].modelComponents?.every(n=>/\.[lr]$/.test(n)),id);
  }
  const html=renderToString(<MemoryRouter initialEntries={['/movimentos/flexao-do-cotovelo']}><AtlasApp /></MemoryRouter>);
  assert.ok(html.includes('Todos os tecidos disponíveis'));
  for(const kind of ['Ligamentos','Tendões','Nervos'])assert.ok(html.includes(`${kind} no movimento`));
});

test('Mecânica: ligamentos e tendões não empurram, mola é contínua e amortecimento só atua na tração',()=>{
  assert.equal(ligamentForce(-0.1,10),0);
  assert.equal(ligamentForce(0,10),0);
  assert.equal(tendonForce(-0.1,0.04),0);
  assert.equal(tendonForce(0.04,0.04),1);
  assert.ok(Math.abs(ligamentForce(0.06)-1)<1e-10);
  assert.ok(Math.abs(ligamentForce(0.06+1e-8)-ligamentForce(0.06-1e-8))<1e-5);
  assert.equal(ligamentForce(0.04,-2),ligamentForce(0.04,0));
  assert.ok(ligamentForce(0.04,2)>ligamentForce(0.04,0));
  assert.equal(ligamentForce(0.08,0,2),2*ligamentForce(0.08));
});

test('Mecânica: ativação em ângulo fixo encurta fibra e alonga tendão em equilíbrio',()=>{
  const resting=muscleEquilibrium(1,1,0,0.04);
  const active=muscleEquilibrium(1,1,1,0.04);
  assert.ok(active.fiberRatio<resting.fiberRatio);
  assert.ok(active.force>resting.force);
  assert.ok(active.tendonStrain>resting.tendonStrain);
  assert.ok(active.residual<1e-8);
  assert.ok(Math.abs(active.fiberRatio*0.7+0.3*(1+active.tendonStrain)-1)<1e-8);
  const compliant=muscleEquilibrium(1,1,1,0.08);
  assert.ok(compliant.fiberRatio<active.fiberRatio);
  assert.ok(compliant.tendonStrain>active.tendonStrain);
  assert.ok(forceVelocity(-0.5)<forceVelocity(0));
  assert.ok(forceVelocity(0.5)>forceVelocity(0));
});

test('Mecânica: extremos dos parâmetros permanecem finitos e o equilíbrio converge',()=>{
  for(const length of [0.2,0.5,0.7,1,1.3,2])for(const a of [0,0.5,1])for(const c of [0.01,0.04,0.1])for(const v of [-1,0,1]){
    const result=muscleEquilibrium(length,1,a,c,v);
    for(const value of Object.values(result))if(typeof value==='number')assert.ok(Number.isFinite(value));
    assert.ok(result.force>=0);
    assert.ok(result.tendonStrain>=0);
    if(!result.limited)assert.ok(result.residual<1e-7,JSON.stringify({length,a,c,v,result}));
  }
  const one=activationStep(0,0.8,0.1);
  let partitioned=0;for(let i=0;i<10;i++)partitioned=activationStep(partitioned,0.8,0.01);
  assert.ok(Math.abs(one-partitioned)<1e-12);
  assert.ok(one>0&&one<0.8);
  assert.ok(activationStep(0.8,0,0.1)>0);
});

test('Mecânica: reserva neural separa deslizamento de alongamento residual',()=>{
  assert.deepEqual(nerveResponse(0.5,0.5,0.008),{excursion:0,strain:0});
  const free=nerveResponse(0.504,0.5,0.008);
  assert.ok(Math.abs(free.excursion-0.002)<1e-10);assert.equal(free.strain,0);
  const restricted=nerveResponse(0.52,0.5,0.004);
  assert.equal(restricted.excursion,0.004);
  assert.ok(restricted.strain>nerveResponse(0.52,0.5,0.008).strain);
  assert.ok(nerveResponse(0.49,0.5,0.008).excursion<0);
  assert.equal(nerveResponse(0.49,0.5,0.008).strain,0);
});

test('Mecânica 3D: comprimento invariante à rotação rígida e ventre contrátil preserva extremidades',()=>{
  const pos=new THREE.Float32BufferAttribute([0.1,0,0,0.1,0.5,0,0.1,1,0],3);
  const rig=centerlineRig(pos);
  const axis=new THREE.Vector3(1,0,0),pivot=new THREE.Vector3(0,0,0);
  assert.ok(Math.abs(deformedPathLength(rig.points,rig.points.map(()=>1),pivot,axis,1.2)-rig.restLength)<1e-8);
  assert.ok(Math.abs(deformedPathLength(rig.points,rig.points.map((_,i)=>i/8),pivot,axis,0)-rig.restLength)<1e-8);
  const g=new THREE.BufferGeometry();g.setAttribute('position',pos);
  const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial());const u=attachSoftMotion(mesh);
  u.shapeEnabled.value=1;u.shapeOrigin.value.set(0,0,0);u.shapeDirection.value.set(0,1,0);u.shapeSpan.value=1;u.radialScale.value=1.2;u.fiberFraction.value=0.6;
  const p=new THREE.Vector3();
  assert.ok(mesh.getVertexPosition(0,p).distanceTo(new THREE.Vector3(0.1,0,0))<1e-7);
  assert.ok(mesh.getVertexPosition(2,p).distanceTo(new THREE.Vector3(0.1,1,0))<1e-7);
  assert.ok(Math.abs(mesh.getVertexPosition(1,p).x-0.12)<1e-7);
  u.shapeEnabled.value=0;
  assert.ok(Math.abs(mesh.getVertexPosition(1,p).x-0.1)<1e-7);
  g.dispose();mesh.material.dispose();
});

test('Desempenho: malhas ocultas não entram na seleção e transições terminam',()=>{
  const material=new THREE.MeshStandardMaterial();
  const g=new THREE.BufferGeometry();
  const visible=new THREE.Mesh(g,material);
  const hidden=new THREE.Mesh(g,material);hidden.visible=false;
  const transparent=new THREE.Mesh(g,material.clone());transparent.material.opacity=0.15;
  assert.deepEqual(pickableMeshes([visible,hidden,transparent]),[visible]);
  let opacity=1;for(let i=0;i<100;i++)opacity=fadeOpacity(opacity,0);
  assert.equal(opacity,0);
  for(let i=0;i<100;i++)opacity=fadeOpacity(opacity,1);
  assert.equal(opacity,1);
  assert.equal(fadeOpacity(0.35,0.35),0.35);
  material.dispose();transparent.material.dispose();g.dispose();
});

test('Seleção 3D: limites locais rejeitam espaço vazio e incluem tecidos deformados',()=>{
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute([-0.1,0.9,0,0.1,0.9,0,0,1.1,0],3));
  const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({side:THREE.DoubleSide}));
  const u=attachSoftMotion(mesh);
  const ray=new THREE.Raycaster(new THREE.Vector3(-1,0,3),new THREE.Vector3(0,0,-1));
  let visited=0;const get=mesh.getVertexPosition;
  mesh.getVertexPosition=(index,target)=>{visited++;return get(index,target);};
  assert.equal(ray.intersectObject(mesh).length,0);
  assert.equal(visited,0,'No triangle access when ray misses the local bound');
  u.tissueAxis.value.set(0,0,1);u.tissueAngle.value=Math.PI/2;
  for(let i=0;i<3;i++)g.getAttribute('tissueWeight').setX(i,1);
  assert.ok(ray.intersectObject(mesh).length>0,'Moved triangle stays selectable outside the rest box');
  const point=new THREE.Vector3();
  u.shapeEnabled.value=1;u.shapeSpan.value=0.2;u.shapeOrigin.value.set(0,1.1,0);u.fiberFraction.value=0.5;u.radialScale.value=1.4;u.neuralExcursion.value=0.008;
  u.updateBounds();
  for(let i=0;i<3;i++)assert.ok(g.boundingSphere!.containsPoint(mesh.getVertexPosition(i,point)));
  u.shapeEnabled.value=0;u.tissueAngle.value=0;u.updateBounds();
  assert.ok(g.boundingBox);assert.ok(g.boundingSphere!.radius<0.2);
  mesh.material.dispose();g.dispose();
});
test("Rigs de movimento: eixo resolvível, segmento distal não vazio e linha média incluída", async () => {
  const bounds = JSON.parse(
    await readFile("public/models/bounds.json", "utf8"),
  ) as Record<string, { id: string; min: number[]; max: number[] }>;
  // Reconstrói o que o motor recebe em tempo de execução: uma malha por
  // elemento exportado, com centro e limites reais do modelo.
  const meshes = Object.values(bounds).map((b) => ({
    userData: {
      structureId: b.id,
      center: new THREE.Vector3(
        (b.min[0] + b.max[0]) / 2,
        (b.min[1] + b.max[1]) / 2,
        (b.min[2] + b.max[2]) / 2,
      ),
      bounds: new THREE.Box3(
        new THREE.Vector3(...(b.min as [number, number, number])),
        new THREE.Vector3(...(b.max as [number, number, number])),
      ),
    },
  }));
  const usados = new Set(movements.map((m) => m.animation));
  for (const m of movements) {
    const rig = rigs[m.animation];
    assert.ok(rig, `Movimento sem rig: ${m.id}`);
    // O osso âncora precisa existir, ter malha e cair no lado animado.
    assert.ok(byId[rig.bone], `${m.id}: osso âncora inexistente ${rig.bone}`);
    const box = rigBounds(rig, meshes);
    assert.ok(box, `${m.id}: nenhuma malha de ${rig.bone} no lado animado`);
    assert.ok(box!.max.y > box!.min.y, `${m.id}: osso âncora sem altura`);
    const pivot = rigPivot(rig, box!);
    assert.ok(Number.isFinite(pivot.y), `${m.id}: pivô inválido`);
    // O segmento distal precisa conter pelo menos um osso que de fato se mova.
    const moved = meshes.filter(
      (x) =>
        onAnimatedSide(rig, x.userData.center.x) &&
        byId[x.userData.structureId]?.kind === "ossos" &&
        rigMoves(rig, x.userData.structureId, byId[x.userData.structureId].region),
    );
    assert.ok(moved.length > 0, `${m.id}: nenhum osso acompanha o movimento`);
    // Ligamentos citados como transarticulares precisam existir no catálogo.
    for (const id of rig.spanning)
      assert.ok(byId[id], `${m.id}: ligamento inexistente no rig: ${id}`);
    for (const id of [...(rig.include ?? []), ...(rig.exclude ?? [])])
      assert.ok(byId[id], `${m.id}: estrutura inexistente no rig: ${id}`);
    for (const region of rig.regions)
      assert.ok(regions.includes(region), `${m.id}: região inválida ${region}`);
    assert.ok(Math.hypot(...rig.axis) > 0, `${m.id}: eixo nulo`);
  }
  // Movimentos axiais movem os dois lados: separar um lado partiria a coluna,
  // porque as vértebras são malhas únicas centradas no plano mediano.
  for (const nome of ["spine", "cervical", "jaw"] as const)
    assert.ok(rigs[nome].bilateral, `${nome} deveria ser bilateral`);
  // As vértebras passaram a ter ficha individual; "vertebras-toracicas" virou
  // uma visão geral sem malha própria. T6 é a torácica típica e serve de
  // amostra da linha média.
  const vertebra = meshes.find((x) => x.userData.structureId === "vertebra-t6");
  assert.ok(vertebra, "Malha de vertebra-t6 não encontrada");
  assert.ok(Math.abs(vertebra.userData.center.x) < 0.02, "Vértebra fora da linha média");
  assert.ok(
    onAnimatedSide(rigs.cervical, vertebra.userData.center.x),
    "Estrutura da linha média precisa acompanhar o movimento axial",
  );
  assert.ok(usados.size >= 15, "Poucos rigs exercitados pelos movimentos");
  assert.ok(movements.length >= 35, "Catálogo de movimentos menor que o esperado");
});
test("Movimento não arrasta tecidos de regiões distantes da articulação", async () => {
  const bounds = JSON.parse(
    await readFile("public/models/bounds.json", "utf8"),
  ) as Record<string, { id: string; min: number[]; max: number[] }>;
  const meshes = Object.values(bounds).map((b) => ({
    userData: {
      structureId: b.id,
      center: new THREE.Vector3(
        (b.min[0] + b.max[0]) / 2,
        (b.min[1] + b.max[1]) / 2,
        (b.min[2] + b.max[2]) / 2,
      ),
      bounds: new THREE.Box3(
        new THREE.Vector3(...(b.min as [number, number, number])),
        new THREE.Vector3(...(b.max as [number, number, number])),
      ),
    },
  }));
  for (const m of movements) {
    const rig = rigs[m.animation];
    const pivot = rigPivot(rig, rigBounds(rig, meshes)!);
    // Reproduz a seleção de tecidos moles do motor e o peso de deformação.
    const arrastados = new Set<string>();
    for (const mesh of meshes) {
      const s = byId[mesh.userData.structureId];
      if (!s || s.kind === "ossos") continue;
      if (!onAnimatedSide(rig, mesh.userData.center.x)) continue;
      const inScope =
        rig.softScope === "movers"
          ? rig.include?.includes(s.id) || rig.spanning.includes(s.id)
          : chainRegions[rig.chain].includes(s.region);
      if (!(inScope || m.agonists.includes(s.id) || m.antagonists.includes(s.id)))
        continue;
      const y = weightHeight(rig, mesh.userData.center.y, pivot.y);
      if (motionWeight(y, pivot.y) > 0.5) arrastados.add(s.id);
    }
    assert.ok(arrastados.size > 0, `${m.id}: nenhum tecido acompanha o movimento`);
    // Toda estrutura deformada precisa estar na cadeia do rig ou ser um dos
    // músculos do próprio movimento. Foi essa checagem que faltou quando a
    // mandíbula girava o tronco e a pelve inteiros em torno de um pivô na cabeça.
    const permitidas = new Set([
      ...chainRegions[rig.chain],
      ...[...m.agonists, ...m.antagonists].map((id) => byId[id].region),
    ]);
    for (const id of arrastados) {
      const s = byId[id];
      const citada =
        m.agonists.includes(id) ||
        m.antagonists.includes(id) ||
        rig.spanning.includes(id) ||
        rig.include?.includes(id);
      assert.ok(
        citada || permitidas.has(s.region),
        `${m.id}: deforma ${id} (${s.region}), fora do escopo do movimento`,
      );
    }
    // Nenhum movimento da cabeça pode arrastar tecido do tronco ou dos membros
    // inferiores, exceto músculos que de fato cruzam o pescoço, como o trapézio
    // e o esternocleidomastóideo, citados no próprio movimento.
    if (rig.chain === "cervical" || rig.softScope === "movers")
      for (const id of arrastados) {
        const citadaNoMovimento =
          m.agonists.includes(id) ||
          m.antagonists.includes(id) ||
          rig.spanning.includes(id) ||
          rig.include?.includes(id);
        assert.ok(
          citadaNoMovimento ||
            !["Tronco", "Pelve", "Coxa", "Perna", "Pé"].includes(byId[id].region),
          `${m.id}: deforma ${id} em ${byId[id].region}, longe demais da articulação`,
        );
      }
  }
  // Movimentos axiais movem o segmento acima do pivô, não abaixo.
  for (const nome of ["spine", "spinerot", "spineinc", "cervical", "cervicalrot", "cervicalinc"] as const)
    assert.equal(rigs[nome].segment, "proximal", `${nome} deveria mover o segmento proximal`);
  assert.equal(rigs.jaw.softScope, "movers", "A mandíbula precisa de escopo restrito");
});
