import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@infrastructure/api/client';
import { endpoints } from '@infrastructure/api/endpoints';
import type {
  CreateTodoRequest,
  CreateTodoResponse,
} from '@domain/todos/CreateTodoRequest';

// =============================================================================
// useCreateTodo — POST /todos (mutation + cache invalidation)
// =============================================================================
// onSuccess: ['todos', 'list'] cache'ini invalidate eder → useGetMyTodos otomatik refetch.
// Caller (TodosPage) sadece mutate(values) çağırıyor, listeyi manuel refetch etmesine gerek yok.
//
// Optimistik update ekleyebilirdik (yeni todo'yu hemen listeye ekle, server confirm beklemeden) —
// şu an tutmuyoruz çünkü server validation hatası dönerse rollback gerek; basit tutalım.
// =============================================================================
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['todos', 'create'],
    mutationFn: async (request: CreateTodoRequest): Promise<CreateTodoResponse> => {
      const { data } = await apiClient.post<CreateTodoResponse>(
        endpoints.todos.create,
        request,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', 'list'] });
    },
  });
};
