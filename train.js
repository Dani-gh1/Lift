/* LIFT – Træning: repcount-log, rutiner, skabeloner, historik */
'use strict';

/* ---------- Historik-hjælpere ---------- */
const doneSets = e => e.sets.filter(s => s.done);
const e1rm = s => s.kg > 0 ? s.kg * (1 + s.reps/30) : 0;     // estimeret max (Epley)
const volumeOf = w => w.ex.reduce((a,e) => a + doneSets(e).reduce((b,s) => b + (s.kg||0)*(s.reps||0), 0), 0);
const setCount = w => w.ex.reduce((a,e) => a + doneSets(e).length, 0);
// Sidste gang øvelsen blev lavet (færdige sæt)
function lastPerformance(id, beforeId){
  for(let i = S.workouts.length - 1; i >= 0; i--){
    const w = S.workouts[i]; if(w.id === beforeId) continue;
    const e = w.ex.find(x => x.id === id); if(e && doneSets(e).length) return {date:w.end || w.start, sets:doneSets(e)};
  }
  return null;
}
// Bedste resultat nogensinde: vægt-øvelser = højeste e1RM, ellers flest reps/sekunder
function bestEver(id, excludeId){
  const t = exInfo(id).t; let best = null;
  S.workouts.forEach(w => { if(w.id === excludeId) return; w.ex.forEach(e => { if(e.id !== id) return; doneSets(e).forEach(s => {
    const v = t === 'w' ? e1rm(s) : s.reps; if(!best || v > best.v) best = {v, s} }) }) });
  return best;
}
const setText = (x, s) => x.t === 'w' ? `${fmt(s.kg)} kg × ${s.reps}` : x.t === 's' ? `${s.reps} sec` : `${s.reps} reps`;
const lastText = (x, lp) => !lp ? '' : x.t === 'w' ? lp.sets.map(s => `${fmt(s.kg)}×${s.reps}`).join(', ') + ' kg' : lp.sets.map(s => s.reps).join(', ') + ' ' + unitOf(x);
function weekStreak(){
  const need = Math.max(1, (S.profile.weeklyGoal||3) - 1), cnt = {};
  S.workouts.forEach(w => { const k = weekStart(w.start); cnt[k] = (cnt[k]||0) + 1 });
  let n = 0, cur = weekStart(new Date());
  if((cnt[cur]||0) >= need) n++;
  cur -= 7*DAY; while((cnt[cur]||0) >= need){ n++; cur -= 7*DAY }
  return n;
}
const thisWeek = () => S.workouts.filter(w => weekStart(w.start) === weekStart(new Date()));
function weekDaysHTML(){
  const w = weekStart(new Date()), done = new Set(thisWeek().map(x => (new Date(x.start).getDay()+6)%7)), today = (new Date().getDay()+6)%7;
  return `<div class="days7" aria-label="Training days this week">${['M','T','W','T','F','S','S'].map((d,i)=>`<div>${d}<i class="${done.has(i)?'d':i===today?'t':''}">${done.has(i)?ic('check'):''}</i></div>`).join('')}</div>`;
}
const durText = ms => { const m = Math.max(1, Math.round(ms/60000)); return m >= 60 ? `${Math.floor(m/60)} h ${m%60} min` : `${m} min` };

