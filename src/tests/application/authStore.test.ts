import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@application/stores/authStore';
import { tokenStorage } from '@infrastructure/storage/tokenStorage';
import type { AuthResponse } from '@domain/auth/AuthResponse';

const sample: AuthResponse = {
  accessToken: 'access',
  accessTokenExpiresAt: new Date().toISOString(),
  refreshToken: 'refresh',
  refreshTokenExpiresAt: new Date().toISOString(),
};

describe('useAuthStore', () => {
  beforeEach(() => {
    // Her testten önce store'u sıfırla.
    useAuthStore.getState().clearAuth();
  });

  it('başlangıçta authenticated değil', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('setAuth state’i ve localStorage’ı senkronize eder', () => {
    useAuthStore.getState().setAuth(sample);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().accessToken).toBe(sample.accessToken);
    expect(tokenStorage.getAccessToken()).toBe(sample.accessToken);
  });

  it('clearAuth her ikisini temizler', () => {
    useAuthStore.getState().setAuth(sample);
    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(tokenStorage.hasToken()).toBe(false);
  });

  it('initialize localStorage’tan state’i hidrate eder', () => {
    tokenStorage.set(sample);
    useAuthStore.getState().initialize();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().accessToken).toBe(sample.accessToken);
  });
});
