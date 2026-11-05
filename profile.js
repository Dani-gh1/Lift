/* LIFT – Onboarding, Profil (konto, mål, kropsvægt, backup) og Premium */
'use strict';

/* ---------- Start: splash → opret konto → Premium-tilbud ---------- */
SCREENS.splash = app => { app.innerHTML = `<div class="splash">${logoHTML(true)}</div>` };

SCREENS.auth = app => {
  const sent = acct.step === 'sent', confirm = acct.step === 'confirm';
  app.innerHTML = `<div class="wrap auth">
    <div class="authtop">${logoHTML(true)}</div>
    ${sent ? `
      <div class="bigicon">${ic('mail')}</div>
      <h1>${t('Check your inbox')}</h1>
      <p class="mut">${t('We sent a sign-in link to {e}.', {e:`<b class="txtc">${esc(acct.email)}</b>`})}</p>
      <p class="mut">${t('Open the email <b class="txtc">on this phone</b> and tap the link – then you’re in.')}</p>
      <button class="btn block" style="margin-top:14px" onclick="acct.step='email';render()">${t('Use another email or send again')}</button>
      <p class="xs mut center">${t('No email after a minute? Check your spam folder.')}</p>`
    : `
      <h1>${confirm ? t('Almost there') : t('Create your account')}</h1>
      <p class="mut">${confirm ? t('Confirm your email to finish signing in.') : t('Log every rep, see what you lifted last time and track what you eat. Your data is saved to your account – on every device.')}</p>
      <form onsubmit="${confirm ? 'confirmEmail' : 'sendCode'}(event)">
        <label class="small mut" for="acEmail">${t('Email')}</label>
        <input id="acEmail" class="txt" type="email" autocomplete="email" required placeholder="${t('you@email.com')}" value="${esc(acct.email)}" style="margin:6px 0 12px">
        <button class="btn pri block" ${acct.busy?'disabled':''}>${acct.busy ? (confirm ? t('Signing in…') : t('Sending…')) : (confirm ? t('Sign in') : t('Continue'))}</button>
      </form>
      ${confirm ? '' : `<p class="xs mut center">${t('No password needed – we email you a sign-in link.')}<br>${t('Already have an account? Same thing – just enter your email.')}</p>
      ${testTools() || !CONFIG.requireAccount ? `<button class="link block" onclick="acct.skip=true;try{localStorage.setItem('lift_skip','1')}catch(_){};render()">${t('Continue without account')}</button>` : ''}`}`}
    <div style="flex:1"></div>
    <p class="xs mut center">${t('By continuing you accept our {l}.', {l:legalLinks()})}</p>
    <p class="xs center" style="margin-top:8px"><button class="link xs" onclick="setLang('en')" style="padding:0 6px;min-height:32px;${LANG==='en'?'color:var(--txt)':''}">English</button>·<button class="link xs" onclick="setLang('da')" style="padding:0 6px;min-height:32px;${LANG==='da'?'color:var(--txt)':''}">Dansk</button></p>
  </div>`;
  if(!sent) setTimeout(() => $('#acEmail')?.focus(), 60);
};

