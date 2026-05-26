import { FolderTree, PlusCircle, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <Button variant="outline">
        <PlusCircle className="h-4 w-4" />
        Nova receita
      </Button>
      <Button variant="outline">
        <ReceiptText className="h-4 w-4" />
        Nova despesa
      </Button>
      <Button variant="outline">
        <FolderTree className="h-4 w-4" />
        Categorias
      </Button>
    </div>
  );
}
