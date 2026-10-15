# FION: публикация в Google Play (v188, package: ffion.app)

## A. Пока ждёте проверку личности
1. `sh set-email.sh ваш@email` : подставит email во все страницы (privacy, terms, community, delete-account, pricing, refunds). Email должен быть тем же, что в Play Console.
2. Firebase Console → Firestore → Rules → вставить `firestore.rules` → Publish (добавлен тип жалобы `ai`).
3. Залить на сайт (репозиторий kodyol): index.html, sw.js, sitemap.xml, privacy/terms/community/delete-account/pricing/refunds.html. Проверить, что открываются /privacy.html и /delete-account.html.
4. Пересобрать AAB на pwabuilder.com → Android → Package ID **ffion.app**, versionCode 1, versionName 1.0.0. Выбрать «Use mine» и загрузить существующий signing.keystore (тогда отпечаток ключа остаётся прежним). Включить notifications, Play Billing НЕ включать. Target SDK 36.
5. Файл `well-known/assetlinks.json` положить в репозиторий **smshoxa-ops.github.io** по пути `.well-known/assetlinks.json` (корень хоста, не папка kodyol). Проверка: https://smshoxa-ops.github.io/.well-known/assetlinks.json
6. Demo-аккаунт для проверяющих (email + пароль) + 2-й аккаунт для проверки жалоб/блокировки.
7. Графика: feature graphic 1024×500, 2–8 скриншотов телефона (главная, уроки, чат, reels, профиль).
8. Собрать 12+ тестеров (Gmail), создать Google-группу, попросить принять тест и не выходить 14 дней.
9. Резервная копия signing.keystore и паролей (не на GitHub). Файл signing-key-info.txt никому не отправлять.

## B. После одобрения аккаунта
1. Подтвердить телефон, пройти «Проверка разработчика Android».
2. Create app: название FION, язык RU, App, Free.
3. Включить Play App Signing, загрузить AAB в **Testing → Closed testing**.
4. App signing → скопировать SHA-256 сертификата подписи → вставить вместо PASTE_PLAY_APP_SIGNING_SHA256_HERE в assetlinks.json → залить на сайт.
5. Добавить тестеров, ждать 14 дней, затем Apply for production access.

## C. App content (ответы)
- Privacy policy: https://smshoxa-ops.github.io/kodyol/privacy.html
- Account deletion: https://smshoxa-ops.github.io/kodyol/delete-account.html (удаление есть и в приложении)
- App access: нужен вход → логин/пароль demo-аккаунта
- Ads: нет. Target audience: 13+ (не для детей). Категория: Education
- User generated content: да (жалобы, блокировка, модерация)
- Content rating: пользователи взаимодействуют и делятся контентом = Да; 18+/насилие = Нет
- Financial features / Health / News / Government: нет
- Data safety: Personal info (имя, email, ID), Messages, Photos and videos, App activity, Device IDs (push-токен), User content. Шифрование при передаче: да. Удаление по запросу: да. Данные не продаются; обработчики: Firebase, Supabase, Cloudflare, Metered. Вопросы к ИИ уходят в Google Gemini: указать как User content, обработка сервисом. Звонки не записываются.
- AI-generated content: в приложении у каждого ответа ИИ есть кнопка «Пожаловаться».

## D. Тексты Store listing
**Название:** FION
**Short RU:** Учись программированию: уроки, тесты, чат и Reels
**Short EN:** Learn coding with lessons, quizzes, chat and Reels
**Short UZ:** Dasturlashni o'rganing: darslar, testlar, chat va Reels
**Full RU:** FION помогает учиться программированию шаг за шагом: Full Stack, Frontend, Backend, Cybersecurity и Data Science. Короткие уроки в стиле игры, тесты, XP и сердечки, карта прогресса. Общайтесь с другими учениками в чате, делитесь публикациями и короткими видео Reels, звоните друг другу голосом и видео. ИИ-помощник объясняет ошибки. Есть жалобы и блокировка пользователей, а аккаунт можно удалить в настройках. Для пользователей от 13 лет.
**Full EN:** FION helps you learn programming step by step: Full Stack, Frontend, Backend, Cybersecurity and Data Science. Short game-style lessons, quizzes, XP and hearts, and a progress map. Chat with other learners, share posts and short Reels videos, and make voice and video calls. An AI assistant explains your mistakes. You can report and block users, and delete your account in Settings. For ages 13 and up.

## E. Помнить
- Reels-файлы в Supabase после удаления не чистятся автоматически: раз в месяц чистить bucket `reels` от файлов без записи в Firestore.
- Жалобы смотреть ежедневно (Панель владельца → Жалобы): в условиях обещано 24 часа.
- Каждое обновление AAB: versionCode +1.
