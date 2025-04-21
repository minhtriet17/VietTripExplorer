// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import {getFirebase, getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "travelling-dispatch.firebaseapp.com",
  projectId: "travelling-dispatch",
  storageBucket: "travelling-dispatch.firebasestorage.app",
  messagingSenderId: "122690125278",
  appId: "1:122690125278:web:9f1d3ce6f1f686d81d314f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//export const db = getFirestore(app);