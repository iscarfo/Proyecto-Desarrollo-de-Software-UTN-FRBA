import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { Pedido } from "../../domain/pedido/Pedido.js";
import { EstadoPedido } from "../../domain/pedido/enums.js";
import { ItemPedido } from "../../domain/pedido/ItemPedido.js";
import { CambioEstadoPedido } from "../../domain/pedido/CambioEstadoPedido.js";

// Mock de FactoryNotificacion
jest.mock("../../domain/notificacion/FactoryNotificacion.js", () => ({
  FactoryNotificacion: {
    crearNotificacionEnvio: jest.fn(),
    crearNotificacionCancelacion: jest.fn(),
    crearNotificacionNuevoPedido: jest.fn()
  }
}));


// Factory de items usando la clase real ItemPedido
const item = (productoId, cantidad, precioUnitario) =>
  new ItemPedido(productoId, cantidad, precioUnitario);

describe("Pedido - pruebas completas", () => {
  let pedido;
  let repoMock;

  beforeEach(() => {
    const items = [
      item(1, 2, 100), // subtotal = 200
      item(2, 3, 50)   // subtotal = 150
    ];

    pedido = new Pedido(
      "comprador-123",
      items,
      "ARS",
      { calle: "Calle 123" }
    );

    // Repositorio mock
    repoMock = {
      findById: jest.fn().mockResolvedValue({ stock: 10 }),
      findByIdAndUpdateEstado: jest.fn().mockImplementation((id, estado, usuario, motivo) => {
        return Promise.resolve({ id, estado, usuario, motivo });
      })
    };
  });

  // ------------------------
  // Test de calcularTotal
  // ------------------------
  test("calcularTotal suma correctamente", () => {
    expect(pedido.calcularTotal()).toBe(350);
  });

  // ------------------------
  // Test de validarStock
  // ------------------------
  test("validarStock con repo mock devuelve true si todos tienen stock", async () => {
    const result = await pedido.validarStock(repoMock);
    expect(result).toBe(true);
  });

  test("validarStock con repo mock devuelve false si algún producto no tiene stock", async () => {
    const repoMockStock0 = {
      findById: jest.fn().mockResolvedValue({ stock: 0 })
    };

    const pedido2 = new Pedido(
      "c2",
      [new ItemPedido(1, 10, 100)],
      "ARS",
      {}
    );

    const result = await pedido2.validarStock(repoMockStock0);
    expect(result).toBe(false);
  });

  // ------------------------
  // Test de getters
  // ------------------------
  test("getters devuelven los datos pasados al constructor", () => {
    expect(pedido.getId()).toBeNull();
    expect(pedido.getCompradorId()).toBe("comprador-123");
    expect(pedido.getItems()).toHaveLength(2);
    expect(pedido.getDireccionEntrega()).toEqual({ calle: "Calle 123" });
    expect(pedido.getEstado()).toBe(EstadoPedido.PENDIENTE);
  });

  // ------------------------
  // Test de actualizarEstado
  // ------------------------
  test("cambia el estado y registra en historial", async () => {
    const nuevoEstado = EstadoPedido.ENVIADO;
    const usuario = "admin";
    const motivo = "Preparado para envío";

    const resultado = await pedido.actualizarEstado(nuevoEstado, usuario, motivo, repoMock);

    // Verifica que el estado interno cambió
    expect(pedido.getEstado()).toBe(nuevoEstado);

    // Verifica que el historial tenga un cambio registrado
    expect(pedido.getHistorialEstados()).toHaveLength(1);
    const cambio = pedido.getHistorialEstados()[0];
    expect(cambio).toBeInstanceOf(CambioEstadoPedido);
    expect(cambio.getEstado()).toBe(nuevoEstado);
    expect(cambio.getUsuario()).toBe(usuario);
    expect(cambio.getMotivo()).toBe(motivo);

    // Verifica que el repo fue llamado
    expect(repoMock.findByIdAndUpdateEstado).toHaveBeenCalledWith(
      pedido.getId(),
      nuevoEstado,
      usuario,
      motivo
    );
  });

  test("no permite cancelar un pedido ya cancelado", async () => {
    // Primero cancelamos
    await pedido.actualizarEstado(EstadoPedido.CANCELADO, "admin", "Motivo inicial", repoMock);

    // Intentar cancelar nuevamente debe lanzar error
    await expect(
      pedido.actualizarEstado(EstadoPedido.CANCELADO, "admin", "Otro motivo", repoMock)
    ).rejects.toThrow("El pedido ya fue cancelado previamente.");
  });
});