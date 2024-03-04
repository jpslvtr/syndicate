import React, { useState, useEffect } from 'react';
import { projectsTableData, ordersOverviewData } from "@/data";
import { db, auth, functions } from '../../../firebase-config';
import { httpsCallable } from 'firebase/functions';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Typography, Card, CardHeader, CardBody, Button, Menu, MenuHandler, MenuList, MenuItem, Avatar } from "@material-tailwind/react";
import { useAuthState } from 'react-firebase-hooks/auth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import { useNavigate } from 'react-router-dom';
import { EllipsisVerticalIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon as ArrowNarrowRightIcon, ArrowLeftIcon as ArrowNarrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export function Home() {
  const [user] = useAuthState(auth);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('Select a group');
  const [groupMembers, setGroupMembers] = useState([]);
  const queryParams = new URLSearchParams(window.location.search);
  const post = queryParams.get('post');
  const [editorContent, setEditorContent] = useState('');
  const [users, setUsers] = useState([]);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleSendEmailTemp = async () => {
    // Show success message
    setShowSuccessMessage(true);

    // Wait for 3 seconds
    setTimeout(() => {
      // Hide success message
      setShowSuccessMessage(false);

      // Redirect to the home page
      navigate('/home'); // Update the path if necessary
    }, 1000);
  };

  const handleSendEmail = async () => {
    // Fetch the email addresses of the group members from Firestore
    const memberEmails = await Promise.all(groupMembers.map(async (memberId) => {
      const memberDocRef = doc(db, 'users', memberId);
      const memberDocSnap = await getDoc(memberDocRef);
      return memberDocSnap.exists() ? memberDocSnap.data().email : null;
    }));

    // Filter out any null values
    const validEmails = memberEmails.filter(email => email !== null);

    // Send the email using Firebase (see Step 2 for Firebase setup)
    // This is a placeholder for the Firebase email sending function
    sendEmailToGroupMembers(validEmails, editorContent, user.email);
  };

  // requires Blaze (pay-as-you-go) plan
  const sendEmailToGroupMembers = async (memberEmails, content, senderEmail) => {
    const sendEmailFunction = httpsCallable(functions, 'sendEmailToGroup');
    try {
      await sendEmailFunction({ memberEmails, content, senderEmail });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const ButtonWithIcon = ({ onClick, children, icon }) => {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
      >
        {icon === 'left' && <ArrowNarrowLeftIcon className="h-5 w-5" />}
        {children}
        {icon === 'right' && <ArrowNarrowRightIcon className="h-5 w-5" />}
        {icon === 'send' && <PaperAirplaneIcon className="h-5 w-5" />}
      </button>
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollectionRef = collection(db, 'users');
      const data = await getDocs(usersCollectionRef);
      const usersData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      const filteredUsers = usersData.filter(user => user.uidPublic !== '!zbp');
      setUsers(filteredUsers);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      if (user) {
        try {
          // Query the user document using the logged-in user's email
          const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
          const userQuerySnapshot = await getDocs(userQuery);
          if (!userQuerySnapshot.empty) {
            // Get the user's document ID
            const userDocId = userQuerySnapshot.docs[0].id;
            // Fetch the groups where the userId field matches the user's document ID
            const groupsRef = collection(db, 'groups');
            const groupsQuery = query(groupsRef, where('userId', '==', userDocId));
            const groupsSnapshot = await getDocs(groupsQuery);
            const groupsData = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setGroups(groupsData);
          } else {
            console.log('No user document found with the email:', user.email);
          }
        } catch (error) {
          console.error("Error fetching groups: ", error);
        }
      }
    };

    fetchGroups();
  }, [user]);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (selectedGroup !== 'Select a group') {
        const group = groups.find(g => g.groupName === selectedGroup);
        if (!group) return;
        const membersData = await Promise.all(group.members.map(async (memberId) => {
          const memberDocRef = doc(db, 'users', memberId);
          const memberDocSnap = await getDoc(memberDocRef);
          return memberDocSnap.exists() ? { id: memberDocSnap.id, ...memberDocSnap.data() } : null;
        }));
        setGroupMembers(membersData.filter(member => member !== null));
      }
    };

    fetchGroupMembers();
  }, [selectedGroup, groups]);

  useEffect(() => {
    // Create a style element and append it to the head of the document
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      .ql-toolbar.ql-snow {
        position: sticky;
        top: 0;
        z-index: 1000;
        background-color: white;
        border-left: none; /* Removes left border of the toolbar */
        border-right: none; /* Removes right border of the toolbar */
        border-top: 1px solid #ccc; /* Adjust as needed, adds top border to the toolbar */
      }

      .ql-container.ql-snow {
        border: none; /* Removes borders around the editor */
      }

      .ql-editor {
        padding-top: 20px; /* Adds spacing from the top of the editor to the text */
        padding-right: 20px; /* Adds spacing between the text and the vertical scrollbar */
        height: calc(100% - 42px); /* Adjust height to account for the toolbar height */
        overflow-y: auto; /* Enables vertical scrolling */
      }
    `;
    document.head.appendChild(style);

    // Optional: Clean up by removing the style element when the component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  return (
    <div className="mt-12">
      {post === 'h64YoZvDMb6Khc13j6jn' ? (
        <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm" style={{ height: '600px' }}>
            <CardBody>
              {showSuccessMessage && (
                <div className="text-sm text-green-500 text-right">Sent!</div>
              )}
              <div className="flex justify-between">
                <Button
                  icon="left"
                  color="lightBlue"
                  buttonType="filled"
                  size="regular"
                  rounded={false}
                  block={false}
                  iconOnly={false}
                  ripple="light"
                  className="mt-4 flex items-center"                  onClick={() => navigate('/dashboard/home')}
                >
                  <ArrowNarrowLeftIcon className="h-5 w-5 mr-2" /> Back
                </Button>
                <Button
                  color="lightBlue"
                  buttonType="filled"
                  size="regular"
                  rounded={false}
                  block={false}
                  iconOnly={false}
                  ripple="light"
                  className="mt-4 flex items-center"
                  // onClick={handleSendEmail} // ideally what happens
                  onClick={handleSendEmailTemp}
                >
                  Send to Stanford <ArrowNarrowRightIcon className="h-5 w-5 ml-2" />
                </Button>
              </div>
              <br/>
              <ReactQuill
                theme="snow"
                value={editorContent} 
                onChange={setEditorContent}
                style={{
                  height: '400px', // Set the fixed height for the editor
                  margin: '5px', // Add some space below the editor
                  overflowY: 'auto' // Enable vertical scrolling
                }}
              />
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm" style={{ height: '600px' }}>
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 flex items-center justify-between p-6"
            >
              <div>
                  <Typography variant="h5" className="mb-4">Groups</Typography>
              </div>
            </CardHeader>
              <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <Menu placement="bottom-start">
                  <MenuHandler>
                    <Button size="sm" className="mb-4 ml-6">
                      {selectedGroup}
                    </Button>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={() => setSelectedGroup('All users')}>all users</MenuItem>
                    {groups.map((group) => (
                      <MenuItem key={group.id} onClick={() => setSelectedGroup(group.groupName)}>
                        {group.groupName}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Button
                  size="sm"
                  className="mb-4 float-right mr-6 flex items-center"
                  onClick={() => window.location.href = '?post=h64YoZvDMb6Khc13j6jn'}
                >
                  Start Draft <ArrowNarrowRightIcon className="h-5 w-5 ml-2" />
                </Button>
                <table className="w-full min-w-[640px] table-auto">
                  <thead>
                    <tr>
                      {["name"].map(
                        (el) => (
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
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedGroup === 'All users' ? users : groupMembers).map((member, index) => (
                      <tr key={member.id || index}>
                        <td className={`py-3 px-5 ${index === (selectedGroup === 'All users' ? users : groupMembers).length - 1 ? "" : "border-b border-blue-gray-50"}`}>
                          <div className="flex items-center gap-4">
                            <Avatar src={member.photo.replace('syndicate/public', '')} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {member.name}
                            </Typography>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
          </Card>
      </div>
      )}
    </div>
  );
}

export default Home;