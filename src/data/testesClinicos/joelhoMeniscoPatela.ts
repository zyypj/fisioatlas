import type { ClinicalTest } from "../clinicalTests";

export const joelhoMeniscoPatelaSources: {
  id: string;
  name: string;
  url: string;
  note: string;
}[] = [
  {
    id: "jm-menisco-statpearls",
    name: "Raj e Bubnis — Lesões meniscais do joelho, StatPearls (2023)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK431067/",
    note: "Revisão clínica sobre mecanismo, quadro clínico, exame físico e conduta inicial nas lesões meniscais.",
  },
  {
    id: "jm-hegedus-menisco",
    name: "Hegedus et al. — Testes físicos para lesão meniscal: revisão sistemática com metanálise (2007)",
    url: "https://pubmed.ncbi.nlm.nih.gov/17939613/",
    note: "Metanálise de 18 estudos: McMurray, Apley e dor na interlinha com acurácia moderada e grande heterogeneidade entre estudos.",
  },
  {
    id: "jm-smith-menisco",
    name: "Smith et al. — Testes especiais para lesão meniscal: revisão sistemática e metanálise (2015)",
    url: "https://pubmed.ncbi.nlm.nih.gov/25724195/",
    note: "Atualiza a síntese de McMurray, dor na interlinha e Thessaly a 20°, destacando a baixa qualidade metodológica dos estudos.",
  },
  {
    id: "jm-thessaly-original",
    name: "Karachalios et al. — Teste de Thessaly para detecção precoce de lesão meniscal (2005)",
    url: "https://pubmed.ncbi.nlm.nih.gov/15866956/",
    note: "Estudo que descreveu o Thessaly a 5° e 20°, com alta acurácia em amostra que incluía voluntários assintomáticos.",
  },
  {
    id: "jm-thessaly-encaminhados",
    name: "Harrison et al. — Validação do teste de Thessaly em pacientes encaminhados para artroscopia (2009)",
    url: "https://pubmed.ncbi.nlm.nih.gov/19124977/",
    note: "Descreve o apoio pelas mãos do examinador e encontra alta acurácia em centro de referência, com aplicabilidade limitada a outras populações.",
  },
  {
    id: "jm-thessaly-atencao-primaria",
    name: "Snoeker et al. — Thessaly, agachamento profundo e dor na interlinha na atenção primária (2015)",
    url: "https://pubmed.ncbi.nlm.nih.gov/26161628/",
    note: "Em pacientes não selecionados da atenção primária, Thessaly teve confiabilidade moderada e acurácia insuficiente; a palpação da interlinha teve baixa concordância entre examinadores.",
  },
  {
    id: "jm-blyth-hta",
    name: "Blyth et al. — Acurácia do Thessaly, da história e de outros testes meniscais comparados à RM (2015)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4780912/",
    note: "Estudo prospectivo em que nenhum teste físico, isolado, teve acurácia suficiente para substituir a investigação por imagem.",
  },
  {
    id: "jm-escore-composto",
    name: "Lowery et al. — Escore clínico composto para lesão meniscal (2006)",
    url: "https://pubmed.ncbi.nlm.nih.gov/17084293/",
    note: "Mostra que somar história de travamento, dor em hiperextensão e flexão máxima, McMurray e dor na interlinha aumenta o valor preditivo, que cai na presença de lesão do LCA.",
  },
  {
    id: "jm-instabilidade-patelar-statpearls",
    name: "Wolfe e Varacallo — Instabilidade patelar, StatPearls (2023)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK482427/",
    note: "Revisão sobre fatores de risco, exame físico e investigação da instabilidade e luxação lateral da patela.",
  },
  {
    id: "jm-apreensao-revisao",
    name: "Abelleyra Lastoria et al. — Validade do teste de apreensão patelar: revisão sistemática (2023)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10362729/",
    note: "Revisão de 34 estudos: o teste parece útil para hipótese provisória, mas a confiabilidade varia muito por ser subjetivo.",
  },
  {
    id: "jm-instabilidade-testes",
    name: "Smith et al. — Testes clínicos e medidas de desfecho na instabilidade patelar (2008)",
    url: "https://pubmed.ncbi.nlm.nih.gov/18328714/",
    note: "Revisão que encontrou poucos estudos de acurácia para os testes de instabilidade patelar, incluindo o de apreensão.",
  },
  {
    id: "jm-clarke-validade",
    name: "Doberstein et al. — Valor diagnóstico do sinal de Clarke na condromalácia patelar (2008)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2267328/",
    note: "Em 106 pessoas sem história de dor patelofemoral, o sinal de Clarke teve acurácia insatisfatória contra a artroscopia.",
  },
  {
    id: "jm-testes-dpf",
    name: "Nunes et al. — Testes clínicos para dor patelofemoral: revisão sistemática com metanálise (2013)",
    url: "https://pubmed.ncbi.nlm.nih.gov/23232069/",
    note: "Revisão de testes para dor patelofemoral; nenhum teste isolado mostrou evidência clara de bom desempenho diagnóstico.",
  },
  {
    id: "jm-cpg-dpf",
    name: "Willy et al. — Diretriz JOSPT: dor patelofemoral (2019)",
    url: "https://pubmed.ncbi.nlm.nih.gov/31475628/",
    note: "Diretriz que caracteriza a dor patelofemoral pela dor ao redor ou atrás da patela, agravada por atividades com carga como agachar e subir escadas.",
  },
];

