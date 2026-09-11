import {
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronRight,
  Eye,
  Info,
  Link2,
  Play,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Structure } from "../types";
import { byId, labels } from "../data";
import { movements } from "../data/movements";
import { sources } from "../data/sources";

interface Props {
  selected: Structure | null;
  favorites: string[];
  onFavorite: (id: string) => void;
  onSelect: (id: string) => void;
  onClose: () => void;
  onIsolate: () => void;
  onMovement: (id: string) => void;
  onCompare: (id: string) => void;
}
export function StructurePanel({ selected: s, ...p }: Props) {
  const [tab, setTab] = useState("resumo"),
    [copied, setCopied] = useState(false),
    [attachments, setAttachments] = useState(false);
  if (!s)
    return (
      <aside className="info-panel welcome-panel">
        <span className="eyebrow">SEU ESPAÇO DE DESCOBERTA</span>
        <div className="welcome-symbol">
          <MouseAnatomy />
        </div>
        <h2>
          Entenda cada parte.
          <br />
          Conecte o todo.
        </h2>
        <p>
          Selecione uma estrutura no corpo ou pesquise pelo nome para começar a
          explorar.
        </p>
        <div className="mini-divider" />
        <h3>Um bom lugar para começar</h3>
        {[
          ["supraespinal", "O equilíbrio do ombro"],
          ["biceps-braquial", "Muito além da flexão"],
          ["femur", "Sustentação em movimento"],
          ["joelho", "Mobilidade e estabilidade"],
        ].map(([id, desc]) => (
          <button
            key={id}
            className="suggestion"
            onClick={() => p.onSelect(id)}
          >
            <span className={`structure-symbol ${byId[id].kind}`}>
              {byId[id].kind === "ossos" ? "◈" : "◉"}
            </span>
            <span>
              <strong>{byId[id].name}</strong>
              <small>{desc}</small>
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
        <div className="study-tip">
          <span>✧ DICA DE ESTUDO</span>
          <p>
            Comece pela localização. Depois, descubra a função e veja o
            movimento acontecer.
          </p>
        </div>
      </aside>
    );
  const relatedMoves = movements.filter(
    (m) => m.agonists.includes(s.id) || m.joint === s.id,
  );
  const fields = Object.entries(s.fields);
  const visible =
    tab === "detalhes"
      ? fields
      : fields
          .filter(([k]) =>
            [
              "Origem",
              "Inserção",
              "Inervação",
              "Classificação",
              "Superfícies articulares",
              "Principais partes",
              "Tipo",
            ].includes(k),
          )
          .slice(0, 4);
  return (
    <aside className="info-panel" key={s.id}>
      <div className="panel-top">
        <span className="category-pill">{labels[s.kind]}</span>
        <div>
          <button
            className="icon-button"
            aria-label={
              p.favorites.includes(s.id)
                ? "Remover dos favoritos"
                : "Favoritar estrutura"
            }
            onClick={() => p.onFavorite(s.id)}
          >
            <Bookmark
              size={18}
              fill={p.favorites.includes(s.id) ? "currentColor" : "none"}
            />
          </button>
          <button
            className="icon-button"
            aria-label="Fechar ficha"
            onClick={p.onClose}
          >
            <X size={18} />
          </button>
        </div>
      </div>
      <span className="eyebrow muted">{s.region.toUpperCase()}</span>
      <h2>{s.name}</h2>
      <p className="subtitle">
        {s.kind === "musculos"
          ? "Sistema muscular"
          : s.kind === "ossos"
            ? "Sistema esquelético"
            : labels[s.kind]}{" "}
        · Ficha de estudo
      </p>
      <div className="panel-tabs">
        <button
          className={tab === "resumo" ? "active" : ""}
          onClick={() => setTab("resumo")}
        >
          Visão geral
        </button>
        <button
          className={tab === "detalhes" ? "active" : ""}
          onClick={() => setTab("detalhes")}
        >
          Ver detalhes
        </button>
      </div>
      <div className="simple-box">
        <span>✧ EM PALAVRAS SIMPLES</span>
        <p>{s.summary}</p>
      </div>
      {!s.modelIds.length && (
        <p className="availability">
          <Info size={14} /> Ficha textual. A câmera mostra os ossos
          relacionados quando disponíveis; não há malha individual nesta base.
        </p>
      )}
      {s.modelIds.length > 0 && (
        <p className="availability">
          <Info size={14} />{" "}
          {s.modelNote ||
            "Malha anatômica Z-Anatomy, preservada no mesmo referencial do corpo."}
        </p>
      )}
      {!!s.modelComponents?.length && (
        <details className="mesh-components">
          <summary>
            {s.modelComponents.length} componentes 3D · identificação na fonte
          </summary>
          <ul>
            {s.modelComponents.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <small>Na fonte, .r indica direita e .l indica esquerda.</small>
        </details>
      )}
      <div className="anatomy-fields">
        {visible.map(([k, v]) => (
          <section key={k}>
            <h3>
              <span
                className={
                  k === "Origem"
                    ? "origin-dot"
                    : k === "Inserção"
                      ? "insertion-dot"
                      : ""
                }
              />
              {k}
            </h3>
            <p>{v}</p>
          </section>
        ))}
      </div>
      {s.fields["Na prática"] && (
        <div className="practice-box">
          <span>NA PRÁTICA</span>
          <p>{s.fields["Na prática"]}</p>
        </div>
      )}
      {s.kind === "musculos" && (
        <button
          className="text-button"
          onClick={() => setAttachments(!attachments)}
        >
          {attachments ? "Fechar fixações" : "Ver origem e inserção"}{" "}
          <ArrowUpRight size={15} />
        </button>
      )}
      {attachments && s.kind === "musculos" && (
        <div className="attachment-box">
          <p>
            <b>● Origem</b> — {s.fields["Origem"]}
          </p>
          <p>
            <b>◆ Inserção</b> — {s.fields["Inserção"]}
          </p>
          <small>
            Fixações descritas em texto. Esta base não contém marcações
            validadas dos pontos de inserção na superfície 3D.
          </small>
        </div>
      )}
      {!!relatedMoves.length && (
        <div className="panel-actions">
          {relatedMoves.slice(0, 2).map((m) => (
            <button
              key={m.id}
              className="primary"
              onClick={() => p.onMovement(m.id)}
            >
              <Play size={16} />
              {m.name}
            </button>
          ))}
        </div>
      )}
      <div className="two-buttons">
        <button className="secondary" onClick={p.onIsolate}>
          <Eye size={16} /> Isolar
        </button>
        <button className="secondary" onClick={() => p.onCompare(s.id)}>
          Comparar <ArrowUpRight size={15} />
        </button>
      </div>
      {!!s.related.length && (
        <section className="related">
          <h3>Conecte as estruturas</h3>
          <div>
            {s.related.map(
              (id) =>
                byId[id] && (
                  <button key={id} onClick={() => p.onSelect(id)}>
                    {byId[id].name}
                    <ChevronRight size={12} />
                  </button>
                ),
            )}
          </div>
        </section>
      )}
      <details className="source-details">
        <summary>Fontes desta ficha</summary>
        {s.sources.map((id) => {
          const source = sources.find((x) => x.id === id);
          return (
            source && (
              <a key={id} href={source.url} target="_blank" rel="noreferrer">
                {source.name} ↗
              </a>
            )
          );
        })}
      </details>
      <button
        className="text-button share"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}{" "}
        {copied ? "Link copiado" : "Copiar link da ficha"}
      </button>
    </aside>
  );
}
function MouseAnatomy() {
  return (
    <svg
      width="52"
      height="62"
      viewBox="0 0 52 62"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="26" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 53L18 26H34L40 53M26 28V57M18 23L8 37M34 23L44 37M20 19H32"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="34" cy="25" r="5" fill="#f2f7f4" stroke="currentColor" />
    </svg>
  );
}
