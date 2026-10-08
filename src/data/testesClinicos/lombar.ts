import type { ClinicalTest } from "../clinicalTests";

export const lombarSources: {
  id: string;
  name: string;
  url: string;
  note: string;
}[] = [
  {
    id: "lb-suri-raizes",
    name: "Suri et al. — Exame físico na compressão de raízes lombares médias e baixas (2011)",
    url: "https://pubmed.ncbi.nlm.nih.gov/20543768/",
    note: "54 pessoas com dor radicular comparadas à ressonância; descreve o teste de estiramento femoral em prono, sua versão cruzada e combinações com o reflexo patelar.",
  },
  {
    id: "lb-hicks-confiabilidade",
    name: "Hicks et al. — Confiabilidade de testes para instabilidade segmentar lombar (2003)",
    url: "https://pubmed.ncbi.nlm.nih.gov/14669195/",
    note: "63 pessoas com dor lombar; relata concordância alta entre examinadores para o teste de instabilidade em prono.",
  },
  {
    id: "lb-hicks-regra",
    name: "Hicks et al. — Regra de predição preliminar para exercícios de estabilização (2005)",
    url: "https://pubmed.ncbi.nlm.nih.gov/16181938/",
    note: "Coorte de 54 pacientes com dor lombar não radicular; o teste de instabilidade em prono aparece entre as variáveis da regra preliminar.",
  },
  {
    id: "lb-ravenna-pit",
    name: "Ravenna et al. — Baixa confiabilidade entre examinadores no teste de instabilidade em prono (2011)",
    url: "https://pubmed.ncbi.nlm.nih.gov/21621668/",
    note: "30 pessoas com dor lombar mecânica; concordância baixa e pedido de padronização dos detalhes de execução.",
  },
  {
    id: "lb-stuber-kemp",
    name: "Stuber et al. — Acurácia diagnóstica do teste de Kemp: revisão sistemática (2014)",
    url: "https://pubmed.ncbi.nlm.nih.gov/25202153/",
    note: "Cinco estudos comparados a padrão de referência para dor facetária; acurácia considerada fraca.",
  },
  {
    id: "lb-laslett-facetas",
    name: "Laslett et al. — Preditores clínicos de resposta a bloqueios facetários lombares (2006)",
    url: "https://pubmed.ncbi.nlm.nih.gov/16825041/",
    note: "120 pacientes com dor lombar crônica; um teste de extensão-rotação negativo ajudou a afastar alívio quase completo após o bloqueio.",
  },
  {
    id: "lb-macrae-schober",
    name: "Macrae e Wright — Medida do movimento da coluna lombar (1969)",
    url: "https://pubmed.ncbi.nlm.nih.gov/5363241/",
    note: "Origem da modificação do Schober com marcos acima e abaixo da junção lombossacral.",
  },
  {
    id: "lb-jenkinson-basmi",
    name: "Jenkinson et al. — Índice metrológico de Bath para espondilite anquilosante (BASMI, 1994)",
    url: "https://pubmed.ncbi.nlm.nih.gov/7799351/",
    note: "Define as cinco medidas do BASMI, entre elas o Schober modificado, para acompanhar a mobilidade axial.",
  },
  {
    id: "lb-tousignant-schober",
    name: "Tousignant et al. — Validade e confiabilidade do Schober modificado-modificado (2005)",
    url: "https://pubmed.ncbi.nlm.nih.gov/16019864/",
    note: "31 pessoas com dor lombar comparadas a radiografias: validade moderada, confiabilidade alta e mudança mínima detectável de 1 cm.",
  },
  {
    id: "lb-asas-manual",
    name: "Sieper et al. — Manual ASAS para avaliação da espondiloartrite (2009)",
    url: "https://pubmed.ncbi.nlm.nih.gov/19433414/",
    note: "Referência da ASAS para critérios de classificação e medidas clínicas na espondiloartrite axial.",
  },
];