export const joelhoMeniscoPatelaTests: ClinicalTest[] = [
  {
    id: "mcmurray",
    name: "Teste de McMurray",
    aliases: [
      "McMurray",
      "McMurray test",
      "Manobra de McMurray",
      "Teste de rotação e extensão do joelho",
    ],
    category: "joelho",
    kind: "meniscal",
    region: "Joelho · meniscos medial e lateral",
    position:
      "Paciente em decúbito dorsal, relaxado; examinador ao lado do membro testado, com uma mão sobre a interlinha articular e a outra segurando o calcanhar.",
    summary:
      "A partir da flexão máxima do joelho, o examinador roda a tíbia e estende o joelho para tentar reproduzir dor ou estalido doloroso na interlinha articular.",
    purpose:
      "Provocar o corno posterior dos meniscos, que fica comprimido entre fêmur e tíbia na flexão profunda. A rotação externa da tíbia durante a extensão tende a solicitar o menisco medial; a rotação interna, o menisco lateral. O resultado compõe a hipótese de lesão meniscal junto com a história e outros achados.",
    indications: [
      "Dor localizada na interlinha medial ou lateral após torção do joelho com o pé apoiado.",
      "Queixa de travamento, estalido doloroso ou sensação de algo 'prendendo' dentro do joelho.",
      "Comparação entre lados e reavaliação quando a flexão profunda é tolerada.",
    ],
    safety: [
      "Explique a manobra e obtenha consentimento. Pratique com formação e supervisão; o teste não estabelece diagnóstico sozinho.",
      "Evite ou adapte em derrame volumoso agudo, dor intensa à flexão, pós-operatório recente ou suspeita de fratura; não force a flexão máxima.",
      "Joelho bloqueado em flexão, sem conseguir estender (bloqueio mecânico verdadeiro), deve ser encaminhado para avaliação ortopédica em vez de repetidamente testado.",
      "Inchaço rápido nas primeiras horas após o trauma, incapacidade de apoiar o peso ou dor óssea localizada sugerem lesão importante ou fratura e pedem avaliação médica antes de testes provocativos.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa deitada de barriga para cima, flexione passivamente o quadril e o joelho até a flexão máxima tolerada. Coloque o polegar e os dedos de uma mão sobre as interlinhas medial e lateral e segure o calcanhar com a outra.",
        cue: "Comece pelo lado menos sintomático para a pessoa conhecer a manobra.",
      },
      {
        title: "Testar o menisco medial",
        text: "Mantendo a flexão, rode externamente a tíbia (ponta do pé para fora) e estenda o joelho lentamente até cerca de 90° de flexão. Algumas descrições acrescentam leve estresse em valgo.",
        cue: "Sinta a interlinha medial durante todo o arco; registre se usou valgo.",
      },
      {
        title: "Testar o menisco lateral",
        text: "Retorne à flexão máxima, rode internamente a tíbia (ponta do pé para dentro) e estenda novamente o joelho de forma lenta. Algumas descrições acrescentam leve estresse em varo.",
        cue: "Agora atenção à interlinha lateral; mantenha a rotação durante a extensão.",
      },
      {
        title: "Perguntar e localizar",
        text: "Pergunte se surgiu dor e se é a mesma da queixa. Observe se houve estalido ou ressalto palpável na interlinha, em que lado e em que parte do arco.",
        cue: "Diferencie estalido palpável na interlinha de ruídos patelares ou tendíneos.",
      },
      {
        title: "Comparar e registrar",
        text: "Repita poucas vezes se necessário, compare com o outro joelho e descreva a variante usada (rotação, varo/valgo, amplitude).",
        cue: "Repetições excessivas aumentam a dor e confundem a interpretação.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo",
        text: "Dor na interlinha que reproduz a queixa, sobretudo acompanhada de estalido ou ressalto palpável na mesma interlinha, aumenta a suspeita de lesão do menisco correspondente.",
      },
      {
        title: "Resultado negativo",
        text: "Ausência de dor ou estalido não exclui lesão meniscal: a sensibilidade é limitada, e lesões em certas regiões do menisco podem não ser provocadas pela manobra.",
      },
      {
        title: "Armadilhas",
        text: "Estalidos indolores são comuns em joelhos saudáveis. Dor por limitação da flexão, osteoartrite ou dor patelofemoral pode ser confundida com resposta meniscal.",
      },
      {
        title: "O que o teste não diz",
        text: "Não define tipo, tamanho ou estabilidade da lesão, nem se há indicação cirúrgica. A relação entre lado da rotação e menisco afetado nem sempre é exata.",
      },
    ],
    reasoning: [
      "Valorize a combinação: história de torção com o pé fixo, travamento ou falseio, dor localizada na interlinha e McMurray doloroso no mesmo lado formam um quadro mais coerente do que qualquer teste isolado.",
      "Escores compostos que somam história de travamento, dor em hiperextensão e na flexão máxima, McMurray e dor na interlinha aumentam a probabilidade de lesão quanto mais itens são positivos; uma lesão de LCA associada reduz esse valor preditivo.",
      "Examine sempre ligamentos (Lachman, estresse em varo/valgo): lesões meniscais acompanham com frequência lesões do LCA e do ligamento colateral tibial.",
      "Em pessoas mais velhas, alterações meniscais degenerativas e osteoartrite são comuns; considere a idade e o padrão da dor antes de atribuir os sintomas ao menisco.",
      "Imagem deve responder a uma pergunta clínica que mude a conduta, não apenas confirmar um McMurray positivo.",
    ],
    caution:
      "Um McMurray positivo isolado não confirma lesão meniscal nem indica cirurgia; um negativo não a exclui.",
    mistakes: [
      "Não partir da flexão máxima, deixando de comprimir o corno posterior.",
      "Soltar a rotação da tíbia durante a extensão.",
      "Chamar de positivo qualquer estalido indolor ou ruído vindo da patela.",
      "Não registrar a variante usada, dificultando comparar reavaliações.",
    ],
    record:
      "Exemplo fictício: McMurray à direita com rotação externa — dor na interlinha medial posterior reproduzindo a queixa, com estalido palpável próximo de 100° de flexão. Rotação interna sem dor. Joelho esquerdo sem alterações. Registrar também história de torção, dor na interlinha e exame ligamentar.",
    related: [
      "menisco-medial",
      "menisco-lateral",
      "joelho",
      "femur",
      "tibia",
      "ligamentos-meniscotibiais",
      "ligamento-colateral-tibial",
      "ligamento-cruzado-anterior",
    ],
    sources: [
      "jm-hegedus-menisco",
      "jm-smith-menisco",
      "jm-escore-composto",
      "jm-menisco-statpearls",
    ],
    evidence: {
      text: "Uma metanálise de 18 estudos (até 2006) estimou sensibilidade de 70% e especificidade de 71% para o McMurray, com resultados muito heterogêneos, atribuídos a diferenças na forma de executar e interpretar o teste. Uma revisão posterior, com 9 estudos de baixa qualidade metodológica, encontrou sensibilidade de 61% e especificidade de 84%. Os valores variam com a população, a variante e o padrão de referência (artroscopia ou ressonância).",
      source: "jm-hegedus-menisco",
    },
    review: [
      "Sei por que o teste começa na flexão máxima.",
      "Sei qual rotação tibial associo a cada menisco e que essa relação não é absoluta.",
      "Sei diferenciar estalido doloroso na interlinha de estalido indolor ou patelar.",
      "Sei combinar história, dor na interlinha e McMurray em vez de decidir por um teste.",
      "Sei reconhecer joelho bloqueado e trauma com sinais de fratura como motivos de encaminhamento.",
    ],
    cases: [
      {
        id: "mcmurray-combinacao",
        question:
          "Caso fictício: jogador de futsal torceu o joelho com o pé fixo, relata travamentos ocasionais, tem dor à palpação da interlinha medial e o McMurray com rotação externa reproduz a dor com estalido medial. Qual interpretação é mais adequada?",
        choices: [
          "Lesão do menisco medial confirmada; indicar cirurgia.",
          "Conjunto coerente com hipótese de lesão do menisco medial; integrar com exame ligamentar e decidir a conduta.",
          "McMurray só é válido se ambos os lados forem positivos.",
        ],
        correct: 1,
        explanation:
          "A convergência de história, palpação e teste fortalece a hipótese, mas não confirma o diagnóstico nem define a conduta sozinha.",
      },
      {
        id: "mcmurray-estalido-indolor",
        question:
          "Caso fictício: durante o McMurray, ouve-se um estalido anterior sem dor, que parece vir da patela. Como registrar?",
        choices: [
          "Estalido indolor sem reprodução da queixa; não caracteriza achado meniscal.",
          "McMurray positivo para menisco lateral.",
          "Lesão condral patelar confirmada.",
        ],
        correct: 0,
        explanation:
          "Estalidos indolores e de origem patelar são comuns e não equivalem a resposta meniscal positiva.",
      },
      {
        id: "mcmurray-bloqueio",
        question:
          "Caso fictício: após uma torção, o joelho ficou preso em cerca de 30° de flexão e a pessoa não consegue estendê-lo nem ativa nem passivamente. Qual a prioridade?",
        choices: [
          "Fazer McMurray repetidas vezes para tentar destravar.",
          "Alongar o joelho em extensão até liberar o movimento.",
          "Encaminhar para avaliação ortopédica, sem insistir em testes provocativos.",
        ],
        correct: 2,
        explanation:
          "Bloqueio mecânico verdadeiro pode indicar fragmento meniscal deslocado (por exemplo, lesão em alça de balde) e merece avaliação especializada.",
      },
    ],
  },
  {
    id: "thessaly",
    name: "Teste de Thessaly",
    aliases: [
      "Thessaly test",
      "Teste de Thessaly a 5° e 20°",
      "Teste de rotação em apoio unipodal",
    ],
    category: "joelho",
    kind: "meniscal",
    region: "Joelho · meniscos medial e lateral",
    position:
      "Paciente em pé, descalço, apoiado apenas no membro testado; examinador à sua frente, segurando as duas mãos estendidas da pessoa.",
    summary:
      "Em apoio unipodal com o joelho levemente flexionado, a pessoa roda o tronco e o joelho para dentro e para fora, buscando reproduzir dor ou travamento na interlinha articular.",
    purpose:
      "Aplicar carga axial e rotação ao joelho em apoio, situação parecida com o mecanismo de lesão meniscal. O teste é feito primeiro a 5° e depois a 20° de flexão; a 20° a carga sobre os meniscos é maior. Contribui para a hipótese de lesão meniscal, sem substituir a avaliação completa.",
    indications: [
      "Suspeita de lesão meniscal em quem consegue apoiar o peso no membro afetado com segurança.",
      "Dor na interlinha ou travamento relacionados a giros e mudanças de direção com o pé apoiado.",
      "Complemento a testes sem carga, como McMurray e palpação da interlinha.",
    ],
    safety: [
      "Risco de queda: o examinador deve segurar firmemente as duas mãos da pessoa durante toda a manobra, com espaço livre ao redor; não faça o teste sem esse apoio.",
      "Não realize se a pessoa não consegue apoiar o peso no membro, se há derrame volumoso agudo, falseio franco por instabilidade ligamentar, suspeita de fratura ou pós-operatório recente.",
      "Interrompa ao primeiro sinal de dor intensa, travamento ou perda de equilíbrio; não insista nas rotações.",
      "Trauma com incapacidade de dar alguns passos, dor óssea localizada ou inchaço rápido nas primeiras horas pede avaliação médica antes do teste. Pratique com formação e supervisão.",
    ],
    steps: [
      {
        title: "Preparar e apoiar",
        text: "Posicione-se à frente da pessoa e segure suas duas mãos estendidas. Peça que fique em pé, descalça, apoiada apenas no membro a ser testado, com o pé inteiro no chão.",
        cue: "Teste primeiro o lado sem queixa para ensinar o movimento e observar o equilíbrio.",
      },
      {
        title: "Flexionar a 5°",
        text: "Peça uma flexão discreta do joelho, cerca de 5°. Com o pé fixo, a pessoa roda o tronco e o joelho para dentro e para fora três vezes, de forma controlada.",
        cue: "O pé não deve girar no chão; a rotação acontece no joelho e no quadril.",
      },
      {
        title: "Flexionar a 20°",
        text: "Repita a sequência com o joelho a cerca de 20° de flexão, mantendo o pé fixo e o apoio das mãos.",
        cue: "Observe se o ângulo se mantém; flexão excessiva muda a carga e o equilíbrio.",
      },
      {
        title: "Perguntar e localizar",
        text: "Pergunte se surgiu dor na interlinha medial ou lateral, sensação de travamento ou de algo prendendo, e se isso corresponde à queixa.",
        cue: "Dor difusa ou anterior ao redor da patela não é a resposta procurada.",
      },
      {
        title: "Comparar e registrar",
        text: "Compare com o outro lado e registre ângulo, lado da dor, sintomas mecânicos e se houve necessidade de interromper.",
        cue: "Registre a ocorrência de desequilíbrio separadamente da dor.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo",
        text: "Dor na interlinha medial ou lateral, ou sensação de travamento ou prendimento, reproduzindo a queixa durante as rotações (especialmente a 20°) aumenta a suspeita de lesão meniscal.",
      },
      {
        title: "Resultado negativo",
        text: "Ausência de dor reduz pouco a probabilidade em vários contextos. Um Thessaly negativo não exclui lesão meniscal.",
      },
      {
        title: "Armadilhas",
        text: "Dor patelofemoral, osteoartrite, sinovite e instabilidade ligamentar também podem doer ou falsear com carga e rotação. Desequilíbrio não é sinônimo de teste positivo.",
      },
      {
        title: "Acurácia variável entre estudos",
        text: "Os primeiros estudos, em amostras com voluntários assintomáticos ou pacientes de centros de referência, mostraram acurácia muito alta. Em atenção primária e em pacientes não selecionados, o desempenho foi bem menor. O valor do teste depende da população em que é usado.",
      },
    ],
    reasoning: [
      "Interprete o Thessaly junto com a história (torção com pé fixo, travamento, derrame tardio) e com a palpação da interlinha e o McMurray; a concordância desses achados no mesmo lado vale mais do que qualquer resposta isolada.",
      "Considere o contexto: o teste parece discriminar melhor em populações selecionadas (encaminhadas para artroscopia) do que em pacientes não selecionados da atenção primária.",
      "Em pessoas com instabilidade do LCA, a rotação em carga pode provocar falseio; examine os ligamentos antes de colocar o joelho em carga rotacional.",
      "Em pessoas mais velhas, dor em carga pode refletir osteoartrite; idade e padrão de dor ajudam a interpretar o achado.",
    ],
    caution:
      "Um Thessaly positivo isolado não confirma lesão meniscal, e um negativo não a exclui, principalmente fora de populações selecionadas.",
    mistakes: [
      "Fazer o teste sem segurar as mãos da pessoa ou em piso escorregadio.",
      "Permitir que o pé gire no chão, perdendo a carga rotacional no joelho.",
      "Pular a etapa de 5° e ir direto a 20°, aumentando a dor e o risco.",
      "Registrar perda de equilíbrio ou dor anterior difusa como teste positivo.",
    ],
    record:
      "Exemplo fictício: Thessaly à esquerda — a 5°, sem dor; a 20°, dor na interlinha lateral reproduzindo a queixa na rotação interna, sem travamento. Lado direito sem dor. Teste feito com apoio bimanual, sem perda de equilíbrio. Registrar também palpação da interlinha, McMurray e exame ligamentar.",
    related: [
      "menisco-medial",
      "menisco-lateral",
      "joelho",
      "femur",
      "tibia",
      "ligamento-cruzado-anterior",
      "ligamentos-meniscotibiais",
    ],
    sources: [
      "jm-thessaly-original",
      "jm-thessaly-encaminhados",
      "jm-thessaly-atencao-primaria",
      "jm-blyth-hta",
    ],
    evidence: {
      text: "No estudo original (213 pacientes sintomáticos e 197 voluntários assintomáticos), o Thessaly a 20° teve acurácia de 94% para o menisco medial e 96% para o lateral. Em 116 pacientes encaminhados para artroscopia, a sensibilidade foi de 90% e a especificidade de 98%. Já em 121 pacientes da atenção primária, com ressonância como referência, a sensibilidade ficou entre 51% e 67% e a especificidade entre 38% e 44%, com concordância moderada entre examinadores (kappa 0,54). A diferença mostra o peso do viés de espectro: o teste rende menos onde a lesão é menos provável e os quadros são mais variados.",
      source: "jm-thessaly-atencao-primaria",
    },
    review: [
      "Sei garantir segurança com apoio bimanual e espaço livre para evitar quedas.",
      "Sei executar as rotações a 5° e depois a 20°, com o pé fixo.",
      "Sei distinguir dor na interlinha de dor anterior difusa ou desequilíbrio.",
      "Sei explicar por que a acurácia varia entre populações e estudos.",
      "Sei quando não fazer o teste (sem apoio de peso, suspeita de fratura, instabilidade franca).",
    ],
    cases: [
      {
        id: "thessaly-instabilidade",
        question:
          "Caso fictício: duas semanas após entorse, a pessoa relata falseios frequentes ao girar e o Lachman sugere lesão do LCA. Você considera o Thessaly. Qual a melhor decisão?",
        choices: [
          "Fazer o teste sem apoio para observar melhor o falseio.",
          "Fazer a 20° direto, pois é o mais preciso.",
          "Priorizar a segurança: avaliar se a carga rotacional é apropriada e, se feita, com apoio firme e interrupção ao primeiro falseio.",
        ],
        correct: 2,
        explanation:
          "Com instabilidade importante, carga em rotação pode provocar falseio e queda. A segurança vem antes do teste.",
      },
      {
        id: "thessaly-atencao-primaria",
        question:
          "Caso fictício: na atenção primária, um adulto com dor difusa no joelho tem Thessaly positivo, sem história de torção, sem travamento e sem dor na interlinha. O que concluir?",
        choices: [
          "Achado isolado de baixo valor nesse contexto; ampliar a avaliação e considerar outras causas.",
          "Lesão meniscal confirmada pela alta acurácia do teste.",
          "Indicar ressonância imediatamente por causa do teste.",
        ],
        correct: 0,
        explanation:
          "Em populações não selecionadas, o teste tem desempenho limitado. Sem história e exame concordantes, um resultado isolado pouco muda a probabilidade.",
      },
      {
        id: "thessaly-combinado",
        question:
          "Caso fictício: atleta relata torção com o pé fixo e travamentos; tem dor na interlinha medial, McMurray doloroso medial e Thessaly a 20° com dor medial. Qual interpretação?",
        choices: [
          "Os testes se anulam; nada pode ser concluído.",
          "Achados convergentes reforçam a hipótese de lesão do menisco medial; integrar com exame ligamentar e definir conduta.",
          "O Thessaly sozinho já define cirurgia.",
        ],
        correct: 1,
        explanation:
          "A concordância entre história e vários achados no mesmo lado dá mais segurança à hipótese do que qualquer teste isolado.",
      },
    ],
  },
  {
    id: "apley",
    name: "Teste de compressão de Apley",
    aliases: [
      "Apley",
      "Apley grind test",
      "Teste de compressão e distração de Apley",
    ],
    category: "joelho",
    kind: "meniscal",
    region: "Joelho · meniscos e estruturas capsuloligamentares",
    position:
      "Paciente em decúbito ventral com o joelho testado flexionado a 90°; examinador ao lado, estabilizando a coxa contra a maca e segurando o pé e o tornozelo.",
    summary:
      "Com a pessoa de bruços e o joelho a 90°, o examinador comprime a tíbia contra o fêmur enquanto a roda; em seguida, traciona a perna com rotação para comparar a resposta.",
    purpose:
      "A compressão axial com rotação carrega os meniscos entre os côndilos femorais e o platô tibial. A distração alivia os meniscos e tensiona estruturas capsuloligamentares, ajudando a diferenciar se a dor vem mais do menisco ou dos ligamentos e da cápsula.",
    indications: [
      "Dor na interlinha articular com suspeita de lesão meniscal.",
      "Necessidade de diferenciar dor meniscal de dor capsuloligamentar (por exemplo, colaterais) quando os achados são ambíguos.",
    ],
    safety: [
      "Explique o procedimento e verifique se a pessoa tolera ficar de bruços e flexionar o joelho a 90°. Pratique com formação e supervisão.",
      "Não aplique compressão em suspeita de fratura, derrame agudo volumoso, pós-operatório recente ou dor intensa; a força deve ser moderada e progressiva.",
      "Estabilize a coxa com a mão, não com o joelho do examinador apoiado com o peso do corpo sobre a parte posterior da coxa.",
      "Calor, vermelhidão, febre ou dor muito desproporcional no joelho exigem avaliação médica antes de qualquer teste provocativo.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa de bruços, flexione o joelho testado a 90°. Estabilize a parte posterior distal da coxa contra a maca com uma mão e segure o pé e o tornozelo com a outra.",
        cue: "A coxa deve ficar apoiada; o quadril não deve rodar junto com a perna.",
      },
      {
        title: "Comprimir e rodar",
        text: "Aplique compressão axial pela planta do pé, empurrando a tíbia em direção ao fêmur, e rode a tíbia interna e externamente algumas vezes, de forma lenta.",
        cue: "Compressão moderada; o objetivo é reproduzir a queixa, não causar dor intensa.",
      },
      {
        title: "Localizar a dor",
        text: "Pergunte se surgiu dor e onde: interlinha medial, lateral ou outra região. Observe se a dor aparece em uma rotação específica.",
        cue: "Peça que aponte o local; dor difusa ou patelar não é o achado procurado.",
      },
      {
        title: "Distrair e rodar",
        text: "Mantendo a coxa estabilizada, tracione a perna para cima, afastando a tíbia do fêmur, e repita as rotações. Compare a dor com a fase de compressão.",
        cue: "Na distração, os meniscos ficam descarregados; dor que surge ou aumenta aqui aponta mais para cápsula e ligamentos.",
      },
      {
        title: "Comparar e registrar",
        text: "Teste o outro lado e registre a resposta em compressão e em distração separadamente, com lado e rotação.",
        cue: "O valor do teste está na comparação entre as duas fases.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo de origem meniscal",
        text: "Dor na interlinha que reproduz a queixa na compressão com rotação e que diminui ou desaparece na distração apoia a hipótese de lesão meniscal no lado da dor.",
      },
      {
        title: "Achado sugestivo de origem capsuloligamentar",
        text: "Dor que aparece ou aumenta na distração com rotação sugere participação de cápsula ou ligamentos, como os colaterais, mais do que dos meniscos.",
      },
      {
        title: "Resultado negativo",
        text: "Ausência de dor não exclui lesão meniscal; a sensibilidade do teste é limitada.",
      },
      {
        title: "O que o teste não diz",
        text: "Não define tipo ou extensão da lesão. Osteoartrite e lesões condrais também doem à compressão, e a diferenciação por distração é apenas orientativa.",
      },
    ],
    reasoning: [
      "Combine achados: história de torção, travamento, dor na interlinha à palpação e McMurray ou Thessaly concordantes no mesmo lado dão mais peso ao Apley de compressão positivo.",
      "Use a fase de distração junto com os testes de estresse em varo e valgo para separar dor meniscal de lesão dos colaterais.",
      "Em pessoas mais velhas com dor em carga e rigidez, considere osteoartrite como explicação para dor à compressão.",
      "Se o exame não converge, registre os achados e reavalie; imagem deve responder a uma pergunta clínica que mude a conduta.",
    ],
    caution:
      "Dor à compressão de Apley, isolada, não confirma lesão meniscal e não distingue com segurança menisco de cartilagem.",
    mistakes: [
      "Não estabilizar a coxa, permitindo rotação do quadril em vez da tíbia.",
      "Usar força excessiva de compressão.",
      "Não realizar a fase de distração e perder a comparação.",
      "Considerar positiva qualquer dor, sem localizar na interlinha.",
    ],
    record:
      "Exemplo fictício: Apley à direita — compressão com rotação externa provoca dor na interlinha medial reproduzindo a queixa; dor desaparece na distração. Esquerdo sem dor. Estresse em valgo a 30° sem dor. Registrar também palpação da interlinha e McMurray.",
    related: [
      "menisco-medial",
      "menisco-lateral",
      "joelho",
      "femur",
      "tibia",
      "ligamento-colateral-tibial",
      "ligamento-colateral-fibular",
    ],
    sources: ["jm-hegedus-menisco", "jm-blyth-hta", "jm-menisco-statpearls"],
    evidence: {
      text: "Na metanálise de 18 estudos, o Apley teve sensibilidade agrupada de 60% e especificidade de 70%, com grande heterogeneidade. Em estudo prospectivo comparado à ressonância, com clínicos da atenção primária, a acurácia do Apley foi de 53%, semelhante à dos demais testes, e nenhum teste físico previu isoladamente o diagnóstico por imagem. O teste é útil como parte do exame, não como confirmação.",
      source: "jm-hegedus-menisco",
    },
    review: [
      "Sei posicionar a pessoa em decúbito ventral com o joelho a 90° e estabilizar a coxa.",
      "Sei aplicar compressão e distração com rotação e comparar as fases.",
      "Sei o que a dor na distração sugere em relação à dor na compressão.",
      "Sei que o Apley tem acurácia limitada e precisa ser integrado a outros achados.",
    ],
    cases: [
      {
        id: "apley-distracao",
        question:
          "Caso fictício: a compressão com rotação não provoca dor, mas a distração com rotação externa causa dor na face medial do joelho. O estresse em valgo também dói. Qual hipótese é mais provável?",
        choices: [
          "Participação capsuloligamentar medial, como o ligamento colateral tibial.",
          "Lesão do menisco lateral confirmada.",
          "Teste inválido; repetir com mais força.",
        ],
        correct: 0,
        explanation:
          "Dor na distração e no estresse em valgo aponta mais para estruturas capsuloligamentares do que para o menisco.",
      },
      {
        id: "apley-artrose",
        question:
          "Caso fictício: pessoa de 68 anos com rigidez matinal curta e dor ao subir escadas tem dor medial na compressão de Apley. Qual cuidado na interpretação?",
        choices: [
          "Atribuir a dor certamente a ruptura traumática do menisco.",
          "Considerar osteoartrite e alterações degenerativas como explicação possível; integrar com história e exame.",
          "Descartar qualquer participação meniscal.",
        ],
        correct: 1,
        explanation:
          "Com a idade, alterações degenerativas e osteoartrite também doem à compressão. O achado precisa ser contextualizado.",
      },
      {
        id: "apley-alerta",
        question:
          "Caso fictício: joelho quente, avermelhado e muito inchado, com febre e dor intensa até em repouso, sem trauma. Qual a conduta adequada?",
        choices: [
          "Realizar o Apley para identificar o menisco afetado.",
          "Aplicar compressão leve e repetir em uma semana.",
          "Encaminhar para avaliação médica urgente, sem testes provocativos.",
        ],
        correct: 2,
        explanation:
          "Esse quadro pode indicar artrite séptica ou outra condição inflamatória grave, que exige avaliação urgente.",
      },
    ],
  },
  {
    id: "dor-interlinha-articular",
    name: "Dor à palpação da interlinha articular",
    aliases: [
      "Joint line tenderness",
      "JLT",
      "Palpação da interlinha articular",
      "Sensibilidade na interlinha",
    ],
    category: "joelho",
    kind: "meniscal",
    region: "Joelho · interlinha femorotibial medial e lateral",
    position:
      "Paciente em decúbito dorsal com o joelho flexionado a cerca de 90° e o pé apoiado na maca (ou sentado com a perna pendente); examinador à frente ou ao lado do joelho.",
    summary:
      "Palpação sistemática da interlinha entre fêmur e tíbia, de anterior para posterior, nos lados medial e lateral, buscando dor localizada que reproduza a queixa.",
    purpose:
      "A borda externa dos meniscos fica próxima da interlinha; dor localizada nesse ponto pode refletir lesão meniscal ou irritação da cápsula adjacente. A palpação é simples, mas precisa ser precisa e comparada com o outro lado para ter valor.",
    indications: [
      "Qualquer suspeita de lesão meniscal, como parte do exame inicial do joelho.",
      "Localizar a dor relatada (medial ou lateral, anterior ou posterior) antes dos testes provocativos.",
    ],
    safety: [
      "Explique a palpação e use pressão progressiva. Pratique com formação e supervisão.",
      "Dor óssea localizada após trauma (cabeça da fíbula, patela, platô tibial) ou incapacidade de apoiar o peso pede avaliação para fratura antes de prosseguir com o exame.",
      "Calor, vermelhidão, febre ou inchaço importante sem trauma exigem avaliação médica rápida.",
      "Dor na panturrilha com inchaço, especialmente após cirurgia ou imobilização, pode indicar trombose venosa profunda e requer encaminhamento.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Flexione o joelho a cerca de 90° com o pé apoiado. Nessa posição, a interlinha fica mais acessível e o tendão patelar serve de referência central.",
        cue: "Músculos relaxados facilitam a palpação.",
      },
      {
        title: "Localizar a interlinha",
        text: "A partir das bordas do ligamento patelar, deslize os dedos para os lados até sentir o sulco entre côndilo femoral e platô tibial. Rodar levemente a tíbia pode ajudar a identificar a borda do platô.",
        cue: "Confirme que está na interlinha, não acima (côndilo) nem abaixo (tíbia).",
      },
      {
        title: "Palpar o lado medial",
        text: "Pressione a interlinha medial de anterior para posterior, até a região posteromedial. Pergunte se algum ponto reproduz a dor habitual.",
        cue: "A dor posteromedial é frequente nas lesões do menisco medial.",
      },
      {
        title: "Palpar o lado lateral",
        text: "Repita na interlinha lateral, de anterior para posterior, cuidando para diferenciar o ligamento colateral fibular e o tendão do poplíteo.",
        cue: "Use a mesma pressão nos dois lados e em ambos os joelhos.",
      },
      {
        title: "Comparar e registrar",
        text: "Compare com o joelho contralateral e registre o local exato da dor, a intensidade e se reproduz a queixa.",
        cue: "Desenhar ou descrever o ponto ajuda nas reavaliações.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo",
        text: "Dor localizada na interlinha, que reproduz a queixa e não aparece no outro joelho, aumenta a suspeita de lesão do menisco daquele lado.",
      },
      {
        title: "Resultado negativo",
        text: "Ausência de dor diminui a suspeita em alguns contextos, mas não exclui lesão meniscal.",
      },
      {
        title: "Armadilhas",
        text: "Osteoartrite e osteófitos, lesão do ligamento colateral tibial, bursite da pata de ganso (abaixo da interlinha medial), trato iliotibial (acima da interlinha lateral) e coxim adiposo também doem à palpação.",
      },
      {
        title: "O que o teste não diz",
        text: "Não define se há ruptura, seu tipo ou extensão. A concordância entre examinadores pode ser baixa, e o achado depende de localizar corretamente a interlinha.",
      },
    ],
    reasoning: [
      "A dor na interlinha ganha valor quando combina com história de torção com pé fixo, travamento ou sensação de prendimento e com McMurray ou Thessaly no mesmo lado.",
      "Escores compostos que incluem a palpação da interlinha com história e outros testes discriminam melhor do que a palpação sozinha.",
      "Diferencie de dor no trajeto do ligamento colateral tibial com o estresse em valgo, e de bursite da pata de ganso pela localização mais distal.",
      "Em quadros com lesão do LCA, a dor na interlinha pode ter outras origens (contusão óssea, sinovite); interprete com cautela.",
    ],
    caution:
      "Dor à palpação da interlinha, isolada, não confirma lesão meniscal; várias estruturas próximas também doem.",
    mistakes: [
      "Palpar acima ou abaixo da interlinha, sobre côndilo ou tíbia.",
      "Usar pressão diferente entre lados ou joelhos.",
      "Não comparar com o joelho contralateral.",
      "Ignorar osteoartrite, colateral tibial e pata de ganso como diferenciais.",
    ],
    record:
      "Exemplo fictício: dor à palpação da interlinha medial posterior direita, reproduzindo a queixa, intensidade 5/10; interlinha lateral e joelho esquerdo sem dor. Estresse em valgo sem dor; pata de ganso indolor. Registrar também McMurray e Thessaly.",
    related: [
      "menisco-medial",
      "menisco-lateral",
      "joelho",
      "tibia",
      "femur",
      "ligamento-colateral-tibial",
      "ligamento-colateral-fibular",
      "popliteo",
    ],
    sources: [
      "jm-smith-menisco",
      "jm-hegedus-menisco",
      "jm-thessaly-atencao-primaria",
      "jm-escore-composto",
    ],
    evidence: {
      text: "Uma metanálise de 18 estudos estimou sensibilidade de 63% e especificidade de 77% para a dor na interlinha, com alta heterogeneidade. Uma revisão posterior, com 9 estudos de baixa qualidade, encontrou sensibilidade e especificidade de 83%. Em pacientes da atenção primária, a concordância entre fisioterapeutas treinados foi tão baixa que a acurácia nem foi calculada. Os números variam conforme população, técnica e referência usada.",
      source: "jm-smith-menisco",
    },
    review: [
      "Sei encontrar a interlinha a partir das bordas do ligamento patelar.",
      "Sei palpar de anterior para posterior nos lados medial e lateral.",
      "Sei listar estruturas próximas que também doem à palpação.",
      "Sei que a concordância entre examinadores pode ser baixa e por isso comparo lados e registro o ponto exato.",
    ],
    cases: [
      {
        id: "interlinha-pata-ganso",
        question:
          "Caso fictício: a dor está alguns centímetros abaixo da interlinha medial, na face anteromedial da tíbia, e a interlinha em si é indolor. Qual hipótese considerar?",
        choices: [
          "Lesão do menisco lateral.",
          "Bursite ou tendinopatia da pata de ganso, entre outros diferenciais.",
          "Lesão do LCA confirmada.",
        ],
        correct: 1,
        explanation:
          "A localização abaixo da interlinha aponta para outras estruturas. A palpação precisa ser exata para ter valor.",
      },
      {
        id: "interlinha-fratura",
        question:
          "Caso fictício: após queda de bicicleta, há dor na cabeça da fíbula à palpação e a pessoa não consegue dar quatro passos. Qual a prioridade?",
        choices: [
          "Investigar fratura antes de prosseguir com testes meniscais.",
          "Palpar a interlinha lateral com mais força.",
          "Fazer o Thessaly para avaliar o menisco lateral.",
        ],
        correct: 0,
        explanation:
          "Dor óssea localizada e incapacidade de apoiar o peso após trauma levantam suspeita de fratura, que tem prioridade.",
      },
      {
        id: "interlinha-combinacao",
        question:
          "Caso fictício: dor na interlinha medial, sem história de torção, sem travamento e com McMurray e Thessaly negativos. Como registrar?",
        choices: [
          "Lesão meniscal medial confirmada.",
          "Interlinha normal, pois os testes foram negativos.",
          "Dor na interlinha medial com outros achados meniscais negativos; manter diferenciais abertos.",
        ],
        correct: 2,
        explanation:
          "Um achado isolado, sem convergência com história e outros testes, tem pouco peso. Descreva o que foi encontrado.",
      },
    ],
  },
  {
    id: "apreensao-patelar",
    name: "Teste de apreensão patelar",
    aliases: [
      "Teste de Fairbank",
      "Patellar apprehension test",
      "Sinal de apreensão patelar",
    ],
    category: "joelho",
    kind: "instabilidade",
    region:
      "Joelho · articulação patelofemoral e estabilizadores mediais da patela",
    position:
      "Paciente em decúbito dorsal, quadríceps relaxado, com o joelho apoiado em cerca de 20–30° de flexão; examinador ao lado, com os polegares na borda medial da patela.",
    summary:
      "Com o joelho levemente flexionado e relaxado, o examinador desloca a patela lateralmente e observa se a pessoa demonstra medo de que ela saia do lugar.",
    purpose:
      "Reproduzir o movimento da luxação lateral da patela em uma amplitude em que ela ainda não está encaixada na tróclea. A resposta procurada é a apreensão (medo, contração de defesa), não apenas a dor. Ajuda a investigar instabilidade patelar lateral após episódios de luxação ou subluxação.",
    indications: [
      "Relato de que o joelho 'sai do lugar' ou de luxação ou subluxação lateral prévia da patela.",
      "Falseios com giro e contração do quadríceps, como ao mudar de direção.",
      "Avaliar a evolução da instabilidade ao longo da reabilitação ou após cirurgia, com a mesma técnica.",
    ],
    safety: [
      "Desloque a patela de forma suave e progressiva e pare ao primeiro sinal de apreensão; o objetivo não é provocar uma nova luxação.",
      "Após luxação aguda com inchaço rápido (hemartrose), dor intensa ou suspeita de fragmento osteocondral, adie o teste e encaminhe para avaliação e imagem.",
      "Patela que permanece fora do lugar, deformidade visível ou incapacidade de estender o joelho exige avaliação médica imediata.",
      "Explique o teste antes, obtenha consentimento e combine um sinal para parar. Pratique com formação e supervisão.",
    ],
    steps: [
      {
        title: "Posicionar e relaxar",
        text: "Com a pessoa deitada de barriga para cima, apoie o joelho em cerca de 20–30° de flexão sobre um rolo ou sobre a coxa do examinador. Peça que relaxe completamente o quadríceps.",
        cue: "Quadríceps contraído estabiliza a patela e mascara o teste.",
      },
      {
        title: "Posicionar as mãos",
        text: "Coloque os polegares na borda medial da patela, com os demais dedos apoiados ao redor do joelho. Comece pelo lado sem queixa.",
        cue: "Observe o rosto da pessoa durante toda a manobra.",
      },
      {
        title: "Deslocar lateralmente",
        text: "Empurre a patela lentamente para lateral, em direção à face externa do joelho, sem rotacioná-la.",
        cue: "Movimento lento; pare antes do limite se surgir qualquer reação.",
      },
      {
        title: "Observar a apreensão",
        text: "Procure sinais de medo: expressão de desconforto, contração súbita do quadríceps, tentativa de segurar a mão do examinador ou de retirar a perna, ou relato de que a patela 'vai sair'.",
        cue: "Dor sem apreensão é um achado diferente; registre-a separadamente.",
      },
      {
        title: "Comparar e registrar",
        text: "Retorne a patela à posição, compare com o outro joelho e registre a resposta, a amplitude aproximada de deslocamento e a flexão usada.",
        cue: "Compare também a mobilidade lateral da patela entre os lados.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo",
        text: "Apreensão reproduzindo a sensação que a pessoa relata nos episódios, com contração de defesa do quadríceps, apoia a hipótese de instabilidade patelar lateral.",
      },
      {
        title: "Resultado negativo",
        text: "Ausência de apreensão reduz a suspeita, mas não exclui instabilidade, especialmente se a pessoa estiver tensa ou com dor que impede relaxar.",
      },
      {
        title: "Armadilhas",
        text: "Dor ao toque na borda medial após uma luxação recente pode ser confundida com apreensão. Hipermobilidade patelar sem medo também não equivale a teste positivo.",
      },
      {
        title: "O que o teste não diz",
        text: "Não identifica os fatores anatômicos (tróclea rasa, patela alta, alinhamento) nem a lesão de estruturas mediais; isso exige avaliação complementar e, quando indicado, imagem.",
      },
    ],
    reasoning: [
      "A história é central: mecanismo de giro com o pé fixo e o quadríceps contraído, sensação de que a patela saiu e voltou, e episódios recorrentes.",
      "Após luxação aguda, inchaço rápido sugere hemartrose; nesse contexto, investigar lesões osteocondrais e ligamentares é prioritário em relação ao teste.",
      "Considere fatores predisponentes como frouxidão ligamentar generalizada, patela alta e alterações de alinhamento do membro inferior.",
      "Diferencie da dor patelofemoral sem instabilidade: dor ao agachar e subir escadas, sem episódios de deslocamento, sugere outro quadro.",
      "A subjetividade da resposta reduz a concordância entre examinadores; registre o que observou em vez de apenas 'positivo'.",
    ],
    caution:
      "Um teste de apreensão positivo isolado não confirma instabilidade estrutural nem indica cirurgia; ele depende de interpretação subjetiva.",
    mistakes: [
      "Testar com o joelho em extensão total ou com o quadríceps contraído.",
      "Empurrar a patela com força até o limite, provocando dor ou nova luxação.",
      "Confundir dor localizada com apreensão.",
      "Testar logo após uma luxação aguda com hemartrose, sem avaliação prévia.",
    ],
    record:
      "Exemplo fictício: apreensão patelar à esquerda — com joelho a cerca de 30° e quadríceps relaxado, o deslocamento lateral provocou contração de defesa e relato de que 'vai sair', reproduzindo os episódios. Joelho direito sem apreensão. Registrar história de luxação, mobilidade patelar e alinhamento.",
    related: [
      "patela",
      "femur",
      "retinaculo-patelar-medial",
      "retinaculo-patelar-lateral",
      "vasto-medial",
      "ligamento-patelar",
      "joelho",
    ],
    sources: [
      "jm-apreensao-revisao",
      "jm-instabilidade-testes",
      "jm-instabilidade-patelar-statpearls",
    ],
    evidence: {
      text: "Uma revisão sistemática de 34 estudos (1.139 joelhos) concluiu que o teste parece ter boa sensibilidade e especificidade para instabilidade patelar, mas com confiabilidade intra e interexaminador muito variável por ser subjetivo; recomenda confirmar com avaliação funcional e imagem. Revisão anterior já apontava poucos estudos de acurácia e valores ainda incertos. Trate o teste como apoio à hipótese, não como confirmação.",
      source: "jm-apreensao-revisao",
    },
    review: [
      "Sei por que o joelho fica em cerca de 20–30° de flexão e com quadríceps relaxado.",
      "Sei diferenciar apreensão de dor.",
      "Sei interromper a manobra ao primeiro sinal de apreensão.",
      "Sei quando adiar o teste após luxação aguda e encaminhar.",
      "Sei relacionar o teste à história de episódios de deslocamento.",
    ],
    cases: [
      {
        id: "apreensao-positiva",
        question:
          "Caso fictício: jovem com dois episódios em que a patela 'saiu para fora' ao girar. No teste a 30°, contrai o quadríceps e pede para parar logo no início do deslocamento lateral. Qual a interpretação?",
        choices: [
          "Lesão meniscal lateral provável.",
          "Teste inválido porque houve contração muscular.",
          "Achado coerente com instabilidade patelar lateral; integrar com história e fatores predisponentes.",
        ],
        correct: 2,
        explanation:
          "A contração de defesa e o medo são justamente a resposta procurada; somados à história, apoiam a hipótese de instabilidade.",
      },
      {
        id: "apreensao-hemartrose",
        question:
          "Caso fictício: há 2 horas, a patela saiu do lugar e voltou; o joelho inchou muito rapidamente e está muito doloroso. O que fazer?",
        choices: [
          "Adiar o teste e encaminhar para avaliação, considerando imagem para lesão osteocondral.",
          "Fazer o teste de apreensão para confirmar a luxação.",
          "Deslocar a patela até o limite para avaliar a frouxidão.",
        ],
        correct: 0,
        explanation:
          "Inchaço rápido sugere hemartrose, e pode haver fragmento osteocondral. O teste não acrescenta segurança nesse momento.",
      },
      {
        id: "apreensao-dpf",
        question:
          "Caso fictício: dor ao redor da patela ao agachar e descer escadas, sem episódios de deslocamento. O teste causa leve dor medial, sem medo. Como registrar?",
        choices: [
          "Instabilidade patelar confirmada.",
          "Dor sem apreensão; considerar outras hipóteses, como dor patelofemoral.",
          "Lesão do LCA provável.",
        ],
        correct: 1,
        explanation:
          "Dor sem apreensão não caracteriza teste positivo. A história aponta mais para dor patelofemoral.",
      },
    ],
  },
  {
    id: "clarke",
    name: "Teste de Clarke",
    aliases: [
      "Sinal de Clarke",
      "Compressão patelar",
      "Patellar grind test",
      "Teste de rangido patelar",
    ],
    category: "joelho",
    kind: "provocacao",
    region: "Joelho · articulação patelofemoral",
    position:
      "Paciente em decúbito dorsal com o joelho estendido e relaxado; examinador ao lado, com a borda da mão (entre polegar e indicador) logo acima do polo superior da patela.",
    summary:
      "O examinador mantém pressão suave sobre o polo superior da patela, empurrando-a em direção distal, e pede uma contração do quadríceps para observar se surge dor atrás da patela.",
    purpose:
      "Historicamente usado para provocar dor patelofemoral ou sugerir condromalácia patelar. Hoje é ensinado sobretudo para que o estudante saiba executá-lo e reconhecer suas limitações: tem baixa utilidade diagnóstica e pode causar dor também em pessoas sem dor patelofemoral.",
    indications: [
      "Dor anterior no joelho, ao redor ou atrás da patela, quando o clínico deseja observar a resposta à compressão patelar como achado complementar.",
      "Fins didáticos: conhecer a manobra, suas variantes e por que ela não deve ser usada para diagnosticar sozinha.",
    ],
    safety: [
      "Use pressão leve e avise que pode ser desconfortável. A manobra costuma ser dolorosa mesmo em joelhos sem queixa patelofemoral.",
      "Não aplique em pós-operatório recente, fratura de patela suspeita, luxação recente ou derrame agudo volumoso.",
      "Interrompa ao primeiro desconforto relevante; não sustente a pressão enquanto a pessoa contrai com força.",
      "Pratique com formação e supervisão; o resultado não autoriza diagnóstico de condromalácia.",
    ],
    steps: [
      {
        title: "Posicionar",
        text: "Com a pessoa deitada de barriga para cima e o joelho estendido e relaxado, coloque a borda da mão entre polegar e indicador logo acima do polo superior da patela.",
        cue: "Algumas variantes testam com o joelho em flexão; registre a posição usada.",
      },
      {
        title: "Deslocar distalmente",
        text: "Empurre a patela suavemente em direção ao pé, mantendo uma pressão leve contra a tróclea.",
        cue: "Pressão excessiva provoca dor em quase qualquer joelho.",
      },
      {
        title: "Pedir contração",
        text: "Peça que a pessoa contraia o quadríceps devagar, como se empurrasse a parte de trás do joelho contra a maca, enquanto você mantém a patela.",
        cue: "Contração gradual; uma contração brusca contra a sua mão aumenta o desconforto.",
      },
      {
        title: "Perguntar e observar",
        text: "Pergunte se surgiu dor atrás da patela e se é semelhante à dor das atividades do dia a dia. Observe se a pessoa consegue manter a contração.",
        cue: "Diferencie dor parecida com a queixa de simples desconforto pela compressão.",
      },
      {
        title: "Comparar e registrar",
        text: "Compare com o outro joelho, usando a mesma pressão, e registre posição, intensidade e se a dor corresponde à queixa.",
        cue: "Dor dos dois lados, igual, pesa contra um significado clínico.",
      },
    ],
    interpretation: [
      {
        title: "Achado a interpretar com cautela",
        text: "Dor atrás da patela que reproduz a queixa e impede manter a contração pode ser registrada como resposta à compressão patelofemoral, mas acrescenta pouca informação diagnóstica.",
      },
      {
        title: "Falsos positivos frequentes",
        text: "A manobra é dolorosa em muitas pessoas sem dor patelofemoral e sem alteração de cartilagem; um resultado positivo pode simplesmente refletir a pressão aplicada.",
      },
      {
        title: "Resultado negativo",
        text: "Ausência de dor também não exclui dor patelofemoral nem condromalácia; o teste falha em ambas as direções.",
      },
      {
        title: "O que o teste não diz",
        text: "Não confirma condromalácia nem lesão de cartilagem, e não substitui a avaliação baseada na história e em atividades com carga, como agachar e subir escadas.",
      },
    ],
    reasoning: [
      "Na suspeita de dor patelofemoral, priorize a história (dor ao redor ou atrás da patela agravada por agachar, subir e descer escadas, ficar muito tempo sentado) e a reprodução da dor em tarefas com carga, como o agachamento.",
      "Use o Clarke, se usar, apenas como observação complementar; não baseie decisões nele.",
      "Investigue diferenciais: tendinopatia patelar (dor no polo inferior), instabilidade patelar (episódios de deslocamento), lesões meniscais e osteoartrite patelofemoral.",
      "Compare sempre com o joelho assintomático e registre a técnica, pois as variantes descritas na literatura são muitas e pouco padronizadas.",
    ],
    caution:
      "Um Clarke positivo não confirma dor patelofemoral nem condromalácia, e pode ocorrer em pessoas sem nenhuma queixa no joelho.",
    mistakes: [
      "Aplicar pressão forte e interpretar a dor resultante como positiva.",
      "Usar o teste como critério diagnóstico de condromalácia.",
      "Não comparar com o outro joelho usando a mesma pressão.",
      "Ignorar a história e os testes funcionais com carga, que dizem mais sobre a dor patelofemoral.",
    ],
    record:
      "Exemplo fictício: Clarke à direita com joelho estendido e pressão leve — desconforto retropatelar 3/10, semelhante ao do joelho esquerdo assintomático; não reproduz claramente a queixa. Agachamento bilateral reproduz a dor anterior direita 5/10. Interpretar o Clarke como achado de baixo peso.",
    related: [
      "patela",
      "femur",
      "reto-femoral",
      "vasto-medial",
      "vasto-lateral",
      "vasto-intermedio",
      "ligamento-patelar",
      "coxim-adiposo-infrapatelar",
    ],
    sources: ["jm-clarke-validade", "jm-testes-dpf", "jm-cpg-dpf"],
    evidence: {
      text: "Em estudo com 106 pessoas sem história de dor patelofemoral que fariam artroscopia por outras queixas no joelho, o Clarke teve sensibilidade de 39% e especificidade de 67% para condromalácia vista na artroscopia (razões de verossimilhança de 1,18 e 0,91), ou seja, quase não mudou a probabilidade. Cerca de um terço das pessoas sem condromalácia teve teste positivo. Os autores concluíram que o teste tem baixo valor diagnóstico e que há muita confusão sobre sua técnica. Revisões sobre testes para dor patelofemoral também não encontraram teste isolado com desempenho claramente bom.",
      source: "jm-clarke-validade",
    },
    review: [
      "Sei executar o Clarke com pressão leve e contração gradual do quadríceps.",
      "Sei explicar por que o teste tem baixa utilidade diagnóstica.",
      "Sei que ele pode doer em pessoas sem dor patelofemoral.",
      "Sei priorizar história e testes com carga, como o agachamento, na suspeita de dor patelofemoral.",
    ],
    cases: [
      {
        id: "clarke-assintomatico",
        question:
          "Caso fictício: ao praticar o Clarke em um colega sem nenhuma queixa no joelho, ele relata dor atrás da patela. Como interpretar?",
        choices: [
          "O colega tem condromalácia e precisa de tratamento.",
          "O teste foi mal feito, pois nunca dói em quem não tem lesão.",
          "Resposta comum mesmo sem dor patelofemoral; ilustra a baixa especificidade do teste.",
        ],
        correct: 2,
        explanation:
          "A compressão patelar com contração do quadríceps pode doer em joelhos sem queixa. Por isso o teste não serve para diagnosticar sozinho.",
      },
      {
        id: "clarke-dpf",
        question:
          "Caso fictício: corredora com dor ao redor da patela ao descer escadas, agachar e após muito tempo sentada; Clarke negativo. O que concluir?",
        choices: [
          "O Clarke negativo descarta dor patelofemoral.",
          "A história e a dor no agachamento continuam centrais; o Clarke negativo não exclui dor patelofemoral.",
          "É necessário repetir o Clarke com mais força até doer.",
        ],
        correct: 1,
        explanation:
          "O teste tem baixa sensibilidade. A hipótese de dor patelofemoral se apoia na história e na resposta a tarefas com carga.",
      },
      {
        id: "clarke-diferencial",
        question:
          "Caso fictício: atleta de salto com dor bem localizada no polo inferior da patela, que piora ao saltar; Clarke causa leve desconforto. Qual hipótese priorizar?",
        choices: [
          "Tendinopatia patelar, investigando com palpação do tendão e testes de carga.",
          "Condromalácia confirmada pelo Clarke.",
          "Lesão do menisco medial.",
        ],
        correct: 0,
        explanation:
          "A localização no polo inferior e a relação com saltos sugerem tendinopatia patelar; o Clarke não ajuda a fazer essa diferenciação.",
      },
    ],
  },
];
