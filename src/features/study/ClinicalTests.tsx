import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import { byId } from "../../data";
import {
  clinicalCategories,
  clinicalKinds,
  clinicalTests,
  clinicalTestById,
} from "../../data/clinicalTests";
import type { ClinicalKind, ClinicalTest } from "../../data/clinicalTests";
import { sources } from "../../data/sources";
import { clinicalStagesFor, parseClinicalStage } from "./clinicalGuide";
import {
  filterClinicalTests,
  groupClinicalTests,
  parseClinicalFilters,
} from "./clinicalCatalog";
import type { ClinicalFilters } from "./clinicalCatalog";

const LasegueViewer = lazy(() => import("../viewer/LasegueViewer"));

function ClinicalVisual({ step, testId }: { step: number; testId: string }) {
  return (
    <Suspense
      fallback={
        <div className="clinical-3d-placeholder" role="status">
          Preparando demonstração anatômica 3D...
        </div>
      }
    >
      <LasegueViewer
        step={step}
        testId={testId === "slump" ? "slump" : "lasegue"}
      />
    </Suspense>
  );
}

function ClinicalSources({ test }: { test: ClinicalTest }) {
  return (
    <details className="clinical-card">
      <summary>Fontes e referências do módulo</summary>
      <p>
        Conteúdo conferido em 03/10/2026. Consulte os estudos primários e as
        diretrizes abaixo para a técnica e os limites de interpretação.
      </p>
      <div className="clinical-sources">
        {test.sources.map((id) => {
          const source = sources.find((s) => s.id === id);
          return (
            source && (
              <a key={id} href={source.url} target="_blank" rel="noreferrer">
                {source.name} ↗
              </a>
            )
          );
        })}
      </div>
    </details>
  );
}

function PracticeCases({ test }: { test: ClinicalTest }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  return (
    <section className="clinical-practice">
      <p>
        Casos fictícios para estudo. Escolha uma resposta e veja a explicação.
        Respondidos: {Object.keys(answers).length} de {test.cases.length}.
      </p>
      {test.cases.map((item) => (
        <article className="clinical-card" key={item.id}>
          <h3>{item.question}</h3>
          <div className="clinical-choices">
            {item.choices.map((choice, index) => (
              <button
                className={`secondary ${answers[item.id] === index ? "chosen" : ""}`}
                aria-pressed={answers[item.id] === index}
                key={choice}
                onClick={() =>
                  setAnswers((old) => ({ ...old, [item.id]: index }))
                }
              >
                {choice}
              </button>
            ))}
          </div>
          {answers[item.id] !== undefined && (
            <p className="clinical-feedback" role="status">
              <strong>
                {answers[item.id] === item.correct
                  ? "Boa interpretação. "
                  : "Revise o raciocínio. "}
              </strong>
              {item.explanation}
            </p>
          )}
        </article>
      ))}
    </section>
  );
}

function AnatomyLinks({
  test,
  onSelect,
}: {
  test: ClinicalTest;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <p>
        Explore os tecidos relacionados no atlas. Ao voltar, o roteiro retoma a
        etapa salva.
      </p>
      <div className="chips">
        {test.related.map((id) => (
          <button className="secondary" key={id} onClick={() => onSelect(id)}>
            {byId[id]?.name}
            <ArrowRight size={14} />
          </button>
        ))}
      </div>
    </>
  );
}

