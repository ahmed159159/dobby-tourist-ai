// services/dobby.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Ask Dobby (AI travel assistant) a question.
 * @param {Array} messages - Chat history in OpenAI format [{role, content}, ...]
 * @returns {string} AI reply
 */
export async function askDobby(messages) {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // lightweight GPT model
      messages: [
        {
          role: "system",
          content: `You are Dobby 🧙‍♂️, a helpful travel assistant.
          Your job:
          - Answer user travel-related questions (restaurants, cafes, hotels, attractions, navigation).
          - If external data is needed, generate a hidden API tag like:
            [API:FOURSQUARE?query=restaurant]
            [API:FOURSQUARE?query=cafe]
            [API:GEOAPIFY?to=Eiffel Tower]
          - Keep responses friendly, short, and clear.`,
        },
        ...messages,
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("❌ OpenAI API error:", err.response?.data || err.message);
    return "❌ Dobby had an error while thinking.";
  }
}
