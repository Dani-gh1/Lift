/* LIFT – kerne: data, lagring, synkronisering, konto, betaling, hjælpere.
   Skærmene ligger i train.js, food.js, stats.js og profile.js. Indstillinger og øvelser i data.js. */
'use strict';

/* ============================== IKONER ============================== */
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
  apple:'<path d="M12 7c-1-2-3-3-5-2-3 1-3 6-1 10 1 2 3 4 4 4s1.5-.6 2-.6 1 .6 2 .6 3-2 4-4c2-4 2-9-1-10-2-1-4 0-5 2zM12 7c0-2 1-4 3-4"/>',
  scan:'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 9v6M10 9v6M13 9v6M17 9v6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  minus:'<path d="M5 12h14"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
  scale:'<path d="M5 21h14l-2-14H7zM9 7a3 3 0 0 1 6 0M12 12l2-2"/>',
  cloud:'<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z"/>',
  cloudoff:'<path d="M7 18a5 5 0 0 1-1.5-9.8M10 6.5A6 6 0 0 1 19 10a4 4 0 0 1 1.5 7.3M3 3l18 18"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  dots:'<circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  chevD:'<path d="M6 9l6 6 6-6"/>',
  arrowL:'<path d="M20 12H4M10 6l-6 6 6 6"/>',
  arrowR:'<path d="M4 12h16M14 6l6 6-6 6"/>',
  kbd:'<rect x="2" y="5" width="20" height="12" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M9 13h6M9 21l3-2 3 2"/>',
  bksp:'<path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zM12 9l6 6M18 9l-6 6"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  log:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
};
const ic = (n, cls='') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`;

/* ============================== DATA & LAGRING ==============================
   Alt gemmes først på telefonen (virker offline). Er man logget ind, synkroniseres det med kontoen.
   Lister (træninger, mad …) har id + u (sidst ændret), så ændringer fra flere enheder kan flettes. */
const KEY = 'lift_v3';
const COLLS = ['workouts','routines','customEx','food','customFoods','body','goals'];
const SYNC_PROFILE = ['lang','favs','onboarded','offerSeen','goal','sex','age','height','weight','activity','kcalGoal','proteinGoal','weeklyGoal','restDefault','sound','unit'];
const blankProfile = () => ({lang:null, favs:[], onboarded:false, offerSeen:false, goal:'muscle', sex:null, age:null, height:null, weight:null, activity:1.55,
  kcalGoal:null, proteinGoal:null, weeklyGoal:3, restDefault:90, sound:true, pu:0,
  premium:null, lastBackup:null, interest:null, waitlist:null, flags:{}});
const blank = () => ({profile:blankProfile(), workouts:[], routines:[], customEx:[], food:[], customFoods:[], body:[], goals:[], del:{}, dirty:{}, sync:{uid:null, pulled:0, profPushed:0}, current:null, summary:null});
let S = blank();

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(raw){ const d = JSON.parse(raw); S = Object.assign(blank(), d); S.profile = Object.assign(blankProfile(), d.profile||{}); COLLS.forEach(k => { if(!Array.isArray(S[k])) S[k] = [] });
      if(!Array.isArray(S.profile.favs)) S.profile.favs = [];
      if(!S.dirty || typeof S.dirty !== 'object') S.dirty = {}; if(!S.sync || typeof S.sync !== 'object') S.sync = {uid:null, pulled:0, profPushed:0}; if(!S.del) S.del = {}; return }
    const old = localStorage.getItem('lift_v2') || localStorage.getItem('lift_v1');
    if(old) migrateV2(JSON.parse(old));
  }catch(e){ console.warn(e); S = blank() }
}
// Flytter træninger fra den gamle version (programmer) over i den nye træningslog
function migrateV2(d){
  const now = Date.now(), p = d.profile || {};
  S.profile = Object.assign(blankProfile(), {onboarded:!!p.onboarded, sound:p.sound!==false, premium:p.premium||null, lastBackup:p.lastBackup||null,
    waitlist:p.waitlist||null, interest:p.interest||null, flags:p.flags||{}, weeklyGoal:p.daysPerWeek||3,
    goal:({styrke:'strength', muskler:'muscle', form:'fit'})[p.goal] || 'muscle', pu:now});
  S.workouts = (d.logs||[]).filter(l => l && l.ex).map(l => { const end = Date.parse(l.d);
    return {id:l.id, start:end - (l.min||30)*60000, end, name:'Workout', u:now, ex:l.ex.filter(e=>EX[e.id]).map(e => ({id:e.id, sets:e.sets.map(s => ({kg:s.w||0, reps:s.r||0, done:true}))}))} });
  save();
}
function lsSave(){ try{ localStorage.setItem(KEY, JSON.stringify(S)) }catch(e){ toast(t('Could not save – is your storage full?')) } }
function save(){ lsSave(); scheduleSync() }
const touch = o => (o.u = Date.now(), o);
function upsert(coll, item){ touch(item); const i = S[coll].findIndex(x => x.id === item.id); if(i >= 0) S[coll][i] = item; else S[coll].push(item); S.dirty[item.id] = coll; save() }
function removeItem(coll, id){ S[coll] = S[coll].filter(x => x.id !== id); S.del[id] = Date.now(); S.dirty[id] = coll; save() }
function setProfile(k, v){ S.profile[k] = v; S.profile.pu = Date.now(); save() }

/* ============================== HJÆLPERE ============================== */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = (n, d=1) => { if(n == null || isNaN(n)) return '–'; const f = Math.pow(10,d); return String(Math.round(n*f)/f).replace('.', decSep()) };
const num = v => { const n = parseFloat(String(v ?? '').replace(',', '.')); return isNaN(n) ? null : n };
const DAY = 864e5;
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);
const dayKey = (d = new Date()) => { const x = new Date(d); return x.getFullYear() + '-' + String(x.getMonth()+1).padStart(2,'0') + '-' + String(x.getDate()).padStart(2,'0') };
const dk = d => new Date(d).toLocaleDateString(LOC(),{day:'numeric',month:'short'});
const dkLong = d => new Date(d).toLocaleDateString(LOC(),{day:'numeric',month:'long',year:'numeric'});
const weekday = d => new Date(d).toLocaleDateString(LOC(),{weekday:'short', day:'numeric', month:'short'});
const timeTxt = d => new Date(d).toLocaleTimeString(LOC(),{hour:'2-digit', minute:'2-digit'});
const fmtDT = d => weekday(d) + ', ' + timeTxt(d);
function setLang(l){ LANG = l; document.documentElement.lang = l; setProfile('lang', l); render() }
const weekStart = d => { const x = new Date(d); x.setHours(0,0,0,0); x.setDate(x.getDate() - ((x.getDay()+6)%7)); return x.getTime() };
const isPremium = () => { const p = S.profile.premium; if(!p) return false; if(p.until && new Date(p.until).getTime() + 3*DAY < Date.now()) return false; return true };
const testTools = () => { try{ if(/[?&]test\b/.test(location.search)) localStorage.setItem('lift_test','1'); return CONFIG.showTestTools || localStorage.getItem('lift_test')==='1' }catch(e){ return CONFIG.showTestTools } };
function toast(m){ document.querySelectorAll('.toast').forEach(t=>t.remove()); const t = document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=m; document.body.appendChild(t); setTimeout(()=>t.remove(), 2400) }
function modal(html){ $('#modal').innerHTML = `<div class="overlay" onclick="if(event.target===this)closeModal()"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`; const f = $('#modal .sheet input:not([type=hidden]), #modal .sheet button'); f && f.focus({preventScroll:true}) }
function closeModal(){ if(typeof stopScanner === 'function') stopScanner(); $('#modal').innerHTML = '' }
addEventListener('keydown', e => { if(e.key==='Escape') closeModal() });
const closeBtn = () => `<button class="iconbtn" onclick="closeModal()" aria-label="${t('Close')}">${ic('x')}</button>`;
const lockPill = () => `<span class="pill lock">${ic('lock')} Premium</span>`;
const legalLinks = () => `<a href="terms.html" class="neon">${t('Terms')}</a> · <a href="privacy.html" class="neon">${t('Privacy')}</a>`;
function lockedCard(title, text, from){
  return `<div class="card locked-card"><div class="row between"><h3 style="margin:0">${title}</h3>${lockPill()}</div><p class="small mut">${text}</p><button class="btn sm pri" onclick="openPremium('${from}')">${ic('crown','sm')} ${t('Unlock with Premium')}</button></div>`;
}

/* ============================== MÅLING (GoatCounter) ============================== */
const gcQueue = [];
function track(name){
  if(!CONFIG.goatcounterCode) return;
  const send = () => window.goatcounter.count({path:'evt-' + name, title:name, event:true});
  if(window.goatcounter && window.goatcounter.count) send(); else gcQueue.push(name);
}
function trackOnce(name){ if(S.profile.flags[name]) return; S.profile.flags[name] = Date.now(); lsSave(); track(name) }
(function initAnalytics(){
  if(!CONFIG.goatcounterCode || location.protocol !== 'https:') return;
  const s = document.createElement('script'); s.async = true; s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = `https://${CONFIG.goatcounterCode}.goatcounter.com/count`;
  s.onload = () => { const t = setInterval(()=>{ if(window.goatcounter && window.goatcounter.count){ clearInterval(t); gcQueue.splice(0).forEach(track) } }, 300) };
  document.head.appendChild(s);
})();

