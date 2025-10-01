import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { askDobby } from "./services/dobby.js";
import { searchNearby } from "./services/foursquare.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// إعداد المسار للـ frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "frontend")));

// 🧩 API Endpoint
app.post("/api/query", async (req, res) => {
  const { messages, lat, lon } = req.body;

  try {
    const userMsg = messages[messages.length - 1].content.toLowerCase();

    let reply;

    // 🛰️ لو فيه إحداثيات والسؤال فيه near/restaurant → نستخدم Foursquare
    if (lat && lon && (userMsg.includes("near") || userMsg.includes("restaurant"))) {
      reply = await searchNearby(lat, lon, "restaurant");
    } else {
      // غير كده → نستعمل Dobby AI
      reply = await askDobby(messages);
    }

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error in /api/query:", error.message);
    res.status(500).json({ reply: "❌ حصل خطأ في السيرفر." });
  }
});

// ✅ أي طلب غير API → يفتح صفحة الشات
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🧙‍♂️ Dobby is alive 👋 on port ${PORT}`));
