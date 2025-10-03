import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// 🧠 endpoint: يبعث السؤال لـ Dobby
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

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

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Foursquare API endpoint
app.get("/api/places", async (req, res) => {
  try {
    const { query, lat, lon } = req.query;

    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat},${lon}&limit=5`,
      {
        headers: {
          Authorization: process.env.FOURSQUARE_API_KEY,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Foursquare error" });
  }
});

// ✅ Geoapify API endpoint
app.get("/api/route", async (req, res) => {
  try {
    const { start, end } = req.query;

    const response = await fetch(
      `https://api.geoapify.com/v1/routing?waypoints=${start}|${end}&mode=drive&apiKey=${process.env.GEOAPIFY_KEY}`
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Geoapify error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
