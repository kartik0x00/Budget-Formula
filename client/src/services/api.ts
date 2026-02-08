import axios, { AxiosInstance } from 'axios';
import { BudgetEntry, BudgetSummary, AuthResponse, ApiResponse } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.token = localStorage.getItem('token');
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getToken() {
    return this.token;
  }

  // Auth endpoints
  async login(pin: string, userName: string): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', {
      pin,
      userName,
    });
    return response.data.data!;
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await this.client.post<ApiResponse<{ user: { name: string } }>>(
        '/auth/verify',
        { token }
      );
      return response.data.success;
    } catch {
      return false;
    }
  }

  async getMe() {
    const response = await this.client.get<ApiResponse<{ user: { name: string } }>>('/auth/me');
    return response.data.data!.user;
  }

  // Budget endpoints
  async getBudgetEntries(month: number, year: number): Promise<BudgetSummary> {
    const response = await this.client.get<ApiResponse<BudgetSummary>>('/budget/entries', {
      params: { month, year },
    });
    return response.data.data!;
  }

  async createBudgetEntry(entry: Omit<BudgetEntry, '_id' | 'createdAt' | 'updatedAt' | 'month' | 'year'>): Promise<BudgetEntry> {
    const response = await this.client.post<ApiResponse<BudgetEntry>>('/budget/entries', entry);
    return response.data.data!;
  }

  async updateBudgetEntry(
    id: string,
    updates: Partial<Omit<BudgetEntry, '_id' | 'createdAt' | 'updatedAt' | 'month' | 'year'>>
  ): Promise<BudgetEntry> {
    const response = await this.client.put<ApiResponse<BudgetEntry>>(
      `/budget/entries/${id}`,
      updates
    );
    return response.data.data!;
  }

  async deleteBudgetEntry(id: string): Promise<void> {
    await this.client.delete(`/budget/entries/${id}`);
  }

  async getAvailableDates(): Promise<Array<{ _id: { year: number; month: number } }>> {
    const response = await this.client.get<ApiResponse<Array<{ _id: { year: number; month: number } }>>>('/budget/available-dates');
    return response.data.data!;
  }
}

export const apiClient = new ApiClient();
