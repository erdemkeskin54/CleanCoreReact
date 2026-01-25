import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@infrastructure/api/client';
import { endpoints } from '@infrastructure/api/endpoints';
import type { User } from '@domain/users/User';

// =============================================================================
// useGetUserById — GET /users/{id} ([Authorize] korumalı)
// =============================================================================
// `enabled` flag: id boş ise query çalışmasın (mount sırasında gereksiz fetch).
// Backend 404 dönerse error state'inde yakalanır, UI'da NotFound page göster.
// =============================================================================

export const useGetUserById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: async (): Promise<User> => {
      const { data } = await apiClient.get<User>(endpoints.users.getById(id!));
      return data;
    },
    enabled: Boolean(id),
  });
};
