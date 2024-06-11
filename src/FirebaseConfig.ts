// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDp5vTcEIG5qS4IgwKaCw0UMF89MuiXRKc",
  authDomain: "mentors-connect.firebaseapp.com",
  projectId: "mentors-connect",
  storageBucket: "mentors-connect.appspot.com",
  messagingSenderId: "956262261116",
  appId: "1:956262261116:web:390c6148bd905ab5b2c4f9"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth,db};