let conversation = [];

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML += `<div class="msg user">👤 ${message}</div>`;
  input.value = "";

  // نحفظ رسالة المستخدم
  conversation.push({ role: "user", content: message });

  try {
    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation })
    });

    const data = await res.json();
    const reply = data.reply || "Dobby didn’t respond 😅";

    // نعرض رد Dobby
    messagesDiv.innerHTML += `<div class="msg bot">🤖 ${reply}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // نحفظ رد البوت
    conversation.push({ role: "assistant", content: reply });

  } catch (err) {
    console.error(err);
    messagesDiv.innerHTML += `<div class="msg bot">❌ Error connecting to Dobby</div>`;
  }
}
