# Quick Start Guide - Car Advisor UI

## Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A code editor (VS Code recommended)

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure API Endpoint
By default, the app connects to `http://localhost:3001`. If your backend runs on a different port:

1. Open `package.json`
2. Update the `proxy` field:
```json
"proxy": "http://your-backend-url:port"
```

### Step 3: Start Development Server
```bash
npm start
```

The app automatically opens in your browser at `http://localhost:3000`

### Step 4: Test with Sample Message
Type a message like: "I'm looking for a car under $30,000" and send it.

---

## Running the Backend

The UI connects to a backend API that should expose these endpoints:

### `/chat` (POST)
Receives user messages, returns recommendations
```javascript
// Request
fetch('/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'user message' })
})

// Expected Response
{
  statusCode: 200,
  body: "{ \"response\": \"{...}\" }"  // nested JSON string
}
```

### `/deal` (POST)
Receives selected car, returns deal details
```javascript
// Request
fetch('/deal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(carObject)
})

// Expected Response
{
  statusCode: 200,
  summary: "...",
  offer_details: {...}
}
```

---

## Project Structure

```
.
├── App.js                    Main component (orchestrates everything)
├── App.css                   Global styles
├── index.js                  React entry point
├── index.html                HTML template
├── package.json              Dependencies
│
├── components/
│   ├── Chat.js              Chat display
│   ├── ChatMessage.js        Message bubble
│   ├── CarCard.js            Car recommendation card
│   ├── DealDetails.js        Deal modal
│   └── *.css                 Component styles
│
└── README.md                 Full documentation
```

---

## Key Components

### App.js
- Main container
- Manages all state (messages, recommendations, selected deal)
- Handles API calls to `/chat` and `/deal`
- Renders Chat, CarCard, and DealDetails components

### Chat.js + ChatMessage.js
- Display conversation history
- Auto-scroll to latest message
- Distinguish between user and assistant messages

### CarCard.js
- Display individual car recommendations
- Show all car details (price, payment, APR, etc.)
- Highlight "best value" cars
- "Select This Car" button triggers `/deal` API call

### DealDetails.js
- Modal overlay showing deal information
- Displays after car selection
- Shows offer details and next steps

---

## Development Workflow

1. **Start coding**:
   ```bash
   npm start
   ```

2. **Make changes** to any component - changes auto-reload in browser

3. **Check console** for any errors or API issues

4. **Build for production**:
   ```bash
   npm build
   ```

---

## Common Issues & Solutions

### "Cannot find module" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API not responding
- Verify backend is running on the correct port
- Check `proxy` setting in package.json
- Look at Network tab in browser DevTools

### Styling looks broken
- Clear browser cache (Cmd+Shift+Delete)
- Restart dev server (`npm start`)

### State not updating
- Check browser DevTools → Console for errors
- Verify API response structure matches expected format

---

## Customization

### Change Colors
Edit `App.css` - look for hex color values:
- Primary purple: `#667eea`
- Secondary purple: `#764ba2`
- Accent amber (for best value): `#fbbf24`

### Modify Layout
- Adjust grid columns in `App.css` `.app-layout`
- Change breakpoints in media queries

### Add New Fields to Car Card
1. Edit `CarCard.js` to add new `detail-item` div
2. Add corresponding styling in `CarCard.css`

---

## Testing

### Manual Testing Checklist
- [ ] Type a message and send it
- [ ] Verify car cards appear
- [ ] Click "Select This Car" on any card
- [ ] Verify deal modal appears
- [ ] Close modal and send another message
- [ ] Test on mobile (DevTools → Device toolbar)

### Browser DevTools
- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests/responses
- **Application**: Check localStorage if needed

---

## Production Deployment

### Build optimized version
```bash
npm build
```

### Serve the build
```bash
# Using Node + Express
npm install -g serve
serve -s build

# Or upload 'build' folder to web hosting
```

### Environment Variables for Production
Create `.env.production`:
```
REACT_APP_API_URL=https://your-production-api.com
REACT_APP_DEBUG=false
```

---

## Performance Tips

- The app uses React.StrictMode for development error detection
- CSS animations use GPU acceleration
- Consider lazy loading components for very large apps

---

## Need Help?

1. **Check README.md** for detailed documentation
2. **Review component code** - all have comments explaining functionality
3. **Check browser console** for specific error messages
4. **Verify API response** in Network tab of DevTools

---

**Ready to start? Run:** `npm install && npm start`
