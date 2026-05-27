import { BarChart3, CalendarDays, ShieldCheck } from "lucide-react";
import { AuthBenefitItem } from "@/components/auth/AuthBenefitItem";

const benefits = [
  {
    icon: CalendarDays,
    title: "Mês selecionável",
    description: "Acompanhe cada período sem misturar dados.",
  },
  {
    icon: BarChart3,
    title: "Resumo real",
    description: "Compare previsto, recebido, pendente e pago.",
  },
  {
    icon: ShieldCheck,
    title: "Dados por usuário",
    description: "Receitas e despesas separadas por conta.",
  },
];

export function AuthBenefitGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {benefits.map((benefit) => (
        <AuthBenefitItem key={benefit.title} {...benefit} />
      ))}
    </div>
  );
}
