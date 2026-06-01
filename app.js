// ============================================================
// CONFIGURAÇÃO DOS CANAIS
// ============================================================
const CHANNELS = {
  site: {
    label: 'Site / Loja Virtual', icon: '🌐', color: '#00c9ff',
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
    label: 'Instagram', icon: '📷', color: '#ff6b9d',
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
    label: 'TikTok / TikTok Shop', icon: '🎵', color: '#a8ff78',
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
    label: 'WhatsApp', icon: '💬', color: '#25d366',
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
      const a = calcAvg(d.ratings);
      avgs[ch] = a;
      if (a!==null) scores.push(a);
    } else avgs[ch] = null;
  });
  const globalAvg = scores.length ? scores.reduce((a,b)=>a+b,0)/scores.length : 0;
  const saude = (globalAvg/5)*100;
  let weakCh=null, weakVal=Infinity;
  Object.entries(avgs).forEach(([ch,a])=>{ if(a!==null && a<weakVal){weakVal=a;weakCh=ch;} });
  const readiness = globalAvg;
  return [
    { title:'CRESCIMENTO NECESSARIO', value:`${gap.toFixed(1)}%`, urgency: gap>100?'critico':gap>50?'alto':'medio', desc:`De R$ ${data.revenue.toLocaleString('pt-BR')} para R$ ${data.goal.toLocaleString('pt-BR')} por mes` },
    { title:'SAUDE DIGITAL', value:`${saude.toFixed(0)}%`, urgency: saude<40?'critico':saude<60?'alto':saude<80?'medio':'baixo', desc:`Nota media geral: ${globalAvg.toFixed(1)}/5 em todos os canais avaliados` },
    { title:'CANAL COM MAIOR POTENCIAL', value: weakCh ? CHANNELS[weakCh].label : 'N/A', urgency: weakVal<2?'critico':weakVal<3?'alto':'medio', desc: weakCh ? `${CHANNELS[weakCh].label} com nota ${weakVal.toFixed(1)}/5 — maior oportunidade` : 'Todos os canais desativados' },
    { title:'READINESS PARA ESCALAR', value: readiness<2?'NAO PRONTO':readiness<3?'PARCIAL':readiness<4?'PRONTO':'EXCELENTE', urgency: readiness<2?'critico':readiness<3?'alto':readiness<4?'medio':'baixo', desc: readiness<2?'Necessita reestruturacao antes de escalar':readiness<3?'Pequenos ajustes antes de escalar':'Estruturado — escalar com confianca' },
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
    const s = avg>=4?'excelente':avg>=3?'bom':avg>=2?'regular':'critico';
    return `${CHANNELS[ch].label}: ${avg.toFixed(1)}/5 (${s})`;
  }).filter(Boolean).join(' | ');
  const gap = data.goal>0?((data.goal-data.revenue)/data.revenue*100).toFixed(0):0;
  return `DIAGNOSTICO EXECUTIVO — ${data.clientName}

Negocio no nicho de ${data.nichos.join(', ')} com faturamento atual de R$ ${data.revenue.toLocaleString('pt-BR')}/mes e meta de R$ ${data.goal.toLocaleString('pt-BR')}/mes (gap de ${gap}%).

CANAIS AVALIADOS
${avgsText||'Nenhum canal avaliado'}

PRINCIPAL DESAFIO
${data.dificuldade}

OBJETIVO (6 MESES)
${data.objetivo6m}

ANALISE DOS KPIs
${data.kpis.map(k=>`• ${k.title}: ${k.value} — ${k.urgency.toUpperCase()}`).join('\n')}

RECOMENDACAO
Foque nos canais com menor pontuacao para gerar o maior impacto no menor tempo. Com as otimizacoes corretas, o gap de ${gap}% e alcancavel em 6 meses.`;
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