/* ============================== ØVELSER ============================== */
// Indbyggede øvelser (data.js) + brugerens egne
function exInfo(id){ return EX[id] || S.customEx.find(x => x.id === id) || {n:t('Unknown exercise'), m:'Full body', t:'w'} }
const allExercises = () => [...Object.entries(EX).map(([id,x]) => ({id, ...x})), ...S.customEx.map(x => ({...x, custom:true}))];
const unitOf = x => x.t==='s' ? t('sec') : t('reps');

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
  const x = exInfo(id); if(x.vis) return x.vis;
  const needs = x.needs || [];
  if(id==='table_row') return 'table';
  if(needs.includes('stang')) return 'barbell';
  if(needs.includes('haandvaegte')) return 'dumbbell';
  if(needs.includes('kettlebell')) return 'kb';
  if(needs.includes('elastik')) return 'band';
  if(needs.includes('maskiner')) return x.a==='pull' ? 'cable' : 'sled';
  return '';
}
function demoSVG(id){
  const x = exInfo(id), anim = x.a, vis = visOf(id);
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
  return `<svg viewBox="-8 -12 136 134" role="img" aria-label="${t('Animation of {n}', {n:esc(x.n)})}">
    <ellipse cx="60" cy="112" rx="56" ry="4" fill="#000" opacity=".45"/>
    <line x1="-8" y1="111" x2="128" y2="111" stroke="#2a342f" stroke-width="2"/>
    ${scene}${arrow}
    ${bone('hp','k2',6,F)}${bone('k2','f2',6,F)}
    <g transform="translate(4 -1)">${bone('n','el',5,F)}${bone('el','hd',5,F)}</g>
    ${bone('n','hp',8,N)}${bone('hp','k',7,N)}${bone('k','f',7,N)}${bone('n','el',5.5,N)}${bone('el','hd',5.5,N)}
    <circle r="8.5" fill="#0e1310" stroke="${N}" stroke-width="4" cx="${A.h[0]}" cy="${A.h[1]}">${an('cx',A.h[0],B.h[0])}${an('cy',A.h[1],B.h[1])}</circle>
    ${handProp}</svg>`;
}
const tempoText = id => exInfo(id).t==='s' ? t('Hold still and breathe calmly.') : exInfo(id).a==='swing' ? t('Explode up with your hips, let the bell fall back.') : t('Lower slowly (2 sec) · push up strong (1 sec).');

