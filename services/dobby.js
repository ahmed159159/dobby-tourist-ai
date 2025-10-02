// services/dobby.js
import axios from "axios";

const API_KEY = process.env.DOBBY_API_KEY;

export async function askDobby(messages, lat, lon) {
  try {
    // Inject user location into system prompt if available
    let systemMessage = {
      role: "system",
      content: "You are Dobby, a helpful travel assistant. Provide tourism info like restaurants, hotels, cafes, attractions. If user location is provided, use it.",
    };

    if (lat && lon) {
      systemMessage.content += ` The user's approximate location is: lat=${lat}, lon=${lon}.`;
    }

    const res = await axios.post(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
        messages: [systemMessage, ...messages],
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("Dobby API error:", err.response?.data || err.message);
    return "❌ Dobby had an error while thinking.";
  }
}
