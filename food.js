/* LIFT – Mad: kalorier (gratis), stregkode-scanning + makro/mikronæringsstoffer (Premium) */
'use strict';

let foodDay = dayKey();
const NUTR = Object.fromEntries(NUTRIENTS.map(n => [n.k, n]));
const MICROS = NUTRIENTS.filter(n => !['p','c','f'].includes(n.k));

/* ---------- Mål ---------- */
function goals(){
  const p = S.profile, g = GOALS[p.goal] || GOALS.fit;
  let kcal = p.kcalGoal, auto = false;
  if(!kcal && p.weight && p.height && p.age && p.sex){
    const bmr = 10*p.weight + 6.25*p.height - 5*p.age + (p.sex === 'male' ? 5 : -161);
    kcal = Math.round((bmr * (p.activity || 1.55) + g.kcal) / 10) * 10; auto = true;
  }
  if(!kcal){ kcal = 2200; auto = true }
  const protein = p.proteinGoal || Math.round((p.weight || 70) * (p.goal === 'fat' ? 2 : 1.8));
  const fat = Math.round(kcal * 0.28 / 9);
  const carbs = Math.max(0, Math.round((kcal - protein*4 - fat*9) / 4));
  return {kcal, p:protein, f:fat, c:carbs, auto};
}

/* ---------- Udregning ---------- */
function totalsOf(e){
  const t = {kcal:0}; NUTRIENTS.forEach(n => t[n.k] = null);
  if(e.per100){ const f = (e.g || 0) / 100; Object.entries(e.per100).forEach(([k,v]) => { if(v != null) t[k] = v * f }) }
  else if(e.quick){ Object.assign(t, e.quick) }
  return t;
}
function dayTotals(day){
  const t = {kcal:0}, known = {}; NUTRIENTS.forEach(n => t[n.k] = 0);
  S.food.filter(e => e.date === day).forEach(e => { const x = totalsOf(e); t.kcal += x.kcal || 0; NUTRIENTS.forEach(n => { if(x[n.k] != null){ t[n.k] += x[n.k]; known[n.k] = true } }) });
  return {t, known};
}
function parseOFF(p){
  const n = p.nutriments || {}, per100 = {};
  let kcal = n['energy-kcal_100g']; if(kcal == null && n['energy_100g'] != null) kcal = n['energy_100g'] / 4.184;
  per100.kcal = kcal != null ? +kcal : null;
  NUTRIENTS.forEach(x => { const v = n[x.ff + '_100g']; per100[x.k] = v != null && v !== '' && !isNaN(v) ? +v * x.x : null });
  return {code:p.code, name:(p.product_name_da || p.product_name_en || p.product_name || 'Unnamed product').trim(), brand:(p.brands||'').split(',')[0].trim(), per100, serving: +p.serving_quantity || null};
}

/* ---------- Open Food Facts ---------- */
async function offFetch(path){
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 12000);
  try{ const r = await fetch(CONFIG.foodApi + path, {signal:ctl.signal}); if(!r.ok) throw new Error(r.status); return await r.json() }
  finally{ clearTimeout(t) }
}
const OFF_FIELDS = 'code,product_name,product_name_da,product_name_en,brands,nutriments,serving_quantity';
async function lookupBarcode(code){
  const mine = S.customFoods.find(f => f.code === code);
  if(mine) return mine;
  const d = await offFetch(`/api/v2/product/${encodeURIComponent(code)}.json?fields=${OFF_FIELDS}`);
  if(d && d.status === 1 && d.product){ const f = parseOFF({...d.product, code}); if(f.per100.kcal != null) return f }
  return null;
}
async function searchFoods(q){
  const mine = S.customFoods.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));
  const d = await offFetch(`/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=25&fields=${OFF_FIELDS}`);
  const found = (d.products || []).map(parseOFF).filter(f => f.per100.kcal != null && f.name);
  return [...mine, ...found];
}

