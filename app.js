// ============================================================
// CONFIGURAÇÃO DOS CAMPOS DE ANÁLISE POR CANAL
// ============================================================
const CHANNELS = {
  site: {
    label: 'Site / Loja Virtual',
    icon: '🌐',
    color: '#00d4ff',
    potencia: 'Potência do Site',
    fields: [
      'Design e UX (experiência do usuário)',
      'Proposta de valor clara',
      'Qualidade das imagens / vídeos de produto',
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
      'Planejamento de ações / campanhas construídas',
    ]
  },
  insta: {
    label: 'Instagram',
    icon: '📷',
    color: '#ff6b6b',
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
    label: 'TikTok / TikTok Shop',
    icon: '🎵',
    color: '#a8ff78',
    potencia: 'Potência do TikTok',
    fields: [
      'Consistência e frequência de vídeos',
      'Taxa de views por vídeo',
      'Uso de tendências relevantes',
      'Qualidade de produção dos vídeos',
      'Loja criada no TikTok Shop',
      'Quantidade de produtos cadastrados no TikTok Shop',
      'Uso de afiliados e quantidade',
      'Prática de Live na plataforma',
      'Cadastro em promoções da plataforma',
      'Integração de produtos (catálogo)',
      'Engajamento (comentários, duetos, compartilhamentos)',
    ]
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: '💬',
    color: '#25d366',
    potencia: 'Potência do WhatsApp',
    fields: [
      'Captação e criação de grupos de clientes',
      'Estratégias de ofertas exclusivas no canal',
      'Engajamento e relacionamento com leads captados',
      'Uso de mensagens com API oficial',
      'Volume de ofertas criadas no canal',
      'Uso de catálogo de produtos no WhatsApp',
      'Frequência de broadcasts / disparos',
      'Automação de mensagens (chatbot)',
    ]
  }
};

// ============================================================
// ESTADO GLOBAL
// ============================================================
const state = {
  ratings: { site: {}, insta: {}, tiktok: {}, whatsapp: {} },
  disabled: { site: false, insta: false, tiktok: false, whatsapp: false },
  customFields: { site: [], insta: [], tiktok: [], whatsapp: [] },
};

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  Object.keys(CHANNELS).forEach(ch => buildChannel(ch));
  loadLeads();

  document.getElementById('nichoOutros').closest('.nicho-item')
    .querySelector('input').addEventListener('change', function() {
      document.getElementById('outroNichoBox').style.display = this.checked ? 'block' : 'none';
    });
});

// ============================================================
// CONSTRUIR CAMPOS DE RATING
// ============================================================
function buildChannel(ch) {
  const container = document.getElementById(`${ch}Ratings`);
  const cfg = CHANNELS[ch];
  container.innerHTML = '';

  cfg.fields.forEach((fieldName, i) => {
    const key = `${ch}_${i}`;
    state.ratings[ch][key] = null;
    container.appendChild(buildRatingBlock(ch, key, fieldName, cfg.color));
  });
}

function buildRatingBlock(ch, key, label, color) {
  const div = document.createElement('div');
  div.className = 'rating-block';
  div.id = `block-${key}`;

  const row = document.createElement('div');
  row.className = 'rating-row';

  const lbl = document.createElement('div');
  lbl.className = 'rating-label';
  lbl.textContent = label;

  const stars = document.createElement('div');
  stars.className = 'rating-stars';

  for (let v = 0; v <= 5; v++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `star-btn star-${v}`;
    btn.textContent = v;
    btn.dataset.val = v;
    btn.onclick = () => setRating(ch, key, v, color);
    stars.appendChild(btn);
  }

  const badge = document.createElement('div');
  badge.className = 'rating-badge';
  badge.id = `badge-${key}`;
  badge.textContent = '—';

  row.appendChild(lbl);
  row.appendChild(stars);
  row.appendChild(badge);
  div.appendChild(row);
  return div;
}

function setRating(ch, key, val, color) {
  state.ratings[ch][key] = val;
  const block = document.getElementById(`block-${key}`);
  block.querySelectorAll('.star-btn').forEach(b => {
    b.classList.remove('active');
    if (parseInt(b.dataset.val) === val) b.classList.add('active');
  });
  const badge = document.getElementById(`badge-${key}`);
  badge.textContent = val + '/5';
  badge.style.background = color + '22';
  badge.style.color = color;
}

