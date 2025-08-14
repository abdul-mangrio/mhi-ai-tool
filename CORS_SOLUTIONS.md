# CORS Solutions for NetSuite AI Assistant

## Option 1: GitHub Pages Deployment (Recommended)

### Steps:
1. Update the `homepage` field in `package.json` with your actual GitHub username
2. Run: `npm run deploy`
3. Go to your GitHub repository settings
4. Enable GitHub Pages from the `gh-pages` branch

### Benefits:
- ✅ No CORS issues (served from different origin)
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Easy deployment

---

## Option 2: Browser Extension Solution

### Install CORS Unblock Extension:
- **Chrome**: "CORS Unblock" or "Allow CORS: Access-Control-Allow-Origin"
- **Firefox**: "CORS Everywhere"
- **Edge**: "CORS Unblock"

### How to use:
1. Install the extension
2. Enable it for your development
3. The extension will add CORS headers to requests

### Benefits:
- ✅ Quick setup
- ✅ Works immediately
- ✅ No code changes needed

---

## Option 3: Development Server with CORS Proxy

### Using a CORS proxy service:
```javascript
// In aiService.ts, replace direct API calls with proxy
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Example for Claude:
const response = await axios.post(
  `${CORS_PROXY}https://api.anthropic.com/v1/messages`,
  // ... rest of the request
);
```

### Benefits:
- ✅ No deployment needed
- ✅ Works with local development
- ✅ Simple implementation

---

## Option 4: Environment-based Configuration

### Create different configurations for dev/prod:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-domain.com/api'
  : 'http://localhost:5000/api';
```

---

## Option 5: Netlify/Vercel Deployment

### Alternative to GitHub Pages:
1. Push code to GitHub
2. Connect to Netlify/Vercel
3. Automatic deployment on push

### Benefits:
- ✅ Better performance
- ✅ More features
- ✅ Custom domains
- ✅ Environment variables

---

## Recommended Approach:

1. **For Development**: Use browser extension (Option 2)
2. **For Production**: Deploy to GitHub Pages (Option 1)
3. **For Advanced**: Consider Netlify/Vercel (Option 5)

## Quick Fix for Immediate Testing:

Install a CORS browser extension and enable it for localhost:3000
