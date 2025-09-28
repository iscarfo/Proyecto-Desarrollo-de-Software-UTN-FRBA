import { Producto } from "../models/Producto.js";
import { PedidoModel } from "../models/PedidoModel.js";

export class ProductoRepository {

    // ===== Crear o actualizar producto =====
    async save(producto) {
        try {
            if (producto._id) {
                // Actualizar producto existente
                return await Producto.findByIdAndUpdate(
                    producto._id,
                    producto,
                    { new: true, lean: true }
                );
            } else {
                // Crear nuevo producto
                const nuevoProducto = new Producto(producto);
                return await nuevoProducto.save();
            }
        } catch (error) {
            throw new Error(`Error al guardar producto: ${error.message}`);
        }
    }

    // ===== Actualizar producto =====
    async updateById(id, datos) {
        try {
            return await Producto.findByIdAndUpdate(id, datos, { new: true, lean: true });
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    // ===== Buscar producto por Id =====
    async findById(id) {
        try {
            return await Producto.findById(id).lean();
        } catch (error) {
            throw new Error(`Error al buscar producto: ${error.message}`);
        }
    }

    // ===== Eliminar producto =====
    async delete(id) {
        try {
            return await Producto.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }

    // ===== Buscar todos con paginación + filtros =====
    async findByPage(numeroPagina = 1, elementosXPagina = 10, filtros = {}) {
        const skip = (numeroPagina - 1) * elementosXPagina;
        return await Producto.find(filtros)
            .skip(skip)
            .limit(elementosXPagina)
            .lean();
    }

    // ===== Buscar por vendedor con filtros + paginación =====
    async findByVendedor(numeroPagina = 1, elementosXPagina = 10, filtros = {}, vendedorId) {
        const skip = (numeroPagina - 1) * elementosXPagina;

        const query = { vendedor: vendedorId };

        if (filtros.nombre) {
            query.titulo = { $regex: filtros.nombre, $options: "i" };
        }
        if (filtros.descripcion) {
            query.descripcion = { $regex: filtros.descripcion, $options: "i" };
        }
        if (filtros.categoria) {
            query.categorias = filtros.categoria; // espera ObjectId de Categoria
        }
        if (filtros.precioMin || filtros.precioMax) {
            query.precio = {};
            if (filtros.precioMin) query.precio.$gte = filtros.precioMin;
            if (filtros.precioMax) query.precio.$lte = filtros.precioMax;
        }

        return await Producto.find(query)
            .skip(skip)
            .limit(elementosXPagina)
            .lean();
    }

    // ===== Contadores =====
    async contarTodos(filtros = {}) {
        return await Producto.countDocuments(filtros);
    }

    async contarDeVendedor(vendedorId, filtros = {}) {
        return await Producto.countDocuments({ vendedor: vendedorId, ...filtros });
    }

    // ===== Productos ordenados por ventas =====
    async productosOrdenadosPorVentas(productos) {
        const ids = productos.map(p => p._id);

        const resultados = await Pedido.aggregate([
            { $unwind: "$items" }, // desarma el array de items
            { $match: { "items.producto": { $in: ids } } }, // filtra los productos de interés
            {
                $group: {
                    _id: "$items.producto",      // agrupa por producto
                    totalVendido: { $sum: "$items.cantidad" }, // suma cantidades
                },
            },
            { $sort: { totalVendido: -1 } }, // orden descendente
        ]);

        return resultados.map(r => ({
            id: r._id,
            total: r.totalVendido,
        }));
    }

}