/* LIFT – Mål: daglige/ugentlige mål + egne mål (kropsvægt, øvelser) med fremgang. */
'use strict';

const clamp01 = v => Math.max(0, Math.min(1, v));

/* ---------- Udregning ---------- */
function currentWeight(){ const b = S.body.slice().sort((a,b) => b.d - a.d)[0]; return b ? b.kg : (S.profile.weight || null) }
// Bedste resultat i en øvelse: vægt-øvelser = tungeste kg med mindst `reps` gentagelser, ellers flest reps/sekunder i ét sæt
function exerciseBest(id, reps){
  const x = exInfo(id); let best = 0, when = null;
  S.workouts.forEach(w => w.ex.forEach(e => { if(e.id !== id) return; doneSets(e).forEach(s => {
    const v = x.t === 'w' ? ((s.reps||0) >= (reps||1) ? (s.kg||0) : 0) : (s.reps||0);
    if(v > best){ best = v; when = w.start } }) }));
  return {v:best, when};
}
function goalState(g){
  const now = Date.now(); let st;
  if(g.type === 'weight'){
    const cur = currentWeight(), lose = g.target < g.start, total = Math.abs(g.start - g.target);
    const moved = cur == null ? 0 : (lose ? g.start - cur : cur - g.start);
    const reached = cur != null && (lose ? cur <= g.target : cur >= g.target);
    st = {icon:'scale', unit:'kg', cur, pct: total ? clamp01(moved / total) : 1, reached,
      title: t(lose ? 'Lose weight to {w} kg' : 'Gain weight to {w} kg', {w:fmt(g.target)}),
      curText: cur == null ? '–' : fmt(cur) + ' kg', startText: fmt(g.start) + ' kg', targetText: fmt(g.target) + ' kg',
      left: cur == null ? t('Log your weight') : reached ? t('Reached!') : t('{n} kg to go', {n:fmt(Math.abs(cur - g.target))})};
  } else {
    const x = exInfo(g.exId), u = x.t === 'w' ? 'kg' : unitOf(x), cur = exerciseBest(g.exId, g.reps).v, span = g.target - g.start;
    const reached = cur >= g.target;
    st = {icon: x.t === 'w' ? 'dumbbell' : 'bolt', unit:u, cur, pct: span > 0 ? clamp01((cur - g.start) / span) : (reached ? 1 : 0), reached,
      title: x.t === 'w' ? `${x.n} ${fmt(g.target)} kg${g.reps > 1 ? ` × ${g.reps}` : ''}` : `${x.n}: ${g.target} ${u}`,
      curText: cur ? `${fmt(cur)} ${u}` : '–', startText: g.start ? `${fmt(g.start)} ${u}` : '0', targetText: `${fmt(g.target)} ${u}`,
      left: reached ? t('Reached!') : t('{n} {u} to go', {n:fmt(g.target - cur), u})};
  }
  if(g.done) st.reached = true;
  if(g.deadline && !g.done){
    const days = Math.ceil((g.deadline - now) / DAY), expect = clamp01((now - g.created) / Math.max(DAY, g.deadline - g.created));
    st.days = days;
    st.pace = days < 0 ? ['warn', t('Deadline passed')] : st.pct + 0.05 >= expect ? ['ok', t('On track')] : ['warn', t('Behind – keep going')];
    st.due = days < 0 ? t('{n} days late', {n:-days}) : days === 0 ? t('Due today') : days < 14 ? t(days === 1 ? '{n} day left' : '{n} days left', {n:days}) : t('{n} weeks left', {n:Math.round(days/7)});
  }
  return st;
}
// Kaldes efter træning og vejning. Returnerer mål, der lige er nået.
function checkGoals(){
  const hit = [];
  (S.goals||[]).filter(g => !g.done).forEach(g => { if(goalState(g).reached){ g.done = Date.now(); upsert('goals', g); hit.push(g); track('goal-reached-' + g.type) } });
  return hit;
}
function celebrate(list){
  modal(`<div class="center" style="padding:10px 0 4px"><div class="badge-big">${ic('trophy')}</div><h2>${t('Goal reached!')}</h2>
    ${list.map(g => `<p class="neon" style="font-weight:700;margin:4px 0">${esc(goalState(g).title)}</p>`).join('')}
    <p class="mut small">${t('Proud of you. Ready for the next one?')}</p></div>
    <button class="btn pri block" onclick="closeModal();newGoal('${list[0].type}', '${list[0].exId||''}')">${t('Set a new goal')}</button>
    <button class="btn ghost block" onclick="closeModal()">${t('Nice!')}</button>`);
}

