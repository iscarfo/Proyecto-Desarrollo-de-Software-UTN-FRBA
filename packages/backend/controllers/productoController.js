export class ProductoController {
  constructor(productoService) {
    this.productoService = productoService;
  }

  // POST: Crear producto
  async crearProducto(req, res) {
    try {
      const { usuarioId, ...productoData } = req.body;
      const productoCreado = await this.productoService.crearProducto(productoData, usuarioId);

      if (!productoCreado) {
        return res.status(204).send();
      }
      res.status(201).json(productoCreado);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET: todos los productos paginados
  async listarProductos(req, res) {
    try {
      const { page = 1, limit = 10, nombre, descripcion, categoria, precioMin, precioMax, sort } = req.query;
      
      const filtros = {
        nombre,
        descripcion,
        categoria,
        precioMin: precioMin ? Number(precioMin) : undefined,
        precioMax: precioMax ? Number(precioMax) : undefined
      };
      
      const productosPaginados = await this.productoService.listarProductos(page, limit, filtros, sort);

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
      const { page = 1, limit = 10, nombre, descripcion, categoria, precioMin, precioMax, sort } = req.query;
      const { vendedorId } = req.params;

      const filtros = {
        nombre,
        descripcion,
        categoria,
        precioMin: precioMin ? Number(precioMin) : undefined,
        precioMax: precioMax ? Number(precioMax) : undefined
      };

      const productosPaginados = await this.productoService.buscarProductosVendedor(page, limit, filtros, sort, vendedorId);

      if (!productosPaginados || productosPaginados.length === 0) {
        return res.status(204).send();
      }
      res.status(200).json(productosPaginados);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // PUT: Actualizar producto
  async actualizarProducto(req, res) {
    try {
      const { id } = req.params;
      const datos = req.body;

      const productoActualizado = await this.productoService.actualizarProducto(id, datos);

      if (!productoActualizado) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      res.status(200).json(productoActualizado);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

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
