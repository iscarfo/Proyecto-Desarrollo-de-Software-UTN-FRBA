import express from "express";

export function createPedidoRouter(pedidoController) {
  const router = express.Router();

  // POST /pedidos
  router.post("/", pedidoController.crearPedido);
  // GET /pedidos
  router.get("/", pedidoController.listarPedidos);
  // PATCH /pedidos/:id/cancelar
  router.patch("/:pedidoId/cancelar", pedidoController.cancelarPedido);
  // GET /pedidos/usuario/:usuarioId
  router.get("/usuario/:usuarioId", pedidoController.historialPedidosUsuario);
  // PATCH /pedidos/:id/enviar
  router.patch("/:pedidoId/enviar", pedidoController.marcarPedidoEnviado);

  return router;
}
