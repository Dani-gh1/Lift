/* LIFT – Onboarding, Profil (konto, mål, kropsvægt, backup) og Premium */
'use strict';

/* ---------- Start: splash → opret konto → Premium-tilbud ---------- */
SCREENS.splash = app => { app.innerHTML = `<div class="splash">${logoHTML(true)}</div>` };

SCREENS.auth = app => {
  const code = acct.step === 'code';
  app.innerHTML = `<div class="wrap auth">
    <div class="authtop">${logoHTML(true)}</div>
    ${code ? `
      <div class="bigicon">${ic('mail')}</div>
      <h1>Check your inbox</h1>
      <p class="mut">We sent a sign-in link to <b class="txtc">${esc(acct.email)}</b>. Tap it on this phone – or type the code from the email:</p>
      <form onsubmit="verifyCode(event)">
        <input id="acCode" class="txt code" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="••••••" aria-label="Code from email">
        <button class="btn pri block" ${acct.busy?'disabled':''}>${acct.busy?'Checking…':'Continue'}</button>
      </form>
      <button class="link block" onclick="acct.step='email';render()">Use another email</button>
      <p class="xs mut center">No email? Check your spam folder, or wait a minute and try again.</p>`
    : `
      <h1>Create your account</h1>
      <p class="mut">Log every rep, see what you lifted last time and track what you eat. Your data is saved to your account – on every device.</p>
      <form onsubmit="sendCode(event)">
        <label class="small mut" for="acEmail">Email</label>
        <input id="acEmail" class="txt" type="email" autocomplete="email" required placeholder="you@email.com" value="${esc(acct.email)}" style="margin:6px 0 12px">
        <button class="btn pri block" ${acct.busy?'disabled':''}>${acct.busy?'Sending…':'Continue'}</button>
      </form>
      <p class="xs mut center">No password needed – we email you a sign-in link.<br>Already have an account? Same thing – just enter your email.</p>
      ${testTools() || !CONFIG.requireAccount ? `<button class="link block" onclick="acct.skip=true;try{localStorage.setItem('lift_skip','1')}catch(_){};render()">Continue without account</button>` : ''}`}
    <div style="flex:1"></div>
    <p class="xs mut center">By continuing you accept our ${legalLinks()}.</p>
  </div>`;
  setTimeout(() => (code ? $('#acCode') : $('#acEmail'))?.focus(), 60);
};

const PERKS = [
  ['chart','Stats & strength curves','See exactly how much stronger you get'],
  ['scan','Barcode scanner','Scan food instead of typing it'],
  ['target','Protein, carbs & fat','Hit your macros every day'],
  ['heart','Vitamins & minerals','Zinc, magnesium, iron, vitamin D and more'],
  ['file','Export your data','Download everything as a spreadsheet'],
];
SCREENS.offer = app => {
  app.innerHTML = `<div class="wrap offer">
    <button class="iconbtn closex" onclick="closeOffer()" aria-label="Close and go to the app">${ic('x')}</button>
    <span class="pill">${ic('crown')} LIFT Premium</span>
    <h1>Get more out of every workout</h1>
    <div class="perks">${PERKS.map(([i,t,d]) => `<div class="perk"><span class="bi">${ic(i)}</span><div><b>${t}</b><span class="small mut">${d}</span></div></div>`).join('')}</div>
    ${plansHTML()}
    ${payEnabled()
      ? (acct.user ? `<button class="btn pri block" onclick="startCheckout()" ${acct.busy?'disabled':''}>${acct.busy?'Opening secure payment…':`Start ${CONFIG.trialDays}-day free trial`}</button>
          <p class="xs mut center">Free for ${CONFIG.trialDays} days, then ${plan==='year' ? CONFIG.priceYear + ' ' + CONFIG.currency + '/year' : CONFIG.priceMonth + ' ' + CONFIG.currency + '/month'}. Cancel anytime.</p>` : '')
      : (CONFIG.waitlistUrl ? `<a class="btn pri block" href="${esc(CONFIG.waitlistUrl)}" target="_blank" rel="noopener" onclick="S.profile.waitlist={at:new Date().toISOString()};lsSave();track('waitlist-click-offer')">Get notified when Premium opens</a>` : '')
        + `<p class="xs mut center">Premium is coming soon. LIFT is free to use in the meantime.</p>`}
    <button class="link block" onclick="closeOffer()">Continue with free</button>
  </div>`;
  track('offer-view');
};
function closeOffer(){ setProfile('offerSeen', true); S.profile.onboarded = true; lsSave(); view = 'train'; render(); setTimeout(() => showInstall(), 3000) }

