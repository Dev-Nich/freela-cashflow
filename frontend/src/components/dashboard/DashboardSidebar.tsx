import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, FolderTree, LayoutDashboard, ReceiptText, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type React from "react";

export type DashboardView = "summary" | "analytics" | "incomes" | "expenses" | "categories";

export const dashboardNavigationItems: Array<{
  view: DashboardView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { view: "summary", label: "Resumo", icon: LayoutDashboard },
  { view: "analytics", label: "Análises", icon: BarChart3 },
  { view: "incomes", label: "Receitas", icon: TrendingUp },
  { view: "expenses", label: "Despesas", icon: ReceiptText },
  { view: "categories", label: "Categorias", icon: FolderTree },
];

interface DashboardSidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const sidebarTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
} as const;

export function DashboardSidebar({ activeView, onViewChange }: DashboardSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.aside
      className="fixed left-0 top-0 z-40 hidden h-screen overflow-hidden border-r border-border bg-[#fafaf9] px-3 py-4 dark:bg-[#151515] lg:block"
      initial={false}
      animate={{ width: isExpanded ? 248 : 80 }}
      transition={sidebarTransition}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <SidebarLogo isExpanded={isExpanded} />
      <SidebarNav activeView={activeView} isExpanded={isExpanded} onViewChange={onViewChange} />
    </motion.aside>
  );
}

function SidebarLogo({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div className="flex h-11 items-center gap-3 rounded-lg px-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-transparent text-primary">
        <TrendingUp className="h-[18px] w-[18px]" />
      </div>
      <SidebarLabel isExpanded={isExpanded}>
        <span className="block truncate text-sm font-semibold text-ink">Freela-CashFlow</span>
        <span className="block truncate text-xs font-normal text-ink-muted">Fluxo mensal</span>
      </SidebarLabel>
    </div>
  );
}

function SidebarNav({
  activeView,
  isExpanded,
  onViewChange,
}: {
  activeView: DashboardView;
  isExpanded: boolean;
  onViewChange: (view: DashboardView) => void;
}) {
  return (
    <nav className="mt-5 grid gap-1.5" aria-label="Navegação principal">
      {dashboardNavigationItems.map((item) => (
        <SidebarItem
          key={item.view}
          active={activeView === item.view}
          icon={item.icon}
          isExpanded={isExpanded}
          label={item.label}
          onClick={() => onViewChange(item.view)}
        />
      ))}
    </nav>
  );
}

function SidebarItem({
  active,
  icon: Icon,
  isExpanded,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "group relative flex h-10 w-full items-center rounded-lg border border-transparent bg-transparent text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35",
        isExpanded ? "justify-start gap-3 px-3" : "justify-center px-0",
        active
          ? "bg-surface text-ink shadow-soft"
          : "text-ink-muted hover:bg-muted hover:text-ink",
      )}
      aria-label={label}
      title={!isExpanded ? label : undefined}
      onClick={onClick}
    >
      <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
      <SidebarLabel isExpanded={isExpanded}>
        <span className={cn("block truncate", active ? "font-semibold text-ink" : "font-medium")}>
          {label}
        </span>
      </SidebarLabel>
    </button>
  );
}

function SidebarLabel({
  children,
  isExpanded,
}: {
  children: React.ReactNode;
  isExpanded: boolean;
}) {
  return (
    <motion.span
      className="min-w-0 overflow-hidden whitespace-nowrap"
      initial={false}
      animate={{
        opacity: isExpanded ? 1 : 0,
        x: isExpanded ? 0 : -6,
        width: isExpanded ? "auto" : 0,
      }}
      transition={{ duration: isExpanded ? 0.16 : 0.12, ease: "easeOut" }}
    >
      {children}
    </motion.span>
  );
}
