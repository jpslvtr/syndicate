import React, { useState } from 'react';
import { Input, Button, List, ListItem } from '@material-tailwind/react';

export function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const performSearch = (e) => {
    e.preventDefault();
    // Perform the search using the searchQuery state
    // For example, filter the subscribers list or make an API call
    // Update the searchResults state with the results
  };

  return (
    <div className="search-container">
      <br/>
      <form onSubmit={performSearch}>
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Users..."
        />
        <br/>
        <Button type="submit">Search</Button>
      </form>
      <List>
        {searchResults.map((result) => (
          <ListItem key={result.id}>
            {result.email} - {result.group}
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Search;