/* ============================== KONTO, SYNKRONISERING & BETALING (Firebase + Stripe) ==============================
   Login:   Firebase Authentication med e-mail-link (ingen adgangskode). Firebase sender selv mailen.
   Data:    Firestore. Hver træning, måltid, rutine, mål osv. er sit eget dokument i users/{uid}/items/{id}.
            Appen gemmer altid først på telefonen og synkroniserer kun det, der er ændret.
   Betaling: Firebase-udvidelsen "Run Payments with Stripe" (customers/{uid}/checkout_sessions + subscriptions). */
const FB_SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
const authEnabled = () => !!(CONFIG.firebase && CONFIG.firebase.apiKey && CONFIG.firebase.projectId);
const payEnabled = () => authEnabled() && !!(CONFIG.stripePriceMonth && CONFIG.stripePriceYear) && (CONFIG.paymentsLive || testTools());
let fb = null;      // {app, auth, db, A: auth-modul, F: firestore-modul}
const acct = {ready:false, user:null, sub:null, step:'email', email:'', busy:false, offline:false, skip:false};
const rememberUser = id => { try{ id ? localStorage.setItem('lift_uid', id) : localStorage.removeItem('lift_uid') }catch(_){} };
const rememberedUser = () => { try{ return localStorage.getItem('lift_uid') }catch(_){ return null } };
let syncState = 'local', syncTimer = null, syncing = false, syncAgain = false;
const appBase = () => location.origin + location.pathname;
const toUser = u => u ? {uid:u.uid, email:u.email || ''} : null;

async function initAccount(){
  if(!authEnabled()) return;
  try{
    const [appM, A, F] = await Promise.all([import(FB_SDK + 'firebase-app.js'), import(FB_SDK + 'firebase-auth.js'), import(FB_SDK + 'firebase-firestore.js')]);
    const app = appM.initializeApp(CONFIG.firebase);
    fb = {app, auth:A.getAuth(app), db:F.getFirestore(app), A, F};
    if(CONFIG.firebaseEmulator){ A.connectAuthEmulator(fb.auth, 'http://127.0.0.1:9099', {disableWarnings:true}); F.connectFirestoreEmulator(fb.db, '127.0.0.1', 8080) }   // kun til test
    // Kom brugeren tilbage via login-linket i mailen?
    if(A.isSignInWithEmailLink(fb.auth, location.href)){
      const email = (() => { try{ return localStorage.getItem('lift_signin_email') }catch(_){ return null } })();
      if(email) await completeLink(email); else { acct.step = 'confirm'; }
    }
    let first = true;
    A.onAuthStateChanged(fb.auth, async u => {
      const before = acct.user?.uid; acct.user = toUser(u); acct.ready = true;
      if(first || acct.user?.uid !== before){
        first = false; rememberUser(acct.user?.uid);
        if(acct.user){ try{ localStorage.removeItem('lift_skip') }catch(_){} prepareSyncFor(acct.user.uid); await syncNow(true); refreshSub() }
        else { syncState = 'local'; applyEntitlement() }
      }
    });
    handleCheckoutReturn();
    addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible' && acct.user) syncNow() });
    addEventListener('online', () => acct.user && syncNow());
  }catch(e){ console.warn('Account unavailable', e); acct.ready = true; acct.offline = !!rememberedUser(); render() }
}

