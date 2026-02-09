import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import { useCreateUser } from '@application/users/useCreateUser';
import { createUserSchema, type CreateUserFormValues } from '@application/users/createUserSchema';

import { Button } from '@presentation/components/ui/Button';
import { Input } from '@presentation/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription } from '@presentation/components/ui/Card';
import { ErrorMessage } from '@presentation/components/ui/ErrorMessage';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', password: '', fullName: '' },
  });

  const onSubmit = (values: CreateUserFormValues) => {
    createUser.mutate(values, {
      onSuccess: () => {
        // Kayıt başarılı → login sayfasına yönlendir.
        // İleride: otomatik login (createUser sonrası login mutation tetikle) yapılabilir.
        navigate('/login', { state: { justRegistered: true } });
      },
    });
  };

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Kayıt ol</CardTitle>
          <CardDescription>Yeni hesap oluştur.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Ad Soyad"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
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
            autoComplete="new-password"
            error={errors.password?.message}
            helperText="En az 8 karakter."
            {...register('password')}
          />

          <ErrorMessage error={createUser.error} />

          <Button type="submit" isLoading={createUser.isPending} className="w-full">
            Kayıt ol
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Giriş yap
          </Link>
        </p>
      </Card>
    </div>
  );
};