// ============================================================
// TOGGLE CANAL
// ============================================================
function toggleChannel(ch, disabled) {
  state.disabled[ch] = disabled;
  const content = document.getElementById(`${ch}Content`);
  content.classList.toggle('disabled', disabled);
}

// ============================================================
// CAMPO PERSONALIZADO
// ============================================================
function addCustomField(ch) {
  const container = document.getElementById(`customFields-${ch}`);
  const id = `custom_${ch}_${Date.now()}`;
  const color = CHANNELS[ch].color;

  const div = document.createElement('div');
  div.className = 'custom-rating';
  div.id = id;

  const inp = document.createElement('input');
  inp.type = 'text';
  inp.placeholder = 'Nome do campo personalizado';
  inp.className = 'custom-name';

  const stars = document.createElement('div');
  stars.className = 'rating-stars';
  for (let v = 0; v <= 5; v++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `star-btn star-${v}`;
    btn.textContent = v;
    btn.dataset.val = v;
    btn.onclick = () => {
      div.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const badge = div.querySelector('.rating-badge');
      badge.textContent = v + '/5';
      badge.style.background = color + '22';
      badge.style.color = color;
    };
    stars.appendChild(btn);
  }

  const badge = document.createElement('div');
  badge.className = 'rating-badge';
  badge.textContent = '—';

  const rem = document.createElement('button');
  rem.className = 'remove-btn';
  rem.textContent = '✕';
  rem.onclick = () => div.remove();

  div.appendChild(inp);
  div.appendChild(stars);
  div.appendChild(badge);
  div.appendChild(rem);
  container.appendChild(div);
}

// ============================================================
// TABS
// ============================================================
function showTab(tab) {
  document.getElementById('tab-form').style.display = tab === 'form' ? 'block' : 'none';
  document.getElementById('tab-leads').style.display = tab === 'leads' ? 'block' : 'none';
  if (tab === 'leads') loadLeads();
}

// ============================================================
// COLETAR DADOS
// ============================================================
function collectData() {
  const nichos = [...document.querySelectorAll('input[name="nicho"]:checked')].map(el => el.value);
  const outroNicho = nichos.includes('Outros') ? document.getElementById('outroNicho').value : '';

  const data = {
    id: Date.now(),
    date: new Date().toLocaleDateString('pt-BR'),
    clientName: document.getElementById('clientName').value.trim(),
    especialista: document.getElementById('especialista').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    revenue: parseFloat(document.getElementById('revenue').value) || 0,
    goal: parseFloat(document.getElementById('goal').value) || 0,
    nichos, outroNicho,
    objetivo6m: document.getElementById('objetivo6m').value.trim(),
    dificuldade: document.getElementById('dificuldade').value.trim(),
    orientacoes: document.getElementById('orientacoes').value.trim(),
    channels: {}
  };

  // Coletar ratings por canal
  Object.keys(CHANNELS).forEach(ch => {
    const cfg = CHANNELS[ch];
    const ratings = {};
    const disabled = state.disabled[ch];

    if (!disabled) {
      // campos padrão
      cfg.fields.forEach((fieldName, i) => {
        const key = `${ch}_${i}`;
        const val = state.ratings[ch][key];
        if (val !== null && val !== undefined) ratings[fieldName] = val;
      });

      // campos personalizados
      document.querySelectorAll(`#customFields-${ch} .custom-rating`).forEach(div => {
        const name = div.querySelector('.custom-name')?.value?.trim();
        const active = div.querySelector('.star-btn.active');
        if (name && active) ratings[name] = parseInt(active.dataset.val);
      });
    }

    data.channels[ch] = { disabled, ratings };
  });

  return data;
}

