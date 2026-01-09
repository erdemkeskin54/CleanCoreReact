// =============================================================================
// Result Pattern (Railway-Oriented Programming) — TS ports
// =============================================================================
// Backend'deki `Result<T>` / `Error` pattern'inin TypeScript karşılığı.
// Use case hook'ları (application katmanı) bu tipi döndürebilir.
//
// Kullanım:
//   const r: Result<User> = ok(user);
//   const r: Result<User> = err({ code: 'User.NotFound', message: '...', type: 'NotFound' });
//   if (r.isSuccess) console.log(r.value); else console.log(r.error);
//
// Ne zaman kullanırsın:
//   - Hook içinde "kullanıcı hata bilgisini" detaylı dönmek istediğinde.
//   - TanStack Query'nin error state'i zaten var — basit durumlarda Result yerine
//     Query'nin error'ını kullanmak yeterli. Result business hatasını HTTP hatasından
//     ayırmak istediğinde anlamlı.
// =============================================================================

export type ErrorType =
  | 'Failure'
  | 'Validation'
  | 'NotFound'
  | 'Conflict'
  | 'Unauthorized'
  | 'Forbidden';

export interface DomainError {
  code: string;
  message: string;
  type: ErrorType;
}

export interface ResultSuccess<T> {
  isSuccess: true;
  isFailure: false;
  value: T;
}

export interface ResultFailure {
  isSuccess: false;
  isFailure: true;
  error: DomainError;
}

export type Result<T> = ResultSuccess<T> | ResultFailure;

export const ok = <T>(value: T): ResultSuccess<T> => ({
  isSuccess: true,
  isFailure: false,
  value,
});

export const err = (error: DomainError): ResultFailure => ({
  isSuccess: false,
  isFailure: true,
  error,
});

// Factory helper'ları — backend'deki Error.NotFound / Error.Validation gibi.
export const errorFactory = {
  notFound: (code: string, message: string): DomainError => ({
    code,
    message,
    type: 'NotFound',
  }),
  validation: (code: string, message: string): DomainError => ({
    code,
    message,
    type: 'Validation',
  }),
  conflict: (code: string, message: string): DomainError => ({
    code,
    message,
    type: 'Conflict',
  }),
  unauthorized: (code: string, message: string): DomainError => ({
    code,
    message,
    type: 'Unauthorized',
  }),
  forbidden: (code: string, message: string): DomainError => ({
    code,
    message,
    type: 'Forbidden',
  }),
  failure: (code: string, message: string): DomainError => ({
    code,
    message,
    type: 'Failure',
  }),
};
