import { PedidoService } from "../services/pedidoService.js";
import { PedidoRepository } from "../repositories/pedidoRepository.js";

export class PedidoController {
  constructor() {
    this.pedidoService = new PedidoService(new PedidoRepository());
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
}