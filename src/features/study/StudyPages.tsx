import { lazy, Suspense, useEffect, useEffectEvent, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  RotateCcw,
  X,
} from "lucide-react";
import { byId, labels, structures } from "../../data";
import { movements } from "../../data/movements";
import { sources } from "../../data/sources";
import type { StudyState, Structure } from "../../types";
const JointLesson = lazy(() => import("../viewer/JointLesson"));

export function Studies({
  study,
  onSelect,
  onMovement,
}: {
  study: StudyState;
  onSelect: (id: string) => void;
  onMovement: (id: string) => void;
}) {
  const render = (ids: string[]) =>
    ids.map((id) => {
      const s = byId[id],
        m = movements.find((x) => x.id === id);
      if (!s && !m) return null;
      return (
        <button
          className="library-card"
          key={id}
          onClick={() => (s ? onSelect(id) : onMovement(id))}
        >
          <span className="category-pill">
            {s ? labels[s.kind] : "Movimento"}
          </span>
          <h3>{s?.name || m?.name}</h3>
          <p>{s?.summary || m?.summary}</p>
          <span className="card-link">
            Continuar estudo <ArrowRight size={15} />
          </span>
        </button>
      );
    });
  return (
    <div className="content-page">
      <span className="eyebrow">APRENDIZADO QUE CONTINUA</span>
      <h1>Meus estudos</h1>
      <p className="lead">
        Suas descobertas ficam aqui, salvas neste navegador.
      </p>
      <div className="stats">
        <div>
          <strong>{study.history.length}</strong>
          <span>estruturas exploradas</span>
        </div>
        <div>
          <strong>{study.favorites.length}</strong>
          <span>favoritos</span>
        </div>
        <div>
          <strong>
            {study.quiz.total
              ? Math.round((study.quiz.correct / study.quiz.total) * 100) + "%"
              : "—"}
          </strong>
          <span>acertos em {study.quiz.total} questões</span>
        </div>
        <div>
          <strong>
            {Object.values(study.cards).reduce(
              (n, c) => n + c.correct + c.wrong,
              0,
            )}
          </strong>
          <span>revisões com flashcards</span>
        </div>
      </div>
      <h2>Seus favoritos</h2>
      <div className="library-grid">
        {render(study.favorites.filter((id) => !id.startsWith("card:")))}
      </div>
      {!study.favorites.filter((id) => !id.startsWith("card:")).length && (
        <div className="empty-state">
          <Bookmark />
          <p>Guarde uma estrutura ou movimento para revisar depois.</p>
          <button
            className="secondary"
            onClick={() => onSelect("supraespinal")}
          >
            Explorar o supraespinal
          </button>
        </div>
      )}
      <h2>Explorados recentemente</h2>
      <div className="library-grid">{render(study.history.slice(0, 12))}</div>
      <h2>Últimas pesquisas</h2>
      <div className="chips">
        {study.searches.length ? (
          study.searches.map((q) => <span key={q}>{q}</span>)
        ) : (
          <p>As buscas realizadas aparecerão aqui.</p>
        )}
      </div>
    </div>
  );
}

