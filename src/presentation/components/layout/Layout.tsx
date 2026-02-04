import { Outlet } from 'react-router-dom';
import { Header } from './Header';

// Tek public layout — header + main content. İleride sidebar gerekirse buraya eklenir.
export const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Outlet />
    </main>
    <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} CleanCore — MIT License
    </footer>
  </div>
);