function validateData(data) {
  if (!data.clientName) return 'Nome do cliente é obrigatório';
  if (!data.especialista) return 'Nome do especialista é obrigatório';
  if (!data.phone || data.phone === '+55') return 'Telefone é obrigatório';
  if (!data.email) return 'Email é obrigatório';
  if (!data.revenue) return 'Faturamento é obrigatório';
  if (!data.goal) return 'Objetivo financeiro é obrigatório';
  if (!data.nichos.length) return 'Selecione pelo menos um nicho';
  if (!data.objetivo6m) return 'Objetivo de 6 meses é obrigatório';
  if (!data.dificuldade) return 'Dificuldade principal é obrigatória';
  if (!data.orientacoes) return 'Orientações do especialista são obrigatórias';
  return null;
}

// ============================================================
// CALCULAR KPIs
// ============================================================
function calcAvg(obj) {
  const vals = Object.values(obj).filter(v => typeof v === 'number');
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

function calcKPIs(data) {
  const gap = data.goal > 0 ? ((data.goal - data.revenue) / data.revenue) * 100 : 0;
  const avgs = {};
  let totalScores = [], totalCount = 0;

  Object.keys(CHANNELS).forEach(ch => {
    const ch_data = data.channels[ch];
    if (!ch_data.disabled && Object.keys(ch_data.ratings).length > 0) {
      const avg = calcAvg(ch_data.ratings);
      avgs[ch] = avg;
      if (avg !== null) { totalScores.push(avg); totalCount++; }
    } else {
      avgs[ch] = null;
    }
  });

  const globalAvg = totalScores.length ? totalScores.reduce((a, b) => a + b, 0) / totalScores.length : 0;
  const saudeDigital = (globalAvg / 5) * 100;

  // Canal mais fraco
  let weakestCh = null, weakestVal = Infinity;
  Object.entries(avgs).forEach(([ch, avg]) => {
    if (avg !== null && avg < weakestVal) { weakestVal = avg; weakestCh = ch; }
  });

  const readiness = globalAvg;

  return [
    {
      title: 'CRESCIMENTO NECESSÁRIO',
      value: `${gap.toFixed(1)}%`,
      urgency: gap > 100 ? 'critico' : gap > 50 ? 'alto' : 'medio',
      desc: `De R$ ${data.revenue.toLocaleString('pt-BR')} → R$ ${data.goal.toLocaleString('pt-BR')} por mês`
    },
    {
      title: 'SAÚDE DIGITAL',
      value: `${saudeDigital.toFixed(0)}%`,
      urgency: saudeDigital < 40 ? 'critico' : saudeDigital < 60 ? 'alto' : saudeDigital < 80 ? 'medio' : 'baixo',
      desc: `Nota média geral: ${globalAvg.toFixed(1)}/5 em todos os canais avaliados`
    },
    {
      title: 'CANAL COM MAIOR POTENCIAL',
      value: weakestCh ? CHANNELS[weakestCh].label : 'N/A',
      urgency: weakestVal < 2 ? 'critico' : weakestVal < 3 ? 'alto' : 'medio',
      desc: weakestCh ? `${CHANNELS[weakestCh].label} com nota ${weakestVal.toFixed(1)}/5 — maior oportunidade de melhoria` : 'Todos os canais desativados'
    },
    {
      title: 'READINESS PARA ESCALAR',
      value: readiness < 2 ? 'NÃO PRONTO' : readiness < 3 ? 'PARCIAL' : readiness < 4 ? 'PRONTO' : 'EXCELENTE',
      urgency: readiness < 2 ? 'critico' : readiness < 3 ? 'alto' : readiness < 4 ? 'medio' : 'baixo',
      desc: readiness < 2 ? 'Negócio precisa de reestruturação antes de escalar investimentos' : readiness < 3 ? 'Pequenos ajustes e pode começar a escalar com cautela' : 'Negócio estruturado, escalar com confiança'
    }
  ];
}

// ============================================================
// GERAR RELATÓRIO
// ============================================================
async function gerarRelatorio() {
  const data = collectData();
  const err = validateData(data);
  if (err) { showMsg(err, 'error'); return; }

  document.getElementById('loadingOverlay').classList.add('show');

  try {
    data.kpis = calcKPIs(data);
    data.aiSummary = gerarDiagnostico(data);

    // Salvar no banco (localStorage)
    salvarLead(data);

    // Gerar PDF
    await gerarPDF(data);

    document.getElementById('loadingOverlay').classList.remove('show');
    showMsg('✅ Relatório gerado e PDF baixado com sucesso!', 'success');
    document.getElementById('tab-form').scrollTo(0,0);
    window.scrollTo(0,0);
  } catch (e) {
    document.getElementById('loadingOverlay').classList.remove('show');
    showMsg('Erro ao gerar relatório: ' + e.message, 'error');
    console.error(e);
  }
}

// ============================================================
// DIAGNÓSTICO AUTOMÁTICO (sem API externa)
// ============================================================
function gerarDiagnostico(data) {
  const avgsText = Object.keys(CHANNELS).map(ch => {
    const d = data.channels[ch];
    if (d.disabled) return null;
    const avg = calcAvg(d.ratings);
    if (avg === null) return null;
    const status = avg >= 4 ? 'excelente' : avg >= 3 ? 'bom' : avg >= 2 ? 'regular' : 'crítico';
    return `${CHANNELS[ch].label}: ${avg.toFixed(1)}/5 (${status})`;
  }).filter(Boolean).join(' | ');

  const gap = data.goal > 0 ? ((data.goal - data.revenue) / data.revenue * 100).toFixed(0) : 0;

  return `DIAGNÓSTICO EXECUTIVO — ${data.clientName}

Negócio no nicho de ${data.nichos.join(', ')} com faturamento atual de R$ ${data.revenue.toLocaleString('pt-BR')}/mês e meta de R$ ${data.goal.toLocaleString('pt-BR')}/mês (gap de ${gap}%).

CANAIS AVALIADOS
${avgsText || 'Nenhum canal avaliado'}

PRINCIPAL DESAFIO IDENTIFICADO
${data.dificuldade}

OBJETIVO DECLARADO (6 MESES)
${data.objetivo6m}

ANÁLISE DOS KPIs
• Crescimento necessário: ${data.kpis[0].value} — Nível ${data.kpis[0].urgency.toUpperCase()}
• Saúde digital: ${data.kpis[1].value} — Nível ${data.kpis[1].urgency.toUpperCase()}
• Canal prioritário: ${data.kpis[2].value} — Nível ${data.kpis[2].urgency.toUpperCase()}
• Readiness: ${data.kpis[3].value}

RECOMENDAÇÃO
Foque nos canais com menor pontuação para gerar o maior impacto no menor tempo. Com as otimizações corretas, o gap de ${gap}% é alcançável em 6 meses.`.trim();
}

// ============================================================
// SALVAR NO BANCO (localStorage — pode integrar Firebase depois)
// ============================================================
function salvarLead(data) {
  const leads = JSON.parse(localStorage.getItem('mvbusiness_leads') || '[]');
  const idx = leads.findIndex(l => l.id === data.id);
  if (idx >= 0) leads[idx] = data; else leads.push(data);
  localStorage.setItem('mvbusiness_leads', JSON.stringify(leads));
}

function getLeads() {
  return JSON.parse(localStorage.getItem('mvbusiness_leads') || '[]');
}

function loadLeads() {
  const leads = getLeads();
  const tbody = document.getElementById('leadsBody');
  if (!leads.length) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:var(--muted);padding:40px;">Nenhum lead cadastrado ainda</td></tr>';
    return;
  }
  tbody.innerHTML = leads.reverse().map(l => {
    const avgs = Object.keys(CHANNELS).map(ch => {
      const d = l.channels?.[ch];
      if (!d || d.disabled || !Object.keys(d.ratings || {}).length) return null;
      return calcAvg(d.ratings);
    }).filter(v => v !== null);
    const globalScore = avgs.length ? (avgs.reduce((a,b)=>a+b,0)/avgs.length).toFixed(1) : '—';

    return `<tr>
      <td>${l.date}</td>
      <td><strong>${l.clientName}</strong></td>
      <td>${l.especialista}</td>
      <td>${l.phone}</td>
      <td>${l.email}</td>
      <td><span class="badge badge-info">${l.nichos?.[0] || '—'}</span></td>
      <td>R$ ${(l.revenue||0).toLocaleString('pt-BR')}</td>
      <td>R$ ${(l.goal||0).toLocaleString('pt-BR')}</td>
      <td><strong>${globalScore}/5</strong></td>
      <td><button class="btn btn-outline" style="padding:6px 14px;font-size:.8rem;" onclick="redownloadPDF(${l.id})">📄 PDF</button></td>
    </tr>`;
  }).join('');
}