const PERKS = [
  ['chart','Stats & strength curves','See exactly how much stronger you get'],   // oversættes ved visning
  ['scan','Barcode scanner','Scan food instead of typing it'],
  ['target','Protein, carbs & fat','Hit your macros every day'],
  ['heart','Vitamins & minerals','Zinc, magnesium, iron, vitamin D and more'],
  ['file','Export your data','Download everything as a spreadsheet'],
];
SCREENS.offer = app => {
  app.innerHTML = `<div class="wrap offer">
    <button class="iconbtn closex" onclick="closeOffer()" aria-label="${t('Close and go to the app')}">${ic('x')}</button>
    <span class="pill">${ic('crown')} LIFT Premium</span>
    <h1>${t('Get more out of every workout')}</h1>
    <div class="perks">${PERKS.map(([i,a,d]) => `<div class="perk"><span class="bi">${ic(i)}</span><div><b>${t(a)}</b><span class="small mut">${t(d)}</span></div></div>`).join('')}</div>
    ${plansHTML()}
    ${payEnabled()
      ? (acct.user ? `<button class="btn pri block" onclick="startCheckout()" ${acct.busy?'disabled':''}>${acct.busy?t('Opening secure payment…'):t('Start {n}-day free trial', {n:CONFIG.trialDays})}</button>
          <p class="xs mut center">${t('Free for {n} days, then {p}. Cancel anytime.', {n:CONFIG.trialDays, p: plan==='year' ? CONFIG.priceYear + ' ' + CONFIG.currency + t('/year') : CONFIG.priceMonth + ' ' + CONFIG.currency + t('/month')})}</p>` : '')
      : (CONFIG.waitlistUrl ? `<a class="btn pri block" href="${esc(CONFIG.waitlistUrl)}" target="_blank" rel="noopener" onclick="S.profile.waitlist={at:new Date().toISOString()};lsSave();track('waitlist-click-offer')">${t('Get notified when Premium opens')}</a>` : '')
        + `<p class="xs mut center">${t('Premium is coming soon. LIFT is free to use in the meantime.')}</p>`}
    <button class="link block" onclick="closeOffer()">${t('Continue with free')}</button>
  </div>`;
  track('offer-view');
};
function closeOffer(){ setProfile('offerSeen', true); S.profile.onboarded = true; lsSave(); view = 'train'; render(); setTimeout(() => showInstall(), 3000) }

