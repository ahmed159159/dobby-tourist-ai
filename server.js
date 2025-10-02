import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { askDobby } from "./services/dobby.js"; // استدعاء دابي من Fireworks

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// إعداد المسار للـ frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "frontend")));

// 🧩 API Endpoint لاستقبال المحادثة
app.post("/api/query", async (req, res) => {
  const { messages, lat, lon } = req.body;

  try {
    // نبعت المحادثة كاملة لـ Dobby
    const reply = await askDobby(messages, lat, lon);
    res.json({ reply });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "❌ Dobby had a server error." });
  }
});

// ✅ أي طلب غير API → يفتح صفحة الشات
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// بدء السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🧙‍♂️ Dobby is alive 👋 running on port ${PORT}`)
);
