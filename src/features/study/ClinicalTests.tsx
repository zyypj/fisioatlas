import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { byId } from "../../data";
import { clinicalTests, clinicalTestById } from "../../data/clinicalTests";
import type { ClinicalTest } from "../../data/clinicalTests";
import { sources } from "../../data/sources";
import { clinicalStages, parseClinicalStage } from "./clinicalGuide";

function ClinicalSources({ test }: { test: ClinicalTest }) {
  return (
    <details className="clinical-card">
      <summary>Fontes e referências do módulo</summary>
      <p>
        Conteúdo conferido em 03/10/2026. A diretriz NASS citada é de 2012;
        estudos posteriores sobre o SLR também estão incluídos.
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
  const storageKey = `fisioatlas-clinical-${test.id}-stage`;
  const [stage, setStage] = useState(() => {
    try {
      return parseClinicalStage(localStorage.getItem(storageKey));
    } catch {
      return 0;
    }
  });
  const execution = stage >= 1 && stage <= 5 ? test.steps[stage - 1] : null;
  const [demoAngle, setDemoAngle] = useState<number | null>(null),
    [playing, setPlaying] = useState(false),
    [completed, setCompleted] = useState(false);
  const angle = demoAngle ?? execution?.angle ?? 0;
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
  useEffect(() => {
    if (!playing) return;
    let tick = 0;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      tick++;
      setDemoAngle(Math.round(30 * (1 - Math.cos((Math.PI * tick) / 30))));
      if (tick >= 60) setPlaying(false);
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing]);
  const goStage = (index: number) => {
    shouldFocus.current = true;
    setPlaying(false);
    setDemoAngle(null);
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
            Passo {stage + 1} de {clinicalStages.length}
          </strong>
          <span>Seu avanço é salvo neste navegador.</span>
        </div>
        <progress
          max={clinicalStages.length}
          value={stage + 1}
          aria-label="Progresso do roteiro"
        />
      </div>
      <details className="clinical-stage-menu">
        <summary>Etapas do roteiro · ir para uma etapa</summary>
        <ol>
          {clinicalStages.map((title, index) => (
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
        aria-label={`Passo ${stage + 1}: ${clinicalStages[stage]}`}
      >
        {execution && (
          <div className="clinical-visual">
            <LasegueDiagram angle={angle} dorsiflexion={stage === 4} />
            <label htmlFor="guided-angle">Explorar a posição · {angle}°</label>
            <input
              id="guided-angle"
              type="range"
              min="0"
              max="80"
              value={angle}
              onChange={(e) => {
                setPlaying(false);
                setDemoAngle(+e.target.value);
              }}
            />
            {stage === 2 && (
              <button
                className="secondary"
                onClick={() => {
                  if (playing) setPlaying(false);
                  else {
                    setDemoAngle(0);
                    setPlaying(true);
                  }
                }}
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}{" "}
                {playing ? "Pausar movimento" : "Demonstrar elevação"}
              </button>
            )}
            <small>
              Esquema 2D sem escala anatômica. A animação até 60° é um exemplo;
              a execução clínica respeita a resposta da pessoa.
            </small>
          </div>
        )}
        <div className="guided-content" aria-live="polite">
          <span className="eyebrow">ETAPA {stage + 1}</span>
          <h2 ref={stageHeading} tabIndex={-1}>
            {clinicalStages[stage]}
          </h2>
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
                Neste roteiro, Lasègue corresponde ao SLR passivo: o examinador
                eleva o membro, mantendo o joelho estendido.
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
          {stage === 6 && (
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
          {stage === 7 && (
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
          {stage === 8 && <PracticeCases test={test} />}
          {stage === 9 && (
            <>
              <h3>Confira o que você aprendeu</h3>
              <ul>
                <li>
                  Reconhecer a indicação e verificar segurança e consentimento.
                </li>
                <li>Demonstrar elevação passiva com o joelho estendido.</li>
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
          {stage + 1}/{clinicalStages.length}
        </span>
        {stage < clinicalStages.length - 1 ? (
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

export function LasegueDiagram({
  angle,
  dorsiflexion = false,
}: {
  angle: number;
  dorsiflexion?: boolean;
}) {
  const radians = (angle * Math.PI) / 180;
  return (
    <svg
      viewBox="0 0 600 370"
      role="img"
      aria-label={`Esquema do Lasègue: flexão passiva do quadril de ${angle} graus, joelho estendido${dorsiflexion ? ", dorsiflexão do tornozelo" : ""}.`}
    >
      <rect x="25" y="284" width="550" height="20" rx="8" fill="#d6c8e8" />
      <path d="M55 304V340M545 304V340" stroke="#b6a3cf" strokeWidth="9" />
      <circle
        cx="83"
        cy="247"
        r="23"
        fill="#d9c9ec"
        stroke="#735692"
        strokeWidth="2"
      />
      <path
        d="M108 262Q150 245 193 252L270 266L274 281L109 281Z"
        fill="#d9c9ec"
        stroke="#735692"
        strokeWidth="2"
      />
      <path
        d="M270 273L510 273L526 253"
        stroke="#c7b8dc"
        strokeWidth="15"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M270 270H520" stroke="#b8aac8" strokeDasharray="5 5" />
      {angle > 0 && (
        <path
          d={`M325 270 A55 55 0 0 0 ${270 + 55 * Math.cos(radians)} ${270 - 55 * Math.sin(radians)}`}
          stroke="#9070b4"
          strokeWidth="2"
          fill="none"
        />
      )}
      <g transform={`rotate(${-angle} 270 270)`}>
        <path
          d="M270 270L390 270L510 270"
          fill="none"
          stroke="#9474b4"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <path
          d="M278 275L504 275"
          stroke="#e3b347"
          strokeWidth="3"
          fill="none"
          strokeDasharray="7 4"
        />
        <circle cx="390" cy="270" r="6" fill="#f4eefb" />
        <path
          d={dorsiflexion ? "M510 270L502 247" : "M510 270L512 246"}
          stroke="#735692"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M503 291Q509 285 524 287"
          stroke="#725386"
          strokeWidth="3"
          fill="none"
        />
      </g>
      <circle cx="270" cy="270" r="7" fill="#644780" />
      <text x="294" y="327" fill="#684b86" fontSize="16">
        Flexão do quadril: {angle}°
      </text>
      <text x="27" y="30" fill="#684b86" fontSize="13">
        DECÚBITO DORSAL · ELEVAÇÃO PASSIVA
      </text>
      <text x="27" y="53" fill="#8a709e" fontSize="12">
        Joelho estendido · o examinador apoia o membro
      </text>
    </svg>
  );
}

function Lesson({
  test,
  onSelect,
}: {
  test: ClinicalTest;
  onSelect: (id: string) => void;
}) {
  const [step, setStep] = useState(0),
    [angle, setAngle] = useState(0),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    let tick = 0;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      tick++;
      setAngle(Math.round(30 * (1 - Math.cos((Math.PI * tick) / 30))));
      if (tick >= 60) setPlaying(false);
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing]);
  const chooseStep = (index: number) => {
    setPlaying(false);
    setStep(index);
    setAngle(test.steps[index].angle);
  };
  return (
    <>
      <span className="eyebrow">FISIOTERAPIA · AVALIAÇÃO NEURODINÂMICA</span>
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
          Lasègue aqui corresponde ao SLR passivo. Estude a execução e o
          raciocínio; a ilustração não simula sintomas de um paciente nem
          fornece um diagnóstico.
        </p>
      </div>
      <section className="clinical-guide" aria-label="Execução do Lasègue">
        <div className="clinical-visual">
          <LasegueDiagram angle={angle} dorsiflexion={step === 3} />
          <label htmlFor="lasegue-angle">Explorar a posição · {angle}°</label>
          <input
            id="lasegue-angle"
            type="range"
            min="0"
            max="80"
            step="1"
            value={angle}
            onChange={(e) => {
              setPlaying(false);
              setAngle(+e.target.value);
            }}
          />
          <div className="two-buttons">
            <button
              className="primary"
              onClick={() => {
                if (playing) setPlaying(false);
                else {
                  setStep(1);
                  setAngle(0);
                  setPlaying(true);
                }
              }}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}{" "}
              {playing ? "Pausar demonstração" : "Reproduzir elevação"}
            </button>
            <button className="secondary" onClick={() => chooseStep(0)}>
              Reiniciar posição
            </button>
          </div>
          <small>
            Esquema 2D, sem escala anatômica. A reprodução vai até 60° como
            exemplo; em uma pessoa, pare conforme a resposta dos sintomas.
          </small>
        </div>
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
            A acurácia varia com a população, a técnica e a referência
            diagnóstica. Um estudo de 2023, com 142 pessoas encaminhadas para
            eletrodiagnóstico, encontrou sensibilidade de 89% e especificidade
            de 25% para um dos critérios de SLR. Isso mostra por que um
            resultado positivo não basta para confirmar radiculopatia; esses
            valores não são universais.
          </p>
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/38132028/"
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
          Conteúdo conferido em 03/10/2026. A diretriz NASS citada é de 2012;
          estudos posteriores sobre o SLR também estão incluídos.
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
        <>
          <span className="eyebrow">
            FISIOTERAPIA · DA MANOBRA AO RACIOCÍNIO
          </span>
          <h1>Testes de fisioterapia</h1>
          <p className="lead">
            Aprenda o movimento, a indicação e a interpretação antes de aplicar
            um teste no exame clínico.
          </p>
          <div className="library-grid">
            {clinicalTests.map((item) => (
              <button
                className="library-card"
                key={item.id}
                onClick={() => onOpen(item.id)}
              >
                <span className="category-pill">{item.region}</span>
                <h2>{item.name}</h2>
                <p>{item.summary}</p>
                <span className="card-link">
                  Começar passo a passo <ArrowRight size={15} />
                </span>
              </button>
            ))}
          </div>
          <p className="clinical-note">
            O primeiro módulo é o Lasègue. A biblioteca está organizada para
            receber novos testes com a mesma sequência de estudo.
          </p>
        </>
      )}
    </div>
  );
}
