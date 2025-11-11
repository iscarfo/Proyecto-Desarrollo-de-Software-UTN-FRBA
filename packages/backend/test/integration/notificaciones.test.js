import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { createNotificacionesRouter } from "../../routes/notificacionesRoutes.js";
import { NotificacionesController } from "../../controllers/notificacionesController.js";
import { NotificacionesService } from "../../services/notificacionesService.js";
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { createUsuarioRouter } from "../../routes/usuarioRoutes.js";
import { PedidoController } from "../../controllers/pedidoController.js";
import { PedidoService } from "../../services/pedidoService.js";
import { ProductoService } from "../../services/productoService.js";
import { ProductoController } from "../../controllers/productoController.js";

// Setup Express app
const app = express();
app.use(bodyParser.json());

// Mocks de repositorios
const mockNotificacionesRepository = {
  findByUsuarioAndLeida: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  create: jest.fn()
};

const mockUsuarioRepository = {
  findById: jest.fn()
};

const mockPedidoRepository = {
  findByUsuarioAndLeida: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findByCompradorId: jest.fn()
};

const mockProductoRepository = {
  findByUsuarioAndLeida: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findByPage: jest.fn(),
  contarTodos: jest.fn()
};

// IDs de prueba válidos
const usuarioId = new mongoose.Types.ObjectId().toString();
const notificacionId = new mongoose.Types.ObjectId().toString();
const usuarioIdInvalido = "invalid-id";

// Datos simulados
const notificacionMock = {
  _id: notificacionId,
  usuarioId: usuarioId,
  mensaje: "Tu pedido ha sido confirmado",
  fechaAlta: new Date(),
  fechaLectura: null,
  leida: false
};

const notificacionLeidaMock = {
  _id: new mongoose.Types.ObjectId().toString(),
  usuarioId: usuarioId,
  mensaje: "Tu pedido está en camino",
  fechaAlta: new Date(),
  fechaLectura: new Date(),
  leida: true
};

