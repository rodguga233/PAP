// Importar Firebase 8 (API compatível) 
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"; 
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"; 
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"; 
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"; 

const firebaseConfig = { 
    apiKey: "AIzaSyAE21F1-D0rMoaRXroolMbNGO6ZJIZAutc", 
    authDomain: "bd---pap.firebaseapp.com", 
    databaseURL: "https://bd---pap-default-rtdb.firebaseio.com", 
    projectId: "bd---pap", storageBucket: "bd---pap.firebasestorage.app", 
    messagingSenderId: "547650190043", appId: "1:547650190043:web:4d3746264d32d00999eafe", 
    measurementId: "G-QLM25C7TH9" 
}; 
    
// Inicializar Firebase (versão 8) 
firebase.initializeApp(firebaseConfig); 

// Exportar serviços (versão 8) 
export const auth = firebase.auth(); 
export const database = firebase.database(); 
export const messaging = firebase.messaging();