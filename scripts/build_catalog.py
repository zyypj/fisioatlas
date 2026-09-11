"""Author-maintained Portuguese learning catalog. Run before prepare_models.py."""
import json, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src/data'
OUT.mkdir(parents=True, exist_ok=True)
def slug(s):
    return unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower().replace(' ', '-').replace('(', '').replace(')', '')
items = []
def add(name, english, kind, region, summary, fields, related=(), depth='superficial', sources=()):
    item = dict(id=slug(name), name=name, english=english, kind=kind, region=region, summary=summary, fields=fields, related=list(related), depth=depth, sources=list(sources or ['openstax-'+ ('muscles' if kind=='musculos' else 'bones' if kind=='ossos' else 'joints')]), aliases=[], modelIds=[])
    items.append(item)
    return item

# name | model ontology term | region | origin | insertion | nerve | action | everyday example
muscles = '''
Deltoide|deltoid|Ombro|Terço lateral da clavícula, acrômio e espinha da escápula.|Tuberosidade deltoidea do úmero.|Nervo axilar (C5–C6).|Abduz o braço; fibras anteriores auxiliam flexão e rotação medial; posteriores, extensão e rotação lateral.|Levantar o braço para alcançar uma prateleira lateral.
Supraespinal|supraspinatus|Ombro|Fossa supraespinal da escápula.|Faceta superior do tubérculo maior do úmero.|Nervo supraescapular (C5–C6).|Auxilia a abdução desde seu início e estabiliza a cabeça do úmero.|Começar a afastar o braço do corpo.
Infraespinal|infraspinatus|Ombro|Fossa infraespinal da escápula.|Faceta média do tubérculo maior do úmero.|Nervo supraescapular (C5–C6).|Rotação lateral do braço e estabilização glenoumeral.|Girar o braço para fora com o cotovelo junto ao tronco.
Subescapular|subscapularis|Ombro|Fossa subescapular.|Tubérculo menor do úmero.|Nervos subescapulares superior e inferior (C5–C6).|Rotação medial e estabilização glenoumeral.|Trazer a mão em direção ao abdômen.
Redondo menor|teres minor|Ombro|Porção superior da borda lateral da escápula.|Faceta inferior do tubérculo maior do úmero.|Nervo axilar (C5–C6).|Rotação lateral e estabilização do ombro.|Girar o braço para fora.
Redondo maior|teres major|Ombro|Face posterior do ângulo inferior da escápula.|Lábio medial do sulco intertubercular do úmero.|Nervo subescapular inferior (C5–C6).|Adução, extensão e rotação medial do braço.|Puxar um objeto em direção ao corpo.
Bíceps braquial|biceps brachii|Braço|Cabeça longa: tubérculo supraglenoidal; cabeça curta: processo coracoide da escápula.|Tuberosidade do rádio e fáscia do antebraço pela aponeurose bicipital.|Nervo musculocutâneo (C5–C6).|Supinação do antebraço e flexão do cotovelo; auxilia flexão do ombro.|Levar um copo até a boca.
Braquial|brachialis|Braço|Metade distal da face anterior do úmero.|Tuberosidade da ulna e processo coronoide.|Nervo musculocutâneo (C5–C6); pequena contribuição radial na parte lateral.|Flexão do cotovelo em diferentes posições do antebraço.|Dobrar o cotovelo ao carregar uma sacola.
Tríceps braquial|triceps brachii|Braço|Cabeça longa: tubérculo infraglenoidal; lateral e medial: face posterior do úmero, acima e abaixo do sulco radial.|Olécrano da ulna.|Nervo radial (C6–C8, predominância C7).|Estende o cotovelo; cabeça longa auxilia extensão e adução do ombro.|Empurrar uma porta.
Coracobraquial|coracobrachialis|Braço|Processo coracoide da escápula.|Terço médio da face medial do úmero.|Nervo musculocutâneo (C5–C7).|Flexão e adução do ombro.|Trazer o braço à frente e junto ao corpo.
Braquiorradial|brachioradialis|Antebraço|Crista supracondilar lateral do úmero.|Rádio distal, próximo ao processo estiloide.|Nervo radial (C5–C6).|Flexão do cotovelo, especialmente com antebraço em posição neutra.|Levantar uma caneca com o polegar para cima.
Pronador redondo|pronator teres|Antebraço|Epicôndilo medial do úmero e processo coronoide da ulna.|Face lateral do terço médio do rádio.|Nervo mediano (C6–C7).|Pronação do antebraço; auxilia flexão do cotovelo.|Virar a palma da mão para baixo.
Pronador quadrado|pronator quadratus|Antebraço|Quarto distal da face anterior da ulna.|Quarto distal da face anterior do rádio.|Nervo interósseo anterior, ramo do mediano (C8–T1).|Pronação e estabilização radioulnar distal.|Virar a palma sobre a mesa.
Supinador|supinator|Antebraço|Epicôndilo lateral, ligamentos radial e anular e crista do supinador na ulna.|Terço proximal do rádio.|Ramo profundo do nervo radial (C6–C7).|Supinação do antebraço.|Virar a palma para receber moedas.
Flexor radial do carpo|flexor carpi radialis|Antebraço|Epicôndilo medial do úmero.|Base do segundo metacarpal, com expansão ao terceiro.|Nervo mediano (C6–C7).|Flexão e abdução radial do punho.|Dobrar o punho em direção ao polegar.
Flexor ulnar do carpo|flexor carpi ulnaris|Antebraço|Epicôndilo medial, olécrano e borda posterior da ulna.|Pisiforme; por ligamentos, hâmulo do hamato e quinto metacarpal.|Nervo ulnar (C7–T1).|Flexão e adução ulnar do punho.|Inclinar o punho para o lado do dedo mínimo.
Extensor radial longo do carpo|extensor carpi radialis longus|Antebraço|Crista supracondilar lateral do úmero.|Base dorsal do segundo metacarpal.|Nervo radial (C6–C7).|Extensão e abdução radial do punho.|Manter o punho estável ao segurar uma ferramenta.
Extensor ulnar do carpo|extensor carpi ulnaris|Antebraço|Epicôndilo lateral e face posterior da ulna.|Base dorsal do quinto metacarpal.|Nervo interósseo posterior (C7–C8).|Extensão e adução ulnar do punho.|Estabilizar o punho durante a preensão.
Flexor superficial dos dedos|flexor digitorum superficialis|Antebraço|Epicôndilo medial, processo coronoide e face anterior do rádio.|Bordas das falanges médias dos dedos 2–5.|Nervo mediano (C7–T1).|Flexão das interfalângicas proximais; auxilia flexão dos dedos e punho.|Segurar uma alça com os dedos dobrados.
Flexor profundo dos dedos|flexor digitorum profundus|Antebraço|Ulna proximal anterior e medial e membrana interóssea.|Bases das falanges distais dos dedos 2–5.|Metade lateral: interósseo anterior; metade medial: ulnar (C8–T1).|Flexão das interfalângicas distais.|Firmar as pontas dos dedos em um objeto.
Extensor dos dedos|extensor digitorum|Antebraço|Epicôndilo lateral do úmero.|Expansões extensoras dos dedos 2–5.|Nervo interósseo posterior (C7–C8).|Extensão dos dedos e auxílio na extensão do punho.|Abrir a mão para soltar um objeto.
Abdutor curto do polegar|abductor pollicis brevis|Mão|Retináculo dos flexores, escafoide e trapézio.|Base lateral da falange proximal do polegar.|Ramo recorrente do mediano (C8–T1).|Abdução palmar do polegar.|Afastar o polegar para pegar um copo.
Adutor do polegar|adductor pollicis|Mão|Capitato e bases dos metacarpais 2–3; corpo do terceiro metacarpal.|Base medial da falange proximal do polegar.|Ramo profundo do ulnar (C8–T1).|Adução do polegar e força de pinça.|Prender uma folha entre polegar e indicador.
Trapézio|trapezius|Tronco|Occipital, ligamento nucal e processos espinhosos C7–T12.|Clavícula lateral, acrômio e espinha da escápula.|Nervo acessório (XI), motor; C3–C4, propriocepção.|Elevação, retração, depressão e rotação superior da escápula, conforme as fibras.|Encolher os ombros e elevar o braço.
Serrátil anterior|serratus anterior|Tronco|Faces externas das primeiras 8–9 costelas.|Face anterior da borda medial da escápula.|Nervo torácico longo (C5–C7).|Protração e rotação superior da escápula; mantém-na junto ao tórax.|Empurrar uma parede afastando as escápulas.
Peitoral maior|pectoralis major|Tronco|Metade medial da clavícula, esterno, cartilagens costais superiores e aponeurose do oblíquo externo.|Lábio lateral do sulco intertubercular do úmero.|Nervos peitorais lateral e medial (C5–T1).|Adução e rotação medial; fibras claviculares auxiliam flexão do ombro.|Abraçar alguém.
Peitoral menor|pectoralis minor|Tronco|Costelas 3–5, próximo às cartilagens costais.|Processo coracoide da escápula.|Nervo peitoral medial (C8–T1).|Estabiliza a escápula, tracionando-a anterior e inferiormente.|Estabilizar a cintura escapular ao apoiar os braços.
Latíssimo do dorso|latissimus dorsi|Tronco|Processos espinhosos torácicos inferiores, fáscia toracolombar, crista ilíaca e costelas inferiores.|Assoalho do sulco intertubercular do úmero.|Nervo toracodorsal (C6–C8).|Extensão, adução e rotação medial do braço.|Puxar o corpo para cima ao escalar.
Romboide maior|rhomboid major|Tronco|Processos espinhosos T2–T5.|Borda medial da escápula, inferior à espinha.|Nervo dorsal da escápula (C4–C5).|Retração e rotação inferior da escápula.|Aproximar as escápulas.
Levantador da escápula|levator scapulae|Cabeça e pescoço|Processos transversos C1–C4.|Borda medial superior da escápula.|Nervo dorsal da escápula (C5) e ramos C3–C4.|Elevação e rotação inferior da escápula.|Erguer a cintura escapular.
Esternocleidomastóideo|sternocleidomastoid|Cabeça e pescoço|Manúbrio do esterno e terço medial da clavícula.|Processo mastoide e linha nucal superior.|Nervo acessório (XI), motor; C2–C3, propriocepção.|Unilateral: inclinação ipsilateral e rotação contralateral; bilateral: flexão cervical.|Virar a cabeça para olhar para o lado oposto.
Masseter|masseter|Cabeça e pescoço|Arco zigomático.|Face lateral do ramo e ângulo da mandíbula.|Nervo massetérico, ramo de V3.|Eleva a mandíbula.|Fechar a boca durante a mastigação.
Músculo temporal|temporalis|Cabeça e pescoço|Fossa temporal e fáscia temporal.|Processo coronoide da mandíbula.|Nervos temporais profundos, ramos de V3.|Elevação e retração da mandíbula.|Mastigar e trazer a mandíbula para trás.
Reto do abdômen|rectus abdominis|Tronco|Crista e sínfise púbicas.|Processo xifoide e cartilagens costais 5–7.|Nervos toracoabdominais (T6–T12).|Flexão do tronco e compressão abdominal.|Elevar o tronco ao sair da cama.
Oblíquo externo|external oblique|Tronco|Faces externas das costelas 5–12.|Linha alba, tubérculo púbico e metade anterior da crista ilíaca.|Nervos toracoabdominais e subcostal (T7–T12).|Flexão, inclinação ipsilateral e rotação contralateral do tronco.|Girar o tronco para alcançar algo do lado oposto.
Oblíquo interno|internal oblique|Tronco|Fáscia toracolombar, crista ilíaca e ligamento inguinal.|Costelas 10–12, linha alba e púbis.|Nervos toracoabdominais e L1.|Flexão e rotação ipsilateral do tronco; compressão abdominal.|Girar o tronco para o mesmo lado.
Transverso do abdômen|transversus abdominis|Tronco|Cartilagens costais inferiores, fáscia toracolombar, crista ilíaca e ligamento inguinal.|Linha alba e púbis pelo tendão conjunto.|Nervos toracoabdominais e L1.|Comprime o conteúdo abdominal e participa da estabilidade do tronco.|Ajudar a controlar a pressão abdominal ao expirar.
Quadrado lombar|quadratus lumborum|Coluna vertebral|Crista ilíaca e ligamento iliolombar.|12ª costela e processos transversos L1–L4.|Ramos anteriores T12–L4.|Inclinação lateral; fixa a 12ª costela na respiração.|Inclinar o tronco lateralmente.
Glúteo máximo|gluteus maximus|Quadril|Ílio posterior, sacro, cóccix e ligamento sacrotuberal.|Trato iliotibial e tuberosidade glútea do fêmur.|Nervo glúteo inferior (L5–S2).|Extensão e rotação lateral do quadril.|Levantar de uma cadeira e subir escadas.
Glúteo médio|gluteus medius|Quadril|Face externa do ílio, entre as linhas glúteas anterior e posterior.|Face lateral do trocânter maior.|Nervo glúteo superior (L4–S1).|Abdução e estabilização pélvica; fibras anteriores auxiliam rotação medial.|Evitar que a pelve caia ao ficar em uma perna.
Glúteo mínimo|gluteus minimus|Quadril|Face externa do ílio, entre linhas glúteas anterior e inferior.|Face anterior do trocânter maior.|Nervo glúteo superior (L4–S1).|Abdução, rotação medial e estabilização do quadril.|Estabilizar a pelve durante a caminhada.
Tensor da fáscia lata|tensor fasciae latae|Quadril|Espinha ilíaca anterossuperior e crista ilíaca adjacente.|Trato iliotibial, que alcança o côndilo lateral da tíbia.|Nervo glúteo superior (L4–S1).|Flexão, abdução e rotação medial do quadril; tensiona o trato iliotibial.|Ajudar no controle lateral durante a marcha.
Psoas maior|psoas major|Quadril|Corpos, discos e processos transversos de T12–L5.|Trocânter menor do fêmur, junto ao ilíaco.|Ramos anteriores L1–L3.|Flexão do quadril; participa do controle lombar.|Levantar a coxa para subir um degrau.
Ilíaco|iliacus|Pelve|Fossa ilíaca.|Trocânter menor, pelo tendão do iliopsoas.|Nervo femoral (L2–L3).|Flexão do quadril.|Levantar o joelho ao vestir uma calça.
Piriforme|piriformis|Quadril|Face anterior do sacro.|Borda superior do trocânter maior.|Nervo para o piriforme (S1–S2).|Rotação lateral com quadril estendido; abdução com quadril flexionado.|Ajudar a controlar a posição da coxa.
Reto femoral|rectus femoris|Coxa|Espinha ilíaca anteroinferior e região supra-acetabular.|Patela pelo tendão do quadríceps e tuberosidade da tíbia pelo ligamento patelar.|Nervo femoral (L2–L4).|Extensão do joelho e flexão do quadril.|Chutar uma bola.
Vasto lateral|vastus lateralis|Coxa|Trocânter maior e lábio lateral da linha áspera.|Patela e tuberosidade da tíbia pelo aparelho extensor.|Nervo femoral (L2–L4).|Extensão do joelho e estabilização patelar.|Endireitar o joelho para ficar em pé.
Vasto medial|vastus medialis|Coxa|Linha intertrocantérica e lábio medial da linha áspera.|Patela e tuberosidade da tíbia pelo aparelho extensor.|Nervo femoral (L2–L4).|Extensão do joelho e estabilização patelar.|Controlar o joelho ao subir um degrau.
Vasto intermédio|vastus intermedius|Coxa|Faces anterior e lateral do corpo do fêmur.|Patela e tuberosidade da tíbia pelo aparelho extensor.|Nervo femoral (L2–L4).|Extensão do joelho.|Estender a perna estando sentada.
Sartório|sartorius|Coxa|Espinha ilíaca anterossuperior.|Face medial proximal da tíbia, na pata de ganso.|Nervo femoral (L2–L3).|Flexão, abdução e rotação lateral do quadril; flexão do joelho.|Cruzar uma perna sobre a outra.
Bíceps femoral|biceps femoris|Coxa|Cabeça longa: tuberosidade isquiática; curta: linha áspera e linha supracondilar lateral.|Cabeça da fíbula.|Divisão tibial do ciático (longa) e fibular comum (curta), L5–S2.|Flexão e rotação lateral do joelho flexionado; cabeça longa estende o quadril.|Dobrar o joelho ao caminhar.
Semitendíneo|semitendinosus|Coxa|Tuberosidade isquiática.|Face medial proximal da tíbia, na pata de ganso.|Divisão tibial do ciático (L5–S2).|Extensão do quadril, flexão e rotação medial do joelho flexionado.|Levar o calcanhar para trás.
Semimembranáceo|semimembranosus|Coxa|Tuberosidade isquiática.|Face posterior do côndilo medial da tíbia.|Divisão tibial do ciático (L5–S2).|Extensão do quadril, flexão e rotação medial do joelho flexionado.|Controlar a perna durante a caminhada.
Adutor longo|adductor longus|Coxa|Corpo do púbis, inferior à crista púbica.|Terço médio da linha áspera.|Nervo obturatório (L2–L4).|Adução da coxa; auxilia flexão do quadril.|Aproximar as pernas.
Adutor magno|adductor magnus|Coxa|Ramos isquiopúbicos e tuberosidade isquiática.|Linha áspera, linha supracondilar medial e tubérculo adutor.|Obturatório (porção adutora) e divisão tibial do ciático (porção isquiotibial).|Adução; porção isquiotibial estende o quadril.|Estabilizar e aproximar a coxa.
Grácil|gracilis|Coxa|Corpo e ramo inferior do púbis.|Face medial proximal da tíbia, na pata de ganso.|Nervo obturatório (L2–L3).|Adução do quadril; flexão e rotação medial do joelho.|Aproximar as pernas e dobrar o joelho.
Tibial anterior|tibialis anterior|Perna|Côndilo lateral e face lateral proximal da tíbia; membrana interóssea.|Cuneiforme medial e base do primeiro metatarsal.|Nervo fibular profundo (L4–L5).|Dorsiflexão e inversão do pé.|Evitar que a ponta do pé arraste no chão.
Gastrocnêmio|gastrocnemius|Perna|Regiões posteriores dos côndilos femorais.|Calcâneo pelo tendão calcâneo.|Nervo tibial (S1–S2).|Flexão plantar do tornozelo e auxílio na flexão do joelho.|Ficar na ponta dos pés.
Sóleo|soleus|Perna|Cabeça e face posterior da fíbula; linha do sóleo e borda medial da tíbia.|Calcâneo pelo tendão calcâneo.|Nervo tibial (S1–S2).|Flexão plantar e controle postural em pé.|Manter o equilíbrio em pé.
Tibial posterior|tibialis posterior|Perna|Faces posteriores de tíbia e fíbula e membrana interóssea.|Principalmente navicular; expansões aos cuneiformes e outras bases do pé.|Nervo tibial (L4–L5).|Inversão, auxílio na flexão plantar e sustentação do arco medial.|Controlar o arco do pé no apoio.
Fibular longo|peroneus longus|Perna|Cabeça e face lateral proximal da fíbula.|Base do primeiro metatarsal e cuneiforme medial, na face plantar.|Nervo fibular superficial (L5–S2).|Eversão, auxílio na flexão plantar e suporte dos arcos.|Adaptar o pé ao terreno.
Fibular curto|peroneus brevis|Perna|Face lateral distal da fíbula.|Tuberosidade da base do quinto metatarsal.|Nervo fibular superficial (L5–S2).|Eversão e auxílio na flexão plantar.|Controlar a borda lateral do pé.
Extensor longo dos dedos|extensor digitorum longus|Perna|Côndilo lateral da tíbia, fíbula anterior e membrana interóssea.|Falanges médias e distais dos dedos 2–5 pelas expansões extensoras.|Nervo fibular profundo (L5–S1).|Extensão dos dedos e dorsiflexão.|Levantar os dedos durante o passo.
Flexor longo do hálux|flexor hallucis longus|Perna|Face posterior distal da fíbula e membrana interóssea.|Base plantar da falange distal do hálux.|Nervo tibial (S2–S3).|Flexão do hálux e auxílio na flexão plantar.|Impulsionar o corpo pelo dedão ao caminhar.
Poplíteo|popliteus|Joelho|Côndilo lateral do fêmur e menisco lateral.|Face posterior da tíbia, acima da linha do sóleo.|Nervo tibial (L4–S1).|Auxilia o desbloqueio do joelho: rotação medial da tíbia livre ou lateral do fêmur apoiado.|Iniciar a flexão de um joelho estendido.
'''
deep = ['Supraespinal','Infraespinal','Subescapular','Redondo menor','Braquial','Coracobraquial','Pronador quadrado','Supinador','Flexor profundo dos dedos','Peitoral menor','Romboide maior','Transverso do abdômen','Quadrado lombar','Glúteo mínimo','Psoas maior','Ilíaco','Piriforme','Vasto intermédio','Tibial posterior','Flexor longo do hálux','Poplíteo']
for line in muscles.strip().splitlines():
    n,e,r,o,i,v,a,p = line.split('|')
    add(n,e,'musculos',r,a,{'Origem':o,'Inserção':i,'Inervação':v,'Ação':a,'Na prática':p},depth='profunda' if n in deep else 'superficial')

