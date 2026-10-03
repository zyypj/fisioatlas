"""Author the shoulder module; run before build_expansion.py.

Named source components remain uniquely owned. Higgsfield complements have no
Z-Anatomy source_objects and are attached separately by integrate_shoulder.mjs.
"""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
catalog=json.loads((ROOT/'src/data/structures.json').read_text(encoding='utf8'))
byid={s['id']:s for s in catalog}
patches=[]; new=[]; generated=[]
refs=['shoulder-anatomy','shoulder-variants','cuff-dissection']

def patch(sid, **data):
    patches.append({'id':sid,**data})

def add(sid,name,en,kind,summary,fields,related,source=None,aliases=None):
    new.append({'id':sid,'name':name,'english':en,'kind':kind,'region':'Ombro','depth':'profunda','summary':summary,'fields':fields,'related':related,'sources':refs+(['z-anatomy'] if source else ['higgsfield-shoulder']),'aliases':aliases or [],'source_objects':source or []})
    if source is None: generated.append(sid)

muscles=[
 ('supraespinal','tendao-supraespinal','Supraespinal','supraspinatus','Faceta superior do tubérculo maior do úmero; fibras continuam com a cápsula.','Nervo supraescapular (C5–C6).','Auxilia a abdução e comprime a cabeça umeral contra a glenoide.','Passa superiormente à cabeça umeral, sob o arco coracoacromial e a bolsa subacromial.','nervo-supraescapular'),
 ('infraespinal','tendao-infraespinal','Infraespinal','infraspinatus','Faceta média do tubérculo maior do úmero; fibras adjacentes ao supraespinal se entrelaçam.','Nervo supraescapular (C5–C6).','Produz rotação lateral e contribui para centralizar a cabeça umeral.','Situa-se posteriormente à cabeça umeral, abaixo do supraespinal e acima do redondo menor.','nervo-supraescapular'),
 ('redondo-menor','tendao-redondo-menor','Redondo menor','teres minor','Faceta inferior do tubérculo maior do úmero, junto à cápsula posterior.','Nervo axilar (C5–C6).','Produz rotação lateral, auxilia a adução e estabiliza a cabeça umeral.','Ocupa a região posterior inferior do manguito, superior ao redondo maior.','nervo-axilar'),
 ('subescapular','tendao-subescapular','Subescapular','subscapularis','Tubérculo menor do úmero; fibras inferiores também se fixam junto à sua crista.','Nervos subescapulares superior e inferior (C5–C6).','Produz rotação medial, auxilia a adução e estabiliza anteriormente a cabeça umeral.','É anterior à articulação; suas fibras superiores participam da contenção do tendão da cabeça longa do bíceps.','nervo-subescapular-superior'),
]
for mid,tid,name,en,insertion,nerve,action,location,nid in muscles:
    add(tid,'Tendão do '+name.lower(),en+' tendon','tendoes',
        'Transmite a força do '+name.lower()+' ao úmero e integra o manguito ao redor da cabeça umeral.',
        {'Tipo':'Tendão do manguito rotador; tecido conjuntivo denso predominantemente colágeno.',
         'Continuidade proximal':'Junção musculotendínea do '+name.lower()+'.',
         'Inserção':insertion,'Relações':location,'Função':action,
         'Integração com a cápsula':'As fibras tendíneas se entrelaçam com as dos tendões vizinhos e com a cápsula glenoumeral; a separação em peças é didática.',
         'Vascularização':'Recebe ramos regionais da rede supraescapular e circunflexa umeral; a distribuição varia ao longo do tendão.',
         'Na prática':'Diferencie ventre muscular, junção musculotendínea, tendão e entese. Dor, fraqueza e alterações de imagem precisam de avaliação conjunta.',
         'Estudo 3D':'Superfície topográfica aproximada criada no Higgsfield; espessura, inserção e percurso não foram segmentados da fonte.'},
        [mid,'umero','escapula','glenoumeral',nid,'cabo-rotador','crescente-rotador'])
    patch(mid,fields={'Inserção':insertion,'Inervação':nerve,'Ação':action,'Tendão correspondente':'Tendão do '+name.lower()+'.','Papel no manguito':'Estabilização dinâmica por compressão e controle da translação da cabeça umeral.','Relações anatômicas':location,'Observação funcional':action+' A contribuição depende da posição do braço e da tarefa.','Na prática':'Observe a ação e a estabilização em conjunto. Um teste isolado não identifica com certeza uma lesão.'},related=[tid,'labio-glenoidal','glenoumeral'],sources=refs+['teach-shoulder'],aliases=({'infraespinal':['infraespinhoso'],'supraespinal':['supraespinhoso']} .get(mid,[]))+['manguito rotador'])
