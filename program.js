/* LIFT – Programmer. Man skriver sit program ind én gang (en eller flere dage).
   Når man starter en træning, vælger man programmet, og øvelser og sæt står klar – man skal kun skrive vægt og reps. */
'use strict';

/* ---------- Data ---------- */
// Færdige programmer bygges af træningerne i TEMPLATES (data.js)
function templatePrograms(){
  return PROGRAM_TEMPLATES.map(pt => ({id:pt.id, tpl:true, name:t(pt.name), tag:t(pt.tag),
    days:pt.days.map(tid => { const x = TEMPLATES.find(z => z.id === tid);
      return {id:x.id, name:t(x.day || x.name), title:t(x.name), ex:x.ex.map(([id, sets, reps]) => ({id, sets, reps}))} })}));
}
const activeProgram = () => S.programs.find(p => p.id === S.profile.activeProgram) || S.programs[0] || null;
const dayName = (p, k) => (p.days[k].name || '').trim() || t('Day {n}', {n:k + 1});
const daysText = n => t(n === 1 ? '{n} day' : '{n} days', {n});
// Den dag, der står for tur: dagen efter den sidst gennemførte dag i programmet
function nextDay(p){
  for(let i = S.workouts.length - 1; i >= 0; i--){ const k = p.days.findIndex(d => d.id === S.workouts[i].routineId); if(k >= 0) return p.days[(k + 1) % p.days.length] }
  return p.days[0];
}
// Finder en dag i egne programmer eller skabeloner → {p, day, k}
function findDay(id){
  for(const p of S.programs.concat(templatePrograms())){ const k = p.days.findIndex(d => d.id === id); if(k >= 0) return {p, day:p.days[k], k} }
  return null;
}
// Gamle "rutiner" bliver til dage i programmet "Mit program" (samme id på alle enheder, så der ikke kommer dubletter)
function migrateRoutines(){
  if(!(S.routines || []).length) return;
  const id = 'p_routines', old = S.programs.find(x => x.id === id);
  const p = old ? JSON.parse(JSON.stringify(old)) : {id, name:t('My program'), days:[]};
  S.routines.forEach(r => { if(!p.days.some(d => d.id === r.id)) p.days.push({id:r.id, name:r.name || '', ex:(r.ex || []).map(e => ({id:e.id, sets:e.sets, reps:e.reps}))}) });
  upsert('programs', p);
  S.routines.slice().forEach(r => removeItem('routines', r.id));
  if(!S.profile.activeProgram) setProfile('activeProgram', id);
}

