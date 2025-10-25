'use client';
import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { FiUser } from 'react-icons/fi';
import LogoutIcon from '@mui/icons-material/Logout';

const UsuarioMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Lógica de cierre de sesión
    console.log('Cerrar sesión');
    handleClose();
  };

  return (
    <>
      <IconButton aria-label="Perfil de Usuario" onClick={handleClick} sx={{ color: 'white' }}>
        <FiUser size={20} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            backgroundColor: 'black',
            color: 'white',
            mt: 1,
            borderRadius: 2,
            minWidth: 160,
          },
        }}
      >
        <MenuItem onClick={handleLogout} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LogoutIcon fontSize="small" />
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
};

export default UsuarioMenu;
