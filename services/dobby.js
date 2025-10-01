import axios from "axios";

const DOBBY_API_KEY = process.env.DOBBY_API_KEY;

// دالة تسأل Dobby AI
export async function askDobby(message) {
  try {
    const response = await axios.post(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new", // موديل Dobby
        messages: [
          {
            role: "system",
            content: "You are Dobby, a helpful AI for tourists.",
          },
          {
            role: "user",
            content: message,
          },
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

    // بيرجع نص الرد من Dobby
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ Error in askDobby:", error.response?.data || error.message);
    return "Sorry, Dobby could not answer right now 😔";
  }
}