export function Flashcards({
  study,
  onRate,
  onFavorite,
}: {
  study: StudyState;
  onRate: (id: string, correct: boolean) => void;
  onFavorite: (id: string) => void;
}) {
  const [topic, setTopic] = useState("Ação"),
    [index, setIndex] = useState(0),
    [flipped, setFlipped] = useState(false),
    [onlyFavorites, setOnlyFavorites] = useState(false),
    [feedback, setFeedback] = useState("");
  const pool = structures.filter(
    (s) =>
      s.kind === "musculos" &&
      (!onlyFavorites || study.favorites.includes("card:" + s.id)),
  );
  const card = pool[index % Math.max(pool.length, 1)];
  function next(correct: boolean) {
    if (!card) return;
    onRate(card.id, correct);
    setIndex((i) => i + 1);
    setFlipped(false);
    setFeedback(
      correct
        ? "Revisão registrada. Vamos para a próxima!"
        : "Revisão registrada. Vale revisitar esta estrutura depois.",
    );
  }
  return (
    <div className="content-page flashcard-page">
      <span className="eyebrow">REVISÃO ATIVA</span>
      <h1>
        Pequenas perguntas.
        <br />
        Grandes conexões.
      </h1>
      <p className="lead">
        Tente lembrar antes de revelar. Errar também faz parte de aprender.
      </p>
      <div className="filter-row">
        <label>
          Revisar
          <select
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setFlipped(false);
            }}
          >
            {["Ação", "Origem", "Inserção", "Inervação"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <button
          className={onlyFavorites ? "secondary selected" : "secondary"}
          onClick={() => {
            setOnlyFavorites(!onlyFavorites);
            setIndex(0);
            setFlipped(false);
          }}
        >
          <Bookmark size={16} /> Apenas favoritos
        </button>
      </div>
      {card ? (
        <>
          <div className={`flashcard ${flipped ? "flipped" : ""}`}>
            <div className="flashcard-head">
              <span>
                {topic.toUpperCase()} <i /> {(index % pool.length) + 1} DE{" "}
                {pool.length}
              </span>
              <button
                className="icon-button"
                aria-label="Favoritar flashcard"
                onClick={() => onFavorite("card:" + card.id)}
              >
                <Bookmark
                  size={20}
                  fill={
                    study.favorites.includes("card:" + card.id)
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>
            <span className="flashcard-kicker">
              {flipped ? "CONECTE O CONHECIMENTO" : "O QUE VOCÊ LEMBRA?"}
            </span>
            <h2>
              {flipped
                ? card.fields[topic]
                : `${topic === "Ação" ? "Qual é a ação" : topic === "Inervação" ? "Qual é a inervação" : topic === "Origem" ? "Qual é a origem" : "Onde se insere"} ${topic === "Inserção" ? "o músculo" : "do músculo"} ${card.name.toLowerCase()}?`}
            </h2>
            <span className="flashcard-region">
              {card.region} · {card.name}
            </span>
            {!flipped ? (
              <button className="primary" onClick={() => setFlipped(true)}>
                Mostrar resposta <RotateCcw size={16} />
              </button>
            ) : (
              <div className="two-buttons">
                <button className="secondary" onClick={() => next(false)}>
                  <X size={17} /> Ainda não lembrei
                </button>
                <button className="primary" onClick={() => next(true)}>
                  <Check size={17} /> Acertei
                </button>
              </div>
            )}
          </div>
          <p className="muted" role="status">
            {feedback ||
              "As respostas são salvas automaticamente neste navegador."}
          </p>
        </>
      ) : (
        <div className="empty-state">
          <p>
            Nenhum flashcard favorito ainda. Volte à coleção completa e marque
            os que quer revisar.
          </p>
        </div>
      )}
    </div>
  );
}

export function Quiz({
  pick,
  onScore,
  onShowModels,
}: {
  pick: { id: string; nonce: number } | null;
  onScore: (correct: boolean) => void;
  onShowModels: (kind: string) => void;
}) {
  const [category, setCategory] = useState("ossos"),
    [difficulty, setDifficulty] = useState("Fácil"),
    [index, setIndex] = useState(0),
    [attempted, setAttempted] = useState(false),
    [done, setDone] = useState(false),
    [feedback, setFeedback] = useState("");
  const spatial = ["ossos", "musculos"].includes(category);
  const pool = structures.filter((s) =>
    spatial
      ? s.kind === category && s.modelIds.length > 0
      : s.kind === "musculos",
  );
  const question =
    pool[
      (index +
        (difficulty === "Médio" ? 9 : difficulty === "Difícil" ? 23 : 0)) %
        Math.max(pool.length, 1)
    ];
  const field =
    category === "origem"
      ? "Origem"
      : category === "inervacao"
        ? "Inervação"
        : "Ação";
  function answer(id: string) {
    if (done || !question) return;
    const correct = id === question.id;
    if (!attempted) {
      onScore(correct);
      setAttempted(true);
    }
    setDone(correct);
    setFeedback(
      correct
        ? `Correto! ${question.name}. ${spatial ? question.summary : question.fields[field]}`
        : "Quase. Tente novamente; observe a localização e as relações.",
    );
  }
  const receivePick = useEffectEvent((id: string) => {
    if (spatial) answer(id);
  });
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- Receive discrete click events from the external WebGL viewer.
    if (pick) receivePick(pick.id);
  }, [pick]);
  function reset(cat = category) {
    setCategory(cat);
    setIndex(0);
    setFeedback("");
    setDone(false);
    setAttempted(false);
    onShowModels(cat);
  }
  function next() {
    setIndex((i) => i + 1);
    setFeedback("");
    setDone(false);
    setAttempted(false);
  }
  const options = question
    ? [
        question,
        ...pool
          .filter((s) => s.id !== question.id)
          .slice(
            index % Math.max(1, pool.length - 4),
            (index % Math.max(1, pool.length - 4)) + 3,
          ),
      ].sort((a, b) => a.name.localeCompare(b.name))
    : [];
  return (
    <aside className="info-panel quiz-panel">
      <span className="eyebrow">QUIZ {spatial ? "3D" : "DE ANATOMIA"}</span>
      <h2>
        O que você
        <br />
        já reconhece?
      </h2>
      <label className="field-label">
        Categoria
        <select value={category} onChange={(e) => reset(e.target.value)}>
          <option value="ossos">Ossos · encontre no corpo</option>
          <option value="musculos">Músculos · encontre no corpo</option>
          <option value="origem">Origem muscular</option>
          <option value="inervacao">Inervação</option>
          <option value="movimentos">Ações musculares</option>
        </select>
      </label>
      <label className="field-label">
        Dificuldade
        <select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            next();
          }}
        >
          <option>Fácil</option>
          <option>Médio</option>
          <option>Difícil</option>
        </select>
      </label>
      {question && (
        <div className="quiz-question">
          <span>QUESTÃO {index + 1}</span>
          <h3>
            {spatial
              ? `Encontre ${question.name.toLowerCase()} no modelo.`
              : `Qual músculo corresponde a esta ${field.toLowerCase()}?`}
          </h3>
          {!spatial && <p>{question.fields[field]}</p>}
          {difficulty === "Fácil" && <small>Dica: {question.region}</small>}
        </div>
      )}
      {spatial ? (
        <p className="muted">
          Gire e aproxime o corpo; clique na estrutura para responder. Se
          preferir, use a lista acessível abaixo.
        </p>
      ) : null}
      <div className="quiz-options">
        {options.map((s) => (
          <button disabled={done} key={s.id} onClick={() => answer(s.id)}>
            {s.name}
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
      <div className={`quiz-feedback ${done ? "correct" : ""}`} role="status">
        {feedback}
      </div>
      <button className="primary full" onClick={next}>
        {done ? "Próxima questão" : "Pular questão"}
        <ArrowRight size={16} />
      </button>
      <p className="availability">
        O desempenho considera a primeira tentativa de cada questão. Pular não
        conta como resposta.
      </p>
    </aside>
  );
}

export function Compare({
  initial,
  onSelect,
}: {
  initial: string;
  onSelect: (id: string) => void;
}) {
  const [left, setLeft] = useState(initial || "biceps-braquial"),
    [right, setRight] = useState("braquial");
  const a = byId[left],
    b = byId[right];
  const fields = [
    ...new Set([...Object.keys(a.fields), ...Object.keys(b.fields)]),
  ];
  return (
    <div className="content-page">
      <span className="eyebrow">APRENDA PELAS DIFERENÇAS</span>
      <h1>Compare estruturas</h1>
      <p className="lead">
        Veja as relações lado a lado para organizar seu raciocínio.
      </p>
      <div className="compare-selects">
        {[
          [left, setLeft],
          [right, setRight],
        ].map(([value, fn], i) => (
          <label key={i}>
            Estrutura {i + 1}
            <select
              value={value as string}
              onChange={(e) => (fn as (s: string) => void)(e.target.value)}
            >
              {structures.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {labels[s.kind]}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="table-scroll">
        <table className="comparison">
          <thead>
            <tr>
              <th>Característica</th>
              {[a, b].map((s, i) => (
                <th key={i}>
                  <button onClick={() => onSelect(s.id)}>{s.name} ↗</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Em palavras simples</th>
              <td>{a.summary}</td>
              <td>{b.summary}</td>
            </tr>
            {fields.map((f) => (
              <tr key={f}>
                <th>{f}</th>
                <td>
                  {a.fields[f] || "Não se aplica ou não consta nesta ficha."}
                </td>
                <td>
                  {b.fields[f] || "Não se aplica ou não consta nesta ficha."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Sources() {
  return (
    <div className="content-page">
      <span className="eyebrow">CONHECIMENTO COM ORIGEM</span>
      <h1>Fontes e referências</h1>
      <p className="lead">
        Anatomia real, atribuição preservada e limites apresentados com clareza.
      </p>
      <div className="source-note">
        <h3>Sobre esta edição</h3>
        <p>
          {structures.length} fichas de estudo e 10 movimentos animados. A cobertura de malhas é
          informada em cada ficha. Os modelos representam a anatomia de um
          adulto do Z-Anatomy, derivado do BodyParts3D; variações individuais e
          detalhes finos não estão integralmente representados.
        </p>
        <p>
          As animações incluem um modelo mecânico reduzido: equilíbrio músculo–tendão,
          resposta ligamentar à tração e reserva geométrica de deslizamento neural.
          O movimento é imposto; as forças não dirigem o esqueleto. Os parâmetros
          e trajetos são aproximados, sem calibração clínica. Consulte as equações
          e limitações no painel Simulação dos tecidos.
        </p>
        <p>
          Este material apoia o estudo e deve ser confrontado com as referências
          e orientações da disciplina. Não substitui avaliação clínica,
          professor ou protocolo profissional.
        </p>
      </div>
      <section className="source-note">
        <h2>Cobertura das camadas</h2>
        <div className="coverage-grid">
          {Object.entries(labels).map(([kind, label]) => (
            <div key={kind}>
              <strong>{label}</strong>
              <span>
                {
                  structures.filter((s) => s.kind === kind && s.modelIds.length)
                    .length
                }{" "}
                / {structures.filter((s) => s.kind === kind).length} fichas com
                componentes 3D
              </span>
            </div>
          ))}
        </div>
        <p>
          Algumas articulações são representadas por cápsula, disco ou
          ligamentos de suporte. O nome exato de cada componente importado está
          disponível na ficha.
        </p>
        <p>
          <strong>Ainda sem malha própria:</strong>{" "}
          {structures
            .filter((s) => !s.modelIds.length)
            .map((s) => s.name)
            .join("; ")}
          .
        </p>
        <a href="/models/coverage.json" target="_blank">
          Consultar inventário completo de componentes
        </a>{" "}
        ·{" "}
        <a href="/models/Z-ANATOMY-LICENSE.md" target="_blank">
          Licença Z-Anatomy e atribuições
        </a>
      </section>
      {sources.map((s) => (
        <article className="source-card" key={s.id}>
          <div>
            <span className="eyebrow">REFERÊNCIA</span>
            <h3>{s.name}</h3>
            <p>{s.note}</p>
          </div>
          <a
            className="secondary"
            href={s.url}
            target="_blank"
            rel="noreferrer"
          >
            Consultar ↗
          </a>
        </article>
      ))}
      <p className="muted">
        Referências registradas em 10 de setembro de 2026.{" "}
        <a href="/models/LICENSE.md" target="_blank">
          Licença e transformações dos arquivos 3D
        </a>
        .
      </p>
    </div>
  );
}

export function Foundations({ onMotion }: { onMotion: (id: string) => void }) {
  return (
    <div className="content-page">
      <span className="eyebrow">ANATOMIA APLICADA</span>
      <h1>Do músculo ao movimento</h1>
      <p className="lead">
        Conceitos essenciais para começar a raciocinar em Fisioterapia.
      </p>
      <Suspense fallback={<p>Carregando laboratório de articulações…</p>}>
        <JointLesson />
      </Suspense>
      <div className="library-grid">
        <article className="lesson-card">
          <span className="category-pill">Cadeia cinética</span>
          <h2>Cadeia aberta</h2>
          <p>
            O segmento distal está livre. Na extensão do joelho sem apoiar o pé,
            a perna se move em relação à coxa.
          </p>
          <button
            className="text-button"
            onClick={() => onMotion("extensao-do-joelho")}
          >
            Explorar extensão do joelho <ArrowRight size={16} />
          </button>
        </article>
        <article className="lesson-card">
          <span className="category-pill">Cadeia cinética</span>
          <h2>Cadeia fechada</h2>
          <p>
            O segmento distal encontra resistência ou está apoiado. No
            agachamento, os pés ficam no chão e quadril, joelho e tornozelo
            coordenam o movimento.
          </p>
          <p>
            A carga e a função dos músculos dependem da postura e da tarefa.
          </p>
        </article>
      </div>
      <h2>Três formas de produzir tensão</h2>
      <div className="library-grid">
        {[
          [
            "Concêntrica",
            "O músculo produz força enquanto encurta.",
            "Ao subir a carga em uma rosca, os flexores do cotovelo encurtam.",
          ],
          [
            "Excêntrica",
            "O músculo produz força enquanto se alonga.",
            "Ao descer a carga lentamente, os flexores controlam a extensão do cotovelo.",
          ],
          [
            "Isométrica",
            "Há produção de força sem mudança apreciável do comprimento muscular global.",
            "Ao manter a carga parada, os flexores sustentam a posição.",
          ],
        ].map(([n, s, p]) => (
          <article className="lesson-card" key={n}>
            <h3>{n}</h3>
            <p>{s}</p>
            <small>{p}</small>
          </article>
        ))}
      </div>
      <h2>Introdução aos testes musculares</h2>
      <p className="availability">
        Roteiros educacionais simplificados. A aplicação exige ensino
        supervisionado e protocolo de avaliação.
      </p>
      {[
        [
          "Flexão do cotovelo",
          "Bíceps, braquial e braquiorradial.",
          "Pessoa sentada, braço ao lado do tronco e antebraço supinado.",
          "O avaliador observa e estabiliza o braço. Solicita flexão do cotovelo, sem compensação do ombro.",
        ],
        [
          "Extensão do joelho",
          "Quadríceps femoral.",
          "Pessoa sentada, coxa apoiada e perna livre.",
          "O avaliador acompanha a extensão e estabiliza a coxa. A resistência e graduação dependem do protocolo adotado.",
        ],
        [
          "Abdução do quadril",
          "Glúteos médio e mínimo.",
          "Decúbito lateral, membro superior do corpo alinhado.",
          "O avaliador estabiliza a pelve e observa a abdução sem rotação ou inclinação do tronco.",
        ],
      ].map(([n, m, pos, obs]) => (
        <article className="source-card" key={n}>
          <div>
            <h3>{n}</h3>
            <p>
              <b>Músculos:</b> {m}
            </p>
            <p>
              <b>Posição:</b> {pos}
            </p>
            <p>{obs}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function StructureLibrary({
  title,
  list,
  onSelect,
}: {
  title: string;
  list: Structure[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="content-page">
      <span className="eyebrow">ESTUDE POR REGIÃO</span>
      <h1>{title}</h1>
      <p className="lead">{list.length} estruturas conectadas para explorar.</p>
      <div className="library-grid">
        {list.map((s) => (
          <button
            className="library-card"
            key={s.id}
            onClick={() => onSelect(s.id)}
          >
            <span className="category-pill">{labels[s.kind]}</span>
            <h3>{s.name}</h3>
            <p>{s.summary}</p>
            <span className="card-link">
              Abrir no atlas <ArrowRight size={15} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
