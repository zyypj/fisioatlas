# Licenças das malhas do FisioAtlas

## Corpo atual: Z-Anatomy

Os arquivos `z-*.glb` derivam do projeto Z-Anatomy e são distribuídos sob **Creative Commons Attribution-ShareAlike 4.0 International**. As adaptações das malhas permanecem sob a mesma licença.

- Z-Anatomy — The libre 3D atlas of anatomy — CC-BY-SA 4.0.
- Gauthier Kervyn (design, modelagem e anatomia), Marcin Zielinski (Blender), demais colaboradores identificados no repositório.
- Base original: BodyParts3D — The Database Center for Life Science — Kousaku Okubo. A atribuição histórica CC-BY-SA 2.1 Japan fornecida pelo Z-Anatomy é preservada no arquivo original de licença.
- Fonte: https://github.com/Z-Anatomy/Models-of-human-anatomy
- Licença e atribuições originais, sem alterações: [Z-ANATOMY-LICENSE.md](Z-ANATOMY-LICENSE.md).
- Licença: https://creativecommons.org/licenses/by-sa/4.0/

Transformações: avaliação de malhas e curvas em Blender, triangulação, conversão de Z-up para Y-up, preservação das coordenadas mundiais em metros, normais, limitação de subdivisão e compressão Meshopt. Os componentes importados estão em `coverage.json`, com associações às fichas; a origem e o SHA256 do arquivo estão em `provenance.json`. As animações rígidas e cores de destaque são adaptações educacionais.

Não foram importados ouvido interno nem rim, que constam com condições adicionais na lista de atribuições do projeto original.

## Arquivos da primeira edição: BodyParts3D 4.0

Os arquivos sem prefixo `z-` são mantidos como material anterior e não são carregados pelo manifesto atual.

BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

Source: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
License statement: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
License: https://creativecommons.org/licenses/by/4.0/
Publication: https://doi.org/10.1093/nar/gkn613

Original: isa_BP3D_4.0_obj_99.zip (99% polygon reduction). Changes: conversion from OBJ to GLB; scale from mm to m; Z-up to Y-up rotation; calculated vertex normals; grouping by educational category. No invented anatomical mesh. Runtime coloration and rigid segment animations are educational adaptations, not biomechanical simulation.
