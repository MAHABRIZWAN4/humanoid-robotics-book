import React from 'react';
import styles from './Chatbot.module.css';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.bot}`}>
      <p>{message.text}</p>
    </div>
  );
};

export default ChatMessage;
