import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@infrastructure/api/client';
import { endpoints } from '@infrastructure/api/endpoints';
import type { Todo } from '@domain/todos/Todo';

// =============================================================================
// useGetMyTodos — GET /todos ([Authorize] korumalı)
// =============================================================================
// Current user'ın todo'larını listeler. queryKey ['todos', 'list'] →
// mutation'lar (create/toggle/delete) bunu invalidate ederek otomatik refetch tetikliyor.
//
// staleTime default (30sn — main.tsx'te global): kısa süreli cache, navigasyonda
// gereksiz refetch yok. Toggle/delete sonrası invalidate ile zaten taze veri.
// =============================================================================
export const useGetMyTodos = () => {
  return useQuery({
    queryKey: ['todos', 'list'],
    queryFn: async (): Promise<Todo[]> => {
      const { data } = await apiClient.get<Todo[]>(endpoints.todos.list);
      return data;
    },
  });
};
