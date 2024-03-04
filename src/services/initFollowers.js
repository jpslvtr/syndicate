// initFollowers.js
import { db } from '../../firebase-config.js';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Function to fetch uidPublic for all users
const fetchUidPublicMap = async () => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('name', '!=', ''));
    const querySnapshot = await getDocs(q);
    const uidPublicMap = {};
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        uidPublicMap[data.name] = doc.id;
    });
    return uidPublicMap;
};

const assignFollowersAndFollowing = async (uidPublicMap) => {
    // Define followers and following based on uidPublic
    const userRelations = {
        'Alice': { following: ['Bob', 'Charles'], followers: ['Diana'] },
        'Bob': { following: ['Alice'], followers: ['Alice', 'Charles', 'Diana'] },
        'Charles': { following: ['Diana'], followers: ['Alice', 'Bob'] },
        'Diana': { following: ['Alice', 'Bob'], followers: ['Charles'] },
        'Fiona': { following: ['George'], followers: ['Hannah'] },
        'George': { following: ['Fiona'], followers: ['Fiona', 'Hannah'] },
        'Hannah': { following: ['Fiona', 'George'], followers: ['George'] },
        'Ian': { following: ['Julie'], followers: ['Julie'] },
        'Julie': { following: ['Ian'], followers: ['Ian'] },
    };

    for (const [name, relations] of Object.entries(userRelations)) {
        const uidPublic = uidPublicMap[name];
        const userRef = doc(db, 'users', uidPublic);

        // Convert names to uidPublic for following and followers
        const followingUidPublic = relations.following.map(name => uidPublicMap[name]);
        const followersUidPublic = relations.followers.map(name => uidPublicMap[name]);

        // Update the user document with following and followers
        await updateDoc(userRef, {
            following: followingUidPublic,
            followers: followersUidPublic,
        });
    }
};

// Main function to run the script
const run = async () => {
    try {
        const uidPublicMap = await fetchUidPublicMap();
        await assignFollowersAndFollowing(uidPublicMap);
        console.log('Successfully assigned followers and following.');
    } catch (error) {
        console.error('Failed to assign followers and following:', error);
    }
};

run();