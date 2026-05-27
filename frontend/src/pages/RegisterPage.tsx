import { FormEvent, useState } from "react";
import { AlertCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassButton } from "@/components/ui/liquid-glass";
import type { Theme } from "@/hooks/useTheme";
import { register, type StoredAuth } from "@/services/authService";

interface RegisterPageProps {
  theme: Theme;
  onThemeToggle: () => void;
  onGoToLogin: () => void;
  onAuthenticated: (auth: StoredAuth) => void;
}

export function RegisterPage({
  theme,
  onThemeToggle,
  onGoToLogin,
  onAuthenticated,
}: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await register({ name, email, password });
      onAuthenticated({ token: response.token, user: response.user });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar sua conta.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      title="Criar cadastro"
      description="Crie uma conta para separar seus dados financeiros e acompanhar o mês com segurança."
      modeLabel="Já tem conta?"
      modeActionLabel="Entrar"
      onModeAction={onGoToLogin}
      theme={theme}
      onThemeToggle={onThemeToggle}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-muted" />
            <Input
              id="name"
              type="text"
              className="h-11 bg-muted/50 pl-9"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">E-mail</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-muted" />
            <Input
              id="register-email"
              type="email"
              className="h-11 bg-muted/50 pl-9"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@email.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Senha</Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-muted" />
            <Input
              id="register-password"
              type="password"
              className="h-11 bg-muted/50 pl-9"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo de 6 caracteres"
              minLength={6}
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
          {isLoading ? "Criando..." : "Criar conta"}
        </GlassButton>
      </form>
    </AuthShell>
  );
}