/* ---------- Start træning (+) ---------- */
function openStartSheet(){
  if(S.current) return resumeWorkout();
  const p = activeProgram();
  const empty = cls => `<button class="btn ${cls} block" style="margin-top:${p ? 10 : 12}px" onclick="closeModal();startWorkout()">${ic('plus')} ${t('Empty workout')}</button>`;
  // Med et program: næste dag er den store knap. Uden: tom træning først og et forslag om at skrive sit program ind.
  modal(`<div class="row between"><h2 style="margin:0">${t('Start workout')}</h2>${closeBtn()}</div>
    ${p ? programStartHTML(p) + empty('') + `<button class="link block" style="margin-top:6px" onclick="go('programs')">${t('Programs and templates')}</button>`
      : empty('pri') + `<div class="card how" style="margin-top:12px"><b>${t('Write your program')}</b>
      <p class="small mut" style="margin:4px 0 10px">${t('Then your exercises and sets are ready when you train – you only type weight and reps.')}</p>
      <div class="grid2"><button class="btn" onclick="editProgram()">${ic('plus')} ${t('Create your program')}</button><button class="btn" onclick="importSheet()">${ic('file','sm')} ${t('Paste as text')}</button></div></div>
      <div class="sect"><span>${t('Templates')}</span></div>${templatePrograms().map(tplRow).join('')}`}`);
}
function programStartHTML(p){
  const nd = nextDay(p), k = p.days.indexOf(nd);
  return `<div class="sect"><span>${esc(p.name)}</span><button class="link" onclick="go('programs')">${t('Change')}</button></div>
    <button class="btn pri block" onclick="closeModal();startWorkout('${nd.id}')">${ic('play')} ${t('Start {n}', {n:esc(dayName(p, k))})}</button>
    ${p.days.length > 1 ? p.days.map((d, i) => dayRow(p, i, true)).join('') : ''}`;
}
function dayRow(p, k, closeFirst){
  const d = p.days[k], next = p.days.length > 1 && nextDay(p) === d;
  return `<button class="lrow" onclick="${closeFirst ? 'closeModal();' : ''}startWorkout('${d.id}')"><span class="daynum">${k + 1}</span>
    <span class="grow" style="min-width:0"><b>${esc(dayName(p, k))}${next ? ` <span class="pill sm">${t('Next')}</span>` : ''}</b><span class="xs mut ell">${d.ex.map(e => esc(exInfo(e.id).n)).join(' · ')}</span></span>
    <span class="playdot">${ic('play','sm')}</span></button>`;
}
// Kort øverst i logbogen: næste træning i dit program
function nextUpHTML(){
  const p = activeProgram(); if(!p || S.current || !p.days.length) return '';
  const nd = nextDay(p), k = p.days.indexOf(nd);
  return `<button class="card nextup" onclick="startWorkout('${nd.id}')"><span class="playdot">${ic('play','sm')}</span>
    <span class="grow" style="min-width:0"><span class="xs mut ell">${t('Next workout')} · ${esc(p.name)}</span><b class="ell">${esc(dayName(p, k))}</b>
    <span class="xs mut ell">${nd.ex.map(e => esc(exInfo(e.id).n)).join(' · ')}</span></span></button>`;
}

/* ---------- Programmer (oversigt) ---------- */
SCREENS.programs = app => {
  const act = activeProgram();
  app.innerHTML = `<div class="wrap">
    ${header(`<button class="iconbtn back" onclick="go('train')" aria-label="${t('Back')}">${ic('chevL')}</button><h1 class="sm">${t('Programs')}</h1>`, `<button class="iconbtn" onclick="editProgram()" aria-label="${t('New program')}">${ic('plus')}</button>`)}
    ${S.programs.length ? S.programs.map(p => programCard(p, p === act)).join('')
      : `<div class="card center" style="padding:22px 18px"><div class="bigicon" style="margin:0 auto 12px">${ic('list')}</div><b>${t('Write your program')}</b>
        <p class="small mut">${t('Write your program once. When you start a workout, your exercises and sets are ready – you only type weight and reps.')}</p>
        <button class="btn pri" onclick="editProgram()">${ic('plus')} ${t('Create your program')}</button>
        <button class="link block" style="margin-top:6px" onclick="importSheet()">${ic('file','sm')} ${t('Paste as text')}</button></div>`}
    ${S.programs.length ? `<button class="btn block" style="margin-top:4px" onclick="importSheet()">${ic('file','sm')} ${t('Paste a program as text')}</button>` : ''}
    <div class="sect"><span>${t('Templates')}</span></div>
    ${templatePrograms().map(tplRow).join('')}
  </div>`;
};
function programCard(p, on){
  return `<div class="card prog ${on ? 'on' : ''}">
    <div class="row between" style="gap:10px"><div style="min-width:0"><b class="ell" style="font-size:17px">${esc(p.name)}</b><span class="xs mut">${daysText(p.days.length)}</span></div>
      ${on ? `<span class="pill">${t('Active')}</span>` : `<button class="btn sm" onclick="useProgram('${p.id}')">${t('Use')}</button>`}</div>
    ${p.days.map((d, k) => dayRow(p, k)).join('')}
    <button class="btn block" style="margin-top:8px" onclick="editProgram('${p.id}')">${ic('edit','sm')} ${t('Edit program')}</button>
  </div>`;
}
function useProgram(id){ setProfile('activeProgram', id); toast(t('Program selected')); render() }
const tplRow = p => `<button class="lrow" onclick="templateSheet('${p.id}')"><span class="grow" style="min-width:0"><b>${esc(p.name)}</b><span class="xs mut">${esc(p.tag)} · ${daysText(p.days.length)}</span></span>${ic('chevR','sm')}</button>`;
function templateSheet(id){
  const p = templatePrograms().find(x => x.id === id);
  modal(`<div class="row between"><div><span class="xs neon">${esc(p.tag)}</span><h2 style="margin:0">${esc(p.name)}</h2></div>${closeBtn()}</div>
    ${p.days.map(d => `<div class="tday"><div class="row between"><b>${esc(d.name)}</b><button class="link" onclick="closeModal();startWorkout('${d.id}')">${ic('play','sm')} ${t('Start now')}</button></div>
      ${d.ex.map(e => `<div class="row between small" style="padding:3px 0"><span>${esc(exInfo(e.id).n)}</span><span class="mut">${e.sets} × ${e.reps}${exInfo(e.id).t === 's' ? ' ' + t('sec') : ''}</span></div>`).join('')}</div>`).join('')}
    <button class="btn pri block" style="margin-top:12px" onclick="adoptTemplate('${id}')">${ic('copy')} ${t('Use as my program')}</button>`);
}
function adoptTemplate(id){
  const p = templatePrograms().find(x => x.id === id);
  const np = {id:newId(), name:p.name, days:p.days.map(d => ({id:newId(), name:d.name, ex:d.ex.map(e => Object.assign({}, e))}))};
  upsert('programs', np); setProfile('activeProgram', np.id); closeModal(); toast(t('Program saved')); track('program-template'); go('programs');
}

