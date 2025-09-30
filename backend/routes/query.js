import express from "express";
import { searchPlaces } from "../services/foursquare.js";
import { getRoute, geocode } from "../services/geoapify.js";
import { parseQuestion } from "../utils/parser.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, location } = req.body;
    if (!question || !location) {
      return res.status(400).json({ error: "❌ Missing question or location" });
    }

    // 1) تحليل السؤال
    const intent = parseQuestion(question);

    let response;
    if (intent === "places") {
      // استدعاء Foursquare
      response = await searchPlaces(location.lat, location.lon, question);
    } else if (intent === "routing") {
      // نحتاج "to" من السؤال (مبدئياً نحول اسم لمكان)
      const to = await geocode(question);
      response = await getRoute(location, to);
    } else {
      response = { message: "🤖 مش قادر أحدد نوع السؤال حالياً" };
    }

    res.json({ intent, response });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "❌ Internal server error" });
  }
});

export default router;
