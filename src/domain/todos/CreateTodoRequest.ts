// `POST /todos` payload'ı — backend `CreateTodoCommand` ile bire bir.
//
// Backend validator kuralları:
//   - title: zorunlu + max 200
// Frontend Zod schema (createTodoSchema.ts) bu kuralları aynaya yansıtıyor.
export interface CreateTodoRequest {
  title: string;
}

// `POST /todos` response'u — yeni todo'nun id'si.
export interface CreateTodoResponse {
  id: string;
}
