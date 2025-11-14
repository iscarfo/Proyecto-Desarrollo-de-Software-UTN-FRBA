import { describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from "@jest/globals";
import { ProductoService } from "../../services/productoService.js";
import { ProductoRepository } from "../../repositories/productoRepository.js";
import { UsuarioRepository } from "../../repositories/usuarioRepository.js";
import { InvalidIdError, NotFoundError } from "../../errors/AppError.js";
import { connect, closeDatabase, clearDatabase } from "../utils/mongoMemory.js";
import { TestDataFactory } from "../fixtures/testData.js";
import { Usuario } from "../../models/Usuario.js";
import mongoose from "mongoose";

/**
 * ProductoService Tests con MongoDB en memoria
 * Usa repositorios reales y datos persistentes en BD
 */
describe("ProductoService - Lógica de negocio de productos (BD Real)", () => {
  let productoService;
  let productoRepository;
  let usuarioRepository;

  let vendedor;

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
    usuarioRepository = new UsuarioRepository();
    productoRepository = new ProductoRepository();
    productoService = new ProductoService(productoRepository);

    // Crear vendedor en la BD
    const vendedorData = TestDataFactory.createUsuario({
      nombre: "María Vendedora",
      rol: "vendedor"
    });
    vendedor = await Usuario.create(vendedorData);
  });

  describe("buscarProductoPorId()", () => {
    test("retorna producto si existe", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        titulo: "Laptop Gaming"
      });
      const producto = await productoRepository.create(productoData);

      const resultado = await productoService.buscarProductoPorId(producto._id.toString());
      
      expect(resultado).toBeDefined();
      expect(resultado._id.toString()).toBe(producto._id.toString());
      expect(resultado.titulo).toBe("Laptop Gaming");
    });

    test("lanza InvalidIdError para ID inválido", async () => {
      await expect(
        productoService.buscarProductoPorId("invalid-id")
      ).rejects.toThrow(InvalidIdError);
    });

    test("lanza error si el producto no existe", async () => {
      const productoIdInexistente = new mongoose.Types.ObjectId();

      await expect(
        productoService.buscarProductoPorId(productoIdInexistente.toString())
      ).rejects.toThrow(Error);
    });
  });

  describe("tieneStockSuficiente()", () => {
    test("retorna true si hay stock suficiente", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        stock: 10
      });
      const producto = await productoRepository.create(productoData);

      const resultado = await productoService.tieneStockSuficiente(
        producto._id.toString(),
        5
      );

      expect(resultado).toBe(true);
    });

    test("retorna false si no hay stock suficiente", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        stock: 3
      });
      const producto = await productoRepository.create(productoData);

      const resultado = await productoService.tieneStockSuficiente(
        producto._id.toString(),
        5
      );

      expect(resultado).toBe(false);
    });

    test("retorna true si stock es igual a cantidad solicitada", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        stock: 5
      });
      const producto = await productoRepository.create(productoData);

      const resultado = await productoService.tieneStockSuficiente(
        producto._id.toString(),
        5
      );

      expect(resultado).toBe(true);
    });
  });

  describe("disminuirStock()", () => {
    test("disminuye el stock correctamente", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        stock: 10
      });
      const producto = await productoRepository.create(productoData);

      await productoService.disminuirStock(producto._id.toString(), 2);

      const productoActualizado = await productoRepository.findById(producto._id.toString());
      expect(productoActualizado.stock).toBe(8);
    });

    test("no deja stock negativo", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        stock: 2
      });
      const producto = await productoRepository.create(productoData);

      await productoService.disminuirStock(producto._id.toString(), 5);

      const productoActualizado = await productoRepository.findById(producto._id.toString());
      expect(productoActualizado.stock).toBe(0);
    });
  });

  describe("aumentarStock()", () => {
    test("incrementa el stock correctamente", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        stock: 5
      });
      const producto = await productoRepository.create(productoData);

      const resultado = await productoService.aumentarStock(producto._id.toString(), 3);

      expect(resultado.stock).toBe(8);
    });

    test("maneja stock inicial nulo", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        stock: null
      });
      const producto = await productoRepository.create(productoData);

      const resultado = await productoService.aumentarStock(producto._id.toString(), 5);

      expect(resultado.stock).toBeGreaterThan(0);
    });
  });

  describe("aumentarCantidadVentas()", () => {
    test("incrementa totalVendido correctamente", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        totalVendido: 10
      });
      const producto = await productoRepository.create(productoData);

      const resultado = await productoService.aumentarCantidadVentas(
        producto._id.toString(),
        5
      );

      expect(resultado.totalVendido).toBe(15);
    });

    test("inicializa totalVendido en 0 si es nulo", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        totalVendido: null
      });
      const producto = await productoRepository.create(productoData);

      const resultado = await productoService.aumentarCantidadVentas(
        producto._id.toString(),
        3
      );

      expect(resultado.totalVendido).toBe(3);
    });
  });

  describe("buscarPrecioUnitario()", () => {
    test("retorna el precio del producto", async () => {
      const productoData = TestDataFactory.createProducto(vendedor, {
        precio: 1500
      });
      const producto = await productoRepository.create(productoData);

      const resultado = await productoService.buscarPrecioUnitario(producto._id.toString());

      expect(resultado).toBe(1500);
    });
  });

  describe("eliminarProducto()", () => {
    test("llama al método delete del repositorio", async () => {
      const productoData = TestDataFactory.createProducto(vendedor);
      const producto = await productoRepository.create(productoData);

      await productoService.eliminarProducto(producto._id.toString());

      const productoEliminado = await productoRepository.findById(producto._id.toString());
      expect(productoEliminado).toBeNull();
    });

    test("lanza InvalidIdError para ID inválido", async () => {
      await expect(
        productoService.eliminarProducto("invalid-id")
      ).rejects.toThrow(InvalidIdError);
    });
  });

  describe("listarProductos()", () => {
    test("retorna productos paginados", async () => {
      // Crear 15 productos
      for (let i = 0; i < 15; i++) {
        const productoData = TestDataFactory.createProducto(vendedor, {
          titulo: `Producto ${i + 1}`
        });
        await productoRepository.create(productoData);
      }

      const resultado = await productoService.listarProductos(1, 10, {}, {});

      expect(resultado).toHaveProperty("data");
      expect(resultado).toHaveProperty("pagina", 1);
      expect(resultado).toHaveProperty("totalPaginas");
      expect(resultado.data.length).toBe(10);
    });

    test("limita perPage a máximo 100", async () => {
      const resultado = await productoService.listarProductos(1, 200, {}, {});

      expect(resultado.perPage).toBeLessThanOrEqual(100);
    });

    test("usa página 1 si se envía menor a 1", async () => {
      const resultado = await productoService.listarProductos(0, 10, {}, {});

      expect(resultado.pagina).toBe(1);
    });

    test("retorna segunda página correctamente", async () => {
      // Crear 25 productos
      for (let i = 0; i < 25; i++) {
        const productoData = TestDataFactory.createProducto(vendedor, {
          titulo: `Producto ${i + 1}`
        });
        await productoRepository.create(productoData);
      }

      const resultado = await productoService.listarProductos(2, 10, {}, {});

      expect(resultado.pagina).toBe(2);
      expect(resultado.data.length).toBeLessThanOrEqual(10);
    });
  });
});