/* ---------- Skærm ---------- */
SCREENS.food = app => {
  const g = goals(), {t, known} = dayTotals(foodDay), pr = isPremium();
  const left = Math.round(g.kcal - t.kcal), pct = Math.min(1, t.kcal / g.kcal);
  const isToday = foodDay === dayKey();
  const bar = (k, label, goal) => `<div class="mbar"><div class="row between xs"><b>${label}</b><span class="mut">${Math.round(t[k])} / ${goal} g</span></div><div class="track"><i style="width:${Math.min(100, t[k]/goal*100)}%"></i></div></div>`;
  app.innerHTML = `<div class="wrap">
    ${header(`<h1>Food</h1>`, syncChip())}
    <div class="daynav"><button class="iconbtn" onclick="shiftDay(-1)" aria-label="Previous day">${ic('chevL')}</button><b>${isToday ? 'Today' : weekday(foodDay + 'T12:00')}</b><button class="iconbtn" onclick="shiftDay(1)" aria-label="Next day" ${isToday?'disabled':''}>${ic('chevR')}</button></div>
    <div class="card kcal">
      <div class="ring" style="--p:${pct}"><div><b>${Math.abs(left)}</b><span class="xs mut">${left >= 0 ? 'kcal left' : 'kcal over'}</span></div></div>
      <div class="grow">
        <div class="row between small"><span class="mut">Goal</span><b>${g.kcal} kcal</b></div>
        <div class="row between small"><span class="mut">Eaten</span><b>${Math.round(t.kcal)} kcal</b></div>
        ${g.auto && !S.profile.weight ? `<button class="link xs" onclick="editTargets()">${ic('target','xs')} Set your personal goal</button>` : ''}
      </div>
    </div>
    ${pr ? `<div class="card">${bar('p','Protein',g.p)}${bar('c','Carbs',g.c)}${bar('f','Fat',g.f)}</div>`
      : lockedCard('Protein, carbs & fat', 'See your macros for every meal and day – and scan barcodes instead of typing.', 'macros')}
    ${MEALS.map(m => { const items = S.food.filter(e => e.date === foodDay && e.meal === m), kc = items.reduce((a,e) => a + (totalsOf(e).kcal||0), 0);
      return `<div class="card meal"><div class="row between"><h3 style="margin:0">${m}</h3><span class="small mut">${Math.round(kc)} kcal</span></div>
        ${items.map(e => { const x = totalsOf(e); return `<button class="fitem" onclick="editEntry('${e.id}')"><span class="grow"><b>${esc(e.name)}</b><span class="xs mut">${e.brand ? ' · ' + esc(e.brand) : ''}${e.g ? ' · ' + fmt(e.g,0) + ' g' : ''}${pr && x.p != null ? ` · P ${fmt(x.p,0)} C ${fmt(x.c,0)} F ${fmt(x.f,0)}` : ''}</span></span><span class="small">${Math.round(x.kcal||0)}</span></button>` }).join('')}
        <button class="btn sm block" style="margin-top:8px" onclick="addFood('${m}')">${ic('plus','sm')} Add food</button></div>` }).join('')}
    ${pr ? `<div class="card"><h3>Vitamins & minerals</h3><p class="xs mut" style="margin-top:0">% of daily reference intake. Only foods with this data count – many products don't list every vitamin.</p>
        ${MICROS.map(n => { const v = t[n.k], has = known[n.k]; return `<div class="mbar"><div class="row between xs"><span>${n.n}</span><span class="mut">${has ? fmt(v, v < 10 ? 1 : 0) + ' ' + n.u + (n.ri ? ` · ${Math.round(v/n.ri*100)}%` : '') : 'no data'}</span></div><div class="track ${['sugar','satfat','salt'].includes(n.k)?'warn':''}"><i style="width:${has && n.ri ? Math.min(100, v/n.ri*100) : 0}%"></i></div></div>` }).join('')}</div>`
      : lockedCard('Vitamins & minerals', 'Track zinc, magnesium, iron, vitamin D, fiber, sugar and more.', 'micros')}
  </div>`;
};
function shiftDay(d){ const x = new Date(foodDay + 'T12:00'); x.setDate(x.getDate() + d); if(dayKey(x) > dayKey()) return; foodDay = dayKey(x); render() }

