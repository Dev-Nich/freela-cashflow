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
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-[#8B6418]",
  info: "bg-info/10 text-info",
};

export function SummaryCard({ title, value, helper, icon: Icon, tone }: SummaryCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-muted">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-ink">
            {formatCurrency(value)}
          </p>
          <p className="mt-1 text-xs text-ink-muted">{helper}</p>
        </div>
        <span className={cn("rounded-lg p-2", toneStyles[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
}
