export type Kind =
  "ossos" | "musculos" | "articulacoes" | "ligamentos" | "tendoes" | "nervos";
export interface Structure {
  id: string;
  name: string;
  english: string;
  kind: Kind;
  region: string;
  summary: string;
  fields: Record<string, string>;
  related: string[];
  depth: string;
  sources: string[];
  aliases: string[];
  modelIds: string[];
  modelSource?: string | null;
  modelComponents?: string[];
  modelNote?: string;
  /** Fáscia de revestimento: envolve um segmento inteiro e, se exibida por
   *  padrão, esconde tudo o que está por baixo. O visualizador só a mostra
   *  quando a pessoa pede. */
  envelope?: boolean;
}
export type Animation =
  | "elbow"
  | "shoulder"
  | "shoulderflex"
  | "shoulderrot"
  | "forearm"
  | "wrist"
  | "wristdev"
  | "knee"
  | "kneerot"
  | "hip"
  | "hipabd"
  | "hiprot"
  | "ankle"
  | "subtalar"
  | "cervical"
  | "cervicalrot"
  | "cervicalinc"
  | "jaw"
  | "spine"
  | "spinerot"
  | "spineinc";
export interface Movement {
  id: string;
  name: string;
  joint: string;
  plane: string;
  axis: string;
  agonists: string[];
  antagonists: string[];
  summary: string;
  example: string;
  exercise: string;
  animation: Animation;
  maxAngle: number;
  reverse?: boolean;
}
export type Layers = Record<Kind, number>;
export interface StudyState {
  favorites: string[];
  history: string[];
  searches: string[];
  quiz: { correct: number; total: number };
  cards: Record<string, { correct: number; wrong: number }>;
  onboarded: boolean;
}
export interface ModelManifest {
  kind: Kind;
  url: string;
  bytes: number;
  meshes: number;
}
