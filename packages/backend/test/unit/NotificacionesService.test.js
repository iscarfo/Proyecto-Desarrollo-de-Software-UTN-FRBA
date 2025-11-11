import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { NotificacionesService } from "../../services/notificacionesService.js";

describe("NotificacionesService - Lógica de negocio de notificaciones", () => {
  let notificacionesService;
  let mockNotificacionesRepository;
  let mockUsuarioRepository;

  beforeEach(() => {
    // Configurar mocks
    mockNotificacionesRepository = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findByUsuarioAndLeida: jest.fn()
    };

    mockUsuarioRepository = {
      findById: jest.fn()
    };

    notificacionesService = new NotificacionesService(
      mockNotificacionesRepository,
      mockUsuarioRepository
    );
  });

  // ========================
  // Tests de obtenerNotificacionesNoLeidas
  // ========================
  describe("obtenerNotificacionesNoLeidas()", () => {
    let usuarioId;

    beforeEach(() => {
      usuarioId = "507f1f77bcf86cd799439011";

      mockUsuarioRepository.findById.mockResolvedValue({
        _id: usuarioId,
        nombre: "Juan"
      });
    });

    test("retorna notificaciones sin leer del usuario", async () => {
      const notificacionesNoLeidas = [
        { _id: "notif-1", leida: false },
        { _id: "notif-2", leida: false }
      ];

      mockNotificacionesRepository.findByUsuarioAndLeida.mockResolvedValue(notificacionesNoLeidas);

      const resultado = await notificacionesService.obtenerNotificacionesNoLeidas(usuarioId);

      expect(resultado).toEqual(notificacionesNoLeidas);
      expect(mockNotificacionesRepository.findByUsuarioAndLeida).toHaveBeenCalledWith(
        usuarioId,
        false,
        1,
        10
      );
    });

    test("retorna array vacío si no hay notificaciones sin leer", async () => {
      mockNotificacionesRepository.findByUsuarioAndLeida.mockResolvedValue([]);

      const resultado = await notificacionesService.obtenerNotificacionesNoLeidas(usuarioId);

      expect(resultado).toEqual([]);
    });

    test("valida la paginación (página mínima 1)", async () => {
      mockNotificacionesRepository.findByUsuarioAndLeida.mockResolvedValue([]);

      await notificacionesService.obtenerNotificacionesNoLeidas(usuarioId, 0, 10);

      expect(mockNotificacionesRepository.findByUsuarioAndLeida).toHaveBeenCalledWith(
        usuarioId,
        false,
        1,
        10
      );
    });

    test("valida el límite (máximo 100)", async () => {
      mockNotificacionesRepository.findByUsuarioAndLeida.mockResolvedValue([]);

      await notificacionesService.obtenerNotificacionesNoLeidas(usuarioId, 1, 200);

      expect(mockNotificacionesRepository.findByUsuarioAndLeida).toHaveBeenCalledWith(
        usuarioId,
        false,
        1,
        100
      );
    });
  });

  // ========================
  // Tests de obtenerNotificacionesLeidas
  // ========================
  describe("obtenerNotificacionesLeidas()", () => {
    let usuarioId;

    beforeEach(() => {
      usuarioId = "507f1f77bcf86cd799439011";

      mockUsuarioRepository.findById.mockResolvedValue({
        _id: usuarioId,
        nombre: "Juan"
      });
    });

    test("retorna notificaciones leídas del usuario", async () => {
      const notificacionesLeidas = [
        { _id: "notif-1", leida: true },
        { _id: "notif-2", leida: true }
      ];

      mockNotificacionesRepository.findByUsuarioAndLeida.mockResolvedValue(notificacionesLeidas);

      const resultado = await notificacionesService.obtenerNotificacionesLeidas(usuarioId);

      expect(resultado).toEqual(notificacionesLeidas);
      expect(mockNotificacionesRepository.findByUsuarioAndLeida).toHaveBeenCalledWith(
        usuarioId,
        true,
        1,
        10
      );
    });
  });

  // ========================
  // Tests de marcarComoLeida
  // ========================
  describe("marcarComoLeida()", () => {
    let notificacionId;

    beforeEach(() => {
      notificacionId = "507f1f77bcf86cd799439030";

      mockNotificacionesRepository.findById.mockResolvedValue({
        _id: notificacionId,
        leida: false,
        mensaje: "Pedido confirmado",
        fechaCreacion: new Date()
      });

      mockNotificacionesRepository.save.mockResolvedValue({
        _id: notificacionId,
        leida: true,
        mensaje: "Pedido confirmado",
        fechaLectura: new Date()
      });
    });

    test("marca una notificación como leída", async () => {
      const resultado = await notificacionesService.marcarComoLeida(notificacionId);

      expect(resultado.leida).toBe(true);
      expect(mockNotificacionesRepository.save).toHaveBeenCalled();
    });

    test("lanza error si la notificación ya está leída", async () => {
      mockNotificacionesRepository.findById.mockResolvedValue({
        _id: notificacionId,
        leida: true,
        mensaje: "Pedido confirmado"
      });

      await expect(
        notificacionesService.marcarComoLeida(notificacionId)
      ).rejects.toThrow();
    });

    test("lanza error si la notificación no existe", async () => {
      mockNotificacionesRepository.findById.mockResolvedValue(null);

      await expect(
        notificacionesService.marcarComoLeida(notificacionId)
      ).rejects.toThrow();
    });
  });

  // ========================
  // Tests de crearNotificacion
  // ========================
  describe("crearNotificacion()", () => {
    let usuarioDestinoId;

    beforeEach(() => {
      usuarioDestinoId = "507f1f77bcf86cd799439011";

      mockUsuarioRepository.findById.mockResolvedValue({
        _id: usuarioDestinoId,
        nombre: "Juan"
      });

      mockNotificacionesRepository.create.mockResolvedValue({
        _id: "notif-123",
        usuarioDestinoId,
        titulo: "Nueva notificación",
        mensaje: "Mensaje de prueba",
        tipo: "sistema"
      });
    });

    test("crea una notificación correctamente", async () => {
      const resultado = await notificacionesService.crearNotificacion(
        usuarioDestinoId,
        "Nueva notificación",
        "Mensaje de prueba"
      );

      expect(resultado._id).toBe("notif-123");
      expect(resultado.usuarioDestinoId).toBe(usuarioDestinoId);
      expect(mockNotificacionesRepository.create).toHaveBeenCalled();
    });

    test("lanza error si el usuario no existe", async () => {
      mockUsuarioRepository.findById.mockResolvedValue(null);

      await expect(
        notificacionesService.crearNotificacion(
          usuarioDestinoId,
          "Título",
          "Mensaje"
        )
      ).rejects.toThrow();
    });

    test("asigna tipo 'sistema' por defecto", async () => {
      await notificacionesService.crearNotificacion(
        usuarioDestinoId,
        "Título",
        "Mensaje"
      );

      expect(mockNotificacionesRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tipo: "sistema"
        })
      );
    });
  });
});
