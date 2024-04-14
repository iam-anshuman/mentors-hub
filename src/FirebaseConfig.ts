// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3pPxssgM_eQaXqlHXt1Yw_5ZmtRPCrGk",
  authDomain: "mentorhub-639b2.firebaseapp.com",
  projectId: "mentorhub-639b2",
  storageBucket: "mentorhub-639b2.appspot.com",
  messagingSenderId: "591667234683",
  appId: "1:591667234683:web:613aafb11786183a55dfde",
  measurementId: "G-7W42TT1MPW"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth,db};