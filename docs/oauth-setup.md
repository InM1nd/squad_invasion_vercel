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
  - `http://localhost:3000/auth/callback`
  - `https://yourdomain.com/auth/callback` (для продакшена)

## Тестирование

После настройки OAuth провайдеров можно протестировать:

1. Создайте страницу логина с кнопками OAuth
2. При клике на кнопку Steam/Discord пользователь будет перенаправлен на авторизацию
3. После успешной авторизации пользователь вернется на ваш сайт

## Важные замечания

- **Steam**: Требует верификации домена для production
- **Discord**: Работает сразу после настройки
- Все OAuth провайдеры используют один и тот же callback URL в Supabase