function redownloadPDF(id) {
  const leads = getLeads();
  const lead = leads.find(l => l.id === id);
  if (!lead) { alert('Lead não encontrado!'); return; }
  lead.kpis = lead.kpis || calcKPIs(lead);
  lead.aiSummary = lead.aiSummary || gerarDiagnostico(lead);
  document.getElementById('loadingOverlay').classList.add('show');
  gerarPDF(lead).then(() => document.getElementById('loadingOverlay').classList.remove('show'));
}

// ============================================================
// EXPORTAR CSV
// ============================================================
function exportCSV() {
  const leads = getLeads();
  if (!leads.length) { alert('Nenhum lead para exportar!'); return; }

  const headers = ['Data','Cliente','Especialista','Email','Telefone','Nicho','Faturamento','Meta','Score Site','Score Instagram','Score TikTok','Score WhatsApp'];
  const rows = leads.map(l => {
    const scores = Object.keys(CHANNELS).map(ch => {
      const d = l.channels?.[ch];
      if (!d || d.disabled || !Object.keys(d.ratings||{}).length) return '—';
      const avg = calcAvg(d.ratings);
      return avg !== null ? avg.toFixed(1) : '—';
    });
    return [
      l.date, l.clientName, l.especialista, l.email, l.phone,
      l.nichos?.join('; '), l.revenue, l.goal, ...scores
    ];
  });

  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff'+csv], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `MVBusiness_Leads_${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.csv`;
  a.click();
}

