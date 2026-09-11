import * as THREE from "three";

// Prescribed joint rig plus model-driven muscle belly reshaping / neural excursion.
// Centerlines are geometric estimates; these are not validated insertion sites.
export function motionWeight(y: number, pivotY: number, width = 0.08) {
  const t = THREE.MathUtils.clamp((pivotY + width / 2 - y) / width, 0, 1);
  return t * t * (3 - 2 * t);
}

export function attachSoftMotion(mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>) {
  mesh.geometry.computeBoundingBox();
  mesh.geometry.computeBoundingSphere();
  const restBox = mesh.geometry.boundingBox!.clone();
  const restSphere = mesh.geometry.boundingSphere!.clone();
  const movingSphere = restSphere.clone();
  const uniforms = {
    tissueAngle: { value: 0 },
    tissuePivot: { value: new THREE.Vector3() },
    tissueAxis: { value: new THREE.Vector3(1, 0, 0) },
    shapeEnabled: { value: 0 },
    shapeOrigin: { value: new THREE.Vector3() },
    shapeDirection: { value: new THREE.Vector3(0,-1,0) },
    shapeSpan: { value: 1 },
    fiberFraction: { value: 0.7 },
    radialScale: { value: 1 },
    neuralExcursion: { value: 0 },
  };
  mesh.geometry.setAttribute('tissueWeight', new THREE.BufferAttribute(new Float32Array(mesh.geometry.getAttribute('position').count), 1));
  mesh.material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = `
      attribute float tissueWeight;
      uniform float tissueAngle;
      uniform vec3 tissuePivot;
      uniform vec3 tissueAxis;
      uniform float shapeEnabled;
      uniform vec3 shapeOrigin;
      uniform vec3 shapeDirection;
      uniform float shapeSpan;
      uniform float fiberFraction;
      uniform float radialScale;
      uniform float neuralExcursion;
      vec3 mechanicalShape(vec3 v) {
        if (shapeEnabled == 0.0) return v;
        float along = dot(v-shapeOrigin,shapeDirection);
        float t = clamp(along/shapeSpan,0.0,1.0);
        float edge = (1.0-fiberFraction)/2.0;
        float u = t < 0.15 ? t*edge/0.15 : (t > 0.85 ? 1.0-(1.0-t)*edge/0.15 : edge+(t-0.15)*fiberFraction/0.7);
        float envelope = sin(3.141592653589793*t);
        vec3 radial = v-shapeOrigin-shapeDirection*along;
        return v + shapeEnabled*(shapeDirection*((u-t)*shapeSpan+neuralExcursion*envelope)
          + radial*(radialScale-1.0)*envelope*envelope);
      }
      vec3 tissueRotate(vec3 v) {
        if (tissueAngle == 0.0) return v;
        float a = tissueAngle * tissueWeight;
        return v * cos(a) + cross(tissueAxis, v) * sin(a)
          + tissueAxis * dot(tissueAxis, v) * (1.0 - cos(a));
      }
    ` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader
      .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed = tissuePivot + tissueRotate(mechanicalShape(transformed) - tissuePivot);')
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nobjectNormal = tissueRotate(objectNormal);');
  };
  mesh.material.customProgramCacheKey = () => 'fisioatlas-mechanics-v3';
  // Raycasting uses the same deformed positions as the shader, including when paused.
  const q = new THREE.Quaternion(), radial = new THREE.Vector3();
  mesh.getVertexPosition = (index, target) => {
    target.fromBufferAttribute(mesh.geometry.getAttribute('position'), index);
    if(uniforms.shapeEnabled.value) {
      const along=radial.copy(target).sub(uniforms.shapeOrigin.value).dot(uniforms.shapeDirection.value);
      const t=THREE.MathUtils.clamp(along/uniforms.shapeSpan.value,0,1),edge=(1-uniforms.fiberFraction.value)/2;
      const u=t<0.15?t*edge/0.15:t>0.85?1-(1-t)*edge/0.15:edge+(t-0.15)*uniforms.fiberFraction.value/0.7;
      const envelope=Math.sin(Math.PI*t);
      radial.copy(target).sub(uniforms.shapeOrigin.value).addScaledVector(uniforms.shapeDirection.value,-along);
      target.addScaledVector(uniforms.shapeDirection.value,(u-t)*uniforms.shapeSpan.value+uniforms.neuralExcursion.value*envelope)
        .addScaledVector(radial,(uniforms.radialScale.value-1)*envelope*envelope);
    }
    if (uniforms.tissueAngle.value === 0) return target;
    const w = mesh.geometry.getAttribute('tissueWeight').getX(index);
    q.setFromAxisAngle(uniforms.tissueAxis.value, uniforms.tissueAngle.value * w);
    return target.sub(uniforms.tissuePivot.value).applyQuaternion(q).add(uniforms.tissuePivot.value);
  };
  function updateBounds() {
    if (uniforms.tissueAngle.value === 0 && uniforms.shapeEnabled.value === 0) {
      mesh.geometry.boundingBox = restBox;
      mesh.geometry.boundingSphere = restSphere;
      return;
    }
    // Bound all possible vertex rotations about this joint, plus the maximum
    // longitudinal/radial displacement. This stays local to the affected tissue.
    const extra = uniforms.shapeEnabled.value === 0 ? 0 :
      Math.abs(uniforms.fiberFraction.value - 0.7) * uniforms.shapeSpan.value / 2 +
      Math.abs(uniforms.neuralExcursion.value) +
      Math.abs(uniforms.radialScale.value - 1) * (restSphere.center.distanceTo(uniforms.shapeOrigin.value) + restSphere.radius);
    if (uniforms.tissueAngle.value === 0) {
      movingSphere.center.copy(restSphere.center);
      movingSphere.radius = restSphere.radius + extra;
    } else {
      movingSphere.center.copy(uniforms.tissuePivot.value);
      movingSphere.radius = restSphere.center.distanceTo(uniforms.tissuePivot.value) + restSphere.radius + extra;
    }
    mesh.geometry.boundingBox = null;
    mesh.geometry.boundingSphere = movingSphere;
  }
  const raycast = mesh.raycast;
  mesh.raycast = function (raycaster, intersects) {
    updateBounds();
    raycast.call(this, raycaster, intersects);
  };
  updateBounds();
  return { ...uniforms, updateBounds };
}
