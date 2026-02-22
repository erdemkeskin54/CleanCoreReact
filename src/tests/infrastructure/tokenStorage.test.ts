import { describe, it, expect } from 'vitest';
import { tokenStorage } from '@infrastructure/storage/tokenStorage';
import type { AuthResponse } from '@domain/auth/AuthResponse';

const sample: AuthResponse = {
  accessToken: 'access-jwt',
  accessTokenExpiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
  refreshToken: 'refresh-512bit',
  refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString(),
};

describe('tokenStorage', () => {
  it('ilk durumda boş', () => {
    expect(tokenStorage.get()).toBeNull();
    expect(tokenStorage.hasToken()).toBe(false);
  });

  it('set + get round-trip yapıyor', () => {
    tokenStorage.set(sample);
    const stored = tokenStorage.get();
    expect(stored?.accessToken).toBe(sample.accessToken);
    expect(stored?.refreshToken).toBe(sample.refreshToken);
  });

  it('clear sonrası state boş', () => {
    tokenStorage.set(sample);
    tokenStorage.clear();
    expect(tokenStorage.hasToken()).toBe(false);
    expect(tokenStorage.getAccessToken()).toBeNull();
  });

  it('bozuk JSON varsa null döner (try/catch yutuyor)', () => {
    localStorage.setItem('cleancore.auth', '{ this is not valid JSON');
    expect(tokenStorage.get()).toBeNull();
  });
});
