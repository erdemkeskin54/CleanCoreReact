import { useParams } from 'react-router-dom';
import { useGetUserById } from '@application/users/useGetUserById';
import { Card, CardHeader, CardTitle } from '@presentation/components/ui/Card';
import { ErrorMessage } from '@presentation/components/ui/ErrorMessage';

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error } = useGetUserById(id);

  if (isLoading) {
    return <Card>Yükleniyor...</Card>;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!user) {
    return <Card>Kullanıcı bulunamadı.</Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.fullName}</CardTitle>
      </CardHeader>
      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">E-posta</dt>
          <dd className="font-medium text-slate-900">{user.email}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Durum</dt>
          <dd className="font-medium text-slate-900">
            {user.isActive ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                Aktif
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                Pasif
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Kayıt tarihi</dt>
          <dd className="font-medium text-slate-900">
            {new Date(user.createdAt).toLocaleString('tr-TR')}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">ID</dt>
          <dd className="font-mono text-xs text-slate-700">{user.id}</dd>
        </div>
      </dl>
    </Card>
  );
};
