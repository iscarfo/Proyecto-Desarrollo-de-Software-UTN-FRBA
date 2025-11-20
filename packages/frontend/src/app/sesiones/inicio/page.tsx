'use client'
import React from 'react'
import { Box, Paper, Link, Typography } from '@mui/material'
import Navbar from '@/components/Navbar/Navbar'
import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
<<<<<<< HEAD
||||||| 652cc4f
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    console.log('Iniciar sesión con:', email, password)
  }

=======
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

  const handleBlur = (field: 'email' | 'password', value: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]:
        field === 'email'
          ? validateEmail(value) ? '' : 'Ingresá un correo válido'
          : validatePassword(value) ? '' : 'La contraseña debe tener al menos 6 caracteres'
    }));
  };

>>>>>>> development
  return (
    <>
      <Navbar userType="buyer" minimal />
<<<<<<< HEAD
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '93vh',
        backgroundColor: '#f1f1f1'
      }}>
        <Paper elevation={3} sx={{ p: 4, width: 'auto', textAlign: 'center', borderRadius: 2 }}>
          <SignIn
            appearance={{
              elements: {
                rootBox: {
                  width: '340px',
                },
                card: {
                  boxShadow: 'none',
                },
                headerTitle: {
                  fontWeight: 'bold',
                },
                formButtonPrimary: {
                  backgroundColor: '#f79533',
                  '&:hover': {
                    backgroundColor: '#e68400',
                  },
                },
              },
||||||| 652cc4f
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '93vh',
        backgroundColor: '#f1f1f1'
      }}>
        <Paper elevation={3} sx={{ p: 4, width: 340, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Iniciar Sesión
          </Typography>

          <TextField
            label="E-mail"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#f79533',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#e68400' }
=======
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
            onBlur={() => handleBlur('email', email)}
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
            onBlur={() => handleBlur('password', password)}
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
>>>>>>> development
            }}
<<<<<<< HEAD
          />
||||||| 652cc4f
            //onClick={handleLogin}
            href='/home'
          >
            Iniciar Sesión
          </Button>
=======
            onClick={handleLogin}
          >
            Iniciar Sesión
          </Button>
>>>>>>> development

          <Box sx={{ mt: 2 }}>
<<<<<<< HEAD
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Link href="/registro" underline="hover">Crear cuenta</Link>
            </Typography>
||||||| 652cc4f
            <Link href="/sesiones/registro/compradores" underline="hover">Crear cuenta</Link><br />
            <Link href="/sesiones/registro/vendedores" underline="hover">Registrarme como vendedor</Link>
=======
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
>>>>>>> development
          </Box>
        </Paper>
      </Box>
    </>
  )
}