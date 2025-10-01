import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { askDobby } from "./services/dobby.js";

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
    // نبعت المحادثة كاملة لـ Dobby
    const reply = await askDobby(messages);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "❌ حصل خطأ في السيرفر." });
  }
});

// ✅ أي طلب غير API → يفتح صفحة الشات
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🧙‍♂️ Dobby is alive 👋 on port ${PORT}`));