/* ---------- Skriv / redigér et program ---------- */
let pDraft = null, pBack = 'programs', pendingDay = null, pendingFrom = null;
function editProgram(id){
  const p = id && S.programs.find(x => x.id === id);
  pBack = view === 'programs' ? 'programs' : view === 'train' ? 'train' : 'programs';
  pDraft = p ? JSON.parse(JSON.stringify(p)) : {id:newId(), name:'', days:[{id:newId(), name:'', ex:[]}]};
  go('program');
}
SCREENS.program = app => {
  if(!pDraft){ view = 'programs'; return render() }
  const isNew = !S.programs.some(p => p.id === pDraft.id);
  app.innerHTML = `<div class="wrap">
    ${header(`<button class="iconbtn back" onclick="pDraft=null;go(pBack)" aria-label="${t('Cancel')}">${ic('x')}</button><h1 class="sm">${isNew ? t('New program') : t('Edit program')}</h1>`, `<button class="btn sm pri" onclick="saveProgram()">${t('Save')}</button>`)}
    <label class="small mut" for="pName">${t('Name')}</label>
    <input id="pName" class="txt" placeholder="${esc(t('e.g. Push / Pull / Legs'))}" value="${esc(pDraft.name)}" oninput="pDraft.name=this.value" style="margin:6px 0 2px">
    ${pDraft.days.map((d, k) => dayEditHTML(d, k)).join('')}
    <button class="card addex" onclick="addDay()">${ic('plus')} ${t('Add day')}</button>
    ${isNew ? '' : `<button class="btn block danger" style="margin-top:18px" onclick="deleteProgram()">${ic('trash')} ${t('Delete program')}</button>`}
  </div>`;
};
function dayEditHTML(d, k){
  return `<div class="card pday">
    <div class="row" style="gap:10px"><span class="daynum">${k + 1}</span>
      <input class="txt grow" placeholder="${esc(t('Day {n}', {n:k + 1}))} – ${esc(t('e.g. Chest & triceps'))}" value="${esc(d.name)}" oninput="pDraft.days[${k}].name=this.value" aria-label="${esc(t('Day {n}', {n:k + 1}))}">
      <button class="iconbtn flat" onclick="dayMenu(${k})" aria-label="${t('Options')}">${ic('dots')}</button></div>
    ${d.ex.map((e, i) => exPlanHTML(e, k, i)).join('')}
    <button class="link" style="margin-top:6px" onclick="addPlanEx(${k})">${ic('plus','sm')} ${t('Add exercise')}</button>
  </div>`;
}
function exPlanHTML(e, k, i){
  const x = exInfo(e.id), on = `pDraft.days[${k}].ex[${i}]`;
  return `<div class="pex">
    <div class="row between"><b class="ell">${esc(x.n)}</b><button class="iconbtn flat sm" onclick="exPlanMenu(${k},${i})" aria-label="${esc(t('Options for {n}', {n:x.n}))}">${ic('dots')}</button></div>
    <div class="pexin">
      <label><small>${t('Sets')}</small><input class="num" inputmode="numeric" value="${e.sets}" onchange="${on}.sets=Math.min(20,Math.max(1,parseInt(this.value)||1));this.value=${on}.sets"></label>
      <span class="mut">×</span>
      <label><small>${x.t === 's' ? t('Seconds') : t('Reps')}</small><input class="num" inputmode="numeric" value="${e.reps}" onchange="${on}.reps=Math.max(1,parseInt(this.value)||1);this.value=${on}.reps"></label>
      ${x.t === 'w' ? `<label><small>${t('kg (optional)')}</small><input class="num" inputmode="decimal" placeholder="–" value="${e.kg != null ? fmt(e.kg, 2) : ''}" onchange="${on}.kg=num(this.value)"></label>` : ''}
    </div></div>`;
}
const planFor = id => ({id, sets:3, reps: exInfo(id).t === 's' ? 30 : 10});
function addPlanEx(k){ pickExercise(id => { pDraft.days[k].ex.push(planFor(id)); closeModal(); render() }) }
function addDay(){
  pDraft.days.push({id:newId(), name:'', ex:[]}); render();
  setTimeout(() => { const f = document.querySelectorAll('.pday input.txt'); f[f.length - 1]?.focus() }, 60);
}
function dayMenu(k){
  const n = pDraft.days.length;
  modal(`<div class="row between"><h2 style="margin:0">${esc(dayName(pDraft, k))}</h2>${closeBtn()}</div>
    <div class="stack">
      ${k > 0 ? `<button class="btn block" onclick="moveDay(${k},-1)">${t('Move up')}</button>` : ''}
      ${k < n - 1 ? `<button class="btn block" onclick="moveDay(${k},1)">${t('Move down')}</button>` : ''}
      <button class="btn block" onclick="copyDay(${k})">${ic('copy')} ${t('Duplicate day')}</button>
      <button class="btn block danger" onclick="pDraft.days.splice(${k},1);closeModal();render()">${ic('trash')} ${t('Delete day')}</button></div>`);
}
function moveDay(k, d){ const a = pDraft.days; [a[k], a[k + d]] = [a[k + d], a[k]]; closeModal(); render() }
function copyDay(k){ const c = JSON.parse(JSON.stringify(pDraft.days[k])); c.id = newId(); pDraft.days.splice(k + 1, 0, c); closeModal(); render() }
function exPlanMenu(k, i){
  const d = pDraft.days[k], x = exInfo(d.ex[i].id);
  modal(`<div class="row between"><h2 style="margin:0">${esc(x.n)}</h2>${closeBtn()}</div>
    <div class="stack">
      ${i > 0 ? `<button class="btn block" onclick="movePlanEx(${k},${i},-1)">${t('Move up')}</button>` : ''}
      ${i < d.ex.length - 1 ? `<button class="btn block" onclick="movePlanEx(${k},${i},1)">${t('Move down')}</button>` : ''}
      <button class="btn block" onclick="replacePlanEx(${k},${i})">${ic('swap')} ${t('Replace exercise')}</button>
      <button class="btn block danger" onclick="pDraft.days[${k}].ex.splice(${i},1);closeModal();render()">${ic('trash')} ${t('Remove exercise')}</button></div>`);
}
function movePlanEx(k, i, d){ const a = pDraft.days[k].ex; [a[i], a[i + d]] = [a[i + d], a[i]]; closeModal(); render() }
function replacePlanEx(k, i){ pickExercise(id => { const old = pDraft.days[k].ex[i]; pDraft.days[k].ex[i] = Object.assign(planFor(id), {sets:old.sets}); closeModal(); render() }) }
function saveProgram(){
  const p = pDraft;
  p.name = (p.name || '').trim() || t('My program');
  p.days.forEach(d => d.name = (d.name || '').trim());
  p.days = p.days.filter(d => d.ex.length || d.name);
  if(!p.days.some(d => d.ex.length)){ render(); return toast(t('Add at least one exercise')) }
  if(p.days.some(d => !d.ex.length)){ render(); return toast(t('Each day needs at least one exercise')) }
  upsert('programs', p); pDraft = null;
  if(pendingDay && p.days.some(d => d.id === pendingDay.id)){   // den gemte træning tæller som denne dag
    if(pendingFrom === 'current' && S.current && !S.current.routineId){ S.current.routineId = pendingDay.id; lsSave() }
    else { const w = pendingFrom && S.workouts.find(x => x.id === pendingFrom); if(w && !w.routineId) upsert('workouts', Object.assign(w, {routineId:pendingDay.id})) }
    if(S.summary) S.summary.fromRoutine = true;
  }
  pendingDay = pendingFrom = null;
  if(!S.programs.some(x => x.id === S.profile.activeProgram) || S.programs.length === 1) setProfile('activeProgram', p.id);
  toast(t('Program saved')); track('program-saved'); go(pBack);
}
function deleteProgram(){
  modal(`<h2>${t('Delete program?')}</h2><p class="mut">${t('Your workouts in the log are kept.')}</p>
    <div class="grid2"><button class="btn" onclick="closeModal()">${t('Keep')}</button><button class="btn danger" onclick="doDeleteProgram()">${t('Delete')}</button></div>`);
}
function doDeleteProgram(){ removeItem('programs', pDraft.id); pDraft = null; closeModal(); toast(t('Program deleted')); go('programs') }

