import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { createPedidoRouter } from "../../routes/pedidoRoutes.js";
import { createUsuarioRouter } from "../../routes/usuarioRoutes.js";
import { PedidoController } from "../../controllers/pedidoController.js";
import { PedidoService } from "../../services/pedidoService.js";
import { ProductoService } from "../../services/productoService.js";
import { NotificacionesService } from "../../services/notificacionesService.js";
import { PedidoRepository } from "../../repositories/pedidoRepository.js";
import { ProductoRepository } from "../../repositories/productoRepository.js";
import { UsuarioRepository } from "../../repositories/usuarioRepository.js";
import { NotificacionesRepository } from "../../repositories/notificacionesRepository.js";
import { connect, closeDatabase, clearDatabase } from "../utils/mongoMemory.js";
import { TestDataFactory } from "../fixtures/testData.js";
import { Usuario } from "../../models/Usuario.js";
import { EstadoPedido } from "../../domain/pedido/enums.js";
import { describe, test, expect, beforeEach, beforeAll, afterAll, afterEach } from "@jest/globals";

/**
 * Pedido API Integration Tests con BD en memoria
 */
let app;
let comprador;
let vendedor;
let producto;

// Conectar a BD en memoria antes de todas las pruebas
beforeAll(async () => {
  await connect();
  setupExpress();
});

// Limpiar BD después de cada test
afterEach(async () => {
  await clearDatabase();
});

// Desconectar después de todas las pruebas
afterAll(async () => {
  await closeDatabase();
});

function setupExpress() {
  app = express();
  app.use(bodyParser.json());

  // Crear instancias de repositorios (usar los reales con BD en memoria)
  const usuarioRepository = new UsuarioRepository();
  const productoRepository = new ProductoRepository();
  const pedidoRepository = new PedidoRepository();
  const notificacionesRepository = new NotificacionesRepository();

  // Crear servicios
  const productoService = new ProductoService(productoRepository);
  const notificacionesService = new NotificacionesService(
    notificacionesRepository,
    usuarioRepository
  );
  const pedidoService = new PedidoService(
    pedidoRepository,
    productoService,
    usuarioRepository,
    notificacionesService
  );

  // Crear controladores
  const pedidoController = new PedidoController(pedidoService);

  // Mock del notificacionesController (para rutas que lo requieren)
  const mockNotificacionesController = {
    obtenerNotificacionesNoLeidas: (req, res) => res.json([]),
    obtenerNotificacionesLeidas: (req, res) => res.json([])
  };

  // Mock del productoController (para rutas que lo requieren)
  const mockProductoController = {
    buscarProductoPorVendedor: (req, res) => res.json([])
  };

  // Montar routers
  app.use("/pedidos", createPedidoRouter(pedidoController));
  app.use(
    "/usuarios",
    createUsuarioRouter(mockProductoController, pedidoController, mockNotificacionesController)
  );
}

// Crear datos de prueba antes de cada test
beforeEach(async () => {
  // Crear usuarios en la BD
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
  const productoRepository = new ProductoRepository();
  const productoData = TestDataFactory.createProducto(vendedor, {
    stock: 50,
    precio: 5000
  });
  producto = await productoRepository.create(productoData);
});

describe("API Pedidos - Integration Tests", () => {
  describe("GET /pedidos - Listar todos los pedidos", () => {
    test("Retorna lista vacía cuando no hay pedidos", async () => {
      const res = await request(app).get("/pedidos").expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    test("Retorna lista de pedidos creados", async () => {
      // Crear un pedido mediante el repositorio
      const pedidoRepository = new PedidoRepository();
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: 2,
            vendedorId: vendedor._id
          })
        ]
      });
      await pedidoRepository.create(pedidoData);

      const res = await request(app).get("/pedidos").expect(200);


      expect(res.body.length).toBe(1);
    });
  });

  describe("DELETE /pedidos/:pedidoId - Cancelar pedido", () => {
    test("Cancela pedido exitosamente", async () => {
      // Crear un pedido
      const pedidoRepository = new PedidoRepository();
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: 2,
            vendedorId: vendedor._id
          })
        ]
      });
      const pedido = await pedidoRepository.create(pedidoData);

      const res = await request(app)
        .delete(`/pedidos/${pedido._id.toString()}`)
        .send({ compradorId: comprador._id.toString() })
        .expect(200);

      expect(res.body).toHaveProperty("message", "Pedido cancelado con éxito");
    });

    test("Error al cancelar con comprador no autorizado", async () => {
      // Crear un pedido
      const pedidoRepository = new PedidoRepository();
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id
      });
      const pedido = await pedidoRepository.create(pedidoData);

      // Crear otro comprador
      const otraCompradora = await Usuario.create(
        TestDataFactory.createUsuario({ nombre: "Otro comprador" })
      );

      const res = await request(app)
        .delete(`/pedidos/${pedido._id.toString()}`)
        .send({ compradorId: otraCompradora._id.toString() })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /usuarios/comprador/:usuarioId/pedidos", () => {
    test("Obtener pedidos del usuario exitosamente", async () => {
      // Crear un pedido
      const pedidoRepository = new PedidoRepository();
      const pedidoData = TestDataFactory.createPedido(comprador, {
        vendedorId: vendedor._id,
        items: [
          TestDataFactory.createItemPedido(producto._id, {
            cantidad: 1,
            vendedorId: vendedor._id
          })
        ]
      });
      await pedidoRepository.create(pedidoData);

      const res = await request(app)
        .get(`/usuarios/comprador/${comprador._id.toString()}/pedidos`)
        .expect(200);


      expect(res.body.length).toBe(1);
    });

    test("Retorna lista vacía si usuario no tiene pedidos", async () => {
      const res = await request(app)
        .get(`/usuarios/comprador/${comprador._id.toString()}/pedidos`)
        .expect(200);


      expect(res.body.length).toBe(0);
    });
  });

  describe("PATCH /pedidos/:pedidoId/enviado - Marcar como enviado", () => {
    test("Marca pedido como enviado exitosamente", async () => {
      // Crear un pedido en estado CONFIRMADO
      const pedidoRepository = new PedidoRepository();
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
      const pedido = await pedidoRepository.create(pedidoData);

      const res = await request(app)
        .patch(`/pedidos/${pedido._id.toString()}/enviado`)
        .send({ vendedorId: vendedor._id.toString() })
        .expect(200);


      expect(res.body).toHaveProperty("estado", EstadoPedido.ENVIADO);
    });
  });
});
