import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase-config';

export function Subscribers() {
  const [user] = useAuthState(auth);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async (userIds) => {
      const userDetails = await Promise.all(userIds.map(async (userId) => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
      }));
      return userDetails.filter(user => user !== null);
    };

    const fetchUserData = async () => {
      if (user) {
        // Use the email to query the user document instead of the auth UID
        const q = query(collection(db, 'users'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Assuming the first document is the correct user
          const userData = querySnapshot.docs[0].data();
          const userDocId = querySnapshot.docs[0].id;
          const followingData = await fetchUserDetails(userData.following || []);
          const followersData = await fetchUserDetails(userData.followers || []);
          setFollowing(followingData);
          setFollowers(followersData);
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="mt-12">
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {/* Followers Table */}
          <Card>
            <CardBody>
              <Typography variant="h5" className="mb-4">Followers</Typography>
              <table className="w-full">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', width: '50%' }}>Name</th>
                    <th style={{ textAlign: 'left', width: '50%' }}>Public ID</th>
                  </tr>
                </thead>
                <tbody>
                  {followers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.uidPublic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>

        {/* Empty right card occupying 1/3 of the space */}
          {/* Following Table */}
          <Card>
            <CardBody>
              <Typography variant="h5" className="mb-4">Following</Typography>
              <table className="w-full">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', width: '50%' }}>Name</th>
                    <th style={{ textAlign: 'left', width: '50%' }}>Public ID</th>
                  </tr>
                </thead>
                <tbody>
                  {following.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.uidPublic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
      </div>
    </div>
  );
}