// ============================================================
// CONFIGURAÇÃO DOS CANAIS
// ============================================================
const CHANNELS = {
  site: {
    label: 'Site / Loja Virtual', icon: '🌐', color: '#C9A84C',
    potencia: 'Potência do Site',
    fields: [
      'Design e UX (experiência do usuário)',
      'Proposta de valor clara',
      'Qualidade das imagens de produto',
      'Uso de vídeos na exibição de produto',
      'Descrição de produtos completa e atrativa',
      'Formas de pagamento disponíveis',
      'Velocidade de carregamento',
      'Segurança (selos, certificados)',
      'Política de frete',
      'Preço de frete competitivo',
      'Política de frete grátis',
      'Tráfego para o site',
      'Análise e métricas do site',
      'Taxa de conversão',
      'Página "Quem Somos" estruturada',
      'Política de troca e devolução',
      'Banners atualizados com CTA',
      'Planejamento de ações e campanhas',
    ]
  },
  insta: {
    label: 'Instagram', icon: '📷', color: '#B8860B',
    potencia: 'Potência do Instagram',
    fields: [
      'Identidade visual consistente',
      'Frequência de publicações',
      'Taxa de engajamento',
      'Qualidade do conteúdo (fotos, reels, carrosséis)',
      'Bio otimizada com CTA claro',
      'Stories e Highlights estratégicos',
      'Audiência alinhada ao nicho',
      'Frequência de Lives',
      'Existência de automação (ManyChat, etc.)',
      'Legendas com CTAs de ação',
      'Linha editorial de conteúdos definida',
      'Alinhamento de comunicação com persona',
    ]
  },
  tiktok: {
    label: 'TikTok / TikTok Shop', icon: '🎵', color: '#8B7355',
    potencia: 'Potência do TikTok',
    fields: [
      'Consistência e frequência de vídeos',
      'Taxa de views por vídeo',
      'Uso de tendências relevantes',
      'Qualidade de produção dos vídeos',
      'Loja criada no TikTok Shop',
      'Quantidade de produtos cadastrados',
      'Uso de afiliados e quantidade',
      'Prática de Lives na plataforma',
      'Cadastro em promoções da plataforma',
      'Integração de produtos (catálogo)',
      'Engajamento (comentários, duetos)',
    ]
  },
  whatsapp: {
    label: 'WhatsApp', icon: '💬', color: '#6B8E6B',
    potencia: 'Potência do WhatsApp',
    fields: [
      'Captação e criação de grupos de clientes',
      'Estratégias de ofertas exclusivas no canal',
      'Engajamento e relacionamento com leads',
      'Uso de mensagens com API oficial',
      'Volume de ofertas criadas no canal',
      'Uso de catálogo de produtos',
      'Frequência de broadcasts / disparos',
      'Automação de mensagens (chatbot)',
    ]
  }
};

// Estado global
const state = {
  ratings: { site:{}, insta:{}, tiktok:{}, whatsapp:{} },
  disabled: { site:false, insta:false, tiktok:false, whatsapp:false },
};

// Init
document.addEventListener('DOMContentLoaded', () => {
  Object.keys(CHANNELS).forEach(ch => buildChannel(ch));
  loadLeads();
  document.querySelector('#nichoGrid input[value="Outros"]')
    ?.addEventListener('change', function() {
      document.getElementById('outroNichoBox').style.display = this.checked ? 'block' : 'none';
    });
});

    };
    reader.readAsDataURL(file);
  });
}

