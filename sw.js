// Offline-first: the app opens instantly from the cache, even on Wi-Fi without internet; updates download in the background.
const C='thn-v7',F=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
function fresh(req,key){return fetch(req,{cache:'no-store'}).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(C).then(x=>x.put(key,c))}return r})}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 if(r.mode==='navigate'||u.pathname.endsWith('/index.html')){e.respondWith(caches.match('./index.html').then(hit=>{const net=fresh(r,'./index.html').catch(()=>hit);if(hit){e.waitUntil(net.catch(()=>{}));return hit}return net}));return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(C).then(x=>x.put(r,c))}return res})))});
