/* SOS PWA service worker — sürümü değiştirince önbellek yenilenir */
const V='sos-v2';
const CORE=['/','/index.html','/logo.webp','/logo-320.webp','/logo-120.webp','/favicon.png','/manifest.webmanifest','/icons/icon-192.png','/icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){ /* sayfa: önce ağ, çevrimdışıysa önbellek */
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put('/',c));return res}).catch(()=>caches.match('/')));return}
  if(u.origin===location.origin||u.host.includes('fonts.g')){ /* statik: önbellek, arkada güncelle */
    e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>hit);return hit||net}))}
});
