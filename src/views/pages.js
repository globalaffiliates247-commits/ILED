'use strict';

const { t, pick } = require('./i18n');

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const CSS = `
*{box-sizing:border-box}
body{margin:0;min-height:100vh;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f5f6f8;color:#1d2433;font-size:14px}
.wrap{max-width:420px;margin:0 auto;padding-bottom:24px}
.head{background:#C8102E;padding:18px 16px 40px;display:flex;justify-content:space-between;align-items:center}
.seal{width:56px;height:56px;border-radius:50%;background:#fff;padding:3px;object-fit:contain}
.lang{font-size:12px}.lang a{color:#fff;opacity:.7;text-decoration:none}.lang a.on{opacity:1;font-weight:700}
.body{padding:0 14px;margin-top:-28px}
.card{background:#fff;border-radius:18px;padding:20px;box-shadow:0 6px 18px rgba(15,23,42,.08);border-top:4px solid #C8102E}
.t{color:#6b7385;font-size:13px}.n{margin:4px 0 2px;font-size:22px}.p{color:#6b7385;margin-bottom:12px}
.row{display:flex;justify-content:space-between;padding:9px 0;border-top:1px solid #ececee;gap:12px}.row span{color:#6b7385}
.badge{display:inline-block;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:700;margin-top:14px;background:#C8102E;color:#fff}
.badge.off{background:#e5e7eb;color:#374151}
.qr{background:#fff;border-radius:18px;padding:16px;margin-top:12px;display:flex;align-items:center;gap:14px;box-shadow:0 6px 18px rgba(15,23,42,.06)}
.qrbox{background:#fff;padding:6px;border-radius:10px;flex:none}.qrbox svg{display:block;width:96px;height:96px}
.qr .tt{font-size:13px;font-weight:700}.qr .ss{font-size:12px;color:#6b7385;margin-top:4px;line-height:1.45}
.hint{font-size:12px;color:#6b7385;margin:14px 4px 0;line-height:1.5}
.vcard{margin-top:24px;border-radius:22px;background:linear-gradient(160deg,#C8102E 0%,#7F0B1F 100%);color:#fff;padding:24px 20px 22px;text-align:center;box-shadow:0 12px 30px rgba(127,11,31,.35)}
.vcard .seal{width:64px;height:64px;margin:0 auto 14px;display:block}
.vcard .t{color:#fff;opacity:.85}.vcard .n{font-size:22px;font-weight:700}.vcard .p{color:#fff;opacity:.9;margin-bottom:16px}
.vcard .qrbox{display:inline-block}.vcard .qrbox svg{width:190px;height:190px}
.vcard .id{font-size:12px;opacity:.85;margin-top:12px;letter-spacing:.6px}
.vcard .hint{color:#fff;opacity:.8;margin:4px 0 16px}
.vcard a.btn{background:#fff;color:#C8102E;border-radius:10px;padding:10px 30px;font-weight:700;text-decoration:none;display:inline-block}
.empty{text-align:center;padding:40px 20px;color:#6b7385}
`;

function shell(lang, title, inner) {
  return `<!DOCTYPE html><html lang="${pick(lang)}"><head><meta charset="UTF-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<meta name="robots" content="noindex,nofollow"><title>${esc(title)}</title>` +
    `<style>${CSS}</style></head><body>${inner}</body></html>`;
}

function header(lang, path) {
  const links = ['vi', 'en'].map((l) =>
    `<a href="${esc(path)}?lang=${l}" class="${pick(lang) === l ? 'on' : ''}">${l.toUpperCase()}</a>`).join(' · ');
  return `<div class="head"><img class="seal" src="/assets/iled-logo.png" alt="ILED"><div class="lang">${links}</div></div>`;
}

function layout(lang, path, content) {
  return `<div class="wrap">${header(lang, path)}<div class="body">${content}</div></div>`;
}

function publicPage(p, qrSvg, lang, path) {
  const s = t(lang);
  const content = `
    <div class="card">
      <div class="t">${esc(p.title)}</div>
      <h1 class="n">${esc(p.fullName)}</h1>
      <div class="p">${esc(p.position)}</div>
      <div class="row"><span>${s.id}</span><b>${esc(p.id)}</b></div>
      <div class="row"><span>${s.since}</span><b>${esc(p.startDate)}</b></div>
      <div class="row"><span>${s.until}</span><b>${esc(p.endDate)}</b></div>
      <span class="badge ${p.collaborating ? '' : 'off'}">${p.collaborating ? s.collab : s.not_collab}</span>
    </div>
    <div class="qr"><div class="qrbox">${qrSvg}</div>
      <div><div class="tt">${s.qr_title}</div><div class="ss">${s.qr_desc}</div></div>
    </div>
    <p class="hint">${s.footer}</p>`;
  return shell(lang, `${p.fullName} · ILED`, layout(lang, path, content));
}

function cardPage(p, qrSvg, lang, path) {
  const s = t(lang);
  const content = `
    <div class="vcard">
      <img class="seal" src="/assets/iled-logo.png" alt="ILED">
      <div class="t">${esc(p.title)}</div>
      <div class="n">${esc(p.fullName)}</div>
      <div class="p">${esc(p.position)}</div>
      <div class="qrbox">${qrSvg}</div>
      <div class="id">${esc(p.id)}</div>
      <div class="hint">${s.card_hint}</div>
      <a class="btn" href="/c/${encodeURIComponent(p.id)}?lang=${pick(lang)}">${s.view}</a>
    </div>`;
  return shell(lang, `${p.fullName} · ILED`, `<div class="wrap">${header(lang, path)}<div class="body">${content}</div></div>`);
}

function notFoundPage(lang, path) {
  return shell(lang, 'ILED', layout(lang, path, `<div class="card empty">${t(lang).notfound}</div>`));
}

module.exports = { publicPage, cardPage, notFoundPage, esc };
