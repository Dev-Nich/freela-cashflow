import { Card } from "@/components/ui/card";
import { TransactionItem } from "@/components/dashboard/TransactionItem";
import type { FinancialTransaction } from "@/types/transaction";

interface RecentTransactionsListProps {
  transactions: FinancialTransaction[];
}

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  const visibleTransactions = transactions.slice(0, 8);

  return (
    <Card className="p-4">
      <div className="mb-4">
        <p className="text-sm font-semibold text-ink">Movimentações do mês</p>
        <p className="mt-1 text-sm text-ink-muted">Receitas e despesas ordenadas por data.</p>
      </div>

      <ul className="space-y-2">
        {visibleTransactions.map((transaction) => (
          <TransactionItem key={`${transaction.type}-${transaction.id}`} transaction={transaction} />
        ))}
      </ul>
    </Card>
  );
}
