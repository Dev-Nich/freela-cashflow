import { ArrowDownRight, ArrowUpRight, CheckCircle2, Clock3, Scale, Wallet } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import type { MonthlySummary } from "@/types/monthlySummary";

interface FinancialSummaryGridProps {
  summary: MonthlySummary;
}

export function FinancialSummaryGrid({ summary }: FinancialSummaryGridProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <SummaryCard
        title="Receita prevista"
        value={summary.expectedIncome}
        helper="Tudo que está programado para entrar"
        icon={ArrowUpRight}
        tone="info"
      />
      <SummaryCard
        title="Receita recebida"
        value={summary.receivedIncome}
        helper="Valor que já entrou no mês"
        icon={CheckCircle2}
        tone="success"
      />
      <SummaryCard
        title="Despesas previstas"
        value={summary.expectedExpenses}
        helper="Compromissos planejados"
        icon={ArrowDownRight}
        tone="warning"
      />
      <SummaryCard
        title="Despesas pagas"
        value={summary.paidExpenses}
        helper="Saídas já resolvidas"
        icon={Wallet}
        tone="secondary"
      />
      <SummaryCard
        title="Saldo previsto"
        value={summary.expectedBalance}
        helper="Estimativa para fechar o mês"
        icon={Scale}
        tone="primary"
      />
      <SummaryCard
        title="Saldo real"
        value={summary.realBalance}
        helper="Recebido menos despesas pagas"
        icon={Clock3}
        tone="success"
      />
    </section>
  );
}