patch('redondo-menor',fields={'Espaço quadrangular':'Forma a borda superior. As demais bordas são redondo maior inferiormente, cabeça longa do tríceps medialmente e colo cirúrgico do úmero lateralmente. Passam o nervo axilar e os vasos circunflexos posteriores do úmero.'},sources=['quadrangular-space'])

add('tendao-cabeca-longa-biceps','Tendão da cabeça longa do bíceps','long head of biceps tendon','tendoes',
    'Tendão vizinho ao manguito: cruza a articulação e segue pelo sulco intertubercular; não pertence aos quatro músculos do manguito.',
    {'Origem':'Tubérculo supraglenoidal da escápula e lábio glenoidal superior, com variação da participação de cada fixação.',
     'Trajeto':'Segmento proximal intra-articular e extrassinovial; atravessa o intervalo rotador e entra no sulco intertubercular.',
     'Contenção':'Polia bicipital formada por fibras do ligamento coracoumeral, ligamento glenoumeral superior e tendões adjacentes.',
     'Continuidade distal':'Continua com a cabeça longa do bíceps braquial. Este modelo inclui somente o segmento proximal.',
     'Função':'Transmite força do bíceps; sua contribuição para estabilidade do ombro depende da posição e da carga.',
     'Na prática':'Lesões do subescapular e da polia podem acompanhar instabilidade do tendão. A origem superior relaciona-se com lesões SLAP.',
     'Estudo 3D':'Trajeto tubular didático aproximado, separado da bainha e do músculo; não mede o sulco nem a entese.'},
    ['biceps-braquial','bainha-intertubercular','polia-bicipital','intervalo-rotador','labio-glenoidal','ligamento-transverso-do-umero'])

