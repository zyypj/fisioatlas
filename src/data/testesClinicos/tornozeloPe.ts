import type { ClinicalTest } from "../clinicalTests";

export const tornozeloPeSources: {
  id: string;
  name: string;
  url: string;
  note: string;
}[] = [
  {
    id: "tp-vandijk-exame-tardio",
    name: "van Dijk et al. — Exame físico tardio na entorse de tornozelo (1996)",
    url: "https://pubmed.ncbi.nlm.nih.gov/8951015/",
    note: "Em 160 pessoas após entorse em inversão, o exame físico feito cerca de 5 dias após o trauma foi mais acurado que o exame nas primeiras 48 horas para detectar lesão ligamentar.",
  },
  {
    id: "tp-vuurberg-diretriz",
    name: "Vuurberg et al. — Diretriz baseada em evidências para entorse de tornozelo (2018)",
    url: "https://pubmed.ncbi.nlm.nih.gov/29514819/",
    note: "Atualização de diretriz que recomenda o exame físico tardio (4–5 dias após o trauma) para avaliar a gravidade da lesão ligamentar e prioriza reabilitação baseada em exercícios.",
  },
  {
    id: "tp-jospt-entorse-lateral",
    name: "Martin et al. — Diretriz JOSPT para entorse ligamentar lateral do tornozelo (2021)",
    url: "https://pubmed.ncbi.nlm.nih.gov/33789434/",
    note: "Diretriz de prática clínica da fisioterapia para entorse lateral aguda e instabilidade crônica do tornozelo, incluindo exame e classificação.",
  },
  {
    id: "tp-statpearls-entorse",
    name: "Bergman, Li e Shuman — Entorse aguda de tornozelo, StatPearls (2025)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK459212/",
    note: "Revisão que descreve o ligamento talofibular anterior como o mais lesado, o calcaneofibular nas lesões mais graves e as entorses sindesmóticas e mediais como menos frequentes e mais incapacitantes.",
  },
  {
    id: "tp-ottawa-validacao",
    name: "Stiell et al. — Refinamento e validação das regras de Ottawa para tornozelo (1993)",
    url: "https://pubmed.ncbi.nlm.nih.gov/8433468/",
    note: "Estudo prospectivo em adultos de pronto-socorro que validou as regras de Ottawa para as zonas maleolar e do mediopé, com sensibilidade de 100% para fraturas na amostra.",
  },
  {
    id: "tp-ottawa-revisao",
    name: "Bachmann et al. — Acurácia das regras de Ottawa para tornozelo e mediopé: revisão sistemática (2003)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC149439/",
    note: "Revisão com 27 estudos (15 581 pacientes) que sustenta as regras de Ottawa como ferramenta para excluir fratura de tornozelo e mediopé, com sensibilidade próxima de 100% e especificidade modesta.",
  },
  {
    id: "tp-sindesmose-sman",
    name: "Sman et al. — Acurácia de testes clínicos para lesão da sindesmose (2015)",
    url: "https://pubmed.ncbi.nlm.nih.gov/24255766/",
    note: "Estudo com 87 pessoas até 2 semanas após entorse, com ressonância como referência, comparando squeeze test, estresse em dorsiflexão-rotação externa, lunge com compressão e palpação.",
  },
  {
    id: "tp-sindesmose-meta",
    name: "Netterström-Wedin e Bleakley — Testes clínicos para lesão da sindesmose: revisão com metanálise (2021)",
    url: "https://pubmed.ncbi.nlm.nih.gov/33774464/",
    note: "Metanálise (6 estudos, 512 participantes) que conclui que nenhum teste isolado é ao mesmo tempo muito sensível e muito específico e propõe combinar palpação e lunge (sensíveis) com squeeze (específico).",
  },
  {
    id: "tp-maffulli-aquiles",
    name: "Maffulli — Diagnóstico clínico da ruptura subcutânea do tendão do calcâneo (1998)",
    url: "https://pubmed.ncbi.nlm.nih.gov/9548122/",
    note: "Estudo prospectivo que comparou palpação do defeito, compressão da panturrilha (Thompson/Simmonds), Matles, Copeland e O'Brien na ruptura do tendão do calcâneo.",
  },
  {
    id: "tp-statpearls-aquiles",
    name: "Shamrock, Dreyer e Varacallo — Ruptura do tendão do calcâneo, StatPearls (2023)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK430844/",
    note: "Revisão que descreve a apresentação típica (estalo, sensação de chute na perna), fatores de risco e o fato de 20–25% das rupturas serem inicialmente confundidas com entorse.",
  },
  {
    id: "tp-windlass-degarceau",
    name: "De Garceau et al. — Teste de Windlass e diagnóstico de fasciíte plantar (2003)",
    url: "https://pubmed.ncbi.nlm.nih.gov/12793489/",
    note: "Comparou o teste de Windlass com e sem carga em pessoas com fasciíte plantar, com outras dores no pé e controles, mostrando alta especificidade e baixa sensibilidade.",
  },
  {
    id: "tp-statpearls-fasciite",
    name: "Buchanan, Sina e Kushner — Fasciíte plantar, StatPearls (2024)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK431073/",
    note: "Revisão sobre a fasciopatia plantar como irritação degenerativa na origem da fáscia no tubérculo medial do calcâneo, multifatorial e associada à sobrecarga.",
  },
  {
    id: "tp-lunge-revisao",
    name: "Powden, Hoch e Hoch — Confiabilidade do teste de lunge com carga: revisão sistemática (2015)",
    url: "https://pubmed.ncbi.nlm.nih.gov/25704110/",
    note: "Revisão de 12 estudos que encontrou boa confiabilidade intra e interexaminador do lunge com carga e estimou a mudança mínima detectável em graus e centímetros.",
  },
  {
    id: "tp-lunge-bennell",
    name: "Bennell et al. — Confiabilidade do lunge com carga para dorsiflexão (1998)",
    url: "https://pubmed.ncbi.nlm.nih.gov/11676731/",
    note: "Estudo em 13 adultos saudáveis que mediu o lunge pela distância hálux–parede e pelo ângulo da tíbia com inclinômetro, usando a média de três tentativas.",
  },
];

const OTTAWA =
  "Aplique as regras de Ottawa antes de estressar o tornozelo após trauma: dor na zona maleolar com dor à palpação da borda posterior ou da ponta de um dos maléolos, dor no mediopé com dor à palpação da base do 5º metatarsal ou do navicular, ou incapacidade de dar quatro passos logo após a lesão e na avaliação indicam encaminhamento para radiografia antes do teste.";

