# CleanCore React — Yol Haritası

v1.0 hazır. v1.x sürecinde eklenecek başlıklar aşağıda. Öncelik ihtiyaca göre değişir.

---

## Yol haritası

- [ ] **React Testing Library + component testleri** — LoginPage form akışı, ProtectedRoute redirect, ErrorMessage variant'ları. Şu an sadece domain/infra/store seviyesinde test var.
- [ ] **MSW (Mock Service Worker)** — Hem testlerde hem dev'de offline mock. Backend ayakta olmadan da geliştirme yapabilirsin.
- [ ] **Playwright E2E** — login → dashboard → logout tam akış. CI'da headless çalışır.
- [ ] **Storybook** — UI component katalogu. Tasarımcıyla iletişim için + visual regression test (Chromatic) ile birleşince güçlü.
- [ ] **Form error helper** — `useFormErrors(error, setError)` ile RHF + ProblemDetails errors dict'i otomatik mapping. Şu an manuel.
- [ ] **i18n** — `react-intl` veya `i18next`. Backend hata mesajlarıyla aynı dil dosyası → kullanıcı dilini değiştirebilir.
- [ ] **Dark mode** — Tailwind class strategy + `useTheme` hook. localStorage persistence + system preference.
- [ ] **PWA** — Service worker + offline cache + install prompt. Vite PWA plugin'i hazır.
- [ ] **Frontend gözlem (observability)** — Sentry veya OpenTelemetry. JS exception + performance metric backend'e gönderiliyor.
- [ ] **Bundle analyzer + route-based code splitting** — `React.lazy` + `Suspense` ile her route ayrı chunk. İlk yüklemeyi azaltır.
- [ ] **Husky + lint-staged + commitlint** — pre-commit'te ESLint + Prettier + tip kontrolü. Conventional commits enforce.
- [ ] **Theme provider + design tokens** — Marka rengi, spacing, typography'i runtime CSS variable olarak expose. Multi-tenant görsel tema için altyapı.
- [ ] **Auth: silent refresh** — Access token expiry'sine 30sn kala proaktif refresh (interceptor'a güvenmek yerine). UX için: 401 görmeden token tazelenir.
- [ ] **Permission-based UI** — Backend'in role/policy auth'u gelince frontend tarafında `<Can permission="user.read">...</Can>` component'i.

---

## Yayın planı

- **v0.1** — Faz 1-3 bitmiş → GitHub private
- **v0.5** — Faz 4-5 bitmiş → GitHub public
- **v1.0** — Faz 6 bitmiş ✅ → GitHub template repo olarak hazır
- **v1.x** — Yol haritası başlıkları (test coverage + MSW + i18n öncelikli)
