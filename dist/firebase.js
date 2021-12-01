"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const firebaseOptions = {
    apiKey: "AIzaSyC8cFEWdBKXQVScLdraISZ6Dp7U-TimpH0",
    authDomain: "sample-ecommerce-website-5a291.firebaseapp.com",
    projectId: "sample-ecommerce-website-5a291",
    storageBucket: "sample-ecommerce-website-5a291.appspot.com",
    messagingSenderId: "481442209484",
    appId: "1:481442209484:web:f533d42f8d959cab38ac69",
    measurementId: "G-306GSKXF5K"
};
const firebaseApp = app_1.initializeApp(firebaseOptions);
exports.firestore = firestore_1.getFirestore(firebaseApp);
