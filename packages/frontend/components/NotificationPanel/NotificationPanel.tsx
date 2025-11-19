'use client';
import { useState, useEffect } from 'react';
import { Typography, Box, Container, Popover } from '@mui/material';
import Pagination from '@/components/Pagination/Pagination';
import NotificationCard from '@/components/NotificationCard/NotificationCard';

interface NotificationPanelProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void; // 👈 nueva prop
}

export default function NotificationPanel({ anchorEl, onClose, onUnreadCountChange }: NotificationPanelProps) {
  const open = Boolean(anchorEl);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // ✅ Tu array tal cual lo definiste
  const sampleNotif = [
    {
      "_id": "68ec4090c7e27dfd142b099f",
      "usuarioDestinoId": "68e918b93408f1c9e2599d72",
      "mensaje": "Tu pedido ha sido enviado.",
      "leida": false,
      "fechaCreacion": "2025-10-12T23:58:08.157Z",
      "fechaLectura": null,
      "createdAt": "2025-10-12T23:58:08.158Z",
      "updatedAt": "2025-10-12T23:58:08.158Z"
    },
    {
      "_id": "68ec4090c7e27dfd142b097f",
      "usuarioDestinoId": "68e918b93408f1c9e2599d72",
      "mensaje": "Tu pedido ha sido enviado.",
      "leida": false,
      "fechaCreacion": "2025-10-12T23:58:08.157Z",
      "fechaLectura": null,
      "createdAt": "2025-10-12T23:58:08.158Z",
      "updatedAt": "2025-10-12T23:58:08.158Z"
    },
    {
      "_id": "68ec408ac7e27dfd142b098f",
      "usuarioDestinoId": "68e918b93408f1c9e2599d72",
      "mensaje": "Felicidades, tu pedido ha sido confirmado! Te avisaremos cuando esté en camino.",
      "leida": false,
      "fechaCreacion": "2025-10-12T23:58:02.757Z",
      "fechaLectura": null,
      "createdAt": "2025-10-12T23:58:02.757Z",
      "updatedAt": "2025-10-12T23:58:02.757Z"
    },
    {
      "_id": "68ec4090c7e27dfd142b098a",
      "usuarioDestinoId": "68e918b93408f1c9e2599d72",
      "mensaje": "Tu pedido ha sido enviado.",
      "leida": false,
      "fechaCreacion": "2025-10-12T23:58:08.157Z",
      "fechaLectura": null,
      "createdAt": "2025-10-12T23:58:08.158Z",
      "updatedAt": "2025-10-12T23:58:08.158Z"
    },
    {
      "_id": "68ec4090c7e27dfd142b098b",
      "usuarioDestinoId": "68e918b93408f1c9e2599d72",
      "mensaje": "Tu pedido ha sido enviado.",
      "leida": false,
      "fechaCreacion": "2025-10-12T23:58:08.157Z",
      "fechaLectura": null,
      "createdAt": "2025-10-12T23:58:08.158Z",
      "updatedAt": "2025-10-12T23:58:08.158Z"
    },
    {
      "_id": "68ec407ac7e27dfd142b0970",
      "usuarioDestinoId": "68e918b93408f1c9e2599d72",
      "mensaje": "Tu pedido ha sido cancelado.",
      "leida": false,
      "fechaCreacion": "2025-10-12T23:57:46.967Z",
      "fechaLectura": null,
      "createdAt": "2025-10-12T23:57:46.969Z",
      "updatedAt": "2025-10-12T23:57:46.969Z"
    },
    {
      "_id": "68ec4052c7e27dfd142b0960",
      "usuarioDestinoId": "68e918b93408f1c9e2599d72",
      "mensaje": "Felicidades, tu pedido ha sido confirmado! Te avisaremos cuando esté en camino.",
      "leida": false,
      "fechaCreacion": "2025-10-12T23:57:06.880Z",
      "fechaLectura": null,
      "createdAt": "2025-10-12T23:57:06.880Z",
      "updatedAt": "2025-10-12T23:57:06.880Z"
    },
  ];

  const [notifications, setNotifications] = useState(sampleNotif);
  const unreadCount = notifications.filter(n => !n.leida).length;

  // cada vez que cambia, avisamos a la Navbar
  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  const totalPages = Math.ceil(notifications.length / pageSize);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleToggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, leida: !n.leida } : n))
    );
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedNotifs = notifications.slice(startIndex, startIndex + pageSize);

  return (
        <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
            sx: {
            overflow: 'visible',
            mt: 1, // 👈 separa un poquito el popup del icono
            '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: -5,          // 👈 mueve la flecha justo encima del borde
                right: 13,        // 👈 ajustá según quieras que apunte al ícono
                width: 10,
                height: 10,
                bgcolor: '#EDEDED',
                transform: 'rotate(45deg)',
                zIndex: 0,
            },
            },
        }}
        >
      <Box sx={{ width: 400, maxHeight: 500, overflowY: 'auto', p: 2, backgroundColor: '#EDEDED' }}>
        <Container maxWidth="sm">
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Notificaciones{' '}
            <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary', ml: 1 }}>
              (sin leer {notifications.filter(n => !n.leida).length})
            </Box>
          </Typography>

          {paginatedNotifs.map((notif) => (
            <NotificationCard
              key={notif._id}
              notification={notif}
              onReadToggle={handleToggleRead}
            />
          ))}

          <Box sx={{ mt: 2 }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        </Container>
      </Box>
    </Popover>
  );
}