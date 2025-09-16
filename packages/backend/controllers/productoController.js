export class ProductoController {
  constructor(productoService) {
    this.productoService = productoService;
  }

  // GET: todos los productos paginados + filtros
  async buscarTodos(req, res) {
    try {
      const { page = 1, limit = 10, ...filtros } = req.query;
      const productosPaginados = await this.productoService.buscarTodos(page, limit, filtros);

      if (!productosPaginados || productosPaginados.length === 0) {
        return res.status(204).send();
      }
      res.status(200).json(productosPaginados);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET: productos de un vendedor paginados + filtros
  async buscarPorVendedor(req, res) {
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
}
