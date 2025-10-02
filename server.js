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

// إعداد المسار للـ frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend")));

// 🧩 API Endpoint
app.post("/api/query", async (req, res) => {
  const { messages, lat, lon } = req.body;

  try {
    // ⬅️ ننده Dobby
    const dobbyReply = await askDobby(messages);

    // لو Dobby طلب Foursquare
    if (dobbyReply.includes("[API:FOURSQUARE]")) {
      const places = await searchPlaces("restaurant", lat, lon);
      const list = places.map(p => `🍴 ${p.name} - ${p.address}`).join("\n");
      return res.json({ reply: dobbyReply.replace("[API:FOURSQUARE]", list) });
    }

    // لو Dobby طلب Geoapify (routing)
    if (dobbyReply.includes("[API:GEOAPIFY]")) {
      const route = await getRoute(lat, lon, 29.9773, 31.1325); // مثال: الأهرامات
      return res.json({ reply: dobbyReply.replace("[API:GEOAPIFY]", route) });
    }

    // الرد العادي
    res.json({ reply: dobbyReply });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ reply: "⚠️ حصل خطأ في السيرفر." });
  }
});

// ✅ أي طلب غير API → يفتح صفحة الشات
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🧙‍♂️ Dobby is alive 👋 on port ${PORT}`));
