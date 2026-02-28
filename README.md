<div align="center">

# CleanCore React

**Clean Architecture katmanlı, üretime hazır React + TypeScript SPA template'i**

`CleanCore` .NET API'sinin frontend tarafı. Tek komutla ayağa kalkar, refresh-token rotasyonu hazır gelir.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](.github/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-11%20passing-brightgreen)](src/tests/)

</div>

```bash
npm install
cp .env.example .env
npm run dev
```

---

> **Kime?** Clean architecture'ı abartıya kaçmadan, üretim ortamına atılabilecek bir frontend iskeletiyle başlamak isteyenlere.
>
> **Ne değil?** Hazır component kütüphanesi (shadcn fork'u) değil, design system değil, server-side rendering (SSR / Next.js) değil. Saf SPA.
>
> **Neden var?** [CleanCore .NET API](https://github.com/erdemkeskin54/CleanCore)'nin frontend muadili — aynı katmanlı yapı, aynı disiplin. Sonraki projede aynı setup'ı sıfırdan kurmamak için.

---

## İçindekiler

- [Stack](#stack)
- [Hızlı başlangıç](#hızlı-başlangıç)
- [Proje yapısı](#proje-yapısı)
- [Mimari kararlar](#mimari-kararlar)
- [Backend bağlantısı](#backend-bağlantısı)
- [Test stratejisi](#test-stratejisi)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Yol haritası](#yol-haritası)
- [Lisans](#lisans)

---

## Stack

| Kategori | Seçim | Versiyon | Neden? |
|---|---|---|---|
| Framework | **React** | 18.3 | En yaygın SPA framework'ü, ekosistem zengin |
| Dil | **TypeScript** | 5.6 (strict) | Tip güvenliği + IDE intellisense + refactor güvenli |
| Build | **Vite** | 5.4 | Webpack'ten kat kat hızlı dev server, native ESM |
| Styling | **Tailwind CSS** | 3.4 | Utility-first, runtime CSS-in-JS yok, küçük bundle |
| Server state | **TanStack Query** | 5.59 | Cache + refetch + invalidation + dev tools — tekerlek icat etmiyoruz |
| Client state | **Zustand** | 5.0 | Redux'tan az boilerplate, Context'ten iyi performans |
| Routing | **React Router** | 6.27 | Stabil, geniş kullanım, SPA standardı |
| Forms | **React Hook Form** + **Zod** | 7.53 / 3.23 | Performant + tip güvenli validation, backend kuralları aynalanıyor |
| HTTP | **Axios** | 1.7 | Interceptor API'si refresh-token rotasyonu için ideal |
| Tests | **Vitest** + **Testing Library** | 2.1 / 16 | Vite ile aynı transform, jest API'sine yakın |
| Lint / Format | **ESLint 9** + **Prettier 3** | — | Flat config, modern TS plugin'i |
| Container | **Docker** (multi-stage, nginx-alpine, non-root) | — | ~25 MB image, SPA routing için custom nginx config |
| CI | **GitHub Actions** | — | Build + lint + format check + test + Docker build zinciri |

---

## Hızlı başlangıç

### Gereksinimler

- Node.js 22+ ([nvm](https://github.com/nvm-sh/nvm) ile)
- npm 10+
- Çalışan bir **CleanCore .NET API** (default `http://localhost:5005`)

### Kurulum

```bash
git clone https://github.com/erdemkeskin54/CleanCoreReact.git
cd CleanCoreReact
npm install
cp .env.example .env             # API URL'ini .env'de düzenle
npm run dev                      # http://localhost:5173
```

Backend ayrı terminalde çalışıyor olmalı:
```bash
cd ../CleanCore
docker compose up -d             # Postgres
dotnet run --project src/CleanCore.Api
```

### Demo kullanıcı (login için hazır)

Backend dev startup'ında otomatik bir demo user yaratıyor — frontend'de Login sayfasına gidip aşağıdaki bilgileri doğrudan kullanabilirsin:

| Alan | Değer |
|---|---|
| E-posta | `demo@cleancore.dev` |
| Şifre | `Demo1234!` |

Yeni bir hesap açmak istersen Header'daki **"Kayıt ol"** butonu (`/register`) zaten var — `POST /users` çağrısıyla anonim kayıt yapıyor.

### Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Vite dev server (HMR + TS) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | `dist/` üzerinden production preview |
| `npm test` | Vitest unit testleri |
| `npm run test:watch` | Watch modda test |
| `npm run test:coverage` | Coverage raporu |
| `npm run lint` | ESLint kontrol |
| `npm run lint:fix` | ESLint otomatik düzeltme |
| `npm run format` | Prettier formatla |
| `npm run typecheck` | TS tip kontrol (build olmadan) |

---

## Proje yapısı

```
src/
├── domain/                 → Tip tanımları + iş kuralları (framework'siz, backend ile bire bir)
│   ├── shared/
│   │   ├── Result.ts             → Result<T> + Error pattern (backend muadili)
│   │   └── ProblemDetails.ts     → RFC 7807 hata response shape'i
│   ├── auth/
│   │   ├── AuthResponse.ts
│   │   ├── LoginRequest.ts
│   │   └── RefreshRequest.ts
│   └── users/
│       ├── User.ts
│       ├── CreateUserRequest.ts
│       └── UserErrors.ts
│
├── infrastructure/         → Dış dünya (HTTP, storage)
│   ├── api/
│   │   ├── client.ts             → Axios instance + 401-refresh interceptor (rotation, kuyruk)
│   │   ├── endpoints.ts          → Backend route sabitleri
│   │   └── interceptors.ts       (gelecekte logging/telemetri için ayrılır)
│   └── storage/
│       └── tokenStorage.ts       → localStorage abstraction (token I/O tek noktada)
│
├── application/            → Use case'ler (server state hook'ları + client state)
│   ├── stores/
│   │   └── authStore.ts          → Zustand store (isAuthenticated + accessToken)
│   ├── auth/
│   │   ├── useLogin.ts           → POST /auth/login mutation
│   │   ├── useLogout.ts          → POST /auth/logout + cache.clear()
│   │   ├── useRefresh.ts         (interceptor zaten halledyor — manuel kullanım için)
│   │   └── loginSchema.ts        → Zod validation
│   └── users/
│       ├── useCreateUser.ts      → POST /users mutation
│       ├── useGetUserById.ts     → GET /users/{id} query
│       └── createUserSchema.ts   → Zod validation (backend kurallarıyla aynı)
│
├── presentation/           → UI (component'ler, sayfalar, routing)
│   ├── components/
│   │   ├── ui/                   → Button, Input, Card, ErrorMessage (atomic)
│   │   └── layout/               → Header, Layout
│   ├── pages/                    → LoginPage, RegisterPage, DashboardPage, UserDetailPage, NotFoundPage
│   ├── routes/
│   │   └── ProtectedRoute.tsx    → Auth guard (Outlet pattern)
│   └── App.tsx                   → Route ağacı
│
├── shared/                 → Cross-cutting yardımcılar
│   ├── lib/
│   │   └── cn.ts                 → clsx + tailwind-merge sandwich
│   └── config/
│       └── env.ts                → import.meta.env wrapper'ı (fail-fast)
│
└── tests/                  → Vitest setup + birim testler
    ├── setup.ts
    ├── domain/
    ├── infrastructure/
    └── application/
```

**Bağımlılık yönü:** `presentation → application → infrastructure → domain`. Domain hiçbir şeye bağlı değil, backend'deki `Domain` projesi gibi.

---

## Mimari kararlar

### 1. 4 katman, soğan değil kare

Backend ile birebir aynı yaklaşım: domain saf, application iş mantığını orkestre ediyor, infrastructure dış dünyayla konuşuyor, presentation görselleştiriyor.

**Tradeoff:** Tek `pages/` klasöründe `useState + axios` yapan junior dev için ilk bakışta "bu kadar dosyaya ne gerek" hissi. Karşılığında: 6 ay sonra Axios'u Fetch ile değiştirmek istediğinde sadece `infrastructure/api/client.ts`'e dokunuyorsun.

---

### 2. TanStack Query + Zustand kombinasyonu

**Server state** (kullanıcı listesi, ayarlar, vs.) → TanStack Query. Cache, refetch, invalidation, optimistic update — kütüphane halletmiş.

**Client state** (auth durumu, UI flag'leri) → Zustand. Tek satırda store + selector. Redux Toolkit boilerplate'ine gerek yok.

İkisini ayırmak: server state'i client state'te tutmak (eski Redux pattern'i) sürekli senkronizasyon derdi yaratıyordu — TanStack Query bu derdi yok ediyor.

---

### 3. Refresh-token rotasyonu — interceptor'da kuyruklu

Backend rotation veriyor: her refresh eskiyi revoke + yeni pair üretiyor. Client tarafında karmaşa: aynı anda 5 endpoint 401 dönerse, 5 paralel refresh isteği atılmasın.

**Çözüm** (`infrastructure/api/client.ts`):
- `isRefreshing` flag → ilk 401 refresh'i tetikler
- Sonraki 401'ler `pendingRequests` kuyruğuna alınır
- Refresh tamamlanınca kuyruktaki istekler yeni token ile tekrarlanır
- Refresh başarısızsa: kuyruk boşaltılır + localStorage temizlenir + `/login`'e hard redirect

Tek bir refresh isteği, retry'lı, race-safe.

---

### 4. Form validation iki yerde

Frontend (Zod) + backend (FluentValidation) aynı kuralları uyguluyor. Niye iki yerde?

- **Frontend:** UX — server roundtrip beklemeden kullanıcıya hata göster
- **Backend:** Tek savunma değil — frontend tarayıcı dev tools'ta bypass edilebilir, server zorunlu

İki tarafın kuralları **bilinçli olarak senkron** tutuluyor. Backend kuralı değişirse `application/<feature>/<schema>.ts` da güncellenmeli (yorum satırlarında bu hatırlatma var).

---

### 5. ProblemDetails (RFC 7807) standart hata formatı

Backend her hatayı `ProblemDetails` formatında dönüyor. Frontend `ErrorMessage` component'i bu yapıyı parse ediyor:

- `errors` field'ı varsa (validation) → alan-bazlı liste
- Yoksa → `detail` veya generic title (`problemTitle(status)`)
- Network error → "Sunucuya ulaşılamadı"

Tek bir component, tüm hata tipleri için tutarlı UI.

---

### 6. Path alias'lar (`@domain/*`, `@application/*`, ...)

Relative import zincirinden (`../../../../domain/...`) kaçınmak için. Tsconfig + Vite + Vitest hepsi aynı alias'ları paylaşıyor.

**Tradeoff:** Tooling üçünde de (tsc / Vite / Vitest) kayıtlı olmalı, biri unutulursa "module not found". Üçü de tek kaynaktan (vite.config.ts → vitest extends + tsconfig.app.json) kuruluyor.

---

### 7. Zustand store'u localStorage ile manuel senkronize

Zustand `persist` middleware'i var ama biz kullanmadık — token I/O'yu **tek bir noktada** tutmak istiyoruz (`tokenStorage.ts`). Store sadece reactive view, tek doğru kaynak storage.

Niye: refresh interceptor'ı store'a değil, storage'a yazıyor (interceptor React component değil, store'u import etmek garip). İki kaynak olunca senkronizasyon dert. Tek kaynakta kalalım.

---

## Backend bağlantısı

| Endpoint | Frontend hook | Açıklama |
|---|---|---|
| `POST /auth/login` | `useLogin` | Email + şifre → access + refresh pair |
| `POST /auth/refresh` | (interceptor halleder) | Eski → revoke + yeni pair |
| `POST /auth/logout` | `useLogout` | Server-side revoke + client cleanup |
| `POST /users` | `useCreateUser` | Kayıt akışı (anonim) |
| `GET /users/{id}` | `useGetUserById` | Korumalı detay sayfası |
| `GET /todos` | `useGetMyTodos` | Kullanıcının todo listesi |
| `POST /todos` | `useCreateTodo` | Yeni todo (cache invalidation tetikler) |
| `PUT /todos/{id}/toggle` | `useToggleTodo` | Tamamlandı durumu çevir |
| `DELETE /todos/{id}` | `useDeleteTodo` | Soft delete |

Vite dev proxy `/api` istekleri için backend'e (`http://localhost:5005`) yönleniyor — CORS sıkıntısı yaşamamak için. Production'da kendi domain ayarlarına göre `VITE_API_BASE_URL` ile bağlan.

---

## Yeni feature nasıl eklenir? (Todo örneği)

`Todos/` her katmanı dolduran tam bir CRUD örneği. Kendi feature'ını eklerken aynı sırayı takip et:

```
1. Domain          → src/domain/<feature>/<Entity>.ts            (TS interface)
                  → src/domain/<feature>/<Request>.ts           (POST/PUT body shape'leri)
2. Endpoints      → src/infrastructure/api/endpoints.ts          (route sabitleri)
3. Application    → src/application/<feature>/use<UseCase>.ts    (TanStack Query hook'u)
                  → src/application/<feature>/<form>Schema.ts    (Zod validation, varsa)
4. Presentation   → src/presentation/pages/<Feature>Page.tsx     (sayfa)
                  → src/presentation/App.tsx                     (route ekle)
                  → src/presentation/components/layout/Header.tsx (link ekle)
```

**Dikkat edilmesi gerekenler:**

- **Backend tipleri ile bire bir uyum**: Backend `TodoDto` → frontend `Todo` interface'i. Backend kuralı değişirse `domain/<feature>/` ve `application/<feature>/<schema>.ts` ikisi de güncellenmeli — defansif strateji.
- **Cache invalidation**: Mutation hook'ları (`useCreateTodo`, `useToggleTodo`, `useDeleteTodo`) `onSuccess`'te `queryClient.invalidateQueries({ queryKey: [...] })` çağırarak liste cache'ini tazeliyor. Bu sayede sayfa otomatik refetch oluyor — caller manuel refresh yazmıyor.
- **Auth**: Korumalı endpoint'ler için `axios` interceptor 401 alınca refresh denemekte. Yeni hook eklerken extra kod yok — `apiClient.get/post` çağırman yeter.
- **ProblemDetails parsing**: Backend hatası `ErrorMessage` component'i ile render edilir — `error` prop'u `useMutation`/`useQuery`'den gelen `error` (Axios error). Validation hataları (400 + errors dict) alan-bazlı listeleniyor.
- **Optimistik update**: `useToggleTodo` şu an basit invalidation ile çalışıyor. UX kritikse `onMutate` + `onError` rollback pattern'iyle optimistic update ekleyebilirsin (ROADMAP.md'de hint).
- **Path alias'lar**: `@domain/...` / `@application/...` üç yerde tanımlı (tsconfig + vite + vitest). Yeni alias eklersen üçünü de güncelle.

Detay yorumlar her dosyanın başında. `application/todos/` klasörü kopyalayıp adını değiştirip kendi domain'ine uyarlayabilirsin.

---

## Test stratejisi

**Şu an:** 11 unit test (domain Result + tokenStorage + authStore). Her katman için en az bir test.

**Ne ekleneceği** (`docs/ROADMAP.md`'de):
- React Testing Library ile component testleri (LoginPage form akışı vb.)
- MSW (Mock Service Worker) ile API mocking
- Playwright ile E2E (login → dashboard → logout)

**Niye Vitest?** Vite ile aynı transform kullanıyor — config tek dosyada (`vitest.config.ts` Vite config'ini extend ediyor). Jest ile aynı API.

---

## Docker

```bash
docker build -t cleancore-react .
docker run --rm -p 8080:80 cleancore-react
# → http://localhost:8080
```

Image ~25 MB (nginx-alpine + dist). Multi-stage build:
- Stage 1: node-alpine → vite build
- Stage 2: nginx-alpine + custom config (SPA routing + güvenlik header'ları + gzip)

Production'da: build sırasında `VITE_API_BASE_URL` doğru değerle (`https://api.example.com/api/v1`) verilmeli — Vite static bundle, env'i build-time'da inline'lıyor.

---

## CI/CD

`.github/workflows/ci.yml` iki job:

1. **build-and-test** — her push/PR'da: `typecheck → lint → format:check → test → build`. `dist/` artifact upload.
2. **docker** — sadece `main` push'ta: Docker image build (push yok, sadece smoke test).

Production deployment manuel — kendi platformuna göre (Vercel, Cloudflare Pages, S3+CloudFront, kendi VPS'in vs.) ek workflow ekle.

---

## Yol haritası

v1.0 hazır. Yol haritasında olanlar:

- React Testing Library ile component testleri (form akışları)
- MSW (Mock Service Worker) ile API mocking — testler ve dev'de offline mock
- Playwright ile E2E test (login → dashboard → logout)
- Storybook entegrasyonu — component katalogu
- React Hook Form ile global form error helper
- i18n (react-intl veya i18next) — backend mesajlarıyla aynı dil dosyası
- Tema (dark mode) — Tailwind class strategy
- PWA (service worker + offline)
- Sentry / OpenTelemetry — frontend hata izleme
- Bundle analyzer + code splitting (route-based)
- Husky + lint-staged + commitlint — pre-commit zinciri

---

## Lisans

MIT — kullan, fork'la, özelleştir. Backend ile aynı lisans.

---

<div align="center">

**Erdem KESKİN** tarafından geliştirildi.
[@erdemkeskin54](https://github.com/erdemkeskin54)

Backend tarafı: [erdemkeskin54/CleanCore](https://github.com/erdemkeskin54/CleanCore)

</div>
