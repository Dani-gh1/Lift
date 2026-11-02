/* LIFT – app-logik. Data (øvelser/programmer) ligger i data.js */
'use strict';

/* ============================== IKONER (ét ensartet SVG-sæt) ============================== */
const IC = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  dumbbell:'<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
  chart:'<path d="M3 20h18M6 16l4-5 3 3 5-7"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  play:'<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
  pause:'<path d="M8 5v14M16 5v14"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  flame:'<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 2 1.3 3 2.5 3-.5-3 0-6 0-8z"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M8 21h8M9 17h6"/>',
  box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"/>',
  install:'<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M12 7v7M9 11l3 3 3-3M10 18.5h4"/>',
  shield:'<path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  download:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  upload:'<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  chevR:'<path d="M9 6l6 6-6 6"/>', chevL:'<path d="M15 6l-6 6 6 6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  alert:'<path d="M12 3 2 20h20zM12 10v4M12 17v.5"/>',
  star:'<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  sprout:'<path d="M12 21v-9M12 12c0-4-3-7-8-7 0 5 3 7 8 7zM12 12c0-3 2.5-6 8-6 0 4.5-3 6-8 6z"/>',
  building:'<path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01"/>',
  swap:'<path d="M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4"/>',
  sound:'<path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
  mute:'<path d="M4 9v6h4l5 4V5L8 9zM17 9l4 6M21 9l-4 6"/>',
  repeat:'<path d="M4 12a8 8 0 0 1 14-5.3M20 4v4h-4M20 12a8 8 0 0 1-14 5.3M4 20v-4h4"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  file:'<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  crown:'<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  skip:'<path d="M5 5l10 7-10 7z" fill="currentColor"/><path d="M19 5v14"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  layers:'<path d="M12 3 2 8l10 5 10-5zM2 13l10 5 10-5"/>',
  share:'<path d="M12 3v12M7 8l5-5 5 5M5 13v7h14v-7"/>',
};
const ic = (n, cls='') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`;

/* ============================== LAGRING (kun på enheden) ============================== */
const KEY = 'lift_v2';
const blankProfile = () => ({onboarded:false, goal:'form', experience:'aldrig', place:'hjem', daysPerWeek:3, activeProgram:'hjem',
  progress:{}, cycles:{}, equipment:Object.keys(UDSTYR), sound:true, premium:null, lastBackup:null, backupSnooze:null,
  interest:null, waitlist:null, flags:{}, calDays:null, calTime:'16:30'});
const blank = () => ({profile:blankProfile(), logs:[], current:null, summary:null});
let S = blank();

function load(){
  try{
    const raw = localStorage.getItem(KEY) || localStorage.getItem('lift_v1');
    if(!raw) return;
    const d = JSON.parse(raw);
    S = Object.assign(blank(), d);
    S.profile = Object.assign(blankProfile(), d.profile || {});
    if(!PROGRAMS.find(p=>p.id===S.profile.activeProgram)) S.profile.activeProgram = 'hjem';
    if(['generel'].includes(S.profile.goal)) S.profile.goal = 'form';
    S.logs = (S.logs||[]).filter(l => l && l.ex);
    S.logs.forEach(l => l.ex = l.ex.filter(e => EX[e.id]));
    if(S.current && !Array.isArray(S.current.ex)) S.current = null;
  }catch(e){ S = blank() }
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)) }catch(e){ toast('Could not save – is your storage full?') } }

/* ============================== MÅLING (GoatCounter, valgfri) ============================== */
const gcQueue = [];
function track(name){
  if(!CONFIG.goatcounterCode) return;
  const send = () => window.goatcounter.count({path:'evt-' + name, title:name, event:true});
  if(window.goatcounter && window.goatcounter.count) send(); else gcQueue.push(name);
}
function trackOnce(name){ if(S.profile.flags[name]) return; S.profile.flags[name] = Date.now(); save(); track(name) }
(function initAnalytics(){
  if(!CONFIG.goatcounterCode || location.protocol !== 'https:') return;
  const s = document.createElement('script');
  s.async = true; s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = `https://${CONFIG.goatcounterCode}.goatcounter.com/count`;
  s.onload = () => { const t = setInterval(()=>{ if(window.goatcounter && window.goatcounter.count){ clearInterval(t); gcQueue.splice(0).forEach(track) } }, 300) };
  document.head.appendChild(s);
})();

/* ============================== HJÆLPERE ============================== */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Premium er enten 'test' (testknap) eller {source:'stripe', plan, until}. Virker offline i 3 dage efter udløbsdato.
const isPremium = () => { const p = S.profile.premium; if(!p) return false; if(p.until && new Date(p.until).getTime() + 3*864e5 < Date.now()) return false; return true };
const testTools = () => { try{ if(/[?&]test\b/.test(location.search)) localStorage.setItem('lift_test','1'); return CONFIG.showTestTools || localStorage.getItem('lift_test')==='1' }catch(e){ return CONFIG.showTestTools } };
const prog = id => PROGRAMS.find(p => p.id === id);
const fmt = w => (Math.round(w*10)/10).toString();
const unit = x => x.t==='w' ? 'kg' : x.t==='s' ? 'sec' : 'reps';
const dk = d => new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
const dkLong = d => new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const DAY = 864e5;
function toast(m){ document.querySelectorAll('.toast').forEach(t=>t.remove()); const t = document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=m; document.body.appendChild(t); setTimeout(()=>t.remove(), 2200) }
const dpw = () => S.profile.daysPerWeek || 3;
const total = () => CONFIG.weeks * dpw();
const progressOf = pid => Math.min(S.profile.progress[pid] || 0, total());

function hasEquip(x){ return x.needs.every(n => S.profile.equipment.includes(n)) }
function resolve(id){ // bytter øvelser ud efter udstyr (Premium)
  let e = id, guard = 0;
  if(!isPremium()) return e;
  while(!hasEquip(EX[e]) && EX[e].alt && guard++ < 6) e = EX[e].alt;
  return e;
}
function restFor(id){
  let r = EX[id].rest;
  if(isPremium() && EX[id].t==='w'){ if(S.profile.goal==='styrke') r = Math.max(r,150); if(S.profile.goal==='muskler') r = Math.min(r,90) }
  return r;
}
// Selve planen for en bestemt træning (uge-progression + gentag-runder)
function planFor(p, idx){
  const week = Math.min(CONFIG.weeks, Math.floor(idx / dpw()) + 1);
  const wk = p.weeks[week-1] || {sets:0, reps:0};
  const day = p.days[idx % p.days.length];
  const cyc = S.profile.cycles[p.id] || 0;
  const ex = day.ex.map(([id0, s, r]) => {
    const id = resolve(id0), x = EX[id];
    const sets = Math.max(1, s + (wk.sets||0));
    let target;
    if(x.t === 'w'){
      target = r;
      if(isPremium() && S.profile.goal==='styrke') target = Math.min(r, 6);
      if(isPremium() && S.profile.goal==='muskler') target = Math.max(r, 10);
    } else if(x.t === 's') target = r + (wk.reps||0)*5 + cyc*10;
    else target = r + (wk.reps||0) + cyc*2;
    return {id, orig:id0, sets, target};
  });
  return {week, wk, day, ex};
}
function exHistory(id){ // (ikke "history" – det navn bruger browseren)
  const out = [];
  for(const l of S.logs) for(const e of l.ex) if(e.id === id && e.sets.length) out.push({d:l.d, target:e.target, sets:e.sets, log:l.id});
  return out.sort((a,b)=> a.d < b.d ? -1 : 1);
}
const bestOf = (x, sets) => x.t==='w' ? Math.max(...sets.map(s=>s.w)) : Math.max(...sets.map(s=>s.r));
function lastText(id){
  const h = exHistory(id), x = EX[id];
  if(!h.length) return '';
  const l = h[h.length-1];
  if(x.t === 'w'){ const top = l.sets.reduce((a,s)=> s.w>a.w || (s.w===a.w && s.r>a.r) ? s : a, l.sets[0]); return `Last time: ${fmt(top.w)} kg × ${top.r}` }
  return `Last time: ${l.sets.map(s=>s.r).join(', ')} ${unit(x)}`;
}
// Forslag til denne træning ud fra sidste gang
function suggest(id, target){
  const x = EX[id], h = exHistory(id);
  if(!h.length) return {w: x.t==='w' ? x.start : 0, r: target, cls:'keep',
    note: x.t==='w' ? `First time: start with about ${fmt(x.start)} kg. The last 2 reps should be hard – but clean.` : `Goal: ${target} ${unit(x)} in every set.`};
  const last = h[h.length-1];
  const allHit = last.sets.every(s => s.r >= last.target);
  if(x.t === 'w'){
    const lw = Math.max(...last.sets.map(s=>s.w));
    if(allHit) return {w: lw + x.inc, r: target, cls:'', up:true, note:`Try ${fmt(lw + x.inc)} kg today (+${fmt(x.inc)} kg). You hit every set last time!`};
    const fails = h.slice(-3).filter(y => Math.max(...y.sets.map(s=>s.w)) === lw && !y.sets.every(s=>s.r>=y.target)).length;
    if(fails >= 3){ const nw = Math.max(x.inc, Math.round(lw*0.9/x.inc)*x.inc); return {w:nw, r:target, cls:'down', note:`Drop to ${fmt(nw)} kg and build back up. That's completely normal.`} }
    return {w: lw, r: target, cls:'keep', note:`Stay at ${fmt(lw)} kg until you hit ${target} in every set.`};
  }
  const best = Math.max(...last.sets.map(s=>s.r));
  if(allHit && best >= target){ const nr = Math.max(target, best + x.inc); return {w:0, r:nr, cls:'', up:true, note:`Try ${nr} ${unit(x)} today. You hit every set last time!`} }
  return {w:0, r:target, cls:'keep', note:`Goal: ${target} ${unit(x)} in every set.`};
}
// Fleksibel streak: en uge tæller, hvis man har mindst (dage/uge − 1) træninger
const weekStart = d => { const x = new Date(d); x.setHours(0,0,0,0); x.setDate(x.getDate() - ((x.getDay()+6)%7)); return x.getTime() };
function weekStreak(){
  const need = Math.max(1, dpw() - 1), cnt = {};
  S.logs.forEach(l => { const k = weekStart(l.d); cnt[k] = (cnt[k]||0) + 1 });
  let n = 0, cur = weekStart(new Date());
  if((cnt[cur]||0) >= need) n++;
  cur -= 7*DAY;
  while((cnt[cur]||0) >= need){ n++; cur -= 7*DAY }
  return n;
}
const thisWeekCount = () => { const w = weekStart(new Date()); return S.logs.filter(l => weekStart(l.d) === w).length };
function weekDaysHTML(){
  const w = weekStart(new Date()), doneDays = new Set(S.logs.filter(l=>weekStart(l.d)===w).map(l => (new Date(l.d).getDay()+6)%7));
  const today = (new Date().getDay()+6)%7;
  return `<div class="days7" aria-label="Training days this week">${['M','T','W','T','F','S','S'].map((d,i)=>`<div>${d}<i class="${doneDays.has(i)?'d':i===today?'t':''}">${doneDays.has(i)?ic('check'):''}</i></div>`).join('')}</div>`;
}

/* ============================== DEMO-ANIMATIONER ==============================
   Hver stilling (pose) har to positioner: A (start) og B (bunden af bevægelsen).
   Leddene: h=hoved, n=nakke, hp=hofte, k/f=knæ/fod, el/hd=albue/hånd, k2/f2 = det fjerne ben. */
