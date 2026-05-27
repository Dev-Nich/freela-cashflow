import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { Expense } from "@/types/expense";
import type { Income } from "@/types/income";
import type { MonthlySummary } from "@/types/monthlySummary";
import type React from "react";

interface FinancialDashboardChartsProps {
  summary: MonthlySummary;
  incomes: Income[];
  expenses: Expense[];
  categories: Category[];
}

interface ChartBar {
  label: string;
  value: number;
  tone: "success" | "warning" | "info" | "danger";
}

const barToneStyles = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  danger: "bg-destructive",
};

export function FinancialDashboardCharts({
  summary,
  incomes,
  expenses,
  categories,
}: FinancialDashboardChartsProps) {
  const balanceBars: ChartBar[] = [
    { label: "Receita recebida", value: summary.receivedIncome, tone: "success" },
    { label: "Despesas pagas", value: summary.paidExpenses, tone: "warning" },
    { label: "Saldo real", value: Math.max(summary.realBalance, 0), tone: "info" },
  ];

  const statusBars: ChartBar[] = [
    { label: "Receitas previstas", value: sumByStatus(incomes, "EXPECTED"), tone: "info" },
    { label: "Receitas recebidas", value: sumByStatus(incomes, "RECEIVED"), tone: "success" },
    { label: "Despesas pendentes", value: sumByStatus(expenses, "PENDING"), tone: "warning" },
    { label: "Despesas vencidas", value: sumByStatus(expenses, "OVERDUE"), tone: "danger" },
  ];

  const categoryBars = buildCategoryBars(expenses, categories).slice(0, 5);

  return (
    <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="p-4">
        <ChartHeader
          icon={BarChart3}
          title="Visão do mês"
          description="Comparativo entre entrada, saída e saldo real."
        />
        <div className="mt-5 space-y-4">
          {balanceBars.map((bar) => (
            <HorizontalBar key={bar.label} bar={bar} maxValue={maxValue(balanceBars)} />
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <ChartHeader
          icon={PieChart}
          title="Compromissos"
          description="Onde as despesas estão concentradas."
        />
        <div className="mt-5 space-y-3">
          {categoryBars.length > 0 ? (
            categoryBars.map((bar) => (
              <HorizontalBar key={bar.label} bar={bar} maxValue={maxValue(categoryBars)} compact />
            ))
          ) : (
            <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-ink-muted">
              Sem despesas para agrupar neste mês.
            </p>
          )}
        </div>
      </Card>

      <Card className="p-4 xl:col-span-2">
        <ChartHeader
          icon={TrendingUp}
          title="Previsão x realidade"
          description="Distribuição de valores por status financeiro."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {statusBars.map((bar) => (
            <StatusMetric key={bar.label} bar={bar} maxValue={maxValue(statusBars)} />
          ))}
        </div>
      </Card>
    </section>
  );
}

function ChartHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-transparent text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-xs text-ink-muted">{description}</p>
      </div>
    </div>
  );
}

function HorizontalBar({
  bar,
  maxValue,
  compact = false,
}: {
  bar: ChartBar;
  maxValue: number;
  compact?: boolean;
}) {
  const width = maxValue > 0 ? Math.max((bar.value / maxValue) * 100, bar.value > 0 ? 6 : 0) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className={cn("truncate text-ink", compact ? "text-xs" : "text-sm")}>{bar.label}</span>
        <span className={cn("shrink-0 font-medium text-ink", compact ? "text-xs" : "text-sm")}>
          {formatCurrency(bar.value)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-700", barToneStyles[bar.tone])}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function StatusMetric({ bar, maxValue }: { bar: ChartBar; maxValue: number }) {
  const height = maxValue > 0 ? Math.max((bar.value / maxValue) * 100, bar.value > 0 ? 8 : 0) : 0;

  return (
    <div className="rounded-lg border border-border bg-transparent p-3">
      <div className="flex h-24 items-end">
        <div className="flex h-full w-full items-end rounded-md bg-muted">
          <div
            className={cn("mt-auto w-full rounded-md transition-all duration-700", barToneStyles[bar.tone])}
            style={{ height: `${height}%` }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-ink">{bar.label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{formatCurrency(bar.value)}</p>
    </div>
  );
}

function buildCategoryBars(expenses: Expense[], categories: Category[]): ChartBar[] {
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));
  const totals = new Map<string, number>();

  expenses.forEach((expense) => {
    const categoryName = categoryById.get(expense.categoryId) ?? "Sem categoria";
    totals.set(categoryName, (totals.get(categoryName) ?? 0) + expense.amount);
  });

  return Array.from(totals.entries())
    .map(([label, value]) => ({ label, value, tone: "warning" as const }))
    .sort((a, b) => b.value - a.value);
}

function sumByStatus<T extends { amount: number; status: string }>(items: T[], status: string) {
  return items
    .filter((item) => item.status === status)
    .reduce((total, item) => total + item.amount, 0);
}

function maxValue(bars: ChartBar[]) {
  return Math.max(...bars.map((bar) => bar.value), 0);
}
