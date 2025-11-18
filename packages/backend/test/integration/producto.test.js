import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { createProductoRouter } from "../../routes/productoRoutes.js";
import { ProductoController } from "../../controllers/productoController.js";
import { ProductoService } from "../../services/productoService.js";
import { ProductoRepository } from "../../repositories/productoRepository.js";
import { UsuarioRepository } from "../../repositories/usuarioRepository.js";
import { connect, closeDatabase, clearDatabase } from "../utils/mongoMemory.js";
import { TestDataFactory } from "../fixtures/testData.js";
import { Usuario } from "../../models/Usuario.js";
import { describe, test, expect, beforeEach, beforeAll, afterAll, afterEach } from "@jest/globals";

/**
 * Producto API Integration Tests con BD en memoria
 */
let app;
let vendedor;
let productoRepository;
let usuarioRepository;
let productoService;

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
  productoRepository = new ProductoRepository();
  usuarioRepository = new UsuarioRepository();

  // Crear servicio
  productoService = new ProductoService(productoRepository);

  // Crear controlador
  const productoController = new ProductoController(productoService);

  // Montar router
  app.use("/productos", createProductoRouter(productoController));
}

// Crear datos de prueba antes de cada test
beforeEach(async () => {
  const vendedorData = TestDataFactory.createUsuario({
    nombre: "María Vendedora",
    rol: "vendedor"
  });
  vendedor = await Usuario.create(vendedorData);
});

