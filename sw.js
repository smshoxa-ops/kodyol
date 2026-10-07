// KodYol service worker: офлайн-режим для статических файлов сайта
const CACHE = "kodyol-v161";
const ASSETS = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "logo.png", "favicon.png", "ring-out.mp3", "ring-in.mp3"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Firebase, Google и любые сторонние запросы не трогаем (данные и вход всегда живые)
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith(".mp4")) return;
  if (/\.(apk|ipa)$/i.test(url.pathname)) return; // установочные файлы: напрямую, без кэша // видео: Safari требует Range-запросы, отдаём напрямую

  // Страницы: сначала сеть (свежая версия), при отсутствии интернета — из кэша
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req, { cache: "no-store" })
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("index.html", copy));
          return res;
        })
        .catch(() => caches.match("index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  // Остальные файлы: из кэша, если нет — сеть и запоминаем
  e.respondWith(
    caches.match(req).then((hit) =>
      hit ||
      fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
    )
  );
});

// Push-уведомления (FCM): показываем уведомление, когда приложение закрыто
self.addEventListener("push", (e) => {
  let j = {};
  try { j = e.data ? e.data.json() : {}; } catch (_) {}
  const d = j.data || j.notification || j;
  e.waitUntil(
    self.registration.showNotification(d.title || "FION", {
      body: d.body || "",
      icon: "icon-192.png",
      badge: "favicon.png",
      tag: d.tag || "kodyol-msg",
      renotify: true,
      vibrate: [80, 40, 80],
      data: { url: d.url || "./" }
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      return clients.openWindow(url);
    })
  );
});
