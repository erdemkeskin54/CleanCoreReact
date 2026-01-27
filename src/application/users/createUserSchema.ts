import { z } from 'zod';

// Backend `CreateUserCommandValidator` ile bire bir aynı kurallar.
// Frontend validator UX gecikmesini azaltır (server roundtrip beklemeden hata gösterir),
// ama tek savunma değil — server da aynı kuralları çalıştırıyor (defense in depth).
//
// Karmaşık şifre kuralı (büyük harf + sayı + sembol) NEDEN YOK?
//   NIST SP 800-63B → uzunluk > karmaşıklık. Pattern dayatmak kullanıcıyı predictable
//   şifrelere yöneltiyor (Welcome2024! gibi). 8+ char yeterli.
export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta zorunlu')
    .email('Geçerli bir e-posta gir')
    .max(256, 'E-posta en fazla 256 karakter olabilir'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .max(128, 'Şifre en fazla 128 karakter olabilir'),
  fullName: z
    .string()
    .min(1, 'Ad Soyad zorunlu')
    .max(200, 'Ad Soyad en fazla 200 karakter olabilir'),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
