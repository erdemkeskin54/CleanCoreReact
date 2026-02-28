# CleanCore React — İlerleme Takibi

Faz-faz tamamlanan işler. Her commit bir checkbox değil, her FAZ tek oturum hedefiydi.

---

## Faz 1 — Bootstrap (Ocak ilk hafta) — ✅

- [x] Repo iskeleti (.gitignore, .editorconfig, .prettierrc, .dockerignore, .env.example)
- [x] Vite + React 18 + TS 5.6 scaffolding
- [x] Path alias'lar (tsconfig + vite + vitest tek kaynaktan)
- [x] ESLint 9 flat config + Prettier 3 + eslint-config-prettier compat

**Bitiş notu:** `npm run dev` ayağa kalkıyor, boş HelloWorld component'i render oluyor. Tooling katmanı sağlam.

---

## Faz 2 — Domain (Ocak ikinci hafta) — ✅

- [x] `Result<T>` + `Error` pattern (backend muadili)
- [x] `ProblemDetails` interface'i (RFC 7807)
- [x] Auth tipleri (`AuthResponse`, `LoginRequest`, `RefreshRequest`)
- [x] Users tipleri (`User`, `CreateUserRequest`, `UserErrors`)

**Bitiş notu:** Domain saf TS — hiçbir external paket import etmiyor (Zod application'da, react burada yok). Backend Domain projesiyle aynı disiplin.

---

## Faz 3 — Infrastructure (Ocak üçüncü hafta) — ✅

- [x] `tokenStorage` — localStorage abstraction (read/write/clear/hasToken)
- [x] `endpoints` — backend route sabitleri
- [x] Axios client + request interceptor (Bearer header)
- [x] Response interceptor — 401 → refresh + retry, single-flight kuyruk

**Bitiş notu:** Auth interceptor production-grade: race condition önlemli, refresh fail → hard redirect. Test ortamında MSW ile mock'lanabilir.

---

## Faz 4 — Application (Ocak son hafta) — ✅

- [x] Zustand auth store (`useAuthStore`)
- [x] TanStack Query QueryClient setup (retry, staleTime, refetchOnWindowFocus)
- [x] `useLogin`, `useLogout` mutation hook'ları
- [x] `useCreateUser`, `useGetUserById` hook'ları
- [x] Zod schema'ları (`loginSchema`, `createUserSchema`) — backend kurallarıyla aynı

**Bitiş notu:** Hook katmanı tam. Component'lerin tek görevi: form input'unu hook'a vermek + dönen data/error'a göre render.

---

## Faz 5 — Presentation (Şubat ortası) — ✅

- [x] Tailwind 3.4 + custom brand color paleti
- [x] UI atomları: Button (variant + size), Input (label + error), Card, ErrorMessage
- [x] Layout: Header (auth-aware) + Layout shell + Footer
- [x] Sayfalar: LoginPage, RegisterPage, DashboardPage, UserDetailPage, NotFoundPage
- [x] React Router 6 + ProtectedRoute (Outlet pattern)
- [x] App.tsx — initialize auth store on mount

**Bitiş notu:** Login → Dashboard → Logout end-to-end çalışıyor. Backend ayağa kalkmış olunca tüm akış tamam.

---

## Faz 6 — Test + Tooling (Şubat son hafta) — ✅

- [x] Vitest 2 + jsdom + testing-library setup
- [x] localStorage mock (Node 22+ native localStorage çakışması için)
- [x] Domain Result testleri (3 test)
- [x] Infrastructure tokenStorage testleri (4 test)
- [x] Application authStore testleri (4 test)
- [x] Dockerfile (multi-stage, nginx-alpine, non-root, healthcheck)
- [x] nginx.conf (SPA routing + güvenlik header'ları + gzip)
- [x] GitHub Actions CI (typecheck + lint + format + test + build + Docker)
- [x] README + ARCHITECTURE.md + PROGRESS.md + ROADMAP.md

**Bitiş notu:** v1.0 hazır. **11 test yeşil**, build temiz, Docker image'ı ~25 MB. NuGet/npm paketi olarak değil, GitHub template repo olarak kullanım — yeni proje açan `gh repo create --template erdemkeskin54/CleanCoreReact` ile bir komutla başlatıyor.

---

## Session notları

### 2026-02-28
- **Faz 1–6 tamamlandı. CleanCore React v1.0 hazır.**
- Backend [erdemkeskin54/CleanCore](https://github.com/erdemkeskin54/CleanCore) ile birebir uyumlu auth flow + Users CRUD.
- Refresh-token rotasyonu + interceptor kuyruğu test edildi (manuel: 5 paralel istek 401 → tek refresh + 5 retry).
- Bundle: 360 KB raw / 114 KB gzip — kabul edilebilir, route-based code splitting ile düşürülebilir (roadmap).
- **Kaldığım yer:** v1.0 bitti. Sıradaki adımlar `docs/ROADMAP.md`'de.
