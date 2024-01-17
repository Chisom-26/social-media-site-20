// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "@firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdof8uTVoYf8QPdIHmYY6wit47jSXa4ZE",
  authDomain: "project-2-80192.firebaseapp.com",
  projectId: "project-2-80192",
  storageBucket: "project-2-80192.appspot.com",
  messagingSenderId: "984202104474",
  appId: "1:984202104474:web:5e1626db8f06f34cb61923",
  measurementId: "G-V3S0RNF73Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/*
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider("6LdrDiApAAAAAFLTaUO_BaCf5yNcvmeOEHAeFLaf"),
  isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
}); */
const analytics = getAnalytics(app);
export const db = getFirestore(app); 