// ============================================================
// CONSTRUIR RATINGS
// ============================================================
function buildChannel(ch) {
  const container = document.getElementById(`${ch}Ratings`);
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
      <div class="rating-badge" id="badge-${key}">—</div>
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
    <div class="rating-badge">—</div>
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
// COLETAR DADOS
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
  if (!d.clientName) return 'Nome do cliente é obrigatório';
  if (!d.especialista) return 'Nome do especialista é obrigatório';
  if (!d.phone || d.phone==='+55') return 'Telefone é obrigatório';
  if (!d.email) return 'Email é obrigatório';
  if (!d.revenue) return 'Faturamento é obrigatório';
  if (!d.goal) return 'Objetivo financeiro é obrigatório';
  if (!d.nichos.length) return 'Selecione pelo menos um nicho';
  if (!d.objetivo6m) return 'Objetivo de 6 meses é obrigatório';
  if (!d.dificuldade) return 'Dificuldade principal é obrigatória';
  if (!d.orientacoes) return 'Orientacoes do especialista são obrigatórias';
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
      const a = calcAvg(d.ratings); avgs[ch] = a;
      if (a!==null) scores.push(a);
    } else avgs[ch] = null;
  });
  const globalAvg = scores.length ? scores.reduce((a,b)=>a+b,0)/scores.length : 0;
  const saude = (globalAvg/5)*100;
  let weakCh=null, weakVal=Infinity;
  Object.entries(avgs).forEach(([ch,a])=>{ if(a!==null && a<weakVal){weakVal=a;weakCh=ch;} });
  return [
    { title:'CRESCIMENTO NECESSÁRIO', value:`${gap.toFixed(1)}%`, urgency: gap>100?'critico':gap>50?'alto':'medio', desc:`De R$ ${data.revenue.toLocaleString('pt-BR')} para R$ ${data.goal.toLocaleString('pt-BR')} por mês` },
    { title:'SAÚDE DIGITAL', value:`${saude.toFixed(0)}%`, urgency: saude<40?'critico':saude<60?'alto':saude<80?'medio':'baixo', desc:`Nota média: ${globalAvg.toFixed(1)}/5 em todos os canais avaliados` },
    { title:'CANAL COM MAIOR POTENCIAL', value: weakCh ? CHANNELS[weakCh].label : 'N/A', urgency: weakVal<2?'critico':weakVal<3?'alto':'medio', desc: weakCh ? `${CHANNELS[weakCh].label} · nota ${weakVal.toFixed(1)}/5 — maior oportunidade de crescimento` : 'Todos os canais desativados' },
    { title:'READINESS PARA ESCALAR', value: globalAvg<2?'NÃO PRONTO':globalAvg<3?'PARCIAL':globalAvg<4?'PRONTO':'EXCELENTE', urgency: globalAvg<2?'critico':globalAvg<3?'alto':globalAvg<4?'medio':'baixo', desc: globalAvg<2?'Necessita reestruturação antes de escalar':globalAvg<3?'Pequenos ajustes antes de escalar':'Estruturado — pronto para escalar com confiança' },
  ];
}

// ============================================================
// DIAGNÓSTICO
// ============================================================
function gerarDiagnostico(data) {
  const avgsText = Object.keys(CHANNELS).map(ch => {
    const d = data.channels[ch];
    if (d.disabled || !Object.keys(d.ratings).length) return null;
    const avg = calcAvg(d.ratings);
    if (avg===null) return null;
    const s = avg>=4?'excelente':avg>=3?'bom':avg>=2?'regular':'crítico';
    return `${CHANNELS[ch].label}: ${avg.toFixed(1)}/5 (${s})`;
  }).filter(Boolean).join('\n');
  const gap = data.goal>0?((data.goal-data.revenue)/data.revenue*100).toFixed(0):0;
  return `DIAGNÓSTICO EXECUTIVO

Negócio no nicho de ${data.nichos.join(', ')} com faturamento atual de R$ ${data.revenue.toLocaleString('pt-BR')}/mês e meta de R$ ${data.goal.toLocaleString('pt-BR')}/mês (gap de ${gap}%).

CANAIS AVALIADOS
${avgsText||'Nenhum canal avaliado'}

PRINCIPAL DESAFIO
${data.dificuldade}

OBJETIVO (6 MESES)
${data.objetivo6m}

ANÁLISE DOS KPIs
${data.kpis.map(k=>`• ${k.title}: ${k.value}`).join('\n')}

RECOMENDAÇÃO
Foque nos canais com menor pontuação para gerar o maior impacto no menor tempo. Com as otimizações corretas, o crescimento de ${gap}% é alcançável em 6 meses.`;
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
  if (!lead) { alert('Lead não encontrado!'); return; }
  lead.kpis = lead.kpis||calcKPIs(lead);
  lead.aiSummary = lead.aiSummary||gerarDiagnostico(lead);
  document.getElementById('loadingOverlay').classList.add('show');
  gerarPDF(lead).then(()=>document.getElementById('loadingOverlay').classList.remove('show'));
}

// FILTRO
function parseDate(s) {
  if(!s) return null;
  const p = s.split('/');
  if(p.length===3) return new Date(parseInt(p[2]),parseInt(p[1])-1,parseInt(p[0]));
  return new Date(s);
}
function toInputDate(d) { return d.toISOString().split('T')[0]; }

function setQuickFilter(type) {
  const today = new Date();
  const from = new Date();
  if(type==='today') from.setHours(0,0,0,0);
  else if(type==='week') from.setDate(today.getDate()-7);
  else if(type==='month') from.setDate(today.getDate()-30);
  document.getElementById('filterFrom').value = toInputDate(from);
  document.getElementById('filterTo').value = toInputDate(today);
  applyFilter();
}
function clearFilter() {
  document.getElementById('filterFrom').value='';
  document.getElementById('filterTo').value='';
  document.getElementById('filterEspecialista').value='';
  applyFilter();
}
function applyFilter() {
  const fromVal = document.getElementById('filterFrom').value;
  const toVal = document.getElementById('filterTo').value;
  const esp = document.getElementById('filterEspecialista').value;
  const fromDate = fromVal ? new Date(fromVal+'T00:00:00') : null;
  const toDate = toVal ? new Date(toVal+'T23:59:59') : null;
  const all = getLeads();
  const filtered = all.filter(l => {
    const d = parseDate(l.date);
    if (!d) return true;
    if (fromDate && d < fromDate) return false;
    if (toDate && d > toDate) return false;
    if (esp && l.especialista !== esp) return false;
    return true;
  });
  filteredLeadsCache = filtered;
  renderLeadsTable(filtered);
  renderMetrics(filtered, fromVal, toVal);
}

