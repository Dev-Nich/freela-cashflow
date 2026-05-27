import { statusLabels, statusStyles, type FinancialStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: FinancialStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium leading-5",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
