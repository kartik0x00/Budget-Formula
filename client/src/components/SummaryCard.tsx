import React from 'react';
import { Card } from './Card';
import { formatCurrency } from '../utils/helpers';

interface SummaryStats {
  totalIncome: number;
  totalExpenses: number;
  totalFixedPays: number;
  leftAmount: number;
}

interface SummaryCardProps {
  stats: SummaryStats;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ stats }) => {
  return (
    <Card className="mb-6 bg-zinc-900/50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</p>
        </div>
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-1">Expenses</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpenses)}</p>
        </div>
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-1">Fixed Pays</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.totalFixedPays)}</p>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-zinc-700 pt-4 md:pt-0 md:pl-4">
          <p className="text-zinc-400 text-sm font-medium mb-1">Left Amount</p>
          <p className={`text-2xl font-bold ${stats.leftAmount >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatCurrency(stats.leftAmount)}
          </p>
        </div>
      </div>
    </Card>
  );
};
