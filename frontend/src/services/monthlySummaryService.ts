import { apiRequest } from "@/services/api";
import type { MonthlySummary } from "@/types/monthlySummary";

export function getMonthlySummary(month: number, year: number) {
  return apiRequest<MonthlySummary>(`/api/monthly-summary?month=${month}&year=${year}`);
}
