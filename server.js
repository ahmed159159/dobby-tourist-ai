import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const FIREWORKS_API_KEY = process.env.DOBBY_API_KEY; // Fireworks Dobby
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

// 🎯 Step 1: Ask Dobby to classify the query
async function classifyQuery(query) {
  const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${FIREWORKS_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
      messages: [
        { role: "system", content: "You are a smart classifier. For the given user query, respond ONLY with one tag: general, places, directions, or hotel." },
        { role: "user", content: query }
      ],
      max_tokens: 5
    })
  });
  const data = await response.json();
  return data.choices[0].message.content.trim().toLowerCase();
}

// 🎯 Step 2: If places → call Foursquare
async function searchPlaces(query, location = "30.0444,31.2357") { // default Cairo center
  const response = await fetch(`https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}&ll=${location}&limit=5`, {
    headers: { "Authorization": FOURSQUARE_API_KEY }
  });
  const data = await response.json();
  return data.results?.map(p => `${p.name} - ${p.location.address}`).join("\n") || "No places found.";
}

// 🎯 Step 3: If directions → call Geoapify
async function getDirections(from, to) {
  const response = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${encodeURIComponent(from)}|${encodeURIComponent(to)}&mode=drive&apiKey=${GEOAPIFY_KEY}`);
  const data = await response.json();
  if (data.features && data.features.length > 0) {
    const steps = data.features[0].properties.legs[0].steps.map(s => s.instruction.text);
    return steps.join(" ➡ ");
  }
  return "No route found.";
}

// 🎯 Step 4: General → let Dobby answer
async function askDobby(query) {
  const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${FIREWORKS_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
      messages: [
        { role: "system", content: "You are Dobby, the travel assistant. Be witty, fun, but also helpful." },
        { role: "user", content: query }
      ],
      max_tokens: 200
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

// 🎯 API Route
app.post("/chat", async (req, res) => {
  try {
    const userQuery = req.body.query;
    const tag = await classifyQuery(userQuery);

    let answer;
    if (tag.includes("places")) {
      answer = await searchPlaces(userQuery);
    } else if (tag.includes("directions")) {
      // naive split: "from X to Y"
      const parts = userQuery.split(" to ");
      if (parts.length === 2) {
        answer = await getDirections(parts[0].replace("from", "").trim(), parts[1].trim());
      } else {
        answer = "Please ask directions like: 'How to go from A to B'";
      }
    } else {
      answer = await askDobby(userQuery);
    }

    res.json({ reply: answer, tag });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Dobby had an error while thinking 🤯" });
  }
});

app.listen(3000, () => console.log("🚀 Dobby backend running on http://localhost:3000"));
