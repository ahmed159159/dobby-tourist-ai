import fetch from "node-fetch";

export async function askDobby(question) {
  const response = await fetch(
    "https://api.fireworks.ai/inference/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DOBBY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
        messages: [{ role: "user", content: question }],
      }),
    }
  );

  return await response.json();
}