const P = (h,n,hp,k,f,el,hd,k2,f2) => ({h,n,hp,k,f,el,hd,k2:k2||k,f2:f2||f});
const STAND = P([60,20],[60,32],[60,64],[60,87],[60,110],[64,48],[68,62]);
const POSES = {
  squat:[P([60,20],[60,32],[60,64],[61,87],[60,110],[70,44],[82,40]), P([74,44],[68,56],[40,80],[70,84],[60,110],[80,62],[92,60])],
  push:[P([22,62],[32,68],[74,82],[92,95],[110,106],[32,89],[32,110]), P([22,90],[34,96],[74,100],[92,104],[110,106],[50,96],[32,110])],
  bench:[P([16,70],[28,72],[70,74],[92,76],[96,110],[29,56],[29,38]), P([16,70],[28,72],[70,74],[92,76],[96,110],[44,80],[31,62])],
  hinge:[P([60,20],[60,32],[60,64],[60,87],[60,110],[61,48],[62,64]), P([92,44],[84,50],[52,62],[56,86],[60,110],[84,66],[84,82])],
  press:[P([60,20],[60,32],[60,64],[60,87],[60,110],[74,40],[70,28]), P([60,20],[60,32],[60,64],[60,87],[60,110],[66,14],[62,0])],
  row:[P([92,46],[84,52],[52,62],[56,86],[60,110],[84,70],[84,86]), P([92,46],[84,52],[52,62],[56,86],[60,110],[64,48],[74,64])],
  invrow:[P([20,100],[31,99],[72,103],[92,106],[112,108],[33,80],[34,60]), P([22,74],[33,74],[72,88],[92,99],[112,108],[52,72],[34,60])],
  bridge:[P([14,100],[25,101],[62,104],[86,84],[94,110],[38,108],[52,110]), P([14,100],[25,99],[62,82],[86,82],[94,110],[38,108],[52,110])],
  lunge:[STAND, P([62,40],[62,52],[60,82],[82,86],[82,110],[64,66],[68,80],[50,106],[30,108])],
  plank:[P([20,86],[30,90],[72,94],[92,100],[110,106],[30,110],[44,110]), P([20,84],[30,88],[72,90],[92,99],[110,106],[30,110],[44,110])],
  pull:[P([60,30],[60,42],[60,74],[62,96],[60,112],[64,22],[62,4]), P([60,30],[60,42],[60,74],[62,96],[60,112],[76,50],[70,32])],
  pike:[P([34,76],[44,72],[72,44],[86,76],[100,110],[40,92],[36,110]), P([36,100],[46,93],[74,50],[88,78],[100,110],[58,100],[36,110])],
  chestpress:[P([60,20],[60,32],[60,64],[60,87],[60,110],[48,50],[64,46]), P([60,20],[60,32],[60,64],[60,87],[60,110],[76,46],[94,46])],
  swing:[P([92,44],[84,50],[52,62],[58,86],[60,110],[66,74],[60,92]), P([60,20],[60,32],[60,64],[60,87],[60,110],[78,42],[96,36])],
};
// Hvilket udstyr der tegnes. Kan overskrives med vis:'...' på øvelsen i data.js
function visOf(id){
  const x = EX[id]; if(x.vis) return x.vis;
  if(id==='table_row') return 'table';
  if(x.needs.includes('stang')) return 'barbell';
  if(x.needs.includes('haandvaegte')) return 'dumbbell';
  if(x.needs.includes('kettlebell')) return 'kb';
  if(x.needs.includes('elastik')) return 'band';
  if(x.needs.includes('maskiner')) return x.a==='pull' ? 'cable' : 'sled';
  return '';
}
function demoSVG(id){
  const x = EX[id], anim = x.a, vis = visOf(id);
  const [A,B] = POSES[anim] || [STAND,STAND];
  const dur = anim==='plank' ? '3s' : '2.6s', ks = 'calcMode="spline" keyTimes="0;.55;1" keySplines=".45 0 .55 1;.45 0 .55 1"';
  const an = (attr,a,b) => `<animate attributeName="${attr}" values="${a};${b};${a}" dur="${dur}" repeatCount="indefinite" ${ks}/>`;
  const mv = (pt) => `<animateTransform attributeName="transform" type="translate" values="${A[pt]};${B[pt]};${A[pt]}" dur="${dur}" repeatCount="indefinite" ${ks}/>`;
  const bone = (p,q,w,c) => `<line stroke="${c}" stroke-width="${w}" stroke-linecap="round" x1="${A[p][0]}" y1="${A[p][1]}" x2="${A[q][0]}" y2="${A[q][1]}">${an('x1',A[p][0],B[p][0])}${an('y1',A[p][1],B[p][1])}${an('x2',A[q][0],B[q][0])}${an('y2',A[q][1],B[q][1])}</line>`;
  const N = '#39ff7a', F = '#1d7d42';
  // Udstyr der følger hånden
  const atHand = {
    barbell: `<circle r="11" fill="#0e1310" stroke="#f1f5f3" stroke-width="3"/><circle r="2.5" fill="#f1f5f3"/>`,
    dumbbell: `<rect x="-9" y="-4" width="18" height="8" rx="3" fill="#f1f5f3"/><rect x="-11" y="-6" width="5" height="12" rx="2" fill="#f1f5f3"/><rect x="6" y="-6" width="5" height="12" rx="2" fill="#f1f5f3"/>`,
    kb: `<circle cy="8" r="8" fill="#f1f5f3"/><path d="M-5 2 a5 5 0 0 1 10 0" fill="none" stroke="#f1f5f3" stroke-width="3"/>`,
  }[vis];
  const handProp = atHand ? `<g transform="translate(${A.hd})">${mv('hd')}${atHand}</g>` : '';
  // Faste ting i rummet
  let scene = '';
  if(anim==='bench') scene = `<rect x="6" y="80" width="92" height="7" rx="3" fill="#2a342f"/><rect x="18" y="87" width="5" height="23" fill="#2a342f"/><rect x="82" y="87" width="5" height="23" fill="#2a342f"/>`;
  if(vis==='table') scene = `<rect x="-4" y="54" width="70" height="6" rx="2" fill="#2a342f"/><rect x="0" y="60" width="5" height="50" fill="#2a342f"/><rect x="58" y="60" width="5" height="50" fill="#2a342f"/>`;
  if(vis==='cable') scene = `<circle cx="62" cy="-2" r="5" fill="none" stroke="#a9b6af" stroke-width="2"/><line x1="62" y1="-2" x2="${A.hd[0]}" y2="${A.hd[1]}" stroke="#a9b6af" stroke-width="2">${an('x2',A.hd[0],B.hd[0])}${an('y2',A.hd[1],B.hd[1])}</line><rect x="40" y="${A.hd[1]-2}" width="44" height="4" rx="2" fill="#f1f5f3">${an('y',A.hd[1]-2,B.hd[1]-2)}</rect>`;
  if(vis==='band'){ const ax = anim==='row' ? 124 : -2, ay = anim==='row' ? 70 : 50;
    scene = `<rect x="${ax-3}" y="${ay-10}" width="6" height="20" rx="2" fill="#2a342f"/><line x1="${ax}" y1="${ay}" x2="${A.hd[0]}" y2="${A.hd[1]}" stroke="#ffcc33" stroke-width="3" stroke-dasharray="5 3">${an('x2',A.hd[0],B.hd[0])}${an('y2',A.hd[1],B.hd[1])}</line>` }
  if(vis==='sled') scene = `<rect x="84" y="20" width="8" height="70" rx="3" fill="#2a342f" transform="rotate(-20 88 55)"/>`;
  // Pil der viser retningen (op/ned eller frem/tilbage)
  const dxh = B.hd[0]-A.hd[0], dyh = B.hd[1]-A.hd[1];
  const vert = Math.abs(dyh) || Math.abs(dxh) ? Math.abs(dyh) >= Math.abs(dxh) : Math.abs(B.hp[1]-A.hp[1]) >= Math.abs(B.hp[0]-A.hp[0]);
  const arrow = anim==='plank' ? '' : `<g opacity=".0" stroke="${N}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      ${vert ? `<path d="M116 30v40M110 36l6-6 6 6M110 64l6 6 6-6"/>` : `<path d="M30 -2h50M36 -8l-6 6 6 6M74 -8l6 6-6 6"/>`}
      <animate attributeName="opacity" values="0;.85;0" dur="${dur}" repeatCount="indefinite"/></g>`;
  return `<svg viewBox="-8 -12 136 134" role="img" aria-label="Animation of ${esc(x.n)}">
    <ellipse cx="60" cy="112" rx="56" ry="4" fill="#000" opacity=".45"/>
    <line x1="-8" y1="111" x2="128" y2="111" stroke="#2a342f" stroke-width="2"/>
    ${scene}${arrow}
    ${bone('hp','k2',6,F)}${bone('k2','f2',6,F)}
    <g transform="translate(4 -1)">${bone('n','el',5,F)}${bone('el','hd',5,F)}</g>
    ${bone('n','hp',8,N)}${bone('hp','k',7,N)}${bone('k','f',7,N)}${bone('n','el',5.5,N)}${bone('el','hd',5.5,N)}
    <circle r="8.5" fill="#0e1310" stroke="${N}" stroke-width="4" cx="${A.h[0]}" cy="${A.h[1]}">${an('cx',A.h[0],B.h[0])}${an('cy',A.h[1],B.h[1])}</circle>
    ${handProp}</svg>`;
}
const tempoText = id => EX[id].t==='s' ? 'Hold still and breathe calmly.' : EX[id].a==='swing' ? 'Explode up with your hips, let the bell fall back.' : 'Lower slowly (2 sec) · push up strong (1 sec).';

/* ============================== NAVIGATION ============================== */
let view = 'home';
const TABS = [['home','Home','home'],['programs','Programs','dumbbell'],['progress','Progress','chart'],['profile','Profile','user']];
function go(v){ view = v; closeModal(); window.scrollTo(0,0); render() }
function render(){
  const full = !S.profile.onboarded || ['workout','done','premium'].includes(view);
  $('#tabs').style.display = full ? 'none' : '';
  $('#tabs .in').innerHTML = TABS.map(([k,l,i]) => `<button class="${view===k?'on':''}" onclick="go('${k}')" aria-label="${l}" ${view===k?'aria-current="page"':''}>${ic(i)}${l}</button>`).join('');
  const app = $('#app');
  if(!S.profile.onboarded) return renderOnboarding(app);
  ({home:renderHome, programs:renderPrograms, progress:renderProgress, profile:renderProfile, workout:renderWorkout, done:renderDone, premium:renderPremium})[view](app);
  renderRestBar();
}
const BARBELL = '<svg class="lb" viewBox="60 140 392 148" aria-hidden="true"><g fill="#39ff7a"><rect x="70" y="203" width="372" height="22" rx="11"/><rect x="112" y="150" width="40" height="128" rx="12"/><rect x="162" y="172" width="30" height="84" rx="10"/><rect x="360" y="150" width="40" height="128" rx="12"/><rect x="320" y="172" width="30" height="84" rx="10"/><rect x="76" y="186" width="26" height="56" rx="8"/><rect x="410" y="186" width="26" height="56" rx="8"/></g></svg>';
const logoHTML = (big) => `<div class="logo grow ${big?'big':''}" aria-label="LIFT">${BARBELL}<span>L<i>I</i>FT</span></div>`;
const saveChip = () => `<button class="chip-save" onclick="go('profile')" aria-label="Data saved on this device">${ic('shield')}Saved</button>`;
const header = (title, right='') => `<header class="hdr">${title}${right}</header>`;

