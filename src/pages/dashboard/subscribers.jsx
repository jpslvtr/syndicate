import React, { useState } from 'react';
import { Button, Input, List, ListItem } from '@material-tailwind/react';

// Static data for demonstration purposes
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
    <div className="subscribers-container">
      <br/>
      <h2>Manage Subscribers</h2>
      <br/>
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
        <br/>
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
  );
}

export default Subscribers;
