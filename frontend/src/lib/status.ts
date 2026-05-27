import type { ExpenseStatus } from "@/types/expense";
import type { IncomeStatus } from "@/types/income";

export type FinancialStatus = IncomeStatus | ExpenseStatus;

export const statusLabels: Record<FinancialStatus, string> = {
  EXPECTED: "Previsto",
  RECEIVED: "Recebido",
  PENDING: "Pendente",
  PAID: "Pago",
  OVERDUE: "Vencido",
  CANCELED: "Cancelado",
};

export const statusStyles: Record<FinancialStatus, string> = {
  EXPECTED:
    "border-[#d8e7f1] bg-[#eaf2f8] text-[#3e6d91] dark:border-info/20 dark:bg-info/10 dark:text-info",
  RECEIVED:
    "border-[#d7eadf] bg-[#eaf5ef] text-[#2f7d5c] dark:border-success/20 dark:bg-success/10 dark:text-success",
  PENDING:
    "border-[#f1dfaa] bg-[#fff4d6] text-[#9a6b13] dark:border-warning/20 dark:bg-warning/10 dark:text-warning",
  PAID:
    "border-[#d7eadf] bg-[#eaf5ef] text-[#2f7d5c] dark:border-success/20 dark:bg-success/10 dark:text-success",
  OVERDUE:
    "border-[#f0d0d0] bg-[#fbeaea] text-[#b34a4a] dark:border-destructive/20 dark:bg-destructive/10 dark:text-destructive",
  CANCELED: "border-border bg-muted text-ink-muted",
};

export function getCommitmentMessage(percentage: number) {
  if (percentage >= 70) {
    return "Atenção: seu mês está apertado.";
  }

  if (percentage >= 45) {
    return "Boa parte da sua renda já está comprometida.";
  }

  return "Seu mês está saudável.";
}
