import React, { useState, useEffect } from 'react';
import Chatbot from './Chatbot'; // Adjust path if necessary based on your Docusaurus theme structure

function Root({ children }) {
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        setSelectedText(selection.toString());
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);

    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
    };
  }, []);

  return (
    <>
      {children}
      <Chatbot selectedTextFromPage={selectedText} />
    </>
  );
}

export default Root;
