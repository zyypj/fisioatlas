# Validação — 11 de setembro de 2026

Versão local de produção compilada com `npm run build`, servida em http://127.0.0.1:4173.

## Catálogo após a ampliação

| Sistema | Fichas |
|---|---|
| Músculos | 184 |
| Ligamentos e membranas | 102 |
| Ossos | 56 |
| Articulações, discos, lábios, meniscos e bolsas | 39 |
| Nervos | 35 |
| Tendões, aponeuroses, retináculos, fáscias e bainhas | 29 |
| **Total** | **445** |

- 441 das 445 fichas têm malha 3D própria; 1.446 malhas e 1.871.964 triângulos.
- Modelos comprimidos: 13,95 MiB no total, contra 11,91 MiB da versão anterior, que tinha 220 fichas e 699 malhas. O catálogo dobrou de tamanho e o peso de carregamento subiu cerca de 17%.
- Média de 10,6 campos por ficha. Nenhuma ficha tem menos de cinco campos.
- 38 movimentos, contra 10 na versão anterior, cobrindo ombro, cotovelo, antebraço, punho, quadril, joelho, tornozelo, subtalar, coluna cervical, tronco e articulação temporomandibular.

## Verificações automáticas

- `npm test`: 18 testes aprovados, nenhuma falha.
- `npm run lint`: aprovado.
- `npm run build`: aprovado.
- Renderização de todas as rotas de fichas, movimentos e seções.
- IDs únicos, relações cruzadas resolvidas, fontes válidas e campos obrigatórios dos músculos verificados em todo o catálogo.
- GLB decodificados com Meshopt: cada malha anunciada por uma ficha existe no modelo e nenhum elemento é atribuído a duas fichas.
- Teste novo de rigs de movimento: para cada um dos 38 movimentos, o osso âncora existe no catálogo, tem malha do lado animado, produz um pivô finito e há pelo menos um osso acompanhando o segmento distal. Ligamentos transarticulares, regiões e eixos de cada rig também são conferidos contra o catálogo.
- Pesquisa por acentos, abreviações e sinônimos verificada.
- Recuperação de dados locais parciais ou corrompidos verificada.

## Verificações no navegador

- Carregamento do corpo tridimensional na versão de produção, sem erros no console.
- Flexão de tronco: coluna, caixa torácica, crânio e membros acompanham o movimento em bloco a partir do pivô lombossacro.
- Pronação do antebraço, abertura da boca e demais movimentos novos acessíveis e reproduzíveis pelo painel.
- Contadores das camadas anatômicas atualizados no menu lateral: 184 músculos, 102 ligamentos, 56 ossos, 39 articulações, 35 nervos e 29 tendões.

## Duas correções depois da primeira entrega

### Fáscias de revestimento cobriam o corpo inteiro

As fáscias lata, braquial, antebraquial, crural, cervical, peitoral e as do tronco envolvem segmentos inteiros. Como entraram na camada de tendões, que já vinha ligada a 100% por padrão, passaram a cobrir todo o modelo: o atlas abria mostrando um vulto branco em vez da musculatura. Nos movimentos era pior, porque a camada de tendões fica a 100% enquanto músculos ficam a 15%.

As cinco fichas dessas fáscias foram marcadas com o campo `envelope` e o visualizador passou a ocultá-las por padrão, exibindo-as apenas quando a pessoa marca "Mostrar fáscias de revestimento" no painel de camadas ou quando a própria fáscia é a estrutura selecionada. As fichas continuam completas e acessíveis pela busca.

### Movimentos axiais deformavam o corpo inteiro

O motor calcula o quanto cada tecido mole acompanha o movimento pela altura em relação ao pivô, supondo que a parte móvel fica abaixo dele, como um membro pendurado. Nos movimentos de coluna e pescoço é o contrário: o segmento que gira está acima do pivô. Além disso, a cadeia de tecidos usada nos movimentos axiais incluía tronco e pelve.

O efeito combinado aparecia na abertura da boca: com o pivô na mandíbula e a cadeia incluindo o tronco e a pelve, toda a musculatura e os discos intervertebrais giravam 20° em torno de um eixo na altura da cabeça, e estruturas da pelve eram arremessadas para fora do corpo, vários centímetros à frente do tronco.

A correção acrescentou dois conceitos ao rig:

- `segment`, que diz se a parte móvel fica abaixo ou acima do pivô. Os rigs de coluna e cervical passaram a `proximal`, e o cálculo do peso espelha a altura em torno do pivô nesses casos.
- `softScope`, que restringe os tecidos deformados aos que realmente cruzam a articulação. A mandíbula usa esse modo: deformam apenas os músculos citados no movimento, o osso hioide e os ligamentos da ATM.