bones='''
Frontal|frontal bone|Cabeça e pescoço|Plano e pneumático|Forma a testa, parte do teto das órbitas e da fossa anterior do crânio.|Margem supraorbital; glabela; seio frontal.
Parietal|parietal bone|Cabeça e pescoço|Plano|Compõe a região superior e lateral do neurocrânio.|Linhas temporais; suturas coronal, sagital e lambdoide.
Temporal|temporal bone|Cabeça e pescoço|Irregular e pneumático|Participa da base do crânio, abriga estruturas da audição e se articula com a mandíbula.|Processos mastoide e estiloide; fossa mandibular; meato acústico externo.
Occipital|occipital bone|Cabeça e pescoço|Plano|Forma a parte posterior e inferior do crânio e se articula com o atlas.|Forame magno; côndilos occipitais; linhas nucais.
Esfenoide|sphenoid|Cabeça e pescoço|Irregular e pneumático|Conecta diferentes ossos da base do crânio.|Sela turca; asas maiores e menores; processos pterigoides.
Etmoide|ethmoid|Cabeça e pescoço|Irregular e pneumático|Participa da cavidade nasal e da parede medial da órbita.|Lâmina cribriforme; crista galli; lâmina perpendicular.
Zigomático|zygomatic bone|Cabeça e pescoço|Irregular|Forma a proeminência da bochecha e parte da órbita.|Processos temporal, frontal e maxilar.
Maxila|maxilla|Cabeça e pescoço|Irregular e pneumático|Sustenta os dentes superiores e participa do palato e da órbita.|Processo alveolar; processo palatino; forame infraorbital.
Mandíbula|mandible|Cabeça e pescoço|Irregular|Sustenta os dentes inferiores e se move na articulação temporomandibular.|Corpo; ramo; ângulo; processos condilar e coronoide.
Hioide|hyoid bone|Cabeça e pescoço|Irregular|Sustenta estruturas relacionadas à língua e deglutição, sem articulação óssea direta.|Corpo; cornos maiores e menores.
Atlas|atlas|Cabeça e pescoço|Irregular|Primeira vértebra cervical, sustenta o crânio.|Arcos anterior e posterior; massas laterais.
Áxis|axis|Cabeça e pescoço|Irregular|Segunda vértebra cervical, participa da rotação da cabeça.|Dente do áxis; facetas articulares.
Vértebras cervicais|cervical vertebra|Coluna vertebral|Irregulares|São sete vértebras que sustentam o pescoço e protegem a medula cervical.|Corpo; arco; forames transversários; processos articulares.
Vértebras torácicas|thoracic vertebra|Coluna vertebral|Irregulares|São doze vértebras que se articulam com as costelas.|Fóveas costais; corpo; processos espinhosos.
Vértebras lombares|lumbar vertebra|Coluna vertebral|Irregulares|São cinco vértebras de corpos volumosos relacionadas ao suporte de carga.|Corpo; pedículos; lâminas; processos articulares.
Sacro|sacrum|Pelve|Irregular|Transfere carga da coluna para os ossos do quadril.|Promontório; forames sacrais; superfície auricular.
Cóccix|coccyx|Pelve|Irregular|Porção terminal da coluna, ponto de fixação de estruturas do assoalho pélvico.|Base; ápice; cornos coccígeos.
Costelas|rib|Tronco|Planos e curvos|Formam a caixa torácica e participam da mecânica respiratória.|Cabeça; colo; tubérculo; ângulo; sulco costal.
Esterno|sternum|Tronco|Plano|Protege o tórax anteriormente e conecta clavículas e cartilagens costais.|Manúbrio; corpo; processo xifoide; ângulo esternal.
Clavícula|clavicle|Ombro|Longo|Liga o membro superior ao esqueleto axial e mantém o ombro afastado do tórax.|Extremidades esternal e acromial; tubérculo conoide.
Escápula|scapula|Ombro|Plano|Base óssea do ombro, articula-se com úmero e clavícula.|Espinha; acrômio; processo coracoide; cavidade glenoidal; fossas supraespinal, infraespinal e subescapular.
Úmero|humerus|Braço|Longo|Forma o braço e participa do ombro e do cotovelo.|Cabeça; colos; tubérculos maior e menor; tuberosidade deltoidea; tróclea; capítulo; epicôndilos.
Rádio|radius|Antebraço|Longo|Osso lateral do antebraço na posição anatômica; gira na pronação e supinação.|Cabeça; colo; tuberosidade; processo estiloide.
Ulna|ulna|Antebraço|Longo|Osso medial do antebraço, importante na estabilidade do cotovelo.|Olécrano; processo coronoide; incisura troclear; cabeça; processo estiloide.
Escafoide|scaphoid|Punho|Curto|Osso da fileira proximal do carpo, no lado radial.|Tubérculo; cintura; polos proximal e distal.
Semilunar|lunate|Punho|Curto|Osso proximal do carpo que se articula com o rádio.|Faces articulares proximal e distal.
Piramidal|triquetral|Punho|Curto|Osso proximal do carpo, no lado ulnar.|Face para articulação com o pisiforme.
Pisiforme|pisiform|Punho|Sesamoide|Situa-se no tendão do flexor ulnar do carpo.|Face articular para o piramidal.
Trapézio do carpo|trapezium|Punho|Curto|Articula-se com o primeiro metacarpal, permitindo mobilidade do polegar.|Tubérculo; superfície em sela.
Trapezoide|trapezoid|Punho|Curto|Osso distal do carpo relacionado ao segundo metacarpal.|Faces articulares.
Capitato|capitate|Punho|Curto|Maior osso do carpo, na porção central.|Cabeça; colo; corpo.
Hamato|hamate|Punho|Curto|Osso distal ulnar do carpo.|Hâmulo do hamato.
Metacarpais|metacarpal bone|Mão|Longos|Cinco ossos formam a base óssea da palma.|Bases; corpos; cabeças.
Falanges da mão|phalanx of hand|Mão|Longos|Formam os dedos; o polegar possui duas, e os demais, três.|Bases; corpos; cabeças.
Osso do quadril|hip bone|Pelve|Irregular|Formado pela união de ílio, ísquio e púbis, conecta o sacro ao fêmur.|Crista ilíaca; espinhas ilíacas; acetábulo; forame obturado; tuberosidade isquiática.
Fêmur|femur|Coxa|Longo|Transmite carga entre quadril e joelho e oferece alavanca à musculatura da coxa.|Cabeça; colo; trocânteres maior e menor; linha áspera; côndilos medial e lateral.
Patela|patella|Joelho|Sesamoide|Melhora o braço de alavanca do quadríceps e protege a face anterior do joelho.|Base; ápice; facetas articulares.
Tíbia|tibia|Perna|Longo|Principal osso de suporte de carga da perna.|Côndilos; eminência intercondilar; tuberosidade; crista anterior; maléolo medial.
Fíbula|fibula|Perna|Longo|Oferece fixações musculares e participa da estabilidade lateral do tornozelo.|Cabeça; colo; corpo; maléolo lateral.
Tálus|talus|Tornozelo|Curto|Recebe a carga da perna e a transmite ao pé.|Tróclea; corpo; colo; cabeça.
Calcâneo|calcaneus|Pé|Curto|Forma o calcanhar e recebe a inserção do tendão calcâneo.|Tuberosidade; sustentáculo do tálus; superfícies articulares.
Navicular|navicular bone|Pé|Curto|Osso medial do tarso entre tálus e cuneiformes.|Tuberosidade do navicular.
Cuboide|cuboid|Pé|Curto|Osso lateral do tarso, entre calcâneo e quarto e quinto metatarsais.|Sulco para o tendão do fibular longo.
Cuneiforme medial|medial cuneiform|Pé|Curto|Participa da coluna medial e dos arcos do pé.|Superfícies para navicular e primeiro metatarsal.
Cuneiforme intermédio|intermediate cuneiform|Pé|Curto|Osso do tarso alinhado ao segundo metatarsal.|Superfícies articulares.
Cuneiforme lateral|lateral cuneiform|Pé|Curto|Osso do tarso alinhado ao terceiro metatarsal.|Superfícies articulares.
Metatarsais|metatarsal bone|Pé|Longos|Cinco ossos conectam o tarso aos dedos e ajudam a formar os arcos.|Bases; corpos; cabeças; tuberosidade do quinto metatarsal.
Falanges do pé|phalanx of foot|Pé|Longos|Formam os dedos; o hálux possui duas, e os demais, três.|Bases; corpos; cabeças.
'''
for line in bones.strip().splitlines():
    n,e,r,t,s,p=line.split('|')
    add(n,e,'ossos',r,s,{'Tipo':t,'Localização':r,'Principais partes':p,'Função':s})

