import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Avatar, Button, Card, CardBody, CardFooter, CardHeader, Chip, Progress, Switch,
  Tabs, TabsHeader, Tab, Tooltip, Typography, IconButton, Menu, MenuHandler,
  MenuList, MenuItem, List, ListItem, Input
} from "@material-tailwind/react";
import {
  ArrowUpIcon, EllipsisVerticalIcon, CheckCircleIcon, ClockIcon, ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon, HomeIcon, PencilIcon, UsersIcon, PaperAirplaneIcon
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { StatisticsCard, ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  authorsTableData, platformSettingsData, projectsData, projectsTableData,
  conversationsData, statisticsCardsData, statisticsChartsData, ordersOverviewData
} from "@/data";
import AudienceSelector from '../../helper/AudienceSelector';

const initialSubscribers = [
  { id: 1, email: 'subscriber1@example.com', group: 'Group A' },
  { id: 2, email: 'subscriber2@example.com', group: 'Group B' },
  // Add more subscribers as needed
];

export function Subscribers() {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [newSubscriberEmail, setNewSubscriberEmail] = useState('');
  const [newSubscriberGroup, setNewSubscriberGroup] = useState('');

  const addSubscriber = () => {
    const newSubscriber = {
      id: subscribers.length + 1,
      email: newSubscriberEmail,
      group: newSubscriberGroup,
    };
    setSubscribers([...subscribers, newSubscriber]);
    setNewSubscriberEmail('');
    setNewSubscriberGroup('');
    // TODO: Integrate API call to add subscriber to backend here
  };

  return (
    <div className="mt-12">
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-3 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Subscribers
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 flex items-center">
            <div className="flex flex-col items-start w-full pl-4"> {/* Adjusted for left alignment and added padding-left */}
              <div className="flex w-3/4 justify-start mb-4"> {/* Adjusted for button alignment */}
                <div className="add-subscriber-form">
                  <Input
                    type="email"
                    value={newSubscriberEmail}
                    onChange={(e) => setNewSubscriberEmail(e.target.value)}
                    placeholder="Subscriber's email"
                  />
                  <Input
                    type="text"
                    value={newSubscriberGroup}
                    onChange={(e) => setNewSubscriberGroup(e.target.value)}
                    placeholder="Subscriber's group"
                  />
                  <br />
                  <Button onClick={addSubscriber}>Add Subscriber</Button>
                </div>
                <List>
                  {subscribers.map(subscriber => (
                    <ListItem key={subscriber.id}>
                      {subscriber.email} - {subscriber.group}
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Subscribers;
