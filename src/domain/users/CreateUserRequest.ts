// `POST /users` payload'ı — backend `CreateUserCommand` ile bire bir.
//
// Backend validator kuralları:
//   - email: format + max 256
//   - password: min 8, max 128
//   - fullName: zorunlu, max 200
// Frontend validator (Zod) bu kuralları aynaya yansıtıyor (Application/Users/CreateUser/schema.ts).
export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
}

// Backend'den dönen response: `{ id: string }` (yeni user'ın Guid'i).
export interface CreateUserResponse {
  id: string;
}
