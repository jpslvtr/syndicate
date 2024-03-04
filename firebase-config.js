// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from 'firebase/functions';
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyBL2a_yKaMNh3idQ3lpE8ZtEfALlL9fkxI",
    authDomain: "syndicate-3b716.firebaseapp.com",
    projectId: "syndicate-3b716",
    storageBucket: "syndicate-3b716.appspot.com",
    messagingSenderId: "1015060173288",
    appId: "1:1015060173288:web:275aff743a268a72d2945d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

export { db, auth, functions };

