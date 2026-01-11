// `POST /auth/login` payload'ı — backend `LoginCommand` ile bire bir.
export interface LoginRequest {
  email: string;
  password: string;
}
