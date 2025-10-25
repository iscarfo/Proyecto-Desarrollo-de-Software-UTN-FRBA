'use client'
import React, { useState } from 'react'
import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import Navbar from '@/components/Navbar/Navbar'

export default function RegisterUserPage() {
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = () => {
    console.log('Registrarse comprador:', { email, nombre, telefono, password })
  }

  return (
    <>
      <Navbar userType="buyer" minimal />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '93vh',
          backgroundColor: '#f1f1f1'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: 450, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Crear Cuenta
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
            label="Nombre"
            variant="outlined"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Teléfono"
            variant="outlined"
            fullWidth
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
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
            onClick={handleRegister}
          >
            Crear cuenta
          </Button>
        </Paper>
      </Box>
    </>
  )
}