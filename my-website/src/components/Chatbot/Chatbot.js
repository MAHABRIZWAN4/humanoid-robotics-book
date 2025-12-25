import React, { useState, useEffect, useRef } from 'react';
import ChatbotButton from './ChatbotButton';
import ChatbotModal from './ChatbotModal';
import styles from './Chatbot.module.css';

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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = { text: '', sender: 'bot' };
      let firstChunk = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        botMessage.text += chunk;

        if (firstChunk) {
          setMessages((prevMessages) => [...prevMessages, botMessage]);
          firstChunk = false;
        } else {
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = botMessage;
            return newMessages;
          });
        }
      }
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
