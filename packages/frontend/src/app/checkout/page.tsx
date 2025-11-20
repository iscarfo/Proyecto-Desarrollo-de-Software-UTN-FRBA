"use client";

import { Card, TextField, Button, Typography, Divider, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "../hooks/useForm";
import { useCart } from "../../store/CartContext";

const initialValues = {
  nombre: "",
  apellido: "",
  email: "",
  repetirEmail: "",
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

  return errors;
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();

  const subtotal = cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const envio = cart.length > 0 ? 15000 : 0;
  const total = subtotal + envio;

  const router = useRouter();

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    showError,
    resetForm,
  } = useForm(
    initialValues,
    async () => {
      clearCart();
      alert("¡Compra realizada con éxito!");
      resetForm();
      router.push("/home");
    },
    validate
  );

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
              Finalizar compra
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

