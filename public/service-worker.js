/* eslint-disable no-restricted-globals */
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
  };

  event.waitUntil(self.registration.showNotification('Push Notification', options));
});
// Any other custom service worker logic can go here.
