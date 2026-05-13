import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Chat from './components/Chat';
import CarCard from './components/CarCard';
import DealDetails from './components/DealDetails';

import {
  QUESTIONS,
  REQUIRED_FIELDS
} from './config/questions';

import {
  mergeAnswers,
  getMissingFields,
  getNextQuestion
} from './utils/intakeHelpers';

import { quickExtract } from './utils/quickExtract';

// import { extractAnswersWithLLM } from '../services/extractAnswers';


function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzingCarId, setAnalyzingCarId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [hasGeneratedFirstRecommendation, setHasGeneratedFirstRecommendation] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          type: 'assistant',
          content:
            'Welcome to Car Advisor! Tell me what kind of vehicle you are looking for — budget, SUV/sedan/truck, preferred brand, fuel type, and whether you want new or used.'
        }
      ]);
    }
  }, []);

  // Handle user message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const userInput = inputValue;
    setInputValue('');

    // Add user message to chat
    const userMessage = {
      type: 'user',
      content: userInput
    };
    setMessages(prev => [...prev, userMessage]);

    // STEP 1 — Quick Extraction
    let extracted = quickExtract(userInput);

    // STEP 2 — Determine if LLM needed
    const quickMissing = getMissingFields(
      extracted,
      REQUIRED_FIELDS
    );

    // STEP 3 — Merge answers
    const updatedAnswers = mergeAnswers(
      answers,
      extracted
    );

    setAnswers(updatedAnswers);

    console.log('Updated Answers:', updatedAnswers);

    // STEP 4 — Check missing fields
    const missingFields = getMissingFields(
      updatedAnswers,
      REQUIRED_FIELDS
    );

    // STEP 5 — If complete -> call recommendation LLM
    if (missingFields.length === 0 && !hasGeneratedFirstRecommendation) {
      const consolidatedMessage = formatAnswersToString(updatedAnswers);
      await generateRecommendations(consolidatedMessage, true);
      setHasGeneratedFirstRecommendation(true);
      return;
    }

    // STEP 5b — If recommendations already generated, call API with user input
    if (hasGeneratedFirstRecommendation) {
      await generateRecommendations(userInput, false);
      return;
    }

    // STEP 6 — Ask next missing question
    const nextQuestion = getNextQuestion(
      updatedAnswers,
      REQUIRED_FIELDS,
      QUESTIONS
    );

    if (nextQuestion) {
      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content: nextQuestion.question
        }
      ]);
    }
  };

  // Format collected answers into a natural language string
  const formatAnswersToString = (answers) => {
    const parts = [];
    
    if (answers.budget) parts.push(`Budget: ${answers.budget}`);
    if (answers.carType) parts.push(`Car Type: ${answers.carType}`);
    if (answers.brand) parts.push(`Brand: ${answers.brand}`);
    if (answers.fuel) parts.push(`Fuel Type: ${answers.fuel}`);
    if (answers.condition) parts.push(`Condition: ${answers.condition}`);
    
    return parts.length > 0 
      ? `I'm looking for: ${parts.join(', ')}`
      : '';
  };  

  const generateRecommendations = async (
    data,
    isFirstCall = true
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        'https://wyrbh3p649.execute-api.us-east-1.amazonaws.com/Dev',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: data
          })
        }
      );

      const data_response = await response.json();

      let parsedResponse;

      if (typeof data_response.body === 'string') {
        const bodyJson = JSON.parse(data_response.body);

        parsedResponse =
          typeof bodyJson.response === 'string'
            ? JSON.parse(bodyJson.response)
            : bodyJson.response;
      } else {
        parsedResponse = data_response;
      }

      console.log('Full API Response:', data_response);
      console.log('Parsed Response:', parsedResponse);
      console.log('Recommendations:', parsedResponse.recommendations);

      // Add assistant response
      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content:
            parsedResponse.summary ||
            'Here are some recommendations.'
        }
      ]);

      // Save recommendations (always update if present)
      if (
        parsedResponse.recommendations &&
        Array.isArray(
          parsedResponse.recommendations
        )
      ) {
        console.log('Setting recommendations:', parsedResponse.recommendations);
        setRecommendations(
          parsedResponse.recommendations
        );
      } else {
        console.warn('Recommendations not found or not an array', {
          hasRecommendations: !!parsedResponse.recommendations,
          isArray: Array.isArray(parsedResponse.recommendations),
          recommendationsValue: parsedResponse.recommendations
        });
      }

    } catch (error) {
      console.error(
        'Recommendation API error:',
        error
      );

      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content:
            'Sorry, something went wrong.'
        }
      ]);
    } finally {
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

        {/* Recommendations Section (always rendered for debug) */}
        <div className="recommendations-section" style={{ border: '2px solid red' }}>
          <h2>Recommended Cars</h2>
          {/* <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <p style={{ margin: '0', fontSize: '12px' }}>DEBUG: recommendations.length = {recommendations.length}</p>
          </div> */}
          {recommendations.length > 0 ? (
            <div className="cars-grid">
              {[...recommendations].sort((a, b) => a.monthly_payment_usd - b.monthly_payment_usd).map((car, index) => {
                console.log('Rendering car:', car);
                return (
                  <CarCard 
                    key={index} 
                    car={{
                      ...car,
                      key_highlight: car.key_highlight || `APR: ${car.apr_percent}%`,
                      valid_from: car.valid_from || new Date().toISOString().split('T')[0],
                      valid_to: car.valid_to || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
                    }}
                    onSelect={handleSelectCar}
                    isBestValue={index === 0}
                    isAnalyzing={analyzingCarId === car.car_name}
                  />
                );
              })}
            </div>
          ) : (
            <div style={{ color: 'gray', fontSize: '14px' }}>No recommendations to show.</div>
          )}
        </div>
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
