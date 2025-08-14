# NetSuite AI Assistant - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: GitHub Pages (Recommended for CORS-free deployment)

#### Prerequisites:
- GitHub account
- Git installed on your machine

#### Steps:

1. **Update the homepage URL** in `package.json`:
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/mhi-ai-tool"
   }
   ```
   Replace `YOUR_USERNAME` with your actual GitHub username.

2. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create GitHub repository**:
   - Go to GitHub.com
   - Create a new repository named `mhi-ai-tool`
   - Don't initialize with README (we already have one)

4. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mhi-ai-tool.git
   git branch -M main
   git push -u origin main
   ```

5. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

6. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Click Save

7. **Access your app**:
   - Your app will be available at: `https://YOUR_USERNAME.github.io/mhi-ai-tool`
   - No more CORS issues! 🎉

---

### Option 2: Netlify (Alternative with more features)

#### Steps:

1. **Push to GitHub** (follow steps 1-4 from GitHub Pages)

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Choose your repository
   - Build command: `npm run build`
   - Publish directory: `build`
   - Click Deploy

3. **Configure environment variables** (optional):
   - Go to Site settings → Environment variables
   - Add your API keys if needed

---

### Option 3: Vercel (Another great alternative)

#### Steps:

1. **Push to GitHub** (follow steps 1-4 from GitHub Pages)

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Framework preset: Create React App
   - Click Deploy

---

## 🔧 Development CORS Solutions

### Quick Fix: Browser Extension

1. **Install CORS Unblock Extension**:
   - Chrome: "CORS Unblock" or "Allow CORS: Access-Control-Allow-Origin"
   - Firefox: "CORS Everywhere"
   - Edge: "CORS Unblock"

2. **Enable for localhost:3000**:
   - Install the extension
   - Enable it for your development
   - No code changes needed!

### Alternative: Built-in CORS Proxy

1. **Enable CORS Proxy in Settings**:
   - Go to Settings page
   - Toggle "Use CORS Proxy (for development)"
   - Save settings

2. **How it works**:
   - Routes API calls through a CORS proxy service
   - Automatically handles CORS headers
   - Only for development (not needed in production)

---

## 📋 Pre-deployment Checklist

### ✅ Code Quality
- [ ] No TypeScript errors
- [ ] All imports are correct
- [ ] No console errors in browser

### ✅ Configuration
- [ ] Update `homepage` in `package.json`
- [ ] Set up environment variables (if needed)
- [ ] Test all AI providers work

### ✅ Testing
- [ ] Test chat functionality
- [ ] Test settings persistence
- [ ] Test AI provider switching
- [ ] Test on different browsers

---

## 🌐 Environment Variables (Optional)

If you want to use environment variables for API keys:

1. **Create `.env` file**:
   ```env
   REACT_APP_OPENAI_API_KEY=your_openai_key
   REACT_APP_CLAUDE_API_KEY=your_claude_key
   REACT_APP_GEMINI_API_KEY=your_gemini_key
   REACT_APP_AZURE_OPENAI_API_KEY=your_azure_key
   ```

2. **For production**:
   - GitHub Pages: Add to repository secrets
   - Netlify: Add in Environment variables
   - Vercel: Add in Environment variables

---

## 🚨 Troubleshooting

### Common Issues:

1. **Build fails**:
   ```bash
   npm run build
   ```
   Check for TypeScript errors first.

2. **CORS still occurs**:
   - Make sure you're using the deployed URL, not localhost
   - Check if CORS proxy is enabled in settings

3. **GitHub Pages not working**:
   - Check if gh-pages branch exists
   - Verify homepage URL in package.json
   - Check repository settings

4. **API calls failing**:
   - Verify API keys are correct
   - Check browser console for errors
   - Test with CORS proxy enabled

---

## 🎯 Recommended Workflow

1. **Development**: Use browser extension or CORS proxy
2. **Testing**: Deploy to GitHub Pages
3. **Production**: Use Netlify/Vercel for better performance

---

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all configuration steps
3. Test with different AI providers
4. Check the deployment platform's documentation

---

**Happy Deploying! 🚀**
