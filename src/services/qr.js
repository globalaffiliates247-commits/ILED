'use strict';

const QRCode = require('qrcode');
const config = require('../config');

// The QR encodes the static public link for a member.
const publicUrl = (id) => `${config.publicBaseUrl}/c/${encodeURIComponent(id)}`;

// Red (ILED) QR as an SVG string, sharp at any size.
const renderQrSvg = (text) =>
  QRCode.toString(text, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#C8102E', light: '#FFFFFF' },
  });

module.exports = { publicUrl, renderQrSvg };
