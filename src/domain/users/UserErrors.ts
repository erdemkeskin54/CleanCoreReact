import { errorFactory, type DomainError } from '@domain/shared/Result';

// Backend `UserErrors` ile aynı mesajlar — tek kaynak (single source of truth).
// UI'da generic fallback yerine bu sabitler ile filtreleyip özelleştirilmiş mesaj gösterilebilir.
//
// Backend'den gelen hata kodu (`User.NotFound`, `User.EmailAlreadyExists` vs) bu sabitlerle
// karşılaştırılıp UI'da daha anlamlı bir banner/toast gösterilir.
export const UserErrors = {
  notFound: errorFactory.notFound('User.NotFound', 'Kullanıcı bulunamadı.'),
  emailAlreadyExists: errorFactory.conflict(
    'User.EmailAlreadyExists',
    'Bu email ile kayıtlı bir kullanıcı zaten var.',
  ),
  invalidCredentials: errorFactory.unauthorized(
    'User.InvalidCredentials',
    'Email veya şifre hatalı.',
  ),
  inactive: errorFactory.forbidden('User.Inactive', 'Kullanıcı pasif durumda.'),
} satisfies Record<string, DomainError>;
