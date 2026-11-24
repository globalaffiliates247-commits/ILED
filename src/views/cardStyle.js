'use strict';

// Styles for the phone e-card. Colours follow the printed ILED card:
// deep maroon background, gold trim and gold text, gold band with the address at the bottom.
const CARD_CSS = `
:root{--mar:#6e0f1f;--mar-2:#8c1a2c;--gold:#f0c95c;--gold-2:#f7dc86;--ink:#2b1a10}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:#ece7e4;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1d2433;font-size:14px}
.page{max-width:400px;margin:0 auto;padding:14px 14px 28px}
.topbar{display:flex;justify-content:flex-end;gap:10px;font-size:12px;margin-bottom:10px}
.topbar a{color:#6b7385;text-decoration:none}
.topbar a.on{color:var(--mar);font-weight:700}

.ec-radio{position:absolute;opacity:0;pointer-events:none}
.tabs{display:flex;justify-content:center;gap:8px;margin-bottom:12px}
.tabs label{padding:6px 16px;border-radius:999px;font-size:13px;background:#fff;color:#6b7385;cursor:pointer;border:1px solid #d9d4d1}
#face-front:checked ~ .tabs label[for="face-front"],
#face-back:checked ~ .tabs label[for="face-back"]{background:var(--mar);color:#fff;border-color:var(--mar)}

.ec{position:relative;border-radius:18px;overflow:hidden;color:#fff;background:linear-gradient(170deg,var(--mar-2) 0%,var(--mar) 55%,#4f0a16 100%);box-shadow:0 14px 34px rgba(80,8,20,.35)}
.ec-face{position:relative;display:flex;flex-direction:column;min-height:580px;padding:24px 20px 0}
.ec-face::before,.ec-face::after{content:"";position:absolute;top:10px;width:34px;height:34px;border:2px solid var(--gold);pointer-events:none}
.ec-face::before{left:10px;border-right:0;border-bottom:0}
.ec-face::after{right:10px;border-left:0;border-bottom:0}
.ec-back{display:none}
#face-back:checked ~ .ec .ec-back{display:flex}
#face-back:checked ~ .ec .ec-front{display:none}

.ec-brand{display:flex;align-items:center;gap:12px}
.ec-seal{width:60px;height:60px;flex:none;border-radius:50%;background:#fff;padding:3px}
.ec-org{font-size:12.5px;font-weight:800;line-height:1.35;color:#fff}
.ec-org small{display:block;margin-top:4px;font-size:9px;font-weight:600;letter-spacing:.5px;color:var(--gold)}
.ec-rule{height:1px;background:var(--gold);margin:18px 0 20px;opacity:.9}

.ec-person{display:flex;align-items:center;gap:14px}
.ec-avatar{width:88px;height:88px;flex:none;border-radius:50%;object-fit:cover;border:3px solid var(--gold);background:#fff}
.ec-initials{display:flex;align-items:center;justify-content:center;color:var(--mar);font-size:28px;font-weight:800}
.ec-who{min-width:0}
.ec-pos{color:var(--gold);font-size:19px;font-weight:800;line-height:1.25}
.ec-name{margin-top:6px;font-size:16px;font-weight:700;overflow-wrap:anywhere}

.ec-rows{list-style:none;margin:22px 0 0;padding:0}
.ec-rows li{display:flex;align-items:center;gap:12px;padding:10px 0;font-size:14px;font-weight:600;border-bottom:1px solid rgba(240,201,92,.28);overflow-wrap:anywhere}
.ec-rows li:last-child{border-bottom:0}
.ec-ico{width:20px;height:20px;flex:none;color:var(--gold)}
.ec-rows a{color:#fff;text-decoration:none}

.ec-qr{display:flex;flex-direction:column;align-items:center;margin:20px 0 22px}
.ec-qrbox{background:#fff;border-radius:14px;padding:10px;border:2px solid var(--gold)}
.ec-qrbox svg{display:block;width:150px;height:150px}
.ec-qrtxt{margin-top:8px;font-size:12px;color:var(--gold-2)}

.nw{white-space:nowrap}
.ec-band{margin:auto -20px 0;padding:14px 18px;text-align:center;font-size:12px;font-weight:700;line-height:1.45;color:var(--ink);background:linear-gradient(var(--gold-2),var(--gold));border-top:4px solid var(--gold)}

.ec-motto{color:var(--gold);font-size:15px;font-weight:800;line-height:1.35;padding-top:34px}
.ec-motto-sub{margin-top:6px;color:var(--gold-2);font-size:14px;font-weight:700}
.ec-seal-lg{display:block;width:230px;height:230px;margin:30px auto;border-radius:50%;background:#fff;padding:6px}

.ec-btn{display:block;margin-top:16px;padding:13px 0;border-radius:12px;background:var(--mar);color:#fff;text-align:center;font-weight:700;text-decoration:none}
.ec-hint{margin-top:10px;text-align:center;font-size:12px;color:#6b7385}
`;

module.exports = { CARD_CSS };
