import React from 'react';
import styles from './Chatbot.module.css';

const OUT_OF_SCOPE_PHRASES = [
  "I can only assist with questions related to the book"
];

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className={`${styles.message} ${styles.user}`}>
        <p>{message.text}</p>
      </div>
    );
  }

  if (message.isGreeting) {
    return (
      <div className={`${styles.message} ${styles.bot}`}>
        <p>Assalamu Alaikum</p>
        <p>I am the AI RAG Chatbot for the book <i>Physical AI & Humanoid Robotics</i>.</p>
        <p>I can help you understand robotics concepts from this textbook.</p>
        <p>Please ask a book-related question😊.</p>
      </div>
    );
  }

  const isOutOfScope = OUT_OF_SCOPE_PHRASES.some(phrase => message.text.includes(phrase));
  if (isOutOfScope) {
    return (
      <div className={`${styles.message} ${styles.bot}`}>
        <p>{message.text}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.message} ${styles.bot}`}>
      {message.text && (
        <div>
          <strong>Summary:</strong>
          <p>{message.text}</p>
        </div>
      )}
      {message.detailed_answer && (
        <div>
          <strong>Detailed Answer:</strong>
          <p>{message.detailed_answer}</p>
        </div>
      )}
      {message.source_references && message.source_references.length > 0 && (
        <div>
          <strong>Sources:</strong>
          <ul>
            {message.source_references.map((src, index) => (
              <li key={index}>{src}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
