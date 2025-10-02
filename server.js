import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { askDobby } from "./services/dobby.js";
import { searchPlaces } from "./services/foursquare.js";
import { getMap } from "./services/geoapify.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// نقطة API رئيسية
app.post("/api/chat", async (req, res) => {
  try {
    const { message, location } = req.body;

    let response;

    // لو المستخدم سأل عن أكل/كافيه/مطاعم → Foursquare
    if (/restaurant|food|cafe|hotel|bar|place/i.test(message)) {
      response = await searchPlaces(message, location);
    }
    // لو سأل عن خريطة أو اتجاهات → Geoapify
    else if (/map|directions|route|navigate/i.test(message)) {
      response = await getMap(message, location);
    }
    // غير كده → Dobby AI
    else {
      response = await askDobby(message);
    }

    res.json({ reply: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "❌ Error processing your request." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
