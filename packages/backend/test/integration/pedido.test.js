import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { createPedidoRouter } from "../../routes/pedidoRoutes.js";
import { PedidoController } from "../../controllers/pedidoController.js";
import { PedidoService } from "../../services/pedidoService.js";
import { jest } from '@jest/globals';

// Setup Express app
const app = express();
app.use(bodyParser.json());

// Mocks de repositorios
const mockProductoRepository = {
  findById: jest.fn()
};

const mockPedidoRepository = {
  save: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdateEstado: jest.fn()
};

// Datos simulados
const compradorId = "comprador123";
const otroCompradorId = "otroComprador999";
const vendedorId = "vendedor456";
const otroVendedorId = "otroVendedor999";
const productoId = "producto789";

const productoMock = {
  id: productoId,
  vendedor: { id: vendedorId },
  stock: 10
};

const itemPedidoMock = {
  getProductoId: () => productoId,
  getCantidad: () => 2,
  getPrecioUnitario: () => 5000
};

let pedidoMock;

beforeEach(() => {
  pedidoMock = {
    id: "pedido001",
    compradorId,
    items: [itemPedidoMock],
    moneda: "USD",
    direccionEntrega: {},
    estado: "PENDIENTE",
    historialEstados: [],
    actualizarEstado: jest.fn().mockImplementation((nuevoEstado, quien, motivo) => {
      pedidoMock.estado = nuevoEstado;
      pedidoMock.historialEstados.push({ fecha: new Date(), estado: nuevoEstado, quien, motivo });
      return Promise.resolve(pedidoMock);
    }),
    validarStock: jest.fn().mockResolvedValue(true),
    crearPedido: jest.fn()
  };

  // Configurar mocks
  mockProductoRepository.findById.mockResolvedValue(productoMock);
  mockPedidoRepository.save.mockResolvedValue(pedidoMock);
  mockPedidoRepository.findById.mockResolvedValue(pedidoMock);
  mockPedidoRepository.findAll.mockResolvedValue([pedidoMock]);
  mockPedidoRepository.findByIdAndUpdateEstado.mockImplementation((id, estado, quien, motivo) => {
    pedidoMock.estado = estado;
    pedidoMock.historialEstados.push({ fecha: new Date(), estado, quien, motivo });
    return Promise.resolve(pedidoMock);
  });

  app._router = undefined; // reset router
  const pedidoService = new PedidoService(mockPedidoRepository, mockProductoRepository);
  const pedidoController = new PedidoController(pedidoService);
  app.use("/pedidos", createPedidoRouter(pedidoController));
});

describe("API Pedidos - Mocks", () => {

  test("Crear pedido - POST /pedidos", async () => {
    const payload = {
      compradorId,
      items: [{ productoId, cantidad: 2, precioUnitario: 5000 }],
      moneda: "USD",
      direccionEntrega: {}
    };

    const res = await request(app).post("/pedidos").send(payload).expect(201);

    expect(res.body).toHaveProperty("message", "Pedido creado con éxito");
    expect(res.body.pedidoId).toBe(pedidoMock.id);
  });

  test("Cancelar pedido - PATCH /pedidos/:id/cancelar", async () => {
    const res = await request(app)
      .patch(`/pedidos/${pedidoMock.id}/cancelar`)
      .send({ compradorId })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Pedido cancelado con éxito");
    expect(res.body.estado).toBe("CANCELADO");
  });

  test("Cancelar pedido no autorizado - PATCH /pedidos/:id/cancelar", async () => {
    const res = await request(app)
      .patch(`/pedidos/${pedidoMock.id}/cancelar`)
      .send({ compradorId: otroCompradorId })
      .expect(400);

    expect(res.body).toHaveProperty(
      "error",
      "No autorizado: solo el comprador puede cancelar su pedido"
    );
  });

  test("No se puede cancelar dos veces un pedido", async () => {
    // Primera cancelación
    await request(app)
      .patch(`/pedidos/${pedidoMock.id}/cancelar`)
      .send({ compradorId })
      .expect(200);

    // Segunda cancelación falla
    pedidoMock.estado = "CANCELADO"; // Simular estado
    const res = await request(app)
      .patch(`/pedidos/${pedidoMock.id}/cancelar`)
      .send({ compradorId })
      .expect(400);

    expect(res.body).toHaveProperty(
      "error",
      "El pedido fue anteriormente cancelado"
    );
  });

  test("Obtener pedidos de un usuario - GET /pedidos/usuario/:usuarioId", async () => {
    const res = await request(app)
      .get(`/pedidos/usuario/${compradorId}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Marcar pedido como enviado - PATCH /pedidos/:id/enviar", async () => {
    const res = await request(app)
      .patch(`/pedidos/${pedidoMock.id}/enviar`)
      .send({ vendedorId })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Pedido marcado como enviado");
    expect(res.body.estado).toBe("ENVIADO");
  });

  test("No se puede enviar un pedido cancelado", async () => {
  // Paso 1: crear pedido
  const resCrear = await request(app)
    .post("/pedidos")
    .send({
      compradorId,
      items: [{ productoId, cantidad: 2, precioUnitario: 5000 }],
      moneda: "USD",
      direccionEntrega: {}
    })
    .expect(201);

  const pedidoId = resCrear.body.pedidoId;

  // Paso 2: cancelar pedido
  await request(app)
    .patch(`/pedidos/${pedidoId}/cancelar`)
    .send({ compradorId })
    .expect(200);

  // Paso 3: intentar enviar pedido cancelado
  const resEnviar = await request(app)
    .patch(`/pedidos/${pedidoId}/enviar`)
    .send({ vendedorId })
    .expect(400);

  expect(resEnviar.body).toHaveProperty(
    "error",
    "El pedido fue cancelado y no puede enviarse"
  );
});

});