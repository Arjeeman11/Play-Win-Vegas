import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrcKirva3JbojDoallhpyvhAsY6OS6cfM",
  authDomain: "play-win-vegas.firebaseapp.com",
  projectId: "play-win-vegas",
  storageBucket: "play-win-vegas.firebasestorage.app",
  messagingSenderId: "894751883552",
  appId: "1:894751883552:web:785dd45fdef55c88901745",
  measurementId: "G-NGC61J7RVY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
