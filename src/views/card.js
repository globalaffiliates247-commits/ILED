'use strict';

// Phone e-card: front shows the person, back shows the national motto and seal,
// like the two sides of the printed card. Switching sides uses radio buttons, so no JavaScript is needed.
const { t, pick } = require('./i18n');
const { INSTITUTE } = require('./institute');
const { CARD_CSS } = require('./cardStyle');
const { esc } = require('./pages');

const ICON = {
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.2 1.6-2 3-2s2.4.8 3 2M14 10h4M14 14h3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
};

const icon = (name) =>
  `<svg class="ec-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name]}</svg>`;

// "Lê Minh Hoàng" -> "LH"; a single word gives one letter.
function initials(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = Array.from(words[0])[0];
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : '';
  return (first + last).toUpperCase();
}

function avatarHtml(p) {
  // Only https links are accepted by the admin API, but escape and re-check here as well.
  if (p.avatarUrl && /^https:\/\//i.test(p.avatarUrl)) {
    return `<img class="ec-avatar" src="${esc(p.avatarUrl)}" alt="">`;
  }
  return `<div class="ec-avatar ec-initials" aria-hidden="true">${esc(initials(p.fullName))}</div>`;
}

function frontFace(p, qrSvg, s) {
  const name = [p.title, p.fullName].filter(Boolean).join(' ');
  return `
    <div class="ec-face ec-front">
      <div class="ec-brand">
        <img class="ec-seal" src="/assets/iled-logo.png" alt="ILED">
        <div class="ec-org">${esc(INSTITUTE.nameVi)}<small>${esc(INSTITUTE.nameEn)}</small></div>
      </div>
      <div class="ec-rule"></div>
      <div class="ec-person">
        ${avatarHtml(p)}
        <div class="ec-who">
          <div class="ec-pos">${esc(p.position)}</div>
          <div class="ec-name">${esc(name)}</div>
        </div>
      </div>
      <ul class="ec-rows">
        <li>${icon('id')}<span>${esc(p.id)}</span></li>
        <li>${icon('calendar')}<span>${esc(s.until)}: ${esc(p.endDate)}</span></li>
        ${p.phone ? `<li>${icon('phone')}<a href="tel:${esc(p.phone)}">${esc(p.phone)}</a></li>` : ''}
        ${p.email ? `<li>${icon('mail')}<a href="mailto:${esc(p.email)}">${esc(p.email)}</a></li>` : ''}
        <li>${icon('globe')}<a href="${esc(INSTITUTE.website)}" rel="noopener">${esc(INSTITUTE.website.replace(/^https?:\/\//, ''))}</a></li>
      </ul>
      <div class="ec-qr">
        <div class="ec-qrbox">${qrSvg}</div>
        <div class="ec-qrtxt">${esc(s.card_hint)}</div>
      </div>
      <div class="ec-band">${esc(INSTITUTE.address)}</div>
    </div>`;
}

function backFace(s) {
  return `
    <div class="ec-face ec-back">
      <div class="ec-motto">${esc(s.card_motto)}</div>
      <div class="ec-motto-sub">${esc(s.card_motto_sub)}</div>
      <img class="ec-seal-lg" src="/assets/iled-logo.png" alt="ILED">
      <div class="ec-band">${esc(INSTITUTE.address)}</div>
    </div>`;
}

function cardPage(p, qrSvg, lang, path) {
  const s = t(lang);
  const lang_ = pick(lang);
  const langLinks = ['vi', 'en'].map((l) =>
    `<a href="${esc(path)}?lang=${l}" class="${lang_ === l ? 'on' : ''}">${l.toUpperCase()}</a>`).join('');

  const html = `<!DOCTYPE html><html lang="${lang_}"><head><meta charset="UTF-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<meta name="robots" content="noindex,nofollow"><title>${esc(p.fullName)} · ILED</title>` +
    `<style>${CARD_CSS}</style></head><body>` +
    `<main class="page">
      <div class="topbar">${langLinks}</div>
      <input type="radio" name="face" id="face-front" class="ec-radio" checked>
      <input type="radio" name="face" id="face-back" class="ec-radio">
      <div class="tabs">
        <label for="face-front">${esc(s.card_front)}</label>
        <label for="face-back">${esc(s.card_back)}</label>
      </div>
      <div class="ec">${frontFace(p, qrSvg, s)}${backFace(s)}</div>
      <a class="ec-btn" href="/c/${encodeURIComponent(p.id)}?lang=${lang_}">${esc(s.card_open_profile)}</a>
    </main></body></html>`;
  return html;
}

module.exports = { cardPage, initials };
