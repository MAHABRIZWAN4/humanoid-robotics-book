import React, { useState, useEffect, useRef } from 'react';
import ChatbotButton from './ChatbotButton';
import ChatbotModal from './ChatbotModal';
import styles from './Chatbot.module.css';

const GREETINGS = ["hi", "hello", "salam", "assalamu alaikum", "how are you"];

function Chatbot() {
  const backendUrl = "https://humanoid-robotics-book-production-dfba.up.railway.app";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatHistory');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const lowerCaseInput = input.toLowerCase().trim();

    if (GREETINGS.includes(lowerCaseInput)) {
      const greetingMessage = {
        sender: 'bot',
        isGreeting: true,
      };
      setMessages((prevMessages) => [...prevMessages, greetingMessage]);
      setInput('');
      return;
    }

    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input, selected_text: "" }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const botMessage = {
        text: data.answer,
        detailed_answer: data.detailed_answer,
        source_references: data.source_references,
        sender: 'bot',
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (err) {
      console.error('Chatbot error:', err);
      setError('Failed to get a response. Please check your connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <ChatbotButton onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <ChatbotModal
          messages={messages}
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          error={error}
          messagesEndRef={messagesEndRef}
          closeChat={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default Chatbot;
