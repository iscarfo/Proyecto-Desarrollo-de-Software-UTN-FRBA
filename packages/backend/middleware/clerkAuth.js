import { clerkClient, requireAuth } from '@clerk/express';

const clerk = clerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const requireAuthMiddleware = requireAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

export const optionalAuthMiddleware = (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    return next();
  }
  next();
};

export const getRoleFromUser = async (userId) => {
  try {
    const user = await clerk.users.getUser(userId);
    return user.unsafeMetadata?.role || 'buyer';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'buyer';
  }
};

export const requireRole = (roles) => {
  return async (req, res, next) => {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const userRole = await getRoleFromUser(req.auth.userId);

    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
    }

    req.userRole = userRole;
    next();
  };
};
