import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useLogin } from '@application/auth/useLogin';
import { loginSchema, type LoginFormValues } from '@application/auth/loginSchema';
import { useAuthStore } from '@application/stores/authStore';

import { Button } from '@presentation/components/ui/Button';
import { Input } from '@presentation/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription } from '@presentation/components/ui/Card';
import { ErrorMessage } from '@presentation/components/ui/ErrorMessage';

interface FromState {
  from?: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useLogin();

  const from = (location.state as FromState | null)?.from ?? '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Zaten giriş yapılmışsa login sayfasında durmasın.
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => navigate(from, { replace: true }),
    });
  };

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Giriş</CardTitle>
          <CardDescription>Hesabına giriş yap.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="E-posta"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Şifre"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <ErrorMessage error={login.error} />

          <Button type="submit" isLoading={login.isPending} className="w-full">
            Giriş yap
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Hesabın yok mu?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
            Kayıt ol
          </Link>
        </p>
      </Card>
    </div>
  );
};
