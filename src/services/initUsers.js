import { db } from '../../firebase-config.js';
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase-config.js';

const registerUserWithAuth = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error registering user with auth:", error);
        return null;
    }
};

const generateHash = (userId) => {
    // Define an array of allowed ASCII character codes based on the specified ranges
    const allowedCharCodes = [
        33, ...Array.from({ length: (38 - 35 + 1) }, (_, i) => i + 35),
        ...Array.from({ length: (43 - 42 + 1) }, (_, i) => i + 42),
        45, ...Array.from({ length: (57 - 48 + 1) }, (_, i) => i + 48),
        ...Array.from({ length: (91 - 59 + 1) }, (_, i) => i + 59),
        ...Array.from({ length: (95 - 93 + 1) }, (_, i) => i + 93),
        ...Array.from({ length: (126 - 98 + 1) }, (_, i) => i + 98),
    ];

    let hash = '';
    for (let i = 0; i < 4; i++) {
        // Use the userId to generate an index for the allowedCharCodes array
        const charCode = userId.charCodeAt(i % userId.length);
        const index = charCode % allowedCharCodes.length;
        const hashCharCode = allowedCharCodes[index];
        hash += String.fromCharCode(hashCharCode);
    }
    return hash;
};

const createUser = async (email, name) => {
    const defaultPassword = "password"; 
    const userAuth = await registerUserWithAuth(email, defaultPassword);
    if (!userAuth) {
        return null; // Stop if the user couldn't be registered
    }

    await addDoc(collection(db, 'users'), {
        email,
        name,
        uidPublic: generateHash(userAuth.uid), // Use Auth UID for uidPublic generation
    });

    return userAuth.uid; // Return the Auth UID
};

const createUsersAndAssignRelations = async () => {
    // Define users and their email addresses
    const users = [
        { email: 'a0@gmail.com', name: 'Alice' },
        { email: 'a1@gmail.com', name: 'Bob' },
        { email: 'a2@gmail.com', name: 'Charles' },
        { email: 'a3@gmail.com', name: 'Diana' },
        { email: 'b0@gmail.com', name: 'Fiona' },
        { email: 'b1@gmail.com', name: 'George' },
        { email: 'b2@gmail.com', name: 'Hannah' },
        { email: 'c0@gmail.com', name: 'Ian' },
        { email: 'c1@gmail.com', name: 'Julie' },
    ];

    // Create users and store uidPublic values
    for (const user of users) {
        await createUser(user.email, user.name);
    }
};

createUsersAndAssignRelations()
    .then(() => console.log('Users have been created'))
    .catch((error) => console.error('Failed to create users:', error));


