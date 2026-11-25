// Guarda o app no celular para ele abrir sem sinal. Com sinal, sempre busca a versão mais nova.
const CACHE = 'black-corte-1-7-1-25-11-2026';
const ARQUIVOS = ['./', 'index.html', 'config.js', 'supabase.js', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png', 'icone-180.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const guardado = () => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'));
  const rede = fetch(e.request.url, { cache: 'no-cache' }).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(ch => ch.put(e.request, c)); } return r; });
  const demora = new Promise(ok => setTimeout(ok, 4000)).then(() => guardado()).then(r => r || rede);
  e.respondWith(Promise.race([rede.catch(() => guardado()), demora]));
});
