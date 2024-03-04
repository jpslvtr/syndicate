import React from 'react';
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";

export function Overview() {
  return (
    <div className="mt-12">
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm" style={{ height: '600px' }}>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <Typography variant="h5" className="mb-4">Overview</Typography>
          </CardHeader>
          <CardBody className="px-4 py-2" style={{ marginLeft: '15px',  marginRight: '250px' }}>
            <Typography variant="paragraph" className="text-blue-gray-600">
              <strong>
                Syndicate was inspired by a conversation with a friend who missed Google Circles, where you could group friends and share content selectively. This concept didn't fully take off in 2011, as social networking was still in its infancy and people preferred sharing with everyone. But now, I find myself texting in group chats way more than I use Facebook. I think there's a slow shift towards more intimate and intentional communication.
                <br/><br/>
                I personally enjoy receiving updates from friends through email newsletters, finding them more authentic than social media posts. Syndicate users to subscribe to friends' lives and receive updates via email, or write newsletters for specific groups of subscribers. Unlike social media, this email-based system ensures that new subscribers can't access previous newsletters, offering a more private and controlled sharing experience.
              </strong>
            </Typography>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Overview;