/* ---------- Visning ---------- */
const bar = (pct, cls='') => `<div class="track big ${cls}"><i style="width:${Math.round(pct*100)}%"></i></div>`;
function goalCard(g){
  const st = goalState(g);
  return `<button class="card goal" onclick="goalDetail('${g.id}')">
    <div class="row"><span class="bi">${ic(st.icon)}</span><div class="grow" style="min-width:0"><b>${esc(st.title)}</b>
      <span class="xs mut">${t('{v} now', {v:st.curText})}${st.due ? ' · ' + st.due : ''}</span></div><span class="pct">${Math.round(st.pct*100)}%</span></div>
    ${bar(st.pct)}
    <div class="row between xs"><span class="mut">${t('Start')} ${st.startText}</span><span class="${st.pace ? st.pace[0] : 'mut'}">${st.pace && !st.reached ? st.pace[1] + ' · ' : ''}${st.left}</span></div>
  </button>`;
}
function targetsCard(){
  const g = goals(), tot = dayTotals(dayKey()).t, tw = thisWeek().length, wg = S.profile.weeklyGoal || 3, pr = isPremium();
  const row = (icon, label, val, goal, unit, pct, extra='') => `<div class="trow"><span class="bi sm">${ic(icon,'sm')}</span><div class="grow"><div class="row between small"><b>${label}</b><span class="mut">${val} / ${goal}${unit}</span></div>${bar(pct,'thin')}${extra}</div></div>`;
  return `<div class="card targets">
    ${row('dumbbell', t('Workouts this week'), tw, wg, '', clamp01(tw/wg), `<span class="xs mut">${ic('flame','xs')} ${t(weekStreak() === 1 ? '{n} week streak' : '{n} weeks streak', {n:weekStreak()})}</span>`)}
    ${row('flame', t('Calories today'), Math.round(tot.kcal), g.kcal, ' kcal', clamp01(tot.kcal/g.kcal))}
    ${pr ? row('target', t('Protein today'), Math.round(tot.p), g.p, ' g', clamp01(tot.p/g.p))
      : `<div class="trow"><span class="bi sm">${ic('target','sm')}</span><div class="grow"><div class="row between small"><b>${t('Protein today')}</b><span class="mut">${ic('lock','xs')} Premium</span></div>${bar(0,'thin')}</div></div>`}
  </div>`;
}

SCREENS.goals = app => {
  const active = (S.goals||[]).filter(g => !g.done), done = (S.goals||[]).filter(g => g.done).sort((a,b) => b.done - a.done);
  app.innerHTML = `<div class="wrap">
    ${header(`<h1>${t('Goals')}</h1>`, syncChip())}
    <div class="sect"><span>${t('Daily & weekly')}</span><button class="link" onclick="editTargets()">${ic('edit','xs')} ${t('Edit')}</button></div>
    ${targetsCard()}
    <div class="sect"><span>${t('My goals')}</span><button class="link" onclick="newGoal()">${ic('plus','xs')} ${t('New goal')}</button></div>
    ${active.length ? active.map(goalCard).join('') : `<div class="card empty">
      <p class="small mut" style="margin-top:0">${t('A clear goal makes every workout count. Pick one to start:')}</p>
      <button class="lrow" onclick="newGoal('weight')"><span class="bi sm">${ic('scale','sm')}</span><span class="grow"><b>${t('Reach a body weight')}</b><span class="xs mut">${t('e.g. lose 3 kg or gain 5 kg')}</span></span>${ic('chevR','sm')}</button>
      <button class="lrow" onclick="newGoal('lift')"><span class="bi sm">${ic('dumbbell','sm')}</span><span class="grow"><b>${t('Lift a weight')}</b><span class="xs mut">${t('e.g. bench press 100 kg')}</span></span>${ic('chevR','sm')}</button>
      <button class="lrow" onclick="newGoal('lift','pullup')"><span class="bi sm">${ic('bolt','sm')}</span><span class="grow"><b>${t('Do more reps')}</b><span class="xs mut">${t('e.g. 10 pull-ups or a 2-minute plank')}</span></span>${ic('chevR','sm')}</button>
    </div>`}
    ${done.length ? `<div class="sect"><span>${t('Achieved')}</span><span class="xs mut">${done.length}</span></div>
      ${done.map(g => `<button class="lrow" onclick="goalDetail('${g.id}')"><span class="bi sm gold">${ic('trophy','sm')}</span><span class="grow"><b>${esc(goalState(g).title)}</b><span class="xs mut">${t('Reached {d}', {d:dk(g.done)})}</span></span></button>`).join('')}` : ''}
  </div>`;
};

