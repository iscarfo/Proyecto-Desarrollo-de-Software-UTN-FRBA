import { ObjectId } from "mongodb";

export class ProductoRepository {
    constructor(db) {
        this.collection = db.collection("productos");
    }

    // ===== Crear producto =====
    async crearProducto(producto) {
        const result = await this.collection.insertOne(producto);
        return { ...producto, _id: result.insertedId };
    }

    // ===== Actualizar producto =====
    async actualizarProducto(id, datos) {
        const _id = new ObjectId(id);
        const result = await this.collection.updateOne({ _id }, { $set: datos });
        return result.modifiedCount > 0;
    }

    // ===== Buscar todos con filtros + paginación =====
    async findByPage(numeroPagina, elementosXPagina, filtros) {
        const offset = (numeroPagina - 1) * elementosXPagina
        return await this.collection
            .find(filtros)
            .skip(skip)
            .limit(elementosXPagina)
            .toArray();
    }

    // ===== Buscar por vendedor con filtros + paginación =====
    async findByVendedor(numeroPagina = 1, elementosXPagina = 10, filtros = {}, vendedorId) {
        const offset = (numeroPagina - 1) * elementosXPagina;
        const query = { ...filtros, vendedorId: new ObjectId(vendedorId) };

        return await this.collection
            .find(query)
            .skip(offset)
            .limit(elementosXPagina)
            .toArray();
    }

    // ===== Contadores =====
    async contarTodos(filtros = {}) {
        return await this.collection.countDocuments(filtros);
    }

    async contarDeVendedor(vendedorId, filtros = {}) {
        return await this.collection.countDocuments({
            ...filtros,
            vendedorId: new ObjectId(vendedorId),
        });
    }
}