joints='''
Glenoumeral|Ombro|Sinovial esferóidea|Cabeça do úmero e cavidade glenoidal da escápula.|Flexão, extensão, abdução, adução e rotações.|Manguito rotador, lábio glenoidal, cápsula e ligamentos glenoumerais.|Permite posicionar a mão no espaço; mobilidade depende também da escápula.|umero,escapula,deltoide,supraespinal,infraespinal,subescapular,redondo-menor
Acromioclavicular|Ombro|Sinovial plana|Acrômio e extremidade acromial da clavícula.|Pequenos deslizamentos e rotações associados à escápula.|Ligamentos acromioclavicular e coracoclavicular.|Participa da elevação completa do braço.|escapula,clavicula
Esternoclavicular|Ombro|Sinovial selar com disco articular|Clavícula, manúbrio e primeira cartilagem costal.|Elevação, depressão, protração, retração e rotação da clavícula.|Ligamentos esternoclaviculares, interclavicular e costoclavicular.|Conexão articular óssea do membro superior com o esqueleto axial.|clavicula,esterno
Cotovelo|Cotovelo|Complexo sinovial: umeroulnar e umerorradial|Tróclea e capítulo do úmero; incisura troclear da ulna e cabeça do rádio.|Flexão e extensão; pronação e supinação pertencem às radioulnares.|Ligamentos colaterais ulnar e radial; congruência óssea.|Aproxima ou afasta a mão do corpo.|umero,ulna,radio,biceps-braquial,braquial,triceps-braquial
Radioulnar proximal|Cotovelo|Sinovial trocoide|Cabeça do rádio e incisura radial da ulna.|Pronação e supinação junto à radioulnar distal.|Ligamento anular do rádio.|Permite girar o antebraço.|radio,ulna,pronador-redondo,supinador
Radioulnar distal|Punho|Sinovial trocoide|Cabeça da ulna e incisura ulnar do rádio.|Pronação e supinação.|Complexo da fibrocartilagem triangular.|Trabalha em conjunto com a radioulnar proximal.|radio,ulna,pronador-quadrado
Radiocarpal|Punho|Sinovial elipsóidea|Rádio e disco articular com escafoide, semilunar e piramidal.|Flexão, extensão, abdução radial e adução ulnar.|Ligamentos radiocarpais e colaterais.|Posiciona a mão para preensão.|radio,escafoide,semilunar,piramidal,flexor-radial-do-carpo
Carpometacarpal do polegar|Mão|Sinovial selar|Trapézio e base do primeiro metacarpal.|Flexão, extensão, abdução, adução, oposição e reposição.|Cápsula e ligamentos locais.|A oposição permite a pinça do polegar.|trapezio-do-carpo,metacarpais,abdutor-curto-do-polegar
Metacarpofalângicas|Mão|Sinoviais elipsóideas|Cabeças dos metacarpais e bases das falanges proximais.|Flexão, extensão, abdução e adução.|Ligamentos colaterais e placas palmares.|Organizam a abertura e fechamento da mão.|metacarpais,falanges-da-mao
Interfalângicas da mão|Mão|Sinoviais gínglimos|Cabeças e bases de falanges adjacentes.|Flexão e extensão.|Ligamentos colaterais e placas palmares.|Ajustam os dedos ao formato do objeto.|falanges-da-mao,flexor-profundo-dos-dedos
Coxofemoral|Quadril|Sinovial esferóidea|Cabeça do fêmur e superfície semilunar do acetábulo.|Flexão, extensão, abdução, adução e rotações.|Lábio acetabular, cápsula e ligamentos iliofemoral, pubofemoral e isquiofemoral.|Combina mobilidade com suporte de carga.|femur,osso-do-quadril,gluteo-medio,gluteo-maximo,psoas-maior
Joelho|Joelho|Complexo sinovial bicondilar, com componente patelofemoral|Côndilos femorais, platôs tibiais e superfície posterior da patela.|Flexão e extensão; rotação limitada quando flexionado.|LCA, LCP, colaterais, meniscos e musculatura.|Transmite carga e adapta o comprimento funcional do membro na marcha.|femur,tibia,patela,ligamento-cruzado-anterior,ligamento-cruzado-posterior,ligamento-colateral-tibial,ligamento-colateral-fibular,menisco-medial,menisco-lateral,reto-femoral,vasto-medial,vasto-lateral,vasto-intermedio
Talocrural|Tornozelo|Sinovial gínglimo|Pinça tibiofibular e tróclea do tálus.|Dorsiflexão e flexão plantar.|Ligamento deltoide, ligamentos laterais e sindesmose tibiofibular.|Permite avanço da perna sobre o pé no apoio.|tibia,fibula,talus,tibial-anterior,gastrocnemio,soleo
Subtalar|Pé|Sinovial plana, funcionalmente participa de movimentos triplanares|Tálus e calcâneo.|Participa da inversão e eversão em conjunto com outras articulações do tarso.|Ligamentos talocalcâneos.|Adapta o retropé a superfícies irregulares.|talus,calcaneo,tibial-posterior,fibular-longo
Metatarsofalângicas|Pé|Sinoviais elipsóideas|Cabeças dos metatarsais e bases das falanges proximais.|Flexão, extensão e pequenos movimentos de abdução e adução.|Ligamentos colaterais e placas plantares.|A extensão do hálux participa da propulsão.|metatarsais,falanges-do-pe
Sacroilíaca|Pelve|Porção sinovial anterior e união ligamentar posterior|Superfícies auriculares do sacro e do ílio.|Pequenos movimentos de nutação e contranutação.|Ligamentos sacroilíacos e ligamentos pélvicos.|Transfere carga da coluna aos membros inferiores.|sacro,osso-do-quadril
Sínfise púbica|Pelve|Cartilagínea secundária (sínfise)|Corpos dos púbis unidos por disco fibrocartilagíneo.|Pequenos deslocamentos.|Ligamentos púbicos.|Completa o anel pélvico anteriormente.|osso-do-quadril
Temporomandibular|Cabeça e pescoço|Sinovial com disco; rotação e translação|Cabeça da mandíbula, fossa mandibular e tubérculo articular do temporal.|Elevação, depressão, protração, retração e lateralidade.|Cápsula, ligamento lateral e disco.|Permite mastigação e fala.|mandibula,temporal,masseter
Atlanto-occipital|Cabeça e pescoço|Sinovial elipsóidea|Côndilos occipitais e facetas superiores do atlas.|Principalmente flexão e extensão; pequena inclinação lateral.|Membranas atlanto-occipitais e ligamentos craniocervicais.|Participa do gesto de concordar com a cabeça.|occipital,atlas
Atlantoaxial|Cabeça e pescoço|Complexo sinovial; mediana trocoide|Atlas e áxis.|Principalmente rotação cervical.|Ligamento transverso do atlas e ligamentos alares.|Participa do gesto de negar com a cabeça.|atlas,axis
Intervertebrais|Coluna vertebral|Sínfises entre corpos e sinoviais planas entre processos articulares|Corpos e processos articulares de vértebras adjacentes.|Flexão, extensão, inclinação e rotação, variáveis por região.|Discos, cápsulas e ligamentos vertebrais.|Distribuem carga e permitem mobilidade segmentar.|vertebras-cervicais,vertebras-toracicas,vertebras-lombares
'''
for line in joints.strip().splitlines():
    n,r,t,s,m,st,f,rel=line.split('|')
    add(n,'','articulacoes',r,f,{'Classificação':t,'Superfícies articulares':s,'Movimentos':m,'Estabilizadores':st,'Na prática':f},rel.split(','))

