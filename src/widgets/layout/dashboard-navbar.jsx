import { useLocation, Link, useNavigate } from "react-router-dom"; 
import { Navbar, Typography, Button, IconButton, Breadcrumbs, Input, Menu, MenuHandler, MenuList, MenuItem, Avatar, } from "@material-tailwind/react"; import { UserCircleIcon, Cog6ToothIcon, BellIcon, ClockIcon, CreditCardIcon, Bars3Icon, } from "@heroicons/react/24/solid"; 
import { useMaterialTailwindController, setOpenConfigurator, setOpenSidenav, } from "@/context";
import React, { useState, useRef, useEffect } from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../../../firebase-config';

const handleSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const pathSegments = pathname.split("/").filter((el) => el !== "");
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Redirect to sign-in page or update state as necessary
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowDropdown(e.target.value.length > 0);
  };

  const handleViewAllResults = () => {
    // navigate(`/search?query=${searchQuery}`);
    navigate(`../../dashboard/search`);
    setShowDropdown(false); // Hide the dropdown
  };

  const formatSegment = (segment) => {
    // Custom formatting logic here. For example, replace dashes with spaces and capitalize.
    return segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); // Hide the dropdown
      }
    }

    // Attach the listener to the document
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const breadcrumbNames = {
    "/dashboard/home": "Home",
    "/dashboard/profile": "Profile",
    "/dashboard/newsletter": "Newsletter",
    "/dashboard/newsletter/audience": "Audience",
    "/dashboard/subscribers": "Subscribers",
    "/dashboard/search": "Search",
  };

  // Helper function to create breadcrumb items
  const createBreadcrumbItems = () => {
    const pathSegments = pathname.split("/").filter(el => el !== "");
    const breadcrumbItems = pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const name = breadcrumbNames[path] || segment.charAt(0).toUpperCase() + segment.slice(1);
      return { name, path };
    });

    // Special case for "Dashboard" to navigate to "/dashboard/home"
    if (breadcrumbItems.length > 0 && breadcrumbItems[0].name.toLowerCase() === "dashboard") {
      breadcrumbItems[0].path = "/dashboard/home";
    }

    return breadcrumbItems;
  };

  const breadcrumbItems = createBreadcrumbItems();

  return (
    <Navbar color="white" className="rounded-xl transition-all sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5" fullWidth blurred>
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs className="bg-transparent p-0 transition-all mt-1">
            {breadcrumbItems.map((breadcrumb, index) => (
              <Link key={index} to={breadcrumb.path}>
                <Typography variant="small" color="blue-gray" className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100">
                  {breadcrumb.name}
                </Typography>
              </Link>
            ))}
          </Breadcrumbs>
        </div>
        <div className="flex items-center">
          {/* <div className="relative mr-auto md:mr-4 md:w-56">
            <Input
              label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && (
              <div ref={dropdownRef} className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                <div className="py-1">
                  <button
                    onClick={handleViewAllResults}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View all results
                  </button>
                </div>
              </div>
            )}
          </div> */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          <Link to="/auth/sign-in">
            <Button
              onClick={handleSignOut}
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              Sign Out
            </Button>
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
          </Link>
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
