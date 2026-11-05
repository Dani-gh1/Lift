/* LIFT – Træning: logbog, træning (sæt, vægt, reps, noter), rutiner, kropsvægt, kalender */
'use strict';

/* ---------- Historik-hjælpere ---------- */
const doneSets = e => e.sets.filter(s => s.done);
const e1rm = s => s.kg > 0 ? s.kg * (1 + s.reps/30) : 0;     // estimeret max (Epley)
const volumeOf = w => w.ex.reduce((a,e) => a + doneSets(e).reduce((b,s) => b + (s.kg||0)*(s.reps||0), 0), 0);
const setCount = w => w.ex.reduce((a,e) => a + doneSets(e).length, 0);
// Sidste gang øvelsen blev lavet (før en given træning)
function lastPerformance(id, beforeId, beforeTime){
  for(let i = S.workouts.length - 1; i >= 0; i--){
    const w = S.workouts[i]; if(w.id === beforeId || (beforeTime && w.start >= beforeTime)) continue;
    const e = w.ex.find(x => x.id === id); if(e && doneSets(e).length) return {date:w.end || w.start, sets:doneSets(e)};
  }
  return null;
}
// Bedste resultat nogensinde: vægt-øvelser = højeste e1RM, ellers flest reps/sekunder
function bestEver(id, excludeId){
  const t0 = exInfo(id).t; let best = null;
  S.workouts.forEach(w => { if(w.id === excludeId) return; w.ex.forEach(e => { if(e.id !== id) return; doneSets(e).forEach(s => {
    const v = t0 === 'w' ? e1rm(s) : s.reps; if(!best || v > best.v) best = {v, s} }) }) });
  return best;
}
const setText = (x, s) => x.t === 'w' ? `${fmt(s.kg)} kg × ${s.reps}` : x.t === 's' ? `${s.reps} ${t('sec')}` : `${s.reps} ${t('reps')}`;
const setShort = (x, s) => x.t === 'w' ? `${fmt(s.kg)}×${s.reps}` : `${s.reps}`;
const lastText = (x, lp) => !lp ? '' : x.t === 'w' ? lp.sets.map(s => setShort(x, s)).join(', ') + ' kg' : lp.sets.map(s => s.reps).join(', ') + ' ' + unitOf(x);
function weekStreak(){
  const need = Math.max(1, (S.profile.weeklyGoal||3) - 1), cnt = {};
  S.workouts.forEach(w => { const k = weekStart(w.start); cnt[k] = (cnt[k]||0) + 1 });
  let n = 0, cur = weekStart(new Date());
  if((cnt[cur]||0) >= need) n++;
  cur -= 7*DAY; while((cnt[cur]||0) >= need){ n++; cur -= 7*DAY }
  return n;
}
const thisWeek = () => S.workouts.filter(w => weekStart(w.start) === weekStart(new Date()));
const dayLetters = () => LANG === 'da' ? ['M','T','O','T','F','L','S'] : ['M','T','W','T','F','S','S'];
function weekDaysHTML(){
  const done = new Set(thisWeek().map(x => (new Date(x.start).getDay()+6)%7)), today = (new Date().getDay()+6)%7;
  return `<div class="days7" aria-label="${t('Training days this week')}">${dayLetters().map((d,i)=>`<div>${d}<i class="${done.has(i)?'d':i===today?'t':''}">${done.has(i)?ic('check'):''}</i></div>`).join('')}</div>`;
}
const durText = ms => { const m = Math.max(1, Math.round(ms/60000)); return m >= 60 ? `${Math.floor(m/60)} ${t('h')} ${m%60} min` : `${m} min` };
const defaultName = () => { const h = new Date().getHours(); return h < 11 ? t('Morning workout') : h < 17 ? t('Afternoon workout') : t('Evening workout') };
function nextRoutine(){
  // den rutine, der er længst siden man har lavet
  if(!S.routines.length) return null;
  const last = id => { for(let i = S.workouts.length-1; i >= 0; i--) if(S.workouts[i].routineId === id) return S.workouts[i].start; return 0 };
  return S.routines.slice().sort((a,b) => last(a.id) - last(b.id))[0];
}

/* ---------- Logbog (Train-fanen) ---------- */
let logEdit = false;
const monthTitle = ms => cap(new Date(ms).toLocaleDateString(LOC(), {month:'long', year:'numeric'}));
function logCard(w){
  const d = new Date(w.start), wd = d.toLocaleDateString(LOC(), {weekday:'short'}).replace('.', '');
  const lines = w.ex.filter(e => doneSets(e).length).map(e => `<span class="exl">${doneSets(e).length}× ${esc(exInfo(e.id).n)}</span>`);
  return `<div class="logcard">
    <button class="lmain" onclick="openWorkout('${w.id}')">
      <span class="datebadge"><small>${esc(wd)}</small><b>${d.getDate()}${LANG === 'da' ? '.' : ''}</b></span>
      <span class="grow" style="min-width:0"><span class="lhead"><b class="lname">${esc(w.name)}</b><span class="xs mut nowrap">${durText((w.end||w.start)-w.start)}</span></span>
        ${lines.slice(0,5).join('')}${lines.length > 5 ? `<span class="exl mut">${t('+{n} more', {n:lines.length-5})}</span>` : ''}</span>
    </button>
    ${logEdit ? `<button class="iconbtn flat danger-txt" onclick="confirmDelete('${w.id}')" aria-label="${t('Delete')}">${ic('trash')}</button>` : ''}
  </div>`;
}
SCREENS.train = app => {
  const list = S.workouts.slice().sort((a,b) => b.start - a.start), groups = [];
  list.forEach(w => { const d = new Date(w.start), k = d.getFullYear()*12 + d.getMonth(); let g = groups[groups.length-1];
    if(!g || g.k !== k){ g = {k, title:monthTitle(w.start), items:[]}; groups.push(g) } g.items.push(w) });
  const cur = typeof currentWeight === 'function' ? currentWeight() : null;
  app.innerHTML = `<div class="wrap">
    <div class="topbar">${list.length ? `<button class="link" onclick="logEdit=!logEdit;render()">${logEdit ? t('Done') : t('Edit')}</button>` : '<span></span>'}<span class="grow"></span>
      ${syncChip()}
      <button class="iconbtn flat" onclick="openCalendar()" aria-label="${t('Calendar')}">${ic('calendar')}</button>
      <button class="iconbtn flat" onclick="openStartSheet()" aria-label="${t('New workout')}">${ic('plus')}</button></div>
    <h1 class="bigtitle">${t('Log')}</h1>
    <div class="pillrow"><button class="pillbtn" onclick="go('routines')">${ic('list','sm')} ${t('Routines')}</button><button class="pillbtn" onclick="openWeight()">${ic('scale','sm')} ${cur ? fmt(cur) + ' kg' : t('Body weight')}</button></div>
    ${S.current ? `<button class="card hl resume" onclick="resumeWorkout()"><span class="live"></span><span class="grow" style="min-width:0"><b>${t('Workout in progress')}</b><span class="xs mut ell">${esc(S.current.name)} · ${durText(Date.now()-S.current.start)}</span></span>${ic('chevR')}</button>` : ''}
    ${groups.length ? groups.map(g => `<div class="mhead"><span>${esc(g.title)}</span><span>${t(g.items.length === 1 ? '{n} workout' : '{n} workouts', {n:g.items.length})}</span></div>${g.items.map(logCard).join('')}`).join('')
      : `<div class="card center" style="padding:28px 18px;margin-top:18px"><div class="bigicon" style="margin:0 auto 12px">${ic('log')}</div><b>${t('No workouts yet')}</b>
         <p class="small mut">${t('Tap + to start your first workout. It takes 10 seconds.')}</p><button class="btn pri" onclick="startWorkout()">${ic('plus')} ${t('Start workout')}</button></div>`}
  </div>`;
};
function openStartSheet(){
  if(S.current) return resumeWorkout();
  modal(`<div class="row between"><h2 style="margin:0">${t('Start workout')}</h2>${closeBtn()}</div>
    <button class="btn pri block" style="margin-top:12px" onclick="closeModal();startWorkout()">${ic('plus')} ${t('Empty workout')}</button>
    ${S.routines.length ? `<div class="sect"><span>${t('My routines')}</span></div>${S.routines.map(r => routineRow(r, true)).join('')}` : ''}
    <div class="sect"><span>${t('Templates')}</span><button class="link" onclick="go('routines')">${t('Manage routines')}</button></div>
    ${TEMPLATES.map(templateRow).join('')}`);
}
const routineRow = (r, closeFirst) => `<div class="lrow"><button class="lmain" onclick="${closeFirst ? 'closeModal();' : ''}startWorkout('${r.id}')"><span class="playdot">${ic('play','sm')}</span><span class="grow" style="min-width:0"><b>${esc(r.name)}</b><span class="xs mut ell">${r.ex.map(e => esc(exInfo(e.id).n)).join(' · ')}</span></span></button><button class="iconbtn flat" onclick="routineMenu('${r.id}')" aria-label="${t('More')}">${ic('dots')}</button></div>`;
const templateRow = x => `<button class="lrow" onclick="templateMenu('${x.id}')"><span class="grow" style="min-width:0"><b>${esc(t(x.name))}</b><span class="xs mut">${esc(t(x.tag))} · ${t('{n} exercises', {n:x.ex.length})}</span></span>${ic('chevR','sm')}</button>`;

