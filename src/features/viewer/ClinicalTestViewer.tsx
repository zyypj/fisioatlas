import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw, X } from "lucide-react";
import { byId, labels } from "../../data";
import type { ClinicalTest } from "../../data/clinicalTests";
import type { Kind, Layers } from "../../types";
import { ClinicalEngine } from "./ClinicalEngine";
import type { ClinicalAnimation } from "./clinicalAnimation";
import { stepStartPose } from "./clinicalAnimation";
import { poseReadout } from "./clinicalReadout";
import { laseguePresets } from "./lasegueRig";
import { parseRenderQuality, QUALITY_STORAGE_KEY } from "./renderPerformance";
import type { RenderQuality } from "./renderPerformance";

export default function ClinicalTestViewer({
  test,
  animation,
  step,
}: {
  test: ClinicalTest;
  animation: ClinicalAnimation;
  step: number;
}) {
  const side = animation.side ?? "direito";
  const host = useRef<HTMLDivElement>(null),
    engine = useRef<ClinicalEngine | null>(null);
  const [load, setLoad] = useState({ percent: 0, count: 0, error: "" }),
    [attempt, setAttempt] = useState(0);
  const [pose, setPose] = useState(() => stepStartPose(animation, step)),
    [progress, setProgress] = useState(0),
    [playing, setPlaying] = useState(false);
  const [layers, setLayers] = useState<Layers>({ ...laseguePresets.completo }),
    [envelopes, setEnvelopes] = useState(false);
  const [quality, setQuality] = useState<RenderQuality>(() => {
    try {
      return parseRenderQuality(localStorage.getItem(QUALITY_STORAGE_KEY));
    } catch {
      return "auto";
    }
  });
  const [speed, setSpeed] = useState(1),
    [view, setView] = useState("obliqua"),
    [focus, setFocus] = useState("articulacao"),
    [selected, setSelected] = useState("");
  const [expanded, setExpanded] = useState(false);
  const current = useRef({ step, layers, envelopes, speed, view, focus });
  const savedView = useRef<ReturnType<ClinicalEngine["captureView"]> | null>(
    null,
  );
  useEffect(() => {
    current.current = { step, layers, envelopes, speed, view, focus };
  }, [step, layers, envelopes, speed, view, focus]);
  useEffect(() => {
    if (!host.current) return;
    let instance: ClinicalEngine;
    try {
      instance = new ClinicalEngine(
        host.current,
        {
          load: (percent, count, error) =>
            setLoad({ percent, count, error: error || "" }),
          pose: (next, fraction) => {
            setPose(next);
            setProgress(fraction);
          },
          playing: setPlaying,
          select: setSelected,
        },
        animation,
        current.current.step,
        quality,
        test.name,
      );
      engine.current = instance;
      instance.setLayers(current.current.layers, current.current.envelopes);
      instance.setSpeed(current.current.speed);
      instance.view(current.current.view, current.current.focus);
      void instance.load().then(() => {
        if (engine.current !== instance) return;
        if (savedView.current) instance.restoreView(savedView.current);
        else instance.view(current.current.view, current.current.focus);
      });
    } catch {
      queueMicrotask(() =>
        setLoad({
          percent: 0,
          count: 0,
          error:
            "O navegador não conseguiu iniciar o 3D. Verifique se WebGL está disponível e tente novamente.",
        }),
      );
      return;
    }
    return () => {
      savedView.current = instance.captureView() ?? savedView.current;
      instance.dispose();
      engine.current = null;
    };
  }, [attempt, quality, animation, test.name]);
  useEffect(() => {
    engine.current?.setStep(step);
  }, [step]);
  useEffect(() => {
    engine.current?.setLayers(layers, envelopes);
  }, [layers, envelopes]);
  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);
  const ready = load.percent === 100 && !load.error;
  const setCamera = (nextView: string, nextFocus: string) => {
    setView(nextView);
    setFocus(nextFocus);
    engine.current?.view(nextView, nextFocus);
  };
  const readout = poseReadout(pose, side);
  return (
    <section
      className={`lasegue-viewer ${expanded ? "expanded" : ""}`}
      aria-label={`Demonstração anatômica 3D: ${test.name}`}
    >
      <div className="lasegue-toolbar">
        <div>
          <span className="eyebrow">
            ANATOMIA 3D · MEMBRO {side === "direito" ? "DIREITO" : "ESQUERDO"}
          </span>
          <strong>{test.steps[step]?.title}</strong>
        </div>
        <button
          className="secondary"
          onClick={() => setExpanded(!expanded)}
          aria-label={
            expanded
              ? "Fechar visualização ampliada"
              : "Ampliar visualização 3D"
          }
        >
          {expanded ? <X size={17} /> : <Maximize2 size={17} />}
        </button>
      </div>
      <div className="lasegue-scene" ref={host}>
        {!ready && (
          <div className="lasegue-loading" role="status">
            {load.error ? (
              <>
                <strong>Não foi possível carregar a anatomia.</strong>
                <p>{load.error}</p>
                <button
                  className="secondary"
                  onClick={() => {
                    setLoad({ percent: 0, count: 0, error: "" });
                    setAttempt((value) => value + 1);
                  }}
                >
                  Tentar novamente
                </button>
              </>
            ) : (
              <>
                <strong>Carregando as malhas do atlas · {load.percent}%</strong>
                <span>
                  Ossos, músculos, articulações, ligamentos, tendões e nervos
                </span>
              </>
            )}
          </div>
        )}
        <div className="lasegue-readout">
          {readout.length ? (
            readout.map(([label, value]) => (
              <span key={label}>
                {label} <strong>{value}</strong>
              </span>
            ))
          ) : (
            <span>Posição inicial</span>
          )}
        </div>
        <div className="lasegue-selection">
          {selected
            ? byId[selected]?.name
            : "Arraste para girar · setas mostram onde o examinador aplica a força"}
        </div>
      </div>
      <div className="lasegue-control-row">
        <button
          className="primary"
          disabled={!ready}
          onClick={() => engine.current?.setPlaying(!playing)}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}{" "}
          {playing
            ? "Pausar animação"
            : progress >= 1
              ? "Reproduzir etapa"
              : "Continuar animação"}
        </button>
        <button
          className="secondary"
          disabled={!ready}
          onClick={() => engine.current?.restart()}
        >
          <RotateCcw size={16} /> Repetir etapa
        </button>
        <label>
          Velocidade
          <select
            aria-label={`Velocidade da animação: ${test.name}`}
            value={speed}
            onChange={(event) => {
              setSpeed(+event.target.value);
              engine.current?.setSpeed(+event.target.value);
            }}
          >
            <option value="0.5">0,5× · lenta</option>
            <option value="1">1× · normal</option>
            <option value="1.5">1,5×</option>
          </select>
        </label>
      </div>
      <label className="lasegue-angle">
        Percorrer a etapa · {Math.round(progress * 100)}%
        <input
          aria-label={`Posição da animação da etapa: ${test.name}`}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          disabled={!ready}
          onChange={(event) => engine.current?.seek(+event.target.value)}
        />
      </label>
      <div className="lasegue-camera-controls">
        <label>
          Vista
          <select
            aria-label={`Vista 3D: ${test.name}`}
            value={view}
            onChange={(event) => setCamera(event.target.value, focus)}
          >
            <option value="obliqua">Oblíqua</option>
            <option value="lateral">Lateral</option>
            <option value="superior">Superior</option>
          </select>
        </label>
        <label>
          Enquadramento
          <select
            aria-label={`Enquadramento 3D: ${test.name}`}
            value={focus}
            onChange={(event) => setCamera(view, event.target.value)}
          >
            <option value="articulacao">Região testada</option>
            <option value="corpo">Corpo inteiro</option>
          </select>
        </label>
        <label>
          Qualidade
          <select
            aria-label={`Qualidade 3D: ${test.name}`}
            value={quality}
            onChange={(event) => {
              const next = parseRenderQuality(event.target.value);
              setQuality(next);
              try {
                localStorage.setItem(QUALITY_STORAGE_KEY, next);
              } catch {
                /* Preferência opcional. */
              }
            }}
          >
            <option value="auto">Automática</option>
            <option value="light">Leve · tablet</option>
            <option value="detail">Mais detalhes</option>
          </select>
        </label>
      </div>
      <div
        className="lasegue-presets"
        role="group"
        aria-label={`Tecidos 3D: ${test.name}`}
      >
        {[
          ["completo", "Todos os tecidos"],
          ["ossos", "Ossos e articulações"],
          ["neural", "Via neural"],
        ].map(([id, name]) => (
          <button
            className="secondary"
            key={id}
            aria-pressed={(Object.keys(labels) as Kind[]).every(
              (kind) => layers[kind] === laseguePresets[id][kind],
            )}
            onClick={() => setLayers({ ...laseguePresets[id] })}
          >
            {name}
          </button>
        ))}
      </div>
      <details className="lasegue-layer-controls">
        <summary>Camadas e transparência · ajustar cada tecido</summary>
        {(Object.keys(labels) as Kind[]).map((kind) => (
          <label key={kind}>
            {labels[kind]} <span>{layers[kind]}%</span>
            <input
              aria-label={`${labels[kind]} no 3D`}
              type="range"
              min="0"
              max="100"
              value={layers[kind]}
              onChange={(event) =>
                setLayers((old) => ({ ...old, [kind]: +event.target.value }))
              }
            />
          </label>
        ))}
        <label className="check-label">
          <input
            type="checkbox"
            checked={envelopes}
            onChange={(event) => setEnvelopes(event.target.checked)}
          />{" "}
          Mostrar fáscias de revestimento
        </label>
      </details>
      <small className="lasegue-provenance">
        Malhas do mesmo atlas anatômico · {load.count} componentes carregados.
        Setas indicam onde e para onde o examinador aplica a força. Movimento e
        deformação dos tecidos são aproximações didáticas; amplitudes e
        translações são ampliadas para ficarem visíveis e não definem o
        resultado do teste.
      </small>
    </section>
  );
}
