import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { createPedidoRouter } from "../routes/pedidoRoutes.js";
import { PedidoController } from "../controllers/pedidoController.js";
import { PedidoRepository  } from "../repositories/pedidoRepository.js";
import { PedidoService } from "../services/pedidoService.js";
import { Usuario } from "../domain/usuario/Usuario.js";
import { Producto } from "../domain/producto/Producto.js";
import { ItemPedido } from "../domain/pedido/ItemPedido.js";
import { DireccionEntrega } from "../domain/pedido/DireccionEntrega.js";

// Mock de FactoryNotificacion para no enviar nada real
jest.mock("../domain/notificacion/FactoryNotificacion.js", () => ({
  FactoryNotificacion: {
    crearNotificacionNuevoPedido: jest.fn(),
    crearNotificacionCancelacion: jest.fn(),
    crearNotificacionEnvio: jest.fn()
  }
}));

// Setup Express app
const app = express();
app.use(bodyParser.json());

// Instancias compartidas
const pedidoRepository = new PedidoRepository();
const pedidoService = new PedidoService(pedidoRepository);
const pedidoController = new PedidoController(pedidoService);

beforeEach(() => {
  // Crear un controller nuevo con repositorio limpio
  //pedidoController = new PedidoController();
  app._router = undefined; // reset router
  app.use("/pedidos", createPedidoRouter(pedidoController));
});

// Helper para crear payload
const crearPayloadPedido = () => {
  const comprador = {
    id: "1", // ID como string
    nombre: "Matias",
    email: "matias@email.com",
    telefono: "1234567890",
    tipoUsuario: "CLIENTE"
  };

  const vendedor = {
    id: "2", // string
    nombre: "Juan",
    email: "juan@email.com",
    telefono: "0987654321",
    tipoUsuario: "VENDEDOR"
  };

  const producto = {
    id: "101",
    vendedor: vendedor,
    titulo: "Laptop",
    status: "DISPONIBLE",
    descripcion: "Laptop gamer",
    categorias: ["Electrónica"],
    precio: 5000,
    moneda: "USD",
    stock: 10,
    fotos: [],
    activo: true
  };

  const itemPedido = {
    producto: producto,
    cantidad: 2,
    precioUnitario: 5000
  };

  const direccionEntrega = {
    calle: "Av. Siempre Viva",
    altura: 742,
    piso: "1",
    departamento: "A",
    codPostal: "1431",
    ciudad: "Springfield",
    provincia: "SP",
    pais: "USA",
    lat: -34.6037,
    lon: -58.3816
  };

  return {
    comprador,
    items: [itemPedido],
    moneda: "USD",
    direccionEntrega
  };
};

