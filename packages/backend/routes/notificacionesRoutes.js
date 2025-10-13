import express from "express";

export function createNotificacionesRouter(notificacionesController) {
  const router = express.Router();

  // GET /notificaciones/unread/:usuarioId
  //router.get("/unread/:usuarioId", notificacionesController.obtenerNotificacionesNoLeidas);

  // GET /notificaciones/read/:usuarioId
  //router.get("/read/:usuarioId", notificacionesController.obtenerNotificacionesLeidas);

  // PATCH /notificaciones/:id/read
  router.patch("/:id/read", notificacionesController.marcarComoLeida);

  return router;
}