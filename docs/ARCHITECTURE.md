# CleanCore React — Mimari Kararlar

Bu dosya **"niye bu şekilde yapıldı"** sorusunun cevaplarını tutar.
Bir kural koyarken buraya yaz. 6 ay sonra "niye böyle yapmışım" dediğinde cevap burada olacak.

---

## Katman Bağımlılıkları

```
Presentation ──► Application ──► Infrastructure ──► Domain
                       │                     │             ▲
                       └─────────────────────┴─────────────┘
```

| Katman | Neye bağlı? | Ne yapar? |
|---|---|---|
| **Domain** | Hiçbir şeye | Tipler (User, AuthResponse), Result/Error pattern. Saf TS. |
| **Application** | Domain | Use case hook'ları (TanStack Query mutation/query), Zustand store, Zod schema. |
| **Infrastructure** | Domain + Application abstractions | Axios client, localStorage, refresh interceptor. |
| **Presentation** | Hepsi | React component'leri, sayfalar, routing. |

**Altın kural:** Domain hiçbir external paket import etmez (Zod hariç — Zod'un kendisi domain primitive'i sayılabilir). Saf TS.

---

## Neden TanStack Query + Zustand (Redux değil)?

**Redux Toolkit:**
- Server state'i client state'e kopyalıyor → senkronizasyon derdi
- 4 dosya yazmak için 4 dosya (slice, action, reducer, selector)
- DevTools güçlü ama TanStack Query DevTools'u da yeterli

**TanStack Query:**
- Server state için tasarlanmış: cache, refetch, invalidation, retry, optimistic update
- Stale-while-revalidate stratejisi UX'i temizliyor
- Backend'deki "her endpoint bir handler" disiplinine 1-to-1 hook eşleşmesi

**Zustand:**
- Client state için (auth durumu, modal açık mı, theme vs.) yeter
- Boilerplate yok: `create((set) => ({ ... }))` tek satır
- Selector ile re-render kontrolü (shallow eşitlikle çalışıyor)

İkisini birlikte: server'dan gelen veri TanStack'ta, lokal UI durumu Zustand'da. Karışmasınlar.

---

## Neden Axios, Native Fetch Değil?

Native fetch yeter ama:
- **Interceptor API'si yok** → refresh-token rotation manuel implement gerek
- **JSON parse manuel** → her response'da `.json()` çağırmak yorucu
- **Timeout yok** → AbortController setup gerek

Axios:
- Interceptor zinciri tek satır
- Otomatik JSON parse
- Timeout config bir property
- TS desteği olgun

**Trade-off:** ~13 KB extra bundle. Karşılığında interceptor + retry mantığı temiz.

---

## Neden Refresh Token localStorage'da (Cookie değil)?

Cookie yaklaşımı (HttpOnly + SameSite + Secure):
- ✓ XSS'e açık değil (JavaScript erişemez)
- ✗ CSRF koruması ek iş (CSRF token + double-submit pattern)
- ✗ SameSite=Strict cross-origin'de çalışmıyor (frontend ve backend ayrı domain'lerde)
- ✗ Mobile WebView'lerde tutarsız davranış

localStorage yaklaşımı:
- ✓ Cross-origin sorun yok
- ✓ Implementasyon basit
- ✗ XSS'e açık (ama CSP + DOMPurify + dependency audit ile risk daraltılıyor)

SPA + ayrı API host kombinasyonu için **localStorage tercih edilen yöntem**. CSP header'ları (backend'de `Content-Security-Policy`) XSS yüzeyini ciddi şekilde daraltıyor.

---

## Neden React Router (Next.js Değil)?

**Next.js:**
- SSR, ISR, server actions — backend'imiz zaten ASP.NET Core
- Vercel ekosistemi — vendor lock-in
- API routes ile backend yazma alışkanlığı — CleanCore zaten ayrı bir API

**React Router:**
- Saf SPA için yeter
- Route-based code splitting opsiyonel
- Ekosistem stabil, breaking change azaldı (v6 yıllardır stabil)

**Trade-off:** SEO'ya ihtiyaç olan landing page için SSR gerekirse Next.js'e geçilebilir. Bu template **uygulamanın SPA tarafı** için — landing page ayrı bir Next.js projesi olabilir.

---

## Neden Tailwind, Styled-Components Değil?

**Styled-components / Emotion:**
- Runtime CSS-in-JS → bundle'da +20-30 KB
- Component'in className'i dinamik → Tailwind'in JIT optimizasyonu yok
- Server-Side Rendering'de hidrasyon karmaşası

**Tailwind:**
- Build-time → runtime cost yok
- Utility-first → component'i okurken stilini görüyorsun (ayrı dosya açma)
- Tasarım sistemini `tailwind.config.js`'te kurarsın (renkler, spacing, typography)
- Tree-shaking otomatik (kullanılmayan class'lar bundle'a girmez)

