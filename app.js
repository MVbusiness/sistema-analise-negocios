// ============================================================
// CANAIS
// ============================================================
const CHANNELS = {
  site: {
    label: 'Site / Loja Virtual', color: '#C9A84C',
    potencia: 'Potencia do Site',
    fields: [
      'Design e UX (experiencia do usuario)',
      'Proposta de valor clara',
      'Qualidade das imagens de produto',
      'Uso de videos na exibicao de produto',
      'Descricao de produtos completa e atrativa',
      'Formas de pagamento disponiveis',
      'Velocidade de carregamento',
      'Seguranca (selos, certificados)',
      'Politica de frete',
      'Preco de frete competitivo',
      'Politica de frete gratis',
      'Trafego para o site',
      'Analise e metricas do site',
      'Taxa de conversao',
      'Pagina Quem Somos estruturada',
      'Politica de troca e devolucao',
      'Banners atualizados com CTA',
      'Planejamento de acoes e campanhas',
    ]
  },
  insta: {
    label: 'Instagram', color: '#D4829A',
    potencia: 'Potencia do Instagram',
    fields: [
      'Identidade visual consistente',
      'Frequencia de publicacoes',
      'Taxa de engajamento',
      'Qualidade do conteudo (fotos, reels, carrosseis)',
      'Bio otimizada com CTA claro',
      'Stories e Highlights estrategicos',
      'Audiencia alinhada ao nicho',
      'Frequencia de Lives',
      'Existencia de automacao (ManyChat)',
      'Legendas com CTAs de acao',
      'Linha editorial definida',
      'Alinhamento com persona',
    ]
  },
  tiktok: {
    label: 'TikTok / TikTok Shop', color: '#8BAF8B',
    potencia: 'Potencia do TikTok',
    fields: [
      'Consistencia e frequencia de videos',
      'Taxa de views por video',
      'Uso de tendencias relevantes',
      'Qualidade de producao dos videos',
      'Loja criada no TikTok Shop',
      'Quantidade de produtos cadastrados',
      'Uso de afiliados e quantidade',
      'Pratica de Lives na plataforma',
      'Cadastro em promocoes da plataforma',
      'Integracao de produtos (catalogo)',
      'Engajamento (comentarios, duetos)',
    ]
  },
  whatsapp: {
    label: 'WhatsApp', color: '#6B9E6B',
    potencia: 'Potencia do WhatsApp',
    fields: [
      'Captacao e criacao de grupos de clientes',
      'Estrategias de ofertas exclusivas no canal',
      'Engajamento e relacionamento com leads',
      'Uso de mensagens com API oficial',
      'Volume de ofertas criadas no canal',
      'Uso de catalogo de produtos',
      'Frequencia de broadcasts / disparos',
      'Automacao de mensagens (chatbot)',
    ]
  }
};

const state = {
  ratings: { site:{}, insta:{}, tiktok:{}, whatsapp:{} },
  disabled: { site:false, insta:false, tiktok:false, whatsapp:false },
};

document.addEventListener('DOMContentLoaded', () => {
  Object.keys(CHANNELS).forEach(ch => buildChannel(ch));
  loadLeads();
  document.querySelector('#nichoGrid input[value="Outros"]')
    ?.addEventListener('change', function() {
      document.getElementById('outroNichoBox').style.display = this.checked ? 'block' : 'none';
    });
});

// ============================================================
// RATINGS
// ============================================================
function buildChannel(ch) {
  const container = document.getElementById(`${ch}Ratings`);
  if (!container) return;
  container.innerHTML = '';
  CHANNELS[ch].fields.forEach((fieldName, i) => {
    const key = `${ch}_${i}`;
    state.ratings[ch][key] = null;
    container.appendChild(buildRatingBlock(ch, key, fieldName));
  });
}

function buildRatingBlock(ch, key, label) {
  const color = CHANNELS[ch].color;
  const div = document.createElement('div');
  div.className = 'rating-block';
  div.id = `block-${key}`;
  div.innerHTML = `
    <div class="rating-row">
      <div class="rating-label">${label}</div>
      <div class="rating-stars" id="stars-${key}">
        ${[0,1,2,3,4,5].map(v=>`<button type="button" class="star-btn star-${v}" data-val="${v}" onclick="setRating('${ch}','${key}',${v},'${color}')">${v}</button>`).join('')}
      </div>
      <div class="rating-badge" id="badge-${key}">-</div>
    </div>`;
  return div;
}

function setRating(ch, key, val, color) {
  state.ratings[ch][key] = val;
  document.querySelectorAll(`#stars-${key} .star-btn`).forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.val) === val);
  });
  const badge = document.getElementById(`badge-${key}`);
  badge.textContent = `${val}/5`;
  badge.style.background = color + '22';
  badge.style.color = color;
}

function toggleChannel(ch, disabled) {
  state.disabled[ch] = disabled;
  document.getElementById(`${ch}Content`).classList.toggle('disabled', disabled);
}