describe("API Productos - Integration Tests (BD Real)", () => {
  describe("POST /productos - Crear producto", () => {
    test("Crea un producto exitosamente", async () => {
      const res = await request(app)
        .post("/productos")
        .send({
          usuarioId: vendedor._id.toString(),
          titulo: "Laptop Gaming",
          descripcion: "Laptop de alta performance",
          precio: 1500,
          moneda: "DOLAR_USA",
          stock: 10
        })
        .expect(201);

      expect(res.body._id).toBeDefined();
      expect(res.body.titulo).toBe("Laptop Gaming");
      expect(res.body.precio).toBe(1500);
      expect(res.body.vendedor.toString()).toBe(vendedor._id.toString());
    });

    test("Error si usuarioId no es válido", async () => {
      const res = await request(app)
        .post("/productos")
        .send({
          usuarioId: "invalid-id",
          titulo: "Laptop Gaming",
          descripcion: "Laptop de alta performance",
          precio: 1500,
          moneda: "DOLAR_USA",
          stock: 10
        })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });

    test("Error si faltan campos obligatorios", async () => {
      const res = await request(app)
        .post("/productos")
        .send({
          usuarioId: vendedor._id.toString(),
          titulo: "Laptop Gaming"
        })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });

    test("Error si el usuario no existe", async () => {
      const usuarioInexistente = TestDataFactory.createUsuario()._id.toString();

      const res = await request(app)
        .post("/productos")
        .send({
          usuarioId: usuarioInexistente,
          titulo: "Laptop Gaming",
          descripcion: "Laptop de alta performance",
          precio: 1500,
          moneda: "DOLAR_USA",
          stock: 10
        })
        .expect(500);

      expect(res.body).toHaveProperty("error");
    });

    test("Crea producto con campos opcionales (categorias, fotos)", async () => {
      const res = await request(app)
        .post("/productos")
        .send({
          usuarioId: vendedor._id.toString(),
          titulo: "iPhone 15",
          descripcion: "Smartphone de última generación",
          precio: 999,
          moneda: "DOLAR_USA",
          stock: 20,
          categorias: [],
          fotos: ["https://example.com/iphone.jpg"],
          activo: true
        })
        .expect(201);

      expect(res.body.titulo).toBe("iPhone 15");
      expect(res.body.fotos).toContain("https://example.com/iphone.jpg");
    });
  });

  describe("GET /productos - Listar productos", () => {
    test("Retorna los primeros 100 productos si hay", async () => {
      // Crear 25 productos
      for (let i = 0; i < 25; i++) {
        const productoData = TestDataFactory.createProducto(vendedor, {
          titulo: `Producto ${i + 1}`
        });
        await productoRepository.create(productoData);
      }

      const res = await request(app)
        .get("/productos")
        .query({ page: 1, limit: 100 })
        .expect(200);

      expect(res.body.data.length).toBe(25);
    });

    test("Filtra productos por nombre", async () => {
      const productoData1 = TestDataFactory.createProducto(vendedor, {
        titulo: "Laptop Gaming"
      });
      const productoData2 = TestDataFactory.createProducto(vendedor, {
        titulo: "Monitor LG"
      });

      await productoRepository.create(productoData1);
      await productoRepository.create(productoData2);

      const res = await request(app)
        .get("/productos")
        .query({ page: 1, limit: 10, nombre: "Laptop" })
        .expect(200);

      // Si el filtro funciona, debería encontrar al menos el producto con "Laptop"
      expect(res.body.data.length).toBe(1);
    });
  });

  describe("GET /productos/categorias - Obtener categorías", () => {
    test("Retorna error (500) si no hay categorías en BD", async () => {
      const res = await request(app)
        .get("/productos/categorias")
        .expect(500);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("PUT /productos/:id - Actualizar producto", () => {
    test("Actualiza un producto exitosamente", async () => {
      // Crear un producto
      const productoData = TestDataFactory.createProducto(vendedor, {
        titulo: "Laptop Gaming",
        precio: 1500
      });
      const producto = await productoRepository.create(productoData);

      const res = await request(app)
        .put(`/productos/${producto._id.toString()}`)
        .send({
          titulo: "Laptop Gaming PRO",
          precio: 2000
        })
        .expect(200);

      expect(res.body.titulo).toBe("Laptop Gaming PRO");
      expect(res.body.precio).toBe(2000);
    });

    test("Retorna 500 si el producto no existe", async () => {
      const productoIdInexistente = TestDataFactory.createProducto(vendedor)._id.toString();

      const res = await request(app)
        .put(`/productos/${productoIdInexistente}`)
        .send({
          titulo: "Laptop Actualizada"
        })
        .expect(500);

      expect(res.body).toHaveProperty("error");
    });

    test("Retorna 500 si el ID del producto no es válido", async () => {
      const res = await request(app)
        .put("/productos/invalid-id")
        .send({
          titulo: "Laptop Actualizada"
        })
        .expect(500);

      expect(res.body).toHaveProperty("error");
    });

    test("Error si no se proporciona ningún campo para actualizar", async () => {
      const productoData = TestDataFactory.createProducto(vendedor);
      const producto = await productoRepository.create(productoData);

      const res = await request(app)
        .put(`/productos/${producto._id.toString()}`)
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });

    test("Actualiza solo el campo de stock", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        stock: 10,
        titulo: "Original Title"
      });
      const producto = await productoRepository.create(productoData);

      const res = await request(app)
        .put(`/productos/${producto._id.toString()}`)
        .send({
          stock: 25
        })
        .expect(200);

      expect(res.body.stock).toBe(25);
      expect(res.body.titulo).toBe("Original Title");
    });
  });

  describe("DELETE /productos/:id - Eliminar producto", () => {
    test("Elimina un producto exitosamente", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        titulo: "Laptop Gaming"
      });
      const producto = await productoRepository.create(productoData);

      const res = await request(app)
        .delete(`/productos/${producto._id.toString()}`)
        .expect(200);

      expect(res.body).toHaveProperty("message", "Producto eliminado correctamente");

      // Verificar que fue eliminado
      const productoEliminado = await productoRepository.findById(producto._id.toString());
      expect(productoEliminado).toBeNull();
    });

    test("Retorna 404 si el producto no existe", async () => {
      const productoIdInexistente = TestDataFactory.createProducto(vendedor)._id.toString();

      const res = await request(app)
        .delete(`/productos/${productoIdInexistente}`)
        .expect(404);

      expect(res.body).toHaveProperty("message", "Producto no encontrado");
    });

    test("Error si el ID del producto no es válido", async () => {
      const res = await request(app)
        .delete("/productos/invalid-id")
        .expect(500);

      expect(res.body).toHaveProperty("error");
    });
  });
});
