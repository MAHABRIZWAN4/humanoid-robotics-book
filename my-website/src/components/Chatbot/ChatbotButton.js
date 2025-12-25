import React from 'react';
import styles from './Chatbot.module.css';

const ChatbotButton = ({ onClick }) => {
  return (
    <button className={styles.chatbotButton} onClick={onClick}>
      <img src="/img/Chatbot_button.png" alt="Chatbot" />
    </button>
  );
};

export default ChatbotButton;
