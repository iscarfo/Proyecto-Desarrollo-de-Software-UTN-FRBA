export class ProductoRepositoryMemoria {
    constructor() {
        this.productos = [];      // array con los productos
        this._nextId = 1;         // autoincrement simple para los IDs
    }

    // ===== Crear producto =====
    async save(producto) {
        const nuevo = { ...producto, _id: this._nextId.toString() };
        this._nextId++;
        this.productos.push(nuevo);
        return nuevo;
    }

    async delete(id) {
        const index = this.productos.findIndex(p => p._id === id);
        if (index === -1) return false;

        this.productos.splice(index, 1);   // elimina 1 elemento en la posición encontrada
        return true;
    }

    // ===== Actualizar producto =====
    async actualizarProducto(id, datos) {
        const index = this.productos.findIndex(p => p._id === id);
        if (index === -1) return false;
        this.productos[index] = { ...this.productos[index], ...datos };
        return true;
    }

    // ===== Buscar todos con paginación + filtros =====
    async findByPage(numeroPagina, elementosXPagina, filtros = {}) {
        const offset = (numeroPagina - 1) * elementosXPagina;

        const filtrados = this.productos.filter(p =>
            Object.entries(filtros).every(([k, v]) => p[k] === v)
        );

        return filtrados.slice(offset, offset + elementosXPagina);
    }

    // ===== Buscar por vendedor con filtros + paginación =====
    async findByVendedor(numeroPagina = 1, elementosXPagina = 10, filtros = {}, vendedorId) {
        const offset = (numeroPagina - 1) * elementosXPagina;

        //BUSCAR POR VENDEDOR
        let filtrados = this.productos.filter(p => p.vendedor?.id === vendedorId);

        //FILTRO POR NOMBRE
        if (filtros.nombre) {
            filtrados = filtrados.filter(p =>
                p.titulo.toLowerCase().includes(filtros.nombre.toLowerCase())
            );
        }

        //FILTRO POR DESCRIPCION
        if (filtros.descripcion) {
            filtrados = filtrados.filter(p =>
                p.descripcion.toLowerCase().includes(filtros.descripcion.toLowerCase())
            );
        }

        //FILTRO POR CATEGORIA
        if (filtros.categoria) {
            filtrados = filtrados.filter(p =>
                p.categorias.some(c => c.toLowerCase().includes(filtros.categoria.toLowerCase()))
            );
        }

        //FILTRO RANGO DE PRECIOS
        if (filtros.precioMin) {
            filtrados = filtrados.filter(p => p.precio >= filtros.precioMin);
        }

        if (filtros.precioMax) {
            filtrados = filtrados.filter(p => p.precio <= filtros.precioMax);
        }

        return filtrados.slice(offset, offset + elementosXPagina);
    }

    // ===== Contadores =====
    async contarTodos(filtros = {}) {
        return this.productos.filter(p =>
            Object.entries(filtros).every(([k, v]) => p[k] === v)
        ).length;
    }

    async contarDeVendedor(vendedorId, filtros = {}) {
        const productos = await this.findByVendedor(1, Number.MAX_SAFE_INTEGER, filtros, vendedorId);
        return productos.length;
    }

    // ===== Productos ordenados por ventas =====
    async productosOrdenadosPorVentas(productos) {
        const ids = productos.map(p => p._id);

        const acumulado = {};
        for (const item of this.itemPedidos) {
            const id = item.producto?.id;
            if (ids.includes(id)) {
                acumulado[id] = (acumulado[id] || 0) + item.cantidad;
            }
        }

        return Object.entries(acumulado)
            .map(([id, total]) => ({ id, total }))
            .sort((a, b) => b.total - a.total);
    }
}

/*
import { ObjectId } from "mongodb";

export class ProductoRepository {
    constructor(db) {
        this.collection = db.collection("productos");
        this.collectionItemPedidos = db.collection("itemPedidos");
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
            .find(filtros) //TODO
            .skip(skip)
            .limit(elementosXPagina)
            .toArray();
    }

    // ===== Buscar por vendedor con filtros + paginación =====
    async findByVendedor(numeroPagina = 1, elementosXPagina = 10, filtros = {}, vendedorId) {
        const offset = (numeroPagina - 1) * elementosXPagina;
        const query = { ...filtros, vendedorId: new ObjectId(vendedorId) };

        return await this.collection
            .find(query) //TODO
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

    async productosOrdenadosPorVentas(productos) {

        const productosId = productos.map(producto => producto.getId())
        return await this.collectionItemPedidos.aggregate([
            { $match: { "producto.id": { $in: productosId } } },
            { $group: { _id: "$producto.id", total: { $sum: "$cantidad" } } },
            { $project: { id: "$_id", total: 1, _id: 0 } },
            { $sort: { total: -1 } }
        ]).toArray()
    }
}
    */