beforeEach(() => {
  // Configurar mocks de repositorios
  mockUsuarioRepository.findById.mockResolvedValue({
    _id: usuarioId,
    nombre: "Usuario Test",
    email: "test@test.com"
  });

  mockNotificacionesRepository.findByUsuarioAndLeida.mockResolvedValue({
    data: [notificacionMock],
    totalColecciones: 1,
    totalPaginas: 1,
    pagina: 1,
    perPage: 10
  });

  mockNotificacionesRepository.findById.mockResolvedValue(notificacionMock);
  mockNotificacionesRepository.save.mockResolvedValue({
    ...notificacionMock,
    leida: true,
    fechaLectura: new Date()
  });

  mockProductoRepository.findByPage.mockResolvedValue([]);
  mockProductoRepository.contarTodos.mockResolvedValue(0);
  mockPedidoRepository.findByCompradorId.mockResolvedValue([]);

  // Reset router
  app._router = undefined;
  
  // Crear servicios
  const productoService = new ProductoService(mockProductoRepository);
  const notificacionesService = new NotificacionesService(mockNotificacionesRepository, mockUsuarioRepository);
  const pedidoService = new PedidoService(mockPedidoRepository, productoService, mockUsuarioRepository, notificacionesService);

  // Crear controladores
  const productoController = new ProductoController(productoService);
  const notificacionesController = new NotificacionesController(notificacionesService);
  const pedidoController = new PedidoController(pedidoService);

  // Montar rutas en el app
  app.use("/usuarios", createUsuarioRouter(productoController, pedidoController, notificacionesController));
  app.use("/notificaciones", createNotificacionesRouter(notificacionesController));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("API Notificaciones - Integration Tests", () => {

  describe("GET /:usuarioId/notificaciones/unread", () => {
    test("Obtener notificaciones no leídas con éxito", async () => {
      const res = await request(app)
        .get(`/usuarios/${usuarioId}/notificaciones/unread`)
        .expect(200);

      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("totalColecciones");
      expect(res.body).toHaveProperty("pagina");
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockNotificacionesRepository.findByUsuarioAndLeida).toHaveBeenCalledWith(usuarioId, false, 1, 10);
    });

    test("Obtener notificaciones no leídas con paginación personalizada", async () => {
      const res = await request(app)
        .get(`/usuarios/${usuarioId}/notificaciones/unread`)
        .query({ page: 2, limit: 5 })
        .expect(200);

      expect(res.body).toHaveProperty("data");
      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockNotificacionesRepository.findByUsuarioAndLeida).toHaveBeenCalledWith(usuarioId, false, 2, 5);
    });

    test("Error con ID de usuario inválido", async () => {
      const res = await request(app)
        .get(`/usuarios/${usuarioIdInvalido}/notificaciones/unread`)
        .expect(400);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("ID");
    });

    test("Error cuando el usuario no existe", async () => {
      mockUsuarioRepository.findById.mockResolvedValueOnce(null);

      const res = await request(app)
        .get(`/usuarios/${usuarioId}/notificaciones/unread`)
        .expect(404);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("Usuario");
    });
  });

  describe("GET /:usuarioId/notificaciones/read", () => {
    test("Obtener notificaciones leídas con éxito", async () => {
      mockNotificacionesRepository.findByUsuarioAndLeida.mockResolvedValueOnce({
        data: [notificacionLeidaMock],
        totalColecciones: 1,
        totalPaginas: 1,
        pagina: 1,
        perPage: 10
      });

      const res = await request(app)
        .get(`/usuarios/${usuarioId}/notificaciones/read`)
        .expect(200);

      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("totalColecciones");
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockNotificacionesRepository.findByUsuarioAndLeida).toHaveBeenCalledWith(usuarioId, true, 1, 10);
    });

    test("Obtener notificaciones leídas con paginación personalizada", async () => {
      const res = await request(app)
        .get(`/usuarios/${usuarioId}/notificaciones/read`)
        .query({ page: 3, limit: 20 })
        .expect(200);

      expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(usuarioId);
      expect(mockNotificacionesRepository.findByUsuarioAndLeida).toHaveBeenCalledWith(usuarioId, true, 3, 20);
    });

    test("Error con ID de usuario inválido", async () => {
      const res = await request(app)
        .get(`/usuarios/${usuarioIdInvalido}/notificaciones/read`)
        .expect(400);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("ID");
    });
  });

  describe("PATCH /notificaciones/:id/read", () => {
    test("Marcar notificación como leída con éxito", async () => {
      const res = await request(app)
        .patch(`/notificaciones/${notificacionId}/read`)
        .expect(200);

      expect(res.body).toHaveProperty("message", "Notificación marcada como leída");
      expect(res.body).toHaveProperty("notificacion");
      expect(res.body.notificacion.leida).toBe(true);
      expect(mockNotificacionesRepository.findById).toHaveBeenCalledWith(notificacionId);
      expect(mockNotificacionesRepository.save).toHaveBeenCalled();
    });

    test("Error con ID de notificación inválido", async () => {
      const res = await request(app)
        .patch(`/notificaciones/${usuarioIdInvalido}/read`)
        .expect(400);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("ID");
    });

    test("Error cuando la notificación no existe", async () => {
      mockNotificacionesRepository.findById.mockResolvedValueOnce(null);

      const res = await request(app)
        .patch(`/notificaciones/${notificacionId}/read`)
        .expect(404);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("Notificación");
    });

    test("Error al intentar marcar como leída una notificación ya leída", async () => {
      mockNotificacionesRepository.findById.mockResolvedValueOnce(notificacionLeidaMock);

      const res = await request(app)
        .patch(`/notificaciones/${notificacionId}/read`)
        .expect(409);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain("ya está marcada como leída");
    });
  });

});
