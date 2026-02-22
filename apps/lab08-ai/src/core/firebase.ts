import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTHA3ZyMKMRn6I72TTpEZtbuE3xQmR2Gc",
  authDomain: "lab06-expense-5e3c8.firebaseapp.com",
  projectId: "lab06-expense-5e3c8",
  storageBucket: "lab06-expense-5e3c8.firebasestorage.app",
  messagingSenderId: "548071625345",
  appId: "1:548071625345:web:3194a699dabbaaf5e93380"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);