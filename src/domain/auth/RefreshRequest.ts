// `POST /auth/refresh` payload'ı — backend `RefreshTokenCommand` ile bire bir.
export interface RefreshRequest {
  refreshToken: string;
}

// `POST /auth/logout` payload'ı — refresh token'ı server tarafında revoke etmek için.
export interface LogoutRequest {
  refreshToken: string;
}
