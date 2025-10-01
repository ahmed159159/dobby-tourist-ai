import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Dobby is alive 👋");
});

// Example API endpoint (لسه تجريبي)
app.post("/api/query", (req, res) => {
  const userMessage = req.body.message || "No message";
  res.json({
    reply: `You said: ${userMessage}. Dobby will soon connect to APIs 🤖`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Dobby backend running on port ${PORT}`);
});
