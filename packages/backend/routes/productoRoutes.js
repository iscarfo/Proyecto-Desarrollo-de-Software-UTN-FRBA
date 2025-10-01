import express from 'express'

const pathProducto = "/producto"

//TODO FILTROS QUERY PARAM

export function createProductoRouter(productoController) {
    const router = express.Router()

    // POST /productos
    router.post("/", (req, res) => productoController.crearProducto(req, res));

    // GET /productos
    router.get("/", (req, res) => productoController.listarProductos(req, res));

    // GET /productos/vendedor/:idVendedor (filtros con query params)
    router.get("/vendedor/:vendedorId", (req, res) => productoController.buscarProductoPorVendedor(req, res));

    // PUT /productos
     router.put("/:id", (req, res) => productoController.actualizarProducto(req, res));

    // DELETE /productos/:id
    router.delete("/:id", (req, res) => productoController.eliminarProducto(req, res));

    return router
}