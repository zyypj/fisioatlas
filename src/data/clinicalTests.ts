import { slumpTest } from "./slumpTest";
import { lowerQuadrantTests } from "./testesClinicos";

export type ClinicalCategory =
  | "lombar"
  | "pelve"
  | "quadril"
  | "joelho"
  | "tornozelo"
  | "ombro"
  | "cotovelo";
export type ClinicalKind =
  | "neurodinamico"
  | "ligamentar"
  | "meniscal"
  | "musculotendineo"
  | "impacto"
  | "instabilidade"
  | "provocacao"
  | "comprimento-muscular"
  | "mobilidade"
  | "funcional";
export type ClinicalQuadrant = "inferior" | "superior";

export const clinicalQuadrants: Record<ClinicalQuadrant, string> = {
  inferior: "Quadrante inferior",
  superior: "Quadrante superior",
};

export const clinicalCategories: {
  id: ClinicalCategory;
  name: string;
  quadrant: ClinicalQuadrant;
  description: string;
}[] = [
  {
    id: "lombar",
    name: "Lombar",
    quadrant: "inferior",
    description: "Coluna lombossacra e sistema neural do membro inferior.",
  },
  {
    id: "pelve",
    name: "Pelve e sacroilíaca",
    quadrant: "inferior",
    description:
      "Articulação sacroilíaca e dor na cintura pélvica: provocação e controle de carga.",
  },
  {
    id: "quadril",
    name: "Quadril",
    quadrant: "inferior",
    description:
      "Articulação coxofemoral, impacto femoroacetabular, comprimento muscular e abdutores.",
  },
  {
    id: "joelho",
    name: "Joelho",
    quadrant: "inferior",
    description:
      "Ligamentos cruzados e colaterais, meniscos e articulação patelofemoral.",
  },
  {
    id: "tornozelo",
    name: "Tornozelo e pé",
    quadrant: "inferior",
    description:
      "Ligamentos laterais, sindesmose, tendão do calcâneo, fáscia plantar e mobilidade.",
  },
  {
    id: "ombro",
    name: "Ombro",
    quadrant: "superior",
    description:
      "Manguito rotador, impacto subacromial e instabilidade glenoumeral.",
  },
  {
    id: "cotovelo",
    name: "Cotovelo",
    quadrant: "superior",
    description:
      "Epicondilites, estabilidade ligamentar e nervos ao redor do cotovelo.",
  },
];

export const clinicalKinds: Record<ClinicalKind, string> = {
  neurodinamico: "Neurodinâmico",
  ligamentar: "Ligamentar",
  meniscal: "Meniscal",
  musculotendineo: "Musculotendíneo",
  impacto: "Impacto",
  instabilidade: "Instabilidade",
  provocacao: "Provocação de dor",
  "comprimento-muscular": "Comprimento muscular",
  mobilidade: "Mobilidade",
  funcional: "Controle e força",
};

export interface ClinicalTest {
  id: string;
  name: string;
  aliases: string[];
  category: ClinicalCategory;
  kind: ClinicalKind;
  region: string;
  /** Posição do paciente e do examinador, em uma frase. */
  position?: string;
  summary: string;
  purpose: string;
  indications: string[];
  safety: string[];
  /** `angle` só é usado pelas demonstrações 3D (Lasègue e Slump). */
  steps: { title: string; text: string; angle?: number; cue: string }[];
  interpretation: { title: string; text: string }[];
  reasoning: string[];
  /** Ressalva mostrada após a interpretação (o que o teste não confirma). */
  caution?: string;
  mistakes: string[];
  record: string;
  related: string[];
  sources: string[];
  executionNote?: string;
  evidence?: { text: string; source: string };
  /** Checklist de revisão ao fim do roteiro. */
  review?: string[];
  cases: {
    id: string;
    question: string;
    choices: string[];
    correct: number;
    explanation: string;
  }[];
}

