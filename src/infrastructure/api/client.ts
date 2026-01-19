import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { env } from '@shared/config/env';
import { tokenStorage } from '@infrastructure/storage/tokenStorage';
import { endpoints } from '@infrastructure/api/endpoints';
import type { AuthResponse } from '@domain/auth/AuthResponse';

// =============================================================================
// Axios HTTP client — request/response interceptor'larıyla auth flow'u sarar
// =============================================================================
// Akış:
//   - Request interceptor: tokenStorage'tan access token'ı çek, Authorization header'a koy
//   - Response interceptor: 401 alınca BIR KEZ refresh dene, başarılıysa orijinal isteği yeniden at
//   - Refresh sırasında concurrent 401'ler tek refresh isteğine kuyruklanır (race condition önlemi)
//
// Production-grade detaylar:
//   - `_retry` flag'i: aynı isteği sonsuz retry'da kaldırmamak için
//   - Refresh sırasında bekleyen istekler `pendingRequests` kuyruğunda
//   - Refresh başarısızsa: localStorage temizle + sayfayı /login'e yönlendir
// =============================================================================

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const enqueueRequest = () =>
  new Promise<string | null>((resolve) => {
    pendingRequests.push(resolve);
  });

const flushPendingRequests = (token: string | null) => {
  pendingRequests.forEach((resolve) => resolve(token));
  pendingRequests = [];
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  // 30sn timeout — backend handler'ları + DB query'leri için fazlası gereksiz uzun.
  timeout: 30_000,
});

// ----- Request interceptor: Bearer token ekle
apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ----- Response interceptor: 401 → refresh + retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    // 401 değil ya da config yok ya da zaten retry edildi → hatayı geçir.
    if (
      !original ||
      error.response?.status !== 401 ||
      original._retry ||
      original.url === endpoints.auth.refresh ||
      original.url === endpoints.auth.login
    ) {
      return Promise.reject(error);
    }

    // Refresh halihazırda yürüyorsa, bu isteği kuyruğa al.
    if (isRefreshing) {
      const newToken = await enqueueRequest();
      if (!newToken) return Promise.reject(error);
      original._retry = true;
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    }

    isRefreshing = true;
    original._retry = true;

    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) throw error;

      // axios.create değil direkt axios.post: bu request'in kendi interceptor zincirine girmesin.
      const { data } = await axios.post<AuthResponse>(
        `${env.apiBaseUrl}${endpoints.auth.refresh}`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      tokenStorage.set(data);
      flushPendingRequests(data.accessToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(original);
    } catch (refreshError) {
      // Refresh başarısız → kuyruktaki istekleri reddet + auth state'i temizle.
      flushPendingRequests(null);
      tokenStorage.clear();

      // SPA'da hard redirect — Zustand store'unu da resetlemenin en kolay yolu.
      // (Daha incelikli istersen bir event emit edip useAuthStore.logout() çağırabilirsin.)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
