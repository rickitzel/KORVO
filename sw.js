/* Korvo · service worker: la app funciona sin conexión y se actualiza sola cuando hay internet. */
const V='korvo-v4',CORE=[
'./','index.html','manifest.webmanifest',
'icon-192.png','icon-512.png','icon-maskable-512.png'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res})
  .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):Response.error()))))});
