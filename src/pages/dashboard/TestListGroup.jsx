import React from 'react';
import { List, ListItem, Card } from '@material-tailwind/react';

function TestListGroup() {
  return (
    <Card className="w-96">
      <List>
        <ListItem>Inbox</ListItem>
        <ListItem>Trash</ListItem>
        <ListItem>Settings</ListItem>
      </List>
    </Card>
  );
}

export default TestListGroup;