/* --- Login med e-mail-link --- */
async function sendCode(e){       // (navnet bruges af skærmene)
  e && e.preventDefault();
  const m = ($('#acEmail')?.value || '').trim();
  if(!/^\S+@\S+\.\S+$/.test(m)) return toast(t('Please enter a valid email'));
  if(!fb) return toast(t('Connecting… try again in a moment'));
  acct.busy = true; render();
  try{
    await fb.A.sendSignInLinkToEmail(fb.auth, m, {url: appBase() + '?app&signin=1', handleCodeInApp: true});
    try{ localStorage.setItem('lift_signin_email', m) }catch(_){}
    acct.email = m; acct.step = 'sent'; track('signin-link-sent');
  }catch(err){ console.warn(err); toast(err && err.code === 'auth/quota-exceeded' ? t('Too many sign-ins today. Try again later.') : t('Could not send the email. Check your address.')) }
  acct.busy = false; render();
}
async function completeLink(email){
  try{
    await fb.A.signInWithEmailLink(fb.auth, email, location.href);
    try{ localStorage.removeItem('lift_signin_email') }catch(_){}
    acct.step = 'email'; track('signed-in'); toast(t('Welcome to LIFT!'));
  }catch(err){
    console.warn(err); acct.step = 'email';
    toast(err && /expired|invalid-action/.test(err.code || '') ? t('That link has expired. Send a new one.') : t('Could not sign you in. Try again.'));
  }
  window.history.replaceState(null, '', location.pathname + '?app');
}
async function confirmEmail(e){     // linket blev åbnet på en anden enhed/browser
  e && e.preventDefault();
  const m = ($('#acEmail')?.value || '').trim(); if(!/^\S+@\S+\.\S+$/.test(m)) return toast(t('Please enter a valid email'));
  acct.busy = true; render(); await completeLink(m); acct.busy = false; render();
}
async function signOut(){
  if(fb) await fb.A.signOut(fb.auth);
  acct.user = null; acct.sub = null; syncState = 'local'; rememberUser(null); applyEntitlement(); go('home'); toast(t('Signed out'));
}
function loginHTML(intro){
  if(!authEnabled()) return '';
  if(!acct.ready) return `<p class="small mut">${t('Connecting…')}</p>`;
  if(acct.step === 'sent') return `<p class="small">${t('We sent a sign-in link to {e}.', {e:`<b>${esc(acct.email)}</b>`})}</p><p class="small mut">${t('Open the email on this phone and tap the link. Check spam if you can’t find it.')}</p>
    <button type="button" class="link" onclick="acct.step='email';render()">${t('Use another email or resend')}</button>`;
  return `<form onsubmit="${acct.step === 'confirm' ? 'confirmEmail' : 'sendCode'}(event)"><p class="small mut">${acct.step === 'confirm' ? t('Confirm your email to finish signing in.') : (intro || t('Sign in with your email. No password – we email you a sign-in link.'))}</p>
    <div class="row"><input id="acEmail" class="txt grow" type="email" autocomplete="email" required placeholder="${t('you@email.com')}" aria-label="${t('Your email')}" value="${esc(acct.email)}">
    <button class="btn sm pri" style="min-height:52px" ${acct.busy?'disabled':''}>${acct.busy?'…':acct.step === 'confirm' ? t('Sign in') : t('Send')}</button></div></form>`;
}