extras='''
Ligamento cruzado anterior|anterior cruciate ligament|ligamentos|Joelho|Limita o deslocamento anterior da tíbia em relação ao fêmur e contribui para a estabilidade rotacional.|joelho,femur,tibia
Ligamento cruzado posterior|posterior cruciate ligament|ligamentos|Joelho|Limita o deslocamento posterior da tíbia em relação ao fêmur.|joelho,femur,tibia
Ligamento colateral tibial|tibial collateral ligament|ligamentos|Joelho|Estabilizador medial que resiste ao estresse em valgo; sua parte profunda se relaciona ao menisco medial.|joelho,menisco-medial
Ligamento colateral fibular|fibular collateral ligament|ligamentos|Joelho|Resiste ao estresse em varo; liga o fêmur à cabeça da fíbula e não se fixa ao menisco lateral.|joelho,fibula
Ligamento patelar|patellar ligament|ligamentos|Joelho|Conecta a patela à tuberosidade da tíbia e transmite a força do quadríceps.|patela,tibia,reto-femoral
Ligamento talofibular anterior|anterior talofibular ligament|ligamentos|Tornozelo|Parte do complexo lateral do tornozelo, relacionada à contenção de inversão e translação do tálus.|talocrural,fibula,talus
Ligamento calcaneofibular|calcaneofibular ligament|ligamentos|Tornozelo|Conecta o maléolo lateral ao calcâneo e participa da estabilidade lateral.|fibula,calcaneo
Ligamento deltoide|deltoid ligament|ligamentos|Tornozelo|Complexo ligamentar medial que resiste à eversão excessiva.|talocrural,tibia,talus
Ligamento iliofemoral|iliofemoral ligament|ligamentos|Quadril|Reforço anterior da cápsula do quadril que limita especialmente a hiperextensão.|coxofemoral,osso-do-quadril,femur
Menisco medial|medial meniscus|articulacoes|Joelho|Fibrocartilagem que melhora a congruência e distribui carga no compartimento medial do joelho.|joelho,femur,tibia
Menisco lateral|lateral meniscus|articulacoes|Joelho|Fibrocartilagem que distribui carga no compartimento lateral; apresenta maior mobilidade que o menisco medial.|joelho,femur,tibia
Tendão calcâneo|calcaneal tendon|tendoes|Tornozelo|Transmite ao calcâneo a força do gastrocnêmio e sóleo, participando da flexão plantar.|calcaneo,gastrocnemio,soleo
Nervo musculocutâneo|musculocutaneous nerve|nervos|Braço|Inerva o compartimento anterior do braço e continua como nervo cutâneo lateral do antebraço.|biceps-braquial,braquial,coracobraquial
Nervo axilar|axillary nerve|nervos|Ombro|Inerva deltoide e redondo menor; leva sensibilidade da região lateral superior do braço.|deltoide,redondo-menor
Nervo supraescapular|suprascapular nerve|nervos|Ombro|Ramo do tronco superior do plexo braquial; inerva supraespinal e infraespinal.|supraespinal,infraespinal
Nervo radial|radial nerve|nervos|Braço|Inerva os extensores do braço e antebraço, com ramos motores e sensitivos.|triceps-braquial,braquiorradial,extensor-dos-dedos
Nervo mediano|median nerve|nervos|Antebraço|Inerva a maior parte dos flexores do antebraço e parte da musculatura tenar; atravessa o túnel do carpo.|pronador-redondo,flexor-radial-do-carpo,abdutor-curto-do-polegar
Nervo ulnar|ulnar nerve|nervos|Antebraço|Inerva parte dos flexores do antebraço e a maior parte dos músculos intrínsecos da mão.|flexor-ulnar-do-carpo,adutor-do-polegar
Nervo femoral|femoral nerve|nervos|Coxa|Ramo do plexo lombar (L2–L4), importante para a extensão do joelho e sensibilidade anterior da coxa.|reto-femoral,vasto-lateral,vasto-medial,vasto-intermedio
Nervo obturatório|obturator nerve|nervos|Coxa|Ramo do plexo lombar (L2–L4), inerva a maior parte dos adutores da coxa.|adutor-longo,adutor-magno,gracil
Nervo ciático|sciatic nerve|nervos|Coxa|Grande nervo do plexo sacral (L4–S3), com divisões tibial e fibular comum.|biceps-femoral,semitendineo,semimembranaceo
Nervo tibial|tibial nerve|nervos|Perna|Inerva a região posterior da perna e, por seus ramos, a planta do pé.|gastrocnemio,soleo,tibial-posterior
Nervo fibular comum|common fibular nerve|nervos|Perna|Contorna o colo da fíbula e se divide em nervos fibulares superficial e profundo.|fibula,tibial-anterior,fibular-longo
Nervo glúteo superior|superior gluteal nerve|nervos|Quadril|Inerva glúteos médio e mínimo e tensor da fáscia lata.|gluteo-medio,gluteo-minimo,tensor-da-fascia-lata
Nervo glúteo inferior|inferior gluteal nerve|nervos|Quadril|Inerva o glúteo máximo, importante na extensão potente do quadril.|gluteo-maximo
Plexo braquial|brachial plexus|nervos|Ombro|Rede formada principalmente pelos ramos anteriores C5–T1, que origina nervos do membro superior.|nervo-axilar,nervo-radial,nervo-mediano,nervo-ulnar,nervo-musculocutaneo
'''
for line in extras.strip().splitlines():
    n,e,k,r,s,rel=line.split('|')
    add(n,e,k,r,s,{'Localização':r,'Função':s},rel.split(','),sources=['teach-nerves' if k=='nervos' else 'openstax-joints'])

