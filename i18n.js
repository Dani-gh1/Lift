/* LIFT – sprog (engelsk/dansk).
   Teksterne i appen skrives på engelsk og sendes gennem t('…'). Står teksten i DA herunder, vises den danske udgave.
   {n}, {a} osv. er pladsholdere, der udfyldes: t('{n} sets', {n:3}) → "3 sæt".
   Mangler en oversættelse, vises den engelske tekst – appen går ikke i stykker.
   Selve de danske tekster ligger i da.js. */
'use strict';

let LANG = 'en';
const DA = {};
function t(s, v){
  let out = (LANG === 'da' && DA[s]) || s;
  // {m:lc} = indsæt med lille begyndelsesbogstav (fx "Tilføj til frokost")
  if(v) out = out.replace(/\{(\w+)(:lc)?\}/g, (m, k, lc) => v[k] == null ? m : lc ? String(v[k]).charAt(0).toLowerCase() + String(v[k]).slice(1) : v[k]);
  return out;
}
const LOC = () => LANG === 'da' ? 'da-DK' : 'en-GB';
function detectLang(){ try{ return /^(da|nb|nn|no)\b/i.test(navigator.language || '') ? 'da' : 'en' }catch(_){ return 'en' } }
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
// Tal med dansk komma: 5,7 kg
const decSep = () => LANG === 'da' ? ',' : '.';
function addDA(obj){ Object.assign(DA, obj) }
// Danske tekniktrin pr. øvelse (fyldes i da.js)
const DA_CUES = {};
// Muskelgrupper har egen ordbog, fordi fx "Back" både er en muskel (Ryg) og en knap (Tilbage)
const DA_MUS = {};
const mus = m => (LANG === 'da' && DA_MUS[m]) || m;
