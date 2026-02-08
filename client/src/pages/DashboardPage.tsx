import React, { useState, useEffect } from 'react';
import { useAuthStore, useBudgetStore } from '../store/index';
import { apiClient } from '../services/api';
import { BudgetForm } from '../components/BudgetForm';
import { BudgetEntryItem } from '../components/BudgetEntryItem';
import { SummaryCard } from '../components/SummaryCard';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Card } from '../components/Card';
import { getMonthName } from '../utils/helpers';

interface DashboardPageProps {
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const { month, year, entries, totals, left, setMonth, setYear, setEntries } = useBudgetStore();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get current year and future years for dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map((y) => ({
    value: y.toString(),
    label: y.toString(),
  }));

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: getMonthName(i + 1),
  }));

  const loadBudgetData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const summary = await apiClient.getBudgetEntries(month, year);
      setEntries(summary);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load budget data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetData();
  }, [month, year]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(parseInt(e.target.value, 10));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value, 10));
  };

  const handleLogout = () => {
    apiClient.clearToken();
    useAuthStore.setState({ isAuthenticated: false, user: null, token: null });
    onLogout();
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-zinc-100">Budget Formula</h1>
            <p className="text-sm text-zinc-400">{user?.name}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Month/Year Selector */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-lg font-semibold text-zinc-100">
                {getMonthName(month)} {year}
              </h2>
              <p className="text-sm text-zinc-400">Select month and year to view/manage your budget</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="flex-1 md:flex-none">
                <Select
                  options={monthOptions}
                  value={month.toString()}
                  onChange={handleMonthChange}
                  disabled={isLoading}
                />
              </div>
              <div className="flex-1 md:flex-none">
                <Select
                  options={yearOptions}
                  value={year.toString()}
                  onChange={handleYearChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </Card>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin">
              <div className="w-8 h-8 border-4 border-zinc-700 border-t-zinc-100 rounded-full"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <SummaryCard
              stats={{
                totalIncome: totals.income,
                totalExpenses: totals.expenses,
                totalFixedPays: totals.fixedPays,
                leftAmount: left,
              }}
            />

            {/* Add Entry Form */}
            <BudgetForm onEntryAdded={loadBudgetData} />

            {/* Budget Entries List */}
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                Budget Entries ({entries.length})
              </h2>

              {entries.length === 0 ? (
                <Card>
                  <p className="text-center text-zinc-400">No entries for this month. Start by adding one!</p>
                </Card>
              ) : (
                <div>
                  {entries.map((entry) => (
                    <BudgetEntryItem
                      key={entry._id}
                      entry={entry}
                      onUpdated={loadBudgetData}
                      onDeleted={loadBudgetData}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-zinc-500">
          <p>© 2026 Budget Formula "Built by Kartik Upadhyay for Kartik Upadhyay"</p>
        </div>
      </footer>
    </div>
  );
};
