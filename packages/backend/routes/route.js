import { ProductoController } from "../controllers/productoController";
import express from 'express'

const pathProducto = "/producto"

//TODO FILTROS QUERY PARAM

export default function productoRoutes(getController) {
    const router = express.Router() 

    router.get(pathProducto, (req,res) => {
        getController(ProductoController).buscarTodos(req,res)
    })

    router.post(pathProducto, (req, res) => {
        getController(ProductoController).crearProducto(req,res)
    })

    router.get(pathProducto + "/:vendedorId", (req, res) => {
        getController(ProductoController).buscarPorVendedor(req,res)
    })

    /*
    router.delete(pathProducto + "/:id", (req, res) => {
        getController(ProductoController).eliminar(req,res)
    })

    router.put(pathAlojamiento + "/:id", (req, res) => {
        getController(ProductoController).actualizar(req,res)
    })
    */

    return router 
}