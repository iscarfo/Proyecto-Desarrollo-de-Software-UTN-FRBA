import { PedidoModel } from "../models/PedidoModel.js";
export class PedidoRepository {
  async save(pedido) {
    if (!pedido.id) {
      const created = await PedidoModel.create({
        compradorId: pedido.getCompradorId(),
        items: pedido.items.map(i => ({
          productoId: i.getProductoId(),
          cantidad: i.getCantidad(),
          precioUnitario: i.getPrecioUnitario()
        })),
        moneda: pedido.moneda,
        direccionEntrega: pedido.direccionEntrega,
        estado: pedido.estado,
        fechaCreacion: pedido.fechaCreacion,
        historialEstados: pedido.historialEstados.map(h => ({
          fecha: h.fecha,
          estado: h.estado,
          quien: h.quien,
          motivo: h.motivo
        }))
      });
      return this.mapToPedidoDTO(created);
    } else {
      const updated = await PedidoModel.findByIdAndUpdate(
        pedido.id,
        {
          compradorId: pedido.getCompradorId(),
          items: pedido.items.map(i => ({
            productoId: i.getProductoId(),
            cantidad: i.getCantidad(),
            precioUnitario: i.getPrecioUnitario()
          })),
          moneda: pedido.moneda,
          direccionEntrega: pedido.direccionEntrega,
          estado: pedido.estado,
          fechaCreacion: pedido.fechaCreacion,
          historialEstados: pedido.historialEstados.map(h => ({
            fecha: h.fecha,
            estado: h.estado,
            quien: h.quien,
            motivo: h.motivo
          }))
        },
        { new: true }
      );
      return this.mapToPedidoDTO(updated);
    }
  }

  async findAll() {
    const pedidosDocs = await PedidoModel.find();
    return pedidosDocs.map(doc => this.mapToPedidoDTO(doc));
  }

  async findById(id) {
    const doc = await PedidoModel.findById(id);
    if (!doc) return null;
    return this.mapToPedidoDTO(doc);
  }  

  async findByIdAndUpdateEstado(pedidoId, nuevoEstado, quien, motivo) {
    // Construir el cambio de estado para historialEstados
    const cambio = {
      fecha: new Date(),
      estado: nuevoEstado,
      quien,
      motivo
    };
    const updated = await PedidoModel.findByIdAndUpdate(
      pedidoId,
      {
        $set: { estado: nuevoEstado },
        $push: { historialEstados: cambio }
      },
      { new: true }
    );
    if (!updated) return null;
    return this.mapToPedidoDTO(updated);
  }
  
  mapToPedidoDTO(doc) {
    const total = doc.items.reduce((sum, i) => sum + i.cantidad * i.precioUnitario, 0);
    return {
      id: doc._id.toString(),
      compradorId: doc.compradorId,
      items: doc.items.map(i => ({
        productoId: i.productoId,
        cantidad: i.cantidad,
        precioUnitario: i.precioUnitario
      })),
      moneda: doc.moneda,
      direccionEntrega: doc.direccionEntrega,
      estado: doc.estado,
      fechaCreacion: doc.fechaCreacion,
      historialEstados: doc.historialEstados.map(h => ({
        fecha: h.fecha,
        estado: h.estado,
        quien: h.quien,
        motivo: h.motivo
      })),
      total
    };
  }
}