extras=[
 ('cabo-rotador','Cabo rotador','rotator cable','tendoes','Espessamento de fibras que distribui cargas no manguito superior e posterior.',{'Tipo':'Espessamento transversal do complexo capsulotendíneo, relacionado a fibras do ligamento coracoumeral.','Relações':'Contorna a região medial do crescente, conectando regiões anteriores e posteriores do manguito.','Função':'Redistribui a tensão tendínea; não é um quinto tendão muscular independente.','Variações':'Espessura, definição e extensão variam entre pessoas.'},['tendao-supraespinal','tendao-infraespinal','ligamento-coracoumeral','crescente-rotador']),
 ('crescente-rotador','Crescente rotador','rotator crescent','tendoes','Região distal mais fina do manguito entre o cabo rotador e a fixação no tubérculo maior.',{'Tipo':'Área do complexo tendíneo, e não um músculo ou tendão adicional.','Localização':'Lateral ao cabo rotador, junto à inserção dos tendões superiores e posteriores.','Função':'Continuidade da transmissão de força para a entese.','Na prática':'Ajuda a localizar a região das rupturas; a extensão da lesão não é representada neste modelo.'},['cabo-rotador','tendao-supraespinal','tendao-infraespinal','umero']),
 ('polia-bicipital','Polia bicipital','biceps pulley','tendoes','Complexo fibroso que orienta e contém o tendão da cabeça longa do bíceps na saída da articulação.',{'Tipo':'Complexo de fibras; não é um ligamento único.','Componentes':'Ligamentos coracoumeral e glenoumeral superior, com contribuição dos tendões do subescapular e do supraespinal.','Função':'Contenção do tendão bicipital na transição para o sulco intertubercular.','Na prática':'Pode ser lesada junto com o subescapular, permitindo subluxação do tendão bicipital.'},['intervalo-rotador','tendao-cabeca-longa-biceps','ligamento-coracoumeral','ligamento-glenoumeral-superior','tendao-subescapular','tendao-supraespinal']),
 ('intervalo-rotador','Intervalo rotador','rotator interval','articulacoes','Região capsular anterior superior entre os tendões do supraespinal e do subescapular.',{'Classificação':'Região anatômica; não é uma articulação ou um espaço vazio independente.','Limites':'Supraespinal superiormente, subescapular inferiormente e processo coracoide medialmente.','Conteúdo':'Cápsula, ligamentos coracoumeral e glenoumeral superior e tendão da cabeça longa do bíceps.','Função':'Participa da estabilidade e da contenção do tendão bicipital.'},['polia-bicipital','tendao-supraespinal','tendao-subescapular','tendao-cabeca-longa-biceps','ligamento-coracoumeral','ligamento-glenoumeral-superior']),
 ('cartilagem-cabeca-umeral','Cartilagem da cabeça umeral','humeral head articular cartilage','articulacoes','Revestimento hialino da superfície articular da cabeça do úmero.',{'Classificação':'Cartilagem articular hialina, distinta do fibrocartilaginoso lábio glenoidal.','Localização':'Superfície da cabeça voltada para a glenoide, até a transição do colo anatômico.','Função':'Distribui cargas e oferece uma superfície de baixo atrito.','Nutrição':'Predominantemente por difusão a partir do líquido sinovial; sem vascularização direta normal.'},['umero','cartilagem-glenoidal','glenoumeral','membrana-sinovial-ombro']),
 ('cartilagem-glenoidal','Cartilagem da glenoide','glenoid articular cartilage','articulacoes','Revestimento hialino da cavidade glenoidal da escápula.',{'Classificação':'Cartilagem hialina articular; o lábio periférico é uma estrutura distinta.','Localização':'Superfície glenoidal da escápula, em contato com a cartilagem da cabeça umeral.','Função':'Reduz atrito e distribui cargas de contato.','Na prática':'Observe a superfície articular e o anel periférico do lábio separadamente.'},['escapula','labio-glenoidal','cartilagem-cabeca-umeral','glenoumeral']),
 ('membrana-sinovial-ombro','Membrana sinovial do ombro','glenohumeral synovial membrane','articulacoes','Revestimento interno da cápsula que mantém o líquido sinovial da articulação.',{'Classificação':'Membrana sinovial; tecido conjuntivo especializado, diferente da cápsula fibrosa externa.','Localização':'Face interna não cartilaginosa da cápsula, com reflexões e recessos.','Função':'Produção e manutenção do líquido sinovial, que lubrifica e nutre a cartilagem.','Relação com o bíceps':'A sinovial reflete-se ao redor do tendão proximal; o tendão é intra-articular, mas extrassinovial.','Estudo 3D':'Meia superfície em corte para mostrar a organização; não é segmentação da membrana real.'},['glenoumeral','recesso-subescapular','bainha-intertubercular','cartilagem-glenoidal','cartilagem-cabeca-umeral']),
 ('recesso-subescapular','Recesso subescapular','subscapular recess','articulacoes','Extensão sinovial da cavidade glenoumeral adjacente ao subescapular.',{'Classificação':'Recesso comunicante da articulação; também descrito como bolsa subtendínea do subescapular.','Localização':'Entre o subescapular e a face anterior da escápula, próximo ao colo e à cápsula anterior.','Relações':'Comunica-se com a cavidade glenoumeral; é diferente da bolsa subcoracoidea.','Função':'Permite acomodação e deslizamento junto ao subescapular.'},['subescapular','tendao-subescapular','glenoumeral','membrana-sinovial-ombro','bolsa-subcoracoidea']),
 ('bolsa-subcoracoidea','Bolsa subcoracoidea','subcoracoid bursa','articulacoes','Bolsa entre o processo coracoide e o subescapular que facilita seu deslizamento.',{'Classificação':'Bolsa sinovial extra-articular, distinta do recesso subescapular.','Localização':'Anterior ao subescapular e inferior ao processo coracoide.','Função':'Reduz atrito no deslizamento regional.','Variações':'Comunicações e tamanho podem variar; não presumir continuidade com a articulação.'},['escapula','subescapular','tendao-subescapular','recesso-subescapular']),
 ('interface-escapulotoracica','Interface escapulotorácica','scapulothoracic interface','articulacoes','Plano funcional de deslizamento entre escápula, músculos interpostos e parede torácica.',{'Classificação':'Articulação funcional; não possui cápsula sinovial própria nem contato osso com osso.','Superfícies':'Face anterior da escápula com subescapular, serrátil anterior e parede torácica interpostos.','Movimentos':'Elevação, depressão, protração, retração, rotações e inclinações da escápula.','Função':'Posiciona a glenoide durante a elevação do braço. O ritmo escapuloumeral varia com tarefa, fase e pessoa.','Estudo 3D':'Região de referência aproximada, e não uma malha de tecido ou cartilagem; estudar com escápula e serrátil anterior.'},['escapula','serratil-anterior','subescapular','trapezio-superior','trapezio-medio','trapezio-inferior','romboide-maior','romboide-menor']),
]
for sid,name,en,kind,summary,fields,related in extras:
    fields.setdefault('Estudo 3D','Complemento didático do Higgsfield: superfície aproximada para localizar a estrutura, sem validação de espessura ou limites histológicos.')
    add(sid,name,en,kind,summary,fields,related)

