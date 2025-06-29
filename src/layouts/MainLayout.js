// src/layouts/MainLayout.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemText, CssBaseline } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Corrected import path

const drawerWidth = 240;

const MainLayout = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Navigation items for Admin role
    const navItemsAdmin = [
        { text: 'Dashboard', path: '/' },
        { text: 'Patients', path: '/patients' },
        { text: 'Appointments (Admin)', path: '/incidents' }, // Matches route in App.js
        { text: 'Calendar', path: '/calendar' },
    ];

    // Navigation items for Patient role
    const navItemsPatient = [
        { text: 'My Appointments', path: '/my-appointments' },
    ];

    // Determine which set of navigation items to display
    const currentNavItems = currentUser?.role === 'Admin' ? navItemsAdmin : navItemsPatient;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        ENTNT Dental Dashboard
                    </Typography>
                    {currentUser && (
                        <Typography variant="subtitle1" sx={{ mr: 2 }}>
                            Welcome, {currentUser.email} ({currentUser.role})
                        </Typography>
                    )}
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar /> {/* Spacer for AppBar */}
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {currentNavItems.map((item) => (
                            <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${drawerWidth}px)` }}>
                <Toolbar /> {/* Another spacer for AppBar */}
                <Outlet /> {/* This is where nested routes (like Dashboard, PatientManagement) will render */}
            </Box>
        </Box>
    );
};

export default MainLayout;
