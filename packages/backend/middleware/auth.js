import { createClerkClient, requireAuth } from '@clerk/express';

export const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const withAuth = () => {
  const requireAuthMiddleware = requireAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });

  return async (req, res, next) => {
    requireAuthMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(401).json({
          error: 'No autenticado',
          message: 'Token inválido o expirado'
        });
      }

      const auth = req.auth();

      if (!auth?.userId) {
        return res.status(401).json({
          error: 'No autenticado',
          message: 'No se encontró información de autenticación'
        });
      }

      try {
        const user = await clerk.users.getUser(auth.userId);
        const metadata = user.publicMetadata || {};

        req.userId = metadata.usuarioId;
        req.tipoUsuario = metadata.tipoUsuario;
        req.clerkUserId = auth.userId;

        next();
      } catch (error) {
        console.error('Error obteniendo metadata del usuario:', error);
        return res.status(500).json({
          error: 'Error interno',
          message: 'No se pudo obtener la información del usuario'
        });
      }
    });
  };
};

export const requireComprador = () => {
  return async (req, res, next) => {
    if (!req.tipoUsuario) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Debes iniciar sesión para acceder a este recurso'
      });
    }

    if (req.tipoUsuario !== 'comprador' && req.tipoUsuario !== 'vendedor') {
      return res.status(403).json({
        error: 'No autorizado',
        message: 'Este recurso requiere ser comprador o vendedor'
      });
    }

    next();
  };
};

export const requireVendedor = () => {
  return async (req, res, next) => {
    if (!req.tipoUsuario) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Debes iniciar sesión para acceder a este recurso'
      });
    }

    if (req.tipoUsuario !== 'vendedor') {
      return res.status(403).json({
        error: 'No autorizado',
        message: 'Este recurso requiere ser vendedor'
      });
    }

    next();
  };
};
