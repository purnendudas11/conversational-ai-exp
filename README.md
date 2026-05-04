# Car Advisor - Conversational AI React Application

A modern, enterprise-level React UI for a conversational car advisory application. This application provides an intuitive chatbot-style interface for users to get personalized car recommendations based on their preferences and budget.

## 📋 Features

- **Conversational Chat Interface**: Users can ask questions about cars in a natural conversation format
- **AI-Powered Recommendations**: Displays personalized car recommendations with detailed specifications
- **Car Selection Flow**: Users can select cars and view deal details
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, minimal design with smooth animations and transitions
- **Real-time API Integration**: Communicates with backend APIs for chat and deal processing

## 🗂️ Project Structure

```
conversational-ai-app/
├── components/
│   ├── Chat.js                 # Chat history display component
│   ├── Chat.css                # Chat styling
│   ├── ChatMessage.js          # Individual chat message component
│   ├── ChatMessage.css         # Chat message styling
│   ├── CarCard.js              # Car recommendation card component
│   ├── CarCard.css             # Car card styling
│   ├── DealDetails.js          # Deal details modal component
│   └── DealDetails.css         # Deal details styling
├── App.js                      # Main application component
├── App.css                     # Application styling
├── index.js                    # React application entry point
├── index.html                  # HTML template
├── package.json                # Project dependencies
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd conversational-ai-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open automatically in your browser at `http://localhost:3000`.

### Build for Production

```bash
npm build
```

This creates an optimized production build in the `build` folder.

## 🔌 API Integration

### Environment Setup

The application expects a backend API running on `http://localhost:3001`. Update the proxy in `package.json` if your API runs on a different port:

```json
"proxy": "http://your-api-url"
```

### API Endpoints

#### 1. Chat Endpoint
**POST** `/chat`

Send user messages to get car recommendations.

**Request:**
```json
{
  "message": "I'm looking for a car under $30,000"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "headers": {
    "Access-Control-Allow-Origin": "*"
  },
  "body": "{...}"
}
```

**Response Body Structure:**
```json
{
  "summary": "Here are three used cars that fit your budget...",
  "recommendations": [
    {
      "car_name": "Toyota Camry 2017 LE",
      "monthly_payment_usd": 762.7,
      "total_price_usd": 52754,
      "apr_percent": 8.44,
      "cashback_usd": 0,
      "valid_from": "2024-01-01",
      "valid_to": "2024-12-31",
      "key_highlight": "Reliable sedan with a good balance of performance and comfort.",
      "best_value": true
    }
  ],
  "follow_up_question": "Which of these cars interests you the most?"
}
```

#### 2. Deal Endpoint
**POST** `/deal`

Submit a selected car to process the deal.

**Request:**
```json
{
  "car_name": "Toyota Camry 2017 LE",
  "monthly_payment_usd": 762.7,
  "total_price_usd": 52754,
  "apr_percent": 8.44,
  ...
}
```

**Response:**
```json
{
  "statusCode": 200,
  "summary": "Your deal has been processed successfully.",
  "offer_details": {
    "monthly_payment": 762.70,
    "total_price": 52754,
    "down_payment": 5000,
    "apr": 8.44
  },
  "next_steps": "A representative will contact you within 24 hours."
}
```

## 🧩 Component Documentation

### App.js
The main component that orchestrates the entire application.

**Key Features:**
- Manages chat messages state
- Handles API calls to `/chat` and `/deal` endpoints
- Manages car recommendations and selected deals
- Provides layout structure

**Key Functions:**
- `handleSendMessage()`: Sends user messages to the chat API
- `handleSelectCar()`: Sends selected car to the deal API

### Chat.js
Displays the conversation history.

**Props:**
- `messages` (array): Array of message objects with `type` ('user'/'assistant') and `content`
- `messagesEndRef` (ref): Reference for auto-scrolling to latest message

### ChatMessage.js
Renders individual chat messages.

