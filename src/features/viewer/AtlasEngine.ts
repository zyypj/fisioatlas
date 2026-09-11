import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { byId, colors } from "../../data";
import { attachSoftMotion, motionWeight } from "./softMotion";
import { rigs, rigPivot, rigMoves, rigBounds, onAnimatedSide, weightHeight, chainRegions } from "./animationRigs";
import { fadeOpacity, pickableMeshes } from './renderPerformance';
import { centerlineRig, deformedPathLength } from './tissueRig';
import { activationStep, ligamentForce, muscleEquilibrium, nerveResponse, tendonForce } from '../movements/biomechanics';
import type { MechanicsOptions, MechanicsReport, TissueReading } from '../movements/biomechanics';
import type { Layers, Movement, ModelManifest } from "../../types";

type AnatomicalMesh = THREE.Mesh<
  THREE.BufferGeometry,
  THREE.MeshStandardMaterial
>;
export interface ViewerState {
  selected: string | null;
  layers: Layers;
  envelopes: boolean;
  hidden: string[];
  transparent: string[];
  isolated: boolean;
  movement: Movement | null;
  playing: boolean;
  speed: number;
  progress: number;
  plane: string;
  terms: boolean;
  agonists: boolean;
  motionMode: "all" | "bones";
  mechanics: MechanicsOptions;
}
export interface EngineEvents {
  select: (id: string) => void;
  isolate: (id: string) => void;
  hover: (name: string, x: number, y: number) => void;
  context: (id: string, x: number, y: number) => void;
  load: (percent: number, count: number, error?: string) => void;
  progress: (value: number) => void;
  view: (value: string) => void;
  mechanics: (report: MechanicsReport) => void;
}
export class AtlasEngine {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, 1, 0.005, 50);
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  meshes: AnatomicalMesh[] = [];
  private frame = 0;
  private disposed = false;
  private observer: ResizeObserver;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private targetCamera: THREE.Vector3 | null = null;
  private targetLook: THREE.Vector3 | null = null;
  private box = new THREE.Box3();
  private overallCenter = new THREE.Vector3(0, 1, 0);
  private planeMesh: THREE.Mesh;
  private arrows = new THREE.Group();
  private lastTime = 0;
  private elapsed = 0;
  private lastProgress = 0;
  private lastMechanicsReport = 0;
  private readings: TissueReading[] = [];
  private dirty = true;
  private renderStateKey = '';
  private settleUntil = 0;
  private lastHover = 0;
  private interacting = false;
  private heatColor = new THREE.Color('#df563f');
  private pointerStart = { x: 0, y: 0 };
  private lastSelected: string | null = null;
  private wasMovement: string | undefined;
  private abort = new AbortController();
  state: ViewerState;
  private element: HTMLDivElement;
  private events: EngineEvents;
  constructor(
    element: HTMLDivElement,
    events: EngineEvents,
    initial: ViewerState,
  ) {
    this.element = element;
    this.events = events;
    this.state = initial;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setClearColor(0xf2f5f3, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    element.appendChild(this.renderer.domElement);
    this.renderer.domElement.setAttribute(
      "aria-label",
      "Modelo anatômico 3D. Arraste para girar, use a rolagem para zoom. Selecione estruturas também pela lista acessível.",
    );
    this.renderer.domElement.setAttribute("role", "img");
    this.renderer.domElement.tabIndex = 0;
    this.camera.position.set(0, 1, 3.7);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.09;
    this.controls.minDistance = 0.15;
    this.controls.maxDistance = 7;
    this.controls.enablePan = true;
    this.controls.addEventListener("start", () => {
      this.interacting = true;
      this.events.hover('', 0, 0);
      this.targetCamera = null;
      this.targetLook = null;
      this.events.view("livre");
    });
    this.controls.addEventListener('end', () => { this.interacting = false; });
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x777469, 2.4));
    const key = new THREE.DirectionalLight(0xfff8ee, 3.8);
    key.position.set(-2, 3, 4);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xd7eeeb, 2);
    fill.position.set(2, 2, -3);
    this.scene.add(fill);
    this.planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 2.2),
      new THREE.MeshBasicMaterial({
        color: 0x499c9e,
        transparent: true,
        opacity: 0.17,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    this.planeMesh.visible = false;
    this.scene.add(this.planeMesh);
    this.arrows.visible = false;
    this.scene.add(this.arrows);
    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", (e) => {
      this.pointerStart = { x: e.clientX, y: e.clientY };
    });
    canvas.addEventListener("pointerup", (e) => {
      if (
        e.button === 0 &&
        Math.hypot(
          e.clientX - this.pointerStart.x,
          e.clientY - this.pointerStart.y,
        ) < 5
      ) {
        const mesh = this.hit(e);
        if (mesh) this.events.select(mesh.userData.structureId);
      }
    });
    canvas.addEventListener("dblclick", (e) => {
      const mesh = this.hit(e);
      if (mesh) this.events.isolate(mesh.userData.structureId);
    });
    canvas.addEventListener("pointermove", (e) => {
      // Orbiting must not trigger millions of triangle tests under the cursor.
      if (this.interacting || e.buttons || (this.state.playing && this.state.movement)) return;
      if (e.timeStamp - this.lastHover < 80) return;
      this.lastHover = e.timeStamp;
      const mesh = this.hit(e);
      canvas.style.cursor = mesh ? "pointer" : "grab";
      const rect = element.getBoundingClientRect();
      this.events.hover(
        mesh ? byId[mesh.userData.structureId]?.name || "" : "",
        e.clientX - rect.left,
        e.clientY - rect.top,
      );
    });
    canvas.addEventListener("pointerleave", () => this.events.hover("", 0, 0));
    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const mesh = this.hit(e);
      if (mesh) {
        const rect = element.getBoundingClientRect();
        this.events.context(
          mesh.userData.structureId,
          e.clientX - rect.left,
          e.clientY - rect.top,
        );
      }
    });
    canvas.addEventListener("keydown", (e) => {
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "-",
          "=",
          "0",
        ].includes(e.key)
      )
        e.preventDefault();
      const offset = this.camera.position.clone().sub(this.controls.target);
      if (e.key === "ArrowLeft" || e.key === "ArrowRight")
        offset.applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          e.key === "ArrowLeft" ? 0.12 : -0.12,
        );
      if (e.key === "ArrowUp" || e.key === "ArrowDown")
        offset.y += e.key === "ArrowUp" ? 0.08 : -0.08;
      if (e.key === "+" || e.key === "=") offset.multiplyScalar(0.9);
      if (e.key === "-") offset.multiplyScalar(1.1);
      this.camera.position.copy(this.controls.target).add(offset);
      if (e.key === "0") this.reset();
    });
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(element);
    this.resize();
    this.frame = requestAnimationFrame(this.animate);
  }
  private hit(e: PointerEvent | MouseEvent) {
    const r = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      (-(e.clientY - r.top) / r.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster
      .intersectObjects(pickableMeshes(this.meshes), false)
      .map((h) => h.object as AnatomicalMesh)
      .find((m) => m.visible && m.material.opacity > 0.18);
  }
  private resize() {
    const w = this.element.clientWidth,
      h = this.element.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.dirty = true;
  }
  async load() {
    try {
      const res = await fetch("/models/manifest.json", {
        signal: this.abort.signal,
      });
      if (!res.ok) throw new Error("Manifesto indisponível");
      const manifest: ModelManifest[] = await res.json();
      const total = manifest.reduce((s, m) => s + m.bytes, 0);
      let loaded = 0;
      for (const asset of [...manifest].sort(
        (a, b) => Number(b.kind === "ossos") - Number(a.kind === "ossos"),
      )) {
        const response = await fetch(asset.url, { signal: this.abort.signal });
        if (!response.ok || !response.body) throw new Error(asset.url);
        const reader = response.body.getReader(),
          chunks: Uint8Array[] = [];
        let bytes = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          bytes += value.length;
          if (this.disposed) return;
          this.events.load(
            Math.min(99, Math.round(((loaded + bytes) / total) * 100)),
            this.meshes.length,
          );
        }
        const data = new Uint8Array(bytes);
        let offset = 0;
        for (const c of chunks) {
          data.set(c, offset);
          offset += c.length;
        }
        const gltf = await new GLTFLoader()
          .setMeshoptDecoder(MeshoptDecoder)
          .parseAsync(data.buffer, "/models/");
        if (this.disposed) {
          gltf.scene.traverse((o) => {
            if (o instanceof THREE.Mesh) o.geometry.dispose();
          });
          return;
        }
        gltf.scene.updateMatrixWorld(true);
        const systemGroup = new THREE.Group();
        const sourceGeometries = new Set<THREE.BufferGeometry>();
        gltf.scene.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            const id = o.userData.structureId || o.name.split("__")[0];
            const entry = byId[id];
            if (!entry) return;
            if (o.material instanceof THREE.Material) o.material.dispose();
            sourceGeometries.add(o.geometry);
            const geometry = o.geometry.clone();
            for (const key of ["position", "normal"]) {
              const attribute = geometry.getAttribute(key);
              if (attribute) {
                const values = new Float32Array(attribute.count * 3);
                for (let i = 0; i < attribute.count; i++) {
                  values[i * 3] = attribute.getX(i);
                  values[i * 3 + 1] = attribute.getY(i);
                  values[i * 3 + 2] = attribute.getZ(i);
                }
                geometry.setAttribute(
                  key,
                  new THREE.BufferAttribute(values, 3),
                );
              }
            }
            geometry.applyMatrix4(o.matrixWorld);
            const mesh = new THREE.Mesh(
              geometry,
              new THREE.MeshStandardMaterial({
                color: colors[entry.kind],
                roughness: 0.66,
                metalness: 0,
                transparent: this.state.layers[entry.kind] < 100,
                opacity: this.state.layers[entry.kind] / 100,
                side: THREE.DoubleSide,
                forceSinglePass: true,
              }),
            );
            mesh.name = o.name;
            mesh.visible = mesh.material.opacity > 0.015;
            mesh.userData = {
              ...o.userData,
              structureId: id,
              kind: entry.kind,
            };
            geometry.computeBoundingBox();
            const b = geometry.boundingBox!;
            mesh.userData.center = b.getCenter(new THREE.Vector3());
            mesh.userData.bounds = b.clone();
            if (entry.kind !== "ossos") mesh.userData.softMotion = attachSoftMotion(mesh);
            this.meshes.push(mesh);
            systemGroup.add(mesh);
          }
        });
        sourceGeometries.forEach((g) => g.dispose());
        this.scene.add(systemGroup);
        this.dirty = true;
        this.settleUntil = performance.now() + 500;
        loaded += bytes;
        this.box.makeEmpty();
        for (const m of this.meshes) this.box.union(m.userData.bounds);
        this.box.getCenter(this.overallCenter);
        if (asset.kind === "ossos") {
          this.reset();
          this.buildArrows();
        }
        this.apply(this.state);
        this.events.load(
          Math.round((loaded / total) * 100),
          this.meshes.length,
        );
      }
      if (this.state.selected) this.focus(this.state.selected);
      else if(this.state.movement) this.preset(rigs[this.state.movement.animation].view,true);
    } catch (e) {
      if (!this.disposed)
        this.events.load(
          0,
          this.meshes.length,
          `Não foi possível carregar todos os modelos. ${e instanceof Error ? e.message : ""}`,
        );
    }
  }
  apply(state: ViewerState) {
    // Report/tooltip React updates reuse identical visual state; do not restart
    // the renderer or activation settling for those updates.
    const key = JSON.stringify(state);
    if (key !== this.renderStateKey) {
      this.dirty = true;
      this.settleUntil = performance.now() + 500;
      this.renderStateKey = key;
    }
    if (!state.playing && state.progress !== this.state.progress) {
      for (const m of this.meshes) if (m.userData.mechanicsRig) m.userData.mechanicsRig.previousLength = undefined;
    }
    const changed = state.selected !== this.lastSelected;
    const movementChanged = state.movement?.id !== this.wasMovement;
    this.state = state;
    this.lastSelected = state.selected;
    this.wasMovement = state.movement?.id;
    if (changed && state.selected) this.focus(state.selected);
    if (movementChanged) {
      this.elapsed = 0;
      if (state.movement) {
        this.reset();
        this.preset(rigs[state.movement.animation].view, true);
      }
    }
    if (!state.playing) this.elapsed = state.progress * Math.PI * 2;
    this.planeMesh.visible = !!state.plane;
    this.planeMesh.position.copy(this.overallCenter);
    this.planeMesh.rotation.set(0, 0, 0);
    if (state.plane === "Sagital") this.planeMesh.rotation.y = Math.PI / 2;
    if (state.plane === "Transversal") this.planeMesh.rotation.x = Math.PI / 2;
    this.arrows.visible = state.terms;
  }
  focus(id: string) {
    const s = byId[id];
    if (!s) return;
    let matching = this.meshes.filter((m) => m.userData.structureId === id);
    if (!matching.length)
      matching = this.meshes.filter(
        (m) =>
          s.related.includes(m.userData.structureId) &&
          m.userData.kind === "ossos",
      );
    if (!matching.length) return;
    const right = matching.filter((m) => m.userData.center.x < -0.015);
    if (right.length) matching = right;
    const b = new THREE.Box3();
    for (const m of matching) {
      if (this.state.movement && !this.state.agonists) {
        const positions=m.geometry.getAttribute('position'),point=new THREE.Vector3();
        m.updateWorldMatrix(true,false);
        for(let i=0;i<positions.count;i+=Math.max(1,Math.floor(positions.count/1500))) {
          m.getVertexPosition(i,point);b.expandByPoint(point.applyMatrix4(m.matrixWorld));
        }
      } else b.union(m.userData.bounds);
    }
    const center = b.getCenter(new THREE.Vector3());
    const size = b.getSize(new THREE.Vector3());
    const dist =
      Math.max(0.42, Math.max(size.x, size.y, size.z) * 2.9) /
      Math.min(1, this.camera.aspect);
    const posterior = [
      "supraespinal",
      "infraespinal",
      "trapezio",
      "gluteo-maximo",
      "semitendineo",
      "semimembranaceo",
    ].includes(id);
    this.events.view(posterior ? "posterior" : "anterior");
    this.targetLook = center;
    this.targetCamera = center
      .clone()
      .add(
        new THREE.Vector3(
          posterior ? -0.15 : 0.06,
          0.04,
          posterior ? -dist : dist,
        ),
      );
  }
  reset() {
    this.events.view("anterior");
    const size = this.box.isEmpty()
      ? new THREE.Vector3(0.7, 1.8, 0.3)
      : this.box.getSize(new THREE.Vector3());
    const halfFov = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const distance = Math.max(size.y / (2 * halfFov), size.x / (2 * halfFov * this.camera.aspect)) * 1.14;
    this.targetLook = this.overallCenter.clone();
    this.targetCamera = this.overallCenter
      .clone()
      .add(
        new THREE.Vector3(0, 0, distance),
      );
  }
  preset(view: string, whole = false) {
    this.events.view(view);
    const center = whole
      ? this.overallCenter.clone()
      : this.controls.target.clone();
    const distance = whole
      ? 3.2
      : this.camera.position.distanceTo(this.controls.target);
    const offsets: Record<string, number[]> = {
      anterior: [0, 0, 1],
      posterior: [0, 0, -1],
      "lateral-direita": [-1, 0, 0],
      "lateral-esquerda": [1, 0, 0],
      superior: [0, 1, 0.001],
      inferior: [0, -1, 0.001],
    };
    const p = offsets[view] || offsets.anterior;
    this.targetLook = center;
    this.targetCamera = center
      .clone()
      .add(new THREE.Vector3(...p).multiplyScalar(distance));
  }
  zoom(factor: number) {
    this.targetCamera = this.camera.position
      .clone()
      .sub(this.controls.target)
      .multiplyScalar(factor)
      .add(this.controls.target);
    this.targetLook = this.controls.target.clone();
  }
  private buildArrows() {
    for (const [dir, color] of [
      [new THREE.Vector3(0, 1, 0), 0x287e79],
      [new THREE.Vector3(0, -1, 0), 0x287e79],
      [new THREE.Vector3(1, 0, 0), 0xc28c4e],
      [new THREE.Vector3(-1, 0, 0), 0xc28c4e],
      [new THREE.Vector3(0, 0, 1), 0x6c86aa],
    ] as const) {
      this.arrows.add(
        new THREE.ArrowHelper(dir, this.overallCenter, 0.7, color, 0.08, 0.04),
      );
    }
  }
  private motion(dt: number) {
    this.readings = [];
    const move = this.state.movement;
    for (const m of this.meshes) {
      m.position.set(0, 0, 0);
      m.rotation.set(0, 0, 0);
      m.userData.mechanicalReading = null;
      if (m.userData.softMotion) {
        m.userData.softMotion.tissueAngle.value = 0;
        m.userData.softMotion.shapeEnabled.value = 0;
      }
    }
    if (!move || this.state.agonists) return;
    const jointRig = rigs[move.animation];
    const b = rigBounds(jointRig, this.meshes);
    if (!b) return;
    const pivot = rigPivot(jointRig, b);
    const phase = (1 - Math.cos(this.elapsed)) / 2;
    const amount = move.reverse ? 1 - phase : phase;
    const angle = THREE.MathUtils.degToRad(move.maxAngle) * amount;
    const axis = new THREE.Vector3(...jointRig.axis);
    const signedAngle = angle * jointRig.sign;
    const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, signedAngle);
    for (const m of this.meshes) {
      const s = byId[m.userData.structureId];
      if (s.kind !== "ossos") {
        const soft = m.userData.softMotion;
        // Com escopo "movers", só deformam os tecidos que realmente cruzam a
        // articulação. Sem isso, um movimento de pequena amplitude como o da
        // mandíbula arrastaria todo o tronco em torno de um pivô na cabeça.
        const inScope =
          jointRig.softScope === "movers"
            ? jointRig.include?.includes(s.id) || jointRig.spanning.includes(s.id)
            : chainRegions[jointRig.chain].includes(s.region);
        const eligible = onAnimatedSide(jointRig, m.userData.center.x) &&
          (inScope || move.agonists.includes(s.id) || move.antagonists.includes(s.id));
        if (soft && eligible && this.state.motionMode === "all") {
          const rigKey=move.id+':'+this.state.mechanics.enabled;
          if (m.userData.rigMovement !== rigKey) {
            const positions = m.geometry.getAttribute('position');
            const weights = m.geometry.getAttribute('tissueWeight');
            const attachedEnds=this.state.mechanics.enabled&&jointRig.spanning.includes(s.id);
            const fixedSyndesmosis=this.state.mechanics.enabled&&move.animation==='ankle'&&['ligamento-tibiofibular-anterior','ligamento-tibiofibular-posterior'].includes(s.id);
            const weightAt=(x:number,y:number)=>{
              if(fixedSyndesmosis)return 0;
              // Geometric superior/inferior ends approximate attachments to the
              // proximal/distal bone; short ligaments must not move both ends
              // with the old 8 cm blend band. Still requires anatomical calibration.
              if(attachedEnds){const bounds:THREE.Box3=m.userData.bounds;return THREE.MathUtils.smoothstep(bounds.max.y-y,0,Math.max(1e-5,bounds.max.y-bounds.min.y));}
              let w = motionWeight(weightHeight(jointRig, y, pivot.y), pivot.y);
              // Shoulder muscles can span the trunk: keep their medial attachment fixed.
              if (jointRig.lateralPivot) w *= THREE.MathUtils.smoothstep(-x, -pivot.x - 0.08, -pivot.x + 0.02);
              return w;
            };
            for (let i = 0; i < positions.count; i++) weights.setX(i,weightAt(positions.getX(i),positions.getY(i)));
            weights.needsUpdate = true;
            m.userData.rigMovement = rigKey;
            const rig = centerlineRig(positions);
            m.userData.mechanicsRig = { ...rig, activation: 0, previousLength: undefined,
              weights: rig.points.map(point => weightAt(point.x,point.y)),
            };
            soft.shapeOrigin.value.copy(rig.origin);
            soft.shapeDirection.value.copy(rig.direction);
            soft.shapeSpan.value=rig.span;
          }
          soft.tissuePivot.value.copy(pivot);
          soft.tissueAxis.value.copy(axis);
          soft.tissueAngle.value = signedAngle;
          if (this.state.mechanics.enabled && s.kind !== 'articulacoes') {
            const rig=m.userData.mechanicsRig;
            const spansJoint=Math.max(...rig.weights)-Math.min(...rig.weights)>0.02;
            const drivenMuscle=move.agonists.includes(s.id)||move.antagonists.includes(s.id);
            if (spansJoint || drivenMuscle) {
              const options=this.state.mechanics;
              const length=deformedPathLength(rig.points,rig.weights,pivot,axis,soft.tissueAngle.value);
              const rate=rig.previousLength===undefined||dt<=0?0:(length-rig.previousLength)/dt;
              rig.previousLength=length;
              const reading: TissueReading={id:s.id,kind:s.kind,length,restLength:rig.restLength,
                strain:length/rig.restLength-1,force:0,activation:0,fiberRatio:1,tendonStrain:0,excursion:0,residual:0,limited:false};
              soft.fiberFraction.value=0.7;soft.radialScale.value=1;soft.neuralExcursion.value=0;
              if (s.kind==='musculos') {
                const excitation=move.agonists.includes(s.id)?options.activation:move.antagonists.includes(s.id)?options.coactivation:0;
                rig.activation=activationStep(rig.activation,excitation,dt);
                const result=muscleEquilibrium(length,rig.restLength,rig.activation,options.tendonCompliance,rate/(rig.restLength*0.7*10));
                Object.assign(reading,result,{activation:rig.activation});
                soft.fiberFraction.value=THREE.MathUtils.clamp(result.fiberRatio*0.7*rig.restLength/length,0.1,0.9);
                soft.radialScale.value=Math.sqrt(1/THREE.MathUtils.clamp(result.fiberRatio,0.5,1.6));
              } else if (s.kind==='ligamentos') {
                const slackLength=rig.restLength*(1+options.slack);
                reading.strain=length/slackLength-1;
                reading.force=ligamentForce(reading.strain,rate/slackLength,options.stiffness);
                reading.limited=Math.abs(reading.strain)>0.15;
                soft.radialScale.value=1/Math.sqrt(Math.max(0.5,length/rig.restLength));
              } else if (s.kind==='tendoes') {
                reading.tendonStrain=Math.max(0,reading.strain);
                reading.force=tendonForce(reading.strain,options.tendonCompliance);
                reading.limited=Math.abs(reading.strain)>0.15;
                soft.radialScale.value=1/Math.sqrt(Math.max(0.5,length/rig.restLength));
              } else if (s.kind==='nervos') {
                Object.assign(reading,nerveResponse(length,rig.restLength,options.nerveReserve));
                soft.neuralExcursion.value=reading.excursion;
                soft.radialScale.value=1/Math.sqrt(1+reading.strain);
                reading.limited=reading.strain>0.1;
              }
              soft.shapeEnabled.value=1;
              m.userData.mechanicalReading=reading;
              this.readings.push(reading);
            }
          }
        }
        continue;
      }
      if (
        !onAnimatedSide(jointRig, m.userData.center.x) ||
        s.kind !== "ossos" ||
        !rigMoves(jointRig, s.id, s.region)
      )
        continue;
      m.quaternion.copy(quaternion);
      m.position.copy(pivot).sub(pivot.clone().applyQuaternion(quaternion));
    }
  }
  private animate = (time: number) => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.animate);
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    if (document.hidden) return;
    const cameraChanged = this.controls.update();
    const moving = !!this.state.movement && this.state.playing && !this.state.agonists;
    const settling = !!this.state.movement && !this.state.agonists && this.state.motionMode === 'all' && this.state.mechanics.enabled && time < this.settleUntil;
    if (!this.dirty && !cameraChanged && !this.targetCamera && !moving && !settling) return;
    this.dirty = false;
    if (this.state.playing && this.state.movement) {
      this.elapsed += dt * this.state.speed * 0.7;
      const p = (this.elapsed % (Math.PI * 2)) / (Math.PI * 2);
      if (time - this.lastProgress > 100) {
        this.events.progress(p);
        this.lastProgress = time;
      }
    }
    this.motion(dt);
    for (const mesh of this.meshes) mesh.userData.softMotion?.updateBounds();
    if (time-this.lastMechanicsReport>120 && this.state.movement) {
      // One representative component per ficha: longest reference path, not a sum of normalized forces.
      const entries=new Map<string,TissueReading>();
      for(const r of this.readings)if(!entries.has(r.id)||entries.get(r.id)!.restLength<r.restLength)entries.set(r.id,r);
      this.events.mechanics({movementId:this.state.movement.id,rows:[...entries.values()]});
      this.lastMechanicsReport=time;
    }
    const selected = this.state.selected ? byId[this.state.selected] : null;
    const highlighted =
      this.state.agonists && this.state.movement
        ? this.state.movement.agonists
        : [];
    for (const mesh of this.meshes) {
      const s = byId[mesh.userData.structureId];
      let opacity = this.state.layers[s.kind] / 100;
      // Fáscias de revestimento envolvem o segmento inteiro: exibidas junto com
      // as demais, esconderiam tudo o que está por baixo. Só aparecem quando
      // pedidas no painel de camadas ou quando são a estrutura selecionada.
      if (s.envelope && !this.state.envelopes && this.state.selected !== s.id)
        opacity = 0;
      if (this.state.hidden.includes(s.id)) opacity = 0;
      if (this.state.transparent.includes(s.id)) opacity *= 0.15;
      const isSelected = s.id === selected?.id;
      const isAgonist = highlighted.includes(s.id);
      const relatedBone =
        selected?.kind === "articulacoes" &&
        selected.related.includes(s.id) &&
        s.kind === "ossos";
      if (
        this.state.isolated &&
        selected &&
        !isSelected &&
        !(s.kind === "ossos" && selected.related.includes(s.id))
      )
        opacity = 0;
      else if (
        (selected?.depth === "profunda" ||
          selected?.kind === "articulacoes" ||
          selected?.kind === "ligamentos" ||
          selected?.kind === "nervos" ||
          selected?.kind === "ossos") &&
        s.kind === "musculos" &&
        !isSelected
      )
        opacity *= 0.1;
      if ((selected?.kind === "nervos" || selected?.kind === "ligamentos") && s.kind === "articulacoes") opacity *= 0.12;
      if (selected?.kind === "ligamentos" && s.kind === "ossos") opacity *= 0.24;
      if (selected?.kind === "nervos" && s.kind === "ossos") opacity *= 0.5;
      if (highlighted.length && s.kind === "musculos" && !isAgonist)
        opacity *= 0.12;
      if (this.state.movement && !this.state.agonists && this.state.motionMode === "bones")
        opacity =
          s.kind === "ossos" && !this.state.hidden.includes(s.id) ? 1 : 0;
      mesh.material.opacity = fadeOpacity(mesh.material.opacity, opacity);
      if (mesh.material.opacity !== opacity) this.dirty = true;
      const transparent = mesh.material.opacity < 1;
      if (mesh.material.transparent !== transparent) {
        mesh.material.transparent = transparent;
        mesh.material.needsUpdate = true;
      }
      mesh.material.depthWrite = mesh.material.opacity > 0.8;
      mesh.visible = mesh.material.opacity > 0.015;
      const color =
        (isSelected || isAgonist || relatedBone) &&
        (!this.state.movement || this.state.agonists)
          ? "#2a9e94"
          : colors[s.kind];
      mesh.material.color.set(color);
      const reading:TissueReading|null=mesh.userData.mechanicalReading;
      if (reading && this.state.mechanics.heatmap && !isSelected) {
        const signal=reading.kind==='musculos'?reading.activation:reading.kind==='nervos'?reading.strain/0.1:reading.force/2;
        mesh.material.color.lerp(this.heatColor,THREE.MathUtils.clamp(signal,0,1));
      }
      mesh.material.emissive.set(isSelected ? "#074e49" : "#000000");
      mesh.material.emissiveIntensity = isSelected ? 0.18 : 0;
    }
    if (this.targetCamera && this.targetLook) {
      this.camera.position.lerp(this.targetCamera, 0.1);
      this.controls.target.lerp(this.targetLook, 0.1);
      if (this.camera.position.distanceTo(this.targetCamera) < 0.001) {
        this.targetCamera = null;
        this.targetLook = null;
      }
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
  dispose() {
    this.disposed = true;
    this.abort.abort();
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
    this.controls.dispose();
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
        else o.material.dispose();
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
