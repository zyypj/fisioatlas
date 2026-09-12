import { useState } from 'react';
import { byId } from '../../data';
import type { Movement } from '../../types';
import { defaultMechanics, fiberForce, ligamentForce, tendonForce, nerveResponse } from './biomechanics';
import type { MechanicsOptions, MechanicsReport } from './biomechanics';

interface Props {
  movement: Movement;
  options: MechanicsOptions;
  report: MechanicsReport | null;
  active: boolean;
  onChange: (options: MechanicsOptions) => void;
  onFocus: (id:string) => void;
}
const percent=(x:number)=>(100*x).toFixed(1)+'%';
export function MechanicsPanel({movement,options,report,active,onChange,onFocus}: Props) {
  const [chosen,setChosen]=useState('');
  const rows=report?.movementId===movement.id?report.rows:[];
  const reading=rows.find(r=>r.id===chosen)||rows.find(r=>r.id===movement.agonists[0])||rows[0];
  const change=(key:keyof MechanicsOptions,value:number|boolean)=>onChange({...options,[key]:value});
  const slider=(key:keyof MechanicsOptions,label:string,min:number,max:number,step:number,format:(n:number)=>string)=>
    <label className="mechanics-slider" key={key}><span>{label}</span><output>{format(Number(options[key]))}</output>
      <input aria-label={label} type="range" min={min} max={max} step={step} value={Number(options[key])} onChange={e=>change(key,+e.target.value)} /></label>;
  const kind=reading?.kind;
  const xMin=kind==='musculos'?0.5:0;
  const xMax=kind==='musculos'?1.6:kind==='nervos'?0.02:0.12;
  const response=(x:number)=>kind==='musculos'?fiberForce(x,reading?.activation||0):kind==='ligamentos'?ligamentForce(x,0,options.stiffness):kind==='tendoes'?tendonForce(x,options.tendonCompliance):nerveResponse((reading?.restLength||1)+x,reading?.restLength||1,options.nerveReserve).strain;
  const curve=Array.from({length:61},(_,i)=>({x:xMin+(xMax-xMin)*i/60,y:response(xMin+(xMax-xMin)*i/60)}));
  const yMax=Math.max(1e-3,...curve.map(p=>p.y));
  const points=curve.map(p=>`${24+(p.x-xMin)/(xMax-xMin)*232},${106-p.y/yMax*80}`).join(' ');
  const currentX=reading?(kind==='musculos'?reading.fiberRatio:kind==='nervos'?reading.length-reading.restLength:reading.strain):0;
  const dotX=24+Math.min(1,Math.max(0,(currentX-xMin)/(xMax-xMin)))*232;
  return <section className="mechanics-panel" aria-label="Simulação dos tecidos">
    <div className="mechanics-heading"><h3>Simulação dos tecidos</h3><label>
      <input type="checkbox" aria-label="Ativar mecânica dos tecidos" checked={options.enabled} onChange={e=>change('enabled',e.target.checked)} /> Ativa
    </label></div>
    <p className="availability">Modelo mecânico reduzido, com movimento imposto. Pause o movimento e varie a ativação para estudar a contração com o ângulo fixo.</p>
    {options.enabled && <>
      {slider('activation','Ativação dos agonistas',0,1,0.01,percent)}
      {slider('coactivation','Coativação dos antagonistas',0,1,0.01,percent)}
      <details><summary>Parâmetros mecânicos</summary>
        {slider('stiffness','Rigidez ligamentar relativa',0.2,3,0.1,n=>n.toFixed(1)+'×')}
        {slider('slack','Folga ligamentar em repouso',0,0.1,0.005,percent)}
        {slider('tendonCompliance','Alongamento tendíneo em F₀',0.01,0.1,0.005,percent)}
        {slider('nerveReserve','Reserva de deslizamento por extremidade',0,0.015,0.001,n=>(n*1000).toFixed(0)+' mm')}
        <p className="availability">Parâmetros genéricos de exploração, iguais por classe de tecido. As fixações e os trajetos são aproximados pelas malhas, sem calibração individual.</p>
        <button className="secondary full" onClick={()=>onChange({...defaultMechanics})}>Restaurar parâmetros</button>
      </details>
      <label className="mechanics-check"><input type="checkbox" checked={options.heatmap} onChange={e=>change('heatmap',e.target.checked)} /> Colorir resposta mecânica</label>
      <p className="availability">Vermelho: maior ativação muscular, tração ligamentar/tendínea ou alongamento neural residual. A cor não indica lesão.</p>
      {!active?<p role="status">Selecione todos os tecidos e volte ao movimento para calcular a resposta.</p>:!reading?<p role="status">Preparando trajetos das malhas…</p>:<>
        <label className="field-label">Estrutura monitorada<select aria-label="Estrutura monitorada" value={reading.id} onChange={e=>setChosen(e.target.value)}>
          {rows.map(r=><option key={r.id} value={r.id}>{byId[r.id].name}</option>)}
        </select></label>
        <button className="secondary full" onClick={()=>onFocus(reading.id)}>Focar estrutura monitorada</button>
        <div className="mechanics-readings" aria-label="Resultados do modelo">
          <div><small>Trajeto estimado</small><strong>{(reading.length*1000).toFixed(1)} mm</strong></div>
          <div><small>{kind==='nervos'?'Alongamento residual':'Variação de comprimento'}</small><strong>{percent(reading.strain)}</strong></div>
          {kind!=='nervos'&&<div><small>Força relativa</small><strong>{reading.force.toFixed(2)} F₀</strong></div>}
          {kind==='musculos'&&<>
            <div><small>Ativação efetiva</small><strong>{percent(reading.activation)}</strong></div>
            <div><small>Fibra / comprimento ótimo</small><strong>{reading.fiberRatio.toFixed(3)}</strong></div>
            <div><small>Tendão em série: alongamento</small><strong>{percent(reading.tendonStrain)}</strong></div>
          </>}
          {kind==='nervos'&&<div><small>Deslizamento por extremidade</small><strong>{(reading.excursion*1000).toFixed(2)} mm</strong></div>}
        </div>
        {reading.limited&&<p className="mechanics-limit" role="status">Fora da faixa didática adotada. As hipóteses ou o trajeto podem ser inadequados nesta posição; não interprete como limite de lesão.</p>}
        <figure className="mechanics-curve">
          <svg viewBox="0 0 280 128" role="img" aria-label={kind==='musculos'?'Curva força-comprimento em velocidade zero':kind==='nervos'?'Curva de alongamento residual após deslizamento':'Curva elástica força-alongamento'}>
            <path d="M24 18V106H264" fill="none" stroke="#edccd9" />
            <polyline points={points} fill="none" stroke="#b04a72" strokeWidth="2.5" />
            <circle cx={dotX} cy={106-response(Math.min(xMax,Math.max(xMin,currentX)))/yMax*80} r="4" fill="#dc6248" />
            <text x="24" y="121">{kind==='musculos'?'0,5 Lótimo':'0'}</text><text x="212" y="121">{kind==='musculos'?'1,6 Lótimo':kind==='nervos'?'20 mm':'12%'}</text>
          </svg>
          <figcaption>{kind==='musculos'?'Curva estática força–comprimento na ativação atual.':kind==='nervos'?'Variação do trajeto × alongamento que sobra após o deslizamento.':'Curva elástica; o amortecimento dinâmico não aparece neste gráfico.'} Ponto: posição atual projetada na curva.</figcaption>
        </figure>
        <p className="availability">F₀ é uma referência arbitrária de força para cada tecido, não uma medida em newtons. Mostramos o componente de maior trajeto de cada ficha; não somamos forças entre malhas.</p>
      </>}
      <details><summary>Como esta simulação funciona</summary>
        <p>O músculo combina ativação, força–comprimento, fator força–velocidade e resistência passiva. O comprimento da fibra é resolvido em equilíbrio com um tendão elástico em série. O ventre muda de forma conforme a solução; esse tendão matemático pode não ter malha própria.</p>
        <p>Ligamentos só resistem à tração: primeiro com resposta quadrática e depois linear, com amortecimento no alongamento. Nervos usam uma reserva ajustável de deslizamento; o alongamento restante é calculado separadamente.</p>
        <p>O ângulo é controlado pela animação. Forças não dirigem os ossos. Não há contato, colisões, lesões, recrutamento individual nem validação clínica. As curvas centrais estimadas podem falhar em músculos planos e nervos ramificados.</p>
        <a href="/BIOMECANICA.md" target="_blank" rel="noreferrer">Equações, hipóteses e referências ↗</a>
      </details>
    </>}
  </section>;
}