/* ---------- Kalender ---------- */
let calM = null;
function openCalendar(){ const n = new Date(); calM = calM || new Date(n.getFullYear(), n.getMonth(), 1).getTime(); renderCal() }
function calShift(d){ const x = new Date(calM); calM = new Date(x.getFullYear(), x.getMonth() + d, 1).getTime(); renderCal() }
function renderCal(sel){
  const m = new Date(calM), y = m.getFullYear(), mo = m.getMonth(), first = (new Date(y, mo, 1).getDay() + 6) % 7, days = new Date(y, mo + 1, 0).getDate();
  const byDay = {}; S.workouts.forEach(w => { const k = dayKey(w.start); (byDay[k] = byDay[k] || []).push(w) });
  const today = dayKey(), count = S.workouts.filter(w => { const x = new Date(w.start); return x.getFullYear() === y && x.getMonth() === mo }).length;
  let cells = '<span></span>'.repeat(first);
  for(let d = 1; d <= days; d++){ const k = dayKey(new Date(y, mo, d)); cells += `<button class="cday ${byDay[k] ? 'on' : ''} ${k === today ? 'today' : ''} ${k === sel ? 'sel' : ''}" onclick="renderCal('${k}')">${d}</button>` }
  modal(`<div class="row between"><button class="iconbtn flat" onclick="calShift(-1)" aria-label="${t('Previous month')}">${ic('chevL')}</button><b>${esc(monthTitle(calM))}</b><button class="iconbtn flat" onclick="calShift(1)" aria-label="${t('Next month')}">${ic('chevR')}</button></div>
    <p class="xs mut center" style="margin:0 0 8px">${t(count === 1 ? '{n} workout' : '{n} workouts', {n:count})}</p>
    <div class="cal">${dayLetters().map(l => `<span class="xs mut">${l}</span>`).join('')}${cells}</div>
    ${sel ? ((byDay[sel] || []).map(w => `<button class="lrow" onclick="openWorkout('${w.id}')"><span class="grow"><b>${esc(w.name)}</b><span class="xs mut">${timeTxt(w.start)} · ${t('{n} sets', {n:setCount(w)})}</span></span>${ic('chevR','sm')}</button>`).join('') || `<p class="small mut center">${t('No workouts this day.')}</p>`) : ''}
    <button class="btn block" style="margin-top:10px" onclick="closeModal()">${t('Close')}</button>`);
}

/* ---------- Træning: start, åbn, gem ---------- */
let lastPop = null, wMode = 'active', wEdit = null, wDirty = false, wBack = 'train';
const cw = () => wMode === 'edit' ? wEdit : S.current;          // den træning, der vises lige nu
function persistW(){ if(wMode === 'edit') wDirty = true; else lsSave() }
const newSets = (id, n) => Array.from({length: n || (lastPerformance(id)?.sets.length) || 3}, () => ({kg:null, reps:null, done:false}));
function startWorkout(routineId){
  if(S.current){ resumeWorkout(); return }
  const r = routineId && (S.routines.find(x => x.id === routineId) || TEMPLATES.find(x => x.id === routineId));
  const ex = !r ? [] : (r.ex || []).map(e => Array.isArray(e) ? {id:e[0], sets:e[1], reps:e[2]} : e);
  S.current = {id:newId(), start:Date.now(), end:null, name: r ? (TEMPLATES.includes(r) ? t(r.name) : r.name) : defaultName(), notes:'', bw:null, routineId: r ? r.id : null,
    ex: ex.filter(e => EX[e.id] || S.customEx.find(c => c.id === e.id)).map(e => ({id:e.id, target:e.reps || null, sets:newSets(e.id, e.sets)}))};
  wMode = 'active'; wEdit = null; kp.open = false;
  lsSave(); track('workout-start'); go('workout');
  if(!S.current.ex.length) setTimeout(() => pickExercise(addExercise), 150);
}
function resumeWorkout(){ wMode = 'active'; wEdit = null; go('workout') }
function openWorkout(id){
  if(logEdit) return;
  const w = S.workouts.find(x => x.id === id); if(!w) return;
  kp.open = false; wEdit = JSON.parse(JSON.stringify(w)); wEdit.ex.forEach(e => e.sets.forEach(s => s.done = true));
  wMode = 'edit'; wDirty = false; wBack = ['workout','done'].includes(view) ? 'train' : view; go('workout');
}
function closeWorkout(){
  kpClose();
  if(wMode === 'edit'){
    if(wDirty) return modal(`<h2>${t('Discard changes?')}</h2><p class="mut">${t('Your changes to this workout will not be saved.')}</p>
      <div class="grid2"><button class="btn" onclick="closeModal()">${t('Keep editing')}</button><button class="btn danger" onclick="leaveEdit()">${t('Discard')}</button></div>`);
    return leaveEdit();
  }
  go(prevView || 'train');
}
function leaveEdit(){ wEdit = null; wMode = 'active'; wDirty = false; go(wBack || 'train') }
// prøv selv: forslag til vægt ud fra sidste gang
function suggestion(id, target){
  const x = exInfo(id), lp = lastPerformance(id);
  if(!lp || x.t !== 'w' || !target) return '';
  if(lp.sets.every(s => s.reps >= target)){ const inc = x.inc || 2.5, top = Math.max(...lp.sets.map(s => s.kg)); return t('You hit every set last time – try {kg} kg', {kg:fmt(top + inc)}) }
  return '';
}
// Grå tekst i tomme felter: sidste gangs sæt, ellers sættet over, ellers rutinens mål
function prevFor(w, i, j){
  const e = w.ex[i], lp = lastPerformance(e.id, w.id, w.start);
  if(lp) return lp.sets[j] || lp.sets[lp.sets.length-1];
  for(let k = j - 1; k >= 0; k--){ const s = e.sets[k]; if(s.reps != null) return s }
  return e.target ? {kg:null, reps:e.target} : null;
}
const cleanSet = s => Object.assign({kg:s.kg || 0, reps:s.reps || 0, done:true}, s.note ? {note:s.note} : {});

