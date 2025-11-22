"use client";

import { Card, TextField, Button, Typography, Divider, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "../hooks/useForm";
import { useCart } from "../../store/CartContext";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState, useEffect } from "react";

const initialValues = {
  nombre: "",
  apellido: "",
  email: "",
  repetirEmail: "",
  calle: "",
  altura: "",
  piso: "",
  departamento: "",
  codPostal: "",
  ciudad: "",
  provincia: "",
  pais: "",
};

function validate(values: any) {
  const errors: any = {};

  if (!values.nombre) errors.nombre = "El nombre es obligatorio";
  if (!values.apellido) errors.apellido = "El apellido es obligatorio";

  if (!values.email) {
    errors.email = "El email es obligatorio";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "El email no es válido";
  }

  if (!values.repetirEmail) {
    errors.repetirEmail = "Debe repetir el email";
  } else if (values.email !== values.repetirEmail) {
    errors.repetirEmail = "Los emails no coinciden";
  }

  if (!values.calle) errors.calle = "La calle es obligatoria";
  if (!values.altura) errors.altura = "La altura es obligatoria";
  if (!values.codPostal) errors.codPostal = "El código postal es obligatorio";
  if (!values.ciudad) errors.ciudad = "La ciudad es obligatoria";
  if (!values.provincia) errors.provincia = "La provincia es obligatoria";
  if (!values.pais) errors.pais = "El país es obligatorio";

  return errors;
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");

  const subtotal = cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const envio = cart.length > 0 ? 15000 : 0;
  const total = subtotal + envio;

  // Valores iniciales con datos de la sesión
  const getInitialValues = () => ({
    nombre: user?.firstName || "",
    apellido: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    repetirEmail: user?.primaryEmailAddress?.emailAddress || "",
    calle: "",
    altura: "",
    piso: "",
    departamento: "",
    codPostal: "",
    ciudad: "",
    provincia: "",
    pais: "",
  });

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    showError,
    resetForm,
    setValues,
  } = useForm(
    initialValues,
    async () => {
      try {
        setError("");
        const token = await getToken();

        // Preparar items del pedido
        const items = cart.map((item) => ({
          productoId: item._id,
          cantidad: item.cantidad,
        }));

        // Determinar la moneda (asumiendo que todos los productos tienen la misma moneda)
        const moneda = cart[0]?.moneda || "PESO_ARG";

        // Preparar dirección de entrega
        const direccionEntrega = {
          calle: values.calle,
          altura: parseInt(values.altura),
          piso: values.piso || undefined,
          departamento: values.departamento || undefined,
          codPostal: values.codPostal,
          ciudad: values.ciudad,
          provincia: values.provincia,
          pais: values.pais,
          lat: 0, // Valores por defecto, podrías implementar geolocalización
          lon: 0,
        };

        // Crear el pedido
        const payload = {
          items,
          moneda,
          direccionEntrega,
        };

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/pedidos`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 201 || res.status === 200) {
          clearCart();
          alert("¡Pedido realizado con éxito!");
          resetForm();
          router.push("/home");
        }
      } catch (err: any) {
        console.error("Error al crear el pedido:", err);
        setError(
          err.response?.data?.message || "Error al procesar el pedido. Intente nuevamente."
        );
      }
    },
    validate
  );

  // Autocompletar con datos del usuario cuando cargue
  useEffect(() => {
    if (user) {
      setValues(getInitialValues());
    }
  }, [user]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
        <Card className="p-8 shadow-lg rounded-2xl text-center">
          <Typography variant="h5" className="mb-4">
            Tu carrito está vacío
          </Typography>
          <Button variant="contained" onClick={() => router.push("/home")}>
            Ir a comprar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-16 px-4">
      
      {/* GRID GENERAL */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* RESUMEN DEL PEDIDO */}
        <Card className="p-6 shadow-lg rounded-2xl">
          <Typography variant="h5" className="font-semibold mb-4 text-gray-800">
            Resumen del pedido
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between py-2 border-b text-gray-700"
            >
              <span>
                {item.titulo} × {item.cantidad}
              </span>
              <span className="font-medium">
                ${(item.precio * item.cantidad).toLocaleString("es-AR")}
              </span>
            </div>
          ))}

          <div className="flex justify-between mt-4 text-lg font-semibold text-gray-900">
            <span>Total:</span>
            <span>${total.toLocaleString("es-AR")}</span>
          </div>
        </Card>

        {/* FORMULARIO */}
        <Card className="p-6 shadow-lg rounded-2xl">
          <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
            Datos del comprador
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              name="nombre"
              label="Nombre"
              fullWidth
              variant="outlined"
              value={values.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!showError("nombre")}
              helperText={showError("nombre")}
              sx={{ mb: 3 }}
            />

            <TextField
              name="apellido"
              label="Apellido"
              fullWidth
              variant="outlined"
              value={values.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!showError("apellido")}
              helperText={showError("apellido")}
              sx={{ mb: 3 }}
            />

            <TextField
              name="email"
              label="Email"
              fullWidth
              variant="outlined"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!showError("email")}
              helperText={showError("email")}
              sx={{ mb: 3 }}
            />

            <TextField
              name="repetirEmail"
              label="Repetir Email"
              fullWidth
              variant="outlined"
              value={values.repetirEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!showError("repetirEmail")}
              helperText={showError("repetirEmail")}
              sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="textSecondary">
                Dirección de entrega
              </Typography>
            </Divider>

            <TextField
              name="calle"
              label="Calle"
              fullWidth
              variant="outlined"
              value={values.calle}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!showError("calle")}
              helperText={showError("calle")}
              sx={{ mb: 3 }}
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <TextField
                name="altura"
                label="Altura"
                type="number"
                fullWidth
                variant="outlined"
                value={values.altura}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError("altura")}
                helperText={showError("altura")}
              />

              <TextField
                name="piso"
                label="Piso (opcional)"
                fullWidth
                variant="outlined"
                value={values.piso}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <TextField
                name="departamento"
                label="Departamento (opcional)"
                fullWidth
                variant="outlined"
                value={values.departamento}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <TextField
                name="codPostal"
                label="Código Postal"
                fullWidth
                variant="outlined"
                value={values.codPostal}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError("codPostal")}
                helperText={showError("codPostal")}
              />
            </div>

            <TextField
              name="ciudad"
              label="Ciudad"
              fullWidth
              variant="outlined"
              value={values.ciudad}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!showError("ciudad")}
              helperText={showError("ciudad")}
              sx={{ mb: 3 }}
            />

            <TextField
              name="provincia"
              label="Provincia"
              fullWidth
              variant="outlined"
              value={values.provincia}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!showError("provincia")}
              helperText={showError("provincia")}
              sx={{ mb: 3 }}
            />

            <TextField
              name="pais"
              label="País"
              fullWidth
              variant="outlined"
              value={values.pais}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!showError("pais")}
              helperText={showError("pais")}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              fullWidth
              sx={{
                py: 1.5,
                fontSize: "1rem",
                borderRadius: "10px",
              }}
            >
              {isSubmitting ? "Procesando..." : "Finalizar compra"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}