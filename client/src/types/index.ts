export interface BudgetEntry {
  _id: string;
  date: string;
  income: number;
  incomeSource: string;
  expenses: number;
  expenseRemarks: string;
  fixedPays: number;
  fixedPaysRemarks: string;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSummary {
  entries: BudgetEntry[];
  totals: {
    income: number;
    expenses: number;
    fixedPays: number;
  };
  left: number;
}

export interface User {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
