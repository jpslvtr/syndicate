import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
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
import { EllipsisVerticalIcon as EllipsisVerticalOutlineIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { StatisticsCard, ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  authorsTableData, platformSettingsData, projectsData, projectsTableData,
  conversationsData, statisticsCardsData, statisticsChartsData, ordersOverviewData
} from "@/data";
import AudienceSelector from '../../helper/AudienceSelector';
import { ArrowRightIcon as ArrowNarrowRightIcon, ArrowLeftIcon as ArrowNarrowLeftIcon } from '@heroicons/react/24/outline';

export function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const performSearch = (e) => {
    e.preventDefault();
    // Perform the search using the searchQuery state
    // For example, filter the subscribers list or make an API call
    // Update the searchResults state with the results
    setSearchResults([{ id: 1, email: "user@example.com", group: "Group A" }]);
  };

  // Extract the search query from the URL when the component mounts and perform the search
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    if (query) {
      performSearch(query);
    }
  }, [location]);

  return (
    <div className="mt-12">
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">

          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h5" className="mb-4">Search</Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 flex items-center">
            <div className="flex flex-col items-start w-full pl-4"> {/* Adjusted for left alignment and added padding-left */}
              <div className="flex w-3/4 justify-start mb-4">
                <form onSubmit={performSearch}>
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by email"
                    style={{ width: '500px' }}
                  />
                  <br />
                  <Button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Search
                    <ArrowNarrowRightIcon className="h-5 w-5 ml-2" style={{ marginLeft: '8px' }} />
                  </Button>
                </form>
                <List>
                  {searchResults.map((result) => (
                    <ListItem key={result.id}>
                      {result.email} - {result.group}
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

export default Search;
