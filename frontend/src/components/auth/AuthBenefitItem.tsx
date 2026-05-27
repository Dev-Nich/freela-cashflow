import type { LucideIcon } from "lucide-react";

interface AuthBenefitItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function AuthBenefitItem({ icon: Icon, title, description }: AuthBenefitItemProps) {
  return (
    <div className="rounded-xl border border-border bg-surface/55 p-3.5 transition-colors hover:bg-surface/80">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-sm font-medium text-ink">{title}</p>
      <p className="mt-1 text-xs leading-5 text-ink-muted">{description}</p>
    </div>
  );
}
