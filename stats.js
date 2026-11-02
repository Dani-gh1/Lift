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

SCREENS.stats = app => {
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
  app.innerHTML = `<div class="wrap">
    ${header(`<h1>Stats</h1>`, syncChip())}
    <div class="chips">${[[4,'4 weeks'],[12,'12 weeks'],[52,'1 year']].map(([n,l]) => `<button class="chip ${statRange===n?'on':''}" onclick="statRange=${n};render()">${l}</button>`).join('')}</div>
    ${!S.workouts.length ? `<div class="card center"><p class="mut">Log your first workout and your stats appear here.</p><button class="btn pri" onclick="go('train')">Go to Train</button></div>` : `
    <div class="grid2" style="margin-top:10px">
      <div class="stat"><span>Workouts</span><b>${ws.length}</b></div>
      <div class="stat"><span>Week streak</span><b>${weekStreak()} ${ic('flame','sm')}</b></div>
      <div class="stat"><span>Volume</span><b>${vol >= 10000 ? fmt(vol/1000) + ' t' : Math.round(vol) + ' kg'}</b></div>
      <div class="stat"><span>Sets · avg time</span><b>${sets} · ${avgMin}m</b></div>
    </div>
    <div class="card"><h3>Workouts per week</h3><canvas id="cW" height="140"></canvas></div>
    <div class="card"><h3>Volume per week (kg)</h3><canvas id="cV" height="140"></canvas></div>
    <div class="card"><h3>Exercise progress</h3>
      <select class="txt" onchange="statEx=this.value;render()" aria-label="Exercise">${ids.map(id => `<option value="${id}" ${id===statEx?'selected':''}>${esc(exInfo(id).n)}</option>`).join('')}</select>
      ${hist.length >= 2 ? `<p class="xs mut" style="margin:10px 0 0">${exInfo(statEx).t==='w' ? 'Estimated 1-rep max (kg)' : exInfo(statEx).t==='s' ? 'Longest hold (sec)' : 'Most reps'}</p><canvas id="cE" height="190"></canvas>
        <p class="small">Since first time: <b class="neon">${hist[hist.length-1].y - hist[0].y >= 0 ? '+' : ''}${fmt(hist[hist.length-1].y - hist[0].y)} ${exInfo(statEx).t==='w' ? 'kg' : unitOf(exInfo(statEx))}</b> over ${hist.length} workouts</p>`
        : `<p class="small mut" style="margin-top:10px">Do this exercise one more time to see your curve.</p>`}
    </div>
    <div class="card"><h3>Sets per muscle group</h3>${MUSCLES.filter(m => musc[m]).map(m => `<div class="mbar"><div class="row between xs"><span>${m}</span><span class="mut">${musc[m]} sets</span></div><div class="track"><i style="width:${musc[m]/mMax*100}%"></i></div></div>`).join('') || '<p class="small mut">No sets in this period.</p>'}</div>
    <div class="card"><h3>${ic('trophy','sm')} Personal records</h3>${prList().slice(0,12).map(p => `<div class="row between" style="padding:7px 0;border-top:1px solid var(--line)"><span class="small">${esc(p.n)}</span><span class="small"><b class="neon">${esc(p.v)}</b>${p.e ? `<span class="xs mut"> · e1RM ${fmt(p.e)}</span>` : ''}</span></div>`).join('')}</div>`}
    ${S.body.length >= 2 ? `<div class="card"><h3>Body weight (kg)</h3><canvas id="cB" height="160"></canvas></div>` : ''}
    <div class="card"><h3>Nutrition – last 14 days</h3>
      ${logged.length ? `<div class="grid2"><div class="stat"><span>Avg calories</span><b>${avgK}</b><span class="xs">goal ${g.kcal}</span></div><div class="stat"><span>Avg protein</span><b>${avgP} g</b><span class="xs">goal ${g.p} g</span></div></div>
        <canvas id="cK" height="140" style="margin-top:10px"></canvas>` : `<p class="small mut">Log food in the Food tab to see your averages here.</p>`}
    </div>
  </div>`;
  if(!S.workouts.length) return;
  drawBars($('#cW'), weeks.slice(-12).map((w,i,a) => ({x: i===a.length-1 ? 'Now' : dk(w).split(' ')[0], y: S.workouts.filter(x => weekStart(x.start) === w).length})));
  drawBars($('#cV'), weeks.slice(-12).map((w,i,a) => ({x: i===a.length-1 ? 'Now' : dk(w).split(' ')[0], y: Math.round(S.workouts.filter(x => weekStart(x.start) === w).reduce((s,x) => s + volumeOf(x), 0))})));
  if(hist.length >= 2) drawLine($('#cE'), hist.map(h => ({x:h.d, y:Math.round(h.y*10)/10})));
  if(S.body.length >= 2) drawLine($('#cB'), S.body.slice().sort((a,b) => a.d - b.d).map(b => ({x:b.d, y:b.kg})));
  if(logged.length) drawBars($('#cK'), kcalDays);
};

function statsTeaser(app){
  app.innerHTML = `<div class="wrap">
    ${header(`<h1>Stats</h1>`, syncChip())}
    <div class="hero"><span class="pill">${ic('crown')} Premium</span>
      <h2 style="margin-top:12px">See how much stronger you get</h2>
      <p class="mut">Your stats are built from every set you log. ${S.workouts.length ? `You already have <b class="neon">${S.workouts.length} workout${S.workouts.length>1?'s':''}</b> ready to analyse.` : ''}</p></div>
    <div class="card preview" aria-hidden="true"><div class="fakebars">${[3,4,2,5,4,6,5,7].map(h => `<i style="height:${h*12}px"></i>`).join('')}</div></div>
    <ul class="feat">
      <li>Strength curve for every exercise (estimated 1-rep max)</li>
      <li>Workouts and volume per week</li>
      <li>Personal records and how far you've come</li>
      <li>Sets per muscle group – spot what you skip</li>
      <li>Body weight and nutrition trends</li>
    </ul>
    <button class="btn pri block" onclick="openPremium('stats')">${ic('crown')} Unlock stats</button>
  </div>`;
}
