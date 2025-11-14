# Ejecución de Tests con Docker

## Requisitos previos
- Docker y Docker Compose instalados
- Ubuntu 24.04 (o cualquier sistema moderno sin libssl1.1 nativo)

## Opción 1: Usar docker-compose (Recomendado)

```bash
# Construir y ejecutar tests
docker-compose -f docker-compose.test.yml up --build

# O solo ejecutar sin reconstruir
docker-compose -f docker-compose.test.yml up
```

## Opción 2: Construir y ejecutar imagen manualmente

```bash
# Construir la imagen
docker build -f Dockerfile.test -t backend-tests:latest .

# Ejecutar tests
docker run --rm backend-tests:latest npm test

# Ejecutar tests específicos
docker run --rm backend-tests:latest npm test -- test/unit/ItemPedido.test.js
docker run --rm backend-tests:latest npm test -- test/integration/pedido.test.js
```

## Nota importante
- `Dockerfile` original se mantiene intacto para producción (node:18-alpine).
- `Dockerfile.test` utiliza `node:18-bullseye` que incluye libssl1.1 necesario para mongodb-memory-server.
- Los tests corren con `setupTests.js` que levanta mongodb-memory-server automáticamente.

## Limpiar contenedores y volúmenes

```bash
docker-compose -f docker-compose.test.yml down -v
```

## Troubleshooting

Si la imagen no construye:
- Asegurar que Docker daemon está corriendo: `docker ps`
- Verificar espacio en disco: `docker system df`
- Limpiar recursos sin usar: `docker system prune`

Si los tests fallan dentro del contenedor:
- Ver logs completos: `docker-compose -f docker-compose.test.yml logs -f test`
- Reconstruir imagen: `docker-compose -f docker-compose.test.yml build --no-cache`
