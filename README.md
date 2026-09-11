# FisioAtlas 3D

Atlas de estudo de anatomia em português brasileiro, com React, TypeScript, Vite e Three.js. Aplicativo local funcional, sem conta, sem banco remoto e sem imagens substituindo o modelo tridimensional.

## Abrir

Com Node.js instalado, abra **INICIAR.cmd** e acesse **http://127.0.0.1:4173**. Mantenha a janela do servidor aberta. Se essa porta já estiver em uso por esta aplicação, basta acessar o endereço.

Pelo terminal, na pasta do projeto:

```sh
npm ci
npm run build
npm start
```

Para desenvolver: `npm run dev -- --host 127.0.0.1 --port 5173`.

## O que está implementado

- 445 fichas: 184 músculos, 102 ligamentos e membranas, 56 ossos ou grupos ósseos, 39 entradas de articulações, discos, lábios, meniscos e bolsas sinoviais, 35 nervos e plexos, e 29 tendões, aponeuroses, retináculos, fáscias e bainhas tendíneas.
- 441 fichas associadas a componentes reais do Z-Anatomy/BodyParts3D. 1.446 malhas, aproximadamente 13,95 MiB de GLB comprimidos com Meshopt, em seis sistemas. Todas as estruturas musculoesqueléticas modeladas na fonte estão no atlas.
- Giro, zoom, deslocamento, seis vistas, foco, seleção, destaque, transparência, ocultação e isolamento por menu ou duplo clique.
- Modelos de ossos, músculos, cápsulas/discos/meniscos, ligamentos, nervos com ramos e tendão calcâneo com controle de opacidade. Musculatura profunda filtrável. Predefinições para nervos e ossos, e para articulações e ligamentos.
- Laboratório interativo de articulação sinovial em corte, construído com Higgsfield 3D Jutsu, com oito peças e destaque por componente. Disponível em Anatomia aplicada; GLB local, sem dependência do Higgsfield durante o estudo.
- Pesquisa sem acentos, abreviações como LCA/LCP, sinônimos, navegação por região e links entre estruturas.
- Dez demonstrações animadas: flexão/extensão de cotovelo, abdução/adução de ombro, flexão/extensão de quadril e joelho, dorsiflexão/flexão plantar. Reprodução, pausa, repetição cíclica, velocidade e barra arrastável.
- Modo de destaque dos agonistas e informação de antagonistas, plano, eixo e exemplo cotidiano.
- Planos semitransparentes no corpo, setas de orientação, termos e aula de posição anatômica.
- Quiz por clique 3D ou alternativas acessíveis, flashcards de ação/origem/inserção/inervação, favoritos, histórico, pesquisas recentes e desempenho salvo em localStorage.
- Comparação de fichas, conteúdo introdutório de cadeia cinética, contrações e testes musculares.
- Rotas próprias, estado de carregamento com bytes reais e recuperação de falha de WebGL/modelos.
- Interface adaptável a desktop, tablet e celular.

## Limites desta edição

Esta é uma primeira versão utilizável e expansível, **não uma cobertura integral de todos os itens das fases 2 e 3**.

- Cobertura: ossos 56/56, músculos 184/184, ligamentos 102/102, tendões e fáscias 29/29, articulações e bolsas 38/39 e nervos 34/35. Todas as seis camadas podem ser ligadas. Faltam malhas próprias para talocrural, atlanto-occipital, atlantoaxial e nervo glúteo inferior, porque a fonte não modela essas estruturas separadamente; cada uma dessas fichas explica, no campo "Estudo 3D", o que isolar no modelo para estudar a região.
- A camada articular apresenta cápsulas, discos, meniscos ou ligamentos de suporte conforme a estrutura; não representa todos os tecidos de cada articulação. Os componentes originais são listados nas fichas. O laboratório Higgsfield é um esquema genérico, não uma malha anatômica específica.
- Não inclui pele, todos os órgãos ou todos os nervos do corpo. Osso/grupo ósseo não equivale à contagem dos 206 ossos do adulto.
- As animações oferecem todos os tecidos disponíveis ou somente ossos, com transparência individual. O painel **Simulação dos tecidos** resolve equilíbrio músculo–tendão do tipo Hill, mola ligamentar só à tração, elasticidade tendínea e reserva geométrica de deslizamento neural. O ventre muscular se deforma conforme a solução; seleção e foco usam as posições deformadas. Ativação, coativação, rigidez, folga, complacência e reserva neural são ajustáveis. O ângulo continua imposto, sem dinâmica de forças dirigindo os ossos. Parâmetros genéricos, trajetos aproximados e forças relativas não são dados clínicos. Veja [equações e hipóteses](public/BIOMECANICA.md).
- A camada de tendões reúne tendões, aponeuroses, retináculos e bainhas: aponeurose plantar e palmar, retináculos do punho e do tornozelo, bainhas dos flexores e dos fibulares, entre outros. As fichas do tendão comum dos extensores, do tendão comum dos flexores e do ligamento patelar usam as marcas de fixação da fonte, e não o corpo do tendão; isso está declarado no campo "Estudo 3D" de cada uma, já que a área de fixação é o que interessa na epicondilalgia e na doença de Osgood-Schlatter.
- Origem e inserção são descritas em texto; não foram inventadas coordenadas ou marcações de fixação nos modelos.
- Há 38 movimentos animados, cobrindo ombro, cotovelo, antebraço, punho, quadril, joelho, tornozelo, subtalar, coluna cervical, tronco e articulação temporomandibular. Os ângulos são escolhas de visualização, não valores de goniometria, e os eixos são aproximações fixas. Cadeia cinética fechada e tipos de contração continuam com conteúdo textual, sem animação específica.
- Todas as fichas musculares trazem origem, inserção, inervação, ação, grupo, plano e eixo, sinergistas, antagonistas, observação funcional, exemplo de exercício e palpação. As fichas de ossos trazem "Articula-se com" e marcos de palpação; as de ligamentos, fixações, o que tensiona, teste clínico e lesão típica; as de nervos, raízes, trajeto, território, local de compressão e sinal clínico. O conteúdo é didático e não substitui avaliação profissional.
- Os modelos são uma representação de um adulto da base BodyParts3D e não contemplam todas as variações anatômicas. O material deve ser confrontado com as referências e a orientação da disciplina, especialmente para aplicação clínica.
- O progresso pertence ao navegador e endereço usados. Limpar os dados do site remove o histórico. Não há sincronização entre dispositivos.
- A tipografia utiliza Google Fonts, com fontes locais de fallback. Os modelos ficam no projeto e não dependem de um serviço 3D externo durante o uso.

