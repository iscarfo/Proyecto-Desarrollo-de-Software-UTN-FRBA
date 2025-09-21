export class PedidoController {
  constructor(pedidoService) {
    this.pedidoService = pedidoService;
  }

  crearPedido = async (req, res) => {
    try {
      const { comprador, items, moneda, direccionEntrega } = req.body;
      const pedido = await this.pedidoService.crearPedido(comprador, items, moneda, direccionEntrega);
      res.status(201).json({
        message: "Pedido creado con éxito",
        pedido: pedido.toJSONResumen()
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  listarPedidos = async (req, res) => {
    try {
      const pedidos = await this.pedidoService.listarPedidos();
      res.json(pedidos.map(p => p.toJSONResumen()));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  cancelarPedido = async (req, res) => {
    try {
      const { id } = req.params;
      const comprador = req.body.comprador;
      const pedido = await this.pedidoService.cancelarPedido(id, comprador);
      res.json({
        message: "Pedido cancelado con éxito",
        pedido: pedido.toJSONResumen()
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

historialPedidosUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;
    const pedidos = await this.pedidoService.obtenerPedidosDeUsuario(usuarioId);

    const response = pedidos.map(pedido => ({
      id: pedido.getId(),
      comprador: {
        id: pedido.getComprador().getId(),
        nombre: pedido.getComprador().getNombre(),
        email: pedido.getComprador().getEmail(),
        telefono: pedido.getComprador().getTelefono(),
        tipoUsuario: pedido.getComprador().getTipoUsuario()
      },
      items: pedido.getItems().map(item => ({
        producto: {
          id: item.getProducto().getId(),
          titulo: item.getProducto().getTitulo()
        },
        cantidad: item.getCantidad(),
        precioUnitario: item.getPrecioUnitario()
      })),
      estado: pedido.getEstado(),
      direccionEntrega: {
        calle: pedido.getDireccionEntrega().getCalle(),
        altura: pedido.getDireccionEntrega().getAltura(),
        piso: pedido.getDireccionEntrega().getPiso(),
        departamento: pedido.getDireccionEntrega().getDepartamento(),
        codPostal: pedido.getDireccionEntrega().getCodPostal(),
        ciudad: pedido.getDireccionEntrega().getCiudad(),
        provincia: pedido.getDireccionEntrega().getProvincia(),
        pais: pedido.getDireccionEntrega().getPais()
      },
      fechaCreacion: pedido.getFechaCreacion(),
      total: pedido.calcularTotal()
    }));

    res.json(response);

  } catch (err) {
    console.error("Error en historialPedidosUsuario:", err.message);
    res.status(400).json({ error: err.message });
  }

};

  marcarPedidoEnviado = async (req, res) => {
    try {
      const pedidoId = req.params.id;
      const vendedor = req.body.vendedor; // { id, nombre, ... }
      const pedido = await this.pedidoService.marcarComoEnviado(pedidoId, vendedor);
      res.json({
        message: "Pedido marcado como enviado",
        pedido: pedido.toJSONResumen()
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}