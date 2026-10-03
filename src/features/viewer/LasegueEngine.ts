import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { byId, colors } from "../../data";
import type { Layers, ModelManifest } from "../../types";
import {
  applyTransparency,
  pickableMeshes,
  renderPixelRatio,
  renderProfile,
} from "./renderPerformance";
import type { RenderQuality } from "./renderPerformance";
import {
  attachLasegueRig,
  bindLasegueShader,
  deformLaseguePoint,
  lasegueDurations,
  lasegueJoints,
  laseguePresets,
  lasegueStepPose,
  smoothMotion,
  supineMatrix,
} from "./lasegueRig";
import type { LaseguePose } from "./lasegueRig";

type AnatomyMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
type RigUniforms = ReturnType<typeof bindLasegueShader>;
interface Events {
  load: (percent: number, count: number, error?: string) => void;
  pose: (pose: LaseguePose, progress: number) => void;
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

/** An examiner's gloved support hand: palm, opposed thumb, articulated fingers,
 * wrist cuff. These procedural hands are aids, not atlas anatomy. */
function supportHand() {
  const group = new THREE.Group();
  const glove = new THREE.MeshStandardMaterial({
    color: "#9ba7cf",
    roughness: 0.7,
  });
  const cuff = new THREE.MeshStandardMaterial({
    color: "#5d6fa2",
    roughness: 0.85,
  });
  const palm = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), glove);
  palm.scale.set(0.031, 0.039, 0.014);
  group.add(palm);
  for (let finger = 0; finger < 4; finger++) {
    const x = (finger - 1.5) * 0.014,
      length = [0.05, 0.059, 0.056, 0.042][finger];
    const base = new THREE.Vector3(x, 0.024, 0);
    for (let segment = 0; segment < 3; segment++) {
      const curl = segment * 0.35;
      const tip = base
        .clone()
        .add(
          new THREE.Vector3(0, Math.cos(curl), Math.sin(curl)).multiplyScalar(
            length / 3,
          ),
        );
      const bone = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.0065, length / 3 - 0.007, 3, 8),
        glove,
      );
      bone.position.copy(base).add(tip).multiplyScalar(0.5);
      bone.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        tip.clone().sub(base).normalize(),
      );
      group.add(bone);
      base.copy(tip);
    }
  }
  const thumb = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.008, 0.034, 4, 10),
    glove,
  );
  thumb.position.set(-0.034, 0.013, 0.008);
  thumb.rotation.z = -0.65;
  thumb.rotation.x = 0.5;
  group.add(thumb);
  const wrist = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.023, 0.032, 16),
    cuff,
  );
  wrist.position.y = -0.051;
  group.add(wrist);
  return group;
}

