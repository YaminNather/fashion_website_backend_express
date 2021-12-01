import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore"

const firebaseOptions: FirebaseOptions = {
  apiKey: "AIzaSyC8cFEWdBKXQVScLdraISZ6Dp7U-TimpH0",
  authDomain: "sample-ecommerce-website-5a291.firebaseapp.com",
  projectId: "sample-ecommerce-website-5a291",
  storageBucket: "sample-ecommerce-website-5a291.appspot.com",
  messagingSenderId: "481442209484",
  appId: "1:481442209484:web:f533d42f8d959cab38ac69",
  measurementId: "G-306GSKXF5K"
};

const firebaseApp: FirebaseApp = initializeApp(firebaseOptions);

export const firestore: Firestore = getFirestore(firebaseApp);