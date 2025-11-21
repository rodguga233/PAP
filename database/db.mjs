import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {config } from "dotenv"; config({silent: true});
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId } = process.env;

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