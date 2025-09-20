import "dotenv/config";
import express from "express";
import cors from "cors";
import { createPedidoRouter } from "./routes/pedidoRoutes.js";
import { PedidoRepository } from "./repositories/pedidoRepository.js";
import { PedidoService } from "./services/pedidoService.js";
import { PedidoController } from "./controllers/pedidoController.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

// Instancias compartidas
const pedidoRepository = new PedidoRepository();
const pedidoService = new PedidoService(pedidoRepository);
const pedidoController = new PedidoController(pedidoService);

// Usar router con controller inyectado
app.use("/pedidos", createPedidoRouter(pedidoController));

const swaggerDocument = YAML.load(path.join(__dirname, "docs", "api-docs.yaml"));

// Servir Swagger UI en /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});
