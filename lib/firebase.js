// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

//1. get SDK
import {
  getFirestore,
  limit,
  collection,
  query,
  where,
  getDocs,
  FieldValue,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

//toast
import toast from "react-hot-toast";

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
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

//functions
export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleAuthProvider);
  } catch (error) {
    toast.error("Error Sigining In");
    console.error(error.message);
  }
};

export const signOutUser = async () => {
  try {
    const res = await signOut(auth);
    res && toast.success("You're signed out");
  } catch (error) {
    toast.error("Error Signing Out");
    console.error(error.message);
  }
};

//Get user with username
export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));

  const res = await getDocs(q);

  let userDoc;
  res.forEach((doc) => (userDoc = doc));

  return userDoc;
}

export const serverTimestamp = FieldValue.serverTimestamp;

//export const increment = FieldValue.increment;
