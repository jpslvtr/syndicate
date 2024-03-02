// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyBL2a_yKaMNh3idQ3lpE8ZtEfALlL9fkxI",
    authDomain: "syndicate-3b716.firebaseapp.com",
    projectId: "syndicate-3b716",
    storageBucket: "syndicate-3b716.appspot.com",
    messagingSenderId: "1015060173288",
    appId: "1:1015060173288:web:275aff743a268a72d2945d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

