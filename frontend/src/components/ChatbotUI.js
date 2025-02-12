import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './ChatbotUI.css'; // Custom CSS for styling

const ChatbotUI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [postToTwitter, setPostToTwitter] = useState(false); // Track tweet preference

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: input,
        postToTwitter,
      });

      // Format the bot's response using Markdown
      const formattedResponse = response.data.reply
        ? `**Bot:**\n${response.data.reply}`
        : 'Sorry, I could not generate a response.';

      setMessages([...newMessages, { sender: 'bot', text: formattedResponse }]);
    } catch (error) {
      console.error('Error communicating with the backend:', error);
      setMessages([...newMessages, { sender: 'bot', text: '⚠️ Sorry, something went wrong.' }]);
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-header">Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
      </div>
      <div className="chat-controls">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div className="chat-options">
        {/* <label>
          <input
            type="checkbox"
            checked={postToTwitter}
            onChange={(e) => setPostToTwitter(e.target.checked)}
          />
          Post to Twitter
        </label> */}
      </div>
    </div>
  );
};

export default ChatbotUI;
