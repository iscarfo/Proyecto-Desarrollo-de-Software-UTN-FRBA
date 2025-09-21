export class ProductoController {
  constructor(productoService) {
    this.productoService = productoService;
  }

  // POST: Crear producto
  async crearProducto(req, res) {
    try {
      const productoData = req.body;

      // Llamamos al servicio para crear el producto.
      // "await" espera a que la promesa se resuelva.
      const productoCreado = await this.productoService.crearProducto(productoData);

      if (!productoCreado) {
        return res.status(204).send();
      }
      res.status(201).json(productoCreado);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET: todos los productos paginados + filtros
  async listarProductos(req, res) {
    try {
      const { page = 1, limit = 10, ...filtros } = req.query;
      const productosPaginados = await this.productoService.listarProductos(page, limit, filtros);

      if (!productosPaginados || productosPaginados.length === 0) {
        return res.status(204).send();
      }
      res.status(200).json(productosPaginados);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET: productos de un vendedor paginados + filtros
  async buscarProductoPorVendedor(req, res) {
    try {
      const { page = 1, limit = 10, vendedorId, ...filtros } = req.query;
      const productosPaginados = await this.productoService.buscarProductosVendedor(
        page,
        limit,
        filtros,
        vendedorId
      );

      if (!productosPaginados || productosPaginados.length === 0) {
        return res.status(204).send();
      }
      res.status(200).json(productosPaginados);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // PUT: Actualizar producto

  //DELETE producto by Id
  async eliminarProducto(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await this.productoService.eliminarProducto(id);

      if (!eliminado) return res.status(404).json({ message: "Producto no encontrado" });

      res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

}
