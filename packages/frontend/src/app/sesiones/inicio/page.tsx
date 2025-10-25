'use client'
import React, { useState } from 'react'
import { Box, Button, TextField, Typography, Link, Paper } from '@mui/material'
import Navbar from '@/components/Navbar/Navbar'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    console.log('Iniciar sesión con:', email, password)
  }

  return (
    <>
      <Navbar userType="buyer" minimal />
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
            }}
            //onClick={handleLogin}
            href='/home'
          >
            Iniciar Sesión
          </Button>

          <Box sx={{ mt: 2 }}>
            <Link href="/sesiones/registro/compradores" underline="hover">Crear cuenta</Link><br />
            <Link href="/sesiones/registro/vendedores" underline="hover">Registrarme como vendedor</Link>
          </Box>
        </Paper>
      </Box>
    </>
  )
}