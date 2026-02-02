import { AxiosError } from 'axios';
import type { ProblemDetails } from '@domain/shared/ProblemDetails';
import { problemTitle } from '@domain/shared/ProblemDetails';

// =============================================================================
// ErrorMessage — Axios hatasını ProblemDetails formatına göre render eder
// =============================================================================
// Backend hep RFC 7807 ProblemDetails dönüyor (GlobalExceptionHandler).
// Bu component:
//   - Validation errors varsa (400) field bazlı liste
//   - Yoksa generic title + detail
//   - Network error / timeout: özel mesaj
// =============================================================================

interface ErrorMessageProps {
  error: unknown;
  className?: string;
}

const isAxiosError = (e: unknown): e is AxiosError<ProblemDetails> => {
  return Boolean(e && typeof e === 'object' && 'isAxiosError' in e);
};

export const ErrorMessage = ({ error, className }: ErrorMessageProps) => {
  if (!error) return null;

  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const problem = error.response?.data;

    if (!error.response) {
      // Network/timeout: response henüz dönmedi.
      return (
        <div
          className={`rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 ${className ?? ''}`}
        >
          Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.
        </div>
      );
    }

    // Validation hataları varsa alan-bazlı liste.
    if (problem?.errors) {
      return (
        <div
          className={`rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 ${className ?? ''}`}
        >
          <p className="font-medium">{problem.title || 'Doğrulama hatası'}</p>
          <ul className="mt-1 list-disc pl-5">
            {Object.entries(problem.errors).flatMap(([field, messages]) =>
              messages.map((m, i) => <li key={`${field}-${i}`}>{m}</li>),
            )}
          </ul>
        </div>
      );
    }

    return (
      <div
        className={`rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 ${className ?? ''}`}
      >
        {problem?.detail || problem?.title || problemTitle(status)}
      </div>
    );
  }

  // Unknown error.
  return (
    <div
      className={`rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 ${className ?? ''}`}
    >
      Beklenmedik bir hata oluştu.
    </div>
  );
};
