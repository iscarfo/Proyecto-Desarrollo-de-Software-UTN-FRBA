'use client';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Pagination from '@/components/Pagination/Pagination';
import { Typography, Box, Container } from '@mui/material';
import { useState } from 'react';
import NotificationCard from '@/components/NotificationCard/NotificationCard';

export default function NotificationsPage() {
    //TODO: AJUSTAR SEGUN SESION DE USUARIO
    const userType: 'buyer' | 'seller' = 'buyer';

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // notifs por página

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
    const totalPages = Math.ceil(notifications.length / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleToggleRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n =>
                n._id === id ? { ...n, leida: !n.leida } : n
            )
        );
    };

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedNotifs = notifications.slice(startIndex, startIndex + pageSize);

    return (
    <div className="min-h-screen flex flex-col">
        <Navbar userType={userType} />

        <main
        role="main"
        aria-label="Sección de notificaciones"
        className="flex-grow py-12"
        style={{ backgroundColor: '#EDEDED' }}
        >
        <Container maxWidth="lg">
            <Typography
            variant="h4"
            sx={{ marginBottom: 4, fontWeight: 'bold', color: 'primary.main' }}
            >
            Notificaciones{' '}
            <Box
                component="span"
                aria-live="polite"
                sx={{
                fontSize: '20px',
                fontWeight: 400,
                color: 'text.secondary',
                marginLeft: 1
                }}
            >
                (sin leer {notifications.filter(n => !n.leida).length})
            </Box>
            </Typography>

            <Box role="region" aria-label="Listado de notificaciones">
            {paginatedNotifs.map((notif) => (
                <NotificationCard
                key={notif._id}
                notification={notif}
                onReadToggle={handleToggleRead}
                />
            ))}
            </Box>

            <Box sx={{ marginTop: 4 }} aria-label="Paginación de notificaciones">
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            </Box>
        </Container>
        </main>

        <Footer />
    </div>
    );

}