export class LasegueEngine {
  private scene = new THREE.Scene();
  private body = new THREE.Group();
  private sources = new THREE.Group();
  private camera = new THREE.PerspectiveCamera(38, 1, 0.005, 20);
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private observer: ResizeObserver;
  private intersection: IntersectionObserver;
  private visible = true;
  private abort = new AbortController();
  private meshes: AnatomyMesh[] = [];
  private rigs: RigUniforms[] = [];
  private drawMeshes: AnatomyMesh[] = [];
  private hip = new THREE.Vector3(-0.05, 0.86, -0.02);
  private ankle = new THREE.Vector3(-0.075, 0.08, -0.035);
  private pose = { value: { hip: 0, ankle: 0, support: 0 } as LaseguePose };
  private fromPose = { hip: 0, ankle: 0, support: 0 };
  private hands = [supportHand(), supportHand()];
  private arms: THREE.Mesh[] = [];
  private layers: Layers = { ...laseguePresets.completo };
  private envelopes = false;
  private profile = renderProfile(
    "auto",
    navigator.maxTouchPoints > 0 && matchMedia("(any-pointer: coarse)").matches,
  );
  private reducedMotion = matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  private selected: string | null = null;
  private focus = "corpo";
  private elapsed = 0;
  private intro = 0.7;
  private speed = 1;
  private playing = true;
  private step = 0;
  private frame = 0;
  private lastTime = 0;
  private lastReport = 0;
  private ready = false;
  private dirty = true;
  private disposed = false;
  private events: Events;
  private element: HTMLDivElement;
  constructor(
    element: HTMLDivElement,
    events: Events,
    step: number,
    quality: RenderQuality,
  ) {
    this.element = element;
    this.events = events;
    this.step = step;
    this.profile = renderProfile(
      quality,
      navigator.maxTouchPoints > 0 &&
        matchMedia("(any-pointer: coarse)").matches,
    );
    this.playing = !this.reducedMotion;
    if (this.reducedMotion) this.elapsed = lasegueDurations[step] + this.intro;
    this.pose.value = lasegueStepPose(
      step,
      this.playing ? 0 : lasegueDurations[step],
    );
    this.fromPose = { ...this.pose.value };
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
      "Lasègue em 3D: corpo deitado na maca, membro direito elevado passivamente com joelho estendido. Arraste para girar e use os controles para explorar os tecidos.",
    );
    canvas.tabIndex = 0;
    this.body.quaternion.setFromRotationMatrix(supineMatrix);
    this.scene.add(this.body);
    this.sources.visible = false;
    this.body.add(this.sources);
    this.scene.add(new THREE.HemisphereLight("#fff8f2", "#778099", 2.2));
    const key = new THREE.DirectionalLight("#fff5e8", 2.8);
    key.position.set(1.6, 3, -1.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -1.6;
    key.shadow.camera.right = 1.6;
    key.shadow.camera.top = 1.6;
    key.shadow.camera.bottom = -1.6;
    key.shadow.camera.near = 0.1;
    key.shadow.camera.far = 8;
    key.shadow.normalBias = 0.004;
    key.target.position.set(0.82, 0.15, 0);
    this.scene.add(key.target);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight("#c8cfff", 1.4);
    fill.position.set(-1, 0.6, 2);
    this.scene.add(fill);
    this.buildTable();
    const armMaterial = new THREE.MeshStandardMaterial({
      color: "#c9b2a7",
      roughness: 0.75,
      transparent: true,
      depthWrite: false,
    });
    // Fade the omitted examiner toward the elbow, avoiding a distracting cut
    // surface while leaving the wrist and support contact visible.
    armMaterial.onBeforeCompile = (shader) => {
      shader.vertexShader =
        "varying float examinerArmAlong;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nexaminerArmAlong=position.y+.5;",
      );
      shader.fragmentShader =
        "varying float examinerArmAlong;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        "#include <color_fragment>\ndiffuseColor.a*=smoothstep(.02,.35,examinerArmAlong);",
      );
    };
    armMaterial.customProgramCacheKey = () => "lasegue-examiner-support-v1";
    for (const hand of this.hands) {
      hand.traverse((object) => {
        if (object instanceof THREE.Mesh) object.castShadow = true;
      });
      this.body.add(hand);
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.021, 0.036, 1, 20, 1, true),
        armMaterial,
      );
      this.body.add(arm);
      this.arms.push(arm);
    }
    this.hands[1].scale.x = -1;
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.09;
    this.controls.minDistance = 0.35;
    this.controls.maxDistance = 6;
    this.controls.maxPolarAngle = Math.PI * 0.68;
    this.controls.addEventListener("change", () => {
      this.dirty = true;
    });
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(element);
    this.intersection = new IntersectionObserver(
      (entries) => {
        this.visible =
          entries[0].isIntersecting && entries[0].intersectionRatio >= 0.4;
        if (this.visible) {
          this.lastTime = 0;
          this.dirty = true;
        }
      },
      { threshold: [0, 0.4] },
    );
    this.intersection.observe(element);
    this.resize();
    this.view("obliqua");
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
        this.updateMaterials();
      }
    });
    this.frame = requestAnimationFrame(this.animate);
  }
  private buildTable() {
    const surface = new THREE.Mesh(
      new THREE.BoxGeometry(1.95, 0.065, 0.64, 1, 1, 1),
      new THREE.MeshStandardMaterial({ color: "#c5bbdc", roughness: 0.8 }),
    );
    surface.position.set(0.84, -0.15, 0);
    surface.receiveShadow = true;
    this.scene.add(surface);
    const edge = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.025, 0.58),
      new THREE.MeshStandardMaterial({
        color: "#7a7396",
        roughness: 0.65,
        metalness: 0.15,
      }),
    );
    edge.position.set(0.84, -0.194, 0);
    this.scene.add(edge);
    const legsMaterial = new THREE.MeshStandardMaterial({
      color: "#9a9aaa",
      roughness: 0.45,
      metalness: 0.5,
    });
    for (const x of [0.04, 1.65])
      for (const z of [-0.25, 0.25]) {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.018, 0.018, 0.4, 12),
          legsMaterial,
        );
        leg.position.set(x, -0.4, z);
        this.scene.add(leg);
      }
    const pillow = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 12),
      new THREE.MeshStandardMaterial({ color: "#ece5f7", roughness: 0.95 }),
    );
    pillow.scale.set(0.12, 0.028, 0.13);
    pillow.position.set(1.58, -0.09, 0);
    this.scene.add(pillow);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshStandardMaterial({ color: "#eee8f7", roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.61;
    ground.receiveShadow = true;
    this.scene.add(ground);
    // Soft ambient contact under the table, without another anatomical shadow pass.
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const context = shadowCanvas.getContext("2d")!;
    const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 64);
    gradient.addColorStop(0, "rgba(56,39,82,0.22)");
    gradient.addColorStop(1, "rgba(56,39,82,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(shadowCanvas);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 1.1),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0.84, -0.607, 0);
    this.scene.add(shadow);
  }
  async load() {
    try {
      const response = await fetch("/models/manifest.json", {
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
            structureId: id,
            bounds: geometry.boundingBox!.clone(),
          };
          mesh.name = object.name;
          batch.push(mesh);
          this.meshes.push(mesh);
          this.sources.add(mesh);
        });
        disposeObject(gltf.scene);
        if (asset.kind === "ossos") {
          const bounds = (id: string) => {
            const mesh = batch.find(
              (mesh) =>
                mesh.userData.structureId === id &&
                mesh.userData.bounds.max.x < 0,
            );
            if (!mesh) throw new Error(`Referência anatômica ausente: ${id}`);
            return mesh.userData.bounds as THREE.Box3;
          };
          const joints = lasegueJoints(bounds("femur"), bounds("talus"));
          this.hip.copy(joints.hip);
          this.ankle.copy(joints.ankle);
        }
        for (const mesh of batch)
          attachLasegueRig(
            mesh,
            byId[mesh.userData.structureId],
            this.hip,
            this.ankle,
            this.pose,
          );
        // Render one batch per tissue/envelope. Keep original components only for
        // CPU picking, with their structure IDs and matching deformed vertices.
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
          this.rigs.push(
            bindLasegueShader(
              { material: depthMaterial },
              this.hip,
              this.ankle,
            ),
          );
          mesh.customDepthMaterial = depthMaterial;
          mesh.receiveShadow = true;
          mesh.userData = {
            kind: structure.kind,
            envelope: !!structure.envelope,
          };
          mesh.frustumCulled = false;
          this.rigs.push(bindLasegueShader(mesh, this.hip, this.ankle));
          this.drawMeshes.push(mesh);
          this.body.add(mesh);
        }
        loaded += asset.bytes;
        this.updateMaterials();
        this.dirty = true;
        this.events.load(
          Math.round((loaded / total) * 100),
          this.meshes.length,
        );
      }
      this.ready = true;
      this.lastTime = 0;
      this.dirty = true;
      this.events.playing(this.playing);
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
    this.renderer.domElement.dataset.renderProfile = this.profile.light
      ? "light"
      : "detail";
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  }
  setQuality(quality: RenderQuality) {
    this.profile = renderProfile(
      quality,
      navigator.maxTouchPoints > 0 &&
        matchMedia("(any-pointer: coarse)").matches,
    );
    this.renderer.shadowMap.enabled = !this.profile.light;
    this.resize();
    this.updateMaterials();
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
    if (this.reducedMotion) {
      this.playing = false;
      this.elapsed = lasegueDurations[step] + this.intro;
      this.pose.value = lasegueStepPose(step, lasegueDurations[step]);
      this.events.playing(false);
    }
  }
  restart() {
    this.elapsed = 0;
    this.fromPose = { ...this.pose.value };
    this.intro =
      0.7 +
      Math.abs(this.fromPose.hip - lasegueStepPose(this.step, 0).hip) / 20;
    this.playing = true;
    this.events.playing(true);
    this.events.pose({ ...this.pose.value }, 0);
    this.dirty = true;
  }
  setPlaying(playing: boolean) {
    if (playing && this.elapsed >= lasegueDurations[this.step] + this.intro) {
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
  setAngle(angle: number) {
    this.playing = false;
    this.events.playing(false);
    this.pose.value = {
      ...this.pose.value,
      hip: THREE.MathUtils.clamp(angle, 0, 80),
      support: 1,
    };
    this.events.pose(
      { ...this.pose.value },
      Math.min(1, this.elapsed / (lasegueDurations[this.step] + this.intro)),
    );
    this.dirty = true;
  }
  view(view: string, focus = "corpo") {
    this.focus = focus;
    this.camera.up.set(0, 1, 0);
    let target = new THREE.Vector3(0.82, 0.18, 0),
      distance = 2.65;
    if (focus === "membro") {
      target = deformLaseguePoint(
        this.ankle,
        this.hip,
        this.ankle,
        this.pose.value,
        [1, 0],
      )
        .add(this.hip)
        .multiplyScalar(0.5)
        .applyMatrix4(supineMatrix);
      target.y += 0.06;
      distance = 1.5;
    }
    if (focus === "tornozelo") {
      target = deformLaseguePoint(
        this.ankle,
        this.hip,
        this.ankle,
        this.pose.value,
        [1, 0],
      ).applyMatrix4(supineMatrix);
      distance = 0.65;
    }
    distance /= Math.min(1, this.camera.aspect);
    const direction =
      view === "lateral"
        ? new THREE.Vector3(0, 0.32, -1)
        : view === "superior"
          ? new THREE.Vector3(0, 1, -0.01)
          : new THREE.Vector3(-0.4, 0.52, -1);
    if (view === "superior") this.camera.up.set(0, 0, 1);
    this.controls.target.copy(target);
    this.camera.position
      .copy(target)
      .add(direction.normalize().multiplyScalar(distance));
    this.camera.lookAt(target);
    this.controls.update();
    this.dirty = true;
  }
  private updatePose() {
    const pose = this.pose.value;
    if (this.focus === "tornozelo" || this.focus === "membro") {
      const target = deformLaseguePoint(
        this.ankle,
        this.hip,
        this.ankle,
        pose,
        [1, 0],
      );
      if (this.focus === "membro") target.add(this.hip).multiplyScalar(0.5);
      target.applyMatrix4(supineMatrix);
      if (this.focus === "membro") target.y += 0.06;
      this.camera.position.add(target.clone().sub(this.controls.target));
      this.controls.target.copy(target);
    }
    for (const rig of this.rigs) {
      rig.slrHip.value = -THREE.MathUtils.degToRad(pose.hip);
      rig.slrAnkle.value = -THREE.MathUtils.degToRad(pose.ankle);
    }
    const contacts = [
      this.ankle.clone().add(new THREE.Vector3(0, -0.035, -0.065)),
      new THREE.Vector3(this.hip.x - 0.025, 0.46, -0.11),
    ];
    for (let i = 0; i < 2; i++) {
      const hand = this.hands[i];
      hand.visible = pose.support > 0.01;
      const contact = deformLaseguePoint(
        contacts[i],
        this.hip,
        this.ankle,
        pose,
        [1, i === 0 ? 1 : 0],
      );
      contact.x -= 0.09 * (1 - pose.support);
      hand.position.copy(contact);
      hand.rotation.x = -THREE.MathUtils.degToRad(
        pose.hip + (i === 0 ? pose.ankle : 0),
      );
      const wrist = new THREE.Vector3(0, -0.064, 0)
        .applyEuler(hand.rotation)
        .add(contact);
      const elbow = wrist.clone().add(new THREE.Vector3(-0.2, -0.09, -0.015));
      const arm = this.arms[i];
      arm.visible = hand.visible;
      arm.position.copy(wrist).add(elbow).multiplyScalar(0.5);
      arm.scale.y = wrist.distanceTo(elbow);
      arm.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        wrist.clone().sub(elbow).normalize(),
      );
    }
    this.renderer.domElement.dataset.hipAngle = pose.hip.toFixed(2);
    this.renderer.domElement.dataset.ankleAngle = pose.ankle.toFixed(2);
    this.renderer.domElement.dataset.step = String(this.step);
  }
  private animate = (time: number) => {
    if (this.disposed) return;
    this.frame = requestAnimationFrame(this.animate);
    const dt = this.lastTime
      ? Math.min((time - this.lastTime) / 1000, 0.05)
      : 0;
    this.lastTime = time;
    if (document.hidden || !this.visible) return;
    const cameraChanged = this.controls.update();
    if (!this.dirty && !cameraChanged && !(this.playing && this.ready)) return;
    this.dirty = false;
    if (this.playing && this.ready) {
      this.elapsed += dt * this.speed;
      const next = lasegueStepPose(
        this.step,
        Math.max(0, this.elapsed - this.intro),
      );
      const blend = smoothMotion(this.elapsed / this.intro);
      this.pose.value = {
        hip: THREE.MathUtils.lerp(this.fromPose.hip, next.hip, blend),
        ankle: THREE.MathUtils.lerp(this.fromPose.ankle, next.ankle, blend),
        support: THREE.MathUtils.lerp(
          this.fromPose.support,
          next.support,
          blend,
        ),
      };
      if (this.elapsed >= lasegueDurations[this.step] + this.intro) {
        this.playing = false;
        this.events.playing(false);
        this.events.pose({ ...this.pose.value }, 1);
      }
    }
    this.updatePose();
    this.scene.updateMatrixWorld();
    this.renderer.render(this.scene, this.camera);
    this.renderer.domElement.dataset.drawCalls = String(
      this.renderer.info.render.calls,
    );
    if (time - this.lastReport > 100) {
      this.lastReport = time;
      this.events.pose(
        { ...this.pose.value },
        Math.min(1, this.elapsed / (lasegueDurations[this.step] + this.intro)),
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
        ).forEach((material: THREE.MeshStandardMaterial) => {
          material.map?.dispose();
          material.dispose();
        });
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
