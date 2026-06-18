// Building QR — hero image generator.
// Renders a QR-like matrix as an isometric city skyline (dark module = building,
// light module = street). Deterministic: same seed -> same skyline.
//
//   node tools/gen-hero.mjs
//
// Output: docs/assets/hero.svg
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../docs/assets/hero.svg');

// ---- deterministic PRNG (mulberry32) ---------------------------------------
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(0x5a4b1209);

// ---- color helpers ----------------------------------------------------------
const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = (r, g, b) =>
  '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
// amt > 0 -> toward white, amt < 0 -> toward black
const shade = (hex, amt) => {
  const [r, g, b] = hexToRgb(hex);
  const t = amt < 0 ? 0 : 255;
  const k = Math.abs(amt);
  return rgbToHex(r + (t - r) * k, g + (t - g) * k, b + (t - b) * k);
};

// ---- build a QR-like matrix (21x21, QR v1 size) ----------------------------
const N = 21;
const m = Array.from({ length: N }, () => Array(N).fill(0)); // 0 light, 1 dark
const reserved = Array.from({ length: N }, () => Array(N).fill(false));

function placeFinder(r0, c0) {
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      const dark =
        i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4);
      m[r0 + i][c0 + j] = dark ? 1 : 0;
    }
  }
  // reserve finder + 1-module separator ring
  for (let i = -1; i <= 7; i++)
    for (let j = -1; j <= 7; j++) {
      const r = r0 + i, c = c0 + j;
      if (r >= 0 && r < N && c >= 0 && c < N) reserved[r][c] = true;
    }
}
placeFinder(0, 0);
placeFinder(0, N - 7);
placeFinder(N - 7, 0);

// timing patterns
for (let k = 8; k < N - 8; k++) {
  m[6][k] = k % 2 === 0 ? 1 : 0;
  m[k][6] = k % 2 === 0 ? 1 : 0;
  reserved[6][k] = true;
  reserved[k][6] = true;
}

// data fill (deterministic noise)
for (let r = 0; r < N; r++)
  for (let c = 0; c < N; c++)
    if (!reserved[r][c]) m[r][c] = rand() < 0.46 ? 1 : 0;

// ---- height + color per cell ------------------------------------------------
const cx = (N - 1) / 2;
const cy = (N - 1) / 2;
const maxD = Math.hypot(cx, cy);
const COOL = ['#3b5bdb', '#1c7ed6', '#0ca678', '#7048e8', '#1098ad', '#4263eb', '#1971c2'];
const AMBER = '#f59f00';

function isFinder(r, c) {
  const inBox = (r0, c0) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
  return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
}

function cellInfo(r, c) {
  if (m[r][c] === 0) return null; // street
  if (isFinder(r, c)) return { h: 3, base: AMBER, lit: true };
  // timing modules: short
  if (r === 6 || c === 6) return { h: 1, base: '#495bd6', lit: false };
  const centerBoost = 1 - Math.hypot(c - cx, r - cy) / maxD; // 0..1
  const h = 1 + Math.round((rand() * 0.55 + centerBoost * 0.6) * 4); // 1..~5
  const lit = rand() < 0.1;
  const base = lit ? AMBER : COOL[(Math.floor(rand() * COOL.length)) % COOL.length];
  return { h: Math.max(1, Math.min(5, h)), base, lit };
}

// ---- isometric projection ---------------------------------------------------
const HW = 16; // tile half width
const HH = 8; // tile half height
const UNIT = 14; // px per height unit
const proj = (gx, gy, e = 0) => [(gx - gy) * HW, (gx + gy) * HH - e];

const parts = [];
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
const track = (p) => {
  if (p[0] < minX) minX = p[0];
  if (p[0] > maxX) maxX = p[0];
  if (p[1] < minY) minY = p[1];
  if (p[1] > maxY) maxY = p[1];
};
const poly = (pts, fill, stroke, sw = 0.6) => {
  pts.forEach(track);
  parts.push(
    `<polygon points="${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}" fill="${fill}"${
      stroke ? ` stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"` : ''
    }/>`
  );
};

// back-to-front: smaller (r+c) drawn first
const order = [];
for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) order.push([r, c]);
order.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));

const STREET = '#241d52';
const STREET_STROKE = '#1a1442';

for (const [r, c] of order) {
  const info = cellInfo(r, c);
  // corners in grid space: col = c (x), row = r (y)
  const A = [c, r], B = [c + 1, r], C = [c + 1, r + 1], D = [c, r + 1];
  if (!info) {
    // street tile (flat diamond)
    poly([proj(...A), proj(...B), proj(...C), proj(...D)], STREET, STREET_STROKE, 0.4);
    continue;
  }
  const E = info.h * UNIT;
  const top = shade(info.base, info.lit ? 0.45 : 0.3);
  const right = shade(info.base, info.lit ? 0.08 : -0.04);
  const left = shade(info.base, -0.34);
  const edge = shade(info.base, -0.5);
  // top face
  poly([proj(A[0], A[1], E), proj(B[0], B[1], E), proj(C[0], C[1], E), proj(D[0], D[1], E)], top, edge, 0.5);
  // right face (B-C edge)
  poly([proj(...B), proj(...C), proj(C[0], C[1], E), proj(B[0], B[1], E)], right, edge, 0.5);
  // left face (D-C edge)
  poly([proj(...D), proj(...C), proj(C[0], C[1], E), proj(D[0], D[1], E)], left, edge, 0.5);
}

// ---- assemble SVG -----------------------------------------------------------
const pad = 64;
const vbX = minX - pad;
const vbY = minY - pad;
const vbW = maxX - minX + pad * 2;
const vbH = maxY - minY + pad * 2;
const cxScene = (minX + maxX) / 2;
const groundY = maxY + 10;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX.toFixed(1)} ${vbY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}" role="img" aria-label="Building QR — a QR code rendered as an isometric city skyline">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#120b30"/>
      <stop offset="0.55" stop-color="#1d1450"/>
      <stop offset="1" stop-color="#321a6e"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.32" r="0.6">
      <stop offset="0" stop-color="#ff8fc7" stop-opacity="0.42"/>
      <stop offset="0.5" stop-color="#ff8fc7" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#ff8fc7" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="shadow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#000000" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="${vbX.toFixed(1)}" y="${vbY.toFixed(1)}" width="${vbW.toFixed(1)}" height="${vbH.toFixed(1)}" fill="url(#sky)"/>
  <rect x="${vbX.toFixed(1)}" y="${vbY.toFixed(1)}" width="${vbW.toFixed(1)}" height="${vbH.toFixed(1)}" fill="url(#glow)"/>
  <ellipse cx="${cxScene.toFixed(1)}" cy="${groundY.toFixed(1)}" rx="${(vbW * 0.42).toFixed(1)}" ry="${(HH * 9).toFixed(1)}" fill="url(#shadow)"/>
  ${parts.join('\n  ')}
</svg>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, svg, 'utf8');
console.log(`hero.svg written: ${OUT}`);
console.log(`viewBox ${vbW.toFixed(0)}x${vbH.toFixed(0)}, ${parts.length} polygons`);
