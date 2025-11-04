'use client'
import React from 'react'
import { Box, Paper } from '@mui/material'
import Navbar from '@/components/Navbar/Navbar'
import { SignUp } from '@clerk/nextjs'

export default function RegisterUserPage() {
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
        <Paper elevation={3} sx={{ p: 4, width: 'auto', textAlign: 'center', borderRadius: 2 }}>
          <SignUp
            appearance={{
              elements: {
                rootBox: {
                  width: '450px',
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
            }}
            unsafeMetadata={{ role: 'buyer' }}
          />
        </Paper>
      </Box>
    </>
  )
}