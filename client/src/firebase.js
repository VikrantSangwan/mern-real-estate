// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-31ccb.firebaseapp.com",
  projectId: "mern-estate-31ccb",
  storageBucket: "mern-estate-31ccb.appspot.com",
  messagingSenderId: "821029866959",
  appId: "1:821029866959:web:91853c09d856897ac356ba",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
