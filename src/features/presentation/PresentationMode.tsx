import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Expand,
  NotebookPen,
  Play,
  Presentation,
  ShieldAlert,
  X,
} from "lucide-react";
import {
  clinicalCategories,
  clinicalKinds,
  clinicalQuadrants,
  clinicalTestById,
  clinicalTests,
} from "../../data/clinicalTests";
import type { ClinicalQuadrant, ClinicalTest } from "../../data/clinicalTests";
import { sources } from "../../data/sources";
import { buildDeck, defaultDeckTitle, parseTestIds, testLabel } from "./deck";
import type { DeckFormat, DeckOptions, Slide } from "./deck";

const LasegueViewer = lazy(() => import("../viewer/LasegueViewer"));
const animated = new Set(["lasegue", "slump"]);

/** Opções do deck guardadas na URL, para recarregar e compartilhar. */
function readOptions(params: URLSearchParams): DeckOptions {
  return {
    title: params.get("titulo") ?? "",
    subtitle: params.get("subtitulo") ?? "",
    format: params.get("formato") === "resumido" ? "resumido" : "completo",
    cases: params.get("casos") !== "0",
    references: params.get("refs") !== "0",
  };
}

export function PresentationMode() {
  const [params, setParams] = useSearchParams();
  const ids = parseTestIds(params.get("testes"));
  const options = readOptions(params);
  const update = (change: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(change))
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    setParams(next, { replace: true });
  };
  const tests = ids.map((id) => clinicalTestById[id]);
  if (params.get("play") === "1" && tests.length)
    return (
      <Player
        tests={tests}
        options={options}
        slide={Number(params.get("slide") ?? 0) || 0}
        onSlide={(slide) => update({ slide: String(slide) })}
        onExit={() => update({ play: null, slide: null })}
      />
    );
  return <Setup ids={ids} options={options} update={update} />;
}