/* ---------- Træning: skærm ---------- */
function fieldHTML(i, j, k, s, ph, x){
  const label = k === 'kg' ? t('Weight') : x.t === 's' ? t('Time') : t('Reps');
  const act = kp.open && kp.i === i && kp.j === j && kp.k === k, v = s[k];
  const typed = act && !kp.fresh ? kp.buf.replace('.', decSep()) : null;
  const txt = typed != null ? typed : v != null ? (k === 'kg' ? fmt(v, 2) : String(v)) : '';
  const phTxt = ph && ph[k] != null ? (k === 'kg' ? fmt(ph[k], 2) : String(ph[k])) : '–';
  return `<button class="fld ${act ? 'act' : ''}" data-f="${i}_${j}_${k}" onclick="kpOpen(${i},${j},'${k}')" aria-label="${esc(label)}, ${t('set')} ${j+1}"><small>${esc(label)}</small><span class="${txt ? '' : 'ph'}">${esc(txt || phTxt)}</span></button>`;
}
function setRow(w, i, j){
  const e = w.ex[i], s = e.sets[j], x = exInfo(e.id), ph = prevFor(w, i, j);
  return `<div class="srow ${x.t === 'w' ? '' : 'one'} ${s.done ? 'done' : ''} ${lastPop === i+'-'+j ? 'pop' : ''}">
    <button class="scirc" onclick="toggleSet(${i},${j})" aria-label="${esc(t('Set {n} done', {n:j+1}))}" aria-pressed="${!!s.done}">${s.done ? ic('check') : j + 1}</button>
    ${x.t === 'w' ? fieldHTML(i, j, 'kg', s, ph, x) : ''}${fieldHTML(i, j, 'reps', s, ph, x)}
    <label class="fld note"><small>${t('Notes')}</small><input value="${esc(s.note || '')}" onfocus="kpClose()" onchange="setNote(${i},${j},this.value)" aria-label="${esc(t('Notes'))}, ${t('set')} ${j+1}"></label>
    <button class="iconbtn flat sm" onclick="setMenu(${i},${j})" aria-label="${esc(t('Set options'))}">${ic('dots')}</button>
  </div>`;
}
function exCard(w, i){
  const e = w.ex[i], x = exInfo(e.id), fav = (S.profile.favs || []).includes(e.id), sug = wMode === 'active' ? suggestion(e.id, e.target) : '';
  return `<section class="ex2">
    <div class="exhead"><button class="exname" onclick="showExercise('${e.id}')"><b>${esc(x.n)}</b>${sug ? `<span class="xs neon">${esc(sug)}</span>` : ''}</button>
      <button class="iconbtn flat" onclick="exMenu(${i})" aria-label="${esc(t('Options for {n}', {n:x.n}))}">${ic('dots')}</button></div>
    ${e.sets.map((s, j) => setRow(w, i, j)).join('')}
    <div class="exfoot"><button class="link" onclick="addSet(${i})">${ic('plus','sm')} ${t('Add set')}</button><span class="grow"></span>
      <button class="iconbtn flat" onclick="exHistorySheet('${e.id}')" aria-label="${t('History')}">${ic('log')}</button>
      <button class="iconbtn flat" onclick="exChartSheet('${e.id}')" aria-label="${t('Progress')}">${ic('chart')}</button>
      <button class="iconbtn flat ${fav ? 'fav' : ''}" onclick="toggleFav('${e.id}')" aria-label="${t('Favourite')}" aria-pressed="${fav}">${ic('star')}</button></div>
  </section>`;
}
SCREENS.workout = app => {
  if(wMode === 'edit' && !wEdit) wMode = 'active';
  const w = cw(); if(!w){ view = 'train'; return render() }
  const ed = wMode === 'edit', lastW = typeof currentWeight === 'function' ? currentWeight() : null;
  app.innerHTML = `<div class="wrap wk">
    <div class="wtop">
      <button class="iconbtn flat" onclick="closeWorkout()" aria-label="${ed ? t('Close') : t('Minimize')}">${ic('chevD')}</button>
      <button class="link strong" onclick="${ed ? 'saveEdit()' : 'finishWorkout()'}">${ed ? t('Save') : t('Finish')}</button>
      <b class="grow center">${esc(dk(w.start))}</b>
      ${ed ? '<span class="iconbtn flat" aria-hidden="true"></span>' : `<button class="iconbtn flat" onclick="openRestSheet()" aria-label="${t('Rest timer')}">${ic('timer')}</button>`}
      <button class="iconbtn flat" onclick="workoutMenu()" aria-label="${t('More')}">${ic('dots')}</button>
    </div>
    <div class="card form">
      <input class="namein" value="${esc(w.name)}" placeholder="${t('Name')}" aria-label="${t('Name')}" onfocus="kpClose()" onchange="setWName(this.value)">
      <button class="frow" onclick="editTime('start')"><span>${t('Start time')}</span><span class="mut">${esc(fmtDT(w.start))}</span></button>
      <button class="frow" onclick="editTime('end')" ${ed ? '' : 'disabled'}><span>${t('End time')}</span><span class="mut">${w.end ? esc(fmtDT(w.end)) : '–'}</span></button>
      <label class="frow"><span>${t('Body weight')}</span><span class="row" style="gap:6px"><input class="bwin" inputmode="decimal" value="${w.bw != null ? fmt(w.bw) : ''}" placeholder="${lastW ? fmt(lastW) : '–'}" aria-label="${t('Body weight')}" onfocus="kpClose()" onchange="setWBody(this.value)"><span class="mut">kg</span></span></label>
      <button class="frow" onclick="editNotes()"><span class="${w.notes ? 'ell' : 'mut'}">${w.notes ? esc(w.notes) : t('Notes')}</span>${ic('chevR','sm')}</button>
    </div>
    ${w.ex.map((e, i) => exCard(w, i)).join('')}
    <button class="card addex" onclick="kpClose();pickExercise(addExercise)">${ic('plus')} ${t('Add exercise')}</button>
    <button class="btn ghost block danger-txt" style="margin-top:6px" onclick="${ed ? `confirmDelete('${w.id}')` : 'discardWorkout()'}">${ed ? t('Delete workout') : t('Discard workout')}</button>
  </div>`;
  lastPop = null; renderKeypad();
};
function setWName(v){ cw().name = v.trim() || defaultName(); persistW() }
function editTime(which){
  const w = cw(), v = w[which] || Date.now(), local = new Date(v - new Date(v).getTimezoneOffset()*60000).toISOString().slice(0,16);
  kpClose();
  modal(`<div class="row between"><h2 style="margin:0">${which === 'start' ? t('Start time') : t('End time')}</h2>${closeBtn()}</div>
    <input id="dtIn" class="txt" type="datetime-local" value="${local}" style="margin:12px 0">
    <button class="btn pri block" onclick="saveTime('${which}')">${t('Save')}</button>`);
}
function saveTime(which){
  const v = $('#dtIn').value; if(!v) return;
  const ms = new Date(v).getTime(), w = cw();
  if(which === 'end' && ms < w.start) return toast(t('End time must be after start time'));
  if(which === 'start' && w.end && ms > w.end) return toast(t('Start time must be before end time'));
  w[which] = ms; persistW(); closeModal(); render();
}
function setWBody(v){
  const w = cw(), n = num(v); w.bw = n && n > 20 && n < 400 ? n : null; persistW();
  if(!w.bw) return;
  const day = dayKey(w.start), same = S.body.find(b => dayKey(b.d) === day);
  if(same){ same.kg = w.bw; upsert('body', same) } else upsert('body', {id:newId(), d: wMode === 'edit' ? w.start : Date.now(), kg:w.bw});
  if(day === dayKey()){ S.profile.weight = w.bw; setProfile('pu', Date.now()) }
  const reached = typeof checkGoals === 'function' ? checkGoals() : []; if(reached.length) celebrate(reached);
}
function editNotes(){
  kpClose();
  modal(`<div class="row between"><h2 style="margin:0">${t('Notes')}</h2>${closeBtn()}</div>
    <textarea id="wNotes" class="txt area" rows="5" placeholder="${t('How did it go?')}">${esc(cw().notes || '')}</textarea>
    <button class="btn pri block" style="margin-top:10px" onclick="cw().notes=$('#wNotes').value.trim();persistW();closeModal();render()">${t('Save')}</button>`);
}

