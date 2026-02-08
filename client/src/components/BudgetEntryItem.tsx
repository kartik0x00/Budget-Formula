import React, { useState } from 'react';
import { BudgetEntry } from '../types/index';
import { apiClient } from '../services/api';
import { formatDate, formatCurrency } from '../utils/helpers';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';

interface BudgetEntryItemProps {
  entry: BudgetEntry;
  onUpdated: () => void;
  onDeleted: () => void;
}

export const BudgetEntryItem: React.FC<BudgetEntryItemProps> = ({ entry, onUpdated, onDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    income: entry.income.toString(),
    incomeSource: entry.incomeSource,
    expenses: entry.expenses.toString(),
    expenseRemarks: entry.expenseRemarks,
    fixedPays: entry.fixedPays.toString(),
    fixedPaysRemarks: entry.fixedPaysRemarks,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    setIsSaving(true);

    try {
      await apiClient.updateBudgetEntry(entry._id, {
        income: formData.income ? parseInt(formData.income, 10) : 0,
        incomeSource: formData.incomeSource,
        expenses: formData.expenses ? parseInt(formData.expenses, 10) : 0,
        expenseRemarks: formData.expenseRemarks,
        fixedPays: formData.fixedPays ? parseInt(formData.fixedPays, 10) : 0,
        fixedPaysRemarks: formData.fixedPaysRemarks,
      });
      setIsEditing(false);
      onUpdated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    setError('');
    setIsDeleting(true);

    try {
      await apiClient.deleteBudgetEntry(entry._id);
      onDeleted();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete entry');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="mb-4">
        {error && <div className="bg-red-900/20 border border-red-800 text-red-400 p-3 rounded-md text-sm mb-4">{error}</div>}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              disabled={isSaving}
              label="Income"
            />
            <Input
              type="text"
              name="incomeSource"
              value={formData.incomeSource}
              onChange={handleChange}
              disabled={isSaving}
              label="Income Source"
            />
            <Input
              type="number"
              name="expenses"
              value={formData.expenses}
              onChange={handleChange}
              disabled={isSaving}
              label="Expenses"
            />
            <Input
              type="text"
              name="expenseRemarks"
              value={formData.expenseRemarks}
              onChange={handleChange}
              disabled={isSaving}
              label="Expense Remarks"
            />
            <Input
              type="number"
              name="fixedPays"
              value={formData.fixedPays}
              onChange={handleChange}
              disabled={isSaving}
              label="Fixed Pays"
            />
            <Input
              type="text"
              name="fixedPaysRemarks"
              value={formData.fixedPaysRemarks}
              onChange={handleChange}
              disabled={isSaving}
              label="Fixed Pays Remarks"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving}>
              Save
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-400">Date</p>
            <p className="font-semibold text-zinc-100">{formatDate(entry.date)}</p>
          </div>
          {entry.income > 0 && (
            <div>
              <p className="text-zinc-400">Income</p>
              <p className="font-semibold text-green-600">{formatCurrency(entry.income)}</p>
              {entry.incomeSource && <p className="text-xs text-zinc-500">{entry.incomeSource}</p>}
            </div>
          )}
          {entry.expenses > 0 && (
            <div>
              <p className="text-zinc-400">Expenses</p>
              <p className="font-semibold text-red-600">{formatCurrency(entry.expenses)}</p>
              {entry.expenseRemarks && <p className="text-xs text-zinc-500">{entry.expenseRemarks}</p>}
            </div>
          )}
          {entry.fixedPays > 0 && (
            <div>
              <p className="text-zinc-400">Fixed Pays</p>
              <p className="font-semibold text-orange-600">{formatCurrency(entry.fixedPays)}</p>
              {entry.fixedPaysRemarks && <p className="text-xs text-zinc-500">{entry.fixedPaysRemarks}</p>}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)} disabled={isDeleting}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};
