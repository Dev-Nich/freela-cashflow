import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { CashFlowTimeline } from "@/components/dashboard/CashFlowTimeline";
import { CommitmentIndicator } from "@/components/dashboard/CommitmentIndicator";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EmptyFinancialState } from "@/components/dashboard/EmptyFinancialState";
import { FinancialSummaryGrid } from "@/components/dashboard/FinancialSummaryGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactionsList } from "@/components/dashboard/RecentTransactionsList";
import { Card } from "@/components/ui/card";
import { getCategories } from "@/services/categoryService";
import { getExpenses } from "@/services/expenseService";
import { getIncomes } from "@/services/incomeService";
import { getMonthlySummary } from "@/services/monthlySummaryService";
import type { Category } from "@/types/category";
import type { Expense } from "@/types/expense";
import type { Income } from "@/types/income";
import type { MonthlySummary } from "@/types/monthlySummary";
import type { FinancialTransaction } from "@/types/transaction";
import type { User } from "@/types/auth";

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

interface DashboardData {
  summary: MonthlySummary;
  incomes: Income[];
  expenses: Expense[];
  categories: Category[];
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
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
  }, [month, year]);

  const transactions = useMemo(() => {
    if (!data) {
      return [];
    }

    return buildTransactions(data.incomes, data.expenses, data.categories);
  }, [data]);

  const overdueCount = data?.expenses.filter((expense) => expense.status === "OVERDUE").length ?? 0;
  const isEmpty = !isLoading && !error && transactions.length === 0;

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader
          user={user}
          month={month}
          year={year}
          onMonthChange={(nextMonth, nextYear) => {
            setMonth(nextMonth);
            setYear(nextYear);
          }}
          onLogout={onLogout}
        />

        {isLoading && <DashboardLoading />}

        {error && (
          <Card className="border-destructive/25 bg-destructive/5 p-5">
            <p className="font-semibold text-ink">Não foi possível carregar seus dados</p>
            <p className="mt-1 text-sm text-ink-muted">{error}</p>
          </Card>
        )}

        {isEmpty && <EmptyFinancialState />}

        {data && !isLoading && !error && !isEmpty && (
          <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AlertCard overdueCount={overdueCount} />
            <FinancialSummaryGrid summary={data.summary} />

            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
              <div className="space-y-6">
                <CommitmentIndicator
                  percentage={data.summary.committedIncomePercentage}
                  pendingExpenses={data.summary.pendingExpenses}
                />
                <QuickActions />
                <CashFlowTimeline transactions={transactions} />
              </div>
              <RecentTransactionsList transactions={transactions} />
            </section>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function DashboardLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="h-32 animate-pulse bg-white/70" />
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
