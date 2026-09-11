import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Bone,
  BookOpen,
  Bookmark,
  Box,
  Brain,
  Check,
  ChevronRight,
  CircleHelp,
  GraduationCap,
  Layers3,
  Menu,
  Move3D,
  Search,
  SlidersHorizontal,
  Sparkles,
  SquareStack,
  X,
} from "lucide-react";
import {
  byId,
  colors,
  labels,
  normalize,
  regions,
  searchStructures,
  structurePath,
  structures,
} from "./data";
import { movementById, movements, terminology } from "./data/movements";
import { useStudy } from "./hooks/useStudy";
import { StructurePanel } from "./components/StructurePanel";
import { MovementPanel } from "./features/movements/MovementPanel";
import { defaultMechanics } from './features/movements/biomechanics';
import type { MechanicsOptions, MechanicsReport } from './features/movements/biomechanics';
import {
  Compare,
  Flashcards,
  Foundations,
  Quiz,
  Sources,
  Studies,
  StructureLibrary,
} from "./features/study/StudyPages";
import type { Kind, Layers } from "./types";
import type { ViewerState } from "./features/viewer/AtlasEngine";
const Viewer = lazy(() => import("./features/viewer/Viewer"));
const initialLayers: Layers = {
  ossos: 100,
  musculos: 100,
  articulacoes: 0,
  ligamentos: 0,
  tendoes: 100,
  nervos: 0,
};
const navItems = [
  ["/atlas", "Atlas 3D", Box],
  ["/regioes", "Regiões do corpo", Layers3],
  ["/movimentos", "Movimentos", Activity],
  ["/planos", "Planos e termos", Move3D],
  ["/quiz", "Quiz 3D", Brain],
  ["/flashcards", "Flashcards", SquareStack],
  ["/meus-estudos", "Meus estudos", Bookmark],
] as const;

