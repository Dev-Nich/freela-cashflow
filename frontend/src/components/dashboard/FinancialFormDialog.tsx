import { FormEvent, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassButton } from "@/components/ui/liquid-glass";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types/category";
import type React from "react";

export type FinancialDialogType = "income" | "expense" | "category";

interface FinancialFormDialogProps {
  type: FinancialDialogType | null;
  categories: Category[];
  onClose: () => void;
  onCreateIncome: (payload: {
    description: string;
    amount: number;
    expectedDate: string;
    source?: string;
  }) => Promise<void>;
  onCreateExpense: (payload: {
    categoryId: string;
    description: string;
    amount: number;
    dueDate: string;
    fixed: boolean;
  }) => Promise<void>;
  onCreateCategory: (payload: { name: string; description?: string }) => Promise<void>;
}

export function FinancialFormDialog({
  type,
  categories,
  onClose,
  onCreateIncome,
  onCreateExpense,
  onCreateCategory,
}: FinancialFormDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = useMemo(() => {
    if (type === "income") return "Nova receita";
    if (type === "expense") return "Nova despesa";
    if (type === "category") return "Nova categoria";
    return "";
  }, [type]);

  if (!type) {
    return null;
  }

  async function submit(action: () => Promise<void>) {
    setError(null);
    setIsSubmitting(true);

    try {
      await action();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6">
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Preencha os dados para atualizar o dashboard com informações reais.
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 px-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {type === "income" && (
          <IncomeForm
            isSubmitting={isSubmitting}
            error={error}
            onSubmit={(payload) => submit(() => onCreateIncome(payload))}
          />
        )}

        {type === "expense" && (
          <ExpenseForm
            categories={categories}
            isSubmitting={isSubmitting}
            error={error}
            onSubmit={(payload) => submit(() => onCreateExpense(payload))}
          />
        )}

        {type === "category" && (
          <CategoryForm
            isSubmitting={isSubmitting}
            error={error}
            onSubmit={(payload) => submit(() => onCreateCategory(payload))}
          />
        )}
      </div>
    </div>
  );
}

function IncomeForm({
  isSubmitting,
  error,
  onSubmit,
}: {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (payload: {
    description: string;
    amount: number;
    expectedDate: string;
    source?: string;
  }) => void;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [source, setSource] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      description,
      amount: Number(amount),
      expectedDate,
      source: source || undefined,
    });
  }

  return (
    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
      <FormField label="Descrição" id="income-description">
        <Input
          id="income-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ex.: Parcela do projeto institucional"
          maxLength={120}
          required
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Valor" id="income-amount">
          <Input
            id="income-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </FormField>
        <FormField label="Data prevista" id="income-expected-date">
          <Input
            id="income-expected-date"
            type="date"
            value={expectedDate}
            onChange={(event) => setExpectedDate(event.target.value)}
            required
          />
        </FormField>
      </div>
      <FormField label="Origem" id="income-source">
        <Input
          id="income-source"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder="Ex.: Cliente Landing Page"
          maxLength={120}
        />
      </FormField>
      <DialogError error={error} />
      <GlassButton type="submit" wrapperClassName="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Criar receita"}
      </GlassButton>
    </form>
  );
}

function ExpenseForm({
  categories,
  isSubmitting,
  error,
  onSubmit,
}: {
  categories: Category[];
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (payload: {
    categoryId: string;
    description: string;
    amount: number;
    dueDate: string;
    fixed: boolean;
  }) => void;
}) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [fixed, setFixed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      categoryId,
      description,
      amount: Number(amount),
      dueDate,
      fixed,
    });
  }

  return (
    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
      <FormField label="Categoria" id="expense-category">
        <select
          id="expense-category"
          className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-ink"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Descrição" id="expense-description">
        <Input
          id="expense-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ex.: Assinatura ferramenta dev"
          maxLength={120}
          required
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Valor" id="expense-amount">
          <Input
            id="expense-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </FormField>
        <FormField label="Vencimento" id="expense-due-date">
          <Input
            id="expense-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
          />
        </FormField>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={fixed}
          onChange={(event) => setFixed(event.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Despesa fixa
      </label>
      <DialogError error={error} />
      <GlassButton type="submit" wrapperClassName="w-full" disabled={isSubmitting || !categoryId}>
        {isSubmitting ? "Salvando..." : "Criar despesa"}
      </GlassButton>
    </form>
  );
}

function CategoryForm({
  isSubmitting,
  error,
  onSubmit,
}: {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (payload: { name: string; description?: string }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ name, description: description || undefined });
  }

  return (
    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
      <FormField label="Nome" id="category-name">
        <Input
          id="category-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Ferramentas"
          maxLength={80}
          required
        />
      </FormField>
      <FormField label="Descrição" id="category-description">
        <Input
          id="category-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Ex.: Domínios, hospedagem e softwares"
        />
      </FormField>
      <DialogError error={error} />
      <GlassButton type="submit" wrapperClassName="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Criar categoria"}
      </GlassButton>
    </form>
  );
}

function FormField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function DialogError({ error }: { error: string | null }) {
  if (!error) {
    return null;
  }

  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {error}
    </div>
  );
}
