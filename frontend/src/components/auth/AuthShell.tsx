import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import type { Theme } from "@/hooks/useTheme";
import type React from "react";

interface AuthShellProps {
  title: string;
  description: string;
  modeLabel: string;
  modeActionLabel: string;
  onModeAction: () => void;
  theme: Theme;
  onThemeToggle: () => void;
  children: React.ReactNode;
}

export function AuthShell({
  title,
  description,
  modeLabel,
  modeActionLabel,
  onModeAction,
  theme,
  onThemeToggle,
  children,
}: AuthShellProps) {
  return (
    <AuthLayout theme={theme} onThemeToggle={onThemeToggle}>
      <div className="w-full max-w-[430px]">
        <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-ink lg:hidden">
          <TrendingUp className="h-4 w-4 text-primary" />
          Freela-CashFlow
        </div>

        <motion.div
          className="rounded-2xl border border-border bg-surface/85 p-5 shadow-soft backdrop-blur sm:p-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <div className="mb-7">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">Fluxo mensal</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{description}</p>
          </div>

          {children}

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-muted">
            <span>{modeLabel}</span>
            <button
              type="button"
              className="rounded-md px-1 font-medium text-primary transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
              onClick={onModeAction}
            >
              {modeActionLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