bursae=[
 ('bolsa-subacromial','Bolsa subacromial','Subacromial bursa','Entre o arco coracoacromial e a superfície superior do manguito.',['supraespinal','tendao-supraespinal','ligamento-coracoacromial']),
 ('bolsa-subdeltoidea','Bolsa subdeltóidea','Subdeltoid bursa','Entre o deltoide e o manguito sobre a região lateral do úmero.',['deltoide-medio','umero','tendao-supraespinal']),
 ('bolsa-subcutanea-acromial','Bolsa subcutânea acromial','Subcutaneous acromial bursa','Entre pele e acrômio; é superficial ao arco e distinta da bolsa subacromial.',['escapula','acromioclavicular']),
 ('bolsa-subtendinea-infraespinal','Bolsa subtendínea do infraespinal','Subtendinous bursa of infraspinatus muscle','Adjacente ao tendão do infraespinal na região posterior da articulação.',['infraespinal','tendao-infraespinal']),
 ('bolsa-subtendinea-redondo-maior','Bolsa subtendínea do redondo maior','Subtendinous bursa of teres major muscle','Junto ao trajeto e à fixação do redondo maior.',['redondo-maior','umero']),
 ('bolsa-subtendinea-trapezio','Bolsa subtendínea do trapézio','Subtendinous bursa of trapezius muscle','Junto às fixações escapulares do trapézio.',['trapezio-medio','escapula']),
 ('bolsa-coracobraquial','Bolsa coracobraquial','Coracobrachial bursa','Junto à origem e ao trajeto proximal do coracobraquial.',['coracobraquial','escapula']),
]
for sid,name,en,location,related in bursae:
    add(sid,name,en.lower(),'articulacoes','Facilita o deslizamento e reduz o atrito entre estruturas próximas do ombro.',
        {'Classificação':'Bolsa sinovial; não é uma articulação independente.','Localização':location,'Função':'Redução de atrito entre tecidos em movimento.','Relação com o manguito':'Subacromial e subdeltóidea frequentemente formam um complexo contínuo. Não há comunicação normal obrigatória com a glenoumeral.','Na prática':'A presença de líquido ou dor regional não define, isoladamente, qual tecido está lesionado.','Estudo 3D':'Componente próprio da fonte Z-Anatomy; dimensões e separação representam o indivíduo e a convenção da base.'},
        related+['glenoumeral','bolsas-do-ombro'],[en+'.l',en+'.r'])
patch('bolsas-do-ombro',name='Bolsas do ombro (visão geral)',source_objects=[],related=[x[0] for x in bursae]+['bolsa-subcoracoidea','recesso-subescapular'],fields={'Estudo 3D':'As bolsas agora têm fichas e malhas individuais. Abra uma bolsa relacionada para selecionar seu componente.','Função':'Redução de atrito; a configuração e as comunicações variam.','Na prática':'Relacionar os achados às estruturas vizinhas e à avaliação. Dor regional não distingue bursite de tendinopatia por si só.'},sources=refs)