function renderMetrics(leads, fromVal, toVal) {
  document.getElementById('metricTotal').textContent = leads.length;
  const scores = leads.map(l=>{
    const cs = Object.keys(CHANNELS).map(ch=>{const d=l.channels?.[ch];if(!d||d.disabled||!Object.keys(d.ratings||{}).length)return null;return calcAvg(d.ratings);}).filter(v=>v!==null);
    return cs.length?cs.reduce((a,b)=>a+b,0)/cs.length:null;
  }).filter(v=>v!==null);
  document.getElementById('metricAvgScore').textContent = scores.length?(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1)+'/5':'—';
  const revenues = leads.filter(l=>l.revenue>0).map(l=>l.revenue);
  document.getElementById('metricAvgRevenue').textContent = revenues.length?'R$ '+Math.round(revenues.reduce((a,b)=>a+b,0)/revenues.length).toLocaleString('pt-BR'):'—';
  const goals = leads.filter(l=>l.goal>0).map(l=>l.goal);
  document.getElementById('metricAvgGoal').textContent = goals.length?'R$ '+Math.round(goals.reduce((a,b)=>a+b,0)/goals.length).toLocaleString('pt-BR'):'—';
  const bar = document.getElementById('filterResult');
  const txt = document.getElementById('filterResultText');
  if (fromVal||toVal) {
    bar.style.display='block';
    const de = fromVal?new Date(fromVal+'T00:00:00').toLocaleDateString('pt-BR'):'início';
    const ate = toVal?new Date(toVal+'T23:59:59').toLocaleDateString('pt-BR'):'hoje';
    txt.textContent=`${leads.length} formulário${leads.length!==1?'s':''} preenchido${leads.length!==1?'s':''} de ${de} até ${ate}`;
  } else { bar.style.display='none'; }
}

function renderLeadsTable(leads) {
  const tbody = document.getElementById('leadsBody');
  if (!leads.length) {
    tbody.innerHTML='<tr><td colspan="10" style="text-align:center;color:var(--muted);padding:40px;">Nenhum lead no período selecionado</td></tr>';
    return;
  }
  tbody.innerHTML = leads.slice().reverse().map(l => {
    const sc = Object.keys(CHANNELS).map(ch=>{const d=l.channels?.[ch];if(!d||d.disabled||!Object.keys(d.ratings||{}).length)return null;return calcAvg(d.ratings);}).filter(v=>v!==null);
    const gs = sc.length?(sc.reduce((a,b)=>a+b,0)/sc.length).toFixed(1):'—';
    const clr = gs==='—'?'var(--muted)':parseFloat(gs)>=4?'#2ed573':parseFloat(gs)>=3?'#f1c40f':parseFloat(gs)>=2?'#ffa502':'#ff4757';
    return `<tr>
      <td style="white-space:nowrap;">${l.date}</td>
      <td><strong>${l.clientName}</strong></td>
      <td style="color:var(--muted);">${l.especialista}</td>
      <td>${l.phone}</td>
      <td style="font-size:.85rem;color:var(--muted);">${l.email}</td>
      <td><span class="badge badge-info">${l.nichos?.[0]||'—'}</span></td>
      <td>R$ ${(l.revenue||0).toLocaleString('pt-BR')}</td>
      <td>R$ ${(l.goal||0).toLocaleString('pt-BR')}</td>
      <td><strong style="color:${clr};">${gs!=='—'?gs+'/5':'—'}</strong></td>
      <td><button class="btn btn-outline" style="padding:6px 14px;font-size:.8rem;" onclick="redownloadPDF(${l.id})">PDF</button></td>
    </tr>`;
  }).join('');
}