function Setup({
  ids,
  options,
  update,
}: {
  ids: string[];
  options: DeckOptions;
  update: (change: Record<string, string | null>) => void;
}) {
  const navigate = useNavigate();
  const chosen = new Set(ids);
  const setIds = (next: string[]) =>
    update({
      testes: clinicalTests
        .map((test) => test.id)
        .filter((id) => next.includes(id))
        .join(","),
    });
  const toggle = (id: string) =>
    setIds(chosen.has(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  const tests = ids.map((id) => clinicalTestById[id]);
  const slides = buildDeck(tests, options);
  const minutes = Math.max(1, Math.round((slides.length * 40) / 60));
  return (
    <div className="content-page presentation-setup">
      <button className="text-button" onClick={() => navigate("/testes")}>
        <ArrowLeft size={15} /> Testes de fisioterapia
      </button>
      <span className="eyebrow">MODO APRESENTAÇÃO</span>
      <h1>Monte sua apresentação</h1>
      <p className="lead">
        Escolha os testes, ajuste a capa e apresente em tela cheia. Os slides
        saem do conteúdo de cada teste: indicação, segurança, execução,
        interpretação e casos.
      </p>
      <div className="presentation-form">
        <label>
          Título da apresentação
          <input
            value={options.title}
            placeholder={defaultDeckTitle(tests.length ? tests : clinicalTests)}
            onChange={(e) => update({ titulo: e.target.value })}
          />
        </label>
        <label>
          Subtítulo
          <input
            value={options.subtitle}
            placeholder="Disciplina, turma ou nomes do grupo"
            onChange={(e) => update({ subtitulo: e.target.value })}
          />
        </label>
        <fieldset className="presentation-format">
          <legend>Formato</legend>
          {(
            [
              [
                "completo",
                "Completo",
                "Passo a passo, segurança, raciocínio, erros e casos.",
              ],
              [
                "resumido",
                "Resumido",
                "Cerca de cinco slides por teste, para apresentações curtas.",
              ],
            ] as [DeckFormat, string, string][]
          ).map(([value, name, hint]) => (
            <label
              key={value}
              className={options.format === value ? "active" : ""}
            >
              <input
                type="radio"
                name="formato"
                checked={options.format === value}
                onChange={() => update({ formato: value })}
              />
              <strong>{name}</strong>
              <span>{hint}</span>
            </label>
          ))}
        </fieldset>
        <div className="presentation-toggles">
          <label>
            <input
              type="checkbox"
              checked={options.cases}
              onChange={(e) => update({ casos: e.target.checked ? null : "0" })}
            />
            Casos para discutir com a turma
          </label>
          <label>
            <input
              type="checkbox"
              checked={options.references}
              onChange={(e) => update({ refs: e.target.checked ? null : "0" })}
            />
            Slide de referências
          </label>
        </div>
      </div>
      <div className="presentation-picker-head">
        <h2>Testes ({ids.length})</h2>
        <div className="chips">
          {(Object.keys(clinicalQuadrants) as ClinicalQuadrant[]).map(
            (quadrant) => {
              const all = clinicalTests.filter(
                (test) =>
                  clinicalCategories.find((c) => c.id === test.category)!
                    .quadrant === quadrant,
              );
              if (!all.length) return null;
              return (
                <button
                  key={quadrant}
                  className="secondary"
                  onClick={() => setIds(all.map((test) => test.id))}
                >
                  Todo o {clinicalQuadrants[quadrant].toLowerCase()}
                </button>
              );
            },
          )}
          <button className="secondary" onClick={() => setIds([])}>
            Limpar
          </button>
        </div>
      </div>
      {clinicalCategories.map((category) => {
        const list = clinicalTests.filter(
          (test) => test.category === category.id,
        );
        if (!list.length) return null;
        const all = list.every((test) => chosen.has(test.id));
        return (
          <section className="presentation-group" key={category.id}>
            <header>
              <h3>
                {category.name}
                <small>{clinicalQuadrants[category.quadrant]}</small>
              </h3>
              <button
                className="text-button"
                onClick={() =>
                  setIds(
                    all
                      ? ids.filter(
                          (id) => clinicalTestById[id].category !== category.id,
                        )
                      : [...ids, ...list.map((test) => test.id)],
                  )
                }
              >
                {all ? "Remover todos" : "Selecionar todos"}
              </button>
            </header>
            <div className="presentation-tests">
              {list.map((test) => (
                <label
                  key={test.id}
                  className={chosen.has(test.id) ? "active" : ""}
                >
                  <input
                    type="checkbox"
                    checked={chosen.has(test.id)}
                    onChange={() => toggle(test.id)}
                  />
                  <span>
                    <strong>{test.name}</strong>
                    <small>{clinicalKinds[test.kind]}</small>
                  </span>
                </label>
              ))}
            </div>
          </section>
        );
      })}
      <div className="presentation-start">
        <p>
          {ids.length
            ? `${ids.length} ${ids.length === 1 ? "teste" : "testes"} · ${slides.length} slides · cerca de ${minutes} min`
            : "Escolha pelo menos um teste."}
        </p>
        <button
          className="primary"
          disabled={!ids.length}
          onClick={() => update({ play: "1", slide: "0" })}
        >
          <Play size={16} /> Iniciar apresentação
        </button>
      </div>
      <p className="presentation-keys">
        Durante a apresentação: <kbd>→</kbd> ou <kbd>Espaço</kbd> avança,{" "}
        <kbd>←</kbd> volta, <kbd>F</kbd> tela cheia, <kbd>N</kbd> notas do
        apresentador, <kbd>R</kbd> revela a resposta do caso, <kbd>Esc</kbd>{" "}
        sai.
      </p>
    </div>
  );
}

function Player({
  tests,
  options,
  slide,
  onSlide,
  onExit,
}: {
  tests: ClinicalTest[];
  options: DeckOptions;
  slide: number;
  onSlide: (slide: number) => void;
  onExit: () => void;
}) {
  const slides = buildDeck(tests, options);
  const index = Math.min(Math.max(0, slide), slides.length - 1);
  const current = slides[index];
  const [notes, setNotes] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [idle, setIdle] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const go = useCallback(
    (next: number) => {
      const target = Math.min(Math.max(0, next), slides.length - 1);
      if (target !== index) {
        setRevealed(false);
        onSlide(target);
      }
    },
    [index, onSlide, slides.length],
  );
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.current?.requestFullscreen?.().catch(() => undefined);
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const key = event.key;
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(key)) {
        event.preventDefault();
        go(index + 1);
      } else if (["ArrowLeft", "PageUp", "Backspace"].includes(key)) {
        event.preventDefault();
        go(index - 1);
      } else if (key === "Home") go(0);
      else if (key === "End") go(slides.length - 1);
      else if (key.toLowerCase() === "n") setNotes((v) => !v);
      else if (key.toLowerCase() === "r") setRevealed(true);
      else if (key.toLowerCase() === "f") toggleFullscreen();
      else if (key === "Escape" && !document.fullscreenElement) onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  // Esconde os controles depois de alguns segundos sem mexer o mouse.
  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), 2500);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), 2500);
    };
    window.addEventListener("mousemove", wake);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousemove", wake);
    };
  }, []);
  return (
    <div
      ref={root}
      className={`presentation-player ${idle ? "idle" : ""}`}
      role="region"
      aria-roledescription="apresentação"
      aria-label={`Slide ${index + 1} de ${slides.length}`}
    >
      <div className="presentation-stage-wrap">
        <article className={`presentation-stage slide-${current.kind}`}>
          <SlideView
            slide={current}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
          />
          <footer className="slide-footer">
            <span>FisioAtlas 3D</span>
            <span>
              {index + 1} / {slides.length}
            </span>
          </footer>
        </article>
      </div>
      <div className="presentation-progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
      </div>
      <button
        className="presentation-nav prev"
        aria-label="Slide anterior"
        disabled={index === 0}
        onClick={() => go(index - 1)}
      >
        <ArrowLeft />
      </button>
      <button
        className="presentation-nav next"
        aria-label="Próximo slide"
        disabled={index === slides.length - 1}
        onClick={() => go(index + 1)}
      >
        <ArrowRight />
      </button>
      <div className="presentation-controls">
        <button
          aria-pressed={notes}
          onClick={() => setNotes((v) => !v)}
          title="Notas do apresentador (N)"
        >
          <NotebookPen size={18} /> Notas
        </button>
        <button onClick={toggleFullscreen} title="Tela cheia (F)">
          <Expand size={18} /> Tela cheia
        </button>
        <button onClick={onExit} title="Sair (Esc)">
          <X size={18} /> Sair
        </button>
      </div>
      {notes && (
        <aside
          className="presentation-notes"
          aria-label="Notas do apresentador"
        >
          <strong>Notas do apresentador</strong>
          <p>{current.notes || "Sem notas para este slide."}</p>
        </aside>
      )}
    </div>
  );
}

