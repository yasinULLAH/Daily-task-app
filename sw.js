            // --- Service Worker Content (to be saved as sw.js) ---
        // This content needs to be in a separate file named `sw.js` in the same directory
        // as your `index.html` for service worker to work.
        const SW_JS_CONTENT = `
// sw.js (Service Worker)

const CACHE_NAME = 'daftar-munazzam-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    'https://raw.githubusercontent.com/urduhack/Jameel-Noori-Nastaleeq-Font/master/Jameel%20Noori%20Nastaleeq.ttf',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js',
    // Add other assets like icons, manifest.json if you create them
    '/manifest.json',
    '/icon-192x192.png' // Replace with your actual icon path
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // Found in cache
                }
                return fetch(event.request); // Not found, fetch from network
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName); // Delete old caches
                    }
                })
            );
        })
    );
});

self.addEventListener('push', (event) => {
    const data = event.data.json();
    console.log('Push received:', data);
    const options = {
        body: data.body,
        icon: data.icon || '/icon-192x192.png', // Fallback icon
        badge: data.badge || '/icon-192x192.png', // Fallback badge
        vibrate: [100, 50, 100],
        data: {
            url: data.url || self.location.origin // Open app URL on click
        }
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
        `;
        // --- End Service Worker Content ---

        // Create and save sw.js dynamically