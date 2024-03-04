import { db } from '../../firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';

// Function to fetch and log documents from a Firestore collection
const logCollectionDocuments = async (collectionName) => {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    console.log(`Documents in '${collectionName}' collection:`);
    snapshot.forEach(doc => {
        console.log(`Document ID: ${doc.id}, Data: `, doc.data());
    });
};

// Function to log documents from multiple collections
const logDocumentsFromCollections = async () => {
    const collectionNames = ['users', 'groups']; // Specify your collection names here
    for (const collectionName of collectionNames) {
        await logCollectionDocuments(collectionName);
    }
};

logDocumentsFromCollections()
    .then(() => console.log('Finished logging documents.'))
    .catch((error) => console.error('Error logging documents:', error));