**Trade-off:** İlk başta `<div className="flex items-center gap-2 px-4 py-2 ...">` çirkin görünüyor. Alıştıkça `cn()` ile uzun zincirleri component'lere çekiyorsun.

---

## Neden Zod, Yup Değil?

**Yup:** Eski, JS odaklı, TS tipleri ikincil.
**Zod:** TypeScript-first. `z.infer<typeof schema>` ile schema → tip otomatik.

```ts
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
type LoginFormValues = z.infer<typeof loginSchema>;  // { email: string; password: string }
```

Aynı schema hem runtime validation hem compile-time tip sağlıyor. Backend FluentValidation ile aynı kuralları yansıtıyoruz.

---

## Neden Vitest, Jest Değil?

**Jest:**
- Babel transform — Vite ile farklı pipeline → testte çalışan kod prod'da çalışmıyor sorunu
- ESM desteği yamalı
- Yavaş başlama

**Vitest:**
- Vite ile aynı transform — testte ne çalışıyorsa prod'da da çalışıyor
- ESM native
- Hızlı (Vite hot reload'a benzer test re-run'ı)
- Jest API uyumlu (`describe / it / expect`) — migration zahmetsiz

---

## Neden ESLint Flat Config?

ESLint 9'dan itibaren `eslint.config.js` (flat config) default. Eski `.eslintrc.json` deprecated.

**Avantaj:** Tek dosyada tüm config (extends, rules, ignores), JavaScript ile yazılı (yorum + computed config).

**Yan etki:** Bazı eski plugin'ler flat config'e adapte olmadı — kullanmadık. Modern stack için sorun değil.

---

## Neden Prettier ESLint İçinde Değil?

Eski yaklaşım: `eslint-plugin-prettier` ile lint hatalarına Prettier kuralları da ekleniyordu. Yavaş + kafa karıştırıcı.

Yeni yaklaşım:
- `eslint-config-prettier` → ESLint'in stil kurallarını **kapatıyor** (Prettier ile çakışmasın)
- Prettier ayrı çalışıyor (`npm run format`, `npm run format:check`)

Sonuç: ESLint kod kalitesi (no-unused-vars, react-hooks/rules-of-hooks vb.), Prettier formatla. İkisi farklı sorumluluk.

---

## Neden Path Alias'lar (`@domain/*` vs.)?

Relative import zinciri (`../../../../infrastructure/api/client`) okunaksız + refactor düşmanı. Path alias:

```ts
// Önce
import { apiClient } from '../../../../infrastructure/api/client';

// Sonra
import { apiClient } from '@infrastructure/api/client';
```

Üç yerde kayıtlı:
- `tsconfig.app.json` → IDE intellisense
- `vite.config.ts` → build & dev server
- `vitest.config.ts` → testler (Vite config'i extend ediyor, otomatik)

Birini unutursan "module not found". Üçünü tek kaynaktan kurmaya dikkat.

---

## Neden Provider Sırası `QueryClient → BrowserRouter`?

```tsx
<QueryClientProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</QueryClientProvider>
```

Niye bu sıra:
- `QueryClient` mount/unmount'ta cache temizlemez — outer olmalı
- `BrowserRouter` route değişiminde re-render tetikliyor — inner olmalı ki query'ler unmount/remount olmadan navigation çalışsın

Tersine çevirsek (Router dışta), navigation sırasında QueryClient yeniden mount olabilir → cache kaybı.

---

## Neden `isRefreshing` + `pendingRequests` Kuyruğu?

Sorun: Aynı anda 5 endpoint çağrısı 401 dönüyor (token expired). Her biri ayrı refresh isteği atarsa:
- 5 paralel refresh request → backend rotation → ilk biri eskiyi revoke ediyor
- İkincisi geldiğinde "geçersiz token" → 401 → kullanıcı logout

Çözüm: Single-flight pattern.
- İlk 401 → refresh başlat (`isRefreshing = true`)
- Sonraki 401'ler → `pendingRequests` kuyruğuna `(token) => void` callback olarak eklen
- Refresh tamamlanınca → kuyruktaki callback'lere yeni token gönderilir → istekler retry edilir

Trade-off: Bir miktar karmaşa. Karşılığında: race condition yok, kullanıcı kilitli kalmıyor.

---

## Neden Auth Mantığı `useLogin` Hook'unda Zustand Setter Çağırıyor?

Alternatif: TanStack Query'nin `onSuccess` callback'inde manuel `tokenStorage.set` + Zustand `setAuth` çağırmak. Component'in sorumluluğu olur.

Bizim yaklaşım: Hook (`useLogin`) bu işi kendi `onSuccess`'inde yapıyor. Component sadece `mutate(...)` çağırıyor.

Niye: Auth side-effect'i (storage + store) **her login'de aynı**. Hook'ta merkezîleştirmek = unutmak imkansız. Component'te yapsak: 5 yerde login button'u olsa, 5 yerde storage update + store sync yazmak gerekirdi.
