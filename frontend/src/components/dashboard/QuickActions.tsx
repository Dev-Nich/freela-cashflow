import { FolderTree, PlusCircle, ReceiptText } from "lucide-react";
import { GlassButton } from "@/components/ui/liquid-glass";

interface QuickActionsProps {
  onNewIncome: () => void;
  onNewExpense: () => void;
  onOpenCategories: () => void;
}

export function QuickActions({ onNewIncome, onNewExpense, onOpenCategories }: QuickActionsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <GlassButton onClick={onNewIncome}>
        <PlusCircle className="h-4 w-4" />
        Nova receita
      </GlassButton>
      <GlassButton onClick={onNewExpense}>
        <ReceiptText className="h-4 w-4" />
        Nova despesa
      </GlassButton>
      <GlassButton onClick={onOpenCategories}>
        <FolderTree className="h-4 w-4" />
        Categorias
      </GlassButton>
    </div>
  );
}
