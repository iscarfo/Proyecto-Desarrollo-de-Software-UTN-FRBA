import express from "express";

export function createNotificacionesRouter(notificacionesController) {
  const router = express.Router();

  router.patch("/:id/read", notificacionesController.marcarComoLeida);

  return router;
}