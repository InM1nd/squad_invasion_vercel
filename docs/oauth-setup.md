# Настройка OAuth провайдеров в Supabase

## Steam OAuth

1. Перейдите в Supabase Dashboard → Authentication → Providers
2. Найдите "Steam" в списке провайдеров
3. Включите провайдер
4. Настройте:
   - **Steam Web API Key**: Получите на https://steamcommunity.com/dev/apikey
   - **Redirect URL**: `https://vpzvmmsenskreznshevf.supabase.co/auth/v1/callback`
5. Сохраните настройки

## Discord OAuth

1. Перейдите в Supabase Dashboard → Authentication → Providers
2. Найдите "Discord" в списке провайдеров
3. Включите провайдер
4. Создайте приложение в Discord Developer Portal:
   - Перейдите на https://discord.com/developers/applications
   - Создайте новое приложение
   - В разделе "OAuth2" добавьте Redirect URL:
     - `https://vpzvmmsenskreznshevf.supabase.co/auth/v1/callback`
   - Скопируйте Client ID и Client Secret
5. В Supabase введите:
   - **Client ID**: из Discord Developer Portal
   - **Client Secret**: из Discord Developer Portal
6. Сохраните настройки

## Настройка Redirect URLs

Убедитесь, что в Supabase Dashboard → Authentication → URL Configuration добавлены:

- **Site URL**: `http://localhost:3000` (для разработки)
- **Redirect URLs**:
  - `http://localhost:3000/ru/auth/callback`
  - `http://localhost:3000/en/auth/callback`
  - `https://yourdomain.com/ru/auth/callback` (для продакшена)
  - `https://yourdomain.com/en/auth/callback` (для продакшена)

## Использование в коде

После настройки OAuth провайдеров в Supabase Dashboard, вы можете использовать готовые компоненты:

### Компонент OAuth кнопок

```tsx
import { OAuthButtons } from "@/components/auth/oauth-buttons";

// В вашем компоненте
<OAuthButtons redirectTo="http://localhost:3000" />
```

Компонент автоматически определяет текущую локаль из URL.

### Программная инициализация OAuth

```tsx
import { signInWithOAuth } from "@/lib/auth/oauth";

// Инициировать OAuth поток
await signInWithOAuth("steam", "http://localhost:3000", "ru");
await signInWithOAuth("discord", "http://localhost:3000", "ru");
```

### Callback обработка

Callback автоматически обрабатывается на странице `/[locale]/auth/callback`.
После успешной авторизации пользователь будет перенаправлен на страницу, с которой начал авторизацию.

## Тестирование

После настройки OAuth провайдеров можно протестировать:

1. Используйте компонент `<OAuthButtons />` на странице логина
2. При клике на кнопку Steam/Discord пользователь будет перенаправлен на авторизацию
3. После успешной авторизации пользователь вернется на ваш сайт
4. Проверьте, что сессия создана: `const { data: { user } } = await supabase.auth.getUser()`

## Важные замечания

- **Steam**: Требует верификации домена для production
- **Discord**: Работает сразу после настройки
- Все OAuth провайдеры используют один и тот же callback URL в Supabase
- Callback URL должен быть настроен в Supabase Dashboard → Authentication → URL Configuration
- После авторизации пользователь автоматически создается в таблице `auth.users` в Supabase
- Для синхронизации с таблицей `users` в вашей БД нужно создать trigger или использовать Supabase Auth hooks

## Синхронизация пользователей с вашей БД

После успешной OAuth авторизации пользователь создается в `auth.users`, но не автоматически в вашей таблице `users`.

Для синхронизации можно:

1. **Использовать Database Trigger** (рекомендуется):
   - Создать trigger в Supabase, который автоматически создает запись в `users` при создании пользователя в `auth.users`

2. **Использовать Auth Hook**:
   - Настроить webhook в Supabase, который будет вызывать ваш API при создании пользователя

3. **Создавать вручную при первом входе**:
   - При первом обращении к защищенной странице проверять наличие пользователя в `users` и создавать при необходимости
