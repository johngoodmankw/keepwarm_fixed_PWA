// KeepWarm Service Worker
// Cache strategy:
//   cdn.jsdelivr.net  → Cache-first  (SVGs + manifest — pre-cache manifest on install)
//   document requests → Network-first, fall back to cache (app shell offline)
//   everything else   → Network-only (pass through)

const CDN_CACHE  = "kw-cdn-v1"
const APP_CACHE  = "kw-app-v1"
const MANIFEST_URL = "https://cdn.jsdelivr.net/gh/johngoodmankw/keep-warm/food-sketches-manifest.json"

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CDN_CACHE)
      .then((cache) => cache.add(MANIFEST_URL))
      .catch(() => {
        // Don't block install if CDN is unreachable on first load — localStorage fallback covers this
      })
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CDN_CACHE && k !== APP_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event

  // Only handle GET requests
  if (request.method !== "GET") return

  let url
  try { url = new URL(request.url) } catch { return }

  // Cache-first for all jsDelivr CDN assets (food sketch SVGs + manifest JSON)
  if (url.hostname === "cdn.jsdelivr.net") {
    event.respondWith(
      caches.open(CDN_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone())
            return response
          }).catch(() => cached ?? new Response("", { status: 503 }))
        })
      )
    )
    return
  }

  // Network-first for HTML document requests — gives offline app shell fallback
  if (request.destination === "document") {
    event.respondWith(
      caches.open(APP_CACHE).then((cache) =>
        fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone())
            return response
          })
          .catch(() => cache.match(request))
      )
    )
  }
})
