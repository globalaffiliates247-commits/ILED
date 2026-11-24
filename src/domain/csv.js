'use strict';

// CSV for Excel / Google Sheets. Cells that start with = + - @ or a tab are prefixed
// with an apostrophe so a spreadsheet never runs them as formulas (CSV injection).
const FORMULA_START = /^[=+\-@\t\r]/;

function cell(value) {
  if (value === null || value === undefined) return '';
  let text = String(value);
  let escaped = false;
  if (FORMULA_START.test(text)) {
    text = `'${text}`;
    escaped = true;
  }
  if (escaped || /[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

// rows: array of plain objects; columns: array of keys in output order.
// Starts with a UTF-8 BOM so Excel shows Vietnamese characters correctly.
function toCsv(rows, columns) {
  const header = columns.map(cell).join(',');
  const body = rows.map((row) => columns.map((c) => cell(row[c])).join(','));
  return '﻿' + [header, ...body].join('\r\n') + '\r\n';
}

module.exports = { toCsv, cell };
