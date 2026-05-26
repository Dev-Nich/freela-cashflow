import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AlertCardProps {
  overdueCount: number;
}

export function AlertCard({ overdueCount }: AlertCardProps) {
  if (overdueCount === 0) {
    return null;
  }

  return (
    <Card className="border-destructive/25 bg-destructive/5 p-4">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
        <div>
          <p className="text-sm font-semibold text-ink">Você tem despesas vencidas</p>
          <p className="mt-1 text-sm text-ink-muted">
            Resolva {overdueCount} {overdueCount === 1 ? "pendência" : "pendências"} para manter o mês sob controle.
          </p>
        </div>
      </div>
    </Card>
  );
}
