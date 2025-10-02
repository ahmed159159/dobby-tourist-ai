// services/dobby.js
import axios from "axios";

const DOBBY_API_KEY = process.env.DOBBY_API_KEY;

// Fireworks AI endpoint
const FIREWORKS_URL = "https://api.fireworks.ai/inference/v1/chat/completions";

export async function askDobby(messages) {
  try {
    const response = await axios.post(
      FIREWORKS_URL,
      {
        model: "accounts/fireworks/models/sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
        messages: messages, // المحادثة كاملة
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": `Bearer ${DOBBY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // ناخد رد Dobby
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("🔥 Dobby API error:", err.response?.data || err.message);
    return "❌ Dobby had an error while thinking.";
  }
}
