import React from 'react';
import ChatMessage from './ChatMessage';
import './Chat.css';

function Chat({ messages, messagesEndRef }) {
  return (
    <div className="chat-container">
      {messages.length === 0 && (
        <div className="chat-empty-state">
          <h2>Welcome to Car Advisor</h2>
          <p>Tell me about your budget, preferences, or vehicle type to get started!</p>
        </div>
      )}
      
      <div className="messages-list">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default Chat;
