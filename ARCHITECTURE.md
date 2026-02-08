# Budget Formula - Architecture & Code Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                              │
│                 (http://localhost:5173)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST (Axios)
                     │ Bearer Token Auth
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  React Frontend (Vite)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Login Page (PIN + Name)                           │   │
│  │ • Dashboard (Month/Year selector)                   │   │
│  │ • Budget Entry Form                                 │   │
│  │ • Summary Statistics                                │   │
│  │ • Entry List with Edit/Delete                       │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ State Management (Zustand)                           │   │
│  │ • AuthStore (authentication state)                  │   │
│  │ • BudgetStore (entries, totals, calculations)       │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ API Client (Axios)                                  │   │
│  │ • Request/Response interceptors                     │   │
│  │ • Token management                                  │   │
│  │ • Error handling                                    │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST
                     │ /api/* endpoints
                     ↓
┌─────────────────────────────────────────────────────────────┐
│               Express.js Backend (Node.js)                   │
│              (http://localhost:3000)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Routes & Handlers                                   │   │
│  │ • POST /api/auth/login (PIN validation)             │   │
│  │ • POST /api/auth/verify (token verification)        │   │
│  │ • GET /api/budget/entries (monthly entries)         │   │
│  │ • POST /api/budget/entries (create)                 │   │
│  │ • PUT /api/budget/entries/:id (update)              │   │
│  │ • DELETE /api/budget/entries/:id (delete)           │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Middleware                                          │   │
│  │ • CORS handler                                      │   │
│  │ • Auth middleware (token verification)              │   │
│  │ • Error handler (centralized)                       │   │
│  │ • Request logger                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Data Validation & Processing                        │   │
│  │ • Input validation                                  │   │
│  │ • Type checking                                     │   │
│  │ • Calculations (income - expenses - fixedPays)      │   │
│  │ • Data aggregation                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ MongoDB Driver (Mongoose)
                     │ Connection pooling
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              MongoDB Atlas (Cloud Database)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Collection: budget_entries                          │   │
│  │ • Stores all budget data                            │   │
│  │ • Indexed by (year, month, date)                    │   │
│  │ • Includes timestamps                               │   │
│  │ • Flexible schema for future fields                 │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Features:                                           │   │
│  │ • Automatic backup (Atlas)                          │   │
│  │ • Free tier M0 (512MB storage)                      │   │
│  │ • Sufficient for years of personal data             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### 1. Authentication Flow
```
User enters PIN & Name
         ↓
LoginPage form submission
         ↓
apiClient.login() → POST /api/auth/login
         ↓
Backend validates (PIN + NAME)
         ↓
Generate token: "PIN:USERNAME"
         ↓
Return token to frontend
         ↓
Store in localStorage
         ↓
Set in Zustand AuthStore
         ↓
Redirect to Dashboard
```

### 2. Adding Budget Entry Flow
```
User fills form & submits
         ↓
BudgetForm component
         ↓
apiClient.createBudgetEntry()
         ↓
API adds Bearer token to header
         ↓
POST /api/budget/entries with data
         ↓
Backend validates input
         ↓
Extract month/year from date
         ↓
Create MongoDB document
         ↓
Return created entry
         ↓
BudgetStore.addEntry()
         ↓
Recalculate totals & balance
         ↓
UI updates automatically
```

### 3. Data Fetching Flow
```
User selects month/year
         ↓
setMonth() / setYear() in BudgetStore
         ↓
useEffect triggers load
         ↓
apiClient.getBudgetEntries(month, year)
         ↓
GET /api/budget/entries?month=2&year=2026
         ↓
Backend queries: BudgetEntry.find({month, year})
         ↓
Calculate totals server-side
         ↓
Return entries + totals + calculated balance
         ↓
BudgetStore.setEntries()
         ↓
UI renders entries and summary
```

---

## 🔑 Key Code Patterns

### API Client Pattern
```typescript
// Single instance pattern for consistent state
export const apiClient = new ApiClient();

// Setup interceptors for automatic token injection
setupInterceptors() {
  client.interceptors.request.use((config) => {
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }
    return config;
  });
}
```

### State Management Pattern
```typescript
// Zustand for minimal, efficient state
const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (token, user) => set({ isAuthenticated: true, token, user }),
  logout: () => set({ isAuthenticated: false, user: null, token: null }),
}));

// Use anywhere with hook
const { isAuthenticated } = useAuthStore();
```

### Error Handling Pattern
```typescript
// Custom error classes for type-safe error handling
class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

// Centralized error middleware
const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  res.status(500).json({ message: 'Internal error' });
};
```

### Async Handler Pattern
```typescript
// Wrap async route handlers to catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Use in routes
router.post('/create', asyncHandler(async (req, res) => {
  // Code here - errors automatically caught
}));
```

---

## 📈 Component Hierarchy

```
App
├── LoginPage
│   ├── Card
│   ├── Input
│   └── Button
│
└── DashboardPage
    ├── Header
    │   ├── User info
    │   └── Logout Button
    │
    ├── Month/Year Selector
    │   ├── Select (Month)
    │   └── Select (Year)
    │
    ├── SummaryCard
    │   ├── Total Income
    │   ├── Total Expenses
    │   ├── Total Fixed Pays
    │   └── Money Left
    │
    ├── BudgetForm
    │   ├── Input (Date)
    │   ├── Input (Income)
    │   ├── Input (Source)
    │   ├── Input (Expenses)
    │   ├── Input (Remarks)
    │   ├── Input (Fixed Pays)
    │   ├── Input (Fixed Remarks)
    │   └── Button (Submit)
    │
    ├── BudgetEntryList
    │   └── BudgetEntryItem (multiple)
    │       ├── Edit mode
    │       │   ├── Input fields
    │       │   ├── Button (Save)
    │       │   └── Button (Cancel)
    │       │
    │       └── View mode
    │           ├── Date display
    │           ├── Income display
    │           ├── Expense display
    │           ├── Fixed pays display
    │           ├── Button (Edit)
    │           └── Button (Delete)
    │
    └── Footer
```

---

## 🔄 State Flow

### Global State (Zustand)
```
AuthStore
├── isAuthenticated: boolean
├── user: { name: string } | null
├── token: string | null
├── setAuth(token, user): void
├── logout(): void
└── checkAuth(): void

BudgetStore
├── entries: BudgetEntry[]
├── totals: { income, expenses, fixedPays }
├── left: number
├── month: number
├── year: number
├── setEntries(summary): void
├── setMonth(month): void
├── setYear(year): void
├── addEntry(entry): void
├── updateEntry(entry): void
└── removeEntry(id): void
```

### Local State (Component)
```
LoginPage
├── pin: string
├── userName: string
├── error: string
└── isLoading: boolean

BudgetForm
├── formData: { date, income, incomeSource, ... }
├── isLoading: boolean
└── error: string

BudgetEntryItem
├── isEditing: boolean
├── isSaving: boolean
├── isDeleting: boolean
├── error: string
└── formData: { updated entry fields }
```

---

## 🚀 Performance Optimizations

### Frontend
- **Code Splitting**: Vite automatically chunks code
- **Lazy Loading**: React.lazy() for page components
- **State Optimization**: Only subscribe to needed state
- **Memoization**: React.memo() for expensive components
- **CSS Optimization**: Tailwind PurgeCSS removes unused styles

### Backend
- **Database Indexing**: (year, month, date) index on entries
- **Connection Pooling**: Mongoose handles pooling
- **Request Validation**: Early validation prevents DB queries
- **Aggregation**: Server-side totals calculation
- **Caching**: Static config values

---

## 🔐 Security Measures

### Authentication
- PIN validation on every request
- Token format: "PIN:USERNAME"
- Token stored in localStorage
- Bearer token in Authorization header

### Authorization
- Middleware checks token before processing
- Returns 401 for invalid/missing token
- Each user isolated to their PIN

### Input Validation
- Type checking with TypeScript
- Number validation (non-negative)
- Month validation (1-12)
- String trimming

### Error Handling
- No sensitive data in error messages
- Stack traces only in development
- Centralized error logging

---

## 📝 File Size Overview

```
Backend:
  dist/index.js              ~30KB (compiled)
  node_modules              ~200MB (dependencies)
  src/                       ~15KB (source)

Frontend:
  dist/                      ~150KB (minified + gzipped)
  node_modules              ~500MB (dependencies)
  src/                       ~50KB (source)
```

---

## 🔄 Request/Response Examples

### Login Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "pin": "1234",
  "userName": "Kartik Upadhyay"
}

Response:
{
  "success": true,
  "data": {
    "token": "1234:Kartik Upadhyay",
    "user": { "name": "Kartik Upadhyay" }
  }
}
```

### Create Entry Request
```http
POST /api/budget/entries
Authorization: Bearer 1234:Kartik Upadhyay
Content-Type: application/json

{
  "date": "2026-02-05",
  "income": 50000,
  "incomeSource": "Salary",
  "expenses": 500,
  "expenseRemarks": "Groceries",
  "fixedPays": 15000,
  "fixedPaysRemarks": "Rent"
}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "date": "2026-02-05T00:00:00.000Z",
    "income": 50000,
    "month": 2,
    "year": 2026,
    ...
  }
}
```

### Get Entries Request
```http
GET /api/budget/entries?month=2&year=2026
Authorization: Bearer 1234:Kartik Upadhyay

Response:
{
  "success": true,
  "data": {
    "entries": [ ... ],
    "totals": {
      "income": 100000,
      "expenses": 5000,
      "fixedPays": 30000
    },
    "left": 65000
  }
}
```

---

## 🧪 Testing Scenarios

### Login Flow
1. Empty PIN → validation error
2. Wrong PIN → authentication error
3. Wrong name → authentication error
4. Correct credentials → successful login

### Budget Entry
1. Missing date → validation error
2. Negative amount → validation error
3. Valid entry → success + UI update
4. Edit entry → updates in DB and UI
5. Delete entry → removes from DB and UI

### Month Navigation
1. Change month → fetches new data
2. Change year → fetches new data
3. No entries for month → empty state
4. Multiple entries → sorted by date

---

This architecture is designed to be:
- **Scalable**: Easy to add new features
- **Maintainable**: Clear separation of concerns
- **Type-Safe**: Full TypeScript coverage
- **Performant**: Optimized queries and caching
- **Secure**: Input validation and auth checks
