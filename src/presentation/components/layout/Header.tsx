import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@presentation/components/ui/Button';
import { useAuthStore } from '@application/stores/authStore';
import { useLogout } from '@application/auth/useLogout';
import { env } from '@shared/config/env';

export const Header = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate('/login'),
    });
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-semibold text-brand-700">
          {env.appName}
        </Link>
        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
                Panel
              </Link>
              <Link to="/todos" className="text-sm text-slate-600 hover:text-slate-900">
                Görevler
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} isLoading={logout.isPending}>
                Çıkış
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900">
                Giriş
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Kayıt ol
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