function addCustomField(ch) {
  const container = document.getElementById(`customFields-${ch}`);
  const id = `custom_${ch}_${Date.now()}`;
  const color = CHANNELS[ch].color;
  const div = document.createElement('div');
  div.className = 'custom-rating';
  div.id = id;
  div.innerHTML = `
    <input type="text" class="custom-name" placeholder="Nome do campo personalizado">
    <div class="rating-stars">
      ${[0,1,2,3,4,5].map(v=>`<button type="button" class="star-btn star-${v}" data-val="${v}">${v}</button>`).join('')}
    </div>
    <div class="rating-badge">-</div>
    <button class="remove-btn" onclick="this.parentElement.remove()">x</button>`;
  container.appendChild(div);
  div.querySelectorAll('.star-btn').forEach(btn => {
    btn.onclick = () => {
      div.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const badge = div.querySelector('.rating-badge');
      badge.textContent = btn.dataset.val + '/5';
      badge.style.background = color + '22';
      badge.style.color = color;
    };
  });
}

// ============================================================
// TABS
// ============================================================
function showTab(tab) {
  document.getElementById('tab-form').style.display = tab==='form'?'block':'none';
  document.getElementById('tab-leads').style.display = tab==='leads'?'block':'none';
  if (tab==='leads') loadLeads();
}

// ============================================================
// DADOS
// ============================================================
function collectData() {
  const nichos = [...document.querySelectorAll('input[name="nicho"]:checked')].map(el=>el.value);
  const data = {
    id: Date.now(),
    date: new Date().toLocaleDateString('pt-BR'),
    clientName: document.getElementById('clientName').value.trim(),
    especialista: document.getElementById('especialista').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    revenue: parseFloat(document.getElementById('revenue').value)||0,
    goal: parseFloat(document.getElementById('goal').value)||0,
    nichos,
    outroNicho: nichos.includes('Outros') ? document.getElementById('outroNicho').value : '',
    objetivo6m: document.getElementById('objetivo6m').value.trim(),
    dificuldade: document.getElementById('dificuldade').value.trim(),
    orientacoes: document.getElementById('orientacoes').value.trim(),
    channels: {}
  };
  Object.keys(CHANNELS).forEach(ch => {
    const ratings = {};
    if (!state.disabled[ch]) {
      CHANNELS[ch].fields.forEach((name,i) => {
        const v = state.ratings[ch][`${ch}_${i}`];
        if (v !== null && v !== undefined) ratings[name] = v;
      });
      document.querySelectorAll(`#customFields-${ch} .custom-rating`).forEach(div => {
        const name = div.querySelector('.custom-name')?.value?.trim();
        const active = div.querySelector('.star-btn.active');
        if (name && active) ratings[name] = parseInt(active.dataset.val);
      });
    }
    data.channels[ch] = { disabled: state.disabled[ch], ratings };
  });
  return data;
}

function validateData(d) {
  if (!d.clientName) return 'Nome do cliente obrigatorio';
  if (!d.especialista) return 'Nome do especialista obrigatorio';
  if (!d.phone || d.phone==='+55') return 'Telefone obrigatorio';
  if (!d.email) return 'Email obrigatorio';
  if (!d.revenue) return 'Faturamento obrigatorio';
  if (!d.goal) return 'Objetivo financeiro obrigatorio';
  if (!d.nichos.length) return 'Selecione pelo menos um nicho';
  if (!d.objetivo6m) return 'Objetivo de 6 meses obrigatorio';
  if (!d.dificuldade) return 'Dificuldade principal obrigatoria';
  if (!d.orientacoes) return 'Orientacoes do especialista sao obrigatorias';
  return null;
}

// ============================================================
// KPIs
// ============================================================
function calcAvg(obj) {
  const vals = Object.values(obj).filter(v=>typeof v==='number');
  return vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null;
}

function calcKPIs(data) {
  const gap = data.goal>0 ? ((data.goal-data.revenue)/data.revenue)*100 : 0;
  const avgs = {};
  const scores = [];
  Object.keys(CHANNELS).forEach(ch => {
    const d = data.channels[ch];
    if (!d.disabled && Object.keys(d.ratings).length) {
      const a = calcAvg(d.ratings); avgs[ch]=a;
      if (a!==null) scores.push(a);
    } else avgs[ch]=null;
  });
  const globalAvg = scores.length ? scores.reduce((a,b)=>a+b,0)/scores.length : 0;
  const saude = (globalAvg/5)*100;
  let weakCh=null, weakVal=Infinity;
  Object.entries(avgs).forEach(([ch,a])=>{ if(a!==null && a<weakVal){weakVal=a;weakCh=ch;} });
  return [
    { title:'CRESCIMENTO NECESSARIO', value:`${gap.toFixed(1)}%`, urgency: gap>100?'critico':gap>50?'alto':'medio', desc:`De R$ ${data.revenue.toLocaleString('pt-BR')} para R$ ${data.goal.toLocaleString('pt-BR')} por mes` },
    { title:'SAUDE DIGITAL', value:`${saude.toFixed(0)}%`, urgency: saude<40?'critico':saude<60?'alto':saude<80?'medio':'baixo', desc:`Nota media: ${globalAvg.toFixed(1)}/5 em todos os canais` },
    { title:'CANAL COM MAIOR POTENCIAL', value: weakCh?CHANNELS[weakCh].label:'N/A', urgency: weakVal<2?'critico':weakVal<3?'alto':'medio', desc: weakCh?`${CHANNELS[weakCh].label} com nota ${weakVal.toFixed(1)}/5 - maior oportunidade`:'Todos os canais desativados' },
    { title:'READINESS PARA ESCALAR', value: globalAvg<2?'NAO PRONTO':globalAvg<3?'PARCIAL':globalAvg<4?'PRONTO':'EXCELENTE', urgency: globalAvg<2?'critico':globalAvg<3?'alto':globalAvg<4?'medio':'baixo', desc: globalAvg<2?'Necessita reestruturacao antes de escalar':globalAvg<3?'Ajustes antes de escalar':'Estruturado - pronto para escalar' },
  ];
}

