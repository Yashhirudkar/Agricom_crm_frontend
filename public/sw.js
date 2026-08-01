self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  // URL to navigate to when notification is clicked
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, just focus it
        if ("focus" in client) {
          return client.focus().then(c => {
             // We can optionally navigate if needed, but standard practice is to just focus the app
          });
        }
      }
      // If not, then open the target URL in a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
