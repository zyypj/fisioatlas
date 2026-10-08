import type { ClinicalTest } from "../clinicalTests";

export const joelhoLigamentosSources: {
  id: string;
  name: string;
  url: string;
  note: string;
}[] = [
  {
    id: "jl-benjaminse-2006",
    name: "Benjaminse, Gokeler e van der Schans — Diagnóstico clínico da ruptura do LCA: metanálise (2006)",
    url: "https://pubmed.ncbi.nlm.nih.gov/16715828/",
    note: "Metanálise de 28 estudos com valores agrupados de sensibilidade e especificidade para Lachman, gaveta anterior e pivot shift.",
  },
  {
    id: "jl-rubinstein-1994",
    name: "Rubinstein et al. — Acurácia do exame clínico nas lesões do LCP (1994)",
    url: "https://pubmed.ncbi.nlm.nih.gov/7943523/",
    note: "Estudo cego com examinadores experientes; a gaveta posterior com palpação do degrau tibial foi o teste mais sensível e específico para lesão crônica isolada do LCP.",
  },
  {
    id: "jl-malanga-2003",
    name: "Malanga et al. — Exame físico do joelho: descrição original e validade dos testes (2003)",
    url: "https://pubmed.ncbi.nlm.nih.gov/12690600/",
    note: "Revisão das descrições originais dos testes do joelho; aponta que o sinal da queda posterior complementa a gaveta posterior e que faltam bons estudos sobre os testes dos colaterais.",
  },
  {
    id: "jl-kastelein-2008",
    name: "Kastelein et al. — Lesões do ligamento colateral medial na atenção primária (2008)",
    url: "https://pubmed.ncbi.nlm.nih.gov/18954845/",
    note: "Estudo com 134 adultos após trauma do joelho, com ressonância como referência, sobre o valor da história e do estresse em valgo a 30°.",
  },
  {
    id: "jl-jospt-cpg-2017",
    name: "Logerstedt et al. — Diretriz clínica JOSPT para entorse ligamentar do joelho (2017)",
    url: "https://pubmed.ncbi.nlm.nih.gov/29089004/",
    note: "Diretriz de prática clínica da fisioterapia ortopédica com recomendações para avaliação e manejo das entorses ligamentares do joelho.",
  },
  {
    id: "jl-ottawa-bachmann-2004",
    name: "Bachmann et al. — Acurácia da regra de Ottawa para o joelho: revisão sistemática (2004)",
    url: "https://pubmed.ncbi.nlm.nih.gov/14734335/",
    note: "Revisão sistemática mostrando que a regra de Ottawa negativa praticamente exclui fratura após trauma agudo do joelho em adultos.",
  },
  {
    id: "jl-ottawa-stiell-1996",
    name: "Stiell et al. — Validação prospectiva da regra de Ottawa para radiografia do joelho (1996)",
    url: "https://pubmed.ncbi.nlm.nih.gov/8594242/",
    note: "Validação prospectiva, em serviços de emergência, da regra que orienta quando solicitar radiografia após trauma agudo do joelho.",
  },
  {
    id: "jl-statpearls-luxacao",
    name: "Mohseni, Mabrouk e Simon — Luxação do joelho, StatPearls (2024)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK470595/",
    note: "Descreve a luxação do joelho e as lesões multiligamentares como emergência potencial, com risco de lesão vascular e síndrome compartimental.",
  },
  {
    id: "jl-statpearls-lcp",
    name: "Raj, Mabrouk e Varacallo — Lesões do ligamento cruzado posterior, StatPearls (2023)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK430726/",
    note: "Revisa a anatomia e a função do LCP, o exame com gaveta posterior e o significado da frouxidão dos colaterais a 0° e a 30°.",
  },
  {
    id: "jl-statpearls-lcl",
    name: "Yaras et al. — Lesão do ligamento colateral lateral do joelho, StatPearls (2024)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK560847/",
    note: "Descreve o ligamento colateral lateral como principal restrição ao varo em todos os graus de flexão e sua relação com o canto posterolateral.",
  },
];

/** Sinais de alerta comuns aos testes ligamentares do joelho. */
const alertaLuxacao =
  "Trauma de alta energia, frouxidão em vários planos, pulsos distais (pediosa e tibial posterior) fracos ou ausentes, pé frio ou pálido, hematoma em expansão, dor desproporcional ou perda de sensibilidade/dorsiflexão do pé sugerem luxação do joelho (mesmo que já reduzida) ou síndrome compartimental: não teste a estabilidade, imobilize e encaminhe com urgência.";

const alertaFratura =
  "Após trauma agudo, considere a regra de Ottawa para o joelho antes de manobras de estresse: idade ≥ 55 anos, dor à palpação isolada da patela ou da cabeça da fíbula, incapacidade de flexionar a 90° ou de dar quatro passos (logo após o trauma e na avaliação) indicam radiografia. Com suspeita de fratura, não aplique estresse.";

const alertaDerrame =
  "Derrame volumoso que surge nas primeiras horas após o trauma sugere hemartrose (lesão do LCA, fratura osteocondral, luxação da patela) e merece avaliação médica; dor intensa e defesa muscular também tornam o resultado pouco confiável.";

