'use client'
import React, { useState } from 'react'
import { Box, Button, TextField, Typography, Paper, Link } from '@mui/material'
import Navbar from '@/components/Navbar/Navbar'

export default function RegisterUserPage() {
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState({
    email: '',
    nombre: '',
    telefono: '',
    password: ''
  })

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const validateNombre = (value: string) =>
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/.test(value)

  const validateTelefono = (value: string) =>
    /^[0-9]{6,}$/.test(value)

  const validatePassword = (value: string) =>
    value.length >= 6

  const handleBlur = (field: keyof typeof errors, value: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]:
        field === 'email'
          ? validateEmail(value) ? '' : 'Ingresá un correo válido'
          : field === 'nombre'
          ? validateNombre(value) ? '' : 'Ingresá un nombre válido'
          : field === 'telefono'
          ? validateTelefono(value) ? '' : 'Ingresá un teléfono válido'
          : validatePassword(value) ? '' : 'La contraseña debe tener al menos 6 caracteres'
    }))
  }

  const handleRegister = () => {
    const newErrors = {
      email: validateEmail(email) ? '' : 'Ingresá un correo válido',
      nombre: validateNombre(nombre) ? '' : 'Ingresá un nombre válido',
      telefono: validateTelefono(telefono) ? '' : 'Ingresá un teléfono válido',
      password: validatePassword(password) ? '' : 'La contraseña debe tener al menos 6 caracteres'
    }

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((msg) => msg !== '')
    if (hasErrors) return

    console.log('Registrarse comprador:', { email, nombre, telefono, password })
    // continuar con el registro...
  }

  return (
    <>
      <Navbar userType="buyer" minimal />
      <Box
        role="main"
        aria-label="Formulario de registro"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '93vh',
          backgroundColor: '#f1f1f1'
        }}
      >
        <Paper
          elevation={3}
          role="form"
          aria-labelledby="registro-title"
          sx={{ p: 4, width: 450, textAlign: 'center', borderRadius: 2 }}
        >
          <Typography
            id="registro-title"
            variant="h5"
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Crear Cuenta
          </Typography>

          <TextField
            label="E-mail"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email', email)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={() => handleBlur('nombre', nombre)}
            error={!!errors.nombre}
            helperText={errors.nombre}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Teléfono"
            variant="outlined"
            fullWidth
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            onBlur={() => handleBlur('telefono', telefono)}
            error={!!errors.telefono}
            helperText={errors.telefono}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password', password)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            aria-label="Crear cuenta en Tienda Sol"
            sx={{
              backgroundColor: '#f79533',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#e68400' }
            }}
            onClick={handleRegister}
          >
            Crear cuenta
          </Button>

          <Box sx={{ mt: 2 }}>
            <Link
              href="/sesiones/registro/vendedores"
              underline="hover"
              aria-label="Registrarme como vendedor"
            >
              Registrarme como vendedor
            </Link>
          </Box>
        </Paper>
      </Box>
    </>
  )
}