import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// 👇 PASTE THE CONFIG OBJECT YOU COPIED FROM THE FIREBASE CONSOLE HERE
const firebaseConfig = {
  apiKey: "AIzaSyD1ectwVvDkSjfpdfrcIyAxg35dNZHKRIE",
  authDomain: "algotracker-13423.firebaseapp.com",
  projectId: "algotracker-13423",
  storageBucket: "algotracker-13423.firebasestorage.app",
  messagingSenderId: "795688595305",
  appId: "1:795688595305:web:fc056af4e01144fc6c97f8",
  measurementId: "G-SFFJGPS21Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firestore database instance so you can use it in your components
export const db = getFirestore(app);