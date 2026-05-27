import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { CashFlowTimeline } from "@/components/dashboard/CashFlowTimeline";
import { CommitmentIndicator } from "@/components/dashboard/CommitmentIndicator";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  DashboardSidebar,
  dashboardNavigationItems,
  type DashboardView,
} from "@/components/dashboard/DashboardSidebar";
import { EmptyFinancialState } from "@/components/dashboard/EmptyFinancialState";
import { FinancialDashboardCharts } from "@/components/dashboard/FinancialDashboardCharts";
import { FinancialFormDialog, type FinancialDialogType } from "@/components/dashboard/FinancialFormDialog";
import { FinancialSummaryGrid } from "@/components/dashboard/FinancialSummaryGrid";
import { PendingResolutionPanel } from "@/components/dashboard/PendingResolutionPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactionsList } from "@/components/dashboard/RecentTransactionsList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { createCategory, getCategories } from "@/services/categoryService";
import { createExpense, getExpenses, payExpense } from "@/services/expenseService";
import { createIncome, getIncomes } from "@/services/incomeService";
import { getMonthlySummary } from "@/services/monthlySummaryService";
import type { Theme } from "@/hooks/useTheme";
import type { User } from "@/types/auth";
import type { Category } from "@/types/category";
import type { Expense } from "@/types/expense";
import type { Income } from "@/types/income";
import type { MonthlySummary } from "@/types/monthlySummary";
import type { FinancialTransaction } from "@/types/transaction";
import type React from "react";

interface DashboardPageProps {
  user: User;
  theme: Theme;
  onThemeToggle: () => void;
  onLogout: () => void;
}

interface DashboardData {
  summary: MonthlySummary;
  incomes: Income[];
  expenses: Expense[];
  categories: Category[];
}

export function DashboardPage({ user, theme, onThemeToggle, onLogout }: DashboardPageProps) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [activeView, setActiveView] = useState<DashboardView>("summary");
  const [dialogType, setDialogType] = useState<FinancialDialogType | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      setIsLoading(true);
      setError(null);

      try {
        const [summary, incomes, expenses, categories] = await Promise.all([
          getMonthlySummary(month, year),
          getIncomes(month, year),
          getExpenses(month, year),
          getCategories(),
        ]);

        if (!ignore) {
          setData({ summary, incomes, expenses, categories });
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Não foi possível carregar o dashboard.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [month, year, reloadKey]);

  const transactions = useMemo(() => {
    if (!data) {
      return [];
    }

    return buildTransactions(data.incomes, data.expenses, data.categories);
  }, [data]);

  const overdueCount = data?.expenses.filter((expense) => expense.status === "OVERDUE").length ?? 0;
  const pendingResolutionExpenses =
    data?.expenses.filter((expense) => expense.status === "PENDING" || expense.status === "OVERDUE") ?? [];
  const pendingCount = pendingResolutionExpenses.filter((expense) => expense.status === "PENDING").length;
  const isEmpty = !isLoading && !error && transactions.length === 0;

  function refreshDashboard() {
    setReloadKey((current) => current + 1);
  }

  async function handleCreateIncome(payload: {
    description: string;
    amount: number;
    expectedDate: string;
    source?: string;
  }) {
    await createIncome(payload);
    refreshDashboard();
  }

  async function handleCreateExpense(payload: {
    categoryId: string;
    description: string;
    amount: number;
    dueDate: string;
    fixed: boolean;
  }) {
    await createExpense(payload);
    refreshDashboard();
  }

  async function handleCreateCategory(payload: { name: string; description?: string }) {
    await createCategory(payload);
    setActiveView("categories");
    refreshDashboard();
  }

  async function handleResolveExpense(expenseId: string, paidDate: string) {
    await payExpense(expenseId, paidDate);
    refreshDashboard();
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardSidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="min-h-screen lg:pl-20">
        <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-6">
            <MobileNavigation activeView={activeView} onViewChange={setActiveView} />

            <DashboardHeader
              user={user}
              theme={theme}
              month={month}
              year={year}
              onMonthChange={(nextMonth, nextYear) => {
                setMonth(nextMonth);
                setYear(nextYear);
              }}
              onThemeToggle={onThemeToggle}
              onLogout={onLogout}
              onNewIncome={() => setDialogType("income")}
              onNewExpense={() => setDialogType("expense")}
            />

            {isLoading && <DashboardLoading />}

            {error && (
              <Card className="border-destructive/25 bg-destructive/5 p-4">
                <p className="font-semibold text-ink">Não foi possível carregar seus dados</p>
                <p className="mt-1 text-sm text-ink-muted">{error}</p>
              </Card>
            )}

            {isEmpty && (
              <EmptyFinancialState
                onNewIncome={() => setDialogType("income")}
                onNewExpense={() => setDialogType("expense")}
              />
            )}

            {data && !isLoading && !error && !isEmpty && (
              <motion.div
                key={activeView}
                className="space-y-6"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {activeView === "summary" && (
                  <SummaryScreen
                    summary={data.summary}
                    transactions={transactions}
                    overdueCount={overdueCount}
                    pendingCount={pendingCount}
                    pendingResolutionExpenses={pendingResolutionExpenses}
                    categories={data.categories}
                    onResolveExpense={handleResolveExpense}
                    onNewIncome={() => setDialogType("income")}
                    onNewExpense={() => setDialogType("expense")}
                    onOpenCategories={() => setActiveView("categories")}
                    onOpenAnalytics={() => setActiveView("analytics")}
                  />
                )}
                {activeView === "analytics" && (
                  <AnalyticsScreen
                    summary={data.summary}
                    incomes={data.incomes}
                    expenses={data.expenses}
                    categories={data.categories}
                  />
                )}
                {activeView === "incomes" && <IncomesScreen incomes={data.incomes} />}
                {activeView === "expenses" && (
                  <ExpensesScreen expenses={data.expenses} categories={data.categories} />
                )}
                {activeView === "categories" && (
                  <CategoriesScreen
                    categories={data.categories}
                    onNewCategory={() => setDialogType("category")}
                  />
                )}
              </motion.div>
            )}
          </div>
        </section>
      </div>

      <FinancialFormDialog
        type={dialogType}
        categories={data?.categories ?? []}
        onClose={() => setDialogType(null)}
        onCreateIncome={handleCreateIncome}
        onCreateExpense={handleCreateExpense}
        onCreateCategory={handleCreateCategory}
      />
    </main>
  );
}

