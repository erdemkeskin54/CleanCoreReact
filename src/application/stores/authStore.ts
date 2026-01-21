import { create } from 'zustand';

import type { AuthResponse } from '@domain/auth/AuthResponse';
import { tokenStorage } from '@infrastructure/storage/tokenStorage';

// =============================================================================
// Auth store (Zustand) — login durumu için tek kaynak
// =============================================================================
// Zustand niye?
//   - Redux'a göre boilerplate yok (no actions/reducers/types tek satırda store kuruluyor)
//   - Context'e göre re-render kontrolü iyi (selector'lar shallow eşitlikle çalışıyor)
//   - Persist middleware ile localStorage senkronizasyonu kolay (burada tokenStorage manuel yapıyor)
//
// State'in tokenStorage ile ilişkisi:
//   - Reload'tan sonra `initialize()` çağrılıyor (App.tsx mount'ta)
//   - Login/logout/refresh hook'ları tokenStorage'a yazıyor + bu store'u senkronize ediyor
//   - Tek doğru kaynak (single source of truth) tokenStorage; store sadece reactive view
//
// İleride: kullanıcı bilgilerini de store'da tutmak (full name, email) — şu an JWT claim'inden
// dönen email yeterli, profile endpoint'i eklendiğinde burada cache'leyebilirsin.
// =============================================================================

interface AuthState {
  isAuthenticated: boolean;
  // Token bilgileri (read-only — set'ten geçmek için store metodlarını kullan).
  accessToken: string | null;
  // Akış metodları:
  setAuth: (auth: AuthResponse) => void;
  clearAuth: () => void;
  // Boot sırasında localStorage'tan oku ve state'i kur.
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,

  setAuth: (auth) => {
    tokenStorage.set(auth);
    set({ isAuthenticated: true, accessToken: auth.accessToken });
  },

  clearAuth: () => {
    tokenStorage.clear();
    set({ isAuthenticated: false, accessToken: null });
  },

  initialize: () => {
    const stored = tokenStorage.get();
    if (stored) {
      set({ isAuthenticated: true, accessToken: stored.accessToken });
    }
  },
}));