# Explicit relationships are navigable IDs, never guessed anatomical attachment coordinates.
byid={x['id']:x for x in items}
assert len(byid)==len(items), 'Duplicate structure IDs'
for a in items:
    if a['kind']=='musculos':
        a['fields']['Localização']=a['region']
        a['fields']['Camada de estudo']='Profunda' if a['depth']=='profunda' else 'Superficial'
        for b in items:
            if b['kind']=='articulacoes' and a['id'] in b['related']: a['related'].append(b['id'])
        for b in items:
            if b['kind']=='nervos' and a['id'] in b['related']: a['related'].append(b['id'])
    a['related']=list(dict.fromkeys(a['related']))
byid['supraespinal']['related'] += ['escapula','umero','deltoide','infraespinal','subescapular','redondo-menor']
byid['supraespinal']['fields'].update({'Grupo muscular':'Manguito rotador.','Plano e eixo':'Abdução: plano frontal e eixo ântero-posterior.','Sinergistas':'Deltoide na abdução; demais músculos do manguito na estabilização.','Antagonistas':'Adutores do ombro, como peitoral maior e latíssimo do dorso.','Observação funcional':'Atua ao longo da abdução, não apenas nos primeiros graus. O manguito ajuda a manter a cabeça umeral centrada.','Exemplo de exercício':'Elevação do braço no plano da escápula, em contexto didático.','Palpação básica':'A fossa supraespinal situa-se acima da espinha da escápula; o músculo é profundo ao trapézio. Palpação guiada em aula.'})
byid['biceps-braquial']['fields'].update({'Grupo muscular':'Compartimento anterior do braço.','Plano e eixo':'Flexão: plano sagital e eixo transversal. Supinação: plano transversal e eixo longitudinal do antebraço.','Antagonistas':'Tríceps na flexão; pronadores na supinação.','Sinergistas':'Braquial e braquiorradial na flexão; supinador na supinação.','Exemplo de exercício':'Rosca com antebraço supinado, como exemplo de análise do movimento.','Palpação básica':'Ventre muscular anterior do braço durante flexão suave do cotovelo.','Observação funcional':'A contribuição para flexão depende da posição do antebraço e da carga.'})
byid['biceps-braquial']['related'] += ['escapula','radio','braquial','triceps-braquial']
byid['femur']['fields']['Articula-se com']='Osso do quadril (acetábulo), tíbia e patela.'
byid['femur']['related'] += ['coxofemoral','joelho','patela','tibia','osso-do-quadril']
byid['ligamento-cruzado-anterior']['aliases']=['LCA']
byid['ligamento-cruzado-posterior']['aliases']=['LCP']
byid['tendao-calcaneo']['aliases']=['Aquiles','tendão de Aquiles']
byid['supraespinal']['aliases']=['supraespinhoso','supraspinatus']
byid['latissimo-do-dorso']['aliases']=['grande dorsal']
byid['ulna']['aliases']=['cúbito']
byid['fibula']['aliases']=['perônio']
for a in items:
    for rel in a['related']: assert rel in byid, (a['id'],rel)
(OUT/'structures.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf8')
print(f'{len(items)} fichas: '+str({k:sum(x['kind']==k for x in items) for k in sorted(set(x['kind'] for x in items))}))
