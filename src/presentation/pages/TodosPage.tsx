import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useGetMyTodos } from '@application/todos/useGetMyTodos';
import { useCreateTodo } from '@application/todos/useCreateTodo';
import { useToggleTodo } from '@application/todos/useToggleTodo';
import { useDeleteTodo } from '@application/todos/useDeleteTodo';
import {
  createTodoSchema,
  type CreateTodoFormValues,
} from '@application/todos/createTodoSchema';

import { Button } from '@presentation/components/ui/Button';
import { Input } from '@presentation/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription } from '@presentation/components/ui/Card';
import { ErrorMessage } from '@presentation/components/ui/ErrorMessage';

// =============================================================================
// TodosPage — Todo CRUD demo (örnek vertical slice)
// =============================================================================
// Bu sayfa template'in "yeni feature nasıl entegre edilir" referansıdır:
//   - Form (RHF + Zod): create akışı
//   - Liste (useQuery): cache + auto-refetch on invalidation
//   - Toggle / delete (useMutation + invalidation): optimistik değil ama hızlı
//   - Auth-protected: sayfa ProtectedRoute altında, hook'lar 401 dönerse interceptor refresh
//
// Kendi feature'ını eklerken bu sayfanın yapısını şablon olarak kullanabilirsin:
//   1) src/application/<feature>/use<UseCase>.ts hook'ları yaz
//   2) src/application/<feature>/<form>Schema.ts ile validation
//   3) src/presentation/pages/<Feature>Page.tsx → bu sayfanın iskeleti
//   4) App.tsx'e route ekle (ProtectedRoute altında ise auth korumalı)
//   5) Header'a link ekle
// =============================================================================
export const TodosPage = () => {
  const { data: todos, isLoading, error } = useGetMyTodos();
  const createTodo = useCreateTodo();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTodoFormValues>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { title: '' },
  });

  const onSubmit = (values: CreateTodoFormValues) => {
    createTodo.mutate(values, {
      onSuccess: () => reset(),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Görevlerim</CardTitle>
          <CardDescription>
            Bu sayfa template'in örnek feature'ı. Auth korumalı, backend'den{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5">/api/v1/todos</code> ile çalışıyor.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <Input
              placeholder="Yeni bir görev yaz ve Enter'a bas"
              error={errors.title?.message}
              {...register('title')}
            />
          </div>
          <Button type="submit" isLoading={createTodo.isPending}>
            Ekle
          </Button>
        </form>

        <ErrorMessage error={createTodo.error} className="mt-3" />
      </Card>

      <Card>
        {isLoading ? (
          <p className="text-sm text-slate-500">Yükleniyor…</p>
        ) : error ? (
          <ErrorMessage error={error} />
        ) : !todos || todos.length === 0 ? (
          <p className="text-sm text-slate-500">Henüz görevin yok. Yukarıdan ekleyebilirsin.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-slate-100">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-3 py-3">
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() => toggleTodo.mutate(todo.id)}
                  disabled={toggleTodo.isPending}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  aria-label={`${todo.title} — tamamlandı işaretle`}
                />
                <span
                  className={
                    todo.isCompleted
                      ? 'flex-1 text-sm text-slate-400 line-through'
                      : 'flex-1 text-sm text-slate-900'
                  }
                >
                  {todo.title}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(todo.createdAt).toLocaleDateString('tr-TR')}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo.mutate(todo.id)}
                  isLoading={deleteTodo.isPending && deleteTodo.variables === todo.id}
                  aria-label={`${todo.title} — sil`}
                >
                  Sil
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
