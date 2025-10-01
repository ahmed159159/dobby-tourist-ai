async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  // عرض رسالة المستخدم
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML += `<div class="msg user">👤 ${message}</div>`;
  input.value = "";

  try {
    // استدعاء الـ backend
    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    const reply = data.reply || "Dobby didn’t respond 😅";

    messagesDiv.innerHTML += `<div class="msg bot">🤖 ${reply}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // ينزل لآخر الشات
  } catch (err) {
    console.error(err);
    messagesDiv.innerHTML += `<div class="msg bot">❌ Error connecting to Dobby</div>`;
  }
}
