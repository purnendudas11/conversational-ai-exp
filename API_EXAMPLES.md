/*
 * API Mock Example for Local Testing
 * 
 * Use this file as a reference to set up mock APIs during development
 * or integrate with your actual backend endpoints.
 * 
 * These examples show the exact structure the UI expects from your API
 */

// ============================================
// EXAMPLE 1: Chat API Response
// ============================================

const chatApiResponseExample = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*"
  },
  body: JSON.stringify({
    response: JSON.stringify({
      summary: "Here are three used cars that fit your budget of $25,000. These vehicles offer a great balance of reliability, affordability, and features.",
      recommendations: [
        {
          car_name: "Lexus TX 2016 500h",
          monthly_payment_usd: 930.34,
          total_price_usd: 33516,
          apr_percent: 8.16,
          cashback_usd: 0,
          valid_from: null,
          valid_to: null,
          key_highlight: "Affordable hybrid SUV with good mileage and seating for 7.",
          best_value: false
        },
        {
          car_name: "Toyota Camry 2017 LE",
          monthly_payment_usd: 762.7,
          total_price_usd: 52754,
          apr_percent: 8.44,
          cashback_usd: 0,
          valid_from: null,
          valid_to: null,
          key_highlight: "Reliable sedan with a good balance of performance and comfort.",
          best_value: false
        },
        {
          car_name: "Toyota Camry 2016 LE",
          monthly_payment_usd: 728.74,
          total_price_usd: 42794,
          apr_percent: 8.01,
          cashback_usd: 0,
          valid_from: null,
          valid_to: null,
          key_highlight: "Efficient and dependable sedan within your budget.",
          best_value: true
        }
      ],
      follow_up_question: "Which of these cars interests you the most?"
    })
  })
};

/*
Expected UI Behavior:
1. Chat message from user appears on the right (blue background)
2. Summary appears as assistant message on the left (gray background)
3. Three car cards appear below with all details
4. The last car (best_value: true) has an amber "Best Value" badge
5. User can click "Select This Car" on any card
*/

// ============================================
// EXAMPLE 2: Deal API Response (Full Offer)
// ============================================

const dealApiResponseExample1 = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*"
  },
  body: JSON.stringify({
    response: JSON.stringify({
      summary: "Your offer for the Toyota Camry 2016 LE has been confirmed!",
      offer_details: {
        car_name: "Toyota Camry 2016 LE",
        monthly_payment: 728.74,
        total_price: 42794,
        down_payment: 5000,
        apr: 8.01,
        term_months: 60,
        loan_amount: 37794
      },
      terms: "60-month financing with 8.01% APR. No prepayment penalties. Gap insurance included.",
      next_steps: "Our sales team will contact you within 24 hours to finalize the purchase agreement and arrange delivery.",
      offer_valid_until: "2026-05-08"
    })
  })
};

/*
Expected UI Behavior:
1. Modal overlay appears with gradient header
2. Offer details displayed in a grid
3. Terms and next steps shown
4. User can click "Continue Shopping" to close modal and return to chat
*/

// ============================================
// EXAMPLE 3: Deal API Response (Simple Success)
// ============================================

const dealApiResponseExample2 = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
};

/*
Expected UI Behavior:
1. Simple success state displayed
2. "Deal Confirmed" message with checkmark
3. "Continue Shopping" button closes modal
4. User returns to chat interface
*/

// ============================================
// EXPRESS SERVER MOCK (Optional - for local development)
// ============================================

