import { useEffect, useRef, useState } from "react";
import {
  RotateCcw,
  Focus,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  MousePointer2,
  Rotate3D,
  X,
  Layers3,
} from "lucide-react";
import { AtlasEngine } from "./AtlasEngine";
import type { ViewerState } from "./AtlasEngine";
import { byId } from "../../data";
import type { MechanicsReport } from '../movements/biomechanics';

interface Props {
  state: ViewerState;
  onSelect: (id: string) => void;
  onIsolate: (id: string) => void;
  onHide: (id: string) => void;
  onTransparent: (id: string) => void;
  onReset: () => void;
  onProgress: (n: number) => void;
  onLayers: () => void;
  onMechanics: (report: MechanicsReport) => void;
  command: { type: string; value?: string; nonce: number };
}
export default function Viewer(props: Props) {
  const host = useRef<HTMLDivElement>(null),
    engine = useRef<AtlasEngine | null>(null),
    callbacks = useRef(props);
  const [view, setView] = useState("anterior"),
    [size, setSize] = useState({ width: 600, height: 600 });
  const [load, setLoad] = useState({ percent: 0, count: 0, error: "" }),
    [tooltip, setTooltip] = useState({ text: "", x: 0, y: 0 }),
    [context, setContext] = useState<{
      id: string;
      x: number;
      y: number;
    } | null>(null),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    callbacks.current = props;
    engine.current?.apply(props.state);
  }, [props]);
  useEffect(() => {
    if (!host.current) return;
    const resize = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ width: r.width, height: r.height });
    });
    resize.observe(host.current);
    try {
      const e = new AtlasEngine(
        host.current,
        {
          select: (id) => callbacks.current.onSelect(id),
          isolate: (id) => callbacks.current.onIsolate(id),
          hover: (text, x, y) =>
            setTooltip((old) =>
              old.text === text &&
              Math.abs(old.x - x) < 5 &&
              Math.abs(old.y - y) < 5
                ? old
                : { text, x, y },
            ),
          context: (id, x, y) => setContext({ id, x, y }),
          load: (percent, count, error) =>
            setLoad({ percent, count, error: error || "" }),
          progress: (n) => callbacks.current.onProgress(n),
          view: setView,
          mechanics: (report) => callbacks.current.onMechanics(report),
        },
        callbacks.current.state,
      );
      engine.current = e;
      e.load();
      return () => {
        resize.disconnect();
        e.dispose();
        engine.current = null;
      };
    } catch {
      resize.disconnect();
      queueMicrotask(() =>
        setLoad({
          percent: 0,
          count: 0,
          error:
            "A visualização 3D precisa de WebGL disponível no navegador. Você pode continuar estudando pelas fichas.",
        }),
      );
    }
  }, [attempt]);
  useEffect(() => {
    const e = engine.current;
    if (!e) return;
    const c = props.command;
    if (c.type === "reset") e.reset();
    if (c.type === "focus-tissue" && c.value) e.focus(c.value);
    if (c.type === "preset") e.preset(c.value || "anterior");
    if (c.type === "focus" && callbacks.current.state.selected)
      e.focus(callbacks.current.state.selected);
  }, [props.command]);
  const selected = props.state.selected ? byId[props.state.selected] : null;
  return (
    <section
      className="viewer"
      aria-label="Atlas anatômico interativo"
      onClick={() => context && setContext(null)}
    >
      <div className="viewer-title">
        <span className="eyebrow">ATLAS INTERATIVO</span>
        <h1>
          {props.state.movement
            ? props.state.movement.name
            : selected
              ? selected.region
              : "O corpo, em perspectiva."}
        </h1>
        <p>
          {props.state.movement
            ? "Observe o movimento por diferentes ângulos."
            : selected
              ? "Explore as relações. Conecte o conhecimento."
              : "Uma estrutura de cada vez. Um novo jeito de aprender."}
        </p>
      </div>
      <div className="viewer-canvas" ref={host} />
      <div className="view-cube">
        <span>VISTA</span>
        <select
          aria-label="Orientação da câmera"
          value={view}
          onChange={(e) => {
            setView(e.target.value);
            if (e.target.value !== "livre")
              engine.current?.preset(e.target.value);
          }}
        >
          <option value="livre">Livre · arraste</option>
          <option value="anterior">Anterior</option>
          <option value="posterior">Posterior</option>
          <option value="lateral-direita">Lateral direita</option>
          <option value="lateral-esquerda">Lateral esquerda</option>
          <option value="superior">Superior</option>
          <option value="inferior">Inferior</option>
        </select>
      </div>
      {props.state.isolated && (
        <button className="isolation-tag" onClick={props.onReset}>
          <Eye size={14} /> Estrutura isolada <X size={14} />
        </button>
      )}
      {props.state.plane && (
        <div className="plane-tag">
          Plano {props.state.plane.toLowerCase()} • lâmina semitransparente
        </div>
      )}
      {props.state.terms && (
        <div className="plane-tag">
          ↑ Superior · ↓ Inferior · Laterais ↔ · Anterior: seta à frente
        </div>
      )}
      {load.percent < 100 && !load.error && (
        <div
          className={`model-loading ${load.count ? "progress-corner" : ""}`}
          role="status"
        >
          <Rotate3D size={28} />
          <strong>Preparando o atlas anatômico...</strong>
          <progress value={load.percent} max={100} />
          <span>
            {load.percent}% · {load.count} malhas disponíveis
          </span>
        </div>
      )}
      {load.error && (
        <div className="model-loading error" role="alert">
          <strong>O modelo precisa de atenção</strong>
          <p>{load.error}</p>
          <button
            className="primary"
            onClick={() => {
              setLoad({ percent: 0, count: 0, error: "" });
              setAttempt((a) => a + 1);
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}
      {tooltip.text && !context && (
        <div
          className="mesh-tooltip"
          style={{
            left: Math.min(tooltip.x + 12, size.width - 180),
            top: tooltip.y - 40,
          }}
        >
          {tooltip.text}
        </div>
      )}
      {context && (
        <div
          className="mesh-context"
          style={{
            left: Math.min(context.x, size.width - 180),
            top: Math.min(context.y, size.height - 200),
          }}
        >
          <strong>{byId[context.id]?.name}</strong>
          <button onClick={() => props.onIsolate(context.id)}>
            Isolar estrutura
          </button>
          <button onClick={() => props.onHide(context.id)}>Ocultar</button>
          <button onClick={() => props.onTransparent(context.id)}>
            Tornar transparente
          </button>
          <button onClick={() => engine.current?.focus(context.id)}>
            Focar
          </button>
        </div>
      )}
      <div className="viewer-rail">
        <button
          title="Aproximar"
          aria-label="Aproximar"
          onClick={() => engine.current?.zoom(0.8)}
        >
          <ZoomIn size={19} />
        </button>
        <button
          title="Afastar"
          aria-label="Afastar"
          onClick={() => engine.current?.zoom(1.25)}
        >
          <ZoomOut size={19} />
        </button>
        <span />
        <button
          title="Corpo inteiro"
          aria-label="Corpo inteiro"
          onClick={() => {
            props.onReset();
            engine.current?.reset();
          }}
        >
          <Maximize2 size={18} />
        </button>
      </div>
      <div className="viewer-bottom">
        <div className="viewer-toolbar">
          <button
            onClick={() => {
              props.onReset();
              engine.current?.reset();
            }}
          >
            <RotateCcw size={17} />
            <span>Redefinir</span>
          </button>
          <button
            disabled={!selected}
            onClick={() => selected && engine.current?.focus(selected.id)}
          >
            <Focus size={17} />
            <span>Focar</span>
          </button>
          <button
            disabled={!selected}
            className={props.state.isolated ? "active" : ""}
            onClick={() => selected && props.onIsolate(selected.id)}
          >
            <Eye size={17} />
            <span>Isolar</span>
          </button>
          <button onClick={props.onLayers}>
            <Layers3 size={17} />
            <span>Camadas</span>
          </button>
        </div>
        <p className="viewer-hint">
          <MousePointer2 size={13} /> Arraste para girar <i /> Role para
          aproximar <i /> Clique para explorar
        </p>
      </div>
      <div className="model-credit">
        Z-Anatomy / BodyParts3D <span>•</span> CC BY-SA 4.0
      </div>
    </section>
  );
}