function loadLeads() {
  const leads = getLeads();
  filteredLeadsCache = leads;

  // Popular select de especialistas
  const sel = document.getElementById('filterEspecialista');
  if (sel) {
    const especialistas = [...new Set(leads.map(l=>l.especialista).filter(Boolean))].sort();
    const currentVal = sel.value;
    sel.innerHTML = '<option value="">Todos</option>' + especialistas.map(e=>`<option value="${e}">${e}</option>`).join('');
    if (currentVal) sel.value = currentVal;
  }

  // Aplicar filtro atual (ou mostrar todos)
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

function exportCSV() {
  const leads = getLeads();
  if (!leads.length) { alert('Nenhum lead para exportar!'); return; }
  const headers = ['Data','Cliente','Especialista','Email','Telefone','Nicho','Faturamento','Meta','Score Site','Score Instagram','Score TikTok','Score WhatsApp'];
  const rows = leads.map(l => {
    const scores = Object.keys(CHANNELS).map(ch => {
      const d = l.channels?.[ch];
      if(!d||d.disabled||!Object.keys(d.ratings||{}).length) return '—';
      const a=calcAvg(d.ratings); return a!==null?a.toFixed(1):'—';
    });
    return [l.date,l.clientName,l.especialista,l.email,l.phone,l.nichos?.join('; '),l.revenue,l.goal,...scores];
  });
  const csv = [headers,...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
  a.download = `MVBusiness_Leads_${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.csv`;
  a.click();
}

// ============================================================
// GERAR RELATORIO
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
    showMsg('Relatorio gerado e PDF baixado com sucesso!','success');
    window.scrollTo(0,0);
  } catch(e) {
    document.getElementById('loadingOverlay').classList.remove('show');
    showMsg('Erro: '+e.message,'error');
    console.error(e);
  }
}

// ============================================================
// PDF — renderiza HTML off-screen e captura com html2canvas
// ============================================================
async function gerarPDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});

  // Cria container invisível para renderizar cada página
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:#0d0d0f;font-family:DM Sans,sans-serif;';
  document.body.appendChild(container);

  const addPageFromHTML = async (html, isFirst=false) => {
    container.innerHTML = html;
    await new Promise(r=>setTimeout(r,300));
    const canvas = await html2canvas(container, {scale:2, backgroundColor:'#0d0d0f', logging:false, useCORS:true});
    if (!isFirst) doc.addPage();
    const imgData = canvas.toDataURL('image/jpeg',0.92);
    doc.addImage(imgData,'JPEG',0,0,210,297);
  };

  // ---- CAPA ----
  await addPageFromHTML(pageCapa(data), true);

  // ---- DADOS + KPIs ----
  await addPageFromHTML(pageDadosKPIs(data));

  // ---- MAPA DE NEGOCIO (radar) ----
  const radarHTML = await pageRadar(data);
  await addPageFromHTML(radarHTML);

  // ---- CANAIS (barras) ----
  for (const ch of Object.keys(CHANNELS)) {
    const d = data.channels[ch];
    if (d.disabled || !Object.keys(d.ratings).length) continue;
    const html = await pageCanal(ch, d, data);
    await addPageFromHTML(html);
  }

  // ---- DIAGNOSTICO + ORIENTACOES ----
  await addPageFromHTML(pageDiagnostico(data));

  document.body.removeChild(container);
  doc.save(`Analise_${data.clientName.replace(/\s+/g,'_')}_${data.id}.pdf`);
}

// ============================================================
// TEMPLATES HTML DAS PÁGINAS
// ============================================================

