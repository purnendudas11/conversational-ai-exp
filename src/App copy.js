// import React, { useState, useRef, useEffect } from 'react';
// import './App.css';
// import Chat from './components/Chat';
// import CarCard from './components/CarCard';
// import DealDetails from './components/DealDetails';

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const [recommendations, setRecommendations] = useState([]);
//   const [selectedDeal, setSelectedDeal] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [analyzingCarId, setAnalyzingCarId] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [questionnaireAnswers, setQuestionnaireAnswers] = useState({
//     budget: '',
//     carType: '',
//     brand: '',
//     condition: '',
//     fuel: ''
//   });
//   const messagesEndRef = useRef(null);

//   const questions = [
//     "What is your budget? (e.g., $20,000 - $30,000 or $25,000)",
//     "Are you looking for an SUV, sedan, or truck?",
//     "Do you have a preferred brand? (e.g., Toyota, Lexus, or 'No preference')",
//     "Do you want a new or used car?",
//     "Do you prefer gas, hybrid, or electric?"
//   ];

//   const answerKeys = ['budget', 'carType', 'brand', 'condition', 'fuel'];

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Initialize with first question
//   useEffect(() => {
//     if (messages.length === 0 && currentQuestionIndex === 0) {
//       const initialQuestion = {
//         type: 'assistant',
//         content: `Welcome to Car Advisor! I'll help you find your perfect car. Let me ask you a few questions.\n\n${questions[0]}`
//       };
//       setMessages([initialQuestion]);
//     }
//   }, []);

//   // Handle user message submission
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
    
//     if (!inputValue.trim()) return;

//     const userInput = inputValue;
//     setInputValue('');

//     // Add user message to chat
//     const userMessage = {
//       type: 'user',
//       content: userInput
//     };
//     setMessages(prev => [...prev, userMessage]);

//     // Handle questionnaire phase
//     if (currentQuestionIndex < questions.length) {
//       // Store the answer
//       const answerKey = answerKeys[currentQuestionIndex];
//       setQuestionnaireAnswers(prev => ({
//         ...prev,
//         [answerKey]: userInput
//       }));

//       const nextQuestionIndex = currentQuestionIndex + 1;
//       setCurrentQuestionIndex(nextQuestionIndex);

//       // If more questions, ask the next one
//       if (nextQuestionIndex < questions.length) {
//         const nextQuestion = {
//           type: 'assistant',
//           content: questions[nextQuestionIndex]
//         };
//         setMessages(prev => [...prev, nextQuestion]);
//       } else {
//         // All questions answered, prepare to call API
//         const updatedAnswers = {
//           ...questionnaireAnswers,
//           [answerKey]: userInput
//         };
        
//         await callLLMWithAnswers(updatedAnswers);
//       }
//       return;
//     }

//     // Regular chat after questionnaire is complete
//     setLoading(true);

//     try {
//       // Call /chat API
//       const response = await fetch('https://wyrbh3p649.execute-api.us-east-1.amazonaws.com/Dev', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ message: userInput })
//       });

//       const data = await response.json();
      
//       // Parse the response - handle nested JSON structure
//       let parsedResponse;
//       if (typeof data.body === 'string') {
//         const bodyJson = JSON.parse(data.body);
//         parsedResponse = JSON.parse(bodyJson.response);
//       } else {
//         parsedResponse = data;
//       }

//       // Add assistant message (summary)
//       const assistantMessage = {
//         type: 'assistant',
//         content: parsedResponse.summary
//       };
//       setMessages(prev => [...prev, assistantMessage]);

//       // Store recommendations
//       if (parsedResponse.recommendations) {
//         setRecommendations(parsedResponse.recommendations);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error('Error calling /chat API:', error);
//       setMessages(prev => [...prev, {
//         type: 'assistant',
//         content: 'Sorry, I encountered an error. Please try again.'
//       }]);
//       setLoading(false);
//     }
//   };

//   // Call LLM API with questionnaire answers
//   const callLLMWithAnswers = async (answers) => {
//     setLoading(true);

//     // Create initial prompt in JSON format from questionnaire answers
//     const initialPrompt = JSON.stringify({
//       total_price_usd: answers.budget,
//       body_type: answers.carType,
//       brand: answers.brand,
//       condition: answers.condition,
//       fuel_type: answers.fuel
//     });

//     try {
//       const response = await fetch('https://wyrbh3p649.execute-api.us-east-1.amazonaws.com/Dev', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ message: initialPrompt })
//       });

//       const data = await response.json();
      
//       // Parse the response - handle nested JSON structure
//       let parsedResponse;
//       if (typeof data.body === 'string') {
//         const bodyJson = JSON.parse(data.body);
//         parsedResponse = JSON.parse(bodyJson.response);
//       } else {
//         parsedResponse = data;
//       }

//       // Add assistant message (summary)
//       const assistantMessage = {
//         type: 'assistant',
//         content: parsedResponse.summary
//       };
//       setMessages(prev => [...prev, assistantMessage]);

//       // Store recommendations
//       if (parsedResponse.recommendations) {
//         setRecommendations(parsedResponse.recommendations);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error('Error calling /chat API:', error);
//       setMessages(prev => [...prev, {
//         type: 'assistant',
//         content: 'Sorry, I encountered an error. Please try again.'
//       }]);
//       setLoading(false);
//     }
//   };

//   // Handle car selection with AI analysis
//   const handleSelectCar = async (car) => {
//     try {
//       setAnalyzingCarId(car.car_name);
//       setLoading(true);
      
//       // Call /deal API with AI analysis
//       const response = await fetch('https://j1xz6xo2ua.execute-api.us-east-1.amazonaws.com/Dev/analyze-deal', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(car)
//       });

//       const deal = await response.json();
//       setSelectedDeal(deal);
//       setAnalyzingCarId(null);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error calling /deal API:', error);
//       setAnalyzingCarId(null);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <div className="app-header">
//         <h1>Car Advisor</h1>
//         <p>Find your perfect car with AI recommendations</p>
//       </div>

//       <div className="app-layout">
//         {/* Chat Section */}
//         <div className="chat-section">
//           <Chat 
//             messages={messages} 
//             messagesEndRef={messagesEndRef}
//           />
          
//           {/* Input Form */}
//           <form className="message-input-form" onSubmit={handleSendMessage}>
//             <input
//               type="text"
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               placeholder="Ask about cars, budget, features..."
//               className="message-input"
//               disabled={loading}
//             />
//             <button 
//               type="submit" 
//               className="send-button"
//               disabled={loading}
//             >
//               {loading ? 'Loading...' : 'Send'}
//             </button>
//           </form>
//         </div>

//         {/* Recommendations Section */}
//         {recommendations.length > 0 && (
//           <div className="recommendations-section">
//             <h2>Recommended Cars</h2>
//             <div className="cars-grid">
//               {[...recommendations].sort((a, b) => b.best_value - a.best_value).map((car, index) => (
//                 <CarCard 
//                   key={index} 
//                   car={car}
//                   onSelect={handleSelectCar}
//                   isBestValue={car.best_value}
//                   isAnalyzing={analyzingCarId === car.car_name}
//                 />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Deal Details Section */}
//       {selectedDeal && (
//         <DealDetails 
//           deal={selectedDeal}
//           onClose={() => setSelectedDeal(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default App;
