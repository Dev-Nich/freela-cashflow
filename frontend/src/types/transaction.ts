import type { ExpenseStatus } from "@/types/expense";
import type { IncomeStatus } from "@/types/income";

export type TransactionType = "income" | "expense";
export type TransactionStatus = IncomeStatus | ExpenseStatus;

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  description: string;
  detail: string;
  date: string;
  amount: number;
  status: TransactionStatus;
}
