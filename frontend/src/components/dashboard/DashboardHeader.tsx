import { LogOut, MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthSelector } from "@/components/ui/month-selector";
import type { User } from "@/types/auth";

interface DashboardHeaderProps {
  user: User;
  month: number;
  year: number;
  onMonthChange: (month: number, year: number) => void;
  onLogout: () => void;
}

export function DashboardHeader({
  user,
  month,
  year,
  onMonthChange,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">Freela-CashFlow</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink">
          Olá, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">Veja seu mês financeiro com clareza.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <MonthSelector month={month} year={year} onChange={onMonthChange} />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <PlusCircle className="h-4 w-4" />
            Nova receita
          </Button>
          <Button variant="secondary" className="flex-1 sm:flex-none">
            <MinusCircle className="h-4 w-4" />
            Nova despesa
          </Button>
          <Button variant="ghost" className="h-11 w-11 px-0" aria-label="Sair" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
