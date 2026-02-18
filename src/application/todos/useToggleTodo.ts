import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@infrastructure/api/client';
import { endpoints } from '@infrastructure/api/endpoints';

// =============================================================================
// useToggleTodo — PUT /todos/{id}/toggle
// =============================================================================
// Backend 204 No Content döner — return tipinde data yok, sadece success/fail.
// onSuccess: liste cache'ini invalidate → toggle değişikliği UI'ya yansır.
//
// Optimistik update örneği (gerçek hayat senaryosu):
//   onMutate: cancelQueries → snapshot al → cache'i optimistic update et
//   onError: snapshot ile rollback
//   onSettled: invalidate (server'dan gerçek state'i al)
// Şu an basit invalidate ile tutuyoruz — toggle hızlı, kullanıcı gecikmeyi fark etmez.
// =============================================================================
export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todos', 'toggle'],
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.put(endpoints.todos.toggle(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', 'list'] });
    },
  });
};
