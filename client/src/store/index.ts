import { create } from 'zustand';
import { User, BudgetEntry, BudgetSummary } from '../types/index';

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

interface BudgetStore {
  entries: BudgetEntry[];
  totals: {
    income: number;
    expenses: number;
    fixedPays: number;
  };
  left: number;
  month: number;
  year: number;
  setEntries: (summary: BudgetSummary) => void;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  addEntry: (entry: BudgetEntry) => void;
  updateEntry: (entry: BudgetEntry) => void;
  removeEntry: (id: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  token: localStorage.getItem('token'),
  setAuth: (token: string, user: User) => {
    set({ isAuthenticated: true, token, user });
  },
  logout: () => {
    set({ isAuthenticated: false, user: null, token: null });
  },
  checkAuth: () => {
    const token = localStorage.getItem('token');
    set({ isAuthenticated: !!token, token });
  },
}));

export const useBudgetStore = create<BudgetStore>((set) => {
  const today = new Date();
  return {
    entries: [],
    totals: { income: 0, expenses: 0, fixedPays: 0 },
    left: 0,
    month: today.getMonth() + 1,
    year: today.getFullYear(),
    setEntries: (summary: BudgetSummary) => {
      set({
        entries: summary.entries,
        totals: summary.totals,
        left: summary.left,
      });
    },
    setMonth: (month: number) => set({ month }),
    setYear: (year: number) => set({ year }),
    addEntry: (entry: BudgetEntry) => {
      set((state) => ({
        entries: [...state.entries, entry].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
        totals: {
          income: state.totals.income + entry.income,
          expenses: state.totals.expenses + entry.expenses,
          fixedPays: state.totals.fixedPays + entry.fixedPays,
        },
        left: state.left - (entry.expenses + entry.fixedPays) + entry.income,
      }));
    },
    updateEntry: (updatedEntry: BudgetEntry) => {
      set((state) => {
        const oldEntry = state.entries.find((e) => e._id === updatedEntry._id);
        if (!oldEntry) return state;

        const newEntries = state.entries.map((e) => (e._id === updatedEntry._id ? updatedEntry : e));
        const incomeDiff = updatedEntry.income - oldEntry.income;
        const expensesDiff = updatedEntry.expenses - oldEntry.expenses;
        const fixedPaysDiff = updatedEntry.fixedPays - oldEntry.fixedPays;

        return {
          entries: newEntries,
          totals: {
            income: state.totals.income + incomeDiff,
            expenses: state.totals.expenses + expensesDiff,
            fixedPays: state.totals.fixedPays + fixedPaysDiff,
          },
          left: state.left - (expensesDiff + fixedPaysDiff) + incomeDiff,
        };
      });
    },
    removeEntry: (id: string) => {
      set((state) => {
        const entry = state.entries.find((e) => e._id === id);
        if (!entry) return state;

        return {
          entries: state.entries.filter((e) => e._id !== id),
          totals: {
            income: state.totals.income - entry.income,
            expenses: state.totals.expenses - entry.expenses,
            fixedPays: state.totals.fixedPays - entry.fixedPays,
          },
          left: state.left + (entry.expenses + entry.fixedPays) - entry.income,
        };
      });
    },
  };
});
