// Tiny WebAudio synth for UI blips; no audio files needed.
import { store } from './util.js';

let actx = null;
let soundOn = store.get('tts_sound') !== '0';

export function unlockAudio() {
  if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch { /* no audio */ } }
  return actx;
}

export function tone(freq, dur, type = 'square', vol = 0.025, when = 0) {
  if (!soundOn) return;
  const a = unlockAudio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, a.currentTime + when);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + when + dur);
  o.connect(g); g.connect(a.destination);
  o.start(a.currentTime + when); o.stop(a.currentTime + when + dur + 0.02);
}

export const sfx = {
  blip(pitch = 1) { tone(380 * pitch + Math.random() * 60, 0.035, 'square', 0.012); },
  ding() { tone(880, 0.12, 'sine', 0.05); tone(1320, 0.18, 'sine', 0.04, 0.1); },
  choose() { tone(600, 0.06, 'triangle', 0.04); tone(900, 0.08, 'triangle', 0.035, 0.05); },
  good() { tone(660, 0.1, 'sine', 0.04); tone(990, 0.14, 'sine', 0.035, 0.08); },
  bad() { tone(300, 0.15, 'sawtooth', 0.02); },
  ring() { tone(784, 0.16, 'sine', 0.05); tone(988, 0.16, 'sine', 0.05, 0.2); tone(784, 0.16, 'sine', 0.05, 0.4); },
};

export const isSoundOn = () => soundOn;
export function setSound(on) { soundOn = on; store.set('tts_sound', on ? '1' : '0'); }
