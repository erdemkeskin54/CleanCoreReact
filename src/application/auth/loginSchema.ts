import { z } from 'zod';

// Backend `LoginCommandValidator` ile aynı kurallar.
// Login validator BİLİNÇLİ olarak az kuralcı (uzunluk yok) — kayıt sırasında kuralı sağlamış
// eski kullanıcı, kural sıkılaşırsa login'de kapı dışı kalmasın.
export const loginSchema = z.object({
  email: z.string().min(1, 'E-posta zorunlu').email('Geçerli bir e-posta gir'),
  password: z.string().min(1, 'Şifre zorunlu'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