// ============================================================
// GERAR PDF COMPLETO COM CANVAS
// ============================================================
async function gerarPDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, M = 14;
  let y = 0;

  const addPage = () => { doc.addPage(); y = 20; };
  const checkY = (needed = 20) => { if (y + needed > 280) addPage(); };

  // ---- CAPA ----
  doc.setFillColor(13, 13, 15);
  doc.rect(0, 0, W, 297, 'F');

  // Gradiente simulado (retângulos)
  for (let i = 0; i < 60; i++) {
    const alpha = (60-i)/60;
    doc.setFillColor(124, 92, 252);
    doc.setGState(doc.GState({opacity: alpha * 0.3}));
    doc.rect(0, i*3, W, 3, 'F');
  }
  doc.setGState(doc.GState({opacity: 1}));

  doc.setTextColor(240, 240, 245);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('RELATÓRIO DE ANÁLISE', W/2, 70, {align:'center'});
  doc.setFontSize(18);
  doc.setTextColor(124, 92, 252);
  doc.text('DE NEGÓCIO DIGITAL', W/2, 82, {align:'center'});

  doc.setTextColor(200, 200, 220);
  doc.setFontSize(13);
  doc.text(data.clientName.toUpperCase(), W/2, 100, {align:'center'});

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 140);
  doc.text(`Especialista: ${data.especialista}  |  Data: ${data.date}`, W/2, 112, {align:'center'});

  // Nicho pill
  doc.setFillColor(124, 92, 252);
  doc.setGState(doc.GState({opacity:0.2}));
  doc.roundedRect(W/2-40, 120, 80, 12, 6, 6, 'F');
  doc.setGState(doc.GState({opacity:1}));
  doc.setTextColor(124, 92, 252);
  doc.setFontSize(9);
  doc.text(data.nichos.join(', '), W/2, 128, {align:'center'});

  // Rodapé capa
  doc.setTextColor(80, 80, 100);
  doc.setFontSize(8);
  doc.text('MVBusiness · Sistema de Análise de Negócios Digitais', W/2, 285, {align:'center'});

  // ---- PÁGINA 2: DADOS + KPIs ----
  doc.addPage();
  y = 20;

  const drawSectionTitle = (title, color=[124,92,252]) => {
    checkY(14);
    doc.setFillColor(...color);
    doc.setGState(doc.GState({opacity:0.15}));
    doc.roundedRect(M, y, W-M*2, 10, 3, 3, 'F');
    doc.setGState(doc.GState({opacity:1}));
    doc.setTextColor(...color);
    doc.setFont('helvetica','bold');
    doc.setFontSize(10);
    doc.text(title, M+4, y+7);
    y += 14;
  };

  const drawField = (label, value) => {
    checkY(8);
    doc.setFont('helvetica','bold');
    doc.setFontSize(8);
    doc.setTextColor(120,120,140);
    doc.text(label.toUpperCase(), M, y);
    doc.setFont('helvetica','normal');
    doc.setTextColor(220,220,235);
    doc.setFontSize(9);
    doc.text(String(value), M+50, y);
    y += 7;
  };

  drawSectionTitle('👤 DADOS DO CLIENTE');
  drawField('Cliente', data.clientName);
  drawField('Especialista', data.especialista);
  drawField('Telefone', data.phone);
  drawField('Email', data.email);
  drawField('Faturamento atual', `R$ ${data.revenue.toLocaleString('pt-BR')}/mês`);
  drawField('Meta mensal', `R$ ${data.goal.toLocaleString('pt-BR')}/mês`);
  drawField('Nicho', data.nichos.join(', ') + (data.outroNicho ? ` (${data.outroNicho})` : ''));
  y += 4;

  drawSectionTitle('🎯 OBJETIVOS E DESAFIOS');
  const wrapText = (text, maxW) => doc.splitTextToSize(text, maxW);
  doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(120,120,140);
  doc.text('OBJETIVO 6 MESES', M, y); y+=5;
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(220,220,235);
  const objLines = wrapText(data.objetivo6m, W-M*2);
  objLines.forEach(l => { checkY(5); doc.text(l, M, y); y+=5; });
  y+=3;
  doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(120,120,140);
  doc.text('PRINCIPAL DIFICULDADE', M, y); y+=5;
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.setTextColor(220,220,235);
  const difLines = wrapText(data.dificuldade, W-M*2);
  difLines.forEach(l => { checkY(5); doc.text(l, M, y); y+=5; });
  y += 6;

  // ---- KPIs ----
  drawSectionTitle('⚠️ KPIs E NÍVEL DE URGÊNCIA');
  const urgColors = { critico:[255,71,87], alto:[255,165,2], medio:[241,196,15], baixo:[46,213,115] };

  data.kpis.forEach(kpi => {
    checkY(28);
    const [r,g,b] = urgColors[kpi.urgency] || [124,92,252];
    doc.setFillColor(r,g,b);
    doc.setGState(doc.GState({opacity:.08}));
    doc.roundedRect(M, y, W-M*2, 24, 4,4,'F');
    doc.setGState(doc.GState({opacity:1}));
    doc.setFillColor(r,g,b);
    doc.roundedRect(M, y, 3, 24, 2,2,'F');

    doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor(r,g,b);
    doc.text(kpi.urgency.toUpperCase(), M+6, y+6);

    doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(220,220,235);
    doc.text(kpi.title, M+6, y+13);

    doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(r,g,b);
    doc.text(kpi.value, W-M-2, y+10, {align:'right'});

    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(140,140,160);
    doc.text(kpi.desc, M+6, y+20);

    y += 28;
  });

  // ---- PÁGINA 3: GRÁFICO RADAR ----
  await drawRadarPage(doc, data);

  // ---- PÁGINAS: ANÁLISE POR CANAL (barras) ----
  for (const ch of Object.keys(CHANNELS)) {
    const chData = data.channels[ch];
    if (chData.disabled || !Object.keys(chData.ratings).length) continue;
    await drawChannelPage(doc, ch, chData, data);
  }

  // ---- PÁGINA: DIAGNÓSTICO + ORIENTAÇÕES ----
  doc.addPage(); y = 20;

  drawSectionTitle('🤖 DIAGNÓSTICO EXECUTIVO');
  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(200,200,220);
  const diagLines = wrapText(data.aiSummary, W-M*2);
  diagLines.forEach(l => { checkY(5); doc.text(l, M, y); y+=5; });
  y += 6;

  checkY(20);
  drawSectionTitle('💡 ORIENTAÇÕES DO ESPECIALISTA', [124,92,252]);
  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(200,200,220);
  const orLines = wrapText(data.orientacoes, W-M*2);
  orLines.forEach(l => { checkY(5); doc.text(l, M, y); y+=5; });

  // Rodapé todas as páginas
  const totalPages = doc.getNumberOfPages();
  for (let i=1; i<=totalPages; i++) {
    doc.setPage(i);
    if (i>1) {
      doc.setFillColor(13,13,15);
      doc.rect(0,285,W,12,'F');
      doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(80,80,100);
      doc.text(`MVBusiness · Análise de ${data.clientName} · ${data.date}`, M, 292);
      doc.text(`Pág. ${i}/${totalPages}`, W-M, 292, {align:'right'});
    }
  }

  doc.save(`Analise_${data.clientName.replace(/\s+/g,'_')}_${Date.now()}.pdf`);
}

