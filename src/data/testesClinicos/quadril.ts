import type { ClinicalTest } from "../clinicalTests";

export const quadrilSources: {
  id: string;
  name: string;
  url: string;
  note: string;
}[] = [
  {
    id: "qd-reiman-quadril-2013",
    name: "Reiman et al. — acurácia dos testes clínicos do quadril: revisão sistemática com metanálise (2013)",
    url: "https://pubmed.ncbi.nlm.nih.gov/22773321/",
    note: "Mostra que a maioria dos testes físicos do quadril tem propriedades diagnósticas fracas quando usada isoladamente.",
  },
  {
    id: "qd-reiman-ifa-2015",
    name: "Reiman et al. — testes clínicos para impacto femoroacetabular e lesão labral: metanálise (2015)",
    url: "https://pubmed.ncbi.nlm.nih.gov/25515771/",
    note: "Sustenta a sensibilidade alta e o valor apenas de rastreio do FADIR e da flexão com rotação interna.",
  },
  {
    id: "qd-martin-infiltracao-2008",
    name: "Martin, Irrgang e Sekiya — exame clínico e dor intra-articular confirmada por infiltração anestésica (2008)",
    url: "https://pubmed.ncbi.nlm.nih.gov/18760208/",
    note: "Mostra que FABER, FADIR e outros sinais não identificaram bem quem tinha dor de origem intra-articular.",
  },
  {
    id: "qd-martin-confiabilidade-2008",
    name: "Martin e Sekiya — confiabilidade entre examinadores de FABER, FADIR, rolamento e palpação trocantérica (2008)",
    url: "https://pubmed.ncbi.nlm.nih.gov/18560194/",
    note: "Fornece a concordância entre examinadores para FABER, FADIR, log roll e dor à palpação do trocanter maior.",
  },
  {
    id: "qd-laslett-sacroiliaca-2005",
    name: "Laslett et al. — testes de provocação da sacroilíaca isolados e em conjunto (2005)",
    url: "https://pubmed.ncbi.nlm.nih.gov/16038856/",
    note: "Apoia o uso de um conjunto de testes de provocação, e não de um teste isolado, para suspeitar de dor sacroilíaca.",
  },
  {
    id: "qd-statpearls-ifa",
    name: "O'Rourke e El Bitar — Impacto femoroacetabular, StatPearls (2023)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK547699/",
    note: "Descreve as morfologias cam e pincer, o mecanismo de lesão labral e condral e a avaliação clínica do impacto.",
  },
  {
    id: "qd-vigotsky-thomas-2016",
    name: "Vigotsky et al. — validade do teste de Thomas modificado e controle da inclinação pélvica (2016)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4991856/",
    note: "Mostra que o Thomas modificado mede mal a extensão do quadril quando a inclinação pélvica não é controlada.",
  },
  {
    id: "qd-peeler-thomas-2008",
    name: "Peeler e Anderson — limites de confiabilidade do Thomas modificado para o reto femoral (2008)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2547866/",
    note: "Relata confiabilidade baixa do critério passa/falha e moderada da goniometria do joelho no Thomas modificado.",
  },
  {
    id: "qd-reese-ober-2003",
    name: "Reese e Bandy — inclinômetro nos testes de Ober e Ober modificado (2003)",
    url: "https://pubmed.ncbi.nlm.nih.gov/12839207/",
    note: "Sustenta a boa confiabilidade intraexaminador e mostra que as duas versões do Ober não são intercambiáveis.",
  },
  {
    id: "qd-olivencia-ely-2020",
    name: "Olivencia et al. — confiabilidade e mudança mínima detectável do teste de Ely (2020)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7575148/",
    note: "Relata confiabilidade alta do Ely com estabilização da pelve e mudança mínima detectável de cerca de 8°.",
  },
  {
    id: "qd-bird-trocanter-2001",
    name: "Bird et al. — ressonância e exame físico na síndrome dolorosa do trocanter maior (2001)",
    url: "https://pubmed.ncbi.nlm.nih.gov/11592379/",
    note: "Estima a acurácia e a confiabilidade do sinal de Trendelenburg para ruptura do glúteo médio em mulheres com dor lateral.",
  },
  {
    id: "qd-grimaldi-tendinopatia-2017",
    name: "Grimaldi et al. — testes clínicos para tendinopatia glútea confirmada por ressonância (2017)",
    url: "https://pubmed.ncbi.nlm.nih.gov/27633027/",
    note: "Mostra o valor da dor lateral nos primeiros 30 s de apoio unipodal para suspeitar de tendinopatia glútea.",
  },
  {
    id: "qd-statpearls-trendelenburg",
    name: "Gandbhir et al. — Marcha de Trendelenburg, StatPearls (2024)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK541094/",
    note: "Explica o mecanismo abdutor (glúteos médio e mínimo), a queda pélvica contralateral e as causas do sinal.",
  },
  {
    id: "qd-statpearls-epifisiolise",
    name: "Johns, Mabrouk e Tavarez — Epifisiólise proximal do fêmur, StatPearls (2023)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK538302/",
    note: "Alerta que a epifisiólise em adolescentes pode se apresentar com dor na coxa ou no joelho e que o atraso aumenta complicações.",
  },
  {
    id: "qd-statpearls-artrite-septica",
    name: "Vijayan e Mabrouk — Artrite séptica do quadril pediátrico, StatPearls (2026)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK459284/",
    note: "Caracteriza a artrite séptica do quadril como emergência ortopédica: febre, dor, claudicação e recusa em apoiar o peso.",
  },
];

