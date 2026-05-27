import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: number;
  helper: string;
  icon: LucideIcon;
  tone: "primary" | "secondary" | "success" | "warning" | "info";
}

const toneStyles = {
  primary: "bg-accent text-primary",
  secondary: "bg-muted text-ink-muted",
  success: "bg-[#eaf5ef] text-[#2f7d5c] dark:bg-success/10 dark:text-success",
  warning: "bg-[#fff4d6] text-[#9a6b13] dark:bg-warning/10 dark:text-warning",
  info: "bg-[#eaf2f8] text-[#3e6d91] dark:bg-info/10 dark:text-info",
};

export function SummaryCard({ title, value, helper, icon: Icon, tone }: SummaryCardProps) {
  return (
    <Card className="p-4 transition-colors hover:border-[#d6d3ce] dark:hover:border-[#3a3a3a]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{title}</p>
          <p className="mt-2 text-xl font-semibold tracking-normal text-ink">
            {formatCurrency(value)}
          </p>
          <p className="mt-1 text-xs text-ink-muted">{helper}</p>
        </div>
        <span className={cn("rounded-md p-2", toneStyles[tone])}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </Card>
  );
}
