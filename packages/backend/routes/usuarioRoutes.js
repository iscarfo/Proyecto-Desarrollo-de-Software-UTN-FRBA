import express from 'express'

const pathUsuario = "/usuarios"

//TODO FILTROS QUERY PARAM

export function createUsuarioRouter(productoController, pedidoController, notificacionesController) {
    const router = express.Router()

    // GET /usuarios/vendedor/:idVendedor/productos (filtros con query params)
    router.get("/vendedor/:vendedorId/productos", (req, res) => productoController.buscarProductoPorVendedor(req, res));

    // GET /usuarios/comprador/:usuarioId/pedidos
    router.get("/comprador/:usuarioId/pedidos", pedidoController.historialPedidosUsuario);

    // GET /usuarios/:usuarioId/notificaciones/unread
    router.get("/:usuarioId/notificaciones/unread", notificacionesController.obtenerNotificacionesNoLeidas);

    // GET /usuarios/:usuarioId/notificaciones/read
    router.get("/:usuarioId/notificaciones/read", notificacionesController.obtenerNotificacionesLeidas);

    return router
}