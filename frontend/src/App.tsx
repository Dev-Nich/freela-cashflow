import { useEffect, useState } from "react";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { useTheme } from "@/hooks/useTheme";
import { clearSession, getStoredAuth, type StoredAuth } from "@/services/authService";

type AuthView = "login" | "register";

export default function App() {
  const [auth, setAuth] = useState<StoredAuth | null>(() => getStoredAuth());
  const [authView, setAuthView] = useState<AuthView>("login");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onStorage = () => setAuth(getStoredAuth());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleLogout() {
    clearSession();
    setAuth(null);
  }

  if (!auth?.token) {
    if (authView === "register") {
      return (
        <RegisterPage
          theme={theme}
          onThemeToggle={toggleTheme}
          onGoToLogin={() => setAuthView("login")}
          onAuthenticated={setAuth}
        />
      );
    }

    return (
      <LoginPage
        theme={theme}
        onThemeToggle={toggleTheme}
        onGoToRegister={() => setAuthView("register")}
        onAuthenticated={setAuth}
      />
    );
  }

  return (
    <DashboardPage
      user={auth.user}
      theme={theme}
      onThemeToggle={toggleTheme}
      onLogout={handleLogout}
    />
  );
}