## Organização

```text
src/
  components/          painéis reutilizáveis
  data/                fichas, movimentos, referências e índices de busca
  features/viewer/      motor Three.js e interface do visualizador
  features/movements/  controles e ficha de movimento
  features/study/       quiz, flashcards, comparação e páginas de estudo
  hooks/               estado persistido
  services/            leitura e validação do progresso
  types.ts             contratos de dados
public/models/         GLB, manifesto, limites geométricos e licença
scripts/               preparação, compressão e testes
```

## Dados e modelos

O catálogo editorial é mantido em `scripts/build_catalog.py`, separado da interface. Ele gera `src/data/structures.json`. Os IDs são estáveis e todas as relações devem resolver para IDs existentes. Reexecutar esse gerador exige rodar em seguida a preparação dos modelos para restaurar as associações.

Os arquivos brutos estão na pasta irmã `../scratch/`. Para reproduzir o corpo atual, use Blender 4.5 LTS e execute na pasta do projeto:

```sh
python scripts/build_catalog.py
blender --background --factory-startup --python scripts/inspect_z_anatomy.py
python scripts/map_z_anatomy.py
blender --background --factory-startup --python scripts/export_z_anatomy.py
node scripts/optimize_models.mjs
npm test
npm run build
```

`map_z_anatomy.py` mantém as associações explícitas por nomes e coleções; `export_z_anatomy.py` preserva a posição relativa de ossos, músculos, cápsulas, ligamentos e nervos. Scripts do arquivo Blender de origem ficam desativados. `optimize_models.mjs` aplica deduplicação, solda de vértices e Meshopt. O SHA256 do ZIP original e as transformações estão em `public/models/provenance.json`. `coverage.json` permite auditar cada componente. `prepare_models.py` é o importador legado do BodyParts3D v4.

Para ampliar: adicione uma ficha, declare relações e referências, mapeie o termo oficial a malhas licenciadas e execute novamente os testes. Uma ficha sem malha continua funcionando como conteúdo textual.

## Validação

```sh
npm test
npm run lint
npm run build
```

A suíte testa busca, IDs, relações, campos obrigatórios, persistência corrompida/parcial, renderização das 179 rotas principais e decodificação/integridade dos GLB. Ela não substitui a revisão anatômica por um docente.

Os testes visuais e interativos estão registrados em `VALIDACAO.md`.

## Licenças e referências

**Malhas atuais: Z-Anatomy, derivado de BodyParts3D, CC BY-SA 4.0.** As malhas adaptadas permanecem sob essa licença. Atribuições históricas e condições adicionais da fonte são preservadas em `public/models/Z-ANATOMY-LICENSE.md`.

O esquema de articulação sinovial foi construído por script próprio no Higgsfield 3D Jutsu (projeto `7d5ee5e8-869c-40f7-9c82-86a2c6d4f0ba`, revisão 1). Código: `scripts/higgsfield_joint.py`; arquivos: `public/lessons/`. Formas genéricas baseadas em conceitos de articulação sinovial, sem reprodução de uma ilustração de livro.

- Base oficial: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- Condições: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
- Artigo: https://doi.org/10.1093/nar/gkn613
- Transformações locais e atribuição: `public/models/LICENSE.md`.
- Fontes editoriais: `src/data/sources.ts` e página **Fontes e referências**.

Os resumos em português são redação própria de fatos anatômicos; não foram reproduzidas páginas, fotografias ou tabelas de livros. Os modelos conservam sua atribuição. Não foram usadas imagens geradas para representar anatomia 3D.
