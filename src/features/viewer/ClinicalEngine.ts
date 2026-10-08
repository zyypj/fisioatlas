import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { byId, colors } from "../../data";
import type { Layers, ModelManifest } from "../../types";
import {
  applyTransparency,
  modelManifestUrl,
  pickableMeshes,
  renderPixelRatio,
  renderProfile,
} from "./renderPerformance";
import type { RenderQuality } from "./renderPerformance";
import { laseguePresets } from "./lasegueRig";
import {
  anchorPoint,
  attachClinicalRig,
  baseMatrix,
  bindClinicalShader,
  clinicalJoints,
  deformClinicalPoint,
  poseRig,
  updateClinicalUniforms,
} from "./clinicalRig";
import type {
  ClinicalJoints,
  ClinicalPose,
  ClinicalRigState,
  ClinicalWeights,
  Side,
} from "./clinicalRig";
import {
  sampleSegments,
  segmentsDuration,
  stepEndPoses,
  stepSegments,
  stepStartPose,
} from "./clinicalAnimation";
import type { ClinicalAnimation, Force, Segment } from "./clinicalAnimation";

type AnatomyMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
interface Events {
  load: (percent: number, count: number, error?: string) => void;
  pose: (pose: ClinicalPose, progress: number) => void;
  playing: (playing: boolean) => void;
  select: (id: string) => void;
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      (Array.isArray(child.material)
        ? child.material
        : [child.material]
      ).forEach((material: THREE.Material) => material.dispose());
    }
  });
}

/** Seta de força: haste e ponta, com a ponta encostada na superfície. */
function forceArrow(material: THREE.Material) {
  const group = new THREE.Group();
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.007, 0.007, 0.1, 12),
    material,
  );
  // Ponta na origem apontando para -Y; haste para +Y (fora da pele).
  shaft.position.y = 0.085;
  const head = new THREE.Mesh(
    new THREE.ConeGeometry(0.02, 0.035, 16),
    material,
  );
  head.position.y = 0.0175;
  head.rotation.x = Math.PI;
  group.add(shaft, head);
  group.visible = false;
  return group;
}

const UP = new THREE.Vector3(0, 1, 0);

