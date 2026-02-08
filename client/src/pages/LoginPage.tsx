import React, { useState } from 'react';
import { useAuthStore } from '../store/index';
import { apiClient } from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [pin, setPin] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!pin || !userName) {
        setError('PIN and username are required');
        return;
      }

      const response = await apiClient.login(pin, userName);
      apiClient.setToken(response.token);
      setAuth(response.token, response.user);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Budget Formula</h1>
          <p className="text-zinc-400">Personal Budget Tracker</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-900/20 border border-red-800 text-red-400 p-3 rounded-md text-sm">{error}</div>}

          <Input
            type="password"
            placeholder="Enter your PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            disabled={isLoading}
            maxLength={4}
            pattern="\d*"
          />

          <Input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={isLoading}
          />

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            {isLoading ? 'Authenticating...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 text-center">
            This app is for personal use only. Only Kartik Upadhyay can access it.
          </p>
        </div>
      </Card>
    </div>
  );
};
