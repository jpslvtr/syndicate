import React, { useEffect, useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase-config';
import { Card, CardBody, CardHeader, CardFooter, Avatar, Typography, Tabs, TabsHeader, Tab, Switch, Tooltip, Button, } from "@material-tailwind/react";
import { HomeIcon, ChatBubbleLeftEllipsisIcon, Cog6ToothIcon, PencilIcon, } from "@heroicons/react/24/solid";
import { ProfileInfoCard } from "@/widgets/cards";

export function Profile() {
  const [user, loading, error] = useAuthState(auth);
  const [profileData, setProfileData] = useState({ name: '', uidPublic: '', email: '', bio: '', mobile: '', location: '' });
  const [editMode, setEditMode] = useState({ bio: false, mobile: false, location: false });
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const inputRef = useRef(null); // Create a ref for the input
  const textareaRef = useRef(null); // Create a ref for the textarea
  const avatarPath = profileData.photo ? profileData.photo.replace('syndicate/public', '') : '';
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (user) {
        const q = query(collection(db, 'users'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          const followingIds = userData.following || [];
          const followingData = await Promise.all(followingIds.map(async (userId) => {
            const userDoc = await getDoc(doc(db, 'users', userId));
            return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
          }));
          setFollowing(followingData.filter(user => user !== null));
        }
      }
    };

    fetchFollowing();
  }, [user]);


  useEffect(() => {
    const fetchProfileData = async () => {
      if (loading) return;
      if (error) {
        console.error("Firebase auth error", error);
        return;
      }
      if (user) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setProfileData({
            name: userData.name,
            uidPublic: userData.uidPublic,
            email: userData.email,
            bio: userData.bio,
            mobile: userData.mobile,
            location: userData.location,
            photo: userData.photo ? userData.photo.replace('syndicate/public', '') : ''
          });
        }
      }
    };

    fetchProfileData();
  }, [user, loading, error]);



  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const handleSave = async (field, value) => {
    try {
      // Step 1: Query for the user document by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', user.email)); // Assuming `user.email` contains the user's email
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming there's only one document for each email
        const userDoc = querySnapshot.docs[0];
        const userDocRef = userDoc.ref;

        // Step 2: Update the document
        await updateDoc(userDocRef, {
          [field]: value,
        });

        console.log("Document successfully updated");
        setShowSaveConfirmation(true); // Show confirmation message
        setTimeout(() => setShowSaveConfirmation(false), 3000); // Hide after 3 seconds
      } else {
        console.log("No document found with the given email");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const renderEditableField = (field, value) => {
    const isBio = field === 'bio';
    return editMode[field] ? (
      <div className="flex items-start justify-between">
        {isBio ? (
          <textarea
            ref={textareaRef} // Use the ref here
            value={value}
            onChange={(e) => setProfileData({ ...profileData, [field]: e.target.value })}
            autoFocus
            onBlur={() => handleEdit(field)}
            className="w-full resize-none border rounded-md p-2 h-36" 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave(field, profileData[field]);
                handleEdit(field); // Toggle edit mode off
                textareaRef.current?.blur(); // Remove focus
              }
            }}
          />
        ) : (
          <input
            ref={inputRef} // Use the ref here
            type="text"
            value={value}
            onChange={(e) => setProfileData({ ...profileData, [field]: e.target.value })}
            autoFocus
            onBlur={() => handleEdit(field)}
            className="border rounded-md p-2 w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave(field, profileData[field]);
                handleEdit(field); // Toggle edit mode off
                inputRef.current?.blur(); // Remove focus
              }
            }}
          />
        )}
        <button onClick={() => handleSave(field, profileData[field])} className="ml-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">Save</button>
      </div>
    ) : (
      <div className="flex justify-between items-start w-full">
        <span className="flex-1">{value || 'Not set'}</span>
        <PencilIcon onClick={() => handleEdit(field)} className="h-5 w-5 cursor-pointer text-blue-gray-500" />
      </div>
    );
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="flex p-4">
          <div className="flex-1">
            <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-6">
                <Avatar
                  src={avatarPath}
                  alt="profile-picture"
                  size="xl"
                  variant="rounded"
                  className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                />
                <div>
                  <Typography variant="h5" color="blue-gray" className="mb-1">
                    {profileData.name}
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-600"
                  >
                    <b>Code</b>: {profileData.uidPublic}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3 w-full">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Field", "Value"].map((el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-5 w-1/3">About Me</td>
                    <td className="py-3 px-5 w-2/3">{renderEditableField('bio', profileData.bio)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5">Email</td>
                    <td className="py-3 px-5">{profileData.email}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5">Mobile</td>
                    <td className="py-3 px-5">{renderEditableField('mobile', profileData.mobile)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5">Location</td>
                    <td className="py-3 px-5">{renderEditableField('location', profileData.location)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5">Social</td>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-4">
                        <i className="fa-brands fa-facebook text-blue-700" />
                        <i className="fa-brands fa-twitter text-blue-400" />
                        <i className="fa-brands fa-instagram text-purple-500" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              {showSaveConfirmation && (
                <div className="text-sm text-green-500">Changes saved successfully!</div>
              )}
            </div>
          </div>
          <div className="flex-1" style={{ maxWidth: '500px', marginLeft: 'auto', marginRight: '25px' }}>
            <Card className="border border-blue-gray-100 shadow-sm">
              <CardBody>
                <Typography variant="h5" className="mb-4">Following</Typography>
                <table className="w-full">
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
                    </tr>
                  </thead>
                  <tbody>
                    {following.map((user) => (
                      <tr key={user.id}>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <Typography variant="small" color="blue-gray">
                            {user.name}
                          </Typography>
                        </td>
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <Typography variant="small" color="blue-gray">
                            {user.uidPublic}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;

