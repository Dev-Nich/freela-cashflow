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
    <Card className="p-5">
      <div className="mb-5">
        <p className="text-base font-semibold text-ink">Fluxo do mês</p>
        <p className="mt-1 text-sm text-ink-muted">Previsão e realidade em ordem cronológica.</p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${item.type}-${item.id}`} className="grid grid-cols-[4.5rem_1rem_1fr] gap-3">
            <p className="pt-1 text-xs font-medium text-ink-muted">{formatShortDate(item.date)}</p>
            <div className="relative flex justify-center">
              <span
                className={cn(
                  "mt-1 h-3 w-3 rounded-full border-2 bg-white",
                  item.type === "income" ? "border-success" : "border-warning",
                )}
              />
              {index < items.length - 1 && <span className="absolute top-5 h-[calc(100%+0.25rem)] w-px bg-border" />}
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-ink">{item.description}</p>
                  <p className="mt-1 text-xs text-ink-muted">{item.detail}</p>
                </div>
                <p className={cn("text-sm font-semibold", item.type === "income" ? "text-success" : "text-ink")}>
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