function MobileNavigation({
  activeView,
  onViewChange,
}: {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}) {
  return (
    <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:hidden" aria-label="Navegação principal">
      {dashboardNavigationItems.map((item) => (
        <button
          key={item.view}
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-transparent px-3 py-2.5 text-sm font-medium transition",
            activeView === item.view
              ? "border-border bg-surface text-ink"
              : "border-transparent text-ink-muted hover:border-border hover:bg-surface hover:text-ink",
          )}
          onClick={() => onViewChange(item.view)}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function SummaryScreen({
  summary,
  transactions,
  overdueCount,
  pendingCount,
  pendingResolutionExpenses,
  categories,
  onResolveExpense,
  onNewIncome,
  onNewExpense,
  onOpenCategories,
  onOpenAnalytics,
}: {
  summary: MonthlySummary;
  transactions: FinancialTransaction[];
  overdueCount: number;
  pendingCount: number;
  pendingResolutionExpenses: Expense[];
  categories: Category[];
  onResolveExpense: (expenseId: string, paidDate: string) => Promise<void>;
  onNewIncome: () => void;
  onNewExpense: () => void;
  onOpenCategories: () => void;
  onOpenAnalytics: () => void;
}) {
  const [showResolutionPanel, setShowResolutionPanel] = useState(false);

  return (
    <>
      <AlertCard
        overdueCount={overdueCount}
        pendingCount={pendingCount}
        onResolveClick={() => setShowResolutionPanel((current) => !current)}
      />
      {showResolutionPanel && pendingResolutionExpenses.length > 0 && (
        <PendingResolutionPanel
          expenses={pendingResolutionExpenses}
          categories={categories}
          onResolveExpense={onResolveExpense}
        />
      )}
      <FinancialSummaryGrid summary={summary} />
      <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5">
          <CommitmentIndicator
            percentage={summary.committedIncomePercentage}
            pendingExpenses={summary.pendingExpenses}
          />
          <QuickActions
            onNewIncome={onNewIncome}
            onNewExpense={onNewExpense}
            onOpenCategories={onOpenCategories}
          />
          <Button variant="outline" className="w-full justify-center" onClick={onOpenAnalytics}>
            <BarChart3 className="h-4 w-4" />
            Ver análises do mês
          </Button>
        </div>
        <RecentTransactionsList transactions={transactions} />
      </section>
    </>
  );
}

function AnalyticsScreen({
  summary,
  incomes,
  expenses,
  categories,
}: {
  summary: MonthlySummary;
  incomes: Income[];
  expenses: Expense[];
  categories: Category[];
}) {
  return (
    <EntityScreen
      title="Análises do mês"
      description="Gráficos com previsão, realidade e concentração das despesas."
    >
      <FinancialDashboardCharts
        summary={summary}
        incomes={incomes}
        expenses={expenses}
        categories={categories}
      />
      <CashFlowTimeline transactions={buildTransactions(incomes, expenses, categories)} />
    </EntityScreen>
  );
}

function IncomesScreen({ incomes }: { incomes: Income[] }) {
  return (
    <EntityScreen title="Receitas esperadas" description="Entradas previstas e recebidas no mês.">
      {incomes.map((income) => (
        <Card key={income.id} className="p-3 transition-colors hover:border-[#d6d3ce] dark:hover:border-[#3a3a3a]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{income.description}</p>
              <p className="mt-1 text-xs text-ink-muted">{income.source ?? "Sem origem informada"}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
              <p className="text-sm font-semibold text-success">{formatCurrency(income.amount)}</p>
              <StatusBadge status={income.status} />
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            Prevista para {formatDate(income.expectedDate)}
            {income.receivedDate ? ` · Recebida em ${formatDate(income.receivedDate)}` : ""}
          </p>
        </Card>
      ))}
    </EntityScreen>
  );
}

function ExpensesScreen({
  expenses,
  categories,
}: {
  expenses: Expense[];
  categories: Category[];
}) {
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <EntityScreen title="Despesas do mês" description="Compromissos pagos, pendentes e vencidos.">
      {expenses.map((expense) => (
        <Card key={expense.id} className="p-3 transition-colors hover:border-[#d6d3ce] dark:hover:border-[#3a3a3a]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{expense.description}</p>
              <p className="mt-1 text-xs text-ink-muted">
                {categoryById.get(expense.categoryId) ?? "Categoria não encontrada"}
                {expense.fixed ? " · Fixa" : " · Pontual"}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
              <p className="text-sm font-semibold text-ink">{formatCurrency(expense.amount)}</p>
              <StatusBadge status={expense.status} />
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            Vence em {formatDate(expense.dueDate)}
            {expense.paidDate ? ` · Paga em ${formatDate(expense.paidDate)}` : ""}
          </p>
        </Card>
      ))}
    </EntityScreen>
  );
}

function CategoriesScreen({
  categories,
  onNewCategory,
}: {
  categories: Category[];
  onNewCategory: () => void;
}) {
  return (
    <EntityScreen title="Categorias" description="Organização das despesas usadas no dashboard.">
      <div>
        <Button variant="outline" size="sm" onClick={onNewCategory}>
          Nova categoria
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="p-4 transition-colors hover:border-[#d6d3ce] dark:hover:border-[#3a3a3a]">
            <p className="text-sm font-medium text-ink">{category.name}</p>
            <p className="mt-2 text-sm leading-6 text-ink-muted">
              {category.description ?? "Sem descrição"}
            </p>
          </Card>
        ))}
      </div>
    </EntityScreen>
  );
}

function EntityScreen({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-ink-muted">{description}</p>
      </div>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function DashboardLoading() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="h-28 animate-pulse bg-surface/70" />
      ))}
    </div>
  );
}

function buildTransactions(
  incomes: Income[],
  expenses: Expense[],
  categories: Category[],
): FinancialTransaction[] {
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));

  const incomeTransactions = incomes.map<FinancialTransaction>((income) => ({
    id: income.id,
    type: "income",
    description: income.description,
    detail: income.source ?? "Receita sem origem informada",
    date: income.receivedDate ?? income.expectedDate,
    amount: income.amount,
    status: income.status,
  }));

  const expenseTransactions = expenses.map<FinancialTransaction>((expense) => ({
    id: expense.id,
    type: "expense",
    description: expense.description,
    detail: categoryById.get(expense.categoryId) ?? "Categoria não encontrada",
    date: expense.paidDate ?? expense.dueDate,
    amount: expense.amount,
    status: expense.status,
  }));

  return [...incomeTransactions, ...expenseTransactions].sort((a, b) => b.date.localeCompare(a.date));
}
