import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import pedidoRoutes from "../routes/pedidoRoutes.js";
import { PedidoController } from "../controllers/pedidoController.js";
import { PedidoService } from "../services/pedidoService.js";

// Setup Express app para test
const app = express();
app.use(bodyParser.json());
const pedidoController = new PedidoController();
app.use("/pedidos", pedidoRoutes);

describe("API Pedidos", () => {
  let pedidoId;

  const payloadCrearPedido = {
    comprador: {
      id: 1,
      nombre: "Matias",
      email: "matias@email.com",
      telefono: "1234567890",
      tipoUsuario: "CLIENTE"
    },
    items: [
      {
        producto: {
          id: 101,
          vendedor: {
            id: 2,
            nombre: "Juan",
            email: "juan@email.com",
            telefono: "0987654321",
            tipoUsuario: "VENDEDOR"
          },
          titulo: "Laptop",
          status: "DISPONIBLE",
          descripcion: "Laptop gamer",
          categorias: ["Electrónica"],
          precio: 5000,
          moneda: "USD",
          stock: 10,
          fotos: [],
          activo: true
        },
        cantidad: 2,
        precioUnitario: 5000
      }
    ],
    moneda: "USD",
    direccionEntrega: {
      calle: "Av. Siempre Viva",
      altura: 742,
      ciudad: "Springfield",
      provincia: "SP",
      pais: "USA"
    }
  };

  test("Crear pedido - POST /pedidos", async () => {
    const res = await request(app)
      .post("/pedidos")
      .send(payloadCrearPedido)
      .expect(201);

    expect(res.body).toHaveProperty("message", "Pedido creado con éxito");
    expect(res.body.pedido).toHaveProperty("id");
    expect(res.body.pedido).toHaveProperty("items");
    expect(res.body.pedido).toHaveProperty("estado", "PENDIENTE");
    expect(res.body.pedido).toHaveProperty("direccionEntrega");

    // Guardamos el id para cancelar luego
    pedidoId = res.body.pedido.id;
  });

  test("Cancelar pedido - POST /pedidos/:id/cancelar", async () => {
    const res = await request(app)
      .post(`/pedidos/${pedidoId}/cancelar`)
      .send({ comprador: { id: 1, nombre: "Matias" } })
      .expect(200);

    expect(res.body).toHaveProperty("message", "Pedido cancelado con éxito");
    expect(res.body.pedido).toHaveProperty("estado", "CANCELADO");
    expect(res.body.pedido.id).toBe(pedidoId);
  });

  test("Cancelar pedido no autorizado - POST /pedidos/:id/cancelar", async () => {
    const res = await request(app)
      .post(`/pedidos/${pedidoId}/cancelar`)
      .send({ comprador: { id: 99, nombre: "Otro Usuario" } })
      .expect(400);

    expect(res.body).toHaveProperty("error", "No autorizado: solo el comprador puede cancelar su pedido");
  });

  test("Obtener pedidos de un usuario - GET /pedidos/usuario/:id", async () => {
  // Creamos un pedido nuevo primero
  const resCrear = await request(app)
    .post("/pedidos")
    .send(payloadCrearPedido)
    .expect(201);

  const compradorId = payloadCrearPedido.comprador.id;

  // Hacemos el GET por usuario
  const resGet = await request(app)
    .get(`/pedidos/usuario/${compradorId}`)
    .expect(200);

  expect(Array.isArray(resGet.body)).toBe(true);
  expect(resGet.body.length).toBeGreaterThan(0);
  expect(resGet.body[0]).toHaveProperty("id");
  expect(resGet.body[0]).toHaveProperty("comprador");
  expect(resGet.body[0].comprador.id).toBe(compradorId);
});

test("Marcar pedido como enviado - PATCH /pedidos/:id/enviar", async () => {
  // Creamos un pedido
  const resCrear = await request(app)
    .post("/pedidos")
    .send(payloadCrearPedido)
    .expect(201);

  const pedidoId = resCrear.body.pedido.id;

  // PATCH con vendedor autorizado
  const patchBody = {
    vendedor: {
      id: 2,
      nombre: "Juan",
      email: "juan@email.com",
      telefono: "0987654321",
      tipoUsuario: "VENDEDOR"
    }
  };

  const resPatch = await request(app)
    .patch(`/pedidos/${pedidoId}/enviar`)
    .send(patchBody)
    .expect(200);

  expect(resPatch.body).toHaveProperty("message", "Pedido marcado como enviado");
  expect(resPatch.body.pedido).toHaveProperty("estado", "ENVIADO");
  expect(resPatch.body.pedido.id).toBe(pedidoId);
});

test("Marcar pedido como enviado no autorizado - PATCH /pedidos/:id/enviar", async () => {
  // Creamos un pedido
  const resCrear = await request(app)
    .post("/pedidos")
    .send(payloadCrearPedido)
    .expect(201);

  const pedidoId = resCrear.body.pedido.id;

  // PATCH con vendedor NO autorizado
  const patchBody = {
    vendedor: {
      id: 999, // id que no coincide con el vendedor real
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

  expect(resPatch.body).toHaveProperty("error", "No autorizado para marcar este pedido como enviado");
});
});