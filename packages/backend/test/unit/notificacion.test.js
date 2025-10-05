import { Notificacion } from "../../domain/notificacion/Notificacion.js";
import { FactoryNotificacion } from "../../domain/notificacion/FactoryNotificacion.js";
import { Pedido } from "../../domain/pedido/Pedido.js";
import { ItemPedido } from "../../domain/pedido/ItemPedido.js";
import { DireccionEntrega } from "../../domain/pedido/DireccionEntrega.js";
import { Producto } from "../../domain/producto/Producto.js";
import { Usuario } from "../../domain/usuario/Usuario.js";

describe("Notificacion - pruebas básicas", () => {
  let usuario;
  let vendedor;
  let producto;
  let itemPedido;
  let direccion;
  let pedido;

  beforeEach(() => {
    // Crear vendedor
    vendedor = new Usuario(1, "Juan Vendedor", "juan@vendor.com", "1234567890", "vendedor");

    // Crear producto
    producto = new Producto(
      1,
      vendedor,
      "Laptop Gaming",
      "Laptop de alta gama",
      ["Electrónica", "Computadoras"],
      150000,
      "ARS",
      10,
      ["laptop.jpg"],
      true
    );

    // Crear item de pedido
    itemPedido = new ItemPedido(producto, 2, 150000);

    // Crear dirección
    direccion = new DireccionEntrega(
      "Av. Corrientes",
      "1234",
      "5",
      "A",
      "1043",
      "CABA",
      "Buenos Aires",
      "Argentina",
      -34.603722,
      -58.381592
    );

    // Crear usuario comprador
    usuario = new Usuario(2, "Pedro Cliente", "pedro@client.com", "0987654321", "cliente");

    // Crear pedido
    pedido = new Pedido(usuario.getId(), [itemPedido], "ARS", direccion);
  });

  describe("Clase Notificacion", () => {
    test("Crear notificación correctamente", () => {
      const notificacion = new Notificacion(
        "1",
        usuario,
        "Mensaje de prueba",
        new Date()
      );

      expect(notificacion.getId()).toBe("1");
      expect(notificacion.getUsuarioDestino()).toBe(usuario);
      expect(notificacion.getMensaje()).toBe("Mensaje de prueba");
      expect(notificacion.isLeida()).toBe(false);
      expect(notificacion.getFechaLeida()).toBeNull();
    });

    test("Marcar notificación como leída", () => {
      const notificacion = new Notificacion(
        "1",
        usuario,
        "Mensaje de prueba",
        new Date()
      );

      expect(notificacion.isLeida()).toBe(false);
      expect(notificacion.getFechaLeida()).toBeNull();

      notificacion.marcarComoLeida();

      expect(notificacion.isLeida()).toBe(true);
      expect(notificacion.getFechaLeida()).toBeInstanceOf(Date);
    });

    test("Verificar fecha de alta", () => {
      const fecha = new Date();
      const notificacion = new Notificacion(
        "1",
        usuario,
        "Mensaje de prueba",
        fecha
      );

      expect(notificacion.getFechaAlta()).toBe(fecha);
    });
  });

  describe("FactoryNotificacion", () => {
    test("crearSegunEstadoPedido retorna mensaje correcto", () => {
      const mensaje = FactoryNotificacion.crearSegunEstadoPedido("CONFIRMADO");
      expect(mensaje).toBe("El pedido pasó al estado: CONFIRMADO");
    });

    test("crearNotificacionConfirmadoCliente crea notificación correcta", () => {
      const notificacion = FactoryNotificacion.crearNotificacionConfirmadoCliente(pedido);

      expect(notificacion).toBeInstanceOf(Notificacion);
      expect(notificacion.getUsuarioDestino()).toBe(usuario.getId());
      expect(notificacion.getMensaje()).toContain("Felicidades, tu pedido ha sido confirmado");
      expect(notificacion.getMensaje()).toContain("Laptop Gaming");
      expect(notificacion.getMensaje()).toContain("(x2)");
      expect(notificacion.getMensaje()).toContain("Te avisaremos cuando esté en camino");
      expect(notificacion.getFechaAlta()).toBeInstanceOf(Date);
      expect(notificacion.isLeida()).toBe(false);
    });

    test("crearNotificacionConfirmadoVendedor crea notificación correcta", () => {
      const notificacion = FactoryNotificacion.crearNotificacionConfirmadoVendedor(pedido, vendedor);

      expect(notificacion).toBeInstanceOf(Notificacion);
      expect(notificacion.getUsuarioDestino()).toBe(vendedor);
      expect(notificacion.getMensaje()).toContain("Se ha confirmado un pedido con tus productos");
      expect(notificacion.getMensaje()).toContain("Laptop Gaming");
      expect(notificacion.getMensaje()).toContain("(x2)");
      expect(notificacion.getMensaje()).toContain("Recuerda preparar el envío");
      expect(notificacion.isLeida()).toBe(false);
    });

    test("crearNotificacionEnviadoCliente crea notificación correcta", () => {
      const notificacion = FactoryNotificacion.crearNotificacionEnviadoCliente(pedido);

      expect(notificacion).toBeInstanceOf(Notificacion);
      expect(notificacion.getUsuarioDestino()).toBe(usuario.getId());
      expect(notificacion.getMensaje()).toContain("Tu pedido está en camino");
      expect(notificacion.getMensaje()).toContain("Av. Corrientes 1234");
      expect(notificacion.isLeida()).toBe(false);
    });

    test("crearNotificacionEnviadoVendedor crea notificación correcta", () => {
      const notificacion = FactoryNotificacion.crearNotificacionEnviadoVendedor(pedido, vendedor);

      expect(notificacion).toBeInstanceOf(Notificacion);
      expect(notificacion.getUsuarioDestino()).toBe(vendedor);
      expect(notificacion.getMensaje()).toContain("El pedido con tus productos");
      expect(notificacion.getMensaje()).toContain("ha sido enviado al cliente");
      expect(notificacion.getMensaje()).toContain("Laptop Gaming");
      expect(notificacion.getMensaje()).toContain("Av. Corrientes 1234");
      expect(notificacion.isLeida()).toBe(false);
    });

    test("crearNotificacionCanceladoCliente crea notificación correcta", () => {
      const notificacion = FactoryNotificacion.crearNotificacionCanceladoCliente(pedido);

      expect(notificacion).toBeInstanceOf(Notificacion);
      expect(notificacion.getUsuarioDestino()).toBe(usuario.getId());
      expect(notificacion.getMensaje()).toContain("Tu pedido con los siguientes productos ha sido cancelado");
      expect(notificacion.getMensaje()).toContain("Laptop Gaming");
      expect(notificacion.getMensaje()).toContain("(x2)");
      expect(notificacion.getMensaje()).toContain("Lamentamos que hayas tenido que cancelar");
      expect(notificacion.isLeida()).toBe(false);
    });

    test("crearNotificacionCanceladoVendedor crea notificación correcta", () => {
      const notificacion = FactoryNotificacion.crearNotificacionCanceladoVendedor(pedido, vendedor);

      expect(notificacion).toBeInstanceOf(Notificacion);
      expect(notificacion.getUsuarioDestino()).toBe(vendedor);
      expect(notificacion.getMensaje()).toContain("El pedido con los siguientes productos ha sido cancelado por el cliente");
      expect(notificacion.getMensaje()).toContain("Laptop Gaming");
      expect(notificacion.getMensaje()).toContain("(x2)");
      expect(notificacion.isLeida()).toBe(false);
    });

    test("crearNotificacionConfirmadoVendedor filtra productos del vendedor correctamente", () => {
      // Crear otro vendedor y producto
      const otroVendedor = new Usuario(3, "Maria Vendedora", "maria@vendor.com", "1111111111", "vendedor");
      const otroProducto = new Producto(
        2,
        otroVendedor,
        "Mouse Gamer",
        "Mouse RGB",
        ["Electrónica", "Periféricos"],
        5000,
        "ARS",
        20,
        ["mouse.jpg"],
        true
      );

      const itemPedido2 = new ItemPedido(otroProducto, 1, 5000);
      const pedidoMultipleVendedores = new Pedido(
        usuario.getId(),
        [itemPedido, itemPedido2],
        "ARS",
        direccion
      );

      const notificacionVendedor1 = FactoryNotificacion.crearNotificacionConfirmadoVendedor(
        pedidoMultipleVendedores,
        vendedor
      );

      // Solo debe incluir el producto del vendedor1 (Laptop Gaming)
      expect(notificacionVendedor1.getMensaje()).toContain("Laptop Gaming");
      expect(notificacionVendedor1.getMensaje()).not.toContain("Mouse Gamer");
    });
  });
});