/* ============================== ONBOARDING (4 trin) ============================== */
let ob = null;
function renderOnboarding(app){
  if(!ob) ob = {step:0, goal:null, experience:null, place:null, days:3};
  const steps = 5;
  const dots = `<div class="dots">${Array.from({length:steps},(_,i)=>`<i class="${i<=ob.step?'d':''}"></i>`).join('')}</div>`;
  const opt = (key, val, icon, title, sub) => `<button class="opt ${ob[key]===val?'on':''}" onclick="obPick('${key}','${val}')"><span class="oi">${ic(icon)}</span><span>${title}<small>${sub}</small></span></button>`;
  const back = ob.step > 0 ? `<button class="iconbtn back" onclick="ob.step--;render()" aria-label="Back">${ic('chevL')}</button>` : '';
  let body = '';
  if(ob.step === 0) body = `
    <div style="margin-top:20px">${logoHTML(true)}</div>
    <h1 style="margin-top:14px">Strength training for beginners</h1>
    <p class="mut">Get a ready-made program and know exactly what to do every time. Answer 4 quick questions and we'll find your program.</p>
    <div style="flex:1"></div>
    <button class="btn pri block" onclick="ob.step=1;render()">Get started</button>
    <p class="xs mut center">Takes less than 1 minute. No account needed.</p>`;
  else if(ob.step === 1) body = `<h2>What's your goal?</h2>${Object.entries(MAAL).map(([k,g])=>opt('goal',k,g.icon,g.n,g.d)).join('')}`;
  else if(ob.step === 2) body = `<h2>Have you tried strength training before?</h2>
    ${opt('experience','aldrig','sprout','Never','Totally new – that is perfect')}${opt('experience','lidt','star','A little','Tried it a few times')}`;
  else if(ob.step === 3) body = `<h2>Where will you train?</h2>
    ${opt('place','hjem','home','At home','No equipment')}${opt('place','fitness','building','At the gym','Machines and weights')}${opt('place','begge','swap','Both','A bit of each')}`;
  else if(ob.step === 4) body = `<h2>How many days a week?</h2><p class="mut">Pick what you can realistically stick to. You can always change it.</p>
    <div class="daypick">${[2,3,4].map(n=>`<button class="${ob.days===n?'on':''}" onclick="ob.days=${n};render()">${n}<small>days</small></button>`).join('')}</div>
    <p class="small mut" style="margin-top:12px">${ob.days===2?'Great for a busy week.':ob.days===3?'Recommended for beginners.':'For you who want fast progress.'} Each workout takes about 30 min.</p>
    <div style="flex:1"></div>
    <button class="btn pri block" onclick="ob.step=5;render()">See my program</button>`;
  else return renderRecommendation(app);
  app.innerHTML = `<div class="wrap ob"><div class="row" style="min-height:44px">${back}</div>${dots}${body}</div>`;
}
function obPick(k,v){ ob[k] = v; render(); setTimeout(()=>{ ob.step++; render() }, 180) }
function recommend(){
  const premiumPick = ob.place === 'fitness' || ob.place === 'begge' ? (ob.experience === 'lidt' ? 'gym' : 'maskine') : (ob.experience==='lidt' ? 'haandvaegt' : null);
  return {free:'hjem', premium:premiumPick};
}
function renderRecommendation(app){
  const r = recommend(), p = prog(r.free), pp = r.premium && prog(r.premium);
  app.innerHTML = `<div class="wrap ob"><div class="row" style="min-height:44px"><button class="iconbtn" onclick="ob.step=4;render()" aria-label="Back">${ic('chevL')}</button></div>
    <div class="dots"><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i><i class="d"></i></div>
    <span class="pill">${ic('target')} Your program</span>
    <h1 style="margin-top:10px">${esc(p.name)}</h1>
    <p class="mut">${esc(p.desc)}</p>
    <div class="grid3" style="margin:12px 0">
      <div class="stat"><span>Length</span><b>4 weeks</b></div>
      <div class="stat"><span>Per week</span><b>${ob.days} days</b></div>
      <div class="stat"><span>Per workout</span><b>${p.minutes} min</b></div>
    </div>
    <div class="card small"><b>How it works</b><p class="mut" style="margin-top:4px">Do the exercises in order. Tap the check mark after each set – the rest timer starts by itself. The app remembers everything and tells you when to make it harder.</p></div>
    ${pp ? `<p class="small mut">${ic('crown','sm')} If you train at the gym, <b class="neon">${esc(pp.name)}</b> (Premium) is a great next step later.</p>` : ''}
    <div class="warnline" style="margin:8px 0 14px">${ic('alert')}<span>Stop if it hurts. Ask a doctor if you're ill or injured. LIFT does not give medical advice.</span></div>
    <div style="flex:1"></div>
    <button class="btn pri block" onclick="finishOnboarding(true)">${ic('play')} Start first workout</button>
    <button class="btn ghost block" onclick="finishOnboarding(false)">Go to home screen</button>
  </div>`;
}
function finishOnboarding(start){
  Object.assign(S.profile, {onboarded:true, goal:ob.goal||'form', experience:ob.experience||'aldrig', place:ob.place||'hjem', daysPerWeek:ob.days, activeProgram:'hjem'});
  ob = null; save(); track('onboarding-done');
  if(start) startWorkout(); else go('home');
  setTimeout(()=>showInstall(), 4000);
}

/* ============================== HJEM ============================== */
function weeksBar(idx){
  const d = dpw(), cur = Math.min(CONFIG.weeks-1, Math.floor(idx/d));
  return `<div class="weeks">${Array.from({length:CONFIG.weeks},(_,w)=>`<div><div class="wk ${w===cur?'cur':''}">${Array.from({length:d},(_,k)=>{ const i = w*d+k; return `<i class="${i<idx?'d':i===idx?'n':''}"></i>` }).join('')}</div><div class="lbl">Week ${w+1}</div></div>`).join('')}</div>`;
}
function statusLine(idx){
  const t = total(), shown = Math.min(idx+1, t), week = Math.min(CONFIG.weeks, Math.floor(Math.min(idx, t-1)/dpw())+1);
  return `<div class="status"><span>Workout ${shown} of ${t}</span><span class="neon">Week ${week} of ${CONFIG.weeks}</span></div>`;
}
function backupDue(){
  if(!S.logs.length) return false;
  const now = Date.now(), last = S.profile.lastBackup ? new Date(S.profile.lastBackup).getTime() : 0, snooze = S.profile.backupSnooze || 0;
  return now - last > 14*DAY && now - snooze > 3*DAY && (last || S.logs.length >= 2);
}
function renderHome(app){
  const p = prog(S.profile.activeProgram), idx = progressOf(p.id), done = idx >= total();
  const pl = planFor(p, Math.min(idx, total()-1));
  const first = !S.logs.length;
  app.innerHTML = `<div class="wrap">
    ${header(logoHTML(), saveChip())}
    ${S.current ? `<div class="card" style="border-color:var(--neon)"><div class="banner"><span class="bi">${ic('pause')}</span><div class="grow"><h3 style="margin:0">Workout paused</h3><p class="small mut">${esc(prog(S.current.p)?.name)} · ${esc(S.current.dayName||'')} – your sets are saved.</p></div></div><button class="btn pri block" style="margin-top:10px" onclick="go('workout')">${ic('play')} Continue workout</button></div>` : ''}
    ${backupDue() ? `<div class="card"><div class="banner"><span class="bi">${ic('shield')}</span><div class="grow"><b>Back up your workouts</b><p class="small mut">Your data is only stored on this phone. ${S.profile.lastBackup ? 'Last backup: ' + dk(S.profile.lastBackup) + '.' : 'You have not made a backup yet.'} It takes 5 seconds.</p></div></div>
      <div class="grid2" style="margin-top:10px"><button class="btn sm" onclick="S.profile.backupSnooze=Date.now();save();render()">Later</button><button class="btn sm pri" onclick="exportJSON()">${ic('download','sm')} Save backup</button></div></div>` : ''}
    <div class="card">
      <div class="row between wrapf"><span class="pill">${ic('layers')} ${esc(p.level)}</span><span class="xs mut">${esc(p.place)}</span></div>
      <h2 style="margin-top:10px">${esc(p.name)}</h2>
      ${statusLine(idx)}
      ${weeksBar(idx)}
      ${done ? programDoneHTML(p) : `
      <p class="small" style="margin:12px 0 2px"><b class="neon">Week ${pl.week}: ${esc(pl.wk.focus||'')}</b> <span class="mut">– ${esc(pl.wk.tip||'')}</span></p>
      <h3 style="margin:12px 0 2px">${first ? 'Your first workout' : 'Next workout'}: ${esc(pl.day.n)}</h3>
      <p class="small mut" style="margin:0 0 12px">${pl.ex.length} exercises · about ${p.minutes} min · ${pl.ex.map(e=>esc(EX[e.id].n)).join(', ')}</p>
      ${S.current ? '' : `<button class="btn pri block" onclick="startWorkout()">${ic('play')} ${first ? 'Start your first workout' : 'Start workout'}</button>`}`}
    </div>
    ${first ? `<div class="card how"><b>How a workout works</b><ol class="small"><li>Warm up for 4 min (we show you how).</li><li>Do the exercises. Tap ${ic('check','sm')} after each set.</li><li>Rest while the timer counts down.</li><li>Stretch – and see your progress.</li></ol></div>` : `
    <div class="card">
      <div class="row between"><h3 style="margin:0">This week</h3><span class="small"><b class="neon">${thisWeekCount()}</b> <span class="mut">of ${dpw()} workouts</span></span></div>
      ${weekDaysHTML()}
    </div>
    <div class="grid2">
      <div class="stat"><span>${ic('flame','sm')} Week streak</span><b>${weekStreak()}</b><span class="xs">${Math.max(1,dpw()-1)} workouts = the week counts</span></div>
      <div class="stat"><span>${ic('trophy','sm')} Total workouts</span><b>${S.logs.length}</b><span class="xs">Last: ${dk(S.logs[S.logs.length-1].d)}</span></div>
    </div>`}
    ${!isPremium() ? `<button class="card prog" style="background:linear-gradient(135deg,#132219,#171c19)" onclick="openPremium('home-card')">
      <div class="banner"><span class="bi">${ic('crown')}</span><div class="grow"><b>LIFT Premium</b><p class="small mut">More programs, tailored to your equipment, and advanced stats.</p><span class="small neon"><b>See Premium – from ${Math.round(CONFIG.priceYear/12)} ${CONFIG.currency}/mo</b></span></div>${ic('chevR')}</div></button>` : ''}
  </div>`;
}
function programDoneHTML(p){
  return `<div class="center" style="padding:10px 0 4px"><div class="badge-big">${ic('trophy')}</div><h2>You did it!</h2>
    <p class="mut">All ${total()} workouts in ${esc(p.name)} are done. Here is your progress:</p></div>
    ${progressCompare(p.id)}
    <button class="btn pri block" style="margin-top:12px" onclick="repeatProgram()">${ic('repeat')} Repeat the program – a bit harder</button>
    <button class="btn block" style="margin-top:10px" onclick="openPremium('program-done')">${ic('crown')} Try the next level (Premium)</button>`;
}
function progressCompare(pid){
  const logs = S.logs.filter(l => l.p === pid), ids = [...new Set(logs.flatMap(l=>l.ex.map(e=>e.id)))];
  const rows = ids.map(id => { const h = exHistory(id).filter(x => logs.some(l=>l.id===x.log)); if(h.length < 2) return '';
    const x = EX[id], a = bestOf(x,h[0].sets), b = bestOf(x,h[h.length-1].sets), d = b - a;
    return `<div class="row between" style="padding:8px 0;border-top:1px solid var(--line)"><span class="small">${esc(x.n)}</span><span class="small"><span class="mut">${fmt(a)} → </span><b>${fmt(b)} ${unit(x)}</b> ${d>0?`<span class="neon">+${fmt(d)}</span>`:''}</span></div>` }).join('');
  return rows ? `<div class="card" style="margin:8px 0">${rows}</div>` : '';
}
function repeatProgram(){
  const p = S.profile.activeProgram;
  S.profile.cycles[p] = (S.profile.cycles[p]||0) + 1; S.profile.progress[p] = 0;
  save(); toast('New round! A few more reps this time.'); go('home');
}