// ============================================================
// DIAGNOSTICO
// ============================================================
function gerarDiagnostico(data) {
  const avgsText = Object.keys(CHANNELS).map(ch => {
    const d = data.channels[ch];
    if (d.disabled || !Object.keys(d.ratings).length) return null;
    const avg = calcAvg(d.ratings);
    if (avg===null) return null;
    const s = avg>=4?'excelente':avg>=3?'bom':avg>=2?'regular':'critico';
    return `${CHANNELS[ch].label}: ${avg.toFixed(1)}/5 (${s})`;
  }).filter(Boolean).join(' | ');
  const gap = data.goal>0?((data.goal-data.revenue)/data.revenue*100).toFixed(0):0;
  return `DIAGNOSTICO EXECUTIVO

Negocio no nicho de ${data.nichos.join(', ')} com faturamento atual de R$ ${data.revenue.toLocaleString('pt-BR')}/mes e meta de R$ ${data.goal.toLocaleString('pt-BR')}/mes (gap de ${gap}%).

CANAIS AVALIADOS
${avgsText||'Nenhum canal avaliado'}

PRINCIPAL DESAFIO
${data.dificuldade}

OBJETIVO 6 MESES
${data.objetivo6m}

ANALISE DOS KPIs
${data.kpis.map(k=>`- ${k.title}: ${k.value} (${k.urgency.toUpperCase()})`).join('\n')}

RECOMENDACAO
Foque nos canais com menor pontuacao para gerar o maior impacto no menor tempo. Com as otimizacoes corretas, o crescimento de ${gap}% e alcancavel em 6 meses.`;
}

// ============================================================
// BANCO DE DADOS
// ============================================================
function salvarLead(data) {
  const leads = JSON.parse(localStorage.getItem('mvbusiness_leads')||'[]');
  const idx = leads.findIndex(l=>l.id===data.id);
  if(idx>=0) leads[idx]=data; else leads.push(data);
  localStorage.setItem('mvbusiness_leads', JSON.stringify(leads));
}
function getLeads() { return JSON.parse(localStorage.getItem('mvbusiness_leads')||'[]'); }

let filteredLeadsCache = [];

function loadLeads() {
  const leads = getLeads();
  filteredLeadsCache = leads;
  const sel = document.getElementById('filterEspecialista');
  if (sel) {
    const esp = [...new Set(leads.map(l=>l.especialista).filter(Boolean))].sort();
    const cur = sel.value;
    sel.innerHTML = '<option value="">Todos</option>' + esp.map(e=>`<option value="${e}">${e}</option>`).join('');
    if (cur) sel.value = cur;
  }
  applyFilter();
}

function redownloadPDF(id) {
  const lead = getLeads().find(l=>l.id===id);
  if (!lead) { alert('Lead nao encontrado!'); return; }
  lead.kpis = lead.kpis||calcKPIs(lead);
  lead.aiSummary = lead.aiSummary||gerarDiagnostico(lead);
  document.getElementById('loadingOverlay').classList.add('show');
  gerarPDF(lead).then(()=>document.getElementById('loadingOverlay').classList.remove('show'));
}

// FILTROS
function parseDate(s) {
  if(!s) return null;
  const p=s.split('/');
  if(p.length===3) return new Date(parseInt(p[2]),parseInt(p[1])-1,parseInt(p[0]));
  return new Date(s);
}
function toInputDate(d) { return d.toISOString().split('T')[0]; }

function setQuickFilter(type) {
  const today=new Date(), from=new Date();
  if(type==='today') from.setHours(0,0,0,0);
  else if(type==='week') from.setDate(today.getDate()-7);
  else if(type==='month') from.setDate(today.getDate()-30);
  document.getElementById('filterFrom').value=toInputDate(from);
  document.getElementById('filterTo').value=toInputDate(today);
  applyFilter();
}
function clearFilter() {
  document.getElementById('filterFrom').value='';
  document.getElementById('filterTo').value='';
  document.getElementById('filterEspecialista').value='';
  applyFilter();
}
function applyFilter() {
  const fromVal=document.getElementById('filterFrom').value;
  const toVal=document.getElementById('filterTo').value;
  const esp=document.getElementById('filterEspecialista').value;
  const fromDate=fromVal?new Date(fromVal+'T00:00:00'):null;
  const toDate=toVal?new Date(toVal+'T23:59:59'):null;
  const filtered=getLeads().filter(l=>{
    const d=parseDate(l.date);
    if(!d) return true;
    if(fromDate&&d<fromDate) return false;
    if(toDate&&d>toDate) return false;
    if(esp&&l.especialista!==esp) return false;
    return true;
  });
  filteredLeadsCache=filtered;
  renderLeadsTable(filtered);
  renderMetrics(filtered,fromVal,toVal);
}