/* ---------- Træning-fanen ---------- */
function nextRoutine(){
  // den rutine, der er længst siden man har lavet
  if(!S.routines.length) return null;
  const last = id => { for(let i = S.workouts.length-1; i >= 0; i--) if(S.workouts[i].routineId === id) return S.workouts[i].start; return 0 };
  return S.routines.slice().sort((a,b) => last(a.id) - last(b.id))[0];
}
const workoutRow = w => `<button class="lrow" onclick="showWorkout('${w.id}')"><span class="grow" style="min-width:0"><b>${esc(w.name)}</b><span class="xs mut ell">${w.ex.map(e => esc(exInfo(e.id).n)).join(', ')}</span></span><span class="xs mut right">${dk(w.start)}<br>${setCount(w)} sets</span></button>`;
SCREENS.train = app => {
  const recent = S.workouts.slice(-4).reverse();
  app.innerHTML = `<div class="wrap">
    ${header(`<h1>Train</h1>`, syncChip())}
    ${S.current ? `<div class="card hl"><div class="banner"><span class="bi">${ic('timer')}</span><div class="grow"><b>Workout in progress</b><p class="small mut">${esc(S.current.name)} · ${durText(Date.now()-S.current.start)}</p></div></div>
      <button class="btn pri block" style="margin-top:10px" onclick="go('workout')">${ic('play')} Continue workout</button></div>`
    : `<button class="btn pri block big" onclick="startWorkout()">${ic('plus')} Start empty workout</button>`}

    <div class="sect"><span>My routines</span><button class="link" onclick="editRoutine()">${ic('plus','xs')} New</button></div>
    ${S.routines.length ? S.routines.map(r => `<div class="lrow"><button class="lmain" onclick="startWorkout('${r.id}')" aria-label="Start ${esc(r.name)}"><span class="playdot">${ic('play','sm')}</span><span class="grow" style="min-width:0"><b>${esc(r.name)}</b><span class="xs mut ell">${r.ex.map(e => esc(exInfo(e.id).n)).join(' · ')}</span></span></button><button class="iconbtn flat" onclick="routineMenu('${r.id}')" aria-label="More for ${esc(r.name)}">${ic('dots')}</button></div>`).join('')
      : `<p class="small mut">Routines are workouts you repeat. Make your own, or start from a template.</p>`}
    <button class="btn sm block subtle" onclick="openTemplates()">${ic('layers','sm')} Browse templates</button>

    <div class="sect"><span>Body weight</span>${S.body.length ? `<button class="link" onclick="openWeight()">History</button>` : ''}</div>
    ${weightCard()}

    <div class="sect"><span>History</span>${S.workouts.length > 4 ? `<button class="link" onclick="allHistory()">See all ${S.workouts.length}</button>` : ''}</div>
    ${recent.length ? recent.map(workoutRow).join('') : `<p class="small mut">Your finished workouts show up here.</p>`}
  </div>`;
};
function openTemplates(){
  modal(`<div class="row between"><h2 style="margin:0">Templates</h2>${closeBtn()}</div>
    <p class="small mut">Ready-made workouts. Start one now, or add it to your routines.</p>
    ${TEMPLATES.map(t => `<button class="lrow" onclick="templateMenu('${t.id}')"><span class="grow" style="min-width:0"><b>${esc(t.name)}</b><span class="xs mut">${esc(t.tag)} · ${t.ex.length} exercises</span></span>${ic('chevR','sm')}</button>`).join('')}`);
}