// ---- RADAR ----
async function drawRadarPage(doc, data) {
  doc.addPage();

  // Criar canvas off-screen para o radar
  const canvas = document.createElement('canvas');
  canvas.width = 600; canvas.height = 600;
  canvas.style.position = 'absolute'; canvas.style.left = '-9999px';
  document.body.appendChild(canvas);

  const labels = [], datasets = [];

  Object.keys(CHANNELS).forEach(ch => {
    const chData = data.channels[ch];
    if (chData.disabled || !Object.keys(chData.ratings).length) return;
    const avg = calcAvg(chData.ratings);
    labels.push(CHANNELS[ch].label);
    datasets.push(avg ?? 0);
  });

  if (labels.length) {
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Pontuação',
          data: datasets,
          borderColor: '#7c5cfc',
          backgroundColor: 'rgba(124,92,252,0.2)',
          borderWidth: 2,
          pointBackgroundColor: labels.map((_, i) => {
            const colors = ['#00d4ff','#ff6b6b','#a8ff78','#25d366'];
            return colors[i] || '#7c5cfc';
          }),
          pointRadius: 6,
        }]
      },
      options: {
        animation: false,
        scales: { r: { min:0, max:5, ticks:{stepSize:1,color:'#888'}, grid:{color:'#333'}, angleLines:{color:'#333'}, pointLabels:{color:'#ccc',font:{size:14}} } },
        plugins: { legend:{display:false} }
      }
    });

    await new Promise(r => setTimeout(r, 800));
    const img = canvas.toDataURL('image/png');

    doc.setFillColor(13,13,15); doc.rect(0,0,210,297,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor(124,92,252);
    doc.text('🗺️  MAPA DE NEGÓCIO', 105, 22, {align:'center'});
    doc.setFontSize(8); doc.setTextColor(120,120,140);
    doc.text('Visão geral da presença digital por canal', 105, 30, {align:'center'});
    doc.addImage(img, 'PNG', 30, 38, 150, 150);

    // Legenda cores
    let lx = 14, ly = 198;
    Object.keys(CHANNELS).forEach((ch, i) => {
      const chData = data.channels[ch];
      if (chData.disabled) return;
      const colors = ['#00d4ff','#ff6b6b','#a8ff78','#25d366'];
      const [r,g,b] = hexToRgb(colors[i] || '#7c5cfc');
      doc.setFillColor(r,g,b); doc.circle(lx+3, ly-1, 2, 'F');
      doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(180,180,200);
      doc.text(CHANNELS[ch].label, lx+8, ly);
      lx += 50; if (lx > 180) { lx=14; ly+=10; }
    });
  }
  document.body.removeChild(canvas);
}

