import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyAE21F1-D0rMoaRXroolMbNGO6ZJIZAutc",
  authDomain: "bd---pap.firebaseapp.com",
  databaseURL: "https://bd---pap-default-rtdb.firebaseio.com",
  projectId: "bd---pap",
  storageBucket: "bd---pap.firebasestorage.app",
  messagingSenderId: "547650190043",
  appId: "1:547650190043:web:4d3746264d32d00999eafe",
  measurementId: "G-QLM25C7TH9"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);