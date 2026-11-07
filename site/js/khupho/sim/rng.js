// Khu phố T&M · deterministic randomness. Never use Math.random inside the sim.
// mulberry32: tiny, fast, good enough for gameplay; the state is a single 32-bit int.

/** Hash any mix of strings/numbers into a 32-bit unsigned seed (FNV-1a). */
export function hashSeed(...parts) {
  let h = 2166136261 >>> 0;
  for (const p of parts) {
    const s = String(p);
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    h ^= 0x9e; h = Math.imul(h, 16777619) >>> 0; // separator so ('ab','c') != ('a','bc')
  }
  return h >>> 0;
}

/** rng(seed) → () => float in [0,1). seed may be a number or a string. */
export function rng(seed) {
  let a = (typeof seed === 'number' && Number.isFinite(seed) ? seed : hashSeed(seed)) >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A fresh generator for one (seed, day, topic): no rng state has to be saved. */
export const dayRng = (seed, day, topic = '') => rng(hashSeed(seed, day, topic));

export const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
/** Integer in [a, b] inclusive. */
export const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
export const chance = (r, p) => r() < p;
export function shuffle(r, arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
