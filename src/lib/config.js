// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXBTJ1n8u9acz0YkY-kOx5M7JId9Y3iWo",
  authDomain: "bday-1.firebaseapp.com",
  projectId: "bday-1",
  storageBucket: "bday-1.appspot.com",
  messagingSenderId: "1016777664316",
  appId: "1:1016777664316:web:59db124d11f2398cace039",
  measurementId: "G-BJZRSK23LG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)