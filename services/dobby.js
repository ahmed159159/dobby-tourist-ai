// services/dobby.js
import axios from "axios";

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;

export async function askDobby(messages) {
  try {
    const res = await axios.post(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
        messages: [
          {
            role: "system",
            content: `
You are Dobby 🧙‍♂️, a friendly travel assistant AI. 
Rules:
1. Always respond in a helpful and fun tone.
2. If the user question requires external info (restaurants, cafes, hotels, attractions, routes, transport):
   - Add a hidden tag like [API:FOURSQUARE?query=restaurant] or [API:GEOAPIFY?to=pyramids of giza]
   - Do NOT explain the tag to the user. It’s hidden and for backend use only.
3. If no external info is required, just respond normally.
            `,
          },
          ...messages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${FIREWORKS_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("Dobby error:", err.response?.data || err.message);
    return "❌ Dobby had an error while thinking.";
  }
}
