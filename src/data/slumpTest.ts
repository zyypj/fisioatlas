import type { ClinicalTest } from "./clinicalTests";

export const slumpTest: ClinicalTest = {
  id: "slump",
  name: "Teste de Slump",
  aliases: [
    "Slump sentado",
    "Seated Slump Test",
    "Teste neurodinâmico sentado",
  ],
  region: "Coluna · sistema neural do membro inferior",
  summary:
    "Sequência em posição sentada que combina movimentos do tronco, cervical, joelho e tornozelo para investigar a resposta dos sintomas à carga neural.",
  executionNote:
    "Este módulo demonstra o Slump sentado sem pressão adicional. Progrida conforme a tolerância; na diferenciação, libere a cervical mantendo a posição do membro inferior.",
  purpose:
    "Investigar a participação do sistema neural na queixa lombar ou na perna. Compare os sintomas habituais e observe sua mudança ao retirar um componente distante, como a flexão cervical. O teste compõe o raciocínio clínico e não determina sozinho a causa.",
  indications: [
    "Dor lombar com sintomas na perna, parestesias ou suspeita de mecanossensibilidade neural, quando a posição sentada for tolerada.",
    "Complementar o Lasègue e o exame neurológico, inclusive quando os achados não são concordantes.",
    "Comparar os lados e acompanhar mudanças usando a mesma posição e sequência nas reavaliações.",
  ],
  safety: [
    "Explique os movimentos, obtenha consentimento e registre a queixa inicial. Pratique com formação e supervisão clínica.",
    "Pare ao reproduzir a queixa relevante. Não force o joelho, o tornozelo ou o pescoço para alcançar o ângulo mostrado.",
    "Sintomas muito irritáveis, trauma recente, suspeita de fratura ou restrições após cirurgia exigem avaliação de segurança antes da manobra.",
    "Alteração urinária ou intestinal recente, perda de sensibilidade no períneo ou fraqueza progressiva exigem encaminhamento urgente, sem aguardar o Slump.",
  ],
  steps: [
    {
      title: "Sentar e preparar",
      angle: 90,
      text: "Posicione a pessoa sentada na borda de uma maca estável, com pernas livres, joelhos inicialmente flexionados e braços atrás do tronco. Observe a posição inicial e pergunte onde e como são os sintomas habituais.",
      cue: "Não apoiar o pé da perna testada no chão. As amplitudes da animação são ilustrativas.",
    },
    {
      title: "Flexionar o tronco",
      angle: 25,
      text: "Peça que curve suavemente a região torácica e lombar, assumindo uma postura relaxada em flexão. Registre a resposta antes de adicionar o próximo movimento.",
      cue: "O Slump envolve a coluna, não apenas inclinar o corpo inteiro pelo quadril.",
    },
    {
      title: "Flexionar a cervical",
      angle: 30,
      text: "Mantendo o tronco, peça uma flexão cervical suave, aproximando o queixo do peito dentro do conforto. Pergunte se surgiu ou mudou algum sintoma.",
      cue: "Nesta demonstração não há pressão adicional sobre a cabeça.",
    },
    {
      title: "Estender o joelho",
      angle: 20,
      text: "Mantendo tronco e cervical, peça que estenda progressivamente o joelho direito até a primeira resposta relevante ou o limite tolerado. Observe localização, intensidade e se corresponde à queixa habitual.",
      cue: "20° de flexão é só o exemplo da animação. Não é ponto de corte nem meta de execução.",
    },
    {
      title: "Dorsifletir o tornozelo",
      angle: 12,
      text: "Se tolerado, mantenha o joelho e acrescente dorsiflexão suave, aproximando a ponta do pé da perna. Pergunte como a queixa muda. Interrompa se a resposta for excessiva.",
      cue: "Adicione um componente por vez; não confunda dor intensa com melhor resultado.",
    },
    {
      title: "Liberar a cervical",
      angle: 0,
      text: "Mantenha tronco, joelho e tornozelo na mesma posição e peça que levante a cabeça, retornando a cervical em direção ao neutro. Observe se a queixa na perna diminui ou muda.",
      cue: "Mude apenas a cervical para a diferenciação estrutural. Não abaixe a perna junto.",
    },
    {
      title: "Retornar e comparar",
      angle: 90,
      text: "Relaxe o tornozelo, flexione lentamente o joelho e retorne o tronco à posição sentada confortável. Confirme o retorno aos sintomas iniciais e compare com o outro lado, conforme tolerado.",
      cue: "Registre a resposta em cada componente e integre ao restante da avaliação.",
    },
  ],
  interpretation: [
    {
      title: "Achado que apoia participação neural",
      text: "Reproduzir a queixa habitual e observar sua mudança ao liberar a cervical, mantendo o membro inferior, apoia a hipótese neural. Considere a comparação entre lados e a história clínica.",
    },
    {
      title: "Alongamento não equivale a doença",
      text: "Pessoas sem sintomas também podem sentir tensão posterior e apresentar alívio ao levantar a cabeça. Alongamento novo, isoladamente, não estabelece um Slump positivo nem uma lesão.",
    },
    {
      title: "Sem reprodução da queixa",
      text: "Registre a ausência de reprodução dos sintomas habituais. Isso não exclui todas as causas de dor, irritação neural ou radiculopatia.",
    },
    {
      title: "Hipóteses e limites",
      text: "O achado contribui para investigar a participação do sistema neural lombossacro. Não confirma hérnia de disco, nível de compressão ou lesão do nervo ciático por si só.",
    },
  ],
  reasoning: [
    "Relacione a resposta à distribuição e às características da queixa habitual.",
    "Integre força, sensibilidade e reflexos. Dor irradiada e radiculopatia não são sinônimos.",
    "Compare com o Lasègue e o lado contralateral, registrando técnica e tolerância.",
    "Se cervical e perna mudam juntas, a diferenciação fica difícil de interpretar. Refaça apenas se seguro e tolerado.",
    "Considere avaliação especializada ou exames complementares conforme a pergunta clínica, sem decidir pela imagem apenas com um teste positivo.",
  ],
  mistakes: [
    "Adicionar todos os componentes de uma vez ou não perguntar sobre a resposta em cada etapa.",
    "Flexionar o joelho ou relaxar o tornozelo ao liberar a cervical, perdendo a comparação.",
    "Forçar a cabeça ou o membro para atingir os ângulos da animação.",
    "Tratar tensão posterior comum ou melhora com liberação cervical, isoladamente, como diagnóstico de hérnia.",
  ],
  record:
    "Exemplo fictício: Slump direito — queixa habitual na panturrilha durante extensão do joelho; aumenta com dorsiflexão e diminui com retorno cervical ao neutro, mantendo tronco e membro. Retorno ao estado inicial após a sequência. Registrar amplitudes medidas, intensidade, comparação entre lados e exame neurológico.",
  related: [
    "nervo-ciatico",
    "nervo-tibial",
    "nervo-fibular-comum",
    "vertebras-lombares",
    "vertebra-c7",
    "sacro",
    "semitendineo",
    "semimembranaceo",
    "biceps-femoral",
  ],
  sources: [
    "slump-procedure",
    "slump-reliability",
    "slump-accuracy",
    "slr-review",
    "nice-back-pain",
    "nice-neurological",
  ],
  evidence: {
    text: "Um estudo com 75 pessoas com suspeita de hérnia e referência por ressonância encontrou sensibilidade de 84% e especificidade de 83% para o Slump. Os números pertencem àquela amostra e técnica; não são regra universal. Estudos em pessoas assintomáticas mostram que respostas ao teste também ocorrem sem doença.",
    source: "slump-accuracy",
  },
  cases: [
    {
      id: "diferenciacao",
      question:
        "Caso fictício: a queixa habitual na panturrilha diminui ao liberar a cervical, enquanto joelho e tornozelo ficam na mesma posição. O que concluir?",
      choices: [
        "Confirma compressão em L5–S1.",
        "Apoia participação neural; integrar à história e ao exame neurológico.",
        "Exclui participação muscular e todas as outras causas.",
      ],
      correct: 1,
      explanation:
        "Mudar um componente distante contribui para a hipótese neural. O teste não estabelece sozinho a causa ou o nível.",
    },
    {
      id: "tensao-normal",
      question:
        "Caso fictício: há apenas tensão posterior nova, sem reproduzir a queixa habitual. Ela diminui ao levantar a cabeça. Qual registro é adequado?",
      choices: [
        "Slump positivo e hérnia confirmada.",
        "Exame neurológico normal, sem necessidade de investigar.",
        "Tensão sem reprodução da queixa; interpretar com os demais achados.",
      ],
      correct: 2,
      explanation:
        "Esse tipo de resposta também ocorre em pessoas assintomáticas. Descreva o observado e evite diagnosticar pela sensação isolada.",
    },
    {
      id: "controle",
      question:
        "Caso fictício: ao levantar a cabeça, a pessoa também flexiona o joelho e a dor diminui. O que limita a interpretação?",
      choices: [
        "Dois componentes foram liberados; não se pode atribuir a mudança apenas à cervical.",
        "Isso prova lesão do nervo ciático.",
        "O joelho não influencia a resposta do Slump.",
      ],
      correct: 0,
      explanation:
        "A diferenciação exige manter os outros componentes. Segurança e conforto têm prioridade sobre repetir a manobra.",
    },
  ],
};
