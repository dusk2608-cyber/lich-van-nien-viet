const CACHE_NAME = "van-ky-lich-viet-v1";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/lunar-calendar.js",
  "./js/weather.js",
  "./js/app.js",
  "./assets/bg-painting.jpg",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // Không cache các API thời tiết & geocoding trực tuyến
  if (
    url.hostname.includes("open-meteo.com") ||
    url.hostname.includes("bigdatacloud.net") ||
    url.hostname.includes("nominatim.openstreetmap.org")
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Với file nội bộ: Cache-first kết hợp cập nhật nền (Stale-While-Revalidate)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        const networkFetch = fetch(request)
          .then(res => {
            if (res && res.status === 200) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
  }
});
