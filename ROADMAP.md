# План масштабирования Squad Invasion Platform

## Текущее состояние

**Технологический стек:**

- Next.js 16 (App Router, React 19)
- TypeScript 5
- Drizzle ORM + Supabase (базовая схема)
- Tailwind CSS + shadcn/ui
- next-intl (RU/EN локализация)
- Zod для валидации
- Google Calendar API интеграция

**Текущий функционал:**

- Лендинг с секциями (hero, events, team, gallery, schedule)
- Отображение событий из Google Calendar
- Двуязычность (RU/EN)
- Базовая схема БД (users таблица, не используется)

## Архитектурные решения

**Подход:** Монолитное приложение с постепенным выделением сервисов при необходимости

**База данных:** Supabase (PostgreSQL под капотом)

- Использование Supabase как BaaS платформы
- Расширение схемы в `shared/schema.ts`
- Миграции через Drizzle Kit
- Supabase предоставляет: базу данных, storage, realtime subscriptions

**Аутентификация:** Supabase Auth или NextAuth.js (Auth.js) v5

- Supabase Auth (рекомендуется): встроенная аутентификация с OAuth
- NextAuth.js как альтернатива: OAuth провайдеры (Steam, Discord)
- Email/password как fallback
- JWT сессии

**API:** Next.js Route Handlers (App Router)

- RESTful API в `src/app/api/`
- Server Actions для форм

**Файловое хранилище:**

- Supabase Storage (рекомендуется, входит в платформу)
- Vercel Blob Storage (альтернатива для MVP)
- S3-совместимое хранилище (для продакшена)

**Уведомления:**

- Email: Resend или SendGrid
- Push: Web Push API
- Discord: Webhooks + Bot API

---

## Git Workflow и соглашения

### Соглашения о ветках

**Формат:** `{тип}/{фаза}-{краткое-описание}`

**Типы веток:**

- `feature/` - новая функциональность
- `fix/` - исправление багов
- `refactor/` - рефакторинг кода
- `setup/` - настройка инфраструктуры
- `docs/` - документация

**Примеры:**

- `feature/phase-0-supabase-setup`
- `feature/phase-1-auth-steam-oauth`
- `fix/phase-1-event-registration-bug`
- `setup/phase-0-ci-cd-pipeline`

### Соглашения о коммитах

**Формат:** `{тип}({scope}): {краткое описание}`

**Типы коммитов:**

- `feat` - новая функциональность
- `fix` - исправление бага
- `refactor` - рефакторинг
- `docs` - документация
- `style` - форматирование
- `test` - тесты
- `chore` - рутинные задачи
- `setup` - настройка

**Примеры:**

- `feat(auth): add Steam OAuth integration`
- `fix(events): resolve registration count bug`
- `refactor(schema): optimize database queries`
- `docs(readme): update installation instructions`

---

## Фазы разработки

### Фаза 0: Подготовка инфраструктуры (2-3 недели)

**Ветка:** `setup/phase-0-infrastructure`

**Цель:** Подготовить базовую инфраструктуру для масштабирования

#### Неделя 1: Настройка Supabase и базы данных

**Ветка:** `setup/phase-0-supabase-setup`

**Задачи:**

1. **Создание Supabase проекта**

   - Создать проект в Supabase Dashboard
   - Сохранить credentials в `.env.local`
   - Настроить connection string для Drizzle

   **Коммиты:**

   ```
   setup(supabase): initialize Supabase project
   setup(env): add Supabase environment variables
   docs(env): add .env.example with Supabase config
   ```

2. **Расширение схемы базы данных**

   - Расширить `shared/schema.ts` с основными таблицами
   - Создать миграции через Drizzle Kit

   **Файлы для создания/изменения:**

   - `shared/schema.ts` - расширить схему
   - `migrations/0001_initial_schema.sql` - первая миграция

   **Коммиты:**

   ```
   feat(schema): add users table with extended fields
   feat(schema): add events table schema
   feat(schema): add clans and clan_members tables
   feat(schema): add event_registrations table
   feat(schema): add notes and match_results tables
   feat(schema): add user_stats and leaderboards tables
   feat(migrations): generate initial database migration
   ```

3. **Настройка Drizzle Kit**

   - Проверить `drizzle.config.ts`
   - Добавить скрипты в `package.json` для миграций

   **Коммиты:**

   ```
   setup(drizzle): configure drizzle-kit for migrations
   chore(package): add db:generate and db:migrate scripts
   ```

#### Неделя 2: Аутентификация и базовые API

**Ветка:** `setup/phase-0-auth-setup`

**Задачи:**

1. **Настройка Supabase Auth**

   - Установить `@supabase/supabase-js` и `@supabase/auth-helpers-nextjs`
   - Создать Supabase client utilities
   - Настроить OAuth провайдеры (Steam, Discord) в Supabase Dashboard

   **Файлы для создания:**

   - `src/lib/supabase/client.ts` - клиент для клиента
   - `src/lib/supabase/server.ts` - клиент для сервера
   - `src/lib/supabase/middleware.ts` - middleware для auth

   **Коммиты:**

   ```
   setup(auth): install Supabase auth dependencies
   feat(auth): create Supabase client utilities
   feat(auth): setup server-side Supabase client
   feat(auth): add auth middleware for protected routes
   docs(auth): document OAuth provider setup
   ```

2. **Создание базовых API роутов**

   - Создать структуру папок `src/app/api/`
   - Настроить базовые роуты для health check

   **Файлы для создания:**

   - `src/app/api/health/route.ts` - health check endpoint

   **Коммиты:**

   ```
   feat(api): create API route structure
   feat(api): add health check endpoint
   ```

#### Неделя 3: CI/CD и окружения

**Ветка:** `setup/phase-0-ci-cd`

**Задачи:**

1. **Настройка CI/CD pipeline**

   - Создать GitHub Actions workflow
   - Настроить автоматические деплои на Vercel
   - Настроить тестирование перед деплоем

   **Файлы для создания:**

   - `.github/workflows/ci.yml` - CI pipeline
   - `.github/workflows/deploy.yml` - деплой pipeline

   **Коммиты:**

   ```
   setup(ci): add GitHub Actions CI workflow
   setup(ci): configure automated testing
   setup(deploy): add Vercel deployment workflow
   docs(ci): document CI/CD process
   ```

2. **Настройка окружений**

   - Создать `.env.example` с описанием всех переменных
   - Настроить переменные окружения в Vercel
   - Документировать процесс настройки

   **Коммиты:**

   ```
   setup(env): create comprehensive .env.example
   docs(env): document environment setup process
   ```

3. **Миграция данных (опционально)**

   - Создать скрипт для миграции данных из Google Calendar
   - Запустить миграцию в тестовом окружении

   **Коммиты:**

   ```
   feat(migration): create Google Calendar migration script
   feat(migration): add data validation for migrated events
   ```

**Чеклист завершения Фазы 0:**

- [ ] Supabase проект создан и настроен
- [ ] Все таблицы созданы и мигрированы
- [ ] Supabase Auth настроен с OAuth провайдерами
- [ ] Базовые API роуты работают
- [ ] CI/CD pipeline настроен и работает
- [ ] Все переменные окружения задокументированы
- [ ] Тестовые данные загружены (опционально)

**Мерж в main:** После завершения всех задач и тестирования

---

### Фаза 1: MVP - Базовая платформа (7-9 недель)

**Ветка:** `feature/phase-1-mvp`

**Цель:** Минимально жизнеспособный продукт для организации ивентов

#### Неделя 1: Аутентификация и суперадмин панель

**Ветка:** `feature/phase-1-auth-superadmin`

**Задачи:**

1. **Регистрация и авторизация (базовая)**

   - Создать страницы логина и регистрации
   - Реализовать OAuth кнопки (Steam, Discord)
   - Настроить callback handlers
   - Базовая проверка ролей пользователей

   **Файлы для создания:**

   - `src/app/[locale]/auth/login/page.tsx`
   - `src/app/[locale]/auth/register/page.tsx`
   - `src/app/api/auth/callback/route.ts`
   - `src/components/auth/login-form.tsx`
   - `src/components/auth/register-form.tsx`
   - `src/components/auth/oauth-buttons.tsx`
   - `src/lib/auth/roles.ts` - утилиты для проверки ролей
   - `src/lib/auth/permissions.ts` - утилиты для проверки прав

   **Коммиты:**

   ```
   feat(auth): create login page with OAuth options
   feat(auth): create registration page
   feat(auth): implement Steam OAuth callback handler
   feat(auth): implement Discord OAuth callback handler
   feat(auth): add OAuth button components
   feat(auth): add role-based access control utilities
   feat(auth): add permission-based access control system
   feat(auth): handle OAuth errors and edge cases
   ```

2. **Создание суперадмин панели**

   - Создать структуру суперадмин панели
   - Настроить защиту роутов (middleware для проверки суперадмин роли)
   - Создать дашборд суперадмина
   - Система управления правами доступа

   **Файлы для создания:**

   - `src/app/[locale]/superadmin/page.tsx` - главная страница суперадминки
   - `src/app/[locale]/superadmin/layout.tsx` - layout с навигацией
   - `src/components/superadmin/superadmin-nav.tsx` - навигация
   - `src/components/superadmin/superadmin-dashboard.tsx` - дашборд
   - `src/lib/auth/middleware.ts` - middleware для проверки ролей и прав
   - `src/lib/auth/permission-checker.ts` - проверка прав доступа

   **Коммиты:**

   ```
   feat(superadmin): create superadmin panel structure
   feat(superadmin): add superadmin navigation component
   feat(superadmin): create superadmin dashboard
   feat(superadmin): implement superadmin route protection
   feat(auth): add permission checking middleware
   ```

