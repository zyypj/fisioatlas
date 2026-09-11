/** Reproducible CPU benchmark; does not create a browser/server or claim GPU FPS. */
import { readFile, writeFile } from 'node:fs/promises';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { attachSoftMotion } from '../src/features/viewer/softMotion';
import { pickableMeshes } from '../src/features/viewer/renderPerformance';

const manifest=JSON.parse(await readFile('public/models/manifest.json','utf8'));
const meshes:THREE.Mesh<THREE.BufferGeometry,THREE.MeshStandardMaterial>[]=[];
for(const asset of manifest){
  const bytes=await readFile('public'+asset.url);
  const doc=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'/models/');
  doc.scene.updateMatrixWorld(true);
  doc.scene.traverse(o=>{
    if(!(o instanceof THREE.Mesh))return;
    const geometry=o.geometry.clone();geometry.applyMatrix4(o.matrixWorld);
    const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({side:THREE.DoubleSide}));
    mesh.name=o.name;mesh.userData.kind=asset.kind;
    mesh.material.opacity=asset.kind==='musculos'?0.15:1;
    mesh.visible=true;
    if(asset.kind!=='ossos')mesh.userData.soft=attachSoftMotion(mesh);
    meshes.push(mesh);
  });
}
const raycaster=new THREE.Raycaster();
const rays=[[-0.075,0.44],[-0.2,1.1],[-0.09,0.09],[-0.17,1.35],[0.8,0.9],[0,1.5]];
function measure(legacy=false){
  const times:number[]=[];let hits=0;const selected:string[]=[];
  for(let round=0;round<3;round++)for(const [x,y] of rays){
    raycaster.set(new THREE.Vector3(x,y,3),new THREE.Vector3(0,0,-1));
    const start=performance.now();
    const results=raycaster.intersectObjects(legacy?meshes:pickableMeshes(meshes),false);
    selected.push(results.find(h=>(h.object as typeof meshes[number]).material.opacity>0.18)?.object.name||'');
    const ms=performance.now()-start;
    if(round)times.push(ms);
    hits+=results.length;
  }
  return {meanMs:times.reduce((a,b)=>a+b,0)/times.length,maxMs:Math.max(...times),hits,selected};
}
const after=measure();
// Restore the previous implementation's three costly behaviors, preserving
// the same meshes/rays: global spheres, all objects and per-vertex zero rotations.
for(const mesh of meshes){
  if(mesh.userData.kind==='ossos')continue;
  mesh.raycast=THREE.Mesh.prototype.raycast;
  mesh.geometry.boundingBox=null;
  mesh.geometry.boundingSphere=new THREE.Sphere(new THREE.Vector3(0,1,0),3);
  const q=new THREE.Quaternion(),axis=new THREE.Vector3(1,0,0),pivot=new THREE.Vector3();
  mesh.getVertexPosition=(i,target)=>{target.fromBufferAttribute(mesh.geometry.getAttribute('position'),i);q.setFromAxisAngle(axis,0);return target.sub(pivot).applyQuaternion(q).add(pivot);};
}
const before=measure(true);
const sameSelection=JSON.stringify(before.selected)===JSON.stringify(after.selected);
if(!sameSelection)throw new Error('Selection changed in the benchmark');
const result={scenario:'CPU picking, same 699 meshes and opacity settings, 6 rays, 1 warm-up + 2 measured rounds',before:{...before,selected:undefined},after:{...after,selected:undefined},sameSelection,speedup:before.meanMs/after.meanMs};
await writeFile('picking-benchmark.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
for(const mesh of meshes){mesh.geometry.dispose();mesh.material.dispose();}