function renderMetrics(leads,fromVal,toVal) {
  document.getElementById('metricTotal').textContent=leads.length;
  const scores=leads.map(l=>{
    const cs=Object.keys(CHANNELS).map(ch=>{const d=l.channels?.[ch];if(!d||d.disabled||!Object.keys(d.ratings||{}).length)return null;return calcAvg(d.ratings);}).filter(v=>v!==null);
    return cs.length?cs.reduce((a,b)=>a+b,0)/cs.length:null;
  }).filter(v=>v!==null);
  document.getElementById('metricAvgScore').textContent=scores.length?(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1)+'/5':'--';
  const revenues=leads.filter(l=>l.revenue>0).map(l=>l.revenue);
  document.getElementById('metricAvgRevenue').textContent=revenues.length?'R$ '+Math.round(revenues.reduce((a,b)=>a+b,0)/revenues.length).toLocaleString('pt-BR'):'--';
  const goals=leads.filter(l=>l.goal>0).map(l=>l.goal);
  document.getElementById('metricAvgGoal').textContent=goals.length?'R$ '+Math.round(goals.reduce((a,b)=>a+b,0)/goals.length).toLocaleString('pt-BR'):'--';
  const bar=document.getElementById('filterResult');
  const txt=document.getElementById('filterResultText');
  if(fromVal||toVal){
    bar.style.display='block';
    const de=fromVal?new Date(fromVal+'T00:00:00').toLocaleDateString('pt-BR'):'inicio';
    const ate=toVal?new Date(toVal+'T23:59:59').toLocaleDateString('pt-BR'):'hoje';
    txt.textContent=`${leads.length} formulario${leads.length!==1?'s':''} preenchido${leads.length!==1?'s':''} de ${de} ate ${ate}`;
  } else { bar.style.display='none'; }
}

function renderLeadsTable(leads) {
  const tbody=document.getElementById('leadsBody');
  if(!leads.length){tbody.innerHTML='<tr><td colspan="10" style="text-align:center;color:var(--muted);padding:40px;">Nenhum lead no periodo selecionado</td></tr>';return;}
  tbody.innerHTML=leads.slice().reverse().map(l=>{
    const sc=Object.keys(CHANNELS).map(ch=>{const d=l.channels?.[ch];if(!d||d.disabled||!Object.keys(d.ratings||{}).length)return null;return calcAvg(d.ratings);}).filter(v=>v!==null);
    const gs=sc.length?(sc.reduce((a,b)=>a+b,0)/sc.length).toFixed(1):'--';
    const clr=gs==='--'?'var(--muted)':parseFloat(gs)>=4?'#4A7C59':parseFloat(gs)>=3?'#B8860B':parseFloat(gs)>=2?'#D4820A':'#C0392B';
    return `<tr>
      <td style="white-space:nowrap;">${l.date}</td>
      <td><strong>${l.clientName}</strong></td>
      <td style="color:var(--muted);">${l.especialista}</td>
      <td>${l.phone}</td>
      <td style="font-size:.82rem;color:var(--muted);">${l.email}</td>
      <td><span class="badge badge-info">${l.nichos?.[0]||'--'}</span></td>
      <td>R$ ${(l.revenue||0).toLocaleString('pt-BR')}</td>
      <td>R$ ${(l.goal||0).toLocaleString('pt-BR')}</td>
      <td><strong style="color:${clr};">${gs!=='--'?gs+'/5':'--'}</strong></td>
      <td><button class="btn btn-outline" style="padding:6px 14px;font-size:.8rem;" onclick="redownloadPDF(${l.id})">PDF</button></td>
    </tr>`;
  }).join('');
}

