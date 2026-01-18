const CACHE_VERSION = "v1.0.19";
const CACHE_NAME = `diktatorspiel-${CACHE_VERSION}`;

// Wichtig: Pfade exakt so wie sie im Projekt liegen!
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",

  // Background
  "./Desk.jpg",

  // App Icons
  "./icons/icon-192.png",
  "./icons/icon-512.png",

  "./icons/BuchNEU.png",
  "./icons/SchlossNEU.png",
  "./icons/HerzNEU.png",
  "./icons/GeldNEU.png",

"./sounds/Intro.mpeg",
"./sounds/Timer.wav",
"./sounds/MusikZwei.mpeg",
"./sounds/MusikDrei.mpeg",
"./sounds/MusikVier.mpeg",


  // Mascot (falls genutzt)
  "./icons/MundZuAugenAuf.png",
  "./icons/MundAufAugenAuf.png",
  "./icons/MundAufAugenZu.png",

  // Sounds (Game Over)
  "./sounds/FinanzenZuViel.wav",
  "./sounds/FinanzenZuWenig.wav",
  "./sounds/BildungZuViel.wav",
  "./sounds/BildungZuWenig.wav",
  "./sounds/SicherheitZuViel.wav",
  "./sounds/SicherheitZuWenig.wav",
  "./sounds/ZufriedenheitZuViel.wav",
  "./sounds/ZufriedenheitZuWenig.wav"
];

// Install: precache (mit Fallback, damit ein fehlendes Asset nicht alles killt)
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // addAll bricht komplett ab, wenn 1 Datei fehlt -> deshalb einzeln cachen
    await Promise.all(
      ASSETS.map(async (path) => {
        try {
          const res = await fetch(path, { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          await cache.put(path, res.clone());
        } catch (err) {
          // Nicht fatal: Service Worker soll trotzdem installieren
          console.warn("[SW] precache failed:", path, err);
        }
      })
    );

    self.skipWaiting();
  })());
});

// Activate: clean old caches + sofort übernehmen
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k.startsWith("diktatorspiel-") && k !== CACHE_NAME)
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// Fetch: cache-first, update in background (stabiler + kein Chrome-Edgecase)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // nur eigene Dateien + GET
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // Navigation (index) immer aus Cache bedienen, im Hintergrund aktualisieren
  const isNav = req.mode === "navigate" || (req.destination === "document");

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (isNav) {
      const cached = await cache.match("./index.html");
      // im Hintergrund updaten
      event.waitUntil(
        fetch("./index.html", { cache: "no-store" })
          .then((res) => res.ok && cache.put("./index.html", res.clone()))
          .catch(() => {})
      );
      return cached || fetch(req);
    }

    // normale Assets
    const cached = await cache.match(req);
    if (cached) {
      // Background update
      event.waitUntil(
        fetch(req)
          .then((res) => res.ok && cache.put(req, res.clone()))
          .catch(() => {})
      );
      return cached;
    }

    // not cached -> network -> cache
    try {
      const res = await fetch(req);
      if (res && res.ok) await cache.put(req, res.clone());
      return res;
    } catch (e) {
      // letzter Fallback: falls doch was im Cache ist (match war evtl. URL-Variant)
      const fallback = await cache.match(req, { ignoreSearch: true });
      if (fallback) return fallback;
      throw e;
    }
  })());
});
