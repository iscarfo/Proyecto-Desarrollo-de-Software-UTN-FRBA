import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { PedidoService } from "../../services/pedidoService.js";
import { Pedido } from "../../domain/pedido/Pedido.js";
import { ItemPedido } from "../../domain/pedido/ItemPedido.js";
import { EstadoPedido } from "../../domain/pedido/enums.js";
import { InvalidIdError, NotFoundError, ValidationError } from "../../errors/AppError.js";

describe("PedidoService - Lógica de negocio de pedidos", () => {
  let pedidoService;
  let mockPedidoRepository;
  let mockProductoService;
  let mockUsuarioRepository;
  let mockNotificacionesService;

  beforeEach(() => {
    // Configurar mocks
    mockPedidoRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByCompradorId: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdateEstado: jest.fn()
    };

    mockProductoService = {
      buscarProductoPorId: jest.fn(),
      tieneStockSuficiente: jest.fn(),
      disminuirStock: jest.fn(),
      aumentarStock: jest.fn(),
      aumentarCantidadVentas: jest.fn()
    };

    mockUsuarioRepository = {
      findById: jest.fn()
    };

    mockNotificacionesService = {
      despacharPorEstado: jest.fn()
    };

    pedidoService = new PedidoService(
      mockPedidoRepository,
      mockProductoService,
      mockUsuarioRepository,
      mockNotificacionesService
    );
  });

  // ========================
  // Tests de listarPedidos
  // ========================
  describe("listarPedidos()", () => {
    test("retorna lista de todos los pedidos", async () => {
      const pedidosMock = [
        { _id: "ped-1", estado: EstadoPedido.PENDIENTE },
        { _id: "ped-2", estado: EstadoPedido.CONFIRMADO }
      ];
      mockPedidoRepository.findAll.mockResolvedValue(pedidosMock);

      const resultado = await pedidoService.listarPedidos();

      expect(resultado).toEqual(pedidosMock);
      expect(mockPedidoRepository.findAll).toHaveBeenCalled();
    });

    test("retorna array vacío si no hay pedidos", async () => {
      mockPedidoRepository.findAll.mockResolvedValue([]);

      const resultado = await pedidoService.listarPedidos();

      expect(resultado).toEqual([]);
    });
  });

  // ========================
  // Tests de obtenerPedidosDeUsuario
  // ========================
  describe("obtenerPedidosDeUsuario()", () => {
    test("retorna pedidos del usuario con ID válido", async () => {
      const usuarioId = "507f1f77bcf86cd799439011";
      const pedidosMock = [
        { _id: "ped-1", compradorId: usuarioId },
        { _id: "ped-2", compradorId: usuarioId }
      ];
      mockPedidoRepository.findByCompradorId.mockResolvedValue(pedidosMock);

      const resultado = await pedidoService.obtenerPedidosDeUsuario(usuarioId);

      expect(resultado).toEqual(pedidosMock);
      expect(mockPedidoRepository.findByCompradorId).toHaveBeenCalledWith(usuarioId);
    });

    test("lanza InvalidIdError para ID de usuario inválido", async () => {
      const usuarioIdInvalido = "invalid-id";

      await expect(
        pedidoService.obtenerPedidosDeUsuario(usuarioIdInvalido)
      ).rejects.toThrow(InvalidIdError);
    });

    test("retorna array vacío si usuario no tiene pedidos", async () => {
      const usuarioId = "507f1f77bcf86cd799439011";
      mockPedidoRepository.findByCompradorId.mockResolvedValue([]);

      const resultado = await pedidoService.obtenerPedidosDeUsuario(usuarioId);

      expect(resultado).toEqual([]);
    });
  });

  // ========================
  // Tests de cancelarPedido
  // ========================
  describe("cancelarPedido()", () => {
    let pedidoId, compradorId;

    beforeEach(() => {
      pedidoId = "507f1f77bcf86cd799439020";
      compradorId = "507f1f77bcf86cd799439011";

      mockPedidoRepository.findById.mockResolvedValue({
        _id: pedidoId,
        compradorId,
        estado: EstadoPedido.PENDIENTE,
        items: [
          { productoId: "prod-1", cantidad: 2, precioUnitario: 50 }
        ]
      });

      mockProductoService.aumentarStock.mockResolvedValue({});
      mockNotificacionesService.despacharPorEstado.mockResolvedValue(undefined);
      mockPedidoRepository.findByIdAndUpdateEstado.mockResolvedValue({
        _id: pedidoId,
        estado: EstadoPedido.CANCELADO
      });
    });

    test("cancela un pedido válido del comprador autorizado", async () => {
      const resultado = await pedidoService.cancelarPedido(pedidoId, compradorId);

      expect(resultado.estado).toBe(EstadoPedido.CANCELADO);
      expect(mockProductoService.aumentarStock).toHaveBeenCalled();
    });

    test("lanza error si el pedido no existe", async () => {
      mockPedidoRepository.findById.mockResolvedValue(null);

      await expect(
        pedidoService.cancelarPedido(pedidoId, compradorId)
      ).rejects.toThrow(NotFoundError);
    });

    test("lanza UnauthorizedError si comprador no coincide", async () => {
      const compradorNoAutorizado = "507f1f77bcf86cd799439099";

      await expect(
        pedidoService.cancelarPedido(pedidoId, compradorNoAutorizado)
      ).rejects.toThrow();
    });

    test("lanza error si el pedido fue cancelado", async () => {
      mockPedidoRepository.findById.mockResolvedValue({
        _id: pedidoId,
        compradorId,
        estado: EstadoPedido.CANCELADO,
        items: []
      });

      await expect(
        pedidoService.cancelarPedido(pedidoId, compradorId)
      ).rejects.toThrow();
    });

    test("recupera stock de los productos al cancelar", async () => {
      await pedidoService.cancelarPedido(pedidoId, compradorId);

      expect(mockProductoService.aumentarStock).toHaveBeenCalled();
    });
  });

  // ========================
  // Tests de marcarComoEnviado
  // ========================
  describe("marcarComoEnviado()", () => {
    let pedidoId, vendedorId;

    beforeEach(() => {
      pedidoId = "507f1f77bcf86cd799439020";
      vendedorId = "507f1f77bcf86cd799439012";

      mockPedidoRepository.findById.mockResolvedValue({
        _id: pedidoId,
        vendedorId,
        estado: EstadoPedido.CONFIRMADO,
        items: [
          { productoId: "prod-1", cantidad: 2, precioUnitario: 50 }
        ]
      });

      mockProductoService.aumentarCantidadVentas.mockResolvedValue({});
      mockNotificacionesService.despacharPorEstado.mockResolvedValue(undefined);
      mockPedidoRepository.findByIdAndUpdateEstado.mockResolvedValue({
        _id: pedidoId,
        estado: EstadoPedido.ENVIADO
      });
    });

    test("marca un pedido como enviado correctamente", async () => {
      const resultado = await pedidoService.marcarComoEnviado(pedidoId, vendedorId);

      expect(resultado.estado).toBe(EstadoPedido.ENVIADO);
    });

    test("incrementa la cantidad de ventas de los productos", async () => {
      await pedidoService.marcarComoEnviado(pedidoId, vendedorId);

      expect(mockProductoService.aumentarCantidadVentas).toHaveBeenCalled();
    });

    test("lanza error si el pedido fue enviado", async () => {
      mockPedidoRepository.findById.mockResolvedValue({
        _id: pedidoId,
        vendedorId,
        estado: EstadoPedido.ENVIADO,
        items: []
      });

      await expect(
        pedidoService.marcarComoEnviado(pedidoId, vendedorId)
      ).rejects.toThrow();
    });

    test("lanza error si el pedido fue cancelado", async () => {
      mockPedidoRepository.findById.mockResolvedValue({
        _id: pedidoId,
        vendedorId,
        estado: EstadoPedido.CANCELADO,
        items: []
      });

      await expect(
        pedidoService.marcarComoEnviado(pedidoId, vendedorId)
      ).rejects.toThrow();
    });
  });

  // ========================
  // Tests de actualizarEstadoPedido
  // ========================
  describe("actualizarEstadoPedido()", () => {
    let pedidoId;

    beforeEach(() => {
      pedidoId = "507f1f77bcf86cd799439020";
    });

    test("actualiza el estado del pedido correctamente", async () => {
      mockPedidoRepository.findById.mockResolvedValue({
        _id: pedidoId,
        estado: EstadoPedido.PENDIENTE,
        items: [
          { productoId: "prod-1", cantidad: 2, precioUnitario: 50 }
        ]
      });

      mockPedidoRepository.findByIdAndUpdateEstado.mockResolvedValue({
        _id: pedidoId,
        estado: EstadoPedido.CONFIRMADO
      });

      const resultado = await pedidoService.actualizarEstadoPedido(
        pedidoId,
        EstadoPedido.CONFIRMADO
      );

      expect(resultado.estado).toBe(EstadoPedido.CONFIRMADO);
    });

    test("lanza InvalidIdError para ID inválido", async () => {
      await expect(
        pedidoService.actualizarEstadoPedido("invalid-id", EstadoPedido.CONFIRMADO)
      ).rejects.toThrow(InvalidIdError);
    });

    test("lanza error si el pedido no existe", async () => {
      mockPedidoRepository.findById.mockResolvedValue(null);

      await expect(
        pedidoService.actualizarEstadoPedido(pedidoId, EstadoPedido.CONFIRMADO)
      ).rejects.toThrow(NotFoundError);
    });

    test("lanza error si intenta cancelar un pedido ya cancelado", async () => {
      mockPedidoRepository.findById.mockResolvedValue({
        _id: pedidoId,
        estado: EstadoPedido.CANCELADO,
        items: []
      });

      await expect(
        pedidoService.actualizarEstadoPedido(pedidoId, EstadoPedido.CANCELADO)
      ).rejects.toThrow();
    });

    test("registra el cambio de estado en el historial", async () => {
      mockPedidoRepository.findById.mockResolvedValue({
        _id: pedidoId,
        estado: EstadoPedido.PENDIENTE,
        historialEstados: [],
        items: [
          { productoId: "prod-1", cantidad: 2, precioUnitario: 50 }
        ]
      });

      mockPedidoRepository.findByIdAndUpdateEstado.mockResolvedValue({
        _id: pedidoId,
        estado: EstadoPedido.CONFIRMADO,
        historialEstados: [
          { estado: EstadoPedido.PENDIENTE, fecha: expect.any(Date) },
          { estado: EstadoPedido.CONFIRMADO, fecha: expect.any(Date) }
        ]
      });

      const resultado = await pedidoService.actualizarEstadoPedido(
        pedidoId,
        EstadoPedido.CONFIRMADO
      );

      expect(resultado.historialEstados).toBeDefined();
      expect(resultado.historialEstados.length).toBeGreaterThan(0);
    });
  });
});