/* ---------- Daglige & ugentlige mål ---------- */
function editTargets(){
  const p = S.profile;
  modal(`<div class="row between"><h2 style="margin:0">${t('Daily & weekly goals')}</h2>${closeBtn()}</div>
    <p class="small mut" style="margin:12px 0 6px">${t('Workouts per week')}</p>
    <div class="chips" id="tgW">${[2,3,4,5,6].map(n => `<button class="chip ${(p.weeklyGoal||3)===n?'on':''}" data-v="${n}" onclick="document.querySelectorAll('#tgW .chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${n}</button>`).join('')}</div>
    <p class="small mut" style="margin:16px 0 0">${t('Calories & protein are calculated from your body and goal:')}</p>
    ${bodyForm()}
    <p class="small mut" style="margin:14px 0 6px">${t('Or set your own (leave empty to calculate)')}</p>
    <div class="grid2"><label class="fld"><span class="xs mut">${t('Calories / day')}</span><input id="kg_k" class="txt" inputmode="numeric" value="${p.kcalGoal ?? ''}" placeholder="${goals().kcal}"></label><label class="fld"><span class="xs mut">${t('Protein g / day')}</span><input id="kg_p" class="txt" inputmode="numeric" value="${p.proteinGoal ?? ''}" placeholder="${goals().p}"></label></div>
    <button class="btn pri block" style="margin-top:14px" onclick="saveTargets()">${t('Save')}</button>`);
}
function saveTargets(){
  readBodyForm();
  const k = parseInt($('#kg_k').value), pr = parseInt($('#kg_p').value), w = parseInt($('#tgW .chip.on')?.dataset.v);
  S.profile.kcalGoal = k > 0 ? k : null; S.profile.proteinGoal = pr > 0 ? pr : null; if(w) S.profile.weeklyGoal = w;
  setProfile('pu', Date.now()); closeModal(); render(); toast(t('Goals updated'));
}
const editBody = editTargets;   // gammelt navn bruges stadig nogle steder

/* ---------- Nyt / rediger mål ---------- */
let gDraft = null;
function newGoal(type, exId){
  if(!type) return modal(`<div class="row between"><h2 style="margin:0">${t('New goal')}</h2>${closeBtn()}</div>
    <button class="opt" onclick="newGoal('weight')"><span class="oi">${ic('scale')}</span><span>${t('Body weight')}<small>${t('Reach a target weight')}</small></span></button>
    <button class="opt" onclick="newGoal('lift')"><span class="oi">${ic('dumbbell')}</span><span>${t('Exercise')}<small>${t('Lift heavier, or do more reps or time')}</small></span></button>`);
  gDraft = {id:newId(), type, created:Date.now(), deadline:null, done:null, exId: exId || null, reps:1};
  if(type === 'weight'){ const cur = currentWeight(); gDraft.start = cur; gDraft.target = cur ? Math.round((cur + ((S.profile.goal==='fat') ? -3 : (S.profile.goal==='muscle' ? 3 : -2))) * 2) / 2 : null }
  if(type === 'lift' && gDraft.exId) suggestLift();
  goalForm();
}
function suggestLift(){
  const x = exInfo(gDraft.exId), b = exerciseBest(gDraft.exId, gDraft.reps).v;
  gDraft.target = x.t === 'w' ? Math.max(2.5, Math.round((b ? b * 1.1 : 20) / 2.5) * 2.5) : Math.max(1, Math.round(b ? b * 1.3 + 1 : (x.t==='s' ? 60 : 10)));
}
function goalForm(){
  const d = gDraft, deadlineVal = d.deadline ? dayKey(d.deadline) : '';
  let body = '';
  if(d.type === 'weight') body = `
    <div class="grid2"><label class="fld"><span class="xs mut">${t('Weight now')}</span><span class="row"><input id="gStart" class="txt" inputmode="decimal" value="${d.start ?? ''}"><small class="mut">kg</small></span></label>
    <label class="fld"><span class="xs mut">${t('Goal weight')}</span><span class="row"><input id="gTarget" class="txt" inputmode="decimal" value="${d.target ?? ''}"><small class="mut">kg</small></span></label></div>`;
  else {
    const x = d.exId && exInfo(d.exId), best = d.exId ? exerciseBest(d.exId, d.reps).v : 0;
    body = `<button class="lrow" onclick="pickExercise(id => { gDraft.exId = id; suggestLift(); goalForm() })"><span class="bi sm">${ic('dumbbell','sm')}</span><span class="grow"><b>${x ? esc(x.n) : t('Choose exercise')}</b><span class="xs mut">${x ? (best ? t('Your best: {v}', {v:`${fmt(best)} ${x.t==='w' ? 'kg' + (d.reps > 1 ? ` × ${d.reps}` : '') : unitOf(x)}`}) : t('No sets logged yet')) : t('Tap to pick')}</span></span>${ic('chevR','sm')}</button>
    ${x ? `<div class="grid2" style="margin-top:10px"><label class="fld"><span class="xs mut">${x.t==='w' ? t('Target weight') : x.t==='s' ? t('Target time') : t('Target reps')}</span><span class="row"><input id="gTarget" class="txt" inputmode="decimal" value="${d.target ?? ''}"><small class="mut">${x.t==='w' ? 'kg' : unitOf(x)}</small></span></label>
      ${x.t==='w' ? `<label class="fld"><span class="xs mut">${t('For reps')}</span><span class="row"><input id="gReps" class="txt" inputmode="numeric" value="${d.reps||1}" onchange="gDraft.reps=Math.max(1,parseInt(this.value)||1);goalForm()"><small class="mut">${t('reps')}</small></span></label>` : ''}</div>` : ''}`;
  }
  modal(`<div class="row between"><h2 style="margin:0">${S.goals.find(g => g.id === d.id) ? t('Edit goal') : d.type === 'weight' ? t('Body weight goal') : t('Exercise goal')}</h2>${closeBtn()}</div>
    ${body}
    <label class="fld" style="margin-top:12px"><span class="xs mut">${t('Deadline (optional)')}</span><input id="gDeadline" class="txt" type="date" value="${deadlineVal}" min="${dayKey()}"></label>
    <div class="chips" style="margin-top:8px">${[['4 weeks',28],['3 months',91],['6 months',182]].map(([l,n]) => `<button class="chip" onclick="$('#gDeadline').value=dayKey(Date.now()+${n}*DAY)">${l}</button>`).join('')}</div>
    <button class="btn pri block" style="margin-top:16px" onclick="saveGoal()">${t('Save goal')}</button>`);
}
function saveGoal(){
  const d = gDraft, num = id => { const v = parseFloat(($('#'+id)?.value||'').replace(',','.')); return isNaN(v) ? null : v };
  const dl = $('#gDeadline').value; d.deadline = dl ? new Date(dl + 'T23:59').getTime() : null;
  if(d.type === 'weight'){
    d.start = num('gStart'); d.target = num('gTarget');
    if(!d.start || !d.target) return toast(t('Enter your weight now and your goal weight'));
    if(Math.abs(d.start - d.target) < 0.1) return toast(t('Your goal should be different from your weight now'));
    const isNew = !S.goals.find(g => g.id === d.id);
    if(isNew && (!currentWeight() || Math.abs(currentWeight() - d.start) > 0.05)){ upsert('body', {id:newId(), d:Date.now(), kg:d.start}); S.profile.weight = d.start }
  } else {
    if(!d.exId) return toast(t('Choose an exercise'));
    d.target = num('gTarget'); if(!d.target) return toast(t('Enter your target'));
    const best = exerciseBest(d.exId, d.reps).v;
    if(d.target <= best) return toast(t('You’ve already done {v} – aim higher!', {v:fmt(best)}));
    if(!S.goals.find(g => g.id === d.id)) d.start = best;
  }
  upsert('goals', d); gDraft = null; closeModal(); track('goal-created-' + d.type);
  if(view !== 'goals') go('goals'); else render();
  toast(t('Goal saved – you got this!'));
}
function goalDetail(id){
  const g = S.goals.find(x => x.id === id); if(!g) return;
  const st = goalState(g), pr = isPremium();
  modal(`<div class="row between"><h2 style="margin:0">${esc(st.title)}</h2>${closeBtn()}</div>
    <div class="gbig"><div class="ring" style="--p:${st.pct}"><div><b>${Math.round(st.pct*100)}%</b><span class="xs mut">${g.done ? t('done') : t('there')}</span></div></div>
      <div class="grow"><div class="row between small"><span class="mut">${t('Start')}</span><b>${st.startText}</b></div><div class="row between small"><span class="mut">${t('Now')}</span><b>${st.curText}</b></div><div class="row between small"><span class="mut">${t('Goal')}</span><b class="neon">${st.targetText}</b></div></div></div>
    ${g.done ? `<p class="small center"><b class="neon">${ic('trophy','sm')} ${t('Reached {d}', {d:dkLong(g.done)})}</b></p>`
      : `<p class="small center ${st.pace ? st.pace[0] : 'mut'}">${st.left}${st.due ? ' · ' + st.due : ''}${st.pace ? ' · ' + st.pace[1] : ''}</p>`}
    ${pr ? `<canvas id="gChart" height="170"></canvas>` : `<p class="xs mut center">${ic('lock','xs')} ${t('Progress chart with')} <button class="link xs" style="padding:0;min-height:0" onclick="openPremium('goal-chart')">Premium</button></p>`}
    ${g.type === 'lift' && !g.done ? `<p class="xs mut">${exInfo(g.exId).t==='w' && g.reps > 1 ? t('Counts your heaviest set with at least {n} reps in any workout.', {n:g.reps}) : t('Counts your best set in any workout.')}</p>` : ''}
    <div class="grid2" style="margin-top:12px">${g.done ? `<button class="btn" onclick="newGoal('${g.type}','${g.exId||''}')">${ic('plus','sm')} ${t('Next goal')}</button>` : `<button class="btn" onclick="gDraft=JSON.parse(JSON.stringify(S.goals.find(x=>x.id==='${id}')));goalForm()">${ic('edit','sm')} ${t('Edit')}</button>`}
      <button class="btn danger" onclick="removeItem('goals','${id}');closeModal();render();toast(t('Goal deleted'))">${ic('trash','sm')} ${t('Delete')}</button></div>`);
  if(pr){
    const pts = g.type === 'weight' ? S.body.filter(b => b.d >= g.created - 7*DAY).sort((a,b) => a.d - b.d).map(b => ({x:b.d, y:b.kg}))
      : S.workouts.filter(w => w.ex.some(e => e.id === g.exId)).map(w => { const x = exInfo(g.exId), sets = doneSets(w.ex.find(e => e.id === g.exId));
          const v = x.t === 'w' ? Math.max(0, ...sets.filter(s => s.reps >= (g.reps||1)).map(s => s.kg)) : Math.max(0, ...sets.map(s => s.reps)); return {x:w.start, y:v} }).filter(p => p.y > 0);
    if(pts.length >= 2) drawLine($('#gChart'), pts); else $('#gChart').outerHTML = `<p class="xs mut center">${g.type === 'weight' ? t('Your chart appears after a few more weigh-ins.') : t('Your chart appears after a few more workouts.')}</p>`;
  }
}