// ---- BARRAS POR CANAL ----
async function drawChannelPage(doc, ch, chData, data) {
  doc.addPage();

  const canvas = document.createElement('canvas');
  canvas.width = 700; canvas.height = 350;
  canvas.style.position='absolute'; canvas.style.left='-9999px';
  document.body.appendChild(canvas);

  const cfg = CHANNELS[ch];
  const labels = Object.keys(chData.ratings);
  const values = Object.values(chData.ratings);
  const color = cfg.color;
  const [r,g,b] = hexToRgb(color);

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(l => l.length > 30 ? l.substring(0,28)+'…' : l),
      datasets: [{
        label: 'Nota',
        data: values,
        backgroundColor: color + 'bb',
        borderColor: color,
        borderWidth: 1.5,
        borderRadius: 6,
      }]
    },
    options: {
      animation: false,
      indexAxis: 'y',
      scales: {
        x: { min:0, max:5, ticks:{stepSize:1,color:'#888'}, grid:{color:'#333'} },
        y: { ticks:{color:'#ccc',font:{size:11}}, grid:{color:'#222'} }
      },
      plugins: { legend:{display:false} }
    }
  });

  await new Promise(r => setTimeout(r, 600));
  const img = canvas.toDataURL('image/png');
  document.body.removeChild(canvas);

  doc.setFillColor(13,13,15); doc.rect(0,0,210,297,'F');

  // Faixa colorida topo
  doc.setFillColor(r,g,b); doc.setGState(doc.GState({opacity:.2}));
  doc.rect(0,0,210,18,'F');
  doc.setGState(doc.GState({opacity:1}));

  doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.setTextColor(r,g,b);
  doc.text(cfg.potencia, 14, 12);

  const avg = calcAvg(chData.ratings);
  doc.setFontSize(9); doc.setTextColor(180,180,200);
  doc.text(`Média: ${avg !== null ? avg.toFixed(1) : '—'}/5`, 196, 12, {align:'right'});

  // Barra de progresso da média
  doc.setFillColor(40,40,55); doc.rect(14, 20, 182, 5, 'F');
  if (avg !== null) {
    doc.setFillColor(r,g,b); doc.rect(14, 20, 182*(avg/5), 5, 'F');
  }

  doc.addImage(img, 'PNG', 10, 30, 190, 110);

  // Tabela detalhada
  let ty = 150;
  doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(120,120,140);
  doc.text('ITEM AVALIADO', 14, ty);
  doc.text('NOTA', 155, ty);
  doc.text('STATUS', 175, ty);
  ty += 4;
  doc.setFillColor(40,40,55); doc.rect(14, ty, 182, 0.5, 'F');
  ty += 5;

  labels.forEach((label, i) => {
    if (ty > 278) { doc.addPage(); ty=20; }
    const val = values[i];
    const statusText = val <= 1 ? 'CRÍTICO' : val <= 2 ? 'FRACO' : val <= 3 ? 'REGULAR' : val <= 4 ? 'BOM' : 'ÓTIMO';
    const [sr,sg,sb] = val<=1?[255,71,87]:val<=2?[255,165,2]:val<=3?[241,196,15]:val<=4?[46,213,115]:[0,212,255];

    if (i%2===0) { doc.setFillColor(20,20,28); doc.rect(14,ty-3,182,7,'F'); }
    doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(200,200,220);
    doc.text(label.length>55?label.substring(0,53)+'…':label, 14, ty);
    doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(r,g,b);
    doc.text(`${val}/5`, 155, ty);
    doc.setTextColor(sr,sg,sb);
    doc.text(statusText, 175, ty);
    ty += 8;
  });
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

// ============================================================
// UTILITÁRIOS
// ============================================================
function showMsg(text, type='success') {
  const el = document.getElementById('msg');
  el.textContent = text;
  el.className = `msg ${type}`;
  el.style.display = 'block';
  window.scrollTo(0,0);
  if (type === 'success') setTimeout(() => el.style.display='none', 5000);
}

function limparForm() {
  if (!confirm('Tem certeza que deseja limpar todos os campos?')) return;
  document.querySelectorAll('input[type=text], input[type=email], input[type=tel], input[type=number], textarea').forEach(el => {
    el.value = el.id === 'phone' ? '+55' : '';
  });
  document.querySelectorAll('input[name=nicho]').forEach(el => el.checked = false);
  document.getElementById('outroNichoBox').style.display = 'none';

  Object.keys(CHANNELS).forEach(ch => {
    state.ratings[ch] = {};
    state.disabled[ch] = false;
    document.getElementById(`${ch}Disabled`).checked = false;
    document.getElementById(`${ch}Content`).classList.remove('disabled');
    document.getElementById(`customFields-${ch}`).innerHTML = '';
    buildChannel(ch);
  });
  window.scrollTo(0,0);
}
