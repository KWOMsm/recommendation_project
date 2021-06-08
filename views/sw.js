/*
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('main-store').then((cache) => cache.addAll([
            '/',
            '/index.ejs',
            '/test.js',
            '/main.ejs',
            '/assets/css/main.css',
            '/images/logo2.png',
        ])),
    );
});
*/
self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request)),
    );
});