/* ---------- Sæt og øvelser ---------- */
function toggleSet(i, j){
  ensureAudio();
  const w = cw(), e = w.ex[i], s = e.sets[j], x = exInfo(e.id);
  if(!s.done){
    const ph = prevFor(w, i, j);
    if(x.t === 'w' && s.kg == null && ph && ph.kg != null) s.kg = ph.kg;
    if(s.reps == null && ph && ph.reps != null) s.reps = ph.reps;
    if((x.t === 'w' && s.kg == null) || s.reps == null){ toast(x.t === 'w' ? t('Enter weight and reps first') : t('Enter reps first')); return kpOpen(i, j, x.t === 'w' && s.kg == null ? 'kg' : 'reps') }
    s.done = true; lastPop = i + '-' + j; vibrate(25);
    if(wMode === 'active') startRest(S.profile.restDefault || 90);
  } else s.done = false;
  persistW(); render();
}
function addSet(i){ cw().ex[i].sets.push({kg:null, reps:null, done:false}); persistW(); render() }
function setNote(i, j, v){ const s = cw().ex[i].sets[j]; if(v.trim()) s.note = v.trim(); else delete s.note; persistW() }
function setMenu(i, j){
  kpClose();
  modal(`<div class="row between"><h2 style="margin:0">${t('Set {n}', {n:j+1})}</h2>${closeBtn()}</div>
    <button class="btn block" style="margin-top:12px" onclick="dupSet(${i},${j})">${ic('copy')} ${t('Duplicate set')}</button>
    <button class="btn block danger" style="margin-top:8px" onclick="delSet(${i},${j})">${ic('trash')} ${t('Delete set')}</button>`);
}
function dupSet(i, j){ const e = cw().ex[i], s = e.sets[j]; e.sets.splice(j + 1, 0, {kg:s.kg, reps:s.reps, done:false}); persistW(); closeModal(); render() }
function delSet(i, j){ const w = cw(), e = w.ex[i]; e.sets.splice(j, 1); if(!e.sets.length) w.ex.splice(i, 1); persistW(); closeModal(); render() }
function addExercise(id){
  const w = cw(); w.ex.push({id, target:null, sets:newSets(id)}); persistW(); closeModal(); render();
  setTimeout(() => { const s = document.querySelectorAll('section.ex2'); s[s.length-1]?.scrollIntoView({behavior:'smooth', block:'start'}) }, 50);
}
function exMenu(i){
  kpClose(); const w = cw(), id = w.ex[i].id, x = exInfo(id);
  modal(`<div class="row between"><h2 style="margin:0">${esc(x.n)}</h2>${closeBtn()}</div>
    <button class="btn block" style="margin-top:12px" onclick="showExercise('${id}')">${ic('info')} ${t('How to do it')}</button>
    ${i > 0 ? `<button class="btn block" style="margin-top:8px" onclick="moveEx(${i},-1)">${t('Move up')}</button>` : ''}
    ${i < w.ex.length - 1 ? `<button class="btn block" style="margin-top:8px" onclick="moveEx(${i},1)">${t('Move down')}</button>` : ''}
    <button class="btn block" style="margin-top:8px" onclick="replaceEx(${i})">${ic('swap')} ${t('Replace exercise')}</button>
    <button class="btn block danger" style="margin-top:8px" onclick="cw().ex.splice(${i},1);persistW();closeModal();render()">${ic('trash')} ${t('Remove exercise')}</button>`);
}
function replaceEx(i){ pickExercise(id => { cw().ex[i] = {id, target:null, sets:newSets(id)}; persistW(); closeModal(); render() }) }
function moveEx(i, d){ const a = cw().ex; [a[i], a[i+d]] = [a[i+d], a[i]]; persistW(); closeModal(); render() }
function discardWorkout(){
  kpClose();
  modal(`<h2>${t('Discard workout?')}</h2><p class="mut">${t('Nothing from this workout will be saved.')}</p>
    <div class="grid2"><button class="btn" onclick="closeModal()">${t('Keep going')}</button><button class="btn danger" onclick="S.current=null;stopRest();lsSave();go(prevView || 'train')">${t('Discard')}</button></div>`);
}
function workoutMenu(){
  kpClose(); const ed = wMode === 'edit', w = cw();
  modal(`<div class="row between"><h2 style="margin:0">${esc(w.name)}</h2>${closeBtn()}</div>
    ${w.ex.length ? `<button class="btn block" style="margin-top:12px" onclick="routineFromW()">${ic('list')} ${t('Save as routine')}</button>` : ''}
    ${ed ? '' : `<button class="btn block" style="margin-top:8px" onclick="openRestSheet()">${ic('timer')} ${t('Rest timer')}</button>`}
    <button class="btn block danger" style="margin-top:8px" onclick="${ed ? `confirmDelete('${w.id}')` : 'discardWorkout()'}">${ic('trash')} ${ed ? t('Delete workout') : t('Discard workout')}</button>`);
}
function openRestSheet(){
  kpClose(); const p = S.profile;
  modal(`<div class="row between"><h2 style="margin:0">${t('Rest timer')}</h2>${closeBtn()}</div>
    <p class="small mut">${t('Starts automatically when you tick off a set.')}</p>
    <div class="chips">${[60,90,120,180].map(n => `<button class="chip ${p.restDefault===n?'on':''}" onclick="setProfile('restDefault',${n});openRestSheet()">${n < 120 ? n + ' ' + t('sec') : n/60 + ' min'}</button>`).join('')}</div>
    <button class="btn pri block" style="margin-top:14px" onclick="ensureAudio();startRest(S.profile.restDefault||90);closeModal()">${ic('timer')} ${t('Start timer now')}</button>
    ${rest ? `<button class="btn block" style="margin-top:8px" onclick="stopRest();closeModal()">${t('Stop timer')}</button>` : ''}`);
}
setInterval(() => { const m = $('#mbT'); if(m && S.current) m.textContent = durText(Date.now() - S.current.start) }, 15000);

