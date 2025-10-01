import { createContext, useContext, useEffect, useState } from "react";

type AuthCtx = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({
  token: null,
  setToken: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("access_token"));

  const setToken = (t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem("access_token", t);
    else localStorage.removeItem("access_token");
  };

  const logout = () => setToken(null);

  // küçük güvenlik: storage dışarıdan temizlendiyse yakala
  useEffect(() => {
    const onStorage = () => {
      const t = localStorage.getItem("access_token");
      if (t !== token) setTokenState(t);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [token]);

  return <Ctx.Provider value={{ token, setToken, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
