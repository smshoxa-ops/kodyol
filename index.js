const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

// Когда в личном чате появляется сообщение, отправляем push второму участнику
exports.notifyMsg = onDocumentCreated("chats/{chatId}/msgs/{msgId}", async (event) => {
  const chatId = event.params.chatId;
  if (chatId === "general") return;
  const m = event.data && event.data.data();
  if (!m) return;
  const to = chatId.split("_").find((x) => x !== m.uid);
  if (!to) return;

  const db = getFirestore();
  const ref = db.doc("fcm/" + to);
  const snap = await ref.get();
  const tokens = (snap.exists && snap.data().tokens) || [];
  if (!tokens.length) return;

  const res = await getMessaging().sendEachForMulticast({
    tokens,
    data: {
      title: String(m.name || "KodYol"),
      body: String(m.text || "").slice(0, 120),
      url: "./",
      tag: "chat-" + chatId
    },
    webpush: { headers: { Urgency: "high", TTL: "86400" } }
  });

  // удаляем токены, которые больше не работают
  const dead = [];
  res.responses.forEach((r, i) => {
    const c = r.error && r.error.code;
    if (c === "messaging/registration-token-not-registered" || c === "messaging/invalid-registration-token") dead.push(tokens[i]);
  });
  if (dead.length) await ref.update({ tokens: FieldValue.arrayRemove(...dead) });
});
