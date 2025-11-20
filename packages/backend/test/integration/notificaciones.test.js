import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { createNotificacionesRouter } from "../../routes/notificacionesRoutes.js";
import { NotificacionesController } from "../../controllers/notificacionesController.js";
import { NotificacionesService } from "../../services/notificacionesService.js";
import { createUsuarioRouter } from "../../routes/usuarioRoutes.js";
import { PedidoController } from "../../controllers/pedidoController.js";
import { PedidoService } from "../../services/pedidoService.js";
import { ProductoService } from "../../services/productoService.js";
import { ProductoController } from "../../controllers/productoController.js";
import { NotificacionesRepository } from "../../repositories/notificacionesRepository.js";
import { UsuarioRepository } from "../../repositories/usuarioRepository.js";
import { PedidoRepository } from "../../repositories/pedidoRepository.js";
import { ProductoRepository } from "../../repositories/productoRepository.js";
import { connect, closeDatabase, clearDatabase } from "../utils/mongoMemory.js";
import { TestDataFactory } from "../fixtures/testData.js";
import { Usuario } from "../../models/Usuario.js";
import mongoose from "mongoose";
import { describe, test, expect, beforeEach, beforeAll, afterAll, afterEach } from "@jest/globals";

/**
 * Notificaciones API Integration Tests con BD en memoria
 */
let app;
let usuario;

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

  // Crear instancias de repositorios
  const notificacionesRepository = new NotificacionesRepository();
  const usuarioRepository = new UsuarioRepository();
  const pedidoRepository = new PedidoRepository();
  const productoRepository = new ProductoRepository();

  // Crear servicios
  const notificacionesService = new NotificacionesService(
    notificacionesRepository,
    usuarioRepository
  );
  const productoService = new ProductoService(productoRepository);
  const pedidoService = new PedidoService(
    pedidoRepository,
    productoService,
    usuarioRepository,
    notificacionesService
  );

  // Crear controladores
  const notificacionesController = new NotificacionesController(notificacionesService);
  const productoController = new ProductoController(productoService);
  const pedidoController = new PedidoController(pedidoService);

  // Montar routers
  app.use("/usuarios", createUsuarioRouter(productoController, pedidoController, notificacionesController));
  app.use("/notificaciones", createNotificacionesRouter(notificacionesController));
}

// Crear datos de prueba antes de cada test
beforeEach(async () => {
  const usuarioData = TestDataFactory.createUsuario({
    nombre: "Juan Usuario"
  });
  usuario = await Usuario.create(usuarioData);
});

describe("API Notificaciones - Integration Tests (BD Real)", () => {
  describe("GET /usuarios/:usuarioId/notificaciones/unread", () => {
    test("Obtener notificaciones no leídas con éxito", async () => {
      // Crear notificaciones no leídas
      const notificacionesRepository = new NotificacionesRepository();
      const notif1 = TestDataFactory.createNotificacion(usuario, {
        leida: false,
        titulo: "Pedido confirmado"
      });
      const notif2 = TestDataFactory.createNotificacion(usuario, {
        leida: false,
        titulo: "Pedido enviado"
      });

      await notificacionesRepository.create(notif1);
      await notificacionesRepository.create(notif2);

      const res = await request(app)
        .get(`/usuarios/${usuario._id.toString()}/notificaciones/unread`)
        .expect(200);


      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
    });

    test("Error con ID de usuario inválido", async () => {
      const res = await request(app)
        .get("/usuarios/invalid-id/notificaciones/unread")
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });

    test("Error cuando el usuario no existe", async () => {
      const usuarioIdInexistente = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .get(`/usuarios/${usuarioIdInexistente}/notificaciones/unread`)
        .expect(404);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /usuarios/:usuarioId/notificaciones/read", () => {
    test("Obtener notificaciones leídas con éxito", async () => {
      // Crear notificaciones leídas
      const notificacionesRepository = new NotificacionesRepository();
      const notif1 = TestDataFactory.createNotificacion(usuario, {
        leida: true,
        titulo: "Pedido entregado"
      });
      const notif2 = TestDataFactory.createNotificacion(usuario, {
        leida: true,
        titulo: "Pago confirmado"
      });
      const notif3 = TestDataFactory.createNotificacion(usuario, {
        leida: false,
        titulo: "Pago asegurado"
      });

      await notificacionesRepository.create(notif1);
      await notificacionesRepository.create(notif2);

      const res = await request(app)
        .get(`/usuarios/${usuario._id.toString()}/notificaciones/read`)
        .expect(200);


      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
    });

    test("Error con ID de usuario inválido", async () => {
      const res = await request(app)
        .get("/usuarios/invalid-id/notificaciones/read")
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("PATCH /notificaciones/:id/read", () => {
    test("Marcar notificación como leída con éxito", async () => {
      // Crear una notificación no leída
      const notificacionesRepository = new NotificacionesRepository();
      const notif = TestDataFactory.createNotificacion(usuario, {
        leida: false
      });
      const notifCreada = await notificacionesRepository.create(notif);

      const res = await request(app)
        .patch(`/notificaciones/${notifCreada._id.toString()}/read`)
        .expect(200);


      expect(res.body.notificacion.leida).toBe(true);
    });

    test("Error con ID de notificación inválido", async () => {
      const res = await request(app)
        .patch("/notificaciones/invalid-id/read")
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });

    test("Error cuando la notificación no existe", async () => {
      const notifIdInexistente = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .patch(`/notificaciones/${notifIdInexistente}/read`)
        .expect(404);

      expect(res.body).toHaveProperty("error");
    });

    test("Error al intentar marcar como leída una notificación ya leída", async () => {
      // Crear una notificación leída
      const notificacionesRepository = new NotificacionesRepository();
      const notif = TestDataFactory.createNotificacion(usuario, {
        leida: true
      });
      const notifCreada = await notificacionesRepository.create(notif);

      const res = await request(app)
        .patch(`/notificaciones/${notifCreada._id.toString()}/read`)
        .expect(409);

      expect(res.body).toHaveProperty("error");
    });
  });
});
