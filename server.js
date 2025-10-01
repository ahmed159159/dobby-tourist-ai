import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { searchPlaces } from "./services/foursquare.js";
import { getRoute } from "./services/geoapify.js";
import { askDobby } from "./services/dobby.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ Route رئيسي للتجربة
app.get("/", (req, res) => {
  res.send("🧙‍♂️ Dobby is alive 👋 - Backend is running!");
});

// ✅ API رئيسي للتعامل مع Dobby والـ APIs
app.post("/api/query", async (req, res) => {
  const { message, lat, lon } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // 1️⃣ نخلي Dobby يحلل السؤال
    const aiResponse = await askDobby(message);

    let data = null;

    // 2️⃣ لو السؤال فيه "مطعم" أو "كافيه" → نجيب من Foursquare
    if (/مطعم|restaurant|كافيه|cafe/i.test(message)) {
      data = await searchPlaces("restaurant", lat, lon);
    }

    // 3️⃣ لو السؤال فيه "طريق" أو "اتجاه" → نجيب من Geoapify
    else if (/طريق|اتجاه|route/i.test(message)) {
      if (lat && lon) {
        // ✨ كمثال: نخلي الاتجاه من موقع المستخدم لميدان التحرير (القاهرة)
        data = await getRoute(lat, lon, 30.0444, 31.2357);
      } else {
        data = "⚠️ لازم تبعت إحداثيات علشان أجيبلك الطريق.";
      }
    }

    res.json({
      ai: aiResponse,
      data: data || []
    });
  } catch (err) {
    console.error("❌ Query error:", err.message);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