/*
If you want to run a mock server locally, use this Express example:

--- Install Express ---
npm install express cors body-parser

--- Create mock-server.js ---

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock Chat Endpoint
app.post('/chat', (req, res) => {
  const { message } = req.body;
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        response: JSON.stringify({
          summary: `I found some great cars matching your request: "${message}"`,
          recommendations: [
            {
              car_name: "Toyota Camry 2017 LE",
              monthly_payment_usd: 762.7,
              total_price_usd: 52754,
              apr_percent: 8.44,
              cashback_usd: 0,
              valid_from: null,
              valid_to: null,
              key_highlight: "Reliable sedan with excellent fuel economy.",
              best_value: true
            },
            {
              car_name: "Honda Accord 2016 EX",
              monthly_payment_usd: 715.2,
              total_price_usd: 48950,
              apr_percent: 7.99,
              cashback_usd: 500,
              valid_from: "2026-05-01",
              valid_to: "2026-06-30",
              key_highlight: "Spacious midsize sedan with modern features.",
              best_value: false
            }
          ],
          follow_up_question: "Would you like more details about any of these cars?"
        })
      })
    });
  }, 1000); // 1 second delay to simulate API call
});

// Mock Deal Endpoint
app.post('/deal', (req, res) => {
  const car = req.body;
  
  setTimeout(() => {
    res.json({
      statusCode: 200,
      summary: `Great choice! Here's your personalized offer for the ${car.car_name}`,
      offer_details: {
        car_name: car.car_name,
        monthly_payment: car.monthly_payment_usd,
        total_price: car.total_price_usd,
        down_payment: 5000,
        apr: car.apr_percent,
        term_months: 60
      },
      terms: "Flexible financing options available. Gap insurance included in the offer.",
      next_steps: "A dealership specialist will contact you within 24 hours to discuss your offer and arrange a test drive."
    });
  }, 800); // 0.8 second delay
});

app.listen(3001, () => {
  console.log('Mock API server running on http://localhost:3001');
});

--- Run the mock server ---
node mock-server.js

--- Then in another terminal, run the React app ---
npm start

Now the app will use your mock server for /chat and /deal endpoints.
*/

// ============================================
// REQUIRED RESPONSE FORMAT SPECIFICATIONS
// ============================================

/*
IMPORTANT: Your API must return responses in this exact structure:

1. CHAT ENDPOINT RESPONSE:
   - statusCode: Must be 200
   - body: Must be a JSON stringified object containing a "response" key
   - The "response" value must be another JSON-stringified string containing:
     * summary: String of the AI summary
     * recommendations: Array of car objects
     * follow_up_question: Optional follow-up question string

2. CAR OBJECT STRUCTURE:
   {
     car_name: string,                    // e.g., "Toyota Camry 2017 LE"
     monthly_payment_usd: number,         // e.g., 762.7
     total_price_usd: number,             // e.g., 52754
     apr_percent: number,                 // e.g., 8.44
     cashback_usd: number,                // e.g., 0
     valid_from: string|null,             // e.g., "2024-01-01" or null
     valid_to: string|null,               // e.g., "2024-12-31" or null
     key_highlight: string,               // Short marketing highlight
     best_value: boolean                  // true if this is the best value option
   }

3. DEAL ENDPOINT RESPONSE (Option 1 - Full Details):
   {
     statusCode: 200,
     summary: string,                     // Offer summary message
     offer_details: {
       car_name: string,
       monthly_payment: number,
       total_price: number,
       down_payment: number,
       apr: number,
       term_months: number (optional)
     },
     terms: string (optional),            // Terms and conditions
     next_steps: string (optional)        // What happens next
   }

4. DEAL ENDPOINT RESPONSE (Option 2 - Simple Success):
   {
     statusCode: 200
   }
   // UI will show simple success message without details
*/

// ============================================
// TESTING CHECKLIST
// ============================================

/*
Before deploying, test these scenarios:

[ ] User sends first message → Chat appears, car cards appear
[ ] Car cards display all fields correctly (prices, APR, highlight)
[ ] "Best Value" badge appears on correct card
[ ] Clicking "Select This Car" → Deal modal appears
[ ] Deal modal shows offer details
[ ] Closing modal → Returns to chat, can send new message
[ ] Sending multiple messages → All appear in chat history, auto-scrolls down
[ ] No errors in browser console
[ ] Mobile responsive - test on phone (DevTools Device toolbar)
[ ] Try different messages → Different recommendations appear

API Response Format Validation:
[ ] /chat response has nested JSON strings (double stringified)
[ ] /deal response includes all required fields
[ ] No circular references in objects
[ ] All prices are numbers, not strings
[ ] APR values are reasonable (typically 0-20%)
*/

// Export examples for reference
module.exports = {
  chatApiResponseExample,
  dealApiResponseExample1,
  dealApiResponseExample2
};
