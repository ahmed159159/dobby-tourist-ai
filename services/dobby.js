import axios from "axios";
import { searchPlaces } from "./foursquare.js";

const DOBBY_API_KEY = process.env.DOBBY_API_KEY;

// 🧠 Dobby يفكر ويقرر
export async function askDobby(query, lat, lon) {
  // أول خطوة: نطلب من Dobby نفسه يحدد هل محتاج API إضافي؟
  const tagRes = await axios.post(
    "https://api.fireworks.ai/inference/v1/chat/completions",
    {
      model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
      messages: [
        { role: "system", content: "You are Dobby, a wild travel assistant AI. When asked about places, food, hotels, cafes etc, you should output a simple tag like 'places', 'food', 'hotel' or 'general'." },
        { role: "user", content: query }
      ],
      max_tokens: 10
    },
    {
      headers: {
        Authorization: `Bearer ${DOBBY_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const tag = tagRes.data.choices[0].message.content.trim().toLowerCase();

  let extraData = "";
  if (["places", "food", "hotel"].includes(tag) && lat && lon) {
    const results = await searchPlaces(query, lat, lon);
    if (results.length) {
      extraData = "Here are some nearby options:\n" + results.map(r => `- ${r.name} (${r.category}) — ${r.address}`).join("\n");
    }
  }

  // دلوقتي ندي Dobby السياق + أي داتا إضافية
  const chatRes = await axios.post(
    "https://api.fireworks.ai/inference/v1/chat/completions",
    {
      model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
      messages: [
        { role: "system", content: "You are Dobby, a chaotic but helpful travel guide." },
        { role: "user", content: query + (extraData ? `\n\nExtra info:\n${extraData}` : "") }
      ],
      max_tokens: 300
    },
    {
      headers: {
        Authorization: `Bearer ${DOBBY_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return chatRes.data.choices[0].message.content;
}
