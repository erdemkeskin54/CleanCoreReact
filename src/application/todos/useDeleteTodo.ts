import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@infrastructure/api/client';
import { endpoints } from '@infrastructure/api/endpoints';

// =============================================================================
// useDeleteTodo — DELETE /todos/{id}
// =============================================================================
// Backend SOFT DELETE yapıyor (SoftDeleteInterceptor → UPDATE IsDeleted=true).
// UI tarafında bu fark görünmüyor — todo listeden kayboluyor.
// 204 No Content döner.
// =============================================================================
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todos', 'delete'],
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(endpoints.todos.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', 'list'] });
    },
  });
};
