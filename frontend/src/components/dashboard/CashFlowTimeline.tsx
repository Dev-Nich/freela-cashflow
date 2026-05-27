import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatShortDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { FinancialTransaction } from "@/types/transaction";

interface CashFlowTimelineProps {
  transactions: FinancialTransaction[];
}

export function CashFlowTimeline({ transactions }: CashFlowTimelineProps) {
  const items = transactions.slice().sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card className="p-4">
      <div className="mb-4">
        <p className="text-sm font-semibold text-ink">Fluxo do mês</p>
        <p className="mt-1 text-sm text-ink-muted">Previsão e realidade em ordem cronológica.</p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${item.type}-${item.id}`} className="grid grid-cols-[4rem_1rem_1fr] gap-3">
            <p className="pt-0.5 text-xs font-medium text-ink-muted">{formatShortDate(item.date)}</p>
            <div className="relative flex justify-center">
              <span
                className={cn(
                  "mt-1 h-2.5 w-2.5 rounded-full border-2 bg-surface",
                  item.type === "income" ? "border-success" : "border-warning",
                )}
              />
              {index < items.length - 1 && (
                <span className="absolute top-5 h-[calc(100%+0.1rem)] w-px bg-border" />
              )}
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{item.description}</p>
                  <p className="mt-1 text-xs text-ink-muted">{item.detail}</p>
                </div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    item.type === "income" ? "text-success" : "text-ink",
                  )}
                >
                  {item.type === "income" ? "+" : "-"}
                  {formatCurrency(item.amount)}
                </p>
              </div>
              <div className="mt-2">
                <StatusBadge status={item.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
