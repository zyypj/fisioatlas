import { Pause, Play, RotateCcw, Users } from "lucide-react";
import type { Movement, Layers, Kind } from "../../types";
import { byId } from "../../data";
import { movements } from "../../data/movements";
import { MechanicsPanel } from './MechanicsPanel';
import type { MechanicsOptions, MechanicsReport } from './biomechanics';
interface Props {
  movement: Movement;
  playing: boolean;
  speed: number;
  progress: number;
  agonists: boolean;
  motionMode: "all" | "bones";
  layers: Layers;
  onMotionMode: (mode: "all" | "bones") => void;
  onLayer: (kind: Kind, value: number) => void;
  onMovement: (id: string) => void;
  onPlay: () => void;
  onSpeed: (n: number) => void;
  onProgress: (n: number) => void;
  onAgonists: () => void;
  onSelect: (id: string) => void;
  mechanics: MechanicsOptions;
  mechanicsReport: MechanicsReport | null;
  onMechanics: (options: MechanicsOptions) => void;
  onFocus: (id:string) => void;
}
export function MovementPanel(p: Props) {
  const m = p.movement;
  return (
    <aside className="info-panel movement-panel">
      <span className="eyebrow">LABORATÓRIO DE MOVIMENTO</span>
      <h2>
        Veja. Pause.
        <br />
        Compreenda.
      </h2>
      <label className="field-label">
        Articulação
        <select
          value={m.joint}
          onChange={(e) =>
            p.onMovement(movements.find((x) => x.joint === e.target.value)!.id)
          }
        >
          {[...new Set(movements.map((x) => x.joint))].map((id) => (
            <option key={id} value={id}>
              {byId[id].name}
            </option>
          ))}
        </select>
      </label>
      <label className="field-label">
        Movimento
        <select value={m.id} onChange={(e) => p.onMovement(e.target.value)}>
          {movements
            .filter((x) => x.joint === m.joint)
            .map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
        </select>
      </label>
      <div className="simple-box">
        <span>O QUE ACONTECE?</span>
        <p>{m.summary}</p>
      </div>
      <div className="plane-grid">
        <div>
          <small>PLANO</small>
          <strong>{m.plane}</strong>
        </div>
        <div>
          <small>EIXO</small>
          <strong>{m.axis}</strong>
        </div>
      </div>
      <div className="animation-controls">
        <button className="primary" onClick={p.onPlay}>
          {p.playing ? <Pause size={16} /> : <Play size={16} />}{" "}
          {p.playing ? "Pausar" : "Reproduzir movimento"}
        </button>
        <div className="timeline">
          <button
            aria-label="Reiniciar movimento"
            className="icon-button"
            onClick={() => p.onProgress(0)}
          >
            <RotateCcw size={16} />
          </button>
          <input
            aria-label="Posição da animação"
            type="range"
            min="0"
            max="1"
            step=".001"
            value={p.progress}
            onChange={(e) => p.onProgress(+e.target.value)}
          />
          <span>
            {Math.round(
              (m.reverse
                ? (1 + Math.cos(p.progress * 2 * Math.PI)) / 2
                : (1 - Math.cos(p.progress * 2 * Math.PI)) / 2) *
                Math.abs(m.maxAngle),
            )}
            °
          </span>
        </div>
        <div className="speed">
          <span>Velocidade</span>
          {[0.5, 1, 1.5].map((n) => (
            <button
              key={n}
              className={p.speed === n ? "active" : ""}
              onClick={() => p.onSpeed(n)}
            >
              {n}x
            </button>
          ))}
        </div>
      </div>
      <p className="availability">
        Movimento do lado direito. Ative todos os tecidos para explorar sua
        resposta mecânica no painel abaixo. Ângulo ilustrativo; parâmetros não calibrados para uso clínico.
      </p>
      <label className="field-label">
        Estruturas em movimento
        <select value={p.motionMode} onChange={e => p.onMotionMode(e.target.value as "all" | "bones")}>
          <option value="all">Todos os tecidos disponíveis</option>
          <option value="bones">Somente ossos</option>
        </select>
      </label>
      <MechanicsPanel movement={m} options={p.mechanics} report={p.mechanicsReport} active={p.motionMode==='all'&&!p.agonists} onChange={p.onMechanics} onFocus={p.onFocus} />
      {p.motionMode === "all" && <fieldset className="motion-layers">
        <legend>Visibilidade durante o movimento</legend>
        <p className="availability">As camadas mostram as malhas disponíveis. Há tendões próprios no pé, tornozelo e pescoço; a cobertura tendínea dos demais segmentos ainda é parcial.</p>
        {Object.entries({ossos:'Ossos',musculos:'Músculos',articulacoes:'Articulações',ligamentos:'Ligamentos',tendoes:'Tendões',nervos:'Nervos'}).map(([kind,label]) => <label key={kind}>
          <span>{label}</span>
          <input type="range" aria-label={`${label} no movimento`} min="0" max="100" value={p.layers[kind as Kind]} onChange={e=>p.onLayer(kind as Kind,+e.target.value)} />
          <output>{p.layers[kind as Kind]}%</output>
        </label>)}
      </fieldset>}
      <button
        className={`secondary full ${p.agonists ? "selected" : ""}`}
        onClick={p.onAgonists}
      >
        <Users size={16} />
        {p.agonists
          ? "Voltar ao movimento"
          : "Mostre-me quem faz esse movimento"}
      </button>
      <section className="related">
        <h3>Principais agonistas</h3>
        <div>
          {m.agonists.map((id) => (
            <button key={id} onClick={() => p.onSelect(id)}>
              {byId[id].name} ↗
            </button>
          ))}
        </div>
        <h3>Antagonistas</h3>
        <div>
          {m.antagonists.map((id) => (
            <button key={id} onClick={() => p.onSelect(id)}>
              {byId[id].name} ↗
            </button>
          ))}
        </div>
      </section>
      <div className="practice-box">
        <span>NA PRÁTICA</span>
        <p>{m.example}</p>
        <small>Exemplo de exercício: {m.exercise}</small>
      </div>
    </aside>
  );
}
