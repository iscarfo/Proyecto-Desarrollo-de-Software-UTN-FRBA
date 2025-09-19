import express from "express";
import { PedidoController } from "../controllers/pedidoController.js";

const router = express.Router();
const pedidoController = new PedidoController();

router.post("/", pedidoController.crearPedido);
router.get("/", pedidoController.listarPedidos);
router.post("/:id/cancelar", pedidoController.cancelarPedido);
router.get("/usuario/:usuarioId", pedidoController.historialPedidosUsuario);
router.patch("/:id/enviar", pedidoController.marcarPedidoEnviado);

export default router;