function bodyForm(){
  const p = S.profile, f = (id, label, val, unit, mode='numeric') => `<label class="fld"><span class="xs mut">${label}</span><span class="row"><input id="${id}" class="txt" inputmode="${mode}" value="${val ?? ''}"><small class="mut">${unit}</small></span></label>`;
  return `<p class="xs mut" style="margin:10px 0 6px">Goal</p><div class="chips" id="bfGoal">${Object.entries(GOALS).map(([k,g]) => `<button class="chip ${p.goal===k?'on':''}" data-v="${k}" onclick="document.querySelectorAll('#bfGoal .chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${g.n}</button>`).join('')}</div>
    <div class="chips" id="bfSex" style="margin:10px 0">${[['male','Male'],['female','Female']].map(([v,l]) => `<button class="chip ${p.sex===v?'on':''}" data-v="${v}" onclick="document.querySelectorAll('#bfSex .chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${l}</button>`).join('')}</div>
    <div class="grid3">${f('bfAge','Age',p.age,'yrs')}${f('bfH','Height',p.height,'cm')}${f('bfW','Weight',p.weight,'kg','decimal')}</div>
    <p class="xs mut" style="margin:10px 0 6px">Activity</p>
    <div class="chips" id="bfAct">${ACTIVITY.map(a => `<button class="chip ${p.activity===a.v?'on':''}" data-v="${a.v}" title="${a.d}" onclick="document.querySelectorAll('#bfAct .chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${a.n}<span class="xs mut"> · ${a.d}</span></button>`).join('')}</div>`;
}
function readBodyForm(){
  const num = id => { const v = parseFloat(($('#'+id)?.value||'').replace(',','.')); return isNaN(v) || v <= 0 ? null : v };
  S.profile.goal = $('#bfGoal .chip.on')?.dataset.v || S.profile.goal;
  const sex = $('#bfSex .chip.on')?.dataset.v || S.profile.sex, act = parseFloat($('#bfAct .chip.on')?.dataset.v) || S.profile.activity;
  Object.assign(S.profile, {sex, age:num('bfAge'), height:num('bfH'), weight:num('bfW'), activity:act});
  if(S.profile.weight && !S.body.length) upsert('body', {id:newId(), d:Date.now(), kg:S.profile.weight});
  setProfile('pu', Date.now());
}

/* ---------- Profil ---------- */
SCREENS.profile = app => {
  const p = S.profile, g = goals(), pr = isPremium(), lb = p.lastBackup;
  const lastW = S.body.slice().sort((a,b) => b.d - a.d).slice(0,5);
  app.innerHTML = `<div class="wrap">
    ${header(`<h1>Profile</h1>`, '')}
    ${acct.user ? `<div class="card"><div class="banner"><span class="bi">${ic('user')}</span><div class="grow" style="min-width:0"><h3 style="margin:0">Your account</h3><p class="small mut" style="overflow:hidden;text-overflow:ellipsis">${esc(acct.user.email)}</p>
        <p class="xs mut">${syncState==='ok' ? `${ic('cloud','xs')} Everything is saved to your account.` : syncState==='syncing' ? 'Saving…' : syncState==='offline' ? 'Offline – saved on this phone and uploaded when you are back online.' : 'Not saved yet – we will try again.'}</p></div></div>
        <div class="grid2" style="margin-top:8px"><button class="btn sm" onclick="syncNow()">${ic('repeat','sm')} Sync now</button><button class="btn sm" onclick="signOut()">Sign out</button></div></div>`
      : acct.offline ? `<div class="card"><p class="small mut">${ic('cloudoff','sm')} Offline – your data is saved on this phone and uploaded when you're back online.</p></div>`
      : authEnabled() ? `<div class="card"><div class="banner"><span class="bi">${ic('cloudoff')}</span><div class="grow"><h3 style="margin:0">Save to your account</h3></div></div>${loginHTML('Your data is only on this phone. Create a free account to keep it safe and use LIFT on all your devices.')}</div>` : ''}
    <button class="card prog" onclick="openPremium('profile')"><div class="row between"><div><h3 style="margin:0">${pr ? 'Premium' : 'LIFT Free'}</h3><p class="small mut" style="margin:2px 0 0">${!pr ? 'Upgrade for stats, barcode scanning and macros' : p.premium.source==='stripe' ? `${p.premium.status==='trialing'?'Trial until':p.premium.cancel?'Ends':'Renews'} ${dkLong(p.premium.until)}` : 'Test mode'}</p></div>${ic('chevR')}</div></button>
    <div class="card"><h3>Goal</h3>
      <div class="chips">${Object.entries(GOALS).map(([k,x]) => `<button class="chip ${p.goal===k?'on':''}" onclick="setProfile('goal','${k}');render()">${x.n}</button>`).join('')}</div>
      <div class="grid2" style="margin-top:12px"><div class="stat"><span>Calories / day</span><b>${g.kcal}</b><span class="xs">${p.kcalGoal ? 'your own' : g.auto && p.weight ? 'calculated' : 'default'}</span></div><div class="stat"><span>Protein / day</span><b>${g.p} g</b></div></div>
      <button class="btn sm block" style="margin-top:10px" onclick="editBody()">${ic('edit','sm')} Body & calorie goal</button>
      <p class="small mut" style="margin:14px 0 6px">Workouts per week</p>
      <div class="chips">${[2,3,4,5,6].map(n => `<button class="chip ${p.weeklyGoal===n?'on':''}" onclick="setProfile('weeklyGoal',${n});render()">${n}</button>`).join('')}</div>
      <p class="small mut" style="margin:14px 0 6px">Rest timer</p>
      <div class="chips">${[60,90,120,180].map(n => `<button class="chip ${p.restDefault===n?'on':''}" onclick="setProfile('restDefault',${n});render()">${n<120?n+' sec':n/60+' min'}</button>`).join('')}</div>
    </div>
    <div class="card"><h3>${ic('scale','sm')} Body weight</h3>
      <form class="row" onsubmit="addWeight(event)"><input id="bw" class="txt grow" inputmode="decimal" placeholder="Today's weight" aria-label="Body weight in kg"><span class="mut">kg</span><button class="btn sm pri">Log</button></form>
      ${lastW.map(b => `<div class="row between small" style="padding:6px 0;border-top:1px solid var(--line)"><span class="mut">${dk(b.d)}</span><span><b>${fmt(b.kg)} kg</b> <button class="link xs" style="min-height:0;padding:0 0 0 8px" onclick="removeItem('body','${b.id}');render()" aria-label="Delete">${ic('x','sm')}</button></span></div>`).join('')}
      ${S.body.length >= 2 && !pr ? `<p class="xs mut" style="margin-top:8px">${ic('lock','sm')} See your weight curve in Stats with Premium.</p>` : ''}
    </div>
    <div class="card"><h3>Your data</h3>
      <p class="small mut">${acct.user ? 'Saved to your account and on this device.' : 'Saved on this device only. Make a backup, or sign in to save it to your account.'} Last backup: <b>${lb ? dkLong(lb) : 'never'}</b></p>
      <div class="grid2"><button class="btn sm" onclick="exportJSON()">${ic('download','sm')} Save backup</button><button class="btn sm" onclick="importJSON()">${ic('upload','sm')} Restore backup</button></div>
      <button class="btn sm block" style="margin-top:8px" onclick="exportCSV()">${pr ? ic('file','sm') : ic('lock','sm')} Export to spreadsheet (CSV)</button>
    </div>
    <div class="card"><h3>App</h3>
      <button class="btn block" onclick="setProfile('sound',!S.profile.sound);render()">${p.sound ? ic('sound') + ' Rest timer sound: On' : ic('mute') + ' Rest timer sound: Off'}</button>
      ${isStandalone() ? '' : `<button class="btn block" style="margin-top:8px" onclick="showInstall(true)">${ic('install')} Add to home screen</button>`}
      <button class="btn block danger" style="margin-top:8px" onclick="askReset()">${ic('trash')} Delete all my data</button>
    </div>
    ${testTools() ? `<div class="card" style="border-style:dashed"><h3>For testing</h3><p class="xs mut">Only visible with ?test in the address.</p>
      <div class="grid2"><button class="btn sm" onclick="S.profile.premium=isPremium()?null:'test';lsSave();render()">${pr?'Turn Premium off':'Turn Premium on'}</button><button class="btn sm" onclick="loadDemo()">Sample data</button></div></div>` : ''}
    <div class="warnline">${ic('alert')}<span>LIFT does not give medical advice. Stop if it hurts, and ask a doctor if you're ill or injured.</span></div>
    <p class="xs mut center" style="margin-top:14px">LIFT · version 3 · ${legalLinks()}</p>
  </div>`;
};
function editBody(){
  const p = S.profile;
  modal(`<div class="row between"><h2 style="margin:0">Body & calorie goal</h2>${closeBtn()}</div>
    ${bodyForm()}
    <p class="small mut" style="margin:14px 0 6px">Or set your own goals (leave empty to calculate)</p>
    <div class="grid2"><label class="fld"><span class="xs mut">Calories / day</span><input id="kg_k" class="txt" inputmode="numeric" value="${p.kcalGoal ?? ''}" placeholder="auto"></label><label class="fld"><span class="xs mut">Protein g / day</span><input id="kg_p" class="txt" inputmode="numeric" value="${p.proteinGoal ?? ''}" placeholder="auto"></label></div>
    <button class="btn pri block" style="margin-top:14px" onclick="saveBody()">Save</button>`);
}
function saveBody(){
  readBodyForm();
  const k = parseInt($('#kg_k').value), pr = parseInt($('#kg_p').value);
  S.profile.kcalGoal = k > 0 ? k : null; S.profile.proteinGoal = pr > 0 ? pr : null; setProfile('pu', Date.now());
  closeModal(); render(); toast('Goals updated');
}
function addWeight(e){
  e.preventDefault(); const v = parseFloat(($('#bw').value||'').replace(',','.'));
  if(!v || v < 20 || v > 400) return toast('Enter your weight in kg');
  upsert('body', {id:newId(), d:Date.now(), kg:v}); S.profile.weight = v; setProfile('pu', Date.now()); render(); toast('Weight logged');
}
function askReset(){
  modal(`<h2>Delete all data?</h2><p class="mut">All workouts, routines, food and settings are deleted from this device${acct.user ? ' and from your account' : ''}. This can't be undone.</p>
    <div class="grid2"><button class="btn" onclick="closeModal()">Keep</button><button class="btn danger" onclick="doReset()">Delete</button></div>`);
}
async function doReset(){
  const now = Date.now(); COLLS.forEach(k => S[k].forEach(x => S.del[x.id] = now));
  const keepDel = S.del, prem = S.profile.premium; S = blank(); S.del = keepDel; S.profile.premium = prem; S.profile.pu = now;
  save(); stopRest(); closeModal(); toast('Data deleted'); go('train');
}

/* ---------- Backup & eksport ---------- */
async function saveFile(name, text, mime){
  const blob = new Blob([text], {type:mime});
  try{ const file = new File([blob], name, {type:mime});
    if(/iphone|ipad|android/i.test(navigator.userAgent) && navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file], title:name}); return true } }
  catch(e){ if(e && e.name === 'AbortError') return false }
  try{ const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href), 4000); return true }
  catch(e){ toast('Could not save the file'); return false }
}
async function exportJSON(){
  const data = {app:'LIFT', version:3, exported:new Date().toISOString(), ...syncPayload(), profile:S.profile};
  if(await saveFile(`lift-backup-${dayKey()}.json`, JSON.stringify(data), 'application/json')){ S.profile.lastBackup = new Date().toISOString(); lsSave(); toast('Backup saved'); track('backup'); render() }
}
function importJSON(){
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
  inp.onchange = () => { const f = inp.files[0]; if(!f) return; const rd = new FileReader();
    rd.onload = () => { try{ const d = JSON.parse(rd.result); if(d.app !== 'LIFT') throw 0;
        const n = d.version >= 3 ? (d.workouts||[]).length : (d.logs||[]).length;
        modal(`<h2>Restore backup?</h2><p class="mut">The backup from ${d.exported ? dkLong(d.exported) : 'an unknown date'} has <b>${n} workouts</b>. It is merged with what is in the app now – nothing is lost.</p>
          <div class="grid2"><button class="btn" onclick="closeModal()">Cancel</button><button class="btn pri" id="doImp">Restore</button></div>`);
        $('#doImp').onclick = () => {
          if(d.version >= 3){ mergeRemote(d); if(d.profile) Object.assign(S.profile, Object.fromEntries(SYNC_PROFILE.filter(k => k in d.profile).map(k => [k, d.profile[k]]))) }
          else { const keep = S; migrateV2(d); const migrated = S; S = keep; mergeRemote(migrated) }
          S.profile.pu = Date.now(); save(); closeModal(); toast('Backup restored'); go('train') };
      }catch(e){ toast('That file is not a valid LIFT backup') } };
    rd.readAsText(f) };
  inp.click();
}
function exportCSV(){
  if(!isPremium()) return openPremium('csv');
  const rows = [['date','workout','exercise','muscle','set','kg','reps']];
  S.workouts.forEach(w => w.ex.forEach(e => e.sets.forEach((s,i) => rows.push([dayKey(w.start), w.name, exInfo(e.id).n, exInfo(e.id).m, i+1, s.kg, s.reps]))));
  saveFile(`lift-workouts-${dayKey()}.csv`, '﻿' + rows.map(r => r.map(c => /[,"\n]/.test(String(c)) ? '"' + String(c).replace(/"/g,'""') + '"' : c).join(',')).join('\n'), 'text/csv');
}
function loadDemo(){
  const now = Date.now(), tmpl = ['t_push','t_pull','t_legs'];
  for(let i = 0; i < 24; i++){
    const t = TEMPLATES.find(x => x.id === tmpl[i%3]), start = now - (24-i)*2.3*DAY;
    upsert('workouts', {id:newId(), start, end:start + (45+Math.random()*20)*60000, name:t.name, ex:t.ex.map(([id,s,r]) => { const x = exInfo(id), base = x.t==='w' ? ({bench:50,deadlift:80,squat_bb:60,ohp:30,row_bb:45,rdl:60,legpress:100}[id] || 12) : r;
      return {id, sets:Array.from({length:s}, () => ({kg: x.t==='w' ? Math.round((base + i*0.6)*2)/2 : 0, reps: x.t==='w' ? r : r + Math.floor(i/4), done:true}))} })});
  }
  for(let d = 0; d < 14; d++){ const day = dayKey(now - d*DAY);
    [['Oats with milk','Breakfast',450,22,60,12],['Chicken & rice','Lunch',650,45,75,15],['Skyr','Snacks',180,24,12,1],['Salmon & potatoes','Dinner',700,40,55,30]].forEach(([n,m,k,p,c,f]) =>
      S.food.push(touch({id:newId(), date:day, meal:m, name:n, quick:{kcal:k + Math.round(Math.random()*80-40), p, c, f}}))) }
  for(let d = 0; d < 8; d++) S.body.push(touch({id:newId(), d:now - (56-d*7)*DAY, kg:Math.round((78 - d*0.3)*10)/10}));
  S.workouts.sort((a,b) => a.start - b.start); save(); toast('Sample data loaded'); go('stats');
}

/* ---------- Premium ---------- */
function openPremium(from){ premFrom = from || ''; track('premium-view'); if(from) track('premium-click-' + from); go('premium') }
SCREENS.premium = app => {
  const yes = ic('check'), no = '<span class="no">—</span>', active = S.profile.premium && S.profile.premium.source === 'stripe';
  app.innerHTML = `<div class="wrap">
    ${header(`<button class="iconbtn back" onclick="go(prevView || 'train')" aria-label="Back">${ic('chevL')}</button><h1>Premium</h1>`, '')}
    ${active ? buyHTML() : ''}
    <div class="hero"><span class="pill">${ic('crown')} LIFT Premium</span>
      <h2 style="margin-top:12px">Train smarter. Eat smarter.</h2>
      <p class="mut">Everything in Free, plus the tools that show you what's working.</p></div>
    <div class="card"><table class="cmp"><tr><th></th><th>Free</th><th>Premium</th></tr>
      <tr><td>Workout log with last-time numbers</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>Routines, templates & history</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>Calorie tracking</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>Saved to your account</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>Stats, strength curves & records</td><td>${no}</td><td>${yes}</td></tr>
      <tr><td>Barcode scanning</td><td>${no}</td><td>${yes}</td></tr>
      <tr><td>Protein, carbs & fat</td><td>${no}</td><td>${yes}</td></tr>
      <tr><td>Vitamins & minerals (zinc, magnesium …)</td><td>${no}</td><td>${yes}</td></tr>
      <tr><td>Export to spreadsheet</td><td>${no}</td><td>${yes}</td></tr></table></div>
    ${active ? '' : plansHTML()}
    ${active ? '' : (payEnabled() ? buyHTML() : waitlistHTML())}
  </div>`;
};
function plansHTML(){
  return `<button class="plan ${plan==='year'?'on':''}" onclick="plan='year';render()" aria-pressed="${plan==='year'}"><span class="tag">Save 40%</span>
      <div class="row between wrapf"><div><b>Yearly</b><div class="small mut">Just ${Math.round(CONFIG.priceYear/12)} ${CONFIG.currency}/month</div></div><div class="price">${CONFIG.priceYear} ${CONFIG.currency}<span class="small mut"> /yr</span></div></div></button>
    <button class="plan ${plan==='month'?'on':''}" onclick="plan='month';render()" aria-pressed="${plan==='month'}">
      <div class="row between wrapf"><div><b>Monthly</b><div class="small mut">Cancel anytime</div></div><div class="price">${CONFIG.priceMonth} ${CONFIG.currency}<span class="small mut"> /mo</span></div></div></button>`;
}
function buyHTML(){
  const p = S.profile.premium;
  if(p && p.source === 'stripe') return `<div class="card how"><h3>${ic('crown','sm')} You have Premium</h3>
    <p class="small">${p.plan==='year'?'Yearly':'Monthly'} plan · ${p.status==='trialing'?'free trial until':p.cancel?'ends':'renews'} <b>${dkLong(p.until)}</b></p>
    <button class="btn block" onclick="openPortal()" ${acct.busy?'disabled':''}>Manage subscription</button></div>`;
  return acct.user ? `<button class="btn pri block" style="margin-top:6px" onclick="startCheckout()" ${acct.busy?'disabled':''}>${acct.busy?'Opening secure payment…':`Start ${CONFIG.trialDays}-day free trial`}</button>
      <p class="xs mut center">Then ${plan==='year'?CONFIG.priceYear+' '+CONFIG.currency+' per year':CONFIG.priceMonth+' '+CONFIG.currency+' per month'}. Cancel anytime before the trial ends and you pay nothing. Secure payment by Stripe.</p>
      <p class="xs mut center">By starting the trial you accept our <a href="terms.html" class="neon">Terms</a> and <a href="privacy.html" class="neon">Privacy Policy</a>.</p>
      <p class="xs mut center">Signed in as ${esc(acct.user.email)}</p>`
    : `<div class="card"><h3>${ic('user','sm')} Sign in to start</h3>${loginHTML('Sign in with your email to start your free trial. No password – we email you a link.')}</div>`;
}
function waitlistHTML(){
  const w = S.profile.waitlist, interest = S.profile.interest;
  return `${interest ? `<div class="card how center"><b class="neon">Thanks for your interest!</b><p class="small mut">Premium isn't open yet. Join the waitlist below to be the first to know – and get ${CONFIG.trialDays} days free.</p></div>`
      : `<button class="btn pri block" style="margin-top:6px" onclick="S.profile.interest={plan,at:new Date().toISOString(),from:premFrom};lsSave();track('trial-click-'+plan);render()">Try free for ${CONFIG.trialDays} days</button>`}
    <div class="card"><h3>${ic('mail','sm')} Waitlist</h3>
      ${w ? `<p class="small">Thanks for signing up! We'll let you know when Premium opens.</p>`
        : CONFIG.waitlistUrl ? `<p class="small mut">Get notified when Premium opens.</p><a class="btn block" href="${esc(CONFIG.waitlistUrl)}" target="_blank" rel="noopener" onclick="S.profile.waitlist={at:new Date().toISOString()};lsSave();track('waitlist-click')">Join the waitlist</a>` : ''}
    </div>
    <p class="xs mut center">You won't be charged. Payments are not switched on yet.</p>
    <p class="xs mut center">${legalLinks()}</p>`;
}
