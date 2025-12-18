# Proyecto-Desarrollo-de-Software-UTN-FRBA - Plataforma de E-commerce

## Descripción General

Este repositorio contiene el desarrollo de una **plataforma de comercio electrónico Full Stack**, orientada a facilitar la vinculación entre **emprendedores locales y compradores**, cubriendo el ciclo completo de gestión de productos, ventas, pedidos y notificaciones.

El proyecto fue realizado como **Trabajo Práctico Integrador** de la asignatura **Desarrollo de Software** de la **Universidad Tecnológica Nacional – Facultad Regional Buenos Aires (UTN FRBA)**, simulando un contexto profesional de desarrollo de software, con aplicación de metodologías ágiles, control de versiones y procesos de despliegue automatizado.

> 📄 La documentación funcional y técnica del proyecto se encuentra disponible en formato PDF dentro de la carpeta `docs`.

---

## Stack Tecnológico

La solución fue construida utilizando un **stack moderno**, priorizando escalabilidad, mantenibilidad y experiencia de usuario.

### Frontend
- **Framework:** Next.js (React) con renderizado del lado del servidor (SSR).
- **Diseño UI/UX:** Material UI y Tailwind CSS para interfaces responsivas y accesibles.
- **Gestión de estado:** Context API para el manejo global del carrito de compras.
- **Comunicación HTTP:** Axios.

### Backend
- **Entorno de ejecución:** Node.js con Express.
- **Base de datos:** MongoDB Atlas (NoSQL).
- **Modelado de datos:** Mongoose.
- **API:** RESTful API documentada mediante Swagger / OpenAPI.
- **Seguridad:** Autenticación y manejo de sesiones a través de Clerk.

### DevOps y Calidad
- **Testing:**  
  - Jest para pruebas unitarias  
  - Cypress para pruebas end-to-end (E2E)
- **Infraestructura:** Docker para contenedorización del backend.
- **Integración y despliegue continuo:** GitHub Actions (CI/CD).
- **Deploy:**  
  - Frontend: Vercel  
  - Backend: Render

---

## Funcionalidades Principales

La plataforma soporta **dos perfiles de usuario principales** (Comprador y Vendedor), con flujos de uso diferenciados.

- **Gestión de Productos:**  
  Alta, baja y modificación de productos, control de stock en tiempo real, categorización y carga de imágenes.

- **Búsqueda y Navegación:**  
  Filtros por categoría, rango de precios y ordenamiento, con paginación optimizada para grandes volúmenes de datos.

- **Carrito de Compras y Checkout:**  
  Carrito persistente mediante almacenamiento local y validación de stock previa a la confirmación de la compra.

- **Gestión de Pedidos:**  
  Manejo completo del ciclo de vida del pedido (Pendiente, Confirmado, Enviado, Cancelado), incluyendo trazabilidad de estados.

- **Sistema de Notificaciones:**  
  Envío de alertas por cambios en el estado de los pedidos y gestión del estado de lectura.

---

## Arquitectura y Metodología de Trabajo

- **Arquitectura:** Monorepositorio para centralizar el desarrollo del frontend y backend.
- **Control de versiones:** Estrategia GitFlow con ramas `main`, `develop`, `feature/*` y `hotfix`.
- **Diseño API First:** Definición anticipada de endpoints REST con validaciones y manejo de errores estandarizado.
- **Persistencia:** Modelado documental optimizado para minimizar dependencias complejas entre entidades.

---

## Calidad de Software

- **Pruebas Unitarias:**  
  Validación de reglas de negocio críticas, como control de stock y estados de pedidos.

- **Pruebas End-to-End:**  
  Simulación de flujos completos de usuario, desde la publicación de un producto hasta la compra y actualización de inventario.

---

## Equipo de Trabajo  
**Grupo 6 – Segundo Cuatrimestre 2025**

- Ignacio Alejo Scarfo  
- Alex Fiorenza  
- Ian Gabriel Sanna  
- Facundo Tomasetti  
- Ignacio Castro Planas  

---
