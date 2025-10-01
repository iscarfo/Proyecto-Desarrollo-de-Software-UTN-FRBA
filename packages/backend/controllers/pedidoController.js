export class PedidoController {
  constructor(pedidoService) {
    this.pedidoService = pedidoService;
  }

  crearPedido = async (req, res) => {
    try {
      const { compradorId, items, moneda, direccionEntrega } = req.body;
      const pedido = await this.pedidoService.crearPedido(compradorId, items, moneda, direccionEntrega);
      res.status(201).json({
        message: "Pedido creado con éxito",
        pedidoId: pedido.id,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  listarPedidos = async (req, res) => { // lista todos los pedidos que existen en el sistema
    try {
      const pedidos = await this.pedidoService.listarPedidos();
      res.json(pedidos.map(p => ({ id: p.id })));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  cancelarPedido = async (req, res) => {
    try {
      const { pedidoId } = req.params;
      const compradorId = req.body.compradorId;
      const pedido = await this.pedidoService.cancelarPedido(pedidoId, compradorId);
      res.json({
        message: "Pedido cancelado con éxito",
        pedido:  pedido.id,
        estado: pedido.estado
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
        id: pedido.id,
        estado: pedido.estado
      }));

      res.json(response);

    } catch (err) {
      console.error("Error en historialPedidosUsuario:", err.message);
      res.status(400).json({ error: err.message });
    }

  };

  marcarPedidoEnviado = async (req, res) => {
    try {
      const { pedidoId } = req.params;
      const { vendedorId } = req.body;
      const pedido = await this.pedidoService.marcarComoEnviado(pedidoId, vendedorId);
      res.json({
        message: "Pedido marcado como enviado",
        pedido: pedido.id,
        estado: pedido.estado
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}