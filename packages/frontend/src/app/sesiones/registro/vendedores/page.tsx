'use client'
import React, { useState } from 'react'
import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import Navbar from '@/components/Navbar/Navbar'

export default function RegisterStorePage() {
  const [email, setEmail] = useState('')
  const [nombreTienda, setNombreTienda] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState({
    email: '',
    nombreTienda: '',
    telefono: '',
    password: ''
  })

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const validateNombreTienda = (value: string) =>
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]{2,}$/.test(value)

  const validateTelefono = (value: string) =>
    /^[0-9]{6,}$/.test(value)

  const validatePassword = (value: string) =>
    value.length >= 6

  const handleRegister = () => {
    const newErrors = {
      email: validateEmail(email) ? '' : 'Ingresá un correo válido',
      nombreTienda: validateNombreTienda(nombreTienda) ? '' : 'Ingresá un nombre válido',
      telefono: validateTelefono(telefono) ? '' : 'Ingresá un teléfono válido',
      password: validatePassword(password) ? '' : 'La contraseña debe tener al menos 6 caracteres'
    }

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((msg) => msg !== '')
    if (hasErrors) return

    console.log('Registrarse vendedor:', { email, nombreTienda, telefono, password })
    // continuar con el registro...
  }

  return (
    <>
      <Navbar userType="seller" minimal />
      <Box
        role="main"
        aria-label="Formulario de registro para vendedores"
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
          aria-labelledby="registro-vendedor-title"
          sx={{ p: 4, width: 450, textAlign: 'center', borderRadius: 2 }}
        >
          <Typography
            id="registro-vendedor-title"
            variant="h5"
            sx={{ mb: 1, fontWeight: 'bold' }}
          >
            ¡Bienvenido al equipo!
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Creá tu cuenta y empezá a vender tus prendas al mundo
          </Typography>

          <TextField
            label="E-mail"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Nombre de la tienda"
            variant="outlined"
            fullWidth
            value={nombreTienda}
            onChange={(e) => setNombreTienda(e.target.value)}
            error={!!errors.nombreTienda}
            helperText={errors.nombreTienda}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Teléfono"
            variant="outlined"
            fullWidth
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
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
            error={!!errors.password}
            helperText={errors.password}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            aria-label="Crear cuenta de vendedor en Tienda Sol"
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
        </Paper>
      </Box>
    </>
  )
}