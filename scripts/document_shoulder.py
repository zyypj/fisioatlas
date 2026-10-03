"""Export every module fiche and the audited 3D representation to one document."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
catalog = json.loads((ROOT / "src/data/structures.json").read_text(encoding="utf8"))
byid = {s["id"]: s for s in catalog}
module = json.loads((ROOT / "src/data/shoulder.json").read_text(encoding="utf8"))
ids = [sid for g in module["groups"] for sid in g["ids"]]
source_ids = {s["modelSource"] for s in catalog if s["id"] in ids}
missing = [sid for sid in ids if not byid[sid]["modelIds"]]
if missing:
    raise SystemExit("Missing individual 3D: " + ", ".join(missing))
lines = [
    "# Ombro e manguito rotador — FisioAtlas",
    "",
    "Documento de estudo macroscópico · atualizado em 03/10/2026.",
    "",
    f"O módulo reúne **{len(ids)} estruturas com fichas e representação 3D individual**: {len(ids) - len(module['generated'])} usam malhas da fonte Z-Anatomy/BodyParts3D e {len(module['generated'])} usam complementos topográficos didáticos produzidos no Higgsfield 3D Jutsu.",
    "",
    "## Como estudar",
    "",
    "Abra `/ombro` no aplicativo. Cada cartão abre a ficha e posiciona a câmera na região. Use **Ver detalhes**, **Isolar** e **Ajustar camadas** para comparar os tecidos. As fáscias de revestimento ficam ocultas até serem selecionadas ou ativadas.",
    "",
    "O manguito é formado por supraespinal, infraespinal, redondo menor e subescapular, com seus tendões. Deltoide, redondo maior e bíceps têm relações funcionais com ele, mas não são membros desse grupo.",
    "",
    "## Escopo e limites do 3D",
    "",
    "- Escopo: complexo musculoesquelético do ombro, manguito, tendão bicipital proximal, principais estabilizadores escapulares e nervos relacionados. O documento não declara cobertura integral de microanatomia, vasos, pele, variações ou todas as estruturas do corpo.",
    "- As malhas Z-Anatomy são preservadas no referencial métrico do corpo e descrevem um indivíduo e as convenções da base. CC BY-SA 4.0; atribuição em `models/Z-ANATOMY-LICENSE.md`.",
    "- Os 15 complementos são superfícies aproximadas construídas por script no Higgsfield. Não são segmentações anatômicas ou medições de paciente. Percursos, espessuras e enteses não foram validados por um docente. O lado esquerdo foi espelhado do direito.",
    "- A cartilagem e a sinovial complementares simplificam a organização dos tecidos. A sinovial é apresentada em corte. Intervalo rotador e interface escapulotorácica são regiões de referência, não tecidos adicionais.",
    "- Cabo, crescente e polia são divisões didáticas de complexos contínuos. As bandas anterior/posterior e a bolsa axilar do ligamento glenoumeral inferior estão descritas dentro de sua ficha; a fonte oferece uma malha única do complexo.",
    "- As malhas das articulações glenoumeral, acromioclavicular e esternoclavicular mostram suas cápsulas; superfícies e discos têm suas próprias fichas quando disponíveis. Marcos como acrômio, coracoide e tubérculos são partes do osso, documentados em Escápula e Úmero.",
    "- As animações usam os eixos e parâmetros genéricos existentes do aplicativo; a conferência estática não valida forças, tensão ou cinemática clínica dos complementos.",
    "",
    "## Relações essenciais",
    "",
    "A clavícula conecta-se ao esterno pela esternoclavicular e ao acrômio pela acromioclavicular. Sua ficha dá acesso direto aos ligamentos esternoclavicular anterior, esternoclavicular posterior, interclavicular e costoclavicular, além dos ligamentos acromioclavicular, conoide e trapezoide e dos discos articulares. O costoclavicular também está conectado à primeira costela.",
    "",
    "O manguito integra estabilização dinâmica; lábio, cápsula e ligamentos contribuem para estabilidade passiva. Os tendões superiores passam sob o arco coracoacromial, separados dele pelas bolsas. A polia contém o tendão bicipital na saída do intervalo. O recesso subescapular comunica-se com a articulação, enquanto a bolsa subcoracoidea é uma estrutura distinta. A escápula posiciona a glenoide pelo movimento combinado da cintura escapular.",
    "",
    "A inervação principal do manguito é supraescapular (supraespinal e infraespinal), axilar (redondo menor) e subescapular superior/inferior (subescapular). A vascularização regional envolve a rede supraescapular, subescapular/circunflexa escapular e circunflexa umeral, com variações. Os vasos são descritos, sem malhas individuais neste módulo.",
    "",
    "## Inventário de cobertura",
    "",
    "| Grupo | Fichas | 3D |",
    "|---|---:|---:|",
]
for g in module["groups"]:
    lines.append(
        f"| {g['title']} | {len(g['ids'])} | {sum(bool(byid[s]['modelIds']) for s in g['ids'])} |"
    )
for g in module["groups"]:
    lines.extend(["", f"## {g['title']}", ""])
    for sid in g["ids"]:
        s = byid[sid]
        lines.extend(
            [
                f"### {s['name']}",
                "",
                s["summary"],
                "",
                f"**Ficha no aplicativo:** `/anatomia/{s['kind']}/{sid}`",
                "",
            ]
        )
        for key, value in s["fields"].items():
            lines.extend([f"**{key}:** {value}", ""])
        lines.extend(
            [
                "**Representação 3D:** "
                + (
                    "Complemento topográfico didático Higgsfield."
                    if s["modelSource"] == "higgsfield-shoulder"
                    else "Malha anatômica da fonte Z-Anatomy."
                )
                + " "
                + s.get("modelNote", ""),
                "",
            ]
        )
        lines.extend(
            [
                "**Componentes:** " + ", ".join(s.get("modelComponents", [])),
                "",
                "**Conexões:** "
                + ", ".join(byid[x]["name"] for x in s["related"] if x in byid),
                "",
                "**Fontes da ficha (IDs da página Fontes):** "
                + ", ".join(s["sources"]),
                "",
            ]
        )
lines.extend(
    [
        "## Fontes e procedência",
        "",
        "- [OpenStax — músculos da cintura escapular e do membro superior](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs).",
        "- [NCBI Bookshelf — articulação glenoumeral](https://www.ncbi.nlm.nih.gov/books/NBK537018/).",
        "- [Shoulder Anatomy and Normal Variants](https://pmc.ncbi.nlm.nih.gov/articles/PMC6251069/).",
        "- [Clark e Harryman — estudo de tendões, ligamentos e cápsula](https://pubmed.ncbi.nlm.nih.gov/1624486/).",
        "- [NCBI Bookshelf — espaço quadrangular](https://www.ncbi.nlm.nih.gov/books/NBK537324/).",
        "- [Lee et al. — anatomia da articulação esternoclavicular](https://pubmed.ncbi.nlm.nih.gov/25274794/).",
        "- [Spencer et al. — estabilizadores esternoclaviculares](https://pubmed.ncbi.nlm.nih.gov/11845148/).",
        "- [Tubbs et al. — anatomia do ligamento interclavicular](https://pubmed.ncbi.nlm.nih.gov/17563831/).",
        "- [Z-Anatomy — malhas originais](https://github.com/Z-Anatomy/Models-of-human-anatomy).",
        "- [Cena editável Higgsfield 3D Jutsu](https://higgsfield.ai/3d-jutsu/b80fd313-010f-4c2c-bd02-95f9d13b5ffe).",
        "",
        "Os textos são resumos próprios de anatomia. A geração no Higgsfield não certifica fidelidade anatômica. O código e o registro de procedência permitem revisar as escolhas.",
        "",
        "## Reprodução técnica",
        "",
        "Conteúdo: `scripts/build_shoulder_content.py` → `scripts/content/70-ombro-manguito.json` → `scripts/build_expansion.py`.",
        "",
        "Modelos: exportar os componentes Z-Anatomy com `scripts/export_z_anatomy.py`, comprimir com `scripts/optimize_models.mjs`, anexar o GLB original Higgsfield com `scripts/integrate_shoulder.mjs` e gerar este documento com `scripts/document_shoulder.py`. O GLB complementar fica local em `public/models/shoulder-higgsfield-source.glb`; o estudo não exige conexão com o Higgsfield.",
        "",
        "A integração remove câmeras, luzes e ossos esquemáticos de contexto antes de anexar os complementos às camadas. IDs estáveis, coordenadas, hashes e fontes estão em `public/models/coverage.json`, `bounds.json` e `provenance.json`.",
        "",
    ]
)
(ROOT / "public/OMBRO.md").write_text("\n".join(lines), encoding="utf8")
print(f"Documented {len(ids)} entries with verified individual 3D.")
