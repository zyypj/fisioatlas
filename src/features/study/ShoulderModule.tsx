import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { byId, normalize } from "../../data";
import shoulder from "../../data/shoulder.json";

export function ShoulderModule({
  onSelect,
  onExplore,
  onMovement,
}: {
  onSelect: (id: string) => void;
  onExplore: () => void;
  onMovement: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const ids = shoulder.groups.flatMap((g) => g.ids);
  const generated = new Set(shoulder.generated);
  return (
    <div className="content-page shoulder-module">
      <span className="eyebrow">ESTUDO REGIONAL · OMBRO</span>
      <h1>Ombro e manguito rotador</h1>
      <p className="lead">
        Entenda como ossos, músculos, tendões, cápsula e ligamentos trabalham
        juntos para movimentar e estabilizar o braço.
      </p>
      <div className="shoulder-intro">
        <div>
          <h2>Quatro músculos, uma função em conjunto</h2>
          <p>
            Supraespinal, infraespinal, redondo menor e subescapular formam o
            manguito. Seus tendões se integram à cápsula e ajudam a manter a
            cabeça do úmero centrada na glenoide. Deltoide, redondo maior e
            bíceps são estruturas relacionadas.
          </p>
          <button className="primary" onClick={onExplore}>
            Explorar o ombro em 3D <ArrowRight size={16} />
          </button>
        </div>
        <div className="shoulder-scope">
          <strong>{ids.length} estruturas documentadas</strong>
          <p>
            {ids.filter((id) => byId[id]?.modelIds.length).length} com
            representação 3D individual · {generated.size} complementos
            didáticos.
          </p>
          <p>
            Malhas da base anatômica e complementos do Higgsfield têm
            procedência identificada. As formas complementares são aproximadas;
            a interface escapulotorácica e o intervalo são regiões, não tecidos
            independentes.
          </p>
          <a href="/OMBRO.md" target="_blank" rel="noreferrer">
            Documentação, fontes e limites ↗
          </a>
        </div>
      </div>
      <div className="shoulder-path">
        <h2>Roteiro de estudo</h2>
        <ol>
          <li>
            Localize glenoide, cabeça umeral, tubérculos, acrômio e processo
            coracoide nas fichas dos ossos.
          </li>
          <li>
            Compare cada músculo com seu tendão, origem, inserção, nervo e ação.
          </li>
          <li>
            Observe lábio, cápsula, cartilagens, ligamentos e bolsas. Use a
            transparência para olhar as camadas profundas.
          </li>
          <li>
            Conecte o manguito à posição da escápula e aos movimentos do braço.
          </li>
        </ol>
        <div className="chips">
          {[
            "abducao-do-ombro",
            "rotacao-lateral-do-ombro",
            "rotacao-medial-do-ombro",
          ].map((id) => (
            <button
              key={id}
              className="secondary"
              onClick={() => onMovement(id)}
            >
              {id === "abducao-do-ombro"
                ? "Abdução"
                : id === "rotacao-lateral-do-ombro"
                  ? "Rotação lateral"
                  : "Rotação medial"}{" "}
              ▸
            </button>
          ))}
        </div>
      </div>
      <label className="shoulder-search">
        <Search size={18} />
        <input
          aria-label="Pesquisar estruturas do ombro"
          placeholder="Pesquisar neste módulo…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      {shoulder.groups.map((group) => {
        const entries = group.ids
          .map((id) => byId[id])
          .filter(
            (s) =>
              s &&
              normalize([s.name, ...s.aliases].join(" ")).includes(
                normalize(query),
              ),
          );
        if (!entries.length) return null;
        return (
          <section key={group.title}>
            <h2>
              {group.title} <small>({entries.length})</small>
            </h2>
            <div className="shoulder-grid">
              {entries.map((s) => (
                <button
                  className="library-card"
                  key={s.id}
                  onClick={() => onSelect(s.id)}
                >
                  <span
                    className={`shoulder-badge ${generated.has(s.id) ? "didactic" : ""}`}
                  >
                    {generated.has(s.id)
                      ? "3D didático · Higgsfield"
                      : s.modelIds.length
                        ? "3D · base anatômica"
                        : "Ficha de estudo"}
                  </span>
                  <h3>{s.name}</h3>
                  <p>{s.summary}</p>
                  <span className="card-link">
                    Abrir ficha e 3D <ArrowRight size={15} />
                  </span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
      {!ids.some((id) =>
        normalize([byId[id].name, ...byId[id].aliases].join(" ")).includes(
          normalize(query),
        ),
      ) && <p role="status">Nenhuma estrutura encontrada neste módulo.</p>}
      <div className="study-tip">
        <p>
          Escopo: anatomia macroscópica do manguito e estruturas
          musculoesqueléticas relacionadas ao complexo do ombro, com seus
          principais nervos. Variações, microanatomia, rede vascular completa e
          medidas clínicas não são reproduzidas. Os vasos regionais são
          descritos nas fichas, sem malhas próprias nesta edição.
        </p>
      </div>
    </div>
  );
}
