import { Producto } from "../domain/producto/Producto.js";
import { ProductoService } from "../services/productoService.js";
import {jest} from '@jest/globals';

// Ejemplos de instancias de Producto para pruebas
const productoEjemplo1 = new Producto(
  1,
  { id: 101, nombre: "Vendedor Uno" },
  "Camiseta Deportiva",
  "disponible",
  "Camiseta de algodón, talla M",
  ["Ropa", "Deporte"],
  3500,
  "ARS",
  20,
  ["foto1.jpg", "foto2.jpg"],
  true
);

const productoEjemplo2 = new Producto(
  2,
  { id: 102, nombre: "Vendedor Dos" },
  "Auriculares Bluetooth",
  "disponible",
  "Auriculares inalámbricos con cancelación de ruido",
  ["Electrónica", "Audio"],
  12000,
  "ARS",
  15,
  ["auriculares.jpg"],
  true
);

const productoEjemplo3 = new Producto(
  3,
  { id: 103, nombre: "Vendedor Tres" },
  "Libro de Programación",
  "agotado",
  "Libro sobre JavaScript moderno",
  ["Libros", "Educación"],
  4500,
  "ARS",
  0,
  ["libro.jpg"],
  false
);

const mockRepositorio = {
  productosOrdenadosPorVentas: jest.fn().mockReturnValue([
    { id: 2, total: 300 },
    { id: 1, total: 200 },
    { id: 3, total: 100 }
  ])
};

describe("Producto - pruebas", () => {
    let productoService = new ProductoService(mockRepositorio);
    let productos = [productoEjemplo1, productoEjemplo2, productoEjemplo3];

    test("ordenar por precio ascendente", () => {
        const ordenados = productoService.ordernarPorPrecioAsc(productos);

        expect(ordenados[0].getId()).toBe(1); // Camiseta 3500
        expect(ordenados[1].getId()).toBe(3); // Libro 4500
        expect(ordenados[2].getId()).toBe(2); // Auriculares 12000
    });
    
    test("ordenar por precio descendente", () => {
        const ordenados = productoService.ordernarPorPrecioDesc(productos);

        expect(ordenados[0].getId()).toBe(2); // Auriculares 12000
        expect(ordenados[1].getId()).toBe(3); // Libro 4500
        expect(ordenados[2].getId()).toBe(1); // Camiseta 3500
    });

    test ("order por ventas", () => {
        const ordenados = productoService.ordernarPorVentas(productos);    

        expect(ordenados[0].getId()).toBe(2); // Producto 2 - 300 ventas
        expect(ordenados[1].getId()).toBe(1); // Producto 1 - 200 ventas
        expect(ordenados[2].getId()).toBe(3); // Producto 3 - 100 ventas
    });
});