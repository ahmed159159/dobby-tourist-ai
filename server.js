// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { askDobby } from "./services/dobby.js";
import { searchPlaces } from "./services/foursquare.js";
import { getRoute } from "./services/geoapify.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🧩 API Endpoint
app.post("/api/query", async (req, res) => {
  const { messages, lat, lon } = req.body;

  try {
    let reply = await askDobby(messages);

    // 🔎 Look for hidden tag [API:...]
    const apiMatch = reply.match(/\[API:(.*?)\]/);
    if (apiMatch) {
      const command = apiMatch[1];
      let apiResult = "";

      if (command.startsWith("FOURSQUARE")) {
        const params = new URLSearchParams(command.split("?")[1]);
        const query = params.get("query");
        const places = await searchPlaces(query, lat, lon);

        apiResult =
          places.length > 0
            ? places.map((p) => `📍 ${p.name} - ${p.address}`).join("\n")
            : "No results found nearby 😢";
      } else if (command.startsWith("GEOAPIFY")) {
        const params = new URLSearchParams(command.split("?")[1]);
        const to = params.get("to");
        apiResult = await getRoute(lat, lon, to);
      }

      // 🧹 Clean hidden tag + add API results
      reply = reply.replace(/\[API:.*?\]/, "") + "\n\n" + apiResult;
    }

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "❌ Server error." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🧙‍♂️ Dobby is alive 👋 on port ${PORT}`)
);
