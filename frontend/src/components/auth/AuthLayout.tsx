import { motion } from "framer-motion";
import { AuthBenefitGrid } from "@/components/auth/AuthBenefitGrid";
import { BrandHero } from "@/components/auth/BrandHero";
import { LoginPreviewCard } from "@/components/auth/LoginPreviewCard";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { Theme } from "@/hooks/useTheme";
import type React from "react";

interface AuthLayoutProps {
  theme: Theme;
  onThemeToggle: () => void;
  children: React.ReactNode;
}

export function AuthLayout({ theme, onThemeToggle, children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="hidden items-center justify-center border-r border-border bg-[#fafaf9] px-12 py-12 dark:bg-[#151515] lg:flex xl:px-16">
          <motion.div
            className="w-full max-w-[640px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <BrandHero />

            <div className="mt-10">
              <LoginPreviewCard />
            </div>

            <div className="mt-6">
              <AuthBenefitGrid />
            </div>
          </motion.div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="absolute right-5 top-5">
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