/* --- Synkronisering med Firestore --- */
// Ved login på en ny konto: data der ikke tilhører nogen konto uploades; data fra en ANDEN konto fjernes fra telefonen.
function prepareSyncFor(uid){
  if(S.sync.uid === uid) return;
  if(S.sync.uid && S.sync.uid !== uid){ const keep = {premium:S.profile.premium}; S = Object.assign(blank(), {}); Object.assign(S.profile, keep) }
  else COLLS.forEach(k => S[k].forEach(x => S.dirty[x.id] = k));   // første login: upload alt
  S.sync = {uid, pulled:0, profPushed:0};
  lsSave();
}
function scheduleSync(){ if(!fb || !acct.user) return; clearTimeout(syncTimer); syncTimer = setTimeout(() => syncNow(), 1500) }
function markAllDirty(){ COLLS.forEach(k => S[k].forEach(x => S.dirty[x.id] = k)); Object.keys(S.del).forEach(id => { if(!S.dirty[id]) S.dirty[id] = '_' }); }
function syncProfile(){ const p = {pu:S.profile.pu||0}; SYNC_PROFILE.forEach(k => { if(S.profile[k] !== undefined) p[k] = S.profile[k] }); return p }
// Ét ændret dokument fra skyen → ind i appen (nyeste ændring vinder)
function applyRemoteItem(r){
  if(!r || !r.id || !COLLS.includes(r.c)) return false;
  const list = S[r.c], i = list.findIndex(x => x.id === r.id), local = i >= 0 ? list[i] : null, u = r.u || 0;
  if(r.del){
    if(local && (local.u||0) <= u){ list.splice(i,1); S.del[r.id] = u; delete S.dirty[r.id]; return true }
    if(!local) S.del[r.id] = Math.max(S.del[r.id]||0, u);
    return false;
  }
  if(S.del[r.id] && S.del[r.id] >= u) return false;
  if(local && (local.u||0) >= u) return false;
  let item; try{ item = JSON.parse(r.d) }catch(_){ return false }
  item.u = u; if(local) list[i] = item; else list.push(item);
  delete S.dirty[r.id];
  return true;
}
// Bruges også af backup-gendannelse: fletter et helt datasæt ind (nyeste vinder) og markerer det til upload
function mergeRemote(r){
  if(!r || typeof r !== 'object') return false;
  let changed = false;
  Object.entries(r.del || {}).forEach(([id,t]) => { if(!S.del[id] || S.del[id] < t) S.del[id] = t });
  COLLS.forEach(k => {
    const map = new Map(S[k].map(x => [x.id, x]));
    (Array.isArray(r[k]) ? r[k] : []).forEach(x => { if(!x || !x.id) return; const l = map.get(x.id); if(!l || (x.u||0) > (l.u||0)){ map.set(x.id, x); S.dirty[x.id] = k; changed = true } });
    S[k] = [...map.values()].filter(x => !(S.del[x.id] && S.del[x.id] >= (x.u||0)));
  });
  if(r.profile && (r.profile.pu||0) > (S.profile.pu||0)){ SYNC_PROFILE.forEach(k => { if(k in r.profile) S.profile[k] = r.profile[k] }); S.profile.pu = r.profile.pu; changed = true }
  S.workouts.sort((a,b) => a.start - b.start);
  return changed;
}
function syncPayload(){ const out = {v:4, profile:syncProfile(), del:S.del}; COLLS.forEach(k => out[k] = S[k]); return out }
async function syncNow(first){
  if(!fb || !acct.user) return;
  if(syncing){ syncAgain = true; return }
  syncing = true; syncState = 'syncing'; updateSyncChip();
  const {F, db} = fb, uid = acct.user.uid, items = F.collection(db, 'users', uid, 'items');
  try{
    // 1) Hent det, der er ændret siden sidst (på andre enheder)
    const since = S.sync.pulled || 0;
    const snap = await F.getDocs(since ? F.query(items, F.where('su', '>', F.Timestamp.fromMillis(since - 2000))) : items);
    let changed = false, maxSu = since;
    snap.forEach(d => { const r = d.data(); const su = r.su && r.su.toMillis ? r.su.toMillis() : 0; if(su > maxSu) maxSu = su; if(applyRemoteItem(r)) changed = true });
    const pd = await F.getDoc(F.doc(db, 'users', uid));
    const rp = pd.exists() ? pd.data().profile : null;
    if(rp && (rp.pu||0) > (S.profile.pu||0)){ SYNC_PROFILE.forEach(k => { if(k in rp) S.profile[k] = rp[k] }); S.profile.pu = rp.pu; S.sync.profPushed = rp.pu; changed = true }
    if(changed) S.workouts.sort((a,b) => a.start - b.start);
    // 2) Send egne ændringer op (højst 400 pr. omgang)
    const pending = Object.entries(S.dirty), sent = {};
    for(let i = 0; i < pending.length; i += 400){
      const batch = F.writeBatch(db);
      pending.slice(i, i + 400).forEach(([id, c]) => {
        const item = c !== '_' && S[c] ? S[c].find(x => x.id === id) : null, ref = F.doc(items, id);
        if(item){ sent[id] = item.u || 0; batch.set(ref, {id, c, u:item.u || Date.now(), d:JSON.stringify(item), su:F.serverTimestamp()}) }
        else { const dc = c !== '_' ? c : 'workouts'; sent[id] = S.del[id] || Date.now(); batch.set(ref, {id, c:dc, u:sent[id], del:true, su:F.serverTimestamp()}) }
      });
      await batch.commit();
    }
    Object.entries(sent).forEach(([id, u]) => { const c = S.dirty[id]; const cur = c && c !== '_' && S[c] ? S[c].find(x => x.id === id) : null; if(!cur || (cur.u||0) <= u) delete S.dirty[id] });
    if((S.profile.pu||0) > (S.sync.profPushed||0)){ await F.setDoc(F.doc(db, 'users', uid), {profile:syncProfile(), email:acct.user.email || '', updated:F.serverTimestamp()}, {merge:true}); S.sync.profPushed = S.profile.pu }
    S.sync.pulled = maxSu; lsSave(); syncState = 'ok';
    if(changed || first) render(); else updateSyncChip();
  }catch(e){ console.warn('sync', e); syncState = navigator.onLine === false ? 'offline' : 'error'; updateSyncChip() }
  syncing = false;
  if(syncAgain){ syncAgain = false; syncNow() }
}
function syncChip(){
  // Lille, diskret ikon: grøn sky = gemt på kontoen, grå = kun på telefonen, gul = ikke gemt endnu
  const st = !acct.user ? ['cloudoff',t('Saved on this phone only'),'off'] : syncState==='syncing' ? ['cloud',t('Saving…'),'busy'] : syncState==='ok' ? ['cloud',t('Saved to your account'),'ok'] : syncState==='offline' ? ['cloudoff',t('Offline – saved on this phone'),'warn'] : ['cloudoff',t('Not saved yet'),'warn'];
  return `<button class="syncbtn ${st[2]}" id="syncChip" onclick="go('profile')" aria-label="${st[1]}" title="${st[1]}">${ic(st[0])}</button>`;
}
function updateSyncChip(){ const c = $('#syncChip'); if(c) c.outerHTML = syncChip() }

