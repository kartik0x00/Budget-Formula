# Deployment Guide for Vercel

## Backend Deployment (Node.js + Express)

### Option 1: Deploy to Vercel with Serverless Functions

1. **Create `vercel.json` in server root:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

2. **Build the project:**
```bash
cd server
npm run build
```

3. **Deploy:**
```bash
vercel deploy --prod
```

### Option 2: Deploy to Heroku/Render/Railway (Recommended for ExpressJS)

Better for traditional server applications:

```bash
# Using Heroku
heroku create budget-formula-api
git push heroku main

# Using Render
# Connect GitHub repo at https://dashboard.render.com
```

## Frontend Deployment (React + Vite)

### Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect on Vercel:**
   - Visit https://vercel.com/new
   - Import your Git repository
   - Vercel auto-detects Vite
   - Set environment variables
   - Deploy!

3. **Environment Variables in Vercel:**
   - `VITE_API_URL` = Your backend API URL

## Environment Setup

### Server Environment (Vercel/Production)
```
MONGODB_URI=mongodb+srv://[user]:[pass]@[cluster].mongodb.net/budget-formula
PIN=your_secure_pin_here
USER_NAME=Kartik Upadhyay
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app
```

### Client Environment (Vercel)
```
VITE_API_URL=https://your-api.com/api
```

## Testing Deployment

1. **Test locally:**
```bash
npm run build
npm start
```

2. **Test production build:**
```bash
npm run build
NODE_ENV=production node dist/index.js
```

## Troubleshooting

### CORS Issues
- Check `CORS_ORIGIN` matches your frontend domain
- Ensure backend is accessible from frontend

### Database Connection
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure .env is set in deployment platform

### Frontend API Calls Failing
- Verify `VITE_API_URL` is set correctly
- Check network tab in browser DevTools
- Ensure backend is deployed and running

## Monitoring

### Backend Logs
```bash
# Vercel
vercel logs

# Heroku
heroku logs --tail

# Render
# Check dashboard logs
```

### Frontend Error Tracking
- Implement Sentry for error tracking
- Check browser console for errors

## Security Checklist

- [ ] PIN changed from default
- [ ] MongoDB credentials are secure
- [ ] CORS properly configured
- [ ] Environment variables not committed to git
- [ ] HTTPS enabled (Vercel does this automatically)
- [ ] API keys rotated

---

See main README.md for full documentation.
