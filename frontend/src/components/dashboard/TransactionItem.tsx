import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { FinancialTransaction } from "@/types/transaction";

interface TransactionItemProps {
  transaction: FinancialTransaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncome = transaction.type === "income";

  return (
    <li className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5 transition-colors hover:border-[#d6d3ce] dark:hover:border-[#3a3a3a]">
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          isIncome
            ? "bg-[#eaf5ef] text-[#2f7d5c] dark:bg-success/10 dark:text-success"
            : "bg-[#fff4d6] text-[#9a6b13] dark:bg-warning/10 dark:text-warning",
        )}
      >
        {isIncome ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="truncate text-sm font-medium text-ink">{transaction.description}</p>
          <p className={cn("text-sm font-semibold", isIncome ? "text-success" : "text-ink")}>
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted">{transaction.detail}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-xs text-ink-muted">{formatDate(transaction.date)}</span>
          <StatusBadge status={transaction.status} />
        </div>
      </div>
    </li>
  );
}
