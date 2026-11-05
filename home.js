/* LIFT – Home: overblik over i dag, ugen og dine mål */
'use strict';

function greeting(){ const h = new Date().getHours(); return t(h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening') }
// Nye rekorder de seneste 7 dage
function recentPRs(){
  const since = Date.now() - 7*DAY, out = [];
  S.workouts.filter(w => w.start >= since).forEach(w => w.ex.forEach(e => {
    const x = exInfo(e.id), sets = doneSets(e); if(!sets.length) return;
    const val = s => x.t === 'w' ? e1rm(s) : s.reps;
    const top = sets.reduce((a,s) => val(s) > val(a) ? s : a, sets[0]);
    let prev = 0; S.workouts.forEach(o => { if(o.start >= w.start) return; o.ex.forEach(f => { if(f.id === e.id) doneSets(f).forEach(s => prev = Math.max(prev, val(s))) }) });
    if(prev > 0 && val(top) > prev + 0.01 && !out.find(p => p.id === e.id)) out.push({id:e.id, n:x.n, v:setText(x, top), d:w.start});
  }));
  return out.slice(-3).reverse();
}

SCREENS.home = app => {
  const today = dayKey(), doneToday = S.workouts.filter(w => dayKey(w.start) === today);
  const g = goals(), tot = dayTotals(today).t, left = Math.round(g.kcal - tot.kcal), pct = Math.min(1, tot.kcal / g.kcal);
  const tw = thisWeek().length, wg = S.profile.weeklyGoal || 3, streak = weekStreak();
  const active = (S.goals||[]).filter(x => !x.done), nr = nextRoutine(), prs = recentPRs(), pr = isPremium();
  const dateTxt = cap(new Date().toLocaleDateString(LOC(), {weekday:'long', day:'numeric', month:'long'}));

  // Træning i dag
  let workoutTile;
  if(S.current) workoutTile = `<div class="tile hl"><div class="row"><span class="bi">${ic('timer')}</span><div class="grow"><b>${t('Workout in progress')}</b><span class="small mut">${esc(S.current.name)} · ${durText(Date.now()-S.current.start)}</span></div></div>
      <button class="btn pri block" onclick="resumeWorkout()">${ic('play')} ${t('Continue')}</button></div>`;
  else if(doneToday.length){ const w = doneToday[doneToday.length-1];
    workoutTile = `<div class="tile"><div class="row"><span class="bi done">${ic('check')}</span><div class="grow"><b>${t('Trained today')}</b><span class="small mut">${esc(w.name)} · ${durText((w.end||w.start)-w.start)} · ${t('{n} sets', {n:setCount(w)})}</span></div></div>
      <button class="link" onclick="startWorkout()">${ic('plus','xs')} ${t('Start another workout')}</button></div>` }
  else workoutTile = `<div class="tile"><div class="row"><span class="bi">${ic('dumbbell')}</span><div class="grow"><b>${t('Ready to train?')}</b><span class="small mut">${nr ? t('Next up: {n}', {n:esc(nr.name)}) : tw >= wg ? t('Weekly goal done – bonus workout?') : t(wg - tw === 1 ? '{n} workout left this week' : '{n} workouts left this week', {n:wg - tw})}</span></div></div>
      ${nr ? `<div class="grid2"><button class="btn pri" onclick="startWorkout('${nr.id}')">${ic('play','sm')} ${esc(nr.name.length > 14 ? t('Start routine') : nr.name)}</button><button class="btn" onclick="startWorkout()">${t('Empty workout')}</button></div>`
        : `<button class="btn pri block" onclick="startWorkout()">${ic('plus')} ${t('Start workout')}</button>`}</div>`;

  app.innerHTML = `<div class="wrap">
    ${header(`<div class="grow" style="min-width:0"><div class="xs mut">${dateTxt}</div><h1>${greeting()}</h1></div>`, syncChip())}

    <div class="sect"><span>${t('Today')}</span></div>
    ${workoutTile}
    <div class="tile food" role="button" tabindex="0" onclick="go('food')" onkeydown="if(event.key==='Enter')go('food')">
      <div class="ring sm" style="--p:${pct}"><div><b>${Math.abs(left)}</b><span class="xs mut">${left >= 0 ? t('kcal left') : t('over')}</span></div></div>
      <div class="grow">
        <div class="row between small"><span class="mut">${t('Eaten')}</span><b>${Math.round(tot.kcal)} / ${g.kcal}</b></div>
        ${pr ? `<div class="row between small"><span class="mut">${t('Protein')}</span><b>${Math.round(tot.p)} / ${g.p} g</b></div><div class="track thin"><i style="width:${Math.min(100, tot.p/g.p*100)}%"></i></div>`
          : `<p class="xs mut" style="margin:4px 0 0">${S.food.some(e => e.date === today) ? t('Tap to see your meals') : t('Nothing logged yet today')}</p>`}
        <button class="btn sm pri" style="margin-top:8px" onclick="event.stopPropagation();foodDay=dayKey();addFood()">${ic('plus','sm')} ${t('Log food')}</button>
      </div>
    </div>

    <div class="sect"><span>${t('This week')}</span><span class="xs mut">${ic('flame','xs')} ${t(streak === 1 ? '{n} week streak' : '{n} weeks streak', {n:streak})}</span></div>
    <button class="tile" onclick="go('train')">
      <div class="row between small"><b>${t('{a} of {b} workouts', {a:tw, b:wg})}</b><span class="mut">${tw >= wg ? t('Goal reached') + ' 🎉' : t('{n} to go', {n:wg - tw})}</span></div>
      <div class="track big"><i style="width:${Math.min(100, tw/wg*100)}%"></i></div>
      ${weekDaysHTML()}
    </button>

    <div class="sect"><span>${t('Goals')}</span><button class="link" onclick="go('goals')">${active.length ? t('See all') : ''}</button></div>
    ${active.length ? active.slice(0,3).map(goalMini).join('')
      : `<button class="tile empty" onclick="newGoal()"><span class="bi">${ic('target')}</span><div class="grow"><b>${t('Set your first goal')}</b><span class="small mut">${t('A target weight, a lift like bench 100 kg, or 10 pull-ups.')}</span></div>${ic('chevR')}</button>`}

    ${prs.length ? `<div class="sect"><span>${t('New records this week')}</span></div>${prs.map(p => `<div class="lrow static"><span class="bi sm gold">${ic('trophy','sm')}</span><span class="grow"><b>${esc(p.n)}</b><span class="xs mut">${dk(p.d)}</span></span><b class="neon">${esc(p.v)}</b></div>`).join('')}` : ''}

    ${!pr ? `<button class="lrow promo" onclick="openPremium('home')"><span class="bi sm gold">${ic('crown','sm')}</span><span class="grow"><b>${t('Try Premium')}</b><span class="xs mut">${t('Stats, barcode scanner, macros & vitamins')}</span></span>${ic('chevR','sm')}</button>` : ''}
  </div>`;
};
