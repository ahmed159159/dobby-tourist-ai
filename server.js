import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { askDobby } from "./services/dobby.js";
import { searchPlaces } from "./services/foursquare.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ static frontend
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// API endpoint
app.post("/chat", async (req, res) => {
  const { query, lat, lon } = req.body;

  try {
    const reply = await askDobby(query, lat, lon);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "❌ Dobby had an error while thinking." });
  }
});

// catch-all
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🧙‍♂️ Dobby server running at http://localhost:${PORT}`)
);
