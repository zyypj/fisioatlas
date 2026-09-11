import * as THREE from 'three';

/** Principal-axis bins approximate a centerline; no anatomical insertions inferred. */
export function centerlineRig(positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute) {
  const mean = new THREE.Vector3(), p = new THREE.Vector3();
  for (let i=0;i<positions.count;i++) mean.add(p.fromBufferAttribute(positions,i));
  mean.divideScalar(positions.count);
  const covariance = new Float64Array(9);
  for (let i=0;i<positions.count;i++) {
    p.fromBufferAttribute(positions,i).sub(mean);
    const v=[p.x,p.y,p.z];
    for(let a=0;a<3;a++)for(let b=0;b<3;b++)covariance[a*3+b]+=v[a]*v[b];
  }
  // Seed along the greatest variance to avoid orthogonality with the main axis.
  const largest = [covariance[0],covariance[4],covariance[8]].indexOf(Math.max(covariance[0],covariance[4],covariance[8]));
  const direction = new THREE.Vector3().setComponent(largest,1);
  for(let n=0;n<16;n++) {
    const {x,y,z}=direction;
    direction.set(covariance[0]*x+covariance[1]*y+covariance[2]*z,covariance[3]*x+covariance[4]*y+covariance[5]*z,covariance[6]*x+covariance[7]*y+covariance[8]*z).normalize();
  }
  if(direction.y>0)direction.negate();
  let min=Infinity,max=-Infinity;
  for(let i=0;i<positions.count;i++){const t=p.fromBufferAttribute(positions,i).sub(mean).dot(direction);min=Math.min(min,t);max=Math.max(max,t);}
  const span=Math.max(1e-5,max-min),origin=mean.clone().addScaledVector(direction,min);
  const bins=Array.from({length:9},()=>({sum:new THREE.Vector3(),count:0}));
  for(let i=0;i<positions.count;i++){
    p.fromBufferAttribute(positions,i);
    const t=p.clone().sub(origin).dot(direction)/span;
    const bin=bins[Math.min(8,Math.max(0,Math.floor(t*9)))];bin.sum.add(p);bin.count++;
  }
  const points=bins.map((b,i)=>b.count?b.sum.divideScalar(b.count):origin.clone().addScaledVector(direction,span*(i+0.5)/9));
  const restLength=points.slice(1).reduce((length,point,i)=>length+point.distanceTo(points[i]),0);
  return { origin,direction,span,points,restLength:Math.max(1e-5,restLength) };
}

export function deformedPathLength(points: THREE.Vector3[], weights: number[], pivot: THREE.Vector3, axis: THREE.Vector3, angle: number) {
  const q=new THREE.Quaternion(),p=new THREE.Vector3(),previous=new THREE.Vector3();
  let length=0;
  points.forEach((point,i)=>{
    q.setFromAxisAngle(axis,angle*weights[i]);
    p.copy(point).sub(pivot).applyQuaternion(q).add(pivot);
    if(i)length+=previous.distanceTo(p);previous.copy(p);
  });
  return length;
}
