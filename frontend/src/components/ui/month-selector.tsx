import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthName } from "@/lib/formatters";
import { Button } from "@/components/ui/button";

interface MonthSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export function MonthSelector({ month, year, onChange }: MonthSelectorProps) {
  function move(delta: number) {
    const date = new Date(year, month - 1 + delta, 1);
    onChange(date.getMonth() + 1, date.getFullYear());
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-transparent p-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 px-0"
        aria-label="Mês anterior"
        onClick={() => move(-1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="min-w-32 px-2 text-center">
        <p className="text-sm font-medium capitalize text-ink">{getMonthName(month)}</p>
        <p className="text-xs text-ink-muted">{year}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 px-0"
        aria-label="Próximo mês"
        onClick={() => move(1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
