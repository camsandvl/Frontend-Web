// ── CSV Export ────────────────────────────────────────────────────────────────
// RFC 4180 compliant. No libraries.

export function exportCSV(series) {
  const headers = ['id', 'title', 'genre', 'status', 'rating', 'image_url', 'created_at'];

  const escape = val => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const rows = [
    headers.join(','),
    ...series.map(s => headers.map(h => escape(s[h])).join(','))
  ];

  downloadFile(rows.join('\r\n'), 'series.csv', 'text/csv;charset=utf-8;');
}

// ── Excel Export (.xlsx via SpreadsheetML + manual ZIP) ───────────────────────
// Builds a real .xlsx file — a ZIP archive containing OpenXML files.
// Opens correctly in Excel, LibreOffice, and Google Sheets.
// Zero libraries — pure JS with Uint8Array and CRC32.

export function exportXLSX(series) {
  const headers = ['id', 'title', 'genre', 'status', 'rating', 'image_url', 'created_at'];

  const esc = val => {
    if (val === null || val === undefined) return '';
    return String(val)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  const buildRow = (values, rowIndex) => {
    const cells = values.map((val, colIndex) => {
      const col = String.fromCharCode(65 + colIndex);
      const ref = `${col}${rowIndex}`;
      const v   = val === null || val === undefined ? '' : val;
      const isNum = typeof v === 'number' || (v !== '' && !isNaN(parseFloat(v)) && isFinite(v));
      return isNum
        ? `<c r="${ref}"><v>${v}</v></c>`
        : `<c r="${ref}" t="inlineStr"><is><t>${esc(v)}</t></is></c>`;
    });
    return `<row r="${rowIndex}">${cells.join('')}</row>`;
  };

  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${buildRow(headers, 1)}
    ${series.map((s, i) => buildRow(headers.map(h => s[h] ?? ''), i + 2)).join('\n    ')}
  </sheetData>
</worksheet>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Series" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

  const wbRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"
    Target="worksheets/sheet1.xml"/>
</Relationships>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"  ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml"
    ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml"
    ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
    Target="xl/workbook.xml"/>
</Relationships>`;

  buildZipAndDownload({
    '[Content_Types].xml':        contentTypes,
    '_rels/.rels':                rootRels,
    'xl/workbook.xml':            workbook,
    'xl/_rels/workbook.xml.rels': wbRels,
    'xl/worksheets/sheet1.xml':   sheet,
  }, 'series.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

// ── Minimal ZIP builder ───────────────────────────────────────────────────────

function buildZipAndDownload(files, filename, mimeType) {
  const enc    = new TextEncoder();
  const locals = [];
  const cents  = [];
  let   offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBytes    = enc.encode(name);
    const dataBytes    = enc.encode(content);
    const crc          = crc32(dataBytes);
    const size         = dataBytes.length;

    const local = new Uint8Array(30 + nameBytes.length + size);
    const lv    = new DataView(local.buffer);
    lv.setUint32(0,  0x04034b50, true);
    lv.setUint16(4,  20,         true);
    lv.setUint16(6,  0,          true);
    lv.setUint16(8,  0,          true);
    lv.setUint16(10, 0,          true);
    lv.setUint16(12, 0,          true);
    lv.setUint32(14, crc,        true);
    lv.setUint32(18, size,       true);
    lv.setUint32(22, size,       true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0,          true);
    local.set(nameBytes, 30);
    local.set(dataBytes, 30 + nameBytes.length);
    locals.push(local);

    const cent = new Uint8Array(46 + nameBytes.length);
    const cv   = new DataView(cent.buffer);
    cv.setUint32(0,  0x02014b50,       true);
    cv.setUint16(4,  20,               true);
    cv.setUint16(6,  20,               true);
    cv.setUint16(8,  0,                true);
    cv.setUint16(10, 0,                true);
    cv.setUint16(12, 0,                true);
    cv.setUint16(14, 0,                true);
    cv.setUint32(16, crc,              true);
    cv.setUint32(20, size,             true);
    cv.setUint32(24, size,             true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0,                true);
    cv.setUint16(32, 0,                true);
    cv.setUint16(34, 0,                true);
    cv.setUint16(36, 0,                true);
    cv.setUint32(38, 0,                true);
    cv.setUint32(42, offset,           true);
    cent.set(nameBytes, 46);
    cents.push(cent);

    offset += local.length;
  }

  const centralDir = concat(cents);
  const eocd       = new Uint8Array(22);
  const ev         = new DataView(eocd.buffer);
  ev.setUint32(0,  0x06054b50,          true);
  ev.setUint16(4,  0,                   true);
  ev.setUint16(6,  0,                   true);
  ev.setUint16(8,  cents.length,        true);
  ev.setUint16(10, cents.length,        true);
  ev.setUint32(12, centralDir.length,   true);
  ev.setUint32(16, offset,              true);
  ev.setUint16(20, 0,                   true);

  downloadFile(concat([...locals, centralDir, eocd]), filename, mimeType);
}

function concat(arrays) {
  const total  = arrays.reduce((n, a) => n + a.length, 0);
  const out    = new Uint8Array(total);
  let   pos    = 0;
  for (const a of arrays) { out.set(a, pos); pos += a.length; }
  return out;
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(bytes) {
  let crc = 0xFFFFFFFF;
  for (const b of bytes) crc = CRC_TABLE[(crc ^ b) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function downloadFile(content, filename, mimeType) {
  const blob = content instanceof Uint8Array
    ? new Blob([content], { type: mimeType })
    : new Blob(['\uFEFF' + content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
