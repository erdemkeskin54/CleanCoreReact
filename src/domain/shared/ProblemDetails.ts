// =============================================================================
// ProblemDetails — RFC 7807 standart hata response'u (backend ile bire bir uyumlu)
// =============================================================================
// Backend `GlobalExceptionHandler` ve `ResultExtensions.ToActionResult` her hatayı
// bu şekilde döndürüyor. Frontend interceptor bu yapıyı parse ediyor.
//
// `errors` field'ı sadece `ValidationException` (FluentValidation) durumunda var:
//   {
//     "errors": {
//       "Email": ["E-posta zorunlu", "E-posta formatı hatalı"],
//       "Password": ["Min 8 karakter olmalı"]
//     }
//   }
// Bu sayede React Hook Form'a alan-bazlı hata mapping'i kolay.
// =============================================================================

export interface ProblemDetails {
  status: number;
  title: string;
  detail?: string;
  type?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

// HTTP status → human-readable Türkçe mesaj.
// UI'da generic fallback için: "Beklenmedik hata" yerine "Sunucu hatası, lütfen tekrar deneyin".
export const problemTitle = (status: number): string => {
  if (status === 400) return 'Geçersiz istek';
  if (status === 401) return 'Yetkisiz erişim';
  if (status === 403) return 'Yasak';
  if (status === 404) return 'Bulunamadı';
  if (status === 409) return 'Çakışma';
  if (status === 422) return 'İşlenemeyen istek';
  if (status >= 500) return 'Sunucu hatası, lütfen tekrar deneyin';
  return 'Bir şeyler ters gitti';
};
