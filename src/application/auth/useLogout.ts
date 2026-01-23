import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@infrastructure/api/client';
import { endpoints } from '@infrastructure/api/endpoints';
import { useAuthStore } from '@application/stores/authStore';
import { tokenStorage } from '@infrastructure/storage/tokenStorage';

// =============================================================================
// useLogout — POST /auth/logout (server-side revoke) + client cleanup
// =============================================================================
// Server tarafı `LogoutCommand` idempotent — token DB'de yoksa da success döner,
// dolayısıyla retry-safe. Client failed olsa bile (network) yine de localStorage
// temizlenmeli, kullanıcı kilitli kalmasın.
//
// Sırası önemli:
//   1) Server'a logout request (revoke)
//   2) Client localStorage clear + auth store reset
//   3) Query cache'i resetle (eski user'ın verisi yeni login user'a sızmasın)
// =============================================================================

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: async (): Promise<void> => {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) return;

      try {
        await apiClient.post(endpoints.auth.logout, { refreshToken });
      } catch {
        // Server'a ulaşamasak bile client tarafı temizliği yap — kullanıcı kilitli kalmasın.
      }
    },
    onSettled: () => {
      clearAuth();
      // Tüm query cache'ini temizle: yeni login farklı kullanıcı olabilir, eski veriyi göstermesin.
      queryClient.clear();
    },
  });
};
