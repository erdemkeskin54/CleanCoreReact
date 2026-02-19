import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuthStore } from '@application/stores/authStore';
import { Layout } from '@presentation/components/layout/Layout';
import { ProtectedRoute } from '@presentation/routes/ProtectedRoute';

import { LoginPage } from '@presentation/pages/LoginPage';
import { RegisterPage } from '@presentation/pages/RegisterPage';
import { DashboardPage } from '@presentation/pages/DashboardPage';
import { UserDetailPage } from '@presentation/pages/UserDetailPage';
import { TodosPage } from '@presentation/pages/TodosPage';
import { NotFoundPage } from '@presentation/pages/NotFoundPage';

// =============================================================================
// App — root component
// =============================================================================
// Mount sırasında auth store'u localStorage'tan hidrate et — sayfa yenilemeden sonra
// kullanıcının login state'i kaybolmasın.
// =============================================================================

const App = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Auth gerektiren */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
