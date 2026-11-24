// Admin main screen: login, tabs, search, table, row actions, CSV export link.
(function () {
  const $ = (id) => document.getElementById(id);
  const t = (k) => window.I18N.t(k);
  const COLUMNS = ['col_id', 'col_name', 'col_position', 'col_field', 'col_end', 'col_status', 'col_days', 'col_actions'];
  const state = { tab: 'current', all: [], q: '' };

  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function toast(message) {
    const box = $('toast');
    box.textContent = message;
    box.classList.remove('hidden');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => box.classList.add('hidden'), 2400);
  }

  // Filtering happens in the browser: the staff list is small and this keeps counts consistent.
  function inTab(m, tab) {
    if (tab === 'archived') return m.archived;
    if (tab === 'attention') return !m.archived && (m.status === 'expiring' || m.status === 'ended');
    return !m.archived;
  }

  function matchesQuery(m, q) {
    if (!q) return true;
    return [m.id, m.fullName, m.position, m.title].filter(Boolean).join(' ').toLowerCase().includes(q);
  }

  function statusLabel(status) {
    return t(`status_${status}`);
  }

  function renderCounts() {
    const cur = state.all.filter((m) => !m.archived);
    const attention = state.all.filter((m) => inTab(m, 'attention'));
    const archived = state.all.filter((m) => m.archived);
    $('cnt-current').textContent = cur.length;
    $('cnt-attention').textContent = attention.length;
    $('cnt-archived').textContent = archived.length;
    $('s-current').textContent = cur.filter((m) => m.status === 'active').length;
    $('s-attention').textContent = attention.length;
    $('s-archived').textContent = archived.length;
  }

  function renderTable() {
    const q = state.q.trim().toLowerCase();
    const rows = state.all.filter((m) => inTab(m, state.tab) && matchesQuery(m, q));
    $('pageTitle').textContent = t(`page_${state.tab}`);

    const head = $('thead');
    head.replaceChildren(...COLUMNS.map((c) => el('th', t(c))));

    const body = $('tbody');
    body.replaceChildren();
    if (rows.length === 0) {
      const tr = el('tr');
      const td = el('td', t('none'), 'empty');
      td.colSpan = COLUMNS.length;
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }

    for (const m of rows) {
      const tr = el('tr');
      tr.appendChild(el('td', m.id));
      tr.appendChild(el('td', [m.title, m.fullName].filter(Boolean).join(' ')));
      tr.appendChild(el('td', m.position || ''));
      tr.appendChild(el('td', m.field ? t(`f_field_${m.field}`) : ''));
      tr.appendChild(el('td', m.endDate));

      const statusCell = el('td');
      statusCell.appendChild(el('span', statusLabel(m.status), `badge b-${m.status}`));
      tr.appendChild(statusCell);

      tr.appendChild(el('td', m.archived ? '' : String(m.daysLeft)));

      const actions = el('td');
      const edit = el('button', t('edit'), 'link');
      edit.type = 'button';
      edit.addEventListener('click', () => window.MemberForm.open(m, reload));
      actions.appendChild(edit);

      const card = el('a', t('open'), 'link');
      card.href = `/card/${encodeURIComponent(m.id)}`;
      card.target = '_blank';
      card.rel = 'noopener';
      actions.appendChild(card);

      const toggle = el('button', m.archived ? t('restore') : t('archive'), 'link');
      toggle.type = 'button';
      toggle.addEventListener('click', () => toggleArchive(m));
      actions.appendChild(toggle);

      tr.appendChild(actions);
      body.appendChild(tr);
    }
  }

  function renderAll() {
    I18N.applyStatic();
    document.querySelectorAll('.nav').forEach((b) => b.classList.toggle('on', b.dataset.tab === state.tab));
    renderCounts();
    renderTable();
  }

  async function toggleArchive(m) {
    try {
      if (m.archived) {
        await window.API.restore(m.id);
        toast(t('restored_ok'));
      } else {
        if (!window.confirm(t('confirm_archive'))) return;
        await window.API.archive(m.id);
        toast(t('archived_ok'));
      }
      await reload();
    } catch (err) {
      handleError(err);
    }
  }

  function handleError(err) {
    if (err.status === 401) {
      toast(t('err_session'));
      showLogin();
    } else {
      toast(t('err_generic'));
    }
  }

  async function reload() {
    const rows = await window.API.list('all', '');
    state.all = rows;
    renderAll();
  }

  function showLogin() {
    $('app').classList.add('hidden');
    $('login').classList.remove('hidden');
    $('lPin').value = '';
    $('lPin').focus();
  }

  function showApp() {
    $('login').classList.add('hidden');
    $('app').classList.remove('hidden');
  }

  async function onLogin(e) {
    e.preventDefault();
    $('loginErr').textContent = '';
    try {
      await window.API.login($('lUser').value.trim(), $('lPin').value.trim());
      showApp();
      await reload();
    } catch (err) {
      if (err.status === 429 || err.message === 'too_many_attempts') $('loginErr').textContent = t('too_many');
      else $('loginErr').textContent = t('err_login');
    }
  }

  async function onLogout() {
    try { await window.API.logout(); } catch (_) { /* session already gone */ }
    state.all = [];
    showLogin();
  }

  async function init() {
    I18N.applyStatic();
    document.querySelectorAll('.nav').forEach((b) => b.addEventListener('click', () => {
      state.tab = b.dataset.tab;
      renderAll();
    }));
    document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => I18N.setLang(b.dataset.lang)));
    document.addEventListener('i18n:change', renderAll);

    $('loginForm').addEventListener('submit', onLogin);
    $('btnLogout').addEventListener('click', onLogout);
    $('btnAdd').addEventListener('click', () => window.MemberForm.open(null, reload));
    $('search').addEventListener('input', (e) => { state.q = e.target.value; renderTable(); });

    try {
      await reload();
      showApp();
    } catch (err) {
      showLogin();
    }
  }

  window.App = { toast };
  document.addEventListener('DOMContentLoaded', init);
})();
