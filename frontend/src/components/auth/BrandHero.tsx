import { TrendingUp } from "lucide-react";

export function BrandHero() {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-3 py-2 text-sm font-medium text-ink shadow-soft">
        <TrendingUp className="h-4 w-4 text-primary" />
        Freela-CashFlow
      </div>

      <div className="mt-9">
        <p className="mb-4 text-sm font-medium text-primary">
          Clareza financeira com fluxo do mês
        </p>
        <h1 className="max-w-[620px] text-5xl font-semibold leading-tight tracking-tight text-ink xl:text-6xl">
          Entenda seu mês antes dele apertar.
        </h1>
        <p className="mt-5 max-w-[560px] text-base leading-7 text-ink-muted xl:text-lg">
          Organize receitas previstas, despesas pendentes e saldo real em uma visão clara para renda
          variável.
        </p>
      </div>
    </div>
  );
}
