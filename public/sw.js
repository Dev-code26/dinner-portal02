self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  self.clients.claim();
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "",
      icon: data.icon || "/vite.svg",
      tag: data.tag || "dinner-update",
      renotify: false,
    })
  );
});
