import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@application/stores/authStore';

// =============================================================================
// ProtectedRoute — auth gerektiren sayfalar için guard
// =============================================================================
// Auth değilse → /login'e yönlendir + `from` state'inde geri dönüş URL'ini taşı
// (login sonrası "geldiğin yere geri dön" UX'i için).
//
// Token'ın gerçekten geçerli olup olmadığı KONTROL EDİLMEZ — sadece varlığı.
// İlk korumalı endpoint çağrısında 401 dönerse interceptor refresh deneyecek;
// refresh de fail ise hard redirect olacak. Bu yaklaşım UX'i açar (sayfa açılır,
// boş veri gösterir → arka planda refresh → veri gelir), token expired sayfasında
// kilitlenmek yerine.
// =============================================================================

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};
