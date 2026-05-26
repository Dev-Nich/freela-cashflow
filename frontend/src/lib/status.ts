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
  EXPECTED: "border-info/20 bg-info/10 text-info",
  RECEIVED: "border-success/20 bg-success/10 text-success",
  PENDING: "border-warning/25 bg-warning/15 text-[#8B6418]",
  PAID: "border-success/20 bg-success/10 text-success",
  OVERDUE: "border-destructive/20 bg-destructive/10 text-destructive",
  CANCELED: "border-ink-muted/20 bg-ink-muted/10 text-ink-muted",
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
