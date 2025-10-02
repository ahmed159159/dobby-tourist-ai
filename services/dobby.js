import axios from "axios";

const DOBBY_API_KEY = process.env.DOBBY_API_KEY;

export async function askDobby(messages) {
  try {
    const response = await axios.post(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
        messages: [
          {
            role: "system",
            content: `You are Dobby, a funny but smart AI travel assistant.
- If the user asks for nearby places (restaurants, cafes, hotels, metro...), reply with "[API:FOURSQUARE]" inside your message.
- If the user asks for directions or routes, reply with "[API:GEOAPIFY]".
- Otherwise just answer normally.
⚠️ Important: Always include the tag [API:FOURSQUARE] or [API:GEOAPIFY] exactly if extra info is needed, I will replace it with real API results.`,
          },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${DOBBY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error in askDobby:", error.response?.data || error.message);
    return "Sorry, Dobby could not answer right now 😔";
  }
}
