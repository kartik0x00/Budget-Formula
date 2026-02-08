import { Router, Request, Response } from 'express';
import BudgetEntry, { IBudgetEntry } from '../models/BudgetEntry.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

const router = Router();

// Validation helper
const validateBudgetEntry = (data: any) => {
  if (data.income !== undefined && (typeof data.income !== 'number' || data.income < 0)) {
    throw new ValidationError('Income must be a non-negative number');
  }
  if (data.expenses !== undefined && (typeof data.expenses !== 'number' || data.expenses < 0)) {
    throw new ValidationError('Expenses must be a non-negative number');
  }
  if (data.fixedPays !== undefined && (typeof data.fixedPays !== 'number' || data.fixedPays < 0)) {
    throw new ValidationError('Fixed pays must be a non-negative number');
  }
  if (data.month !== undefined && (data.month < 1 || data.month > 12)) {
    throw new ValidationError('Month must be between 1 and 12');
  }
  if (data.year !== undefined && data.year < 1900) {
    throw new ValidationError('Year must be valid');
  }
};

// Get budget entries for a specific month/year
router.get(
  '/entries',
  asyncHandler(async (req: Request, res: Response) => {
    const { month, year } = req.query;

    if (!month || !year) {
      throw new ValidationError('Month and year are required');
    }

    const monthNum = parseInt(month as string, 10);
    const yearNum = parseInt(year as string, 10);

    if (isNaN(monthNum) || isNaN(yearNum)) {
      throw new ValidationError('Invalid month or year');
    }

    const entries = await BudgetEntry.find({ month: monthNum, year: yearNum }).sort({
      date: 1,
    });

    // Calculate totals
    const totals = entries.reduce(
      (acc, entry) => ({
        income: acc.income + entry.income,
        expenses: acc.expenses + entry.expenses,
        fixedPays: acc.fixedPays + entry.fixedPays,
      }),
      { income: 0, expenses: 0, fixedPays: 0 }
    );

    const leftAmount = totals.income - totals.expenses - totals.fixedPays;

    res.json({
      success: true,
      data: {
        entries,
        totals,
        left: leftAmount,
      },
    });
  })
);

// Get single entry
router.get(
  '/entries/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const entry = await BudgetEntry.findById(req.params.id);

    if (!entry) {
      throw new NotFoundError('Budget entry not found');
    }

    res.json({
      success: true,
      data: entry,
    });
  })
);

// Create budget entry
router.post(
  '/entries',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      date,
      income,
      incomeSource,
      expenses,
      expenseRemarks,
      fixedPays,
      fixedPaysRemarks,
    } = req.body;

    if (!date) {
      throw new ValidationError('Date is required');
    }

    const entryDate = new Date(date);
    const month = entryDate.getMonth() + 1;
    const year = entryDate.getFullYear();

    const entryData = {
      date: entryDate,
      income: income || 0,
      incomeSource: incomeSource || '',
      expenses: expenses || 0,
      expenseRemarks: expenseRemarks || '',
      fixedPays: fixedPays || 0,
      fixedPaysRemarks: fixedPaysRemarks || '',
      month,
      year,
    };

    validateBudgetEntry(entryData);

    const entry = new BudgetEntry(entryData);
    await entry.save();

    res.status(201).json({
      success: true,
      data: entry,
    });
  })
);

// Update budget entry
router.put(
  '/entries/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { date, income, incomeSource, expenses, expenseRemarks, fixedPays, fixedPaysRemarks } =
      req.body;

    const entry = await BudgetEntry.findById(req.params.id);

    if (!entry) {
      throw new NotFoundError('Budget entry not found');
    }

    // Update fields if provided
    if (date) {
      const entryDate = new Date(date);
      entry.date = entryDate;
      entry.month = entryDate.getMonth() + 1;
      entry.year = entryDate.getFullYear();
    }

    if (income !== undefined) entry.income = income;
    if (incomeSource !== undefined) entry.incomeSource = incomeSource;
    if (expenses !== undefined) entry.expenses = expenses;
    if (expenseRemarks !== undefined) entry.expenseRemarks = expenseRemarks;
    if (fixedPays !== undefined) entry.fixedPays = fixedPays;
    if (fixedPaysRemarks !== undefined) entry.fixedPaysRemarks = fixedPaysRemarks;

    validateBudgetEntry({
      income: entry.income,
      expenses: entry.expenses,
      fixedPays: entry.fixedPays,
    });

    await entry.save();

    res.json({
      success: true,
      data: entry,
    });
  })
);

// Delete budget entry
router.delete(
  '/entries/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const entry = await BudgetEntry.findByIdAndDelete(req.params.id);

    if (!entry) {
      throw new NotFoundError('Budget entry not found');
    }

    res.json({
      success: true,
      message: 'Budget entry deleted successfully',
    });
  })
);

// Get available months/years for navigation
router.get(
  '/available-dates',
  asyncHandler(async (req: Request, res: Response) => {
    const entries = await BudgetEntry.find().select('month year').distinct('year');
    const availableDates = await BudgetEntry.aggregate([
      { $group: { _id: { year: '$year', month: '$month' } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);

    res.json({
      success: true,
      data: availableDates,
    });
  })
);

export default router;
