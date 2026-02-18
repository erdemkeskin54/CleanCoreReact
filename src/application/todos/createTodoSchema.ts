import { z } from 'zod';

// Backend `CreateTodoCommandValidator` ile bire bir aynı kurallar.
// Title trim'lenip backend'e gidiyor — Zod transform ile.
export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Görev başlığı boş olamaz.')
    .max(200, 'Görev başlığı en fazla 200 karakter olabilir.'),
});

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>;
