import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AlertCardProps {
  overdueCount: number;
  pendingCount: number;
  onResolveClick: () => void;
}

export function AlertCard({ overdueCount, pendingCount, onResolveClick }: AlertCardProps) {
  const totalCount = overdueCount + pendingCount;

  if (totalCount === 0) {
    return null;
  }

  return (
    <Card className="border-[#f0d0d0] bg-[#fbeaea] p-3 dark:border-destructive/20 dark:bg-destructive/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-[#b34a4a] dark:text-destructive" />
          <div>
            <p className="text-sm font-medium text-ink">Você tem pendências no mês</p>
            <p className="mt-1 text-sm text-ink-muted">
              Resolva {totalCount} {totalCount === 1 ? "pendência" : "pendências"} para manter o
              mês sob controle.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onResolveClick}>
          Resolver pendências
        </Button>
      </div>
    </Card>
  );
}