/* ---------- Gem en træning som program ---------- */
function saveAsProgram(fromWorkoutId){
  const w = fromWorkoutId ? S.workouts.find(x => x.id === fromWorkoutId) : cw(); if(!w || !w.ex.length) return;
  pendingFrom = fromWorkoutId || (wMode === 'active' ? 'current' : null);   // træningen bliver til denne dag
  pendingDay = {id:newId(), name:w.name, ex:w.ex.map(e => { const s = e.sets.find(z => z.reps != null) || {}; return {id:e.id, sets:Math.max(1, e.sets.length), reps:s.reps || e.target || 10} })};
  pBack = ['workout','done'].includes(view) ? view : 'programs';
  const p = activeProgram();
  if(!p) return newProgramFromDay();
  modal(`<div class="row between"><h2 style="margin:0">${t('Save as program')}</h2>${closeBtn()}</div>
    <div class="stack"><button class="btn pri block" onclick="addDayToProgram()">${ic('plus')} ${t('Add as a day in {p}', {p:esc(p.name)})}</button>
    <button class="btn block" onclick="newProgramFromDay()">${ic('list')} ${t('New program')}</button></div>`);
}
function newProgramFromDay(){ pDraft = {id:newId(), name:'', days:[pendingDay]}; go('program') }
function addDayToProgram(){ const p = JSON.parse(JSON.stringify(activeProgram())); p.days.push(pendingDay); pDraft = p; go('program') }