window.exportCSV = function() {
  const leads = filteredLeadsCache.length>0?filteredLeadsCache:getLeads();
  if(!leads.length){alert('Nenhum lead para exportar!');return;}
  const headers=['Data','Cliente','Especialista','Email','Telefone','Nicho','Faturamento','Meta','Score Site','Score Instagram','Score TikTok','Score WhatsApp'];
  const rows=leads.map(l=>{
    const sc=Object.keys(CHANNELS).map(ch=>{const d=l.channels?.[ch];if(!d||d.disabled||!Object.keys(d.ratings||{}).length)return '—';const a=calcAvg(d.ratings);return a!==null?a.toFixed(1):'—';});
    return[l.date,l.clientName,l.especialista,l.email,l.phone,l.nichos?.join('; '),l.revenue,l.goal,...sc];
  });
  const csv=[headers,...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
  a.download=`MVBusiness_Leads_${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.csv`;
  a.click();
};

// ============================================================
// GERAR RELATÓRIO
// ============================================================
async function gerarRelatorio() {
  const data = collectData();
  const err = validateData(data);
  if (err) { showMsg(err,'error'); return; }
  document.getElementById('loadingOverlay').classList.add('show');
  try {
    data.kpis = calcKPIs(data);
    data.aiSummary = gerarDiagnostico(data);
    salvarLead(data);
    await gerarPDF(data);
    document.getElementById('loadingOverlay').classList.remove('show');
    showMsg('Relatório gerado e PDF baixado com sucesso!','success');
    window.scrollTo(0,0);
  } catch(e) {
    document.getElementById('loadingOverlay').classList.remove('show');
    showMsg('Erro: '+e.message,'error');
    console.error(e);
  }
}

// ============================================================
// GERAR GRÁFICO RADAR EM CANVAS (retorna Promise<dataURL>)
// ============================================================
async function renderRadarToImage(data) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 600;
    canvas.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(canvas);

    const activeChannels = Object.keys(CHANNELS).filter(ch => {
      const d = data.channels[ch];
      return !d.disabled && Object.keys(d.ratings).length > 0;
    });

    if (activeChannels.length < 2) {
      document.body.removeChild(canvas);
      resolve(null);
      return;
    }

    const labels = activeChannels.map(ch => CHANNELS[ch].label);
    const values = activeChannels.map(ch => {
      const avg = calcAvg(data.channels[ch].ratings);
      return avg !== null ? parseFloat(avg.toFixed(2)) : 0;
    });
    const pointColors = ['#C9A84C','#B8860B','#8B7355','#6B8E6B'];

    const chart = new Chart(canvas.getContext('2d'), {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: '#C9A84C',
          backgroundColor: 'rgba(201,168,76,0.12)',
          borderWidth: 2,
          pointBackgroundColor: activeChannels.map((_,i) => pointColors[i]||'#C9A84C'),
          pointBorderColor: '#1a1204',
          pointBorderWidth: 2,
          pointRadius: 8,
        }]
      },
      options: {
        animation: { duration: 0 }, // SEM animação — captura imediata
        responsive: false,
        scales: {
          r: {
            min: 0, max: 5,
            ticks: { stepSize:1, color:'#8B7355', backdropColor:'transparent', font:{size:13} },
            grid: { color:'rgba(139,115,85,0.3)' },
            angleLines: { color:'rgba(139,115,85,0.4)' },
            pointLabels: { color:'#2C1810', font:{size:15, weight:'600'} }
          }
        },
        plugins: { legend:{ display:false } }
      }
    });

    // Aguardar 1 frame para render completo, depois capturar
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const url = canvas.toDataURL('image/png');
        chart.destroy();
        document.body.removeChild(canvas);
        resolve(url);
      });
    });
  });
}

// ============================================================
// GERAR GRÁFICO DE BARRAS (retorna Promise<dataURL>)
// ============================================================
async function renderBarToImage(ch, chData) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 380;
    canvas.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(canvas);

    const cfg = CHANNELS[ch];
    const labels = Object.keys(chData.ratings);
    const values = Object.values(chData.ratings);

    const chart = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: labels.map(l => l.length > 35 ? l.substring(0,33)+'…' : l),
        datasets: [{
          data: values,
          backgroundColor: cfg.color + 'bb',
          borderColor: cfg.color,
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        animation: { duration: 0 },
        responsive: false,
        indexAxis: 'y',
        scales: {
          x: { min:0, max:5, ticks:{stepSize:1,color:'#8B7355',font:{size:12}}, grid:{color:'rgba(139,115,85,0.15)'}, backgroundColor:'transparent' },
          y: { ticks:{color:'#2C1810',font:{size:11,weight:'500'}}, grid:{color:'rgba(139,115,85,0.08)'} }
        },
        plugins: { legend:{display:false} }
      }
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const url = canvas.toDataURL('image/png');
        chart.destroy();
        document.body.removeChild(canvas);
        resolve(url);
      });
    });
  });
}

// ============================================================
// PDF — PALETA LUXO BRANCO + DOURADO
// ============================================================
const GOLD = '#C9A84C';
const GOLD_DARK = '#8B6914';
const CREAM = '#FDFAF4';
const CREAM2 = '#F5F0E8';
const DARK = '#1a0f02';
const BROWN = '#2C1810';
const MUTED = '#8B7355';
const urgColors = {
  critico: '#C0392B',
  alto:    '#D4820A',
  medio:   '#B8860B',
  baixo:   '#4A7C59',
};

