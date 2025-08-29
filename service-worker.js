// service-worker.js

// Cache का नाम और वर्ज़न सेट करें
const CACHE_NAME = 'weighing-calculator-v1';

// वे फाइलें जिन्हें ऑफलाइन सपोर्ट के लिए कैश करना है
const urlsToCache = [
  '/', // रूट डायरेक्टरी
  'index.html' // मुख्य HTML फाइल
];

// 1. Install Event: सर्विस वर्कर इंस्टॉल होने पर क्या करना है
self.addEventListener('install', (event) => {
  // waitUntil() यह सुनिश्चित करता है कि सर्विस वर्कर तब तक इंस्टॉल नहीं होगा
  // जब तक अंदर का कोड सफलतापूर्वक पूरा न हो जाए।
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        // बताई गई सभी फाइलों को Cache Storage में जोड़ें
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch Event: जब भी ऐप कोई रिसोर्स (जैसे फाइल, इमेज) मांगता है
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // पहले Cache में रिसोर्स ढूंढने की कोशिश करें
    caches.match(event.request)
      .then((response) => {
        // अगर रिसोर्स Cache में मिल जाता है, तो उसे वापस भेजें
        if (response) {
          return response;
        }
        // अगर Cache में नहीं मिलता है, तो नेटवर्क से उसे लाने की कोशिश करें
        return fetch(event.request);
      })
  );
});

// 3. Activate Event: पुराने Cache को साफ करने के लिए
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // केवल मौजूदा Cache को रखें
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // अगर कोई पुराना Cache है, तो उसे डिलीट कर दें
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
