/**
 * Line-art geometry for her services (pure SVG path data, computed at build time):
 *  · lashSet(style)  — an upper lid with extensions placed the way each set is built:
 *      classic 1 per lash · hybrid alternates 1 and a 3-fan · Brazilian a 2-strand "Y" · Russian 5-fans.
 *  · browMap()       — a brow shape built from hair strokes plus the start / arch / tail mapping lines.
 *  · eyeLashes()     — the lash fringe for the opening eye and the hero's lid frame.
 * These are illustrations of the techniques, never presented as photographs of her work.
 */
type Pt = [number, number];
const q = (a: Pt, c: Pt, b: Pt, t: number): Pt => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t ** 2 * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t ** 2 * b[1],
];
const dq = (a: Pt, c: Pt, b: Pt, t: number): Pt => [2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), 2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1])];
const f = (n: number) => n.toFixed(1);

/** one curled strand from base p along angle `ang` (radians, screen coords), length len */
function strand(p: Pt, ang: number, len: number, curl: number) {
  const dir: Pt = [Math.cos(ang), Math.sin(ang)];
  const perp: Pt = [-dir[1], dir[0]];
  const tip: Pt = [p[0] + dir[0] * len + perp[0] * len * curl, p[1] + dir[1] * len + perp[1] * len * curl];
  const c: Pt = [p[0] + dir[0] * len * 0.55, p[1] + dir[1] * len * 0.55];
  return `M${f(p[0])} ${f(p[1])}Q${f(c[0])} ${f(c[1])} ${f(tip[0])} ${f(tip[1])}`;
}

/** lashes along a quadratic lid a→c→b, pointing away from `inside` (the side the eye is on) */
function fringe(a: Pt, c: Pt, b: Pt, n: number, perPoint: (i: number) => number[], lenAt: (t: number) => number, curl = 0.22, from = 0.05, to = 0.97, up = false) {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = from + ((to - from) * i) / (n - 1);
    const p = q(a, c, b, t);
    const d = dq(a, c, b, t);
    // normal to the lid: down for a closed eye (lash-map style), up for an open eye
    let ang = Math.atan2(-d[0], d[1]) + (up ? 0 : Math.PI);
    ang += (t - 0.5) * 0.5; // splay: inner lashes lean in, outer lashes lean out
    for (const off of perPoint(i)) out.push(strand(p, ang + off, lenAt(t) * (1 - Math.abs(off) * 0.9), curl));
  }
  return out;
}

export type LashStyle = 'classic' | 'hybrid' | 'brazilian' | 'russian';
const LID = { a: [18, 104] as Pt, c: [150, 8] as Pt, b: [292, 92] as Pt };
const taper = (t: number) => 18 + 36 * Math.sin(Math.min(1, t * 1.15) * Math.PI * 0.62);
export function lashSet(style: LashStyle) {
  const deg = (d: number) => (d * Math.PI) / 180;
  const fan = (k: number, spread: number) => Array.from({ length: k }, (_, j) => deg(-spread / 2 + (spread * j) / (k - 1)));
  const per: Record<LashStyle, (i: number) => number[]> = {
    classic: () => [0],
    hybrid: (i) => (i % 2 ? fan(3, 16) : [0]),
    brazilian: () => fan(2, 12),
    russian: () => fan(5, 26),
  };
  const n = style === 'classic' ? 24 : style === 'hybrid' ? 24 : 26;
  return {
    viewBox: '0 0 310 150',
    lid: `M${LID.a.join(' ')}Q${LID.c.join(' ')} ${LID.b.join(' ')}`,
    lower: 'M30 112Q150 150 282 100',
    lashes: fringe(LID.a, LID.c, LID.b, n, per[style], taper),
    weight: style === 'russian' ? 0.55 : style === 'brazilian' ? 0.75 : style === 'hybrid' ? 0.85 : 1.1,
  };
}

/** Brow: hair strokes along a tapering centre line + the three mapping lines. */
export function browMap() {
  const s: Pt = [58, 92], c: Pt = [175, 30], e: Pt = [270, 74];
  const hairs: string[] = [];
  const N = 96;
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const p = q(s, c, e, t * 0.98);
    const thick = t < 0.6 ? 22 - t * 16 : 12.4 * (1 - (t - 0.6) / 0.4) + 1.4;
    // hairs grow up at the front of the brow and lie down toward the tail
    const ang = -1.45 + 1.2 * Math.pow(t, 0.75);
    for (let k = 0; k < 2; k++) {
      const j = rnd();
      const base: Pt = [p[0] + (k - 0.5) * 2.4 + (rnd() - 0.5), p[1] + thick * (0.42 - j * 0.25)];
      hairs.push(strand(base, ang + (rnd() - 0.5) * 0.18, thick * (0.75 + rnd() * 0.45), 0.1));
    }
  }
  const nose: Pt = [84, 168];
  const map = [
    { to: [56, 70] as Pt, label: 'Start', lx: 18, ly: 60 },
    { to: [192, 22] as Pt, label: 'Arch', lx: 196, ly: 14 },
    { to: [282, 64] as Pt, label: 'Tail', lx: 280, ly: 56 },
  ].map((m) => ({ ...m, d: `M${nose.join(' ')}L${m.to.join(' ')}` }));
  return { viewBox: '0 0 310 175', hairs, map, eye: 'M92 132Q160 104 232 128' };
}

/** The opening eye: lids + upper fringe. */
export function eyeArt() {
  const a: Pt = [36, 112], c: Pt = [200, -8], b: Pt = [364, 112];
  return {
    viewBox: '0 0 400 230',
    upper: `M${a.join(' ')}Q${c.join(' ')} ${b.join(' ')}`,
    lower: 'M36 112Q200 230 364 112',
    lashes: fringe(a, c, b, 30, () => [0], (t) => 16 + 30 * Math.sin(t * Math.PI) * (0.6 + t * 0.5), -0.28, 0.08, 0.96, true),
  };
}

/** Lash fringe for the hero frame. The frame is 520 units wide with border-radius 50% / 15% at a
 *  4:5 ratio, so its top edge is the upper half of an ellipse rx 260, ry 97.5 centred at (260, 97.5).
 *  Lashes stand on that edge, pointing outward, longer toward the outer corner (right). */
export function frameFringe() {
  const cx = 260, cy = 97.5, rx = 260, ry = 97.5;
  const lashes: string[] = [];
  const n = 40;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const th = Math.PI * (1.08 + 0.84 * t); // 194° → 345°, the visible top of the lid
    const p: Pt = [cx + rx * Math.cos(th), cy + ry * Math.sin(th)];
    const nrm = Math.atan2(Math.sin(th) / ry, Math.cos(th) / rx); // outward normal of the ellipse
    const len = 12 + 30 * Math.sin(t * Math.PI) * (0.55 + t * 0.6);
    lashes.push(strand(p, nrm + (t - 0.5) * 0.35, len, -0.3));
  }
  const lid = `M0 97.5A260 97.5 0 0 1 520 97.5`;
  return { viewBox: '0 -60 520 160', lashes, lid };
}
