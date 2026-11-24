// Add / edit modal. Exposes window.MemberForm.open(member | null, onSaved).
(function () {
  const $ = (id) => document.getElementById(id);
  const t = (k) => window.I18N.t(k);
  let current = null;   // member being edited, or null when adding
  let onSavedCb = null;

  // Contract end = start + 1 year − 1 day (same rule as the server).
  function previewEnd(start) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) return '';
    const d = new Date(`${start}T00:00:00Z`);
    d.setUTCFullYear(d.getUTCFullYear() + 1);
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  }

  function fill(m) {
    $('fTitle').value = m?.title || '';
    $('fName').value = m?.fullName || '';
    $('fPosition').value = m?.position || '';
    $('fId').value = m?.id || t('f_id_hint');
    $('fStart').value = m?.startDate || '';
    $('fEnd').value = m?.endDate || previewEnd(m?.startDate || '') || '';
    $('fField').value = m?.field || '';
    $('fEmail').value = m?.email || '';
    $('fPhone').value = m?.phone || '';
    $('fNotes').value = m?.notes || '';
    $('fAvatar').value = m?.avatarUrl || '';
    $('fAttachName').value = m?.attachmentName || '';
    $('fAttachUrl').value = m?.attachmentUrl || '';
  }

  function showShare(m) {
    const box = $('shareBox');
    if (!m) { box.classList.add('hidden'); return; }
    const base = window.location.origin;
    box.classList.remove('hidden');
    $('qrImg').src = `/c/${encodeURIComponent(m.id)}/qr.svg`;
    $('shareUrl').value = `${base}/c/${m.id}`;
    $('openCard').href = `/card/${encodeURIComponent(m.id)}`;
    $('openPub').href = `/c/${encodeURIComponent(m.id)}`;
    $('scanInfo').textContent = `${m.scanCount} ${t('scans')}`;
  }

  function payload() {
    const nn = (s) => (s.trim() === '' ? null : s.trim());
    return {
      title: nn($('fTitle').value),
      fullName: $('fName').value.trim(),
      position: nn($('fPosition').value),
      startDate: $('fStart').value,
      field: nn($('fField').value),
      email: nn($('fEmail').value),
      phone: nn($('fPhone').value),
      notes: nn($('fNotes').value),
      avatarUrl: nn($('fAvatar').value),
      attachmentName: nn($('fAttachName').value),
      attachmentUrl: nn($('fAttachUrl').value),
    };
  }

  function open(member, onSaved) {
    current = member || null;
    onSavedCb = onSaved || null;
    $('mTitle').textContent = t(current ? 'title_edit' : 'title_add');
    $('formErr').textContent = '';
    fill(current);
    showShare(current);
    $('modalBg').classList.remove('hidden');
    $('fName').focus();
  }

  function close() {
    $('modalBg').classList.add('hidden');
    current = null;
  }

  async function submit(e) {
    e.preventDefault();
    const body = payload();
    $('formErr').textContent = '';
    if (!body.fullName || !body.startDate) {
      $('formErr').textContent = t('err_required');
      return;
    }
    $('btnSave').disabled = true;
    try {
      const saved = current
        ? await window.API.update(current.id, body)
        : await window.API.create(body);
      close();
      if (onSavedCb) onSavedCb(saved);
    } catch (err) {
      if (err.status === 401) $('formErr').textContent = t('err_session');
      else if (err.status === 400) $('formErr').textContent = t('err_required');
      else $('formErr').textContent = t('err_generic');
    } finally {
      $('btnSave').disabled = false;
    }
  }

  function copyShare() {
    const value = $('shareUrl').value;
    if (!value) return;
    navigator.clipboard.writeText(value).then(
      () => window.App && window.App.toast(t('copied')),
      () => { $('shareUrl').select(); document.execCommand('copy'); }
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('form').addEventListener('submit', submit);
    $('btnCancel').addEventListener('click', close);
    $('fStart').addEventListener('input', () => { $('fEnd').value = previewEnd($('fStart').value); });
    $('copyBtn').addEventListener('click', copyShare);
    $('modalBg').addEventListener('click', (e) => { if (e.target === $('modalBg')) close(); });
  });

  window.MemberForm = { open, close };
})();
