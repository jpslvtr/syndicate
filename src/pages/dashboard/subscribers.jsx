import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config'; // Adjust the path as necessary
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Card, CardBody, Typography } from "@material-tailwind/react";

export function Subscribers() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroupsAndUsers = async () => {
      const groupsSnapshot = await getDocs(collection(db, 'groups'));
      const groupsData = await Promise.all(groupsSnapshot.docs.map(async (doc) => {
        const group = { ...doc.data(), id: doc.id };
        const usersQuery = query(collection(db, 'users'), where('groupId', '==', group.groupId));
        const usersSnapshot = await getDocs(usersQuery);
        const users = usersSnapshot.docs.map(userDoc => userDoc.data());
        return { ...group, users };
      }));
      setGroups(groupsData);
    };

    fetchGroupsAndUsers();
  }, []);

  return (
    <div className="mt-12">
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left card occupying 2/3 of the space */}
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {groups.map(group => (
              <div key={group.groupId} className="mb-4">
                <Typography variant="h6" color="blue-gray" className="mb-2 px-6 pt-6">{group.groupName}</Typography>
                <table className="w-full min-w-[640px] table-auto">
                  <thead>
                    <tr>
                      <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">Name</Typography>
                      </th>
                      <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">Group Name</Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.users.map((user, index) => (
                      <tr key={index}>
                        <td className="py-3 px-5">{user.name || user.email}</td>
                        <td className="py-3 px-5">{group.groupName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Right card remaining empty */}
        <Card className="xl:col-span-1 border border-blue-gray-100 shadow-sm">
          {/* Content for the right card if needed */}
        </Card>
      </div>
    </div>
  );
}

