import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@infrastructure/api/client';
import { endpoints } from '@infrastructure/api/endpoints';
import type { AuthResponse } from '@domain/auth/AuthResponse';
import type { LoginRequest } from '@domain/auth/LoginRequest';
import { useAuthStore } from '@application/stores/authStore';

// =============================================================================
// useLogin — POST /auth/login
// =============================================================================
// Akış:
//   mutate({ email, password })
//     → backend `LoginCommand` çalışır → AuthResponse döner
//     → onSuccess: tokenStorage'a yaz + Zustand store'u senkronize et
//     → caller (LoginPage) navigate('/dashboard') ya da benzer
//
// Hata durumları (interceptor 401'i refresh'lemeye çalışmıyor — login endpoint exclude):
//   - 401 → email/password yanlış (UserErrors.invalidCredentials)
//   - 403 → kullanıcı pasif (UserErrors.inactive)
//   - 400 → validation (FluentValidation)
// UI tarafında error.response.status'a göre Türkçe mesaj göster.
// =============================================================================

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (request: LoginRequest): Promise<AuthResponse> => {
      const { data } = await apiClient.post<AuthResponse>(endpoints.auth.login, request);
      return data;
    },
    onSuccess: (auth) => {
      setAuth(auth);
    },
  });
};
