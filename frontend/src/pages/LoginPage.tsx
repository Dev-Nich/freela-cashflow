import { FormEvent, useState } from "react";
import { AlertCircle, LockKeyhole, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassButton } from "@/components/ui/liquid-glass";
import type { Theme } from "@/hooks/useTheme";
import { login, type StoredAuth } from "@/services/authService";

interface LoginPageProps {
  theme: Theme;
  onThemeToggle: () => void;
  onGoToRegister: () => void;
  onAuthenticated: (auth: StoredAuth) => void;
}

export function LoginPage({
  theme,
  onThemeToggle,
  onGoToRegister,
  onAuthenticated,
}: LoginPageProps) {
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
    <AuthShell
      title="Entrar no painel"
      description="Acesse seu fluxo mensal com os dados reais da sua conta."
      modeLabel="Ainda não tem conta?"
      modeActionLabel="Criar cadastro"
      onModeAction={onGoToRegister}
      theme={theme}
      onThemeToggle={onThemeToggle}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-muted" />
            <Input
              id="email"
              type="email"
              className="h-11 bg-muted/50 pl-9"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-muted" />
            <Input
              id="password"
              type="password"
              className="h-11 bg-muted/50 pl-9"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <GlassButton
          type="submit"
          wrapperClassName="w-full"
          className="w-full text-primary"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </GlassButton>
      </form>
    </AuthShell>
  );
}