/* ---------- Taltastatur (vægt og reps) ---------- */
const kp = {open:false, i:0, j:0, k:'kg', buf:'', fresh:true};
function fieldOrder(){
  const w = cw(), out = []; if(!w) return out;
  w.ex.forEach((e, i) => { const x = exInfo(e.id); e.sets.forEach((s, j) => { if(x.t === 'w') out.push([i, j, 'kg']); out.push([i, j, 'reps']) }) });
  return out;
}
function refreshField(i, j, k){
  const el = document.querySelector(`[data-f="${i}_${j}_${k}"]`), w = cw(); if(!el || !w || !w.ex[i] || !w.ex[i].sets[j]) return;
  el.outerHTML = fieldHTML(i, j, k, w.ex[i].sets[j], prevFor(w, i, j), exInfo(w.ex[i].id));
}
function kpOpen(i, j, k){
  const was = kp.open ? [kp.i, kp.j, kp.k] : null;
  Object.assign(kp, {open:true, i, j, k, buf:'', fresh:true});
  if(was) refreshField(...was);
  refreshField(i, j, k); renderKeypad();
  const el = document.querySelector(`[data-f="${i}_${j}_${k}"]`); if(el) el.scrollIntoView({block:'center', behavior: was ? 'smooth' : 'auto'});
}
function kpClose(){ if(!kp.open){ renderKeypad(); return } kp.open = false; refreshField(kp.i, kp.j, kp.k); renderKeypad() }
function kpKey(ch){
  const w = cw(), s = w && w.ex[kp.i] && w.ex[kp.i].sets[kp.j]; if(!s) return;
  if(kp.fresh){ kp.buf = ''; kp.fresh = false }
  if(ch === 'del') kp.buf = kp.buf.slice(0, -1);
  else if(ch === '.'){ if(kp.k !== 'kg' || kp.buf.includes('.')) return; kp.buf = (kp.buf || '0') + '.' }
  else { if(kp.buf.replace('.', '').length >= 5) return; if(kp.buf === '0') kp.buf = ''; kp.buf += ch }
  const v = kp.buf === '' ? null : parseFloat(kp.buf);
  s[kp.k] = v == null || isNaN(v) ? null : v;
  persistW(); refreshField(kp.i, kp.j, kp.k);
  w.ex[kp.i].sets.forEach((s2, j2) => { if(j2 > kp.j && !s2.done){ refreshField(kp.i, j2, 'kg'); refreshField(kp.i, j2, 'reps') } });   // grå tal i sættene nedenunder
}
function kpMove(d){
  const o = fieldOrder(), idx = o.findIndex(f => f[0] === kp.i && f[1] === kp.j && f[2] === kp.k), nx = o[idx + d];
  if(nx) kpOpen(...nx); else if(d > 0) kpClose();
}
function kpDone(){                 // ✓ = fuldfør sættet og gå videre til næste
  const {i, j} = kp, w = cw(); if(!w || !w.ex[i] || !w.ex[i].sets[j]) return;
  if(!w.ex[i].sets[j].done){ toggleSet(i, j); if(!w.ex[i].sets[j].done) return }
  const nx = fieldOrder().find(f => (f[0] > i || (f[0] === i && f[1] > j)) && !w.ex[f[0]].sets[f[1]].done);
  if(nx) kpOpen(...nx); else kpClose();
}
function renderKeypad(){
  let el = $('#keypad'); if(!el){ el = document.createElement('div'); el.id = 'keypad'; document.body.appendChild(el) }
  const on = kp.open && view === 'workout' && !!cw();
  document.body.classList.toggle('kp-on', on);
  if(!on){ el.innerHTML = ''; return }
  const keys = ['1','2','3','4','5','6','7','8','9', kp.k === 'kg' ? '.' : '', '0', 'del'];
  el.innerHTML = `<div class="kp" role="group" aria-label="${t('Number pad')}">
    <div class="kptool"><button onclick="kpMove(-1)" aria-label="${t('Previous field')}">${ic('arrowL')}</button><button onclick="kpMove(1)" aria-label="${t('Next field')}">${ic('arrowR')}</button><button class="ok" onclick="kpDone()" aria-label="${t('Complete set')}">${ic('check')}</button><span class="grow"></span><button onclick="kpClose()" aria-label="${t('Hide keyboard')}">${ic('kbd')}</button></div>
    <div class="kpkeys">${keys.map(k => k === '' ? '<span></span>' : `<button onclick="kpKey('${k}')" ${k === 'del' ? `aria-label="${t('Delete')}"` : ''}>${k === 'del' ? ic('bksp') : k === '.' ? decSep() : k}</button>`).join('')}</div></div>`;
}
addEventListener('keydown', e => {   // fysisk tastatur på computer
  if(!kp.open || view !== 'workout' || $('#modal .sheet')) return;
  const tag = document.activeElement && document.activeElement.tagName; if(tag === 'INPUT' || tag === 'TEXTAREA') return;
  if(/^[0-9]$/.test(e.key)) kpKey(e.key);
  else if(e.key === ',' || e.key === '.') kpKey('.');
  else if(e.key === 'Backspace') kpKey('del');
  else if(e.key === 'Enter') kpDone();
  else if(e.key === 'Tab') kpMove(e.shiftKey ? -1 : 1);
  else if(e.key === 'ArrowRight') kpMove(1);
  else if(e.key === 'ArrowLeft') kpMove(-1);
  else if(e.key === 'Escape') kpClose();
  else return;
  e.preventDefault();
});

