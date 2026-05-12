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

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const [loading, setLoading] = useState(false);

  const [analyzingCarId, setAnalyzingCarId] =
    useState(null);

  const [answers, setAnswers] = useState({});

  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
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

  // =========================
  // Handle Send Message
  // =========================

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userInput = inputValue;

    setInputValue('');

    // Add user message
    const userMessage = {
      type: 'user',
      content: userInput
    };

    setMessages(prev => [...prev, userMessage]);

    // STEP 1 - Extract data
    const extracted = quickExtract(userInput);

    // STEP 2 - Merge answers
    const updatedAnswers = mergeAnswers(
      answers,
      extracted
    );

    setAnswers(updatedAnswers);

    console.log(
      'Updated Answers:',
      updatedAnswers
    );

    // STEP 3 - Check missing fields
    const missingFields = getMissingFields(
      updatedAnswers,
      REQUIRED_FIELDS
    );

    // STEP 4 - If all fields collected
    if (missingFields.length === 0) {
      await generateRecommendations(
        updatedAnswers
      );
      return;
    }

    // STEP 5 - Ask next question
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

  // =========================
  // Recommendation API
  // =========================

  const generateRecommendations = async (
    collectedAnswers
  ) => {
    try {
      setLoading(true);

      console.log(
        'Calling recommendation API:',
        collectedAnswers
      );

      const response = await fetch(
        'https://wyrbh3p649.execute-api.us-east-1.amazonaws.com/Dev',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            answers: collectedAnswers
          })
        }
      );

      const data = await response.json();

      // Parse nested JSON safely
      let parsedResponse;

      try {
        if (typeof data.body === 'string') {
          const bodyJson = JSON.parse(data.body);

          parsedResponse =
            typeof bodyJson.response === 'string'
              ? JSON.parse(bodyJson.response)
              : bodyJson.response;
        } else {
          parsedResponse = data;
        }
      } catch (parseError) {
        console.error(
          'Parsing error:',
          parseError
        );

        parsedResponse = {
          summary:
            'Unable to parse recommendation response.',
          recommendations: []
        };
      }

      // Add assistant summary
      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content:
            parsedResponse.summary ||
            'Here are some recommendations.'
        }
      ]);

      // Set recommendations
      if (
        parsedResponse.recommendations &&
        Array.isArray(
          parsedResponse.recommendations
        )
      ) {
        setRecommendations(
          parsedResponse.recommendations
        );
      }
    } catch (error) {
      console.error(
        'Error calling recommendation API:',
        error
      );

      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content:
            'Sorry, something went wrong while fetching recommendations.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Handle Car Selection
  // =========================

  const handleSelectCar = async (car) => {
    try {
      setAnalyzingCarId(car.car_name);

      setLoading(true);

      const response = await fetch(
        'https://j1xz6xo2ua.execute-api.us-east-1.amazonaws.com/Dev/analyze-deal',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(car)
        }
      );

      const deal = await response.json();

      setSelectedDeal(deal);
    } catch (error) {
      console.error(
        'Error calling /deal API:',
        error
      );
    } finally {
      setAnalyzingCarId(null);
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Car Advisor</h1>

        <p>
          Find your perfect car with AI
          recommendations
        </p>
      </div>

      <div className="app-layout">
        {/* Chat Section */}

        <div className="chat-section">
          <Chat
            messages={messages}
            messagesEndRef={messagesEndRef}
          />

          {/* Input Form */}

          <form
            className="message-input-form"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) =>
                setInputValue(e.target.value)
              }
              placeholder="Ask about cars, budget, features..."
              className="message-input"
              disabled={loading}
            />

            <button
              type="submit"
              className="send-button"
              disabled={loading}
            >
              {loading
                ? 'Loading...'
                : 'Send'}
            </button>
          </form>
        </div>

        {/* Recommendations */}

        {recommendations.length > 0 && (
          <div className="recommendations-section">
            <h2>Recommended Cars</h2>

            <div className="cars-grid">
              {[...recommendations]
                .sort(
                  (a, b) =>
                    b.best_value -
                    a.best_value
                )
                .map((car, index) => (
                  <CarCard
                    key={index}
                    car={car}
                    onSelect={
                      handleSelectCar
                    }
                    isBestValue={
                      car.best_value
                    }
                    isAnalyzing={
                      analyzingCarId ===
                      car.car_name
                    }
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Deal Details */}

      {selectedDeal && (
        <DealDetails
          deal={selectedDeal}
          onClose={() =>
            setSelectedDeal(null)
          }
        />
      )}
    </div>
  );
}

export default App;