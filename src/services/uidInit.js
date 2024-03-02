import { db } from '../firebase-config.js'; // Adjust the path as necessary
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const users = [
    { email: 'a0@gmail.com', uid: 'BR5MODOp4NUh9Bb7w6xR7kO5m8H3', groupId: 'group_a' },
    { email: 'a1@gmail.com', uid: 'vQJDf5oTQJVRtBDTdR0mpNAQ0mD2', groupId: 'group_a' },
    { email: 'a2@gmail.com', uid: 'aKs9FKddF5YC0rJ9Qhzj7VmnuRq1', groupId: 'group_a' },
    { email: 'a3@gmail.com', uid: 'h2k4hWSmMee8qVyaOByXBX5L50D3', groupId: 'group_a' },
    { email: 'b0@gmail.com', uid: 'HSBqdsn2hcZIPHA4cGfkqGwNeC92', groupId: 'group_b' },
    { email: 'b1@gmail.com', uid: '1a7QJTcXp0cvUSEuZZjyHNtvddu1', groupId: 'group_b' },
    { email: 'b2@gmail.com', uid: '5i2Z67EZpehkVV4UTXiaolRjSae2', groupId: 'group_b' },
    { email: 'c0@gmail.com', uid: 'kIl7PMoVQkQFctUbSK58t0Z091u2', groupId: 'group_c' },
    { email: 'c1@gmail.com', uid: 'cNlKuDGEW2cpGmpcY3pbhWKsQqm1', groupId: 'group_c' },
    // Add any additional users if necessary
];

const updateUsersAndGroups = async () => {
    for (const user of users) {
        // Update the user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            userId: user.uid,
            name: user.email.split('@')[0],
            groupId: user.groupId,
        });

        // Optionally, update the group document to include the user's UID in the members array
        const groupRef = doc(db, 'groups', user.groupId);
        await updateDoc(groupRef, {
            members: arrayUnion(user.uid)
        });
    }
};

updateUsersAndGroups()
    .then(() => console.log('Users and groups updated successfully'))
    .catch((error) => console.error('Error updating users and groups:', error));