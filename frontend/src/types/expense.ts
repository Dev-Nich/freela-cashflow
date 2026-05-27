export type ExpenseStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELED";

export interface Expense {
  id: string;
  categoryId: string;
  description: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: ExpenseStatus;
  fixed: boolean;
  createdAt: string;
  updatedAt: string;
}
