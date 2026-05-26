import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, Mail, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type StoredAuth } from "@/services/authService";

interface LoginPageProps {
  onAuthenticated: (auth: StoredAuth) => void;
}

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [email, setEmail] = useState("nicholas.dev@freelacashflow.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      onAuthenticated({ token: response.token, user: response.user });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível fazer login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <section className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1 text-sm font-medium text-primary">
              <TrendingUp className="h-4 w-4" />
              Freela-CashFlow
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-normal text-ink sm:text-5xl">
              Entenda seu mês financeiro com clareza.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-muted">
              Acompanhe receitas previstas, despesas pendentes e o saldo real sem depender de planilhas ou dados simulados.
            </p>
          </section>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div>
                <h2 className="text-xl font-semibold text-ink">Entrar no painel</h2>
                <p className="mt-1 text-sm text-ink-muted">Use o usuário de desenvolvimento para testar a API real.</p>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-ink-muted" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-9"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-ink-muted" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-9"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
