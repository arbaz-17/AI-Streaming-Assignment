import "dotenv/config";
import express from "express";
import cors from "cors";

import generateRouter from "./routes/generate.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", generateRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});