/* ============================== PROGRAMMER ============================== */
function renderPrograms(app){
  app.innerHTML = `<div class="wrap">
    ${header(`<h1>Programs</h1>`, saveChip())}
    <p class="mut small">Every program lasts 4 weeks with ${dpw()} workouts a week. Tap to see what's inside.</p>
    ${PROGRAMS.map(p => { const locked = !p.free && !isPremium(), act = S.profile.activeProgram===p.id, idx = progressOf(p.id);
      return `<button class="card prog ${act?'active':''}" onclick="openProgram('${p.id}')">
        <div class="row between wrapf"><div class="row wrapf" style="gap:6px"><span class="pill grey">${esc(p.level)}</span>${p.free ? '<span class="pill">Free</span>' : locked ? `<span class="pill lock">${ic('lock')} Premium</span>` : ''}</div>${act ? `<span class="pill">${ic('check')} Active</span>` : ''}</div>
        <h3 style="margin-top:10px">${esc(p.name)}</h3>
        <p class="small mut" style="margin:0">${esc(p.desc)}</p>
        <p class="small" style="margin:8px 0 0">${ic('box','sm')} ${esc(p.equip)} · ${ic('clock','sm')} ${p.minutes} min${idx ? ` · <span class="neon">${idx}/${total()} workouts</span>` : ''}</p>
      </button>` }).join('')}
  </div>`;
}
function openProgram(id){
  const p = prog(id), locked = !p.free && !isPremium();
  modal(`<div class="row between"><span class="pill grey">${esc(p.level)} · ${esc(p.place)}</span><button class="iconbtn" onclick="closeModal()" aria-label="Close">${ic('x')}</button></div>
    <h2 style="margin-top:10px">${esc(p.name)}</h2><p class="mut">${esc(p.desc)}</p>
    <div class="card"><b>How you improve in 4 weeks</b>${p.weeks.map((w,i)=>`<div class="row" style="padding:8px 0;border-top:1px solid var(--line);align-items:flex-start"><span class="pill" style="min-width:58px;justify-content:center">Week ${i+1}</span><span class="small"><b>${esc(w.focus)}</b><br><span class="mut">${esc(w.tip)}</span></span></div>`).join('')}</div>
    ${p.days.map(d => `<div class="card"><h3>${esc(d.n)}</h3>${d.ex.map(([id0,s,r]) => { const id = resolve(id0), x = EX[id];
      return `<button class="row between link" style="width:100%;color:var(--txt);border-top:1px solid var(--line);font-weight:600" onclick="showExercise('${id}')"><span>${esc(x.n)}${id!==id0?' <span class="pill">adapted</span>':''}</span><span class="mut small">${s} × ${r} ${x.t==='s'?'sec':''} ${ic('chevR','sm')}</span></button>` }).join('')}</div>`).join('')}
    ${locked ? `<button class="btn pri block" onclick="openPremium('program-${id}')">${ic('lock')} Unlock with Premium</button>`
      : S.profile.activeProgram===id ? `<button class="btn block" disabled>This is your active program</button>`
      : `<button class="btn pri block" onclick="setActive('${id}')">Choose this program</button>`}`);
}
function setActive(id){
  if(S.current){ S.current = null; stopRest() }
  S.profile.activeProgram = id; save(); toast('Program selected'); go('home');
}
function showExercise(id){
  const x = EX[id], h = exHistory(id);
  const best = h.length ? Math.max(...h.map(y=>bestOf(x,y.sets))) : null;
  modal(`<div class="row between"><h2 style="margin:0">${esc(x.n)}</h2><button class="iconbtn" onclick="closeModal()" aria-label="Close">${ic('x')}</button></div>
    <div class="demo" style="margin-top:12px">${x.video ? `<video src="${esc(x.video)}" autoplay loop muted playsinline></video>` : `<span class="badge">ANIMATION</span>${demoSVG(id)}`}</div>
    <p class="small center neon" style="margin:8px 0 0">${ic('clock','sm')} ${tempoText(id)}</p>
    <h3 style="margin-top:14px">How to do it</h3>
    <ol class="cue">${x.cue.map(c=>`<li>${esc(c)}</li>`).join('')}</ol>
    <div class="grid2"><div class="stat"><span>Equipment</span><b style="font:700 15px Inter;color:var(--txt)">${x.needs.length ? x.needs.map(n=>UDSTYR[n]).join(', ') : 'None'}</b></div>
    <div class="stat"><span>Your record</span><b>${best!==null ? fmt(best)+' '+unit(x) : '–'}</b></div></div>
    <div class="warnline" style="margin-top:12px">${ic('alert')}<span>Stop if it hurts. Ask a doctor if you're ill or injured.</span></div>`);
}

