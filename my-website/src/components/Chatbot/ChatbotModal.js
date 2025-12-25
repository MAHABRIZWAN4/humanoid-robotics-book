import React from 'react';
import ChatMessage from './ChatMessage';
import styles from './Chatbot.module.css';

const ChatbotModal = ({ messages, input, setInput, handleSendMessage, isLoading, error, messagesEndRef, closeChat }) => {
  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <h3>Humanoid Robotics Expert</h3>
        <button onClick={closeChat} className={styles.closeButton}>×</button>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <div className={styles.loadingIndicator}>
            <span>Thinking...</span>
          </div>
        )}
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatbotModal;