ligs=[
 ('ligamento-transverso-superior-escapula','Ligamento transverso superior da escápula','Superior transverse scapular ligament','Fecha superiormente a incisura da escápula.','O nervo supraescapular geralmente passa sob ele; a artéria supraescapular geralmente passa sobre ele.',['nervo-supraescapular','supraespinal']),
 ('ligamento-transverso-inferior-escapula','Ligamento transverso inferior da escápula','Inferior transverse scapular ligament','Cruza a região da incisura espinoglenoidal.','Relaciona-se ao trajeto do nervo supraescapular em direção ao infraespinal; desenvolvimento variável.',['nervo-supraescapular','infraespinal']),
 ('ligamento-esternoclavicular-anterior','Ligamento esternoclavicular anterior','Anterior sternoclavicular ligament','Extremidade medial da clavícula ao manúbrio anteriormente.','Reforça a cápsula anterior e limita translação excessiva da clavícula.',['clavicula','esterno','esternoclavicular']),
 ('ligamento-esternoclavicular-posterior','Ligamento esternoclavicular posterior','Posterior sternoclavicular ligament','Extremidade medial da clavícula ao manúbrio posteriormente.','Reforça a cápsula posterior; participa da estabilidade esternoclavicular.',['clavicula','esterno','esternoclavicular']),
 ('ligamento-interclavicular','Ligamento interclavicular','Interclavicular ligament','Une as extremidades mediais das clavículas sobre a incisura jugular.','Reforça superiormente as articulações e restringe depressão excessiva.',['clavicula','esterno','esternoclavicular']),
 ('ligamento-costoclavicular','Ligamento costoclavicular','Costoclavicular ligament','Primeira costela e sua cartilagem à face inferior da clavícula medial.','Ancora a clavícula à parede torácica e restringe movimentos excessivos.',['clavicula','esternoclavicular']),
]
for sid,name,en,fix,function,related in ligs:
    add(sid,name,en.lower(),'ligamentos',function,{'Tipo':'Ligamento de tecido conjuntivo denso.','Fixações':fix,'Função':function,'Na prática':'Estudar posição, continuidade e relação com nervos ou articulações; o modelo estático não mostra tensão.','Estudo 3D':'Malha nomeada da fonte Z-Anatomy, preservada em sua posição anatômica.'},related+['escapula'],[en+'.l',en+'.r'])
patch('ligamentos-transversos-da-escapula',name='Ligamentos transversos da escápula (visão geral)',source_objects=[],related=[ligs[0][0],ligs[1][0]],fields={'Estudo 3D':'Abra a ficha do ligamento superior ou inferior para estudar cada malha separadamente.'})
patch('ligamentos-esternoclaviculares',name='Ligamentos esternoclaviculares (visão geral)',source_objects=[],related=[x[0] for x in ligs[2:]],fields={'Estudo 3D':'Cada ligamento deste conjunto tem agora ficha e malha individuais.'})

