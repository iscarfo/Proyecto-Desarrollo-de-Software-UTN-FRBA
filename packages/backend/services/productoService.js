export class ProductoService {
    constructor(productoRepository) {
        this.productoRepository = productoRepository
    }

    // Representa la capa de servicio para Productos.
    // Se encarga de aplicar reglas de negocio, paginar resultados
    // y delegar las operaciones de BD al repository.

    // ===== Crear producto nuevo =====
    async crearProducto(productoData) {
        return await this.productoRepository.save(productoData);
    }

    // ===== Buscar todos los productos con filtros y paginación =====
    async listarProductos(page, limit) {
        try {
            const numeroPagina = Math.max(Number(page), 1)
            const elementosXPagina = Math.min(Math.max(Number(limit), 1), 100)

            // Promise.all ejecuta en paralelo dos operaciones:
            //  1) Traer los productos de la página solicitada.
            //  2) Contar el total de productos que cumplen los filtros.
            //
            // El uso de "await" permite esperar a que ambas promesas se resuelvan
            // antes de continuar, de modo que "productos" y "total"
            // contienen los resultados reales (no promesas).

            const [productos, total] = await Promise.all([
                this.productoRepository.findByPage(numeroPagina, elementosXPagina,{}),
                this.productoRepository.contarTodos({}),
            ]);

            const totalPaginas = Math.ceil(total / elementosXPagina)

            return {
                pagina: numeroPagina,           // Página actual
                perPage: elementosXPagina,      // Cantidad de elementos por página
                totalColecciones: total,        // Total de registros que cumplen los filtros
                totalPaginas: totalPaginas,     // Total de páginas disponibles
                data: productos                 // Lista de productos de esta página
            }

        } catch (error) {
            throw new Error(`Error al buscar productos: ${error.message}`);
        }
    }

    // ===== Buscar productos de un vendedor con filtros y paginación =====
    async buscarProductosVendedor(page, limit, filtros, vendedorId) {
        try {
            const numeroPagina = Math.max(Number(page), 1)
            const elementosXPagina = Math.min(Math.max(Number(limit), 1), 100)

            const [productos, total] = await Promise.all([
                this.productoRepository.findByVendedor(numeroPagina, elementosXPagina, filtros, vendedorId),
                this.productoRepository.contarDeVendedor(vendedorId, filtros),
            ]);

            const totalPaginas = Math.ceil(total / elementosXPagina)

            return {
                pagina: numeroPagina,
                perPage: elementosXPagina,
                totalColecciones: total,
                totalPaginas: totalPaginas,
                data: productos
            }

        } catch (error) {
            throw new Error(`Error al buscar productos del vendedor: ${error.message}`);
        }

    }

    ordernarPorPrecioAsc(productos) {
        return productos.sort((a, b) => a.getPrecio() - b.getPrecio());
    }

    ordernarPorPrecioDesc(productos) {
        return productos.sort((a, b) => b.getPrecio() - a.getPrecio());
    }

    ordernarPorVentas(productos) {
        const idOrdenado = this.productoRepository.productosOrdenadosPorVentas(productos);
        const productosOrdenados = new Array(productos.length);

        for (let i = 0; i < productosOrdenados.length; i++) {
            productosOrdenados[i] = productos.find(p => p.getId() === idOrdenado[i].id);
        }

        return productosOrdenados;
    }

    async eliminarProducto(productoId) {
        try {
            return await this.productoRepository.delete(productoId);
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}