export const clinicalTests: ClinicalTest[] = [
  {
    id: "lasegue",
    name: "Teste de Lasègue",
    aliases: ["SLR", "Straight Leg Raise", "Elevação da perna estendida"],
    category: "lombar",
    kind: "neurodinamico",
    region: "Coluna lombossacra · membro inferior",
    position:
      "Paciente em decúbito dorsal, relaxado; examinador ao lado do membro testado, uma mão no calcanhar e outra acima do joelho.",
    executionNote:
      "Neste roteiro, Lasègue corresponde ao SLR passivo: o examinador eleva o membro, mantendo o joelho estendido.",
    caution:
      "Um resultado isolado não confirma hérnia de disco nem identifica sozinho a causa dos sintomas.",
    evidence: {
      text: "A acurácia varia com a população, a técnica e a referência diagnóstica. Um estudo de 2023, com 142 pessoas encaminhadas para eletrodiagnóstico, encontrou sensibilidade de 89% e especificidade de 25% para um dos critérios de SLR. Isso mostra por que um resultado positivo não basta para confirmar radiculopatia; esses valores não são universais.",
      source: "slr-accuracy",
    },
    review: [
      "Reconhecer a indicação e verificar segurança e consentimento.",
      "Demonstrar elevação passiva com o joelho estendido.",
      "Observar sintomas familiares, localização e resposta à diferenciação.",
      "Relacionar o resultado à história e ao exame neurológico.",
      "Registrar os achados e reconhecer sinais que exigem encaminhamento.",
    ],
    summary:
      "Elevação passiva da perna com o joelho estendido para investigar sintomas relacionados ao sistema neural lombossacro.",
    purpose:
      "Observar se o movimento reproduz a queixa habitual e se essa resposta muda ao modificar a carga sobre o sistema neural. É usado na avaliação de dor lombar com sintomas na perna e na suspeita de dor radicular.",
    indications: [
      "Dor lombar que se irradia para a perna, especialmente com suspeita de envolvimento de raízes lombossacras.",
      "Comparação entre os lados e acompanhamento da resposta dos sintomas, usando a mesma técnica nas reavaliações.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e registre a queixa inicial. Faça a prática clínica com formação e supervisão adequadas.",
      "Interrompa ao reproduzir os sintomas relevantes ou se houver dor intensa. Não force a amplitude nem use o teste como alongamento.",
      "Trauma recente, suspeita de fratura, restrições após cirurgia ou incapacidade de permanecer deitado exigem avaliação de segurança antes da manobra.",
      "Dor lombar/na perna com alteração urinária ou intestinal recente, perda de sensibilidade no períneo ou fraqueza progressiva exige encaminhamento urgente; não aguarde um Lasègue positivo.",
    ],
    steps: [
      {
        title: "Preparar e posicionar",
        angle: 0,
        text: "Paciente em decúbito dorsal: deitado de barriga para cima, relaxado, com as pernas apoiadas. Identifique onde e como são os sintomas habituais; avalie os dois lados, começando pelo menos sintomático quando tolerado.",
        cue: "Quadril em posição neutra; joelho estendido; tornozelo relaxado.",
      },
      {
        title: "Elevar passivamente",
        angle: 45,
        text: "Apoie o membro e eleve lentamente a perna por flexão do quadril, mantendo o joelho estendido. O examinador produz o movimento; o paciente não levanta a perna sozinho.",
        cue: "Mantenha o joelho estendido e evite compensar com rotação do quadril.",
      },
      {
        title: "Identificar a resposta",
        angle: 45,
        text: "Pare na primeira reprodução relevante dos sintomas. Pergunte se é a mesma dor da queixa, onde ela aparece e se irradia abaixo do joelho. Registre ângulo, localização e intensidade.",
        cue: "O ângulo ilustrado é um exemplo; a animação não prevê o início da dor.",
      },
      {
        title: "Diferenciar com cuidado",
        angle: 35,
        text: "Quando apropriado e tolerado, reduza um pouco a elevação e faça dorsiflexão suave do tornozelo para observar se os sintomas mudam. Essa sensibilização, associada à manobra de Bragard, complementa a avaliação; não confirma sozinha a origem da dor.",
        cue: "Observe mudança da queixa habitual, evitando provocar dor intensa.",
      },
      {
        title: "Retornar e comparar",
        angle: 0,
        text: "Abaixe a perna lentamente, confirme o retorno ao estado inicial e compare os achados dos lados. Integre o resultado ao restante do exame.",
        cue: "Registre o que ocorreu, em vez de anotar apenas positivo ou negativo.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo de participação neural",
        text: "Reprodução da dor habitual irradiada para a perna, especialmente abaixo do joelho, e mudança dos sintomas com diferenciação estrutural apoiam a suspeita de mecanossensibilidade neural. A faixa de 30–70° é frequentemente descrita, mas o ângulo isolado não define o resultado.",
      },
      {
        title: "Alongamento muscular não basta",
        text: "Sensação de alongamento posterior da coxa, sem reproduzir a queixa irradiada, não deve ser rotulada automaticamente como Lasègue positivo para dor radicular. Dor lombar isolada também requer outra interpretação.",
      },
      {
        title: "Resultado negativo",
        text: "Ausência de reprodução da queixa reduz a suspeita em alguns contextos, mas não exclui toda radiculopatia nem substitui o exame neurológico.",
      },
      {
        title: "Diagnósticos em investigação",
        text: "Hérnia de disco com irritação de raiz é uma hipótese possível. Outras causas de irritação neural e quadros musculoesqueléticos podem produzir respostas semelhantes. O teste não identifica sozinho a causa, o nível da lesão ou a necessidade de cirurgia.",
      },
    ],
    reasoning: [
      "Relacione a resposta à história: distribuição da dor, sintomas sensitivos, início e impacto nas atividades.",
      "Compare força muscular, sensibilidade e reflexos dos membros inferiores. Radiculopatia envolve disfunção de raiz; dor irradiada, isoladamente, não estabelece esse diagnóstico.",
      "Procure concordância entre história, Lasègue e exame neurológico. Achados discordantes pedem revisão da hipótese e dos diagnósticos diferenciais.",
      "Considere outros testes e avaliação especializada conforme o caso. No Lasègue cruzado, elevar o lado menos sintomático reproduz dor no lado afetado; é um complemento com interpretação própria.",
      "Exames de imagem não são solicitados rotineiramente apenas por um teste positivo. Devem responder a uma questão clínica e poder mudar a conduta, conforme avaliação profissional.",
    ],
    mistakes: [
      "Flexionar o joelho durante a elevação ou permitir compensações sem registrar.",
      "Confundir um movimento ativo com a elevação passiva usada nesta manobra.",
      "Classificar qualquer desconforto ou qualquer ângulo baixo como hérnia de disco.",
      "Aplicar percentuais de sensibilidade/especificidade como se fossem iguais para todas as populações e técnicas.",
    ],
    record:
      "Exemplo fictício: SLR direito — dor habitual irradiada até a panturrilha a 45°, intensidade 4/10; modifica-se com dorsiflexão após pequena redução da elevação. Esquerdo sem reprodução da queixa. Registrar separadamente força, sensibilidade, reflexos e hipótese clínica.",
    related: [
      "nervo-ciatico",
      "nervo-tibial",
      "nervo-fibular-comum",
      "vertebras-lombares",
      "sacro",
      "semitendineo",
      "semimembranaceo",
      "biceps-femoral",
    ],
    sources: [
      "lasegue-technique",
      "slr-clinical",
      "slr-accuracy",
      "slr-review",
      "nass-radiculopathy",
      "nice-back-pain",
      "nice-neurological",
    ],
    cases: [
      {
        id: "irradiada",
        question:
          "Caso fictício: a elevação a 45° reproduz a dor habitual até a panturrilha, e uma diferenciação estrutural modifica essa dor. Qual interpretação é mais adequada?",
        choices: [
          "Confirma hérnia de disco em L5–S1.",
          "Apoia participação neural; correlacionar com história e exame neurológico.",
          "É apenas encurtamento dos isquiotibiais.",
        ],
        correct: 1,
        explanation:
          "O conjunto apoia uma hipótese neural. A causa e o nível dependem da avaliação completa; nem o ângulo nem a resposta isolada confirmam hérnia.",
      },
      {
        id: "alongamento",
        question:
          "Caso fictício: a 80°, há somente sensação de alongamento posterior da coxa, sem a dor irradiada da queixa. O que registrar?",
        choices: [
          "Lasègue positivo e diagnóstico de ciática.",
          "Ausência de qualquer problema neurológico.",
          "Alongamento posterior sem reprodução da queixa; integrar ao restante do exame.",
        ],
        correct: 2,
        explanation:
          "Descreva o achado observado. Alongamento não equivale automaticamente a dor radicular, e esse resultado não exclui todas as alterações neurológicas.",
      },
      {
        id: "alerta",
        question:
          "Caso fictício: dor lombar com irradiação e dificuldade urinária recente, acompanhada de perda de sensibilidade no períneo. Qual prioridade?",
        choices: [
          "Encaminhar para avaliação urgente, sem depender do resultado do Lasègue.",
          "Elevar até a dor máxima para confirmar o diagnóstico.",
          "Repetir o teste em casa por alguns dias.",
        ],
        correct: 0,
        explanation:
          "Esses sintomas podem indicar comprometimento grave, como síndrome da cauda equina. A prioridade é avaliação urgente; o teste não é uma etapa obrigatória para encaminhar.",
      },
    ],
  },
  slumpTest,
  ...lowerQuadrantTests,
];

export const clinicalTestById = Object.fromEntries(
  clinicalTests.map((test) => [test.id, test]),
);