function GuidedLesson({
  test,
  onSelect,
}: {
  test: ClinicalTest;
  onSelect: (id: string) => void;
}) {
  const stageHeading = useRef<HTMLHeadingElement>(null),
    shouldFocus = useRef(false);
  const stages = clinicalStagesFor(test.id),
    executionCount = test.steps.length;
  const storageKey = `fisioatlas-clinical-${test.id}-stage`;
  const [stage, setStage] = useState(() => {
    try {
      return parseClinicalStage(
        localStorage.getItem(storageKey),
        stages.length,
      );
    } catch {
      return 0;
    }
  });
  const execution =
    stage >= 1 && stage <= executionCount ? test.steps[stage - 1] : null;
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(stage));
    } catch {
      /* Estudo funciona mesmo sem armazenamento. */
    }
  }, [stage, storageKey]);
  useEffect(() => {
    if (shouldFocus.current) {
      stageHeading.current?.focus();
      shouldFocus.current = false;
    }
  }, [stage]);
  const goStage = (index: number) => {
    shouldFocus.current = true;
    setCompleted(false);
    setStage(index);
  };
  return (
    <>
      <span className="eyebrow">ROTEIRO GUIADO · FISIOTERAPIA</span>
      <h1>{test.name}: passo a passo</h1>
      <p className="lead">{test.summary}</p>
      <div className="clinical-progress">
        <div>
          <strong>
            Passo {stage + 1} de {stages.length}
          </strong>
          <span>Seu avanço é salvo neste navegador.</span>
        </div>
        <progress
          max={stages.length}
          value={stage + 1}
          aria-label="Progresso do roteiro"
        />
      </div>
      <details className="clinical-stage-menu">
        <summary>Etapas do roteiro · ir para uma etapa</summary>
        <ol>
          {stages.map((title, index) => (
            <li key={title}>
              <button
                className={stage === index ? "active" : ""}
                aria-current={stage === index ? "step" : undefined}
                onClick={() => goStage(index)}
              >
                {index + 1}. {title}
              </button>
            </li>
          ))}
        </ol>
      </details>
      <section
        className={`clinical-card guided-stage ${execution ? "with-diagram" : ""}`}
        aria-label={`Passo ${stage + 1}: ${stages[stage]}`}
      >
        <header className="guided-stage-header">
          <span className="eyebrow">ETAPA {stage + 1}</span>
          <h2 ref={stageHeading} tabIndex={-1}>
            {stages[stage]}
          </h2>
        </header>
        {execution && <ClinicalVisual step={stage - 1} testId={test.id} />}
        <div className="guided-content" aria-live="polite">
          {stage === 0 && (
            <>
              <p>{test.purpose}</p>
              <h3>Quando considerar o teste</h3>
              <ul>
                {test.indications.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
              <p className="clinical-cue">
                {test.executionNote ||
                  "Neste roteiro, Lasègue corresponde ao SLR passivo: o examinador eleva o membro, mantendo o joelho estendido."}
              </p>
              <p>
                Aprenda a execução, o registro e o raciocínio. O roteiro é
                educativo; não simula sintomas nem fornece um diagnóstico de
                paciente.
              </p>
            </>
          )}
          {execution && (
            <>
              <h3>{execution.title}</h3>
              <p>{execution.text}</p>
              <p className="clinical-cue">{execution.cue}</p>
            </>
          )}
          {stage === 1 && (
            <div className="clinical-safety">
              <h3>Antes de começar</h3>
              <ul>
                {test.safety.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
          )}
          {stage === executionCount + 1 && (
            <>
              {test.interpretation.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
              <h3>Do achado à hipótese clínica</h3>
              <ol>
                {test.reasoning.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ol>
              <p className="clinical-cue">
                Um resultado isolado não confirma hérnia de disco nem identifica
                sozinho a causa dos sintomas.
              </p>
            </>
          )}
          {stage === executionCount + 2 && (
            <>
              <h3>Exemplo de registro</h3>
              <p>{test.record}</p>
              <small>Anotação fictícia para estudo.</small>
              <h3>Evite estes erros</h3>
              <ul>
                {test.mistakes.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </>
          )}
          {stage === executionCount + 3 && <PracticeCases test={test} />}
          {stage === executionCount + 4 && (
            <>
              <h3>Confira o que você aprendeu</h3>
              <ul>
                <li>
                  Reconhecer a indicação e verificar segurança e consentimento.
                </li>
                <li>
                  {test.id === "slump"
                    ? "Demonstrar a sequência sentada e a liberação cervical mantendo a perna."
                    : "Demonstrar elevação passiva com o joelho estendido."}
                </li>
                <li>
                  Observar sintomas familiares, localização e resposta à
                  diferenciação.
                </li>
                <li>
                  Relacionar o resultado à história e ao exame neurológico.
                </li>
                <li>
                  Registrar os achados e reconhecer sinais que exigem
                  encaminhamento.
                </li>
              </ul>
              <h3>Conecte com a anatomia</h3>
              <AnatomyLinks test={test} onSelect={onSelect} />
              {completed && (
                <p className="clinical-feedback" role="status">
                  Roteiro concluído. Você pode refazer as etapas ou consultar a
                  ficha completa.
                </p>
              )}
            </>
          )}
        </div>
      </section>
      <nav
        className="clinical-guide-navigation"
        aria-label="Navegação do roteiro"
      >
        <button
          className="secondary"
          disabled={stage === 0}
          onClick={() => goStage(stage - 1)}
        >
          <ArrowLeft size={16} /> Voltar um passo
        </button>
        <span>
          {stage + 1}/{stages.length}
        </span>
        {stage < stages.length - 1 ? (
          <button className="primary" onClick={() => goStage(stage + 1)}>
            Próximo passo <ArrowRight size={16} />
          </button>
        ) : (
          <button
            className="primary"
            onClick={() => (completed ? goStage(0) : setCompleted(true))}
          >
            {completed ? "Recomeçar roteiro" : "Concluir estudo"}
          </button>
        )}
      </nav>
      <ClinicalSources test={test} />
    </>
  );
}

function TestModule({
  test,
  onSelect,
}: {
  test: ClinicalTest;
  onSelect: (id: string) => void;
}) {
  const [guided, setGuided] = useState(true);
  return (
    <>
      <div className="clinical-mode" role="group" aria-label="Modo de estudo">
        <button
          className={guided ? "active" : ""}
          aria-pressed={guided}
          onClick={() => setGuided(true)}
        >
          Passo a passo
        </button>
        <button
          className={!guided ? "active" : ""}
          aria-pressed={!guided}
          onClick={() => setGuided(false)}
        >
          Ficha completa
        </button>
      </div>
      {guided ? (
        <GuidedLesson test={test} onSelect={onSelect} />
      ) : (
        <Lesson test={test} onSelect={onSelect} />
      )}
    </>
  );
}

function Lesson({
  test,
  onSelect,
}: {
  test: ClinicalTest;
  onSelect: (id: string) => void;
}) {
  const [step, setStep] = useState(0);
  const chooseStep = (index: number) => setStep(index);
  return (
    <>
      <span className="eyebrow">
        FISIOTERAPIA ·{" "}
        {clinicalCategories
          .find((item) => item.id === test.category)
          ?.name.toUpperCase()}{" "}
        · {clinicalKinds[test.kind].toUpperCase()}
      </span>
      <h1>{test.name}</h1>
      <p className="lead">{test.summary}</p>
      <div className="chips clinical-aliases">
        {test.aliases.map((alias) => (
          <span key={alias}>{alias}</span>
        ))}
      </div>
      <div className="clinical-note">
        <strong>O que este módulo ensina</strong>
        <p>
          {test.executionNote || "Lasègue aqui corresponde ao SLR passivo."}{" "}
          Estude a execução e o raciocínio; a demonstração não simula sintomas
          de um paciente nem fornece um diagnóstico.
        </p>
      </div>
      <section
        className="clinical-guide"
        aria-label={`Execução do ${test.name}`}
      >
        <ClinicalVisual step={step} testId={test.id} />
        <div className="clinical-steps">
          <h2>Aprenda a executar</h2>
          <ol>
            {test.steps.map((item, index) => (
              <li key={item.title}>
                <button
                  className={index === step ? "active" : ""}
                  aria-current={index === step ? "step" : undefined}
                  onClick={() => chooseStep(index)}
                >
                  <span>{index + 1}</span>
                  {item.title}
                </button>
              </li>
            ))}
          </ol>
          <article aria-live="polite">
            <h3>{test.steps[step].title}</h3>
            <p>{test.steps[step].text}</p>
            <p className="clinical-cue">{test.steps[step].cue}</p>
          </article>
          <div className="two-buttons">
            <button
              className="secondary"
              disabled={step === 0}
              onClick={() => chooseStep(step - 1)}
            >
              Anterior
            </button>
            <button
              className="secondary"
              disabled={step === test.steps.length - 1}
              onClick={() => chooseStep(step + 1)}
            >
              Próximo passo
            </button>
          </div>
        </div>
      </section>
      <div className="clinical-columns">
        <section className="clinical-card">
          <h2>Por que e quando usar</h2>
          <p>{test.purpose}</p>
          <ul>
            {test.indications.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>
        <section className="clinical-card clinical-safety">
          <h2>Antes de testar e quando interromper</h2>
          <ul>
            {test.safety.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>
      </div>
      <section className="clinical-card">
        <h2>Interpretar o resultado</h2>
        <div className="clinical-columns">
          {test.interpretation.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="clinical-card">
        <h2>Do teste à hipótese clínica</h2>
        <p>
          Um resultado isolado não confirma hérnia de disco. Construa o
          raciocínio com os achados do exame:
        </p>
        <ol>
          {test.reasoning.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ol>
        <details>
          <summary>O que a evidência mostra?</summary>
          <p>
            {test.evidence ? (
              test.evidence.text
            ) : (
              <>
                A acurácia varia com a população, a técnica e a referência
                diagnóstica. Um estudo de 2023, com 142 pessoas encaminhadas
                para eletrodiagnóstico, encontrou sensibilidade de 89% e
                especificidade de 25% para um dos critérios de SLR. Isso mostra
                por que um resultado positivo não basta para confirmar
                radiculopatia; esses valores não são universais.
              </>
            )}
          </p>
          <a
            href={
              test.evidence
                ? sources.find((s) => s.id === test.evidence!.source)?.url
                : "https://pubmed.ncbi.nlm.nih.gov/38132028/"
            }
            target="_blank"
            rel="noreferrer"
          >
            Ler o estudo e os critérios utilizados ↗
          </a>
        </details>
      </section>
      <div className="clinical-columns">
        <section className="clinical-card">
          <h2>Erros comuns</h2>
          <ul>
            {test.mistakes.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>
        <section className="clinical-card">
          <h2>Como registrar</h2>
          <p>{test.record}</p>
          <small>
            Modelo de anotação para estudo; não é um laudo de um paciente real.
          </small>
        </section>
      </div>
      <section className="clinical-practice">
        <span className="eyebrow">TREINE O RACIOCÍNIO</span>
        <h2>Três situações, três decisões</h2>
        <p>
          Casos fictícios para estudo. Escolha uma resposta e veja a explicação.
        </p>
        <PracticeCases test={test} />
      </section>
      <section className="clinical-card">
        <h2>Conecte com a anatomia</h2>
        <p>
          Veja os tecidos relacionados no atlas, com camadas inteligentes para
          revelar o que está profundo.
        </p>
        <div className="chips">
          {test.related.map((id) => (
            <button className="secondary" key={id} onClick={() => onSelect(id)}>
              {byId[id]?.name}
              <ArrowRight size={14} />
            </button>
          ))}
        </div>
      </section>
      <section className="clinical-card">
        <h2>Fontes do módulo</h2>
        <p>
          Conteúdo conferido em 03/10/2026. Consulte os estudos primários e as
          diretrizes abaixo para a técnica e os limites de interpretação.
        </p>
        <div className="clinical-sources">
          {test.sources.map((id) => {
            const source = sources.find((s) => s.id === id);
            return (
              source && (
                <a key={id} href={source.url} target="_blank" rel="noreferrer">
                  {source.name} ↗
                </a>
              )
            );
          })}
        </div>
      </section>
    </>
  );
}

function ClinicalCatalog({ onOpen }: { onOpen: (id: string) => void }) {
  const [params, setParams] = useSearchParams();
  const filters = parseClinicalFilters(params);
  const update = (change: Partial<ClinicalFilters>) => {
    const next = { ...filters, ...change },
      search = new URLSearchParams();
    if (next.query) search.set("q", next.query);
    if (next.category) search.set("regiao", next.category);
    if (next.kind) search.set("tipo", next.kind);
    setParams(search, { replace: true });
  };
  const filtering = Boolean(filters.query.trim() || filters.kind);
  // Contagens por região respeitam busca e tipo, mas não a própria região.
  const matching = filterClinicalTests(clinicalTests, {
    ...filters,
    category: "",
  });
  const results = filters.category
    ? matching.filter((test) => test.category === filters.category)
    : matching;
  const groups = groupClinicalTests(results).filter(
    (group) =>
      (!filters.category || group.id === filters.category) &&
      (group.tests.length > 0 || !filtering),
  );
  const kinds = (Object.keys(clinicalKinds) as ClinicalKind[]).filter(
    (kind) =>
      kind === filters.kind || clinicalTests.some((test) => test.kind === kind),
  );
  return (
    <>
      <span className="eyebrow">FISIOTERAPIA · DA MANOBRA AO RACIOCÍNIO</span>
      <h1>Testes de fisioterapia</h1>
      <p className="lead">
        Aprenda o movimento, a indicação e a interpretação antes de aplicar um
        teste no exame clínico.
      </p>
      <div className="clinical-filters" role="search">
        <label className="clinical-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={filters.query}
            placeholder="Buscar teste (ex.: SLR, Slump)"
            aria-label="Buscar testes"
            onChange={(e) => update({ query: e.target.value })}
          />
        </label>
        <label className="clinical-kind">
          Tipo
          <select
            value={filters.kind}
            onChange={(e) => update({ kind: e.target.value as ClinicalKind })}
          >
            <option value="">Todos os tipos</option>
            {kinds.map((kind) => (
              <option key={kind} value={kind}>
                {clinicalKinds[kind]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div
        className="clinical-category-tabs"
        role="group"
        aria-label="Filtrar por região"
      >
        {[{ id: "" as const, name: "Todas" }, ...clinicalCategories].map(
          (category) => {
            const count = category.id
              ? matching.filter((test) => test.category === category.id).length
              : matching.length;
            const selected = filters.category === category.id;
            return (
              <button
                key={category.id || "todas"}
                className={selected ? "active" : ""}
                aria-pressed={selected}
                onClick={() => update({ category: category.id })}
              >
                {category.name}
                <span>{count}</span>
              </button>
            );
          },
        )}
      </div>
      <div className="clinical-results" role="status">
        <span>
          {results.length === 1
            ? "1 teste encontrado"
            : `${results.length} testes encontrados`}
        </span>
        {(filtering || filters.category) && (
          <button
            className="text-button"
            onClick={() => update({ query: "", category: "", kind: "" })}
          >
            <X size={14} /> Limpar filtros
          </button>
        )}
      </div>
      {groups.length === 0 ? (
        <div className="clinical-empty">
          <h2>Nenhum teste encontrado</h2>
          <p>Tente outro termo, troque o tipo ou veja todas as regiões.</p>
        </div>
      ) : (
        groups.map((group) => (
          <section
            className="clinical-category"
            key={group.id}
            aria-labelledby={`categoria-${group.id}`}
          >
            <header>
              <h2 id={`categoria-${group.id}`}>
                {group.name}
                <span>
                  {group.tests.length === 1
                    ? "1 teste"
                    : `${group.tests.length} testes`}
                </span>
              </h2>
              <p>{group.description}</p>
            </header>
            {group.tests.length ? (
              <div className="library-grid">
                {group.tests.map((item) => (
                  <button
                    className="library-card"
                    key={item.id}
                    onClick={() => onOpen(item.id)}
                  >
                    <span className="category-pill">
                      {clinicalKinds[item.kind]}
                    </span>
                    <h3>{item.name}</h3>
                    <p>{item.summary}</p>
                    <span className="card-link">
                      Começar passo a passo <ArrowRight size={15} />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="clinical-soon">
                Em breve: os testes de {group.name.toLowerCase()} entram aqui.
              </p>
            )}
          </section>
        ))
      )}
    </>
  );
}

export function ClinicalTests({
  id,
  onOpen,
  onSelect,
}: {
  id?: string;
  onOpen: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const test = id ? clinicalTestById[id] : null;
  return (
    <div className="content-page clinical-page">
      {test ? (
        <>
          <button className="text-button" onClick={() => onOpen("")}>
            <ArrowLeft size={15} /> Todos os testes
          </button>
          <TestModule key={test.id} test={test} onSelect={onSelect} />
        </>
      ) : (
        <ClinicalCatalog onOpen={onOpen} />
      )}
    </div>
  );
}