export const joelhoLigamentosTests: ClinicalTest[] = [
  {
    id: "lachman",
    name: "Teste de Lachman",
    aliases: ["Lachman test", "Gaveta anterior a 20–30°", "Teste de Ritchie"],
    category: "joelho",
    kind: "ligamentar",
    region: "Joelho · ligamento cruzado anterior",
    position:
      "Paciente em decúbito dorsal, relaxado, com o joelho em 20–30° de flexão; examinador ao lado do membro testado, uma mão no fêmur distal e outra na tíbia proximal.",
    summary:
      "Translação anterior da tíbia sob o fêmur com o joelho em leve flexão, para estimar a integridade do ligamento cruzado anterior (LCA).",
    purpose:
      "Avaliar a quantidade de deslocamento anterior da tíbia e a qualidade do ponto final (firme ou amolecido) em comparação com o outro lado. Por ser feito com pouca flexão, é mais tolerado no joelho agudo e sofre menos bloqueio do corno posterior do menisco e dos isquiotibiais que a gaveta a 90°.",
    indications: [
      "Trauma em rotação ou desaceleração com estalo, derrame precoce ou sensação de falseio, com suspeita de lesão do LCA.",
      "Acompanhamento da estabilidade anterior e comparação entre os lados, sempre com a mesma técnica e posição.",
      "Complemento da gaveta anterior e do pivot shift dentro de um exame ligamentar completo.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e teste primeiro o lado não lesionado. Interrompa se houver dor intensa; não repita várias vezes no joelho agudo nem use força excessiva. A execução exige formação e supervisão.",
      alertaFratura,
      alertaLuxacao,
      alertaDerrame,
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa em decúbito dorsal, coloque o joelho em 20–30° de flexão, apoiando-o sobre sua coxa ou um pequeno rolo, e o quadril em rotação neutra. Peça que relaxe completamente a coxa.",
        cue: "Mãos grandes ou coxa volumosa? O apoio do joelho sobre a sua coxa facilita estabilizar o fêmur.",
      },
      {
        title: "Estabilizar o fêmur",
        text: "Segure com firmeza a face lateral da coxa distal, logo acima da patela, para impedir que o fêmur acompanhe o movimento.",
        cue: "Se o fêmur se desloca junto, a translação percebida é falsa. Firmeza, não aperto doloroso.",
      },
      {
        title: "Segurar a tíbia",
        text: "Com a outra mão, envolva a face medial da tíbia proximal, com o polegar sobre a interlinha articular anteromedial para sentir a translação.",
        cue: "Palpe os isquiotibiais com os dedos: devem estar relaxados para não bloquear o deslocamento.",
      },
      {
        title: "Transladar anteriormente",
        text: "Aplique uma tração anterior rápida, porém suave, na tíbia, sem rodá-la. Perceba a quantidade de deslocamento e como ele termina: parada firme e definida ou parada amolecida/ausente.",
        cue: "O ponto final importa tanto quanto a amplitude. Evite rotação interna ou externa da tíbia.",
      },
      {
        title: "Comparar e registrar",
        text: "Repita no outro joelho com a mesma técnica. Registre a diferença estimada de translação, a qualidade do ponto final, dor e apreensão.",
        cue: "A frouxidão normal varia entre pessoas; a comparação lado a lado é a referência.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo de lesão do LCA",
        text: "Translação anterior maior que a do outro lado, especialmente com ponto final amolecido ou ausente, apoia a hipótese de ruptura do LCA, sobretudo com história compatível (mecanismo em rotação, estalo, derrame rápido).",
      },
      {
        title: "Resultado negativo",
        text: "Translação simétrica com ponto final firme reduz a probabilidade de ruptura completa, mas não a exclui: dor, derrame e defesa muscular podem mascarar a frouxidão, e lesões parciais podem ter ponto final relativamente preservado.",
      },
      {
        title: "Armadilha: falso positivo por lesão do LCP",
        text: "Se a tíbia já estava caída posteriormente (lesão do LCP), o 'avanço' anterior pode ser apenas a volta à posição neutra. Observe a posição inicial da tíbia antes de interpretar.",
      },
      {
        title: "O que o teste não diz",
        text: "O Lachman não identifica lesões associadas (meniscos, colaterais, cartilagem), não gradua com precisão a instabilidade funcional e não define a necessidade de cirurgia.",
      },
    ],
    reasoning: [
      "Integre com a história: mecanismo sem contato em rotação, estalo audível, derrame nas primeiras horas e falseio aumentam a suspeita.",
      "Combine com o pivot shift: Lachman positivo com pivot shift positivo fortalece muito a hipótese; pivot shift negativo não descarta lesão.",
      "Examine colaterais, meniscos e o LCP no mesmo exame, pois lesões combinadas são frequentes após trauma rotacional.",
      "No joelho muito agudo e doloroso, um exame inconclusivo pode ser repetido após alguns dias, quando dor e derrame diminuírem.",
      "Ressonância e encaminhamento ortopédico dependem do quadro completo e dos objetivos da pessoa, não apenas do Lachman.",
    ],
    caution:
      "Um Lachman positivo isolado não confirma ruptura completa do LCA nem exclui lesão do LCP como causa da translação aumentada.",
    mistakes: [
      "Não estabilizar o fêmur, deixando a coxa acompanhar a tíbia.",
      "Testar com o paciente contraído ou com dor intensa e registrar como negativo.",
      "Rodar a tíbia durante a tração, misturando estresse rotacional com translação anterior.",
      "Não comparar com o outro lado ou ignorar a qualidade do ponto final.",
    ],
    record:
      "Exemplo fictício: Lachman direito — translação anterior aumentada em relação ao esquerdo, ponto final amolecido, dor leve 3/10; esquerdo com ponto final firme. Derrame moderado. Registrar pivot shift, gaveta posterior, colaterais e testes meniscais.",
    related: [
      "ligamento-cruzado-anterior",
      "joelho",
      "femur",
      "tibia",
      "menisco-medial",
      "menisco-lateral",
      "semitendineo",
      "biceps-femoral",
    ],
    sources: [
      "jl-benjaminse-2006",
      "jl-malanga-2003",
      "jl-jospt-cpg-2017",
      "jl-ottawa-bachmann-2004",
    ],
    evidence: {
      text: "Uma metanálise de 28 estudos (referência por artroscopia, artrotomia ou ressonância) encontrou para o Lachman sensibilidade agrupada de 85% e especificidade de 94%, o melhor desempenho entre os testes clínicos para o LCA. Os estudos foram heterogêneos em população, experiência do examinador e uso de anestesia; os números não valem igualmente para o joelho agudo e doloroso.",
      source: "jl-benjaminse-2006",
    },
    review: [
      "Sei posicionar o joelho em 20–30° de flexão e estabilizar o fêmur.",
      "Sei diferenciar ponto final firme de ponto final amolecido ou ausente.",
      "Sei por que a posição inicial da tíbia pode gerar falso positivo na lesão do LCP.",
      "Sei integrar o Lachman com a história e o pivot shift.",
      "Sei reconhecer sinais de alerta que contraindicam o teste após trauma.",
    ],
    cases: [
      {
        id: "lachman-tipico",
        question:
          "Caso fictício: após torção sem contato no futebol, com estalo e inchaço em 2 horas, o Lachman mostra translação maior que o outro lado e ponto final amolecido. Qual a interpretação mais adequada?",
        choices: [
          "Confirma ruptura completa isolada do LCA e indicação cirúrgica.",
          "Apoia a hipótese de lesão do LCA; completar o exame e integrar à história.",
          "Indica apenas frouxidão constitucional, sem relevância clínica.",
        ],
        correct: 1,
        explanation:
          "História e achado concordantes apoiam a hipótese, mas lesões associadas e a conduta dependem do exame completo e da avaliação especializada.",
      },
      {
        id: "lachman-defesa",
        question:
          "Caso fictício: no dia do trauma, o joelho está muito doloroso, com derrame volumoso, e a pessoa contrai a coxa durante o Lachman, que parece simétrico. O que registrar?",
        choices: [
          "Lachman negativo; LCA íntegro.",
          "Lachman positivo por causa da dor.",
          "Exame limitado por dor e defesa; reavaliar e considerar a hemartrose como sinal a investigar.",
        ],
        correct: 2,
        explanation:
          "Defesa muscular e derrame reduzem a sensibilidade. Derrame volumoso precoce sugere hemartrose e merece investigação, mesmo com Lachman aparentemente negativo.",
      },
      {
        id: "lachman-lcp",
        question:
          "Caso fictício: após queda com o joelho flexionado sobre a tíbia, a tíbia parece afundada antes do teste e o Lachman 'avança' bastante, com parada firme. Qual hipótese considerar?",
        choices: [
          "Lesão do LCP: a translação pode ser a tíbia voltando da posição posterior.",
          "Ruptura do LCA confirmada pela grande translação.",
          "Lesão meniscal isolada.",
        ],
        correct: 0,
        explanation:
          "Queda sobre o joelho flexionado é mecanismo típico de lesão do LCP. Verifique a posição inicial da tíbia, o degrau tibial e a gaveta posterior.",
      },
    ],
  },
  {
    id: "gaveta-anterior-joelho",
    name: "Teste da gaveta anterior do joelho",
    aliases: [
      "Anterior drawer test",
      "Gaveta anterior a 90°",
      "Teste da gaveta anterior",
    ],
    category: "joelho",
    kind: "ligamentar",
    region: "Joelho · ligamento cruzado anterior",
    position:
      "Paciente em decúbito dorsal com o quadril a 45° e o joelho a 90° de flexão, pé apoiado na maca; examinador sentado levemente sobre o antepé, com as duas mãos na tíbia proximal.",
    summary:
      "Tração anterior da tíbia com o joelho a 90° de flexão para avaliar o deslocamento anterior controlado pelo LCA.",
    purpose:
      "Estimar a translação anterior da tíbia e o ponto final com o joelho a 90°, comparando com o outro lado. É útil sobretudo em lesões crônicas, quando dor e derrame já não impedem o posicionamento; no joelho agudo, costuma ser menos confiável que o Lachman.",
    indications: [
      "Suspeita de lesão do LCA, especialmente em quadros crônicos com queixa de falseio.",
      "Complemento do Lachman quando a flexão a 90° é tolerada.",
      "Comparação entre os lados e acompanhamento com técnica padronizada.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento antes de sentar sobre o pé e teste primeiro o lado não lesionado. A execução exige formação e supervisão.",
      alertaFratura,
      alertaLuxacao,
      "Não force a flexão a 90° em joelho com derrame tenso ou dor intensa; nesse caso prefira o Lachman ou adie o exame.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa em decúbito dorsal, flexione o quadril a cerca de 45° e o joelho a 90°, com o pé apoiado na maca em rotação neutra.",
        cue: "Se a flexão a 90° causar dor importante, não insista: o Lachman é a alternativa.",
      },
      {
        title: "Checar o degrau tibial",
        text: "Antes de tracionar, observe e palpe a posição da borda anterior do platô tibial medial em relação ao côndilo femoral medial e compare com o outro lado.",
        cue: "Tíbia já caída para trás sugere lesão do LCP: o avanço anterior seria só a volta ao neutro.",
      },
      {
        title: "Estabilizar o pé",
        text: "Com consentimento, sente-se levemente sobre o antepé para fixar o pé e manter a rotação neutra da tíbia.",
        cue: "Apoio leve: o objetivo é fixar, não comprimir o pé.",
      },
      {
        title: "Posicionar as mãos",
        text: "Envolva a tíbia proximal com as duas mãos, polegares sobre a interlinha articular anterior e indicadores tocando os tendões dos isquiotibiais.",
        cue: "Isquiotibiais contraídos seguram a tíbia e geram falso negativo; peça relaxamento.",
      },
      {
        title: "Tracionar anteriormente",
        text: "Puxe a tíbia para a frente de forma suave e firme, percebendo a quantidade de deslocamento e a qualidade do ponto final. Compare com o outro joelho.",
        cue: "Não estenda o joelho nem eleve o pé durante a tração; mantenha 90°.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo",
        text: "Translação anterior maior que a do outro lado, com ponto final amolecido, apoia lesão do LCA, principalmente em quadros crônicos e com história compatível.",
      },
      {
        title: "Resultado negativo",
        text: "No joelho agudo, a gaveta anterior pode ser negativa mesmo com ruptura: derrame, dor, defesa dos isquiotibiais e o bloqueio do corno posterior do menisco limitam a translação.",
      },
      {
        title: "Armadilha: tíbia posteriorizada",
        text: "Na lesão do LCP, a tíbia repousa posteriormente; puxá-la para a frente produz um 'falso' deslocamento anterior. Por isso a checagem do degrau tibial vem antes da tração.",
      },
      {
        title: "O que o teste não diz",
        text: "A gaveta não distingue com precisão lesão parcial de completa, nem informa sobre meniscos ou colaterais. Variações com rotação da tíbia sugerem componentes rotatórios, mas não substituem o exame completo.",
      },
    ],
    reasoning: [
      "Em lesão aguda, priorize o Lachman; use a gaveta como complemento ou em reavaliações posteriores.",
      "Integre a história de falseio em mudança de direção e o mecanismo da lesão.",
      "Confirme a posição inicial da tíbia e examine o LCP antes de atribuir a translação ao LCA.",
      "Examine também colaterais e meniscos; lesões combinadas alteram a interpretação da translação.",
    ],
    caution:
      "Uma gaveta anterior positiva isolada não confirma lesão do LCA se a posição inicial da tíbia não foi verificada, e uma gaveta negativa no joelho agudo não a exclui.",
    mistakes: [
      "Tracionar sem antes checar o degrau tibial, confundindo lesão do LCP com lesão do LCA.",
      "Permitir contração dos isquiotibiais durante a tração.",
      "Deixar o pé rodar ou deslizar, alterando o ângulo e a rotação da tíbia.",
      "Interpretar gaveta negativa no joelho agudo como LCA íntegro.",
    ],
    record:
      "Exemplo fictício: gaveta anterior esquerda a 90° — translação aumentada em relação à direita, ponto final amolecido, sem dor; degrau tibial inicial preservado e simétrico. Registrar Lachman, pivot shift e demais testes.",
    related: [
      "ligamento-cruzado-anterior",
      "ligamento-cruzado-posterior",
      "joelho",
      "tibia",
      "femur",
      "menisco-medial",
      "semimembranaceo",
      "biceps-femoral",
    ],
    sources: [
      "jl-benjaminse-2006",
      "jl-malanga-2003",
      "jl-jospt-cpg-2017",
      "jl-ottawa-stiell-1996",
    ],
    evidence: {
      text: "Na metanálise de 28 estudos sobre o LCA, a gaveta anterior apresentou bom desempenho em lesões crônicas (sensibilidade agrupada de 92% e especificidade de 91%), mas não em lesões agudas. Os estudos foram heterogêneos; os números refletem aquelas amostras e não substituem o julgamento clínico.",
      source: "jl-benjaminse-2006",
    },
    review: [
      "Sei posicionar quadril a 45° e joelho a 90° e estabilizar o pé.",
      "Sei checar o degrau tibial antes de tracionar e explicar por quê.",
      "Sei por que a gaveta anterior é menos sensível no joelho agudo.",
      "Sei comparar translação e ponto final com o outro lado.",
    ],
    cases: [
      {
        id: "gaveta-cronica",
        question:
          "Caso fictício: pessoa com falseio recorrente há 1 ano após entorse; gaveta anterior com translação aumentada e ponto final amolecido, degrau tibial preservado. Qual leitura é adequada?",
        choices: [
          "Achado compatível com insuficiência do LCA; integrar ao Lachman e ao pivot shift.",
          "Confirma lesão do LCP.",
          "Achado irrelevante, pois a gaveta só vale no joelho agudo.",
        ],
        correct: 0,
        explanation:
          "Em quadros crônicos a gaveta anterior tem melhor desempenho. Com degrau tibial preservado, a translação não é explicada por queda posterior da tíbia.",
      },
      {
        id: "gaveta-aguda",
        question:
          "Caso fictício: 1 dia após o trauma, joelho com derrame tenso; a flexão a 90° é muito dolorosa e a gaveta parece negativa. Qual conduta faz mais sentido?",
        choices: [
          "Registrar LCA íntegro.",
          "Forçar a flexão para completar a gaveta.",
          "Registrar exame limitado; considerar Lachman, reavaliação e investigação do derrame precoce.",
        ],
        correct: 2,
        explanation:
          "No joelho agudo a gaveta perde sensibilidade. Derrame volumoso precoce sugere hemartrose e merece avaliação.",
      },
      {
        id: "gaveta-falso",
        question:
          "Caso fictício: antes da tração, a tíbia de um lado está afundada em relação ao fêmur; a gaveta anterior mostra grande deslocamento com parada firme. Qual estrutura investigar primeiro?",
        choices: [
          "Menisco lateral.",
          "Ligamento cruzado posterior.",
          "Ligamento colateral lateral.",
        ],
        correct: 1,
        explanation:
          "Tíbia posteriorizada indica possível lesão do LCP; a translação anterior pode ser apenas a redução até o neutro. Faça a gaveta posterior e o sinal de Godfrey.",
      },
    ],
  },
  {
    id: "pivot-shift",
    name: "Teste do pivot shift",
    aliases: [
      "Pivot shift test",
      "Ressalto rotatório",
      "Teste de MacIntosh",
      "Jerk test (variação)",
    ],
    category: "joelho",
    kind: "instabilidade",
    region: "Joelho · instabilidade rotatória anterolateral (LCA)",
    position:
      "Paciente em decúbito dorsal, totalmente relaxado; examinador ao lado, uma mão segurando o pé ou o tornozelo e a outra na face lateral da tíbia proximal.",
    summary:
      "Manobra dinâmica que combina valgo e rotação interna da tíbia durante a flexão do joelho para reproduzir a subluxação e a redução súbita do platô lateral típicas da insuficiência do LCA.",
    purpose:
      "Reproduzir o 'ressalto' que corresponde à sensação de falseio relatada pela pessoa. Em extensão, o platô tibial lateral subluxa anteriormente; com a flexão, o trato iliotibial passa para trás do eixo e reduz a tíbia abruptamente. Exige relaxamento total e é muito específico, porém pouco sensível no paciente acordado.",
    indications: [
      "Suspeita de lesão do LCA com queixa de falseio em giro ou mudança de direção.",
      "Complemento do Lachman para caracterizar a instabilidade rotatória.",
      "Reavaliação de instabilidade funcional, quando a pessoa tolera a manobra.",
    ],
    safety: [
      "Explique que a manobra pode reproduzir a sensação de falseio e obtenha consentimento; pare se houver apreensão ou dor importante. A execução exige formação e supervisão.",
      alertaFratura,
      alertaLuxacao,
      "Evite no joelho agudo e doloroso, com derrame tenso ou suspeita de lesão multiligamentar: a manobra é desconfortável, pode lesar estruturas e, com defesa muscular, raramente é conclusiva.",
    ],
    steps: [
      {
        title: "Preparar e relaxar",
        text: "Explique a manobra e garanta que a pessoa esteja deitada e relaxada. Teste primeiro o lado não lesionado para que ela saiba o que esperar.",
        cue: "Sem relaxamento não há pivot shift confiável: qualquer contração dos isquiotibiais impede a subluxação.",
      },
      {
        title: "Posicionar em extensão",
        text: "Eleve o membro segurando o pé ou o tornozelo, com o joelho em extensão completa, e aplique rotação interna suave da tíbia.",
        cue: "Rotação interna leve; exagerar pode travar o joelho e esconder o ressalto.",
      },
      {
        title: "Aplicar valgo",
        text: "Com a outra mão na face lateral da tíbia proximal, logo abaixo da interlinha, aplique uma força em valgo, mantendo a rotação interna.",
        cue: "A mão lateral empurra para dentro; o pé permanece rodado internamente.",
      },
      {
        title: "Flexionar lentamente",
        text: "Mantendo valgo e rotação interna, flexione o joelho de forma lenta e contínua. Na insuficiência do LCA, por volta de 20–40° de flexão, o platô lateral subluxado volta à posição com um ressalto perceptível.",
        cue: "Observe e sinta o ressalto; pergunte se é a sensação de falseio conhecida.",
      },
      {
        title: "Graduar e comparar",
        text: "Classifique a resposta como ausente, deslizamento suave, ressalto nítido ou ressalto grosseiro (com travamento momentâneo) e compare com o outro joelho.",
        cue: "Registre também apreensão e defesa, que podem ter limitado o teste.",
      },
    ],
    interpretation: [
      {
        title: "Positivo: ressalto",
        text: "Um ressalto de redução durante a flexão, assimétrico em relação ao outro lado, é altamente sugestivo de insuficiência do LCA com instabilidade rotatória anterolateral e se relaciona bem com a queixa de falseio.",
      },
      {
        title: "Negativo não exclui",
        text: "A baixa sensibilidade no paciente acordado (dor, medo, defesa muscular) faz com que um pivot shift negativo diga pouco. Sob anestesia, o teste se torna mais sensível.",
      },
      {
        title: "Armadilhas",
        text: "Lesões associadas podem abolir o ressalto: lesão completa do colateral medial (perde-se o fulcro medial), alça de balde meniscal deslocada ou trato iliotibial lesionado. Um 'clique' meniscal também pode ser confundido com o ressalto.",
      },
      {
        title: "O que o teste não diz",
        text: "O pivot shift não quantifica a translação com precisão e varia muito entre examinadores; não define sozinho a indicação cirúrgica.",
      },
    ],
    reasoning: [
      "Use o pivot shift depois do Lachman: Lachman e pivot shift positivos juntos tornam a lesão do LCA muito provável.",
      "Alta especificidade: um pivot shift claramente positivo ajuda a confirmar; um negativo não ajuda a descartar.",
      "Se o Lachman já é claramente positivo e a pessoa está apreensiva, pode não ser necessário provocar o ressalto.",
      "Relacione o grau do ressalto com a queixa funcional e com o nível de atividade desejado.",
      "Investigue lesões associadas (menisco lateral, colateral medial) quando o ressalto estiver ausente apesar de forte suspeita.",
    ],
    caution:
      "Um pivot shift negativo no paciente acordado não exclui lesão do LCA, e um positivo isolado não informa sobre lesões associadas.",
    mistakes: [
      "Executar com a pessoa tensa ou com dor e registrar como negativo.",
      "Flexionar rápido demais ou perder o valgo e a rotação interna durante a flexão.",
      "Aplicar rotação interna excessiva, travando a articulação.",
      "Confundir clique meniscal com o ressalto de redução.",
    ],
    record:
      "Exemplo fictício: pivot shift direito — ressalto nítido por volta de 30° de flexão, reproduz a sensação de falseio; esquerdo ausente. Pessoa relaxada, sem dor. Lachman direito com ponto final amolecido.",
    related: [
      "ligamento-cruzado-anterior",
      "trato-iliotibial",
      "joelho",
      "tibia",
      "femur",
      "menisco-lateral",
      "ligamento-colateral-tibial",
    ],
    sources: [
      "jl-benjaminse-2006",
      "jl-malanga-2003",
      "jl-jospt-cpg-2017",
      "jl-statpearls-luxacao",
    ],
    evidence: {
      text: "Na metanálise de 28 estudos, o pivot shift foi muito específico (98%) e pouco sensível (24%), tanto em lesões agudas quanto crônicas; os autores recomendam associá-lo ao Lachman. Os valores variam com o relaxamento, a experiência do examinador e o uso de anestesia.",
      source: "jl-benjaminse-2006",
    },
    review: [
      "Sei combinar valgo, rotação interna e flexão lenta a partir da extensão.",
      "Sei explicar o mecanismo do ressalto e o papel do trato iliotibial.",
      "Sei por que o relaxamento é indispensável e o teste negativo diz pouco.",
      "Sei quando evitar a manobra (joelho agudo, lesão multiligamentar, suspeita de fratura).",
    ],
    cases: [
      {
        id: "pivot-negativo",
        question:
          "Caso fictício: Lachman claramente assimétrico com ponto final amolecido; no pivot shift a pessoa contrai a coxa e não há ressalto. Qual conclusão?",
        choices: [
          "O pivot shift negativo exclui lesão do LCA.",
          "O Lachman deve ser desconsiderado.",
          "O pivot shift foi limitado pela defesa; a hipótese de lesão do LCA permanece.",
        ],
        correct: 2,
        explanation:
          "O pivot shift é pouco sensível no paciente acordado, sobretudo com defesa muscular. O Lachman sustenta a hipótese.",
      },
      {
        id: "pivot-positivo",
        question:
          "Caso fictício: pessoa relaxada, ressalto nítido aos 30° de flexão que reproduz o falseio conhecido; lado oposto sem ressalto. Qual leitura?",
        choices: [
          "Achado altamente sugestivo de insuficiência do LCA com instabilidade anterolateral.",
          "Achado típico de lesão isolada do colateral lateral.",
          "Achado normal em pessoas com hipermobilidade.",
        ],
        correct: 0,
        explanation:
          "A alta especificidade faz do ressalto assimétrico um forte indicador de insuficiência do LCA; complete o exame para lesões associadas.",
      },
      {
        id: "pivot-alerta",
        question:
          "Caso fictício: após colisão de moto, o joelho está frouxo em vários planos e o pé está frio, com pulso pedioso fraco. O que fazer?",
        choices: [
          "Realizar o pivot shift para classificar a instabilidade.",
          "Não testar; imobilizar e encaminhar com urgência pela suspeita de luxação com lesão vascular.",
          "Aguardar uma semana e reavaliar com Lachman.",
        ],
        correct: 1,
        explanation:
          "Frouxidão multidirecional após alta energia com alteração de pulso sugere luxação do joelho com possível lesão da artéria poplítea: emergência.",
      },
    ],
  },
  {
    id: "gaveta-posterior-joelho",
    name: "Teste da gaveta posterior do joelho",
    aliases: [
      "Posterior drawer test",
      "Gaveta posterior a 90°",
      "Teste do degrau tibial (step-off)",
    ],
    category: "joelho",
    kind: "ligamentar",
    region: "Joelho · ligamento cruzado posterior",
    position:
      "Paciente em decúbito dorsal com o quadril a 45° e o joelho a 90° de flexão, pé apoiado na maca; examinador sentado levemente sobre o antepé, com as mãos na tíbia proximal.",
    summary:
      "Empurrar a tíbia proximal para trás com o joelho a 90°, após checar o degrau tibial, para avaliar a integridade do ligamento cruzado posterior (LCP).",
    purpose:
      "Estimar a translação posterior da tíbia e o ponto final em comparação com o outro lado. A posição do platô tibial medial em relação ao côndilo femoral medial (degrau tibial) é observada antes e durante o teste e orienta a graduação da lesão.",
    indications: [
      "Queda sobre o joelho flexionado, impacto anterior na tíbia (como contra o painel do carro) ou hiperextensão.",
      "Dor posterior no joelho após trauma, com ou sem pouca instabilidade percebida.",
      "Esclarecer translação 'anterior' aumentada que pode ser, na verdade, redução de uma tíbia posteriorizada.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e teste primeiro o lado não lesionado. A execução exige formação e supervisão.",
      alertaFratura,
      alertaLuxacao,
      "Lesão do LCP raramente é isolada após trauma de alta energia: frouxidão também em varo/valgo ou rotação sugere lesão multiligamentar e exige investigação antes de testes repetidos.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa em decúbito dorsal, flexione o quadril a cerca de 45° e o joelho a 90°, pé apoiado em rotação neutra. Observe os dois joelhos de perfil, na mesma posição.",
        cue: "Coxa relaxada: o quadríceps contraído puxa a tíbia para a frente e mascara a lesão.",
      },
      {
        title: "Checar o degrau tibial",
        text: "Deslize os polegares pela coxa até a interlinha e palpe a borda anterior do platô tibial medial em relação ao côndilo femoral medial. Normalmente o platô fica à frente do côndilo, formando um degrau; compare com o outro lado.",
        cue: "Degrau reduzido ou ausente já em repouso sugere queda posterior da tíbia.",
      },
      {
        title: "Estabilizar o pé",
        text: "Com consentimento, sente-se levemente sobre o antepé para fixar o pé e manter a tíbia em rotação neutra.",
        cue: "Fixe sem comprimir; a rotação neutra é importante para comparar os lados.",
      },
      {
        title: "Empurrar posteriormente",
        text: "Envolva a tíbia proximal com as mãos, polegares na interlinha, e empurre a tíbia para trás de forma firme e controlada, percebendo quanto ela se desloca e como termina o movimento.",
        cue: "Empurre no eixo da tíbia, sem rodá-la nem estender o joelho.",
      },
      {
        title: "Graduar pelo degrau",
        text: "Durante o empurrão, observe o degrau: o platô ainda à frente do côndilo sugere lesão leve; nivelado com o côndilo sugere lesão moderada; atrás do côndilo sugere lesão grave, frequentemente combinada.",
        cue: "A graduação é uma estimativa clínica; registre o que palpou em vez de apenas 'positivo'.",
      },
      {
        title: "Comparar e registrar",
        text: "Repita no outro lado, registre degrau inicial, translação, ponto final e dor, e complemente com o sinal de Godfrey.",
        cue: "Assimetria entre os lados é mais informativa que um valor absoluto.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo de lesão do LCP",
        text: "Degrau tibial reduzido ou ausente e translação posterior maior que a do outro lado, com ponto final amolecido, apoiam lesão do LCP.",
      },
      {
        title: "Resultado negativo",
        text: "Degrau preservado e translação simétrica tornam improvável lesão importante do LCP, mas lesões parciais (grau leve) são mais difíceis de detectar.",
      },
      {
        title: "Armadilhas",
        text: "Sem checar o degrau inicial, a tíbia já posteriorizada pode parecer normal ao empurrar e 'avançar' na gaveta anterior, gerando confusão com lesão do LCA. Contração do quadríceps também reduz a queda.",
      },
      {
        title: "O que o teste não diz",
        text: "Translação posterior muito grande, ou associada a frouxidão em varo e rotação externa, sugere lesão do canto posterolateral ou multiligamentar, que a gaveta isolada não caracteriza.",
      },
    ],
    reasoning: [
      "Mecanismo de impacto anterior na tíbia com o joelho flexionado ou de hiperextensão aumenta a suspeita.",
      "Associe o sinal de Godfrey e a palpação do degrau; o conjunto é mais convincente que um teste isolado.",
      "Teste varo, valgo e rotação externa: lesões graves do LCP costumam vir acompanhadas de lesão do canto posterolateral.",
      "Reinterprete achados do Lachman e da gaveta anterior à luz da posição inicial da tíbia.",
      "Imagem e encaminhamento dependem do grau, das lesões associadas e da função, não apenas do teste.",
    ],
    caution:
      "Uma gaveta posterior positiva isolada não confirma lesão isolada do LCP nem exclui lesão do canto posterolateral associada.",
    mistakes: [
      "Não checar o degrau tibial antes de empurrar.",
      "Testar com o quadríceps contraído.",
      "Rodar a tíbia ou perder os 90° de flexão durante o teste.",
      "Atribuir ao LCA uma translação anterior que é redução de uma tíbia posteriorizada.",
    ],
    record:
      "Exemplo fictício: gaveta posterior direita — degrau tibial inicial reduzido em relação ao esquerdo; ao empurrar, platô nivelado com o côndilo femoral medial, ponto final amolecido. Godfrey positivo à direita. Varo, valgo e rotação externa sem assimetria.",
    related: [
      "ligamento-cruzado-posterior",
      "ligamento-cruzado-anterior",
      "joelho",
      "tibia",
      "femur",
      "popliteo",
      "ligamento-popliteo-arqueado",
      "reto-femoral",
    ],
    sources: [
      "jl-rubinstein-1994",
      "jl-malanga-2003",
      "jl-statpearls-lcp",
      "jl-statpearls-luxacao",
    ],
    evidence: {
      text: "Em estudo cego com 39 participantes (18 com lesão crônica isolada do LCP), cirurgiões experientes tiveram 90% de sensibilidade e 99% de especificidade para detectar a lesão; a gaveta posterior com palpação do degrau tibial foi o teste mais sensível e específico. A acurácia foi menor para frouxidão leve. A amostra é pequena, crônica e examinada por especialistas.",
      source: "jl-rubinstein-1994",
    },
    review: [
      "Sei palpar o degrau tibial e reconhecer quando ele está reduzido.",
      "Sei graduar a gaveta posterior pela relação entre platô e côndilo.",
      "Sei por que a lesão do LCP pode gerar falso positivo na gaveta anterior.",
      "Sei quais testes associar para investigar o canto posterolateral.",
      "Sei reconhecer quando suspeitar de lesão multiligamentar ou luxação.",
    ],
    cases: [
      {
        id: "lcp-painel",
        question:
          "Caso fictício: após batida do joelho flexionado contra o painel do carro, o degrau tibial está ausente em repouso e a gaveta posterior mostra platô nivelado com o côndilo. Qual a interpretação?",
        choices: [
          "Lesão do LCA confirmada.",
          "Achado sugestivo de lesão do LCP; completar com Godfrey e testes do canto posterolateral.",
          "Exame normal, pois não houve dor.",
        ],
        correct: 1,
        explanation:
          "Mecanismo e achado são típicos de lesão do LCP. O teste não descarta lesões associadas, que devem ser investigadas.",
      },
      {
        id: "lcp-multiligamentar",
        question:
          "Caso fictício: além da gaveta posterior grosseira, há abertura em varo em extensão completa e dormência no dorso do pé após trauma de alta energia. Qual prioridade?",
        choices: [
          "Suspeitar de lesão multiligamentar/luxação reduzida; checar pulsos e encaminhar com urgência.",
          "Iniciar fortalecimento do quadríceps na mesma sessão.",
          "Repetir os testes até reproduzir a instabilidade.",
        ],
        correct: 0,
        explanation:
          "Frouxidão em vários planos e alteração neurológica sugerem luxação do joelho com lesão do nervo fibular comum e possível lesão vascular.",
      },
      {
        id: "lcp-quadriceps",
        question:
          "Caso fictício: a pessoa mantém a coxa contraída durante o teste e o degrau parece normal. O que considerar?",
        choices: [
          "LCP íntegro com certeza.",
          "Lesão do LCA, pois a tíbia está anteriorizada.",
          "A contração do quadríceps pode mascarar a queda posterior; repetir com relaxamento.",
        ],
        correct: 2,
        explanation:
          "O quadríceps traciona a tíbia para a frente e reduz a queda posterior. Relaxamento é condição para interpretar o degrau.",
      },
    ],
  },
  {
    id: "sinal-de-godfrey",
    name: "Sinal da queda posterior (Godfrey)",
    aliases: [
      "Teste de Godfrey",
      "Posterior sag sign",
      "Sinal do afundamento posterior da tíbia",
    ],
    category: "joelho",
    kind: "ligamentar",
    region: "Joelho · ligamento cruzado posterior",
    position:
      "Paciente em decúbito dorsal com quadris e joelhos a 90° de flexão; examinador segura as duas pernas pelos calcanhares e observa os joelhos de perfil.",
    summary:
      "Observação da queda posterior da tíbia por ação da gravidade, com quadril e joelho a 90°, para identificar insuficiência do LCP.",
    purpose:
      "Sem o LCP, a gravidade faz a tíbia proximal cair para trás em relação ao fêmur. Observar o contorno da tuberosidade da tíbia dos dois lados, com a musculatura relaxada, oferece uma pista visual simples que complementa a gaveta posterior.",
    indications: [
      "Suspeita de lesão do LCP por mecanismo de impacto anterior na tíbia ou hiperextensão.",
      "Complemento visual da gaveta posterior e da palpação do degrau tibial.",
      "Esclarecer translação anterior aumentada que pode corresponder a uma tíbia posteriorizada.",
    ],
    safety: [
      "Explique o posicionamento e obtenha consentimento; o teste é passivo e de baixa carga, mas exige formação e supervisão.",
      alertaFratura,
      alertaLuxacao,
      "Se a flexão de quadril e joelho a 90° for muito dolorosa ou houver derrame tenso, não force: registre a limitação e reavalie.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa em decúbito dorsal, flexione os dois quadris e os dois joelhos a 90° e sustente as pernas pelos calcanhares, deixando as coxas verticais.",
        cue: "Os dois lados precisam estar na mesma altura e no mesmo ângulo para comparar.",
      },
      {
        title: "Relaxar a coxa",
        text: "Peça que a pessoa solte completamente as pernas nas suas mãos, sem ajudar a sustentá-las.",
        cue: "Contração do quadríceps puxa a tíbia para a frente e esconde a queda.",
      },
      {
        title: "Observar de perfil",
        text: "Posicione os olhos na altura dos joelhos, de lado, e observe o contorno anterior: a tuberosidade da tíbia e a depressão logo abaixo da patela.",
        cue: "Olhe de perfil, não de cima; a diferença costuma ser de poucos milímetros.",
      },
      {
        title: "Comparar os lados",
        text: "Verifique se, em um dos lados, a tuberosidade da tíbia está mais recuada, com contorno côncavo abaixo da patela. Isso caracteriza a queda posterior.",
        cue: "Assimetria é o achado; não interprete o contorno de um lado só.",
      },
      {
        title: "Complementar e registrar",
        text: "Confirme o achado com a palpação do degrau e a gaveta posterior; uma contração leve do quadríceps que reduz a queda pode reforçar o achado. Registre o que foi observado.",
        cue: "Godfrey e gaveta posterior juntos são mais convincentes que cada um isoladamente.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo",
        text: "Tuberosidade da tíbia recuada em relação ao lado oposto, com a coxa relaxada, apoia insuficiência do LCP.",
      },
      {
        title: "Resultado negativo",
        text: "Ausência de queda visível torna improvável uma lesão grave, mas lesões leves ou agudas, com derrame e defesa muscular, podem não mostrar queda.",
      },
      {
        title: "Armadilhas",
        text: "Posicionamento assimétrico, contração do quadríceps, edema importante ou diferenças de contorno ósseo entre os lados podem simular ou esconder a queda.",
      },
      {
        title: "O que o teste não diz",
        text: "O sinal não gradua com precisão a lesão nem identifica lesões associadas do canto posterolateral ou dos colaterais.",
      },
    ],
    reasoning: [
      "Use o Godfrey antes de testes de translação anterior para não confundir a redução da tíbia com lesão do LCA.",
      "Associe gaveta posterior e degrau tibial para fortalecer a hipótese.",
      "Investigue varo e rotação externa se a queda for grande, pela frequente associação com o canto posterolateral.",
      "Considere o mecanismo de trauma e a energia envolvida ao decidir pela investigação de lesão multiligamentar.",
    ],
    caution:
      "A queda posterior visível isolada não confirma lesão isolada do LCP nem informa sobre lesões associadas.",
    mistakes: [
      "Observar de cima, e não de perfil.",
      "Permitir que a pessoa sustente as pernas com o quadríceps.",
      "Posicionar os lados em ângulos ou alturas diferentes.",
      "Concluir sem comparar com o outro lado ou sem complementar com a gaveta posterior.",
    ],
    record:
      "Exemplo fictício: Godfrey positivo à esquerda — tuberosidade da tíbia recuada em relação à direita com quadril e joelho a 90° e coxa relaxada; queda reduz com contração leve do quadríceps. Gaveta posterior esquerda com degrau reduzido.",
    related: [
      "ligamento-cruzado-posterior",
      "joelho",
      "tibia",
      "femur",
      "patela",
      "ligamento-patelar",
      "reto-femoral",
      "vasto-intermedio",
    ],
    sources: [
      "jl-malanga-2003",
      "jl-statpearls-lcp",
      "jl-rubinstein-1994",
      "jl-statpearls-luxacao",
    ],
    evidence: {
      text: "Uma revisão das descrições originais dos testes do joelho aponta que a gaveta posterior tem boa acurácia para lesão do LCP e que o sinal da queda posterior a complementa. Faltam estudos robustos que estimem a acurácia do Godfrey isoladamente; trate-o como parte de um conjunto de achados.",
      source: "jl-malanga-2003",
    },
    review: [
      "Sei posicionar quadril e joelho a 90° nos dois lados de forma simétrica.",
      "Sei observar a tuberosidade da tíbia de perfil e reconhecer a queda.",
      "Sei por que o quadríceps contraído mascara o sinal.",
      "Sei combinar o Godfrey com a gaveta posterior e o degrau tibial.",
    ],
    cases: [
      {
        id: "godfrey-positivo",
        question:
          "Caso fictício: com quadris e joelhos a 90° e coxas relaxadas, a tuberosidade da tíbia direita está visivelmente recuada em relação à esquerda. O que registrar?",
        choices: [
          "Lesão do LCA confirmada.",
          "Exame normal, pois não houve dor.",
          "Godfrey positivo à direita; confirmar com degrau tibial e gaveta posterior.",
        ],
        correct: 2,
        explanation:
          "A queda posterior assimétrica sugere insuficiência do LCP; o achado deve ser integrado à gaveta posterior.",
      },
      {
        id: "godfrey-contracao",
        question:
          "Caso fictício: a pessoa segura as pernas sozinha durante o teste e não há queda visível. Qual a limitação?",
        choices: [
          "Nenhuma; o teste é negativo.",
          "A contração do quadríceps pode ter impedido a queda; repetir com relaxamento.",
          "A ausência de queda indica lesão do LCA.",
        ],
        correct: 1,
        explanation:
          "O quadríceps traciona a tíbia anteriormente; sem relaxamento, o sinal perde valor.",
      },
      {
        id: "godfrey-alerta",
        question:
          "Caso fictício: após atropelamento, joelho deformado e muito edemaciado, com dor intensa na perna que piora ao estender os dedos passivamente. Qual conduta?",
        choices: [
          "Não realizar testes de estabilidade; encaminhar com urgência pela suspeita de luxação e síndrome compartimental.",
          "Fazer o Godfrey para graduar a lesão do LCP.",
          "Aplicar gelo e reavaliar em uma semana.",
        ],
        correct: 0,
        explanation:
          "Trauma de alta energia com dor desproporcional e dor ao estiramento passivo sugere síndrome compartimental e possível luxação: emergência.",
      },
    ],
  },
  {
    id: "estresse-em-valgo",
    name: "Teste de estresse em valgo do joelho",
    aliases: [
      "Valgus stress test",
      "Teste de abdução do joelho",
      "Estresse em valgo a 0° e 30°",
    ],
    category: "joelho",
    kind: "ligamentar",
    region: "Joelho · ligamento colateral medial (tibial)",
    position:
      "Paciente em decúbito dorsal, coxa apoiada na maca; examinador ao lado do membro, uma mão na face lateral do joelho e a outra na face medial da perna distal ou do tornozelo.",
    summary:
      "Aplicação de força em valgo no joelho em extensão completa e a 30° de flexão para avaliar o ligamento colateral medial (tibial) e as estruturas mediais e centrais associadas.",
    purpose:
      "Observar dor e abertura da interlinha medial e comparar com o outro lado. A 30° de flexão, o teste isola melhor o colateral medial; em extensão completa, cápsula posteromedial e ligamentos cruzados também contêm o valgo, de modo que frouxidão a 0° indica lesão mais extensa.",
    indications: [
      "Trauma com força externa na face lateral do joelho ou mecanismo em valgo e rotação.",
      "Dor na face medial do joelho após entorse, com ou sem sensação de instabilidade.",
      "Graduação da lesão do colateral medial e acompanhamento da evolução com técnica padronizada.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e teste primeiro o lado não lesionado. A execução exige formação e supervisão.",
      alertaFratura,
      alertaLuxacao,
      alertaDerrame,
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa em decúbito dorsal e relaxada, apoie a coxa na maca. Comece pelo lado não lesionado para conhecer a abertura normal daquela pessoa.",
        cue: "Uma leve rotação externa do quadril ajuda a relaxar a coxa; mantenha a mesma posição nos dois lados.",
      },
      {
        title: "Testar em extensão (0°)",
        text: "Com o joelho em extensão completa, apoie uma mão na face lateral do joelho, na altura da interlinha, como fulcro, e com a outra leve a perna distal para fora, aplicando valgo suave.",
        cue: "Palpe a interlinha medial com os dedos para sentir se ela se abre.",
      },
      {
        title: "Testar a 30° de flexão",
        text: "Flexione o joelho a cerca de 30°, deixando a perna pender pela lateral da maca ou apoiando-a no seu antebraço, e repita o valgo com a mesma técnica.",
        cue: "A 30° o colateral medial é testado de forma mais isolada; não deixe o quadril rodar.",
      },
      {
        title: "Avaliar abertura e ponto final",
        text: "Perceba dor na face medial, quanto a interlinha se abre e como termina o movimento: dor sem abertura, abertura com ponto final presente ou abertura sem ponto final definido.",
        cue: "Mais dor não significa lesão maior: lesões completas podem doer menos que as parciais.",
      },
      {
        title: "Comparar e registrar",
        text: "Compare os dois lados nos dois ângulos e registre separadamente os achados a 0° e a 30°, com dor, abertura estimada e ponto final.",
        cue: "O ângulo em que aparece a frouxidão muda a interpretação; registre ambos.",
      },
    ],
    interpretation: [
      {
        title: "Frouxidão a 30° com 0° estável",
        text: "Dor e abertura medial apenas a 30°, com extensão completa estável, sugerem lesão do colateral medial sem comprometimento importante das estruturas posteromediais e cruzadas.",
      },
      {
        title: "Frouxidão em extensão completa",
        text: "Abertura medial também a 0° indica que, além do colateral medial, a cápsula posteromedial e frequentemente um ou ambos os cruzados foram lesionados. Trate como possível lesão multiligamentar e investigue luxação do joelho.",
      },
      {
        title: "Resultado negativo e armadilhas",
        text: "Ausência de dor e abertura torna improvável lesão relevante do colateral medial. Defesa muscular, rotação do quadril e dor de outra origem (menisco medial, fratura do platô) podem confundir o resultado.",
      },
      {
        title: "O que o teste não diz",
        text: "O teste não diferencia com segurança lesão ligamentar de lesão meniscal medial associada nem substitui a imagem quando há suspeita de fratura ou lesão multiligamentar.",
      },
    ],
    reasoning: [
      "Valorize a história: força externa na face lateral da perna e mecanismo rotacional aumentam a suspeita de lesão do colateral medial.",
      "Dor à palpação ao longo do trajeto do colateral medial (do epicôndilo medial à tíbia) ajuda a diferenciar de dor meniscal na interlinha.",
      "Se houver frouxidão a 0°, examine Lachman, gaveta posterior e pulsos distais antes de qualquer outro teste.",
      "Lesões do colateral medial e do LCA frequentemente coexistem após mecanismo em valgo e rotação.",
      "Registre o grau clínico e reavalie; a conduta (proteção, carga progressiva, encaminhamento) depende do conjunto do exame.",
    ],
    caution:
      "Dor ou abertura em valgo isolada não confirma lesão isolada do colateral medial e, se presente em extensão completa, sugere lesão de estruturas adicionais.",
    mistakes: [
      "Testar apenas em extensão ou apenas a 30° e registrar sem indicar o ângulo.",
      "Deixar o quadril rodar externamente, simulando abertura medial.",
      "Interpretar a intensidade da dor como gravidade da lesão.",
      "Não considerar lesão multiligamentar quando há frouxidão em extensão completa.",
    ],
    record:
      "Exemplo fictício: valgo direito a 30° — dor medial 5/10 e abertura aumentada em relação ao esquerdo, com ponto final presente; a 0°, estável e simétrico. Dor à palpação do colateral medial próximo ao epicôndilo. Lachman simétrico.",
    related: [
      "ligamento-colateral-tibial",
      "menisco-medial",
      "ligamento-popliteo-obliquo",
      "ligamento-cruzado-anterior",
      "ligamento-cruzado-posterior",
      "joelho",
      "femur",
      "tibia",
    ],
    sources: [
      "jl-kastelein-2008",
      "jl-statpearls-lcp",
      "jl-malanga-2003",
      "jl-ottawa-bachmann-2004",
    ],
    evidence: {
      text: "Em 134 adultos atendidos na atenção primária até 5 semanas após trauma do joelho (35 com lesão do colateral medial na ressonância), dor ao valgo a 30° teve razão de verossimilhança positiva de 2,3; somar dor e frouxidão ao valgo a 30° à história elevou-a para 6,4. Os achados valem para essa população e referência; revisões apontam que ainda faltam estudos bem desenhados para os testes dos colaterais.",
      source: "jl-kastelein-2008",
    },
    review: [
      "Sei aplicar o valgo com fulcro lateral, a 0° e a 30° de flexão.",
      "Sei explicar por que a frouxidão em extensão completa indica lesão mais extensa.",
      "Sei distinguir dor sem abertura, abertura com ponto final e abertura sem ponto final.",
      "Sei integrar o teste à história e aos testes dos cruzados e meniscos.",
      "Sei reconhecer sinais de luxação do joelho e de fratura antes do estresse.",
    ],
    cases: [
      {
        id: "valgo-30",
        question:
          "Caso fictício: após pancada na face lateral do joelho no futebol, há dor medial e abertura aumentada apenas a 30°, com 0° estável e ponto final presente. Qual a interpretação?",
        choices: [
          "Sugere lesão do colateral medial sem comprometimento importante das estruturas posteromediais e cruzadas.",
          "Confirma lesão do menisco medial.",
          "Indica luxação do joelho.",
        ],
        correct: 0,
        explanation:
          "Frouxidão apenas a 30° é o padrão esperado na lesão do colateral medial; complete o exame dos cruzados e meniscos.",
      },
      {
        id: "valgo-extensao",
        question:
          "Caso fictício: o valgo mostra abertura medial também em extensão completa, e o Lachman está assimétrico. O que esse padrão sugere?",
        choices: [
          "Lesão isolada e leve do colateral medial.",
          "Lesão do colateral medial associada a cápsula posteromedial e cruzado; investigar lesão multiligamentar.",
          "Frouxidão constitucional sem importância clínica.",
        ],
        correct: 1,
        explanation:
          "Em extensão completa, cápsula posteromedial e cruzados também restringem o valgo. Frouxidão a 0° indica lesão mais extensa e pede investigação.",
      },
      {
        id: "valgo-ottawa",
        question:
          "Caso fictício: pessoa de 62 anos caiu e não conseguiu dar quatro passos desde o trauma; há dor à palpação da cabeça da fíbula. Antes do valgo, o que fazer?",
        choices: [
          "Aplicar o valgo com força para graduar a lesão.",
          "Testar apenas a 30°, que é mais seguro.",
          "Não aplicar estresse; os critérios de Ottawa indicam radiografia para investigar fratura.",
        ],
        correct: 2,
        explanation:
          "Idade, incapacidade de carga e dor na cabeça da fíbula são critérios da regra de Ottawa. Com suspeita de fratura, o estresse ligamentar não deve ser feito.",
      },
    ],
  },
  {
    id: "estresse-em-varo",
    name: "Teste de estresse em varo do joelho",
    aliases: [
      "Varus stress test",
      "Teste de adução do joelho",
      "Estresse em varo a 0° e 30°",
    ],
    category: "joelho",
    kind: "ligamentar",
    region:
      "Joelho · ligamento colateral lateral (fibular) e canto posterolateral",
    position:
      "Paciente em decúbito dorsal, coxa apoiada na maca; examinador ao lado do membro, uma mão na face medial do joelho e a outra na face lateral da perna distal ou do tornozelo.",
    summary:
      "Aplicação de força em varo no joelho em extensão completa e a 30° de flexão para avaliar o ligamento colateral lateral (fibular) e as estruturas do canto posterolateral.",
    purpose:
      "Observar dor e abertura da interlinha lateral e comparar com o outro lado. O colateral lateral é a principal restrição ao varo em todos os graus de flexão; a 30°, o teste o avalia de forma mais isolada, enquanto frouxidão em extensão completa sugere lesão associada do canto posterolateral e dos cruzados.",
    indications: [
      "Trauma com força na face medial do joelho, hiperextensão ou mecanismo em varo e rotação externa.",
      "Dor lateral ou posterolateral após entorse, com sensação de instabilidade em extensão.",
      "Investigação de lesão do canto posterolateral associada a lesão dos cruzados.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e teste primeiro o lado não lesionado. A execução exige formação e supervisão.",
      alertaFratura,
      alertaLuxacao,
      "Lesões do canto posterolateral se associam a lesão do nervo fibular comum: verifique dorsiflexão do tornozelo, extensão do hálux e sensibilidade do dorso do pé antes e depois do teste; déficit novo exige encaminhamento.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa em decúbito dorsal e relaxada, apoie a coxa na maca. Comece pelo lado não lesionado para conhecer a abertura normal daquela pessoa.",
        cue: "Registre antes a função do nervo fibular comum (dorsiflexão e sensibilidade do dorso do pé).",
      },
      {
        title: "Testar em extensão (0°)",
        text: "Com o joelho em extensão completa, apoie uma mão na face medial do joelho, na altura da interlinha, como fulcro, e com a outra leve a perna distal para dentro, aplicando varo suave.",
        cue: "Palpe a interlinha lateral para sentir a abertura; não deixe o quadril rodar.",
      },
      {
        title: "Testar a 30° de flexão",
        text: "Flexione o joelho a cerca de 30°, apoiando a perna, e repita o varo com a mesma técnica.",
        cue: "A 30° o colateral lateral é testado de forma mais isolada.",
      },
      {
        title: "Palpar o colateral lateral",
        text: "Com o joelho flexionado e o tornozelo apoiado sobre o joelho oposto (posição em 'figura de 4'), palpe o colateral lateral como um cordão entre o epicôndilo lateral e a cabeça da fíbula e compare.",
        cue: "Ausência do cordão palpável ou dor no trajeto reforça a suspeita.",
      },
      {
        title: "Comparar e registrar",
        text: "Compare os dois lados nos dois ângulos e registre separadamente dor, abertura estimada e ponto final a 0° e a 30°, além do exame do nervo fibular comum.",
        cue: "Registre ambos os ângulos; a frouxidão em extensão muda a interpretação.",
      },
    ],
    interpretation: [
      {
        title: "Frouxidão a 30° com 0° estável",
        text: "Dor e abertura lateral apenas a 30° sugerem lesão do colateral lateral, possivelmente com algum envolvimento do canto posterolateral.",
      },
      {
        title: "Frouxidão em extensão completa",
        text: "Abertura lateral também a 0° indica lesão do colateral lateral associada ao canto posterolateral (poplíteo, ligamento popliteofibular, cápsula) e frequentemente a um cruzado. Considere lesão multiligamentar e investigue luxação reduzida.",
      },
      {
        title: "Resultado negativo e armadilhas",
        text: "A abertura lateral normal costuma ser maior que a medial, por isso a comparação entre os lados é essencial. Defesa muscular, rotação do quadril e dor de origem meniscal ou óssea podem confundir.",
      },
      {
        title: "O que o teste não diz",
        text: "O varo não avalia completamente o componente rotatório do canto posterolateral; outros testes (como a comparação da rotação externa da tíbia a 30° e 90°) e a imagem complementam a investigação.",
      },
    ],
    reasoning: [
      "Lesões do colateral lateral e do canto posterolateral são menos frequentes, mas costumam passar despercebidas; mantenha alta suspeita após trauma em varo ou hiperextensão.",
      "Integre com gaveta posterior, Godfrey e Lachman, pois lesões do canto posterolateral acompanham com frequência lesões dos cruzados.",
      "Investigue a rotação externa aumentada da tíbia em relação ao outro lado, que sugere componente posterolateral.",
      "Avalie o nervo fibular comum: fraqueza de dorsiflexão ou alteração sensitiva muda a urgência do encaminhamento.",
      "Lesões do canto posterolateral não reconhecidas podem comprometer a evolução de lesões dos cruzados; encaminhe quando houver suspeita.",
    ],
    caution:
      "Dor ou abertura em varo isolada não confirma lesão isolada do colateral lateral nem caracteriza o componente rotatório do canto posterolateral.",
    mistakes: [
      "Não comparar com o outro lado, esquecendo que a abertura lateral normal é maior que a medial.",
      "Testar apenas em um ângulo ou registrar sem indicar o ângulo.",
      "Ignorar o exame do nervo fibular comum.",
      "Não investigar os cruzados quando há frouxidão em extensão completa.",
    ],
    record:
      "Exemplo fictício: varo esquerdo a 30° — dor lateral 4/10 e abertura aumentada em relação ao direito, ponto final presente; a 0°, estável. Colateral lateral doloroso à palpação em figura de 4. Dorsiflexão e sensibilidade do dorso do pé preservadas.",
    related: [
      "ligamento-colateral-fibular",
      "ligamento-popliteofibular",
      "popliteo",
      "biceps-femoral",
      "trato-iliotibial",
      "nervo-fibular-comum",
      "fibula",
      "ligamento-cruzado-posterior",
    ],
    sources: [
      "jl-statpearls-lcl",
      "jl-statpearls-lcp",
      "jl-malanga-2003",
      "jl-statpearls-luxacao",
    ],
    evidence: {
      text: "Uma revisão das descrições originais e da validade dos testes do joelho concluiu que os testes dos colaterais parecem úteis, mas faltam estudos bem desenhados que estimem sua sensibilidade e especificidade. Não há números confiáveis para o varo isolado; use-o como parte do exame completo e compare sempre com o outro lado.",
      source: "jl-malanga-2003",
    },
    review: [
      "Sei aplicar o varo com fulcro medial, a 0° e a 30° de flexão.",
      "Sei explicar o que significa frouxidão em varo em extensão completa.",
      "Sei palpar o colateral lateral na posição em figura de 4.",
      "Sei examinar o nervo fibular comum antes e depois do teste.",
      "Sei quais testes associar para investigar o canto posterolateral.",
    ],
    cases: [
      {
        id: "varo-30",
        question:
          "Caso fictício: após golpe na face medial do joelho, há dor lateral e abertura aumentada a 30°, com extensão completa estável e nervo fibular preservado. Qual a interpretação?",
        choices: [
          "Lesão multiligamentar confirmada.",
          "Sugere lesão do colateral lateral; completar com testes dos cruzados e da rotação externa.",
          "Lesão do menisco medial.",
        ],
        correct: 1,
        explanation:
          "Frouxidão apenas a 30° aponta para o colateral lateral. A investigação do canto posterolateral e dos cruzados completa o raciocínio.",
      },
      {
        id: "varo-fibular",
        question:
          "Caso fictício: além da abertura em varo em extensão completa, a pessoa não consegue levantar a ponta do pé e relata dormência no dorso do pé. O que priorizar?",
        choices: [
          "Repetir o varo até graduar a lesão.",
          "Iniciar alongamento dos fibulares.",
          "Suspeitar de lesão multiligamentar com lesão do nervo fibular comum; checar pulsos e encaminhar com urgência.",
        ],
        correct: 2,
        explanation:
          "Frouxidão em extensão e déficit do nervo fibular comum sugerem lesão grave do canto posterolateral, possivelmente luxação reduzida, com risco vascular associado.",
      },
      {
        id: "varo-comparacao",
        question:
          "Caso fictício: a interlinha lateral abre um pouco mais que a medial no mesmo joelho, mas de forma igual nos dois joelhos, sem dor. O que registrar?",
        choices: [
          "Varo simétrico e indolor, sem sinal de lesão do colateral lateral.",
          "Lesão do colateral lateral, pois a abertura lateral é maior que a medial.",
          "Lesão do LCA.",
        ],
        correct: 0,
        explanation:
          "A abertura lateral normal costuma ser maior que a medial. A referência é o outro joelho, não o lado oposto da mesma articulação.",
      },
    ],
  },
];
