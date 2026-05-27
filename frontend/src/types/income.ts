export type IncomeStatus = "EXPECTED" | "RECEIVED" | "CANCELED";

export interface Income {
  id: string;
  description: string;
  amount: number;
  expectedDate: string;
  receivedDate: string | null;
  status: IncomeStatus;
  source: string | null;
  createdAt: string;
  updatedAt: string;
}