/* ---------- Tilføj mad ---------- */
let addMeal = 'Snacks', addTab = 'search', searchRes = null, searchQ = '';
function defaultMeal(){ const h = new Date().getHours(); return h < 10 ? 'Breakfast' : h < 14 ? 'Lunch' : h < 20 ? 'Dinner' : 'Snacks' }
function addFood(meal, tab){ addMeal = meal || defaultMeal(); addTab = tab || addTab || 'search'; renderAdd() }
function recentFoods(){
  const seen = new Set(), out = [];
  for(let i = S.food.length - 1; i >= 0 && out.length < 20; i--){ const e = S.food[i], k = (e.code || '') + '|' + e.name; if(seen.has(k)) continue; seen.add(k); out.push(e) }
  return out;
}
function renderAdd(){
  stopScanner();
  const pr = isPremium(), tabs = [['search','Search','search'],['scan','Scan','scan'],['quick','Quick add','plus'],['recent','Recent','clock']];
  let body = '';
  if(addTab === 'search') body = `<form class="searchbox" onsubmit="doSearch(event)">${ic('search')}<input id="fq" class="txt" placeholder="e.g. skyr, oats, banana" value="${esc(searchQ)}" aria-label="Search food" enterkeyhint="search"><button class="btn sm pri">Search</button></form>
    <div id="sres">${searchRes === 'loading' ? `<p class="small mut center">Searching…</p>` : Array.isArray(searchRes) ? (searchRes.length ? searchRes.map((f,i) => `<button class="fitem" onclick="pickFound(${i})"><span class="grow"><b>${esc(f.name)}</b><span class="xs mut">${f.brand ? ' · ' + esc(f.brand) : ''}</span></span><span class="small">${Math.round(f.per100.kcal)}<span class="xs mut"> kcal/100g</span></span></button>`).join('') : `<p class="small mut center">Nothing found. Try another word – or use <b>Quick add</b>.</p>`) : `<p class="xs mut center">Food data from Open Food Facts.</p>`}</div>`;
  else if(addTab === 'scan') body = pr ? `<div class="scanbox"><video id="scanVideo" playsinline muted></video><div class="scanline"></div></div>
    <p class="small mut center" id="scanMsg">Point the camera at the barcode.</p>
    <form class="row" onsubmit="manualCode(event)"><input id="bc" class="txt grow" inputmode="numeric" placeholder="…or type the barcode number" aria-label="Barcode number"><button class="btn sm">Find</button></form>`
    : lockedCard('Scan barcodes', 'Scan any product with your camera and get calories, macros and vitamins instantly.', 'scan');
  else if(addTab === 'quick') body = `<form onsubmit="quickAdd(event)">
    <label class="small mut" for="qn">Name</label><input id="qn" class="txt" placeholder="e.g. Lunch at work" style="margin:6px 0 10px">
    <label class="small mut" for="qk">Calories (kcal)</label><input id="qk" class="txt" inputmode="decimal" required style="margin:6px 0 10px">
    ${pr ? `<div class="grid3">${[['qp','Protein g'],['qc','Carbs g'],['qf','Fat g']].map(([id,l]) => `<label><span class="xs mut">${l}</span><input id="${id}" class="txt" inputmode="decimal"></label>`).join('')}</div>` : `<p class="xs mut">${ic('lock','sm')} Protein, carbs & fat need Premium.</p>`}
    <button class="btn pri block" style="margin-top:12px">Add to ${addMeal}</button></form>`;
  else { const r = recentFoods(); body = r.length ? r.map((e,i) => `<button class="fitem" onclick="reAdd(${i})"><span class="grow"><b>${esc(e.name)}</b><span class="xs mut">${e.g ? ' · ' + fmt(e.g,0) + ' g' : ''}</span></span><span class="small">${Math.round(totalsOf(e).kcal||0)} kcal</span></button>`).join('') : `<p class="small mut center">Foods you add will show up here.</p>` }
  modal(`<div class="row between"><h2 style="margin:0">Add to ${addMeal}</h2>${closeBtn()}</div>
    <div class="chips" style="margin:8px 0">${MEALS.map(m => `<button class="chip ${addMeal===m?'on':''}" onclick="addMeal='${m}';renderAdd()">${m}</button>`).join('')}</div>
    <div class="tabs4">${tabs.map(([k,l,i]) => `<button class="${addTab===k?'on':''}" onclick="addTab='${k}';renderAdd()">${ic(i,'sm')}<span>${l}</span>${k==='scan' && !pr ? ic('lock','xs') : ''}</button>`).join('')}</div>
    ${body}`);
  if(addTab === 'scan' && pr) startScanner();
  if(addTab === 'search' && !Array.isArray(searchRes)) setTimeout(() => $('#fq')?.focus(), 50);
}
async function doSearch(e){
  e.preventDefault(); searchQ = $('#fq').value.trim(); if(!searchQ) return;
  searchRes = 'loading'; renderAdd(); track('food-search');
  try{ searchRes = await searchFoods(searchQ) }catch(err){ searchRes = null; toast('Could not reach the food database. Check your connection.') }
  if(addTab === 'search' && $('#modal .sheet')) renderAdd();
}
function pickFound(i){ portion(searchRes[i]) }
function reAdd(i){ const e = recentFoods()[i]; if(e.per100) portion({code:e.code, name:e.name, brand:e.brand, per100:e.per100, serving:e.g}); else { saveEntry({name:e.name, quick:{...e.quick}}); } }
function quickAdd(ev){
  ev.preventDefault(); const num = id => { const v = parseFloat(($('#'+id)?.value||'').replace(',','.')); return isNaN(v) ? null : v };
  const kcal = num('qk'); if(kcal == null) return toast('Enter calories');
  const q = {kcal}; if(isPremium()){ q.p = num('qp'); q.c = num('qc'); q.f = num('qf') }
  saveEntry({name:($('#qn').value.trim() || 'Quick add'), quick:q});
}
function saveEntry(e){
  const entry = Object.assign({id:newId(), date:foodDay, meal:addMeal}, e);
  upsert('food', entry); closeModal(); render(); toast(`Added to ${addMeal}`); track('food-add'); trackOnce('first-food');
}

