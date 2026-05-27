import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { Category } from "@/types/category";
import type { Expense } from "@/types/expense";

interface PendingResolutionPanelProps {
  expenses: Expense[];
  categories: Category[];
  onResolveExpense: (expenseId: string, paidDate: string) => Promise<void>;
}

function todayAsInputDate() {
  return new Date().toISOString().slice(0, 10);
}

export function PendingResolutionPanel({
  expenses,
  categories,
  onResolveExpense,
}: PendingResolutionPanelProps) {
  const [paidDates, setPaidDates] = useState<Record<string, string>>({});
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const categoryById = new Map(categories.map((category) => [category.id, category.name]));

  async function handleResolve(expense: Expense) {
    const paidDate = paidDates[expense.id] ?? todayAsInputDate();
    setError(null);
    setResolvingId(expense.id);

    try {
      await onResolveExpense(expense.id, paidDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível resolver a pendência.");
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ink">Resolver pendências</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Marque cada despesa pendente como paga quando ela for resolvida.
          </p>
        </div>
        <span className="text-xs font-medium text-ink-muted">
          {expenses.length} {expenses.length === 1 ? "pendência" : "pendências"}
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-4 divide-y divide-border rounded-xl border border-border">
        {expenses.map((expense) => (
          <div key={expense.id} className="grid gap-3 p-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-medium text-ink">{expense.description}</p>
                <StatusBadge status={expense.status} />
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                {categoryById.get(expense.categoryId) ?? "Categoria não encontrada"} · Vence em{" "}
                {formatDate(expense.dueDate)}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <p className="text-sm font-semibold text-ink sm:min-w-28 sm:text-right">
                {formatCurrency(expense.amount)}
              </p>
              <input
                type="date"
                className="h-9 rounded-lg border border-border bg-surface px-3 text-sm text-ink"
                value={paidDates[expense.id] ?? todayAsInputDate()}
                onChange={(event) =>
                  setPaidDates((current) => ({ ...current, [expense.id]: event.target.value }))
                }
                aria-label={`Data de pagamento de ${expense.description}`}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolve(expense)}
                disabled={resolvingId === expense.id}
              >
                <CheckCircle2 className="h-4 w-4" />
                {resolvingId === expense.id ? "Resolvendo..." : "Marcar paga"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
