import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card, CardBody, Button } from "@material-tailwind/react";
import { UsersIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid"; 
import AudienceSelector from '../../helper/AudienceSelector';

export function Newsletter() {
  const [newsletterContent, setNewsletterContent] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [showSelector, setShowSelector] = useState(false);

  const sendNewsletter = () => {
    // Logic to send the newsletter
    console.log('Sending newsletter to:', recipients);
  };

  const handleRecipientsChange = (selectedRecipients) => {
    setRecipients(selectedRecipients);
  };

  const selectAudience = () => {
    setShowSelector(!showSelector);
  };

  const editorStyles = {
    height: '500px',
  };

  // Add a container style to position the AudienceSelector absolutely
  const containerStyle = {
    position: 'relative', // This makes it the reference for the absolutely positioned AudienceSelector
    zIndex: 1, // Ensure the container is above other elements
  };

    // Add a style for the AudienceSelector to position it absolutely
    const audienceSelectorStyle = {
      position: 'absolute',
      top: '100%', // Position it right below the button
      left: 0,
      right: 0,
      zIndex: 2, // Higher z-index so it's above the textbox
    };  
  
    return (
      <div className="p-4">
        <Card>
          <CardBody className="flex flex-col gap-4">
            <div className="text-lg font-semibold">Create Newsletter</div>
            <div className="flex w-full">
              <Button
                color="black"
                className="flex-grow" // Use flex-grow for the "Select Audience" button to take up more space
                onClick={selectAudience}
              >
                <UsersIcon className="w-4 h-4 mr-2" />
                Select Audience
              </Button>
              <Button
                color="black"
                className="flex-none ml-2" // Use flex-none for the "Send" button to not grow and add margin-left for spacing
                onClick={sendNewsletter}
              >
                <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
            {showSelector && <AudienceSelector onSelectionChange={handleRecipientsChange} />}
            <div style={{ width: '100%' }}>
              <ReactQuill
                theme="snow"
                value={newsletterContent}
                onChange={setNewsletterContent}
                style={{ height: '500px' }}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  export default Newsletter;
  
  