window.exportCSV = function() {
  const leads=filteredLeadsCache.length>0?filteredLeadsCache:getLeads();
  if(!leads.length){alert('Nenhum lead para exportar!');return;}
  const headers=['Data','Cliente','Especialista','Email','Telefone','Nicho','Faturamento','Meta','Score Site','Score Instagram','Score TikTok','Score WhatsApp'];
  const rows=leads.map(l=>{
    const sc=Object.keys(CHANNELS).map(ch=>{const d=l.channels?.[ch];if(!d||d.disabled||!Object.keys(d.ratings||{}).length)return '--';const a=calcAvg(d.ratings);return a!==null?a.toFixed(1):'--';});
    return[l.date,l.clientName,l.especialista,l.email,l.phone,l.nichos?.join('; '),l.revenue,l.goal,...sc];
  });
  const csv=[headers,...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
  a.download=`MVBusiness_Leads_${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.csv`;
  a.click();
};

// ============================================================
// GERAR RELATORIO
// ============================================================
async function gerarRelatorio() {
  const data=collectData();
  const err=validateData(data);
  if(err){showMsg(err,'error');return;}
  document.getElementById('loadingOverlay').classList.add('show');
  try {
    data.kpis=calcKPIs(data);
    data.aiSummary=gerarDiagnostico(data);
    salvarLead(data);
    await gerarPDF(data);
    document.getElementById('loadingOverlay').classList.remove('show');
    showMsg('Relatorio gerado e PDF baixado!','success');
    window.scrollTo(0,0);
  } catch(e) {
    document.getElementById('loadingOverlay').classList.remove('show');
    showMsg('Erro: '+e.message,'error');
    console.error(e);
  }
}

// ============================================================
// PDF — 100% html2canvas (sem jsPDF direto para texto)
// ============================================================
async function gerarPDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({orientation:'portrait', unit:'mm', format:'a4'});

  const renderPage = async (htmlContent, isFirst) => {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;min-height:1123px;background:#faf7f0;font-family:DM Sans,Arial,sans-serif;overflow:hidden;';
    div.innerHTML = htmlContent;
    document.body.appendChild(div);
    await new Promise(r => setTimeout(r, 200));
    const canvas = await html2canvas(div, {
      scale: 2,
      backgroundColor: '#faf7f0',
      logging: false,
      useCORS: true,
      width: 794,
      height: 1123
    });
    document.body.removeChild(div);
    if (!isFirst) doc.addPage();
    doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
  };

  // Pré-renderizar gráficos
  const radarURL = await renderRadar(data);
  const barURLs = {};
  for (const ch of Object.keys(CHANNELS)) {
    const d = data.channels[ch];
    if (!d.disabled && Object.keys(d.ratings).length > 0) {
      barURLs[ch] = await renderBar(ch, d);
    }
  }

  const gold = '#C9A84C';
  const cream = '#FAF7F0';
  const brown = '#2C1810';
  const muted = '#8B7355';
  const urgColors = { critico:'#C0392B', alto:'#D4820A', medio:'#B8860B', baixo:'#4A7C59' };
  const base = `<style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body,div{font-family:'DM Sans',Arial,sans-serif;}
    .page{width:794px;height:1123px;background:#faf7f0;overflow:hidden;position:relative;}
  </style>`;

  // CAPA
  await renderPage(`${base}<div class="page" style="background:#0f0a03;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;">
    <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,${gold},${gold},transparent);"></div>
    <div style="position:absolute;top:0;left:0;width:10px;height:100%;background:#0f0a03;border-right:2px solid ${gold};"></div>
    <div style="text-align:center;padding:60px 80px;">
      <div style="font-size:11px;letter-spacing:.3em;color:#6B5520;text-transform:uppercase;margin-bottom:32px;">MVBusiness &middot; Diagnostico Digital</div>
      <div style="font-size:64px;font-weight:800;color:#FAF7F0;line-height:1;margin-bottom:6px;letter-spacing:-.02em;">RELATORIO</div>
      <div style="font-size:64px;font-weight:800;color:${gold};line-height:1;margin-bottom:48px;letter-spacing:-.02em;">DIGITAL</div>
      <div style="width:60px;height:1px;background:${gold};margin:0 auto 40px;"></div>
      <div style="font-size:32px;font-weight:700;color:#FAF7F0;margin-bottom:10px;letter-spacing:.02em;">${data.clientName.toUpperCase()}</div>
      <div style="font-size:13px;color:#6B5520;letter-spacing:.1em;margin-bottom:48px;">${data.nichos.join(' &middot; ')}</div>
      <div style="display:flex;gap:0;border:1px solid #2a1e08;border-radius:8px;overflow:hidden;margin-bottom:48px;">
        ${[['ESPECIALISTA',data.especialista],['DATA',data.date],['FATURAMENTO','R$ '+data.revenue.toLocaleString('pt-BR')]].map((col,i)=>`
          <div style="flex:1;padding:18px 20px;${i>0?'border-left:1px solid #2a1e08;':''}background:#1a1006;text-align:center;">
            <div style="font-size:9px;color:#6B5520;text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px;">${col[0]}</div>
            <div style="font-size:13px;color:#FAF7F0;font-weight:500;">${col[1]}</div>
          </div>`).join('')}
      </div>
      <div style="border:1px solid #4a3010;border-radius:8px;padding:20px 40px;background:#1a1006;display:inline-block;">
        <div style="font-size:10px;color:#6B5520;text-transform:uppercase;letter-spacing:.12em;margin-bottom:8px;">META MENSAL</div>
        <div style="font-size:36px;font-weight:800;color:${gold};">R$ ${data.goal.toLocaleString('pt-BR')}</div>
      </div>
    </div>
    <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,${gold},${gold},transparent);"></div>
  </div>`, true);

  // DADOS + KPIs
  const urgBg={critico:'#FAE8E8',alto:'#FDF3E3',medio:'#FDFAE3',baixo:'#EAF3EC'};
  await renderPage(`${base}<div class="page" style="padding:50px 50px;">
    <div style="font-size:8px;letter-spacing:.2em;color:${gold};text-transform:uppercase;margin-bottom:4px;">MVBusiness &middot; Relatorio de Analise</div>
    <div style="height:1px;background:linear-gradient(90deg,${gold},transparent);margin-bottom:32px;"></div>

    <div style="font-size:9px;letter-spacing:.16em;color:${muted};text-transform:uppercase;margin-bottom:14px;font-weight:600;">DADOS DO CLIENTE</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:28px;">
      ${[['CLIENTE',data.clientName],['ESPECIALISTA',data.especialista],['TELEFONE',data.phone],['EMAIL',data.email],['FATURAMENTO ATUAL','R$ '+data.revenue.toLocaleString('pt-BR')+'/mes'],['META MENSAL','R$ '+data.goal.toLocaleString('pt-BR')+'/mes'],['NICHO',data.nichos.join(', ')+(data.outroNicho?' ('+data.outroNicho+')':'')]].map(([k,v])=>`
        <div style="background:#F5F0E8;border:1px solid #E0D5C0;border-radius:8px;padding:12px 16px;">
          <div style="font-size:8px;color:${muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;">${k}</div>
          <div style="font-size:12px;color:${brown};font-weight:500;">${v}</div>
        </div>`).join('')}
    </div>

    <div style="font-size:9px;letter-spacing:.16em;color:${muted};text-transform:uppercase;margin-bottom:14px;font-weight:600;">OBJETIVOS E DESAFIOS</div>
    <div style="background:#F5F0E8;border:1px solid #E0D5C0;border-radius:8px;padding:14px 16px;margin-bottom:10px;">
      <div style="font-size:8px;color:${muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">OBJETIVO 6 MESES</div>
      <div style="font-size:11px;color:${brown};line-height:1.6;">${data.objetivo6m}</div>
    </div>
    <div style="background:#F5F0E8;border:1px solid #E0D5C0;border-radius:8px;padding:14px 16px;margin-bottom:28px;">
      <div style="font-size:8px;color:${muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">PRINCIPAL DIFICULDADE</div>
      <div style="font-size:11px;color:${brown};line-height:1.6;">${data.dificuldade}</div>
    </div>

    <div style="font-size:9px;letter-spacing:.16em;color:${muted};text-transform:uppercase;margin-bottom:14px;font-weight:600;">KPIs E NIVEL DE URGENCIA</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${data.kpis.map(k=>`
        <div style="background:${urgBg[k.urgency]||'#F5F0E8'};border:1px solid ${urgColors[k.urgency]}44;border-left:3px solid ${urgColors[k.urgency]};border-radius:8px;padding:16px;">
          <div style="font-size:8px;color:${urgColors[k.urgency]};text-transform:uppercase;letter-spacing:.12em;font-weight:700;margin-bottom:4px;">${k.urgency.toUpperCase()}</div>
          <div style="font-size:9px;color:${muted};text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;">${k.title}</div>
          <div style="font-size:24px;font-weight:800;color:${urgColors[k.urgency]};margin-bottom:5px;">${k.value}</div>
          <div style="font-size:9px;color:${muted};line-height:1.5;">${k.desc}</div>
        </div>`).join('')}
    </div>
    <div style="position:absolute;bottom:20px;right:50px;font-size:8px;color:#C0B090;">${data.date} &middot; ${data.clientName}</div>
  </div>`);

  // RADAR
  const activeChannels = Object.keys(CHANNELS).filter(ch=>!data.channels[ch].disabled && Object.keys(data.channels[ch].ratings).length);
  const legendHTML = activeChannels.map(ch=>{
    const avg=calcAvg(data.channels[ch].ratings);
    return `<div style="display:flex;align-items:center;gap:8px;"><div style="width:10px;height:10px;border-radius:50%;background:${CHANNELS[ch].color};"></div><span style="font-size:11px;color:${brown};">${CHANNELS[ch].label}: <strong style="color:${CHANNELS[ch].color};">${avg!==null?avg.toFixed(1):'--'}/5</strong></span></div>`;
  }).join('');

  await renderPage(`${base}<div class="page" style="padding:50px;">
    <div style="font-size:8px;letter-spacing:.2em;color:${gold};text-transform:uppercase;margin-bottom:4px;">MVBusiness &middot; Relatorio de Analise</div>
    <div style="height:1px;background:linear-gradient(90deg,${gold},transparent);margin-bottom:32px;"></div>
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:28px;font-weight:800;color:${brown};margin-bottom:6px;">MAPA DE NEGOCIO</div>
      <div style="font-size:11px;color:${muted};">Visao geral da presenca digital por canal &middot; pontuacao de 0 a 5</div>
    </div>
    ${radarURL?`<div style="text-align:center;background:#F5F0E8;border:1px solid #E0D5C0;border-radius:12px;padding:20px;margin-bottom:24px;"><img src="${radarURL}" style="width:500px;height:500px;object-fit:contain;"></div>`:'<div style="text-align:center;padding:60px;color:'+muted+';">Minimo 2 canais para o grafico radar</div>'}
    <div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;">${legendHTML}</div>
    <div style="position:absolute;bottom:20px;right:50px;font-size:8px;color:#C0B090;">${data.date} &middot; ${data.clientName}</div>
  </div>`);

  // CANAIS
  for (const ch of Object.keys(CHANNELS)) {
    const d = data.channels[ch];
    if (d.disabled || !Object.keys(d.ratings).length) continue;
    const cfg = CHANNELS[ch];
    const avg = calcAvg(d.ratings);
    const pct = avg!==null?(avg/5)*100:0;
    const statusInfo = v => {
      if(v===0) return ['N/AVAL','#888'];
      if(v<=1) return ['CRITICO','#C0392B'];
      if(v<=2) return ['FRACO','#D4820A'];
      if(v<=3) return ['REGULAR','#B8860B'];
      if(v<=4) return ['BOM','#4A7C59'];
      return ['OTIMO','#2D6A4F'];
    };
    const rows = Object.entries(d.ratings).map(([label,val],i)=>{
      const [status,color]=statusInfo(val);
      const barW=(val/5)*100;
      return `<tr style="background:${i%2===0?'#F5F0E8':'#FAF7F0'};">
        <td style="padding:8px 12px;font-size:10px;color:${brown};">${label}</td>
        <td style="padding:8px 12px;"><div style="display:flex;align-items:center;gap:6px;"><div style="width:80px;height:5px;background:#DDD5C0;border-radius:3px;overflow:hidden;"><div style="height:100%;width:${barW}%;background:${cfg.color};border-radius:3px;"></div></div><span style="font-size:10px;font-weight:700;color:${cfg.color};">${val}/5</span></div></td>
        <td style="padding:8px 12px;font-size:9px;font-weight:700;color:${color};">${status}</td>
      </tr>`;
    }).join('');
    await renderPage(`${base}<div class="page" style="padding:40px 50px;">
      <div style="font-size:8px;letter-spacing:.2em;color:${gold};text-transform:uppercase;margin-bottom:4px;">MVBusiness &middot; Relatorio de Analise</div>
      <div style="height:1px;background:linear-gradient(90deg,${gold},transparent);margin-bottom:20px;"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div>
          <div style="font-size:22px;font-weight:800;color:${cfg.color};">${cfg.potencia}</div>
          <div style="font-size:10px;color:${muted};margin-top:2px;">${cfg.label}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:9px;color:${muted};">MEDIA GERAL</div>
          <div style="font-size:28px;font-weight:800;color:${cfg.color};">${avg!==null?avg.toFixed(1):'--'}<span style="font-size:14px;color:${muted};">/5</span></div>
        </div>
      </div>
      <div style="height:6px;background:#E0D5C0;border-radius:3px;overflow:hidden;margin-bottom:20px;">
        <div style="height:100%;width:${pct}%;background:${cfg.color};border-radius:3px;"></div>
      </div>
      ${barURLs[ch]?`<div style="background:#F5F0E8;border:1px solid #E0D5C0;border-radius:8px;padding:10px;margin-bottom:16px;"><img src="${barURLs[ch]}" style="width:100%;height:200px;object-fit:contain;"></div>`:''}
      <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;">
        <thead><tr style="background:#E8DFC8;">
          <th style="padding:8px 12px;text-align:left;font-size:8px;color:${muted};text-transform:uppercase;letter-spacing:.1em;">Item Avaliado</th>
          <th style="padding:8px 12px;text-align:left;font-size:8px;color:${muted};text-transform:uppercase;letter-spacing:.1em;">Nota</th>
          <th style="padding:8px 12px;text-align:left;font-size:8px;color:${muted};text-transform:uppercase;letter-spacing:.1em;">Status</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="position:absolute;bottom:20px;right:50px;font-size:8px;color:#C0B090;">${data.date} &middot; ${data.clientName}</div>
    </div>`);
  }

  // DIAGNOSTICO + ORIENTACOES
  const diagHTML = data.aiSummary.split('\n').map(l=>{
    const isTitle = l===l.toUpperCase()&&l.trim().length>3;
    return l.trim()
      ? `<p style="font-size:${isTitle?'9':'10'}px;color:${isTitle?gold:brown};font-weight:${isTitle?'700':'400'};line-height:1.6;margin-bottom:${isTitle?'8':'4'}px;${isTitle?'text-transform:uppercase;letter-spacing:.1em;':''}">${l}</p>`
      : '<div style="height:8px;"></div>';
  }).join('');

  await renderPage(`${base}<div class="page" style="padding:50px;">
    <div style="font-size:8px;letter-spacing:.2em;color:${gold};text-transform:uppercase;margin-bottom:4px;">MVBusiness &middot; Relatorio de Analise</div>
    <div style="height:1px;background:linear-gradient(90deg,${gold},transparent);margin-bottom:28px;"></div>
    <div style="font-size:18px;font-weight:800;color:${brown};margin-bottom:4px;">Diagnostico Executivo</div>
    <div style="font-size:10px;color:${muted};font-style:italic;margin-bottom:20px;">Analise gerada automaticamente com base nos dados coletados</div>
    <div style="background:#F5F0E8;border:1px solid #E0D5C0;border-radius:10px;padding:24px;margin-bottom:28px;">${diagHTML}</div>
    <div style="font-size:18px;font-weight:800;color:${brown};margin-bottom:4px;">Orientacoes do Especialista</div>
    <div style="font-size:10px;color:${muted};font-style:italic;margin-bottom:16px;">${data.especialista} &middot; ${data.date}</div>
    <div style="background:#F5F0E8;border:1px solid ${gold}55;border-left:3px solid ${gold};border-radius:10px;padding:24px;">
      ${data.orientacoes.split('\n').map(l=>`<p style="font-size:10px;color:${brown};line-height:1.7;margin-bottom:4px;">${l||'&nbsp;'}</p>`).join('')}
    </div>
    <div style="position:absolute;bottom:24px;left:50px;right:50px;border-top:1px solid #E0D5C0;padding-top:16px;display:flex;justify-content:space-between;">
      <span style="font-size:8px;color:#C0B090;">MVBusiness &middot; Sistema de Analise de Negocios Digitais</span>
      <span style="font-size:8px;color:#C0B090;">${data.date}</span>
    </div>
  </div>`);

  doc.save(`Analise_${data.clientName.replace(/\s+/g,'_')}_${data.id}.pdf`);
}

