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
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Renda comprometida
          </p>
          <p className="mt-2 text-2xl font-semibold text-ink">{percentage.toFixed(1)}%</p>
        </div>
        <span
          className={cn(
            "rounded-md border px-2 py-0.5 text-[11px] font-medium leading-5",
            isTight && "border-[#f0d0d0] bg-[#fbeaea] text-[#b34a4a]",
            isAttention && "border-[#f1dfaa] bg-[#fff4d6] text-[#9a6b13]",
            !isTight && !isAttention && "border-[#d7eadf] bg-[#eaf5ef] text-[#2f7d5c]",
          )}
        >
          {getCommitmentMessage(percentage)}
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
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
        Você ainda tem{" "}
        {pendingExpenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} em
        despesas pendentes este mês.
      </p>
    </Card>
  );
}
