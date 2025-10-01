import express from "express";
import { askDobby } from "../services/fireworks.js";
import { searchPlaces } from "../services/foursquare.js";
import { getRoute } from "../services/geoapify.js";

const router = express.Router();

router.post("/query", async (req, res) => {
  const { question, location } = req.body;

  try {
    // 🧠 نسأل Dobby AI
    const dobbyReply = await askDobby(question);

    // 🔎 نضيف بيانات حقيقية لو السؤال فيه مطاعم / كافيه / طريق
    let data = null;

    if (question.includes("مطعم") || question.includes("كافيه")) {
      data = await searchPlaces(question, location);
    } else if (question.includes("طريق") || question.includes("محطة")) {
      // مثال: destination ثابت (تقدر تخليه dynamic ب geocode)
      data = await getRoute(location, { lat: 30.0626, lon: 31.2497 });
    }

    res.json({
      answer: dobbyReply,
      sources: data
    });
  } catch (err) {
    console.error("❌ Error in /query:", err);
    res.status(500).json({ error: "Internal error" });
  }
});

export default router;
