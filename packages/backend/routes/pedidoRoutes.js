import express from "express";

export function createPedidoRouter(pedidoController) {
  const router = express.Router();

  // POST /pedidos
  router.post("/", pedidoController.crearPedido);
  // GET /pedidos
  router.get("/", pedidoController.listarPedidos);
  // DELETE /pedidos/:id
  router.delete("/:pedidoId", pedidoController.cancelarPedido);
  // GET /pedidos/usuario/:usuarioId
  //router.get("/usuario/:usuarioId", pedidoController.historialPedidosUsuario);
  // PATCH /pedidos/:id/enviado
  router.patch("/:pedidoId/enviado", pedidoController.marcarPedidoEnviado);

  return router;
}
