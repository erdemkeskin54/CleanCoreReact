import type { AuthResponse } from '@domain/auth/AuthResponse';

// =============================================================================
// Token storage — auth bilgilerini localStorage'da tutmanın tek noktası
// =============================================================================
// Niye localStorage (cookie değil)?
//   - SPA + ayrı API host: cookie SameSite ayarları zahmet, CSRF koruması ek iş
//   - localStorage XSS'e açık ama biz CSP + DOMPurify ile XSS yüzeyini daraltıyoruz
//   - Ekosistemin bilineni — TanStack Query / interceptor entegrasyonu temiz
//
// Neden tek bir module (utility değil singleton da değil)?
//   - Test edilebilir: mock localStorage ile çalıştırılabilir (vitest setup'ta jsdom var)
//   - Read/write tek noktada → şema değişirse (örn. cookie'ye geçiş) buraya dokun yeter
//
// `accessTokenExpiresAt` neden saklanıyor?
//   - Client refresh stratejisi: "expiry'ye 30sn kala proaktif refresh at" yapmak istersek
//   - Ya da retry'da access token'ın gerçekten expired olup olmadığını anlamak için
// =============================================================================

const STORAGE_KEY = 'cleancore.auth';

interface StoredAuth {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export const tokenStorage = {
  get(): StoredAuth | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as StoredAuth;
    } catch {
      // Bozuk JSON ya da localStorage erişim hatası — null dönelim, ezilsin.
      return null;
    }
  },

  set(auth: AuthResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Aktif access token var mı? (basit varlık check'i, expiry doğrulaması interceptor'da)
  hasToken(): boolean {
    return this.get() !== null;
  },

  getAccessToken(): string | null {
    return this.get()?.accessToken ?? null;
  },

  getRefreshToken(): string | null {
    return this.get()?.refreshToken ?? null;
  },
};
