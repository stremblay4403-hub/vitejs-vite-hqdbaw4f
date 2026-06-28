const CACHE_NAME = 'tdv-images-v1';
const cachePromise = caches.open(CACHE_NAME); // ouvert UNE SEULE FOIS

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.destination !== 'image') return;

  event.respondWith(
    cachePromise.then(async (cache) => {
      const cached = await cache.match(req);
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
