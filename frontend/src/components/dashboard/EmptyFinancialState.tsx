import { PlusCircle, ReceiptText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlassButton } from "@/components/ui/liquid-glass";

interface EmptyFinancialStateProps {
  onNewIncome?: () => void;
  onNewExpense?: () => void;
}

export function EmptyFinancialState({ onNewIncome, onNewExpense }: EmptyFinancialStateProps) {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
        <ReceiptText className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-ink">Seu mês ainda está vazio</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
        Cadastre sua primeira receita ou despesa para visualizar seu fluxo financeiro.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <GlassButton className="text-primary" onClick={onNewIncome}>
          <PlusCircle className="h-4 w-4" />
          Adicionar receita
        </GlassButton>
        <Button variant="outline" onClick={onNewExpense}>
          <ReceiptText className="h-4 w-4" />
          Adicionar despesa
        </Button>
      </div>
    </Card>
  );
}
