// services/dobby.js
import axios from "axios";

const DOBBY_API_KEY = process.env.DOBBY_API_KEY;

export async function askDobby(message) {
  try {
    const res = await axios.post(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
        messages: [{ role: "user", content: message }],
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
    console.error("Dobby AI error:", err.response?.data || err.message);
    return "Sorry, Dobby could not answer this time.";
  }
}