3. **Система управления правами доступа**

   - Создание и управление разрешениями (permissions)
   - Назначение прав пользователям
   - Управление правами по ролям
   - Просмотр всех прав пользователя
   - История изменений прав

   **Файлы для создания:**

   - `src/app/[locale]/superadmin/permissions/page.tsx` - список всех прав
   - `src/app/[locale]/superadmin/permissions/create/page.tsx` - создание права
   - `src/app/[locale]/superadmin/users/[id]/permissions/page.tsx` - права пользователя
   - `src/components/superadmin/permissions/permissions-list.tsx`
   - `src/components/superadmin/permissions/user-permissions-manager.tsx`
   - `src/components/superadmin/permissions/role-permissions-manager.tsx`
   - `src/app/api/superadmin/permissions/route.ts`
   - `src/app/api/superadmin/users/[id]/permissions/route.ts`
   - `src/app/api/superadmin/roles/[role]/permissions/route.ts`

   **Коммиты:**

   ```
   feat(superadmin): create permissions management system
   feat(superadmin): add permissions list page
   feat(superadmin): implement permission creation
   feat(superadmin): add user permissions management
   feat(superadmin): add role permissions management
   feat(superadmin): display permission history
   feat(api): add GET /api/superadmin/permissions endpoint
   feat(api): add POST /api/superadmin/permissions endpoint
   feat(api): add PUT /api/superadmin/permissions/[id] endpoint
   feat(api): add GET /api/superadmin/users/[id]/permissions endpoint
   feat(api): add POST /api/superadmin/users/[id]/permissions endpoint
   feat(api): add DELETE /api/superadmin/users/[id]/permissions/[permissionId] endpoint
   feat(api): add GET /api/superadmin/roles/[role]/permissions endpoint
   feat(api): add PUT /api/superadmin/roles/[role]/permissions endpoint
   ```

4. **Управление ролями пользователей**

   - Изменение ролей пользователей (назначение админов, event_admin)
   - Просмотр всех пользователей с фильтрами по ролям
   - Массовое изменение ролей
   - История изменений ролей

   **Файлы для создания:**

   - `src/app/[locale]/superadmin/users/page.tsx` - список всех пользователей
   - `src/app/[locale]/superadmin/users/[id]/role/page.tsx` - изменение роли
   - `src/components/superadmin/users/users-list.tsx`
   - `src/components/superadmin/users/role-selector.tsx`
   - `src/app/api/superadmin/users/route.ts`
   - `src/app/api/superadmin/users/[id]/role/route.ts`

   **Коммиты:**

   ```
   feat(superadmin): add users list with role filters
   feat(superadmin): implement user role management
   feat(superadmin): add bulk role changes
   feat(superadmin): display role change history
   feat(api): add GET /api/superadmin/users endpoint
   feat(api): add PUT /api/superadmin/users/[id]/role endpoint
   feat(api): add POST /api/superadmin/users/bulk-role-change endpoint
   ```

5. **Дополнительные функции суперадмина**

   - Управление системными настройками платформы
   - Управление конфигурацией OAuth провайдеров
   - Просмотр всех аудит логов
   - Экспорт данных платформы
   - Резервное копирование базы данных
   - Управление версиями и миграциями
   - Мониторинг системы (статистика, производительность)

   **Файлы для создания:**

   - `src/app/[locale]/superadmin/settings/page.tsx` - системные настройки
   - `src/app/[locale]/superadmin/audit/page.tsx` - все аудит логи
   - `src/app/[locale]/superadmin/backup/page.tsx` - резервное копирование
   - `src/app/[locale]/superadmin/monitoring/page.tsx` - мониторинг
   - `src/components/superadmin/settings/system-settings.tsx`
   - `src/components/superadmin/audit/audit-logs-viewer.tsx`
   - `src/components/superadmin/monitoring/system-metrics.tsx`
   - `src/app/api/superadmin/settings/route.ts`
   - `src/app/api/superadmin/audit/route.ts`
   - `src/app/api/superadmin/backup/route.ts`
   - `src/app/api/superadmin/monitoring/route.ts`

   **Коммиты:**

   ```
   feat(superadmin): add system settings management
   feat(superadmin): add OAuth providers configuration
   feat(superadmin): create audit logs viewer
   feat(superadmin): add data export functionality
   feat(superadmin): implement database backup
   feat(superadmin): add system monitoring dashboard
   feat(superadmin): display platform statistics
   feat(superadmin): add performance metrics
   feat(api): add GET /api/superadmin/settings endpoint
   feat(api): add PUT /api/superadmin/settings endpoint
   feat(api): add GET /api/superadmin/audit endpoint
   feat(api): add GET /api/superadmin/backup endpoint
   feat(api): add POST /api/superadmin/backup/create endpoint
   feat(api): add GET /api/superadmin/monitoring/metrics endpoint
   ```

6. **Безопасность и защита**

   - Двухфакторная аутентификация для суперадминов
   - IP whitelist для доступа к суперадминке
   - Логирование всех действий суперадмина
   - Уведомления о критических действиях

   **Коммиты:**

   ```
   feat(superadmin): add 2FA for superadmin accounts
   feat(superadmin): implement IP whitelist
   feat(superadmin): enhance audit logging
   feat(superadmin): add critical action notifications
   ```

**Чеклист:**

- [ ] Пользователи могут зарегистрироваться и войти
- [ ] Суперадмин панель доступна только суперадминам
- [ ] Система прав доступа работает
- [ ] Можно создавать и управлять разрешениями
- [ ] Можно назначать права пользователям
- [ ] Можно изменять роли пользователей
- [ ] Доступны системные настройки
- [ ] Аудит логи просматриваются
- [ ] Резервное копирование работает

#### Неделя 2: Базовая админ панель

**Ветка:** `feature/phase-1-auth-admin`

**Задачи:**

1. **Регистрация и авторизация (базовая)**

   - Создать страницы логина и регистрации
   - Реализовать OAuth кнопки (Steam, Discord)
   - Настроить callback handlers
   - Базовая проверка ролей пользователей

   **Файлы для создания:**

   - `src/app/[locale]/auth/login/page.tsx`
   - `src/app/[locale]/auth/register/page.tsx`
   - `src/app/api/auth/callback/route.ts`
   - `src/components/auth/login-form.tsx`
   - `src/components/auth/register-form.tsx`
   - `src/components/auth/oauth-buttons.tsx`
   - `src/lib/auth/roles.ts` - утилиты для проверки ролей

   **Коммиты:**

   ```
   feat(auth): create login page with OAuth options
   feat(auth): create registration page
   feat(auth): implement Steam OAuth callback handler
   feat(auth): implement Discord OAuth callback handler
   feat(auth): add OAuth button components
   feat(auth): add role-based access control utilities
   feat(auth): handle OAuth errors and edge cases
   ```

2. **Создание базовой админ панели**

   - Создать структуру админ панели
   - Настроить защиту роутов (middleware для проверки ролей)
   - Создать дашборд администратора
   - Список пользователей с фильтрами

   **Файлы для создания:**

   - `src/app/[locale]/admin/page.tsx` - главная страница админки
   - `src/app/[locale]/admin/layout.tsx` - layout с навигацией
   - `src/components/admin/admin-nav.tsx` - навигация админки
   - `src/components/admin/admin-dashboard.tsx` - дашборд
   - `src/components/admin/users-list.tsx` - список пользователей
   - `src/lib/auth/middleware.ts` - middleware для проверки ролей
   - `src/app/api/admin/users/route.ts` - API для управления пользователями

   **Коммиты:**

   ```
   feat(admin): create admin panel structure
   feat(admin): add admin navigation component
   feat(admin): create admin dashboard
   feat(admin): implement role-based route protection
   feat(admin): add users list with filters
   feat(api): add GET /api/admin/users endpoint
   feat(api): add PUT /api/admin/users/[id] endpoint
   ```

3. **Управление пользователями**

   - Просмотр списка пользователей
   - Изменение ролей пользователей
   - Блокировка/разблокировка пользователей
   - Просмотр статистики пользователей

   **Коммиты:**

   ```
   feat(admin): add user role management
   feat(admin): implement user ban/unban functionality
   feat(admin): add user statistics display
   feat(admin): add user search and filters
   feat(api): add POST /api/admin/users/[id]/ban endpoint
   feat(api): add POST /api/admin/users/[id]/unban endpoint
   feat(api): add PUT /api/admin/users/[id]/role endpoint
   ```

**Чеклист:**

- [ ] Пользователи могут зарегистрироваться и войти
- [ ] Админ панель доступна только администраторам
- [ ] Можно просматривать список пользователей
- [ ] Можно изменять роли пользователей
- [ ] Можно блокировать/разблокировать пользователей

#### Неделя 3: Управление ивентами (админ)

**Ветка:** `feature/phase-1-admin-events`

**Задачи:**

1. **Создание ивентов через админ панель**

   - Форма создания ивента в админке
   - Валидация данных
   - Сохранение в БД
   - Отображение созданных ивентов на главной странице

   **Файлы для создания:**

   - `src/app/[locale]/admin/events/page.tsx` - список ивентов
   - `src/app/[locale]/admin/events/create/page.tsx` - создание ивента
   - `src/app/[locale]/admin/events/[id]/edit/page.tsx` - редактирование
   - `src/components/admin/events/event-create-form.tsx`
   - `src/components/admin/events/event-list.tsx`
   - `src/app/api/events/route.ts` (POST, GET)
   - `src/app/api/events/[id]/route.ts` (PUT, DELETE)

   **Коммиты:**

   ```
   feat(admin): create event management page
   feat(admin): add event creation form
   feat(admin): add event type selection (clan war, scrim, tournament)
   feat(admin): add game mode selection (Invasion, TC, RAAS, AAS)
   feat(admin): add date and time picker
   feat(admin): add map selection
   feat(admin): add max participants limit
   feat(admin): add public/private toggle
   feat(api): implement POST /api/events endpoint (admin only)
   feat(api): implement GET /api/events endpoint
   feat(api): implement PUT /api/events/[id] endpoint (admin only)
   feat(api): implement DELETE /api/events/[id] endpoint (admin only)
   feat(homepage): update EventsSection to fetch from API instead of Google Calendar
   ```

