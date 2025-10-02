const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let messages = []; // full conversation
let userLocation = { lat: null, lon: null };

// Get location from browser
navigator.geolocation.getCurrentPosition(
  (pos) => {
    userLocation.lat = pos.coords.latitude;
    userLocation.lon = pos.coords.longitude;
    console.log("User location:", userLocation);
  },
  () => {
    console.warn("Could not get location");
  }
);

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage("user", text);
  userInput.value = "";

  messages.push({ role: "user", content: text });

  try {
    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        lat: userLocation.lat,
        lon: userLocation.lon,
      }),
    });

    const data = await res.json();
    addMessage("bot", data.reply);

    messages.push({ role: "assistant", content: data.reply });
  } catch (err) {
    console.error("Error:", err);
    addMessage("bot", "❌ Server error, please try again.");
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// First welcome message
addMessage("bot", "Welcome! I’m Dobby 🧙‍♂️, your travel assistant. Ask me anything!");
