import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

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

// Inicializar Firebase 11
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
