import { apiRequest } from "@/services/api";
import type { Expense } from "@/types/expense";

export interface CreateExpensePayload {
  categoryId: string;
  description: string;
  amount: number;
  dueDate: string;
  fixed: boolean;
}

export function getExpenses(month: number, year: number) {
  return apiRequest<Expense[]>(`/api/expenses?month=${month}&year=${year}`);
}

export function createExpense(payload: CreateExpensePayload) {
  return apiRequest<Expense>("/api/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function payExpense(expenseId: string, paidDate: string) {
  return apiRequest<Expense>(`/api/expenses/${expenseId}/pay`, {
    method: "PATCH",
    body: JSON.stringify({ paidDate }),
  });
}
