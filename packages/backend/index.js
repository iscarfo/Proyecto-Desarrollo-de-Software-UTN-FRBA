import "dotenv/config";
import express from "express";
import cors from "cors";
import { createPedidoRouter } from "./routes/pedidoRoutes.js";
import { PedidoRepository } from "./repositories/pedidoRepository.js";
import { PedidoService } from "./services/pedidoService.js";
import { PedidoController } from "./controllers/pedidoController.js";
import {ProductoRepositoryMemoria} from "./repositories/productoRepository.js";
import { createProductoRouter } from "./routes/productoRoutes.js";
import {ProductoService} from "./services/productoService.js";
import { createNotificacionesRouter } from "./routes/notificacionesRoutes.js";
import { NotificacionesRepository } from "./repositories/notificacionesRepository.js";
import { NotificacionesService } from "./services/notificacionesService.js";
import { NotificacionesController } from "./controllers/notificacionesController.js";
import { connectDB } from "./config/database.js";
import { initTestData } from "./config/testData.js"; // TODO: REMOVER EN PRODUCCIÓN
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import { ProductoController } from "./controllers/productoController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  }),
);

// Conectar a MongoDB
await connectDB();

// TODO: REMOVER EN PRODUCCIÓN - Inicializar datos de prueba
await initTestData();

// Health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Instancias compartidas
const pedidoRepository = new PedidoRepository();
const productoRepository = new ProductoRepositoryMemoria();

const pedidoService = new PedidoService(pedidoRepository, productoRepository);
const pedidoController = new PedidoController(pedidoService);

//const productoRepository = new ProductoRepositoryMemoria();
const productoService = new ProductoService(productoRepository);
const productoController = new ProductoController(productoService);

const notificacionesRepository = new NotificacionesRepository();
const notificacionesService = new NotificacionesService(notificacionesRepository);
const notificacionesController = new NotificacionesController(notificacionesService);

// Usar router con controller inyectado
app.use("/pedidos", createPedidoRouter(pedidoController));
app.use("/productos", createProductoRouter(productoController));
app.use("/notificaciones", createNotificacionesRouter(notificacionesController));

const swaggerDocument = YAML.load(path.join(__dirname, "docs", "api-docs.yaml"));

// Configurar el servidor dinámicamente basado en el host y puerto
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
swaggerDocument.servers = [
  {
    url: `http://${HOST}:${PORT}`,
    description: 'Servidor de la aplicación'
  }
];

// Configuración de Swagger UI con opciones para evitar CORS
const swaggerOptions = {
  swaggerOptions: {
    requestInterceptor: (request) => {
      request.headers['Access-Control-Allow-Origin'] = '*';
      return request;
    },
    responseInterceptor: (response) => {
      return response;
    }
  }
};

// Servir Swagger UI en /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});
