import type { ClinicalTest } from "../clinicalTests";

export const pelveSources: {
  id: string;
  name: string;
  url: string;
  note: string;
}[] = [
  {
    id: "pv-laslett-2005",
    name: "Laslett et al. — Validade dos testes de provocação sacroilíaca isolados e combinados (2005)",
    url: "https://pubmed.ncbi.nlm.nih.gov/16038856/",
    note: "Em 48 pacientes comparados ao bloqueio anestésico intra-articular, 3 ou mais de 6 provocações positivas tiveram sensibilidade de 94% e especificidade de 78%; quaisquer 2 de 4 testes selecionados tiveram a maior área sob a curva (0,842), e seis testes negativos tornaram a sacroilíaca improvável.",
  },
  {
    id: "pv-laslett-2008",
    name: "Laslett — Diagnóstico e tratamento da sacroilíaca dolorosa baseados em evidências (2008)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2582421/",
    note: "Revisão que descreve a técnica de distração, compressão, thigh thrust, Gaenslen e sacral thrust e mostra que excluir quem centraliza os sintomas eleva a especificidade de 3 ou mais testes positivos de 78% para 87%.",
  },
  {
    id: "pv-petersen-2017",
    name: "Petersen, Laslett e Juhl — Regras diagnósticas na dor lombar a partir de revisões sistemáticas (2017)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5429540/",
    note: "Recomenda a regra de Laslett (3 de 5: distração, compressão, thigh thrust, Gaenslen e sacral thrust) e o acréscimo da ausência de centralização como regra clínica para dor de origem sacroilíaca.",
  },
  {
    id: "pv-szadek-2009",
    name: "Szadek et al. — Validade diagnóstica dos critérios de dor sacroilíaca: revisão sistemática (2009)",
    url: "https://pubmed.ncbi.nlm.nih.gov/19101212/",
    note: "Metanálise em que thigh thrust, compressão e 3 ou mais testes de estresse positivos mostraram poder discriminativo contra bloqueio duplo, com a ressalva da falta de padrão-ouro.",
  },
  {
    id: "pv-vleeming-2008",
    name: "Vleeming et al. — Diretrizes europeias para dor na cintura pélvica (2008)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2518998/",
    note: "Diretriz que recomenda P4/thigh thrust, FABER, Gaenslen e palpação do ligamento dorsal longo para a sacroilíaca e o ASLR como teste funcional, descrevendo a técnica de cada um.",
  },
  {
    id: "pv-mens-2001",
    name: "Mens et al. — Confiabilidade e validade do ASLR na dor pélvica posterior desde a gestação (2001)",
    url: "https://pubmed.ncbi.nlm.nih.gov/11413432/",
    note: "Estudo que padronizou a pontuação do ASLR (0–5 por lado) e relatou boa confiabilidade teste-reteste e alta sensibilidade/especificidade em mulheres com dor pélvica pós-gestação.",
  },
];

/** Raciocínio do cluster de Laslett, compartilhado pelos testes de provocação. */
const clusterLaslett =
  "Cluster de Laslett: nenhum teste de provocação isolado é confiável para apontar a sacroilíaca. Considere a hipótese quando pelo menos 2 de 4 testes selecionados (distração, thigh thrust, compressão e sacral thrust) ou 3 de 5 testes (os quatro mais o Gaenslen) reproduzem a dor familiar. No estudo de Laslett et al. (2005), 3 ou mais de 6 provocações positivas (Gaenslen feito dos dois lados) tiveram sensibilidade de 94% e especificidade de 78%, e quando nenhuma das seis reproduziu a dor a sacroilíaca ficou improvável.";

const exclusaoDiscogenica =
  "Antes de aplicar o cluster, exclua o padrão discogênico: avalie movimentos repetidos e posições sustentadas e observe se a dor centraliza (recua em direção à linha média). Testes sacroilíacos positivos em quem centraliza tendem a ser falsos positivos; restringir a interpretação a quem não centraliza elevou a especificidade de 3 ou mais testes de 78% para 87%, com sensibilidade de 91% (Laslett, 2008). Dor radicular por hérnia também pode tornar esses testes positivos.";

