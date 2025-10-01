import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import queryRoutes from "./routes/query.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", queryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Dobby AI backend running on port ${PORT}`);
});
