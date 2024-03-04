import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
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

    // Perform the search directly here
    const results = followers.filter((follower) =>
      follower.name.toLowerCase().includes(query.toLowerCase())
    );

    // Update the searchResults state with the filtered results
    setSearchResults(results);
  };

  const performSearch = (e) => {
    e.preventDefault();
    // Filter the followers list based on the search query
    const results = followers.filter((follower) =>
      follower.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Update the searchResults state with the filtered results
    setSearchResults(results);
  };

  
  useEffect(() => {
    const fetchUserDetails = async (userIds) => {
      const userDetails = await Promise.all(userIds.map(async (userId) => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
      }));
      return userDetails.filter(user => user !== null);
    };

    const fetchGroupsData = async () => {
      const userIdH = "2F6uNbw9o4hjAzNgy5I3";
      if (user) {
        try {
          const q = query(collection(db, 'groups'), where('userId', '==', userIdH));
          const querySnapshot = await getDocs(q);
          console.log("Query snapshot for groups:", querySnapshot); // Log 2
          if (querySnapshot.empty) {
            console.log("No groups found for user ID:", userIdH); // Log if no groups are found
          } else {
            const groupsData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            console.log("Fetched groups data:", groupsData); // Log the fetched groups data
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
          // Fetch followers
          const q = query(collection(db, 'users'), where('email', '==', user.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const followersData = await fetchUserDetails(userData.followers || []);
            const uniqueFollowers = followersData.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
            setFollowers(uniqueFollowers);
          }

          // Fetch groups
          await fetchGroupsData();
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);


  return (
    <div className="mt-12">
      <div className="flex mb-4 gap-6"> {/* Modified this line to use flex */}
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
                        {/* Dropdown Button */}
                        <button
                          className="text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
                          onClick={() => handleDropdown(user.id)}
                        >
                          <AdjustmentsHorizontalIcon className="h-5 w-5" />
                        </button>
                        {/* Dropdown Menu */}
                        {dropdownVisible === user.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                              <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="ml-3">Option with checkbox</span>
                              </label>
                              {/* ... other menu items */}
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
              <Typography variant="h5" className="mb-4">Groups</Typography>
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
                          {/* Assuming you want to display members here */}
                          {/* {group.members.join(', ')} */}
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

