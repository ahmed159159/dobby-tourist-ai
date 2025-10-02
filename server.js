import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { askDobby } from "./services/dobby.js";
import { searchPlaces } from "./services/foursquare.js";
import { getMap } from "./services/geoapify.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve frontend (production build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "frontend/dist")));

// نقطة API رئيسية
app.post("/api/chat", async (req, res) => {
  try {
    const { message, location } = req.body;

    let response;

    if (/restaurant|food|cafe|hotel|bar|place/i.test(message)) {
      response = await searchPlaces(message, location);
    } else if (/map|directions|route|navigate/i.test(message)) {
      response = await getMap(message, location);
    } else {
      response = await askDobby(message);
    }

    res.json({ reply: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "❌ Error processing your request." });
  }
});

// ✅ fallback for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
