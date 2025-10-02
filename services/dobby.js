import axios from "axios";

const DOBBY_API_KEY = process.env.DOBBY_API_KEY;

export async function askDobby(messages) {
  try {
    const res = await axios.post(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
        messages: [
          {
            role: "system",
            content: `You are Dobby, a fun and smart travel assistant.
- If user asks for nearby places (restaurants, cafes, hotels, attractions...), respond with "[API:FOURSQUARE]".
- If user asks for directions or routes, respond with "[API:GEOAPIFY]".
- Otherwise, just answer normally.
Always keep a friendly tone.`,
          },
          ...messages,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${DOBBY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("Dobby API error:", err.response?.data || err.message);
    return "⚠️ حصل خطأ أثناء التواصل مع Dobby.";
  }
}