/* ---------- Afslut og gem ---------- */
function findPRs(w){
  const prs = [];
  w.ex.forEach(e => { const x = exInfo(e.id), b = bestEver(e.id, w.id); if(!b) return;
    const val = s => x.t === 'w' ? e1rm(s) : s.reps, top = e.sets.reduce((a, s) => val(s) > val(a) ? s : a, e.sets[0]);
    if(val(top) > b.v + 0.01) prs.push({n:x.n, now:setText(x, top), before:setText(x, b.s)}) });
  return prs;
}
function finishWorkout(force){
  kpClose();
  const c = S.current, ex = c.ex.map(e => ({id:e.id, target:e.target || null, sets:doneSets(e).map(cleanSet)})).filter(e => e.sets.length);
  if(!ex.length) return toast(t('Tick off at least one set first'));
  const open = c.ex.reduce((a, e) => a + e.sets.filter(s => !s.done).length, 0);
  if(open && !force) return modal(`<h2>${t('Finish workout?')}</h2><p class="mut">${t(open === 1 ? '{n} set is not ticked off. Only ticked sets are saved.' : '{n} sets are not ticked off. Only ticked sets are saved.', {n:open})}</p>
    <div class="grid2"><button class="btn" onclick="closeModal()">${t('Keep going')}</button><button class="btn pri" onclick="closeModal();finishWorkout(true)">${t('Finish')}</button></div>`);
  const w = {id:c.id, start:c.start, end:Date.now(), name:c.name, notes:c.notes || '', bw:c.bw || null, routineId:c.routineId, ex};
  const prs = findPRs(w);
  upsert('workouts', w); S.workouts.sort((a, b) => a.start - b.start);
  const reached = typeof checkGoals === 'function' ? checkGoals().map(g => goalState(g).title) : [];
  const wk = thisWeek().length, wg = S.profile.weeklyGoal || 3;
  S.summary = {id:w.id, prs, goals:reached, weekly: wk === wg ? wg : 0, ros:ROS[Math.floor(Math.random()*ROS.length)], fromRoutine:!!c.routineId && !!S.routines.find(r => r.id === c.routineId)};
  S.current = null; stopRest(); lsSave();
  track('workout-complete'); if(S.workouts.length === 1) trackOnce('first-workout'); if(S.workouts.length === 10) trackOnce('ten-workouts');
  go('done');
}
function saveEdit(){
  kpClose();
  const w = wEdit, ex = w.ex.map(e => ({id:e.id, target:e.target || null, sets:doneSets(e).map(cleanSet)})).filter(e => e.sets.length);
  if(!ex.length) return toast(t('Tick off at least one set first'));
  const saved = Object.assign({}, w, {ex}); delete saved.u;
  upsert('workouts', saved); S.workouts.sort((a, b) => a.start - b.start);
  if(typeof checkGoals === 'function'){ const r = checkGoals(); if(r.length) setTimeout(() => celebrate(r), 300) }
  toast(t('Workout saved')); leaveEdit();
}
SCREENS.done = app => {
  const s = S.summary, w = s && S.workouts.find(x => x.id === s.id); if(!w){ S.summary = null; view = 'train'; return render() }
  const vol = volumeOf(w);
  app.innerHTML = `<div class="wrap" style="padding-top:var(--top)">
    <div class="done-hero"><div class="badge-big">${ic(s.prs.length ? 'trophy' : 'check')}</div><h1>${esc(t(s.ros))}</h1><p class="mut">${esc(w.name)} · ${esc(weekday(w.start))}</p></div>
    <div class="grid3"><div class="stat"><span>${t('Time')}</span><b>${durText(w.end - w.start)}</b></div><div class="stat"><span>${t('Sets')}</span><b>${setCount(w)}</b></div><div class="stat"><span>${t('Volume')}</span><b>${vol ? Math.round(vol).toLocaleString(LOC()) + '<small> kg</small>' : '–'}</b></div></div>
    ${(s.goals || []).length ? `<div class="card goalhit"><div class="banner"><span class="bi">${ic('trophy')}</span><div class="grow"><b>${t('Goal reached!')}</b>${s.goals.map(x => `<p class="small" style="margin:2px 0 0">${esc(x)}</p>`).join('')}</div></div></div>` : ''}
    ${s.weekly ? `<div class="card"><div class="banner"><span class="bi">${ic('flame')}</span><div class="grow"><b>${t('Weekly goal reached')}</b><p class="small mut" style="margin:2px 0 0">${t('{n} of {n} workouts this week. Streak: {s} weeks.', {n:s.weekly, s:weekStreak()})}</p></div></div></div>` : ''}
    ${s.prs.length ? `<h3 style="margin-top:18px">${t('New records')} 🏆</h3>${s.prs.map(r => `<div class="pr">${ic('trophy')}<span class="grow"><b>${esc(r.n)}</b><br><span class="xs mut">${t('before: {v}', {v:esc(r.before)})}</span></span><b>${esc(r.now)}</b></div>`).join('')}` : ''}
    <div class="card"><h3>${t('Your workout')}</h3>${w.ex.map(e => { const x = exInfo(e.id); return `<div class="row between" style="padding:6px 0;border-top:1px solid var(--line)"><span class="small">${esc(x.n)}</span><span class="small mut">${e.sets.map(st => setShort(x, st)).join(', ')}</span></div>` }).join('')}</div>
    ${s.fromRoutine ? '' : `<button class="btn block" onclick="saveAsRoutine('${w.id}')">${ic('list')} ${t('Save as routine')}</button>`}
    <button class="btn pri block" style="margin-top:10px" onclick="S.summary=null;lsSave();go(prevView || 'train')">${t('Done')}</button>
  </div>`;
};
function confirmDelete(id){
  modal(`<h2>${t('Delete workout?')}</h2><p class="mut">${t('It will be removed from your log and stats.')}</p>
    <div class="grid2"><button class="btn" onclick="closeModal()">${t('Keep')}</button><button class="btn danger" onclick="deleteWorkout('${id}')">${t('Delete')}</button></div>`);
}
function deleteWorkout(id){
  removeItem('workouts', id); closeModal(); toast(t('Workout deleted'));
  if(wMode === 'edit' && wEdit && wEdit.id === id){ wDirty = false; leaveEdit() } else render();
}

/* ---------- Rutiner ---------- */
let draft = null, routineBack = 'routines';
SCREENS.routines = app => {
  app.innerHTML = `<div class="wrap">
    ${header(`<button class="iconbtn back" onclick="go('train')" aria-label="${t('Back')}">${ic('chevL')}</button><h1>${t('Routines')}</h1>`, `<button class="btn sm" onclick="editRoutine()">${ic('plus','sm')} ${t('New')}</button>`)}
    ${S.routines.length ? S.routines.map(r => routineRow(r)).join('') : `<p class="small mut">${t('Routines are workouts you repeat. Make your own, or start from a template.')}</p>`}
    <div class="sect"><span>${t('Templates')}</span></div>
    ${TEMPLATES.map(templateRow).join('')}
  </div>`;
};
function editRoutine(id){
  const r = id && S.routines.find(x => x.id === id);
  routineBack = view === 'workout' ? 'workout' : 'routines';
  draft = r ? JSON.parse(JSON.stringify(r)) : {id:newId(), name:'', ex:[]};
  go('routine');
}
function saveAsRoutine(fromWorkoutId){
  const w = S.workouts.find(x => x.id === fromWorkoutId);
  draft = {id:newId(), name: w.name, ex: w.ex.map(e => ({id:e.id, sets:e.sets.length, reps:e.sets[0]?.reps || 10}))};
  routineBack = 'routines'; go('routine');
}
function routineFromW(){
  const w = cw();
  draft = {id:newId(), name: w.name, ex: w.ex.map(e => ({id:e.id, sets:Math.max(1, e.sets.length), reps:(e.sets.find(s => s.reps != null) || {}).reps || e.target || 10}))};
  routineBack = 'workout'; go('routine');
}
SCREENS.routine = app => {
  if(!draft){ view = 'routines'; return render() }
  app.innerHTML = `<div class="wrap">
    ${header(`<button class="iconbtn back" onclick="draft=null;go(routineBack)" aria-label="${t('Cancel')}">${ic('x')}</button><h1>${S.routines.find(r => r.id === draft.id) ? t('Edit routine') : t('New routine')}</h1>`, `<button class="btn sm pri" onclick="saveRoutine()">${t('Save')}</button>`)}
    <label class="small mut" for="rName">${t('Name')}</label>
    <input id="rName" class="txt" placeholder="${t('e.g. Upper body')}" value="${esc(draft.name)}" oninput="draft.name=this.value" style="margin:6px 0 12px">
    ${draft.ex.map((e, i) => { const x = exInfo(e.id); return `<div class="card row" style="gap:8px"><div class="grow" style="min-width:0"><b>${esc(x.n)}</b><div class="xs mut">${esc(mus(x.m))}</div></div>
      <label class="mini"><input class="num sm" inputmode="numeric" value="${e.sets}" onchange="draft.ex[${i}].sets=Math.max(1,parseInt(this.value)||1)" aria-label="${t('Sets')}"><small>${t('sets')}</small></label>
      <label class="mini"><input class="num sm" inputmode="numeric" value="${e.reps}" onchange="draft.ex[${i}].reps=Math.max(1,parseInt(this.value)||1)" aria-label="${unitOf(x)}"><small>${unitOf(x)}</small></label>
      <button class="iconbtn flat" onclick="draft.ex.splice(${i},1);render()" aria-label="${t('Remove')}">${ic('x')}</button></div>` }).join('')}
    <button class="card addex" onclick="pickExercise(id=>{draft.ex.push({id,sets:3,reps:exInfo(id).t==='s'?30:10});closeModal();render()})">${ic('plus')} ${t('Add exercise')}</button>
  </div>`;
};
function saveRoutine(){
  draft.name = (draft.name || '').trim();
  if(!draft.name) return toast(t('Give your routine a name'));
  if(!draft.ex.length) return toast(t('Add at least one exercise'));
  upsert('routines', draft); draft = null; toast(t('Routine saved')); track('routine-saved'); go(routineBack);
}
function routineMenu(id){
  const r = S.routines.find(x => x.id === id);
  modal(`<div class="row between"><h2 style="margin:0">${esc(r.name)}</h2>${closeBtn()}</div>
    <p class="small mut">${r.ex.map(e => `${esc(exInfo(e.id).n)} – ${e.sets}×${e.reps}`).join('<br>')}</p>
    <button class="btn pri block" onclick="closeModal();startWorkout('${id}')">${ic('play')} ${t('Start')}</button>
    <button class="btn block" style="margin-top:8px" onclick="closeModal();editRoutine('${id}')">${ic('edit')} ${t('Edit')}</button>
    <button class="btn block danger" style="margin-top:8px" onclick="removeItem('routines','${id}');closeModal();render();toast(t('Routine deleted'))">${ic('trash')} ${t('Delete')}</button>`);
}
function templateMenu(id){
  const x = TEMPLATES.find(z => z.id === id);
  modal(`<div class="row between"><div><span class="xs neon">${esc(t(x.tag))}</span><h2 style="margin:0">${esc(t(x.name))}</h2></div>${closeBtn()}</div>
    ${x.ex.map(([eid, s, r]) => `<button class="row between link" style="width:100%;color:var(--txt);border-top:1px solid var(--line)" onclick="showExercise('${eid}')"><span>${esc(exInfo(eid).n)}</span><span class="mut small">${s} × ${r} ${exInfo(eid).t === 's' ? t('sec') : ''}</span></button>`).join('')}
    <button class="btn pri block" style="margin-top:12px" onclick="closeModal();startWorkout('${id}')">${ic('play')} ${t('Start now')}</button>
    <button class="btn block" style="margin-top:8px" onclick="copyTemplate('${id}')">${ic('copy')} ${t('Add to my routines')}</button>`);
}
function copyTemplate(id){ const x = TEMPLATES.find(z => z.id === id); upsert('routines', {id:newId(), name:t(x.name), ex:x.ex.map(([eid, s, r]) => ({id:eid, sets:s, reps:r}))}); closeModal(); render(); toast(t('Added to your routines')) }

