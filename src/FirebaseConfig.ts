// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfAn3u7njE3DHvdyAoi1qQk68px-HzqbQ",
  authDomain: "mentors-hub-27945.firebaseapp.com",
  projectId: "mentors-hub-27945",
  storageBucket: "mentors-hub-27945.appspot.com",
  messagingSenderId: "319908857871",
  appId: "1:319908857871:web:6cf3f87a5765b247fd3b7a"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth,db};