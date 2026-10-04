# KodYol

Обучающий PWA по HTML/CSS/JS. Пять папок на главной: **DATA SCIENCE** (8 уроков: основы, Python, NumPy, Pandas, очистка данных, визуализация, ML, оценка и проект), **FULL STACK** (11 уроков), **CYBERSECURITY** (8 уроков: основы, пароли и 2FA, фишинг, сеть, криптография, веб-безопасность, практика защиты, инциденты), **BACKEND** (8 уроков: Backend основы, HTTP/REST, Express, БД и JOIN, JWT, безопасность, ошибки и тесты, деплой и Docker) и **FRONTEND** (7 уроков: HTML I–II, CSS I–II, Flexbox+Responsive, JavaScript, React). Аккаунты, профили и чат работают на Firebase (Auth + Firestore realtime).

## Что настроить в Firebase (один раз)
1. https://console.firebase.google.com → проект `kodyol-cc1e7`.
2. **Authentication → Sign-in method**: включить **Email/Password** и **Google**.
3. **Authentication → Settings → Authorized domains**: добавить `smshoxa-ops.github.io` (и `localhost` для тестов).
4. **Firestore Database** → создать базу (если нет) → вкладка **Rules** → вставить содержимое `firestore.rules` → **Publish**.
   Либо: `npm i -g firebase-tools && firebase login && firebase deploy --only firestore:rules`.

## Google OAuth (Client ID)
При включении Google в Firebase он сам создаёт Web Client ID; вставлять его в код не нужно.
Если хотите проверить вручную: Google Cloud Console → APIs & Services → Credentials → **Web client (auto created by Google Service)**:
- Authorized JavaScript origins: `https://smshoxa-ops.github.io`
- Authorized redirect URIs: `https://kodyol-cc1e7.firebaseapp.com/__/auth/handler`
Client Secret в код и в GitHub попадать не должен (он нужен только Firebase).

## Рекомендуется
Google Cloud Console → Credentials → API key проекта → **HTTP referrers**: `https://smshoxa-ops.github.io/*`, `https://kodyol-cc1e7.firebaseapp.com/*`.

## Как устроены данные
`users/{uid}` профиль · `follows/{a_b}` подписки · `chats/{uidA_uidB}` (members, last, lu, rd, del) · `chats/{id}/msgs/{id}` сообщения (hid = «удалено у себя») · `reports`.
Пароли хранит и хэширует Firebase Auth; email виден только владельцу (в `users` не сохраняется).

## ИИ-помощник (Gemini через Firebase AI Logic)
1. Firebase Console → проект `kodyol-cc1e7` → тариф **Spark** (без привязанной карты, иначе бесплатный уровень Gemini не работает).
2. **AI Services → AI Logic → Get started** → провайдер **Gemini Developer API** → пройти мастер до конца.
3. Ключ reCAPTCHA Enterprise: Google Cloud Console (тот же проект `kodyol-cc1e7`) → **Fraud Defense / reCAPTCHA Enterprise** → включить API → **Create key** → тип **Website**, без проверки «я не робот» (score-based) → домены `smshoxa-ops.github.io` и `localhost` → скопировать **site key**. Платёжный аккаунт не нужен.
   Затем Firebase Console → **App Check → Apps → Web** → вставить site key → **Save**.
4. В `index.html` найти `const APPCHECK_KEY=""` и вставить site key между кавычками.
5. Firebase Console → Authentication → Settings → Authorized domains: твой домен (`smshoxa-ops.github.io`) уже должен быть.
6. Залить `index.html` и `sw.js` на хостинг, открыть сайт, кнопка «ИИ» в нижнем меню.
Модели меняются в списке `AI_MODELS`. Если ИИ недоступен, сайт отвечает по старой встроенной базе.

## Платный ИИ ($7 в месяц, оплата через Telegram)
Как это работает: пользователь входит, на экране ИИ видит свой код и кнопку «Оплатить через Telegram». Пишет тебе, переводит деньги на твою карту, а ты включаешь ему доступ в «Панели владельца» на экране ИИ (вставить код, нажать «Включить на 30 дней»).
Настройка (один раз):
1. В `index.html` найти `const TG_USER=""` и вписать свой Telegram-ник без @.
2. Войти на сайт под своим аккаунтом, открыть экран ИИ, скопировать свой код и вписать его в `const ADMIN_UID=""` в `index.html` и вместо `ADMIN_UID` (2 места) в `firestore.rules`.
3. Опубликовать `firestore.rules` в Firebase (Firestore Database → Rules → Publish).
4. В `pricing.html`, `terms.html`, `privacy.html`, `refunds.html` заменить `YOUR_TG` на свой Telegram-ник.
Доступ хранится в документе `subs/{uid}` с полем `until`. Это защита в браузере: чтобы её нельзя было обойти через DevTools, вызовы Gemini нужно пускать через свой сервер.