async function gerarPDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const W = 210;

  // Pré-renderizar os gráficos ANTES de montar o PDF
  const radarURL = await renderRadarToImage(data);

  const barURLs = {};
  for (const ch of Object.keys(CHANNELS)) {
    const d = data.channels[ch];
    if (!d.disabled && Object.keys(d.ratings).length > 0) {
      barURLs[ch] = await renderBarToImage(ch, d);
    }
  }

  // ---- CAPA ----
  drawCapa(doc, data, W);

  // ---- DADOS + KPIs ----
  doc.addPage();
  drawDadosKPIs(doc, data, W);

  // ---- MAPA DE NEGÓCIO ----
  doc.addPage();
  drawRadar(doc, data, W, radarURL);

  // ---- CANAIS ----
  for (const ch of Object.keys(CHANNELS)) {
    const d = data.channels[ch];
    if (d.disabled || !Object.keys(d.ratings).length) continue;
    doc.addPage();
    await drawCanal(doc, ch, d, data, W, barURLs[ch]);
  }

  // ---- DIAGNÓSTICO + ORIENTAÇÕES ----
  doc.addPage();
  drawDiagnostico(doc, data, W);

  // Numeração
  const total = doc.getNumberOfPages();
  for (let i=2; i<=total; i++) {
    doc.setPage(i);
    doc.setFont('helvetica','normal');
    doc.setFontSize(7);
    doc.setTextColor(MUTED);
    doc.text(`${data.clientName}  ·  ${data.date}`, 14, 291);
    doc.text(`${i} / ${total}`, W-14, 291, {align:'right'});
  }

  doc.save(`Analise_${data.clientName.replace(/\s+/g,'_')}_${data.id}.pdf`);
}

// ---- CAPA ----
function drawCapa(doc, data, W) {
  // Fundo escuro elegante
  doc.setFillColor(16, 10, 2);
  doc.rect(0, 0, W, 297, 'F');

  // Faixa dourada topo
  doc.setFillColor(201, 168, 76);
  doc.rect(0, 0, W, 2, 'F');

  // Bloco decorativo esquerdo
  doc.setFillColor(30, 20, 5);
  doc.rect(0, 0, 8, 297, 'F');
  doc.setFillColor(201, 168, 76);
  doc.rect(8, 0, 1.5, 297, 'F');

  // Texto decorativo topo
  doc.setFont('helvetica','normal');
  doc.setFontSize(7);
  doc.setTextColor(MUTED);
  doc.setCharSpace(3);
  doc.text('MVBUSINESS  ·  DIAGNÓSTICO DIGITAL', W/2+5, 22, {align:'center'});
  doc.setCharSpace(0);

  // Linha separadora dourada
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.3);
  doc.line(22, 26, W-14, 26);

  // TÍTULO PRINCIPAL
  doc.setFont('helvetica','bold');
  doc.setFontSize(38);
  doc.setTextColor(240, 230, 210);
  doc.text('RELATÓRIO DE', W/2+5, 90, {align:'center'});

  doc.setFontSize(38);
  doc.setTextColor(GOLD);
  doc.text('ANÁLISE DIGITAL', W/2+5, 108, {align:'center'});

  // Divisor ornamental
  doc.setDrawColor(GOLD);
  doc.setLineWidth(0.5);
  doc.line(W/2-20, 116, W/2+30, 116);
  doc.setFillColor(201, 168, 76);
  doc.circle(W/2+5, 116, 1.2, 'F');

  // Nome do cliente
  doc.setFont('helvetica','bold');
  doc.setFontSize(22);
  doc.setTextColor(240, 230, 210);
  doc.text(data.clientName.toUpperCase(), W/2+5, 136, {align:'center'});

  // Nicho
  const nichoText = data.nichos.join('  ·  ') + (data.outroNicho ? `  (${data.outroNicho})` : '');
  doc.setFont('helvetica','normal');
  doc.setFontSize(10);
  doc.setTextColor(MUTED);
  doc.text(nichoText, W/2+5, 146, {align:'center'});

  // Bloco de info
  const infoY = 168;
  doc.setFillColor(28, 18, 4);
  doc.setDrawColor(50, 35, 10);
  doc.setLineWidth(0.3);
  doc.roundedRect(22, infoY, W-36, 32, 4, 4, 'FD');

  // Divisórias verticais
  doc.setDrawColor(50, 35, 10);
  doc.line(22+(W-36)/3, infoY+4, 22+(W-36)/3, infoY+28);
  doc.line(22+(W-36)*2/3, infoY+4, 22+(W-36)*2/3, infoY+28);

  const infoCols = [
    {label:'ESPECIALISTA', value: data.especialista},
    {label:'DATA', value: data.date},
    {label:'FATURAMENTO ATUAL', value: 'R$ '+data.revenue.toLocaleString('pt-BR')},
  ];
  infoCols.forEach((col, i) => {
    const cx = 22 + (W-36)/3*i + (W-36)/6;
    doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(MUTED);
    doc.text(col.label, cx, infoY+11, {align:'center'});
    doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(240,230,210);
    doc.text(col.value, cx, infoY+22, {align:'center'});
  });

  // Meta destaque
  doc.setFillColor(35, 24, 6);
  doc.setDrawColor(100, 76, 25);
  doc.setLineWidth(0.5);
  doc.roundedRect(22, infoY+40, W-36, 24, 4, 4, 'FD');
  doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(MUTED);
  doc.text('META MENSAL', W/2+5, infoY+50, {align:'center'});
  doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(GOLD);
  doc.text('R$ '+data.goal.toLocaleString('pt-BR'), W/2+5, infoY+60, {align:'center'});

  // Rodapé capa
  doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(50,38,15);
  doc.text('MVBusiness  ·  Sistema de Análise de Negócios Digitais', W/2+5, 285, {align:'center'});

  // Faixa dourada base
  doc.setFillColor(201, 168, 76);
  doc.rect(0, 295, W, 2, 'F');
}

