import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Chat from './components/Chat';
import CarCard from './components/CarCard';
import DealDetails from './components/DealDetails';
import Questionnaire from './components/Questionnaire';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzingCarId, setAnalyzingCarId] = useState(null);
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle user message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = {
      type: 'user',
      content: inputValue
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Call /chat API
      const response = await fetch('https://wyrbh3p649.execute-api.us-east-1.amazonaws.com/Dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: inputValue })
      });

      const data = await response.json();
      
      // Parse the response - handle nested JSON structure
      let parsedResponse;
      if (typeof data.body === 'string') {
        const bodyJson = JSON.parse(data.body);
        parsedResponse = JSON.parse(bodyJson.response);
      } else {
        parsedResponse = data;
      }

      // Add assistant message (summary)
      const assistantMessage = {
        type: 'assistant',
        content: parsedResponse.summary
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Store recommendations
      if (parsedResponse.recommendations) {
        setRecommendations(parsedResponse.recommendations);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error calling /chat API:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
      setLoading(false);
    }
  };

  // Handle car selection with AI analysis
  const handleSelectCar = async (car) => {
    try {
      setAnalyzingCarId(car.car_name);
      setLoading(true);
      
      // Call /deal API with AI analysis
      const response = await fetch('https://j1xz6xo2ua.execute-api.us-east-1.amazonaws.com/Dev/analyze-deal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
      });

      const deal = await response.json();
      setSelectedDeal(deal);
      setAnalyzingCarId(null);
      setLoading(false);
    } catch (error) {
      console.error('Error calling /deal API:', error);
      setAnalyzingCarId(null);
      setLoading(false);
    }
  };

  // Handle questionnaire submission
  const handleQuestionnaireSubmit = async (answers) => {
    // Create initial prompt from questionnaire answers
    const initialPrompt = `I'm looking for a car with the following requirements:
- Budget: ${answers.budget}
- Type: ${answers.carType}
- Brand preference: ${answers.brand}
- Condition: ${answers.condition}
- Fuel type: ${answers.fuel}

Please recommend the best cars that match my requirements.`;

    // Mark questionnaire as completed
    setQuestionnaireCompleted(true);
    setLoading(true);

    try {
      // Add user message to chat
      const userMessage = {
        type: 'user',
        content: initialPrompt
      };
      setMessages([userMessage]);

      // Call /chat API with questionnaire data
      const response = await fetch('https://wyrbh3p649.execute-api.us-east-1.amazonaws.com/Dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: initialPrompt })
      });

      const data = await response.json();
      
      // Parse the response - handle nested JSON structure
      let parsedResponse;
      if (typeof data.body === 'string') {
        const bodyJson = JSON.parse(data.body);
        parsedResponse = JSON.parse(bodyJson.response);
      } else {
        parsedResponse = data;
      }

      // Add assistant message (summary)
      const assistantMessage = {
        type: 'assistant',
        content: parsedResponse.summary
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Store recommendations
      if (parsedResponse.recommendations) {
        setRecommendations(parsedResponse.recommendations);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error calling /chat API:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
      setLoading(false);
    }
  };

  // Show questionnaire if not completed
  if (!questionnaireCompleted) {
    return <Questionnaire onSubmit={handleQuestionnaireSubmit} />;
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Car Advisor</h1>
        <p>Find your perfect car with AI recommendations</p>
      </div>

      <div className="app-layout">
        {/* Chat Section */}
        <div className="chat-section">
          <Chat 
            messages={messages} 
            messagesEndRef={messagesEndRef}
          />
          
          {/* Input Form */}
          <form className="message-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about cars, budget, features..."
              className="message-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Send'}
            </button>
          </form>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="recommendations-section">
            <h2>Recommended Cars</h2>
            <div className="cars-grid">
              {[...recommendations].sort((a, b) => b.best_value - a.best_value).map((car, index) => (
                <CarCard 
                  key={index} 
                  car={car}
                  onSelect={handleSelectCar}
                  isBestValue={car.best_value}
                  isAnalyzing={analyzingCarId === car.car_name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Deal Details Section */}
      {selectedDeal && (
        <DealDetails 
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
        />
      )}
    </div>
  );
}

export default App;