/* --- Abonnement (skrives af Stripe-udvidelsen) --- */
async function refreshSub(){
  if(!fb) return;
  if(!acct.user){ acct.sub = null; applyEntitlement(); return }
  try{
    const {F, db} = fb;
    const snap = await F.getDocs(F.query(F.collection(db, 'customers', acct.user.uid, 'subscriptions'), F.where('status', 'in', ['trialing','active','past_due'])));
    const d = snap.docs[0] ? snap.docs[0].data() : null;
    const it = d && d.items && d.items[0], iv = it && ((it.price && it.price.recurring && it.price.recurring.interval) || (it.plan && it.plan.interval));
    const end = d && d.current_period_end ? (d.current_period_end.toDate ? d.current_period_end.toDate() : new Date(d.current_period_end)) : null;
    acct.sub = d ? {status:d.status, plan: iv === 'year' ? 'year' : 'month', current_period_end: end ? end.toISOString() : null, cancel_at_period_end: !!d.cancel_at_period_end} : null;
    applyEntitlement();
  }catch(e){ console.warn('subscription', e); render() }
}
function applyEntitlement(){
  const s = acct.sub, ok = s && ['active','trialing','past_due'].includes(s.status) && (!s.current_period_end || new Date(s.current_period_end) > new Date());
  if(ok) S.profile.premium = {source:'stripe', plan:s.plan, until:s.current_period_end, status:s.status, cancel:s.cancel_at_period_end};
  else if(S.profile.premium && S.profile.premium.source === 'stripe') S.profile.premium = null;
  lsSave(); render();
}

/* --- Betaling --- */
let plan = 'year', premFrom = '';
async function startCheckout(){
  if(!acct.user || !fb) return toast(t('Please sign in first'));
  acct.busy = true; render(); track('checkout-start-' + plan);
  const fail = msg => { acct.busy = false; render(); toast(msg || t('Something went wrong. Please try again.')) };
  try{
    const {F, db} = fb, uid = acct.user.uid;
    let hadSub = false;   // kun én gratis prøveperiode pr. person
    try{ hadSub = !(await F.getDocs(F.collection(db, 'customers', uid, 'subscriptions'))).empty }catch(_){}
    const session = {price: plan === 'year' ? CONFIG.stripePriceYear : CONFIG.stripePriceMonth, mode:'subscription',
      success_url: appBase() + '?app&checkout=success', cancel_url: appBase() + '?app&checkout=cancel', allow_promotion_codes:true};
    if(!hadSub && CONFIG.trialDays > 0) session.trial_period_days = CONFIG.trialDays;
    const ref = await F.addDoc(F.collection(db, 'customers', uid, 'checkout_sessions'), session);
    let done = false;
    const unsub = F.onSnapshot(ref, s => { const d = s.data() || {};
      if(d.error && !done){ done = true; unsub(); fail(d.error.message) }
      if(d.url && !done){ done = true; unsub(); location.assign(d.url) } });
    setTimeout(() => { if(!done){ done = true; unsub(); fail(t('Payment is not ready yet. Please try again in a moment.')) } }, 30000);
  }catch(e){ console.warn(e); fail() }
}
async function openPortal(){
  if(!fb || !acct.user) return toast(t('Please sign in first'));
  acct.busy = true; render();
  try{
    const Fn = await import(FB_SDK + 'firebase-functions.js');
    const call = Fn.httpsCallable(Fn.getFunctions(fb.app, CONFIG.firebaseFunctionsRegion || 'europe-west1'), 'ext-firestore-stripe-payments-createPortalLink');
    const {data} = await call({returnUrl: appBase() + '?app', locale:'auto'});
    location.assign(data.url);
  }catch(e){ console.warn(e); acct.busy = false; render(); toast(t('Could not open subscription settings. Please try again.')) }
}
async function handleCheckoutReturn(){
  const q = new URLSearchParams(location.search), r = q.get('checkout');
  if(!r) return;
  window.history.replaceState(null, '', location.pathname + '?app');
  if(r === 'cancel'){ toast(t('Payment cancelled – nothing was charged')); return }
  track('checkout-success'); toast(t('Thanks! Activating Premium…'));
  for(let i = 0; i < 10 && !(S.profile.premium && S.profile.premium.source === 'stripe'); i++){ await new Promise(r => setTimeout(r, 2500)); if(acct.user) await refreshSub() }
  if(isPremium()){ toast(t('Premium is active – enjoy!')); go('premium') } else toast(t('Payment received. Premium will appear in a moment – try reopening the app.'));
}

