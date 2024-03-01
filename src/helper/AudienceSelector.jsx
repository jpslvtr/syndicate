import React, { useState } from 'react';
import FolderTree, { testData } from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';

const AudienceSelector = ({ onSelectionChange }) => {
  const [treeState, setTreeState] = useState(testData);

  const onTreeStateChange = (state, event) => {
    setTreeState(state);
    // Optionally, process the selection change
    onSelectionChange(state);
  };

  return (
    <FolderTree
      data={treeState}
      onChange={onTreeStateChange}
    />
  );
};

export default AudienceSelector;