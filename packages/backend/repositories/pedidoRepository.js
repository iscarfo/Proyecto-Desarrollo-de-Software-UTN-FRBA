export class PedidoRepository {
  constructor() {
    this.pedidos = [];
  }

  async save(pedido) {
    const index = this.pedidos.findIndex(p => p.getId() === pedido.getId());
    if (index >= 0) {
      this.pedidos[index] = pedido;
    } else {
      this.pedidos.push(pedido);
      console.log("Guardando pedido:", pedido.getId());
    }
    
    return pedido; // <-- importante: devolver la misma instancia
  }

  async findAll() {
    return this.pedidos;
  }

  async findById(id) {
    return this.pedidos.find(p => p.getId() === id);
  }
}