/* ============================== TRÆNING ============================== */
let lastPop = null;
function startWorkout(){
  const p = prog(S.profile.activeProgram), idx = progressOf(p.id);
  if(idx >= total()){ go('home'); return }
  const pl = planFor(p, idx);
  S.current = {p:p.id, idx, dayName:pl.day.n, start:Date.now(), warm:[], cool:[], ex: pl.ex.map(e => {
    const sg = suggest(e.id, e.target);
    return {id:e.id, target:e.target, note:sg.note, cls:sg.cls, last:lastText(e.id), sets:Array.from({length:e.sets}, () => ({w:sg.w, r:sg.r, done:false}))};
  })};
  save(); go('workout');
}
function renderWorkout(app){
  const c = S.current; if(!c){ view='home'; return render() }
  const p = prog(c.p), week = Math.min(CONFIG.weeks, Math.floor(c.idx/dpw())+1), wk = p.weeks[week-1] || {};
  const doneSets = c.ex.reduce((a,e)=>a+e.sets.filter(s=>s.done).length,0), allSets = c.ex.reduce((a,e)=>a+e.sets.length,0);
  const firstEver = !S.logs.length;
  const checklist = (list, key) => `<div class="checklist">${list.map((it,i)=>`<button class="${c[key].includes(i)?'on':''}" onclick="tick('${key}',${i})"><span class="box">${c[key].includes(i)?ic('check','sm'):''}</span><span class="t">${esc(it.n)}</span><span class="sek">${it.sek>=60?Math.round(it.sek/60)+' min':it.sek+' sec'}</span></button>`).join('')}</div>`;
  const mins = l => Math.round(l.reduce((a,b)=>a+b.sek,0)/60);
  app.innerHTML = `<div class="wrap" style="padding-bottom:140px">
    ${header(`<button class="iconbtn back" onclick="pauseWorkout()" aria-label="Pause and go back">${ic('chevL')}</button><div class="grow" style="min-width:0"><h1 style="font-size:21px;margin:0">${esc(p.name)} · ${esc(c.dayName)}</h1><div class="xs mut">Workout ${c.idx+1} of ${total()} · Week ${week} of ${CONFIG.weeks}</div></div>`, '')}
    <div style="height:8px;border-radius:9px;background:var(--line);overflow:hidden" role="progressbar" aria-valuenow="${doneSets}" aria-valuemax="${allSets}"><div style="height:100%;width:${allSets?doneSets/allSets*100:0}%;background:var(--neon);transition:width .3s"></div></div>
    <p class="xs mut" style="margin:6px 0 0">${doneSets} of ${allSets} sets · <b class="neon">Week ${week}: ${esc(wk.focus||'')}</b></p>
    ${firstEver ? `<div class="card how small"><b>How it works</b><ol><li>Do the number of reps shown (e.g. 10).</li><li>Tap ${ic('check','sm')} – your rest timer starts.</li><li>Did more or fewer? Fix the number with − / +.</li></ol></div>` : ''}
    <details class="card fold" ${c.warm.length < OPVARMNING.length && doneSets===0 ? 'open' : ''}><summary><span class="bi" style="color:var(--neon)">${ic('flame')}</span><b>Warm-up · ${mins(OPVARMNING)} min</b><span class="xs mut">${c.warm.length}/${OPVARMNING.length}</span>${ic('chevR','chev')}</summary>${checklist(OPVARMNING,'warm')}</details>
    ${c.ex.map((e,i) => { const x = EX[e.id], all = e.sets.every(s=>s.done);
      return `<section class="ex ${all?'alldone':''}" aria-label="${esc(x.n)}">
        <div class="hd"><div class="grow"><h3 style="margin:0">${esc(x.n)}</h3><div class="meta">${e.sets.length} ${e.sets.length===1?'set':'sets'} × ${e.target} ${x.t==='s'?'sec':'reps'} · rest ${restFor(e.id)} sec</div></div>
          <button class="btn sm" onclick="showExercise('${e.id}')" aria-label="See how to do ${esc(x.n)}">${ic('play','sm')} Watch</button></div>
        ${e.last ? `<div class="last">${ic('clock','sm')} ${esc(e.last)}</div>` : ''}
        <div class="sug ${e.cls}">${ic(e.cls==='down'?'info':e.cls?'target':'bolt','sm')}<span>${esc(e.note)}</span></div>
        ${e.sets.map((s,j) => `<div class="set ${x.t==='w'?'wt':''} ${s.done?'done':''} ${lastPop===i+'-'+j?'pop':''}">
          <span class="n">${j+1}</span>
          <div class="vals">${x.t==='w' ? stepper(i,j,'w',s.w,'kg') : ''}${stepper(i,j,'r',s.r, x.t==='s'?'sec':'reps')}</div>
          <button class="chk" aria-label="Set ${j+1} done" aria-pressed="${s.done}" onclick="toggleSet(${i},${j})">${ic('check')}</button>
        </div>`).join('')}
      </section>` }).join('')}
    <details class="card fold" ${doneSets===allSets?'open':''}><summary><span style="color:var(--neon)">${ic('heart')}</span><b>Cool-down · ${mins(NEDKOELING)} min</b><span class="xs mut">${c.cool.length}/${NEDKOELING.length}</span>${ic('chevR','chev')}</summary>${checklist(NEDKOELING,'cool')}</details>
    <div class="warnline">${ic('alert')}<span>Stop if it hurts. Ask a doctor if you're ill or injured.</span></div>
    <button class="btn pri block" onclick="finishWorkout()" style="margin-top:14px">${ic('check')} Finish workout</button>
    <div class="grid2" style="margin-top:10px"><button class="btn sm" onclick="pauseWorkout()">${ic('pause','sm')} Continue later</button><button class="btn sm danger" onclick="cancelWorkout()">${ic('x','sm')} Cancel</button></div>
  </div>`;
  lastPop = null;
}
function stepper(i,j,k,v,lbl){
  const val = k==='w' ? fmt(v) : v;
  return `<div class="stepper"><button onclick="step(${i},${j},'${k}',-1)" aria-label="Less ${lbl}">−</button><div class="v"><input inputmode="decimal" value="${val}" aria-label="${lbl}" onfocus="this.select()" onchange="setVal(${i},${j},'${k}',this.value)"><small>${lbl}</small></div><button onclick="step(${i},${j},'${k}',1)" aria-label="More ${lbl}">+</button></div>`;
}
function step(i,j,k,d){
  const e = S.current.ex[i], x = EX[e.id], s = e.sets[j];
  const inc = k==='w' ? x.inc : (x.t==='s' ? 5 : 1);
  s[k] = Math.max(0, Math.round((s[k] + d*inc)*10)/10);
  if(k==='w') e.sets.forEach((y,n)=>{ if(n>j && !y.done) y.w = s.w }); // vægt følger med til de næste sæt
  save(); render();
}
function setVal(i,j,k,v){
  const n = parseFloat(String(v).replace(',','.'));
  if(!isNaN(n)){ const e = S.current.ex[i]; e.sets[j][k] = Math.max(0, Math.min(k==='w'?500:999, n)); if(k==='w') e.sets.forEach((y,m)=>{ if(m>j && !y.done) y.w = e.sets[j].w }); save() }
  render();
}
function tick(key,i){ const a = S.current[key]; const k = a.indexOf(i); k>=0 ? a.splice(k,1) : a.push(i); save(); render() }
function toggleSet(i,j){
  ensureAudio();
  const e = S.current.ex[i], s = e.sets[j];
  s.done = !s.done; lastPop = s.done ? i+'-'+j : null; save();
  if(s.done){
    vibrate(25);
    const isLast = S.current.ex.every(x=>x.sets.every(y=>y.done));
    if(!isLast) startRest(restFor(e.id)); else { stopRest(); toast('All sets done! Stretch and tap Finish.') }
  }
  render();
}
function pauseWorkout(){ stopRest(); save(); go('home'); toast('Workout saved – continue whenever you like') }
function cancelWorkout(){
  modal(`<h2>Cancel the workout?</h2><p class="mut">Today's sets will not be saved. If you'd rather continue later, tap "Continue later".</p>
    <div class="grid2"><button class="btn" onclick="closeModal()">Back</button><button class="btn danger" onclick="S.current=null;stopRest();save();go('home')">Cancel workout</button></div>`);
}
function finishWorkout(){
  const c = S.current;
  const ex = c.ex.map(e => ({id:e.id, target:e.target, sets:e.sets.filter(s=>s.done).map(s=>({w:s.w, r:s.r}))})).filter(e=>e.sets.length);
  if(!ex.length){ toast('Tick off at least one set first'); return }
  const missing = c.ex.reduce((a,e)=>a+e.sets.filter(s=>!s.done).length,0);
  if(missing && !finishWorkout.ok){ finishWorkout.ok = true;
    modal(`<h2>Finish now?</h2><p class="mut">You have ${missing} sets left. That's totally fine – everything you did will be saved.</p><div class="grid2"><button class="btn" onclick="finishWorkout.ok=false;closeModal()">Keep going</button><button class="btn pri" onclick="closeModal();finishWorkout()">Finish</button></div>`); return }
  finishWorkout.ok = false;
  // rekorder: sammenlign med tidligere
  const prs = [];
  ex.forEach(e => { const x = EX[e.id], h = exHistory(e.id); if(!h.length) return;
    const prev = Math.max(...h.map(y=>bestOf(x,y.sets))), now = bestOf(x,e.sets);
    if(now > prev) prs.push({n:x.n, v:`${fmt(now)} ${unit(x)}`, d:`before: ${fmt(prev)}`}) });
  const log = {id:newId(), d:new Date().toISOString(), p:c.p, idx:c.idx, min:Math.max(1, Math.round((Date.now()-c.start)/60000)), ex};
  S.logs.push(log);
  const t = total();
  S.profile.progress[c.p] = Math.min(t, c.idx + 1);
  const next = ex.map(e => { const x = EX[e.id]; if(!e.sets.every(s=>s.r>=e.target)) return null;
    return {n:x.n, txt: x.t==='w' ? `+${fmt(x.inc)} kg → ${fmt(Math.max(...e.sets.map(s=>s.w)) + x.inc)} kg` : x.t==='s' ? '+5 sec' : '+1–2 reps'} }).filter(Boolean);
  S.summary = {min:log.min, sets:ex.reduce((a,e)=>a+e.sets.length,0), vol:Math.round(ex.reduce((a,e)=>a+e.sets.reduce((b,s)=>b+s.w*s.r,0),0)),
    prs, next, ros:ROS[Math.floor(Math.random()*ROS.length)], idx:c.idx, total:t, programDone: c.idx + 1 >= t, p:c.p, first:S.logs.length===1};
  S.current = null; stopRest(); save();
  track('workout-complete');
  const newIdx = c.idx + 1;
  if(newIdx >= dpw()) trackOnce('reached-week-2');
  if(newIdx >= 3*dpw()) trackOnce('reached-week-4');
  if(newIdx >= t) track('program-complete');
  go('done');
}
function renderDone(app){
  const s = S.summary; if(!s){ view='home'; return render() }
  const p = prog(s.p);
  app.innerHTML = `<div class="wrap" style="padding-top:var(--top)">
    <div class="done-hero"><div class="badge-big">${ic(s.programDone?'trophy':'check')}</div>
      <h1>${s.programDone ? 'You did it!' : esc(s.ros)}</h1>
      <p class="mut">${s.programDone ? `You finished all of ${esc(p.name)}. Amazing!` : s.first ? 'Your first workout is done. The hardest part is behind you!' : `Workout ${s.idx+1} of ${s.total} done.`}</p></div>
    <div class="grid3"><div class="stat"><span>Time</span><b>${s.min} min</b></div><div class="stat"><span>Sets</span><b>${s.sets}</b></div><div class="stat"><span>Records</span><b>${s.prs.length}</b></div></div>
    ${s.prs.length ? `<h3 style="margin-top:18px">New records</h3>${s.prs.map(r=>`<div class="pr">${ic('trophy')}<span class="grow"><b>${esc(r.n)}</b><br><span class="xs mut">${esc(r.d)}</span></span><b>${esc(r.v)}</b></div>`).join('')}` : ''}
    ${s.next.length ? `<div class="card"><h3>${ic('target','sm')} Next time</h3><p class="small mut" style="margin-top:0">You hit every set in these exercises, so we'll make it a bit harder:</p>${s.next.map(n=>`<div class="row between" style="padding:8px 0;border-top:1px solid var(--line)"><span class="small">${esc(n.n)}</span><b class="small neon">${esc(n.txt)}</b></div>`).join('')}</div>`
      : `<div class="card small mut">Next time, aim to hit every rep in every set. Then we'll level up.</div>`}
    ${s.programDone ? `${progressCompare(s.p)}<button class="btn pri block" onclick="repeatProgram()">${ic('repeat')} Repeat the program – a bit harder</button><button class="btn block" style="margin-top:10px" onclick="openPremium('program-done')">${ic('crown')} Try the next level (Premium)</button>` : ''}
    <button class="btn ${s.programDone?'':'pri'} block" style="margin-top:12px" onclick="S.summary=null;save();go('home')">Save and close</button>
  </div>`;
}

/* ============================== PAUSETIMER ============================== */
let rest = null, restInt = null, audioCtx = null;
function ensureAudio(){ try{ if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended') audioCtx.resume() }catch(e){} }
function beep(f=880, d=.15, when=0){ if(!audioCtx || !S.profile.sound) return; try{ const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.frequency.value=f; o.connect(g); g.connect(audioCtx.destination); const t=audioCtx.currentTime+when; g.gain.setValueAtTime(.25,t); g.gain.exponentialRampToValueAtTime(.001,t+d); o.start(t); o.stop(t+d) }catch(e){} }
function vibrate(p){ try{ navigator.vibrate && navigator.vibrate(p) }catch(e){} }
function startRest(sec){ rest = {end:Date.now()+sec*1000, total:sec, fin:false}; clearInterval(restInt); restInt = setInterval(tickRest, 250); renderRestBar() }
function stopRest(){ rest = null; clearInterval(restInt); renderRestBar() }
const restLeft = () => rest ? Math.max(0, Math.ceil((rest.end - Date.now())/1000)) : 0;
const mmss = s => Math.floor(s/60) + ':' + String(s%60).padStart(2,'0');
function tickRest(){
  if(!rest) return;
  const l = restLeft();
  if(rest.fin) return;
  if(l <= 3 && l > 0 && !rest['w'+l]){ rest['w'+l] = 1; beep(660,.1) }
  if(l === 0){ rest.fin = true; beep(990,.25); beep(990,.35,.3); vibrate([200,100,200]); renderRestBar(); clearInterval(restInt); setTimeout(()=>{ if(rest && rest.fin) stopRest() }, 4000); return }
  const t = $('#restT'); if(t){ t.textContent = mmss(l); $('#restB').style.width = (l/rest.total*100)+'%' } else renderRestBar();
}
function adjRest(d){ if(!rest || rest.fin) return; rest.end = Math.max(Date.now()+1000, rest.end + d*1000); rest.total = Math.max(rest.total, restLeft()); tickRest() }
function renderRestBar(){
  const b = $('#restbar');
  if(!rest){ b.innerHTML = ''; return }
  if(rest.fin){ b.innerHTML = `<div class="restbar"><div class="in fin row" onclick="stopRest()" role="alert"><span class="t">Go!</span><b class="grow">Time for your next set</b>${ic('check')}</div></div>`; return }
  const bottom = view==='workout' ? '' : 'style="bottom:calc(74px + var(--bot))"';
  b.innerHTML = `<div class="restbar" ${bottom}><div class="in row" role="timer" aria-live="off">
    <div class="grow"><div class="xs mut">${ic('timer','sm')} Rest</div><span class="t" id="restT">${mmss(restLeft())}</span></div>
    <button class="btn sm" onclick="adjRest(15)" aria-label="15 seconds more">+15</button>
    <button class="btn sm pri" onclick="stopRest()">${ic('skip','sm')} Skip</button>
    <div class="bar" id="restB" style="width:${restLeft()/rest.total*100}%"></div></div></div>`;
}

/* ============================== FREMGANG ============================== */
let chartEx = null;
const exercisesLogged = () => [...new Set(S.logs.flatMap(l=>l.ex.map(e=>e.id)))];
function prList(){
  return exercisesLogged().map(id => { const x = EX[id], h = exHistory(id), b = Math.max(...h.map(y=>bestOf(x,y.sets)));
    let e1 = 0; if(x.t==='w') h.forEach(y=>y.sets.forEach(s=>{ e1 = Math.max(e1, s.w*(1+s.r/30)) }));
    return {id, n:x.n, v:fmt(b)+' '+unit(x), e1: x.t==='w' ? fmt(Math.round(e1*2)/2)+' kg' : ''} });
}
function prHistory(){ // alle rekorder i rækkefølge (Premium)
  const out = [], best = {};
  [...S.logs].sort((a,b)=>a.d<b.d?-1:1).forEach(l => l.ex.forEach(e => { const x = EX[e.id], v = bestOf(x,e.sets);
    if(best[e.id] !== undefined && v > best[e.id]) out.push({d:l.d, n:x.n, v:fmt(v)+' '+unit(x)});
    best[e.id] = Math.max(best[e.id] ?? -1, v) }));
  return out.reverse();
}
function renderProgress(app){
  const ids = exercisesLogged();
  if(!chartEx || !ids.includes(chartEx)) chartEx = ids[0];
  if(!S.logs.length){
    app.innerHTML = `<div class="wrap">${header(`<h1>Progress</h1>`, saveChip())}
      <div class="card center" style="padding:28px 18px"><div class="badge-big">${ic('chart')}</div><h2>Start your first workout</h2>
      <p class="mut">It takes about 30 min. Afterwards you'll see your records, your training days and a chart for each exercise here.</p>
      <button class="btn pri block" onclick="${S.current?"go('workout')":'startWorkout()'}">${ic('play')} ${S.current?'Continue workout':'Start workout'}</button></div></div>`;
    return;
  }
  const x = EX[chartEx], h = exHistory(chartEx);
  const d = h.length >= 2 ? bestOf(x,h[h.length-1].sets) - bestOf(x,h[0].sets) : null;
  app.innerHTML = `<div class="wrap">
    ${header(`<h1>Progress</h1>`, saveChip())}
    <div class="grid3"><div class="stat"><span>Workouts</span><b>${S.logs.length}</b></div><div class="stat"><span>Week streak</span><b>${weekStreak()}</b></div><div class="stat"><span>This week</span><b>${thisWeekCount()}/${dpw()}</b></div></div>
    <div class="card"><h3 style="margin:0">This week</h3>${weekDaysHTML()}</div>
    <div class="card"><label class="small mut" for="exsel">Choose exercise</label>
      <select id="exsel" class="txt" onchange="chartEx=this.value;render()" style="margin-top:6px">${ids.map(i=>`<option value="${i}" ${i===chartEx?'selected':''}>${esc(EX[i].n)}</option>`).join('')}</select>
      <h3 style="margin:14px 0 4px">${x.t==='w' ? 'Heaviest set (kg)' : x.t==='s' ? 'Longest hold (sec)' : 'Most reps'}</h3>
      ${h.length >= 2 ? `<canvas id="ch1" height="200" aria-label="Progress chart"></canvas><p class="small">Since you started: <b class="neon">${d>=0?'+':''}${fmt(d)} ${unit(x)}</b> over ${h.length} workouts</p>`
        : `<p class="small mut">Do this exercise once more and we'll draw your chart. First time: <b class="neon">${fmt(bestOf(x,h[0].sets))} ${unit(x)}</b></p>`}
    </div>
    <div class="card"><h3>${ic('trophy','sm')} Your records</h3>${prList().map(p=>`<div class="row between" style="padding:8px 0;border-top:1px solid var(--line)"><span class="small">${esc(p.n)}</span><b class="neon small">${p.v}</b></div>`).join('')}</div>
    <div class="card"><h3>Recent workouts</h3>${S.logs.slice(-5).reverse().map(l => `<div class="list-log"><div class="row between"><b>${dk(l.d)}</b><span class="xs mut">${esc(prog(l.p)?.name||'')} · ${l.min||'?'} min</span></div>
      <div class="xs mut">${l.ex.map(e=>`${esc(EX[e.id].n)}: ${e.sets.map(s=>EX[e.id].t==='w'?`${fmt(s.w)}×${s.r}`:s.r).join(', ')}`).join('<br>')}</div></div>`).join('')}</div>
    <div class="${isPremium()?'':'locked'}"><div class="${isPremium()?'':'blur'}" ${isPremium()?'':'aria-hidden="true"'}>${premiumStatsHTML()}</div>
      ${isPremium() ? '' : `<div class="veil"><span class="pill lock">${ic('lock')} Premium</span><h3>Advanced stats</h3><p class="small mut" style="margin:0">Weekly volume, estimated max lift, record history and export to spreadsheet/PDF.</p><button class="btn pri" onclick="openPremium('stats')">See Premium</button></div>`}
    </div>
  </div>`;
  if(h.length >= 2) drawLine($('#ch1'), h.map(y => ({x:y.d, y:bestOf(x,y.sets)})));
  if(isPremium()) drawBars($('#ch2'), weeklyVolume());
}
const anyKg = () => S.logs.some(l=>l.ex.some(e=>EX[e.id].t==='w'));
function weeklyVolume(){
  const out = [], kg = anyKg();
  for(let i=7;i>=0;i--){ const ws = weekStart(Date.now()) - i*7*DAY;
    const v = S.logs.filter(l => weekStart(l.d) === ws).reduce((a,l)=>a+l.ex.reduce((b,e)=>b+e.sets.reduce((c,s)=>c+(kg ? (EX[e.id].t==='w'?s.w*s.r:0) : (EX[e.id].t==='bw'?s.r:0)),0),0),0);
    out.push({x: i===0 ? 'Now' : '-'+i, y:Math.round(v)}) }
  return out;
}
function premiumStatsHTML(){
  const ph = prHistory().slice(0,8);
  return `<div class="card"><h3>Advanced stats</h3>
    <h3 class="small" style="margin-top:10px">${anyKg() ? 'Weekly volume (kg lifted)' : 'Reps per week'}</h3><canvas id="ch2" height="160"></canvas>
    <h3 class="small" style="margin-top:16px">Estimated max lift (1RM)</h3>
    ${prList().filter(p=>p.e1).map(p=>`<div class="row between" style="padding:6px 0;border-top:1px solid var(--line)"><span class="small">${esc(p.n)}</span><b class="small">${p.e1}</b></div>`).join('') || '<p class="xs mut">Shows up once you lift with weights.</p>'}
    <h3 class="small" style="margin-top:16px">Record history</h3>
    ${ph.map(r=>`<div class="row between" style="padding:6px 0;border-top:1px solid var(--line)"><span class="small">${dk(r.d)} · ${esc(r.n)}</span><b class="small neon">${r.v}</b></div>`).join('') || '<p class="xs mut">Your new records will show up here.</p>'}
    <div class="grid2" style="margin-top:14px"><button class="btn sm" onclick="exportCSV()">${ic('file','sm')} Spreadsheet (CSV)</button><button class="btn sm" onclick="exportPDF()">${ic('file','sm')} PDF report</button></div>
  </div>`;
}
function setupCanvas(cv){ const dpr = window.devicePixelRatio||1, w = cv.clientWidth, h = +cv.getAttribute('height'); cv.width = w*dpr; cv.height = h*dpr; cv.style.height = h+'px'; const c = cv.getContext('2d'); c.scale(dpr,dpr); return [c,w,h] }
function drawLine(cv, pts){
  if(!cv || !pts.length) return; const [c,w,h] = setupCanvas(cv);
  const pad = {l:38,r:12,t:12,b:26}, ys = pts.map(p=>p.y);
  let mn = Math.min(...ys), mx = Math.max(...ys); if(mn===mx){ mn -= 1; mx += 1 } const span = mx-mn; mn -= span*.12; mx += span*.12;
  const X = i => pad.l + (pts.length===1 ? (w-pad.l-pad.r)/2 : i*(w-pad.l-pad.r)/(pts.length-1)), Y = v => pad.t + (1-(v-mn)/(mx-mn))*(h-pad.t-pad.b);
  c.font = '600 11px Inter, sans-serif'; c.fillStyle = '#a9b6af'; c.strokeStyle = '#2a342f'; c.lineWidth = 1;
  for(let i=0;i<=3;i++){ const v = mn + (mx-mn)*i/3, y = Y(v); c.beginPath(); c.moveTo(pad.l,y); c.lineTo(w-pad.r,y); c.stroke(); c.fillText(fmt(Math.round(v*10)/10), 2, y+4) }
  const stp = Math.ceil(pts.length/4); pts.forEach((p,i)=>{ if(i%stp===0 || i===pts.length-1) c.fillText(dk(p.x), Math.max(pad.l-10, Math.min(X(i)-14, w-46)), h-6) });
  const g = c.createLinearGradient(0,pad.t,0,h-pad.b); g.addColorStop(0,'rgba(57,255,122,.32)'); g.addColorStop(1,'rgba(57,255,122,0)');
  c.beginPath(); pts.forEach((p,i)=> i ? c.lineTo(X(i),Y(p.y)) : c.moveTo(X(i),Y(p.y))); c.lineTo(X(pts.length-1),h-pad.b); c.lineTo(X(0),h-pad.b); c.fillStyle = g; c.fill();
  c.beginPath(); pts.forEach((p,i)=> i ? c.lineTo(X(i),Y(p.y)) : c.moveTo(X(i),Y(p.y))); c.strokeStyle = '#39ff7a'; c.lineWidth = 3; c.lineJoin='round'; c.stroke();
  pts.forEach((p,i)=>{ c.beginPath(); c.arc(X(i),Y(p.y),4,0,7); c.fillStyle='#0b0d0c'; c.fill(); c.strokeStyle='#39ff7a'; c.lineWidth=2; c.stroke() });
}
function drawBars(cv, pts){
  if(!cv) return; const [c,w,h] = setupCanvas(cv);
  const pad = {l:4,r:4,t:16,b:20}, mx = Math.max(1,...pts.map(p=>p.y)), bw = (w-pad.l-pad.r)/pts.length;
  c.font = '600 11px Inter, sans-serif'; c.textAlign = 'center';
  pts.forEach((p,i)=>{ const bh = (p.y/mx)*(h-pad.t-pad.b), x = pad.l + i*bw + bw*.15, y = h-pad.b-bh;
    c.fillStyle = i===pts.length-1 ? '#39ff7a' : '#1f6b3b'; c.fillRect(x,y,bw*.7,Math.max(bh,2));
    c.fillStyle = '#a9b6af'; c.fillText(p.x, x+bw*.35, h-5); if(p.y) c.fillText(p.y>=1000 ? (p.y/1000).toFixed(1)+'t' : p.y, x+bw*.35, y-4) });
}

/* ============================== BACKUP, EKSPORT, KALENDER ============================== */
const today = () => new Date().toISOString().slice(0,10);
async function saveFile(name, text, mime){
  const blob = new Blob([text], {type:mime});
  try{ // iPhone: del-menuen lader dig gemme i Filer/iCloud
    const file = new File([blob], name, {type:mime});
    if(/iphone|ipad|android/i.test(navigator.userAgent) && navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file], title:name}); return true }
  }catch(e){ if(e && e.name === 'AbortError') return false }
  try{ const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href), 4000); return true }
  catch(e){ toast('Could not save the file'); return false }
}
async function exportJSON(){
  const data = {app:'LIFT', version:2, exported:new Date().toISOString(), profile:S.profile, logs:S.logs};
  const ok = await saveFile(`lift-backup-${today()}.json`, JSON.stringify(data), 'application/json');
  if(ok){ S.profile.lastBackup = new Date().toISOString(); save(); toast('Backup saved'); track('backup'); render() }
}
function importJSON(){
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
  inp.onchange = () => { const f = inp.files[0]; if(!f) return; const rd = new FileReader();
    rd.onload = () => { try{ const d = JSON.parse(rd.result); if(d.app !== 'LIFT' || !Array.isArray(d.logs) || !d.profile) throw 0;
        modal(`<h2>Restore backup?</h2><p class="mut">The backup from ${d.exported ? dkLong(d.exported) : 'an unknown date'} contains <b>${d.logs.length} workouts</b>. It replaces what is in the app now.</p>
          <div class="grid2"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn pri" id="doImp">Restore</button></div>`);
        $('#doImp').onclick = () => { S = Object.assign(blank(), {logs:d.logs, current:null}); S.profile = Object.assign(blankProfile(), d.profile); save(); closeModal(); toast('Backup restored'); go('home') };
      }catch(e){ toast('That file is not a valid LIFT backup') } };
    rd.readAsText(f) };
  inp.click();
}
function exportCSV(){
  if(!isPremium()) return openPremium('csv');
  const rows = [['date','program','workout','exercise','set','kg','reps/sec']];
  S.logs.forEach(l=>l.ex.forEach(e=>e.sets.forEach((s,i)=>rows.push([l.d.slice(0,10), prog(l.p)?.name||l.p, l.idx+1, EX[e.id].n, i+1, String(s.w), s.r]))));
  saveFile(`lift-${today()}.csv`, '﻿' + rows.map(r=>r.map(c=>/[,"\n]/.test(String(c)) ? '"'+String(c).replace(/"/g,'""')+'"' : c).join(',')).join('\n'), 'text/csv');
}
function exportPDF(){
  if(!isPremium()) return openPremium('pdf');
  $('#print').innerHTML = `<h1>LIFT – training report</h1><p>${dkLong(new Date())} · ${S.logs.length} workouts · ${weekStreak()} week streak</p>
    <h2>Records</h2><table><tr><th>Exercise</th><th>Best</th><th>Est. max</th></tr>${prList().map(p=>`<tr><td>${esc(p.n)}</td><td>${p.v}</td><td>${p.e1}</td></tr>`).join('')}</table>
    <h2>Workouts</h2><table><tr><th>Date</th><th>Program</th><th>Exercises</th></tr>${S.logs.map(l=>`<tr><td>${dk(l.d)}</td><td>${esc(prog(l.p)?.name||'')}</td><td>${l.ex.map(e=>`${esc(EX[e.id].n)}: ${e.sets.map(s=>EX[e.id].t==='w'?fmt(s.w)+'×'+s.r:s.r).join(', ')}`).join('<br>')}</td></tr>`).join('')}</table>`;
  toast('Choose "Save as PDF" in the print window');
  setTimeout(()=>window.print(), 300);
}
const WD = ['MO','TU','WE','TH','FR','SA','SU'], WDN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const defaultDays = () => ({2:[0,3],3:[0,2,4],4:[0,1,3,4]})[dpw()] || [0,2,4];
function openCalendar(){
  if(!S.profile.calDays) S.profile.calDays = defaultDays();
  const sel = S.profile.calDays;
  modal(`<div class="row between"><h2 style="margin:0">Add to calendar</h2><button class="iconbtn" onclick="closeModal()" aria-label="Close">${ic('x')}</button></div>
    <p class="mut small">Choose your ${dpw()} training days. You'll get a calendar file with reminders for the next 4 weeks – it works on iPhone too.</p>
    <div class="chips" style="margin:10px 0">${WDN.map((n,i)=>`<button class="chip ${sel.includes(i)?'on':''}" onclick="calToggle(${i})" aria-pressed="${sel.includes(i)}">${n}</button>`).join('')}</div>
    <label class="small mut" for="calT">Time</label><input id="calT" class="txt" type="time" value="${S.profile.calTime}" onchange="S.profile.calTime=this.value;save()" style="margin:6px 0 14px">
    <button class="btn pri block" onclick="makeICS()" ${sel.length?'':'disabled'}>${ic('calendar')} Download calendar file</button>
    <p class="xs mut center">Open the file to add the workouts to your calendar.</p>`);
}
function calToggle(i){ const a = S.profile.calDays, k = a.indexOf(i); k>=0 ? a.splice(k,1) : a.push(i); a.sort(); save(); openCalendar() }
function makeICS(){
  const [hh,mm] = (S.profile.calTime||'16:30').split(':').map(Number), p = prog(S.profile.activeProgram);
  const pad = n => String(n).padStart(2,'0'), ts = d => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const now = new Date(), stamp = now.toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
  const ev = S.profile.calDays.map(wd => { const d = new Date(now); d.setHours(hh,mm,0,0); let diff = (wd - ((d.getDay()+6)%7) + 7) % 7; if(diff===0 && d < now) diff = 7; d.setDate(d.getDate()+diff);
    const e = new Date(d.getTime() + p.minutes*60000);
    return ['BEGIN:VEVENT',`UID:lift-${wd}-${Date.now()}@lift`,`DTSTAMP:${stamp}`,`DTSTART:${ts(d)}`,`DTEND:${ts(e)}`,`RRULE:FREQ=WEEKLY;COUNT=${CONFIG.weeks};BYDAY=${WD[wd]}`,
      'SUMMARY:LIFT – workout',`DESCRIPTION:${p.name}: open LIFT and tap Start workout.`,'BEGIN:VALARM','TRIGGER:-PT30M','ACTION:DISPLAY','DESCRIPTION:Workout in 30 min','END:VALARM','END:VEVENT'].join('\r\n') });
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//LIFT//DA','CALSCALE:GREGORIAN',...ev,'END:VCALENDAR'].join('\r\n');
  saveFile('lift-workouts.ics', ics, 'text/calendar'); track('calendar'); closeModal();
}

/* ============================== PROFIL ============================== */
function renderProfile(app){
  const pr = isPremium(), lb = S.profile.lastBackup;
  app.innerHTML = `<div class="wrap">
    ${header(`<h1>Profile</h1>`, '')}
    <div class="card">
      <div class="banner"><span class="bi">${ic('shield')}</span><div class="grow"><h3 style="margin:0">Saved on this device</h3>
      <p class="small mut">Your workouts are only stored on this phone. Make a backup so you don't lose them if you change phone or clear your browser.</p>
      <p class="small">Last backup: <b class="${lb?'neon':''}" style="${lb?'':'color:var(--warn)'}">${lb ? dkLong(lb) : 'never'}</b></p></div></div>
      <div class="grid2" style="margin-top:8px"><button class="btn sm pri" onclick="exportJSON()">${ic('download','sm')} Save backup</button><button class="btn sm" onclick="importJSON()">${ic('upload','sm')} Restore backup</button></div>
      <div class="grid2" style="margin-top:8px"><button class="btn sm" onclick="exportCSV()">${pr?ic('file','sm'):ic('lock','sm')} CSV</button><button class="btn sm" onclick="exportPDF()">${pr?ic('file','sm'):ic('lock','sm')} PDF report</button></div>
    </div>
    <div class="card"><h3>My training</h3>
      <p class="small mut" style="margin-bottom:6px">Days per week</p>
      <div class="chips">${[2,3,4].map(n=>`<button class="chip ${dpw()===n?'on':''}" onclick="setDays(${n})" aria-pressed="${dpw()===n}">${n} days</button>`).join('')}</div>
      <p class="small mut" style="margin:14px 0 6px">Goal</p>
      <div class="chips">${Object.entries(MAAL).map(([k,g])=>`<button class="chip ${S.profile.goal===k?'on':''}" onclick="S.profile.goal='${k}';save();render()">${g.n}</button>`).join('')}</div>
      <button class="btn block" style="margin-top:14px" onclick="openCalendar()">${ic('calendar')} Add training days to calendar</button>
    </div>
    <div class="card ${pr?'':'locked'}"><div class="${pr?'':'blur'}" ${pr?'':'aria-hidden="true"'}>
      <h3>Your equipment</h3><p class="small mut">Exercises you don't have equipment for are swapped automatically.</p>
      <div class="chips">${Object.entries(UDSTYR).map(([k,n])=>`<button class="chip ${S.profile.equipment.includes(k)?'on':''}" onclick="toggleEq('${k}')">${n}</button>`).join('')}</div>
    </div>${pr ? '' : `<div class="veil"><span class="pill lock">${ic('lock')} Premium</span><b>Tailor the program to your equipment</b><button class="btn sm pri" onclick="openPremium('equipment')">See Premium</button></div>`}</div>
    <button class="card prog" onclick="openPremium('profile')"><div class="row between"><div><h3 style="margin:0">Subscription</h3><p class="small mut" style="margin:2px 0 0">${!pr ? 'Free: 1 program, basic log and backup' : S.profile.premium.source==='stripe' ? `Premium · ${S.profile.premium.status==='trialing'?'trial until':S.profile.premium.cancel?'ends':'renews'} ${fmtDate(S.profile.premium.until)}` : 'Premium (test mode)'}</p>${payEnabled() ? `<p class="xs mut" style="margin:4px 0 0">${acct.user ? 'Signed in as ' + esc(acct.user.email) : 'Not signed in'}</p>` : ''}</div>${ic('chevR')}</div></button>
    <div class="card"><h3>App</h3>
      <button class="btn block" onclick="S.profile.sound=!S.profile.sound;save();render()">${S.profile.sound?ic('sound')+' Rest timer sound: On':ic('mute')+' Rest timer sound: Off'}</button>
      ${isStandalone() ? '' : `<button class="btn block" style="margin-top:10px" onclick="showInstall(true)">${ic('install')} Add to home screen</button>`}
      <button class="btn block" style="margin-top:10px" onclick="redoOnboarding()">${ic('repeat')} Choose program again</button>
      <button class="btn block danger" style="margin-top:10px" onclick="askReset()">${ic('trash')} Delete all my data</button>
    </div>
    ${payEnabled() && acct.user ? `<button class="btn block" style="margin-top:-2px;margin-bottom:12px" onclick="signOut()">${ic('user')} Sign out</button>` : ''}
    ${testTools() ? `<div class="card" style="border-style:dashed"><h3>For testing</h3><p class="xs mut">Only visible when the app is opened with ?test in the address (or CONFIG.showTestTools is true).</p>
      <div class="grid2"><button class="btn sm" onclick="S.profile.premium=S.profile.premium?null:'test';save();render()">${pr?'Turn Premium off':'Turn Premium on'}</button><button class="btn sm" onclick="loadDemo()">Sample data</button></div></div>` : ''}
    <div class="warnline">${ic('alert')}<span>LIFT does not give medical advice. Stop if it hurts, and ask a doctor if you're ill or injured.</span></div>
    <p class="xs mut center" style="margin-top:14px">LIFT · version 2</p>
  </div>`;
}
function setDays(n){ S.profile.daysPerWeek = n; S.profile.calDays = null; save(); render() }
function toggleEq(k){ const e = S.profile.equipment; S.profile.equipment = e.includes(k) ? e.filter(x=>x!==k) : [...e,k]; save(); render() }
function redoOnboarding(){ S.profile.onboarded = false; save(); render() }
function askReset(){
  modal(`<h2>Delete all data?</h2><p class="mut">All workouts, records and settings will be deleted from this phone. This can't be undone – consider making a backup first.</p>
    <div class="grid2"><button class="btn" onclick="closeModal()">Keep</button><button class="btn danger" onclick="S=blank();save();stopRest();closeModal();toast('Data deleted');render()">Delete</button></div>`);
}
function loadDemo(){
  const p = prog(S.profile.activeProgram), now = Date.now(), n = Math.min(9, total()-1), st = {}, logs = [];
  for(let i=0;i<n;i++){
    const pl = planFor(p, i), d = new Date(now - (n-i)*2.3*DAY).toISOString();
    const ex = pl.ex.map(e => { const x = EX[e.id];
      st[e.id] = st[e.id]===undefined ? (x.t==='w' ? x.start : e.target) : st[e.id] + (Math.random()<.7 ? x.inc : 0);
      return {id:e.id, target:e.target, sets:Array.from({length:e.sets},(_,k)=>({w:x.t==='w'?st[e.id]:0, r: x.t==='w' ? e.target : Math.max(1, st[e.id] - (k?1:0))}))} });
    logs.push({id:newId(), d, p:p.id, idx:i, min:28+Math.round(Math.random()*12), ex});
  }
  S.logs = S.logs.concat(logs).sort((a,b)=>a.d<b.d?-1:1);
  S.profile.progress[p.id] = Math.max(progressOf(p.id), n);
  save(); toast('Sample data loaded'); go('progress');
}

/* ============================== KONTO & BETALING (Supabase + Stripe) ==============================
   Slås til ved at udfylde CONFIG.supabaseUrl og CONFIG.supabaseAnonKey i data.js (se SETUP.md).
   Kontoen bruges KUN til Premium. Træningsdata bliver på telefonen. */
const payEnabled = () => !!(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey && (CONFIG.paymentsLive || testTools()));
let sb = null;
const acct = {ready:false, user:null, sub:null, step:'email', email:'', busy:false};
async function initAccount(){
  if(!payEnabled()) return;
  try{
    const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    sb = mod.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true, flowType:'implicit'}});
    const {data} = await sb.auth.getSession();
    acct.user = data.session?.user || null; acct.ready = true;
    sb.auth.onAuthStateChange((_e, sess) => { const before = acct.user?.id; acct.user = sess?.user || null; if(acct.user?.id !== before) refreshSub() });
    await refreshSub();
    if(/[?&]signin=1/.test(location.search)){ window.history.replaceState(null, '', location.pathname + '?app'); if(acct.user){ track('signed-in'); toast('Signed in'); go('premium') } }
    handleCheckoutReturn();
  }catch(e){ console.warn('Account unavailable', e); acct.ready = true; render() }
}
async function refreshSub(){
  if(!sb) return;
  if(!acct.user){ acct.sub = null; applyEntitlement(); return }
  const {data, error} = await sb.from('subscriptions').select('status,plan,current_period_end,cancel_at_period_end').eq('user_id', acct.user.id).maybeSingle();
  if(error) return render(); // offline: behold det, vi ved
  acct.sub = data; applyEntitlement();
}
function applyEntitlement(){
  const s = acct.sub, ok = s && ['active','trialing','past_due'].includes(s.status) && (!s.current_period_end || new Date(s.current_period_end) > new Date());
  if(ok) S.profile.premium = {source:'stripe', plan:s.plan, until:s.current_period_end, status:s.status, cancel:s.cancel_at_period_end};
  else if(S.profile.premium && S.profile.premium.source === 'stripe') S.profile.premium = null;
  save(); render();
}
async function callFn(name, body){
  const {data, error} = await sb.functions.invoke(name, {body: body || {}});
  if(error){
    const st = error.context && error.context.status;
    let code = 'server_error'; try{ code = (await error.context.json()).error || code }catch(_){}
    if(st === 401 && code === 'server_error') code = 'not_signed_in'; // login udløbet/ugyldigt
    if(code === 'not_signed_in'){ try{ await sb.auth.signOut() }catch(_){} acct.user = null; acct.step = 'email' }
    throw code;
  }
  return data;
}
const ERR = {not_signed_in:'Your sign-in has expired. Please sign in again.', already_premium:'You already have Premium.', no_customer:'No subscription found.', unknown_plan:'Unknown plan.', server_error:'Something went wrong. Please try again.'};
async function sendCode(e){
  e && e.preventDefault();
  const m = ($('#acEmail')?.value || '').trim();
  if(!/^\S+@\S+\.\S+$/.test(m)) return toast('Please enter a valid email');
  acct.busy = true; render();
  const {error} = await sb.auth.signInWithOtp({email:m, options:{shouldCreateUser:true, emailRedirectTo: location.origin + location.pathname + '?app&signin=1'}});
  acct.busy = false;
  if(error){ toast(error.status === 429 ? 'Too many tries. Wait a minute and try again.' : 'Could not send the code. Check your email address.'); return render() }
  acct.email = m; acct.step = 'code'; render(); setTimeout(()=>$('#acCode')?.focus(), 50);
}
async function verifyCode(e){
  e && e.preventDefault();
  const code = ($('#acCode')?.value || '').replace(/\s/g,'');
  if(!/^\d{6,10}$/.test(code)) return toast('Enter the code from the email');
  acct.busy = true; render();
  const {error} = await sb.auth.verifyOtp({email:acct.email, token:code, type:'email'});
  acct.busy = false;
  if(error){ toast('That code did not work. Check it or send a new one.'); return render() }
  acct.step = 'email'; track('signed-in'); toast('Signed in'); await refreshSub();
}
async function signOut(){ if(sb) await sb.auth.signOut(); acct.user = null; acct.sub = null; applyEntitlement(); toast('Signed out') }
async function startCheckout(){
  if(!acct.user) return toast('Please sign in first');
  acct.busy = true; render(); track('checkout-start-' + plan);
  try{ const d = await callFn('create-checkout', {plan}); location.href = d.url }
  catch(code){ acct.busy = false; render(); toast(ERR[code] || ERR.server_error); if(code==='already_premium') refreshSub() }
}
async function openPortal(){
  acct.busy = true; render();
  try{ const d = await callFn('customer-portal'); location.href = d.url }
  catch(code){ acct.busy = false; render(); toast(ERR[code] || ERR.server_error) }
}
async function handleCheckoutReturn(){
  const q = new URLSearchParams(location.search), r = q.get('checkout');
  if(!r) return;
  window.history.replaceState(null, '', location.pathname + '?app');
  if(r === 'cancel'){ toast('Payment cancelled – nothing was charged'); return }
  track('checkout-success'); toast('Thanks! Activating Premium…');
  for(let i=0;i<8 && !(S.profile.premium && S.profile.premium.source==='stripe');i++){ await new Promise(r=>setTimeout(r,2500)); await refreshSub() }
  if(isPremium()){ toast('Premium is active – enjoy!'); go('premium') } else toast('Payment received. Premium will appear in a moment – try reopening the app.');
}
function loginHTML(){
  if(!acct.ready) return `<p class="small mut">Connecting…</p>`;
  if(acct.step === 'code') return `<form onsubmit="verifyCode(event)"><p class="small">We sent an email to <b>${esc(acct.email)}</b>.</p><p class="small mut"><b>Tap the sign-in link</b> in the email – or, if the email shows a code, enter it here:</p>
    <input id="acCode" class="txt" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="123456" aria-label="Code from email" style="letter-spacing:4px;font-size:22px;text-align:center">
    <button class="btn pri block" style="margin-top:10px" ${acct.busy?'disabled':''}>${acct.busy?'Checking…':'Sign in'}</button>
    <button type="button" class="link" onclick="acct.step='email';render()">Use another email or resend</button></form>`;
  return `<form onsubmit="sendCode(event)"><p class="small mut">Sign in with your email to buy and keep Premium. No password – we email you a sign-in link. Your workouts stay on this phone.</p>
    <div class="row"><input id="acEmail" class="txt grow" type="email" autocomplete="email" required placeholder="you@email.com" aria-label="Your email" value="${esc(acct.email)}">
    <button class="btn sm pri" style="min-height:52px" ${acct.busy?'disabled':''}>${acct.busy?'…':'Send'}</button></div></form>`;
}
const fmtDate = d => d ? dkLong(d) : '';

/* ============================== PREMIUM ============================== */
let plan = 'year', premFrom = '';
function openPremium(from){ premFrom = from || ''; track('premium-view'); if(from) track('premium-click-' + from); go('premium') }
function renderPremium(app){
  const yes = ic('check'), no = '<span class="no">—</span>';
  const w = S.profile.waitlist, interest = S.profile.interest;
  const active = S.profile.premium && S.profile.premium.source === 'stripe';
  app.innerHTML = `<div class="wrap">
    ${header(`<button class="iconbtn back" onclick="go('home')" aria-label="Back">${ic('chevL')}</button><h1>Premium</h1>`, '')}
    ${active ? buyHTML() : ''}
    <div class="hero"><span class="pill">${ic('crown')} LIFT Premium</span>
      <h2 style="margin-top:12px">Keep getting stronger</h2>
      <p class="mut">More programs when you're ready for the next level – tailored to your equipment and your goal.</p></div>
    <div class="card"><table class="cmp"><tr><th></th><th>Free</th><th>Premium</th></tr>
      <tr><td>Get Started (4 weeks)</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>Workout log, records and chart</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>Backup (save/restore)</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>All ${PROGRAMS.length} programs</td><td>${no}</td><td>${yes}</td></tr>
      <tr><td>Tailored to your equipment and goal</td><td>${no}</td><td>${yes}</td></tr>
      <tr><td>Advanced stats</td><td>${no}</td><td>${yes}</td></tr>
      <tr><td>Export to CSV and PDF</td><td>${no}</td><td>${yes}</td></tr></table></div>
    ${active ? '' : plansHTML()}
    ${active ? '' : (payEnabled() ? buyHTML() : waitlistHTML())}
  </div>`;
}
function plansHTML(){
  return `<button class="plan ${plan==='year'?'on':''}" onclick="plan='year';render()" aria-pressed="${plan==='year'}"><span class="tag">Save 40%</span>
      <div class="row between wrapf"><div><b>Yearly</b><div class="small mut">Just ${Math.round(CONFIG.priceYear/12)} ${CONFIG.currency}/month</div></div><div class="price">${CONFIG.priceYear} ${CONFIG.currency}<span class="small mut"> /yr</span></div></div></button>
    <button class="plan ${plan==='month'?'on':''}" onclick="plan='month';render()" aria-pressed="${plan==='month'}">
      <div class="row between wrapf"><div><b>Monthly</b><div class="small mut">Cancel anytime</div></div><div class="price">${CONFIG.priceMonth} ${CONFIG.currency}<span class="small mut"> /mo</span></div></div></button>`;
}
function buyHTML(){
  const p = S.profile.premium;
  if(p && p.source === 'stripe') return `<div class="card how"><h3>${ic('crown','sm')} You have Premium</h3>
    <p class="small">${p.plan==='year'?'Yearly':'Monthly'} plan · ${p.status==='trialing'?'free trial until':p.cancel?'ends':'renews'} <b>${fmtDate(p.until)}</b></p>
    <button class="btn block" onclick="openPortal()" ${acct.busy?'disabled':''}>Manage subscription</button></div>`;
  return `${acct.user ? `<button class="btn pri block" style="margin-top:6px" onclick="startCheckout()" ${acct.busy?'disabled':''}>${acct.busy?'Opening secure payment…':`Start ${CONFIG.trialDays}-day free trial`}</button>
      <p class="xs mut center">Then ${plan==='year'?CONFIG.priceYear+' '+CONFIG.currency+' per year':CONFIG.priceMonth+' '+CONFIG.currency+' per month'}. Cancel anytime before the trial ends and you pay nothing. Secure payment by Stripe.</p>
      <p class="xs mut center">Signed in as ${esc(acct.user.email)} · <button class="link" style="min-height:0;padding:0;font-size:12.5px" onclick="signOut()">Sign out</button></p>`
    : `<div class="card"><h3>${ic('user','sm')} Sign in to start</h3>${loginHTML()}</div>`}`;
}
function waitlistHTML(){
  const w = S.profile.waitlist, interest = S.profile.interest;
  return `${interest ? `<div class="card how center"><b class="neon">Thanks for your interest!</b><p class="small mut">Premium isn't open yet. Join the waitlist below to be the first to know – and get ${CONFIG.trialDays} days free.</p></div>`
      : `<button class="btn pri block" style="margin-top:6px" onclick="tryFree()">Try free for ${CONFIG.trialDays} days</button>`}
    <div class="card"><h3>${ic('mail','sm')} Waitlist</h3>
      ${w ? `<p class="small">${w.email==='(form)' ? 'Thanks for signing up!' : `You're on the list with <b>${esc(w.email)}</b>.`} We'll let you know when Premium opens.</p>`
        : CONFIG.waitlistUrl ? `<p class="small mut">Get notified when Premium opens.</p><a class="btn block" href="${esc(CONFIG.waitlistUrl)}" target="_blank" rel="noopener" onclick="S.profile.waitlist={email:'(form)',at:new Date().toISOString()};save();track('waitlist-click')">Join the waitlist</a>`
        : `<p class="small mut">Get notified when Premium opens.</p><form onsubmit="joinWaitlist(event)" class="row"><input class="txt grow" type="email" required placeholder="you@email.com" aria-label="Your email" id="wlmail"><button class="btn sm pri" style="min-height:52px">Join</button></form>`}
    </div>
    <p class="xs mut center">You won't be charged. Payments are not switched on yet.</p>`;
}
function tryFree(){ S.profile.interest = {plan, at:new Date().toISOString(), from:premFrom}; save(); track('trial-click-' + plan); render() }
function joinWaitlist(e){ e.preventDefault(); const m = $('#wlmail').value.trim(); if(!/^\S+@\S+\.\S+$/.test(m)) return toast('Please enter a valid email');
  S.profile.waitlist = {email:m, at:new Date().toISOString(), plan}; save(); track('waitlist-join'); toast("You're on the list!"); render() }

/* ============================== DIALOG ============================== */
function modal(html){ $('#modal').innerHTML = `<div class="overlay" onclick="if(event.target===this)closeModal()"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`; const f = $('#modal .sheet button'); f && f.focus({preventScroll:true}) }
function closeModal(){ $('#modal').innerHTML = '' }
addEventListener('keydown', e => { if(e.key==='Escape') closeModal() });

/* ============================== HJEMMESKÆRM (PWA) ============================== */
let deferredPrompt = null;
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e });
addEventListener('appinstalled', () => { $('#installBox')?.remove(); toast('LIFT was added to your home screen'); track('installed') });
function showInstall(force){
  if(isStandalone() || window.top !== window.self) return;
  try{ if(!force && localStorage.getItem('lift_noinstall')) return }catch(e){}
  if(!force && !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) return;
  $('#installBox')?.remove();
  const d = document.createElement('div'); d.id = 'installBox'; d.className = 'install'; d.setAttribute('role','dialog');
  d.innerHTML = `<div class="banner"><span class="bi">${ic('install')}</span><div class="grow"><b>Add LIFT to your home screen</b>
    ${deferredPrompt ? `<p class="small mut">Then it opens like a real app.</p><button class="btn sm pri block" onclick="doInstall()">Install app</button>`
      : isIOS() ? `<p class="small">1. Tap Share ${ic('share','sm')} in Safari<br>2. Choose <b>Add to Home Screen</b><br>3. Tap <b>Add</b></p>`
      : `<p class="small">Open the browser menu (⋮) and choose <b>Add to Home screen</b>.</p>`}</div>
    <button class="iconbtn" onclick="dismissInstall()" aria-label="Close">${ic('x')}</button></div>`;
  document.body.appendChild(d);
}
function dismissInstall(){ try{ localStorage.setItem('lift_noinstall','1') }catch(e){} $('#installBox')?.remove() }
async function doInstall(){ if(!deferredPrompt) return; deferredPrompt.prompt(); try{ await deferredPrompt.userChoice }catch(e){} deferredPrompt = null; $('#installBox')?.remove() }
if('serviceWorker' in navigator && location.protocol==='https:') navigator.serviceWorker.register('sw.js').catch(()=>{});

/* ============================== START ============================== */
let resizeT; addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(()=>{ if(view==='progress') render() }, 200) });
load();
initAccount();
if(S.summary) view = 'done';
render();
