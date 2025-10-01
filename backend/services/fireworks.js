import axios from "axios";

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;

export async function askDobby(prompt) {
  try {
    const url = "https://api.fireworks.ai/inference/v1/completions";

    const response = await axios.post(
      url,
      {
        model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
        prompt: prompt,
        max_tokens: 400,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${FIREWORKS_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].text.trim();
  } catch (err) {
    console.error("❌ Fireworks error:", err.response?.data || err.message);
    return "⚠ حصل خطأ من Dobby AI.";
  }
}
