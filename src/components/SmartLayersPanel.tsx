import { byId } from "../data";
import type { Structure } from "../types";
import type { RevealMode } from "../features/viewer/smartLayers";

export function SmartLayersPanel(p: {
  selected: Structure | null;
  mode: RevealMode;
  regionOnly: boolean;
  occluders: string[];
  hidden: string[];
  transparent: string[];
  onMode: (mode: RevealMode) => void;
  onRegion: (value: boolean) => void;
  onBestView: () => void;
  onHide: (id: string) => void;
  onRestore: (id: string) => void;
  onReset: () => void;
}) {
  const adjusted = [...new Set([...p.hidden, ...p.transparent])].filter(
    (id) => byId[id],
  );
  return (
    <section className="smart-layer-panel" aria-label="Camadas inteligentes">
      <span className="eyebrow">CAMADAS INTELIGENTES</span>
      <h3>
        {p.selected
          ? `Revelar ${p.selected.name.toLowerCase()}`
          : "Selecione uma estrutura no atlas"}
      </h3>
      <p>
        A revelação acompanha o ângulo da câmera e preserva a estrutura
        escolhida.
      </p>
      <label htmlFor="reveal-mode">Estruturas na frente</label>
      <select
        id="reveal-mode"
        disabled={!p.selected}
        value={p.mode}
        onChange={(e) => p.onMode(e.target.value as RevealMode)}
      >
        <option value="ghost">Suavizar automaticamente</option>
        <option value="hide">Ocultar automaticamente</option>
        <option value="off">Manter todas visíveis</option>
      </select>
      <label className="check-label">
        <input
          type="checkbox"
          disabled={!p.selected}
          checked={p.regionOnly}
          onChange={(e) => p.onRegion(e.target.checked)}
        />{" "}
        Estudar somente o entorno da seleção
      </label>
      <div className="two-buttons">
        <button
          className="secondary"
          disabled={!p.selected}
          onClick={p.onBestView}
        >
          Buscar melhor ângulo
        </button>
        <button className="secondary" onClick={p.onReset}>
          Restaurar visualização
        </button>
      </div>
      <small>
        Estimativa pela posição das malhas; não representa uma classificação
        anatômica de profundidade. Você pode ajustar cada estrutura.
      </small>
      {p.selected && p.mode !== "off" && (
        <details>
          <summary>{p.occluders.length} estruturas na frente · revisar</summary>
          {p.occluders.length ? (
            p.occluders.map((id) => (
              <div className="layer-adjustment" key={id}>
                <span>{byId[id]?.name}</span>
                <button onClick={() => p.onHide(id)}>
                  Ocultar manualmente
                </button>
              </div>
            ))
          ) : (
            <p>Nenhuma interferência estimada neste ângulo.</p>
          )}
        </details>
      )}
      {!!adjusted.length && (
        <details>
          <summary>{adjusted.length} ajustes manuais · desfazer</summary>
          {adjusted.slice(0, 30).map((id) => (
            <div className="layer-adjustment" key={id}>
              <span>{byId[id].name}</span>
              <button onClick={() => p.onRestore(id)}>Restaurar</button>
            </div>
          ))}
          {adjusted.length > 30 && (
            <small>
              Exibindo 30 ajustes. Use Restaurar visualização para remover
              todos.
            </small>
          )}
        </details>
      )}
    </section>
  );
}
