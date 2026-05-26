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
    <li className="flex items-center gap-3 rounded-lg border border-border bg-white p-3">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          isIncome ? "bg-success/10 text-success" : "bg-warning/15 text-[#8B6418]",
        )}
      >
        {isIncome ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="truncate text-sm font-semibold text-ink">{transaction.description}</p>
          <p className={cn("text-sm font-semibold", isIncome ? "text-success" : "text-ink")}>
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted">{transaction.detail}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-xs text-ink-muted">{formatDate(transaction.date)}</span>
          <StatusBadge status={transaction.status} />
        </div>
      </div>
    </li>
  );
}