const baseStyle = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body,div{font-family:'DM Sans',Arial,sans-serif;color:#f0f0f5;background:#0d0d0f;}
    .page{width:794px;min-height:1123px;background:#0d0d0f;overflow:hidden;position:relative;}
  </style>`;

function pageCapa(data) {
  const nichoText = data.nichos.join(', ') + (data.outroNicho ? ` (${data.outroNicho})` : '');
  return `${baseStyle}<div class="page" style="background:linear-gradient(160deg,#0d0d0f 0%,#1a1040 50%,#0d0d0f 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#00c9ff,#7c5cfc,#ff6b9d,#a8ff78,#25d366);"></div>
    <div style="text-align:center;padding:60px;">
      <div style="font-size:11px;letter-spacing:.25em;color:#7c5cfc;text-transform:uppercase;margin-bottom:24px;">MVBusiness · Sistema de Analise</div>
      <div style="font-family:'Syne',sans-serif;font-size:52px;font-weight:800;color:#fff;line-height:1.1;margin-bottom:10px;">RELATORIO DE</div>
      <div style="font-family:'Syne',sans-serif;font-size:52px;font-weight:800;background:linear-gradient(90deg,#00c9ff,#7c5cfc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.1;margin-bottom:40px;">ANALISE DIGITAL</div>
      <div style="width:80px;height:2px;background:linear-gradient(90deg,#7c5cfc,#00c9ff);margin:0 auto 40px;"></div>
      <div style="font-size:28px;font-weight:700;color:#fff;margin-bottom:8px;">${data.clientName.toUpperCase()}</div>
      <div style="font-size:14px;color:#7c5cfc;margin-bottom:40px;">${nichoText}</div>
      <div style="display:flex;gap:40px;justify-content:center;margin-bottom:60px;">
        <div style="text-align:center;"><div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;">Especialista</div><div style="font-size:15px;color:#ccc;">${data.especialista}</div></div>
        <div style="width:1px;background:#333;"></div>
        <div style="text-align:center;"><div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;">Data</div><div style="font-size:15px;color:#ccc;">${data.date}</div></div>
        <div style="width:1px;background:#333;"></div>
        <div style="text-align:center;"><div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;">Faturamento</div><div style="font-size:15px;color:#ccc;">R$ ${data.revenue.toLocaleString('pt-BR')}</div></div>
      </div>
      <div style="border:1px solid #222;border-radius:16px;padding:24px 40px;display:inline-block;">
        <div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Meta Mensal</div>
        <div style="font-size:32px;font-weight:800;color:#7c5cfc;">R$ ${data.goal.toLocaleString('pt-BR')}</div>
      </div>
    </div>
    <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#25d366,#a8ff78,#7c5cfc,#ff6b9d,#00c9ff);"></div>
  </div>`;
}

function pageDadosKPIs(data) {
  const urgBg = {critico:'rgba(255,71,87,.12)',alto:'rgba(255,165,2,.12)',medio:'rgba(241,196,15,.12)',baixo:'rgba(46,213,115,.12)'};
  const urgClr = {critico:'#ff4757',alto:'#ffa502',medio:'#f1c40f',baixo:'#2ed573'};
  return `${baseStyle}<div class="page" style="padding:60px 50px;">
    <div style="font-size:9px;letter-spacing:.2em;color:#7c5cfc;text-transform:uppercase;margin-bottom:6px;">MVBusiness · Relatorio de Analise</div>
    <div style="height:1px;background:linear-gradient(90deg,#7c5cfc,transparent);margin-bottom:36px;"></div>

    <div style="font-family:'Syne',sans-serif;font-size:11px;letter-spacing:.15em;color:#555;text-transform:uppercase;margin-bottom:16px;">Dados do Cliente</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:36px;">
      ${[['CLIENTE',data.clientName],['ESPECIALISTA',data.especialista],['TELEFONE',data.phone],['EMAIL',data.email],['FATURAMENTO ATUAL','R$ '+data.revenue.toLocaleString('pt-BR')+'/mes'],['META MENSAL','R$ '+data.goal.toLocaleString('pt-BR')+'/mes'],['NICHO',data.nichos.join(', ')+(data.outroNicho?' ('+data.outroNicho+')':'')]].map(([k,v])=>`
        <div style="background:#16161a;border:1px solid #1e1e24;border-radius:10px;padding:14px 18px;">
          <div style="font-size:9px;color:#555;text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;">${k}</div>
          <div style="font-size:13px;color:#e0e0f0;">${v}</div>
        </div>`).join('')}
    </div>

    <div style="font-family:'Syne',sans-serif;font-size:11px;letter-spacing:.15em;color:#555;text-transform:uppercase;margin-bottom:16px;">Objetivos e Desafios</div>
    <div style="background:#16161a;border:1px solid #1e1e24;border-radius:10px;padding:18px;margin-bottom:10px;">
      <div style="font-size:9px;color:#555;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">Objetivo 6 Meses</div>
      <div style="font-size:12px;color:#c0c0d8;line-height:1.6;">${data.objetivo6m}</div>
    </div>
    <div style="background:#16161a;border:1px solid #1e1e24;border-radius:10px;padding:18px;margin-bottom:36px;">
      <div style="font-size:9px;color:#555;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">Principal Dificuldade</div>
      <div style="font-size:12px;color:#c0c0d8;line-height:1.6;">${data.dificuldade}</div>
    </div>

    <div style="font-family:'Syne',sans-serif;font-size:11px;letter-spacing:.15em;color:#555;text-transform:uppercase;margin-bottom:16px;">KPIs e Nivel de Urgencia</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      ${data.kpis.map(k=>`
        <div style="background:${urgBg[k.urgency]};border:1px solid ${urgClr[k.urgency]}33;border-left:3px solid ${urgClr[k.urgency]};border-radius:10px;padding:18px;">
          <div style="font-size:9px;color:${urgClr[k.urgency]};text-transform:uppercase;letter-spacing:.12em;font-weight:700;margin-bottom:6px;">${k.urgency.toUpperCase()}</div>
          <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;">${k.title}</div>
          <div style="font-size:22px;font-weight:800;color:${urgClr[k.urgency]};margin-bottom:6px;">${k.value}</div>
          <div style="font-size:10px;color:#666;line-height:1.5;">${k.desc}</div>
        </div>`).join('')}
    </div>
    <div style="position:absolute;bottom:20px;right:50px;font-size:9px;color:#333;">${data.date} · ${data.clientName}</div>
  </div>`;
}

async function pageRadar(data) {
  // Criar canvas para o radar
  const canvas = document.createElement('canvas');
  canvas.width = 500; canvas.height = 500;
  canvas.style.position = 'absolute';
  canvas.style.left = '-9999px';
  document.body.appendChild(canvas);

  const activeChannels = Object.keys(CHANNELS).filter(ch => {
    const d = data.channels[ch];
    return !d.disabled && Object.keys(d.ratings).length > 0;
  });

  const labels = activeChannels.map(ch => CHANNELS[ch].label);
  const values = activeChannels.map(ch => {
    const avg = calcAvg(data.channels[ch].ratings);
    return avg !== null ? parseFloat(avg.toFixed(2)) : 0;
  });
  const colors = activeChannels.map(ch => CHANNELS[ch].color);

  let radarDataURL = '';
  if (labels.length >= 2) {
    const chart = new Chart(canvas.getContext('2d'), {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: '#7c5cfc',
          backgroundColor: 'rgba(124,92,252,0.15)',
          borderWidth: 2.5,
          pointBackgroundColor: colors,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 8,
        }]
      },
      options: {
        animation: false,
        scales: { r: { min:0, max:5, ticks:{stepSize:1,color:'#555',backdropColor:'transparent',font:{size:14}}, grid:{color:'#222'}, angleLines:{color:'#333'}, pointLabels:{color:'#aaa',font:{size:16,weight:'600'}} } },
        plugins: { legend:{display:false} }
      }
    });
    await new Promise(r=>setTimeout(r,500));
    radarDataURL = canvas.toDataURL('image/png');
    chart.destroy();
  }
  document.body.removeChild(canvas);

  const legendItems = activeChannels.map(ch =>
    `<div style="display:flex;align-items:center;gap:8px;"><div style="width:12px;height:12px;border-radius:50%;background:${CHANNELS[ch].color};"></div><span style="font-size:12px;color:#aaa;">${CHANNELS[ch].label}: <strong style="color:#fff;">${values[activeChannels.indexOf(ch)].toFixed(1)}/5</strong></span></div>`
  ).join('');

  return `${baseStyle}<div class="page" style="padding:60px 50px;">
    <div style="font-size:9px;letter-spacing:.2em;color:#7c5cfc;text-transform:uppercase;margin-bottom:6px;">MVBusiness · Relatorio de Analise</div>
    <div style="height:1px;background:linear-gradient(90deg,#7c5cfc,transparent);margin-bottom:36px;"></div>
    <div style="text-align:center;margin-bottom:40px;">
      <div style="font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:#fff;margin-bottom:8px;">MAPA DE NEGOCIO</div>
      <div style="font-size:12px;color:#555;">Visao geral da presenca digital por canal — pontuacao de 0 a 5</div>
    </div>
    ${radarDataURL
      ? `<div style="text-align:center;"><img src="${radarDataURL}" style="width:460px;height:460px;object-fit:contain;" /></div>`
      : `<div style="text-align:center;padding:80px;color:#555;">Minimo de 2 canais necessario para o grafico radar</div>`}
    <div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;margin-top:30px;">${legendItems}</div>
    <div style="position:absolute;bottom:20px;right:50px;font-size:9px;color:#333;">${data.date} · ${data.clientName}</div>
  </div>`;
}

async function pageCanal(ch, chData, data) {
  const cfg = CHANNELS[ch];
  const canvas = document.createElement('canvas');
  canvas.width = 700; canvas.height = 340;
  canvas.style.position = 'absolute';
  canvas.style.left = '-9999px';
  document.body.appendChild(canvas);

  const labels = Object.keys(chData.ratings);
  const values = Object.values(chData.ratings);
  const avg = calcAvg(chData.ratings);

  const chart = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels.map(l => l.length > 35 ? l.substring(0,33) + '…' : l),
      datasets: [{
        data: values,
        backgroundColor: cfg.color + '99',
        borderColor: cfg.color,
        borderWidth: 1.5,
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      animation: false,
      indexAxis: 'y',
      scales: {
        x: { min:0, max:5, ticks:{stepSize:1,color:'#666',font:{size:13}}, grid:{color:'#222'} },
        y: { ticks:{color:'#bbb',font:{size:12}}, grid:{color:'#1a1a1a'} }
      },
      plugins: { legend:{display:false} }
    }
  });
  await new Promise(r=>setTimeout(r,400));
  const chartURL = canvas.toDataURL('image/png');
  chart.destroy();
  document.body.removeChild(canvas);

  const statusInfo = (v) => {
    if(v===0) return ['NAO AVALIADO','#555'];
    if(v<=1) return ['CRITICO','#ff4757'];
    if(v<=2) return ['FRACO','#ffa502'];
    if(v<=3) return ['REGULAR','#f1c40f'];
    if(v<=4) return ['BOM','#2ed573'];
    return ['OTIMO','#00c9ff'];
  };

  const tableRows = labels.map((label, i) => {
    const [status, color] = statusInfo(values[i]);
    const pct = (values[i]/5)*100;
    return `<tr style="border-bottom:1px solid #1a1a1a;">
      <td style="padding:9px 12px;font-size:11px;color:#c0c0d8;">${label}</td>
      <td style="padding:9px 12px;text-align:center;"><div style="display:flex;align-items:center;gap:8px;"><div style="flex:1;height:6px;background:#1e1e24;border-radius:3px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${cfg.color};border-radius:3px;"></div></div><span style="font-size:11px;font-weight:700;color:${cfg.color};min-width:28px;">${values[i]}/5</span></div></td>
      <td style="padding:9px 12px;text-align:center;font-size:10px;font-weight:700;color:${color};">${status}</td>
    </tr>`;
  }).join('');

  const pctAvg = avg !== null ? (avg/5)*100 : 0;

  return `${baseStyle}<div class="page" style="padding:50px;">
    <div style="font-size:9px;letter-spacing:.2em;color:#7c5cfc;text-transform:uppercase;margin-bottom:6px;">MVBusiness · Relatorio de Analise</div>
    <div style="height:1px;background:linear-gradient(90deg,#7c5cfc,transparent);margin-bottom:28px;"></div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
      <div>
        <div style="font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:${cfg.color};">${cfg.potencia}</div>
        <div style="font-size:11px;color:#555;margin-top:4px;">${cfg.label}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:10px;color:#555;margin-bottom:4px;">MEDIA GERAL</div>
        <div style="font-size:28px;font-weight:800;color:${cfg.color};">${avg!==null?avg.toFixed(1):'—'}<span style="font-size:14px;color:#555;">/5</span></div>
      </div>
    </div>

    <div style="height:8px;background:#1e1e24;border-radius:4px;overflow:hidden;margin-bottom:24px;">
      <div style="height:100%;width:${pctAvg}%;background:linear-gradient(90deg,${cfg.color}88,${cfg.color});border-radius:4px;"></div>
    </div>

    <img src="${chartURL}" style="width:100%;height:220px;object-fit:contain;border-radius:8px;background:#0f0f12;padding:10px;margin-bottom:20px;" />

    <table style="width:100%;border-collapse:collapse;background:#16161a;border-radius:10px;overflow:hidden;">
      <thead><tr style="background:#1e1e24;">
        <th style="padding:10px 12px;text-align:left;font-size:9px;color:#555;text-transform:uppercase;letter-spacing:.1em;">Item Avaliado</th>
        <th style="padding:10px 12px;text-align:center;font-size:9px;color:#555;text-transform:uppercase;letter-spacing:.1em;">Nota</th>
        <th style="padding:10px 12px;text-align:center;font-size:9px;color:#555;text-transform:uppercase;letter-spacing:.1em;">Status</th>
      </tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    <div style="position:absolute;bottom:20px;right:50px;font-size:9px;color:#333;">${data.date} · ${data.clientName}</div>
  </div>`;
}

function pageDiagnostico(data) {
  const lines = data.aiSummary.split('\n').map(l => l.trim() ? `<p style="margin-bottom:8px;font-size:12px;color:${l===l.toUpperCase()&&l.length>4?'#7c5cfc':'#c0c0d8'};font-weight:${l===l.toUpperCase()&&l.length>4?'700':'400'};line-height:1.6;">${l}</p>` : '<br>').join('');
  return `${baseStyle}<div class="page" style="padding:60px 50px;">
    <div style="font-size:9px;letter-spacing:.2em;color:#7c5cfc;text-transform:uppercase;margin-bottom:6px;">MVBusiness · Relatorio de Analise</div>
    <div style="height:1px;background:linear-gradient(90deg,#7c5cfc,transparent);margin-bottom:36px;"></div>

    <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#fff;margin-bottom:6px;">Diagnostico Executivo</div>
    <div style="font-size:11px;color:#555;margin-bottom:24px;">Analise gerada automaticamente com base nos dados coletados</div>
    <div style="background:#16161a;border:1px solid #1e1e24;border-radius:12px;padding:28px;margin-bottom:32px;">
      ${lines}
    </div>

    <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#fff;margin-bottom:6px;">Orientacoes do Especialista</div>
    <div style="font-size:11px;color:#555;margin-bottom:24px;">${data.especialista} · ${data.date}</div>
    <div style="background:linear-gradient(135deg,rgba(124,92,252,.08),rgba(0,201,255,.05));border:1px solid rgba(124,92,252,.2);border-radius:12px;padding:28px;">
      ${data.orientacoes.split('\n').map(l=>`<p style="font-size:12px;color:#c0c0d8;line-height:1.7;margin-bottom:6px;">${l||'&nbsp;'}</p>`).join('')}
    </div>

    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #1e1e24;display:flex;justify-content:space-between;align-items:center;">
      <div style="font-size:10px;color:#333;">MVBusiness · Sistema de Analise de Negocios Digitais</div>
      <div style="font-size:10px;color:#333;">${data.date}</div>
    </div>
  </div>`;
}

// ============================================================
// UTILS
// ============================================================
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

// ============================================================
// FILTRO E MÉTRICAS DE LEADS
// ============================================================

// Estado do filtro atual (usado no exportCSV)
let filteredLeadsCache = [];

function parseDate(dateStr) {
  // Suporta DD/MM/YYYY (formato pt-BR)
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
  }
  return new Date(dateStr);
}

function toInputDate(date) {
  // Converte Date para YYYY-MM-DD (formato do input date)
  return date.toISOString().split('T')[0];
}

function setQuickFilter(type) {
  const today = new Date();
  const from = new Date();
  if (type === 'today') {
    from.setHours(0,0,0,0);
  } else if (type === 'week') {
    from.setDate(today.getDate() - 7);
  } else if (type === 'month') {
    from.setDate(today.getDate() - 30);
  }
  document.getElementById('filterFrom').value = toInputDate(from);
  document.getElementById('filterTo').value = toInputDate(today);
  applyFilter();
}

function clearFilter() {
  document.getElementById('filterFrom').value = '';
  document.getElementById('filterTo').value = '';
  document.getElementById('filterEspecialista').value = '';
  applyFilter();
}

function applyFilter() {
  const fromVal = document.getElementById('filterFrom').value;
  const toVal = document.getElementById('filterTo').value;
  const especialista = document.getElementById('filterEspecialista').value;

  const fromDate = fromVal ? new Date(fromVal + 'T00:00:00') : null;
  const toDate = toVal ? new Date(toVal + 'T23:59:59') : null;

  const allLeads = getLeads();

  const filtered = allLeads.filter(lead => {
    const leadDate = parseDate(lead.date);
    if (!leadDate) return true;
    if (fromDate && leadDate < fromDate) return false;
    if (toDate && leadDate > toDate) return false;
    if (especialista && lead.especialista !== especialista) return false;
    return true;
  });

  filteredLeadsCache = filtered;
  renderLeadsTable(filtered);
  renderMetrics(filtered, fromVal, toVal);
}

function renderMetrics(leads, fromVal, toVal) {
  const total = leads.length;
  document.getElementById('metricTotal').textContent = total;

  // Score médio
  const scores = leads.map(l => {
    const chScores = Object.keys(CHANNELS).map(ch => {
      const d = l.channels?.[ch];
      if (!d || d.disabled || !Object.keys(d.ratings||{}).length) return null;
      return calcAvg(d.ratings);
    }).filter(v => v !== null);
    return chScores.length ? chScores.reduce((a,b)=>a+b,0)/chScores.length : null;
  }).filter(v => v !== null);

  const avgScore = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) : '—';
  document.getElementById('metricAvgScore').textContent = scores.length ? avgScore + '/5' : '—';

  // Faturamento médio
  const revenues = leads.filter(l=>l.revenue>0).map(l=>l.revenue);
  const avgRevenue = revenues.length ? revenues.reduce((a,b)=>a+b,0)/revenues.length : null;
  document.getElementById('metricAvgRevenue').textContent = avgRevenue
    ? 'R$ ' + Math.round(avgRevenue).toLocaleString('pt-BR')
    : '—';

  // Meta média
  const goals = leads.filter(l=>l.goal>0).map(l=>l.goal);
  const avgGoal = goals.length ? goals.reduce((a,b)=>a+b,0)/goals.length : null;
  document.getElementById('metricAvgGoal').textContent = avgGoal
    ? 'R$ ' + Math.round(avgGoal).toLocaleString('pt-BR')
    : '—';

  // Resultado do filtro
  const resultBar = document.getElementById('filterResult');
  const resultText = document.getElementById('filterResultText');
  if (fromVal || toVal) {
    resultBar.style.display = 'block';
    const de = fromVal ? new Date(fromVal+'T00:00:00').toLocaleDateString('pt-BR') : '—';
    const ate = toVal ? new Date(toVal+'T23:59:59').toLocaleDateString('pt-BR') : 'hoje';
    resultText.textContent = `${total} formulário${total!==1?'s':''} preenchido${total!==1?'s':''} de ${de} ate ${ate}`;
  } else {
    resultBar.style.display = 'none';
  }
}

function renderLeadsTable(leads) {
  const tbody = document.getElementById('leadsBody');
  if (!leads.length) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:var(--muted);padding:40px;">Nenhum lead no período selecionado</td></tr>';
    return;
  }
  tbody.innerHTML = leads.slice().reverse().map(l => {
    const scores = Object.keys(CHANNELS).map(ch => {
      const d = l.channels?.[ch];
      if (!d || d.disabled || !Object.keys(d.ratings||{}).length) return null;
      return calcAvg(d.ratings);
    }).filter(v=>v!==null);
    const gs = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) : '—';
    const scoreColor = gs === '—' ? 'var(--muted)' : parseFloat(gs) >= 4 ? '#2ed573' : parseFloat(gs) >= 3 ? '#f1c40f' : parseFloat(gs) >= 2 ? '#ffa502' : '#ff4757';
    return `<tr>
      <td style="white-space:nowrap;">${l.date}</td>
      <td><strong>${l.clientName}</strong></td>
      <td style="color:var(--muted);">${l.especialista}</td>
      <td style="white-space:nowrap;">${l.phone}</td>
      <td style="color:var(--muted);font-size:.85rem;">${l.email}</td>
      <td><span class="badge badge-info">${l.nichos?.[0]||'—'}</span></td>
      <td style="white-space:nowrap;">R$ ${(l.revenue||0).toLocaleString('pt-BR')}</td>
      <td style="white-space:nowrap;">R$ ${(l.goal||0).toLocaleString('pt-BR')}</td>
      <td><strong style="color:${scoreColor};">${gs !== '—' ? gs+'/5' : '—'}</strong></td>
      <td><button class="btn btn-outline" style="padding:6px 14px;font-size:.8rem;" onclick="redownloadPDF(${l.id})">PDF</button></td>
    </tr>`;
  }).join('');
}

// Sobrescrever exportCSV para usar o filtro atual
const _origExportCSV = exportCSV;
// redefine exportCSV para exportar apenas filtrados
window.exportCSV = function() {
  const leads = filteredLeadsCache.length > 0 ? filteredLeadsCache : getLeads();
  if (!leads.length) { alert('Nenhum lead para exportar no período!'); return; }
  const headers = ['Data','Cliente','Especialista','Email','Telefone','Nicho','Faturamento','Meta','Score Site','Score Instagram','Score TikTok','Score WhatsApp'];
  const rows = leads.map(l => {
    const scores = Object.keys(CHANNELS).map(ch => {
      const d = l.channels?.[ch];
      if(!d||d.disabled||!Object.keys(d.ratings||{}).length) return '—';
      const a=calcAvg(d.ratings); return a!==null?a.toFixed(1):'—';
    });
    return [l.date,l.clientName,l.especialista,l.email,l.phone,l.nichos?.join('; '),l.revenue,l.goal,...scores];
  });
  const csv = [headers,...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
  a.download = `MVBusiness_Leads_${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.csv`;
  a.click();
};

