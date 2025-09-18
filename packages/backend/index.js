import "dotenv/config";
import express from "express";
import cors from "cors";
import pedidoRoutes from "./routes/pedidoRoutes.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

/*
app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date()
  });
});*/

app.use("/pedidos", pedidoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});