patch('glenoumeral',fields={'Superfícies articulares':'Cabeça do úmero e cavidade glenoidal da escápula, ambas revestidas de cartilagem hialina.','Cápsula fibrosa':'Fixa-se ao redor da glenoide e do lábio e ao colo anatômico do úmero; possui folga inferior para a elevação do braço.','Estabilizadores estáticos':'Cápsula, lábio, ligamentos glenoumerais e coracoumeral, pressão intra-articular e congruência.','Estabilizadores dinâmicos':'Manguito rotador e músculos que orientam a escápula; o deltoide produz elevação em equilíbrio com o manguito.','Membrana e cavidade':'Sinovial interna, cartilagens e recessos; o tendão da cabeça longa do bíceps é intra-articular e extrassinovial.','Ritmo escapuloumeral':'O movimento do braço combina glenoumeral, escapulotorácica, acromioclavicular e esternoclavicular; a proporção não é fixa.'},related=generated+['labio-glenoidal','ligamento-glenoumeral-superior','ligamento-glenoumeral-medio','ligamento-glenoumeral-inferior'],sources=refs)
patch('ligamento-glenoumeral-inferior',fields={'Partes':'Complexo com banda anterior, banda posterior e bolsa axilar interposta, contínuo com a cápsula inferior.','Função':'Restringe translações com o braço abduzido; a banda tensionada depende também da rotação.','Estudo 3D':'A fonte fornece uma malha única do complexo em cada lado; as três porções são documentadas, mas não segmentadas separadamente.'},sources=refs)
patch('ligamento-transverso-do-umero',fields={'Relação com o bíceps':'Cruza a região do sulco intertubercular. A contenção proximal do tendão depende também da polia e de fibras dos tendões adjacentes; não atribuir toda a estabilidade a este ligamento.'},related=['tendao-cabeca-longa-biceps','polia-bicipital'],sources=refs)
patch('labio-glenoidal',fields={'Classificação':'Anel predominantemente fibrocartilaginoso periférico, distinto da cartilagem hialina da superfície glenoidal.','Fixações':'Borda da glenoide; continuidade com cápsula e ligamentos. Sua região superior relaciona-se à origem do tendão da cabeça longa do bíceps.','Função':'Aumenta a profundidade e a área de contato glenoidal e contribui para a vedação articular.','Na prática':'Lesões superiores do complexo bíceps–lábio são chamadas SLAP; achados de imagem e sintomas precisam ser correlacionados.'},related=['cartilagem-glenoidal','tendao-cabeca-longa-biceps'],sources=refs)
patch('bainha-intertubercular',fields={'Relação':'Envolve o tendão bicipital no sulco, com continuidade sinovial proximal. Não é o corpo do tendão.','Estudo 3D':'A malha representa a bainha sinovial da fonte; o tendão tem ficha complementar própria.'},related=['tendao-cabeca-longa-biceps','polia-bicipital'],sources=refs)
patch('escapula',fields={'Marcos do manguito':'Fossas supraespinal, infraespinal e subescapular e borda lateral dão origem aos quatro músculos.','Marcos articulares':'Glenoide e lábio articulam com a cabeça umeral; acrômio articula com a clavícula; processo coracoide recebe ligamentos e tendões.','Arco coracoacromial':'Acrômio, processo coracoide e ligamento coracoacromial formam o teto sobre o manguito.','Marcos para o exercício':'A escápula orienta a glenoide por rotações, inclinações e translações. Posição e ritmo variam entre pessoas e tarefas.'},related=['interface-escapulotoracica','cartilagem-glenoidal'],sources=refs)
patch('umero',fields={'Marcos do manguito':'Tubérculo maior: facetas superior (supraespinal), média (infraespinal) e inferior (redondo menor). Tubérculo menor: subescapular.','Sulco intertubercular':'Entre os tubérculos; recebe o tendão da cabeça longa do bíceps e sua bainha.','Colos':'Colo anatômico junto à margem da cabeça e fixação capsular; colo cirúrgico inferiormente, próximo ao trajeto do nervo axilar.'},related=['cartilagem-cabeca-umeral','tendao-cabeca-longa-biceps']+[x[1] for x in muscles],sources=refs)
patch('redondo-maior',fields={'Relação com o manguito':'Auxilia adução e rotação medial, mas não é um dos quatro músculos do manguito rotador.'},sources=['teach-shoulder'])
patch('ligamento-glenoumeral-inferior',summary='Complexo capsuloligamentar inferior que limita translação da cabeça umeral, especialmente com o braço abduzido.',fields={'Lesão típica':'Bankart envolve o complexo capsulolabral anteroinferior na glenoide; avulsão do ligamento na fixação umeral é chamada HAGL. Não são sinônimos.','Na prática':'A região tensionada depende da combinação entre abdução e rotação. A malha estática mostra o complexo, sem simular uma lesão.'},sources=refs)
patch('ligamento-transverso-do-umero',summary='Fibras sobre o sulco intertubercular, relacionadas à contenção do tendão bicipital e ao complexo da polia.',sources=refs)
fascias=[
 ('fascia-deltoidea','Fáscia deltoidea','Deltoid fascia','Reveste o deltoide e continua com fáscias adjacentes.',['deltoide-anterior','deltoide-medio','deltoide-posterior']),
 ('fascia-peitoral','Fáscia peitoral','Pectoral fascia','Reveste o peitoral maior e continua com a fáscia axilar e braquial.',['peitoral-clavicular','peitoral-esternocostal']),
 ('fascia-clavipeitoral','Fáscia clavipeitoral','Clavipectoral fascia','Envolve o subclávio e o peitoral menor e participa da organização profunda da parede anterior da axila.',['subclavio','peitoral-menor','clavicula']),
]
for sid,name,en,location,related in fascias:
    add(sid,name,en.lower(),'tendoes',location,{'Tipo':'Fáscia de revestimento e continuidade conjuntiva; não é um tendão do manguito.','Localização':location,'Função':'Organiza e conecta compartimentos de tecidos da cintura escapular.','Estudo 3D':'Fáscia da fonte Z-Anatomy. Por envolver a musculatura, fica oculta por padrão; selecionar a ficha permite estudá-la.'},related,[en+'.l',en+'.r'])
    new[-1]['envelope']=True
