// =============================================================================
// Environment config — Vite `import.meta.env`'i tipli ve fail-fast şekilde okuyor
// =============================================================================
// Eksik env vars production build'inde fark edilir — runtime'da `undefined` ile
// karşılaşıp UI tarafında "neden çalışmıyor" diye bakmak yerine, başlangıçta patlasın.
// =============================================================================

const requireEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Eksik environment değişkeni: ${key}. .env.example dosyasına bak.`);
  }
  return value;
};

export const env = {
  apiBaseUrl: requireEnv('VITE_API_BASE_URL'),
  appName: import.meta.env.VITE_APP_NAME ?? 'CleanCore',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