// ---- DADOS + KPIs ----
function drawDadosKPIs(doc, data, W) {
  const M = 14;
  let y = 18;

  const sectionTitle = (title) => {
    doc.setFillColor(245, 240, 232);
    doc.rect(M, y, W-M*2, 8, 'F');
    doc.setFillColor(201, 168, 76);
    doc.rect(M, y, 2, 8, 'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(8);
    doc.setTextColor(BROWN);
    doc.setCharSpace(1.5);
    doc.text(title, M+6, y+5.5);
    doc.setCharSpace(0);
    y += 13;
  };

  const field = (label, value, half=false, colIdx=0) => {
    const fw = half ? (W-M*2-6)/2 : W-M*2;
    const fx = M + (half ? colIdx*(fw+6) : 0);
    doc.setFillColor(250, 247, 240);
    doc.setDrawColor(230, 220, 200);
    doc.setLineWidth(0.2);
    doc.roundedRect(fx, y, fw, 16, 2, 2, 'FD');
    doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(MUTED);
    doc.text(label, fx+6, y+6);
    doc.setFont('helvetica','bold'); doc.setFontSize(9.5); doc.setTextColor(BROWN);
    doc.text(String(value), fx+6, y+13);
    if (!half) y += 19;
  };

  sectionTitle('DADOS DO CLIENTE');
  // Linha 1: cliente + especialista
  field('CLIENTE', data.clientName, true, 0);
  field('ESPECIALISTA', data.especialista, true, 1);
  y += 19;
  field('TELEFONE', data.phone, true, 0);
  field('EMAIL', data.email, true, 1);
  y += 19;
  field('FATURAMENTO ATUAL', 'R$ '+data.revenue.toLocaleString('pt-BR'), true, 0);
  field('META MENSAL', 'R$ '+data.goal.toLocaleString('pt-BR'), true, 1);
  y += 19;
  field('NICHO', data.nichos.join(', ')+(data.outroNicho?' ('+data.outroNicho+')':''));

  y += 4;
  sectionTitle('OBJETIVOS E DESAFIOS');
  // Objetivo
  doc.setFillColor(250,247,240); doc.setDrawColor(230,220,200); doc.setLineWidth(0.2);
  doc.roundedRect(M, y, W-M*2, 22, 2, 2, 'FD');
  doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(MUTED);
  doc.text('OBJETIVO 6 MESES', M+6, y+6);
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(BROWN);
  const objLines = doc.splitTextToSize(data.objetivo6m, W-M*2-12);
  doc.text(objLines.slice(0,2), M+6, y+13);
  y += 26;

  doc.setFillColor(250,247,240); doc.setDrawColor(230,220,200);
  doc.roundedRect(M, y, W-M*2, 22, 2, 2, 'FD');
  doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(MUTED);
  doc.text('PRINCIPAL DIFICULDADE', M+6, y+6);
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(BROWN);
  const difLines = doc.splitTextToSize(data.dificuldade, W-M*2-12);
  doc.text(difLines.slice(0,2), M+6, y+13);
  y += 30;

  sectionTitle('KPIs E NÍVEL DE URGÊNCIA');
  const kw = (W-M*2-6)/2;
  data.kpis.forEach((kpi, i) => {
    const kx = M + (i%2)*(kw+6);
    const ky = y + Math.floor(i/2)*38;
    const uc = urgColors[kpi.urgency]||GOLD;
    doc.setFillColor(250,247,240); doc.setDrawColor(...hexToRgb(uc)); doc.setLineWidth(0.5);
    doc.roundedRect(kx, ky, kw, 33, 3, 3, 'FD');
    doc.setFillColor(...hexToRgb(uc));
    doc.roundedRect(kx, ky, 2.5, 33, 2, 2, 'F');

    doc.setFont('helvetica','bold'); doc.setFontSize(6.5);
    doc.setTextColor(...hexToRgb(uc));
    doc.text(kpi.urgency.toUpperCase(), kx+6, ky+7);

    doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(MUTED);
    doc.text(kpi.title, kx+6, ky+13);

    doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor(...hexToRgb(uc));
    doc.text(kpi.value, kx+6, ky+23);

    doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor(MUTED);
    const dLines = doc.splitTextToSize(kpi.desc, kw-10);
    doc.text(dLines[0]||'', kx+6, ky+30);
  });
}

// ---- RADAR ----
function drawRadar(doc, data, W, radarURL) {
  const M = 14;
  let y = 18;

  // Título
  doc.setFillColor(245,240,232); doc.rect(M, y, W-M*2, 8, 'F');
  doc.setFillColor(GOLD); doc.rect(M, y, 2, 8, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(BROWN);
  doc.setCharSpace(1.5); doc.text('MAPA DE NEGÓCIO', M+6, y+5.5); doc.setCharSpace(0);
  y += 13;

  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(MUTED);
  doc.text('Visão geral da presença digital por canal  ·  pontuação de 0 a 5', M, y);
  y += 10;

  if (radarURL) {
    // Quadro decorativo
    doc.setFillColor(250,247,240); doc.setDrawColor(220,210,190); doc.setLineWidth(0.3);
    doc.roundedRect(M, y, W-M*2, 170, 4, 4, 'FD');
    doc.addImage(radarURL, 'PNG', M+10, y+8, W-M*2-20, 155);
    y += 178;
  } else {
    doc.setTextColor(MUTED); doc.text('Mínimo de 2 canais para gerar o gráfico radar', M, y+20);
    y += 40;
  }

  // Legenda
  const activeChannels = Object.keys(CHANNELS).filter(ch => !data.channels[ch].disabled && Object.keys(data.channels[ch].ratings).length);
  const legColors = ['#C9A84C','#B8860B','#8B7355','#6B8E6B'];
  let lx = M;
  activeChannels.forEach((ch, i) => {
    const avg = calcAvg(data.channels[ch].ratings);
    const [r,g,b] = hexToRgb(legColors[i]||GOLD);
    doc.setFillColor(r,g,b); doc.circle(lx+3, y+3, 2.5, 'F');
    doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(BROWN);
    doc.text(`${CHANNELS[ch].label}: `, lx+8, y+5);
    doc.setFont('helvetica','bold'); doc.setTextColor(...hexToRgb(legColors[i]||GOLD));
    doc.text(`${avg!==null?avg.toFixed(1):'—'}/5`, lx+8+doc.getTextWidth(`${CHANNELS[ch].label}: `), y+5);
    lx += 50;
  });
}

// ---- CANAL ----
async function drawCanal(doc, ch, chData, data, W, barURL) {
  const M = 14;
  let y = 18;
  const cfg = CHANNELS[ch];
  const avg = calcAvg(chData.ratings);
  const [r,g,b] = hexToRgb(cfg.color);

  // Header colorido
  doc.setFillColor(r,g,b);
  doc.setGState(doc.GState({opacity:0.1}));
  doc.rect(0,0,W,18,'F');
  doc.setGState(doc.GState({opacity:1}));

  doc.setFillColor(r,g,b); doc.rect(0,0,3,18,'F');

  doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor(r,g,b);
  doc.text(cfg.potencia, M+2, 12);
  doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(MUTED);
  doc.text('MÉDIA GERAL', W-M, 8, {align:'right'});
  doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor(r,g,b);
  doc.text((avg!==null?avg.toFixed(1):'—')+'/5', W-M, 15, {align:'right'});

  y = 22;

  // Barra de progresso média
  const pct = avg!==null?(avg/5)*100:0;
  doc.setFillColor(230,220,205); doc.roundedRect(M, y, W-M*2, 4, 2, 2, 'F');
  doc.setFillColor(r,g,b); doc.roundedRect(M, y, (W-M*2)*(pct/100), 4, 2, 2, 'F');
  y += 10;

  // Gráfico barras
  if (barURL) {
    doc.setFillColor(250,247,240); doc.setDrawColor(220,210,190); doc.setLineWidth(0.2);
    doc.roundedRect(M, y, W-M*2, 85, 3, 3, 'FD');
    doc.addImage(barURL, 'PNG', M+2, y+2, W-M*2-4, 81);
    y += 90;
  }

  // Tabela
  doc.setFillColor(245,240,232); doc.rect(M, y, W-M*2, 7, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(6.5); doc.setTextColor(BROWN);
  doc.setCharSpace(1); doc.text('ITEM AVALIADO', M+4, y+5); doc.setCharSpace(0);
  doc.text('NOTA', W-M-30, y+5);
  doc.text('STATUS', W-M-12, y+5);
  y += 9;

  const statusInfo = (v) => {
    if(v===0) return ['N/AVAL.', MUTED];
    if(v<=1) return ['CRÍTICO', urgColors.critico];
    if(v<=2) return ['FRACO', urgColors.alto];
    if(v<=3) return ['REGULAR', urgColors.medio];
    if(v<=4) return ['BOM', '#4A7C59'];
    return ['ÓTIMO', '#2D6A4F'];
  };

  Object.entries(chData.ratings).forEach(([label, val], i) => {
    if (y > 276) { doc.addPage(); y = 18; }
    if (i%2===0) { doc.setFillColor(250,247,240); doc.rect(M, y, W-M*2, 7, 'F'); }
    const [status, color] = statusInfo(val);
    const pctBar = (val/5)*100;

    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(BROWN);
    doc.text(label.length>55?label.substring(0,53)+'…':label, M+4, y+5);

    // mini barra inline
    doc.setFillColor(220,210,195); doc.roundedRect(W-M-50, y+2, 18, 3, 1, 1, 'F');
    doc.setFillColor(r,g,b); doc.roundedRect(W-M-50, y+2, 18*(pctBar/100), 3, 1, 1, 'F');

    doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(r,g,b);
    doc.text(`${val}/5`, W-M-28, y+5);

    doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor(...hexToRgb(color));
    doc.text(status, W-M-12, y+5);
    y += 8;
  });
}

// ---- DIAGNÓSTICO + ORIENTAÇÕES ----
function drawDiagnostico(doc, data, W) {
  const M = 14;
  let y = 18;

  const sectionTitle = (title) => {
    doc.setFillColor(245,240,232); doc.rect(M, y, W-M*2, 8, 'F');
    doc.setFillColor(GOLD); doc.rect(M, y, 2, 8, 'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(BROWN);
    doc.setCharSpace(1.5); doc.text(title, M+6, y+5.5); doc.setCharSpace(0);
    y += 13;
  };

  sectionTitle('DIAGNÓSTICO EXECUTIVO');

  const lines = data.aiSummary.split('\n');
  lines.forEach(line => {
    if (y > 220) return;
    const isTitle = line === line.toUpperCase() && line.trim().length > 3;
    doc.setFont('helvetica', isTitle?'bold':'normal');
    doc.setFontSize(isTitle ? 8 : 8.5);
    doc.setTextColor(isTitle ? GOLD_DARK : BROWN);
    if (isTitle && line.trim()) { y+=2; }
    if (line.trim()) {
      const wrapped = doc.splitTextToSize(line, W-M*2-4);
      wrapped.forEach(l => { if(y<225){doc.text(l, M+4, y); y+=5.5;} });
    } else { y+=3; }
  });

  y += 6;
  if (y > 200) { doc.addPage(); y = 18; }

  sectionTitle('ORIENTAÇÕES DO ESPECIALISTA');
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(MUTED);
  doc.text(`${data.especialista}  ·  ${data.date}`, M+4, y);
  y += 8;

  doc.setFillColor(250,247,240); doc.setDrawColor(220,210,190); doc.setLineWidth(0.3);
  doc.setFillColor(r=>r, g=>g, b=>b); // reset
  // Caixa de orientações
  const oriLines = doc.splitTextToSize(data.orientacoes, W-M*2-12);
  const boxH = Math.min(oriLines.length * 5.5 + 12, 80);
  doc.setFillColor(250,247,240); doc.setDrawColor(201,168,76); doc.setLineWidth(0.3);
  doc.roundedRect(M, y, W-M*2, boxH, 3, 3, 'FD');
  doc.setFillColor(201,168,76); doc.roundedRect(M, y, 2.5, boxH, 2, 2, 'F');
  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(BROWN);
  oriLines.slice(0, 14).forEach((l, i) => {
    doc.text(l, M+7, y+8+i*5.5);
  });

  // Rodapé dourado
  doc.setFillColor(201,168,76); doc.rect(0, 293, W, 4, 'F');
  doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(MUTED);
  doc.text('MVBusiness · Sistema de Análise de Negócios Digitais', W/2, 290, {align:'center'});
}

// ============================================================
// UTILS
// ============================================================
function hexToRgb(hex) {
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
  return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];
}

function showMsg(text, type='success') {
  const el = document.getElementById('msg');
  el.textContent = text;
  el.className = `msg ${type}`;
  el.style.display = 'block';
  window.scrollTo(0,0);
  if(type==='success') setTimeout(()=>el.style.display='none',5000);
}

function limparForm() {
  if (!confirm('Limpar todos os campos?')) return;
  document.querySelectorAll('input[type=text],input[type=email],input[type=tel],input[type=number],textarea').forEach(el=>{
    el.value = el.id==='phone'?'+55':'';
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
