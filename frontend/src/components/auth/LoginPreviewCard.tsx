import { ArrowDownRight, ArrowUpRight, Gauge } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

const previewRows = [
  {
    label: "Receita prevista",
    value: 3950,
    icon: ArrowUpRight,
    tone: "text-success",
  },
  {
    label: "Despesas pendentes",
    value: 359.8,
    icon: ArrowDownRight,
    tone: "text-warning",
  },
  {
    label: "Saldo previsto",
    value: 2120.3,
    icon: Gauge,
    tone: "text-info",
  },
];

export function LoginPreviewCard() {
  return (
    <div className="w-full rounded-2xl border border-border bg-surface/75 p-5 shadow-soft backdrop-blur xl:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Resumo de maio</p>
          <p className="mt-1 text-sm font-semibold text-ink">Fluxo financeiro previsto</p>
        </div>
        <span className="rounded-full border border-primary/20 bg-transparent px-2.5 py-1 text-xs font-medium text-primary">
          39% comprometido
        </span>
      </div>

      <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-muted/35">
        {previewRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <row.icon className={`h-4 w-4 shrink-0 ${row.tone}`} />
              <span className="truncate text-sm text-ink-muted">{row.label}</span>
            </div>
            <span className="shrink-0 text-sm font-semibold text-ink">{formatCurrency(row.value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>Renda comprometida</span>
          <span>39%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[39%] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
