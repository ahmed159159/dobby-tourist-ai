async function sendMessage() {
  const input = document.getElementById("userInput");
  const msgBox = document.getElementById("messages");

  let userMsg = input.value.trim();
  if (!userMsg) return;

  msgBox.innerHTML += `<div class="msg-user"><b>👤 أنت:</b> ${userMsg}</div>`;
  input.value = "";

  try {
    const res = await fetch("https://YOUR_BACKEND_URL.onrailway.app/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userMsg })
    });
    const data = await res.json();

    msgBox.innerHTML += `<div class="msg-bot"><b>🤖 Dobby:</b> ${data.answer}</div>`;
    msgBox.scrollTop = msgBox.scrollHeight;
  } catch (err) {
    msgBox.innerHTML += `<div class="msg-bot"><b>🤖 Dobby:</b> حصل خطأ في الاتصال بالسيرفر</div>`;
  }
}
