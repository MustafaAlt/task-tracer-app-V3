// src/api/client.ts
import axios, { AxiosError } from "axios";

const base = import.meta.env.VITE_API || "http://localhost:8080";

// Ana instance: tüm API çağrıları bunda
const api = axios.create({ baseURL: base });

// 1) Her isteğe access token ekle (refresh yolunu hariç tut)
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("access_token");
  const url = config.url ?? "";
  if (t && !url.includes("/api/auth/refresh")) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${t}`;
  }
  return config;
});

// 2) Refresh için ayrı instance (interceptor döngüsünden kaçınmak için)
const plain = axios.create({ baseURL: base });

let refreshingPromise: Promise<string> | null = null;

async function refreshAccess(): Promise<string> {
  const rt = localStorage.getItem("refresh_token");
  if (!rt) throw new Error("No refresh token");

  // ÖNEMLİ: Authorization göndermiyoruz; sadece body
  const { data } = await plain.post("/api/auth/refresh", { refreshToken: rt });
  const newAccess = data.accessToken as string;
  if (!newAccess) throw new Error("No accessToken in refresh response");

  localStorage.setItem("access_token", newAccess);
  return newAccess;
}

// 3) 401'de otomatik refresh → orijinal isteği yeniden dene
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;
    const status = error.response?.status;

    // Zaten denediysek tekrar denemeyelim
    if (status === 401 && !original?._retry) {
      original._retry = true;
      try {
        if (!refreshingPromise) {
          refreshingPromise = refreshAccess()
            .finally(() => { refreshingPromise = null; });
        }
        const newAccess = await refreshingPromise!;
        // Yeni access ile header'ı güncelle ve isteği tekrar gönder
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        // Refresh de başarısız → tamamen çıkış
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // İstersen login sayfasına at:
        // window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
