/* ============================================================
   JAMAICA — Sistema de Vendas (OTIMIZADO)
   Lógica: calculadora, histórico, estatísticas, tema, exportações
   ============================================================ */

/* ---------- PRODUTOS E PREÇOS (fácil de editar) ---------- */
const PRODUCTS = {
  'Five-Seven':    { parceria: 116910, normal: 125000 },
  'M60':           { parceria: 175770, normal: 180000 },
  'M4A1':          { parceria: 194400, normal: 204000 },
  'MPX':           { parceria: 288900, normal: 300000 },
  'Metanfetamina': { parceria: 600,    normal: 700    },
};

/* ---------- CHAVES DE LOCALSTORAGE ---------- */
const LS_HISTORY = 'jamaica_history';
const LS_THEME = 'jamaica_theme';
const LS_QUANTITIES = 'jamaica_quantities';

/* ---------- ESTADO ---------- */
let usePartner = true;
let quantities = {}; // {productName: qty}

/* ---------- ELEMENTOS ---------- */
const $ = (id) => document.getElementById(id);
const itemsBody = $('itemsBody');
const modeToggle = $('modeToggle');

/* ---------- FORMATAÇÃO ---------- */
const fmt = (n) => '$' + Number(n || 0).toLocaleString('pt-BR');

/* ============================================================
   RELÓGIO E DATA (OTIMIZADO com requestAnimationFrame)
   ============================================================ */
let lastSecond = -1;
function updateClock() {
  const now = new Date();
  const currentSecond = now.getSeconds();
  
  // Só atualiza se o segundo mudou
  if (currentSecond !== lastSecond) {
    lastSecond = currentSecond;
    const pad = (v) => String(v).padStart(2, '0');
    $('clock').textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(currentSecond)}`;
    const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    $('date').textContent = now.toLocaleDateString('pt-BR', opts);
  }
  
  requestAnimationFrame(updateClock);
}

/* ============================================================
   TEMA (persistido em localStorage)
   ============================================================ */
function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('light', isLight);
  $('themeToggle').textContent = isLight ? '☀️ Claro' : '🌙 Escuro';
}
function toggleTheme() {
  const next = document.body.classList.contains('light') ? 'dark' : 'light';
  localStorage.setItem(LS_THEME, next);
  applyTheme(next);
}

/* ============================================================
   MODO PARCERIA
   ============================================================ */
function toggleMode() {
  usePartner = !usePartner;
  if (usePartner) {
    modeToggle.textContent = '🟢 COM PARCERIA';
    modeToggle.classList.add('partner');
    modeToggle.classList.remove('nopartner');
  } else {
    modeToggle.textContent = '🔴 SEM PARCERIA';
    modeToggle.classList.add('nopartner');
    modeToggle.classList.remove('partner');
  }
  updateAllPrices();
}

function unitPrice(product) {
  const p = PRODUCTS[product];
  if (!p) return 0;
  return usePartner ? p.parceria : p.normal;
}

/* ============================================================
   CALCULADORA — LISTA FIXA DE PRODUTOS (OTIMIZADO)
   ============================================================ */
function loadQuantities() {
  try {
    quantities = JSON.parse(localStorage.getItem(LS_QUANTITIES)) || {};
  } catch {
    quantities = {};
  }
  // Inicializa com 0 se não existir
  Object.keys(PRODUCTS).forEach(name => {
    if (!(name in quantities)) quantities[name] = 0;
  });
}

function saveQuantities() {
  localStorage.setItem(LS_QUANTITIES, JSON.stringify(quantities));
}

function renderRows() {
  itemsBody.innerHTML = '';
  
  Object.keys(PRODUCTS).forEach((productName) => {
    const qty = quantities[productName] || 0;
    const price = unitPrice(productName);
    const lineTotal = price * qty;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="product-name">${productName}</td>
      <td><input type="number" min="0" step="1" value="${qty}" class="input qty-input" data-product="${productName}" /></td>
      <td class="unit">${fmt(price)}</td>
      <td class="line-total">${fmt(lineTotal)}</td>
    `;
    itemsBody.appendChild(tr);
  });

  // Event listeners otimizados
  itemsBody.querySelectorAll('.qty-input').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const productName = e.target.dataset.product;
      quantities[productName] = Math.max(0, Number(e.target.value) || 0);
      saveQuantities();
      updateLineTotal(e.target);
      updateSummary();
    });
  });

  updateSummary();
}