export const pelveTests: ClinicalTest[] = [
  {
    id: "distracao-sacroiliaca",
    name: "Teste de distração sacroilíaca",
    aliases: [
      "Gapping test",
      "Distraction test",
      "Teste de afastamento",
      "Teste de abertura anterior da sacroilíaca",
    ],
    category: "pelve",
    kind: "provocacao",
    region: "Pelve · articulação sacroilíaca (porção anterior)",
    position:
      "Paciente em decúbito dorsal com as pernas estendidas; examinador ao lado da maca, com os braços cruzados e a base das mãos apoiada sobre as duas espinhas ilíacas anterossuperiores (EIAS).",
    summary:
      "Pressão sobre as duas EIAS, dirigida para a maca e levemente para fora, que afasta a porção anterior das sacroilíacas e comprime a posterior para tentar reproduzir a dor familiar.",
    purpose:
      "Provocar a dor habitual da pessoa estressando as duas sacroilíacas ao mesmo tempo. É um dos quatro testes da regra 2 de 4 de Laslett e costuma ser feito no início da sequência. Isolado, não identifica a origem da dor; o valor está na combinação com os demais testes e com a história.",
    indications: [
      "Dor lombar baixa ou glútea unilateral, centrada abaixo de L5 e próxima da espinha ilíaca posterossuperior (EIPS), com suspeita de origem sacroilíaca.",
      "Dor na cintura pélvica relacionada à gestação, ao pós-parto ou a trauma em queda sobre o glúteo, como parte do cluster de provocação.",
      "Reavaliação da resposta dolorosa com a mesma técnica ao longo do tratamento.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e registre a dor inicial. A execução exige formação e supervisão clínica; o teste não fecha diagnóstico.",
      "Aumente a pressão aos poucos e pare ao reproduzir a dor familiar. Não use impulsos bruscos; o objetivo é provocar a queixa, não a dor máxima.",
      "Trauma pélvico recente, suspeita de fratura do anel pélvico ou do sacro, osteoporose importante, gestação avançada ou cirurgia abdominal recente exigem avaliação de segurança antes de comprimir a pelve.",
      "Febre, dor noturna intensa e contínua, perda de peso sem explicação, histórico de câncer, rigidez matinal prolongada que melhora com movimento ou alteração urinária/perineal pedem encaminhamento médico, não um teste de provocação.",
    ],
    steps: [
      {
        title: "Mapear a dor familiar",
        text: "Antes de tocar, peça que a pessoa aponte com um dedo onde dói e descreva a dor habitual. Registre se ela fica abaixo de L5, perto da EIPS, no glúteo ou na coxa posterior.",
        cue: "Sem saber qual é a dor familiar, não há como julgar se o teste a reproduziu.",
      },
      {
        title: "Posicionar",
        text: "Paciente em decúbito dorsal, pernas estendidas e braços ao lado do corpo. Se a lordose ficar desconfortável, coloque uma pequena toalha dobrada sob a lombar.",
        cue: "Uma posição de repouso confortável evita confundir dor lombar postural com resposta ao teste.",
      },
      {
        title: "Apoiar as mãos nas EIAS",
        text: "Cruze os antebraços e apoie a base de cada mão na face medial da EIAS oposta. O cruzamento faz a força seguir para trás e um pouco para fora, abrindo a parte anterior das sacroilíacas.",
        cue: "Contato largo e macio: a EIAS é superficial e dolorosa à pressão de pontas de dedo.",
      },
      {
        title: "Aplicar pressão progressiva",
        text: "Com os cotovelos estendidos, use o peso do tronco para aplicar pressão vertical em direção à maca, sustentada por alguns segundos e, se necessário, repetida algumas vezes com intensidade crescente.",
        cue: "Progrida devagar e observe a expressão do paciente; pare na primeira reprodução da queixa.",
      },
      {
        title: "Perguntar e registrar",
        text: "Pergunte se surgiu a dor de costume e onde. Diferencie dor posterior (região sacroilíaca, glúteo) de desconforto na frente, sob as mãos. Alivie a pressão e anote o resultado.",
        cue: "Dor só na frente, sob as mãos, não conta como positivo.",
      },
    ],
    interpretation: [
      {
        title: "Achado positivo",
        text: "Reprodução da dor familiar na região posterior da pelve, em um ou nos dois lados, durante a pressão. Conta como um item do cluster de provocação sacroilíaca.",
      },
      {
        title: "Achado negativo",
        text: "Pressão adequada sem reproduzir a queixa. Um único negativo pesa pouco; quando todos os testes do cluster são negativos, a sacroilíaca como fonte da dor fica bem menos provável.",
      },
      {
        title: "Armadilhas",
        text: "Desconforto local sobre as EIAS, dor abdominal ou lombar central por mudança de posição podem ser rotulados erroneamente como positivos. Pacientes com muita sensibilidade generalizada à pressão tendem a responder a qualquer manobra.",
      },
      {
        title: "O que o teste não diz",
        text: "Não diferencia entre dor intra-articular, ligamentar ou de estruturas vizinhas, não indica qual lado está envolvido quando a dor é bilateral e não mede mobilidade ou alinhamento da articulação.",
      },
    ],
    reasoning: [
      clusterLaslett,
      exclusaoDiscogenica,
      "Na prática, a distração e o thigh thrust costumam abrir a sequência. Se ambos reproduzirem a dor familiar, a regra 2 de 4 já está satisfeita e não é necessário continuar provocando dor; se não, siga com compressão e sacral thrust.",
      "Integre com a história: dor predominante abaixo de L5 e junto da EIPS, dor ao levantar da cadeira, ao subir escadas ou ao ficar em apoio unipodal favorecem a hipótese; dor central acima de L5 ou com sinais neurológicos aponta para outras fontes.",
      "Testes de mobilidade e de palpação de assimetria não são recomendados para diagnosticar dor sacroilíaca; dê preferência aos testes de provocação, que têm confiabilidade melhor quando padronizados (Laslett, 2008; Vleeming et al., 2008).",
    ],
    caution:
      "Um teste de distração positivo isolado não confirma que a sacroilíaca é a fonte da dor; só a combinação de testes, interpretada com a história e após excluir padrão discogênico, sustenta essa hipótese.",
    mistakes: [
      "Apoiar com as pontas dos dedos sobre as EIAS e registrar a dor local como positivo.",
      "Aplicar um empurrão rápido e forte em vez de pressão progressiva e sustentada.",
      "Não perguntar se a dor é a mesma da queixa nem onde ela aparece.",
      "Concluir disfunção sacroilíaca com um único teste positivo, sem completar o cluster.",
    ],
    record:
      "Exemplo fictício: Distração SI — reproduz dor familiar glútea D (4/10) após 5 s de pressão; sem dor anterior. Parte do cluster: 3/5 positivos (distração, thigh thrust D, compressão); sem centralização nos movimentos repetidos. Hipótese: dor de provável origem sacroilíaca D, a integrar com o restante do exame.",
    related: [
      "sacroiliaca",
      "sacro",
      "osso-do-quadril",
      "ligamento-sacrotuberal",
      "ligamento-sacroespinal",
      "ligamento-iliolombar",
      "vertebras-lombares",
    ],
    sources: ["pv-laslett-2005", "pv-laslett-2008", "pv-petersen-2017"],
    evidence: {
      text: "Não há um número confiável para a distração isolada nos resumos conferidos: ela foi estudada como parte de combinações. Em 48 pacientes com dor lombopélvica crônica encaminhados para bloqueio anestésico da sacroilíaca, a combinação de 3 ou mais de 6 provocações positivas teve sensibilidade de 94% e especificidade de 78% (Laslett et al., 2005). A amostra é pequena e veio de serviço especializado, onde a prevalência de dor sacroilíaca é maior do que na atenção primária.",
      source: "pv-laslett-2005",
    },
    review: [
      "Sei apoiar as mãos nas EIAS com antebraços cruzados e contato largo.",
      "Sei diferenciar a dor familiar posterior do desconforto local sob as mãos.",
      "Sei que a distração é um dos quatro testes da regra 2 de 4 de Laslett.",
      "Sei por que avaliar centralização antes de interpretar os testes sacroilíacos.",
      "Sei quais sinais de alerta pedem encaminhamento antes de provocar dor na pelve.",
    ],
    cases: [
      {
        id: "dor-anterior",
        question:
          "Caso fictício: durante a distração, a paciente relata apenas dor na frente, exatamente onde estão as mãos do examinador, sem a dor glútea habitual. Como registrar?",
        choices: [
          "Distração positiva, sugerindo dor sacroilíaca bilateral.",
          "Distração negativa para a dor familiar, com sensibilidade local sobre as EIAS.",
          "Teste inválido; a pelve precisa de radiografia antes de qualquer conclusão.",
        ],
        correct: 1,
        explanation:
          "O critério é reproduzir a dor familiar. Dor local sob as mãos é sensibilidade à pressão e não conta como item positivo do cluster.",
      },
      {
        id: "centralizacao",
        question:
          "Caso fictício: distração, thigh thrust e compressão reproduzem a dor glútea, mas, na avaliação de movimentos repetidos em extensão, a dor recua do glúteo para a linha média lombar. Qual interpretação é mais coerente?",
        choices: [
          "Dor sacroilíaca confirmada, pois há 3 testes positivos.",
          "Os testes estão errados e devem ser repetidos com mais força.",
          "A centralização sugere origem discogênica; os testes sacroilíacos podem ser falsos positivos.",
        ],
        correct: 2,
        explanation:
          "Na proposta de Laslett, o cluster é interpretado em quem não centraliza. A centralização é muito associada à dor discogênica, e nesse contexto testes sacroilíacos positivos perdem especificidade.",
      },
      {
        id: "febre",
        question:
          "Caso fictício: dor glútea unilateral intensa há cinco dias, febre, dificuldade para apoiar o peso e piora contínua à noite. Qual a prioridade?",
        choices: [
          "Encaminhar para avaliação médica rápida, sem depender dos testes de provocação.",
          "Completar os cinco testes do cluster para confirmar a sacroilíaca.",
          "Orientar exercícios de estabilização e reavaliar em duas semanas.",
        ],
        correct: 0,
        explanation:
          "Febre com dor intensa e incapacidade de apoio pode indicar infecção articular ou óssea. Testes de provocação não ajudam e podem atrasar o encaminhamento.",
      },
    ],
  },
  {
    id: "thigh-thrust",
    name: "Thigh thrust",
    aliases: [
      "Teste de cisalhamento posterior",
      "P4",
      "Posterior pelvic pain provocation test",
      "Teste de provocação da dor pélvica posterior",
      "Posterior shear test",
    ],
    category: "pelve",
    kind: "provocacao",
    region: "Pelve · articulação sacroilíaca (cisalhamento posterior)",
    position:
      "Paciente em decúbito dorsal com o quadril do lado testado flexionado a 90° e o joelho flexionado; examinador do mesmo lado, com uma mão espalmada sob o sacro e a outra sobre o joelho.",
    summary:
      "Força aplicada ao longo do eixo do fêmur, com o quadril a 90° de flexão, que empurra o ilíaco para trás em relação ao sacro estabilizado e produz cisalhamento posterior na sacroilíaca do mesmo lado.",
    purpose:
      "Provocar a dor familiar estressando uma sacroilíaca por vez. Está entre os testes com melhor desempenho individual e confiabilidade, por isso é um dos quatro da regra 2 de 4 de Laslett e um dos recomendados pela diretriz europeia de dor na cintura pélvica. Ainda assim, deve ser interpretado no conjunto.",
    indications: [
      "Dor glútea ou lombar baixa unilateral, próxima da EIPS, com suspeita de origem sacroilíaca.",
      "Dor na cintura pélvica na gestação ou no pós-parto, em que o P4 é um dos testes de provocação recomendados.",
      "Comparação entre lados e acompanhamento da resposta dolorosa com técnica padronizada.",
    ],
    safety: [
      "Explique a manobra e obtenha consentimento. A prática exige formação e supervisão; o teste não fecha diagnóstico.",
      "Quem tem prótese de quadril com restrição de flexão e adução (sobretudo via posterior) não deve ser colocado em flexão de 90° com adução: há risco de luxação.",
      "Aplique força gradual, sem impulso, e pare ao reproduzir a dor familiar. Em gestantes, mantenha o decúbito dorsal pelo menor tempo possível e interrompa se houver tontura ou náusea.",
      "Trauma recente, suspeita de fratura da pelve ou do fêmur, sinais de infecção ou dor noturna intensa e contínua exigem encaminhamento antes de testar.",
    ],
    steps: [
      {
        title: "Mapear a dor familiar",
        text: "Peça que a pessoa aponte onde dói e descreva a dor habitual. Anote localização, intensidade e o que a provoca no dia a dia.",
        cue: "Compare sempre com essa referência ao perguntar sobre a resposta.",
      },
      {
        title: "Posicionar o membro",
        text: "Com o paciente em decúbito dorsal, flexione o quadril do lado testado até 90° com o joelho flexionado, deixando a coxa vertical e em leve adução, sem rodar a pelve.",
        cue: "Adução leve; adução exagerada passa a carregar o quadril e pode provocar dor na virilha.",
      },
      {
        title: "Estabilizar o sacro",
        text: "Coloque a mão espalmada sob o sacro, do lado testado, para fixá-lo contra a maca. Uma alternativa descrita para o P4 é estabilizar a pelve com a mão sobre a EIAS do lado oposto.",
        cue: "Mão sob o sacro, não sob a coluna lombar; confira pelo contato com a base do sacro.",
      },
      {
        title: "Aplicar força ao longo do fêmur",
        text: "Com a outra mão e o tronco sobre o joelho, aplique pressão progressiva para baixo, em direção à maca, seguindo o eixo longo do fêmur. Mantenha alguns segundos ou repita com intensidade crescente.",
        cue: "A força segue a coxa; não empurre o joelho para dentro nem para fora.",
      },
      {
        title: "Identificar a resposta",
        text: "Pergunte se apareceu a dor familiar e onde. Dor profunda no glúteo do lado testado é o padrão esperado; dor na virilha ou na frente do quadril sugere outra fonte.",
        cue: "Registre o local exato, não apenas positivo ou negativo.",
      },
      {
        title: "Comparar os lados",
        text: "Retorne o membro com cuidado e repita do outro lado com a mesma técnica, começando pelo lado menos sintomático quando a irritabilidade for alta.",
        cue: "Mesma posição e mesma progressão de força nos dois lados.",
      },
    ],
    interpretation: [
      {
        title: "Achado positivo",
        text: "Reprodução da dor familiar, bem localizada e profunda na região glútea do lado testado. Conta como um item do cluster; o P4 bilateral positivo em gestantes associa-se com mais frequência a dor lombar, sinfisária ou inguinal associada.",
      },
      {
        title: "Achado negativo",
        text: "Força adequada sem reproduzir a queixa. Reduz a suspeita, mas não a exclui; o peso maior vem do conjunto de testes negativos.",
      },
      {
        title: "Armadilhas",
        text: "Dor na virilha pode vir do próprio quadril (flexão e adução comprimem a região anterior da articulação coxofemoral). Dor lombar central pode surgir pela movimentação da pelve sobre a coluna. Uma mão mal posicionada sob a lombar muda o teste.",
      },
      {
        title: "O que o teste não diz",
        text: "Não identifica qual estrutura da sacroilíaca dói, não mede instabilidade e não prevê qual tratamento funcionará.",
      },
    ],
    reasoning: [
      clusterLaslett,
      exclusaoDiscogenica,
      "Por ter bom desempenho individual, o thigh thrust costuma ser feito logo no início, junto com a distração; se ambos forem positivos, a regra 2 de 4 já está atendida.",
      "Na gestação e no pós-parto, a diretriz europeia combina P4, FABER, Gaenslen e palpação do ligamento dorsal longo para a sacroilíaca, palpação da sínfise e Trendelenburg modificado para a sínfise, e o ASLR como teste funcional.",
      "Teste o quadril separadamente (amplitude, FADIR, FABER) quando a dor provocada for anterior ou inguinal; uma coxofemoral dolorosa pode explicar um thigh thrust aparentemente positivo.",
    ],
    caution:
      "Um thigh thrust positivo isolado não confirma dor de origem sacroilíaca nem justifica, sozinho, exames de imagem ou injeções.",
    mistakes: [
      "Aduzir demais o quadril e provocar dor na virilha, registrada como positivo sacroilíaco.",
      "Posicionar a mão sob a coluna lombar em vez do sacro.",
      "Usar impulso brusco em vez de força progressiva ao longo do fêmur.",
      "Não comparar com o lado oposto nem registrar o local da dor provocada.",
    ],
    record:
      "Exemplo fictício: Thigh thrust D — dor glútea profunda familiar (5/10) com pressão moderada; E sem dor. Distração positiva; regra 2 de 4 satisfeita. Sem centralização nos movimentos repetidos. Quadril D com amplitude completa e FADIR sem dor inguinal.",
    related: [
      "sacroiliaca",
      "sacro",
      "osso-do-quadril",
      "femur",
      "coxofemoral",
      "ligamento-sacrotuberal",
      "gluteo-maximo",
      "piriforme",
    ],
    sources: [
      "pv-laslett-2005",
      "pv-szadek-2009",
      "pv-vleeming-2008",
      "pv-laslett-2008",
    ],
    evidence: {
      text: "Na metanálise de Szadek et al. (2009), com bloqueio duplo como referência, o thigh thrust isolado mostrou poder discriminativo, com razão de chances diagnóstica de 18,5 (IC 95% 5,8–58,5), com intervalo de confiança muito largo por causa das amostras pequenas. Em gestantes, a diretriz europeia cita sensibilidade de 81% e especificidade de 80% para o P4 em 342 mulheres. Os números dependem da população, da técnica e da referência usada, que não é um padrão-ouro perfeito.",
      source: "pv-szadek-2009",
    },
    review: [
      "Sei posicionar o quadril a 90° de flexão com adução leve e estabilizar o sacro.",
      "Sei aplicar a força ao longo do eixo do fêmur, de forma progressiva.",
      "Sei diferenciar dor glútea profunda de dor inguinal de origem coxofemoral.",
      "Sei quando não fazer o teste em quem tem prótese de quadril.",
      "Sei como o thigh thrust entra nas regras 2 de 4 e 3 de 5 de Laslett.",
    ],
    cases: [
      {
        id: "virilha",
        question:
          "Caso fictício: no thigh thrust direito, o paciente sente dor na virilha direita, diferente da dor glútea habitual. Qual o próximo passo mais adequado?",
        choices: [
          "Registrar como negativo para a dor familiar e investigar o quadril com testes específicos.",
          "Registrar como positivo, pois qualquer dor no lado testado conta.",
          "Aumentar a adução para tentar provocar a dor glútea.",
        ],
        correct: 0,
        explanation:
          "A dor provocada não é a familiar e tem localização típica de quadril. O correto é anotar o achado e avaliar a coxofemoral, sem forçar a manobra.",
      },
      {
        id: "protese",
        question:
          "Caso fictício: paciente operou o quadril esquerdo há seis semanas (prótese por via posterior) e relata dor glútea. Como proceder com o thigh thrust esquerdo?",
        choices: [
          "Fazer normalmente, pois o teste avalia a sacroilíaca e não o quadril.",
          "Fazer com mais adução para isolar melhor a sacroilíaca.",
          "Não fazer a manobra em flexão de 90° com adução e discutir a avaliação com a equipe cirúrgica.",
        ],
        correct: 2,
        explanation:
          "Flexão de 90° com adução está entre as posições de risco de luxação após prótese por via posterior. As restrições pós-operatórias têm prioridade sobre o teste.",
      },
      {
        id: "cluster",
        question:
          "Caso fictício: dor glútea esquerda abaixo de L5, sem centralização nos movimentos repetidos; thigh thrust e compressão esquerdos reproduzem a dor familiar, distração e sacral thrust negativos. Como interpretar?",
        choices: [
          "Dor sacroilíaca confirmada; indicar injeção.",
          "A regra 2 de 4 está satisfeita e a hipótese sacroilíaca fica mais provável; integrar ao restante do exame.",
          "Como dois testes foram negativos, a sacroilíaca está descartada.",
        ],
        correct: 1,
        explanation:
          "Dois de quatro testes positivos, sem centralização, aumentam a probabilidade de origem sacroilíaca. É uma hipótese de trabalho, não um diagnóstico confirmado.",
      },
    ],
  },
  {
    id: "compressao-sacroiliaca",
    name: "Teste de compressão sacroilíaca",
    aliases: [
      "Compression test",
      "Teste de compressão em decúbito lateral",
      "Teste de aproximação",
    ],
    category: "pelve",
    kind: "provocacao",
    region: "Pelve · articulação sacroilíaca (compressão transversal)",
    position:
      "Paciente em decúbito lateral com quadris e joelhos flexionados e um travesseiro entre os joelhos; examinador em pé atrás ou à frente, com as mãos sobrepostas na crista ilíaca de cima.",
    summary:
      "Força vertical, dirigida para o chão, sobre a crista ilíaca do lado de cima, que comprime transversalmente a pelve e as duas sacroilíacas.",
    purpose:
      "Provocar a dor familiar aproximando as superfícies das sacroilíacas. É um dos quatro testes da regra 2 de 4 de Laslett e mostrou poder discriminativo moderado em metanálise. Isolado, não identifica a fonte da dor.",
    indications: [
      "Dor glútea ou lombar baixa próxima da EIPS com suspeita de origem sacroilíaca, como parte do cluster de provocação.",
      "Pessoas que toleram mal o decúbito dorsal ou a pressão sobre as EIAS, em que a compressão lateral é mais confortável.",
    ],
    safety: [
      "Explique a manobra e obtenha consentimento. A execução exige formação e supervisão; o teste não fecha diagnóstico.",
      "Trauma pélvico recente, suspeita de fratura por insuficiência do sacro (idosos com osteoporose, pós-parto ou corredores com dor súbita), metástase óssea conhecida ou osteoporose importante contraindicam a compressão até avaliação médica.",
      "Aplique pressão progressiva e pare ao reproduzir a queixa. Em gestantes, use apoio para o abdome e para os joelhos e evite pressão intensa.",
      "Dor que não muda com nenhuma posição, febre, perda de peso ou histórico de câncer pedem encaminhamento, não um teste de provocação.",
    ],
    steps: [
      {
        title: "Mapear a dor familiar",
        text: "Peça que a pessoa aponte onde dói e descreva a dor habitual antes de deitar.",
        cue: "A referência é a dor de costume, não qualquer desconforto.",
      },
      {
        title: "Posicionar em decúbito lateral",
        text: "Paciente deitado de lado, em geral sobre o lado menos sintomático, com quadris e joelhos flexionados de forma confortável e um travesseiro entre os joelhos. Alinhe o tronco para que a pelve fique perpendicular à maca.",
        cue: "Pelve em perfil, sem rodar para frente ou para trás.",
      },
      {
        title: "Localizar a crista ilíaca",
        text: "Apoie as mãos sobrepostas na parte anterior e lateral da crista ilíaca de cima, entre a EIAS e o tubérculo da crista.",
        cue: "Evite o trocânter maior: pressionar ali carrega o quadril e a bolsa trocantérica.",
      },
      {
        title: "Comprimir para o chão",
        text: "Com os cotovelos estendidos, aplique força vertical em direção ao chão, atravessando a pelve. Mantenha por alguns segundos ou repita com intensidade crescente.",
        cue: "A força é vertical; inclinar o tronco do examinador rotaciona a pelve e muda o teste.",
      },
      {
        title: "Perguntar e registrar",
        text: "Pergunte se a dor familiar apareceu e onde. Alivie a pressão e anote resposta, intensidade e localização.",
        cue: "Dor sob as mãos, na crista, não é o critério de positividade.",
      },
    ],
    interpretation: [
      {
        title: "Achado positivo",
        text: "Reprodução da dor familiar na região posterior da pelve durante a compressão. Como o teste comprime as duas articulações, a dor pode aparecer em qualquer lado e deve ser localizada pelo paciente.",
      },
      {
        title: "Achado negativo",
        text: "Compressão adequada sem reproduzir a queixa. Pesa pouco sozinho; ganha valor quando os demais testes do cluster também são negativos.",
      },
      {
        title: "Armadilhas",
        text: "Pressão sobre o trocânter pode provocar dor lateral do quadril (tendinopatia glútea ou bursite). Dor por permanecer deitado de lado, por exemplo no ombro ou na lombar, também pode ser confundida com resposta ao teste.",
      },
      {
        title: "O que o teste não diz",
        text: "Não informa o lado acometido com segurança, não mede mobilidade nem estabilidade e não diferencia dor intra-articular de dor ligamentar.",
      },
    ],
    reasoning: [
      clusterLaslett,
      exclusaoDiscogenica,
      "A compressão costuma vir depois da distração e do thigh thrust: só é necessária quando os dois primeiros não somaram dois positivos.",
      "Dor lateral do quadril reproduzida pela compressão sugere tendinopatia glútea; confirme com palpação do trocânter, apoio unipodal sustentado e testes resistidos de abdutores.",
      "Em suspeita de fratura por insuficiência do sacro, a dor à compressão pode ser intensa e desproporcional; esse cenário exige imagem e avaliação médica, não interpretação como disfunção sacroilíaca.",
    ],
    caution:
      "Uma compressão positiva isolada não confirma dor sacroilíaca; só a soma de testes positivos, sem centralização e coerente com a história, sustenta a hipótese.",
    mistakes: [
      "Apoiar as mãos sobre o trocânter maior em vez da crista ilíaca.",
      "Deixar a pelve rodar para frente ou para trás, mudando a direção da força.",
      "Interpretar desconforto por permanecer deitado de lado como teste positivo.",
      "Concluir o diagnóstico com um único teste positivo.",
    ],
    record:
      "Exemplo fictício: Compressão SI em decúbito lateral E — reproduz dor glútea E familiar (3/10). Distração negativa, thigh thrust E positivo; regra 2 de 4 satisfeita. Sem dor à palpação do trocânter; sem centralização nos movimentos repetidos.",
    related: [
      "sacroiliaca",
      "sacro",
      "osso-do-quadril",
      "ligamento-sacroespinal",
      "ligamento-sacrotuberal",
      "gluteo-medio",
      "sinfise-pubica",
    ],
    sources: ["pv-laslett-2005", "pv-szadek-2009", "pv-laslett-2008"],
    evidence: {
      text: "Na metanálise de Szadek et al. (2009), com bloqueio duplo como referência, a compressão teve razão de chances diagnóstica de 3,9 (IC 95% 1,7–8,9), menor que a do thigh thrust e a da combinação de 3 ou mais testes positivos (17,2). As populações eram de serviços especializados e o bloqueio anestésico não é um padrão-ouro perfeito; por isso, o teste é usado dentro de um cluster.",
      source: "pv-szadek-2009",
    },
    review: [
      "Sei posicionar o paciente em decúbito lateral com a pelve perpendicular à maca.",
      "Sei apoiar as mãos na crista ilíaca e evitar o trocânter maior.",
      "Sei que a compressão estressa as duas sacroilíacas ao mesmo tempo.",
      "Sei reconhecer quando a dor à compressão pode indicar fratura por insuficiência.",
      "Sei em que ponto da sequência do cluster a compressão é necessária.",
    ],
    cases: [
      {
        id: "trocanter",
        question:
          "Caso fictício: durante a compressão, a paciente relata dor na lateral do quadril, exatamente sob as mãos, que fica no trocânter. A dor habitual dela é na mesma região. O que considerar?",
        choices: [
          "Compressão sacroilíaca positiva; não é preciso investigar mais nada.",
          "Mão mal posicionada e possível dor de origem glútea lateral; reposicionar e avaliar o quadril.",
          "A dor lateral confirma lesão da sínfise púbica.",
        ],
        correct: 1,
        explanation:
          "Pressão sobre o trocânter carrega estruturas laterais do quadril. Reposicione na crista ilíaca e investigue tendinopatia glútea com testes específicos.",
      },
      {
        id: "insuficiencia",
        question:
          "Caso fictício: mulher de 78 anos com osteoporose, dor sacral súbita após levantar-se, sem trauma importante, e dor intensa ao apoiar o peso. Qual conduta?",
        choices: [
          "Não fazer testes de provocação e encaminhar para avaliação médica e imagem.",
          "Fazer a compressão com força máxima para confirmar a origem sacroilíaca.",
          "Completar o cluster e iniciar exercícios de estabilização.",
        ],
        correct: 0,
        explanation:
          "O quadro sugere fratura por insuficiência do sacro. Comprimir a pelve pode piorar a dor e não ajuda no diagnóstico; a prioridade é avaliação médica.",
      },
      {
        id: "sequencia",
        question:
          "Caso fictício: distração positiva e thigh thrust negativo. A compressão reproduz a dor familiar. O que isso significa para a regra 2 de 4?",
        choices: [
          "A regra exige que distração e thigh thrust sejam os dois positivos.",
          "Ainda é preciso o Gaenslen positivo para fechar qualquer regra.",
          "A regra 2 de 4 está satisfeita, desde que a dor não centralize.",
        ],
        correct: 2,
        explanation:
          "Quaisquer dois dos quatro testes contam. A interpretação vale para quem não centraliza os sintomas e ainda depende do restante do exame.",
      },
    ],
  },
  {
    id: "sacral-thrust",
    name: "Sacral thrust",
    aliases: [
      "Teste de pressão sacral",
      "Teste de impulso sacral",
      "Sacral thrust test",
    ],
    category: "pelve",
    kind: "provocacao",
    region: "Pelve · sacro e articulações sacroilíacas",
    position:
      "Paciente em decúbito ventral, com um travesseiro sob o abdome se necessário; examinador ao lado da maca, com a base de uma mão na linha média do sacro e a outra mão por cima, reforçando.",
    summary:
      "Pressão vertical sobre o centro do sacro, dirigida para a maca, que leva o sacro em nutação e produz cisalhamento posterior nas duas sacroilíacas.",
    purpose:
      "Provocar a dor familiar estressando as duas sacroilíacas pela pressão direta sobre o sacro. É o último dos quatro testes da regra 2 de 4 de Laslett e, por ter menor confiabilidade em algumas revisões, raramente é decisivo sozinho.",
    indications: [
      "Dor lombar baixa ou glútea próxima da EIPS com suspeita de origem sacroilíaca, quando os testes anteriores do cluster não somaram dois positivos.",
      "Pessoas que toleram o decúbito ventral e em quem os demais testes foram inconclusivos.",
    ],
    safety: [
      "Explique a manobra e obtenha consentimento. A prática exige formação e supervisão; o teste não fecha diagnóstico.",
      "Osteoporose importante, suspeita de fratura por insuficiência do sacro, metástase óssea, trauma recente sobre o sacro ou o cóccix contraindicam a pressão direta.",
      "Gestantes a partir do segundo trimestre geralmente não podem ficar em decúbito ventral; escolha outros testes do cluster.",
      "Aplique pressão progressiva e pare ao reproduzir a queixa. Dor perineal, alteração urinária ou intestinal recente pedem encaminhamento urgente, não teste de provocação.",
    ],
    steps: [
      {
        title: "Mapear a dor familiar",
        text: "Pergunte e registre onde dói e como é a dor habitual antes de posicionar.",
        cue: "Essa é a referência para julgar o resultado.",
      },
      {
        title: "Posicionar em decúbito ventral",
        text: "Paciente de barriga para baixo, braços ao lado do corpo ou apoiados na cabeceira, com um travesseiro sob o abdome se a lombar ficar muito estendida.",
        cue: "Uma lordose exagerada pode provocar dor lombar e confundir o teste.",
      },
      {
        title: "Localizar o ponto de contato",
        text: "Palpe o sacro e apoie a base da mão na linha média, no ponto mais saliente da curvatura sacral, abaixo do processo espinhoso de L5 e acima do cóccix. Coloque a outra mão por cima para reforçar.",
        cue: "Nem sobre L5 (carrega a coluna lombar) nem sobre o cóccix (doloroso e frágil).",
      },
      {
        title: "Aplicar pressão para a maca",
        text: "Com os cotovelos estendidos e o tronco sobre as mãos, aplique pressão vertical progressiva em direção à maca, sustentada por alguns segundos ou repetida com intensidade crescente.",
        cue: "Força perpendicular ao sacro, sem deslizar a mão para cima ou para baixo.",
      },
      {
        title: "Perguntar e registrar",
        text: "Pergunte se a dor familiar surgiu e onde. Alivie a pressão e registre localização, intensidade e lado.",
        cue: "Dor apenas sob a mão, no ponto de contato, não é o critério.",
      },
    ],
    interpretation: [
      {
        title: "Achado positivo",
        text: "Reprodução da dor familiar na região sacroilíaca ou glútea, em um ou nos dois lados. Conta como um item do cluster.",
      },
      {
        title: "Achado negativo",
        text: "Pressão adequada sem reproduzir a queixa. Tem pouco peso isoladamente.",
      },
      {
        title: "Armadilhas",
        text: "A pressão sobre o sacro também move a coluna lombar baixa; dor de origem facetária ou discal em L5–S1 pode ser provocada e confundida com dor sacroilíaca. Pressão sobre o cóccix ou sobre L5 invalida o teste.",
      },
      {
        title: "O que o teste não diz",
        text: "Não separa as duas sacroilíacas, não identifica a estrutura dolorosa e não avalia mobilidade do sacro.",
      },
    ],
    reasoning: [
      clusterLaslett,
      exclusaoDiscogenica,
      "O sacral thrust só é necessário quando distração, thigh thrust e compressão não somaram dois positivos. Se já houver dois positivos, não é preciso fazê-lo.",
      "Revisões divergem sobre a confiabilidade do sacral thrust: a diretriz europeia cita concordância sobre sua baixa confiabilidade entre examinadores, enquanto Laslett relata confiabilidade aceitável com técnica muito padronizada. Padronize o ponto de contato e a progressão da força.",
      "Se a dor provocada for lombar central ou irradiar abaixo do joelho com sinais neurológicos, investigue a coluna lombar e o sistema neural antes de pensar na sacroilíaca.",
    ],
    caution:
      "Um sacral thrust positivo isolado não confirma dor sacroilíaca, pois a pressão também carrega a coluna lombar baixa.",
    mistakes: [
      "Apoiar a mão sobre L5 ou sobre o cóccix em vez do centro do sacro.",
      "Testar com a lombar em hiperextensão, provocando dor facetária.",
      "Fazer o teste em decúbito ventral em gestantes no segundo ou terceiro trimestre.",
      "Contar o sacral thrust como suficiente para o diagnóstico.",
    ],
    record:
      "Exemplo fictício: Sacral thrust — reproduz dor glútea E familiar (3/10). Distração negativa, thigh thrust E negativo, compressão E positiva; 2 de 4 positivos. Sem centralização; sem sinais neurológicos.",
    related: [
      "sacro",
      "sacroiliaca",
      "sacrococcigea",
      "vertebras-lombares",
      "ligamento-iliolombar",
      "multifido-lombar",
      "fascia-toracolombar",
    ],
    sources: [
      "pv-laslett-2005",
      "pv-laslett-2008",
      "pv-petersen-2017",
      "pv-vleeming-2008",
    ],
    evidence: {
      text: "Isolado, o sacral thrust discrimina mal: em um estudo com bloqueio anestésico único (Dreyfuss, 1996), reunido na tabela da revisão de Petersen et al. (2017), teve sensibilidade de 0,51 e especificidade de 0,40. O valor aparece quando entra na regra de Laslett: 3 de 5 testes positivos tiveram sensibilidade de 0,91 e especificidade de 0,78, e a especificidade subiu para 0,87 ao acrescentar a ausência de centralização. As amostras vieram de serviços especializados.",
      source: "pv-petersen-2017",
    },
    review: [
      "Sei localizar o ponto de contato no centro do sacro, longe de L5 e do cóccix.",
      "Sei por que o sacral thrust pode provocar dor lombar e gerar falso positivo.",
      "Sei quando o sacral thrust é desnecessário na sequência do cluster.",
      "Sei as contraindicações à pressão direta sobre o sacro.",
    ],
    cases: [
      {
        id: "gestante",
        question:
          "Caso fictício: gestante de 28 semanas com dor glútea direita. Distração negativa, thigh thrust direito positivo e compressão negativa. Como completar a investigação?",
        choices: [
          "Colocar em decúbito ventral para o sacral thrust, pois é o último teste da regra.",
          "Evitar o decúbito ventral e usar outros testes recomendados, como Gaenslen, FABER, palpação do ligamento dorsal longo e ASLR.",
          "Encerrar a avaliação: um teste positivo já confirma dor sacroilíaca.",
        ],
        correct: 1,
        explanation:
          "O decúbito ventral não é adequado nessa fase da gestação. A diretriz europeia propõe outros testes de provocação e o ASLR para a dor na cintura pélvica.",
      },
      {
        id: "lombar",
        question:
          "Caso fictício: o sacral thrust provoca dor lombar central, acima do sacro, diferente da dor glútea habitual. O ponto de contato estava sobre o processo espinhoso de L5. Como registrar?",
        choices: [
          "Teste tecnicamente inadequado; reposicionar a mão no centro do sacro e repetir se pertinente.",
          "Sacral thrust positivo, confirmando dor sacroilíaca.",
          "Sacral thrust negativo, descartando a sacroilíaca.",
        ],
        correct: 0,
        explanation:
          "Pressão sobre L5 carrega a coluna lombar, não o sacro. O teste deve ser refeito com o contato correto antes de qualquer interpretação.",
      },
      {
        id: "cauda-equina",
        question:
          "Caso fictício: dor sacral com dormência na região do períneo e dificuldade recente para urinar. Qual a prioridade?",
        choices: [
          "Fazer o cluster de Laslett para confirmar a sacroilíaca.",
          "Orientar compressas e reavaliar em uma semana.",
          "Encaminhar para avaliação médica urgente, sem testes de provocação.",
        ],
        correct: 2,
        explanation:
          "Alteração de sensibilidade no períneo com disfunção urinária recente pode indicar síndrome da cauda equina, uma urgência que não depende de testes sacroilíacos.",
      },
    ],
  },
  {
    id: "gaenslen",
    name: "Teste de Gaenslen",
    aliases: [
      "Gaenslen's test",
      "Sinal de Gaenslen",
      "Teste de torção pélvica",
    ],
    category: "pelve",
    kind: "provocacao",
    region: "Pelve · articulações sacroilíacas (torção)",
    position:
      "Paciente em decúbito dorsal na borda da maca, com o quadril do lado testado para fora da borda e a perna pendente, e o outro joelho abraçado contra o peito; examinador em pé ao lado, junto ao paciente.",
    summary:
      "Torção da pelve feita com um quadril em flexão máxima e o outro em extensão, pendente na borda da maca, que gira os ilíacos em sentidos opostos e estressa as duas sacroilíacas.",
    purpose:
      "Provocar a dor familiar por torção da pelve. Faz parte da regra 3 de 5 de Laslett e é um dos testes recomendados pela diretriz europeia de dor na cintura pélvica. Não entra na regra simplificada 2 de 4, que usa distração, thigh thrust, compressão e sacral thrust.",
    indications: [
      "Dor glútea ou lombar baixa com suspeita de origem sacroilíaca, como parte da regra 3 de 5.",
      "Dor na cintura pélvica relacionada à gestação ou ao pós-parto, quando a posição é tolerada.",
      "Complemento quando os outros testes do cluster deram resultados divergentes.",
    ],
    safety: [
      "Explique a manobra e obtenha consentimento. A prática exige formação e supervisão; o teste não fecha diagnóstico.",
      "Há risco de queda: posicione-se junto ao paciente, do lado da borda, e mantenha uma mão de proteção durante toda a manobra.",
      "Prótese de quadril com restrição de extensão ou rotação, coxartrose dolorosa, lesão recente do quadril ou do joelho e gestação avançada (abraçar o joelho comprime o abdome) contraindicam ou exigem adaptação.",
      "Trauma recente, suspeita de fratura, sinais de infecção ou de doença inflamatória sistêmica pedem avaliação médica antes de testar.",
    ],
    steps: [
      {
        title: "Mapear a dor familiar",
        text: "Pergunte e registre onde dói e como é a dor habitual antes de começar.",
        cue: "A referência é a dor de costume.",
      },
      {
        title: "Posicionar na borda",
        text: "Com o paciente em decúbito dorsal, desloque-o até que o glúteo do lado testado fique na borda da maca. Fique em pé desse lado, encostado na maca, para evitar queda.",
        cue: "Garanta apoio seguro antes de qualquer movimento.",
      },
      {
        title: "Flexionar o quadril oposto",
        text: "Peça que o paciente abrace o joelho do lado não testado, levando quadril e joelho em flexão máxima contra o peito. Isso fixa a pelve e retifica a lombar.",
        cue: "A flexão máxima evita que a lombar se arqueie quando a outra perna descer.",
      },
      {
        title: "Deixar a perna testada pendente",
        text: "Deixe a coxa do lado testado descer para fora da borda, em extensão do quadril, com o joelho livre para flexionar.",
        cue: "Desça devagar e observe a reação; não solte a perna de uma vez.",
      },
      {
        title: "Aplicar a torção",
        text: "Com uma mão sobre o joelho flexionado, empurre-o em direção ao peito; com a outra, na parte distal da coxa pendente, empurre-a em direção ao chão. Aumente a força aos poucos e pergunte sobre a dor familiar.",
        cue: "Movimento controlado; o quadril pendente não deve ser levado ao limite da extensão.",
      },
      {
        title: "Inverter os lados",
        text: "Retorne o paciente ao centro da maca, mude de lado e repita. Registre o resultado de cada lado separadamente.",
        cue: "Cada lado é uma provocação; anote qual perna estava pendente.",
      },
    ],
    interpretation: [
      {
        title: "Achado positivo",
        text: "Reprodução da dor familiar na região sacroilíaca ou glútea durante a torção, geralmente anotada no lado da perna pendente. Conta como um item da regra 3 de 5.",
      },
      {
        title: "Achado negativo",
        text: "Torção adequada sem reproduzir a queixa. Tem pouco peso isoladamente.",
      },
      {
        title: "Armadilhas",
        text: "A extensão do quadril com joelho flexionado alonga reto femoral e iliopsoas e tensiona o nervo femoral; dor ou repuxamento na frente da coxa não é Gaenslen positivo. Dor no quadril pode vir da própria coxofemoral.",
      },
      {
        title: "O que o teste não diz",
        text: "Estressa as duas sacroilíacas ao mesmo tempo, em sentidos opostos; por isso, não aponta com certeza o lado acometido nem a estrutura dolorosa.",
      },
    ],
    reasoning: [
      clusterLaslett,
      exclusaoDiscogenica,
      "O Gaenslen acrescentou pouco à regra simplificada 2 de 4, mas faz parte da regra 3 de 5 recomendada por Petersen et al. (2017). Escolha uma das duas regras e aplique-a de forma consistente.",
      "A diretriz europeia aponta concordância sobre a confiabilidade do Gaenslen e do P4 entre examinadores, o que favorece seu uso no acompanhamento de dor na cintura pélvica.",
      "Dor anterior na coxa durante o teste orienta a investigar o nervo femoral (teste de flexão do joelho em prono) e o quadril, não a sacroilíaca.",
    ],
    caution:
      "Um Gaenslen positivo isolado não confirma dor sacroilíaca nem indica o lado acometido com segurança.",
    mistakes: [
      "Deixar o paciente na borda sem proteção contra queda.",
      "Registrar repuxamento na frente da coxa como teste positivo.",
      "Não flexionar ao máximo o quadril oposto, permitindo que a lombar se estenda.",
      "Testar só um lado e não registrar qual perna estava pendente.",
    ],
    record:
      "Exemplo fictício: Gaenslen com perna D pendente — reproduz dor glútea D familiar (4/10); com perna E pendente, sem dor. Cluster 3/5 positivo (distração, thigh thrust D, Gaenslen D). Sem centralização. Repuxamento anterior da coxa bilateral, sem dor familiar.",
    related: [
      "sacroiliaca",
      "osso-do-quadril",
      "sacro",
      "coxofemoral",
      "psoas-maior",
      "iliaco",
      "reto-femoral",
      "nervo-femoral",
    ],
    sources: ["pv-petersen-2017", "pv-vleeming-2008", "pv-laslett-2008"],
    evidence: {
      text: "Não há número confiável para o Gaenslen isolado nos resumos conferidos. Ele integra a regra de Laslett (3 de 5 testes), que teve sensibilidade de 0,91 e especificidade de 0,78 contra bloqueio anestésico, conforme a revisão de Petersen et al. (2017). A diretriz europeia de 2008 recomenda o Gaenslen para a dor na cintura pélvica e cita concordância sobre sua confiabilidade entre examinadores, sem padrão-ouro para validar a acurácia.",
      source: "pv-petersen-2017",
    },
    review: [
      "Sei posicionar o paciente na borda da maca com proteção contra queda.",
      "Sei aplicar a torção com um quadril em flexão máxima e o outro em extensão.",
      "Sei diferenciar dor sacroilíaca de repuxamento anterior da coxa.",
      "Sei que o Gaenslen faz parte da regra 3 de 5, mas não da regra 2 de 4.",
      "Sei registrar o resultado separadamente para cada lado.",
    ],
    cases: [
      {
        id: "coxa-anterior",
        question:
          "Caso fictício: durante o Gaenslen com a perna esquerda pendente, o paciente sente forte repuxamento e formigamento na frente da coxa esquerda, sem a dor glútea habitual. Como interpretar?",
        choices: [
          "Gaenslen negativo para a dor familiar; investigar sensibilidade do nervo femoral e do quadril.",
          "Gaenslen positivo à esquerda, confirmando dor sacroilíaca.",
          "Gaenslen positivo à direita, pela torção oposta.",
        ],
        correct: 0,
        explanation:
          "Extensão do quadril com joelho flexionado tensiona estruturas anteriores e o nervo femoral. Sem a dor familiar, o teste não é positivo para a sacroilíaca.",
      },
      {
        id: "regras",
        question:
          "Caso fictício: distração e Gaenslen direito são positivos; thigh thrust, compressão e sacral thrust são negativos. Sem centralização. Como aplicar as regras de Laslett?",
        choices: [
          "Satisfaz a regra 3 de 5, que exige dois positivos.",
          "Satisfaz a regra 2 de 4 e a regra 3 de 5.",
          "Não satisfaz a regra 3 de 5; na regra 2 de 4 conta só a distração, que é um item.",
        ],
        correct: 2,
        explanation:
          "O Gaenslen não está entre os quatro testes da regra 2 de 4, e a regra 3 de 5 exige três positivos. O quadro não atinge nenhuma das duas.",
      },
      {
        id: "inflamatoria",
        question:
          "Caso fictício: homem de 26 anos com dor glútea alternante há oito meses, rigidez matinal de mais de uma hora que melhora com exercício e acorda à noite com dor. O Gaenslen é positivo bilateralmente. Qual a conduta mais adequada?",
        choices: [
          "Tratar como disfunção mecânica da sacroilíaca com exercícios de estabilização.",
          "Encaminhar para avaliação médica por suspeita de doença inflamatória, como espondiloartrite axial.",
          "Repetir o teste com mais força para definir o lado.",
        ],
        correct: 1,
        explanation:
          "Idade jovem, rigidez matinal prolongada que melhora com movimento e dor noturna sugerem dor lombar inflamatória. Testes de provocação positivos não diferenciam sacroileíte inflamatória de dor mecânica.",
      },
    ],
  },
  {
    id: "elevacao-ativa-perna-estendida",
    name: "Elevação ativa da perna estendida",
    aliases: [
      "ASLR",
      "Active Straight Leg Raise",
      "Teste de elevação ativa da perna",
    ],
    category: "pelve",
    kind: "funcional",
    region: "Pelve · transferência de carga lombopélvica",
    position:
      "Paciente em decúbito dorsal com as pernas estendidas e os pés afastados cerca de 20 cm; examinador ao lado, observando tronco, pelve e respiração.",
    summary:
      "O paciente eleva ativamente uma perna estendida cerca de 20 cm acima da maca e pontua a dificuldade de 0 a 5, avaliando a capacidade de transferir carga entre tronco e membros inferiores pela pelve.",
    purpose:
      "Avaliar de forma simples a dificuldade e a estratégia de controle usadas para elevar a perna, sobretudo na dor da cintura pélvica na gestação e no pós-parto. É o teste funcional recomendado pela diretriz europeia e serve também para acompanhar a evolução. Não é um teste de provocação de uma estrutura específica.",
    indications: [
      "Dor na cintura pélvica relacionada à gestação ou ao pós-parto, com queixa ao caminhar, ficar em pé, virar na cama ou subir escadas.",
      "Suspeita de dificuldade de transferência de carga lombopélvica em dor sacroilíaca ou sinfisária, como complemento aos testes de provocação.",
      "Acompanhamento da evolução com uma medida simples, pontuada pelo próprio paciente.",
    ],
    safety: [
      "Explique o teste e obtenha consentimento. A avaliação exige formação e supervisão; o teste não fecha diagnóstico.",
      "Em gestantes a partir da segunda metade da gestação, mantenha o decúbito dorsal pelo menor tempo possível ou com leve inclinação para a esquerda; se surgirem tontura, náusea ou palidez, vire a gestante de lado.",
      "Sangramento vaginal, contrações regulares, perda de líquido, dor abdominal intensa, dor e inchaço na panturrilha, dor de cabeça forte ou alteração visual exigem encaminhamento obstétrico imediato.",
      "No pós-parto, dor intensa na sínfise com incapacidade de apoiar o peso ou de caminhar pede avaliação médica antes dos testes.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Paciente em decúbito dorsal, pernas estendidas, pés afastados cerca de 20 cm e braços relaxados ao lado do corpo.",
        cue: "Mesma posição em todas as reavaliações para permitir comparação.",
      },
      {
        title: "Instruir sem demonstrar estratégia",
        text: "Peça que eleve uma perna, com o joelho estendido, cerca de 20 cm acima da maca, mantenha um instante e abaixe; depois faça o mesmo com a outra.",
        cue: "Não ensine como contrair o abdome antes do teste; o objetivo é ver a estratégia espontânea.",
      },
      {
        title: "Pontuar a dificuldade",
        text: "Para cada lado, peça uma nota: 0 sem dificuldade, 1 minimamente difícil, 2 um pouco difícil, 3 razoavelmente difícil, 4 muito difícil, 5 incapaz. Some os dois lados (0 a 10).",
        cue: "É a percepção de dificuldade do paciente, não a dor nem a altura alcançada.",
      },
      {
        title: "Observar a estratégia",
        text: "Observe rotação do tronco ou da pelve para algum lado, prender a respiração, abaulamento do abdome, depressão do tórax, tremor ou sensação de perna pesada.",
        cue: "Anote o que vê; compensações dizem tanto quanto a nota.",
      },
      {
        title: "Repetir com compressão pélvica",
        text: "Se o teste foi difícil, repita com compressão manual leve da pelve (mãos nas laterais dos ilíacos, aproximando-os) ou com um cinto pélvico. Pergunte se a elevação ficou mais fácil.",
        cue: "Facilitação com a compressão orienta a hipótese de déficit de controle de carga, não confirma lesão.",
      },
      {
        title: "Registrar",
        text: "Anote a nota de cada lado, a soma, as compensações observadas e o efeito da compressão.",
        cue: "Registros detalhados permitem acompanhar a evolução.",
      },
    ],
    interpretation: [
      {
        title: "Achado positivo",
        text: "Qualquer nota de 1 ou mais foi o ponto de corte usado por Mens et al. (2001). Notas mais altas, compensações evidentes e facilitação com a compressão pélvica sugerem dificuldade na transferência de carga pela pelve.",
      },
      {
        title: "Achado negativo",
        text: "Nota 0 nos dois lados, sem compensações. Não exclui dor sacroilíaca ou sinfisária; apenas indica que essa tarefa não está comprometida.",
      },
      {
        title: "Armadilhas",
        text: "Fraqueza de flexores do quadril, dor lombar de outra origem, sensibilidade neural na elevação da perna ou dor abdominal pós-cirúrgica (por exemplo, após cesariana) também tornam a tarefa difícil. Instruir uma estratégia antes do teste mascara o resultado.",
      },
      {
        title: "O que o teste não diz",
        text: "Não identifica qual articulação ou estrutura dói, não diagnostica instabilidade e não substitui os testes de provocação e a história clínica.",
      },
    ],
    reasoning: [
      "Combine o ASLR com os testes de provocação recomendados pela diretriz europeia (P4/thigh thrust, FABER, Gaenslen, palpação do ligamento dorsal longo, palpação da sínfise e Trendelenburg modificado) para caracterizar a dor na cintura pélvica.",
      "Se houver suspeita de dor de origem sacroilíaca, o cluster de Laslett é o caminho: pelo menos 2 de 4 (distração, thigh thrust, compressão, sacral thrust) ou 3 de 5 testes positivos, interpretados após excluir padrão discogênico pela avaliação de centralização (Laslett, 2008). O ASLR não faz parte desse cluster.",
      "A melhora do ASLR com cinto pélvico é descrita na diretriz europeia e pode orientar o uso de cinto para alívio por períodos curtos; a diretriz não recomenda o cinto como tratamento isolado.",
      "Como a nota vem do próprio paciente e tem boa confiabilidade teste-reteste, o ASLR é útil para acompanhar a resposta ao tratamento ao longo das semanas.",
      "Em gestantes e puérperas, considere o contexto obstétrico: dor pélvica com sinais de alerta obstétricos ou trombose não deve ser tratada como dor musculoesquelética.",
    ],
    caution:
      "Um ASLR alterado não confirma dor sacroilíaca nem instabilidade pélvica; mostra dificuldade em uma tarefa de transferência de carga, que precisa ser interpretada com a história e os testes de provocação.",
    mistakes: [
      "Ensinar a contração abdominal antes do teste, mascarando a estratégia espontânea.",
      "Registrar só positivo ou negativo, sem a nota de cada lado e as compensações.",
      "Confundir o ASLR, que é ativo e funcional, com o Lasègue, que é passivo e neurodinâmico.",
      "Manter gestantes em decúbito dorsal por tempo prolongado.",
    ],
    record:
      "Exemplo fictício: ASLR (puérpera, 3 meses) — D 3/5, E 1/5, soma 4/10; rotação da pelve para a E e apneia ao elevar a perna D. Com compressão manual da pelve, D 1/5. P4 D positivo; palpação da sínfise sem dor. Reavaliar em 4 semanas.",
    related: [
      "sacroiliaca",
      "sinfise-pubica",
      "osso-do-quadril",
      "transverso-do-abdomen",
      "obliquo-interno",
      "psoas-maior",
      "multifido-lombar",
      "pubococcigeo",
    ],
    sources: ["pv-mens-2001", "pv-vleeming-2008", "pv-laslett-2008"],
    evidence: {
      text: "Mens et al. (2001) estudaram o ASLR em 200 mulheres com dor pélvica posterior desde a gestação e em 50 mulheres saudáveis. Com nota de 1 ou mais como positivo, a sensibilidade foi de 0,87 e a especificidade de 0,94; a confiabilidade teste-reteste com uma semana de intervalo teve CCI de 0,83. A especificidade foi calculada contra mulheres saudáveis, o que tende a superestimar a acurácia em relação a quem tem outras dores lombares.",
      source: "pv-mens-2001",
    },
    review: [
      "Sei posicionar o paciente e dar a instrução padronizada sem ensinar estratégia.",
      "Sei pontuar a dificuldade de 0 a 5 em cada lado e somar de 0 a 10.",
      "Sei observar compensações e repetir o teste com compressão pélvica.",
      "Sei diferenciar o ASLR do Lasègue.",
      "Sei reconhecer sinais de alerta obstétricos que pedem encaminhamento imediato.",
    ],
    cases: [
      {
        id: "compressao",
        question:
          "Caso fictício: puérpera com dor glútea direita pontua o ASLR direito em 4/5, com rotação da pelve. Com compressão manual da pelve, a nota cai para 1/5. Qual interpretação é mais adequada?",
        choices: [
          "Sugere dificuldade de transferência de carga pela pelve; integrar aos testes de provocação e à história.",
          "Confirma diástase da sínfise púbica e indica cirurgia.",
          "Indica que a dor é de origem neural e exige o Lasègue como próximo passo obrigatório.",
        ],
        correct: 0,
        explanation:
          "A melhora com compressão apoia a hipótese de déficit no controle de carga lombopélvica. Não identifica a estrutura nem indica cirurgia.",
      },
      {
        id: "tvp",
        question:
          "Caso fictício: gestante de 32 semanas com dor na cintura pélvica relata também dor e inchaço na panturrilha esquerda, que está mais quente que a direita. O que fazer?",
        choices: [
          "Completar o ASLR e os testes de provocação antes de qualquer decisão.",
          "Orientar cinto pélvico e repouso.",
          "Encaminhar para avaliação médica imediata por suspeita de trombose venosa profunda.",
        ],
        correct: 2,
        explanation:
          "Gestação aumenta o risco de trombose. Dor, inchaço e calor na panturrilha são sinais de alerta que têm prioridade sobre a avaliação musculoesquelética.",
      },
      {
        id: "instrucao",
        question:
          "Caso fictício: antes do ASLR, o examinador pede que a paciente contraia forte o abdome. Ela pontua 0/5 dos dois lados. Como avaliar esse resultado?",
        choices: [
          "ASLR negativo, sem nenhuma alteração de controle de carga.",
          "Resultado comprometido pela instrução; repetir sem orientar estratégia.",
          "ASLR positivo, pois a contração abdominal indica compensação.",
        ],
        correct: 1,
        explanation:
          "Instruir uma estratégia antes do teste pode mascarar a dificuldade. O teste deve ser feito primeiro com a estratégia espontânea.",
      },
    ],
  },
];
