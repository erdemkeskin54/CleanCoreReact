import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@infrastructure/api/client';
import { endpoints } from '@infrastructure/api/endpoints';
import type { CreateUserRequest, CreateUserResponse } from '@domain/users/CreateUserRequest';

// =============================================================================
// useCreateUser — POST /users (anonim, kayıt akışı)
// =============================================================================
// Backend response: 201 Created + Location header'ı + body { id }.
// Caller register sayfası: success → /login'e yönlendir + toast.
//
// Hata durumları:
//   - 400 → validation (errors dict React Hook Form'a alan-bazlı setError ile yansıtılır)
//   - 409 → email zaten kayıtlı (UserErrors.emailAlreadyExists)
// =============================================================================

export const useCreateUser = () => {
  return useMutation({
    mutationKey: ['users', 'create'],
    mutationFn: async (request: CreateUserRequest): Promise<CreateUserResponse> => {
      const { data } = await apiClient.post<CreateUserResponse>(endpoints.users.create, request);
      return data;
    },
  });
};
