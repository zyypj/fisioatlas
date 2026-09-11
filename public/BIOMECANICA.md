# Mecânica dos tecidos — modelo reduzido de estudo

Implementação local em TypeScript/Three.js. Não executa OpenSim ou um solver do Higgsfield. As referências abaixo fundamentam os conceitos; não validam os parâmetros nem a anatomia deste aplicativo.

## Escopo e unidades

O ângulo articular é imposto pela animação, em um membro direito. As forças calculadas não alteram o ângulo e não existe dinâmica inversa, otimização do recrutamento, gravidade, contato, colisão ou previsão de lesões. Pausar mantém o ângulo fixo: a ativação ainda converge para o valor escolhido.

Comprimentos são em metros internamente, exibidos em milímetros. Forças são normalizadas por uma referência arbitrária F₀ de cada tecido. Não são newtons e não devem ser somadas entre tecidos. As leituras de uma ficha usam seu componente de maior trajeto de referência, não uma soma de ramos.

## Geometria

Uma análise de componente principal e nove faixas de vértices estimam uma curva central por malha. Seu comprimento em repouso é Lref. O movimento transforma pontos dessa curva pelo mesmo campo de rotação gradual que move a superfície. O comprimento resultante L e sua taxa de variação alimentam as equações.

Essas curvas não são fascículos medidos, linhas de ação validadas ou pontos de inserção certificados. Malhas planas e nervos ramificados são especialmente inadequados para a redução a uma curva. Os tecidos que atravessam a transição do segmento, além dos agonistas/antagonistas listados, recebem cálculo mecânico. Cápsulas, discos e outros componentes articulares continuam cinemáticos, sem uma lei constitutiva própria.

Nos ligamentos explicitamente associados aos dois segmentos da articulação, os extremos superior/inferior da malha aproximam as fixações proximal/distal: uma extremidade permanece com o segmento proximal e a outra acompanha a rotação distal, com transição suave entre elas. A lista de associações está no `AtlasEngine.ts`. São estimativas geométricas, não fixações medidas. Os ligamentos tibiofibulares anterior e posterior não giram com o pé na animação talocrural.

## Músculo e tendão em série

Modelo do tipo Hill simplificado, sem penação. Lótimo = 0,7 Lref e Lt0 = 0,3 Lref são hipóteses genéricas editáveis no código, não proporções medidas de cada músculo.

- Ativação: a(t+dt) = u + (a(t)-u) exp(-dt/τ), com τ = 0,015 s ao ativar e 0,05 s ao desativar.
- Força ativa: a · exp(-((Lf/Lótimo-1)/0,45)²) · fv.
- Força passiva: zero até Lf/Lótimo=1; depois (exp(4(r-1)/0,6)-1)/(exp(4)-1), com teto numérico no expoente.
- Fator de velocidade: v é a velocidade do trajeto, dividida por 10 Lótimo/s e limitada a [-1,1]. Para encurtamento, fv=(1+v)/(1-v/0,25); para alongamento, fv=1+0,8v/(v+0,25). A velocidade de fascículos não é resolvida dinamicamente.
- Tendão: Ft/F₀ = (max(0,(Lt-Lt0)/Lt0)/c)²; c é o alongamento em F₀ escolhido no painel.
- Resolve-se Fm=Ft e Lf+Lt=L por bisseção, até 48 iterações. A solução é quase estática, com fator de velocidade imposto. Não é uma implementação completa de Millard/OpenSim.

No 3D, a região central da malha é redistribuída conforme a fração de fibra calculada, mantendo as extremidades longitudinais. O raio do ventre varia aproximadamente com sqrt(Lótimo/Lf), suavizado perto das extremidades; não é conservação volumétrica exata por elemento. A deformação visual é limitada quando Lf/Lótimo sai de [0,5;1,6]. O tendão em série é um elemento matemático mesmo quando não existe uma malha tendínea separada.

Referência: [OpenSim — modelos musculares de Millard](https://opensimconfluence.atlassian.net/wiki/spaces/OpenSim/pages/53090555/Millard%2B2012%2BMuscle%2BModels).

## Ligamentos

L0 = Lref (1+folga), ε = L/L0 - 1. Usamos uma mola somente à tração com transição quadrática-linear, εt=0,06:

- ε≤0: F=0.
- 0<ε≤εt: F/F₀ = rigidez · ε²/(2 εt · 0,03).
- ε>εt: F/F₀ = rigidez · (ε-εt/2)/0,03.
- Soma-se rigidez · 0,01 · max(0,dε/dt) apenas sob tração.

A normalização faz F/F₀=1 em ε=0,06 para rigidez=1. Isso é uma escala didática, não uma rigidez humana medida. O raio é ajustado pela razão de comprimentos. Não há ruptura, fibras individuais, contato com os ossos nem resposta por elementos finitos.

Referência: [OpenSim — Blankevoort1991Ligament, equações e propriedades](https://opensim-org.github.io/opensim-moco-site/docs/1.2.0/html_user/classOpenSim_1_1Blankevoort1991Ligament.html).

## Tendões com malha própria

Os tendões independentes usam a lei elástica quadrática acima com ε=max(0,L/Lref-1). Não recebem força por uma conexão músculo-tendão anatômica explicitamente calibrada. O tendão interno do modelo muscular e a malha de tendão são representações distintas; suas leituras não podem ser interpretadas como um mesmo circuito de força.

## Nervos

Modelo geométrico de reserva: ΔL=L-Lref; deslizamento por extremidade s=clamp(ΔL/2,-reserva,+reserva). Alongamento residual=max(0,ΔL-2s)/Lref. A superfície recebe deslocamento axial suave, máximo no centro e zero nas extremidades, e redução transversal conforme o alongamento residual.

Essa regra de reserva é uma hipótese própria de ensino, não uma lei constitutiva publicada nem um protocolo neurodinâmico validado. O modelo não tem microcirculação, condução elétrica, compressão por contato ou limiar de lesão. O estudo experimental abaixo sustenta a distinção entre excursão e deformação, não os números usados no aplicativo.

Referência: [Coppieters e Butler — estudo de excursão e deformação neural](https://pubmed.ncbi.nlm.nih.gov/17398140/).

## Interpretação e verificação

Cor quente representa ativação muscular, força ligamentar/tendínea ou alongamento neural residual, dependendo do tecido. Não representa lesão. Faixas numéricas adotadas para alertar extrapolação (fibra fora de 0,5–1,6 Lótimo; variação ligamentar/tendínea absoluta acima de 15%; nervo acima de 10%) são guardas de visualização, não limites fisiológicos.

Os testes cobrem tração unilateral, continuidade da mola, equilíbrio músculo-tendão, resposta à ativação, dependência da complacência, reserva neural, repouso, posições usadas na seleção 3D e extremos dos parâmetros. Testar as equações não constitui validação clínica.