/* ---------- Kropsvægt ---------- */
const weights = () => S.body.slice().sort((a, b) => a.d - b.d);
function spark(vals, w=120, h=36){
  if(vals.length < 2) return '';
  const mn = Math.min(...vals), mx = Math.max(...vals), r = (mx - mn) || 1;
  const pts = vals.map((v, i) => `${(i/(vals.length-1)*w).toFixed(1)},${(h - 4 - (v-mn)/r*(h-8)).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="#39ff7a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
function openWeight(){
  const ws = weights().reverse(), wg = (S.goals || []).find(g => g.type === 'weight' && !g.done);
  modal(`<div class="row between"><h2 style="margin:0">${t('Body weight')}</h2>${closeBtn()}</div>
    <form class="row" style="margin:12px 0" onsubmit="logWeight(event)"><input id="bw" class="txt grow" inputmode="decimal" placeholder="${t('Today’s weight')}" aria-label="${t('Body weight in kg')}"><span class="mut">kg</span><button class="btn sm pri">${t('Save')}</button></form>
    ${ws.length >= 2 ? `<div class="center" style="margin:6px 0">${spark(weights().slice(-20).map(b => b.kg), 300, 64)}</div>` : ''}
    ${wg && ws[0] ? `<p class="small mut center">${ic('target','xs')} ${t('Goal {g} kg · {d} kg to go', {g:fmt(wg.target), d:fmt(Math.abs(ws[0].kg - wg.target))})}</p>` : ''}
    ${ws.map(b => `<div class="row between" style="padding:10px 0;border-top:1px solid var(--line)"><span class="small mut">${esc(weekday(b.d))}</span><span class="row" style="gap:6px"><b>${fmt(b.kg)} kg</b><button class="iconbtn flat" onclick="removeItem('body','${b.id}');openWeight();render()" aria-label="${t('Delete')}">${ic('trash','sm')}</button></span></div>`).join('') || `<p class="small mut">${t('Log your weight now and then to see how it changes.')}</p>`}
    ${!isPremium() && ws.length >= 2 ? `<p class="xs mut" style="margin-top:10px">${ic('lock','xs')} ${t('See the full weight chart under Goals → Stats with Premium.')}</p>` : ''}`);
  setTimeout(() => $('#bw')?.focus(), 60);
}
function logWeight(e){
  e.preventDefault(); const v = num($('#bw').value);
  if(!v || v < 20 || v > 400) return toast(t('Enter your weight in kg'));
  const today = dayKey(), same = S.body.find(b => dayKey(b.d) === today);
  if(same){ same.kg = v; same.d = Date.now(); upsert('body', same) } else upsert('body', {id:newId(), d:Date.now(), kg:v});
  S.profile.weight = v; setProfile('pu', Date.now()); track('weight-log');
  const reached = typeof checkGoals === 'function' ? checkGoals() : [];
  render(); if(reached.length) celebrate(reached); else { openWeight(); toast(t('Weight logged')) }
}

/* ---------- Øvelser: historik, graf, favoritter ---------- */
function exHistorySheet(id){
  kpClose(); const x = exInfo(id), list = S.workouts.filter(w => w.ex.some(e => e.id === id && doneSets(e).length)).slice().reverse().slice(0, 30);
  modal(`<div class="row between"><div><span class="xs mut">${t('History')}</span><h2 style="margin:0">${esc(x.n)}</h2></div>${closeBtn()}</div>
    ${list.length ? list.map(w => { const e = w.ex.find(z => z.id === id); return `<div class="hrow"><span class="small mut">${esc(weekday(w.start))}</span><span class="small">${doneSets(e).map(s => esc(setShort(x, s))).join(' · ')}${x.t === 'w' ? ' kg' : ''}</span></div>` }).join('')
      : `<p class="small mut">${t('No sets logged yet.')}</p>`}`);
}
function exChartSheet(id){
  kpClose(); const x = exInfo(id);
  if(!isPremium()) return modal(`<div class="row between"><h2 style="margin:0">${esc(x.n)}</h2>${closeBtn()}</div>${lockedCard(t('Progress chart'), t('See your strength curve for every exercise.'), 'exercise-chart')}`);
  const pts = S.workouts.filter(w => w.ex.some(e => e.id === id && doneSets(e).length)).map(w => { const sets = doneSets(w.ex.find(e => e.id === id));
    return {x:w.start, y: Math.round((x.t === 'w' ? Math.max(...sets.map(e1rm)) : Math.max(...sets.map(s => s.reps))) * 10) / 10} });
  modal(`<div class="row between"><div><span class="xs mut">${t('Progress')}</span><h2 style="margin:0">${esc(x.n)}</h2></div>${closeBtn()}</div>
    ${pts.length >= 2 ? `<p class="xs mut">${x.t === 'w' ? t('Estimated 1-rep max (kg)') : x.t === 's' ? t('Longest hold (sec)') : t('Most reps')}</p><canvas id="exC" height="190"></canvas>`
      : `<p class="small mut">${t('Do this exercise one more time to see your curve.')}</p>`}`);
  if(pts.length >= 2) drawLine($('#exC'), pts);
}
function toggleFav(id){ const f = (S.profile.favs || []).slice(), i = f.indexOf(id); if(i >= 0) f.splice(i, 1); else f.push(id); setProfile('favs', f); render(); toast(i >= 0 ? t('Removed from favourites') : t('Added to favourites')) }

/* ---------- Øvelsesvælger (kategorier + søgning) ---------- */
let pickCb = null, pickQ = '', pickCat = null;
function pickExercise(cb){ pickCb = cb; pickQ = ''; pickCat = null; renderPicker() }
function recentExercises(){ const out = []; for(let i = S.workouts.length - 1; i >= 0 && out.length < 15; i--) S.workouts[i].ex.forEach(e => { if(!out.includes(e.id)) out.push(e.id) }); return out }
function catLabel(c){ return c === '_fav' ? t('Favourites') : c === '_recent' ? t('Recent') : mus(c) }
function pickerItems(){
  const q = pickQ.trim().toLowerCase(); let list = allExercises();
  if(pickCat === '_fav') list = list.filter(x => (S.profile.favs || []).includes(x.id));
  else if(pickCat === '_recent'){ const r = recentExercises(); list = r.map(id => list.find(x => x.id === id)).filter(Boolean) }
  else if(pickCat) list = list.filter(x => x.m === pickCat);
  if(q) list = list.filter(x => x.n.toLowerCase().includes(q) || mus(x.m).toLowerCase().includes(q));
  if(pickCat !== '_recent') list.sort((a, b) => a.n.localeCompare(b.n));
  return list;
}
function pickerBody(){
  if(!pickCat && !pickQ.trim()){
    const cats = [...((S.profile.favs || []).length ? ['_fav'] : []), ...(recentExercises().length ? ['_recent'] : []), ...MUSCLES];
    return cats.map(c => { const n = c === '_fav' ? S.profile.favs.length : c === '_recent' ? recentExercises().length : allExercises().filter(x => x.m === c).length;
      return `<button class="exrow cat" onclick="pickCat='${c}';renderPicker()"><span class="grow">${c === '_fav' ? ic('star','sm') + ' ' : c === '_recent' ? ic('clock','sm') + ' ' : ''}${esc(catLabel(c))}</span><span class="xs mut">${n}</span>${ic('chevR','sm')}</button>` }).join('');
  }
  return pickerItems().map(x => `<div class="exrow"><button class="lbtn grow" onclick="pickCb('${x.id}')">${esc(x.n)}${x.custom ? ` <span class="xs mut">· ${t('custom')}</span>` : ''}</button>
      <button class="iconbtn flat" onclick="${x.custom ? `customExMenu('${x.id}')` : `showExercise('${x.id}', true)`}" aria-label="${esc(x.custom ? t('Options') : t('About {n}', {n:x.n}))}">${ic(x.custom ? 'dots' : 'info')}</button></div>`).join('')
    || `<p class="small mut center" style="padding:16px">${t('No exercise found – create it with +.')}</p>`;
}
function renderPicker(onlyList){
  if(onlyList && $('#pkBody')){ $('#pkBody').innerHTML = pickerBody(); return }
  const title = pickCat ? catLabel(pickCat) : t('Choose exercise');
  modal(`<div class="pktop">${pickCat ? `<button class="link" onclick="pickCat=null;pickQ='';renderPicker()">${ic('chevL','sm')} ${t('Choose exercise')}</button>` : `<button class="link" onclick="closeModal()">${t('Cancel')}</button>`}
      <b class="grow center">${pickCat ? esc(title) : ''}</b>
      <button class="iconbtn flat" onclick="newCustomExercise()" aria-label="${t('New exercise')}">${ic('plus')}</button></div>
    ${pickCat ? '' : `<h2 style="margin:4px 0 0">${t('Choose exercise')}</h2>`}
    <div class="searchbox">${ic('search')}<input id="pq" class="txt" placeholder="${esc(pickCat ? t('Search {m}', {m:title}) : t('Search exercises'))}" value="${esc(pickQ)}" oninput="pickQ=this.value;renderPicker(true)" aria-label="${t('Search exercises')}"></div>
    <div class="exlist2" id="pkBody">${pickerBody()}</div>`);
}
function newCustomExercise(){
  const name = pickQ.trim(), m0 = MUSCLES.includes(pickCat) ? pickCat : MUSCLES[0];
  modal(`<div class="row between"><h2 style="margin:0">${t('New exercise')}</h2>${closeBtn()}</div>
    <label class="small mut" for="cxn">${t('Name')}</label><input id="cxn" class="txt" value="${esc(name)}" style="margin:6px 0 12px">
    <p class="small mut" style="margin-bottom:6px">${t('Muscle group')}</p><div class="chips" id="cxm">${MUSCLES.map(m => `<button class="chip ${m === m0 ? 'on' : ''}" data-m="${m}" onclick="document.querySelectorAll('#cxm .chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${esc(mus(m))}</button>`).join('')}</div>
    <p class="small mut" style="margin:12px 0 6px">${t('Type')}</p><div class="chips" id="cxt">${[['w',t('Weight + reps')],['bw',t('Reps only')],['s',t('Time')]].map(([v, l], i) => `<button class="chip ${i === 0 ? 'on' : ''}" data-t="${v}" onclick="document.querySelectorAll('#cxt .chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${l}</button>`).join('')}</div>
    <button class="btn pri block" style="margin-top:16px" onclick="saveCustomExercise()">${t('Save exercise')}</button>`);
}
function saveCustomExercise(){
  const n = $('#cxn').value.trim(); if(!n) return toast(t('Give it a name'));
  const x = {id:'c_' + newId(), n, m:$('#cxm .chip.on').dataset.m, t:$('#cxt .chip.on').dataset.t};
  upsert('customEx', x); toast(t('Exercise created'));
  if(pickCb) pickCb(x.id); else closeModal();
}
function customExMenu(id){
  const x = exInfo(id), used = S.workouts.some(w => w.ex.some(e => e.id === id)) || S.routines.some(r => r.ex.some(e => e.id === id));
  modal(`<div class="row between"><h2 style="margin:0">${esc(x.n)}</h2>${closeBtn()}</div>
    <button class="btn pri block" style="margin-top:12px" onclick="pickCb('${id}')">${ic('plus')} ${t('Add to workout')}</button>
    ${used ? `<p class="xs mut" style="margin-top:10px">${t('This exercise is in your log or routines, so it can’t be deleted.')}</p>`
      : `<button class="btn block danger" style="margin-top:8px" onclick="removeItem('customEx','${id}');renderPicker()">${ic('trash')} ${t('Delete exercise')}</button>`}
    <button class="btn block" style="margin-top:8px" onclick="renderPicker()">${t('Back')}</button>`);
}
function showExercise(id, fromPicker){
  const x = exInfo(id), b = bestEver(id), lp = lastPerformance(id);
  const cues = (LANG === 'da' && DA_CUES[id]) || x.cue;
  modal(`<div class="row between">${fromPicker ? `<button class="link" onclick="renderPicker()">${ic('chevL','sm')} ${t('Back')}</button>` : ''}<h2 style="margin:0" class="grow">${esc(x.n)}</h2>${closeBtn()}</div>
    <p class="xs mut" style="margin-top:2px">${esc(mus(x.m))}</p>
    ${x.a ? `<div class="demo" style="margin-top:10px"><span class="badge">${t('ANIMATION')}</span>${demoSVG(id)}</div><p class="small center neon" style="margin:8px 0 0">${ic('clock','sm')} ${tempoText(id)}</p>` : ''}
    ${cues ? `<h3 style="margin-top:14px">${t('How to do it')}</h3><ol class="cue">${cues.map(c => `<li>${esc(c)}</li>`).join('')}</ol>` : ''}
    <div class="grid2"><div class="stat"><span>${t('Last time')}</span><b style="font-size:16px">${lp ? esc(lastText(x, lp)) : '–'}</b></div><div class="stat"><span>${t('Best')}</span><b style="font-size:16px">${b ? esc(setText(x, b.s)) : '–'}</b></div></div>
    ${fromPicker ? `<button class="btn pri block" style="margin-top:12px" onclick="pickCb('${id}')">${ic('plus')} ${t('Add to workout')}</button>` : ''}
    <div class="warnline" style="margin-top:12px">${ic('alert')}<span>${t('Stop if it hurts. Ask a doctor if you’re ill or injured.')}</span></div>`);
}