/* ============================== NAVIGATION ============================== */
let view = 'home';
const TABS = [['home','Home','home'],['train','Train','dumbbell'],['food','Food','apple'],['goals','Goals','target'],['profile','Profile','user']];
const SCREENS = {};   // udfyldes af train.js, food.js, stats.js, profile.js
let prevView = 'home';
function go(v){ if(v !== 'home') $('#installBox')?.remove(); if(v !== view && !['premium','done','routine','workout','routines'].includes(view)) prevView = view; view = v; closeModal(); window.scrollTo(0,0); render() }
function render(){
  const gate = appGate();
  const full = gate || ['workout','done','premium','routine','routines'].includes(view);
  $('#tabs').style.display = full ? 'none' : '';
  $('#tabs').setAttribute('aria-label', t('Main menu'));
  $('#tabs .in').innerHTML = TABS.map(([k,l,i]) => `<button class="${view===k?'on':''}" onclick="go('${k}')" aria-label="${t(l)}" ${view===k?'aria-current="page"':''}>${ic(i)}${t(l)}</button>`).join('');
  const app = $('#app');
  if(gate) return SCREENS[gate](app);
  (SCREENS[view] || SCREENS.home)(app);
  renderRestBar(); renderMiniBar(full);
}
// Hvad skal vises før selve appen? 1) splash mens vi tjekker login 2) opret konto/log ind 3) Premium-tilbud
function appGate(){
  if(!acct.skip && !CONFIG.requireAccount){ try{ acct.skip = localStorage.getItem('lift_skip') === '1' }catch(_){} }
  if(authEnabled() && !acct.user && !acct.skip){
    if(!acct.ready && !rememberedUser()) return 'splash';
    if(acct.ready && !acct.offline) return 'auth';
  }
  if(!S.profile.offerSeen && !isPremium()) return 'offer';
  return null;
}
// Træning i gang, men minimeret: lille bjælke over menuen
function renderMiniBar(full){
  let m = $('#minibar'); if(!m){ m = document.createElement('div'); m.id = 'minibar'; document.body.appendChild(m) }
  document.body.classList.toggle('has-mini', !!(S.current && !full));
  if(!S.current || full){ m.innerHTML = ''; return }
  m.innerHTML = `<button class="minibar" onclick="go('workout')"><span class="live"></span><b class="grow ell">${esc(S.current.name)}</b><span class="xs mut" id="mbT">${durText(Date.now()-S.current.start)}</span>${ic('chevR','sm')}</button>`;
}
const header = (title, right='') => `<header class="hdr">${title}${right}</header>`;
const BARBELL = '<svg class="lb" viewBox="60 140 392 148" aria-hidden="true"><g fill="#39ff7a"><rect x="70" y="203" width="372" height="22" rx="11"/><rect x="112" y="150" width="40" height="128" rx="12"/><rect x="162" y="172" width="30" height="84" rx="10"/><rect x="360" y="150" width="40" height="128" rx="12"/><rect x="320" y="172" width="30" height="84" rx="10"/><rect x="76" y="186" width="26" height="56" rx="8"/><rect x="410" y="186" width="26" height="56" rx="8"/></g></svg>';
const logoHTML = (big) => `<div class="logo grow ${big?'big':''}" aria-label="LIFT">${BARBELL}<span>L<i>I</i>FT</span></div>`;

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
  if(rest.fin){ b.innerHTML = `<div class="restbar"><div class="in fin row" onclick="stopRest()" role="alert"><span class="t">${t('Go!')}</span><b class="grow">${t('Time for your next set')}</b>${ic('check')}</div></div>`; return }
  const bottom = view==='workout' ? '' : 'style="bottom:calc(74px + var(--bot))"';
  b.innerHTML = `<div class="restbar" ${bottom}><div class="in row" role="timer" aria-live="off">
    <div class="grow"><div class="xs mut">${ic('timer','sm')} ${t('Rest')}</div><span class="t" id="restT">${mmss(restLeft())}</span></div>
    <button class="btn sm" onclick="adjRest(15)" aria-label="${t('15 seconds more')}">+15</button>
    <button class="btn sm pri" onclick="stopRest()">${ic('skip','sm')} ${t('Skip')}</button>
    <div class="bar" id="restB" style="width:${restLeft()/rest.total*100}%"></div></div></div>`;
}

