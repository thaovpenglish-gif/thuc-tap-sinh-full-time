// Khu phố T&M · Nội Thất Nhà Mình + your room (sim/home.js): buying, delivery fee, slots, cosy score, save round trip.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as W from '../site/js/khupho/sim/world.js';
import { FURNITURE, FURN, SLOTS, DELIVERY_FEE } from '../site/js/khupho/data/furniture.js';
import { ensureHome, buyFurniture, placeItem, cozyScore, morningMood, cozyLabel, COZY_MAX } from '../site/js/khupho/sim/home.js';
import { PLACE } from '../site/js/khupho/data/places.js';
import { sanitizeKp } from '../site/js/khupho/sim/profile.js';

const fresh = (money = 5000000) => { const kp = W.newGame({ name: 'T', seed: 7, now: 0 }); kp.player.money = money; return kp; };

test('furniture data: every item has a known slot, a price, a cozy value; ids unique', () => {
  const ids = new Set();
  for (const f of FURNITURE) {
    assert.ok(SLOTS[f.slot], `${f.id} slot`); assert.ok(f.price > 0 && f.cozy > 0, f.id); assert.ok(!ids.has(f.id)); ids.add(f.id);
    assert.ok(!/—/.test(f.name + f.desc), `${f.id}: no em dash in UI text`);
  }
  assert.ok(PLACE.noithat && PLACE.noithat.enterable, 'the shop is a place');
});

test('buy: money goes down, big items add the ba gác fee, item is placed in an empty slot', () => {
  const kp = fresh();
  const m0 = kp.player.money;
  const r = buyFurniture(kp, 'rug_tron');
  assert.ok(r.ok && r.placed); assert.equal(kp.player.money, m0 - FURN.rug_tron.price);
  assert.equal(ensureHome(kp).placed.rug, 'rug_tron');
  const m1 = kp.player.money;
  const big = buyFurniture(kp, 'ghe_luoi');
  assert.ok(big.ok); assert.equal(big.total, FURN.ghe_luoi.price + DELIVERY_FEE); assert.equal(kp.player.money, m1 - big.total);
  assert.ok(kp.ledger.some((l) => l.k === 'bagac' && l.v === -DELIVERY_FEE), 'Chú Bảy gets paid');
  // second rug: owned, but the slot is taken so it waits in the wardrobe
  const r2 = buyFurniture(kp, 'rug_long');
  assert.ok(r2.ok && !r2.placed); assert.equal(kp.home.placed.rug, 'rug_tron');
  assert.equal(buyFurniture(kp, 'rug_long').ok, false, 'cannot buy twice');
});

test('buy: not enough money changes nothing', () => {
  const kp = fresh(50000);
  const r = buyFurniture(kp, 'ke_sach');
  assert.equal(r.ok, false); assert.match(r.reason, /Thiếu tiền/); assert.equal(kp.player.money, 50000); assert.deepEqual(kp.home.owned, []);
});

test('place: only owned items, only in their own slot; null clears', () => {
  const kp = fresh();
  assert.equal(placeItem(kp, 'rug', 'rug_long').ok, false, 'not owned');
  buyFurniture(kp, 'rug_tron'); buyFurniture(kp, 'rug_long');
  assert.equal(placeItem(kp, 'plant', 'rug_long').ok, false, 'wrong slot');
  assert.ok(placeItem(kp, 'rug', 'rug_long').ok); assert.equal(kp.home.placed.rug, 'rug_long');
  assert.ok(placeItem(kp, 'rug', null).ok); assert.equal(kp.home.placed.rug, undefined);
});

test('cosy score: sum of placed items + variety bonus, capped; mood bonus up to +10', () => {
  const kp = fresh(99999999);
  assert.equal(cozyScore(kp), 0); assert.equal(morningMood(kp), 0); assert.match(cozyLabel(0), /quạt/);
  for (const f of FURNITURE) buyFurniture(kp, f.id);
  const s = cozyScore(kp);
  assert.ok(s > 16 && s <= COZY_MAX, `full room ${s}`);
  assert.ok(morningMood(kp) <= 10 && morningMood(kp) >= 6);
});

test('the room survives the save sanitiser', () => {
  const kp = fresh();
  buyFurniture(kp, 'den_day'); buyFurniture(kp, 'cay_luoi_ho');
  const back = sanitizeKp(JSON.parse(JSON.stringify(kp)));
  assert.deepEqual(back.home, kp.home);
});
