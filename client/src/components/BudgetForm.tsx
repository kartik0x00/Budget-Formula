import React, { useState } from 'react';
import { apiClient } from '../services/api';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';

interface BudgetFormProps {
  onEntryAdded: () => void;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ onEntryAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    income: '',
    incomeSource: '',
    expenses: '',
    expenseRemarks: '',
    fixedPays: '',
    fixedPaysRemarks: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await apiClient.createBudgetEntry({
        date: formData.date,
        income: formData.income ? parseInt(formData.income, 10) : 0,
        incomeSource: formData.incomeSource,
        expenses: formData.expenses ? parseInt(formData.expenses, 10) : 0,
        expenseRemarks: formData.expenseRemarks,
        fixedPays: formData.fixedPays ? parseInt(formData.fixedPays, 10) : 0,
        fixedPaysRemarks: formData.fixedPaysRemarks,
      });

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        income: '',
        incomeSource: '',
        expenses: '',
        expenseRemarks: '',
        fixedPays: '',
        fixedPaysRemarks: '',
      });

      onEntryAdded();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Add Budget Entry" className="mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-900/20 border border-red-800 text-red-400 p-3 rounded-md text-sm">{error}</div>}

        {/* Date Field */}
        <div className="max-w-xs">
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={isLoading}
            label="Date"
          />
        </div>

        {/* Three Column Layout: Income | Expenses | Fixed Pays */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Income Column */}
          <div className="rounded-lg p-4 border border-green-900/50 space-y-3">
            <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Income</p>
            <Input
              type="number"
              name="income"
              placeholder="Amount"
              value={formData.income}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              label="Amount (₹)"
            />
            <Input
              type="text"
              name="incomeSource"
              placeholder="e.g., Salary, Freelance"
              value={formData.incomeSource}
              onChange={handleChange}
              disabled={isLoading}
              label="Source / Remarks"
            />
          </div>

          {/* Expenses Column */}
          <div className="rounded-lg p-4 border border-red-900/50 space-y-3">
            <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">Expenses</p>
            <Input
              type="number"
              name="expenses"
              placeholder="Amount"
              value={formData.expenses}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              label="Amount (₹)"
            />
            <Input
              type="text"
              name="expenseRemarks"
              placeholder="e.g., Groceries, Transport"
              value={formData.expenseRemarks}
              onChange={handleChange}
              disabled={isLoading}
              label="Remarks"
            />
          </div>

          {/* Fixed Pays Column */}
          <div className="rounded-lg p-4 border border-orange-900/50 space-y-3">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Fixed Pays</p>
            <Input
              type="number"
              name="fixedPays"
              placeholder="Amount"
              value={formData.fixedPays}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              label="Amount (₹)"
            />
            <Input
              type="text"
              name="fixedPaysRemarks"
              placeholder="e.g., Rent, Bills, Insurance"
              value={formData.fixedPaysRemarks}
              onChange={handleChange}
              disabled={isLoading}
              label="Remarks"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
          {isLoading ? 'Adding...' : 'Add Entry'}
        </Button>
      </form>
    </Card>
  );
};