/* ============================== GRAFER ============================== */
function setupCanvas(cv){ const dpr = window.devicePixelRatio||1, w = cv.clientWidth, h = +cv.getAttribute('height'); cv.width = w*dpr; cv.height = h*dpr; cv.style.height = h+'px'; const c = cv.getContext('2d'); c.scale(dpr,dpr); return [c,w,h] }
function drawLine(cv, pts){
  if(!cv || !pts.length) return; const [c,w,h] = setupCanvas(cv);
  const pad = {l:38,r:12,t:12,b:26}, ys = pts.map(p=>p.y);
  let mn = Math.min(...ys), mx = Math.max(...ys); if(mn===mx){ mn -= 1; mx += 1 } const span = mx-mn; mn -= span*.12; mx += span*.12;
  const X = i => pad.l + (pts.length===1 ? (w-pad.l-pad.r)/2 : i*(w-pad.l-pad.r)/(pts.length-1)), Y = v => pad.t + (1-(v-mn)/(mx-mn))*(h-pad.t-pad.b);
  c.font = '600 11px Inter, sans-serif'; c.fillStyle = '#a9b6af'; c.strokeStyle = '#2a342f'; c.lineWidth = 1;
  for(let i=0;i<=3;i++){ const v = mn + (mx-mn)*i/3, y = Y(v); c.beginPath(); c.moveTo(pad.l,y); c.lineTo(w-pad.r,y); c.stroke(); c.fillText(fmt(Math.round(v*10)/10), 2, y+4) }
  const stp = Math.ceil(pts.length/4); pts.forEach((p,i)=>{ if(i%stp===0 || i===pts.length-1) c.fillText(typeof p.x==='string' && p.x.length<6 ? p.x : dk(p.x), Math.max(pad.l-10, Math.min(X(i)-14, w-46)), h-6) });
  const g = c.createLinearGradient(0,pad.t,0,h-pad.b); g.addColorStop(0,'rgba(57,255,122,.32)'); g.addColorStop(1,'rgba(57,255,122,0)');
  c.beginPath(); pts.forEach((p,i)=> i ? c.lineTo(X(i),Y(p.y)) : c.moveTo(X(i),Y(p.y))); c.lineTo(X(pts.length-1),h-pad.b); c.lineTo(X(0),h-pad.b); c.fillStyle = g; c.fill();
  c.beginPath(); pts.forEach((p,i)=> i ? c.lineTo(X(i),Y(p.y)) : c.moveTo(X(i),Y(p.y))); c.strokeStyle = '#39ff7a'; c.lineWidth = 3; c.lineJoin='round'; c.stroke();
  pts.forEach((p,i)=>{ c.beginPath(); c.arc(X(i),Y(p.y),4,0,7); c.fillStyle='#0b0d0c'; c.fill(); c.strokeStyle='#39ff7a'; c.lineWidth=2; c.stroke() });
}
// lab = hvordan tallet over søjlen skrives. Er der ikke plads til alle tal, vises kun det højeste og det sidste.
function drawBars(cv, pts, lab = v => String(v)){
  if(!cv) return; const [c,w,h] = setupCanvas(cv);
  const pad = {l:4,r:4,t:16,b:20}, mx = Math.max(1,...pts.map(p=>p.y)), bw = (w-pad.l-pad.r)/pts.length;
  c.font = '600 11px Inter, sans-serif'; c.textAlign = 'center';
  const labs = pts.map(p => p.y ? lab(p.y) : ''), tight = labs.some(s => c.measureText(s).width > bw - 2);
  const top = pts.reduce((m,p,i) => p.y > pts[m].y ? i : m, 0);
  pts.forEach((p,i)=>{ const bh = (p.y/mx)*(h-pad.t-pad.b), x = pad.l + i*bw + bw*.15, y = h-pad.b-bh;
    c.fillStyle = i===pts.length-1 ? '#39ff7a' : '#1f6b3b'; c.fillRect(x,y,bw*.7,Math.max(bh,2));
    c.fillStyle = '#a9b6af'; c.fillText(p.x, x+bw*.35, h-5);
    if(labs[i] && (!tight || i === top || i === pts.length-1)) c.fillText(labs[i], x+bw*.35, y-4) });
}

/* ============================== HJEMMESKÆRM (PWA) ============================== */
let deferredPrompt = null;
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e });
addEventListener('appinstalled', () => { $('#installBox')?.remove(); toast(t('LIFT was added to your home screen')); track('installed') });
function showInstall(force){
  if(isStandalone() || window.top !== window.self) return;
  if(!force && (view !== 'home' || S.current || $('#modal .sheet'))) return;   // aldrig midt i en træning
  try{ if(!force && localStorage.getItem('lift_noinstall')) return }catch(e){}
  if(!force && !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) return;
  $('#installBox')?.remove();
  const d = document.createElement('div'); d.id = 'installBox'; d.className = 'install'; d.setAttribute('role','dialog');
  d.innerHTML = `<div class="banner"><span class="bi">${ic('install')}</span><div class="grow"><b>${t('Add LIFT to your home screen')}</b>
    ${deferredPrompt ? `<p class="small mut">${t('Then it opens like a real app.')}</p><button class="btn sm pri block" onclick="doInstall()">${t('Install app')}</button>`
      : isIOS() ? `<p class="small">${t('1. Tap Share {i} in Safari', {i:ic('share','sm')})}<br>${t('2. Choose <b>Add to Home Screen</b>')}<br>${t('3. Tap <b>Add</b>')}</p>`
      : `<p class="small">${t('Open the browser menu (⋮) and choose <b>Add to Home screen</b>.')}</p>`}</div>
    <button class="iconbtn" onclick="dismissInstall()" aria-label="${t('Close')}">${ic('x')}</button></div>`;
  document.body.appendChild(d);
}
function dismissInstall(){ try{ localStorage.setItem('lift_noinstall','1') }catch(e){} $('#installBox')?.remove() }
async function doInstall(){ if(!deferredPrompt) return; deferredPrompt.prompt(); try{ await deferredPrompt.userChoice }catch(e){} deferredPrompt = null; $('#installBox')?.remove() }
if('serviceWorker' in navigator && location.protocol==='https:') navigator.serviceWorker.register('sw.js').catch(()=>{});

/* ============================== START ============================== */
let resizeT; addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(()=>{ if(['goals','home','train'].includes(view) && !$('#modal .sheet')) render() }, 200) });
function start(){
  load();
  LANG = S.profile.lang || detectLang(); document.documentElement.lang = LANG;
  if(S.summary) view = 'done'; else if(S.current) view = 'workout';
  render();
  initAccount();
}
