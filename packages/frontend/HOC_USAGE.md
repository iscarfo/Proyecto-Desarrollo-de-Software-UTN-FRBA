# Uso del HOC withAuth

Este Higher Order Component (HOC) permite proteger páginas que requieren autenticación.

## Uso Básico

```typescript
'use client';
import { withAuth } from '@/components/hoc/withAuth';

function MyProtectedPage() {
  return <div>Esta página está protegida</div>;
}

export default withAuth(MyProtectedPage);
```

## Con Redirección Personalizada

```typescript
export default withAuth(MyProtectedPage, {
  redirectTo: '/sign-in'
});
```

## Ejemplo Completo

```typescript
'use client';
import { withAuth } from '@/components/hoc/withAuth';
import { useUser } from '@clerk/nextjs';

function MisPedidos() {
  const { user } = useUser();

  return (
    <div>
      <h1>Mis Pedidos</h1>
      <p>Bienvenido, {user?.firstName}</p>
    </div>
  );
}

export default withAuth(MisPedidos);
```

## Aplicar a Página Existente

Para proteger una página existente como `/mis-pedidos/page.tsx`:

```typescript
'use client';
import { withAuth } from '@/components/hoc/withAuth';

function MisPedidosPage() {
  // Tu código existente aquí
}

export default withAuth(MisPedidosPage);
```

## Notas

- El HOC muestra un loading spinner mientras verifica la autenticación
- Redirige automáticamente a `/sesiones/inicio` si el usuario no está autenticado
- Solo funciona en componentes client-side (requiere 'use client')