export function AtlasApp() {
  const navigate = useNavigate(),
    location = useLocation(),
    store = useStudy();
  const parts = location.pathname.split("/").filter(Boolean),
    section = parts[0] || "atlas";
  const selected =
    section === "anatomia" && byId[parts[2]]?.kind === parts[1]
      ? byId[parts[2]]
      : null;
  const move =
    section === "movimentos" ? movementById[parts[1]] || movements[0] : null;
  const isAtlas = [
    "atlas",
    "anatomia",
    "movimentos",
    "quiz",
    "planos",
  ].includes(section);
  const invalid =
    (section === "anatomia" && !selected) ||
    (section === "movimentos" && !!parts[1] && !movementById[parts[1]]) ||
    ![
      "atlas",
      "anatomia",
      "movimentos",
      "quiz",
      "planos",
      "regioes",
      "flashcards",
      "meus-estudos",
      "comparar",
      "fundamentos",
      "fontes",
    ].includes(section);
  const [query, setQuery] = useState(""),
    [searchOpen, setSearchOpen] = useState(false),
    [searchIndex, setSearchIndex] = useState(0),
    searchRef = useRef<HTMLInputElement>(null);
  const motionLayers: Layers = { ossos: 35, musculos: 15, articulacoes: 35, ligamentos: 100, tendoes: 100, nervos: 100 };
  const [motionMode, setMotionMode] = useState<"all" | "bones">("all");
  const [mechanics,setMechanics] = useState<MechanicsOptions>({...defaultMechanics});
  const [mechanicsReport,setMechanicsReport] = useState<MechanicsReport|null>(null);
  const [layers, setLayers] = useState<Layers>(move ? motionLayers : initialLayers),
    [isolated, setIsolated] = useState(false),
    [hidden, setHidden] = useState<string[]>([]),
    [transparent, setTransparent] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false),
    [layersOpen, setLayersOpen] = useState(false),
    [region, setRegion] = useState(""),
    [system, setSystem] = useState(""),
    [deepOnly, setDeepOnly] = useState(false),
    [envelopes, setEnvelopes] = useState(false);
  const [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState(1),
    [progress, setProgress] = useState(0),
    [agonists, setAgonists] = useState(false),
    [plane, setPlane] = useState(""),
    [terms, setTerms] = useState(false);
  const [command, setCommand] = useState({
      type: "reset",
      value: "",
      nonce: 0,
    }),
    [pick, setPick] = useState<{ id: string; nonce: number } | null>(null),
    [compareId, setCompareId] = useState("biceps-braquial"),
    [help, setHelp] = useState(false);
  const results = searchStructures(query).slice(0, 9),
    motionResults = movements
      .filter((m) => normalize(m.name).includes(normalize(query)))
      .slice(0, 4);
  const searchOptions = [
    ...results.map((s) => ({
      id: s.id,
      name: s.name,
      label: labels[s.kind],
      motion: false,
    })),
    ...motionResults.map((m) => ({
      id: m.id,
      name: m.name,
      label: "Movimento",
      motion: true,
    })),
  ];
  function go(path: string) {
    if (path.startsWith('/movimentos') && !move) {
      setLayers(motionLayers);
      setDeepOnly(false);
      setHidden([]);
      setTransparent([]);
      setIsolated(false);
      setAgonists(false);
    }
    setPick(null);
    navigate(path);
    setMenuOpen(false);
    setSearchOpen(false);
  }
  function select(id: string) {
    if (!byId[id]) return;
    store.visit(id);
    setDeepOnly(false);
    setIsolated(false);
    setPlaying(false);
    setAgonists(false);
    setHidden((h) => h.filter((x) => x !== id));
    setLayers((l) => ({ ...l, [byId[id].kind]: 100 }));
    go(structurePath(byId[id]));
  }
  function doCommand(type: string, value = "") {
    setCommand((c) => ({ type, value, nonce: c.nonce + 1 }));
  }
  function reset() {
    setIsolated(false);
    setHidden([]);
    setTransparent([]);
    doCommand("reset");
  }
  function chooseMovement(id: string) {
    setPlaying(false);
    setProgress(0);
    setAgonists(false);
    setIsolated(false);
    go("/movimentos/" + id);
  }
  function isolate(id: string) {
    if (selected?.id === id) setIsolated((v) => !v);
    else {
      select(id);
      setIsolated(true);
    }
  }
  function searchChoose(item: (typeof searchOptions)[number]) {
    if (query.trim()) store.search(query.trim());
    setQuery("");
    setSearchOpen(false);
    if (item.motion) chooseMovement(item.id);
    else select(item.id);
  }
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- Synchronize transient state with external browser route changes.
    setPlaying(false);
    setProgress(0);
    setPlane("");
    setTerms(false);
    setIsolated(false);
  }, [section]);
  useEffect(() => {
    if (location.pathname === "/") navigate("/atlas", { replace: true });
  }, [location.pathname, navigate]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setLayersOpen(false);
        setMenuOpen(false);
        setHelp(false);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  const effectiveLayers = deepOnly ? { ...layers, musculos: 100 } : layers;
  const state: ViewerState = {
    selected: selected?.id || null,
    layers: effectiveLayers,
    envelopes,
    hidden: [
      ...hidden,
      ...(deepOnly
        ? structures
            .filter((s) => s.kind === "musculos" && s.depth !== "profunda")
            .map((s) => s.id)
        : []),
    ],
    transparent,
    isolated,
    movement: move,
    playing,
    speed,
    progress,
    plane,
    terms,
    agonists,
    motionMode,
    mechanics,
  };
  const list = searchStructures("", system, region);
  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="mobile-menu icon-button"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={22} />
        </button>
        <button
          className="brand"
          onClick={() => go("/atlas")}
          aria-label="FisioAtlas início"
        >
          <span className="brand-icon">
            <Activity size={24} />
          </span>
          <span>
            Fisio<span>Atlas</span>
            <small>3D</small>
          </span>
        </button>
        <div className="header-divider" />
        <span className="header-tagline">Seu corpo de conhecimento.</span>
        <div className="global-search">
          <Search size={18} />
          <input
            ref={searchRef}
            value={query}
            role="combobox"
            aria-expanded={searchOpen}
            aria-controls="search-results"
            aria-activedescendant={
              searchOpen && searchOptions[searchIndex]
                ? `result-${searchIndex}`
                : undefined
            }
            aria-label="Pesquisar no atlas"
            placeholder="Pesquise um músculo, osso, articulação ou movimento..."
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchIndex(0);
              setSearchOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSearchIndex((i) =>
                  Math.min(searchOptions.length - 1, i + 1),
                );
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSearchIndex((i) => Math.max(0, i - 1));
              }
              if (e.key === "Enter" && searchOptions[searchIndex]) {
                e.preventDefault();
                searchChoose(searchOptions[searchIndex]);
              }
            }}
          />
          <kbd>Ctrl K</kbd>
          {searchOpen && (
            <div className="search-results" id="search-results" role="listbox">
              <span className="eyebrow">
                {query ? "RESULTADOS DA BUSCA" : "EXPLORE UMA ESTRUTURA"}
              </span>
              {searchOptions.map((s, i) => (
                <button
                  key={s.id}
                  role="option"
                  aria-selected={searchIndex === i}
                  id={`result-${i}`}
                  className={searchIndex === i ? "active" : ""}
                  onMouseEnter={() => setSearchIndex(i)}
                  onClick={() => searchChoose(s)}
                >
                  <span>
                    <strong>{s.name}</strong>
                    <small>{s.label}</small>
                  </span>
                  <ArrowRight size={15} />
                </button>
              ))}
              {!searchOptions.length && (
                <p>
                  Nenhuma estrutura encontrada. Tente um nome, sinônimo ou
                  abreviação como LCA.
                </p>
              )}
            </div>
          )}
        </div>
        <button
          className="help-button icon-button"
          aria-label="Ajuda e posição anatômica"
          onClick={() => setHelp(true)}
        >
          <CircleHelp size={20} />
        </button>
        <span className="user-avatar" title="Estudo local, sem login">
          FA
        </span>
      </header>
      {searchOpen && (
        <div className="search-backdrop" onClick={() => setSearchOpen(false)} />
      )}
      {menuOpen && (
        <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />
      )}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-heading">
          <span className="eyebrow">EXPLORE E APRENDA</span>
          <button
            className="mobile-menu icon-button"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <nav>
          {navItems.map(([path, name, Icon], i) => (
            <button
              key={path}
              onClick={() => {
                if (path === "/quiz") {
                  setLayers({ ...initialLayers, musculos: 0, nervos: 0 });
                  setDeepOnly(false);
                }
                go(path);
              }}
              className={
                (path === "/atlas" &&
                  ["atlas", "anatomia"].includes(section)) ||
                "/" + section === path
                  ? "active"
                  : ""
              }
            >
              {i === 4 && (
                <span className="nav-section-label">PRATIQUE E MEMORIZE</span>
              )}
              <Icon size={19} />
              <span>{name}</span>
              {path === "/atlas" && <span className="live-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-separator" />
        <div className="sidebar-heading">
          <span className="eyebrow">SISTEMAS ANATÔMICOS</span>
          <button
            className="icon-button small"
            aria-label="Ajustar camadas"
            onClick={() => setLayersOpen(true)}
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>
        <div className="systems">
          {(Object.keys(labels) as Kind[]).map((kind) => (
            <button
              key={kind}
              className={system === kind ? "selected" : ""}
              onClick={() => {
                setSystem(system === kind ? "" : kind);
                setRegion("");
                go("/regioes");
              }}
            >
              <span
                className="system-dot"
                style={{ background: colors[kind] }}
              />
              <span>{labels[kind]}</span>
              <small>{structures.filter((s) => s.kind === kind).length}</small>
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="local-note">
            <span className="save-icon">
              <Check size={13} />
            </span>
            <div>
              <strong>Seu estudo, no seu ritmo</strong>
              <small>Progresso salvo neste navegador</small>
            </div>
          </div>
          <button
            onClick={() => go("/fundamentos")}
            className={section === "fundamentos" ? "active" : ""}
          >
            <GraduationCap size={17} /> Anatomia aplicada
          </button>
          <button
            onClick={() => go("/fontes")}
            className={section === "fontes" ? "active" : ""}
          >
            <BookOpen size={16} /> Fontes e referências
          </button>
        </div>
      </aside>
      <main
        className={`main ${isAtlas && !invalid ? "atlas-layout" : "page-layout"} ${section === "quiz" ? "quiz-layout" : ""}`}
      >
        {invalid ? (
          <div className="content-page">
            <span className="eyebrow">CAMINHO NÃO ENCONTRADO</span>
            <h1>Vamos voltar ao atlas?</h1>
            <p>A estrutura ou página desse endereço não está disponível.</p>
            <button className="primary" onClick={() => go("/atlas")}>
              Explorar corpo
            </button>
          </div>
        ) : isAtlas ? (
          <>
            <div className="atlas-center">
              <div className="atlas-subnav">
                <div>
                  <span className="status-dot" />{" "}
                  {section === "movimentos"
                    ? "Movimentos"
                    : section === "quiz"
                      ? "Prática ativa"
                      : section === "planos"
                        ? "Fundamentos anatômicos"
                        : "Explorar corpo"}{" "}
                  <ChevronRight size={13} />
                  <strong>
                    {selected?.name || move?.name || "Corpo inteiro"}
                  </strong>
                </div>
                <button onClick={() => setLayersOpen(true)}>
                  <Layers3 size={15} /> Camadas{" "}
                  <span>
                    {Object.values(layers).filter((v) => v > 0).length}
                  </span>
                </button>
              </div>
              <Suspense
                fallback={
                  <div className="viewer">
                    <div className="model-loading">
                      Preparando o atlas anatômico...
                    </div>
                  </div>
                }
              >
                <Viewer
                  state={state}
                  command={command}
                  onSelect={(id) =>
                    section === "quiz"
                      ? setPick({ id, nonce: Date.now() })
                      : select(id)
                  }
                  onIsolate={(id) =>
                    section === "quiz" ? undefined : isolate(id)
                  }
                  onHide={(id) => setHidden((h) => [...h, id])}
                  onTransparent={(id) => setTransparent((h) => [...h, id])}
                  onReset={reset}
                  onProgress={setProgress}
                  onLayers={() => setLayersOpen(true)}
                  onMechanics={setMechanicsReport}
                />
              </Suspense>
              <div className="atlas-footer">
                <span>
                  <span className="status-dot" /> Modelo 3D real <i />{" "}
                  {structures.filter((s) => s.modelIds.length).length} fichas
                  com malha
                </span>
                <button onClick={() => go("/fontes")}>
                  Conheça as fontes <ArrowRight size={12} />
                </button>
              </div>
            </div>
            {section === "movimentos" && move ? (
              <>
                <MovementPanel
                  movement={move}
                  playing={playing}
                  speed={speed}
                  progress={progress}
                  agonists={agonists}
                  motionMode={motionMode}
                  mechanics={mechanics}
                  mechanicsReport={mechanicsReport}
                  onMechanics={setMechanics}
                  onFocus={(id)=>{setLayers(l=>({...l,[byId[id].kind]:100}));doCommand('focus-tissue',id);}}
                  layers={layers}
                  onMotionMode={(mode) => { setMotionMode(mode); setAgonists(false); if (mode === 'all') { setLayers(motionLayers); setDeepOnly(false); } }}
                  onLayer={(kind, value) => { setDeepOnly(false); setLayers(l => ({ ...l, [kind]: value })); }}
                  onMovement={chooseMovement}
                  onPlay={() => {
                    setAgonists(false);
                    setPlaying((v) => !v);
                  }}
                  onSpeed={setSpeed}
                  onProgress={(n) => {
                    setPlaying(false);
                    setProgress(n);
                  }}
                  onAgonists={() => {
                    setAgonists((v) => !v);
                    setPlaying(false);
                  }}
                  onSelect={select}
                />
                <button
                  className={`motion-favorite ${store.study.favorites.includes(move.id) ? "saved" : ""}`}
                  aria-label="Favoritar movimento"
                  onClick={() => store.favorite(move.id)}
                >
                  <Bookmark
                    size={16}
                    fill={
                      store.study.favorites.includes(move.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </>
            ) : section === "quiz" ? (
              <Quiz
                pick={pick}
                onScore={store.answer}
                onShowModels={(kind) => {
                  setLayers({
                    ...initialLayers,
                    musculos: kind === "musculos" ? 100 : 0,
                    nervos: 0,
                  });
                  setIsolated(false);
                  setDeepOnly(false);
                  setHidden([]);
                }}
              />
            ) : section === "planos" ? (
              <aside className="info-panel planes-panel">
                <span className="eyebrow">A LINGUAGEM DA ANATOMIA</span>
                <h2>
                  Uma referência.
                  <br />
                  Muitas direções.
                </h2>
                <p>
                  Os planos ajudam a localizar estruturas e descrever
                  movimentos.
                </p>
                {[
                  [
                    "Sagital",
                    "Divide o corpo em porções direita e esquerda. Flexão e extensão geralmente ocorrem neste plano.",
                    "Transversal",
                  ],
                  [
                    "Frontal",
                    "Divide o corpo em porções anterior e posterior. Abdução e adução geralmente ocorrem neste plano.",
                    "Ântero-posterior",
                  ],
                  [
                    "Transversal",
                    "Divide o corpo em porções superior e inferior. Muitas rotações ocorrem neste plano.",
                    "Longitudinal",
                  ],
                ].map(([name, text, axis]) => (
                  <button
                    key={name}
                    className={`plane-card ${plane === name ? "selected" : ""}`}
                    onClick={() => {
                      setPlane(plane === name ? "" : name);
                      setTerms(false);
                      doCommand("reset");
                    }}
                  >
                    <span className="plane-card-icon">
                      <Move3D size={22} />
                    </span>
                    <strong>Plano {name.toLowerCase()}</strong>
                    <p>{text}</p>
                    <small>Eixo perpendicular: {axis.toLowerCase()}</small>
                  </button>
                ))}
                <h3>Termos de orientação</h3>
                <button
                  className="secondary full"
                  onClick={() => {
                    setTerms(!terms);
                    setPlane("");
                    doCommand("reset");
                  }}
                >
                  {" "}
                  {terms ? "Ocultar" : "Mostrar"} setas no corpo
                </button>
                {terminology.map(([name, text]) => (
                  <details className="term" key={name}>
                    <summary>{name}</summary>
                    <p>{text}</p>
                  </details>
                ))}
                <button className="primary full" onClick={() => setHelp(true)}>
                  Revisar posição anatômica
                </button>
              </aside>
            ) : (
              <StructurePanel
                key={selected?.id || "intro"}
                selected={selected}
                favorites={store.study.favorites}
                onFavorite={store.favorite}
                onSelect={select}
                onClose={() => go("/atlas")}
                onIsolate={() => selected && isolate(selected.id)}
                onMovement={chooseMovement}
                onCompare={(id) => {
                  setCompareId(id);
                  go("/comparar");
                }}
              />
            )}
          </>
        ) : section === "flashcards" ? (
          <Flashcards
            study={store.study}
            onRate={store.card}
            onFavorite={store.favorite}
          />
        ) : section === "meus-estudos" ? (
          <Studies
            study={store.study}
            onSelect={select}
            onMovement={chooseMovement}
          />
        ) : section === "comparar" ? (
          <Compare initial={compareId} onSelect={select} />
        ) : section === "fontes" ? (
          <Sources />
        ) : section === "fundamentos" ? (
          <Foundations onMotion={chooseMovement} />
        ) : section === "regioes" ? (
          <div className="region-page">
            <div className="region-filters">
              <label>
                Região
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="">Todas as regiões</option>
                  {regions.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label>
                Sistema
                <select
                  value={system}
                  onChange={(e) => setSystem(e.target.value)}
                >
                  <option value="">Todos os sistemas</option>
                  {Object.entries(labels).map(([k, v]) => (
                    <option value={k} key={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <StructureLibrary
              title={
                region ||
                (system ? labels[system as Kind] : "Explore por região")
              }
              list={list}
              onSelect={select}
            />
          </div>
        ) : null}
      </main>
      {layersOpen && (
        <div className="modal-backdrop" onClick={() => setLayersOpen(false)}>
          <section
            className="layers-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="layers-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-heading">
              <div>
                <span className="eyebrow">DA SUPERFÍCIE À PROFUNDIDADE</span>
                <h2 id="layers-title">Camadas anatômicas</h2>
              </div>
              <button
                className="icon-button"
                autoFocus
                aria-label="Fechar camadas"
                onClick={() => setLayersOpen(false)}
              >
                <X />
              </button>
            </div>
            <p>
              Escolha o que ver. Ajuste a transparência para revelar relações.
            </p>
            {(Object.keys(labels) as Kind[]).map((kind) => (
              <div className="layer-control" key={kind}>
                <div>
                  <span
                    className="system-dot"
                    style={{ background: colors[kind] }}
                  />
                  <label htmlFor={"layer-" + kind}>{labels[kind]}</label>
                  <button
                    role="switch"
                    disabled={
                      !structures.some(
                        (s) => s.kind === kind && s.modelIds.length,
                      )
                    }
                    aria-checked={layers[kind] > 0}
                    aria-label={"Exibir " + labels[kind]}
                    className={`switch ${layers[kind] > 0 ? "on" : ""}`}
                    onClick={() => {
                      setDeepOnly(false);
                      setLayers((l) => ({
                        ...l,
                        [kind]: l[kind] ? 0 : 100,
                        ...(!l[kind] &&
                        ["nervos", "ligamentos", "articulacoes"].includes(kind)
                          ? { musculos: Math.min(l.musculos, 15) }
                          : {}),
                      }));
                    }}
                  >
                    <span />
                  </button>
                </div>
                <div>
                  <input
                    id={"layer-" + kind}
                    disabled={
                      !structures.some(
                        (s) => s.kind === kind && s.modelIds.length,
                      )
                    }
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={layers[kind]}
                    onChange={(e) =>
                      setLayers((l) => ({ ...l, [kind]: +e.target.value }))
                    }
                  />
                  <output>{layers[kind]}%</output>
                </div>
                <small>
                  {
                    structures.filter(
                      (s) => s.kind === kind && s.modelIds.length,
                    ).length
                  }{" "}
                  de {structures.filter((s) => s.kind === kind).length} fichas
                  com componentes 3D.
                </small>
                {!structures.some(
                  (s) => s.kind === kind && s.modelIds.length,
                ) && (
                  <small>
                    Fichas disponíveis; sem malhas específicas no conjunto
                    importado.
                  </small>
                )}
              </div>
            ))}
            <label className="check-label">
              <input
                type="checkbox"
                checked={deepOnly}
                onChange={(e) => setDeepOnly(e.target.checked)}
              />{" "}
              Mostrar somente musculatura profunda
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={envelopes}
                onChange={(e) => setEnvelopes(e.target.checked)}
              />{" "}
              Mostrar fáscias de revestimento
            </label>
            <small>
              Fáscia lata, braquial, antebraquial, crural, cervical e as do
              tronco envolvem segmentos inteiros. Ficam ocultas por padrão
              porque cobririam tudo o que está por baixo; suas fichas continuam
              acessíveis pela busca.
            </small>
            <div className="two-buttons">
              <button
                className="secondary"
                onClick={() => {
                  setLayers({
                    ...initialLayers,
                    musculos: 0,
                    nervos: 100,
                    tendoes: 0,
                  });
                  setDeepOnly(false);
                  reset();
                }}
              >
                Nervos e ossos
              </button>
              <button
                className="secondary"
                onClick={() => {
                  setLayers({
                    ...initialLayers,
                    musculos: 0,
                    articulacoes: 35,
                    ligamentos: 100,
                  });
                  setDeepOnly(false);
                  reset();
                }}
              >
                Articulações e ligamentos
              </button>
            </div>
            <div className="two-buttons">
              <button
                className="secondary"
                onClick={() => {
                  setLayers({ ...initialLayers, musculos: 0, nervos: 0 });
                  setDeepOnly(false);
                  reset();
                }}
              >
                <Bone size={16} /> Só esqueleto
              </button>
              <button
                className="primary"
                onClick={() => {
                  setLayers(initialLayers);
                  setDeepOnly(false);
                  reset();
                }}
              >
                Restaurar camadas
              </button>
            </div>
            <p className="availability">
              Ao ligar estruturas profundas, a musculatura fica transparente. As
              articulações são representadas por cápsulas, discos ou ligamentos
              de suporte, conforme a ficha. Consulte a cobertura de cada
              estrutura em Fontes.
            </p>
          </section>
        </div>
      )}
      {help && (
        <div className="modal-backdrop" onClick={() => setHelp(false)}>
          <section
            className="help-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-heading">
              <span className="category-pill">
                <Sparkles size={14} /> PRIMEIROS PASSOS
              </span>
              <button
                className="icon-button"
                autoFocus
                aria-label="Fechar ajuda"
                onClick={() => setHelp(false)}
              >
                <X />
              </button>
            </div>
            <h2 id="help-title">
              Tudo começa pela
              <br />
              posição anatômica.
            </h2>
            <p>
              Ela é a referência para os nomes e direções usados no atlas,
              independentemente da posição real da pessoa.
            </p>
            <ol>
              <li>
                <strong>Cabeça e olhar</strong> voltados para a frente.
              </li>
              <li>
                <strong>Corpo ereto</strong>, membros superiores ao lado do
                tronco.
              </li>
              <li>
                <strong>Palmas das mãos</strong> voltadas para a frente,
                polegares lateralmente.
              </li>
              <li>
                <strong>Pés</strong> orientados para a frente.
              </li>
            </ol>
            <div className="simple-box">
              <span>PARA EXPLORAR</span>
              <p>
                Arraste para girar; role para aproximar. Clique para abrir uma
                ficha ou dê dois cliques para isolar. No teclado, use as setas
                sobre o modelo, + / − para zoom e 0 para redefinir.
              </p>
            </div>
            <button
              className="primary full"
              onClick={() => {
                store.onboard();
                setHelp(false);
                go("/atlas");
                reset();
                doCommand("preset", "anterior");
              }}
            >
              Entendi. Explorar corpo <ArrowRight size={16} />
            </button>
          </section>
        </div>
      )}
      {store.storageError && (
        <div className="storage-warning" role="alert">
          Não foi possível salvar o progresso neste navegador. O estudo continua
          disponível.
        </div>
      )}
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AtlasApp />
    </BrowserRouter>
  );
}
