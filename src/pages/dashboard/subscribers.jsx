import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../../../firebase-config';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export function Subscribers() {
  const [user] = useAuthState(auth);
  const [followers, setFollowers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [groups, setGroups] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const handleDropdown = (userId) => {
    setDropdownVisible(dropdownVisible === userId ? null : userId);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const results = followers.filter((follower) =>
      follower.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
  };

  const performSearch = (e) => {
    e.preventDefault();
    const results = followers.filter((follower) =>
      follower.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  useEffect(() => {
    const fetchUserDetails = async (userIds) => {
      const userDetails = await Promise.all(userIds.map(async (userId) => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        console.log(`User Doc for userId ${userId}:`, userDoc.exists() ? userDoc.data() : 'Not found');
        const userData = userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;

        if (userData) {
          // Fetch group memberships for each user
          const groupQuery = query(collection(db, 'groups'), where('members', 'array-contains', userId));
          const groupSnapshot = await getDocs(groupQuery);
          const userGroups = groupSnapshot.docs.map(groupDoc => groupDoc.id);
          console.log(`Groups for userId ${userId}:`, userGroups);


          userData.groups = userGroups;
        }

        return userData;
      }));
      console.log('User Details before filtering:', userDetails);
      // return userDetails.filter(user => user !== null);
      return userDetails; // This will include all users, even if some are null

    };

    const fetchGroupsData = async () => {
      const userIdH = "2F6uNbw9o4hjAzNgy5I3";
      if (user) {
        try {
          const q = query(collection(db, 'groups'), where('userId', '==', userIdH));
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            console.log("No groups found for user ID:", userIdH);
          } else {
            const groupsData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            console.log('Fetched Groups Data:', groupsData);
            setGroups(groupsData);
          }
        } catch (error) {
          console.error("Error fetching groups data:", error);
        }
      }
    };

    const fetchUserData = async () => {
      if (user) {
        try {
          const q = query(collection(db, 'users'), where('email', '==', user.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log('Fetched User Data:', userData);
            const followersData = await fetchUserDetails(userData.followers || []);
            console.log('Followers Data before unique filter:', followersData);
            const uniqueFollowers = followersData.filter((v, i, a) =>
              v !== null && a.findIndex(t => t !== null && t.id === v.id) === i
            );
            console.log('Unique Followers:', uniqueFollowers);
            setFollowers(uniqueFollowers);
          }

          await fetchGroupsData();
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleGroupMembershipChange = async (userId, groupId, isChecked) => {
    const userRef = doc(db, 'users', userId);
    const groupRef = doc(db, 'groups', groupId);

    if (isChecked) {
      await updateDoc(userRef, {
        groups: arrayUnion(groupId)
      });
      await updateDoc(groupRef, {
        members: arrayUnion(userId)
      });
    } else {
      await updateDoc(userRef, {
        groups: arrayRemove(groupId)
      });
      await updateDoc(groupRef, {
        members: arrayRemove(userId)
      });
    }

    // Update the followers state to reflect the changes
    setFollowers(followers.map(follower => {
      if (follower.id === userId) {
        return {
          ...follower,
          groups: isChecked ? [...(follower.groups || []), groupId] : (follower.groups || []).filter(id => id !== groupId)
        };
      }
      return follower;
    }));

    // Update the groups state to reflect the changes
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: isChecked ? [...(group.members || []), userId] : (group.members || []).filter(id => id !== userId)
        };
      }
      return group;
    }));
    console.log('Updated Followers after group change:', followers);
    console.log('Updated Groups after group change:', groups);
  };


  return (
    <div className="mt-12">
      <div className="flex mb-4 gap-6">
        <div className="w-3/5">
          <Card className="overflow-y-auto h-[600px] border border-blue-gray-100 shadow-sm">
            <CardBody>
              <Typography variant="h5" className="mb-4">Followers</Typography>
              <div className="mb-4">
                <div className="w-1/2">
                  <form onSubmit={performSearch}>
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search Followers..."
                    />
                    <br />
                    <Button type="submit">Search</Button>
                  </form>
                </div>
              </div>

              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                        Name
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                        Public ID
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                        Actions
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(searchResults.length > 0 ? searchResults : followers).map((user) => (
                    <tr key={user.id}>
                      <td className="py-3 px-5 border-b border-blue-gray-50 flex items-center gap-4">
                        <img src={user.photo.replace('syndicate/public', '')} alt="Avatar" className="w-10 h-10 rounded-full" />
                        <Typography variant="small" color="blue-gray">
                          {user.name}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" color="blue-gray">
                          {user.uidPublic}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50 relative">
                        <button
                          className="text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
                          onClick={() => handleDropdown(user.id)}
                        >
                          <AdjustmentsHorizontalIcon className="h-5 w-5" />
                        </button>
                        {dropdownVisible === user.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                              {groups.map(group => (
                                <label key={group.id} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={(user.groups || []).includes(group.id)}
                                    onChange={(e) => handleGroupMembershipChange(user.id, group.id, e.target.checked)}
                                  />
                                  <span className="ml-3">{group.groupName}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
        <div className="flex-1" style={{ maxWidth: '500px', marginRight: '40px' }}>
          <Card className="border border-blue-gray-100 shadow-sm">
            <CardBody>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h5">Groups</Typography>
                <Button className="text-xs">+ Add Group</Button>
              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                        Group Name
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                        Members
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => (
                    <tr key={group.id}>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" color="blue-gray">
                          {group.groupName}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" color="blue-gray">
                          {group.members ? group.members.length : 0}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>

      </div>
    </div>
  );
}

export default Subscribers;
