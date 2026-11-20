// Golden Gate OS v3 · offline shell for same-origin static assets
const CACHE_NAME='golden-gate-os-v3-20261120-2';
const ASSETS=['./','./index.html','./styles/main.css','./styles/experiences.css','./js/os.js','./js/experiences.js','./js/games.js','./manifest.webmanifest','./assets/favicon.svg'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('golden-gate-os-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,c)).catch(()=>{})}return r}).catch(()=>caches.match(request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,c)).catch(()=>{})}return r})));
});
