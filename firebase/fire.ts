// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEJWZoExVQyqQdxG7o2inesQmUTxlgsvo",
  authDomain: "huddle-shad.firebaseapp.com",
  projectId: "huddle-shad",
  storageBucket: "huddle-shad.appspot.com",
  messagingSenderId: "645242224331",
  appId: "1:645242224331:web:53f1ee261c5c960082a54e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);