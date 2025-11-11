import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { createPedidoRouter } from "../../routes/pedidoRoutes.js";
import { createUsuarioRouter } from "../../routes/usuarioRoutes.js";
import { PedidoController } from "../../controllers/pedidoController.js";
import { PedidoService } from "../../services/pedidoService.js";
import { jest } from '@jest/globals';
import { ProductoService } from "../../services/productoService.js";
import { NotificacionesService } from "../../services/notificacionesService.js";

// Setup Express app
const app = express();
app.use(bodyParser.json());

// Mocks de repositorios
const mockProductoRepository = {
  findById: jest.fn(),
  save: jest.fn(),
  tieneStockSuficiente: jest.fn().mockResolvedValue(true),
  disminuirStock: jest.fn().mockResolvedValue(true),
  aumentarStock: jest.fn().mockResolvedValue(true),
  aumentarCantidadVentas: jest.fn().mockResolvedValue(true),
  buscarProductoPorId: jest.fn(),
  findAll: jest.fn()
};

const mockPedidoRepository = {
  save: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdateEstado: jest.fn(),
  findByCompradorId: jest.fn(),
  create: jest.fn()
};

const mockUsuarioRepository = {
  findById: jest.fn(),
  findAll: jest.fn()
};

const mockNotificacionesRepository = {
  create: jest.fn(),
  findAll: jest.fn()
};

// Datos simulados - Usar ObjectIds válidos de MongoDB
const compradorId = "507f1f77bcf86cd799439011";
const otroCompradorId = "507f1f77bcf86cd799439012";
const vendedorId = "507f1f77bcf86cd799439013";
const otroVendedorId = "507f1f77bcf86cd799439014";
const productoId = "507f1f77bcf86cd799439015";

const productoMock = {
  id: productoId,
  _id: productoId,
  vendedor: { id: vendedorId, _id: vendedorId },
  stock: 10,
  precio: 5000
};

const itemPedidoMock = {
  productoId: productoId,
  cantidad: 2,
  precioUnitario: 5000
};

let pedidoMock;

beforeEach(() => {
  const pedidoId = "507f1f77bcf86cd799439016";
  pedidoMock = {
    id: pedidoId,
    _id: pedidoId,
    compradorId,
    items: [itemPedidoMock],
    moneda: "USD",
    direccionEntrega: {},
    estado: "PENDIENTE",
    historialEstados: []
  };

  // Configurar mocks
  mockProductoRepository.findById.mockResolvedValue(productoMock);
  mockProductoRepository.save.mockImplementation((producto) => 
    Promise.resolve(producto)
  );
  mockProductoRepository.buscarProductoPorId.mockResolvedValue(productoMock);
  mockProductoRepository.findAll.mockResolvedValue([productoMock]);
  
  mockPedidoRepository.save.mockResolvedValue(pedidoMock);
  mockPedidoRepository.findById.mockResolvedValue(pedidoMock);
  mockPedidoRepository.findAll.mockResolvedValue([pedidoMock]);
  mockPedidoRepository.findByCompradorId.mockResolvedValue([pedidoMock]);
  mockPedidoRepository.create.mockResolvedValue(pedidoMock);
  
  mockPedidoRepository.findByIdAndUpdateEstado.mockImplementation((id, estado, quien, motivo) => {
    const updated = { ...pedidoMock, estado };
    if (!updated.historialEstados) updated.historialEstados = [];
    updated.historialEstados.push({ fecha: new Date(), estado, quien, motivo });
    return Promise.resolve(updated);
  });

  mockUsuarioRepository.findById.mockResolvedValue({
    _id: compradorId,
    nombre: "Usuario Test",
    email: "test@test.com"
  });

  mockNotificacionesRepository.create.mockResolvedValue({});

  app._router = undefined; // reset router

  // Crear servicios
  const productoService = new ProductoService(mockProductoRepository);
  const notificacionesService = new NotificacionesService(mockNotificacionesRepository, mockUsuarioRepository);
  const pedidoService = new PedidoService(mockPedidoRepository, productoService, mockUsuarioRepository, notificacionesService);
  const pedidoController = new PedidoController(pedidoService);
  
  // Mock del notificacionesController
  const mockNotificacionesController = {
    obtenerNotificacionesNoLeidas: jest.fn(),
    obtenerNotificacionesLeidas: jest.fn()
  };
  
  // Mock del productoController
  const mockProductoController = {
    buscarProductoPorVendedor: jest.fn()
  };
  
  // Montar routers
  app.use("/pedidos", createPedidoRouter(pedidoController));
  app.use("/usuarios", createUsuarioRouter(mockProductoController, pedidoController, mockNotificacionesController));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("API Pedidos - Integration Tests", () => {

  describe("POST /pedidos - Crear pedido", () => {
    test("Listar todos los pedidos", async () => {
      const res = await request(app)
        .get("/pedidos")
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("DELETE /pedidos/:pedidoId - Cancelar pedido", () => {
    test("Cancelar pedido exitosamente", async () => {
      const res = await request(app)
        .delete(`/pedidos/${pedidoMock.id}`)
        .send({ compradorId });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Pedido cancelado con éxito");
    });

    test("Error al cancelar con comprador no autorizado", async () => {
      const res = await request(app)
        .delete(`/pedidos/${pedidoMock.id}`)
        .send({ compradorId: "507f1f77bcf86cd799439099" })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /usuarios/comprador/:usuarioId/pedidos - Obtener pedidos por usuario", () => {
    test("Obtener pedidos del usuario exitosamente", async () => {
      const res = await request(app)
        .get(`/usuarios/comprador/${compradorId}/pedidos`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("PATCH /pedidos/:pedidoId/enviado - Marcar como enviado", () => {
    test("Marcar pedido como enviado exitosamente", async () => {
      const res = await request(app)
        .patch(`/pedidos/${pedidoMock.id}/enviado`)
        .send({ vendedorId });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Pedido marcado como enviado");
    });
  });

});
