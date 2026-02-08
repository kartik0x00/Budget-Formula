import { useEffect, useState } from 'react';
import { useAuthStore } from './store/index';
import { apiClient } from './services/api';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import './index.css';

function App() {
  const { isAuthenticated, setAuth } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const isValid = await apiClient.verifyToken(token);
          if (isValid) {
            apiClient.setToken(token);
            const user = await apiClient.getMe();
            setAuth(token, user);
          } else {
            localStorage.removeItem('token');
          }
        } catch {
          localStorage.removeItem('token');
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [setAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-zinc-700 border-t-zinc-100 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <DashboardPage
          onLogout={() => {
            useAuthStore.setState({ isAuthenticated: false, user: null, token: null });
          }}
        />
      ) : (
        <LoginPage
          onLoginSuccess={() => {
            useAuthStore.setState({ isAuthenticated: true });
          }}
        />
      )}
    </>
  );
}

export default App;