export class ClinicalEngine {
  private scene = new THREE.Scene();
  private body = new THREE.Group();
  private stage = new THREE.Group();
  private sources = new THREE.Group();
  private camera = new THREE.PerspectiveCamera(38, 1, 0.005, 20);
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private observer: ResizeObserver;
  private intersection: IntersectionObserver;
  private visible = true;
  private abort = new AbortController();
  private meshes: AnatomyMesh[] = [];
  private uniforms: ReturnType<typeof bindClinicalShader>[] = [];
  private drawMeshes: AnatomyMesh[] = [];
  private joints: ClinicalJoints | null = null;
  private rig = { value: null as unknown as ClinicalRigState };
  private pose: ClinicalPose;
  private segments: Segment[] = [];
  private forces: Force[] = [];
  private force = 0;
  private arrows: THREE.Group[] = [];
  private base = new THREE.Matrix4();
  private layers: Layers = { ...laseguePresets.completo };
  private envelopes = false;
  private profile = renderProfile(
    "auto",
    navigator.maxTouchPoints > 0 && matchMedia("(any-pointer: coarse)").matches,
  );
  private reducedMotion = matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  private selected: string | null = null;
  private focus = "articulacao";
  private viewName = "obliqua";
  private elapsed = 0;
  private speed = 1;
  private playing = true;
  private step = 0;
  private frame = 0;
  private lastTime = 0;
  private lastRender = 0;
  private lastReport = 0;
  private ready = false;
  private dirty = true;
  private disposed = false;
  private events: Events;
  private element: HTMLDivElement;
  readonly animation: ClinicalAnimation;
  private side: Side;
  constructor(
    element: HTMLDivElement,
    events: Events,
    animation: ClinicalAnimation,
    step: number,
    quality: RenderQuality,
    label: string,
  ) {
    this.element = element;
    this.events = events;
    this.animation = animation;
    this.side = animation.side ?? "direito";
    this.step = step;
    this.profile = renderProfile(
      quality,
      navigator.maxTouchPoints > 0 &&
        matchMedia("(any-pointer: coarse)").matches,
    );
    this.playing = !this.reducedMotion;
    this.pose = stepStartPose(animation, step);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor("#f6f0fc", 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = !this.profile.light;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    element.appendChild(this.renderer.domElement);
    const canvas = this.renderer.domElement;
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      `${label} em 3D: demonstração animada de cada passo, com setas mostrando onde o examinador aplica a força. Arraste para girar e toque nas estruturas para identificá-las.`,
    );
    canvas.tabIndex = 0;
    this.body.matrixAutoUpdate = false;
    this.scene.add(this.body, this.stage);
    this.sources.visible = false;
    this.body.add(this.sources);
    this.scene.add(new THREE.HemisphereLight("#fff8f2", "#778099", 2.2));
    const key = new THREE.DirectionalLight("#fff5e8", 2.8);
    key.position.set(1.6, 3, -1.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, {
      left: -1.8,
      right: 1.8,
      top: 1.8,
      bottom: -1.8,
      near: 0.1,
      far: 9,
    });
    key.shadow.normalBias = 0.004;
    key.target.position.set(0.6, 0.4, 0);
    this.scene.add(key.target, key);
    const fill = new THREE.DirectionalLight("#c8cfff", 1.4);
    fill.position.set(-1, 0.6, 2);
    this.scene.add(fill);
    const arrowMaterial = new THREE.MeshStandardMaterial({
      color: "#e4572e",
      emissive: "#a8321a",
      emissiveIntensity: 0.35,
      roughness: 0.45,
      transparent: true,
    });
    for (let i = 0; i < 4; i++) {
      const arrow = forceArrow(arrowMaterial);
      this.arrows.push(arrow);
      this.body.add(arrow);
    }
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.09;
    this.controls.minDistance = 0.3;
    this.controls.maxDistance = 6;
    this.controls.addEventListener("change", () => {
      this.dirty = true;
    });
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(element);
    this.intersection = new IntersectionObserver(
      (entries) => {
        this.visible =
          entries[0].isIntersecting && entries[0].intersectionRatio >= 0.3;
        if (this.visible) {
          this.lastTime = 0;
          this.dirty = true;
        }
      },
      { threshold: [0, 0.3] },
    );
    this.intersection.observe(element);
    this.resize();
    let pointerX = 0,
      pointerY = 0;
    canvas.addEventListener("pointerdown", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    });
    canvas.addEventListener("pointerup", (event) => {
      if (
        event.button !== 0 ||
        Math.hypot(event.clientX - pointerX, event.clientY - pointerY) > 5
      )
        return;
      const rect = canvas.getBoundingClientRect();
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(
        new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          (-(event.clientY - rect.top) / rect.height) * 2 + 1,
        ),
        this.camera,
      );
      const hit = raycaster.intersectObjects(
        pickableMeshes(this.meshes),
        false,
      )[0];
      if (hit) {
        this.selected = hit.object.userData.structureId;
        this.events.select(this.selected!);
      }
    });
    this.frame = requestAnimationFrame(this.animate);
  }

  /** Maca, chão e parede, conforme a postura e a configuração do teste. */
  private buildStage(joints: ClinicalJoints) {
    const base = this.animation.base;
    const tableMaterial = new THREE.MeshStandardMaterial({
      color: "#c5bbdc",
      roughness: 0.8,
    });
    const metal = new THREE.MeshStandardMaterial({
      color: "#9a9aaa",
      roughness: 0.45,
      metalness: 0.5,
    });
    const lying = base === "supino" || base === "prono" || base === "lateral";
    // Chão: abaixo dos pés em todas as poses do teste.
    let floor = lying ? -0.75 : 0;
    if (lying) {
      const poses = [
        stepStartPose(this.animation, 0),
        ...stepEndPoses(this.animation),
      ];
      for (const pose of poses) {
        const rig = poseRig(pose, joints, base, this.animation.stance);
        for (const side of ["direito", "esquerdo"] as Side[])
          for (const anchor of ["calcanhar", "planta"] as const) {
            const { point, weights } = anchorPoint(anchor, side, joints);
            const world = deformClinicalPoint(point, weights, rig, joints)
              .applyMatrix4(rig.global)
              .applyMatrix4(this.base);
            floor = Math.min(floor, world.y - 0.03);
          }
      }
    }
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 7),
      new THREE.MeshStandardMaterial({ color: "#eee8f7", roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = floor;
    ground.receiveShadow = true;
    this.stage.add(ground);
    if (lying) {
      const from = this.animation.table?.from ?? -0.13,
        to = 1.82,
        shift = this.animation.table?.shift ?? 0;
      const surface = new THREE.Mesh(
        new THREE.BoxGeometry(to - from, 0.065, 0.64),
        tableMaterial,
      );
      surface.position.set((from + to) / 2, -0.0325, shift);
      surface.receiveShadow = true;
      this.stage.add(surface);
      const legHeight = -0.065 - floor;
      for (const x of [from + 0.15, to - 0.15])
        for (const z of [shift - 0.25, shift + 0.25]) {
          const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.018, 0.018, legHeight, 12),
            metal,
          );
          leg.position.set(x, floor + legHeight / 2, z);
          this.stage.add(leg);
        }
      if (base !== "prono") {
        const pillow = new THREE.Mesh(
          new THREE.SphereGeometry(1, 24, 12),
          new THREE.MeshStandardMaterial({ color: "#ece5f7", roughness: 0.95 }),
        );
        pillow.scale.set(0.12, 0.03, 0.13);
        pillow.position.set(1.6, 0.02, shift);
        if (base === "lateral") {
          pillow.scale.set(0.12, 0.07, 0.13);
          pillow.position.y = 0.06;
        }
        this.stage.add(pillow);
      }
    }
    if (base === "sentado") {
      const surface = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.07, 0.65),
        tableMaterial,
      );
      surface.position.set(-0.45, 0.665, -0.33);
      surface.receiveShadow = true;
      this.stage.add(surface);
      for (const x of [-1.17, 0.25])
        for (const z of [-0.57, -0.08]) {
          const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.018, 0.018, 0.63, 12),
            metal,
          );
          leg.position.set(x, 0.315, z);
          this.stage.add(leg);
        }
    }
    if (this.animation.wall) {
      // Parede onde o joelho da frente encosta no fim do avanço.
      let reach = -Infinity;
      for (const pose of stepEndPoses(this.animation)) {
        const rig = poseRig(pose, joints, base, this.animation.stance);
        const { point, weights } = anchorPoint("patela", this.side, joints);
        const world = deformClinicalPoint(point, weights, rig, joints)
          .applyMatrix4(rig.global)
          .applyMatrix4(this.base);
        reach = Math.max(reach, world.z);
      }
      const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 2.2),
        new THREE.MeshStandardMaterial({
          color: "#e6dcf3",
          roughness: 0.95,
          side: THREE.DoubleSide,
        }),
      );
      wall.position.set(0, 1.1, reach + 0.005);
      wall.receiveShadow = true;
      this.stage.add(wall);
    }
  }

  async load() {
    try {
      this.events.load(0, 0);
      const response = await fetch(modelManifestUrl(this.profile.light), {
        signal: this.abort.signal,
      });
      if (!response.ok) throw new Error("Manifesto indisponível");
      const manifest = (await response.json()) as ModelManifest[];
      const total = manifest.reduce((sum, asset) => sum + asset.bytes, 0);
      let loaded = 0;
      for (const asset of [...manifest].sort(
        (a, b) => Number(b.kind === "ossos") - Number(a.kind === "ossos"),
      )) {
        const file = await fetch(asset.url, { signal: this.abort.signal });
        if (!file.ok) throw new Error(`Falha em ${asset.kind}`);
        const buffer = await file.arrayBuffer();
        if (this.disposed) return;
        const gltf = await new GLTFLoader()
          .setMeshoptDecoder(MeshoptDecoder)
          .parseAsync(buffer, "/models/");
        if (this.disposed) {
          disposeObject(gltf.scene);
          return;
        }
        gltf.scene.updateMatrixWorld(true);
        const batch: AnatomyMesh[] = [];
        gltf.scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          const id = object.userData.structureId || object.name.split("__")[0];
          if (!byId[id]) return;
          const geometry = object.geometry.clone();
          for (const name of ["position", "normal"]) {
            const source = geometry.getAttribute(name);
            if (!source) continue;
            const values = new Float32Array(source.count * 3);
            for (let i = 0; i < source.count; i++) {
              values[i * 3] = source.getX(i);
              values[i * 3 + 1] = source.getY(i);
              values[i * 3 + 2] = source.getZ(i);
            }
            geometry.setAttribute(name, new THREE.BufferAttribute(values, 3));
          }
          geometry.applyMatrix4(object.matrixWorld);
          geometry.computeBoundingBox();
          for (const name of Object.keys(geometry.attributes))
            if (name !== "position" && name !== "normal")
              geometry.deleteAttribute(name);
          if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
          const mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({
              color: colors[byId[id].kind],
              roughness: 0.6,
              metalness: 0,
              side: THREE.DoubleSide,
              forceSinglePass: true,
            }),
          );
          mesh.userData = {
            ...object.userData,
            structureId: id,
            bounds: geometry.boundingBox!.clone(),
          };
          mesh.name = object.name;
          batch.push(mesh);
          this.meshes.push(mesh);
          this.sources.add(mesh);
        });
        disposeObject(gltf.scene);
        if (!this.joints) {
          const bounds = (id: string, right: boolean = true) => {
            const mesh = batch.find(
              (mesh) =>
                mesh.userData.structureId === id &&
                (right
                  ? mesh.userData.bounds.max.x < 0
                  : mesh.userData.bounds.min.x > 0),
            );
            if (!mesh) throw new Error(`Referência anatômica ausente: ${id}`);
            return mesh.userData.bounds as THREE.Box3;
          };
          this.joints = clinicalJoints(bounds);
          this.base = baseMatrix(this.animation.base, this.joints);
          this.buildStage(this.joints);
          this.updatePose();
          this.view(this.viewName, this.focus);
        }
        const joints = this.joints;
        for (const mesh of batch)
          attachClinicalRig(
            mesh,
            byId[mesh.userData.structureId],
            joints,
            this.rig,
          );
        // Um lote por tecido para desenhar; as malhas originais ficam só
        // para a seleção, com os mesmos vértices deformados.
        const buckets = new Map<string, AnatomyMesh[]>();
        for (const mesh of batch) {
          const structure = byId[mesh.userData.structureId];
          const key = structure.kind + ":" + !!structure.envelope;
          const bucket = buckets.get(key) || [];
          bucket.push(mesh);
          buckets.set(key, bucket);
        }
        for (const bucket of buckets.values()) {
          const structure = byId[bucket[0].userData.structureId];
          const geometry = mergeGeometries(bucket.map((mesh) => mesh.geometry));
          if (!geometry) throw new Error("Falha ao agrupar tecidos anatômicos");
          const material = new THREE.MeshStandardMaterial({
            color: colors[structure.kind],
            roughness: 0.6,
            side: THREE.DoubleSide,
            forceSinglePass: true,
            emissive: structure.kind === "nervos" ? "#755320" : "#000000",
            emissiveIntensity: 0.12,
          });
          const mesh = new THREE.Mesh(geometry, material);
          const depthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
          });
          this.uniforms.push(
            bindClinicalShader({ material: depthMaterial }, joints),
            bindClinicalShader(mesh, joints),
          );
          mesh.customDepthMaterial = depthMaterial;
          mesh.receiveShadow = true;
          mesh.userData = {
            kind: structure.kind,
            envelope: !!structure.envelope,
          };
          mesh.frustumCulled = false;
          this.drawMeshes.push(mesh);
          this.body.add(mesh);
        }
        loaded += asset.bytes;
        this.updateMaterials();
        this.updatePose();
        this.dirty = true;
        this.events.load(
          Math.round((loaded / total) * 100),
          this.meshes.length,
        );
      }
      this.ready = true;
      this.restart();
    } catch (error) {
      if (!this.disposed)
        this.events.load(
          0,
          this.meshes.length,
          error instanceof Error
            ? error.message
            : "Falha ao carregar a anatomia",
        );
    }
  }

  private resize() {
    const width = Math.max(1, this.element.clientWidth),
      height = Math.max(1, this.element.clientHeight);
    this.renderer.setPixelRatio(
      renderPixelRatio(width, height, devicePixelRatio, this.profile),
    );
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  }

  setLayers(layers: Layers, envelopes: boolean) {
    this.layers = { ...layers };
    this.envelopes = envelopes;
    this.updateMaterials();
  }
  private updateMaterials() {
    for (const mesh of this.meshes) {
      const structure = byId[mesh.userData.structureId];
      const opacity =
        structure.envelope && !this.envelopes
          ? 0
          : this.layers[structure.kind] / 100;
      applyTransparency(mesh.material, opacity, this.profile.light);
      mesh.visible = opacity > 0.015;
    }
    for (const mesh of this.drawMeshes) {
      const opacity =
        mesh.userData.envelope && !this.envelopes
          ? 0
          : this.layers[mesh.userData.kind as keyof Layers] / 100;
      applyTransparency(mesh.material, opacity, this.profile.light);
      mesh.visible = opacity > 0.015;
      mesh.castShadow = !this.profile.light && opacity > 0.95;
    }
    this.dirty = true;
  }

  setStep(step: number) {
    if (step === this.step) return;
    this.step = step;
    this.restart();
  }
  /** Recomeça o passo atual a partir da pose em que o corpo está. */
  restart() {
    this.segments = stepSegments(this.animation, this.step, this.pose);
    this.elapsed = 0;
    if (this.reducedMotion) {
      this.elapsed = segmentsDuration(this.segments);
      this.playing = false;
      this.sample();
    } else this.playing = true;
    this.events.playing(this.playing);
    this.dirty = true;
  }
  setPlaying(playing: boolean) {
    if (playing && this.elapsed >= segmentsDuration(this.segments)) {
      this.restart();
      return;
    }
    this.playing = playing;
    this.events.playing(playing);
    this.dirty = true;
  }
  setSpeed(speed: number) {
    this.speed = speed;
  }
  /** Leva a animação do passo a uma fração (0–1), pausando. */
  seek(fraction: number) {
    if (!this.segments.length) return;
    this.playing = false;
    this.events.playing(false);
    this.elapsed = fraction * segmentsDuration(this.segments);
    this.sample();
    this.dirty = true;
  }
  private sample() {
    const sample = sampleSegments(this.segments, this.elapsed);
    this.pose = sample.pose;
    this.forces = sample.forces;
    this.force = sample.force;
  }

  /** Ponto do corpo usado como alvo da câmera. */
  private focusPoint(focus: string) {
    const joints = this.joints;
    if (!joints || !this.rig.value) return new THREE.Vector3(0.8, 0.2, 0);
    const right = this.side === "direito";
    const r = right ? 1 : 0;
    const key = focus === "articulacao" ? this.animation.focus : focus;
    const weights = (hip: number, knee: number): ClinicalWeights => ({
      leg: [hip, knee, 0, r],
      upper: [0, 0, 0, r],
    });
    let point: THREE.Vector3,
      w = weights(0, 0);
    switch (key) {
      case "joelho":
        point = (right ? joints.knee : joints.leftKnee).clone();
        w = weights(1, 0);
        break;
      case "tornozelo":
      case "pe":
        point = (right ? joints.ankle : joints.leftAnkle).clone();
        if (key === "pe") point.add(new THREE.Vector3(0, -0.03, 0.05));
        w = weights(1, 1);
        break;
      case "quadril":
        point = (right ? joints.hip : joints.leftHip).clone();
        break;
      case "pelve":
        point = joints.hip.clone().add(joints.leftHip).multiplyScalar(0.5);
        point.y += 0.05;
        break;
      case "lombar":
        point = new THREE.Vector3(0, 1.05, -0.05);
        w = { leg: [0, 0, 0, r], upper: [0.6, 0, 0, r] };
        break;
      default:
        point = new THREE.Vector3(0, 0.85, 0);
    }
    return deformClinicalPoint(point, w, this.rig.value, joints).applyMatrix4(
      this.body.matrix,
    );
  }
  private focusDistance(focus: string) {
    const key = focus === "articulacao" ? this.animation.focus : focus;
    const zoom = focus === "articulacao" ? (this.animation.zoom ?? 1) : 1;
    const distances: Record<string, number> = {
      joelho: 0.85,
      tornozelo: 0.7,
      pe: 0.7,
      quadril: 1.2,
      pelve: 1.25,
      lombar: 1.3,
    };
    return zoom * (distances[key] ?? 2.7);
  }
  private viewDirection(view: string) {
    const base = this.animation.base;
    const right = this.side === "direito";
    // Lado examinado na cena: supino → z negativo; prono → z positivo.
    const lateral =
      base === "supino"
        ? right
          ? -1
          : 1
        : base === "prono"
          ? right
            ? 1
            : -1
          : 1;
    if (view === "superior") return new THREE.Vector3(0, 1, 0.02);
    if (base === "em-pe" || base === "sentado") {
      if (view === "lateral")
        return new THREE.Vector3(right ? -1 : 1, 0.1, 0.05);
      return new THREE.Vector3(
        ...(this.animation.view ?? [right ? -0.7 : 0.7, 0.3, 1]),
      );
    }
    if (base === "lateral") {
      if (view === "lateral") return new THREE.Vector3(0, 0.15, 1);
      return new THREE.Vector3(...(this.animation.view ?? [-0.35, 0.65, 1]));
    }
    if (view === "lateral") return new THREE.Vector3(0, 0.3, lateral);
    return new THREE.Vector3(...(this.animation.view ?? [-0.45, 0.6, lateral]));
  }
  view(view: string, focus = this.focus) {
    this.viewName = view;
    this.focus = focus;
    this.camera.up.set(0, 1, 0);
    if (view === "superior") this.camera.up.set(1, 0, 0);
    const target = this.focusPoint(focus);
    // Proporção lida do elemento: a da câmera só muda no próximo resize.
    const aspect =
      Math.max(1, this.element.clientWidth) /
      Math.max(1, this.element.clientHeight);
    const distance = this.focusDistance(focus) / Math.min(1, aspect);
    this.controls.target.copy(target);
    this.camera.position
      .copy(target)
      .add(this.viewDirection(view).normalize().multiplyScalar(distance));
    this.camera.lookAt(target);
    this.controls.update();
    this.dirty = true;
  }
  /** Enquadramento atual, para reabrir o 3D no mesmo ponto (nulo antes de
   *  o corpo carregar, quando a câmera ainda mira um alvo provisório). */
  captureView() {
    if (!this.joints) return null;
    return {
      position: this.camera.position.clone(),
      target: this.controls.target.clone(),
      focus: this.focus,
      view: this.viewName,
    };
  }
  restoreView(saved: NonNullable<ReturnType<ClinicalEngine["captureView"]>>) {
    this.focus = saved.focus;
    this.viewName = saved.view;
    this.camera.position.copy(saved.position);
    this.controls.target.copy(saved.target);
    this.controls.update();
    this.dirty = true;
  }

  private updatePose() {
    const joints = this.joints;
    if (!joints) return;
    const previousTarget = this.rig.value ? this.focusPoint(this.focus) : null;
    this.rig.value = poseRig(
      this.pose,
      joints,
      this.animation.base,
      this.animation.stance,
    );
    for (const uniforms of this.uniforms)
      updateClinicalUniforms(uniforms, this.rig.value);
    this.body.matrix.copy(this.base).multiply(this.rig.value.global);
    this.body.matrixWorldNeedsUpdate = true;
    // Setas de força: ponta na superfície, apontando para dentro.
    this.arrows.forEach((arrow, i) => {
      const force = this.forces[i];
      arrow.visible = !!force && this.force > 0.01;
      if (!force) return;
      const { point, weights } = anchorPoint(
        force.at,
        force.side ?? this.side,
        joints,
      );
      const tip = deformClinicalPoint(point, weights, this.rig.value, joints);
      const ahead = deformClinicalPoint(
        point
          .clone()
          .add(
            new THREE.Vector3(...force.dir).normalize().multiplyScalar(0.05),
          ),
        weights,
        this.rig.value,
        joints,
      );
      const direction = ahead.sub(tip).normalize();
      arrow.position.copy(tip);
      arrow.quaternion.setFromUnitVectors(UP, direction.negate());
      const pulse = 1 + 0.08 * Math.sin(performance.now() / 180);
      arrow.scale.setScalar(this.force * pulse);
    });
    // A câmera acompanha a articulação em foco enquanto ela se move.
    if (previousTarget) {
      const target = this.focusPoint(this.focus);
      this.camera.position.add(target.clone().sub(previousTarget));
      this.controls.target.add(target.clone().sub(previousTarget));
    }
    this.renderer.domElement.dataset.step = String(this.step);
  }

  private animate = (time: number) => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.animate);
    if (time - this.lastRender < 1000 / this.profile.maxFps - 1) return;
    const dt = this.lastTime
      ? Math.min((time - this.lastTime) / 1000, 0.05)
      : 0;
    this.lastTime = time;
    if (document.hidden || !this.visible) return;
    const cameraChanged = this.controls.update();
    const arrows = this.forces.length > 0;
    if (
      !this.dirty &&
      !cameraChanged &&
      !(this.playing && this.ready) &&
      !arrows
    )
      return;
    this.dirty = false;
    const duration = segmentsDuration(this.segments);
    if (this.playing && this.ready && this.segments.length) {
      this.elapsed += dt * this.speed;
      if (this.elapsed >= duration) {
        this.elapsed = duration;
        this.playing = false;
        this.events.playing(false);
      }
      this.sample();
    }
    this.updatePose();
    this.scene.updateMatrixWorld();
    this.renderer.render(this.scene, this.camera);
    this.lastRender = time;
    if (time - this.lastReport > 100) {
      this.lastReport = time;
      this.events.pose(
        this.pose,
        duration ? Math.min(1, this.elapsed / duration) : 1,
      );
    }
  };

  dispose() {
    this.disposed = true;
    this.abort.abort();
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
    this.intersection.disconnect();
    this.controls.dispose();
    this.scene.traverse((object) => {
      if (object instanceof THREE.DirectionalLight) object.shadow.dispose();
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        object.customDepthMaterial?.dispose();
        (Array.isArray(object.material)
          ? object.material
          : [object.material]
        ).forEach((material: THREE.Material) => material.dispose());
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