// Atualiza apenas uma linha específica (mais eficiente)
function updateLineTotal(input) {
  const productName = input.dataset.product;
  const qty = quantities[productName] || 0;
  const price = unitPrice(productName);
  const lineTotal = price * qty;
  
  const row = input.closest('tr');
  row.querySelector('.line-total').textContent = fmt(lineTotal);
}

// Atualiza todos os preços quando muda o modo
function updateAllPrices() {
  Object.keys(PRODUCTS).forEach((productName) => {
    const qty = quantities[productName] || 0;
    const price = unitPrice(productName);
    const lineTotal = price * qty;
    
    const rows = itemsBody.querySelectorAll('tr');
    rows.forEach(row => {
      const input = row.querySelector(`input[data-product="${productName}"]`);
      if (input) {
        row.querySelector('.unit').textContent = fmt(price);
        row.querySelector('.line-total').textContent = fmt(lineTotal);
      }
    });
  });
  
  updateSummary();
}

/* ============================================================
   RESUMO (OTIMIZADO)
   ============================================================ */
function computeCurrent() {
  let subtotal = 0, qtyTotal = 0;
  const items = [];
  
  Object.keys(PRODUCTS).forEach((productName) => {
    const qty = quantities[productName] || 0;
    if (qty === 0) return; // Ignora produtos com quantidade 0
    
    const price = unitPrice(productName);
    const lineTotal = price * qty;
    
    subtotal += lineTotal;
    qtyTotal += qty;
    items.push({ product: productName, qty, unit: price, total: lineTotal });
  });
  
  const vendedor30 = subtotal * 0.3;
  
  return { subtotal, total: subtotal, qtyTotal, vendedor30, items };
}

function updateSummary() {
  const c = computeCurrent();
  $('subtotal').textContent = fmt(c.subtotal);
  $('total').textContent = fmt(c.total);
  $('vendedor30').textContent = fmt(c.vendedor30);
  $('qtyTotal').textContent = c.qtyTotal;
}

/* ============================================================
   HISTÓRICO (localStorage)
   ============================================================ */
function getHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY)) || []; }
  catch { return []; }
}
function setHistory(list) {
  localStorage.setItem(LS_HISTORY, JSON.stringify(list));
}

function saveCalc() {
  const c = computeCurrent();
  if (c.items.length === 0) {
    alert('Adicione ao menos um item com produto selecionado antes de salvar.');
    return;
  }
  const now = new Date();
  const entry = {
    id: 'v_' + Date.now(),
    date: now.toLocaleDateString('pt-BR'),
    time: now.toLocaleTimeString('pt-BR'),
    mode: usePartner ? 'Parceria' : 'Normal',
    items: c.items,
    total: c.total,
    qtyTotal: c.qtyTotal,
    vendedor30: c.vendedor30,
  };
  const list = getHistory();
  list.unshift(entry);
  setHistory(list);
  renderHistory();
  renderStats();
}

function deleteEntry(id) {
  if (!confirm('Excluir esta venda do histórico?')) return;
  setHistory(getHistory().filter((e) => e.id !== id));
  renderHistory();
  renderStats();
}

function renderHistory() {
  const list = getHistory();
  const box = $('historyList');
  box.innerHTML = '';
  if (list.length === 0) {
    box.innerHTML = '<p class="empty-msg">Nenhuma venda salva ainda.</p>';
    return;
  }
  list.forEach((e) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    const modeClass = e.mode === 'Parceria' ? 'partner' : 'normal';
    div.innerHTML = `
      <div class="hi-info">
        <span class="hi-mode ${modeClass}">${e.mode}</span>
        <span class="hi-date">${e.date} • ${e.time}</span>
        <span class="hi-total">${fmt(e.total)}</span>
      </div>
      <div class="hi-actions">
        <button class="btn small neon-yellow" data-view="${e.id}" type="button">👁 Ver</button>
        <button class="btn small neon-red" data-del="${e.id}" type="button">🗑</button>
      </div>
    `;
    box.appendChild(div);
  });
  box.querySelectorAll('[data-view]').forEach((b) =>
    b.addEventListener('click', () => openModal(b.dataset.view)));
  box.querySelectorAll('[data-del]').forEach((b) =>
    b.addEventListener('click', () => deleteEntry(b.dataset.del)));
}

/* ============================================================
   MODAL DE DETALHES
   ============================================================ */
