import { LogOut, MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassButton } from "@/components/ui/liquid-glass";
import { MonthSelector } from "@/components/ui/month-selector";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { Theme } from "@/hooks/useTheme";
import type { User } from "@/types/auth";

interface DashboardHeaderProps {
  user: User;
  theme: Theme;
  month: number;
  year: number;
  onMonthChange: (month: number, year: number) => void;
  onThemeToggle: () => void;
  onLogout: () => void;
  onNewIncome: () => void;
  onNewExpense: () => void;
}

export function DashboardHeader({
  user,
  theme,
  month,
  year,
  onMonthChange,
  onThemeToggle,
  onLogout,
  onNewIncome,
  onNewExpense,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Freela-CashFlow</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink">
          Olá, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">Veja seu mês financeiro com clareza.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <MonthSelector month={month} year={year} onChange={onMonthChange} />
        <div className="flex flex-wrap gap-2">
          <GlassButton wrapperClassName="flex-1 sm:flex-none" onClick={onNewIncome}>
            <PlusCircle className="h-4 w-4" />
            Nova receita
          </GlassButton>
          <GlassButton wrapperClassName="flex-1 sm:flex-none" onClick={onNewExpense}>
            <MinusCircle className="h-4 w-4" />
            Nova despesa
          </GlassButton>
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          <Button variant="ghost" className="h-10 w-10 px-0" aria-label="Sair" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