export const tornozeloPeTests: ClinicalTest[] = [
  {
    id: "gaveta-anterior-tornozelo",
    name: "Teste da gaveta anterior do tornozelo",
    aliases: [
      "Anterior Drawer Test (ankle)",
      "Gaveta anterior talocrural",
      "ADT",
    ],
    category: "tornozelo",
    kind: "ligamentar",
    region: "Tornozelo · ligamento talofibular anterior",
    position:
      "Paciente sentado ou em decúbito dorsal com o joelho fletido e o tornozelo relaxado em leve flexão plantar; examinador estabiliza a tíbia distal com uma mão e segura o calcâneo por trás com a outra.",
    summary:
      "Translação anterior do tálus sob a tíbia para investigar a integridade do ligamento talofibular anterior após entorse em inversão.",
    purpose:
      "Avaliar se há aumento da translação anterior do tálus e perda de um ponto final firme em comparação ao lado não lesado. O ligamento talofibular anterior é o mais lesado na entorse lateral, e o teste ajuda a estimar a gravidade da lesão. É mais informativo quando feito alguns dias após o trauma, com menos dor e edema.",
    indications: [
      "Entorse em inversão com dor e edema anterolateral, depois de descartada a necessidade de radiografia.",
      "Reavaliação do tornozelo 4–5 dias após a entorse para estimar a gravidade da lesão ligamentar lateral.",
      "Queixa de falseio recorrente ou suspeita de instabilidade crônica do tornozelo.",
    ],
    safety: [
      "Conteúdo educativo: explique a manobra, obtenha consentimento e pratique com formação e supervisão. O teste não substitui avaliação médica quando indicada.",
      OTTAWA,
      "Logo após o trauma, dor intensa, edema e defesa muscular tornam o teste pouco confiável e desconfortável; prefira repetir o exame após alguns dias.",
      "Deformidade, alteração de pulso ou de sensibilidade no pé, pele tensa com bolhas ou dor desproporcional exigem encaminhamento imediato, sem testes de estresse.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa sentada na borda da maca ou deitada com o joelho fletido, deixe o tornozelo relaxado em cerca de 10–20° de flexão plantar. Pergunte onde dói e examine primeiro o lado não lesado para ter referência.",
        cue: "Joelho fletido relaxa o gastrocnêmio; a leve flexão plantar coloca o ligamento talofibular anterior em evidência.",
      },
      {
        title: "Estabilizar a tíbia",
        text: "Apoie uma mão na face anterior da tíbia distal, logo acima da articulação, mantendo a perna parada sobre a maca ou contra seu corpo.",
        cue: "Sem estabilização, a perna inteira se desloca e o movimento do tálus fica mascarado.",
      },
      {
        title: "Tracionar o calcâneo",
        text: "Com a outra mão envolvendo o calcâneo por trás, puxe o pé para a frente de forma suave e progressiva, sem rodar nem inverter o tornozelo intencionalmente.",
        cue: "Movimento curto e firme; uma depressão na pele anterolateral durante a tração pode acompanhar a frouxidão.",
      },
      {
        title: "Sentir o ponto final",
        text: "Observe a quantidade de deslocamento anterior do tálus e a qualidade do ponto final: firme e definido, ou macio e sem parada clara. Pergunte se reproduziu a dor da entorse.",
        cue: "A resposta deve ser comparada ao outro lado, não a um valor fixo.",
      },
      {
        title: "Comparar e registrar",
        text: "Repita no lado contralateral com a mesma técnica e registre diferença de translação, ponto final, dor e o tempo desde a lesão.",
        cue: "Anote o dia pós-trauma: um teste no primeiro dia tem outro valor que um teste no quinto.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo de lesão do talofibular anterior",
        text: "Translação anterior maior que a do lado oposto, com ponto final macio, sugere ruptura do ligamento talofibular anterior. Associado a hematoma e dor à palpação do ligamento no exame tardio, o quadro reforça lesão ligamentar significativa.",
      },
      {
        title: "Resultado negativo",
        text: "Translação simétrica e ponto final firme tornam ruptura completa menos provável, mas não excluem lesão parcial, lesão da sindesmose ou outras estruturas.",
      },
      {
        title: "Armadilhas",
        text: "Dor e defesa muscular nas primeiras 48 horas podem esconder a frouxidão; frouxidão constitucional bilateral pode parecer positivo se não houver comparação.",
      },
      {
        title: "O que o teste não diz",
        text: "Não identifica fratura, lesão osteocondral ou instabilidade funcional. A decisão sobre imagem segue as regras de Ottawa e o quadro clínico, não o resultado da gaveta.",
      },
    ],
    reasoning: [
      "Relacione com o mecanismo (inversão com flexão plantar), a capacidade de apoio, o hematoma e o local de dor à palpação.",
      "Antes de qualquer teste de estresse, aplique as regras de Ottawa; se positivas, a prioridade é a radiografia.",
      "Combine com inclinação talar (calcaneofibular) e testes de sindesmose para separar lesão lateral isolada de lesão alta do tornozelo.",
      "Na suspeita de lesão relevante no primeiro dia, programe reexame em 4–5 dias, quando dor e edema diminuíram.",
      "Na instabilidade crônica, integre o teste com a história de falseios, equilíbrio e controle neuromuscular, como recomenda a diretriz JOSPT.",
    ],
    caution:
      "Uma gaveta anterior aumentada isolada não define o grau da lesão, não exclui fratura e não indica por si só cirurgia.",
    mistakes: [
      "Testar com o tornozelo em dorsiflexão, posição em que o tálus fica travado na pinça e a translação diminui.",
      "Não estabilizar a tíbia, confundindo deslocamento da perna com deslocamento do tálus.",
      "Realizar o teste no primeiro dia com dor intensa e concluir que é negativo.",
      "Deixar de comparar com o lado não lesado.",
    ],
    record:
      "Exemplo fictício: 5º dia após entorse em inversão à direita. Ottawa negativa. Gaveta anterior D com translação aumentada em relação à E e ponto final macio, dor anterolateral 3/10; hematoma lateral; dor à palpação do talofibular anterior. Inclinação talar D simétrica. Hipótese: lesão do LTFA; registrar equilíbrio e marcha.",
    related: [
      "ligamento-talofibular-anterior",
      "ligamento-calcaneofibular",
      "ligamento-talofibular-posterior",
      "talus",
      "fibula",
      "tibia",
      "talocrural",
    ],
    sources: [
      "tp-vandijk-exame-tardio",
      "tp-vuurberg-diretriz",
      "tp-jospt-entorse-lateral",
      "tp-ottawa-revisao",
    ],
    evidence: {
      text: "Em 160 pessoas com entorse em inversão, o exame físico tardio (cerca de 5 dias após o trauma, combinando gaveta anterior, hematoma e dor à palpação) teve sensibilidade de 96% e especificidade de 84% para lesão ligamentar, com referência em artrografia e cirurgia. Examinadores menos experientes foram mais acurados aos 5 dias que nas primeiras 48 horas. Os números se referem ao exame completo naquela amostra, não à gaveta isolada.",
      source: "tp-vandijk-exame-tardio",
    },
    review: [
      "Sei por que a leve flexão plantar coloca o talofibular anterior em teste.",
      "Sei aplicar as regras de Ottawa antes de estressar o tornozelo.",
      "Sei por que o exame 4–5 dias após a entorse é mais confiável.",
      "Sei comparar translação e ponto final com o lado não lesado.",
      "Sei que o teste não gradua sozinho a lesão nem exclui fratura.",
    ],
    cases: [
      {
        id: "dia-zero",
        question:
          "Caso fictício: duas horas após entorse em inversão, a pessoa apoia com dor, Ottawa negativa, e o tornozelo está muito edemaciado e doloroso. A gaveta parece normal. O que fazer?",
        choices: [
          "Registrar gaveta negativa e dar alta definitiva.",
          "Registrar o achado com a ressalva de dor e edema e reexaminar em 4–5 dias.",
          "Forçar a tração até obter o deslocamento máximo.",
        ],
        correct: 1,
        explanation:
          "Dor e defesa muscular reduzem a confiabilidade do exame precoce. O reexame após alguns dias é mais acurado para estimar a lesão ligamentar.",
      },
      {
        id: "gaveta-positiva",
        question:
          "Caso fictício: no 5º dia, a gaveta direita tem translação claramente maior que a esquerda, com ponto final macio e hematoma lateral. Qual a interpretação mais adequada?",
        choices: [
          "Confirma instabilidade crônica e indica cirurgia.",
          "Exclui lesão da sindesmose.",
          "Sugere lesão do talofibular anterior; integrar com inclinação talar, sindesmose e função.",
        ],
        correct: 2,
        explanation:
          "O conjunto sugere lesão do LTFA. Ainda é necessário avaliar outras estruturas, e a maioria das lesões agudas é tratada com reabilitação.",
      },
      {
        id: "ottawa-positiva",
        question:
          "Caso fictício: após torção, a pessoa não consegue dar quatro passos e tem dor à palpação da ponta do maléolo lateral. Qual a prioridade?",
        choices: [
          "Encaminhar para radiografia antes de qualquer teste de estresse.",
          "Fazer a gaveta anterior para decidir se precisa de imagem.",
          "Iniciar exercícios de equilíbrio no mesmo dia.",
        ],
        correct: 0,
        explanation:
          "As regras de Ottawa estão positivas: há indicação de radiografia para investigar fratura. Testes de estresse ficam para depois da liberação.",
      },
    ],
  },
  {
    id: "inclinacao-talar",
    name: "Teste de inclinação talar",
    aliases: [
      "Talar Tilt Test",
      "Estresse em inversão",
      "Inversion stress test",
    ],
    category: "tornozelo",
    kind: "ligamentar",
    region: "Tornozelo · ligamento calcaneofibular",
    position:
      "Paciente em decúbito dorsal ou lateral com o joelho levemente fletido e o tornozelo em posição neutra (0° de dorsiflexão); examinador estabiliza a perna distal e segura o retropé para aplicar inversão.",
    summary:
      "Estresse em inversão do retropé com o tornozelo em posição neutra para investigar a integridade do ligamento calcaneofibular.",
    purpose:
      "Observar se o tálus se inclina mais dentro da pinça maleolar do que no lado oposto, sugerindo lesão do ligamento calcaneofibular. Esse ligamento costuma ser lesado nas entorses mais graves, geralmente junto com o talofibular anterior. O teste complementa a gaveta anterior na estimativa da extensão da lesão lateral.",
    indications: [
      "Entorse lateral com suspeita de lesão mais extensa que a do talofibular anterior isolado.",
      "Reavaliação após alguns dias da entorse, junto com a gaveta anterior, para estimar gravidade.",
      "Instabilidade lateral crônica com falseios recorrentes.",
    ],
    safety: [
      "Conteúdo educativo: explique o teste, obtenha consentimento e pratique com formação e supervisão.",
      OTTAWA,
      "Pare se a dor aumentar muito ou se houver apreensão intensa; o estresse em inversão reproduz o mecanismo da lesão e não deve ser forçado.",
      "Dor no 5º metatarsal, no navicular ou no maléolo medial, ou sinais neurovasculares no pé, pedem investigação antes de repetir estresses.",
    ],
    steps: [
      {
        title: "Posicionar em neutro",
        text: "Com a pessoa deitada e relaxada, coloque o tornozelo em 0° de dorsiflexão. Examine primeiro o lado não lesado.",
        cue: "Em neutro, o calcaneofibular fica mais tenso; em flexão plantar, o estresse recai mais no talofibular anterior.",
      },
      {
        title: "Estabilizar a perna",
        text: "Fixe a tíbia e a fíbula distais com uma mão, logo acima dos maléolos.",
        cue: "A perna não pode rodar junto com o pé.",
      },
      {
        title: "Aplicar inversão",
        text: "Com a outra mão segurando calcâneo e tálus juntos, incline o retropé para dentro, de forma suave, até sentir o ponto final.",
        cue: "Segurar o tálus junto ao calcâneo reduz a contribuição da subtalar, que também faz inversão.",
      },
      {
        title: "Observar a resposta",
        text: "Avalie a amplitude da inclinação, a qualidade do ponto final, um possível afastamento palpável na face lateral e se a dor da queixa foi reproduzida.",
        cue: "Dor sem frouxidão e frouxidão sem dor são achados diferentes; registre ambos.",
      },
      {
        title: "Comparar e registrar",
        text: "Repita do outro lado e anote a diferença, o ponto final, a dor e a posição do tornozelo usada.",
        cue: "Registrar a posição permite repetir o teste do mesmo modo nas reavaliações.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo",
        text: "Inclinação maior que a contralateral, com ponto final macio, sugere lesão do ligamento calcaneofibular, geralmente associada à do talofibular anterior.",
      },
      {
        title: "Resultado negativo",
        text: "Inclinação simétrica e firme reduz a probabilidade de lesão relevante do calcaneofibular, mas não exclui lesão isolada do talofibular anterior.",
      },
      {
        title: "Armadilhas",
        text: "Movimento da subtalar pode ser confundido com inclinação do tálus; dor e defesa muscular na fase aguda limitam a leitura.",
      },
      {
        title: "O que o teste não diz",
        text: "Não diferencia com precisão o grau da lesão nem identifica lesões associadas, como osteocondral, de fibulares ou da sindesmose.",
      },
    ],
    reasoning: [
      "Gaveta anterior positiva com inclinação talar positiva sugere lesão lateral mais extensa que gaveta positiva isolada.",
      "Palpe o trajeto do calcaneofibular, abaixo da ponta do maléolo lateral, e compare com o talofibular anterior.",
      "Dor na parte posterior do maléolo lateral pode envolver tendões fibulares; teste eversão resistida e palpe o trajeto.",
      "Na instabilidade crônica, combine com testes funcionais e de equilíbrio; frouxidão mecânica e instabilidade funcional nem sempre andam juntas.",
    ],
    caution:
      "Uma inclinação talar aumentada isolada não indica a gravidade exata da lesão nem a necessidade de cirurgia.",
    mistakes: [
      "Testar em flexão plantar e atribuir o resultado ao calcaneofibular.",
      "Segurar apenas o calcâneo e medir sobretudo o movimento da subtalar.",
      "Aplicar força excessiva na fase aguda, reproduzindo o mecanismo de lesão.",
      "Não comparar com o lado oposto.",
    ],
    record:
      "Exemplo fictício: 6º dia após entorse lateral E. Ottawa negativa. Inclinação talar E (tornozelo neutro) maior que D, ponto final macio, dor lateral 4/10. Gaveta anterior E também aumentada. Hipótese: lesão de LTFA e calcaneofibular; avaliar fibulares e equilíbrio.",
    related: [
      "ligamento-calcaneofibular",
      "ligamento-talofibular-anterior",
      "calcaneo",
      "talus",
      "fibula",
      "talocrural",
      "subtalar",
    ],
    sources: [
      "tp-statpearls-entorse",
      "tp-vuurberg-diretriz",
      "tp-jospt-entorse-lateral",
      "tp-ottawa-validacao",
    ],
    evidence: {
      text: "Não foi encontrado, nas fontes conferidas, um número confiável de acurácia para a inclinação talar isolada. As diretrizes valorizam o exame físico tardio completo para estimar a gravidade da lesão ligamentar lateral. Use o teste como parte desse conjunto, e não como critério único.",
      source: "tp-vuurberg-diretriz",
    },
    review: [
      "Sei por que o tornozelo fica em neutro para testar o calcaneofibular.",
      "Sei estabilizar a perna e segurar tálus e calcâneo juntos.",
      "Sei combinar o resultado com a gaveta anterior.",
      "Sei aplicar as regras de Ottawa antes do estresse.",
    ],
    cases: [
      {
        id: "lesao-combinada",
        question:
          "Caso fictício: no 5º dia, gaveta anterior e inclinação talar estão aumentadas à direita. O que esse conjunto sugere?",
        choices: [
          "Lesão lateral mais extensa, envolvendo talofibular anterior e calcaneofibular.",
          "Lesão isolada do ligamento deltoide.",
          "Ruptura do tendão do calcâneo.",
        ],
        correct: 0,
        explanation:
          "A gaveta aponta para o LTFA, e a inclinação em neutro aponta para o calcaneofibular. O conjunto sugere lesão lateral mais extensa.",
      },
      {
        id: "posicao-errada",
        question:
          "Caso fictício: o examinador fez a inclinação com o tornozelo em flexão plantar e encontrou aumento. O que limita a interpretação?",
        choices: [
          "Nada; a posição não interfere.",
          "A flexão plantar trava o tálus na pinça.",
          "Em flexão plantar, o estresse recai mais no talofibular anterior.",
        ],
        correct: 2,
        explanation:
          "O calcaneofibular é testado preferencialmente com o tornozelo em neutro. Em flexão plantar o resultado reflete mais o LTFA.",
      },
      {
        id: "quinto-metatarsal",
        question:
          "Caso fictício: após torção em inversão, há dor intensa à palpação da base do 5º metatarsal. O que fazer antes da inclinação talar?",
        choices: [
          "Aplicar inversão máxima para provocar a dor.",
          "Encaminhar para radiografia, pois a regra de Ottawa do pé está positiva.",
          "Ignorar, porque a dor no pé não tem relação com a entorse.",
        ],
        correct: 1,
        explanation:
          "Dor à palpação da base do 5º metatarsal é critério de Ottawa para o mediopé. A suspeita de fratura vem antes de testes de estresse.",
      },
    ],
  },
  {
    id: "squeeze-test",
    name: "Squeeze test (compressão da perna)",
    aliases: [
      "Teste de compressão tibiofibular",
      "Squeeze test",
      "Teste de Hopkinson",
    ],
    category: "tornozelo",
    kind: "ligamentar",
    region: "Tornozelo · sindesmose tibiofibular distal",
    position:
      "Paciente em decúbito dorsal ou sentado com a perna relaxada; examinador envolve o terço médio da perna com as duas mãos.",
    summary:
      "Compressão da tíbia e da fíbula no terço médio da perna para provocar dor distal na região da sindesmose tibiofibular.",
    purpose:
      "Investigar lesão da sindesmose tibiofibular distal (entorse alta do tornozelo) quando a compressão longe da lesão reproduz dor na região anterior e distal entre tíbia e fíbula. É um teste com especificidade relativamente maior que a sensibilidade, útil para reforçar a suspeita depois de testes mais sensíveis.",
    indications: [
      "Entorse com dor anterior e acima da linha articular, entre tíbia e fíbula.",
      "Mecanismo com rotação externa do pé ou dorsiflexão forçada, ou dificuldade desproporcional para apoiar e saltar.",
      "Complemento da palpação da sindesmose e do teste de rotação externa.",
    ],
    safety: [
      "Conteúdo educativo: explique o teste, obtenha consentimento e pratique com formação e supervisão.",
      OTTAWA,
      "Palpe a fíbula em todo o comprimento, inclusive perto do joelho: dor proximal após trauma rotacional pode indicar fratura alta da fíbula associada à lesão da sindesmose e exige radiografia.",
      "Não comprima um ponto doloroso da própria fíbula ou da tíbia; dor local intensa no ponto comprimido sugere lesão óssea, não sindesmose.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a perna relaxada, identifique o terço médio da perna, longe do tornozelo. Pergunte onde é a dor habitual.",
        cue: "Comprimir perto do tornozelo provoca dor local e confunde a resposta.",
      },
      {
        title: "Envolver a perna",
        text: "Coloque as mãos ao redor da panturrilha, com os dedos de um lado e as eminências tenares do outro, abrangendo tíbia e fíbula.",
        cue: "O objetivo é aproximar a fíbula da tíbia, não apertar só a musculatura.",
      },
      {
        title: "Comprimir",
        text: "Aplique compressão firme e progressiva por alguns segundos e solte. Se tolerado, repita um pouco mais acima ou abaixo.",
        cue: "Compressão gradual; não cause dor intensa no local apertado.",
      },
      {
        title: "Localizar a dor",
        text: "Pergunte se apareceu dor e onde. A resposta de interesse é dor distal, na região anterior da sindesmose, e não no ponto comprimido.",
        cue: "Peça que a pessoa aponte com um dedo onde doeu.",
      },
      {
        title: "Comparar e registrar",
        text: "Teste o lado oposto e registre o local e a intensidade da dor, além do nível em que comprimiu.",
        cue: "Registre também a palpação da sindesmose e o teste de rotação externa.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo",
        text: "Dor distal na região anterior entre tíbia e fíbula ao comprimir o terço médio da perna aumenta a suspeita de lesão da sindesmose.",
      },
      {
        title: "Resultado negativo",
        text: "A sensibilidade é limitada; um squeeze negativo não exclui lesão da sindesmose, principalmente quando palpação e rotação externa são dolorosas.",
      },
      {
        title: "Armadilhas",
        text: "Dor no ponto comprimido pode indicar contusão muscular ou fratura da fíbula. Comprimir perto do tornozelo provoca dor da própria entorse.",
      },
      {
        title: "O que o teste não diz",
        text: "Não diferencia lesão estável de instável e não define a necessidade de cirurgia; essa decisão exige avaliação médica e, muitas vezes, imagem.",
      },
    ],
    reasoning: [
      "Comece por testes mais sensíveis (palpação da sindesmose, lunge com dor) e use o squeeze, mais específico, para reforçar a hipótese.",
      "Incapacidade de saltar em apoio unipodal e dor desproporcional à aparência da lesão também apoiam a suspeita de entorse alta.",
      "A lesão da sindesmose costuma levar mais tempo para retorno ao esporte que a entorse lateral; a suspeita muda o prognóstico e o encaminhamento.",
      "Com mecanismo rotacional e dor na fíbula proximal, considere fratura alta da fíbula e encaminhe para imagem.",
    ],
    caution:
      "Um squeeze test positivo isolado não confirma instabilidade da sindesmose nem indica cirurgia.",
    mistakes: [
      "Comprimir logo acima do tornozelo e interpretar dor local como teste positivo.",
      "Não perguntar onde exatamente apareceu a dor.",
      "Concluir que não há lesão da sindesmose por um squeeze negativo.",
      "Esquecer de palpar a fíbula proximal após trauma rotacional.",
    ],
    record:
      "Exemplo fictício: 3º dia após trauma em rotação externa no futebol, perna D. Ottawa negativa; fíbula proximal indolor. Squeeze no terço médio reproduz dor anterior entre tíbia e fíbula distais, 5/10. Palpação do ligamento tibiofibular anterior dolorosa; rotação externa positiva. Hipótese: lesão da sindesmose; encaminhar para avaliação médica.",
    related: [
      "ligamento-tibiofibular-anterior",
      "ligamento-tibiofibular-posterior",
      "ligamento-tibiofibular-transverso",
      "membrana-interossea-da-perna",
      "tibia",
      "fibula",
      "talocrural",
    ],
    sources: [
      "tp-sindesmose-sman",
      "tp-sindesmose-meta",
      "tp-statpearls-entorse",
      "tp-ottawa-revisao",
    ],
    evidence: {
      text: "Em 87 pessoas avaliadas até 2 semanas após entorse, com ressonância como referência, o squeeze test teve a maior especificidade entre os testes clínicos (88%). Uma metanálise de 6 estudos (512 participantes) encontrou especificidade agrupada de 85% para o squeeze e concluiu que nenhum teste é ao mesmo tempo muito sensível e muito específico. Os resultados dependem da população, do momento do exame e da referência usada.",
      source: "tp-sindesmose-meta",
    },
    review: [
      "Sei comprimir no terço médio, e não perto do tornozelo.",
      "Sei que a resposta de interesse é dor distal na sindesmose.",
      "Sei que o squeeze é mais específico que sensível.",
      "Sei procurar dor na fíbula proximal após trauma rotacional.",
    ],
    cases: [
      {
        id: "squeeze-negativo",
        question:
          "Caso fictício: palpação da sindesmose muito dolorosa, rotação externa positiva, mas squeeze negativo. Como interpretar?",
        choices: [
          "A lesão da sindesmose está excluída.",
          "Trata-se de entorse lateral simples, sem necessidade de reavaliar.",
          "A suspeita continua; um squeeze negativo não exclui a lesão.",
        ],
        correct: 2,
        explanation:
          "O squeeze tem sensibilidade limitada. Achados sensíveis positivos mantêm a suspeita e justificam acompanhamento ou encaminhamento.",
      },
      {
        id: "fibula-proximal",
        question:
          "Caso fictício: após trauma em rotação externa, a pessoa tem dor na sindesmose e dor à palpação da fíbula perto do joelho. Qual a prioridade?",
        choices: [
          "Encaminhar para radiografia que inclua a perna, pela suspeita de fratura alta da fíbula.",
          "Repetir o squeeze com mais força.",
          "Liberar para corrida leve.",
        ],
        correct: 0,
        explanation:
          "Dor na fíbula proximal com lesão da sindesmose pode indicar fratura alta da fíbula. A investigação por imagem vem antes de novos testes.",
      },
      {
        id: "dor-local",
        question:
          "Caso fictício: ao comprimir a perna logo acima dos maléolos, a pessoa relata dor exatamente onde as mãos apertam. O que concluir?",
        choices: [
          "Squeeze positivo para sindesmose.",
          "O teste foi mal localizado; comprimir no terço médio e perguntar se a dor surge à distância.",
          "Exclui lesão óssea.",
        ],
        correct: 1,
        explanation:
          "O teste busca dor distal provocada por compressão à distância. Dor no ponto comprimido não tem o mesmo significado.",
      },
    ],
  },
  {
    id: "rotacao-externa-tornozelo",
    name: "Teste de rotação externa do tornozelo",
    aliases: [
      "Teste de Kleiger",
      "External Rotation Stress Test",
      "Estresse em dorsiflexão e rotação externa",
    ],
    category: "tornozelo",
    kind: "ligamentar",
    region: "Tornozelo · sindesmose tibiofibular e ligamento deltoide",
    position:
      "Paciente sentado com o joelho fletido a 90° e a perna pendente; examinador estabiliza a perna distal com uma mão e segura o pé com a outra, com o tornozelo em posição neutra.",
    summary:
      "Rotação externa passiva do pé com a perna estabilizada para provocar dor na sindesmose tibiofibular distal ou na face medial do tornozelo.",
    purpose:
      "A rotação externa do tálus empurra a fíbula para fora e tensiona os ligamentos da sindesmose e o ligamento deltoide. A localização da dor ajuda a orientar a hipótese: anterolateral e acima da articulação para sindesmose, medial para deltoide. É um dos testes mais sensíveis para entorse alta do tornozelo.",
    indications: [
      "Entorse com mecanismo de rotação externa do pé ou dorsiflexão forçada.",
      "Dor anterior acima da linha articular ou dor medial após trauma.",
      "Complemento do squeeze test e da palpação da sindesmose.",
    ],
    safety: [
      "Conteúdo educativo: explique o teste, obtenha consentimento e pratique com formação e supervisão.",
      OTTAWA,
      "Interrompa ao reproduzir a dor; não force a rotação. Dor no maléolo medial ou na fíbula proximal após trauma rotacional exige investigação de fratura.",
      "Deformidade, pele isquêmica ou alteração neurovascular no pé indicam encaminhamento imediato, sem testes de estresse.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa sentada na borda da maca, joelho a 90° e perna pendente, coloque o tornozelo em posição neutra. Examine primeiro o lado não lesado.",
        cue: "O joelho fletido impede que a rotação seja absorvida pelo quadril.",
      },
      {
        title: "Estabilizar a perna",
        text: "Segure a tíbia e a fíbula distais com uma mão, sem comprimir a região dolorosa.",
        cue: "A perna deve ficar parada enquanto o pé roda.",
      },
      {
        title: "Rodar o pé para fora",
        text: "Com a outra mão no pé (retropé e mediopé), leve-o em rotação externa passiva de forma lenta. Na variante com dorsiflexão, posicione antes o tornozelo em dorsiflexão.",
        cue: "Registre qual variante usou: neutro ou dorsiflexão.",
      },
      {
        title: "Localizar a dor",
        text: "Pergunte se a dor apareceu e onde: na região anterior entre tíbia e fíbula, acima da articulação, ou na face medial do tornozelo.",
        cue: "Peça que a pessoa aponte o local; a localização orienta a hipótese.",
      },
      {
        title: "Comparar e registrar",
        text: "Repita do outro lado e registre a dor, o local, a variante usada e eventual deslocamento medial palpável do tálus.",
        cue: "Registre junto o squeeze e a palpação para formar o conjunto.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo de sindesmose",
        text: "Dor na região anterior e distal entre tíbia e fíbula, acima da linha articular, sugere lesão da sindesmose, principalmente se a palpação do ligamento tibiofibular anterior também for dolorosa.",
      },
      {
        title: "Achado sugestivo de deltoide",
        text: "Dor medial, abaixo do maléolo medial, sugere participação do ligamento deltoide; dor no próprio maléolo medial pede investigação de fratura.",
      },
      {
        title: "Resultado negativo",
        text: "Reduz a probabilidade de lesão da sindesmose, sobretudo junto com palpação indolor, mas não exclui lesões menores.",
      },
      {
        title: "O que o teste não diz",
        text: "Não diferencia lesão estável de instável. A conduta em lesões da sindesmose depende de avaliação médica e de imagem.",
      },
    ],
    reasoning: [
      "Use a rotação externa e a palpação (mais sensíveis) para levantar a hipótese e o squeeze (mais específico) para reforçá-la.",
      "Lesão da sindesmose associada a lesão do deltoide sugere lesão mais grave; encaminhe para avaliação médica.",
      "Dor e incapacidade desproporcionais à aparência da lesão, e incapacidade de saltar em um pé, também apoiam a entorse alta.",
      "Pesquise a fíbula proximal após trauma rotacional e aplique as regras de Ottawa.",
    ],
    caution:
      "Dor à rotação externa isolada não confirma instabilidade da sindesmose nem diferencia entre tratamento conservador e cirúrgico.",
    mistakes: [
      "Não estabilizar a perna e deixar a rotação acontecer no joelho ou no quadril.",
      "Não perguntar o local da dor, perdendo a diferença entre sindesmose e deltoide.",
      "Forçar a rotação até dor intensa.",
      "Usar o teste antes de aplicar as regras de Ottawa.",
    ],
    record:
      "Exemplo fictício: 4º dia após trauma em rotação externa, tornozelo E. Ottawa negativa; fíbula proximal indolor. Rotação externa (joelho 90°, tornozelo neutro) reproduz dor anterior acima da linha articular, 6/10; sem dor medial. Squeeze positivo. Hipótese: lesão da sindesmose; encaminhado para avaliação médica.",
    related: [
      "ligamento-tibiofibular-anterior",
      "ligamento-tibiofibular-posterior",
      "ligamento-deltoide",
      "membrana-interossea-da-perna",
      "talus",
      "tibia",
      "fibula",
      "talocrural",
    ],
    sources: [
      "tp-sindesmose-sman",
      "tp-sindesmose-meta",
      "tp-statpearls-entorse",
      "tp-ottawa-validacao",
    ],
    evidence: {
      text: "Em 87 pessoas até 2 semanas após entorse, com ressonância como referência, o teste de estresse em dorsiflexão e rotação externa teve sensibilidade de 71% e foi associado a maior chance de lesão da sindesmose. Na metanálise de 6 estudos, o teste de rotação externa teve especificidade agrupada de 78%. As variantes de execução diferem entre estudos, e nenhum teste isolado é suficiente para o diagnóstico.",
      source: "tp-sindesmose-sman",
    },
    review: [
      "Sei posicionar com joelho a 90° e estabilizar a perna.",
      "Sei diferenciar dor de sindesmose de dor no deltoide pela localização.",
      "Sei combinar rotação externa, palpação e squeeze.",
      "Sei investigar a fíbula proximal após trauma rotacional.",
    ],
    cases: [
      {
        id: "dor-anterior",
        question:
          "Caso fictício: a rotação externa reproduz dor anterior entre tíbia e fíbula, acima da articulação, e a palpação do tibiofibular anterior é dolorosa. Qual hipótese é mais adequada?",
        choices: [
          "Entorse lateral isolada do talofibular anterior.",
          "Lesão da sindesmose; completar com squeeze e encaminhar para avaliação.",
          "Fasciopatia plantar.",
        ],
        correct: 1,
        explanation:
          "A localização da dor e a palpação apontam para a sindesmose. O squeeze, mais específico, complementa o conjunto.",
      },
      {
        id: "maleolo-medial",
        question:
          "Caso fictício: após trauma rotacional, a pessoa não apoia o pé e tem dor à palpação da borda posterior do maléolo medial. O que fazer?",
        choices: [
          "Encaminhar para radiografia antes de qualquer teste de estresse.",
          "Fazer a rotação externa para confirmar lesão do deltoide.",
          "Iniciar mobilização em dorsiflexão.",
        ],
        correct: 0,
        explanation:
          "As regras de Ottawa estão positivas. A suspeita de fratura tem prioridade sobre os testes ligamentares.",
      },
      {
        id: "rotacao-quadril",
        question:
          "Caso fictício: o teste foi feito com a pessoa deitada e o joelho estendido, e a perna inteira rodou junto com o pé. O que limita a interpretação?",
        choices: [
          "Nada; a posição não interfere.",
          "O teste fica mais específico assim.",
          "A rotação foi absorvida pelo quadril e o tornozelo não foi testado adequadamente.",
        ],
        correct: 2,
        explanation:
          "Sem estabilizar a perna e com o joelho estendido, a rotação se perde em articulações proximais. Repita com joelho a 90° e perna fixa.",
      },
    ],
  },
  {
    id: "thompson",
    name: "Teste de Thompson",
    aliases: [
      "Teste de Simmonds",
      "Calf squeeze test",
      "Compressão da panturrilha",
    ],
    category: "tornozelo",
    kind: "musculotendineo",
    region: "Perna e tornozelo · tendão do calcâneo",
    position:
      "Paciente em decúbito ventral com os pés para fora da maca (ou ajoelhado em uma cadeira); examinador ao lado, com as mãos sobre o ventre da panturrilha.",
    summary:
      "Compressão do ventre da panturrilha para observar se o pé faz flexão plantar passiva, investigando ruptura completa do tendão do calcâneo.",
    purpose:
      "Com o tendão íntegro, comprimir o tríceps sural produz flexão plantar passiva do pé. A ausência ou redução clara desse movimento em comparação ao outro lado sugere ruptura completa. É um teste rápido, que ajuda a evitar que a ruptura seja confundida com entorse.",
    indications: [
      "Dor súbita na parte posterior da perna ou do calcanhar com estalo ou sensação de chute durante esporte ou impulso.",
      "Fraqueza para ficar na ponta do pé após trauma na panturrilha ou no tornozelo.",
      "Suspeita de entorse com dor posterior, para não deixar passar ruptura do tendão do calcâneo.",
    ],
    safety: [
      "Conteúdo educativo: explique o teste, obtenha consentimento e pratique com formação e supervisão.",
      "Suspeita de ruptura do tendão do calcâneo é urgência ortopédica: encaminhe no mesmo dia para avaliação médica, evite alongar ou carregar o tendão e não use exercícios para testar a força.",
      "Dor, calor e edema na panturrilha sem trauma claro, principalmente após imobilização, cirurgia ou viagem longa, podem indicar trombose venosa profunda; não comprima repetidamente e encaminhe para avaliação médica.",
      "Uso recente de fluoroquinolonas ou infiltração de corticoide e dor posterior súbita aumentam a suspeita de ruptura e reforçam o encaminhamento.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa em decúbito ventral, deixe os dois pés fora da borda da maca, relaxados. Observe a posição de repouso dos pés.",
        cue: "Em repouso, o pé com tendão íntegro tende a ficar em leve flexão plantar; o lado rompido costuma ficar mais neutro.",
      },
      {
        title: "Inspecionar e palpar",
        text: "Observe e palpe suavemente o trajeto do tendão do calcâneo, procurando um defeito (afundamento) cerca de alguns centímetros acima da inserção.",
        cue: "O edema pode preencher o defeito; ausência de afundamento palpável não exclui ruptura.",
      },
      {
        title: "Comprimir a panturrilha",
        text: "Comprima o ventre muscular da panturrilha com uma mão, firme e rapidamente, e observe o pé.",
        cue: "Comprima o ponto mais volumoso do músculo, não o tendão.",
      },
      {
        title: "Observar o movimento",
        text: "Com tendão íntegro, o pé faz flexão plantar passiva. Ausência ou redução clara do movimento sugere ruptura completa.",
        cue: "Olhe o pé, não a mão: um pequeno movimento pode vir de outros tendões posteriores.",
      },
      {
        title: "Comparar e registrar",
        text: "Faça o teste no lado não lesado e registre a resposta, a palpação do defeito e a posição de repouso dos pés.",
        cue: "Associe o teste de Matles (joelhos a 90° em decúbito ventral) para formar um conjunto.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo de ruptura",
        text: "Ausência de flexão plantar à compressão da panturrilha, comparada ao lado oposto, sugere ruptura completa do tendão do calcâneo, principalmente com defeito palpável e Matles positivo.",
      },
      {
        title: "Resultado negativo",
        text: "Flexão plantar simétrica torna ruptura completa menos provável, mas não exclui ruptura parcial ou lesão do músculo; com história típica, mantenha a suspeita.",
      },
      {
        title: "Armadilhas",
        text: "A pessoa pode conseguir fazer flexão plantar ativa usando flexores longos dos dedos, tibial posterior e fibulares; isso não exclui ruptura.",
      },
      {
        title: "O que o teste não diz",
        text: "Não mede o tamanho do defeito nem define o tratamento; a escolha entre conduta cirúrgica e funcional é médica e feita precocemente.",
      },
    ],
    reasoning: [
      "A história de estalo, dor súbita e sensação de chute durante impulso é muito sugestiva; o exame confirma a suspeita.",
      "Use um conjunto de testes (compressão da panturrilha, Matles, palpação do defeito); na referência citada, pelo menos dois foram positivos em todas as rupturas.",
      "Rupturas podem ser registradas como entorse em parte dos casos; faça o teste sempre que houver dor posterior após trauma.",
      "Considere fatores de risco: tendinopatia prévia, fluoroquinolonas, infiltrações de corticoide e doenças inflamatórias.",
      "Diferencie de lesão muscular do gastrocnêmio medial, que costuma ter dor mais proximal e Thompson presente.",
    ],
    caution:
      "Um Thompson com flexão plantar presente não exclui ruptura parcial, e a capacidade de mover o pé ativamente não descarta ruptura completa.",
    mistakes: [
      "Comprimir com o joelho dobrado e o pé apoiado na maca, impedindo o movimento.",
      "Concluir que não há ruptura porque a pessoa faz flexão plantar ativa.",
      "Não comparar com o lado não lesado.",
      "Atrasar o encaminhamento para observar a evolução.",
    ],
    record:
      "Exemplo fictício: dor súbita na perna D durante jogo de vôlei, com estalo. Repouso: pé D em neutro, E em leve flexão plantar. Thompson D: ausência de flexão plantar; E normal. Defeito palpável cerca de 4 cm acima da inserção. Matles positivo à D. Hipótese: ruptura do tendão do calcâneo; encaminhado no mesmo dia para ortopedia.",
    related: [
      "tendao-calcaneo",
      "gastrocnemio",
      "soleo",
      "plantar",
      "calcaneo",
      "flexor-longo-do-halux",
      "tibial-posterior",
    ],
    sources: ["tp-maffulli-aquiles", "tp-statpearls-aquiles"],
    evidence: {
      text: "Em um estudo prospectivo com 174 pessoas com ruptura unilateral do tendão do calcâneo e 28 sem ruptura confirmada por imagem, a compressão da panturrilha teve sensibilidade de 0,96 e especificidade de 0,93; o teste de Matles teve 0,88 e 0,85, e a palpação do defeito, 0,73 e 0,89. A amostra foi de um único serviço ortopédico, com poucos casos sem ruptura, o que limita a estimativa de especificidade.",
      source: "tp-maffulli-aquiles",
    },
    review: [
      "Sei posicionar em decúbito ventral com os pés livres.",
      "Sei que flexão plantar ativa não exclui ruptura.",
      "Sei combinar Thompson, Matles e palpação do defeito.",
      "Sei que a suspeita exige encaminhamento no mesmo dia.",
      "Sei diferenciar ruptura do tendão de trombose venosa e lesão muscular.",
    ],
    cases: [
      {
        id: "ruptura-classica",
        question:
          "Caso fictício: durante uma corrida para a bola, a pessoa sentiu um estalo atrás do tornozelo. O Thompson não produz flexão plantar à direita. Qual conduta?",
        choices: [
          "Encaminhar no mesmo dia para avaliação ortopédica, evitando carga e alongamento.",
          "Prescrever alongamento do tríceps sural.",
          "Reavaliar em três semanas.",
        ],
        correct: 0,
        explanation:
          "O quadro sugere ruptura completa. O encaminhamento precoce permite decidir a conduta a tempo.",
      },
      {
        id: "flexao-ativa",
        question:
          "Caso fictício: a pessoa consegue fazer flexão plantar ativa sentada, mas o Thompson está ausente e há defeito palpável. O que concluir?",
        choices: [
          "A flexão plantar ativa exclui ruptura.",
          "A suspeita de ruptura se mantém; outros músculos podem produzir flexão plantar.",
          "Trata-se apenas de entorse.",
        ],
        correct: 1,
        explanation:
          "Flexores longos dos dedos, tibial posterior e fibulares podem gerar flexão plantar. Thompson ausente com defeito palpável mantém forte suspeita.",
      },
      {
        id: "trombose",
        question:
          "Caso fictício: uma semana após imobilização por fratura do punho e viagem longa, a pessoa tem panturrilha quente, edemaciada e dolorosa, sem trauma. Qual a prioridade?",
        choices: [
          "Fazer Thompson repetidamente para confirmar ruptura.",
          "Massagear a panturrilha.",
          "Encaminhar para avaliação médica pela suspeita de trombose venosa profunda.",
        ],
        correct: 2,
        explanation:
          "Sem trauma e com sinais inflamatórios após imobilidade, a suspeita principal é trombose venosa profunda, que exige avaliação médica urgente.",
      },
    ],
  },
  {
    id: "windlass",
    name: "Teste de Windlass",
    aliases: [
      "Windlass test",
      "Teste do molinete",
      "Extensão passiva do hálux",
    ],
    category: "tornozelo",
    kind: "musculotendineo",
    region: "Pé · fáscia plantar",
    position:
      "Sem carga: paciente sentado com o tornozelo estabilizado em posição neutra; com carga: paciente em pé, com os dedos livres na borda de um degrau. Examinador estende passivamente a articulação metatarsofalângica do hálux.",
    summary:
      "Extensão passiva da articulação metatarsofalângica do hálux para tensionar a fáscia plantar e verificar se reproduz a dor no calcanhar.",
    purpose:
      "A extensão do hálux traciona a fáscia plantar como um molinete, elevando o arco. Se esse estiramento reproduzir a dor na origem da fáscia, no tubérculo medial do calcâneo, a hipótese de fasciopatia plantar ganha força. O teste é específico, mas pouco sensível, especialmente sem carga.",
    indications: [
      "Dor na face plantar e medial do calcanhar, pior nos primeiros passos da manhã ou após repouso.",
      "Dor no calcanhar em corredores ou em quem passou a ficar mais tempo em pé.",
      "Complemento da palpação da origem da fáscia plantar.",
    ],
    safety: [
      "Conteúdo educativo: explique o teste, obtenha consentimento e pratique com formação e supervisão.",
      "Dor no calcanhar após trauma, dor à compressão lateral do calcâneo ou dor que piora progressivamente com a carga sugerem fratura por estresse; encaminhe para avaliação e imagem.",
      "Formigamento, queimação ou dormência na sola do pé sugerem compressão nervosa (como na região do túnel do tarso); faça exame neurológico e não atribua os sintomas à fáscia.",
      "Dor noturna, febre, perda de peso, dor bilateral com rigidez matinal prolongada ou pé diabético com alteração de sensibilidade exigem encaminhamento para avaliação médica.",
    ],
    steps: [
      {
        title: "Investigar a queixa",
        text: "Pergunte sobre a dor nos primeiros passos, o local exato e a relação com a carga. Palpe o tubérculo medial do calcâneo e compare com o outro pé.",
        cue: "Peça que a pessoa aponte com um dedo onde dói.",
      },
      {
        title: "Testar sem carga",
        text: "Com a pessoa sentada, estabilize o tornozelo em posição neutra e estenda passivamente a metatarsofalângica do hálux até o final da amplitude.",
        cue: "Estenda só o hálux; a extensão dos outros dedos não é o foco.",
      },
      {
        title: "Testar com carga",
        text: "Com a pessoa em pé sobre um degrau, peso nos dois pés e dedos livres na borda, estenda passivamente o hálux do pé testado.",
        cue: "A versão com carga tende a reproduzir a dor com mais frequência que a sem carga.",
      },
      {
        title: "Observar a resposta",
        text: "O teste é positivo se reproduzir a dor habitual no calcanhar, na origem da fáscia. Observe também a elevação do arco durante a extensão.",
        cue: "Dor só na articulação do hálux não é resposta positiva para a fáscia.",
      },
      {
        title: "Comparar e registrar",
        text: "Teste o outro pé e registre a versão usada, a dor, o local e a amplitude de extensão do hálux.",
        cue: "Registre separadamente as versões com e sem carga.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo",
        text: "Reprodução da dor habitual na origem da fáscia plantar durante a extensão do hálux apoia a hipótese de fasciopatia plantar.",
      },
      {
        title: "Resultado negativo",
        text: "Por ter baixa sensibilidade, um teste negativo é comum mesmo em pessoas com fasciopatia; não exclui o diagnóstico.",
      },
      {
        title: "Armadilhas",
        text: "Dor na própria metatarsofalângica (por exemplo, rigidez do hálux) pode ser confundida com resposta positiva. Testar só sem carga reduz ainda mais a sensibilidade.",
      },
      {
        title: "O que o teste não diz",
        text: "Não identifica a causa da sobrecarga nem descarta fratura por estresse do calcâneo, compressão nervosa ou doença inflamatória.",
      },
    ],
    reasoning: [
      "A história típica (dor plantar medial no calcanhar, pior nos primeiros passos) e a dor à palpação da origem da fáscia sustentam mais o diagnóstico que o teste isolado.",
      "Use o Windlass para reforçar a hipótese quando positivo; quando negativo, mantenha a hipótese se história e palpação forem compatíveis.",
      "Investigue fatores de carga: aumento de volume de treino, tempo em pé, calçado e dorsiflexão limitada do tornozelo.",
      "Considere diagnósticos diferenciais: fratura por estresse do calcâneo, compressão de nervos plantares, atrofia do coxim e doenças inflamatórias.",
    ],
    caution:
      "Um Windlass positivo isolado não confirma fasciopatia plantar nem exclui outras causas de dor no calcanhar.",
    mistakes: [
      "Testar apenas sem carga e concluir que não há fasciopatia.",
      "Considerar positiva a dor na articulação do hálux.",
      "Não perguntar se a dor é a mesma da queixa.",
      "Deixar de investigar sintomas neurológicos e sinais de fratura por estresse.",
    ],
    record:
      "Exemplo fictício: dor no calcanhar E há 3 meses, pior nos primeiros passos. Dor à palpação do tubérculo medial do calcâneo E. Windlass sem carga: sem dor; com carga: reproduz a dor habitual, 5/10. Compressão lateral do calcâneo indolor; sensibilidade plantar normal. Hipótese: fasciopatia plantar.",
    related: [
      "aponeurose-plantar",
      "calcaneo",
      "primeiro-metatarsal",
      "falange-proximal-do-halux",
      "metatarsofalangicas",
      "abdutor-do-halux",
      "nervo-plantar-lateral",
    ],
    sources: ["tp-windlass-degarceau", "tp-statpearls-fasciite"],
    evidence: {
      text: "Em um estudo com 22 pessoas com fasciíte plantar, 23 com outras dores no pé e 30 controles, o Windlass com carga reproduziu a dor em 31,8% das pessoas com fasciíte e sem carga em 13,6%; ninguém dos outros grupos teve teste positivo. Isso indica alta especificidade e baixa sensibilidade em uma amostra pequena; os números não devem ser generalizados.",
      source: "tp-windlass-degarceau",
    },
    review: [
      "Sei executar o Windlass com e sem carga.",
      "Sei que a resposta positiva é dor no calcanhar, não no hálux.",
      "Sei que o teste é específico, mas pouco sensível.",
      "Sei reconhecer sinais de fratura por estresse e de compressão nervosa.",
    ],
    cases: [
      {
        id: "windlass-negativo",
        question:
          "Caso fictício: dor típica nos primeiros passos e dor à palpação do tubérculo medial do calcâneo, mas Windlass negativo com e sem carga. Como interpretar?",
        choices: [
          "A fasciopatia plantar está excluída.",
          "Deve-se solicitar cirurgia.",
          "A hipótese se mantém, pois o teste tem baixa sensibilidade.",
        ],
        correct: 2,
        explanation:
          "Um Windlass negativo é comum em fasciopatia. História e palpação compatíveis sustentam a hipótese.",
      },
      {
        id: "fratura-estresse",
        question:
          "Caso fictício: corredora aumentou muito o volume de treino; dor no calcanhar piora a cada corrida e há dor à compressão lateral do calcâneo. Qual a prioridade?",
        choices: [
          "Fazer Windlass com carga e iniciar alongamento.",
          "Encaminhar para avaliação por suspeita de fratura por estresse do calcâneo.",
          "Manter o treino e reavaliar em um mês.",
        ],
        correct: 1,
        explanation:
          "Dor à compressão lateral do calcâneo com aumento de carga sugere fratura por estresse, que exige avaliação médica e imagem.",
      },
      {
        id: "dor-no-halux",
        question:
          "Caso fictício: durante o Windlass, a pessoa refere dor apenas na articulação do hálux, sem dor no calcanhar. Como registrar?",
        choices: [
          "Windlass sem reprodução da dor no calcanhar; investigar a metatarsofalângica do hálux separadamente.",
          "Windlass positivo para fasciopatia.",
          "Ruptura da fáscia plantar confirmada.",
        ],
        correct: 0,
        explanation:
          "A resposta positiva é dor na origem da fáscia. Dor no hálux aponta para outra estrutura e deve ser avaliada à parte.",
      },
    ],
  },
  {
    id: "lunge-dorsiflexao",
    name: "Teste de lunge com carga",
    aliases: [
      "Weight-Bearing Lunge Test",
      "WBLT",
      "Joelho na parede",
      "Knee-to-wall test",
    ],
    category: "tornozelo",
    kind: "mobilidade",
    region: "Tornozelo · dorsiflexão talocrural",
    position:
      "Paciente em pé, de frente para a parede, com o pé testado à frente e o outro atrás; examinador ao lado, com fita métrica no chão ou inclinômetro na tíbia.",
    summary:
      "Avanço do joelho em direção à parede com o calcanhar no chão para medir a amplitude de dorsiflexão do tornozelo em carga.",
    purpose:
      "Medir a dorsiflexão em carga, posição mais próxima de agachar, subir escadas e correr. O resultado pode ser registrado pela distância entre o hálux e a parede (cm) ou pelo ângulo da tíbia em relação à vertical (graus). É útil para comparar lados e acompanhar a evolução após entorses, imobilizações ou fraturas.",
    indications: [
      "Rigidez do tornozelo após entorse, imobilização ou fratura consolidada.",
      "Dor no tornozelo, joelho ou pé em que a dorsiflexão limitada possa contribuir para a sobrecarga.",
      "Acompanhamento da mobilidade ao longo da reabilitação, comparando com o outro lado.",
    ],
    safety: [
      "Conteúdo educativo: explique o teste, obtenha consentimento e pratique com formação e supervisão.",
      "Não faça o teste com carga após trauma recente sem antes aplicar as regras de Ottawa e respeitar restrições de apoio após fratura ou cirurgia.",
      "Pare se houver dor intensa, apreensão ou falseio. Ofereça apoio das mãos na parede para segurança.",
      "Dor, calor e edema na panturrilha após imobilização exigem avaliação médica por suspeita de trombose venosa profunda antes de testes em carga.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa de frente para a parede, coloque o pé testado à frente, alinhado perpendicularmente à parede, e o outro atrás para equilíbrio. As mãos podem apoiar na parede.",
        cue: "O hálux e o centro do calcanhar ficam sobre uma linha marcada no chão.",
      },
      {
        title: "Avançar o joelho",
        text: "Peça que a pessoa leve o joelho da frente em direção à parede, mantendo o calcanhar no chão, até o joelho tocar a parede.",
        cue: "Joelho alinhado sobre o segundo dedo, sem cair para dentro.",
      },
      {
        title: "Ajustar a distância",
        text: "Se o joelho tocar com facilidade, afaste o pé da parede; se o calcanhar levantar, aproxime. Repita até achar a maior distância em que o joelho toca sem o calcanhar sair do chão.",
        cue: "Coloque um dedo ou papel sob o calcanhar para perceber quando ele levanta.",
      },
      {
        title: "Medir",
        text: "Meça a distância do hálux à parede em centímetros, ou o ângulo da tíbia em relação à vertical com inclinômetro. Faça três tentativas e use a média.",
        cue: "Use sempre o mesmo método (cm ou graus) nas reavaliações.",
      },
      {
        title: "Comparar e registrar",
        text: "Repita no outro lado e registre os valores, a diferença entre lados e onde apareceu dor ou tensão (anterior, posterior).",
        cue: "Dor anterior no fim da amplitude e restrição de tensão posterior são achados diferentes.",
      },
    ],
    interpretation: [
      {
        title: "Achado relevante",
        text: "Valor menor no lado afetado do que no não afetado indica limitação de dorsiflexão em carga, que pode ser alvo de reabilitação.",
      },
      {
        title: "Mudança real",
        text: "Diferenças entre medidas menores que o erro do teste podem ser apenas variação; procure mudanças maiores que a mudança mínima detectável ao acompanhar a evolução.",
      },
      {
        title: "Armadilhas",
        text: "Calcanhar que levanta, pronação do pé, joelho que cai para dentro ou rotação do pé aumentam artificialmente o valor.",
      },
      {
        title: "O que o teste não diz",
        text: "Não identifica a causa da limitação (articular, capsular, muscular, dor ou bloqueio ósseo anterior) e não é diagnóstico de lesão.",
      },
    ],
    reasoning: [
      "Dor posterior e sensação de tensão sugerem limitação de partes moles; dor anterior em pinçamento sugere bloqueio ou impacto anterior.",
      "Compare com o lado não afetado; valores de referência populacionais variam conforme o método e a população.",
      "Após entorse, dor no lunge na região anterior entre tíbia e fíbula pode indicar lesão da sindesmose; complemente com squeeze e rotação externa.",
      "Relacione o resultado com tarefas funcionais como agachamento, descida de escadas e aterrissagem.",
    ],
    caution:
      "Um lunge reduzido isolado não indica qual estrutura limita o movimento nem confirma lesão.",
    mistakes: [
      "Deixar o calcanhar sair do chão e registrar a maior distância.",
      "Permitir que o joelho caia para dentro ou que o pé gire para fora.",
      "Comparar medidas em centímetros com medidas em graus.",
      "Interpretar pequenas diferenças entre sessões como progresso real.",
    ],
    record:
      "Exemplo fictício: 8 semanas após fratura de tornozelo D consolidada, com liberação para carga. Lunge (média de três tentativas): D 6 cm, E 11 cm. Tensão posterior na panturrilha D, sem dor anterior. Plano: mobilidade e fortalecimento; reavaliar com o mesmo método.",
    related: [
      "talocrural",
      "talus",
      "tibia",
      "fibula",
      "soleo",
      "gastrocnemio",
      "tendao-calcaneo",
    ],
    sources: [
      "tp-lunge-revisao",
      "tp-lunge-bennell",
      "tp-sindesmose-meta",
      "tp-jospt-entorse-lateral",
    ],
    executionNote:
      "Os valores do registro são fictícios e não são valores de referência. Compare com o lado oposto e com medidas anteriores feitas pelo mesmo método.",
    evidence: {
      text: "Uma revisão sistemática de 12 estudos encontrou boa confiabilidade interexaminador (ICC 0,80–0,99) e intraexaminador (ICC 0,65–0,99) do lunge com carga. A mudança mínima detectável média foi de 4,6° ou 1,6 cm entre examinadores e de 4,7° ou 1,9 cm para o mesmo examinador. Os estudos incluíram principalmente pessoas saudáveis; não foram conferidos aqui valores normativos para uso como ponto de corte.",
      source: "tp-lunge-revisao",
    },
    review: [
      "Sei manter o calcanhar no chão e o joelho alinhado.",
      "Sei medir em cm ou em graus, sem misturar os métodos.",
      "Sei comparar com o outro lado e usar a média de três tentativas.",
      "Sei que pequenas diferenças podem estar dentro do erro do teste.",
    ],
    cases: [
      {
        id: "pouca-mudanca",
        question:
          "Caso fictício: o lunge passou de 8 cm para 9 cm em duas semanas, medido pelo mesmo examinador. Como interpretar?",
        choices: [
          "Melhora clara e definitiva da mobilidade.",
          "A diferença pode estar dentro do erro de medida; continuar acompanhando.",
          "Piora da mobilidade.",
        ],
        correct: 1,
        explanation:
          "Mudanças menores que a mudança mínima detectável (cerca de 1,9 cm para o mesmo examinador na revisão citada) podem ser variação da medida.",
      },
      {
        id: "calcanhar",
        question:
          "Caso fictício: ao registrar 14 cm, o examinador percebe que o calcanhar se elevou no final. O que fazer?",
        choices: [
          "Manter o valor, pois o joelho tocou a parede.",
          "Somar 2 cm para compensar.",
          "Repetir aproximando o pé até o joelho tocar com o calcanhar no chão.",
        ],
        correct: 2,
        explanation:
          "O calcanhar elevado invalida a medida. O valor correto é a maior distância com o calcanhar apoiado.",
      },
      {
        id: "dor-sindesmose",
        question:
          "Caso fictício: no 3º dia após entorse em rotação externa, o lunge provoca dor anterior entre tíbia e fíbula, acima da articulação. Qual próximo passo é mais adequado?",
        choices: [
          "Completar com squeeze, rotação externa e palpação da sindesmose, após aplicar as regras de Ottawa.",
          "Insistir no lunge até a dor passar.",
          "Concluir que é encurtamento do sóleo.",
        ],
        correct: 0,
        explanation:
          "Dor no lunge nessa região pode indicar lesão da sindesmose. Os testes específicos e as regras de Ottawa ajudam a decidir o encaminhamento.",
      },
    ],
  },
];