2. **Редактирование и отмена ивентов**

   - Форма редактирования
   - Логика отмены
   - Уведомления участникам (базовая)

   **Коммиты:**

   ```
   feat(admin): add event edit page
   feat(admin): implement event update functionality
   feat(admin): add event cancellation
   feat(admin): notify participants on event changes
   ```

3. **Управление регистрациями на ивенты**

   - Просмотр зарегистрированных участников
   - Отстранение участников от ивентов
   - Управление waitlist
   - Массовые действия

   **Файлы для создания:**

   - `src/app/[locale]/admin/events/[id]/participants/page.tsx`
   - `src/components/admin/events/event-participants-manager.tsx`
   - `src/app/api/events/[id]/participants/route.ts`

   **Коммиты:**

   ```
   feat(admin): add event participants management page
   feat(admin): implement remove participant from event
   feat(admin): add waitlist management
   feat(admin): add bulk actions for participants
   feat(api): add GET /api/events/[id]/participants endpoint
   feat(api): add DELETE /api/events/[id]/participants/[userId] endpoint
   ```

**Чеклист:**

- [ ] Админы могут создавать ивенты через админку
- [ ] Ивенты отображаются на главной странице
- [ ] Можно редактировать ивенты
- [ ] Можно отменять ивенты
- [ ] Можно управлять участниками ивентов
- [ ] Можно отстранять участников от ивентов

#### Неделя 4: Управление прошедшими ивентами (хайлайты)

**Ветка:** `feature/phase-1-past-events`

**Задачи:**

1. **Создание и редактирование хайлайтов прошедших ивентов**

   - Форма создания хайлайта
   - Загрузка изображений/видео
   - Редактирование существующих хайлайтов
   - Удаление хайлайтов

   **Файлы для создания:**

   - `src/app/[locale]/admin/past-events/page.tsx` - список хайлайтов
   - `src/app/[locale]/admin/past-events/create/page.tsx` - создание
   - `src/app/[locale]/admin/past-events/[id]/edit/page.tsx` - редактирование
   - `src/components/admin/past-events/highlight-form.tsx`
   - `src/components/admin/past-events/highlights-list.tsx`
   - `src/app/api/past-events/route.ts` (GET, POST)
   - `src/app/api/past-events/[id]/route.ts` (PUT, DELETE)

   **Коммиты:**

   ```
   feat(admin): create past events highlights management page
   feat(admin): add highlight creation form
   feat(admin): implement image/video upload to Supabase Storage
   feat(admin): add highlight editing functionality
   feat(admin): add highlight deletion
   feat(admin): add display order management
   feat(admin): add featured toggle for highlights
   feat(api): add GET /api/past-events endpoint
   feat(api): add POST /api/past-events endpoint (admin only)
   feat(api): add PUT /api/past-events/[id] endpoint (admin only)
   feat(api): add DELETE /api/past-events/[id] endpoint (admin only)
   ```

2. **Отображение хайлайтов на главной странице**

   - Обновить секцию галереи/хайлайтов
   - Интеграция с API
   - Отображение featured хайлайтов

   **Файлы для изменения:**

   - `src/components/sections/gallery.tsx` - обновить для работы с API
   - `src/app/[locale]/page.tsx` - обновить для загрузки хайлайтов

   **Коммиты:**

   ```
   feat(homepage): update gallery section to fetch from API
   feat(homepage): display past event highlights
   feat(homepage): add featured highlights section
   feat(homepage): implement highlight cards with images
   ```

3. **Связь хайлайтов с ивентами**

   - Привязка хайлайта к существующему ивенту
   - Автоматическое создание хайлайта из завершенного ивента
   - Отображение связи на странице ивента

   **Коммиты:**

   ```
   feat(admin): link highlights to events
   feat(admin): auto-create highlight from completed event
   feat(admin): display event link in highlight form
   feat(events): show related highlights on event page
   ```

**Чеклист:**

- [ ] Админы могут создавать хайлайты прошедших ивентов
- [ ] Можно загружать изображения и видео
- [ ] Хайлайты отображаются на главной странице
- [ ] Можно редактировать и удалять хайлайты
- [ ] Можно управлять порядком отображения
- [ ] Можно отмечать хайлайты как featured

#### Неделя 7-8: Профили пользователей

**Ветка:** `feature/phase-1-user-profiles`

**Задачи:**

1. **Регистрация и авторизация**

   - Создать страницы логина и регистрации
   - Реализовать OAuth кнопки (Steam, Discord)
   - Настроить callback handlers

   **Файлы для создания:**

   - `src/app/[locale]/auth/login/page.tsx`
   - `src/app/[locale]/auth/register/page.tsx`
   - `src/app/api/auth/callback/route.ts`
   - `src/components/auth/login-form.tsx`
   - `src/components/auth/register-form.tsx`
   - `src/components/auth/oauth-buttons.tsx`

   **Коммиты:**

   ```
   feat(auth): create login page with OAuth options
   feat(auth): create registration page
   feat(auth): implement Steam OAuth callback handler
   feat(auth): implement Discord OAuth callback handler
   feat(auth): add OAuth button components
   feat(auth): add form validation with Zod
   feat(auth): handle OAuth errors and edge cases
   ```

2. **Базовый профиль игрока**

   - Создать страницу профиля
   - Реализовать отображение базовой информации
   - Добавить возможность редактирования

   **Файлы для создания:**

   - `src/app/[locale]/profile/page.tsx`
   - `src/app/[locale]/profile/edit/page.tsx`
   - `src/components/profile/user-profile.tsx`
   - `src/components/profile/profile-settings.tsx`
   - `src/app/api/users/me/route.ts`

   **Коммиты:**

   ```
   feat(profile): create user profile page
   feat(profile): add profile edit functionality
   feat(profile): implement avatar upload to Supabase Storage
   feat(api): add GET /api/users/me endpoint
   feat(api): add PUT /api/users/me endpoint
   feat(profile): add privacy settings component
   ```

3. **Привязка Steam аккаунта**

   - Добавить функционал привязки Steam ID
   - Валидация Steam ID
   - Отображение Steam профиля

   **Коммиты:**

   ```
   feat(profile): add Steam account linking
   feat(profile): validate Steam ID format
   feat(profile): display Steam profile information
   feat(api): add Steam ID validation endpoint
   ```

**Чеклист:**

- [ ] Пользователи могут зарегистрироваться через Steam/Discord
- [ ] Пользователи могут войти в систему
- [ ] Профиль отображается корректно
- [ ] Можно редактировать профиль
- [ ] Можно загрузить аватар
- [ ] Steam аккаунт привязывается

#### Неделя 5-6: Публичные страницы ивентов

**Ветка:** `feature/phase-1-public-events`

**Задачи:**

1. **Список ивентов (публичная страница)**

   - Страница со списком всех ивентов
   - Фильтры и поиск
   - Пагинация
   - Отображение ивентов из БД

   **Файлы для создания:**

   - `src/app/[locale]/events/page.tsx`
   - `src/components/events/event-card.tsx`
   - `src/components/events/event-filters.tsx`
   - `src/app/api/events/route.ts` (GET) - уже создан в админке

   **Коммиты:**

   ```
   feat(events): create public events list page
   feat(events): add event card component
   feat(events): implement event filters (type, mode, date)
   feat(events): add search functionality
   feat(events): implement pagination
   feat(api): extend GET /api/events with filters and pagination
   ```

2. **Детали ивента (публичная страница)**

   - Страница с детальной информацией об ивенте
   - Отображение участников
   - Кнопка регистрации (для авторизованных пользователей)

   **Файлы для создания:**

   - `src/app/[locale]/events/[id]/page.tsx`
   - `src/components/events/event-details.tsx`
   - `src/components/events/event-participants.tsx`
   - `src/app/api/events/[id]/route.ts` (GET) - уже создан

   **Коммиты:**

   ```
   feat(events): create public event details page
   feat(events): display event information
   feat(events): show registered participants
   feat(events): add registration button (for authenticated users)
   feat(api): extend GET /api/events/[id] endpoint
   ```

**Чеклист:**

- [ ] Ивенты отображаются в публичном списке
- [ ] Работают фильтры и поиск
- [ ] Детальная страница ивента работает
- [ ] Публичные пользователи могут просматривать ивенты

#### Неделя 9-10: Регистрация на ивенты

**Ветка:** `feature/phase-1-event-registration`

**Задачи:**

1. **Индивидуальная регистрация**

   - Кнопка регистрации на ивент
   - Проверка лимитов
   - Сохранение регистрации

   **Файлы для создания:**

   - `src/components/events/event-registration.tsx`
   - `src/app/api/events/[id]/register/route.ts`
   - `src/lib/validations/registration.ts`

   **Коммиты:**

   ```
   feat(registration): add individual registration component
   feat(registration): check participant limits before registration
   feat(registration): handle duplicate registration attempts
   feat(api): add POST /api/events/[id]/register endpoint
   feat(validation): add registration validation schema
   ```

2. **Командная регистрация**

   - Регистрация группы игроков
   - Валидация размера команды
   - Резервирование слотов

   **Коммиты:**

   ```
   feat(registration): add team registration functionality
   feat(registration): validate team size against event limits
   feat(registration): reserve slots for team members
   feat(api): extend registration endpoint for teams
   ```

3. **Резервный список (waitlist)**

   - Автоматическое добавление в waitlist при переполнении
   - Уведомления при освобождении места
   - Управление waitlist

   **Коммиты:**

   ```
   feat(registration): implement waitlist functionality
   feat(registration): auto-add to waitlist when event is full
   feat(registration): notify waitlist users when slot opens
   feat(registration): add waitlist management UI
   ```