/* ---------- Sæt et program ind som tekst ---------- */
// Danske og almindelige navne → øvelser i appen
const EX_ALIAS = {
  'bænkpres':'bench','bænk':'bench','bench':'bench','brystpres':'bench','håndvægt bænkpres':'db_bench','dumbbell bench':'db_bench','skrå bænkpres':'incline_db','incline':'incline_db','incline bench':'incline_db',
  'flyes':'chest_fly','flys':'chest_fly','cable fly':'chest_fly','armbøjninger':'pushup','armstrækninger':'pushup','push ups':'pushup','pushups':'pushup','dips':'dips',
  'dødløft':'deadlift','deadlift':'deadlift','roning':'row_bb','barbell row':'row_bb','bent over row':'row_bb','håndvægt roning':'db_row','dumbbell row':'db_row',
  'lat pulldown':'latpull','lat træk':'latpull','lattræk':'latpull','pulldown':'latpull','kabel roning':'cable_row','seated row':'cable_row','pull ups':'pullup','pullups':'pullup','chins':'pullup','chin ups':'pullup','face pull':'face_pull','face pulls':'face_pull',
  'squat':'squat_bb','squats':'squat_bb','back squat':'squat_bb','knæbøj':'squat_bb','goblet squat':'goblet','benpres':'legpress','leg press':'legpress','lunges':'lunge','udfald':'lunge',
  'leg extension':'leg_ext','lårekstension':'leg_ext','leg curl':'leg_curl','lårcurl':'leg_curl','hamstring curl':'leg_curl','læg':'calf_raise','lægløft':'calf_raise','calf raise':'calf_raise','calf raises':'calf_raise',
  'rumænsk dødløft':'rdl','rdl':'rdl','romanian deadlift':'rdl','hip thrust':'hip_thrust','hip thrusts':'hip_thrust','glute bridge':'glute_bridge','kettlebell swing':'kb_swing','swings':'kb_swing',
  'skulderpres':'ohp','militærpres':'ohp','overhead press':'ohp','ohp':'ohp','håndvægt skulderpres':'db_ohp','shoulder press':'db_ohp','sidehæv':'lat_raise','lateral raise':'lat_raise','lateral raises':'lat_raise',
  'biceps curl':'db_curl','bicepscurl':'db_curl','curls':'db_curl','curl':'db_curl','stang curl':'bb_curl','barbell curl':'bb_curl','hammer curl':'hammer_curl','hammercurl':'hammer_curl',
  'triceps':'triceps_push','triceps pushdown':'triceps_push','pushdown':'triceps_push','skull crusher':'skull_crusher','skullcrushers':'skull_crusher',
  'planke':'plank','plank':'plank','mavebøjninger':'crunch','crunches':'crunch','crunch':'crunch','benløft':'leg_raise','hanging leg raise':'leg_raise','russian twist':'russian_twist','burpees':'burpee',
};
const normName = s => s.toLowerCase().replace(/[-_]/g, ' ').replace(/[^a-z0-9æøåé ]/g, '').replace(/\s+/g, ' ').trim();
function matchExercise(name){
  const n = normName(name), list = allExercises();
  if(EX_ALIAS[n] && EX[EX_ALIAS[n]]) return EX_ALIAS[n];
  const exact = list.find(x => normName(x.n) === n); if(exact) return exact.id;
  const alias = Object.keys(EX_ALIAS).sort((a, b) => b.length - a.length).find(a => (' ' + n + ' ').includes(' ' + a + ' ') && a.split(' ').length >= n.split(' ').length - 1);   // "Bulgarian split squat" er ikke "Squat"
  if(alias) return EX_ALIAS[alias];
  const words = n.split(' ').filter(w => w.length > 2); let best = null, score = 0;
  list.forEach(x => { const xw = normName(x.n).split(' '); const hit = words.filter(w => xw.some(v => v.startsWith(w) || w.startsWith(v))).length / Math.max(words.length, xw.length); if(hit > score){ score = hit; best = x.id } });
  return score >= 0.5 ? best : null;
}
// "Bænkpres 4x8 60kg", "Squat 5 x 5 @ 100", "Pull-ups 3 sæt á 10" … Linjer uden tal er dagenes navne.
function parseProgram(text){
  const p = {id:newId(), name:'', days:[]}, created = [];
  let day = null, headers = 0;
  text.split(/\r?\n/).forEach(raw => {
    let l = raw.replace(/^\s*([-*•·]|\d+[.)])\s+/, '').trim(); if(!l) return;
    const sr = l.match(/(\d+)\s*(?:[x×*]|sæt\s*(?:[aáà]|af|med|x)?|sets?\s*(?:of|x)?)\s*(\d+)/i);
    if(!sr){ l = l.replace(/[:\-–]+$/, '').trim(); if(!l || l.length > 50) return;
      if(!p.days.length && !day && headers === 0 && !p.name){ p.name = l; headers++; return }
      day = {id:newId(), name:l, ex:[]}; p.days.push(day); headers++; return }
    const kgm = l.match(/(\d+(?:[.,]\d+)?)\s*kg/i) || l.match(/@\s*(\d+(?:[.,]\d+)?)/);
    const name = l.replace(sr[0], ' ').replace(kgm ? kgm[0] : '', ' ').replace(/\b(reps?|gentagelser|sek|sec|s)\b/gi, ' ').replace(/[,:;@–-]+\s*$/,'').replace(/\s+/g, ' ').trim().replace(/[,:;–-]+$/, '').trim();
    if(!name) return;
    let id = matchExercise(name);
    if(!id){ const c = S.customEx.find(x => normName(x.n) === normName(name)) || created.find(x => normName(x.n) === normName(name));
      if(c) id = c.id; else { const x = {id:'c_' + newId(), n:name.charAt(0).toUpperCase() + name.slice(1), m:'Full body', t:'w'}; created.push(x); id = x.id } }
    if(!day){ day = {id:newId(), name:'', ex:[]}; p.days.push(day) }
    const e = {id, sets:Math.min(20, Math.max(1, +sr[1])), reps:Math.max(1, +sr[2])}; if(kgm) e.kg = num(kgm[1]);
    day.ex.push(e);
  });
  // stod der kun én overskrift, er den dagens navn og ikke programmets
  if(p.name && p.days.length && p.days.every(d => !d.name) ){ p.days[0].name = p.name; if(p.days.length === 1) p.name = '' }
  p.days = p.days.filter(d => d.ex.length);
  return {p, created};
}
function importSheet(){
  modal(`<div class="row between"><h2 style="margin:0">${t('Paste your program')}</h2>${closeBtn()}</div>
    <p class="small mut">${t('Write or paste your program as text. One exercise per line, a line without numbers starts a new day.')}</p>
    <textarea id="impTxt" class="txt imp" rows="11" placeholder="${esc(t('Push\nBench press 4x8 60kg\nShoulder press 3x10\n\nPull\nPull-ups 3x8\nRow 3x10'))}"></textarea>
    <button class="btn pri block" style="margin-top:12px" onclick="doImport()">${ic('list')} ${t('Set up program')}</button>`);
  setTimeout(() => $('#impTxt')?.focus(), 60);
}
function doImport(){
  const {p, created} = parseProgram($('#impTxt').value || '');
  if(!p.days.length) return toast(t('I could not find any exercises. Write them like: Bench press 4x8'));
  created.forEach(x => upsert('customEx', x));
  pBack = view === 'train' ? 'train' : 'programs'; pDraft = p; go('program');
  toast(created.length ? t('Check the program and tap Save. {n} new exercises were created.', {n:created.length}) : t('Check the program and tap Save.'));
}
