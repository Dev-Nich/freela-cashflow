import { apiRequest } from "@/services/api";
import type { Income } from "@/types/income";

export function getIncomes(month: number, year: number) {
  return apiRequest<Income[]>(`/api/incomes?month=${month}&year=${year}`);
}

export function receiveIncome(incomeId: string, receivedDate: string) {
  return apiRequest<Income>(`/api/incomes/${incomeId}/receive`, {
    method: "PATCH",
    body: JSON.stringify({ receivedDate }),
  });
}