4. **Отмена регистрации**

   - Кнопка отмены регистрации
   - Освобождение места
   - Уведомление организатору

   **Коммиты:**

   ```
   feat(registration): add registration cancellation
   feat(registration): free up slot on cancellation
   feat(registration): notify organizer on cancellation
   feat(api): add DELETE /api/events/[id]/register endpoint
   ```

**Чеклист:**

- [ ] Можно зарегистрироваться на ивент
- [ ] Проверяются лимиты участников
- [ ] Работает командная регистрация
- [ ] Waitlist функционирует
- [ ] Можно отменить регистрацию

#### Неделя 11: Базовый календарь

**Ветка:** `feature/phase-1-calendar`

**Задачи:**

1. **Расширенный календарь ивентов**

   - Календарный вид с месячной сеткой
   - Отображение ивентов на датах
   - Навигация по месяцам

   **Файлы для создания:**

   - `src/app/[locale]/calendar/page.tsx`
   - `src/components/events/event-calendar.tsx`
   - `src/components/ui/calendar.tsx` (если нет в shadcn)

   **Коммиты:**

   ```
   feat(calendar): create calendar page
   feat(calendar): implement monthly calendar view
   feat(calendar): display events on calendar dates
   feat(calendar): add month navigation
   feat(calendar): highlight today and selected date
   ```

2. **Фильтры календаря**

   - Фильтр по режиму игры
   - Фильтр по формату ивента
   - Фильтр по дате

   **Коммиты:**

   ```
   feat(calendar): add game mode filter
   feat(calendar): add event type filter
   feat(calendar): add date range filter
   feat(calendar): persist filter state in URL
   ```

3. **Интеграция с Google Calendar (опционально)**

   - Синхронизация ивентов
   - Экспорт в .ics формат
   - Импорт из Google Calendar

   **Коммиты:**

   ```
   feat(calendar): add Google Calendar sync (optional)
   feat(calendar): implement .ics export
   feat(calendar): add import from Google Calendar
   ```

**Чеклист:**

- [ ] Календарь отображает ивенты
- [ ] Работают фильтры
- [ ] Навигация по месяцам работает
- [ ] Можно экспортировать в .ics (опционально)

**Мерж в main:** После завершения всех задач и тестирования MVP

---

### Фаза 2: v1.0 - Кланы и команды (4-6 недель)

**Ветка:** `feature/phase-2-clans-teams`

**Цель:** Добавить систему кланов и командной игры

#### Неделя 1-3: Система кланов

**Ветка:** `feature/phase-2-clans-system`

**Задачи:**

1. **Создание кланов**

   - Форма создания клана
   - Валидация названия и тега
   - Загрузка логотипа

   **Файлы для создания:**

   - `src/app/[locale]/clans/create/page.tsx`
   - `src/components/clans/clan-create-form.tsx`
   - `src/app/api/clans/route.ts` (POST)
   - `src/lib/validations/clan.ts`

   **Коммиты:**

   ```
   feat(clans): create clan creation form
   feat(clans): add clan name and tag validation
   feat(clans): implement logo upload to Supabase Storage
   feat(clans): add clan description field
   feat(api): add POST /api/clans endpoint
   feat(validation): add clan creation validation schema
   ```

2. **Профиль клана**

   - Страница профиля клана
   - Отображение информации
   - Управление настройками

   **Файлы для создания:**

   - `src/app/[locale]/clans/[id]/page.tsx`
   - `src/components/clans/clan-profile.tsx`
   - `src/components/clans/clan-settings.tsx`
   - `src/app/api/clans/[id]/route.ts` (GET, PUT)

   **Коммиты:**

   ```
   feat(clans): create clan profile page
   feat(clans): display clan information and stats
   feat(clans): add clan settings management
   feat(clans): implement clan logo update
   feat(api): add GET /api/clans/[id] endpoint
   feat(api): add PUT /api/clans/[id] endpoint
   ```

3. **Управление составом**

   - Список участников клана
   - Роли участников (лидер, офицер, участник)
   - Управление ролями

   **Файлы для создания:**

   - `src/components/clans/clan-members.tsx`
   - `src/components/clans/clan-member-role-selector.tsx`
   - `src/app/api/clans/[id]/members/route.ts`

   **Коммиты:**

   ```
   feat(clans): create clan members list component
   feat(clans): implement role management (leader, officer, member)
   feat(clans): add role change functionality
   feat(clans): add member removal functionality
   feat(api): add GET /api/clans/[id]/members endpoint
   feat(api): add PUT /api/clans/[id]/members/[userId] endpoint
   feat(api): add DELETE /api/clans/[id]/members/[userId] endpoint
   ```

4. **Приглашения в клан**

   - Система приглашений
   - Отправка приглашений
   - Принятие/отклонение приглашений

   **Файлы для создания:**

   - `src/components/clans/clan-invite.tsx`
   - `src/components/clans/clan-invitations.tsx`
   - `src/app/api/clans/[id]/invite/route.ts`

   **Коммиты:**

   ```
   feat(clans): create clan invitation system
   feat(clans): add invite user by username/email
   feat(clans): display pending invitations
   feat(clans): implement accept/decline invitation
   feat(api): add POST /api/clans/[id]/invite endpoint
   feat(api): add GET /api/clans/invitations endpoint
   feat(api): add PUT /api/clans/invitations/[id] endpoint
   ```

**Чеклист:**

- [ ] Можно создать клан
- [ ] Профиль клана отображается
- [ ] Управление участниками работает
- [ ] Роли назначаются корректно
- [ ] Приглашения отправляются и принимаются

#### Неделя 4-5: Командная регистрация

**Ветка:** `feature/phase-2-team-registration`

**Задачи:**

1. **Регистрация клана на ивент**

   - Регистрация всего клана
   - Проверка размера клана
   - Резервирование слотов

   **Коммиты:**

   ```
   feat(registration): add clan registration to events
   feat(registration): validate clan size against event limits
   feat(registration): reserve slots for all clan members
   feat(api): extend event registration for clans
   ```

2. **Автоматическое формирование команд**

   - Алгоритм балансировки команд
   - Распределение игроков по командам
   - Визуализация команд

   **Файлы для создания:**

   - `src/lib/utils/team-balancer.ts`
   - `src/components/events/event-teams.tsx`

   **Коммиты:**

   ```
   feat(teams): implement automatic team formation
   feat(teams): add team balancing algorithm
   feat(teams): distribute players across teams
   feat(teams): visualize team composition
   ```

3. **Ручное назначение команд**

   - Интерфейс для организатора
   - Перетаскивание игроков между командами
   - Сохранение изменений

   **Коммиты:**

   ```
   feat(teams): add manual team assignment UI
   feat(teams): implement drag-and-drop team assignment
   feat(teams): save manual team changes
   feat(api): add PUT /api/events/[id]/teams endpoint
   ```

4. **Балансировка команд**

   - Алгоритм балансировки по рейтингу
   - Предпросмотр баланса
   - Применение балансировки

   **Коммиты:**

   ```
   feat(teams): add team balancing by rating
   feat(teams): preview team balance before applying
   feat(teams): apply balanced team distribution
   ```

**Чеклист:**

- [ ] Клан может зарегистрироваться на ивент
- [ ] Команды формируются автоматически
- [ ] Организатор может вручную назначать команды
- [ ] Балансировка команд работает

#### Неделя 6: Базовая статистика

**Ветка:** `feature/phase-2-basic-stats`

**Задачи:**

1. **История участия в ивентах**

   - Список ивентов пользователя
   - История клана
   - Фильтры по дате

   **Файлы для создания:**

   - `src/components/profile/event-history.tsx`
   - `src/components/clans/clan-event-history.tsx`
   - `src/app/api/users/[id]/events/route.ts`

   **Коммиты:**

   ```
   feat(stats): add user event history component
   feat(stats): add clan event history component
   feat(stats): implement event history filters
   feat(api): add GET /api/users/[id]/events endpoint
   feat(api): add GET /api/clans/[id]/events endpoint
   ```

2. **Базовая статистика игрока**

   - Количество ивентов
   - Процент участия
   - Базовые метрики

   **Файлы для создания:**

   - `src/components/profile/profile-stats.tsx`
   - `src/app/api/users/[id]/stats/route.ts`

   **Коммиты:**

   ```
   feat(stats): create user statistics component
   feat(stats): calculate events participated count
   feat(stats): calculate participation rate
   feat(api): add GET /api/users/[id]/stats endpoint
   ```

3. **Статистика клана**

   - Общая статистика клана
   - Активность участников
   - История клана

   **Коммиты:**

   ```
   feat(stats): create clan statistics component
   feat(stats): calculate clan activity metrics
   feat(stats): display clan member activity
   feat(api): add GET /api/clans/[id]/stats endpoint
   ```

**Чеклист:**

- [ ] История ивентов отображается
- [ ] Статистика игрока рассчитывается
- [ ] Статистика клана отображается

**Мерж в main:** После завершения всех задач и тестирования

---

### Фаза 3: v1.5 - Планирование и заметки (3-4 недели)

**Ветка:** `feature/phase-3-notes-planning`

**Цель:** Добавить инструменты для планирования тактик

#### Неделя 1-2: Персональные заметки

**Ветка:** `feature/phase-3-personal-notes`

**Задачи:**

1. **Создание и редактирование заметок**

   - Редактор заметок (Markdown или rich text)
   - Сохранение заметок
   - Список заметок

   **Файлы для создания:**

   - `src/app/[locale]/notes/page.tsx`
   - `src/app/[locale]/notes/[id]/page.tsx`
   - `src/components/notes/note-editor.tsx`
   - `src/components/notes/note-list.tsx`
   - `src/app/api/notes/route.ts`

   **Коммиты:**

   ```
   feat(notes): create notes list page
   feat(notes): implement note editor component
   feat(notes): add Markdown support for notes
   feat(notes): add note creation functionality
   feat(notes): add note editing functionality
   feat(notes): add note deletion
   feat(api): add GET /api/notes endpoint
   feat(api): add POST /api/notes endpoint
   feat(api): add PUT /api/notes/[id] endpoint
   feat(api): add DELETE /api/notes/[id] endpoint
   ```

