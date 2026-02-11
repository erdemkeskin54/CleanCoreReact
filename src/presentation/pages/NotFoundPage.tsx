import { Link } from 'react-router-dom';
import { Button } from '@presentation/components/ui/Button';

export const NotFoundPage = () => (
  <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
    <p className="text-6xl font-bold text-brand-600">404</p>
    <h1 className="text-xl font-semibold text-slate-900">Sayfa bulunamadı</h1>
    <p className="text-sm text-slate-600">
      Aradığın sayfa taşınmış ya da hiç var olmamış. Aşağıdaki bağlantıdan ana sayfaya dönebilirsin.
    </p>
    <Link to="/">
      <Button variant="primary">Ana sayfaya dön</Button>
    </Link>
  </div>
);