/* ---------- Kropsvægt ---------- */
const weights = () => S.body.slice().sort((a,b) => a.d - b.d);
function spark(vals, w=120, h=36){
  if(vals.length < 2) return '';
  const mn = Math.min(...vals), mx = Math.max(...vals), r = (mx - mn) || 1;
  const pts = vals.map((v,i) => `${(i/(vals.length-1)*w).toFixed(1)},${(h - 4 - (v-mn)/r*(h-8)).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="#39ff7a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
function weightCard(){
  const ws = weights(), cur = ws[ws.length-1];
  const ago = ws.filter(b => b.d <= Date.now() - 28*DAY).pop() || ws[0];
  const diff = cur && ago && ago !== cur ? cur.kg - ago.kg : null;
  const wg = (S.goals||[]).find(g => g.type === 'weight' && !g.done);
  return `<div class="card wcard">
    ${cur ? `<div class="row between"><div><span class="big">${fmt(cur.kg)}<small> kg</small></span>
        <div class="xs mut">${dk(cur.d)}${diff != null ? ` · <b class="${Math.abs(diff) < .05 ? '' : 'neon'}">${diff > 0 ? '+' : ''}${fmt(diff)} kg</b> since ${dk(ago.d)}` : ''}</div>
        ${wg ? `<div class="xs mut" style="margin-top:2px">${ic('target','xs')} Goal ${fmt(wg.target)} kg · ${fmt(Math.abs(cur.kg - wg.target))} kg to go</div>` : ''}</div>
        ${spark(ws.slice(-12).map(b => b.kg))}</div>` : `<p class="small mut" style="margin-top:0">Log your weight now and then to see how it changes.</p>`}
    <form class="row" style="margin-top:10px" onsubmit="logWeight(event)"><input id="bw" class="txt grow" inputmode="decimal" placeholder="${cur ? "Today's weight" : 'Your weight'}" aria-label="Body weight in kg"><span class="mut">kg</span><button class="btn sm pri">Log</button></form>
  </div>`;
}
function logWeight(e){
  e.preventDefault(); const v = parseFloat(($('#bw').value||'').replace(',','.'));
  if(!v || v < 20 || v > 400) return toast('Enter your weight in kg');
  const today = dayKey(), same = S.body.find(b => dayKey(b.d) === today);
  if(same){ same.kg = v; same.d = Date.now(); upsert('body', same) } else upsert('body', {id:newId(), d:Date.now(), kg:v});
  S.profile.weight = v; setProfile('pu', Date.now()); track('weight-log');
  const reached = typeof checkGoals === 'function' ? checkGoals() : [];
  render(); if(reached.length) celebrate(reached); else toast('Weight logged');
}
function openWeight(){
  const ws = weights().reverse();
  modal(`<div class="row between"><h2 style="margin:0">Body weight</h2>${closeBtn()}</div>
    ${ws.map(b => `<div class="row between" style="padding:10px 0;border-top:1px solid var(--line)"><span class="small mut">${weekday(b.d)}</span><span class="row" style="gap:6px"><b>${fmt(b.kg)} kg</b><button class="iconbtn flat" onclick="removeItem('body','${b.id}');openWeight();render()" aria-label="Delete ${dk(b.d)}">${ic('trash','sm')}</button></span></div>`).join('')}
    ${!isPremium() && ws.length >= 2 ? `<p class="xs mut" style="margin-top:10px">${ic('lock','xs')} See the full weight chart under Goals → Stats with Premium.</p>` : ''}`);
}

/* ---------- Start / aktiv træning ---------- */
let lastPop = null;
function buildSets(id, n, reps){
  const x = exInfo(id), lp = lastPerformance(id);
  return Array.from({length: n || (lp ? lp.sets.length : 3)}, (_, k) => {
    const prev = lp && (lp.sets[k] || lp.sets[lp.sets.length-1]);
    return {kg: prev ? prev.kg : 0, reps: prev ? prev.reps : (reps || (x.t==='s' ? 30 : 10)), done:false};
  });
}
function startWorkout(routineId){
  if(S.current){ go('workout'); return }
  const r = routineId && (S.routines.find(x => x.id === routineId) || TEMPLATES.find(x => x.id === routineId));
  const ex = !r ? [] : (r.ex || []).map(e => Array.isArray(e) ? {id:e[0], sets:e[1], reps:e[2]} : e);
  S.current = {id:newId(), start:Date.now(), name: r ? r.name : 'Workout', routineId: r ? r.id : null,
    ex: ex.filter(e => EX[e.id] || S.customEx.find(c => c.id === e.id)).map(e => ({id:e.id, target:e.reps||null, sets:buildSets(e.id, e.sets, e.reps)}))};
  lsSave(); track('workout-start'); go('workout');
  if(!S.current.ex.length) setTimeout(() => pickExercise(addExercise), 150);
}
function suggestion(id, target){
  const x = exInfo(id), lp = lastPerformance(id);
  if(!lp || x.t !== 'w' || !target) return '';
  if(lp.sets.every(s => s.reps >= target)){ const inc = x.inc || 2.5, top = Math.max(...lp.sets.map(s => s.kg)); return `You hit every set last time – try ${fmt(top + inc)} kg` }
  return '';
}
SCREENS.workout = app => {
  const c = S.current; if(!c){ view = 'train'; return render() }
  const all = c.ex.reduce((a,e) => a + e.sets.length, 0), done = c.ex.reduce((a,e) => a + doneSets(e).length, 0);
  app.innerHTML = `<div class="wrap" style="padding-bottom:150px">
    ${header(`<button class="iconbtn back" onclick="go(prevView || 'home')" aria-label="Back (workout keeps running)">${ic('chevL')}</button><div class="grow" style="min-width:0"><input class="titlein" value="${esc(c.name)}" aria-label="Workout name" onchange="S.current.name=this.value.trim()||'Workout';lsSave()"><div class="xs mut" id="wTimer">${durText(Date.now()-c.start)} · ${done}/${all} sets</div></div>`,
      `<button class="btn sm pri" onclick="finishWorkout()">Finish</button>`)}
    ${c.ex.map((e,i) => { const x = exInfo(e.id), lp = lastPerformance(e.id), sug = suggestion(e.id, e.target);
      return `<section class="ex ${e.sets.length && e.sets.every(s=>s.done)?'alldone':''}">
        <div class="hd"><button class="exname" onclick="showExercise('${e.id}')"><h3 style="margin:0">${esc(x.n)}</h3><span class="xs mut">${esc(x.m)}${e.target ? ` · goal ${e.target} ${unitOf(x)}` : ''}</span></button>
          <button class="iconbtn" onclick="exMenu(${i})" aria-label="Options for ${esc(x.n)}">${ic('dots')}</button></div>
        ${lp ? `<div class="last">${ic('clock','sm')} Last time (${dk(lp.date)}): <b>${esc(lastText(x, lp))}</b></div>` : `<div class="last">${ic('star','sm')} First time – pick a weight you can control.</div>`}
        ${sug ? `<div class="sug">${ic('target','sm')}<span>${esc(sug)}</span></div>` : ''}
        <div class="setrow head ${x.t==='w'?'wt':''}"><span>Set</span><span>Previous</span>${x.t==='w'?'<span>kg</span>':''}<span>${x.t==='s'?'sec':'reps'}</span><span></span></div>
        ${e.sets.map((s,j) => { const prev = lp && lp.sets[j];
          return `<div class="setrow ${x.t==='w'?'wt':''} ${s.done?'done':''} ${lastPop===i+'-'+j?'pop':''}">
          <span class="n">${j+1}</span>
          <span class="prev xs">${prev ? esc(setText(x, prev)) : '–'}</span>
          ${x.t==='w' ? numIn(i,j,'kg',s.kg) : ''}${numIn(i,j,'reps',s.reps)}
          <button class="chk" aria-label="Set ${j+1} done" aria-pressed="${s.done}" onclick="toggleSet(${i},${j})">${ic('check')}</button></div>` }).join('')}
        <div class="row" style="padding:8px 12px 12px;gap:8px"><button class="btn sm grow" onclick="addSet(${i})">${ic('plus','sm')} Add set</button>${e.sets.length > 1 ? `<button class="btn sm" onclick="removeSet(${i})" aria-label="Remove last set">${ic('minus','sm')}</button>` : ''}</div>
      </section>` }).join('')}
    <button class="btn block" style="margin-top:12px" onclick="pickExercise(addExercise)">${ic('plus')} Add exercise</button>
    <button class="btn ghost block danger-txt" style="margin-top:6px" onclick="discardWorkout()">Discard workout</button>
  </div>`;
  lastPop = null;
};
// Tal-felt: tryk og skriv. Tastaturet på mobilen bliver numerisk.
function numIn(i,j,k,v){ return `<input class="num" inputmode="decimal" enterkeyhint="next" value="${k==='kg' ? (v ? fmt(v,2) : '') : (v ?? '')}" placeholder="0" aria-label="${k} set ${j+1}" onfocus="this.select()" onchange="setVal(${i},${j},'${k}',this.value)">` }
function setVal(i,j,k,v){
  const n = parseFloat(String(v).replace(',','.')); const e = S.current.ex[i], prevKg = e.sets[j].kg;
  e.sets[j][k] = isNaN(n) ? 0 : Math.max(0, Math.min(k==='kg' ? 1000 : 9999, n));
  if(k === 'kg'){
    e.sets.forEach((s,m) => { if(m > j && !s.done && (!s.kg || s.kg === prevKg)) s.kg = e.sets[j].kg });
    // vis de kopierede vægte med det samme (uden at gentegne og miste fokus)
    const sec = document.querySelectorAll('section.ex')[i];
    if(sec) e.sets.forEach((s,m) => { const inp = sec.querySelector(`input[aria-label="kg set ${m+1}"]`); if(inp && m > j && document.activeElement !== inp) inp.value = s.kg ? fmt(s.kg,2) : '' });
  }
  lsSave();
}
function addSet(i){ const e = S.current.ex[i], l = e.sets[e.sets.length-1] || {kg:0, reps:10}; e.sets.push({kg:l.kg, reps:l.reps, done:false}); lsSave(); render() }
function removeSet(i){ S.current.ex[i].sets.pop(); lsSave(); render() }
function toggleSet(i,j){
  ensureAudio();
  // Gem det der evt. lige er skrevet i felterne
  document.querySelectorAll('.setrow input.num').forEach(inp => inp.dispatchEvent(new Event('change')));
  const s = S.current.ex[i].sets[j]; s.done = !s.done; lastPop = s.done ? i+'-'+j : null; lsSave();
  if(s.done){ vibrate(25); startRest(S.profile.restDefault || 90) }
  render();
}
function addExercise(id){ S.current.ex.push({id, target:null, sets:buildSets(id)}); lsSave(); closeModal(); render(); setTimeout(()=>{ const s = document.querySelectorAll('section.ex'); s[s.length-1]?.scrollIntoView({behavior:'smooth', block:'start'}) }, 50) }
function exMenu(i){
  const x = exInfo(S.current.ex[i].id);
  modal(`<div class="row between"><h2 style="margin:0">${esc(x.n)}</h2>${closeBtn()}</div>
    <button class="btn block" style="margin-top:12px" onclick="closeModal();showExercise('${S.current.ex[i].id}')">${ic('info')} How to do it</button>
    ${i > 0 ? `<button class="btn block" style="margin-top:8px" onclick="moveEx(${i},-1)">Move up</button>` : ''}
    ${i < S.current.ex.length-1 ? `<button class="btn block" style="margin-top:8px" onclick="moveEx(${i},1)">Move down</button>` : ''}
    <button class="btn block" style="margin-top:8px" onclick="closeModal();pickExercise(id=>{S.current.ex[${i}]={id,target:null,sets:buildSets(id)};lsSave();closeModal();render()})">${ic('swap')} Replace exercise</button>
    <button class="btn block danger" style="margin-top:8px" onclick="S.current.ex.splice(${i},1);lsSave();closeModal();render()">${ic('trash')} Remove exercise</button>`);
}
function moveEx(i,d){ const a = S.current.ex; [a[i], a[i+d]] = [a[i+d], a[i]]; lsSave(); closeModal(); render() }
function discardWorkout(){
  modal(`<h2>Discard workout?</h2><p class="mut">Nothing from this workout will be saved.</p>
    <div class="grid2"><button class="btn" onclick="closeModal()">Keep going</button><button class="btn danger" onclick="S.current=null;stopRest();lsSave();go(prevView || 'home')">Discard</button></div>`);
}
setInterval(() => { if(view === 'workout' && S.current){ const t = $('#wTimer'); if(t){ const c = S.current, all = c.ex.reduce((a,e)=>a+e.sets.length,0), d = c.ex.reduce((a,e)=>a+doneSets(e).length,0); t.textContent = `${durText(Date.now()-c.start)} · ${d}/${all} sets` } } }, 15000);

/* ---------- Afslut ---------- */
function finishWorkout(force){
  document.querySelectorAll('.setrow input.num').forEach(inp => inp.dispatchEvent(new Event('change')));
  const c = S.current, ex = c.ex.map(e => ({id:e.id, sets:doneSets(e).map(s => ({kg:s.kg||0, reps:s.reps||0, done:true}))})).filter(e => e.sets.length);
  if(!ex.length) return toast('Tick off at least one set first ✓');
  const open = c.ex.reduce((a,e) => a + e.sets.filter(s => !s.done).length, 0);
  if(open && !force) return modal(`<h2>Finish workout?</h2><p class="mut">${open} set${open>1?'s are':' is'} not ticked off. Only ticked sets are saved.</p>
    <div class="grid2"><button class="btn" onclick="closeModal()">Keep going</button><button class="btn pri" onclick="closeModal();finishWorkout(true)">Finish</button></div>`);
  const w = {id:c.id, start:c.start, end:Date.now(), name:c.name, routineId:c.routineId, ex};
  const prs = [];
  ex.forEach(e => { const x = exInfo(e.id), b = bestEver(e.id, w.id); if(!b) return;
    const top = e.sets.reduce((a,s) => (x.t==='w' ? e1rm(s) : s.reps) > (x.t==='w' ? e1rm(a) : a.reps) ? s : a, e.sets[0]);
    const v = x.t==='w' ? e1rm(top) : top.reps;
    if(v > b.v + 0.01) prs.push({n:x.n, now:setText(x, top), before:setText(x, b.s)}) });
  upsert('workouts', w);
  const reached = typeof checkGoals === 'function' ? checkGoals().map(g => goalState(g).title) : [];
  const wk = thisWeek().length, wg = S.profile.weeklyGoal || 3;
  S.summary = {id:w.id, prs, goals:reached, weekly: wk === wg ? wg : 0, ros:ROS[Math.floor(Math.random()*ROS.length)], fromRoutine:!!c.routineId && !!S.routines.find(r => r.id === c.routineId)};
  S.current = null; stopRest(); lsSave();
  track('workout-complete'); if(S.workouts.length === 1) trackOnce('first-workout'); if(S.workouts.length === 10) trackOnce('ten-workouts');
  go('done');
}
SCREENS.done = app => {
  const s = S.summary, w = s && S.workouts.find(x => x.id === s.id); if(!w){ S.summary = null; view = 'train'; return render() }
  const vol = volumeOf(w);
  app.innerHTML = `<div class="wrap" style="padding-top:var(--top)">
    <div class="done-hero"><div class="badge-big">${ic(s.prs.length ? 'trophy' : 'check')}</div><h1>${esc(s.ros)}</h1><p class="mut">${esc(w.name)} · ${weekday(w.start)}</p></div>
    <div class="grid3"><div class="stat"><span>Time</span><b>${durText(w.end-w.start)}</b></div><div class="stat"><span>Sets</span><b>${setCount(w)}</b></div><div class="stat"><span>Volume</span><b>${vol ? Math.round(vol).toLocaleString('en-GB') + ' kg' : '–'}</b></div></div>
    ${(s.goals||[]).length ? `<div class="card goalhit"><div class="banner"><span class="bi">${ic('trophy')}</span><div class="grow"><b>Goal reached!</b>${s.goals.map(t => `<p class="small" style="margin:2px 0 0">${esc(t)}</p>`).join('')}</div></div></div>` : ''}
    ${s.weekly ? `<div class="card"><div class="banner"><span class="bi">${ic('flame')}</span><div class="grow"><b>Weekly goal reached</b><p class="small mut" style="margin:2px 0 0">${s.weekly} of ${s.weekly} workouts this week. Streak: ${weekStreak()} week${weekStreak()===1?'':'s'}.</p></div></div></div>` : ''}
    ${s.prs.length ? `<h3 style="margin-top:18px">New records 🏆</h3>${s.prs.map(r => `<div class="pr">${ic('trophy')}<span class="grow"><b>${esc(r.n)}</b><br><span class="xs mut">before: ${esc(r.before)}</span></span><b>${esc(r.now)}</b></div>`).join('')}` : ''}
    <div class="card"><h3>Your workout</h3>${w.ex.map(e => { const x = exInfo(e.id); return `<div class="row between" style="padding:6px 0;border-top:1px solid var(--line)"><span class="small">${esc(x.n)}</span><span class="small mut">${e.sets.map(st => x.t==='w' ? `${fmt(st.kg)}×${st.reps}` : st.reps).join(', ')}</span></div>` }).join('')}</div>
    ${s.fromRoutine ? '' : `<button class="btn block" onclick="saveAsRoutine('${w.id}')">${ic('list')} Save as routine</button>`}
    <button class="btn pri block" style="margin-top:10px" onclick="S.summary=null;lsSave();go(prevView || 'home')">Done</button>
  </div>`;
};

/* ---------- Historik ---------- */
function showWorkout(id){
  const w = S.workouts.find(x => x.id === id); if(!w) return;
  modal(`<div class="row between"><h2 style="margin:0">${esc(w.name)}</h2>${closeBtn()}</div>
    <p class="small mut">${weekday(w.start)} · ${durText((w.end||w.start)-w.start)} · ${setCount(w)} sets${volumeOf(w) ? ` · ${Math.round(volumeOf(w)).toLocaleString('en-GB')} kg` : ''}</p>
    ${w.ex.map(e => { const x = exInfo(e.id); return `<div class="card" style="margin:8px 0"><b>${esc(x.n)}</b>${e.sets.map((s,j) => `<div class="row between small" style="padding:4px 0;border-top:1px solid var(--line)"><span class="mut">Set ${j+1}</span><span>${esc(setText(x, s))}</span></div>`).join('')}</div>` }).join('')}
    <div class="grid2"><button class="btn" onclick="saveAsRoutine('${w.id}')">${ic('list','sm')} Save as routine</button><button class="btn danger" onclick="confirmDelete('${w.id}')">${ic('trash','sm')} Delete</button></div>`);
}
function confirmDelete(id){ modal(`<h2>Delete workout?</h2><p class="mut">It will be removed from your history and stats.</p><div class="grid2"><button class="btn" onclick="closeModal()">Keep</button><button class="btn danger" onclick="removeItem('workouts','${id}');closeModal();render();toast('Workout deleted')">Delete</button></div>`) }
function allHistory(){
  modal(`<div class="row between"><h2 style="margin:0">All workouts</h2>${closeBtn()}</div>
    ${S.workouts.slice().reverse().map(w => `<button class="row between link" style="width:100%;color:var(--txt);border-top:1px solid var(--line)" onclick="showWorkout('${w.id}')"><span class="small"><b>${esc(w.name)}</b> <span class="mut">· ${setCount(w)} sets</span></span><span class="xs mut">${weekday(w.start)}</span></button>`).join('')}`);
}

/* ---------- Rutiner ---------- */
let draft = null;
function editRoutine(id){
  const r = id && S.routines.find(x => x.id === id);
  draft = r ? JSON.parse(JSON.stringify(r)) : {id:newId(), name:'', ex:[]};
  go('routine');
}
function saveAsRoutine(fromWorkoutId){
  const w = S.workouts.find(x => x.id === fromWorkoutId);
  draft = {id:newId(), name: w.name === 'Workout' ? '' : w.name, ex: w.ex.map(e => ({id:e.id, sets:e.sets.length, reps:e.sets[0]?.reps || 10}))};
  go('routine');
}
SCREENS.routine = app => {
  if(!draft){ view = 'train'; return render() }
  app.innerHTML = `<div class="wrap">
    ${header(`<button class="iconbtn back" onclick="draft=null;go('train')" aria-label="Cancel">${ic('x')}</button><h1>${S.routines.find(r=>r.id===draft.id) ? 'Edit routine' : 'New routine'}</h1>`, `<button class="btn sm pri" onclick="saveRoutine()">Save</button>`)}
    <label class="small mut" for="rName">Name</label>
    <input id="rName" class="txt" placeholder="e.g. Upper body" value="${esc(draft.name)}" oninput="draft.name=this.value" style="margin:6px 0 12px">
    ${draft.ex.map((e,i) => { const x = exInfo(e.id); return `<div class="card row" style="gap:8px"><div class="grow" style="min-width:0"><b>${esc(x.n)}</b><div class="xs mut">${esc(x.m)}</div></div>
      <label class="mini"><input class="num sm" inputmode="numeric" value="${e.sets}" onchange="draft.ex[${i}].sets=Math.max(1,parseInt(this.value)||1)" aria-label="Sets"><small>sets</small></label>
      <label class="mini"><input class="num sm" inputmode="numeric" value="${e.reps}" onchange="draft.ex[${i}].reps=Math.max(1,parseInt(this.value)||1)" aria-label="${unitOf(x)}"><small>${unitOf(x)}</small></label>
      <button class="iconbtn" onclick="draft.ex.splice(${i},1);render()" aria-label="Remove">${ic('x')}</button></div>` }).join('')}
    <button class="btn block" onclick="pickExercise(id=>{draft.ex.push({id,sets:3,reps:exInfo(id).t==='s'?30:10});closeModal();render()})">${ic('plus')} Add exercise</button>
  </div>`;
};
function saveRoutine(){
  draft.name = (draft.name || '').trim();
  if(!draft.name) return toast('Give your routine a name');
  if(!draft.ex.length) return toast('Add at least one exercise');
  upsert('routines', draft); draft = null; toast('Routine saved'); track('routine-saved'); go('train');
}
function routineMenu(id){
  const r = S.routines.find(x => x.id === id);
  modal(`<div class="row between"><h2 style="margin:0">${esc(r.name)}</h2>${closeBtn()}</div>
    <p class="small mut">${r.ex.map(e => `${esc(exInfo(e.id).n)} – ${e.sets}×${e.reps}`).join('<br>')}</p>
    <button class="btn pri block" onclick="closeModal();startWorkout('${id}')">${ic('play')} Start</button>
    <button class="btn block" style="margin-top:8px" onclick="closeModal();editRoutine('${id}')">${ic('edit')} Edit</button>
    <button class="btn block danger" style="margin-top:8px" onclick="removeItem('routines','${id}');closeModal();render();toast('Routine deleted')">${ic('trash')} Delete</button>`);
}
function templateMenu(id){
  const t = TEMPLATES.find(x => x.id === id);
  modal(`<div class="row between"><div><span class="xs neon">${esc(t.tag)}</span><h2 style="margin:0">${esc(t.name)}</h2></div>${closeBtn()}</div>
    ${t.ex.map(([eid,s,r]) => `<button class="row between link" style="width:100%;color:var(--txt);border-top:1px solid var(--line)" onclick="showExercise('${eid}')"><span>${esc(exInfo(eid).n)}</span><span class="mut small">${s} × ${r} ${exInfo(eid).t==='s'?'sec':''}</span></button>`).join('')}
    <button class="btn pri block" style="margin-top:12px" onclick="closeModal();startWorkout('${id}')">${ic('play')} Start now</button>
    <button class="btn block" style="margin-top:8px" onclick="copyTemplate('${id}')">${ic('copy')} Add to my routines</button>`);
}
function copyTemplate(id){ const t = TEMPLATES.find(x => x.id === id); upsert('routines', {id:newId(), name:t.name, ex:t.ex.map(([eid,s,r]) => ({id:eid, sets:s, reps:r}))}); closeModal(); render(); toast('Added to your routines') }

/* ---------- Øvelsesvælger ---------- */
let pickCb = null, pickQ = '', pickM = '';
function pickExercise(cb){ pickCb = cb; pickQ = ''; pickM = ''; renderPicker() }
function pickerList(){
  const q = pickQ.toLowerCase(), list = allExercises().filter(x => (!pickM || x.m === pickM) && (!q || x.n.toLowerCase().includes(q)))
    .sort((a,b) => (lastPerformance(b.id) ? 1 : 0) - (lastPerformance(a.id) ? 1 : 0) || a.n.localeCompare(b.n));
  return list.map(x => { const lp = lastPerformance(x.id); return `<button class="exitem" onclick="pickCb('${x.id}')"><span class="grow"><b>${esc(x.n)}</b><span class="xs mut"> · ${esc(x.m)}${x.custom?' · custom':''}</span></span>${lp ? `<span class="xs mut">${dk(lp.date)}</span>` : ''}${ic('plus','sm')}</button>` }).join('') || `<p class="small mut center">No exercise found – create it below.</p>`;
}
function renderPicker(onlyList){
  if(onlyList && $('#modal .exlist')){ $('#modal .exlist').innerHTML = pickerList(); $('#cxBtn').innerHTML = `${ic('plus')} Create “${esc(pickQ || 'custom exercise')}”`; return }
  modal(`<div class="row between"><h2 style="margin:0">Add exercise</h2>${closeBtn()}</div>
    <div class="searchbox">${ic('search')}<input id="pq" class="txt" placeholder="Search exercises" value="${esc(pickQ)}" oninput="pickQ=this.value;renderPicker(true)" aria-label="Search exercises"></div>
    <div class="chips scroll">${['', ...MUSCLES].map(m => `<button class="chip ${pickM===m?'on':''}" onclick="pickM='${m}';renderPicker()">${m || 'All'}</button>`).join('')}</div>
    <div class="exlist">${pickerList()}</div>
    <button class="btn block" id="cxBtn" style="margin-top:10px" onclick="newCustomExercise()">${ic('plus')} Create “${esc(pickQ || 'custom exercise')}”</button>`);
}
function newCustomExercise(){
  const name = pickQ.trim();
  modal(`<div class="row between"><h2 style="margin:0">New exercise</h2>${closeBtn()}</div>
    <label class="small mut" for="cxn">Name</label><input id="cxn" class="txt" value="${esc(name)}" style="margin:6px 0 12px">
    <p class="small mut" style="margin-bottom:6px">Muscle group</p><div class="chips" id="cxm">${MUSCLES.map((m,i) => `<button class="chip ${i===0?'on':''}" data-m="${m}" onclick="document.querySelectorAll('#cxm .chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${m}</button>`).join('')}</div>
    <p class="small mut" style="margin:12px 0 6px">Type</p><div class="chips" id="cxt">${[['w','Weight + reps'],['bw','Reps only'],['s','Time']].map(([v,l],i) => `<button class="chip ${i===0?'on':''}" data-t="${v}" onclick="document.querySelectorAll('#cxt .chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${l}</button>`).join('')}</div>
    <button class="btn pri block" style="margin-top:16px" onclick="saveCustomExercise()">Save exercise</button>`);
}
function saveCustomExercise(){
  const n = $('#cxn').value.trim(); if(!n) return toast('Give it a name');
  const x = {id:'c_' + newId(), n, m:$('#cxm .chip.on').dataset.m, t:$('#cxt .chip.on').dataset.t};
  upsert('customEx', x); toast('Exercise created');
  if(pickCb) pickCb(x.id); else closeModal();
}
function showExercise(id){
  const x = exInfo(id), b = bestEver(id), lp = lastPerformance(id);
  modal(`<div class="row between"><h2 style="margin:0">${esc(x.n)}</h2>${closeBtn()}</div>
    <p class="xs mut" style="margin-top:2px">${esc(x.m)}</p>
    ${x.a ? `<div class="demo" style="margin-top:10px"><span class="badge">ANIMATION</span>${demoSVG(id)}</div><p class="small center neon" style="margin:8px 0 0">${ic('clock','sm')} ${tempoText(id)}</p>` : ''}
    ${x.cue ? `<h3 style="margin-top:14px">How to do it</h3><ol class="cue">${x.cue.map(c => `<li>${esc(c)}</li>`).join('')}</ol>` : ''}
    <div class="grid2"><div class="stat"><span>Last time</span><b style="font-size:16px">${lp ? esc(lastText(x, lp)) : '–'}</b></div><div class="stat"><span>Best</span><b style="font-size:16px">${b ? esc(setText(x, b.s)) : '–'}</b></div></div>
    <div class="warnline" style="margin-top:12px">${ic('alert')}<span>Stop if it hurts. Ask a doctor if you're ill or injured.</span></div>`);
}