2. **Категории заметок**

   - Система категорий (тактика, разведка, координация)
   - Фильтрация по категориям
   - Теги для заметок

   **Коммиты:**

   ```
   feat(notes): add note categories system
   feat(notes): implement category filtering
   feat(notes): add tags to notes
   feat(notes): filter notes by tags
   ```

3. **Поиск по заметкам**

   - Полнотекстовый поиск
   - Поиск по тегам
   - Поиск по категориям

   **Коммиты:**

   ```
   feat(notes): implement full-text search
   feat(notes): add search by tags
   feat(notes): add search by categories
   feat(api): add search parameter to notes endpoint
   ```

4. **Прикрепление файлов**

   - Загрузка файлов в Supabase Storage
   - Прикрепление к заметкам
   - Отображение вложений

   **Коммиты:**

   ```
   feat(notes): add file attachment functionality
   feat(notes): upload files to Supabase Storage
   feat(notes): display attached files in notes
   feat(notes): add image preview for attachments
   ```

**Чеклист:**

- [ ] Можно создавать и редактировать заметки
- [ ] Категории работают
- [ ] Поиск функционирует
- [ ] Можно прикреплять файлы

#### Неделя 3: Совместные заметки

**Ветка:** `feature/phase-3-shared-notes`

**Задачи:**

1. **Заметки для кланов/команд**

   - Создание клановых заметок
   - Права доступа
   - Совместное редактирование

   **Коммиты:**

   ```
   feat(notes): add clan notes functionality
   feat(notes): implement access control for clan notes
   feat(notes): add collaborative editing
   feat(notes): track note edit history
   ```

2. **Шаблоны тактических планов**

   - Предустановленные шаблоны
   - Создание из шаблона
   - Сохранение пользовательских шаблонов

   **Файлы для создания:**

   - `src/components/notes/note-templates.tsx`
   - `src/lib/templates/tactical-plans.ts`

   **Коммиты:**

   ```
   feat(notes): add tactical plan templates
   feat(notes): create note from template
   feat(notes): save custom templates
   feat(notes): share templates with clan
   ```

3. **Экспорт заметок**

   - Экспорт в Markdown
   - Экспорт в PDF
   - Экспорт в текстовый файл

   **Коммиты:**

   ```
   feat(notes): add Markdown export
   feat(notes): add PDF export functionality
   feat(notes): add plain text export
   ```

**Чеклист:**

- [ ] Клановые заметки работают
- [ ] Права доступа настроены
- [ ] Шаблоны доступны
- [ ] Экспорт функционирует

#### Неделя 4: Интеграция с ивентами

**Ветка:** `feature/phase-3-notes-events-integration`

**Задачи:**

1. **Привязка заметок к ивентам**

   - Связь заметок с ивентами
   - Отображение заметок на странице ивента
   - Быстрый доступ к планам

   **Коммиты:**

   ```
   feat(notes): link notes to events
   feat(notes): display event-related notes on event page
   feat(notes): add quick access to tactical plans
   feat(notes): filter notes by event
   ```

2. **Быстрый доступ перед матчем**

   - Виджет с заметками на странице ивента
   - Уведомления о планах
   - Напоминания

   **Коммиты:**

   ```
   feat(notes): add notes widget to event page
   feat(notes): notify about available plans before match
   feat(notes): add reminders for tactical plans
   ```

**Чеклист:**

- [ ] Заметки привязываются к ивентам
- [ ] Отображаются на странице ивента
- [ ] Быстрый доступ работает

**Мерж в main:** После завершения всех задач

---

### Фаза 4: v2.0 - Лидерборды и расширенная статистика (4-5 недель)

**Ветка:** `feature/phase-4-leaderboards-stats`

**Цель:** Добавить соревновательные элементы и детальную аналитику

#### Неделя 1-2: Система рейтинга

**Ветка:** `feature/phase-4-rating-system`

**Задачи:**

1. **Расчет рейтинга игроков**

   - Реализация ELO алгоритма
   - Обновление рейтинга после ивентов
   - История изменений рейтинга

   **Файлы для создания:**

   - `src/lib/utils/rating-calculator.ts`
   - `src/lib/utils/elo-algorithm.ts`
   - `src/app/api/users/[id]/rating/route.ts`

   **Коммиты:**

   ```
   feat(rating): implement ELO rating algorithm
   feat(rating): calculate player rating after events
   feat(rating): store rating history
   feat(rating): add rating change visualization
   feat(api): add GET /api/users/[id]/rating endpoint
   feat(api): add POST /api/events/[id]/calculate-ratings endpoint
   ```

2. **Расчет рейтинга кланов**

   - Адаптация ELO для кланов
   - Учет результатов клановых ивентов
   - Клановый рейтинг

   **Коммиты:**

   ```
   feat(rating): implement clan rating system
   feat(rating): calculate clan rating from events
   feat(rating): display clan rating history
   feat(api): add GET /api/clans/[id]/rating endpoint
   ```

3. **История изменений рейтинга**

   - График изменения рейтинга
   - События, влияющие на рейтинг
   - Детальная история

   **Коммиты:**

   ```
   feat(rating): add rating history graph
   feat(rating): display events affecting rating
   feat(rating): add detailed rating change log
   ```

**Чеклист:**

- [ ] Рейтинг игроков рассчитывается
- [ ] Рейтинг кланов рассчитывается
- [ ] История рейтинга отображается

#### Неделя 3-4: Лидерборды

**Ветка:** `feature/phase-4-leaderboards`

**Задачи:**

1. **Глобальные лидерборды**

   - Лидерборд игроков
   - Лидерборд кланов
   - Обновление в реальном времени

   **Файлы для создания:**

   - `src/app/[locale]/leaderboards/page.tsx`
   - `src/components/leaderboards/leaderboard-table.tsx`
   - `src/app/api/leaderboards/route.ts`

   **Коммиты:**

   ```
   feat(leaderboards): create leaderboards page
   feat(leaderboards): implement players leaderboard
   feat(leaderboards): implement clans leaderboard
   feat(leaderboards): add real-time updates
   feat(api): add GET /api/leaderboards/players endpoint
   feat(api): add GET /api/leaderboards/clans endpoint
   ```

2. **Лидерборды по категориям**

   - Лидерборд по K/D
   - Лидерборд по победам
   - Лидерборд по участию

   **Коммиты:**

   ```
   feat(leaderboards): add K/D ratio leaderboard
   feat(leaderboards): add wins leaderboard
   feat(leaderboards): add participation leaderboard
   feat(leaderboards): add category switching
   ```

3. **Сезонные лидерборды**

   - Разделение по сезонам
   - Сброс рейтинга между сезонами
   - История сезонов

   **Коммиты:**

   ```
   feat(leaderboards): implement seasonal leaderboards
   feat(leaderboards): add season reset functionality
   feat(leaderboards): display season history
   feat(leaderboards): add season selection
   ```

4. **Фильтры и поиск**

   - Фильтрация лидербордов
   - Поиск игроков/кланов
   - Пагинация

   **Файлы для создания:**

   - `src/components/leaderboards/leaderboard-filters.tsx`

   **Коммиты:**

   ```
   feat(leaderboards): add leaderboard filters
   feat(leaderboards): implement search functionality
   feat(leaderboards): add pagination to leaderboards
   ```

**Чеклист:**

- [ ] Глобальные лидерборды работают
- [ ] Категориальные лидерборды отображаются
- [ ] Сезонные лидерборды функционируют
- [ ] Фильтры и поиск работают

#### Неделя 5: Расширенная статистика

**Ветка:** `feature/phase-4-extended-stats`

**Задачи:**

1. **Детальная статистика по ивентам**

   - Статистика участников
   - Результаты матчей
   - Детальные метрики

   **Коммиты:**

   ```
   feat(stats): add detailed event statistics
   feat(stats): display participant stats per event
   feat(stats): show match results and scores
   feat(stats): add performance metrics
   feat(api): add GET /api/events/[id]/stats endpoint
   ```

2. **Графики прогресса**

   - График изменения рейтинга
   - График участия в ивентах
   - Тренды статистики

   **Коммиты:**

   ```
   feat(stats): add rating progress chart
   feat(stats): add event participation chart
   feat(stats): display statistics trends
   feat(stats): add chart library integration (recharts/chart.js)
   ```

3. **Сравнение статистики**

   - Сравнение игроков
   - Сравнение кланов
   - Визуализация сравнения

   **Коммиты:**

   ```
   feat(stats): add player comparison feature
   feat(stats): add clan comparison feature
   feat(stats): visualize comparison data
   ```

4. **История матчей с результатами**

   - Сохранение результатов матчей
   - Отображение истории
   - Детали матчей

   **Коммиты:**

   ```
   feat(stats): add match results storage
   feat(stats): display match history
   feat(stats): show detailed match information
   feat(api): add POST /api/events/[id]/results endpoint
   ```

**Чеклист:**

- [ ] Детальная статистика по ивентам работает
- [ ] Графики отображаются корректно
- [ ] Сравнение статистики функционирует
- [ ] История матчей сохраняется

**Мерж в main:** После завершения всех задач

---

### Фаза 5: v2.5 - Коммуникация и уведомления (3-4 недели)

**Ветка:** `feature/phase-5-communication-notifications`

**Цель:** Улучшить взаимодействие между пользователями

#### Неделя 1-2: Система уведомлений

**Ветка:** `feature/phase-5-notifications`

**Задачи:**

1. **Уведомления о предстоящих ивентах**

   - Напоминания за день до ивента
   - Напоминания за час до ивента
   - Уведомления о новых ивентах

   **Файлы для создания:**

   - `src/lib/notifications/event-reminders.ts`
   - `src/components/notifications/notification-center.tsx`
   - `src/app/api/notifications/route.ts`

   **Коммиты:**

   ```
   feat(notifications): create notification system
   feat(notifications): add event reminder notifications
   feat(notifications): schedule reminders (1 day, 1 hour before)
   feat(notifications): notify about new events
   feat(api): add GET /api/notifications endpoint
   feat(api): add POST /api/notifications/mark-read endpoint
   ```

