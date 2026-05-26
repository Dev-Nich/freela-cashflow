import { useEffect, useState } from "react";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { clearSession, getStoredAuth, type StoredAuth } from "@/services/authService";

export default function App() {
  const [auth, setAuth] = useState<StoredAuth | null>(() => getStoredAuth());

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
    return <LoginPage onAuthenticated={setAuth} />;
  }

  return <DashboardPage user={auth.user} onLogout={handleLogout} />;
}
