// React imports
import React, { useState, useEffect } from 'react';

// Firebase imports
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase-config';
import { collection, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

// Material Tailwind components
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Progress,
  Switch,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
  Typography,
} from "@material-tailwind/react";

// Heroicons
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

// React Router DOM
import { Link } from "react-router-dom";

// Local data and widgets
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";

export function Profile() {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState({ name: '', uidPublic: '', bio: '' });
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setBio(userDocSnap.data().bio || '');
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleBioUpdate = async (newBio) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { bio: newBio });
      setBio(newBio); // Update local state
    }
  };

  // Define the action for the Tooltip to toggle the editing mode
  const editAction = (
    <Tooltip content="Edit Profile">
      <PencilIcon
        className="h-4 w-4 cursor-pointer text-blue-gray-500"
        onClick={() => setIsEditing(!isEditing)}
      />
    </Tooltip>
  );


  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {profileData.name} {/* Display the user's name */}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  {profileData.uidPublic} {/* Display the user's public ID */}
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value="app">
                <TabsHeader>
                  <Tab value="app">
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    App
                  </Tab>
                  <Tab value="message">
                    <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                    Message
                  </Tab>
                  <Tab value="settings">
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Settings
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
            <ProfileInfoCard
              title="Profile Information"
              description={
                isEditingBio ? (
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    onBlur={async () => {
                      if (user) {
                        const userDocRef = doc(db, 'users', user.uid);
                        await updateDoc(userDocRef, { bio: bio });
                        setIsEditingBio(false); // Exit editing mode after update
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <p>{bio}</p> // Display the bio text when not editing
                )
              }
              action={
                <Tooltip content="Edit Profile">
                  <PencilIcon
                    className="h-4 w-4 cursor-pointer text-blue-gray-500"
                    onClick={() => setIsEditingBio(true)} // Enter editing mode
                  />
                </Tooltip>
              }
            />
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Platform Settings
              </Typography>
              <ul className="flex flex-col gap-6">
                {conversationsData.map((props) => (
                  <MessageCard
                    key={props.name}
                    {...props}
                    action={
                      <Button variant="text" size="sm">
                        reply
                      </Button>
                    }
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Projects
            </Typography>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500"
            >
              Architects design houses
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {projectsData.map(
                ({ img, title, description, tag, route, members }) => (
                  <Card key={title} color="transparent" shadow={false}>
                    <CardHeader
                      floated={false}
                      color="gray"
                      className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                    >
                      <img
                        src={img}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    </CardHeader>
                    <CardBody className="py-0 px-1">
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {tag}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mt-1 mb-2"
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {description}
                      </Typography>
                    </CardBody>
                    <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                      <Link to={route}>
                        <Button variant="outlined" size="sm">
                          view project
                        </Button>
                      </Link>
                      <div>
                        {members.map(({ img, name }, key) => (
                          <Tooltip key={name} content={name}>
                            <Avatar
                              src={img}
                              alt={name}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white ${
                                key === 0 ? "" : "-ml-2.5"
                              }`}
                            />
                          </Tooltip>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                )
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
