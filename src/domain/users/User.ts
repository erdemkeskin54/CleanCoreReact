// Backend `UserDto` ile bire bir.
//
// Read model — sadece client'ın görmesi gereken alanlar var.
// PasswordHash, audit alanları, soft-delete bayrakları DTO'ya **katılmaz**.
export interface User {
  id: string; // GUID — TS tarafında string olarak gelir
  email: string;
  fullName: string;
  isActive: boolean;
  createdAt: string; // ISO timestamp
}
