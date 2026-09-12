import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const parts = [
  [
    "Osso",
    "Osso",
    "As extremidades ósseas formam as superfícies da articulação.",
  ],
  [
    "Cartilagem",
    "Cartilagem articular",
    "Reveste as superfícies ósseas e reduz o atrito.",
  ],
  [
    "Capsula",
    "Cápsula fibrosa",
    "Envolve a articulação e contribui para sua estabilidade.",
  ],
  [
    "Membrana",
    "Membrana sinovial",
    "Reveste internamente a cápsula e produz o líquido sinovial.",
  ],
  [
    "Ligamento",
    "Ligamentos",
    "Conectam os ossos e limitam movimentos excessivos.",
  ],
];
export default function JointLesson() {
  const host = useRef<HTMLDivElement>(null);
  const objects = useRef<THREE.Mesh[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    const el = host.current;
    let alive = true,
      frame = 0;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // WebGL is an external browser capability, discovered during setup.
      // oxlint-disable-next-line react/set-state-in-effect
      setError(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute(
      "aria-label",
      "Esquema 3D de articulação sinovial; arraste para girar. Use os botões para destacar as partes.",
    );
    renderer.domElement.setAttribute("role", "img");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.001, 10);
    camera.position.set(0.18, 0.1, 0.68);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0.28;
    controls.maxDistance = 1.5;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x828571, 2.5));
    const light = new THREE.DirectionalLight(0xffffff, 2.2);
    light.position.set(1, 2, 3);
    scene.add(light);
    const resize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    new GLTFLoader().load(
      "/lessons/synovial.glb",
      (gltf) => {
        if (!alive) {
          gltf.scene.traverse((o) => {
            if (o instanceof THREE.Mesh) {
              o.geometry.dispose();
              (Array.isArray(o.material) ? o.material : [o.material]).forEach(
                (m) => m.dispose(),
              );
            }
          });
          return;
        }
        gltf.scene.traverse((o) => {
          if (o instanceof THREE.Light || o instanceof THREE.Camera)
            o.visible = false;
          if (o instanceof THREE.Mesh) {
            o.material = new THREE.MeshStandardMaterial({
              color: (o.material as THREE.MeshStandardMaterial).color,
              roughness: 0.55,
              side: THREE.DoubleSide,
            });
            objects.current.push(o);
          }
        });
        scene.add(gltf.scene);
        setReady(true);
      },
      undefined,
      () => {
        if (alive) setError(true);
      },
    );
    const render = () => {
      frame = requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            m.dispose(),
          );
        }
      });
      objects.current = [];
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  useEffect(() => {
    for (const mesh of objects.current) {
      const m = mesh.material as THREE.MeshStandardMaterial;
      const active = mesh.name.startsWith(selected);
      // Imperative Three.js material, owned by this component, not React state.
      // oxlint-disable-next-line react/immutability
      m.transparent = !!selected && !active;
      m.opacity = selected && !active ? 0.16 : 1;
      m.depthWrite = !m.transparent;
      m.emissive.set(active && selected ? "#4a1b2c" : "#000000");
    }
  }, [selected, ready]);
  return (
    <article className="joint-lesson">
      <div>
        <span className="eyebrow">LABORATÓRIO · HIGGSFIELD 3D</span>
        <h2>Por dentro de uma articulação sinovial</h2>
        <p>
          Gire o modelo e destaque suas partes. O espaço entre as cartilagens
          representa a cavidade articular.
        </p>
      </div>
      <div className="joint-lesson-grid">
        <div className="joint-lesson-canvas" ref={host}>
          {error && (
            <img
              src="/lessons/synovial.png"
              alt="Esquema de articulação em corte"
            />
          )}
          {!ready && !error && <span>Carregando esquema 3D…</span>}
        </div>
        <div className="joint-lesson-parts">
          {parts.map(([id, label, description]) => (
            <button
              key={id}
              className={selected === id ? "selected" : ""}
              aria-pressed={selected === id}
              onClick={() => setSelected(selected === id ? "" : id)}
            >
              <strong>{label}</strong>
              <span>{description}</span>
            </button>
          ))}
          <button onClick={() => setSelected("")}>
            Mostrar todas as partes
          </button>
        </div>
      </div>
      <p className="availability">
        Esquema genérico ampliado, construído no Higgsfield. As formas e o
        espaço articular foram simplificados para ensino; não correspondem a uma
        articulação específica.{" "}
        <a
          href="https://openstax.org/books/anatomy-and-physiology-2e/pages/9-4-synovial-joints"
          target="_blank"
          rel="noreferrer"
        >
          Referência: OpenStax
        </a>
        .
      </p>
    </article>
  );
}
