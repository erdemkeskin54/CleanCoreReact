import { Card, CardHeader, CardTitle, CardDescription } from '@presentation/components/ui/Card';

export const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Hoş geldin</CardTitle>
          <CardDescription>
            Oturum açtın. Sol/üst menüden navigasyon yapabilirsin. İleride: kullanıcı listesi,
            profil sayfası, ayarlar bölümü buraya gelecek.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API durumu</CardTitle>
          <CardDescription>
            Backend bağlantısı: <span className="font-mono text-slate-700">/api/v1</span>
          </CardDescription>
        </CardHeader>
        <p className="text-sm text-slate-600">
          Bu template'te <code className="rounded bg-slate-100 px-1.5 py-0.5">useGetUserById</code>{' '}
          hook'u hazır. Kendi domain'in için yeni use case'leri{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">
            src/application/&lt;feature&gt;/
          </code>{' '}
          altında aynı pattern ile yaz.
        </p>
      </Card>
    </div>
  );
};
