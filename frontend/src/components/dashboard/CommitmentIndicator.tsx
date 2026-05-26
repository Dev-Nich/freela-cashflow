import { Card } from "@/components/ui/card";
import { getCommitmentMessage } from "@/lib/status";
import { cn } from "@/lib/utils";

interface CommitmentIndicatorProps {
  percentage: number;
  pendingExpenses: number;
}

export function CommitmentIndicator({ percentage, pendingExpenses }: CommitmentIndicatorProps) {
  const normalized = Math.min(Math.max(percentage, 0), 100);
  const isTight = percentage >= 70;
  const isAttention = percentage >= 45 && percentage < 70;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink-muted">Renda comprometida</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{percentage.toFixed(1)}%</p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            isTight && "bg-destructive/10 text-destructive",
            isAttention && "bg-warning/15 text-[#8B6418]",
            !isTight && !isAttention && "bg-success/10 text-success",
          )}
        >
          {getCommitmentMessage(percentage)}
        </span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-background">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isTight && "bg-destructive",
            isAttention && "bg-warning",
            !isTight && !isAttention && "bg-success",
          )}
          style={{ width: `${normalized}%` }}
        />
      </div>

      <p className="mt-4 text-sm text-ink-muted">
        Você ainda tem {pendingExpenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} em despesas pendentes este mês.
      </p>
    </Card>
  );
}
