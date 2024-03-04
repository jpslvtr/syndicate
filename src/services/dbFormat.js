import { db } from '../../firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';

const logCollectionDocuments = async (collectionName) => {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    console.log(`Documents in '${collectionName}' collection:`);
    snapshot.forEach(doc => {
        console.log(`Document ID: ${doc.id}, Data: `, doc.data());
    });
};

const logDocumentsFromCollections = async () => {
    const collectionNames = ['users', 'groups'];
    for (const collectionName of collectionNames) {
        await logCollectionDocuments(collectionName);
    }
};

logDocumentsFromCollections()
    .then(() => console.log('Finished logging documents.'))
    .catch((error) => console.error('Error logging documents:', error));