// ============================================================
// GRAFICOS
// ============================================================
async function renderRadar(data) {
  const activeChannels = Object.keys(CHANNELS).filter(ch=>{
    const d=data.channels[ch];
    return !d.disabled && Object.keys(d.ratings).length>0;
  });
  if (activeChannels.length < 2) return null;

  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 600;
    canvas.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.appendChild(canvas);

    const chart = new Chart(canvas.getContext('2d'), {
      type: 'radar',
      data: {
        labels: activeChannels.map(ch=>CHANNELS[ch].label),
        datasets: [{
          data: activeChannels.map(ch=>{ const a=calcAvg(data.channels[ch].ratings); return a!==null?parseFloat(a.toFixed(2)):0; }),
          borderColor: '#C9A84C',
          backgroundColor: 'rgba(201,168,76,0.1)',
          borderWidth: 2,
          pointBackgroundColor: activeChannels.map(ch=>CHANNELS[ch].color),
          pointBorderColor: '#FAF7F0',
          pointBorderWidth: 2,
          pointRadius: 8,
        }]
      },
      options: {
        animation: { duration:0 },
        responsive: false,
        scales: {
          r: {
            min:0, max:5,
            ticks:{ stepSize:1, color:'#8B7355', backdropColor:'transparent', font:{size:14} },
            grid:{ color:'rgba(139,115,85,0.2)' },
            angleLines:{ color:'rgba(139,115,85,0.3)' },
            pointLabels:{ color:'#2C1810', font:{size:15,weight:'600'} }
          }
        },
        plugins:{ legend:{display:false} }
      }
    });

    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const url = canvas.toDataURL('image/png');
      chart.destroy();
      document.body.removeChild(canvas);
      resolve(url);
    }));
  });
}

