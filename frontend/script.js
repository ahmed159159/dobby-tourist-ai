const messagesDiv = document.getElementById("messages");
const input = document.getElementById("input");

let conversation = [];

// نجيب إحداثيات المستخدم
let userLat = null;
let userLon = null;
navigator.geolocation.getCurrentPosition(
  (pos) => {
    userLat = pos.coords.latitude;
    userLon = pos.coords.longitude;
    console.log("✅ Location detected:", userLat, userLon);
  },
  () => {
    console.log("⚠️ Location not available");
  }
);

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerText = (role === "user" ? "👤 " : "🤖 ") + text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";

    conversation.push({ role: "user", content: text });

    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversation,
        lat: userLat,
        lon: userLon,
      }),
    });

    const data = await res.json();
    addMessage("bot", data.reply);
    conversation.push({ role: "assistant", content: data.reply });
  }
});
