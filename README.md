# KodYol

Обучающий PWA по HTML/CSS. Аккаунты, профили и чат работают на Firebase (Auth + Firestore realtime).

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
