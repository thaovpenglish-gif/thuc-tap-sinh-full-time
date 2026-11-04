import test from 'node:test';
import assert from 'node:assert/strict';
import { createOverburnout, updateOverburnout, workPrompt, remainingMs } from '../site/js/game/overburnout.js';

const T = 1000000;
const act = (s, a, t = T) => {
  const r = updateOverburnout(s, a, t);
  assert.equal(r.ok, true, 'unexpected ' + r.reason + ' from ' + JSON.stringify(a));
  return r.state;
};
const setup = (practice = true) => {
  let s = createOverburnout({ durationMs: 300000 });
  s = act(s, { type:'join', playerId:'a', name:'Mai', x:-1,z:3.9 });
  if (!practice) s = act(s, { type:'join', playerId:'b', name:'Long',x:1,z:3.9 });
  return act(s, { type:'start', practice });
};
const move = (s, id, x, z, t = T+100000) => {
  const p=s.items.players[id], d=Math.hypot(x-p.x,z-p.z), n=Math.ceil(d/0.3);
  for(let i=1;i<=n;i++){
    const nx=p.x+(x-p.x)*i/n,nz=p.z+(z-p.z)*i/n;
    s=act(s,{type:'move',playerId:id,x:nx,z:nz},t+i*75);
  }
  return s;
};

test('two players are required for real rooms; practice can start alone',()=>{
  let s=createOverburnout();
  s=act(s,{type:'join',playerId:'a',x:0,z:0});
  assert.equal(updateOverburnout(s,{type:'start'},T).reason,'need-teammates');
  assert.equal(act(s,{type:'start',practice:true}).status,'playing');
});

test('accepts 2–4 participants and rejects fifth',()=>{
  let s=createOverburnout();
  for(let i=0;i<4;i++)s=act(s,{type:'join',playerId:'p'+i,x:0,z:0});
  assert.equal(updateOverburnout(s,{type:'join',playerId:'p4',x:0,z:0},T).reason,'room-full');
});

test('cannot work until matching item is at the matching station',()=>{
  const s=setup();
  assert.equal(workPrompt(s,'a'),null);
  assert.equal(updateOverburnout(s,{type:'work',playerId:'a',orderId:'brief-a',stationId:'research',answer:1},T).reason,'work-not-ready');
});

test('item travels through research, analysis, slides and delivery with a rework loop',()=>{
  let s=setup(), t=T+5000;
  s=act(s,{type:'pickup',playerId:'a',itemId:'brief-a'},t);
  const stages=[['research',1,1800],['analysis',0,2300],['slides',2,2600]];
  for(const [station,correct,duration] of stages){
    const pos=s.items.counters[station];
    s=move(s,'a',pos.x,pos.z,t+5000); t+=10000;
    s=act(s,{type:'drop',playerId:'a',itemId:'brief-a',counterId:station},t);
    assert.equal(workPrompt(s,'a')?.stationId,station);
    s=act(s,{type:'work',playerId:'a',orderId:'brief-a',stationId:station,answer:correct},t);
    assert.equal(updateOverburnout(s,{type:'pickup',playerId:'a',itemId:'brief-a'},t+200).reason,'station-busy');
    s=act(s,{type:'tick'},t+duration);
    s=act(s,{type:'pickup',playerId:'a',itemId:'brief-a'},t+duration+5);
    t+=duration+2000;
  }
  s=move(s,'a',s.items.counters.delivery.x,s.items.counters.delivery.z,t+5000); t+=10000;
  s=act(s,{type:'drop',playerId:'a',itemId:'brief-a',counterId:'delivery'},t);
  s=act(s,{type:'deliver',playerId:'a'},t);
  assert.equal(s.reworks,1);
  assert.equal(s.orders['brief-a'].stage,2);
  s=act(s,{type:'pickup',playerId:'a',itemId:'brief-a'},t);
  s=move(s,'a',s.items.counters.slides.x,s.items.counters.slides.z,t+5000); t+=10000;
  s=act(s,{type:'drop',playerId:'a',itemId:'brief-a',counterId:'slides'},t);
  s=act(s,{type:'work',playerId:'a',orderId:'brief-a',stationId:'slides',answer:2},t);
  s=act(s,{type:'tick'},t+2600);
  s=act(s,{type:'pickup',playerId:'a',itemId:'brief-a'},t+2601);
  s=move(s,'a',s.items.counters.delivery.x,s.items.counters.delivery.z,t+7000);t+=12000;
  s=act(s,{type:'drop',playerId:'a',itemId:'brief-a',counterId:'delivery'},t);
  s=act(s,{type:'deliver',playerId:'a'},t);
  assert.equal(s.orders['brief-a'].delivered,true);
  assert.equal(s.items.items['brief-a'],undefined);
  assert.equal(s.items.counters.delivery.itemId,null);
});

test('incorrect answer records error and does not advance',()=>{
  let s=setup();
  s=act(s,{type:'pickup',playerId:'a',itemId:'brief-a'});
  s=move(s,'a',-5.2,-2.2,T+10000);
  s=act(s,{type:'drop',playerId:'a',itemId:'brief-a',counterId:'research'},T+12000);
  s=act(s,{type:'work',playerId:'a',orderId:'brief-a',stationId:'research',answer:0},T+12000);
  assert.equal(s.errors,1);
  assert.equal(s.orders['brief-a'].stage,0);
});

test('wrong station and early delivery are rejected, no input mutation',()=>{
  let s=setup();
  s=act(s,{type:'pickup',playerId:'a',itemId:'brief-a'});
  s=move(s,'a',-1.7,-2.2,T+10000);
  const prior=structuredClone(s);
  assert.equal(updateOverburnout(s,{type:'drop',playerId:'a',itemId:'brief-a',counterId:'analysis'},T+12000).reason,'wrong-station');
  assert.deepEqual(s,prior);
});

test('movement speed and map bounds are validated',()=>{
  const s=setup();
  assert.equal(updateOverburnout(s,{type:'move',playerId:'a',x:99,z:0},T).reason,'out-of-bounds');
  assert.equal(updateOverburnout(s,{type:'move',playerId:'a',x:8,z:0},T).reason,'movement-too-fast');
});

test('deadline ends session and cannot continue actions',()=>{
  let s=setup();
  assert.equal(remainingMs(s,T+300000),0);
  s=act(s,{type:'tick'},T+300000);
  assert.equal(s.status,'lost');
  assert.equal(updateOverburnout(s,{type:'work',playerId:'a'},T+300001).reason,'not-playing');
});