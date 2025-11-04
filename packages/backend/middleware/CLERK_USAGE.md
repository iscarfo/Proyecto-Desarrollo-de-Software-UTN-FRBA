# Uso del Middleware de Clerk

## Configuración

El middleware de Clerk ya está configurado globalmente en `index.js`:

```javascript
import { clerkMiddleware } from '@clerk/express';

app.use(clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
}));
```

## Proteger Rutas Específicas

Para proteger rutas específicas que requieren autenticación, usa `requireAuth()`:

```javascript
import { requireAuth } from '@clerk/express';

router.get("/protected", requireAuth(), (req, res) => {
  const userId = req.auth.userId;
  const sessionId = req.auth.sessionId;

  res.json({ userId, sessionId });
});
```

## Rutas Opcionales con Autenticación

Para rutas donde la autenticación es opcional:

```javascript
router.get("/optional", (req, res) => {
  if (req.auth?.userId) {
    res.json({ message: "Usuario autenticado", userId: req.auth.userId });
  } else {
    res.json({ message: "Usuario no autenticado" });
  }
});
```

## Control de Acceso por Roles

Usa el helper `requireRole` de `middleware/clerkAuth.js`:

```javascript
import { requireRole } from '../middleware/clerkAuth.js';

router.post("/seller-only", requireRole(['seller']), (req, res) => {
  res.json({ message: "Solo vendedores pueden acceder" });
});

router.get("/buyer-seller", requireRole(['buyer', 'seller']), (req, res) => {
  res.json({ message: "Compradores y vendedores pueden acceder" });
});
```

## Ejemplo Completo

```javascript
import express from "express";
import { requireAuth } from '@clerk/express';
import { requireRole } from '../middleware/clerkAuth.js';

export function createExampleRouter(controller) {
  const router = express.Router();

  router.get("/public", controller.publicEndpoint);

  router.get("/protected", requireAuth(), controller.protectedEndpoint);

  router.post("/seller", requireAuth(), requireRole(['seller']), controller.sellerEndpoint);

  router.get("/any-auth", requireAuth(), controller.anyAuthenticatedUser);

  return router;
}
```
