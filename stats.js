/* LIFT – Statistik (Premium) ud fra træningsloggen, kropsvægt og mad */
'use strict';

let statEx = null, statRange = 12;   // uger
function weeksBack(n){ const out = [], cur = weekStart(new Date()); for(let i = n-1; i >= 0; i--) out.push(cur - i*7*DAY); return out }
function exHistory(id){
  const x = exInfo(id);
  return S.workouts.filter(w => w.ex.some(e => e.id === id && doneSets(e).length)).map(w => {
    const sets = doneSets(w.ex.find(e => e.id === id));
    return {d:w.start, y: x.t === 'w' ? Math.max(...sets.map(e1rm)) : Math.max(...sets.map(s => s.reps)), top: x.t === 'w' ? Math.max(...sets.map(s => s.kg)) : null};
  });
}
function prList(){
  const ids = [...new Set(S.workouts.flatMap(w => w.ex.map(e => e.id)))];
  return ids.map(id => { const b = bestEver(id); return b ? {id, n:exInfo(id).n, v:setText(exInfo(id), b.s), e:exInfo(id).t==='w' ? b.v : null} : null }).filter(Boolean)
    .sort((a,b) => (b.e||0) - (a.e||0));
}

// Tegnes inde i Goals-skærmen (fanen "Stats")
function renderStats(app){
  if(!isPremium()) return statsTeaser(app);
  const weeks = weeksBack(statRange), from = weeks[0];
  const ws = S.workouts.filter(w => w.start >= from);
  const ids = [...new Set(S.workouts.flatMap(w => w.ex.map(e => e.id)))];
  if(!statEx || !ids.includes(statEx)) statEx = ids.sort((a,b) => exHistory(b).length - exHistory(a).length)[0];
  const vol = ws.reduce((a,w) => a + volumeOf(w), 0), sets = ws.reduce((a,w) => a + setCount(w), 0);
  const avgMin = ws.length ? Math.round(ws.reduce((a,w) => a + ((w.end||w.start) - w.start), 0) / ws.length / 60000) : 0;
  // sæt pr. muskelgruppe
  const musc = {}; ws.forEach(w => w.ex.forEach(e => { const m = exInfo(e.id).m; musc[m] = (musc[m]||0) + doneSets(e).length }));
  const mMax = Math.max(1, ...Object.values(musc));
  // mad: sidste 14 dage
  const days = Array.from({length:14}, (_,i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return dayKey(d) });
  const kcalDays = days.map(d => ({x:d.slice(8), y:Math.round(dayTotals(d).t.kcal)}));
  const logged = kcalDays.filter(d => d.y > 0), g = goals();
  const avgK = logged.length ? Math.round(logged.reduce((a,d) => a + d.y, 0) / logged.length) : 0;
  const avgP = logged.length ? Math.round(days.filter(d => dayTotals(d).t.kcal > 0).reduce((a,d) => a + dayTotals(d).t.p, 0) / logged.length) : 0;
  const hist = statEx ? exHistory(statEx) : [];
  app.innerHTML = `<div>
    <div class="chips" style="margin-top:14px">${[[4,t('4 weeks')],[12,t('12 weeks')],[52,t('1 year')]].map(([n,l]) => `<button class="chip ${statRange===n?'on':''}" onclick="statRange=${n};render()">${l}</button>`).join('')}</div>
    ${!S.workouts.length ? `<div class="card center"><p class="mut">${t('Log your first workout and your stats appear here.')}</p><button class="btn pri" onclick="go('train')">${t('Go to Train')}</button></div>` : `
    <div class="grid2" style="margin-top:10px">
      <div class="stat"><span>${t('Workouts')}</span><b>${ws.length}</b></div>
      <div class="stat"><span>${t('Week streak')}</span><b>${weekStreak()} ${ic('flame','sm')}</b></div>
      <div class="stat"><span>${t('Volume')}</span><b>${vol >= 10000 ? fmt(vol/1000) + ' t' : Math.round(vol) + ' kg'}</b></div>
      <div class="stat"><span>${t('Sets · avg time')}</span><b>${sets}<small> · ${avgMin} min</small></b></div>
    </div>
    <div class="card"><h3>${t('Workouts per week')}</h3><canvas id="cW" height="140"></canvas></div>
    <div class="card"><h3>${t('Volume per week (kg)')}</h3><canvas id="cV" height="140"></canvas></div>
    <div class="card"><h3>${t('Exercise progress')}</h3>
      <select class="txt" onchange="statEx=this.value;render()" aria-label="${t('Exercise')}">${ids.map(id => `<option value="${id}" ${id===statEx?'selected':''}>${esc(exInfo(id).n)}</option>`).join('')}</select>
      ${hist.length >= 2 ? `<p class="xs mut" style="margin:10px 0 0">${exInfo(statEx).t==='w' ? t('Estimated 1-rep max (kg)') : exInfo(statEx).t==='s' ? t('Longest hold (sec)') : t('Most reps')}</p><canvas id="cE" height="190"></canvas>
        <p class="small">${t('Since first time:')} <b class="neon">${hist[hist.length-1].y - hist[0].y >= 0 ? '+' : ''}${fmt(hist[hist.length-1].y - hist[0].y)} ${exInfo(statEx).t==='w' ? 'kg' : unitOf(exInfo(statEx))}</b> ${t('over {n} workouts', {n:hist.length})}</p>`
        : `<p class="small mut" style="margin-top:10px">${t('Do this exercise one more time to see your curve.')}</p>`}
    </div>
    <div class="card"><h3>${t('Sets per muscle group')}</h3>${MUSCLES.filter(m => musc[m]).map(m => `<div class="mbar"><div class="row between xs"><span>${mus(m)}</span><span class="mut">${t('{n} sets', {n:musc[m]})}</span></div><div class="track"><i style="width:${musc[m]/mMax*100}%"></i></div></div>`).join('') || `<p class="small mut">${t('No sets in this period.')}</p>`}</div>
    <div class="card"><h3>${ic('trophy','sm')} ${t('Personal records')}</h3>${prList().slice(0,12).map(p => `<div class="row between" style="padding:7px 0;border-top:1px solid var(--line)"><span class="small">${esc(p.n)}</span><span class="small"><b class="neon">${esc(p.v)}</b>${p.e ? `<span class="xs mut"> · e1RM ${fmt(p.e)}</span>` : ''}</span></div>`).join('')}</div>`}
    ${S.body.length >= 2 ? `<div class="card"><h3>${t('Body weight (kg)')}</h3><canvas id="cB" height="160"></canvas></div>` : ''}
    <div class="card"><h3>${t('Nutrition – last 14 days')}</h3>
      ${logged.length ? `<div class="grid2"><div class="stat"><span>${t('Avg calories')}</span><b>${avgK}</b><span class="xs">${t('goal')} ${g.kcal}</span></div><div class="stat"><span>${t('Avg protein')}</span><b>${avgP} g</b><span class="xs">${t('goal')} ${g.p} g</span></div></div>
        <canvas id="cK" height="140" style="margin-top:10px"></canvas>` : `<p class="small mut">${t('Log food in the Food tab to see your averages here.')}</p>`}
    </div>
  </div>`;
  if(!S.workouts.length) return;
  drawBars($('#cW'), weeks.slice(-12).map((w,i,a) => ({x: i===a.length-1 ? t('Now') : String(new Date(w).getDate()), y: S.workouts.filter(x => weekStart(x.start) === w).length})));
  drawBars($('#cV'), weeks.slice(-12).map((w,i,a) => ({x: i===a.length-1 ? t('Now') : String(new Date(w).getDate()), y: Math.round(S.workouts.filter(x => weekStart(x.start) === w).reduce((s,x) => s + volumeOf(x), 0))})), v => v >= 1000 ? fmt(v/1000) + ' t' : String(v));
  if(hist.length >= 2) drawLine($('#cE'), hist.map(h => ({x:h.d, y:Math.round(h.y*10)/10})));
  if(S.body.length >= 2) drawLine($('#cB'), S.body.slice().sort((a,b) => a.d - b.d).map(b => ({x:b.d, y:b.kg})));
  if(logged.length) drawBars($('#cK'), kcalDays);
}

function statsTeaser(app){
  app.innerHTML = `<div style="margin-top:14px">
    <div class="hero"><span class="pill">${ic('crown')} Premium</span>
      <h2 style="margin-top:12px">${t('See how much stronger you get')}</h2>
      <p class="mut">${t('Your stats are built from every set you log.')} ${S.workouts.length ? t(S.workouts.length > 1 ? 'You already have {n} workouts ready to analyse.' : 'You already have {n} workout ready to analyse.', {n:`<b class="neon">${S.workouts.length}</b>`}) : ''}</p></div>
    <div class="card preview" aria-hidden="true"><div class="fakebars">${[3,4,2,5,4,6,5,7].map(h => `<i style="height:${h*12}px"></i>`).join('')}</div></div>
    <ul class="feat">
      <li>${t('Strength curve for every exercise (estimated 1-rep max)')}</li>
      <li>${t('Workouts and volume per week')}</li>
      <li>${t('Personal records and how far you’ve come')}</li>
      <li>${t('Sets per muscle group – spot what you skip')}</li>
      <li>${t('Body weight and nutrition trends')}</li>
    </ul>
    <button class="btn pri block" onclick="openPremium('stats')">${ic('crown')} ${t('Unlock stats')}</button>
  </div>`;
}