remaining=['Brachial fascia.l','Brachial fascia.r','Antebrachial fascia.l','Antebrachial fascia.r','Dorsal fascia of hand.l','Dorsal fascia of hand.r']
patch('fascias-do-membro-superior',source_objects=remaining,related=[x[0] for x in fascias],fields={'Estudo 3D':'Esta ficha mantém fáscias braquial, antebraquial e dorsal da mão. Fáscias deltoidea, peitoral e clavipeitoral têm fichas individuais no módulo do ombro.'})
for sid in ['deltoide-anterior','deltoide-medio','deltoide-posterior']:
    patch(sid,fields={'Relação com o manguito':'O deltoide movimenta o braço; o manguito contribui para centralizar a cabeça umeral durante essa ação.'},related=[x[0] for x in muscles],sources=['teach-shoulder'])

# Make every functional relationship navigable without altering anatomical IDs.
support=['deltoide-anterior','deltoide-medio','deltoide-posterior','trapezio-superior','trapezio-medio','trapezio-inferior','serratil-anterior','romboide-maior','romboide-menor','levantador-da-escapula','peitoral-clavicular','peitoral-esternocostal','peitoral-menor','latissimo-do-dorso','redondo-maior','subclavio','coracobraquial','biceps-braquial','triceps-braquial']
nerves=['nervo-supraescapular','nervo-axilar','nervo-subescapular-superior','nervo-subescapular-inferior','nervo-dorsal-da-escapula','nervo-toracico-longo','nervo-toracodorsal','plexo-braquial']
ligament_ids=['ligamento-acromioclavicular','ligamento-conoide','ligamento-trapezoide','ligamento-coracoacromial','ligamento-coracoumeral','ligamento-glenoumeral-superior','ligamento-glenoumeral-medio','ligamento-glenoumeral-inferior','ligamento-transverso-do-umero']+[x[0] for x in ligs]
groups=[
 {'title':'Ossos e marcos anatômicos','ids':['escapula','umero','clavicula','esterno']},
 {'title':'Os quatro músculos do manguito','ids':[x[0] for x in muscles]},
 {'title':'Tendões e continuidade do manguito','ids':[x[1] for x in muscles]+['tendao-cabeca-longa-biceps','cabo-rotador','crescente-rotador','polia-bicipital','bainha-intertubercular']},
 {'title':'Articulações, cápsula e superfícies','ids':['glenoumeral','acromioclavicular','esternoclavicular','interface-escapulotoracica','labio-glenoidal','disco-acromioclavicular','disco-esternoclavicular','cartilagem-cabeca-umeral','cartilagem-glenoidal','membrana-sinovial-ombro','intervalo-rotador']},
 {'title':'Ligamentos','ids':ligament_ids},
 {'title':'Bolsas e recessos sinoviais','ids':[x[0] for x in bursae]+['bolsa-subcoracoidea','recesso-subescapular']},
 {'title':'Fáscias e continuidade conjuntiva','ids':[x[0] for x in fascias]},
 {'title':'Músculos que movimentam e orientam o ombro','ids':support},
 {'title':'Nervos e plexo','ids':nerves},
]
(ROOT/'scripts/content/70-ombro-manguito.json').write_text(json.dumps({'patches':patches,'new':new},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(ROOT/'src/data/shoulder.json').write_text(json.dumps({'groups':groups,'generated':generated},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(f'{len(new)} novas fichas, {len(patches)} ajustes, {len(generated)} complementos Higgsfield; {sum(len(g["ids"]) for g in groups)} estruturas no módulo.')
