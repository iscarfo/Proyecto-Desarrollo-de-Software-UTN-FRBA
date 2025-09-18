export class PedidoRepository {
  constructor() {
    this.pedidos = []; // array para guardar todos los pedidos
  }

  save(pedido) {
    this.pedidos.push(pedido);
    return pedido;
  }

  findAll() {
    return this.pedidos;
  }

  findById(id) {
    return this.pedidos.find(p => p.getId() === id);
  }
}