describe("API Pedidos", () => {
  let pedidoId;

  test("Crear pedido - POST /pedidos", async () => {
    const res = await request(app)
      .post("/pedidos")
      .send(crearPayloadPedido())
      .expect(201);

    expect(res.body).toHaveProperty("message", "Pedido creado con éxito");
    expect(res.body.pedido).toHaveProperty("id");
    pedidoId = res.body.pedido.id; // guardamos para los siguientes tests
  });

  test("Cancelar pedido - PATCH /pedidos/:id/cancelar", async () => {
    // Crear pedido primero
    const resCrear = await request(app)
      .post("/pedidos")
      .send(crearPayloadPedido())
      .expect(201);

    const compradorId = resCrear.body.pedido.comprador.id;
    const pedidoId = resCrear.body.pedido.id;

    const res = await request(app)
      .patch(`/pedidos/${pedidoId}/cancelar`)
      .send({
        comprador: {
          id: compradorId,
          nombre: "Matias",
          email: "matias@email.com",
          telefono: "1234567890",
          tipoUsuario: "CLIENTE"
        }
      })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Pedido cancelado con éxito");
    expect(res.body.pedido).toHaveProperty("estado", "CANCELADO");
    expect(res.body.pedido.id).toBe(pedidoId);
  });

  test("Cancelar pedido no autorizado - PATCH /pedidos/:id/cancelar", async () => {
    const resCrear = await request(app)
      .post("/pedidos")
      .send(crearPayloadPedido())
      .expect(201);

    const pedidoId = resCrear.body.pedido.id;

    const res = await request(app)
      .patch(`/pedidos/${pedidoId}/cancelar`)
      .send({
        comprador: {
          id: "99",
          nombre: "Otro Usuario",
          email: "otro@email.com",
          telefono: "0000000000",
          tipoUsuario: "CLIENTE"
        }
      })
      .expect(400);

    expect(res.body).toHaveProperty(
      "error",
      "No autorizado: solo el comprador puede cancelar su pedido"
    );
  });

  test("No se puede cancelar dos veces un pedido", async () => {
    const resCrear = await request(app)
      .post("/pedidos")
      .send(crearPayloadPedido())
      .expect(201);

    const compradorId = resCrear.body.pedido.comprador.id;
    const pedidoId = resCrear.body.pedido.id;

    // Cancelar primera vez
    await request(app)
      .patch(`/pedidos/${pedidoId}/cancelar`)
      .send({
        comprador: {
          id: compradorId,
          nombre: "Matias",
          email: "matias@email.com",
          telefono: "1234567890",
          tipoUsuario: "CLIENTE"
        }
      })
      .expect(200);

    // Intentar cancelar nuevamente
    const res = await request(app)
      .patch(`/pedidos/${pedidoId}/cancelar`)
      .send({
        comprador: {
          id: compradorId,
          nombre: "Matias",
          email: "matias@email.com",
          telefono: "1234567890",
          tipoUsuario: "CLIENTE"
        }
      })
      .expect(400);

    expect(res.body).toHaveProperty(
      "error",
      "El pedido fue anteriormente cancelado"
    );
  });

  test("Obtener pedidos de un usuario - GET /pedidos/usuario/:id", async () => {
    const resCrear = await request(app)
      .post("/pedidos")
      .send(crearPayloadPedido())
      .expect(201);

    const compradorId = resCrear.body.pedido.comprador.id;

    const resGet = await request(app)
      .get(`/pedidos/usuario/${compradorId}`)
      .expect(200);
    
    console.log("respuesta:", resGet.body);

    expect(Array.isArray(resGet.body)).toBe(true);
    expect(resGet.body.length).toBeGreaterThan(0);
    expect(resGet.body[0].comprador.id).toBe(compradorId);
  });

  test("Marcar pedido como enviado - PATCH /pedidos/:id/enviar", async () => {
    const resCrear = await request(app)
      .post("/pedidos")
      .send(crearPayloadPedido())
      .expect(201);

    const pedidoId = resCrear.body.pedido.id;

    const patchBody = {
      vendedor: resCrear.body.pedido.items[0].producto.vendedor
    };

    const resPatch = await request(app)
      .patch(`/pedidos/${pedidoId}/enviar`)
      .send(patchBody)
      .expect(200);

    expect(resPatch.body).toHaveProperty("message", "Pedido marcado como enviado");
    expect(resPatch.body.pedido).toHaveProperty("estado", "ENVIADO");
  });

  test("Marcar pedido como enviado no autorizado - PATCH /pedidos/:id/enviar", async () => {
    const resCrear = await request(app)
      .post("/pedidos")
      .send(crearPayloadPedido())
      .expect(201);

    const pedidoId = resCrear.body.pedido.id;

    const patchBody = {
      vendedor: {
        id: "999",
        nombre: "Pedro",
        email: "pedro@email.com",
        telefono: "111111111",
        tipoUsuario: "VENDEDOR"
      }
    };

    const resPatch = await request(app)
      .patch(`/pedidos/${pedidoId}/enviar`)
      .send(patchBody)
      .expect(400);

    expect(resPatch.body).toHaveProperty(
      "error",
      "No autorizado para marcar este pedido como enviado"
    );
  });
});