import mongoose, { Schema, Document } from 'mongoose';

export interface IBudgetEntry extends Document {
  date: Date;
  income: number;
  incomeSource: string;
  expenses: number;
  expenseRemarks: string;
  fixedPays: number;
  fixedPaysRemarks: string;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetEntrySchema = new Schema(
  {
    date: { type: Date, required: true },
    income: { type: Number, default: 0, min: 0 },
    incomeSource: { type: String, default: '' },
    expenses: { type: Number, default: 0, min: 0 },
    expenseRemarks: { type: String, default: '' },
    fixedPays: { type: Number, default: 0, min: 0 },
    fixedPaysRemarks: { type: String, default: '' },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

// Index for efficient queries
BudgetEntrySchema.index({ year: 1, month: 1, date: 1 });

export default mongoose.model<IBudgetEntry>('BudgetEntry', BudgetEntrySchema);
