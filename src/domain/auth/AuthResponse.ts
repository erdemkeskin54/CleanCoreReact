// Backend `AuthResponse` record'ının TS karşılığı — login + refresh endpoint'lerinin response shape'i.
//
// Expiry tarihleri ISO string olarak gelir; client tarafında `new Date(...)` ile parse ediyoruz.
// Client refresh stratejisini bu tarihlere göre kuruyor (token'ı parse etmeden).
export interface AuthResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}
