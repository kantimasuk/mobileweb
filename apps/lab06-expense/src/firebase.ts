// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTHA3ZyMKMRn6I72TTpEZtbuE3xQmR2Gc",
  authDomain: "lab06-expense-5e3c8.firebaseapp.com",
  projectId: "lab06-expense-5e3c8",
  storageBucket: "lab06-expense-5e3c8.firebasestorage.app",
  messagingSenderId: "548071625345",
  appId: "1:548071625345:web:748bef10327e43b1e93380"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);