async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const message = userInput.value.trim();
  if (!message) return;

  addMessage("👤 " + message);
  conversation.push({ role: "user", content: message });
  userInput.value = "";

  // 🛰️ نحاول نجيب إحداثيات المستخدم
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation, lat, lon })
    });

    const data = await res.json();
    addMessage("🤖 " + data.reply);
    conversation.push({ role: "assistant", content: data.reply });
  }, async () => {
    // fallback لو اليوزر رفض مشاركة الموقع
    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation })
    });

    const data = await res.json();
    addMessage("🤖 " + data.reply);
    conversation.push({ role: "assistant", content: data.reply });
  });
}
