// =============================================================================
// API endpoint sabitleri — backend route'larıyla bire bir
// =============================================================================
// Magic string'leri tek yerde tutmak: route değişirse (örn. v2'ye geçiş) tek yerde günceller,
// hook'ların tamamı otomatik yeni endpoint'i kullanır.
//
// Path'ler `client.baseURL` (env.VITE_API_BASE_URL → "/api/v1") ile birleşip tam URL olur.
// =============================================================================

export const endpoints = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  users: {
    create: '/users',
    getById: (id: string) => `/users/${id}`,
  },
  todos: {
    list: '/todos',
    create: '/todos',
    toggle: (id: string) => `/todos/${id}/toggle`,
    delete: (id: string) => `/todos/${id}`,
  },
} as const;
