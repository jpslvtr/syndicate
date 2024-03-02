import {
  ArrowUpIcon, EllipsisVerticalIcon, CheckCircleIcon, ClockIcon, ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon, HomeIcon, PencilIcon, UsersIcon, PaperAirplaneIcon
} from "@heroicons/react/24/solid";
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Avatar, Button, Card, CardBody, CardFooter, CardHeader, Chip, Progress, Switch,
  Tabs, TabsHeader, Tab, Tooltip, Typography, IconButton, Menu, MenuHandler,
  MenuList, MenuItem
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { StatisticsCard, ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  authorsTableData, platformSettingsData, projectsData, projectsTableData,
  conversationsData, statisticsCardsData, statisticsChartsData, ordersOverviewData
} from "@/data";
import AudienceSelector from '../../helper/AudienceSelector';
import { useNavigate } from "react-router-dom";

export function Newsletter() {
  const [newsletterContent, setNewsletterContent] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const navigate = useNavigate(); 
  
  const sendNewsletter = () => {
    // Logic to send the newsletter
    console.log('Sending newsletter to:', recipients);
  };

  const handleRecipientsChange = (selectedRecipients) => {
    setRecipients(selectedRecipients);
  };

  const selectAudience = () => {
    navigate('/dashboard/newsletter/audience');
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
                Newsletter
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
              <div style={{ width: '75%', paddingBottom: '75px' }}> {/* Added paddingBottom */}
                <ReactQuill
                  theme="snow"
                  value={newsletterContent}
                  onChange={setNewsletterContent}
                  style={{ height: '500px' }}
                />
              </div>
              <div className="flex w-3/4 justify-start mb-4"> {/* Adjusted for button alignment */}
                <Button
                  color="black"
                  className="flex-grow"
                  onClick={selectAudience}
                >
                  <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                  Choose Audience
                </Button>
              </div>
              <br />
              {showSelector && <AudienceSelector onSelectionChange={handleRecipientsChange} />}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Newsletter;
