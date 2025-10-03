import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// مفاتيح API
const DOBBY_API_KEY = process.env.DOBBY_API_KEY;
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

// ✅ API: استفسار من Dobby + Foursquare
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  try {
    // 1. تحليل السؤال عن طريق Dobby
    const dobbyRes = await fetch(
      "https://api.fireworks.ai/inference/v1/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DOBBY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sentientfoundation/dobby-unhinged-llama-3-3-70b-new",
          prompt: question,
          max_tokens: 200,
        }),
      }
    );
    const dobbyData = await dobbyRes.json();
    const answer = dobbyData.choices?.[0]?.text || "لم يتم العثور على إجابة";

    // 2. البحث عن أماكن من Foursquare
    const fsqRes = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(
        question
      )}&near=Cairo,EG&limit=5`,
      {
        headers: { Authorization: FOURSQUARE_API_KEY },
      }
    );
    const fsqData = await fsqRes.json();
    const places = fsqData.results || [];

    // 3. الإرجاع للـ frontend
    res.json({
      answer,
      places: places.map((p) => ({
        name: p.name,
        location: p.location,
        geocodes: p.geocodes,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "حصل خطأ في الخادم" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend شغال!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