async function renderBar(ch, chData) {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = 700; canvas.height = 340;
    canvas.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.appendChild(canvas);
    const cfg = CHANNELS[ch];
    const labels = Object.keys(chData.ratings);
    const values = Object.values(chData.ratings);

    const chart = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels.map(l=>l.length>35?l.substring(0,33)+'...':l),
        datasets: [{
          data: values,
          backgroundColor: cfg.color+'99',
          borderColor: cfg.color,
          borderWidth: 1.5,
          borderRadius: 5,
          borderSkipped: false,
        }]
      },
      options: {
        animation: { duration:0 },
        responsive: false,
        indexAxis: 'y',
        scales: {
          x: { min:0, max:5, ticks:{stepSize:1,color:'#8B7355',font:{size:12}}, grid:{color:'rgba(139,115,85,0.15)'} },
          y: { ticks:{color:'#2C1810',font:{size:11}}, grid:{color:'rgba(139,115,85,0.08)'} }
        },
        plugins: { legend:{display:false} }
      }
    });

    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const url = canvas.toDataURL('image/png');
      chart.destroy();
      document.body.removeChild(canvas);
      resolve(url);
    }));
  });
}

// ============================================================
// UTILS
// ============================================================
function showMsg(text, type='success') {
  const el=document.getElementById('msg');
  el.textContent=text;
  el.className=`msg ${type}`;
  el.style.display='block';
  window.scrollTo(0,0);
  if(type==='success') setTimeout(()=>el.style.display='none',5000);
}

function limparForm() {
  if(!confirm('Limpar todos os campos?')) return;
  document.querySelectorAll('input[type=text],input[type=email],input[type=tel],input[type=number],textarea').forEach(el=>{
    el.value=el.id==='phone'?'+55':'';
  });
  document.querySelectorAll('input[name=nicho]').forEach(el=>el.checked=false);
  document.getElementById('outroNichoBox').style.display='none';
  Object.keys(CHANNELS).forEach(ch=>{
    state.ratings[ch]={};
    state.disabled[ch]=false;
    document.getElementById(`${ch}Disabled`).checked=false;
    document.getElementById(`${ch}Content`).classList.remove('disabled');
    document.getElementById(`customFields-${ch}`).innerHTML='';
    buildChannel(ch);
  });
  window.scrollTo(0,0);
}
