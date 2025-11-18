const CACHE = "weather-static-v4";
const ASSETS = [
  "./",
  "index.html",
  "app.js",
  "style.css",
  "icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if (url.origin.includes("api.openweathermap.org")) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          caches.open(CACHE).then(cache => cache.put(event.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    )
  );
});