/** Corpo do slide que reduz a escala do conteúdo quando ele não cabe, em vez
 *  de cortar texto: os testes têm textos de tamanhos bem diferentes. */
function SlideBody({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null),
    inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const fit = () => {
      const box = outer.current,
        content = inner.current;
      if (!box || !content) return;
      let scale = 1;
      for (let i = 0; i < 3; i++) {
        content.style.setProperty("--fit", String(scale));
        const ratio = box.clientHeight / content.scrollHeight;
        if (ratio >= 1) break;
        scale = Math.max(0.55, scale * ratio * 0.98);
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    if (outer.current) observer.observe(outer.current);
    return () => observer.disconnect();
  });
  return (
    <div className="slide-body" ref={outer}>
      <div className="slide-fit" ref={inner}>
        {children}
      </div>
    </div>
  );
}

function SlideHead({ test, label }: { test: ClinicalTest; label?: string }) {
  return (
    <header className="slide-head">
      <span>{label ?? testLabel(test)}</span>
      <strong>{test.name}</strong>
    </header>
  );
}

function SlideView({
  slide,
  revealed,
  onReveal,
}: {
  slide: Slide;
  revealed: boolean;
  onReveal: () => void;
}) {
  switch (slide.kind) {
    case "cover":
      return (
        <SlideBody>
          <span className="slide-eyebrow">
            <Presentation /> Fisioterapia · da manobra ao raciocínio
          </span>
          <h1>{slide.title}</h1>
          {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
          <p className="slide-meta">
            {slide.count}{" "}
            {slide.count === 1 ? "teste clínico" : "testes clínicos"} ·
            indicação, execução e interpretação
          </p>
        </SlideBody>
      );
    case "agenda":
      return (
        <SlideBody>
          <span className="slide-eyebrow">Roteiro</span>
          <h2>O que vamos ver</h2>
          <div className="slide-agenda">
            {slide.groups.map((group) => (
              <section key={group.id}>
                <h3>{group.name}</h3>
                <ul>
                  {group.tests.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </SlideBody>
      );
    case "section":
      return (
        <SlideBody>
          <span className="slide-eyebrow">{slide.quadrant}</span>
          <h1>{slide.name}</h1>
          <p className="slide-subtitle">{slide.description}</p>
          <p className="slide-meta">{slide.tests.join(" · ")}</p>
        </SlideBody>
      );
    case "test":
      return (
        <SlideBody>
          <span className="slide-eyebrow">
            {testLabel(slide.test)} · teste {slide.order} de {slide.total}
          </span>
          <h1>{slide.test.name}</h1>
          {slide.test.aliases.length > 0 && (
            <div className="slide-chips">
              {slide.test.aliases.map((alias) => (
                <span key={alias}>{alias}</span>
              ))}
            </div>
          )}
          <p className="slide-subtitle">{slide.test.summary}</p>
          {slide.test.position && (
            <p className="slide-callout">
              <b>Posição</b> {slide.test.position}
            </p>
          )}
        </SlideBody>
      );
    case "list":
      return (
        <SlideBody>
          <SlideHead test={slide.test} />
          <h2 className={slide.tone ? "tone-" + slide.tone : ""}>
            {slide.tone === "safety" && <ShieldAlert />}
            {slide.title}
          </h2>
          {slide.lead && <p className="slide-lead">{slide.lead}</p>}
          <ul
            className={`slide-list ${slide.tone ? "tone-" + slide.tone : ""}`}
          >
            {slide.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SlideBody>
      );
    case "step":
      return (
        <SlideBody>
          <SlideHead test={slide.test} label="Execução" />
          <div className="slide-step-grid">
            <div>
              <span className="slide-step-number">
                {slide.index + 1}
                <small>/{slide.test.steps.length}</small>
              </span>
              <h2>{slide.step.title}</h2>
              <p>{slide.step.text}</p>
              <p className="slide-callout">
                <b>Observe</b> {slide.step.cue}
              </p>
            </div>
            <StepVisual test={slide.test} index={slide.index} />
          </div>
        </SlideBody>
      );
    case "steps":
      return (
        <SlideBody>
          <SlideHead test={slide.test} label="Execução" />
          <h2>Passo a passo</h2>
          <ol className="slide-steps">
            {slide.test.steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <span>{step.cue}</span>
              </li>
            ))}
          </ol>
        </SlideBody>
      );
    case "interpretation":
      return (
        <SlideBody>
          <SlideHead test={slide.test} />
          <h2>Como interpretar</h2>
          <div className="slide-cards">
            {slide.test.interpretation.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          {slide.test.caution && (
            <p className="slide-callout warning">{slide.test.caution}</p>
          )}
        </SlideBody>
      );
    case "reasoning":
      return (
        <SlideBody>
          <SlideHead test={slide.test} />
          <h2>Do achado à hipótese clínica</h2>
          <ul className="slide-list">
            {slide.test.reasoning.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SlideBody>
      );
    case "evidence":
      return (
        <SlideBody>
          <SlideHead test={slide.test} />
          <h2>O que a evidência mostra</h2>
          <p className="slide-evidence">{slide.test.evidence!.text}</p>
          <p className="slide-meta">
            Fonte:{" "}
            {sources.find((s) => s.id === slide.test.evidence!.source)?.name}
          </p>
          {slide.test.caution && (
            <p className="slide-callout warning">{slide.test.caution}</p>
          )}
        </SlideBody>
      );
    case "case":
      return (
        <SlideBody>
          <SlideHead test={slide.test} label="Caso para discutir" />
          <h2 className="slide-question">{slide.item.question}</h2>
          <ol className="slide-choices">
            {slide.item.choices.map((choice, i) => (
              <li
                key={choice}
                className={
                  revealed ? (i === slide.item.correct ? "correct" : "dim") : ""
                }
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {choice}
                {revealed && i === slide.item.correct && <Check />}
              </li>
            ))}
          </ol>
          {revealed ? (
            <p className="slide-callout">{slide.item.explanation}</p>
          ) : (
            <button className="slide-reveal" onClick={onReveal}>
              Revelar resposta (R)
            </button>
          )}
        </SlideBody>
      );
    case "references":
      return (
        <SlideBody>
          <span className="slide-eyebrow">Fontes</span>
          <h2>Referências</h2>
          <ul className="slide-references">
            {slide.items.map((item) => (
              <li key={item.id}>
                {item.name}
                <small>{item.url}</small>
              </li>
            ))}
          </ul>
        </SlideBody>
      );
    case "closing":
      return (
        <SlideBody>
          <span className="slide-eyebrow">Obrigado</span>
          <h1>{slide.title}</h1>
          <p className="slide-subtitle">
            {slide.count}{" "}
            {slide.count === 1 ? "teste apresentado" : "testes apresentados"}.
            Conteúdo educativo: a aplicação clínica exige formação, supervisão e
            integração com o exame completo.
          </p>
          <p className="slide-meta">
            FisioAtlas 3D · atlas anatômico interativo
          </p>
        </SlideBody>
      );
  }
}

/** Visual do passo: animação 3D quando o teste a tem; senão, a linha de
 *  passos e a posição. */
function StepVisual({ test, index }: { test: ClinicalTest; index: number }) {
  if (animated.has(test.id))
    return (
      <div className="slide-visual slide-3d">
        <Suspense fallback={<p>Carregando demonstração 3D…</p>}>
          <LasegueViewer
            step={index}
            testId={test.id === "slump" ? "slump" : "lasegue"}
          />
        </Suspense>
      </div>
    );
  return (
    <div className="slide-visual">
      <ol className="slide-track">
        {test.steps.map((step, i) => (
          <li
            key={step.title}
            className={i === index ? "current" : i < index ? "done" : ""}
          >
            <span>{i + 1}</span>
            {step.title}
          </li>
        ))}
      </ol>
      {test.position && (
        <p className="slide-position">
          <b>Posição</b>
          {test.position}
        </p>
      )}
    </div>
  );
}
