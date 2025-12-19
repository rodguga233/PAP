importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAE21F1-D0rMoaRXroolMbNGO6ZJIZAutc",
  authDomain: "bd---pap.firebaseapp.com",
  projectId: "bd---pap",
  messagingSenderId: "547650190043",
  appId: "1:547650190043:web:4d3746264d32d00999eafe"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(({ notification }) => {
  self.registration.showNotification(notification.title, {
    body: notification.body
  });
});
