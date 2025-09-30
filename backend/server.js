import express from "express";
import dotenv from "dotenv";
import queryRoutes from "./routes/query.js";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/query", queryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Dobby server running on port ${PORT}`);
});
