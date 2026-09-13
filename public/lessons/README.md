# Esquema de articulação sinovial

Modelo próprio, gerado por script no Blender.

- Script reproduzível: `scripts/lesson_synovial.py`, no projeto FisioAtlas.
- Arquivos: `synovial.glb` (modelo servido) e `synovial.png` (render de conferência).
- Referência conceitual: https://openstax.org/books/anatomy-and-physiology-2e/pages/9-4-synovial-joints

Oito peças: duas extremidades ósseas, duas cartilagens, cápsula fibrosa em corte,
membrana sinovial em corte e dois ligamentos extrínsecos. Cada peça é uma
superfície de revolução construída a partir de um perfil descrito por funções,
com sombreamento suave — o côndilo superior é convexo de verdade, a superfície
inferior é côncava, e a cápsula e a membrana são cascas finas abertas na frente
para deixar a cavidade articular à vista.

São 59.744 triângulos, contra 4.800 da versão anterior, que era montada com oito
primitivas (cilindros e toros) e não representava bem as superfícies articulares.

Esquema genérico e ampliado, feito para explicar a organização de uma
articulação sinovial. Não representa joelho, ombro ou qualquer articulação
específica, e as formas e o espaço articular são simplificados de propósito.
Não há reconstrução de exames nem geometria de paciente.

## Histórico

A primeira versão deste esquema foi construída com o Blender do Higgsfield
3D Jutsu. A versão atual não reaproveita nada dela: a geometria inteira é
gerada pelo script citado acima, o que a torna reproduzível e ajustável.