A cadeia axial passou a listar exatamente o que o rig da coluna gira, e os movimentos cervicais ganharam uma cadeia própria, limitada à cabeça e ao pescoço.

Um teste novo reproduz a seleção de tecidos do motor e falha se algum movimento deformar estrutura fora do seu escopo. Ele permite exceções anatômicas legítimas: o trapézio está na região do tronco mas é antagonista da flexão cervical, então pode deformar.

Deslocamento medido do osso mais distal em cada um dos 21 rigs, com o ângulo de cada movimento: flexão de ombro 87 cm, flexão de quadril 98 cm, cotovelo 70 cm, joelho 66 cm, flexão de tronco 52 cm, cervical 19 cm, pronação 15 cm, tornozelo 8 cm, subtalar 4 cm e abertura da boca 2,3 cm no hioide. Todos produzem movimento e nenhum é nulo.

## Correção de linha média nas animações

O motor animava apenas as malhas com centro à esquerda do plano mediano. Estruturas ímpares, como vértebras, esterno, sacro e mandíbula, têm centro praticamente em zero, e o sinal desse valor é ruído de ponto flutuante: parte das vértebras entrava no movimento e parte ficava parada. Movimentos de coluna e de mandíbula simplesmente não aconteciam.

A correção introduziu duas regras explícitas:

- Estruturas a menos de 2 cm do plano mediano são tratadas como de linha média e sempre acompanham o movimento.
- Rigs axiais (coluna, cervical e temporomandibular) são marcados como bilaterais e movem os dois lados, porque separar um lado partiria a caixa torácica e a coluna ao meio.

Os rigs de membros continuam animando um lado só, como antes: suas malhas estão a mais de 7 cm do plano mediano e não são afetadas pela nova regra.

## Simplificação dos modelos

Sem simplificação, a expansão levaria os modelos de 11,91 MiB para muito além de 20 MiB. Foi acrescentada uma etapa de simplificação com erro limitado (`ratio` 0,2 e erro relativo 0,0008) antes da compressão Meshopt. O limite de erro é relativo às dimensões de cada malha, o que significa que lâminas amplas e pouco curvas, como intercostais e trato iliotibial, reduzem muito, enquanto ossos e ligamentos pequenos e detalhados quase não mudam. O fêmur, por exemplo, manteve 4.130 triângulos dos 7.572 originais, com desvio inferior a 0,08% da sua própria dimensão.

Nenhuma geometria foi criada ou inventada nesse processo: a simplificação apenas remove vértices dentro do limite de erro.

## Cobertura da fonte

Depois desta ampliação, todas as estruturas musculoesqueléticas modeladas no Z-Anatomy estão no atlas. Ficaram de fora, deliberadamente, apenas estruturas que não pertencem ao aparelho locomotor:

- Músculos da laringe, da faringe, da língua e os extraoculares, além dos tarsos palpebrais e do anel tendíneo comum.
- Ligamento intercornual do útero, nó do ligamento arterioso, ligamento suspensor do bulbo do olho e membrana timpânica.
- Seios frontal e esfenoidal e células etmoidais, que são cavidades aéreas e não ossos.
- Septo pelúcido, que é uma estrutura encefálica.

## Limites desta entrega

Quatro fichas continuam sem malha própria, porque a fonte Z-Anatomy não modela essas estruturas separadamente: talocrural, atlanto-occipital, atlantoaxial e nervo glúteo inferior. Cada uma dessas fichas traz um campo "Estudo 3D" explicando o que isolar no modelo para estudar a região, em vez de exibir uma malha aproximada.

As fichas do tendão comum dos extensores, do tendão comum dos flexores e do ligamento patelar usam as marcas de fixação da fonte, e não o corpo do tendão. Isso está declarado no campo "Estudo 3D" de cada uma, porque a área de fixação é justamente o que interessa na epicondilalgia e na doença de Osgood-Schlatter.

Os ângulos das animações são escolhas de visualização, calibradas para que o movimento seja legível no modelo. Não são valores de goniometria e não devem ser usados como referência de amplitude articular. Os eixos de rotação são aproximações fixas, não eixos instantâneos reais.

A mecânica dos tecidos continua usando parâmetros genéricos e movimento imposto, conforme documentado em `public/BIOMECANICA.md`. Não houve auditoria clínica independente do conteúdo textual acrescentado.

Os testes visuais usaram dimensões emuladas no navegador, não aparelhos físicos.
