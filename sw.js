// LIFT service worker – virker offline
const CACHE = 'lift-v18';
const ASSETS = ['./', './index.html', './index.html?app', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon.svg', './terms.html', './privacy.html', './legal.css', './styles.css?v=18', './data.js?v=18', './i18n.js?v=18', './da.js?v=18', './core.js?v=18', './train.js?v=18', './food.js?v=18', './stats.js?v=18', './goals.js?v=18', './profile.js?v=18'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())) });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())) });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Netværk først (så opdateringer slår igennem), cache som fallback offline
  e.respondWith(fetch(e.request, {cache: 'no-cache'}).then(r => { const copy = r.clone(); if (r.ok && new URL(e.request.url).origin === location.origin) caches.open(CACHE).then(c => c.put(e.request, copy)); return r })
    .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('./index.html'))));
});
