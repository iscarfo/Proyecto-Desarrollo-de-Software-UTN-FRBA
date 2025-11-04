'use client';
import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Button } from '@mui/material';
import { FiUser } from 'react-icons/fi';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface UsuarioMenuProps {
  userType: 'buyer' | 'seller';
}

const UsuarioMenu: React.FC<UsuarioMenuProps> = ({ userType }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    handleClose();
    router.push('/inicio-sesion');
  };

  const oppositeView = userType === 'buyer' ? '/seller' : '/home';
  const oppositeLabel = userType === 'buyer' ? 'Vista de Vendedor' : 'Vista de Comprador';

  if (!user) {
    return (
      <IconButton
        aria-label="Iniciar sesión"
        onClick={() => router.push('/inicio-sesion')}
        sx={{ color: 'white' }}
      >
        <FiUser size={20} />
      </IconButton>
    );
  }

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
            minWidth: 180,
            padding: 2,
          },
        }}
      >
        <MenuItem onClick={handleLogout} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LogoutIcon fontSize="small" />
          Cerrar sesión
        </MenuItem>

        <Link href={oppositeView} passHref>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleClose}
          >
            {oppositeLabel}
          </Button>
        </Link>
      </Menu>
    </>
  );
};

export default UsuarioMenu;
