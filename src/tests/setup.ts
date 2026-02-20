import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// =============================================================================
// Vitest setup — testing-library matcher'ları + her testten sonra DOM cleanup
// =============================================================================
// localStorage neden manuel mock'lanıyor?
//   Node 22+ ve özellikle Node 24+'da `localStorage` BCL'e native geliyor (deneysel).
//   Bu jsdom'un sağladığı localStorage'ı override ediyor ve method imzaları
//   tam uyumlu olmayabiliyor (örn. `clear()` eksik). Map-backed mock bu sorunu yok ediyor —
//   her ortamda aynı davranış.
// =============================================================================

const createLocalStorageMock = (): Storage => {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
};

vi.stubGlobal('localStorage', createLocalStorageMock());

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});
