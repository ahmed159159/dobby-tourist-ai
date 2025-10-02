import axios from "axios";

export async function askDobby(message) {
  const response = await axios.post(
    "https://api.fireworks.ai/inference/v1/chat/completions",
    {
      model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
      messages: [{ role: "user", content: message }],
      max_tokens: 150
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.DOBBY_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;
}
