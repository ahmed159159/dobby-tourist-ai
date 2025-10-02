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

// ✅ Serve frontend folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "frontend")));

// 🧩 API Endpoint
app.post("/api/query", async (req, res) => {
  const { messages, lat, lon } = req.body;

  try {
    let reply = await askDobby(messages);

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

      reply = reply.replace(/\[API:.*?\]/, "") + "\n\n" + apiResult;
    }

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "❌ Server error." });
  }
});

// ✅ Any non-API route should serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🧙‍♂️ Dobby is alive 👋 on port ${PORT}`)
);
