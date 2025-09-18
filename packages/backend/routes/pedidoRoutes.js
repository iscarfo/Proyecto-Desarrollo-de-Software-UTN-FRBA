import express from "express";
import { PedidoController } from "../controllers/pedidoController.js";

const router = express.Router();
const pedidoController = new PedidoController();

// POST /pedidos  --> crear un nuevo pedido
router.post("/", pedidoController.crearPedido);

// GET /pedidos   --> listar todos los pedidos
router.get("/", pedidoController.listarPedidos);

// POST /pedidos/:id/cancelar  --> cancelar un pedido existente
router.post("/:id/cancelar", pedidoController.cancelarPedido);

export default router;