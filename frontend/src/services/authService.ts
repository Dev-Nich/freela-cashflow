import { apiRequest, removeToken, setToken } from "@/services/api";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/auth";

const USER_KEY = "freela_cashflow_user";

export interface StoredAuth {
  token: string;
  user: User;
}

export async function login(payload: LoginRequest) {
  const response = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    authenticated: false,
    body: JSON.stringify(payload),
  });

  setToken(response.token);
  localStorage.setItem(USER_KEY, JSON.stringify(response.user));

  return response;
}

export async function register(payload: RegisterRequest) {
  const response = await apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    authenticated: false,
    body: JSON.stringify(payload),
  });

  setToken(response.token);
  localStorage.setItem(USER_KEY, JSON.stringify(response.user));

  return response;
}

export function getStoredAuth(): StoredAuth | null {
  const token = localStorage.getItem("freela_cashflow_token");
  const user = localStorage.getItem(USER_KEY);

  if (!token || !user) {
    return null;
  }

  try {
    return { token, user: JSON.parse(user) as User };
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  removeToken();
  localStorage.removeItem(USER_KEY);
}
