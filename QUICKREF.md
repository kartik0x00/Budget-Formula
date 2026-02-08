# 🚀 Budget Formula - Quick Reference Card

## 📋 Essential Commands

### Initial Setup
```bash
# Clone/navigate to project
cd /home/kartik/Desktop/budgetformula

# Automated setup (Linux/macOS)
bash setup.sh

# Manual setup
cd server && npm install && cd ../client && npm install
```

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Production Build

**Backend:**
```bash
cd server
npm run build      # Creates dist/
npm start          # Runs compiled version
```

**Frontend:**
```bash
cd client
npm run build      # Creates dist/
npm run preview    # Preview production build
```

---

## 🔑 Default Credentials

| Field | Value |
|-------|-------|
| PIN | 1234 |
| Name | Kartik Upadhyay |

**Change in `server/.env`:**
```env
PIN=9999
USER_NAME=Your Name
```

---

## 📊 Key Endpoints

### Authentication (No Auth Required)
```
POST   /api/auth/login             - Login
POST   /api/auth/verify            - Verify token
GET    /api/auth/me                - Get user info
```

### Budget (Auth Required)
```
GET    /api/budget/entries         - Get monthly entries
POST   /api/budget/entries         - Create entry
PUT    /api/budget/entries/:id     - Update entry
DELETE /api/budget/entries/:id     - Delete entry
```

---

## ⚙️ Environment Variables

### Backend `.env`
```env
MONGODB_URI=your_connection_string
PIN=1234
USER_NAME=Kartik Upadhyay
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env.local`
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📁 Project Structure at a Glance

```
budgetformula/
├── server/              Node.js + Express
│   ├── src/
│   │   ├── models/     BudgetEntry schema
│   │   ├── routes/     API endpoints
│   │   ├── middleware/ Auth, errors
│   │   └── utils/      Config, helpers
│   └── package.json
│
├── client/             React + Vite
│   ├── src/
│   │   ├── pages/      LoginPage, DashboardPage
│   │   ├── components/ Reusable UI components
│   │   ├── services/   API client
│   │   ├── store/      Zustand state
│   │   └── types/      TypeScript interfaces
│   └── package.json
│
└── Docs/
    ├── README.md       Full documentation
    ├── SETUP.md        Detailed setup guide
    ├── ARCHITECTURE.md Architecture overview
    ├── DEPLOYMENT.md   Vercel deployment
    └── PROJECT_SUMMARY.md Project overview
```

---

## 🎨 Component & Page Quick Reference

### Pages
- **LoginPage** - PIN + Name authentication
- **DashboardPage** - Main budget tracker interface

### Components
- **Button** - Customizable button (primary/secondary/danger)
- **Input** - Text input with validation
- **Select** - Dropdown selector
- **Card** - Container with optional title
- **BudgetForm** - Add new budget entry form
- **BudgetEntryItem** - Display/edit single entry
- **SummaryCard** - Show income, expenses, balance

---

## 🗄️ Database Schema

```
BudgetEntry {
  _id: ObjectId
  date: Date              // Entry date
  income: Number          // 0-100000000
  incomeSource: String    // "Salary", "Freelance"
  expenses: Number        // Daily expenses
  expenseRemarks: String  // "Groceries", "Transport"
  fixedPays: Number       // Rent, bills, insurance
  fixedPaysRemarks: String // "Rent - Flat"
  month: Number           // 1-12
  year: Number            // YYYY
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔒 Security Quick Check

✅ PIN-based authentication
✅ Bearer token in headers
✅ Input validation
✅ Type checking (TypeScript)
✅ Error messages don't leak data
✅ Environment variables for sensitive config
✅ CORS properly configured

---

## 📱 Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | <640px | Single column |
| Tablet | 640-1024px | 2 columns |
| Desktop | >1024px | Full width |

---

## 🐛 Troubleshooting Quick Fix

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or change PORT in server/.env
PORT=3001
```

### MongoDB Connection Failed
1. Check `MONGODB_URI` in `server/.env`
2. Verify IP whitelist in MongoDB Atlas
3. Confirm username/password

### CORS Errors
1. Check backend running on correct port
2. Verify `CORS_ORIGIN` in `server/.env`
3. Check `VITE_API_URL` in `client/.env.local`

### Login Fails
1. Verify PIN in `server/.env` is correct
2. Verify `USER_NAME` matches
3. Clear browser cache/localStorage
4. Restart backend

---

## 📚 Important Files to Edit

| File | Purpose |
|------|---------|
| `server/.env` | Database & PIN config |
| `client/.env.local` | API URL for frontend |
| `server/src/index.ts` | Server entry point |
| `client/src/App.tsx` | Root component |
| `server/src/routes/budget.ts` | Budget API endpoints |

---

## 🚀 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] IP whitelist updated
- [ ] Connection string in `server/.env`
- [ ] PIN changed from default
- [ ] Environment set to production
- [ ] Frontend built: `npm run build`
- [ ] Backend built: `npm run build`
- [ ] Backend deployed to Heroku/Render/Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set on hosting
- [ ] CORS_ORIGIN updated to production URL
- [ ] Tested on production URL

---

## 📞 Support Resources

| Issue | Solution |
|-------|----------|
| Setup problems | See SETUP.md |
| Architecture questions | See ARCHITECTURE.md |
| Deployment help | See DEPLOYMENT.md |
| Project overview | See PROJECT_SUMMARY.md |
| Full documentation | See README.md |

---

## 💡 Common Tasks

### Add New Route
1. Create handler in `server/src/routes/`
2. Add to `server/src/index.ts`
3. Test with curl

### Add New Component
1. Create in `client/src/components/`
2. Import in page that uses it
3. Style with Tailwind classes

### Change Theme Colors
1. Edit `client/tailwind.config.js`
2. Update CSS custom properties in `client/src/index.css`
3. Rebuild with `npm run build`

### Add Database Field
1. Update `BudgetEntry` schema in `server/src/models/`
2. Update TypeScript interface in `client/src/types/`
3. Add input field in form component

---

## 🎯 Production Best Practices

1. ✅ Use environment variables
2. ✅ Enable TypeScript strict mode
3. ✅ Validate all inputs
4. ✅ Handle errors gracefully
5. ✅ Log important events
6. ✅ Set secure headers
7. ✅ Use HTTPS (Vercel default)
8. ✅ Monitor error rates
9. ✅ Test before deploying
10. ✅ Keep dependencies updated

---

## 📈 Performance Tips

- Use Vite build for frontend (auto code splitting)
- Leverage MongoDB indexing for queries
- Implement request caching if needed
- Minify and compress assets
- Use CDN for static assets (Vercel default)
- Monitor bundle size
- Implement lazy loading for routes

---

## 📄 File Checklist

✅ Backend files (10 TypeScript files)
✅ Frontend files (9 React components + services)
✅ Configuration files (package.json, tsconfig, vite.config)
✅ CSS files (Tailwind + PostCSS)
✅ Documentation (5 markdown files)
✅ Setup script (bash)
✅ .gitignore files (2)
✅ .env.example files (2)

---

## 🎉 You're Ready!

Your Budget Formula app is complete and ready to:
1. ✅ Track income & expenses
2. ✅ View monthly summaries
3. ✅ Navigate through time
4. ✅ Deploy to production

**Next Step:** Run `bash setup.sh` and start tracking! 💰

---

**Version:** 1.0.0 | **Created:** Feb 2026 | **Author:** Kartik Upadhyay