function openModal(id) {
  const e = getHistory().find((x) => x.id === id);
  if (!e) return;
  let rowsHtml = '';
  e.items.forEach((it) => {
    rowsHtml += `<tr><td>${it.product}</td><td>${it.qty}</td><td>${fmt(it.unit)}</td><td>${fmt(it.total)}</td></tr>`;
  });
  $('modalBody').innerHTML = `
    <div class="modal-meta">📅 ${e.date} • ${e.time} &nbsp;|&nbsp; Modo: <strong>${e.mode}</strong> &nbsp;|&nbsp; Itens: ${e.qtyTotal}</div>
    <table>
      <thead><tr><th>Item</th><th>Qtd.</th><th>Unitário</th><th>Total</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <div class="modal-total">Total: ${fmt(e.total)}</div>
    <div class="modal-total" style="color: var(--jm-green);">Vendedor (30%): ${fmt(e.vendedor30 || e.total * 0.3)}</div>
  `;
  $('modal').hidden = false;
}
function closeModal() { $('modal').hidden = true; }

/* ============================================================
   ESTATÍSTICAS
   ============================================================ */
function renderStats() {
  const list = getHistory();
  let sold = 0, items = 0, partner = 0, normal = 0;
  list.forEach((e) => {
    sold += e.total;
    items += e.qtyTotal;
    if (e.mode === 'Parceria') partner++; else normal++;
  });
  $('statSold').textContent = fmt(sold);
  $('statItems').textContent = items;
  $('statSales').textContent = list.length;
  $('statPartner').textContent = partner;
  $('statNormal').textContent = normal;
}

/* ============================================================
   EXPORTAÇÕES
   ============================================================ */
function download(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/* JSON */
function exportJson() {
  const data = JSON.stringify(getHistory(), null, 2);
  download('historico_jamaica.json', new Blob([data], { type: 'application/json' }));
}

/* Excel (.xlsx real via SheetJS) */
function exportExcel() {
  const list = getHistory();
  if (list.length === 0) { alert('Histórico vazio.'); return; }
  if (typeof XLSX === 'undefined') { alert('Biblioteca de Excel não carregada.'); return; }
  const rowsData = [];
  list.forEach((e) => {
    e.items.forEach((it) => {
      rowsData.push({
        Data: e.date, Hora: e.time, Modo: e.mode,
        Item: it.product, Quantidade: it.qty,
        'Valor Unitário': it.unit, 'Total Item': it.total,
        'Total Venda': e.total,
      });
    });
  });
  const ws = XLSX.utils.json_to_sheet(rowsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Histórico');
  XLSX.writeFile(wb, 'historico_jamaica.xlsx');
}

/* PDF (via window.print + @media print) */
function exportPdf() {
  const list = getHistory();
  if (list.length === 0) { alert('Histórico vazio.'); return; }
  let rowsHtml = '';
  list.forEach((e) => {
    const itemsStr = e.items.map((it) => `${it.product} x${it.qty}`).join(', ');
    rowsHtml += `<tr><td>${e.date} ${e.time}</td><td>${e.mode}</td><td>${itemsStr}</td><td>${fmt(e.total)}</td></tr>`;
  });
  $('printArea').innerHTML = `
    <h1>Jamaica — Histórico de Vendas</h1>
    <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
    <table>
      <thead><tr><th>Data/Hora</th><th>Modo</th><th>Itens</th><th>Total</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  `;
  window.print();
}

/* ============================================================
   LIMPAR CALCULADORA
   ============================================================ */
function clearCalc() {
  if (!confirm('Zerar todas as quantidades?')) return;
  Object.keys(PRODUCTS).forEach(name => {
    quantities[name] = 0;
  });
  saveQuantities();
  renderRows();
}

/* ============================================================
   INICIALIZAÇÃO / EVENTOS
   ============================================================ */
function init() {
  // Tema salvo
  applyTheme(localStorage.getItem(LS_THEME) || 'dark');

  // Carrega quantidades salvas
  loadQuantities();

  // Relógio (otimizado com requestAnimationFrame)
  requestAnimationFrame(updateClock);

  // Eventos
  $('themeToggle').addEventListener('click', toggleTheme);
  modeToggle.addEventListener('click', toggleMode);
  $('saveCalc').addEventListener('click', saveCalc);
  $('clearCalc').addEventListener('click', clearCalc);
  $('exportJson').addEventListener('click', exportJson);
  $('exportPdf').addEventListener('click', exportPdf);
  $('exportExcel').addEventListener('click', exportExcel);
  $('modalClose').addEventListener('click', closeModal);
  $('modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });

  // Renderiza inicial
  renderRows();
  renderHistory();
  renderStats();
}

document.addEventListener('DOMContentLoaded', init);
