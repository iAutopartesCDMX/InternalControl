// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
export const firebaseConfig = {
  // Paste your firebase config here
  apiKey: "AIzaSyAOl3nxwcajyeYKj993cJbyAJ7hoTdJ57E",
  authDomain: "mariana-autopartes.firebaseapp.com",
  projectId: "mariana-autopartes",
  storageBucket: "mariana-autopartes.appspot.com",
  messagingSenderId: "1018662012921",
  appId: "1:1018662012921:web:ef6a8af6c8210fafbbdf28",
  measurementId: "G-KSH7VE4EW8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);

