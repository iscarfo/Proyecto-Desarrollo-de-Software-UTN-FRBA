import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from "@jest/globals";
import { PedidoService } from "../../services/pedidoService.js";
import { ProductoService } from "../../services/productoService.js";
import { NotificacionesService } from "../../services/notificacionesService.js";
import { PedidoRepository } from "../../repositories/pedidoRepository.js";
import { ProductoRepository } from "../../repositories/productoRepository.js";
import { UsuarioRepository } from "../../repositories/usuarioRepository.js";
import { NotificacionesRepository } from "../../repositories/notificacionesRepository.js";
import { EstadoPedido } from "../../domain/pedido/enums.js";
import { InvalidIdError, NotFoundError } from "../../errors/AppError.js";
import { connect, closeDatabase, clearDatabase } from "../utils/mongoMemory.js";
import { TestDataFactory } from "../fixtures/testData.js";
import { Usuario } from "../../models/Usuario.js";
import mongoose from "mongoose";

/**
 * PedidoService Tests con MongoDB en memoria
 * Usa repositorios reales y datos persistentes en BD
 */
describe("PedidoService - Lógica de negocio de pedidos (BD Real)", () => {
  let pedidoService;
  let productoService;
  let notificacionesService;
  let pedidoRepository;
  let productoRepository;
  let usuarioRepository;
  let notificacionesRepository;

  // Datos de prueba
  let comprador;
  let vendedor;
  let producto;

  // Conectar a BD en memoria antes de todas las pruebas
  beforeAll(async () => {
    await connect();
  });

  // Limpiar BD después de cada test
  afterEach(async () => {
    await clearDatabase();
  });

  // Desconectar después de todas las pruebas
  afterAll(async () => {
    await closeDatabase();
  });

  // Inicializar servicios y repositorios antes de cada test
  beforeEach(async () => {
    // Crear instancias de repositorios
    usuarioRepository = new UsuarioRepository();
    productoRepository = new ProductoRepository();
    pedidoRepository = new PedidoRepository();
    notificacionesRepository = new NotificacionesRepository();

    // Crear instancias de servicios
    productoService = new ProductoService(productoRepository);
    notificacionesService = new NotificacionesService(
      notificacionesRepository,
      usuarioRepository
    );
    pedidoService = new PedidoService(
      pedidoRepository,
      productoService,
      usuarioRepository,
      notificacionesService
    );

    // Crear datos de prueba en la BD
    const compradorData = TestDataFactory.createUsuario({
      nombre: "Juan Comprador",
      rol: "comprador"
    });
    comprador = await Usuario.create(compradorData);

    const vendedorData = TestDataFactory.createUsuario({
      nombre: "María Vendedora",
      rol: "vendedor"
    });
    vendedor = await Usuario.create(vendedorData);

    // Crear producto en la BD
    const productoData = TestDataFactory.createProducto(vendedor);
    producto = await productoRepository.create(productoData);
  });

  // ========================
  // Tests de listarPedidos
  // ========================
  describe("listarPedidos()", () => {
    test("retorna lista de todos los pedidos", async () => {
      // Crear 3 pedidos
      const pedido1Data = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id
      });
      const pedido2Data = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id
      });

      await pedidoRepository.create(pedido1Data);
      await pedidoRepository.create(pedido2Data);

      const resultado = await pedidoService.listarPedidos();

      expect(resultado).toHaveLength(2);
      expect(resultado[0]).toHaveProperty("_id");
      expect(resultado[0]).toHaveProperty("compradorId");
    });

    test("retorna array vacío si no hay pedidos", async () => {
      const resultado = await pedidoService.listarPedidos();

      expect(resultado).toEqual([]);
    });
  });

  // ========================
  // Tests de obtenerPedidosDeUsuario
  // ========================
  describe("obtenerPedidosDeUsuario()", () => {
    test("retorna pedidos del usuario con ID válido", async () => {
      // Crear pedidos para el comprador
      const pedido1Data = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id
      });
      const pedido2Data = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id
      });

      await pedidoRepository.create(pedido1Data);
      await pedidoRepository.create(pedido2Data);

      const resultado = await pedidoService.obtenerPedidosDeUsuario(
        comprador._id.toString()
      );

      expect(resultado).toHaveLength(2);
      expect(resultado.every((p) => p.compradorId.toString() === comprador._id.toString())).toBe(
        true
      );
    });

    test("lanza InvalidIdError para ID de usuario inválido", async () => {
      const usuarioIdInvalido = "invalid-id";

      await expect(
        pedidoService.obtenerPedidosDeUsuario(usuarioIdInvalido)
      ).rejects.toThrow(InvalidIdError);
    });

    test("retorna array vacío si usuario no tiene pedidos", async () => {
      const otraCompradora = await Usuario.create(
        TestDataFactory.createUsuario({ nombre: "Otro usuario" })
      );

      const resultado = await pedidoService.obtenerPedidosDeUsuario(
        otraCompradora._id.toString()
      );

      expect(resultado).toEqual([]);
    });
  });

  // ========================
  // Tests de cancelarPedido
  // ========================
  describe("cancelarPedido()", () => {
    test("cancela un pedido válido del comprador autorizado", async () => {
      // Crear pedido con stock suficiente
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: 2,
            vendedorId: vendedor._id
          })
        ]
      });
      const pedidoCreado = await pedidoRepository.create(pedidoData);
      const stockAnterior = producto.stock;

      // Cancelar pedido
      const resultado = await pedidoService.cancelarPedido(
        pedidoCreado._id.toString(),
        comprador._id.toString()
      );

      expect(resultado.estado).toBe(EstadoPedido.CANCELADO);

      // Verificar que el stock se recuperó
      const productoActualizado = await productoRepository.findById(producto._id.toString());
      expect(productoActualizado.stock).toBe(stockAnterior + 2);
    });

    test("lanza error si el pedido no existe", async () => {
      const pedidoIdInexistente = new mongoose.Types.ObjectId();

      await expect(
        pedidoService.cancelarPedido(pedidoIdInexistente.toString(), comprador._id.toString())
      ).rejects.toThrow(NotFoundError);
    });

    test("lanza error si comprador no coincide", async () => {
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id
      });
      const pedidoCreado = await pedidoRepository.create(pedidoData);

      const compradorDiferente = await Usuario.create(
        TestDataFactory.createUsuario({ nombre: "Otro comprador" })
      );

      await expect(
        pedidoService.cancelarPedido(
          pedidoCreado._id.toString(),
          compradorDiferente._id.toString()
        )
      ).rejects.toThrow();
    });

    test("lanza error si el pedido ya fue cancelado", async () => {
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        estado: EstadoPedido.CANCELADO
      });
      const pedidoCreado = await pedidoRepository.create(pedidoData);

      await expect(
        pedidoService.cancelarPedido(
          pedidoCreado._id.toString(),
          comprador._id.toString()
        )
      ).rejects.toThrow();
    });

    test("recupera stock de los productos al cancelar", async () => {
      const stockInicial = producto.stock;
      const cantidadPedida = 3;

      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: cantidadPedida,
            vendedorId: vendedor._id
          })
        ]
      });
      const pedidoCreado = await pedidoRepository.create(pedidoData);

      // Disminuir stock al confirmar
      await productoService.disminuirStock(producto._id.toString(), cantidadPedida);

      // Cancelar y verificar recuperación
      await pedidoService.cancelarPedido(
        pedidoCreado._id.toString(),
        comprador._id.toString()
      );

      const productoActualizado = await productoRepository.findById(producto._id.toString());
      expect(productoActualizado.stock).toBe(stockInicial);
    });
  });

  // ========================
  // Tests de marcarComoEnviado
  // ========================
  describe("marcarComoEnviado()", () => {
    test("marca un pedido como enviado correctamente", async () => {
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        estado: EstadoPedido.CONFIRMADO,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: 1,
            vendedorId: vendedor._id
          })
        ]
      });
      const pedidoCreado = await pedidoRepository.create(pedidoData);
      const totalVendidoAnterior = producto.totalVendido || 0;

      const resultado = await pedidoService.marcarComoEnviado(
        pedidoCreado._id.toString(),
        vendedor._id.toString()
      );

      expect(resultado.estado).toBe(EstadoPedido.ENVIADO);

      // Verificar incremento en totalVendido
      const productoActualizado = await productoRepository.findById(producto._id.toString());
      expect(productoActualizado.totalVendido).toBeGreaterThan(totalVendidoAnterior);
    });

    test("incrementa la cantidad de ventas de los productos", async () => {
      const totalVendidoAntes = producto.totalVendido || 0;

      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        estado: EstadoPedido.CONFIRMADO,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: 5,
            vendedorId: vendedor._id
          })
        ]
      });
      const pedidoCreado = await pedidoRepository.create(pedidoData);

      await pedidoService.marcarComoEnviado(
        pedidoCreado._id.toString(),
        vendedor._id.toString()
      );

      const productoActualizado = await productoRepository.findById(producto._id.toString());
      expect(productoActualizado.totalVendido).toBe(totalVendidoAntes + 5);
    });

    test("lanza error si el pedido fue enviado", async () => {
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        estado: EstadoPedido.ENVIADO,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: 1,
            vendedorId: vendedor._id
          })
        ]
      });
      const pedidoCreado = await pedidoRepository.create(pedidoData);

      await expect(
        pedidoService.marcarComoEnviado(
          pedidoCreado._id.toString(),
          vendedor._id.toString()
        )
      ).rejects.toThrow();
    });

    test("lanza error si el pedido fue cancelado", async () => {
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        estado: EstadoPedido.CANCELADO,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: 1,
            vendedorId: vendedor._id
          })
        ]
      });
      const pedidoCreado = await pedidoRepository.create(pedidoData);

      await expect(
        pedidoService.marcarComoEnviado(
          pedidoCreado._id.toString(),
          vendedor._id.toString()
        )
      ).rejects.toThrow();
    });
  });

  // ========================
  // Tests de actualizarEstadoPedido
  // ========================
  describe("actualizarEstadoPedido()", () => {
    test("actualiza el estado del pedido correctamente", async () => {
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        estado: EstadoPedido.PENDIENTE,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: 1,
            vendedorId: vendedor._id
          })
        ]
      });
      const pedidoCreado = await pedidoRepository.create(pedidoData);

      const resultado = await pedidoService.actualizarEstadoPedido(
        pedidoCreado._id.toString(),
        EstadoPedido.CONFIRMADO,
        comprador._id.toString()
      );

      expect(resultado.estado).toBe(EstadoPedido.CONFIRMADO);
      expect(resultado.historialEstados).toBeDefined();
      expect(resultado.historialEstados.length).toBeGreaterThan(1);
    });

    test("lanza InvalidIdError para ID inválido", async () => {
      await expect(
        pedidoService.actualizarEstadoPedido("invalid-id", EstadoPedido.CONFIRMADO, comprador._id.toString())
      ).rejects.toThrow(InvalidIdError);
    });

    test("lanza error si el pedido no existe", async () => {
      const pedidoIdInexistente = new mongoose.Types.ObjectId();

      await expect(
        pedidoService.actualizarEstadoPedido(
          pedidoIdInexistente.toString(),
          EstadoPedido.CONFIRMADO,
          comprador._id.toString()
        )
      ).rejects.toThrow(NotFoundError);
    });

    test("lanza error si intenta cambiar a un estado inválido", async () => {
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        estado: EstadoPedido.CANCELADO,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: 1,
            vendedorId: vendedor._id
          })
        ]
      });
      const pedidoCreado = await pedidoRepository.create(pedidoData);

      await expect(
        pedidoService.actualizarEstadoPedido(
          pedidoCreado._id.toString(),
          EstadoPedido.CANCELADO,
          comprador._id.toString()
        )
      ).rejects.toThrow();
    });

    test("registra el cambio de estado en el historial", async () => {
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        estado: EstadoPedido.PENDIENTE,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: 1,
            vendedorId: vendedor._id
          })
        ]
      });
      const pedidoCreado = await pedidoRepository.create(pedidoData);

      const resultado = await pedidoService.actualizarEstadoPedido(
        pedidoCreado._id.toString(),
        EstadoPedido.CONFIRMADO,
        comprador._id.toString()
      );

      expect(resultado.historialEstados).toBeDefined();
      expect(resultado.historialEstados.length).toBeGreaterThan(0);
      expect(
        resultado.historialEstados.some((h) => h.estado === EstadoPedido.CONFIRMADO)
      ).toBe(true);
    });
  });
});
