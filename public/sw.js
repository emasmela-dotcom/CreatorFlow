// Service Worker for CreatorFlow PWA
const CACHE_NAME = 'creatorflow-v2'
// Do not cache auth pages (signup, signin) - they must always hit network to avoid ERR_FAILED / stale doc
const urlsToCache = [
  '/',
  '/dashboard',
  '/create',
  '/manifest.json'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - navigation (full page) always tries network first to avoid cached failure for /signup etc.
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    )
    return
  }
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