## Уроки в стиле Duolingo (v95)
Кнопка «Уроки» на главной теперь открывает: **выбор направления** (при первом входе: Full Stack / Frontend / Backend / Cybersecurity / Data Science) → **дорожка уроков** (зигзаг из кругов, сундуки с наградой, трофей в конце) → **упражнения** (новая тема, вопросы, «собери код», пары, сердца, XP, конфетти).
Код модуля — в конце `index.html` (блок `kd-css` + последний `<script>`). Прогресс хранится в `localStorage` под ключом `kd_duo` (направление, пройденные уроки, XP, сундуки) и дополнительно отмечает карточки в старом прогрессе. Упражнения строятся автоматически из карточек `D` каждого урока, поэтому новые карточки появляются в уроках сами. Тексты интерфейса: ru / en / uz (остальные языки показывают English) — словарь `I` в начале модуля.

**Синхронизация (v96):** при входе через Google/Email прогресс уроков (направление, пройденные уроки, XP, сундуки) сохраняется в Firestore, документ `progress/{uid}`, и подтягивается на любом устройстве. Нужно один раз опубликовать обновлённый `firestore.rules`.


## Выбор языка (v109)
Меню «Какой язык вы хотите?» показывается один раз новому пользователю: сначала выбор языка (функция `window.kdPickLang`), затем экран «Придумайте имя пользователя». При обычном заходе меню не появляется.


## Баннер профиля (v110)
Карточка профиля: баннер 16:9, аватар поверх него, статистика, имя/@username, кнопки. Баннер выбирается из галереи и кадрируется как в YouTube (двигать/масштабировать). Хранится в `users/{uid}.banner` (JPEG 640x360, до 65 КБ). **После обновления нужно задеплоить `firestore.rules`** (в них добавлено поле `banner`), иначе баннер не сохранится.


## Профиль на весь экран (v111)
Баннер идёт от края до края и под статус-баром, верхняя шапка KodYol на странице профиля скрыта, кнопки «+» и меню лежат поверх баннера. Аватар наполовину на баннере.


## Меню скачивания (v136)
Кнопка в шапке главной открывает меню: Android (`kodyol.apk`) и iPhone (`kodyol.ipa`) + подсказка «На экран Домой». Положите `kodyol.ipa` рядом с `index.html`; пока его нет, пункт iPhone неактивен. Сборка .ipa без Mac: GitHub Actions, `.github/workflows/ios.yml`.

## v139
- Нет зума двойным тапом и щипком; на телефонах нельзя выделять/копировать текст (поля ввода и `.kd-sel` исключены).
- Кнопка «Скачать» (APK/IPA) скрыта в приложении (класс `is-app` на `<html>`); принудительно: `?app=1`.
- `translate="no"`: Яндекс.Браузер больше не переводит интерфейс.
- Service Worker: `updateViaCache:"none"`, страницы без кэша, проверка обновления при возврате в приложение.
- Подсказка про Play Protect в окне скачивания.
- Полоска адреса в APK: файл `.well-known/assetlinks.json` в репозитории `smshoxa-ops.github.io`.

## v140
- Нижнее меню: новый дизайн (тёмная «таблетка», зелёная линия поднимается вкладкой вокруг активной кнопки и плавно едет за ней с пружинкой и растяжением; у кнопок появились подписи на 6 языках, иконка активной подпрыгивает и светится). Кнопки, порядок и логика не менялись, только стиль (`<style id="kd-nav">`) и скрипт линии (SVG поверх меню).

## Reels (v144)
Кнопка «Reels» в нижнем меню между «Чаты» и «Поиск»: вертикальная лента как в Instagram (лайки, двойной тап, комментарии, репост, «поделиться», подписка на автора, описание, вкладки «Новые» и «Популярные»). Кнопка «+» вверху справа: загрузка видео с телефона.
**Обязательно после обновления:** Firebase Console → Firestore → Rules → вставить новый `firestore.rules` → **Publish** (добавлены `reels`, `rchunks`, подколлекции `likes`, `rps`, `cm`).
Как хранится видео: на Spark-тарифе Firebase Storage недоступен без карты, поэтому видео сжимается прямо в браузере (до 30 с, примерно 480p, ~450 кбит/с, обычно 1–2.5 МБ) и сохраняется кусками по ~480 КБ в `rchunks/{reelId}_{i}`; метаданные и счётчики в `reels/{id}`. Лимит одного видео ~2.9 МБ. Бесплатные квоты Firestore: 1 ГБ хранилища, 50 тыс. чтений в сутки (один просмотр = 1–5 чтений).
Популярные: свежие 60 reels, сортировка по лайкам, комментариям, репостам с учётом возраста. Ссылка на конкретный reel: `?r=ID`.
