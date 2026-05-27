export interface MonthlySummary {
  month: number;
  year: number;
  expectedIncome: number;
  receivedIncome: number;
  expectedExpenses: number;
  paidExpenses: number;
  pendingExpenses: number;
  expectedBalance: number;
  realBalance: number;
  committedIncomePercentage: number;
}