/* ---------- Portion ---------- */
let portionFood = null;
function portion(f){
  portionFood = f; const g0 = f.serving || 100;
  modal(`<div class="row between"><div style="min-width:0"><h2 style="margin:0">${esc(f.name)}</h2>${f.brand ? `<span class="xs mut">${esc(f.brand)}</span>` : ''}</div>${closeBtn()}</div>
    <label class="small mut" for="pg" style="display:block;margin-top:12px">Amount (grams)</label>
    <div class="row" style="margin-top:6px"><input id="pg" class="txt grow" inputmode="decimal" value="${fmt(g0,0)}" oninput="portionPreview()">
    ${[50,100,150,250].map(n => `<button class="chip" onclick="$('#pg').value=${n};portionPreview()">${n}</button>`).join('')}</div>
    <div id="pprev" class="card" style="margin-top:12px"></div>
    <button class="btn pri block" onclick="addPortion()">Add to ${addMeal}</button>`);
  portionPreview();
}
function portionPreview(){
  const g = parseFloat(($('#pg').value||'').replace(',','.')) || 0, t = totalsOf({per100:portionFood.per100, g}), pr = isPremium();
  $('#pprev').innerHTML = `<div class="row between"><span>Calories</span><b class="neon">${Math.round(t.kcal||0)} kcal</b></div>
    ${pr ? ['p','c','f'].map(k => `<div class="row between small"><span class="mut">${NUTR[k].n}</span><span>${t[k] != null ? fmt(t[k]) + ' g' : '–'}</span></div>`).join('')
      + `<details style="margin-top:6px"><summary class="small neon" style="cursor:pointer">Vitamins & minerals</summary>${MICROS.map(n => `<div class="row between xs"><span class="mut">${n.n}</span><span>${t[n.k] != null ? fmt(t[n.k], 1) + ' ' + n.u : '–'}</span></div>`).join('')}</details>`
      : `<p class="xs mut" style="margin:6px 0 0">${ic('lock','sm')} Protein, carbs, fat & vitamins: <button class="link xs" style="padding:0;min-height:0" onclick="openPremium('portion')">Premium</button></p>`}`;
}
function addPortion(){
  const g = parseFloat(($('#pg').value||'').replace(',','.'));
  if(!g || g <= 0) return toast('Enter an amount');
  const f = portionFood; saveEntry({name:f.name, brand:f.brand || '', code:f.code || null, g, per100:f.per100});
}
function editEntry(id){
  const e = S.food.find(x => x.id === id), t = totalsOf(e);
  modal(`<div class="row between"><h2 style="margin:0">${esc(e.name)}</h2>${closeBtn()}</div>
    <p class="small mut">${e.meal} · ${Math.round(t.kcal||0)} kcal${e.g ? ' · ' + fmt(e.g,0) + ' g' : ''}</p>
    ${e.per100 ? `<label class="small mut" for="eg">Amount (grams)</label><input id="eg" class="txt" inputmode="decimal" value="${fmt(e.g,0)}" style="margin:6px 0 12px">
      <button class="btn pri block" onclick="updateGrams('${id}')">Save</button>` : ''}
    <div class="chips" style="margin:12px 0">${MEALS.map(m => `<button class="chip ${e.meal===m?'on':''}" onclick="moveMeal('${id}','${m}')">${m}</button>`).join('')}</div>
    <button class="btn block danger" onclick="removeItem('food','${id}');closeModal();render();toast('Removed')">${ic('trash')} Remove</button>`);
}
function updateGrams(id){ const e = S.food.find(x => x.id === id), g = parseFloat(($('#eg').value||'').replace(',','.')); if(!g) return toast('Enter an amount'); e.g = g; upsert('food', e); closeModal(); render() }
function moveMeal(id, m){ const e = S.food.find(x => x.id === id); e.meal = m; upsert('food', e); closeModal(); render() }