export const quadrilTests: ClinicalTest[] = [
  {
    id: "faber",
    name: "Teste FABER (Patrick)",
    aliases: [
      "Teste de Patrick",
      "FABER",
      "Flexion, ABduction, External Rotation",
      "Teste do 4",
      "Figura de quatro",
    ],
    category: "quadril",
    kind: "provocacao",
    region: "Quadril · coxofemoral e sacroilíaca",
    position:
      "Paciente em decúbito dorsal, com o tornozelo do lado testado apoiado logo acima do joelho oposto; examinador ao lado da maca, uma mão na espinha ilíaca anterossuperior contralateral e a outra na face medial do joelho testado.",
    summary:
      'Posição de flexão, abdução e rotação externa do quadril (a "figura de quatro") com pressão suave sobre o joelho para provocar a dor habitual e comparar a amplitude entre os lados.',
    purpose:
      "Verificar se a combinação de flexão, abdução e rotação externa reproduz a queixa e onde ela aparece. Dor na virilha aponta para a articulação do quadril ou estruturas anteriores; dor posterior, na região da sacroilíaca, desloca a hipótese para a cintura pélvica. Também permite comparar a amplitude de rotação externa entre os lados.",
    indications: [
      "Dor na virilha, na região glútea ou na região sacroilíaca, quando é preciso diferenciar origem no quadril de origem na cintura pélvica.",
      "Rigidez ou perda de amplitude do quadril em rotação externa e abdução, comparando os lados.",
      "Componente de um conjunto maior de testes do quadril e da sacroilíaca, nunca como teste único.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e registre a dor inicial. A execução clínica exige formação e supervisão adequadas.",
      "Aplique a pressão sobre o joelho de forma lenta e progressiva; interrompa ao reproduzir a dor habitual ou diante de dor intensa.",
      "Após artroplastia ou cirurgia do quadril, siga as restrições de movimento definidas pela equipe cirúrgica; trauma recente ou suspeita de fratura exigem imagem antes da manobra.",
      "Dor no quadril com febre, perda de peso inexplicada, dor noturna intensa ou incapacidade súbita de apoiar o peso exige encaminhamento médico antes de qualquer teste provocativo.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: 'Com a pessoa em decúbito dorsal e o membro oposto estendido, flexione o quadril e o joelho do lado testado e apoie o maléolo lateral logo acima do joelho contralateral, formando um "4". Pergunte onde e como é a dor habitual.',
        cue: "Teste primeiro o lado menos sintomático para ter uma referência.",
      },
      {
        title: "Estabilizar a pelve",
        text: "Coloque uma mão sobre a espinha ilíaca anterossuperior do lado oposto, fixando a pelve contra a maca. Assim a abdução ocorre no quadril testado, e não pela rotação da pelve.",
        cue: "Sem estabilização, a pelve gira e a amplitude parece maior do que é.",
      },
      {
        title: "Observar a posição de repouso",
        text: "Antes de aplicar pressão, observe a altura do joelho testado em relação à maca e compare com o outro lado. Uma distância joelho–maca claramente maior sugere restrição de rotação externa ou abdução.",
        cue: "Meça a distância com régua ou fita, se quiser acompanhar a evolução.",
      },
      {
        title: "Aplicar pressão suave",
        text: "Com a mão sobre a face medial do joelho, empurre lentamente em direção à maca, aumentando a abdução e a rotação externa do quadril. Pergunte se a dor aparece, onde e se é a mesma da queixa.",
        cue: "Diferencie dor na virilha (anterior) de dor posterior, perto da sacroilíaca.",
      },
      {
        title: "Retornar e comparar",
        text: "Alivie a pressão, desfaça a posição devagar e repita do outro lado. Registre localização da dor, intensidade e amplitude de cada lado.",
        cue: 'Anote o local da dor; "FABER positivo" sem local é pouco útil.',
      },
    ],
    interpretation: [
      {
        title: "Dor anterior, na virilha",
        text: "Reproduzir a dor habitual na virilha apoia a hipótese de origem no quadril (articulação coxofemoral, lábio acetabular) ou em estruturas anteriores, como o iliopsoas. Não diferencia artrose, lesão labral ou impacto entre si.",
      },
      {
        title: "Dor posterior, na região sacroilíaca",
        text: "Dor na região da sacroilíaca do lado oposto ou do mesmo lado sugere investigar a cintura pélvica. A suspeita deve ser confirmada com um conjunto de testes de provocação da sacroilíaca, não pelo FABER sozinho.",
      },
      {
        title: "Restrição sem dor",
        text: "Joelho mais alto que o do outro lado, sem dor, indica menor amplitude de rotação externa e abdução. Pode refletir rigidez articular, encurtamento dos adutores ou característica individual; registre como achado de mobilidade.",
      },
      {
        title: "O que o teste não diz",
        text: "Um FABER negativo não exclui doença intra-articular, e um positivo não identifica a estrutura lesionada. Dor apenas na face medial da coxa costuma refletir tensão dos adutores, não necessariamente a queixa.",
      },
    ],
    reasoning: [
      "Relacione o local da dor provocada à história: dor na virilha ao calçar sapatos ou sair do carro pesa a favor do quadril; dor ao rolar na cama ou ao subir escadas com apoio unipodal pode envolver a cintura pélvica.",
      "Combine com o exame de amplitude (especialmente rotação interna), com o FADIR e com a marcha. Perda de rotação interna dolorosa em adulto mais velho aumenta a suspeita de artrose do quadril.",
      "Se a dor é posterior, aplique o conjunto de testes de provocação da sacroilíaca (distração, compressão, impulso na coxa, impulso sacral, Gaenslen). Vários positivos têm mais valor que um único teste.",
      "Considere a coluna lombar: dor glútea também pode ser referida da região lombar. Exame da coluna e neurológico ajudam a separar as fontes.",
      "Exames de imagem dependem da hipótese e de sinais de alerta; um FABER positivo isolado não justifica pedir ressonância.",
    ],
    caution:
      "Um FABER positivo isolado não confirma lesão intra-articular nem disfunção sacroilíaca; ele apenas indica onde a carga provoca a dor.",
    mistakes: [
      "Não estabilizar a pelve contralateral, permitindo que ela gire e mascare a restrição.",
      'Registrar "positivo" sem descrever o local da dor (virilha, posterior, medial da coxa).',
      "Empurrar o joelho com força ou de forma brusca, transformando o teste em alongamento doloroso.",
      "Interpretar a tensão dos adutores na face medial da coxa como reprodução da queixa.",
    ],
    record:
      "Exemplo fictício: FABER direito — reproduz dor habitual na virilha direita, 5/10, com joelho a 18 cm da maca (esquerdo a 10 cm, sem dor). Sem dor posterior. Associar ao FADIR, rotação interna medida e marcha.",
    related: [
      "coxofemoral",
      "sacroiliaca",
      "labio-acetabular",
      "osso-do-quadril",
      "femur",
      "sacro",
      "psoas-maior",
      "adutor-longo",
    ],
    sources: [
      "qd-martin-infiltracao-2008",
      "qd-martin-confiabilidade-2008",
      "qd-laslett-sacroiliaca-2005",
      "qd-reiman-quadril-2013",
    ],
    evidence: {
      text: "Em 49 candidatos a artroscopia de quadril que receberam infiltração anestésica intra-articular, o FABER e o FADIR não distinguiram quem teve mais de 50% de alívio da dor (ou seja, dor de origem predominantemente intra-articular). Trata-se de uma amostra pequena e selecionada por cirurgião especialista; o resultado reforça que o teste não deve ser usado sozinho para decidir a origem da dor.",
      source: "qd-martin-infiltracao-2008",
    },
    review: [
      "Sei montar a posição de flexão, abdução e rotação externa e estabilizar a pelve contralateral.",
      "Sei diferenciar dor na virilha de dor posterior e o que cada uma sugere.",
      "Sei registrar a distância joelho–maca e comparar os lados.",
      "Sei que a suspeita sacroilíaca exige um conjunto de testes, não o FABER isolado.",
      "Sei reconhecer sinais de alerta que contraindicam testes provocativos.",
    ],
    cases: [
      {
        id: "virilha",
        question:
          "Caso fictício: adulto de 52 anos com dor na virilha direita ao calçar meias. O FABER direito reproduz essa dor na virilha e o joelho fica mais alto que o esquerdo. Qual interpretação é mais adequada?",
        choices: [
          "Apoia hipótese de origem no quadril; integrar com rotação interna, FADIR e história.",
          "Confirma disfunção da articulação sacroilíaca direita.",
          "Confirma artrose do quadril e indica ressonância imediata.",
        ],
        correct: 0,
        explanation:
          "Dor na virilha com restrição apoia origem no quadril, mas não identifica a estrutura nem substitui a avaliação completa; a imagem depende da pergunta clínica.",
      },
      {
        id: "posterior",
        question:
          "Caso fictício: gestante de 30 semanas com dor glútea esquerda. No FABER esquerdo, a dor habitual aparece posteriormente, perto da sacroilíaca, sem dor na virilha. Qual o próximo passo?",
        choices: [
          "Concluir lesão do lábio acetabular.",
          "Aplicar o conjunto de testes de provocação da sacroilíaca, respeitando conforto e posição.",
          "Repetir o FABER com mais força até a dor ficar intensa.",
        ],
        correct: 1,
        explanation:
          "Dor posterior desloca a hipótese para a cintura pélvica. Um conjunto de testes de provocação tem mais valor que um único teste; posições devem ser adaptadas à gestação.",
      },
      {
        id: "alerta",
        question:
          "Caso fictício: pessoa de 68 anos com dor no quadril que piorou em semanas, dor noturna intensa, perda de peso não intencional e histórico de câncer. Qual prioridade?",
        choices: [
          "Fazer o FABER para confirmar se a dor é articular.",
          "Tratar como dor muscular e reavaliar em um mês.",
          "Encaminhar para avaliação médica antes de testes provocativos.",
        ],
        correct: 2,
        explanation:
          "O conjunto sugere possível causa grave (por exemplo, metástase ou infecção). O encaminhamento não depende de nenhum teste ortopédico.",
      },
    ],
  },
  {
    id: "fadir",
    name: "Teste FADIR",
    aliases: [
      "FADIR",
      "Flexion, ADduction, Internal Rotation",
      "Teste de impacto anterior",
      "Anterior impingement test",
    ],
    category: "quadril",
    kind: "impacto",
    region: "Quadril · impacto femoroacetabular e lábio acetabular",
    position:
      "Paciente em decúbito dorsal; examinador ao lado testado, uma mão no joelho e a outra no tornozelo, levando o quadril a 90° de flexão com o joelho a 90°.",
    summary:
      "Combinação passiva de flexão a 90°, adução e rotação interna do quadril, que aproxima o colo femoral da borda anterossuperior do acetábulo para provocar a dor habitual na virilha.",
    purpose:
      "Rastrear dor relacionada ao impacto femoroacetabular e à lesão do lábio acetabular. A sensibilidade é alta e a especificidade é baixa: um teste negativo ajuda a tornar essas hipóteses menos prováveis, enquanto um positivo é pouco específico e precisa de outros achados.",
    indications: [
      "Dor anterior no quadril ou na virilha, especialmente com flexão sustentada (sentar, agachar, entrar no carro) em pessoas ativas.",
      "Suspeita de impacto femoroacetabular ou de lesão labral, como parte do exame do quadril.",
      "Acompanhar a irritabilidade da dor na mesma técnica ao longo da reabilitação.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e registre a dor inicial. A prática clínica exige formação e supervisão.",
      "Leve o quadril devagar até o primeiro relato de dor habitual; não force a rotação interna no fim da amplitude.",
      "Após artroplastia de quadril, flexão com adução e rotação interna pode ser posição de risco de luxação, conforme a via cirúrgica; siga as restrições da equipe cirúrgica.",
      "Adolescente com dor no quadril, coxa ou joelho e claudicação, ou adulto com dor após queda e incapacidade de apoiar o peso, precisa de avaliação médica e imagem antes de manobras forçadas.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa em decúbito dorsal, pergunte onde é a dor habitual. Flexione passivamente o quadril e o joelho do lado testado até cerca de 90° cada.",
        cue: "Mantenha a pelve apoiada; a outra perna fica estendida e relaxada.",
      },
      {
        title: "Aduzir",
        text: "Mantendo a flexão, leve o joelho em direção à linha média do corpo (adução), sem deixar a pelve rolar para o lado oposto.",
        cue: "Observe a espinha ilíaca: se ela se elevar, a pelve está compensando.",
      },
      {
        title: "Rodar internamente",
        text: "Usando o tornozelo como alavanca, leve a perna para fora, o que produz rotação interna do quadril. Pare na primeira dor habitual ou no limite de movimento.",
        cue: "Pé para fora = rotação interna do quadril; não confunda a direção.",
      },
      {
        title: "Identificar a resposta",
        text: 'Pergunte se a dor é a mesma da queixa e onde aparece. Dor aguda ou em "beliscão" na virilha é a resposta mais relacionada ao impacto anterior.',
        cue: "Diferencie dor na virilha de dor lateral ou posterior.",
      },
      {
        title: "Retornar e comparar",
        text: "Desfaça a rotação e a adução, retorne a perna à maca e repita do outro lado. Registre a resposta e a amplitude de rotação interna.",
        cue: "Uma rotação interna menor do lado doloroso é um dado complementar útil.",
      },
    ],
    interpretation: [
      {
        title: "Positivo: reprodução da dor habitual na virilha",
        text: "É compatível com impacto femoroacetabular ou lesão labral, mas também ocorre em artrose, tendinopatia do iliopsoas e outras condições do quadril, e até em pessoas sem sintomas. Por isso, isolado, tem pouco poder para confirmar.",
      },
      {
        title: "Negativo",
        text: "Pela alta sensibilidade descrita nos estudos, a ausência da dor habitual torna menos provável uma origem por impacto ou lesão labral. Ainda assim, a qualidade dos estudos é limitada, e um negativo não exclui toda doença intra-articular.",
      },
      {
        title: "Armadilhas",
        text: "Pelve que rola durante a adução, rotação interna forçada além do limite e dor por compressão de partes moles na virilha podem gerar respostas difíceis de interpretar.",
      },
      {
        title: "O que o teste não diz",
        text: "O diagnóstico de síndrome do impacto femoroacetabular combina sintomas, sinais clínicos e imagem compatível. Uma morfologia cam ou pincer na radiografia, sem sintomas, também não define doença.",
      },
    ],
    reasoning: [
      "Use o FADIR principalmente para rastrear: negativo ajuda a afastar; positivo exige somar história, amplitude e outros testes.",
      "Pergunte sobre dor na virilha em flexão sustentada, estalidos, travamento e piora ao sentar ou agachar; o padrão de sintomas pesa tanto quanto o teste.",
      "Compare a rotação interna a 90° de flexão entre os lados e associe com FABER e log roll para estimar irritabilidade intra-articular.",
      "Em adolescentes com dor no quadril, coxa ou joelho, pense em epifisiólise antes de atribuir a dor a impacto.",
      "Imagem é indicada quando pode mudar a conduta (por exemplo, falha do tratamento conservador ou planejamento cirúrgico), não por um FADIR positivo isolado.",
    ],
    caution:
      "Um FADIR positivo isolado não confirma impacto femoroacetabular nem lesão labral, porque a especificidade é baixa.",
    mistakes: [
      "Girar o pé para dentro achando que isso é rotação interna do quadril (é o contrário).",
      "Permitir que a pelve role durante a adução, reduzindo o estresse sobre a borda acetabular.",
      "Tratar qualquer desconforto na virilha como positivo, sem perguntar se é a dor habitual.",
      "Concluir lesão labral ou indicar cirurgia com base apenas no teste.",
    ],
    record:
      "Exemplo fictício: FADIR esquerdo — reproduz dor habitual em beliscão na virilha, 6/10; rotação interna a 90° de flexão 15° (direito 30°, FADIR sem dor). FABER esquerdo com dor leve na virilha. Hipótese a investigar: dor intra-articular do quadril esquerdo.",
    related: [
      "coxofemoral",
      "labio-acetabular",
      "femur",
      "osso-do-quadril",
      "ligamento-iliofemoral",
      "ligamento-isquiofemoral",
      "psoas-maior",
    ],
    sources: [
      "qd-reiman-ifa-2015",
      "qd-statpearls-ifa",
      "qd-martin-confiabilidade-2008",
      "qd-statpearls-epifisiolise",
    ],
    evidence: {
      text: "Em revisão sistemática com metanálise (21 artigos, 9 combinados, apenas 1 de alta qualidade), o FADIR teve sensibilidade agrupada entre 0,94 e 0,99, com razão de chances diagnóstica de intervalo de confiança muito amplo; os autores concluíram que serve apenas para rastreio. Os estudos incluíram principalmente pessoas já encaminhadas para avaliação do quadril, e a especificidade não sustenta confirmar o diagnóstico.",
      source: "qd-reiman-ifa-2015",
    },
    review: [
      "Sei levar o quadril a 90° de flexão, aduzir e rodar internamente na direção correta.",
      "Sei explicar por que um FADIR negativo é mais útil que um positivo.",
      "Sei que a síndrome do impacto exige sintomas, sinais e imagem compatíveis.",
      "Sei comparar a rotação interna entre os lados e registrar a dor habitual.",
      "Sei lembrar da epifisiólise em adolescentes com dor no quadril ou joelho.",
    ],
    cases: [
      {
        id: "negativo",
        question:
          "Caso fictício: corredora com dor lateral no quadril ao deitar sobre o lado. O FADIR não reproduz nenhuma dor na virilha. O que esse resultado sugere?",
        choices: [
          "Confirma tendinopatia glútea.",
          "Impacto femoroacetabular fica menos provável; investigar outras fontes da dor lateral.",
          "Exclui qualquer problema no quadril.",
        ],
        correct: 1,
        explanation:
          "Pela alta sensibilidade, o negativo reduz a probabilidade de impacto, mas não confirma outra hipótese nem exclui toda doença do quadril.",
      },
      {
        id: "positivo",
        question:
          "Caso fictício: jogador de futebol de 24 anos com dor na virilha ao sentar por muito tempo. O FADIR reproduz a dor em beliscão. Qual conclusão é adequada?",
        choices: [
          "Lesão labral confirmada; indicar cirurgia.",
          "Teste sem valor; ignorar o achado.",
          "Achado compatível com impacto; integrar história, amplitude e, se necessário, imagem.",
        ],
        correct: 2,
        explanation:
          "O positivo é compatível, mas pouco específico. O diagnóstico de síndrome do impacto combina sintomas, sinais clínicos e imagem.",
      },
      {
        id: "adolescente",
        question:
          "Caso fictício: menino de 13 anos, com sobrepeso, manca há três semanas e refere dor no joelho direito. Ao flexionar o quadril, a coxa roda externamente sozinha e a rotação interna está muito limitada. O que fazer?",
        choices: [
          "Evitar manobras forçadas e encaminhar com urgência para avaliação médica e imagem do quadril.",
          "Fazer o FADIR com força para confirmar impacto.",
          "Tratar como dor patelofemoral e liberar esportes.",
        ],
        correct: 0,
        explanation:
          "O quadro sugere epifisiólise proximal do fêmur, que pode se manifestar como dor no joelho. O atraso no diagnóstico aumenta o risco de complicações.",
      },
    ],
  },
  {
    id: "thomas",
    name: "Teste de Thomas",
    aliases: [
      "Thomas test",
      "Teste de Thomas modificado",
      "Modified Thomas test",
      "Teste de Kendall",
    ],
    category: "quadril",
    kind: "comprimento-muscular",
    region: "Quadril · flexores (iliopsoas e reto femoral)",
    position:
      "Paciente sentado na borda distal da maca e depois deitado em decúbito dorsal, segurando o joelho oposto junto ao peito; examinador ao lado testado, observando a coxa e o joelho que pendem.",
    summary:
      "Com a pelve fixada em retroversão pelo joelho oposto mantido ao peito, observa-se se a coxa testada alcança a horizontal e quanto o joelho flexiona, para estimar o comprimento dos flexores do quadril.",
    purpose:
      "Estimar a extensibilidade do iliopsoas (flexor monoarticular) e do reto femoral (biarticular), além de sinais de tensão do tensor da fáscia lata. A versão original avalia contratura em flexão do quadril na maca; a versão modificada, na borda da maca, permite observar também o joelho.",
    indications: [
      "Suspeita de encurtamento dos flexores do quadril ou de contratura em flexão, por exemplo após longos períodos sentado, artrose ou imobilização.",
      "Dor lombar ou anterior do quadril em que a extensão do quadril parece limitada na marcha ou na corrida.",
      "Acompanhar mudanças de comprimento muscular usando a mesma técnica e o mesmo controle da pelve.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e registre a dor inicial. A prática clínica exige formação e supervisão.",
      "Na versão modificada, ajude a pessoa a deitar e a se levantar da borda da maca; garanta que a maca esteja estável e que ela não deslize.",
      "Após artroplastia de quadril, cirurgia recente ou em dor lombar muito irritável, adapte ou adie o teste; flexionar o quadril oposto até o peito pode ser contraindicado.",
      "Interrompa se surgir dor lombar intensa, formigamento na coxa ou dor que não seja de alongamento.",
    ],
    steps: [
      {
        title: "Posicionar na borda",
        text: "Peça que a pessoa sente bem na borda distal da maca, com a metade da coxa para fora. Ajude-a a deitar segurando os dois joelhos junto ao peito.",
        cue: "O sacro deve ficar apoiado na maca ao deitar.",
      },
      {
        title: "Fixar a pelve",
        text: "Mantendo o joelho oposto junto ao peito, peça que solte lentamente o membro testado, deixando a coxa pender da maca e o joelho flexionar livremente.",
        cue: "A lombar deve ficar apoiada, sem arco exagerado e sem enrolar demais a pelve.",
      },
      {
        title: "Observar a coxa",
        text: "Veja se a face posterior da coxa toca a maca ou fica na horizontal. Coxa elevada indica flexão residual do quadril, sugerindo encurtamento dos flexores.",
        cue: "Use goniômetro ou inclinômetro para medir o ângulo do quadril, se possível.",
      },
      {
        title: "Observar o joelho e o desvio lateral",
        text: "Observe o ângulo de flexão do joelho e se a coxa se desvia em abdução. Joelho pouco flexionado sugere tensão do reto femoral; desvio em abdução sugere tensão do tensor da fáscia lata e do trato iliotibial.",
        cue: "Os valores de referência variam entre fontes; compare sempre com o outro lado.",
      },
      {
        title: "Diferenciar mono e biarticular",
        text: "Estenda passivamente o joelho testado. Se a coxa desce mais em direção à maca, o reto femoral contribui para a limitação; se a coxa permanece elevada independentemente do joelho, a limitação é mais dos flexores monoarticulares (iliopsoas).",
        cue: "Mantenha a pelve parada durante essa diferenciação.",
      },
      {
        title: "Retornar e comparar",
        text: "Peça que traga os dois joelhos ao peito, ajude a sentar e repita do outro lado. Registre ângulos de quadril e joelho e a posição da pelve.",
        cue: "Descreva os ângulos em vez de anotar apenas positivo ou negativo.",
      },
    ],
    interpretation: [
      {
        title: "Coxa elevada da maca",
        text: "Sugere extensibilidade reduzida dos flexores do quadril. Se a coxa não muda ao estender o joelho, o iliopsoas é o principal suspeito; se desce, o reto femoral participa.",
      },
      {
        title: "Joelho pouco flexionado ou desvio em abdução",
        text: "Flexão do joelho menor que a do outro lado sugere tensão do reto femoral. Coxa que se desvia para fora sugere tensão do tensor da fáscia lata e do trato iliotibial.",
      },
      {
        title: "Armadilhas",
        text: "A inclinação pélvica muda muito o resultado: retroversão exagerada eleva a coxa e simula encurtamento; lombar em arco deixa a coxa descer e mascara a limitação. Rigidez da cápsula anterior do quadril também limita a extensão.",
      },
      {
        title: "O que o teste não diz",
        text: "O teste estima comprimento, não diagnostica lesão nem explica sozinho a dor lombar ou do quadril. Encurtamento pode existir em pessoas sem sintomas.",
      },
    ],
    reasoning: [
      "Relacione o achado à queixa: limitação de extensão do quadril importa mais se aparece em tarefas como correr, subir escadas ou ficar em pé por muito tempo.",
      "Compare com o teste de Ely para confirmar participação do reto femoral e com o Ober para o tensor da fáscia lata e o trato iliotibial.",
      "Se a extensão está limitada com dor articular na virilha, considere rigidez capsular ou doença intra-articular, e não apenas músculo curto.",
      "Para medir e acompanhar evolução, padronize a posição da pelve e use instrumento; o critério passa/falha visual é pouco confiável.",
    ],
    caution:
      "Uma coxa elevada isolada não confirma encurtamento do iliopsoas, porque a posição da pelve e a rigidez articular alteram o resultado.",
    mistakes: [
      "Não controlar a inclinação pélvica, puxando o joelho oposto demais ou de menos.",
      "Deixar a pessoa deslizar na maca, de modo que a coxa não pende livremente.",
      "Estender o joelho e mexer na pelve ao mesmo tempo durante a diferenciação.",
      "Interpretar um ângulo isolado como anormal sem comparar com o outro lado.",
    ],
    record:
      "Exemplo fictício: Thomas modificado direito — coxa 10° acima da horizontal, sem mudança ao estender o joelho; joelho a 75° de flexão; sem desvio em abdução. Esquerdo: coxa na horizontal, joelho a 85°. Pelve mantida em neutro com joelho oposto ao peito. Sugere limitação dos flexores monoarticulares à direita.",
    related: [
      "psoas-maior",
      "iliaco",
      "reto-femoral",
      "tensor-da-fascia-lata",
      "trato-iliotibial",
      "coxofemoral",
      "ligamento-iliofemoral",
      "osso-do-quadril",
    ],
    sources: [
      "qd-vigotsky-thomas-2016",
      "qd-peeler-thomas-2008",
      "qd-reiman-quadril-2013",
    ],
    evidence: {
      text: "Em 29 universitários saudáveis, o Thomas modificado sem controle da inclinação pélvica mostrou validade pobre para medir a extensão do quadril (sensibilidade de cerca de 32% e especificidade de cerca de 57% para déficit de extensão); quando a inclinação pélvica foi considerada, a medida passou a refletir bem a extensão. A amostra é pequena e sem sintomas, portanto os números não se aplicam diretamente a pacientes.",
      source: "qd-vigotsky-thomas-2016",
    },
    review: [
      "Sei posicionar a pessoa na borda da maca e fixar a pelve com o joelho oposto ao peito.",
      "Sei diferenciar iliopsoas de reto femoral estendendo passivamente o joelho.",
      "Sei reconhecer o desvio em abdução como sinal de tensão do tensor da fáscia lata.",
      "Sei por que a inclinação pélvica precisa ser controlada e registrada.",
      "Sei que comprimento muscular reduzido não equivale a diagnóstico de lesão.",
    ],
    cases: [
      {
        id: "monoarticular",
        question:
          "Caso fictício: no Thomas modificado, a coxa direita fica elevada e não muda quando o joelho é estendido passivamente. Qual estrutura é a principal suspeita?",
        choices: [
          "Iliopsoas (flexores monoarticulares do quadril).",
          "Reto femoral apenas.",
          "Isquiotibiais.",
        ],
        correct: 0,
        explanation:
          "Se a posição do joelho não muda a coxa, a limitação é mais dos flexores que cruzam só o quadril, como o iliopsoas, ou da cápsula anterior.",
      },
      {
        id: "pelve",
        question:
          "Caso fictício: o examinador puxa o joelho oposto com força até o peito e a coxa testada sobe acima da horizontal. O que limita a interpretação?",
        choices: [
          "Nada; o teste confirma encurtamento.",
          "A retroversão pélvica exagerada pode ter elevado a coxa, simulando encurtamento.",
          "Indica lesão do lábio acetabular.",
        ],
        correct: 1,
        explanation:
          "O resultado depende da posição da pelve; padronize-a antes de concluir sobre o comprimento dos flexores.",
      },
      {
        id: "alerta",
        question:
          "Caso fictício: idoso de 80 anos caiu ontem, tem dor na virilha e não consegue apoiar o peso; o membro parece mais curto e rodado para fora. O que fazer?",
        choices: [
          "Realizar o teste de Thomas para medir o comprimento dos flexores.",
          "Alongar os flexores e reavaliar na próxima sessão.",
          "Não testar; encaminhar com urgência para avaliação médica e imagem.",
        ],
        correct: 2,
        explanation:
          "O quadro sugere fratura do colo do fêmur. Testes de comprimento muscular não têm lugar até que a fratura seja descartada.",
      },
    ],
  },
  {
    id: "ober",
    name: "Teste de Ober",
    aliases: [
      "Ober test",
      "Teste de Ober modificado",
      "Modified Ober test",
      "Teste do trato iliotibial",
    ],
    category: "quadril",
    kind: "comprimento-muscular",
    region: "Quadril · trato iliotibial e tensor da fáscia lata",
    position:
      "Paciente em decúbito lateral sobre o lado não testado, com quadril e joelho de baixo flexionados; examinador atrás da pessoa, uma mão estabilizando a crista ilíaca e a outra sustentando o membro de cima.",
    summary:
      "Com a pessoa deitada de lado, o examinador abduz e estende o quadril de cima e depois o deixa descer em adução; se a coxa não desce até a horizontal, sugere menor extensibilidade das estruturas laterais do quadril.",
    purpose:
      "Estimar a extensibilidade do complexo lateral do quadril, tradicionalmente atribuída ao tensor da fáscia lata e ao trato iliotibial. A versão original usa o joelho a 90° de flexão; a modificada mantém o joelho estendido e costuma permitir mais adução, então as duas não devem ser trocadas entre si.",
    indications: [
      "Dor lateral do quadril ou do joelho em corredores e ciclistas, quando se suspeita de tensão do complexo lateral.",
      "Avaliar assimetria de adução do quadril em pessoas com alterações de marcha ou de alinhamento do membro inferior.",
      "Acompanhar mudanças de extensibilidade com a mesma versão do teste e o mesmo instrumento.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e registre a dor inicial. A prática clínica exige formação e supervisão.",
      "Após artroplastia de quadril, a adução além da linha média pode ser restrita; siga as orientações da equipe cirúrgica.",
      "Na versão original, o joelho a 90° pode provocar dor patelofemoral ou sintomas na face anterior da coxa; nesse caso, use a versão modificada e registre.",
      "Interrompa diante de dor intensa, sintomas neurológicos ou dor lateral aguda após trauma; suspeita de fratura ou de lesão aguda exige avaliação médica.",
    ],
    steps: [
      {
        title: "Posicionar de lado",
        text: "Deite a pessoa sobre o lado não testado, com o quadril e o joelho de baixo flexionados para dar estabilidade e reduzir a lordose. Pergunte sobre a dor habitual.",
        cue: "O tronco deve ficar alinhado, sem rodar para trás.",
      },
      {
        title: "Estabilizar a pelve",
        text: "Com uma mão sobre a crista ilíaca de cima, mantenha a pelve perpendicular à maca, impedindo que ela incline lateralmente ou rode.",
        cue: 'Se a pelve inclinar durante a descida, a coxa desce "falsamente".',
      },
      {
        title: "Abduzir e estender",
        text: "Sustente o membro de cima pelo joelho e leve o quadril em abdução e leve extensão, mantendo a rotação neutra. Na versão original, o joelho fica a 90°; na modificada, estendido.",
        cue: "A extensão do quadril coloca as estruturas laterais atrás do trocanter maior.",
      },
      {
        title: "Deixar descer em adução",
        text: "Mantendo a extensão e a rotação neutra, deixe o membro descer lentamente pela gravidade em direção à maca. Observe até onde a coxa desce.",
        cue: "Não deixe o quadril flexionar nem rodar internamente durante a descida.",
      },
      {
        title: "Medir e comparar",
        text: "Registre se a coxa fica acima da horizontal, na horizontal ou abaixo dela, de preferência com inclinômetro sobre a face lateral do fêmur. Repita do outro lado com a mesma versão.",
        cue: "Anote a versão usada (original ou modificada) junto com o ângulo.",
      },
    ],
    interpretation: [
      {
        title: "Coxa permanece acima da horizontal",
        text: "Sugere menor extensibilidade do complexo lateral do quadril. A contribuição exata de cada estrutura (tensor da fáscia lata, glúteos médio e mínimo, cápsula, trato iliotibial) não é definida pelo teste.",
      },
      {
        title: "Coxa desce até a horizontal ou abaixo",
        text: "Indica adução adequada para a versão usada. Lembre que a versão modificada costuma permitir mais adução que a original.",
      },
      {
        title: "Armadilhas",
        text: "Flexão ou rotação interna do quadril durante a descida, inclinação lateral da pelve e tensão muscular por desconforto geram resultados falsos.",
      },
      {
        title: "O que o teste não diz",
        text: 'Não diagnostica síndrome do trato iliotibial nem tendinopatia glútea. O trato iliotibial é muito rígido; a mudança no teste provavelmente reflete outras estruturas laterais, o que limita conclusões sobre "alongar a banda".',
      },
    ],
    reasoning: [
      "Relacione o achado aos sintomas: dor lateral do joelho em corrida, dor lateral do quadril ao deitar sobre o lado ou ao subir escadas.",
      "Compare com o Thomas modificado: desvio da coxa em abdução também sugere tensão do tensor da fáscia lata.",
      'Na dor lateral do quadril, palpe o trocanter maior e teste o apoio unipodal; tendinopatia glútea é uma hipótese mais frequente que "banda curta".',
      "Use sempre a mesma versão e o mesmo instrumento nas reavaliações, porque os valores das duas versões diferem.",
    ],
    caution:
      "Uma coxa que não desce no Ober isolada não confirma encurtamento do trato iliotibial nem explica sozinha a dor lateral.",
    mistakes: [
      "Deixar o quadril flexionar durante a descida, o que tira a tensão das estruturas laterais.",
      "Não estabilizar a pelve, permitindo inclinação lateral que simula adução normal.",
      "Comparar resultados da versão original com os da modificada como se fossem equivalentes.",
      "Concluir síndrome do trato iliotibial apenas pelo teste.",
    ],
    record:
      "Exemplo fictício: Ober modificado direito — coxa 8° acima da horizontal (inclinômetro); esquerdo 5° abaixo da horizontal. Pelve estabilizada, sem dor. Queixa de dor lateral no joelho direito após 5 km de corrida; associar a palpação, Thomas modificado e avaliação da corrida.",
    related: [
      "trato-iliotibial",
      "tensor-da-fascia-lata",
      "gluteo-medio",
      "gluteo-minimo",
      "gluteo-maximo",
      "coxofemoral",
      "femur",
    ],
    sources: [
      "qd-reese-ober-2003",
      "qd-grimaldi-tendinopatia-2017",
      "qd-reiman-quadril-2013",
    ],
    evidence: {
      text: "Em 61 adultos jovens (média de 24 anos), a medida da adução com inclinômetro teve confiabilidade intraexaminador alta (coeficiente de correlação intraclasse de 0,90 no Ober e 0,91 no Ober modificado), mas a versão modificada permitiu significativamente mais adução. A amostra não tinha queixas, e o estudo avalia reprodutibilidade, não a capacidade de diagnosticar alguma condição.",
      source: "qd-reese-ober-2003",
    },
    review: [
      "Sei posicionar em decúbito lateral e estabilizar a pelve pela crista ilíaca.",
      "Sei abduzir e estender o quadril antes da descida e manter a rotação neutra.",
      "Sei a diferença entre o Ober original e o modificado e por que não trocá-los.",
      "Sei medir a adução com inclinômetro e comparar os lados.",
      "Sei que o teste não diagnostica síndrome do trato iliotibial.",
    ],
    cases: [
      {
        id: "flexao",
        question:
          "Caso fictício: durante a descida no Ober, o quadril da pessoa flexiona e a coxa chega abaixo da horizontal. Como registrar?",
        choices: [
          "Ober negativo; extensibilidade normal.",
          "Execução inválida; repetir mantendo a extensão do quadril.",
          "Ober positivo; trato iliotibial encurtado.",
        ],
        correct: 1,
        explanation:
          "A flexão do quadril reduz a tensão das estruturas laterais e permite uma descida que não reflete a extensibilidade real.",
      },
      {
        id: "versoes",
        question:
          "Caso fictício: na avaliação inicial foi usado o Ober original; na reavaliação, o modificado, e a coxa desceu 10° a mais. O que concluir?",
        choices: [
          "A diferença pode refletir a troca de versão, não uma melhora real.",
          "A extensibilidade melhorou 10°.",
          "O tratamento piorou a tensão lateral.",
        ],
        correct: 0,
        explanation:
          "A versão modificada costuma permitir mais adução. Para acompanhar evolução, use sempre a mesma versão e o mesmo instrumento.",
      },
      {
        id: "dor-lateral",
        question:
          "Caso fictício: mulher de 55 anos com dor lateral do quadril ao deitar sobre o lado e ao subir escadas; Ober com coxa levemente acima da horizontal. Qual hipótese investigar com prioridade?",
        choices: [
          "Encurtamento do trato iliotibial como causa única.",
          "Lesão do ligamento cruzado anterior.",
          "Tendinopatia glútea, com palpação do trocanter e teste de apoio unipodal.",
        ],
        correct: 2,
        explanation:
          "O quadro é típico de dor lateral relacionada aos tendões glúteos. O Ober descreve extensibilidade, mas não explica sozinho a dor.",
      },
    ],
  },
  {
    id: "ely",
    name: "Teste de Ely",
    aliases: [
      "Ely test",
      "Teste de Ely-Duncan",
      "Flexão do joelho em prono",
      "Prone knee bend (comprimento do reto femoral)",
    ],
    category: "quadril",
    kind: "comprimento-muscular",
    region: "Quadril e coxa · reto femoral",
    position:
      "Paciente em decúbito ventral, com quadris em extensão neutra; examinador ao lado testado, uma mão estabilizando a pelve sobre o sacro e a outra flexionando o joelho pelo tornozelo.",
    summary:
      "Em decúbito ventral, o joelho é flexionado passivamente em direção ao glúteo; se o quadril do mesmo lado flexiona (o glúteo sobe) ou a flexão do joelho fica limitada, sugere menor extensibilidade do reto femoral.",
    purpose:
      "Estimar a extensibilidade do reto femoral, que cruza o quadril e o joelho. Com o quadril estendido, flexionar o joelho alonga o músculo nas duas articulações; a compensação típica é a flexão do quadril e a anteversão da pelve.",
    indications: [
      "Dor anterior da coxa ou do joelho em pessoas ativas, quando se suspeita de tensão do reto femoral.",
      "Complementar o teste de Thomas na diferenciação entre iliopsoas e reto femoral.",
      "Acompanhar a amplitude de flexão do joelho em prono com a mesma estabilização pélvica.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e registre a dor inicial. A prática clínica exige formação e supervisão.",
      "Lesão muscular aguda do quadríceps, cirurgia recente de joelho ou dor patelofemoral importante exigem adaptar ou adiar o teste.",
      "Se a pessoa não tolera o decúbito ventral ou a extensão lombar aumenta a dor, use outra posição (como o Thomas modificado).",
      "Formigamento ou dor em queimação na face anterior da coxa sugere irritação do nervo femoral; interrompa e avalie como teste neurodinâmico, com exame neurológico.",
    ],
    steps: [
      {
        title: "Posicionar em prono",
        text: "Deite a pessoa de barriga para baixo, com os quadris em extensão neutra e as pernas alinhadas. Pergunte sobre a dor habitual na coxa, no joelho ou na lombar.",
        cue: "Um travesseiro sob o abdome pode ser usado se a lombar estiver desconfortável, mas registre.",
      },
      {
        title: "Estabilizar a pelve",
        text: "Coloque uma mão sobre o sacro (ou use uma faixa) para impedir que a pelve se incline anteriormente e que o glúteo suba durante o teste.",
        cue: "Estabilização é o que torna o teste reprodutível.",
      },
      {
        title: "Flexionar o joelho",
        text: "Segure o tornozelo e flexione passivamente o joelho, devagar, levando o calcanhar em direção ao glúteo do mesmo lado.",
        cue: "Mova devagar; não empurre além da resistência firme.",
      },
      {
        title: "Observar a compensação",
        text: "Observe o momento em que o quadril começa a flexionar (o glúteo sobe da maca) ou em que a resistência impede continuar. Meça o ângulo de flexão do joelho nesse ponto.",
        cue: "Glúteo subindo antes de o calcanhar se aproximar do glúteo sugere tensão do reto femoral.",
      },
      {
        title: "Retornar e comparar",
        text: "Estenda o joelho lentamente e repita do outro lado. Registre o ângulo, a resposta da pelve e o local de qualquer sintoma.",
        cue: "Compare os lados e use goniômetro para acompanhar a evolução.",
      },
    ],
    interpretation: [
      {
        title: "Flexão do quadril ou limitação do joelho",
        text: "Glúteo que sobe da maca ou flexão do joelho menor que a do outro lado sugere menor extensibilidade do reto femoral.",
      },
      {
        title: "Calcanhar se aproxima do glúteo sem compensação",
        text: "Sugere extensibilidade adequada do reto femoral nessa posição. Ainda assim, compare os lados e considere a anatomia individual (por exemplo, volume da panturrilha e da coxa).",
      },
      {
        title: "Armadilhas",
        text: "Sem estabilização, a pelve se inclina e o quadril flexiona de forma sutil. Dor no joelho pode limitar a flexão sem relação com o comprimento muscular.",
      },
      {
        title: "O que o teste não diz",
        text: "Não diagnostica lesão do quadríceps nem tendinopatia. Sintomas neurais na coxa anterior mudam a pergunta para o nervo femoral, que exige outra interpretação.",
      },
    ],
    reasoning: [
      "Combine com o Thomas modificado: limitação nos dois testes reforça a participação do reto femoral.",
      "Diferencie dor de alongamento de dor no joelho (patelofemoral ou articular) e de sintomas neurais na face anterior da coxa.",
      "Na paralisia cerebral, a variante de Duncan-Ely com velocidade avalia espasticidade, que é outra pergunta clínica; não misture as interpretações.",
      "Considere a mudança mínima detectável ao acompanhar a evolução: diferenças pequenas entre sessões podem ser erro de medida.",
    ],
    caution:
      "Um Ely com o glúteo subindo isolado não confirma lesão do reto femoral nem explica sozinho a dor anterior no joelho.",
    mistakes: [
      "Não estabilizar a pelve, deixando a flexão do quadril passar despercebida.",
      "Empurrar o calcanhar com força contra a resistência ou de forma rápida.",
      "Confundir sintomas neurais na coxa anterior com tensão muscular.",
      "Comparar medidas feitas com e sem estabilização da pelve.",
    ],
    record:
      "Exemplo fictício: Ely direito com pelve estabilizada — quadril começa a flexionar com o joelho a 110° de flexão (esquerdo 130°); tensão na face anterior da coxa, sem dor no joelho e sem parestesia. Associar ao Thomas modificado.",
    related: [
      "reto-femoral",
      "vasto-intermedio",
      "psoas-maior",
      "iliaco",
      "coxofemoral",
      "femur",
      "nervo-femoral",
    ],
    sources: [
      "qd-olivencia-ely-2020",
      "qd-peeler-thomas-2008",
      "qd-reiman-quadril-2013",
    ],
    evidence: {
      text: "Em 71 adultos sem sintomas (média de 25 anos), o teste de Ely com estabilização da pelve por faixa teve confiabilidade alta intra e entre examinadores (coeficientes de correlação intraclasse de 0,90 e 0,91), e uma mudança de pelo menos 8° foi necessária para superar o erro de medida. Os resultados dependem da estabilização usada e não indicam capacidade diagnóstica em pacientes.",
      source: "qd-olivencia-ely-2020",
    },
    review: [
      "Sei posicionar em prono e estabilizar a pelve sobre o sacro.",
      "Sei reconhecer a flexão do quadril como compensação do reto femoral curto.",
      "Sei diferenciar tensão muscular de dor no joelho e de sintomas do nervo femoral.",
      "Sei usar o Ely junto com o Thomas modificado.",
      "Sei considerar a mudança mínima detectável ao reavaliar.",
    ],
    cases: [
      {
        id: "compensacao",
        question:
          "Caso fictício: no Ely direito, o glúteo sobe da maca quando o joelho está a 100° de flexão; à esquerda, o calcanhar quase toca o glúteo. O que registrar?",
        choices: [
          "Lesão do quadríceps direito confirmada.",
          "Sem diferença relevante entre os lados.",
          "Sugere menor extensibilidade do reto femoral direito; integrar ao Thomas modificado.",
        ],
        correct: 2,
        explanation:
          "A compensação do quadril antes do fim da flexão do joelho indica tensão do reto femoral; não confirma lesão.",
      },
      {
        id: "neural",
        question:
          "Caso fictício: durante o Ely, surge queimação e formigamento na face anterior da coxa até o joelho, parecida com a queixa. Qual é a interpretação mais prudente?",
        choices: [
          "Considerar sensibilidade do nervo femoral e completar com exame neurológico.",
          "É só alongamento do reto femoral.",
          "Forçar mais a flexão para confirmar.",
        ],
        correct: 0,
        explanation:
          "Flexão do joelho em prono também tensiona o nervo femoral. Sintomas neurais pedem outra linha de raciocínio e exame neurológico.",
      },
      {
        id: "reavaliacao",
        question:
          "Caso fictício: após duas semanas, a flexão do joelho no Ely passou de 112° para 116° com a mesma técnica. Como interpretar?",
        choices: [
          "Ganho real e importante de comprimento.",
          "A diferença pode estar dentro do erro de medida; não concluir melhora só por ela.",
          "Piora da extensibilidade.",
        ],
        correct: 1,
        explanation:
          "Pequenas mudanças podem refletir variação de medida. Valores como a mudança mínima detectável ajudam a decidir se houve mudança real.",
      },
    ],
  },
  {
    id: "trendelenburg",
    name: "Teste de Trendelenburg",
    aliases: [
      "Sinal de Trendelenburg",
      "Trendelenburg sign",
      "Teste de apoio unipodal",
      "Single-leg stance test",
    ],
    category: "quadril",
    kind: "funcional",
    region: "Quadril · abdutores (glúteos médio e mínimo)",
    position:
      "Paciente em pé, de frente para uma parede ou maca para apoio leve se necessário; examinador atrás, com a pelve e as cristas ilíacas visíveis.",
    summary:
      "A pessoa fica em apoio unipodal sobre o lado testado; se a pelve cai do lado oposto (o lado sem apoio), sugere que os abdutores do quadril de apoio não estabilizam a pelve.",
    purpose:
      "Avaliar a capacidade dos abdutores do quadril de apoio, principalmente glúteo médio e glúteo mínimo, de manter a pelve nivelada no apoio unipodal. Também permite observar se a dor lateral do quadril aparece durante o apoio sustentado.",
    indications: [
      "Claudicação, marcha com queda pélvica ou inclinação do tronco para o lado de apoio.",
      "Dor lateral do quadril, suspeita de tendinopatia ou ruptura dos glúteos médio ou mínimo.",
      "Fraqueza dos abdutores após cirurgia do quadril, lesão do nervo glúteo superior ou em condições como artrose e displasia do quadril.",
    ],
    safety: [
      "Explique o teste, obtenha consentimento e registre a dor inicial. A prática clínica exige formação e supervisão.",
      "Há risco de queda: fique próximo, permita apoio leve com a ponta dos dedos e não teste quem não consegue ficar em pé com segurança.",
      "Restrições de carga após cirurgia ou fratura precisam ser respeitadas; não faça apoio unipodal se a carga não estiver liberada.",
      "Criança que manca ou recusa apoiar o peso, com ou sem febre, ou fraqueza súbita com dor lombar, exige avaliação médica; o teste não substitui esse encaminhamento.",
    ],
    steps: [
      {
        title: "Preparar",
        text: "Com a pessoa em pé, descalça e com o peso distribuído, identifique as cristas ilíacas ou as espinhas ilíacas posterossuperiores para observar o nível da pelve.",
        cue: "Observe a pelve por trás; marcar as referências facilita.",
      },
      {
        title: "Apoiar em uma perna",
        text: "Peça que transfira o peso para o lado testado e flexione o joelho oposto, tirando o pé do chão, sem encostar uma perna na outra.",
        cue: "O tronco deve ficar ereto; apoio leve com a ponta dos dedos é aceitável.",
      },
      {
        title: "Sustentar",
        text: "Peça que mantenha o apoio por até 30 segundos. Pergunte se surge dor e onde, especialmente na face lateral do quadril de apoio.",
        cue: "Registre o tempo até a dor ou até a perda de controle.",
      },
      {
        title: "Observar a pelve e o tronco",
        text: "Pelve nivelada ou levemente elevada do lado sem apoio é a resposta esperada. Queda da pelve do lado sem apoio, ou inclinação do tronco para o lado de apoio para compensar, sugere disfunção dos abdutores do lado de apoio.",
        cue: "O lado testado é o de apoio, mesmo que a queda apareça do outro lado.",
      },
      {
        title: "Comparar",
        text: "Retorne ao apoio bipodal e repita do outro lado. Registre queda pélvica, compensação do tronco, tempo sustentado e dor.",
        cue: 'Descreva o que viu, além de "positivo" ou "negativo".',
      },
    ],
    interpretation: [
      {
        title: "Queda da pelve do lado sem apoio",
        text: "Sugere que os abdutores do quadril de apoio (glúteos médio e mínimo) não estabilizam a pelve, por fraqueza, dor, lesão tendínea, alteração do nervo glúteo superior ou alteração mecânica do quadril.",
      },
      {
        title: "Tronco inclinado para o lado de apoio",
        text: "É uma compensação que leva o centro de massa sobre o quadril e diminui a demanda dos abdutores. Pode esconder a queda pélvica; registre como Trendelenburg compensado.",
      },
      {
        title: "Dor lateral durante o apoio",
        text: "Dor no quadril de apoio nos primeiros 30 segundos aumenta a suspeita de tendinopatia glútea, mesmo sem queda pélvica.",
      },
      {
        title: "O que o teste não diz",
        text: "O teste não identifica a causa da disfunção. Equilíbrio ruim, dor no pé ou no joelho e medo de cair também alteram a resposta.",
      },
    ],
    reasoning: [
      "Relacione com a marcha: queda pélvica ou inclinação do tronco na fase de apoio confirma a relevância funcional do achado.",
      "Na dor lateral, combine palpação do trocanter maior, dor no apoio unipodal sustentado e testes de carga dos tendões glúteos.",
      "Teste a força dos abdutores e compare com o nervo glúteo superior quando houver história de cirurgia, injeção ou trauma na região glútea.",
      "Em crianças, Trendelenburg com claudicação levanta hipóteses como displasia do desenvolvimento do quadril, doença de Legg-Calvé-Perthes ou epifisiólise, que exigem avaliação médica.",
      "Considere artrose do quadril, discrepância de comprimento dos membros e dor como causas de queda pélvica, não só fraqueza muscular.",
    ],
    caution:
      "Um Trendelenburg positivo isolado não confirma ruptura do glúteo médio nem identifica a causa da disfunção dos abdutores.",
    mistakes: [
      "Observar o lado errado: a queda aparece no lado sem apoio, mas o déficit é do lado de apoio.",
      "Ignorar a inclinação do tronco, que compensa e esconde a queda pélvica.",
      "Permitir que a pessoa se apoie com força na parede ou encoste uma perna na outra.",
      "Testar sem proteção contra quedas em pessoas com equilíbrio comprometido.",
    ],
    record:
      "Exemplo fictício: Trendelenburg direito (apoio à direita) — queda pélvica à esquerda aos 10 s, com dor lateral no quadril direito 4/10 aos 15 s; esquerdo com pelve nivelada por 30 s, sem dor. Marcha com leve inclinação do tronco para a direita. Associar a palpação e força dos abdutores.",
    related: [
      "gluteo-medio",
      "gluteo-minimo",
      "tensor-da-fascia-lata",
      "nervo-gluteo-superior",
      "coxofemoral",
      "osso-do-quadril",
      "femur",
      "bolsas-do-quadril",
    ],
    sources: [
      "qd-bird-trocanter-2001",
      "qd-grimaldi-tendinopatia-2017",
      "qd-statpearls-trendelenburg",
    ],
    evidence: {
      text: "Em 24 mulheres com síndrome dolorosa do trocanter maior avaliadas por ressonância, o sinal de Trendelenburg teve sensibilidade de 72,7% e especificidade de 76,9% para ruptura do glúteo médio, com concordância intraexaminador moderada a boa (kappa 0,68). A amostra é pequena e específica (mulheres de meia-idade com dor lateral), então os valores não se aplicam a outras populações.",
      source: "qd-bird-trocanter-2001",
    },
    review: [
      "Sei qual lado está sendo testado (o de apoio) e onde observar a queda.",
      "Sei reconhecer a compensação do tronco e registrá-la.",
      "Sei usar o apoio de 30 segundos para observar dor lateral.",
      "Sei listar causas de queda pélvica além de fraqueza muscular.",
      "Sei garantir a segurança contra quedas durante o teste.",
    ],
    cases: [
      {
        id: "lado",
        question:
          "Caso fictício: em apoio sobre a perna esquerda, a pelve cai do lado direito. Quais abdutores estão em questão?",
        choices: [
          "Os do quadril direito.",
          "Os adutores do quadril esquerdo.",
          "Os do quadril esquerdo, que é o lado de apoio.",
        ],
        correct: 2,
        explanation:
          "Os abdutores do quadril de apoio mantêm a pelve nivelada. A queda aparece do lado sem apoio.",
      },
      {
        id: "dor-lateral",
        question:
          "Caso fictício: mulher de 58 anos com dor lateral no quadril direito; em apoio unipodal à direita, a pelve fica nivelada, mas a dor habitual aparece aos 20 segundos. Como interpretar?",
        choices: [
          "A dor no apoio sustentado aumenta a suspeita de tendinopatia glútea; integrar à palpação e a outros testes.",
          "Como a pelve não caiu, o teste exclui problema nos glúteos.",
          "Confirma ruptura completa do glúteo médio.",
        ],
        correct: 0,
        explanation:
          "A dor lateral no apoio unipodal é informativa mesmo sem queda pélvica; o teste não confirma ruptura.",
      },
      {
        id: "crianca",
        question:
          "Caso fictício: criança de 6 anos começou a mancar há dois dias, tem febre e evita apoiar a perna esquerda. Qual a prioridade?",
        choices: [
          "Fazer o Trendelenburg para classificar a fraqueza.",
          "Encaminhar com urgência para avaliação médica, sem testes de carga.",
          "Orientar fortalecimento dos glúteos e reavaliar em uma semana.",
        ],
        correct: 1,
        explanation:
          "Febre, claudicação e recusa em apoiar o peso podem indicar artrite séptica do quadril, uma emergência ortopédica.",
      },
    ],
  },
  {
    id: "log-roll",
    name: "Teste do rolamento (log roll)",
    aliases: [
      "Log roll test",
      "Teste do rolamento passivo",
      "Rolamento da perna",
      "Teste de rotação passiva em extensão",
    ],
    category: "quadril",
    kind: "provocacao",
    region: "Quadril · articulação coxofemoral",
    position:
      "Paciente em decúbito dorsal com os membros inferiores estendidos e relaxados; examinador ao lado testado, com as mãos sobre a coxa e a perna.",
    summary:
      "Com a perna estendida e relaxada, o examinador rola passivamente todo o membro para dentro e para fora, girando a cabeça do fêmur no acetábulo com pouca tensão sobre os músculos ao redor.",
    purpose:
      "Avaliar a irritabilidade intra-articular do quadril com um movimento de baixa carga sobre as partes moles. Dor na virilha com o rolamento aponta para a própria articulação; a comparação da amplitude de rotação também pode mostrar rigidez ou maior mobilidade.",
    indications: [
      "Dor no quadril ou na virilha, quando se quer saber se a articulação está irritável antes de manobras mais provocativas.",
      "Suspeita de condição intra-articular (sinovite, artrose, lesão labral) que precisa ser diferenciada de dor muscular ou referida.",
      "Primeiro teste em pessoas com dor intensa, por ser suave e passivo.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e registre a dor inicial. A prática clínica exige formação e supervisão.",
      "Idoso com dor na virilha após queda, que não consegue apoiar o peso, com membro encurtado e rodado externamente: suspeite de fratura do colo do fêmur, não teste e encaminhe para imagem.",
      "Criança ou adolescente com febre, claudicação e recusa em apoiar o peso pode ter artrite séptica do quadril, emergência ortopédica: encaminhe com urgência.",
      "Adolescente com dor no quadril, na coxa ou no joelho, claudicação e perda de rotação interna pode ter epifisiólise proximal do fêmur: evite manobras forçadas e encaminhe com urgência.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa em decúbito dorsal, membros estendidos e relaxados, observe a posição de repouso dos pés. Pergunte onde é a dor habitual.",
        cue: "Um membro em repouso muito rodado para fora pode ser um sinal importante.",
      },
      {
        title: "Apoiar o membro",
        text: "Coloque as mãos espalmadas sobre a coxa e a perna do lado testado, sem segurar com força, para conseguir rolar o membro inteiro.",
        cue: "As mãos rolam o membro; não levante a perna da maca.",
      },
      {
        title: "Rolar para dentro e para fora",
        text: "Role suavemente o membro em rotação interna e depois em rotação externa, observando a patela e o pé girarem juntos. Repita algumas vezes, de forma lenta.",
        cue: "Movimento pequeno e suave; o objetivo não é a amplitude máxima.",
      },
      {
        title: "Identificar a resposta",
        text: "Pergunte se surge dor e onde. Observe defesa muscular, limitação da rotação ou rotação externa claramente maior que a do outro lado.",
        cue: "Dor na virilha é o achado mais relevante.",
      },
      {
        title: "Comparar",
        text: "Repita do outro lado e registre dor, local e amplitude percebida de cada direção.",
        cue: "Compare a rotação externa: aumento importante pode sugerir maior frouxidão capsular.",
      },
    ],
    interpretation: [
      {
        title: "Dor na virilha com o rolamento",
        text: "Apoia irritabilidade intra-articular, porque o movimento gira a cabeça femoral no acetábulo com pouca carga sobre músculos e tendões. Não identifica a condição específica.",
      },
      {
        title: "Rotação limitada ou com defesa muscular",
        text: "Pode indicar sinovite, artrose ou articulação muito irritável. Defesa intensa com dor desproporcional exige considerar fratura, infecção ou epifisiólise.",
      },
      {
        title: "Negativo",
        text: "Um rolamento sem dor não exclui problema intra-articular, especialmente em quadros leves; testes mais provocativos (como o FADIR) podem ser necessários.",
      },
      {
        title: "O que o teste não diz",
        text: "O teste não diagnostica lesão labral, impacto ou artrose. Em sinais de alerta, ele não deve atrasar o encaminhamento.",
      },
    ],
    reasoning: [
      "Use o rolamento como primeira etapa: se já provoca a dor, a articulação está irritável, e manobras mais vigorosas podem ser desnecessárias ou inadequadas.",
      "Combine com FADIR, FABER e amplitude de rotação interna para estimar o envolvimento intra-articular.",
      "Considere a idade e o contexto: em idosos após queda, pense em fratura; em crianças com febre, em artrite séptica; em adolescentes com dor no joelho, em epifisiólise.",
      "Dor lombar ou glútea com sintomas na perna sugere outra fonte; o exame da coluna e o neurológico ajudam na diferenciação.",
    ],
    caution:
      "Um log roll positivo isolado não identifica qual condição intra-articular está presente; apenas sugere que a própria articulação é sensível ao movimento.",
    mistakes: [
      "Levantar a perna ou flexionar o quadril, transformando o teste em outra manobra.",
      "Rodar com força até o fim da amplitude em vez de usar movimentos suaves.",
      "Testar uma pessoa com suspeita de fratura ou infecção em vez de encaminhar.",
      "Não comparar com o outro lado, perdendo diferenças de amplitude.",
    ],
    record:
      "Exemplo fictício: Log roll esquerdo — dor habitual na virilha 4/10 na rotação interna, rotação interna discretamente limitada; direito sem dor. Sem sinais de alerta na história (sem febre, trauma ou perda de peso). Associar a FADIR, FABER e amplitude medida.",
    related: [
      "coxofemoral",
      "femur",
      "labio-acetabular",
      "ligamento-iliofemoral",
      "ligamento-da-cabeca-do-femur",
      "osso-do-quadril",
    ],
    sources: [
      "qd-martin-confiabilidade-2008",
      "qd-statpearls-epifisiolise",
      "qd-statpearls-artrite-septica",
      "qd-reiman-quadril-2013",
    ],
    evidence: {
      text: "Em 70 pessoas com dor musculoesquelética no quadril (com artrose, lesão labral, impacto e outras condições) avaliadas por um cirurgião e um fisioterapeuta, a concordância entre examinadores para o log roll foi moderada (kappa 0,61). Não há estudos de boa qualidade com sensibilidade e especificidade do teste; por isso, ele deve ser usado como indicador de irritabilidade, não como teste diagnóstico.",
      source: "qd-martin-confiabilidade-2008",
    },
    review: [
      "Sei rolar o membro estendido de forma suave, sem levantar a perna.",
      "Sei por que a dor com o rolamento sugere origem intra-articular.",
      "Sei reconhecer sinais de fratura do colo do fêmur e não testar nesses casos.",
      "Sei suspeitar de artrite séptica e de epifisiólise e encaminhar com urgência.",
      "Sei combinar o rolamento com FADIR, FABER e amplitude de rotação.",
    ],
    cases: [
      {
        id: "fratura",
        question:
          "Caso fictício: senhora de 82 anos caiu em casa, tem dor na virilha direita, não consegue apoiar o peso e o pé direito repousa rodado para fora. O que fazer?",
        choices: [
          "Não realizar o log roll e encaminhar com urgência para avaliação médica e imagem.",
          "Fazer o log roll para confirmar se a dor é articular.",
          "Orientar caminhar com bengala e reavaliar em uma semana.",
        ],
        correct: 0,
        explanation:
          "O quadro sugere fratura do colo do fêmur. Testes ortopédicos não devem atrasar o encaminhamento.",
      },
      {
        id: "irritavel",
        question:
          "Caso fictício: adulto de 45 anos sem sinais de alerta; o log roll esquerdo reproduz a dor habitual na virilha. Qual interpretação é mais adequada?",
        choices: [
          "Confirma lesão labral.",
          "Exclui artrose do quadril.",
          "Sugere irritabilidade intra-articular; dosar testes mais provocativos e integrar ao exame.",
        ],
        correct: 2,
        explanation:
          "O rolamento indica que a articulação é sensível, mas não diz qual a condição. Manobras mais vigorosas devem respeitar essa irritabilidade.",
      },
      {
        id: "epifisiolise",
        question:
          "Caso fictício: adolescente de 12 anos com dor no joelho esquerdo e claudicação há um mês; o rolamento do quadril esquerdo mostra rotação interna muito limitada e dolorosa. Qual hipótese não pode ser esquecida?",
        choices: [
          "Tendinite patelar simples.",
          "Epifisiólise proximal do fêmur, com encaminhamento urgente.",
          "Encurtamento do trato iliotibial.",
        ],
        correct: 1,
        explanation:
          "A epifisiólise pode se apresentar como dor no joelho ou na coxa. O atraso no diagnóstico aumenta o risco de complicações.",
      },
    ],
  },
];
