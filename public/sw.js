/* Beldar Build HQ service worker — hand-rolled, no dependencies.
 * Pages: network-first, falling back to cache (works in a garage with bad Wi-Fi).
 * Hashed build assets: cache-first. Everything else same-origin: stale-while-revalidate.
 * User data never passes through here — it lives in localStorage/IndexedDB.
 */
const VERSION = "v1";
const PAGES = `beldar-pages-${VERSION}`;
const ASSETS = `beldar-assets-${VERSION}`;
const PRECACHE = ["/", "/survival", "/halloween", "/guide", "/build", "/materials", "/cone-lab", "/makeup", "/troubleshooting", "/safety", "/rehearsal", "/wardrobe", "/settings", "/log", "/research", "/print", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGES).then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(new Request(url, { cache: "reload" }))))).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("beldar-") && k !== PAGES && k !== ASSETS).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch (err) {
    const hit = (await cache.match(request, { ignoreVary: true })) || (fallbackUrl && (await cache.match(fallbackUrl)));
    if (hit) return hit;
    throw err;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSETS);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(ASSETS);
  const hit = await cache.match(request);
  const fresh = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => hit);
  return hit || fresh;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, PAGES, "/"));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
  } else if (request.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) {
    event.respondWith(networkFirst(request, PAGES));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});
