// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

//1. get SDK
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRk4y86aVyBnvwntAFQRsmX7kgpezNJvc",
  authDomain: "nextfire-e69f8.firebaseapp.com",
  projectId: "nextfire-e69f8",
  storageBucket: "nextfire-e69f8.appspot.com",
  messagingSenderId: "578976220952",
  appId: "1:578976220952:web:5482506ad45701f688c06d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//export sdks
export const firestore = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();