**Props:**
- `message` (object): Message object with `type` and `content`

**Features:**
- Different styling for user vs assistant messages
- Smooth slide-in animations
- Auto-scrolling support

### CarCard.js
Displays individual car recommendations.

**Props:**
- `car` (object): Car data with pricing, features, and specifications
- `onSelect` (function): Callback when "Select This Car" is clicked
- `isBestValue` (boolean): Highlights the best value option

**Features:**
- Displays all car details with formatted currency
- "Best Value" badge highlighting
- Smooth hover animations
- Select button for deal processing

### DealDetails.js
Modal overlay that displays deal information after car selection.

**Props:**
- `deal` (object): Deal data returned from `/deal` API
- `onClose` (function): Callback to close the modal

**Features:**
- Modal overlay with backdrop blur
- Displays offer details in a grid layout
- Success state messaging
- Continue shopping button

## 🎨 Styling Guide

### Color Scheme
- **Primary**: `#667eea` (Purple-blue)
- **Secondary**: `#764ba2` (Dark purple)
- **Accent**: `#fbbf24` (Amber - for best value)
- **Neutral**: `#f8f9fb` (Light gray for backgrounds)

### Spacing
- **Base unit**: 4px
- **Padding**: 12px, 16px, 24px
- **Gap**: 8px, 12px, 16px, 24px

### Responsive Breakpoints
- **Desktop**: Default (1024px+)
- **Tablet**: 1024px and below
- **Mobile**: 640px and below

## ✨ Key Features Explained

### 1. Auto-Scrolling Chat
The chat automatically scrolls to show the latest message when new messages arrive, providing a smooth conversation experience.

### 2. "Best Value" Highlighting
The car with `best_value: true` is highlighted with an amber badge and special styling to draw user attention.

### 3. Currency Formatting
All prices are formatted to USD using the browser's `Intl.NumberFormat` API for proper localization.

### 4. Loading States
The input field and send button show loading states while waiting for API responses.

### 5. Responsive Grid Layout
The two-column layout on desktop automatically stacks on tablet and mobile devices.

## 🔄 Data Flow

```
1. User types message and clicks Send
   ↓
2. Message added to chat (user displayed immediately)
   ↓
3. POST request to /chat with user message
   ↓
4. API returns summary + recommendations
   ↓
5. Assistant message and car cards displayed
   ↓
6. User clicks "Select This Car" on a card
   ↓
7. POST request to /deal with car object
   ↓
8. API returns deal details
   ↓
9. Deal modal displayed with offer information
```

## 🛠️ Development Tips

### Adding New Features
- Keep components small and focused on single responsibility
- Use React hooks (useState, useEffect) for state management
- Add new CSS files in the `components` folder following naming convention
- Document props and functionality with comments

### Modifying API Response Structure
If your API returns a different response structure, update the parsing logic in `App.js` in the `handleSendMessage()` function.

### Customizing Styling
- Modify `App.css` for main layout and global styles
- Modify component-specific CSS files for individual component styling
- Use CSS variables for consistent theming

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚨 Error Handling

The application includes basic error handling:
- API errors are caught and displayed to the user
- Failed requests show an error message in the chat
- UI remains responsive during loading states

## 🔐 Security Considerations

- All API calls use HTTPS in production
- User messages are sent as-is to the backend (backend should validate/sanitize)
- Deal data is received from backend and displayed without modification
- CORS headers should be properly configured on the backend

## 📈 Performance Optimizations

- React.StrictMode enabled for development error detection
- CSS animations use GPU acceleration (transform, opacity)
- Images and assets optimized for web
- Lazy loading ready (can be implemented with React.lazy)

## 📄 License

This project is part of an enterprise conversational AI application.

## 🤝 Support

For issues or questions about the implementation:
1. Check the component documentation above
2. Review the API integration section
3. Verify your backend is running and accessible
4. Check browser console for detailed error messages

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-01