export const lombarTests: ClinicalTest[] = [
  {
    id: "estiramento-nervo-femoral",
    name: "Teste de estiramento do nervo femoral",
    aliases: [
      "Prone Knee Bend (PKB)",
      "Femoral Nerve Stretch Test (FNST)",
      "Flexão do joelho em prono",
      "Lasègue invertido",
    ],
    category: "lombar",
    kind: "neurodinamico",
    region: "Coluna lombar alta · nervo femoral (L2–L4)",
    position:
      "Paciente em decúbito ventral, quadril em posição neutra e pelve apoiada na maca; examinador ao lado do membro testado, com uma mão sobre o sacro e a outra no tornozelo.",
    summary:
      "Flexão passiva do joelho com a pessoa deitada de barriga para baixo, para observar se a carga sobre o nervo femoral reproduz a dor habitual na face anterior da coxa.",
    purpose:
      "Investigar a participação das raízes lombares altas (L2–L4) e do nervo femoral em queixas na virilha, na face anterior da coxa ou na face medial da perna. Complementa o Lasègue e o Slump, que carregam sobretudo as raízes L4–S1 e o nervo isquiático. Faz parte do raciocínio clínico e não define sozinho a causa.",
    indications: [
      "Dor lombar com irradiação para a face anterior da coxa, a virilha ou a face medial da perna, quando o Lasègue não reproduz a queixa.",
      "Suspeita de radiculopatia lombar alta, junto com força do quadríceps e dos flexores do quadril, reflexo patelar e sensibilidade.",
      "Comparação entre lados e acompanhamento da resposta usando a mesma posição e a mesma estabilização nas reavaliações.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e registre a queixa inicial. A prática clínica exige formação e supervisão adequadas.",
      "Interrompa ao reproduzir a queixa relevante ou diante de dor intensa. Prótese ou cirurgia recente de quadril ou joelho, lesão do quadríceps ou incapacidade de ficar em prono exigem avaliação de segurança ou outra posição.",
      "Alteração urinária ou intestinal recente, perda de sensibilidade no períneo ou fraqueza progressiva (por exemplo, joelho que falseia) exigem encaminhamento urgente, sem aguardar o teste.",
      "Dor intensa na virilha e na coxa com febre, uso de anticoagulante, história de câncer ou quadril mantido em flexão pode indicar processo no psoas ou retroperitoneal: encaminhe para avaliação médica.",
    ],
    steps: [
      {
        title: "Posicionar e perguntar",
        text: "Com a pessoa em decúbito ventral, cabeça confortável e sem travesseiro sob o quadril, pergunte onde e como são os sintomas habituais. Comece pelo lado menos sintomático quando tolerado.",
        cue: "Quadril em 0° de extensão e joelho estendido no início; anote a posição para repetir igual.",
      },
      {
        title: "Estabilizar a pelve",
        text: "Apoie uma mão sobre o sacro ou a crista ilíaca do lado testado para impedir que a pelve gire para a frente e que a lombar se estenda durante a flexão do joelho.",
        cue: "Se a pelve levantar, a lombar entra em extensão e a dor pode vir da própria coluna, não do nervo.",
      },
      {
        title: "Flexionar o joelho",
        text: "Segure o tornozelo e flexione o joelho passiva e lentamente, aproximando o calcanhar do glúteo, até a primeira resposta relevante ou o fim da amplitude tolerada. Pergunte se é a dor habitual e onde ela aparece.",
        cue: "Meça o ângulo do joelho ou a distância calcanhar–glúteo; tensão anterior isolada é comum pelo reto femoral.",
      },
      {
        title: "Sensibilizar com cuidado",
        text: "Se não houver resposta e o quadro permitir, mantenha a flexão do joelho e acrescente leve extensão do quadril, elevando a coxa alguns graus com a mão sob o joelho e a pelve ainda estabilizada.",
        cue: "A extensão do quadril também alonga reto femoral e iliopsoas; ela aumenta a carga, mas não diferencia sozinha.",
      },
      {
        title: "Diferenciar a origem",
        text: "Para separar componente neural e muscular, é preciso mudar um segmento distante sem mexer no joelho e no quadril, o que é difícil em prono. Quando necessário, use o slump em decúbito lateral, em que a flexão e a extensão cervical modificam a carga neural.",
        cue: "Registre qual variante foi usada; os resultados de posições diferentes não são intercambiáveis.",
      },
      {
        title: "Retornar e comparar",
        text: "Estenda o joelho lentamente, confirme o retorno ao estado inicial e compare com o outro lado. Se pertinente, teste a versão cruzada: flexionar o joelho do lado menos sintomático e perguntar se surge dor no lado afetado.",
        cue: "Descreva ângulo, local e intensidade, em vez de anotar apenas positivo ou negativo.",
      },
    ],
    interpretation: [
      {
        title: "Achado sugestivo de participação neural",
        text: "Reproduzir a dor habitual na face anterior da coxa, às vezes até a face medial da perna, com pelve estabilizada e diferença entre os lados apoia a hipótese de mecanossensibilidade do nervo femoral ou de irritação de raízes L2–L4, sobretudo se houver alteração do reflexo patelar ou da força do quadríceps.",
      },
      {
        title: "Tensão anterior não basta",
        text: "Sensação de alongamento na frente da coxa, sem a queixa habitual, costuma vir do reto femoral e do quadríceps. Dor lombar que aparece quando a pelve levanta também não deve ser chamada de teste positivo.",
      },
      {
        title: "Resultado negativo",
        text: "Não reproduzir a queixa reduz pouco a suspeita: no estudo de referência, o teste foi negativo em cerca de metade das pessoas com compressão de raiz lombar média. Não substitui o exame neurológico.",
      },
      {
        title: "O que o teste não diz",
        text: "Não indica o nível exato nem a causa (hérnia foraminal, estenose, outras compressões). Dor de origem coxofemoral, lesão do reto femoral e irritação do nervo cutâneo lateral da coxa também podem responder à manobra.",
      },
    ],
    reasoning: [
      "Use quando a distribuição da dor aponta para a face anterior da coxa: Lasègue e Slump avaliam principalmente o trajeto do nervo isquiático e podem ser negativos em raízes lombares altas.",
      "Integre ao exame neurológico: força dos flexores do quadril e do quadríceps, reflexo patelar e sensibilidade da face anterior da coxa e da face medial da perna. A combinação com o reflexo patelar aumentou a capacidade de identificar compressão L2–L4 no estudo de Suri et al.",
      "A versão cruzada, quando reproduz dor no lado afetado, teve razão de verossimilhança positiva alta no estudo de Suri et al., mas em amostra pequena; registre-a separadamente.",
      "Diferencie de dor coxofemoral (rotação interna e testes do quadril), de meralgia parestésica (alteração apenas sensitiva na face lateral da coxa) e de lesões do quadríceps antes de concluir pela origem lombar.",
      "Exame de imagem não é pedido só por um teste positivo: deve responder a uma pergunta clínica e poder mudar a conduta.",
    ],
    caution:
      "Um teste positivo isolado não confirma hérnia de disco nem o nível da raiz, e não separa por si só dor neural de tensão do reto femoral.",
    mistakes: [
      "Não estabilizar a pelve e deixar a lombar estender, provocando dor lombar que é interpretada como sinal neural.",
      "Chamar de positivo qualquer tensão na frente da coxa, sem perguntar se é a queixa habitual.",
      "Flexionar o joelho de forma rápida ou forçada até o calcanhar tocar o glúteo, ignorando a primeira resposta.",
      "Dispensar o exame de força, reflexo e sensibilidade porque o teste foi positivo ou negativo.",
    ],
    record:
      "Exemplo fictício: estiramento femoral em prono à esquerda, pelve estabilizada — dor habitual na face anterior da coxa até o joelho a 80° de flexão do joelho, intensidade 5/10; aumenta com leve extensão do quadril. À direita, tensão anterior a 125°, sem reprodução da queixa. Versão cruzada sem dor. Reflexo patelar esquerdo diminuído; registrar força do quadríceps, sensibilidade e hipótese clínica.",
    related: [
      "nervo-femoral",
      "vertebra-l2",
      "vertebra-l3",
      "vertebra-l4",
      "reto-femoral",
      "psoas-maior",
      "nervo-cutaneo-lateral-da-coxa",
      "coxofemoral",
    ],
    sources: [
      "lb-suri-raizes",
      "slr-review",
      "nice-back-pain",
      "nice-neurological",
    ],
    evidence: {
      text: "Em 54 pessoas com dor radicular avaliadas em um centro de referência de coluna e comparadas à ressonância, o teste em prono teve sensibilidade de 50% e especificidade de 100% para compressão de raízes L2–L4, com intervalos de confiança amplos. A amostra é pequena e selecionada; os números não valem para dor lombar em geral e mostram sobretudo que um teste negativo não afasta o problema.",
      source: "lb-suri-raizes",
    },
    review: [
      "Sei explicar por que o teste complementa o Lasègue e o Slump em queixas na face anterior da coxa.",
      "Sei estabilizar a pelve e evitar a extensão lombar durante a flexão do joelho.",
      "Sei diferenciar tensão do reto femoral da reprodução da queixa habitual.",
      "Sei quais achados neurológicos (L2–L4) integrar ao resultado.",
      "Sei reconhecer quando dor na virilha e na coxa exige encaminhamento médico antes de qualquer teste.",
    ],
    cases: [
      {
        id: "raiz-alta",
        question:
          "Caso fictício: dor lombar irradiada para a frente da coxa esquerda; Lasègue sem reprodução da queixa. Em prono, com pelve estabilizada, a flexão do joelho a 80° reproduz a dor habitual, e o reflexo patelar esquerdo está diminuído. Qual interpretação é mais adequada?",
        choices: [
          "Confirma hérnia de disco em L4–L5 e indica cirurgia.",
          "Indica apenas encurtamento do quadríceps esquerdo.",
          "Apoia a hipótese de envolvimento de raízes lombares altas; integrar à história e ao exame completo.",
        ],
        correct: 2,
        explanation:
          "A reprodução da queixa com pelve estabilizada, somada ao reflexo alterado, apoia uma hipótese neural L2–L4. Causa, nível e conduta dependem da avaliação completa.",
      },
      {
        id: "alerta-psoas",
        question:
          "Caso fictício: pessoa em uso de anticoagulante relata dor intensa na virilha e na coxa direita há dois dias, mantém o quadril fletido e não tolera ficar em prono. Qual a prioridade?",
        choices: [
          "Encaminhar para avaliação médica imediata, sem insistir no teste.",
          "Forçar a extensão do quadril para confirmar sinal neural.",
          "Repetir o teste diariamente até a dor aparecer na coxa.",
        ],
        correct: 0,
        explanation:
          "O quadro pode corresponder a um processo no psoas ou retroperitoneal, como hematoma. A prioridade é avaliação médica; o teste não é etapa necessária para encaminhar.",
      },
      {
        id: "pelve-elevada",
        question:
          "Caso fictício: durante a flexão do joelho, a pelve se eleva da maca e surge dor lombar central, sem dor na coxa. O que fazer?",
        choices: [
          "Registrar teste positivo para raiz L3.",
          "Repetir com a pelve estabilizada e descrever a resposta observada.",
          "Concluir que não há nenhum problema neural.",
        ],
        correct: 1,
        explanation:
          "A elevação da pelve estende a lombar e muda o estímulo. Repita com estabilização, se tolerado, e registre o que de fato ocorreu.",
      },
    ],
  },
  {
    id: "instabilidade-em-prono",
    name: "Teste de instabilidade em prono",
    aliases: [
      "Prone Instability Test (PIT)",
      "PIT",
      "Teste de instabilidade em decúbito ventral",
    ],
    category: "lombar",
    kind: "instabilidade",
    region: "Coluna lombar · controle segmentar",
    position:
      "Paciente com o tronco apoiado em decúbito ventral na maca, quadris fletidos sobre a borda e pés apoiados no chão; examinador ao lado, com o pisiforme ou a borda ulnar da mão sobre o processo espinhoso.",
    summary:
      "Pressão posteroanterior sobre as vértebras lombares feita duas vezes: com os músculos do tronco relaxados e depois com as pernas elevadas, observando se a dor diminui com a ativação muscular.",
    purpose:
      "Verificar se a dor provocada em um segmento lombar diminui quando a musculatura extensora é ativada. A redução da dor foi interpretada como sinal de que o controle muscular protege um segmento sensível, e o teste foi usado para orientar exercícios de estabilização. Hoje é visto como um dado de tratamento, de confiabilidade variável, e não como diagnóstico de instabilidade estrutural.",
    indications: [
      "Dor lombar predominantemente local, sem sinais radiculares dominantes, com episódios recorrentes ou sensação de “falseio” ao mudar de posição.",
      "Quando se considera um programa de exercícios de controle motor ou estabilização, em conjunto com outros achados do exame.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e registre a dor inicial. Pressões vertebrais exigem formação e supervisão.",
      "Não aplique pressão posteroanterior com suspeita de fratura (trauma, osteoporose, uso prolongado de corticoide), infecção, tumor ou doença inflamatória ativa da coluna.",
      "Interrompa se surgir dor intensa, dor irradiada para a perna ou parestesias; adapte a posição se a pessoa não tolera elevar as pernas (dor no quadril, gestação).",
      "Dor noturna constante, febre, perda de peso inexplicada ou história de câncer exigem encaminhamento médico antes de qualquer teste de provocação.",
    ],
    steps: [
      {
        title: "Posicionar na borda da maca",
        text: "A pessoa apoia o tronco em decúbito ventral sobre a maca, com os quadris fletidos na borda e os pés tocando o chão. Ajuste a altura da maca e pergunte sobre a dor habitual.",
        cue: "Os pés no chão deixam os extensores relaxados; essa é a condição de repouso do teste.",
      },
      {
        title: "Pressionar em repouso",
        text: "Aplique pressão posteroanterior sobre o processo espinhoso de cada vértebra lombar, de L1 a L5, e identifique o nível que reproduz a dor habitual.",
        cue: "Use força e direção semelhantes em todos os níveis; pergunte se é a dor conhecida.",
      },
      {
        title: "Elevar as pernas",
        text: "Peça que a pessoa segure a borda da maca e eleve os pés do chão, ativando extensores do quadril e da coluna, até as pernas ficarem próximas da horizontal.",
        cue: "Evite hiperextensão lombar exagerada; o objetivo é ativar os músculos, não arquear a coluna.",
      },
      {
        title: "Repetir a pressão",
        text: "Com as pernas elevadas, repita a pressão posteroanterior no mesmo nível doloroso, com a mesma força e direção usadas em repouso.",
        cue: "A única diferença entre as duas medidas deve ser a contração muscular.",
      },
      {
        title: "Comparar e registrar",
        text: "Considere o teste positivo quando a dor presente em repouso diminui ou desaparece com as pernas elevadas. Sem dor em repouso, ou dor que persiste com a contração, registre como negativo.",
        cue: "Anote o nível, a intensidade nas duas condições e qualquer dificuldade na execução.",
      },
    ],
    interpretation: [
      {
        title: "Achado positivo",
        text: "Dor em repouso que diminui com a ativação muscular sugere que a contração reduz a sensibilidade do segmento sob carga. Historicamente, isso foi associado a melhor resposta a exercícios de estabilização.",
      },
      {
        title: "Resultado negativo",
        text: "Sem dor à pressão em repouso, o teste não tem o que comparar. Dor que não muda com a contração também é registrada como negativa.",
      },
      {
        title: "Armadilhas de execução",
        text: "Variar a força ou o ponto da pressão entre as duas medidas, ou permitir que a pessoa arqueie a lombar ao elevar as pernas, altera o estímulo e explica parte das discordâncias entre examinadores.",
      },
      {
        title: "O que o teste não diz",
        text: "Não demonstra translação vertebral, espondilolistese nem instabilidade radiográfica. “Instabilidade” aqui é um conceito clínico ligado ao controle do movimento, sem padrão de referência estrutural.",
      },
    ],
    reasoning: [
      "O teste integrou uma regra de predição preliminar (Hicks et al., 2005), derivada de 54 pacientes com dor lombar não radicular, entre outras variáveis, como idade, Lasègue e movimentos aberrantes. A regra não foi validada naquele estudo; use-a como hipótese de tratamento, não como classificação definitiva.",
      "Observe movimentos aberrantes na flexão do tronco (arco doloroso, apoio das mãos nas coxas, reversão do ritmo ao retornar) e a história de episódios recorrentes, que dão contexto ao resultado.",
      "Com sintomas na perna, priorize o exame neurológico, o Lasègue e o Slump; o teste foi estudado em dor lombar não radicular.",
      "Reavalie após algumas semanas de exercício: a resposta clínica, medida por dor e função, vale mais que o resultado inicial do teste.",
      "Suspeita de espondilolistese ou de lesão estrutural pede raciocínio próprio e, se mudar a conduta, avaliação por imagem.",
    ],
    caution:
      "Um resultado positivo isolado não demonstra instabilidade estrutural nem espondilolistese e não garante resposta a exercícios de estabilização.",
    mistakes: [
      "Mudar a força, o ponto ou a direção da pressão entre a condição de repouso e a de pernas elevadas.",
      "Deixar a pessoa hiperestender a lombar ao elevar as pernas, transformando o teste em provocação em extensão.",
      "Classificar como positivo um caso sem dor em repouso.",
      "Interpretar o teste como diagnóstico de instabilidade vertebral ou de indicação cirúrgica.",
    ],
    record:
      "Exemplo fictício: teste de instabilidade em prono — dor habitual à pressão posteroanterior em L4, 6/10 com pés no chão; 1/10 com as pernas elevadas, mesma força e ponto. Demais níveis sem dor. Registrar movimentos aberrantes na flexão, exame neurológico e plano de reavaliação após exercícios de controle motor.",
    related: [
      "vertebras-lombares",
      "vertebra-l4",
      "intervertebrais",
      "multifido-lombar",
      "iliocostal-lombar",
      "ligamentos-interespinais",
      "fascia-toracolombar",
      "transverso-do-abdomen",
    ],
    sources: [
      "lb-hicks-confiabilidade",
      "lb-hicks-regra",
      "lb-ravenna-pit",
      "nice-back-pain",
    ],
    evidence: {
      text: "Em 63 pessoas com dor lombar, Hicks et al. (2003) relataram concordância alta entre examinadores (kappa 0,87). Ravenna et al. (2011), com 30 pessoas com dor lombar mecânica, encontraram 63% de concordância e kappa de 0,10, concluindo que a descrição disponível não bastava para uma execução reprodutível. Não existe padrão de referência estrutural, por isso a validade diagnóstica para instabilidade permanece incerta.",
      source: "lb-ravenna-pit",
    },
    review: [
      "Sei montar a posição com o tronco na maca e os pés no chão.",
      "Sei manter a mesma pressão nas duas condições do teste.",
      "Sei o critério de positivo: dor em repouso que diminui com as pernas elevadas.",
      "Sei explicar a origem do teste na regra de predição para estabilização e por que ela é preliminar.",
      "Sei quando não aplicar pressão vertebral e encaminhar.",
    ],
    cases: [
      {
        id: "dor-reduz",
        question:
          "Caso fictício: dor lombar recorrente sem sintomas na perna. A pressão em L4 provoca a dor habitual com os pés no chão, e ela praticamente desaparece com as pernas elevadas, mantendo a mesma pressão. Como interpretar?",
        choices: [
          "Confirma espondilolistese em L4.",
          "Teste positivo; dado a favor de experimentar exercícios de controle motor, com reavaliação.",
          "Indica necessidade de cirurgia de fixação.",
        ],
        correct: 1,
        explanation:
          "O achado é positivo e pode orientar uma hipótese de tratamento. Não diagnostica alteração estrutural e precisa ser reavaliado pela resposta clínica.",
      },
      {
        id: "sem-dor-repouso",
        question:
          "Caso fictício: nenhum nível lombar provoca dor à pressão com os pés no chão. Ao elevar as pernas, também não há dor. O que registrar?",
        choices: [
          "Teste negativo: sem dor em repouso, não há redução a comparar.",
          "Teste positivo, porque não houve dor com as pernas elevadas.",
          "Instabilidade confirmada, pois a coluna é indolor à pressão.",
        ],
        correct: 0,
        explanation:
          "O critério exige dor em repouso que diminua com a contração. Sem dor inicial, o resultado é negativo e deve ser descrito assim.",
      },
      {
        id: "alerta-fratura",
        question:
          "Caso fictício: pessoa de 72 anos em uso prolongado de corticoide relata dor lombar intensa e súbita depois de sentar com força numa cadeira. Qual a conduta?",
        choices: [
          "Aplicar pressão vigorosa em todos os níveis para localizar a dor.",
          "Fazer o teste em prono e iniciar estabilização se for positivo.",
          "Não aplicar pressões vertebrais e encaminhar para avaliação de possível fratura por fragilidade.",
        ],
        correct: 2,
        explanation:
          "Idade, corticoide e trauma mínimo sugerem fratura por fragilidade. Pressões vertebrais estão contraindicadas até a avaliação médica.",
      },
    ],
  },
  {
    id: "extensao-rotacao-lombar",
    name: "Teste de extensão-rotação lombar",
    aliases: [
      "Teste de Kemp",
      "Kemp's test",
      "Teste do quadrante lombar",
      "Extension-rotation test",
    ],
    category: "lombar",
    kind: "provocacao",
    region: "Coluna lombar · elementos posteriores e forame intervertebral",
    position:
      "Paciente em pé, pés na largura do quadril; examinador atrás dele, com uma mão no ombro do lado testado e a outra estabilizando a pelve ou o sacro.",
    summary:
      "Combinação de extensão, inclinação lateral e rotação do tronco para o mesmo lado, que aproxima as articulações zigapofisárias e estreita o forame intervertebral daquele lado.",
    purpose:
      "Observar se a posição de quadrante reproduz a dor lombar habitual e se ela fica local ou se irradia para a perna. Ajuda a formular hipóteses sobre dor de elementos posteriores ou estreitamento foraminal, mas tem baixa especificidade para dor facetária.",
    indications: [
      "Dor lombar que piora em pé, ao estender o tronco ou ao girar, e alivia na flexão ou sentado.",
      "Dor lombar com irradiação para a perna que aumenta em extensão, como complemento ao exame neurológico e aos testes neurodinâmicos.",
    ],
    safety: [
      "Explique a manobra, obtenha consentimento e registre a dor inicial. A prática exige formação e supervisão.",
      "Evite a sobrepressão com suspeita de fratura, osteoporose importante, trauma recente, tumor ou infecção; nesses casos, priorize a avaliação médica.",
      "Pessoas com equilíbrio ruim devem fazer a variante sentada ou com proteção contra queda. Interrompa diante de dor intensa, tontura ou parestesias novas.",
      "Alteração urinária ou intestinal recente, perda de sensibilidade no períneo ou fraqueza progressiva exigem encaminhamento urgente, sem depender do teste.",
    ],
    steps: [
      {
        title: "Posicionar e perguntar",
        text: "Com a pessoa em pé e estável, registre a localização e a intensidade da dor habitual. Comece pelo lado menos sintomático, se tolerado.",
        cue: "Em pessoas inseguras, use a variante sentada e mantenha uma mão de proteção.",
      },
      {
        title: "Estender a lombar",
        text: "Guie o tronco em extensão a partir da região lombar, apoiando o ombro e o sacro, e pergunte se a dor surge ou muda.",
        cue: "Evite que a pessoa dobre os joelhos ou desloque a pelve para a frente para compensar.",
      },
      {
        title: "Acrescentar inclinação e rotação",
        text: "Mantendo a extensão, acrescente inclinação lateral e rotação do tronco para o lado testado, levando o ombro desse lado para trás e para baixo.",
        cue: "Movimento para o mesmo lado: é isso que fecha a faceta e o forame daquele lado.",
      },
      {
        title: "Sobrepressão leve",
        text: "Se não houver resposta e o quadro permitir, aplique por poucos segundos uma sobrepressão suave pelo ombro, no sentido do movimento.",
        cue: "Sobrepressão é opcional e leve; nunca empurre em direção vertical sobre a coluna.",
      },
      {
        title: "Classificar a resposta",
        text: "Pergunte se é a dor habitual e onde ela aparece: lombar local, nádega, coxa ou abaixo do joelho. Anote também parestesias.",
        cue: "Dor local e dor irradiada levam a hipóteses diferentes; registre separadamente.",
      },
      {
        title: "Retornar e comparar",
        text: "Volte o tronco à posição neutra, confirme que os sintomas retornaram ao nível inicial e repita para o outro lado.",
        cue: "Compare os lados com a mesma amplitude e a mesma sobrepressão.",
      },
    ],
    interpretation: [
      {
        title: "Dor lombar local reproduzida",
        text: "Dor habitual localizada do lado testado é compatível com hipótese de origem em elementos posteriores, como as articulações zigapofisárias. Contudo, a manobra também carrega disco, pars interarticular, sacroilíaca e músculos, por isso a especificidade é baixa.",
      },
      {
        title: "Dor irradiada para a perna",
        text: "Dor ou parestesia que desce para a perna sugere estreitamento foraminal ou sensibilidade neural em extensão. Integre com o exame neurológico, o Lasègue e o Slump.",
      },
      {
        title: "Resultado negativo",
        text: "Não reproduzir a dor tem algum valor para tornar menos provável que as facetas sejam a principal fonte da dor, mas não exclui outras causas.",
      },
      {
        title: "O que o teste não diz",
        text: "O diagnóstico de dor facetária só se estabelece com bloqueios anestésicos controlados. O teste não identifica nível, não confirma estenose e não deve, sozinho, indicar procedimento.",
      },
    ],
    reasoning: [
      "Relacione com a história: dor que piora em pé ou andando e alivia sentado, em pessoas mais velhas, faz pensar em estenose; avalie também pulsos e sinais de claudicação vascular.",
      "Em adolescentes e atletas com dor em extensão (ginástica, saltos), considere espondilólise e encaminhe para avaliação em vez de repetir provocações.",
      "No estudo de Laslett et al. (2006), um teste de extensão-rotação negativo ajudou a afastar alívio quase completo após bloqueio facetário; o positivo, isoladamente, pouco acrescentou.",
      "Combine com movimentos repetidos e com a resposta a posições sustentadas; vários achados concordantes valem mais que um teste isolado.",
      "Use o resultado para orientar o tratamento e a reavaliação, não como rótulo diagnóstico de “síndrome facetária”.",
    ],
    caution:
      "Um resultado positivo isolado não confirma dor facetária, estenose foraminal ou espondilólise, pois a manobra carrega várias estruturas ao mesmo tempo.",
    mistakes: [
      "Fazer rotação para o lado oposto ao da inclinação, perdendo o fechamento do quadrante testado.",
      "Aplicar sobrepressão forte ou vertical, especialmente em pessoas com risco de fratura.",
      "Não distinguir dor local de dor irradiada no registro.",
      "Tratar um teste positivo como diagnóstico de dor facetária.",
    ],
    record:
      "Exemplo fictício: extensão-rotação lombar em pé — à direita, dor habitual lombar baixa local, 4/10, sem irradiação; à esquerda, sem reprodução. Sem parestesias. Registrar exame neurológico, Lasègue, resposta a movimentos repetidos e hipótese clínica.",
    related: [
      "vertebras-lombares",
      "vertebra-l4",
      "vertebra-l5",
      "intervertebrais",
      "ligamentos-amarelos",
      "multifido-lombar",
      "sacro",
    ],
    sources: [
      "lb-stuber-kemp",
      "lb-laslett-facetas",
      "nice-back-pain",
      "nice-neurological",
    ],
    evidence: {
      text: "Uma revisão sistemática de cinco estudos que compararam o teste de Kemp a padrões de referência para dor facetária concluiu que a acurácia é fraca: ao agrupar estudos semelhantes, só o valor preditivo negativo passou de 50% (56,8% e 59,9%). Em 120 pacientes com dor lombar crônica, Laslett et al. (2006) observaram que um teste de extensão-rotação negativo ajudava a afastar resposta quase completa ao bloqueio. Os estudos usam técnicas e populações diferentes.",
      source: "lb-stuber-kemp",
    },
    review: [
      "Sei combinar extensão, inclinação e rotação para o mesmo lado.",
      "Sei distinguir no registro dor lombar local de dor irradiada para a perna.",
      "Sei por que o teste tem baixa especificidade para dor facetária.",
      "Sei quando evitar sobrepressão e quando usar a variante sentada.",
      "Sei reconhecer dor em extensão em jovens atletas como possível sinal de espondilólise.",
    ],
    cases: [
      {
        id: "atleta-jovem",
        question:
          "Caso fictício: ginasta de 15 anos com dor lombar há seis semanas, que piora em extensão. O teste de extensão-rotação à direita reproduz dor local intensa. Qual a conduta mais adequada?",
        choices: [
          "Encaminhar para avaliação de possível espondilólise, evitando provocações repetidas.",
          "Concluir que é dor facetária e liberar o treino.",
          "Repetir o teste com sobrepressão forte para confirmar.",
        ],
        correct: 0,
        explanation:
          "Dor em extensão em adolescente atleta sugere considerar fratura por estresse da pars interarticular. O teste não diferencia essa condição; a avaliação médica orienta a conduta.",
      },
      {
        id: "teste-negativo",
        question:
          "Caso fictício: dor lombar crônica; o teste de extensão-rotação não reproduz a dor em nenhum dos lados. Como interpretar?",
        choices: [
          "Exclui qualquer causa estrutural de dor lombar.",
          "Torna menos provável que as facetas sejam a principal fonte, sem excluir outras causas.",
          "Confirma origem discogênica da dor.",
        ],
        correct: 1,
        explanation:
          "O valor do teste está mais no resultado negativo, que reduz a probabilidade de dor facetária predominante. Não define outra origem.",
      },
      {
        id: "dor-local",
        question:
          "Caso fictício: o teste reproduz dor lombar local à direita, sem irradiação. O exame neurológico é normal. O que registrar?",
        choices: [
          "Síndrome facetária confirmada em L4–L5.",
          "Estenose foraminal à direita.",
          "Dor local reproduzida em extensão-rotação à direita; hipótese de elementos posteriores, a integrar com outros achados.",
        ],
        correct: 2,
        explanation:
          "O achado é compatível com dor de elementos posteriores, mas a baixa especificidade impede rótulo diagnóstico. Descreva a resposta e integre ao exame.",
      },
    ],
  },
  {
    id: "schober-modificado",
    name: "Teste de Schober modificado",
    aliases: [
      "Modified Schober Test",
      "Schober modificado de Macrae e Wright",
      "Componente lombar do BASMI",
    ],
    category: "lombar",
    kind: "mobilidade",
    region: "Coluna lombar · mobilidade em flexão",
    position:
      "Paciente em pé, ereto, pés na largura do quadril e joelhos estendidos; examinador atrás dele, com fita métrica flexível e caneta dermográfica.",
    summary:
      "Medida, com fita métrica, do quanto a pele sobre a coluna lombar se alonga durante a flexão máxima do tronco, usando marcos a partir da junção lombossacral.",
    purpose:
      "Quantificar a mobilidade de flexão da coluna lombar de forma simples e repetível. É usado no acompanhamento da espondiloartrite axial, como uma das medidas do índice BASMI, e no monitoramento da mobilidade em outras dores lombares. Mede mobilidade, não estabelece diagnóstico.",
    indications: [
      "Acompanhamento da mobilidade lombar na espondiloartrite axial, junto com as outras medidas metrológicas.",
      "Registro objetivo da flexão lombar em reavaliações de dor lombar, usando sempre a mesma variante e protocolo.",
    ],
    safety: [
      "Explique o procedimento e obtenha consentimento. A prática clínica exige formação e supervisão.",
      "Evite flexão máxima com dor aguda intensa, suspeita de fratura vertebral ou osteoporose importante; nesses casos, priorize a avaliação clínica.",
      "Fique próximo para evitar quedas e interrompa se surgir dor irradiada intensa, tontura ou parestesias.",
      "Dor lombar crônica iniciada antes dos 45 anos com características inflamatórias (início insidioso, rigidez matinal, melhora com exercício, dor noturna) merece avaliação reumatológica, independentemente do valor do Schober.",
    ],
    steps: [
      {
        title: "Localizar os marcos",
        text: "Com a pessoa em pé, palpe as espinhas ilíacas posterossuperiores (EIPS), próximas às fossetas lombares. Marque na linha média o ponto sobre a linha que une as duas EIPS, referência da junção lombossacral.",
        cue: "As fossetas nem sempre são visíveis; palpe as EIPS e use o mesmo marco em todas as reavaliações.",
      },
      {
        title: "Marcar 10 cm acima e 5 cm abaixo",
        text: "Na linha média, com a pessoa ereta, marque um ponto 10 cm acima e outro 5 cm abaixo do marco lombossacral. A distância entre as marcas extremas é de 15 cm.",
        cue: "Encoste a fita na pele sem esticá-la; esta é a variante de Macrae e Wright usada no BASMI.",
      },
      {
        title: "Flexionar o tronco",
        text: "Peça que a pessoa incline o tronco para a frente o máximo possível, mantendo os joelhos estendidos, como se fosse tocar o chão.",
        cue: "Observe desvios laterais e flexão dos joelhos; eles mudam a medida.",
      },
      {
        title: "Medir a nova distância",
        text: "Na flexão máxima, meça a distância entre a marca superior e a inferior, acompanhando a curvatura da pele. O resultado é o aumento em relação aos 15 cm iniciais.",
        cue: "Registre o aumento em centímetros, por exemplo 20,5 cm na flexão = aumento de 5,5 cm.",
      },
      {
        title: "Registrar e padronizar",
        text: "Anote o aumento, a variante usada e a dor durante o movimento. Nas reavaliações, repita a mesma técnica, de preferência com o mesmo examinador.",
        cue: "Variantes diferentes (original, modificada, modificada-modificada) não geram valores intercambiáveis.",
      },
    ],
    interpretation: [
      {
        title: "Aumento reduzido",
        text: "Um aumento pequeno indica pouca mobilidade de flexão lombar medida na pele. Pode refletir dor, proteção muscular, alterações estruturais (como na espondiloartrite axial avançada) ou simplesmente a idade.",
      },
      {
        title: "Aumento preservado",
        text: "Mobilidade normal não exclui espondiloartrite axial: nas fases iniciais, a mobilidade pode estar preservada. O valor também não exclui outras causas de dor lombar.",
      },
      {
        title: "Armadilhas de medida",
        text: "Marco lombossacral mal localizado, fita esticada, joelhos fletidos ou mudança de variante entre avaliações alteram o resultado. A medida avalia a distensão da pele, não diretamente o ângulo entre as vértebras.",
      },
      {
        title: "O que o teste não diz",
        text: "Não identifica causa nem diagnóstico. Valores de referência variam com idade e sexo, e não existe um ponto de corte universal aplicável a todas as pessoas.",
      },
    ],
    reasoning: [
      "Na suspeita de espondiloartrite axial, o Schober é apenas uma peça: some história de dor inflamatória, sinais periféricos (entesite, artrite, dactilite), uveíte, psoríase, doença inflamatória intestinal, história familiar, exames laboratoriais e de imagem, conforme avaliação médica.",
      "No BASMI, o Schober modificado é combinado com rotação cervical, distância trago-parede, flexão lateral lombar e distância intermaleolar para descrever a mobilidade axial ao longo do tempo.",
      "Na dor lombar mecânica, use-o para acompanhar evolução; a distância dedo–chão mistura quadril e isquiotibiais, enquanto o Schober isola melhor a região lombar.",
      "Se a flexão é limitada por dor irradiada para a perna, investigue a participação neural com Lasègue e Slump antes de atribuir a limitação à rigidez lombar.",
      "Mudanças pequenas podem estar dentro do erro de medida: no estudo da variante modificada-modificada, a menor mudança detectável foi de 1 cm.",
    ],
    caution:
      "Uma redução isolada do Schober não confirma espondiloartrite axial nem outro diagnóstico, e um valor normal também não a exclui.",
    mistakes: [
      "Usar a crista ilíaca ou outro marco em vez das EIPS sem registrar, ou trocar de variante entre avaliações.",
      "Permitir flexão dos joelhos ou compensação lateral durante a flexão.",
      "Esticar a fita ou não acompanhar a curvatura da pele na medida final.",
      "Usar o valor do Schober como critério diagnóstico de espondiloartrite.",
    ],
    record:
      "Exemplo fictício: Schober modificado (EIPS; 10 cm acima e 5 cm abaixo) — 15 cm em pé, 18,5 cm na flexão máxima: aumento de 3,5 cm, com rigidez lombar e sem dor irradiada. Registrar demais medidas do BASMI quando pertinentes, rigidez matinal e plano de reavaliação com a mesma técnica.",
    related: [
      "vertebras-lombares",
      "vertebra-l5",
      "sacro",
      "osso-do-quadril",
      "sacroiliaca",
      "ligamento-longitudinal-anterior",
      "ligamento-supraespinal",
      "multifido-lombar",
    ],
    sources: [
      "lb-macrae-schober",
      "lb-jenkinson-basmi",
      "lb-tousignant-schober",
      "lb-asas-manual",
    ],
    evidence: {
      text: "Em 31 pessoas com dor lombar, a variante modificada-modificada (marcos a partir da linha das EIPS) mostrou validade moderada em relação à radiografia (r = 0,67), confiabilidade alta intra e entre examinadores (ICC 0,95 e 0,91) e menor mudança detectável de 1 cm. Esses números são de outra variante e de uma amostra pequena, e não se transferem diretamente para a versão de 10 cm acima e 5 cm abaixo. No BASMI, o conjunto das cinco medidas mostrou boa reprodutibilidade em pessoas com espondilite anquilosante.",
      source: "lb-tousignant-schober",
    },
    review: [
      "Sei localizar as EIPS e marcar o ponto lombossacral na linha média.",
      "Sei marcar 10 cm acima e 5 cm abaixo e calcular o aumento na flexão.",
      "Sei que variantes diferentes do Schober não são intercambiáveis.",
      "Sei o papel do Schober no BASMI e seus limites na espondiloartrite axial.",
      "Sei reconhecer características de dor lombar inflamatória que justificam encaminhamento.",
    ],
    cases: [
      {
        id: "dor-inflamatoria",
        question:
          "Caso fictício: pessoa de 27 anos com dor lombar há oito meses, rigidez matinal prolongada, melhora com exercício e despertar noturno por dor. O Schober modificado mostra aumento reduzido. Qual a conduta mais adequada?",
        choices: [
          "Encaminhar para avaliação reumatológica; o Schober apoia o acompanhamento, mas não diagnostica.",
          "Confirmar espondilite anquilosante pelo valor do Schober.",
          "Tranquilizar e reavaliar apenas se o Schober piorar.",
        ],
        correct: 0,
        explanation:
          "As características sugerem dor lombar inflamatória, que merece avaliação especializada. O Schober quantifica mobilidade, não estabelece o diagnóstico.",
      },
      {
        id: "erro-medida",
        question:
          "Caso fictício: na reavaliação, com a mesma técnica e o mesmo examinador, o aumento passou de 3,5 cm para 4,0 cm. Como interpretar?",
        choices: [
          "Melhora importante e comprovada da mobilidade.",
          "Piora da doença de base.",
          "Variação que pode estar dentro do erro de medida; observar a tendência e outros desfechos.",
        ],
        correct: 2,
        explanation:
          "Mudanças da ordem de 1 cm ou menos podem refletir erro de medida. Avalie a tendência ao longo do tempo junto com dor e função.",
      },
      {
        id: "variantes",
        question:
          "Caso fictício: na primeira avaliação usou-se a linha das EIPS com 10 cm acima e 5 cm abaixo; na segunda, outro examinador marcou 15 cm acima das EIPS. É possível comparar os valores?",
        choices: [
          "Sim, todas as variantes de Schober dão o mesmo resultado.",
          "Não diretamente; as variantes usam marcos diferentes e devem ser padronizadas.",
          "Sim, desde que se some 5 cm ao segundo valor.",
        ],
        correct: 1,
        explanation:
          "As variantes medem segmentos de pele diferentes. Para acompanhar a evolução, mantenha a mesma variante e registre-a.",
      },
    ],
  },
];
