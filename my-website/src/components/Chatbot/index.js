import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css'; // Using the new CSS module

// BotMessage component to render messages from the assistant
const BotMessage = ({ message }) => {
  // Check if the response is a RAG-only fallback
  const isFallback = message.text.includes("Could not generate a summary");

  return (
    <div className={`${styles.message} ${styles.bot}`}>
      {/* If it's not a fallback, show the primary answer. If it is, hide the redundant text. */}
      {!isFallback && <p>{message.text}</p>}
      
      {isFallback && (
        <span className={styles.fallbackLabel}>
          📘 Answered from textbook content
        </span>
      )}
      
      {/* The detailed answer should always be shown if it exists */}
      {message.detailed_answer && (
        <div className={styles.detailedAnswer}>
          {message.detailed_answer}
        </div>
      )}

      {message.source_references && message.source_references.length > 0 && (
        <div className={styles.sources}>
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

function Chatbot() {
  const [isOpen, setIsOpen] = useState(true); // Default to open for easier debugging
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Effect to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Main function to handle sending a message to the backend
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    console.log("User input:", input); // Log user input

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // API call to the FastAPI backend
      const backendUrl =
        typeof window !== "undefined"
          ? import.meta.env.VITE_RAILWAY_BACKEND_URL || "https://humanoid-robotics-book-production-dfba.up.railway.app"
          : "https://humanoid-robotics-book-production-dfba.up.railway.app"; // SSR fallback
      console.log("Backend URL:", backendUrl); // Log backend URL

      const requestBody = JSON.stringify({ question: input, selected_text: "" });
      console.log("Fetch request body:", requestBody); // Log fetch request body

      const response = await fetch(`${backendUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody, // Use the stored requestBody
      });

      console.log("Raw fetch response:", response); // Log raw response

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Parsed response:", data); // Log parsed response

      // Construct the bot message from the response
      const botMessage = {
        text: data.answer,
        detailed_answer: data.detailed_answer,
        sender: 'bot',
        source_references: data.source_references,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (err) {
      console.error('Chatbot error:', err); // Log full error with context
      setError('Failed to get a response. Please check your connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* The chatbot is now embedded directly and is always open */}
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <h3>Humanoid Robotics Expert</h3>
        </div>
        <div className={styles.chatMessages}>
          {messages.map((msg, index) =>
            msg.sender === 'user' ? (
              <div key={index} className={`${styles.message} ${styles.user}`}>
                <p>{msg.text}</p>
              </div>
            ) : (
              <BotMessage key={index} message={msg} />
            )
          )}
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
    </>
  );
}

export default Chatbot;
