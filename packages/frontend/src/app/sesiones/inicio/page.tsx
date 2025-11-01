'use client'
import React, { useState } from 'react'
import { Box, Button, TextField, Typography, Link, Paper } from '@mui/material'
import Navbar from '@/components/Navbar/Navbar'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const validatePassword = (value: string) =>
    value.length >= 6

  const handleLogin = () => {
    const newErrors = {
      email: validateEmail(email) ? '' : 'Ingresá un correo válido',
      password: validatePassword(password) ? '' : 'La contraseña debe tener al menos 6 caracteres'
    }

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((msg) => msg !== '')
    if (hasErrors) return

    console.log('Iniciar sesión con:', email, password)
    // continuar con autenticación...
  }

  return (
    <>
      <Navbar userType="buyer" minimal />
      <Box
        role="main"
        aria-label="Formulario de inicio de sesión"
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
          aria-labelledby="login-title"
          sx={{ p: 4, width: 340, textAlign: 'center', borderRadius: 2 }}
        >
          <Typography
            id="login-title"
            variant="h5"
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Iniciar Sesión
          </Typography>

          <TextField
            label="E-mail"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            aria-describedby="email-help"
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
            aria-describedby="password-help"
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            aria-label="Iniciar sesión en Tienda Sol"
            sx={{
              backgroundColor: '#f79533',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#e68400' }
            }}
            onClick={handleLogin}
          >
            Iniciar Sesión
          </Button>

          <Box sx={{ mt: 2 }}>
            <Link
              href="/sesiones/registro/compradores"
              underline="hover"
              aria-label="Crear cuenta como comprador"
            >
              Crear cuenta
            </Link>
            <br />
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