/* ---------- Stregkode-scanner (Premium) ---------- */
let scanStream = null, scanLoop = null, zxControls = null, scanBusy = false;
async function startScanner(){
  const v = $('#scanVideo'); if(!v) return;
  const msg = t => { const m = $('#scanMsg'); if(m) m.innerHTML = t };
  scanBusy = false;
  try{
    if('BarcodeDetector' in window){
      const det = new window.BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']});
      scanStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}, audio:false});
      v.srcObject = scanStream; await v.play();
      scanLoop = setInterval(async () => { if(scanBusy || v.readyState < 2) return; try{ const r = await det.detect(v); if(r[0]) onScan(r[0].rawValue) }catch(_){} }, 250);
    } else {
      const {BrowserMultiFormatReader} = await import('https://cdn.jsdelivr.net/npm/@zxing/browser@0.1.5/+esm');
      const reader = new BrowserMultiFormatReader();
      zxControls = await reader.decodeFromConstraints({video:{facingMode:'environment'}}, v, (res) => { if(res && !scanBusy) onScan(res.getText()) });
    }
  }catch(e){
    console.warn(e);
    msg(e && e.name === 'NotAllowedError' ? 'Camera access was blocked. Allow the camera for this site in your browser settings – or type the barcode below.' : 'The camera could not start. Type the barcode number below instead.');
  }
}
function stopScanner(){
  clearInterval(scanLoop); scanLoop = null;
  if(zxControls){ try{ zxControls.stop() }catch(_){} zxControls = null }
  if(scanStream){ scanStream.getTracks().forEach(t => t.stop()); scanStream = null }
}
async function onScan(code){
  if(scanBusy) return; scanBusy = true; vibrate(40); stopScanner();
  const m = $('#scanMsg'); if(m) m.textContent = `Found ${code} – looking it up…`;
  track('food-scan'); await findCode(code);
}
function manualCode(e){ e.preventDefault(); const c = $('#bc').value.replace(/\D/g,''); if(c.length < 6) return toast('Type the whole barcode number'); stopScanner(); findCode(c) }
async function findCode(code){
  try{ const f = await lookupBarcode(code); if(f) return portion(f); notFound(code) }
  catch(e){ toast('Could not reach the food database. Check your connection.'); scanBusy = false; if(addTab==='scan') renderAdd() }
}
function notFound(code){
  modal(`<div class="row between"><h2 style="margin:0">Product not found</h2>${closeBtn()}</div>
    <p class="small mut">Barcode ${esc(code)} isn't in the database yet. Add it from the label once – next time the scan finds it.</p>
    <label class="small mut">Name</label><input id="nfn" class="txt" style="margin:6px 0 10px">
    <p class="small mut" style="margin:0 0 6px">Per 100 g (from the label)</p>
    <div class="grid2">${[['nfk','Calories kcal'],['nfp','Protein g'],['nfc','Carbs g'],['nff','Fat g']].map(([id,l]) => `<label><span class="xs mut">${l}</span><input id="${id}" class="txt" inputmode="decimal"></label>`).join('')}</div>
    <button class="btn pri block" style="margin-top:12px" onclick="saveCustomFood('${esc(code)}')">Save product</button>`);
}
function saveCustomFood(code){
  const num = id => { const v = parseFloat(($('#'+id).value||'').replace(',','.')); return isNaN(v) ? null : v };
  const name = $('#nfn').value.trim(), kcal = num('nfk');
  if(!name || kcal == null) return toast('Add at least a name and calories');
  const per100 = {kcal}; NUTRIENTS.forEach(n => per100[n.k] = null); per100.p = num('nfp'); per100.c = num('nfc'); per100.f = num('nff');
  const f = {id:'f_' + newId(), code, name, brand:'', per100, serving:null};
  upsert('customFoods', f); portion(f);
}
