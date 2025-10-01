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

// إعداد المسار علشان نقدر نستخدم __dirname في ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ تقديم ملفات frontend
app.use(express.static(path.join(__dirname, "frontend")));

// 🧩 API Endpoint
app.post("/api/query", async (req, res) => {
  const { message, lat, lon } = req.body;

  try {
    // مثال بسيط: لو السؤال فيه "مطعم" → استخدم Foursquare
    if (message.includes("مطعم") || message.toLowerCase().includes("restaurant")) {
      const places = await searchPlaces("restaurant", lat, lon);
      return res.json({ reply: `دول أقرب مطاعم: ${places}` });
    }

    // مثال: لو السؤال فيه "طريق" أو "اتجاه"
    if (message.includes("طريق") || message.toLowerCase().includes("route")) {
      const route = await getRoute(lat, lon, 50.45, 30.52); // (مكان افتراضي مؤقت)
      return res.json({ reply: `ده الطريق: ${route}` });
    }

    // غير كده → رجّع رد AI
    const reply = await askDobby(message);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "❌ حصل خطأ في السيرفر." });
  }
});

// ✅ أي طلب غير API → رجّع index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🧙‍♂️ Dobby is alive 👋 on port ${PORT}`));
