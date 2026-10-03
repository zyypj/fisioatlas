import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw, X } from "lucide-react";
import { byId, labels } from "../../data";
import type { Kind, Layers } from "../../types";
import { LasegueEngine } from "./LasegueEngine";
import { laseguePresets, lasegueStepPose } from "./lasegueRig";
import { parseRenderQuality, QUALITY_STORAGE_KEY } from "./renderPerformance";
import type { RenderQuality } from "./renderPerformance";

export default function LasegueViewer({ step }: { step: number }) {
  const host = useRef<HTMLDivElement>(null),
    engine = useRef<LasegueEngine | null>(null);
  const [load, setLoad] = useState({ percent: 0, count: 0, error: "" }),
    [attempt, setAttempt] = useState(0);
  const [pose, setPose] = useState(() => lasegueStepPose(step, 0)),
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
    [focus, setFocus] = useState("corpo"),
    [selected, setSelected] = useState("");
  const [expanded, setExpanded] = useState(false);
  const current = useRef({ step, quality, layers, envelopes, speed });
  useEffect(() => {
    current.current = { step, quality, layers, envelopes, speed };
  }, [step, quality, layers, envelopes, speed]);
  useEffect(() => {
    if (!host.current) return;
    let instance: LasegueEngine;
    try {
      instance = new LasegueEngine(
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
        current.current.step,
        current.current.quality,
      );
      engine.current = instance;
      instance.setLayers(current.current.layers, current.current.envelopes);
      instance.setSpeed(current.current.speed);
      void instance.load();
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
      instance.dispose();
      engine.current = null;
    };
  }, [attempt]);
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
  return (
    <section
      className={`lasegue-viewer ${expanded ? "expanded" : ""}`}
      aria-label="Demonstração anatômica 3D do Lasègue"
    >
      <div className="lasegue-toolbar">
        <div>
          <span className="eyebrow">ANATOMIA 3D · MEMBRO DIREITO</span>
          <strong>
            {
              [
                "Posicionar e apoiar",
                "Elevar passivamente",
                "Observar a resposta",
                "Reduzir e diferenciar",
                "Retornar com apoio",
              ][step]
            }
          </strong>
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
          <span>
            Quadril <strong>{pose.hip.toFixed(1)}°</strong>
          </span>
          <span>
            Joelho <strong>estendido</strong>
          </span>
          <span>
            Tornozelo <strong>{pose.ankle.toFixed(1)}°</strong>
          </span>
        </div>
        <div className="lasegue-selection">
          {selected
            ? byId[selected]?.name
            : "Arraste para girar · toque em uma estrutura para identificá-la"}
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
            aria-label="Velocidade da animação do Lasègue"
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
      <progress
        className="lasegue-animation-progress"
        max={1}
        value={progress}
        aria-label="Progresso da animação da etapa"
      />
      <div className="lasegue-camera-controls">
        <label>
          Vista
          <select
            aria-label="Vista do Lasègue 3D"
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
            aria-label="Enquadramento do Lasègue 3D"
            value={focus}
            onChange={(event) => setCamera(view, event.target.value)}
          >
            <option value="corpo">Corpo e maca</option>
            <option value="membro">Membro inferior</option>
            <option value="tornozelo">Tornozelo e apoio</option>
          </select>
        </label>
        <label>
          Qualidade
          <select
            aria-label="Qualidade do Lasègue 3D"
            value={quality}
            onChange={(event) => {
              const next = parseRenderQuality(event.target.value);
              setQuality(next);
              engine.current?.setQuality(next);
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
      <label className="lasegue-angle">
        Explorar flexão do quadril · {pose.hip.toFixed(1)}°
        <input
          aria-label="Flexão do quadril no Lasègue 3D"
          type="range"
          min="0"
          max="80"
          step="1"
          value={Math.round(pose.hip)}
          disabled={!ready}
          onChange={(event) => engine.current?.setAngle(+event.target.value)}
        />
      </label>
      <div
        className="lasegue-presets"
        role="group"
        aria-label="Tecidos do Lasègue 3D"
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
              aria-label={`${labels[kind]} no Lasègue 3D`}
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
        Mãos de apoio ilustram o examinador. Movimento e deformação dos tecidos
        são aproximações didáticas, sem simulação de sintomas. A amplitude
        demonstrada não define o resultado do teste.
      </small>
    </section>
  );
}