2. **Напоминания о регистрации**

   - Уведомления о открытии регистрации
   - Напоминания о скором закрытии
   - Уведомления о waitlist

   **Коммиты:**

   ```
   feat(notifications): add registration opening notifications
   feat(notifications): remind about closing registration
   feat(notifications): notify about waitlist status changes
   ```

3. **Уведомления о результатах**

   - Уведомления о завершении ивента
   - Уведомления об изменении рейтинга
   - Уведомления о результатах матча

   **Коммиты:**

   ```
   feat(notifications): notify about event completion
   feat(notifications): notify about rating changes
   feat(notifications): notify about match results
   ```

4. **Email и push уведомления**

   - Интеграция с Resend/SendGrid
   - Web Push API
   - Настройка каналов уведомлений

   **Коммиты:**

   ```
   feat(notifications): integrate email notifications (Resend)
   feat(notifications): implement Web Push API
   feat(notifications): add notification channel preferences
   feat(notifications): add email template system
   ```

5. **Настройки уведомлений**

   - Страница настроек уведомлений
   - Включение/отключение типов уведомлений
   - Выбор каналов

   **Файлы для создания:**

   - `src/app/[locale]/settings/notifications/page.tsx`
   - `src/components/settings/notification-settings.tsx`

   **Коммиты:**

   ```
   feat(notifications): create notification settings page
   feat(notifications): add toggle for notification types
   feat(notifications): select notification channels
   feat(api): add PUT /api/users/me/notification-settings endpoint
   ```

**Чеклист:**

- [ ] Уведомления о ивентах работают
- [ ] Email уведомления отправляются
- [ ] Push уведомления функционируют
- [ ] Настройки уведомлений работают

#### Неделя 3: Коммуникация

**Ветка:** `feature/phase-5-communication`

**Задачи:**

1. **Встроенные сообщения между игроками**

   - Система сообщений
   - Чат между пользователями
   - Уведомления о новых сообщениях

   **Файлы для создания:**

   - `src/app/[locale]/messages/page.tsx`
   - `src/components/messages/message-list.tsx`
   - `src/components/messages/message-composer.tsx`
   - `src/app/api/messages/route.ts`

   **Коммиты:**

   ```
   feat(messages): create messaging system
   feat(messages): add user-to-user chat
   feat(messages): implement message sending
   feat(messages): add message notifications
   feat(api): add GET /api/messages endpoint
   feat(api): add POST /api/messages endpoint
   feat(api): add real-time messaging with Supabase Realtime
   ```

2. **Комментарии к ивентам**

   - Система комментариев
   - Отображение комментариев
   - Редактирование/удаление

   **Файлы для создания:**

   - `src/components/events/event-comments.tsx`
   - `src/app/api/events/[id]/comments/route.ts`

   **Коммиты:**

   ```
   feat(comments): add event comments system
   feat(comments): display comments on event page
   feat(comments): add comment creation
   feat(comments): add comment editing and deletion
   feat(api): add GET /api/events/[id]/comments endpoint
   feat(api): add POST /api/events/[id]/comments endpoint
   ```

3. **Чаты для команд/кланов**

   - Клановые чаты
   - Командные чаты для ивентов
   - Групповые сообщения

   **Коммиты:**

   ```
   feat(messages): add clan chat functionality
   feat(messages): add team chat for events
   feat(messages): implement group messaging
   feat(api): add GET /api/clans/[id]/chat endpoint
   feat(api): add GET /api/events/[id]/chat endpoint
   ```

4. **Интеграция с Discord (webhooks)**

   - Отправка уведомлений в Discord
   - Синхронизация событий
   - Discord бот (опционально)

   **Коммиты:**

   ```
   feat(discord): integrate Discord webhooks
   feat(discord): send event notifications to Discord
   feat(discord): sync events with Discord
   feat(discord): add Discord bot (optional)
   ```

**Чеклист:**

- [ ] Сообщения между игроками работают
- [ ] Комментарии к ивентам функционируют
- [ ] Клановые чаты работают
- [ ] Discord интеграция настроена

#### Неделя 4: Расширенная модерация и админ функции

**Ветка:** `feature/phase-5-advanced-admin`

**Задачи:**

1. **Базовая система модерации**

   - Панель модератора
   - Модерация контента
   - Управление пользователями

   **Файлы для создания:**

   - `src/app/[locale]/admin/moderation/page.tsx`
   - `src/components/admin/moderation-panel.tsx`
   - `src/app/api/admin/moderation/route.ts`

   **Коммиты:**

   ```
   feat(moderation): create moderation panel
   feat(moderation): add content moderation tools
   feat(moderation): implement user management
   feat(api): add moderation endpoints
   ```

2. **Жалобы и баны**

   - Система жалоб
   - Обработка жалоб
   - Система банов
   - Массовые действия с пользователями

   **Коммиты:**

   ```
   feat(moderation): add reporting system
   feat(moderation): implement complaint handling
   feat(moderation): add ban system
   feat(moderation): add temporary and permanent bans
   feat(moderation): add bulk user actions
   feat(api): add POST /api/reports endpoint
   feat(api): add POST /api/admin/bans endpoint
   feat(api): add POST /api/admin/users/bulk-action endpoint
   ```

3. **Логи действий и аудит**

   - Логирование действий модераторов
   - История изменений
   - Аудит логов
   - Экспорт логов

   **Коммиты:**

   ```
   feat(moderation): add action logging
   feat(moderation): track moderator actions
   feat(moderation): display audit logs
   feat(moderation): add log export functionality
   feat(api): add GET /api/admin/audit-logs endpoint
   feat(api): add GET /api/admin/audit-logs/export endpoint
   ```

4. **Дополнительные админ функции**

   - Управление системными настройками
   - Управление контентом главной страницы (тексты, секции)
   - Статистика платформы
   - Резервное копирование данных
   - Управление ролями и правами доступа

   **Файлы для создания:**

   - `src/app/[locale]/admin/settings/page.tsx`
   - `src/app/[locale]/admin/content/page.tsx` - управление контентом главной
   - `src/components/admin/system-settings.tsx`
   - `src/components/admin/content-editor.tsx`
   - `src/app/api/admin/settings/route.ts`
   - `src/app/api/admin/content/route.ts`

   **Коммиты:**

   ```
   feat(admin): add system settings management
   feat(admin): add homepage content editor
   feat(admin): add platform statistics dashboard
   feat(admin): add data backup functionality
   feat(admin): add role and permission management
   feat(api): add GET /api/admin/settings endpoint
   feat(api): add PUT /api/admin/settings endpoint
   feat(api): add GET /api/admin/content endpoint
   feat(api): add PUT /api/admin/content endpoint
   ```

5. **Управление ивентами (расширенное)**

   - Массовые действия с ивентами
   - Импорт/экспорт ивентов
   - Шаблоны ивентов
   - Автоматизация создания ивентов

   **Коммиты:**

   ```
   feat(admin): add bulk event actions
   feat(admin): implement event import/export
   feat(admin): add event templates
   feat(admin): add recurring events functionality
   feat(api): add POST /api/admin/events/bulk-action endpoint
   feat(api): add POST /api/admin/events/import endpoint
   feat(api): add GET /api/admin/events/export endpoint
   ```

**Чеклист:**

- [ ] Панель модератора работает
- [ ] Система жалоб функционирует
- [ ] Баны применяются корректно
- [ ] Логи ведутся
- [ ] Можно управлять системными настройками
- [ ] Можно редактировать контент главной страницы
- [ ] Доступна статистика платформы
- [ ] Можно выполнять массовые действия

**Мерж в main:** После завершения всех задач

---

### Фаза 6: v3.0 - Продвинутые функции (5-6 недель)

**Ветка:** `feature/phase-6-advanced-features`

**Цель:** Добавить продвинутые функции для опытных пользователей

#### Неделя 1-2: Матчмейкинг

**Ветка:** `feature/phase-6-matchmaking`

**Задачи:**

1. **Автоматический подбор команд по рейтингу**

   - Алгоритм матчмейкинга
   - Подбор по рейтингу
   - Балансировка команд

   **Файлы для создания:**

   - `src/lib/utils/matchmaking.ts`
   - `src/components/matchmaking/matchmaking-queue.tsx`

   **Коммиты:**

   ```
   feat(matchmaking): implement matchmaking algorithm
   feat(matchmaking): match players by rating
   feat(matchmaking): balance teams automatically
   feat(matchmaking): add matchmaking queue UI
   feat(api): add POST /api/matchmaking/join endpoint
   feat(api): add POST /api/matchmaking/leave endpoint
   ```

2. **Система очередей**

   - Очередь матчмейкинга
   - Уведомления о найденном матче
   - Принятие/отклонение матча

   **Коммиты:**

   ```
   feat(matchmaking): implement matchmaking queue
   feat(matchmaking): notify when match is found
   feat(matchmaking): add accept/decline match functionality
   feat(matchmaking): handle queue timeout
   ```

3. **Балансировка команд**

   - Улучшенный алгоритм балансировки
   - Учет различных факторов
   - Предпросмотр баланса

   **Коммиты:**

   ```
   feat(matchmaking): improve team balancing algorithm
   feat(matchmaking): consider multiple factors in balancing
   feat(matchmaking): preview team balance before match
   ```

**Чеклист:**

- [ ] Матчмейкинг работает
- [ ] Очередь функционирует
- [ ] Балансировка команд улучшена

#### Неделя 3-4: Аналитика и отчеты

**Ветка:** `feature/phase-6-analytics-reports`

**Задачи:**

