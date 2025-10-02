// src/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type AuthCtx = {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string | null, refresh: string | null) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({
  accessToken: null,
  refreshToken: null,
  setTokens: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccess] = useState<string | null>(() => localStorage.getItem("access_token"));
  const [refreshToken, setRefresh] = useState<string | null>(() => localStorage.getItem("refresh_token"));

  const setTokens = (access: string | null, refresh: string | null) => {
    setAccess(access);
    setRefresh(refresh);
    if (access) localStorage.setItem("access_token", access);
    else localStorage.removeItem("access_token");
    if (refresh) localStorage.setItem("refresh_token", refresh);
    else localStorage.removeItem("refresh_token");
  };

  const logout = () => setTokens(null, null);

  // storage dışarıdan değişirse eşitle
  useEffect(() => {
    const onStorage = () => {
      const a = localStorage.getItem("access_token");
      const r = localStorage.getItem("refresh_token");
      if (a !== accessToken) setAccess(a);
      if (r !== refreshToken) setRefresh(r);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [accessToken, refreshToken]);

  return (
    <Ctx.Provider value={{ accessToken, refreshToken, setTokens, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
