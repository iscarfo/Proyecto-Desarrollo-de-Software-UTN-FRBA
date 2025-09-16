export class ProductoController {
    constructor(productoService){
        this.productoService = productoService
    }

    //TODO
    /*
    buscarTodos (req, res) {
        const {page = 1, limit = 10} = req.query
        const filtros = req.query

        const alojamientosPaginados = this.alojamientoService.buscarTodos(page, limit, filtros)
        if (alojamientosPaginados === null) {
            return res.status(204).send()
        }
        res.status(200).json(alojamientosPaginados)
    }
        */
}