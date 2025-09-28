import { Pedido } from "../../domain/pedido/Pedido.js";
import { EstadoPedido } from "../../domain/pedido/enums.js";


// Objetos de prueba muy simples
const vendedor1 = { id: 1, nombre: "Juan" };
const vendedor2 = { id: 2, nombre: "Ana" };

const producto = (vendedor) => ({
  getVendedor: () => vendedor,
  estaDisponible: (cantidad) => cantidad <= 5
});

const item = (vendedor, precio, cantidad) => ({
  getProducto: () => producto(vendedor),
  getCantidad: () => cantidad,
  subTotal: () => precio * cantidad
});

describe("Pedido - pruebas simples", () => {
  let pedido;

  beforeEach(() => {
    const items = [
      item(vendedor1, 100, 2), // subtotal = 200
      item(vendedor2, 50, 3)   // subtotal = 150
    ];

    pedido = new Pedido(
      1, { nombre: "Pepe" }, items, "ARS", { calle: "Calle 123" }
    );
  });

  test("calcularTotal suma correctamente", () => {
    expect(pedido.calcularTotal()).toBe(350);
  });

  test("validarStock devuelve true si todos los productos tienen stock", () => {
    expect(pedido.validarStock()).toBe(true);
  });

  test("validarStock devuelve false si algún producto no tiene stock", () => {
    // Creamos un pedido con un item que no tiene stock
    const sinStock = item(vendedor1, 100, 10); // cantidad 10 > 5
    const pedido2 = new Pedido(2, { nombre: "Luis" }, [sinStock], "ARS", {});
    expect(pedido2.validarStock()).toBe(false);
  });

  test("obtenerVendedores devuelve una lista sin duplicados", () => {
    const vendedores = pedido.obtenerVendedores();
    expect(vendedores).toHaveLength(2);
    expect(vendedores).toContain(vendedor1);
    expect(vendedores).toContain(vendedor2);
  });

  test("getters devuelven los datos pasados al constructor", () => {
    expect(pedido.getId()).toBe(1);
    expect(pedido.getCompradorId()).toEqual( "1");
    expect(pedido.getItems()).toHaveLength(2);
    expect(pedido.getDireccionEntrega()).toEqual({ calle: "Calle 123" });
    expect(pedido.getEstado()).toBe(EstadoPedido.PENDIENTE);
  });
});