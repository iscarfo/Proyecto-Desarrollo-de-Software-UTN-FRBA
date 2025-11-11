import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { ProductoService } from "../../services/productoService.js";
import { InvalidIdError } from "../../errors/AppError.js";

describe("ProductoService - Lógica de negocio de productos", () => {
  let productoService;
  let mockProductoRepository;

  beforeEach(() => {
    mockProductoRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findByPage: jest.fn(),
      contarTodos: jest.fn(),
      findByVendedor: jest.fn(),
      contarDeVendedor: jest.fn()
    };

    productoService = new ProductoService(mockProductoRepository);
  });

  describe("buscarProductoPorId()", () => {
    test("retorna producto si existe", async () => {
      const productoMock = { _id: "prod-001", titulo: "Laptop", precio: 1000 };
      mockProductoRepository.findById.mockResolvedValue(productoMock);

      const resultado = await productoService.buscarProductoPorId("507f1f77bcf86cd799439015");
      expect(resultado).toEqual(productoMock);
    });

    test("lanza InvalidIdError para ID inválido", async () => {
      await expect(
        productoService.buscarProductoPorId("invalid-id")
      ).rejects.toThrow(InvalidIdError);
    });

    test("lanza error si el producto no existe", async () => {
      mockProductoRepository.findById.mockResolvedValue(null);
      await expect(
        productoService.buscarProductoPorId("507f1f77bcf86cd799439015")
      ).rejects.toThrow();
    });
  });

  describe("tieneStockSuficiente()", () => {
    test("retorna true si hay stock suficiente", async () => {
      mockProductoRepository.findById.mockResolvedValue({ stock: 10 });
      const resultado = await productoService.tieneStockSuficiente("507f1f77bcf86cd799439015", 5);
      expect(resultado).toBe(true);
    });

    test("retorna false si no hay stock suficiente", async () => {
      mockProductoRepository.findById.mockResolvedValue({ stock: 3 });
      const resultado = await productoService.tieneStockSuficiente("507f1f77bcf86cd799439015", 5);
      expect(resultado).toBe(false);
    });

    test("retorna true si stock es igual a cantidad solicitada", async () => {
      mockProductoRepository.findById.mockResolvedValue({ stock: 5 });
      const resultado = await productoService.tieneStockSuficiente("507f1f77bcf86cd799439015", 5);
      expect(resultado).toBe(true);
    });
  });

  describe("disminuirStock()", () => {
    test("disminuye el stock correctamente", async () => {
      const productoMock = { stock: 10 };
      mockProductoRepository.findById.mockResolvedValue(productoMock);
      mockProductoRepository.save.mockResolvedValue({ stock: 8 });

      await productoService.disminuirStock("507f1f77bcf86cd799439015", 2);
      expect(mockProductoRepository.save).toHaveBeenCalledWith({ stock: 8 });
    });

    test("no deja stock negativo", async () => {
      const productoMock = { stock: 2 };
      mockProductoRepository.findById.mockResolvedValue(productoMock);
      mockProductoRepository.save.mockResolvedValue({ stock: 0 });

      await productoService.disminuirStock("507f1f77bcf86cd799439015", 5);
      expect(mockProductoRepository.save).toHaveBeenCalledWith({ stock: 0 });
    });
  });

  describe("aumentarStock()", () => {
    test("incrementa el stock correctamente", async () => {
      const productoMock = { stock: 5 };
      mockProductoRepository.findById.mockResolvedValue(productoMock);
      mockProductoRepository.save.mockResolvedValue({ stock: 8 });

      const resultado = await productoService.aumentarStock("507f1f77bcf86cd799439015", 3);
      expect(mockProductoRepository.save).toHaveBeenCalled();
      expect(resultado.stock).toBe(8);
    });

    test("maneja stock inicial nulo", async () => {
      const productoMock = { stock: null };
      mockProductoRepository.findById.mockResolvedValue(productoMock);
      mockProductoRepository.save.mockResolvedValue({ stock: 5 });

      await productoService.aumentarStock("507f1f77bcf86cd799439015", 5);
      expect(mockProductoRepository.save).toHaveBeenCalled();
    });
  });

  describe("aumentarCantidadVentas()", () => {
    test("incrementa totalVendido correctamente", async () => {
      const productoMock = { totalVendido: 10 };
      mockProductoRepository.findById.mockResolvedValue(productoMock);
      mockProductoRepository.save.mockResolvedValue({ totalVendido: 15 });

      const resultado = await productoService.aumentarCantidadVentas("507f1f77bcf86cd799439015", 5);
      expect(mockProductoRepository.save).toHaveBeenCalled();
      expect(resultado.totalVendido).toBe(15);
    });

    test("inicializa totalVendido en 0 si es nulo", async () => {
      const productoMock = { totalVendido: null };
      mockProductoRepository.findById.mockResolvedValue(productoMock);
      mockProductoRepository.save.mockResolvedValue({ totalVendido: 3 });

      await productoService.aumentarCantidadVentas("507f1f77bcf86cd799439015", 3);
      expect(mockProductoRepository.save).toHaveBeenCalled();
    });
  });

  describe("buscarPrecioUnitario()", () => {
    test("retorna el precio del producto", async () => {
      mockProductoRepository.findById.mockResolvedValue({ precio: 1500 });
      const resultado = await productoService.buscarPrecioUnitario("507f1f77bcf86cd799439015");
      expect(resultado).toBe(1500);
    });
  });

  describe("eliminarProducto()", () => {
    test("llama al método delete del repositorio", async () => {
      mockProductoRepository.delete.mockResolvedValue({ success: true });
      await productoService.eliminarProducto("507f1f77bcf86cd799439015");
      expect(mockProductoRepository.delete).toHaveBeenCalledWith("507f1f77bcf86cd799439015");
    });

    test("lanza InvalidIdError para ID inválido", async () => {
      await expect(
        productoService.eliminarProducto("invalid-id")
      ).rejects.toThrow(InvalidIdError);
    });
  });

  describe("listarProductos()", () => {
    test("retorna productos paginados", async () => {
      const productosMock = [{ _id: "prod-1" }, { _id: "prod-2" }];
      mockProductoRepository.findByPage.mockResolvedValue(productosMock);
      mockProductoRepository.contarTodos.mockResolvedValue(10);

      const resultado = await productoService.listarProductos(1, 10, {}, {});
      expect(resultado).toHaveProperty("data");
      expect(resultado).toHaveProperty("pagina", 1);
      expect(resultado).toHaveProperty("totalPaginas");
    });

    test("limita perPage a máximo 100", async () => {
      mockProductoRepository.findByPage.mockResolvedValue([]);
      mockProductoRepository.contarTodos.mockResolvedValue(0);

      const resultado = await productoService.listarProductos(1, 200, {}, {});
      expect(resultado.perPage).toBeLessThanOrEqual(100);
    });

    test("usa página 1 si se envía menor a 1", async () => {
      mockProductoRepository.findByPage.mockResolvedValue([]);
      mockProductoRepository.contarTodos.mockResolvedValue(0);

      const resultado = await productoService.listarProductos(0, 10, {}, {});
      expect(resultado.pagina).toBe(1);
    });
  });
});
