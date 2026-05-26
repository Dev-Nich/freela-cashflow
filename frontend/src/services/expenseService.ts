import { apiRequest } from "@/services/api";
import type { Expense } from "@/types/expense";

export function getExpenses(month: number, year: number) {
  return apiRequest<Expense[]>(`/api/expenses?month=${month}&year=${year}`);
}

export function payExpense(expenseId: string, paidDate: string) {
  return apiRequest<Expense>(`/api/expenses/${expenseId}/pay`, {
    method: "PATCH",
    body: JSON.stringify({ paidDate }),
  });
}