1. **Аналитика по ивентам**

   - Дашборд аналитики
   - Метрики участия
   - Визуализация данных

   **Файлы для создания:**

   - `src/app/[locale]/analytics/page.tsx`
   - `src/components/analytics/analytics-dashboard.tsx`
   - `src/app/api/analytics/route.ts`

   **Коммиты:**

   ```
   feat(analytics): create analytics dashboard
   feat(analytics): add event participation metrics
   feat(analytics): visualize analytics data
   feat(analytics): add time-based analytics
   feat(api): add GET /api/analytics/events endpoint
   ```

2. **Отчеты для организаторов**

   - Генерация отчетов
   - Экспорт отчетов
   - Детальная статистика

   **Коммиты:**

   ```
   feat(analytics): generate organizer reports
   feat(analytics): export reports to PDF/CSV
   feat(analytics): add detailed event statistics
   feat(api): add GET /api/analytics/reports endpoint
   ```

3. **Дашборды для администраторов**

   - Админ панель
   - Системные метрики
   - Управление платформой

   **Файлы для создания:**

   - `src/app/[locale]/admin/dashboard/page.tsx`
   - `src/components/admin/admin-dashboard.tsx`

   **Коммиты:**

   ```
   feat(admin): create admin dashboard
   feat(admin): display system metrics
   feat(admin): add platform management tools
   feat(admin): monitor user activity
   feat(api): add GET /api/admin/dashboard endpoint
   ```

4. **Экспорт данных**

   - Экспорт пользовательских данных
   - Экспорт статистики
   - API для экспорта

   **Коммиты:**

   ```
   feat(export): add user data export
   feat(export): export statistics data
   feat(export): add CSV/JSON export options
   feat(api): add GET /api/export/user-data endpoint
   ```

**Чеклист:**

- [ ] Аналитика работает
- [ ] Отчеты генерируются
- [ ] Админ дашборд функционирует
- [ ] Экспорт данных работает

#### Неделя 5-6: Дополнительные функции

**Ветка:** `feature/phase-6-additional-features`

**Задачи:**

1. **Система достижений/бейджей**

   - Создание достижений
   - Награждение пользователей
   - Отображение бейджей

   **Файлы для создания:**

   - `src/components/achievements/achievement-badge.tsx`
   - `src/app/api/achievements/route.ts`

   **Коммиты:**

   ```
   feat(achievements): create achievements system
   feat(achievements): add achievement definitions
   feat(achievements): award achievements to users
   feat(achievements): display achievement badges
   feat(api): add GET /api/achievements endpoint
   feat(api): add POST /api/achievements/award endpoint
   ```

2. **Галерея скриншотов/видео**

   - Загрузка медиа
   - Галерея матчей
   - Просмотр медиа

   **Коммиты:**

   ```
   feat(gallery): enhance gallery with match media
   feat(gallery): add screenshot upload
   feat(gallery): add video upload support
   feat(gallery): organize media by events
   feat(api): add POST /api/gallery/upload endpoint
   ```

3. **Реферальная программа**

   - Система рефералов
   - Отслеживание рефералов
   - Награды за рефералов

   **Коммиты:**

   ```
   feat(referrals): implement referral program
   feat(referrals): track referrals
   feat(referrals): add referral rewards
   feat(referrals): display referral statistics
   feat(api): add POST /api/referrals/create endpoint
   ```

4. **Система отзывов**

   - Отзывы об ивентах
   - Рейтинги организаторов
   - Отображение отзывов

   **Коммиты:**

   ```
   feat(reviews): add event review system
   feat(reviews): rate event organizers
   feat(reviews): display reviews on event pages
   feat(reviews): add review moderation
   feat(api): add POST /api/events/[id]/reviews endpoint
   ```

**Чеклист:**

- [ ] Достижения работают
- [ ] Галерея расширена
- [ ] Реферальная программа функционирует
- [ ] Отзывы работают

**Мерж в main:** После завершения всех задач

---

### Фаза 7: v3.5 - Оптимизация и масштабирование (2-3 недели)

**Ветка:** `feature/phase-7-optimization`

**Цель:** Оптимизировать производительность и подготовить к масштабированию

#### Неделя 1: Оптимизация производительности

**Ветка:** `refactor/phase-7-performance`

**Задачи:**

1. **Оптимизация запросов к БД**

   - Индексы для частых запросов
   - Оптимизация JOIN запросов
   - Кэширование запросов

   **Коммиты:**

   ```
   refactor(db): add database indexes for frequent queries
   refactor(db): optimize JOIN queries
   refactor(db): implement query caching
   refactor(api): add response caching headers
   ```

2. **Оптимизация фронтенда**

   - Code splitting
   - Lazy loading компонентов
   - Оптимизация изображений

   **Коммиты:**

   ```
   refactor(frontend): implement code splitting
   refactor(frontend): add lazy loading for components
   refactor(frontend): optimize image loading
   refactor(frontend): add image optimization
   ```

3. **Мониторинг производительности**

   - Интеграция с Vercel Analytics
   - Мониторинг API
   - Логирование производительности

   **Коммиты:**

   ```
   setup(monitoring): integrate Vercel Analytics
   setup(monitoring): add API performance monitoring
   setup(monitoring): implement performance logging
   ```

#### Неделя 2: Тестирование

**Ветка:** `test/phase-7-testing`

**Задачи:**

1. **Unit тесты**

   - Тесты для утилит
   - Тесты для компонентов
   - Покрытие тестами

   **Коммиты:**

   ```
   test(utils): add unit tests for utilities
   test(components): add component tests
   test(api): add API endpoint tests
   setup(testing): configure Jest/Vitest
   ```

2. **Интеграционные тесты**

   - Тесты API
   - Тесты баз данных
   - E2E тесты

   **Коммиты:**

   ```
   test(integration): add API integration tests
   test(integration): add database integration tests
   test(e2e): add end-to-end tests with Playwright
   ```

3. **Нагрузочное тестирование**

   - Тесты нагрузки
   - Стресс-тесты
   - Оптимизация на основе результатов

   **Коммиты:**

   ```
   test(load): add load testing
   test(load): perform stress tests
   refactor(performance): optimize based on load test results
   ```

#### Неделя 3: Документация и финализация

**Ветка:** `docs/phase-7-documentation`

**Задачи:**

1. **Обновление документации**

   - API документация
   - Руководство разработчика
   - Руководство пользователя

   **Коммиты:**

   ```
   docs(api): create comprehensive API documentation
   docs(dev): update developer guide
   docs(user): create user manual
   docs(deployment): document deployment process
   ```

2. **Подготовка к релизу**

   - Финальное тестирование
   - Проверка всех функций
   - Подготовка релизных заметок

   **Коммиты:**

   ```
   chore(release): final testing before release
   chore(release): verify all features
   docs(release): prepare release notes
   ```

**Чеклист:**

- [ ] Производительность оптимизирована
- [ ] Тесты написаны и проходят
- [ ] Документация обновлена
- [ ] Готово к релизу

**Мерж в main:** После завершения всех задач

---

## Технический роадмэп

### База данных (Supabase + Drizzle ORM)

**Использование Supabase:**

- Supabase предоставляет PostgreSQL базу данных через свой API
- Drizzle ORM работает с Supabase через стандартный PostgreSQL connection string
- Supabase также предоставляет: Storage, Realtime subscriptions, Edge Functions
- Миграции выполняются через Drizzle Kit к Supabase проекту

**Расширение схемы в `shared/schema.ts`:**

```typescript
// Основные таблицы
- users (id, email, username, display_name, avatar, bio, steam_id, discord_id, rating, role, is_banned, banned_until, ban_reason, etc.)
- events (id, title, description, type, game_mode, start_date, end_date, server, map, max_participants, organizer_id, is_public, registration_open, status, etc.)
- clans (id, name, tag, description, logo, leader_id, rating, etc.)
- clan_members (clan_id, user_id, role, joined_at)
- event_registrations (event_id, user_id, clan_id, status, registered_at)
- event_teams (event_id, team_name, members[])
- notes (id, user_id, clan_id, title, content, category, event_id, tags, created_at)
- match_results (event_id, team1_id, team2_id, winner_id, score, stats)
- user_stats (user_id, kd_ratio, wins, losses, events_participated, etc.)
- past_event_highlights (id, event_id, title, description, image_url, video_url, accent_color, is_featured, display_order, tags, created_by, etc.)
- permissions (id, name, description, category) // Система прав доступа
- user_permissions (user_id, permission_id, granted_by, granted_at) // Права пользователей
- role_permissions (role, permission_id) // Права по ролям
- leaderboards (type, period, rankings[])
- notifications (id, user_id, type, message, read, created_at)
- messages (id, sender_id, receiver_id, content, created_at)
- comments (id, event_id, user_id, content, created_at)
- achievements (id, name, description, icon)
- user_achievements (user_id, achievement_id, earned_at)
- audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at) // Для админки и суперадминки
```

### API структура

**`src/app/api/` структура:**

```
api/
├── auth/
│   ├── [...nextauth]/
│   └── callback/
├── users/
│   ├── [id]/
│   │   ├── route.ts
│   │   ├── events/
│   │   ├── stats/
│   │   └── rating/
│   └── me/
│       ├── route.ts
│       └── notification-settings/
├── events/
│   ├── route.ts (GET, POST)
│   └── [id]/
│       ├── route.ts (GET, PUT, DELETE)
│       ├── register/
│       ├── results/
│       ├── comments/
│       ├── teams/
│       └── stats/
├── clans/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       ├── members/
│       ├── invite/
│       ├── events/
│       ├── stats/
│       └── rating/
├── notes/
│   ├── route.ts
│   └── [id]/
├── leaderboards/
│   └── route.ts
├── stats/
│   └── route.ts
├── notifications/
│   └── route.ts
├── messages/
│   └── route.ts
├── matchmaking/
│   ├── join/
│   └── leave/
├── analytics/
│   └── route.ts
├── superadmin/
│   ├── page.tsx (dashboard)
│   ├── layout.tsx
│   ├── permissions/
│   │   ├── page.tsx
│   │   ├── create/
│   │   └── [id]/
│   ├── users/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── role/
│   │       └── permissions/
│   ├── roles/
│   │   └── [role]/
│   │       └── permissions/
│   ├── settings/
│   ├── audit/
│   ├── backup/
│   └── monitoring/
├── admin/
│   ├── dashboard/
│   ├── moderation/
│   ├── audit-logs/
│   ├── events/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── participants/
│   ├── past-events/
│   │   ├── route.ts
│   │   └── [id]/
│   ├── users/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── ban/
│   │       └── role/
│   ├── settings/
│   └── content/
└── export/
    └── user-data/
```

