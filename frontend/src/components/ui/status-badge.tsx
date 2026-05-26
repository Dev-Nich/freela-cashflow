import { statusLabels, statusStyles, type FinancialStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: FinancialStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
