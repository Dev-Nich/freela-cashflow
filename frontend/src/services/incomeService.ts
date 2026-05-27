import { apiRequest } from "@/services/api";
import type { Income } from "@/types/income";

export interface CreateIncomePayload {
  description: string;
  amount: number;
  expectedDate: string;
  source?: string;
}

export function getIncomes(month: number, year: number) {
  return apiRequest<Income[]>(`/api/incomes?month=${month}&year=${year}`);
}

export function createIncome(payload: CreateIncomePayload) {
  return apiRequest<Income>("/api/incomes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function receiveIncome(incomeId: string, receivedDate: string) {
  return apiRequest<Income>(`/api/incomes/${incomeId}/receive`, {
    method: "PATCH",
    body: JSON.stringify({ receivedDate }),
  });
}