### Компоненты

**Новые компоненты в `src/components/`:**

```
components/
├── auth/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── oauth-buttons.tsx
├── profile/
│   ├── user-profile.tsx
│   ├── profile-stats.tsx
│   ├── profile-settings.tsx
│   └── event-history.tsx
├── events/
│   ├── event-create-form.tsx
│   ├── event-card.tsx
│   ├── event-details.tsx
│   ├── event-registration.tsx
│   ├── event-calendar.tsx
│   ├── event-participants.tsx
│   ├── event-teams.tsx
│   ├── event-comments.tsx
│   └── event-filters.tsx
├── clans/
│   ├── clan-card.tsx
│   ├── clan-profile.tsx
│   ├── clan-members.tsx
│   ├── clan-invite.tsx
│   ├── clan-settings.tsx
│   └── clan-event-history.tsx
├── notes/
│   ├── note-editor.tsx
│   ├── note-list.tsx
│   └── note-templates.tsx
├── leaderboards/
│   ├── leaderboard-table.tsx
│   └── leaderboard-filters.tsx
├── notifications/
│   └── notification-center.tsx
├── messages/
│   ├── message-list.tsx
│   └── message-composer.tsx
├── matchmaking/
│   └── matchmaking-queue.tsx
├── analytics/
│   └── analytics-dashboard.tsx
├── achievements/
│   └── achievement-badge.tsx
├── superadmin/
│   ├── superadmin-nav.tsx
│   ├── superadmin-dashboard.tsx
│   ├── permissions/
│   │   ├── permissions-list.tsx
│   │   ├── user-permissions-manager.tsx
│   │   └── role-permissions-manager.tsx
│   ├── users/
│   │   ├── users-list.tsx
│   │   └── role-selector.tsx
│   ├── settings/
│   │   └── system-settings.tsx
│   ├── audit/
│   │   └── audit-logs-viewer.tsx
│   └── monitoring/
│       └── system-metrics.tsx
├── admin/
│   ├── admin-nav.tsx
│   ├── admin-dashboard.tsx
│   ├── users-list.tsx
│   ├── moderation-panel.tsx
│   ├── events/
│   │   ├── event-create-form.tsx
│   │   ├── event-list.tsx
│   │   └── event-participants-manager.tsx
│   └── past-events/
│       ├── highlight-form.tsx
│       └── highlights-list.tsx
└── settings/
    └── notification-settings.tsx
```

### Страницы

**Новые страницы в `src/app/[locale]/`:**

```
[locale]/
├── dashboard/ (личный кабинет)
├── auth/
│   ├── login/
│   └── register/
├── profile/
│   ├── page.tsx
│   └── edit/
├── events/
│   ├── page.tsx (список)
│   ├── create/
│   ├── [id]/
│   │   ├── page.tsx
│   │   └── edit/
│   └── calendar/
├── clans/
│   ├── page.tsx
│   ├── create/
│   └── [id]/
│       ├── page.tsx
│       └── settings/
├── notes/
│   ├── page.tsx
│   └── [id]/
├── leaderboards/
│   └── page.tsx
├── messages/
│   └── page.tsx
├── calendar/
│   └── page.tsx
├── analytics/
│   └── page.tsx
├── settings/
│   └── notifications/
├── superadmin/
│   ├── page.tsx (dashboard)
│   ├── layout.tsx
│   ├── permissions/
│   │   ├── page.tsx
│   │   ├── create/
│   │   └── [id]/
│   ├── users/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── role/
│   │       └── permissions/
│   ├── roles/
│   │   └── [role]/
│   │       └── permissions/
│   ├── settings/
│   ├── audit/
│   ├── backup/
│   └── monitoring/
└── admin/
    ├── page.tsx (dashboard)
    ├── layout.tsx
    ├── events/
    │   ├── page.tsx
    │   ├── create/
    │   └── [id]/
    │       ├── edit/
    │       └── participants/
    ├── past-events/
    │   ├── page.tsx
    │   ├── create/
    │   └── [id]/
    │       └── edit/
    ├── users/
    ├── moderation/
    ├── settings/
    ├── content/
    └── audit-logs/
```

---

## Оценка времени и ресурсов

**Общая оценка:** 25-33 недели (6-8 месяцев)

**Команда:**

- 1-2 Full-stack разработчика
- 1 UI/UX дизайнер (частичная занятость)
- 1 DevOps (частичная занятость, для настройки инфраструктуры)

**По фазам:**

- Фаза 0: 2-3 недели
- Фаза 1 (MVP): 6-8 недель
- Фаза 2: 4-6 недель
- Фаза 3: 3-4 недели
- Фаза 4: 4-5 недель
- Фаза 5: 3-4 недели
- Фаза 6: 5-6 недель
- Фаза 7: 2-3 недели

---

## Риски и зависимости

**Технические риски:**

- Интеграция с Steam API (может потребовать верификацию)
- Масштабирование базы данных при росте пользователей (Supabase автоматически масштабируется)
- Производительность при большом количестве ивентов
- Ограничения бесплатного плана Supabase (при необходимости перейти на платный)

**Зависимости:**

- Фаза 1 зависит от Фазы 0 (инфраструктура)
- Фаза 2 зависит от Фазы 1 (базовая система ивентов)
- Фаза 4 зависит от Фазы 2 (система кланов для рейтинга)
- Фаза 7 зависит от всех предыдущих фаз

**Меры по снижению рисков:**

- Раннее тестирование интеграций (Steam, Discord)
- Оптимизация запросов к БД с самого начала
- Постепенное масштабирование инфраструктуры
- Регулярное тестирование производительности

---

## Метрики успеха

**MVP (Фаза 1):**

- 100+ зарегистрированных пользователей
- 10+ созданных ивентов в месяц
- 50+ регистраций на ивенты

**v1.0 (Фаза 2):**

- 20+ активных кланов
- 5+ клановых ивентов в месяц

**v2.0 (Фаза 4):**

- 500+ активных пользователей
- Еженедельные активные пользователи: 30%+
- Средний рейтинг игроков отслеживается

**v3.0 (Фаза 6):**

- 1000+ активных пользователей
- Ежедневные активные пользователи: 20%+
- Матчмейкинг используется регулярно

---

## Приоритизация

**Критичные функции (MVP):**

1. Аутентификация
2. Создание ивентов
3. Регистрация на ивенты
4. Базовый календарь

**Важные функции (v1.0-v2.0):**

1. Система кланов
2. Лидерборды
3. Планирование и заметки
4. Расширенная статистика

**Желательные функции (v2.5-v3.0):**

1. Матчмейкинг
2. Продвинутая аналитика
3. Система достижений
4. Мобильное приложение

---

## Чеклисты для каждой фазы

### Фаза 0: Инфраструктура

- [ ] Supabase проект создан
- [ ] База данных настроена
- [ ] Миграции работают
- [ ] Auth настроен
- [ ] CI/CD работает
- [ ] Окружения настроены

### Фаза 1: MVP

- [ ] Аутентификация работает
- [ ] Суперадмин панель доступна и функционирует
- [ ] Система прав доступа работает
- [ ] Суперадмины могут управлять правами пользователей
- [ ] Суперадмины могут изменять роли пользователей
- [ ] Админ панель доступна и функционирует
- [ ] Админы могут создавать ивенты
- [ ] Ивенты отображаются на главной странице
- [ ] Админы могут управлять пользователями
- [ ] Админы могут отстранять участников от ивентов
- [ ] Админы могут создавать и редактировать хайлайты прошедших ивентов
- [ ] Хайлайты отображаются на главной странице
- [ ] Профили пользователей создаются
- [ ] Регистрация на ивенты работает
- [ ] Календарь отображается

### Фаза 2: Кланы

- [ ] Кланы создаются
- [ ] Управление составом работает
- [ ] Командная регистрация работает
- [ ] Статистика отображается

### Фаза 3: Заметки

- [ ] Заметки создаются
- [ ] Клановые заметки работают
- [ ] Интеграция с ивентами работает

### Фаза 4: Лидерборды

- [ ] Рейтинг рассчитывается
- [ ] Лидерборды отображаются
- [ ] Статистика расширена

### Фаза 5: Коммуникация

- [ ] Уведомления работают
- [ ] Сообщения функционируют
- [ ] Модерация настроена

### Фаза 6: Продвинутые функции

- [ ] Матчмейкинг работает
- [ ] Аналитика функционирует
- [ ] Дополнительные функции реализованы

### Фаза 7: Оптимизация

- [ ] Производительность оптимизирована
- [ ] Тесты написаны
- [ ] Документация обновлена

---

## Полезные команды

### Работа с миграциями

```bash
# Генерация миграции
npm run db:generate

# Применение миграции
npm run db:migrate

# Просмотр статуса миграций
npm run db:status
```

### Работа с Git

```bash
# Создание ветки для фазы
git checkout -b feature/phase-1-auth-profiles

# Коммит с правильным форматом
git commit -m "feat(auth): add Steam OAuth integration"

# Пуш ветки
git push origin feature/phase-1-auth-profiles
```

### Разработка

```bash
# Запуск dev сервера
npm run dev

# Сборка проекта
npm run build

# Линтинг
npm run lint
```

---

## Дополнительные ресурсы

- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Последнее обновление:** 2024

**Версия документа:** 2.0
