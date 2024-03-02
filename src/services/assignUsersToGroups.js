// Import Firebase configuration and initialization (if not already initialized)
import { db } from '../firebase-config.js';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Function to create or update a user document
const createUser = async (userId, name, groupId) => {
    await setDoc(doc(db, 'users', userId), {
        userId,
        name,
        groupId
    });
};

// Function to create or update a group document and add members
const updateGroupMembers = async (user) => {

    const groupRef = doc(db, 'groups', user.groupId);

    // Update the group document
    await setDoc(doc(db, 'users', user.userId), {
        userId: user.userId,
        email: user.email,
        groupId: user.groupId,
        groupName: user.groupName,
    });

    await updateDoc(groupRef, {
        members: arrayUnion(user.userId)
    });
};

// Function to assign users to groups
const assignUsersToGroups = async () => {
    // Define your users and their groups
    const users = [
        { email: 'a0@gmail.com', userId: 'a0', groupId: 'group_a', groupName: 'Group A' },
        { email: 'a1@gmail.com', userId: 'a1', groupId: 'group_a', groupName: 'Group A' },
        { email: 'a2@gmail.com', userId: 'a2', groupId: 'group_a', groupName: 'Group A' },
        { email: 'a3@gmail.com', userId: 'a3', groupId: 'group_a', groupName: 'Group A' },
        { email: 'b0@gmail.com', userId: 'b0', groupId: 'group_b', groupName: 'Group B' },
        { email: 'b1@gmail.com', userId: 'b1', groupId: 'group_b', groupName: 'Group B' },
        { email: 'b2@gmail.com', userId: 'b2', groupId: 'group_b', groupName: 'Group B' },
        { email: 'c0@gmail.com', userId: 'c0', groupId: 'group_c', groupName: 'Group C' },
        { email: 'c1@gmail.com', userId: 'c1', groupId: 'group_c', groupName: 'Group C' },
    ];    // Loop through each user and update the database
    for (const user of users) {
        await setDoc(doc(db, 'users', user.userId), {
            userId: user.userId,
            email: user.email,
            groupId: user.groupId,
            groupName: user.groupName,
        });
        await updateGroupMembers(user); // Pass the 'user' object to the function
    }
};

// Run the function directly
assignUsersToGroups().then(() => console.log('Users have been assigned to groups.'))
    .catch((error) => console.error('Failed to assign users to groups:', error));

// Optionally, you can export the function if you plan to use it elsewhere
export default assignUsersToGroups;