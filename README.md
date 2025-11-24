## Squad Invasion Landing

Marketing лендинг для дискорд-сообщества по игре Squad. Главные задачи сайта:

- показать мультиклановую команду (геройка, блок преимуществ, галерея матчей),
- дать противникам и союзникам быстрый доступ к расписанию через Google Calendar,
- поддерживать две локали (RU/EN) с помощью `next-intl`.

Проект построен на App Router (Next.js 16) и Tailwind-подходе из shadcn/ui.

---

## Tech stack

| Layer           | Детали                                                                 |
|-----------------|------------------------------------------------------------------------|
| Framework       | Next.js 16 (App Router, React 19)                                      |
| UI / Styling    | shadcn/ui (Radix primitives), `clsx`, `tailwind-merge`                 |
| Theming         | `next-themes` + кастомные CSS variables                                 |
| i18n            | `next-intl` + JSON файлы (`src/locales/en.json`, `ru.json`)            |
| Animations      | GSAP (target-cursor из ReactBits)                                      |
| Data fetching   | Google Calendar API (client-side fetch)                                |
| Forms/Validation| `zod`, `intl-messageformat` для сообщений                              |
| Tooling         | TypeScript 5, ESLint 9, Drizzle (для будущих данных)                   |

---

## Requirements

- Node.js ≥ 18.18
- npm (или pnpm/yarn/bun)
- Google Cloud API key с включённым Calendar API
- Публичный Google Calendar, расшаренный «Make available to public»

---

## Environment variables

Создайте `.env.local` и заполните:

```bash
NEXT_PUBLIC_GOOGLE_API_KEY=your-calendar-api-key
NEXT_PUBLIC_GOOGLE_CALENDAR_ID=team-calendar-id@group.calendar.google.com
```

> **Важно:** ID календаря должен быть публичным. После изменения `.env.local` перезапустите dev-сервер.

---

## Scripts

```bash
npm install        # установка зависимостей
npm run dev        # локальная разработка на http://localhost:3000
npm run build      # production билд (используется Vercel)
npm run start      # запуск собранного приложения
npm run lint       # ESLint
```

---

## Структура проекта

```
src/
├─ app/
│  ├─ layout.tsx        # базовый layout (App Router)
│  └─ [locale]/         # локализованные страницы
├─ components/
│  ├─ sections/         # геро-блок, галерея, расписание, контакты и т.д.
│  └─ ui/               # переиспользуемые элементы shadcn + кастомные
├─ data/home.ts         # мок-данные (карточки, соцсети, расписание)
├─ i18n/                # next-intl конфигурация, middleware routing
└─ locales/             # JSON файлы с переводами
public/
└─ strategic_discord.jpg # используется в hero-секции
```

---

## Локализация

- `next-intl` получает текущую локаль через `[locale]` сегмент и middleware.
- Все тексты для секций находятся в `src/locales/*.json`.
- Для новых строк добавьте ключ в обе локали и обращайтесь через `getTranslations` (серверные компоненты) или `useTranslations` (клиент).

---

## Google Calendar

Секция `EventsSection` делает `fetch` к Calendar API на клиенте. При настройке:

1. В Google Cloud создайте API key и включите Calendar API.
2. В календаре откройте **Settings → Access permissions for events → Make available to public**.
3. ID календаря внесите в `NEXT_PUBLIC_GOOGLE_CALENDAR_ID`.
4. После этого блок «Upcoming operations» обновится автоматически.

Также в секции есть:
- кнопка «Request match in Discord» (ведёт на сервер),
- «Open Google Calendar» (открывает embed),
- «Download .ics feed» (позволяет импортировать расписание в другие клиенты).

---

## Деплой

Приложение разворачивается на Vercel:

1. Залогиньтесь в Vercel и импортируйте репозиторий.
2. В разделе **Settings → Environment Variables** задайте те же env, что в `.env.local`.
3. Vercel использует `npm run build` и `npm run start`.

---

## Дополнительно

- Галерея матчей использует компонент `TargetCursor` из ReactBits. Если нужно отключить эффект, удалите `TargetCursor` из `GallerySection`.
- Секция «Schedule» описывает форматы и направляет на `/rules`. Весь тайминг берётся из Google Calendar, поэтому отдельных расписаний в коде нет.
- Медиа-файлы в `public/` сохраняем только те, что реально используются (сейчас это `strategic_discord.jpg`).

Если понадобятся подсказки по контенту/локалям/интеграциям — см. `TODO.md` и комментарии в коде. Приятной разработки!