function bodyForm(){
  const p = S.profile, f = (id, label, val, unit, mode='numeric') => `<label class="fld"><span class="xs mut">${label}</span><span class="row"><input id="${id}" class="txt" inputmode="${mode}" value="${val ?? ''}"><small class="mut">${unit}</small></span></label>`;
  return `<p class="xs mut" style="margin:10px 0 6px">${t('Goal')}</p><div class="chips" id="bfGoal">${Object.entries(GOALS).map(([k,g]) => `<button class="chip ${p.goal===k?'on':''}" data-v="${k}" onclick="document.querySelectorAll('#bfGoal .chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${t(g.n)}</button>`).join('')}</div>
    <div class="chips" id="bfSex" style="margin:10px 0">${[['male',t('Male')],['female',t('Female')]].map(([v,l]) => `<button class="chip ${p.sex===v?'on':''}" data-v="${v}" onclick="document.querySelectorAll('#bfSex .chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${l}</button>`).join('')}</div>
    <div class="grid3">${f('bfAge',t('Age'),p.age,t('yrs'))}${f('bfH',t('Height'),p.height,'cm')}${f('bfW',t('Weight'),p.weight,'kg','decimal')}</div>
    <p class="xs mut" style="margin:10px 0 6px">${t('Activity')}</p>
    <div class="chips" id="bfAct">${ACTIVITY.map(a => `<button class="chip ${p.activity===a.v?'on':''}" data-v="${a.v}" title="${t(a.d)}" onclick="document.querySelectorAll('#bfAct .chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${t(a.n)}<span class="xs mut"> · ${t(a.d)}</span></button>`).join('')}</div>`;
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
  const p = S.profile, pr = isPremium(), lb = p.lastBackup;
  app.innerHTML = `<div class="wrap">
    ${header(`<h1>${t('Profile')}</h1>`, '')}
    ${acct.user ? `<div class="card"><div class="banner"><span class="bi">${ic('user')}</span><div class="grow" style="min-width:0"><b>${t('Your account')}</b><p class="small mut ell" style="margin:2px 0 0">${esc(acct.user.email)}</p>
        <p class="xs ${syncState==='ok' ? 'neon' : 'mut'}" style="margin:4px 0 0">${syncState==='ok' ? `${ic('cloud','xs')} ${t('Everything is saved to your account')}` : syncState==='syncing' ? t('Saving…') : syncState==='offline' ? t('Offline – saved on this phone, uploaded when you are back online') : t('Not saved yet – we will try again')}</p></div></div>
        <div class="grid2" style="margin-top:10px"><button class="btn sm" onclick="syncNow()">${ic('repeat','sm')} ${t('Sync now')}</button><button class="btn sm" onclick="signOut()">${t('Sign out')}</button></div></div>`
      : acct.offline ? `<div class="card"><p class="small mut" style="margin:0">${ic('cloudoff','sm')} ${t('Offline – your data is saved on this phone and uploaded when you’re back online.')}</p></div>`
      : authEnabled() ? `<div class="card"><div class="banner"><span class="bi">${ic('cloudoff')}</span><div class="grow"><b>${t('Save to your account')}</b></div></div>${loginHTML(t('Your data is only on this phone. Create a free account to keep it safe and use LIFT on all your devices.'))}</div>` : ''}

    <button class="lrow" onclick="openPremium('profile')"><span class="bi sm ${pr ? '' : 'gold'}">${ic('crown','sm')}</span><span class="grow"><b>${pr ? 'LIFT Premium' : t('Upgrade to Premium')}</b><span class="xs mut">${!pr ? t('Stats, barcode scanner, macros & vitamins') : p.premium.source==='stripe' ? t(p.premium.status==='trialing' ? 'Trial until {d}' : p.premium.cancel ? 'Ends {d}' : 'Renews {d}', {d:dkLong(p.premium.until)}) : t('Test mode')}</span></span>${ic('chevR','sm')}</button>
    <button class="lrow" onclick="go('goals')"><span class="bi sm">${ic('target','sm')}</span><span class="grow"><b>${t('Goals & body')}</b><span class="xs mut">${goals().kcal} kcal · ${t('{n} g protein', {n:goals().p})} · ${t('{n} workouts/week', {n:p.weeklyGoal||3})}</span></span>${ic('chevR','sm')}</button>

    <div class="sect"><span>${t('Settings')}</span></div>
    <div class="card">
      <p class="small" style="margin:0 0 8px"><b>${t('Language')}</b></p>
      <div class="chips" style="margin-bottom:14px">${[['en','English'],['da','Dansk']].map(([l,n]) => `<button class="chip ${LANG===l?'on':''}" onclick="setLang('${l}')" aria-pressed="${LANG===l}">${n}</button>`).join('')}</div>
      <p class="small" style="margin:0 0 8px"><b>${t('Rest timer')}</b></p>
      <div class="chips">${[60,90,120,180].map(n => `<button class="chip ${p.restDefault===n?'on':''}" onclick="setProfile('restDefault',${n});render()">${n<120?n+' '+t('sec'):n/60+' min'}</button>`).join('')}</div>
      <button class="lrow flat" style="margin-top:10px" onclick="setProfile('sound',!S.profile.sound);render()"><span class="bi sm">${ic(p.sound ? 'sound' : 'mute','sm')}</span><span class="grow"><b>${t('Timer sound')}</b></span><span class="toggle ${p.sound?'on':''}" aria-hidden="true"></span></button>
      ${isStandalone() ? '' : `<button class="lrow flat" onclick="showInstall(true)"><span class="bi sm">${ic('install','sm')}</span><span class="grow"><b>${t('Add to home screen')}</b></span>${ic('chevR','sm')}</button>`}
    </div>

    <div class="sect"><span>${t('Your data')}</span></div>
    <div class="card">
      <p class="small mut" style="margin-top:0">${acct.user ? t('Saved to your account and on this phone.') : t('Saved on this phone only.')} ${t('Last backup:')} <b>${lb ? dkLong(lb) : t('never')}</b></p>
      <div class="grid2"><button class="btn sm" onclick="exportJSON()">${ic('download','sm')} ${t('Save backup')}</button><button class="btn sm" onclick="importJSON()">${ic('upload','sm')} ${t('Restore')}</button></div>
      <button class="btn sm block" style="margin-top:8px" onclick="exportCSV()">${pr ? ic('file','sm') : ic('lock','sm')} ${t('Export to spreadsheet')}</button>
      <button class="btn sm block danger" style="margin-top:8px" onclick="askReset()">${ic('trash','sm')} ${t('Delete all my data')}</button>
    </div>
    ${testTools() ? `<div class="card" style="border-style:dashed"><b>${t('For testing')}</b><p class="xs mut">${t('Only visible with ?test in the address.')}</p>
      <div class="grid2"><button class="btn sm" onclick="S.profile.premium=isPremium()?null:'test';lsSave();render()">${pr?t('Turn Premium off'):t('Turn Premium on')}</button><button class="btn sm" onclick="loadDemo()">${t('Sample data')}</button></div></div>` : ''}
    <div class="warnline" style="margin-top:14px">${ic('alert')}<span>${t('LIFT does not give medical advice. Stop if it hurts, and ask a doctor if you’re ill or injured.')}</span></div>
    <p class="xs mut center" style="margin-top:14px">LIFT · ${t('version {n}', {n:5})} · ${legalLinks()}</p>
  </div>`;
};
function askReset(){
  modal(`<h2>${t('Delete all data?')}</h2><p class="mut">${acct.user ? t('All workouts, routines, food and settings are deleted from this device and from your account. This can’t be undone.') : t('All workouts, routines, food and settings are deleted from this device. This can’t be undone.')}</p>
    <div class="grid2"><button class="btn" onclick="closeModal()">${t('Keep')}</button><button class="btn danger" onclick="doReset()">${t('Delete')}</button></div>`);
}
async function doReset(){
  const now = Date.now(), del = Object.assign({}, S.del), dirty = {};
  COLLS.forEach(k => S[k].forEach(x => { del[x.id] = now; dirty[x.id] = k }));
  const keep = {premium:S.profile.premium}, sync = S.sync;
  S = blank(); S.del = del; S.dirty = dirty; S.sync = sync; Object.assign(S.profile, keep); S.profile.pu = now; S.profile.offerSeen = true; S.profile.onboarded = true;
  save(); stopRest(); closeModal(); toast(t('Data deleted')); go('train');
}


/* ---------- Backup & eksport ---------- */
async function saveFile(name, text, mime){
  const blob = new Blob([text], {type:mime});
  try{ const file = new File([blob], name, {type:mime});
    if(/iphone|ipad|android/i.test(navigator.userAgent) && navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file], title:name}); return true } }
  catch(e){ if(e && e.name === 'AbortError') return false }
  try{ const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href), 4000); return true }
  catch(e){ toast(t('Could not save the file')); return false }
}
async function exportJSON(){
  const data = {app:'LIFT', version:3, exported:new Date().toISOString(), ...syncPayload(), profile:S.profile};
  if(await saveFile(`lift-backup-${dayKey()}.json`, JSON.stringify(data), 'application/json')){ S.profile.lastBackup = new Date().toISOString(); lsSave(); toast(t('Backup saved')); track('backup'); render() }
}
function importJSON(){
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
  inp.onchange = () => { const f = inp.files[0]; if(!f) return; const rd = new FileReader();
    rd.onload = () => { try{ const d = JSON.parse(rd.result); if(d.app !== 'LIFT') throw 0;
        const n = d.version >= 3 ? (d.workouts||[]).length : (d.logs||[]).length;
        modal(`<h2>${t('Restore backup?')}</h2><p class="mut">${t('The backup from {d} has {n} workouts. It is merged with what is in the app now – nothing is lost.', {d: d.exported ? dkLong(d.exported) : t('an unknown date'), n:`<b>${n}</b>`})}</p>
          <div class="grid2"><button class="btn" onclick="closeModal()">${t('Cancel')}</button><button class="btn pri" id="doImp">${t('Restore')}</button></div>`);
        $('#doImp').onclick = () => {
          if(d.version >= 3){ mergeRemote(d); if(d.profile) Object.assign(S.profile, Object.fromEntries(SYNC_PROFILE.filter(k => k in d.profile).map(k => [k, d.profile[k]]))) }
          else { const keep = S; migrateV2(d); const migrated = S; S = keep; mergeRemote(migrated) }
          S.profile.pu = Date.now(); save(); closeModal(); toast(t('Backup restored')); go('train') };
      }catch(e){ toast(t('That file is not a valid LIFT backup')) } };
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
    const tp = TEMPLATES.find(x => x.id === tmpl[i%3]), start = now - (24-i)*2.3*DAY;
    upsert('workouts', {id:newId(), start, end:start + (45+Math.random()*20)*60000, name:t(tp.name), ex:tp.ex.map(([id,s,r]) => { const x = exInfo(id), base = x.t==='w' ? ({bench:50,deadlift:80,squat_bb:60,ohp:30,row_bb:45,rdl:60,legpress:100}[id] || 12) : r;
      return {id, sets:Array.from({length:s}, () => ({kg: x.t==='w' ? Math.round((base + i*0.6)*2)/2 : 0, reps: x.t==='w' ? r : r + Math.floor(i/4), done:true}))} })});
  }
  for(let d = 0; d < 14; d++){ const day = dayKey(now - d*DAY);
    [['Oats with milk','Breakfast',450,22,60,12],['Chicken & rice','Lunch',650,45,75,15],['Skyr','Snacks',180,24,12,1],['Salmon & potatoes','Dinner',700,40,55,30]].forEach(([n,m,k,p,c,f]) =>
      S.food.push(touch({id:newId(), date:day, meal:m, name:t(n), quick:{kcal:k + Math.round(Math.random()*80-40), p, c, f}}))) }
  for(let d = 0; d < 8; d++) S.body.push(touch({id:newId(), d:now - (56-d*7)*DAY, kg:Math.round((78 - d*0.3)*10)/10}));
  if(!S.goals.some(g => !g.done)){
    upsert('goals', {id:newId(), type:'weight', start:78, target:75, created:now - 56*DAY, deadline:now + 40*DAY, done:null});
    upsert('goals', {id:newId(), type:'lift', exId:'bench', reps:1, start:50, target:80, created:now - 50*DAY, deadline:now + 60*DAY, done:null});
    upsert('goals', {id:newId(), type:'lift', exId:'pullup', reps:1, start:3, target:12, created:now - 50*DAY, deadline:null, done:null});
  }
  S.workouts.sort((a,b) => a.start - b.start); markAllDirty(); save(); toast(t('Sample data loaded')); go('train');
}

/* ---------- Premium ---------- */
function openPremium(from){ premFrom = from || ''; track('premium-view'); if(from) track('premium-click-' + from); go('premium') }
SCREENS.premium = app => {
  const yes = ic('check'), no = '<span class="no">—</span>', active = S.profile.premium && S.profile.premium.source === 'stripe';
  app.innerHTML = `<div class="wrap">
    ${header(`<button class="iconbtn back" onclick="go(prevView || 'train')" aria-label="${t('Back')}">${ic('chevL')}</button><h1>Premium</h1>`, '')}
    ${active ? buyHTML() : ''}
    <div class="hero"><span class="pill">${ic('crown')} LIFT Premium</span>
      <h2 style="margin-top:12px">${t('Train smarter. Eat smarter.')}</h2>
      <p class="mut">${t('Everything in Free, plus the tools that show you what’s working.')}</p></div>
    <div class="card"><table class="cmp"><tr><th></th><th>${t('Free')}</th><th>Premium</th></tr>
      <tr><td>${t('Workout log with last-time numbers')}</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>${t('Routines, templates & history')}</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>${t('Calorie tracking')}</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>${t('Saved to your account')}</td><td>${yes}</td><td>${yes}</td></tr>
      <tr><td>${t('Stats, strength curves & records')}</td><td>${no}</td><td>${yes}</td></tr>
      <tr><td>${t('Barcode scanning')}</td><td>${no}</td><td>${yes}</td></tr>
      <tr><td>${t('Protein, carbs & fat')}</td><td>${no}</td><td>${yes}</td></tr>
      <tr><td>${t('Vitamins & minerals (zinc, magnesium …)')}</td><td>${no}</td><td>${yes}</td></tr>
      <tr><td>${t('Export to spreadsheet')}</td><td>${no}</td><td>${yes}</td></tr></table></div>
    ${active ? '' : plansHTML()}
    ${active ? '' : (payEnabled() ? buyHTML() : waitlistHTML())}
  </div>`;
};
function plansHTML(){
  return `<button class="plan ${plan==='year'?'on':''}" onclick="plan='year';render()" aria-pressed="${plan==='year'}"><span class="tag">${t('Save 40%')}</span>
      <div class="row between wrapf"><div><b>${t('Yearly')}</b><div class="small mut">${t('Just {p} per month', {p:Math.round(CONFIG.priceYear/12) + ' ' + CONFIG.currency})}</div></div><div class="price">${CONFIG.priceYear} ${CONFIG.currency}<span class="small mut"> ${t('/yr')}</span></div></div></button>
    <button class="plan ${plan==='month'?'on':''}" onclick="plan='month';render()" aria-pressed="${plan==='month'}">
      <div class="row between wrapf"><div><b>${t('Monthly')}</b><div class="small mut">${t('Cancel anytime')}</div></div><div class="price">${CONFIG.priceMonth} ${CONFIG.currency}<span class="small mut"> ${t('/mo')}</span></div></div></button>`;
}
function buyHTML(){
  const p = S.profile.premium;
  if(p && p.source === 'stripe') return `<div class="card how"><h3>${ic('crown','sm')} ${t('You have Premium')}</h3>
    <p class="small">${p.plan==='year'?t('Yearly plan'):t('Monthly plan')} · ${t(p.status==='trialing' ? 'free trial until {d}' : p.cancel ? 'ends {d}' : 'renews {d}', {d:`<b>${dkLong(p.until)}</b>`})}</p>
    <button class="btn block" onclick="openPortal()" ${acct.busy?'disabled':''}>${t('Manage subscription')}</button></div>`;
  return acct.user ? `<button class="btn pri block" style="margin-top:6px" onclick="startCheckout()" ${acct.busy?'disabled':''}>${acct.busy?t('Opening secure payment…'):t('Start {n}-day free trial', {n:CONFIG.trialDays})}</button>
      <p class="xs mut center">${t('Then {p}. Cancel anytime before the trial ends and you pay nothing. Secure payment by Stripe.', {p: plan==='year' ? CONFIG.priceYear+' '+CONFIG.currency+' '+t('per year') : CONFIG.priceMonth+' '+CONFIG.currency+' '+t('per month')})}</p>
      <p class="xs mut center">${t('By starting the trial you accept our {l}.', {l:legalLinks()})}</p>
      <p class="xs mut center">${t('Signed in as {e}', {e:esc(acct.user.email)})}</p>`
    : `<div class="card"><h3>${ic('user','sm')} ${t('Sign in to start')}</h3>${loginHTML(t('Sign in with your email to start your free trial. No password – we email you a link.'))}</div>`;
}
function waitlistHTML(){
  const w = S.profile.waitlist, interest = S.profile.interest;
  return `${interest ? `<div class="card how center"><b class="neon">${t('Thanks for your interest!')}</b><p class="small mut">${t('Premium isn’t open yet. Join the waitlist below to be the first to know – and get {n} days free.', {n:CONFIG.trialDays})}</p></div>`
      : `<button class="btn pri block" style="margin-top:6px" onclick="S.profile.interest={plan,at:new Date().toISOString(),from:premFrom};lsSave();track('trial-click-'+plan);render()">${t('Try free for {n} days', {n:CONFIG.trialDays})}</button>`}
    <div class="card"><h3>${ic('mail','sm')} ${t('Waitlist')}</h3>
      ${w ? `<p class="small">${t('Thanks for signing up! We’ll let you know when Premium opens.')}</p>`
        : CONFIG.waitlistUrl ? `<p class="small mut">${t('Get notified when Premium opens.')}</p><a class="btn block" href="${esc(CONFIG.waitlistUrl)}" target="_blank" rel="noopener" onclick="S.profile.waitlist={at:new Date().toISOString()};lsSave();track('waitlist-click')">${t('Join the waitlist')}</a>` : ''}
    </div>
    <p class="xs mut center">${t('You won’t be charged. Payments are not switched on yet.')}</p>
    <p class="xs mut center">${legalLinks()}</p>`;
}
