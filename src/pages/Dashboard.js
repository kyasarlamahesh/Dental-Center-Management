// src/pages/Dashboard.js
import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Grid, Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

function Dashboard() {
  // 1. Get data from the context
  const { patients, incidents } = useContext(DataContext);

  // 2. Calculate KPIs based on the data
  const totalPatients = patients.length;
  const totalAppointments = incidents.length;

  // Calculate total revenue from completed incidents
  const totalRevenue = incidents.reduce((sum, incident) => {
    return incident.status === 'Completed' ? sum + (incident.cost || 0) : sum;
  }, 0);

  // Get the next 10 upcoming appointments
  const upcomingAppointments = incidents
    .filter(incident => new Date(incident.appointmentDate) > new Date()) // Filter for future dates
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)) // Sort by soonest
    .slice(0, 10); // Get the first 10

  // Helper component for KPI cards
  const KpiCard = ({ title, value, color }) => (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, backgroundColor: color, color: 'white' }}>
      <Typography component="h2" variant="h6" gutterBottom>{title}</Typography>
      <Typography component="p" variant="h4">{value}</Typography>
    </Paper>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      {/* Grid container for the KPI cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <KpiCard title="Total Patients" value={totalPatients} color="#1976d2" />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <KpiCard title="Total Appointments" value={totalAppointments} color="#388e3c"/>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <KpiCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} color="#f57c00"/>
        </Grid>
      </Grid>

      {/* Section for upcoming appointments */}
      <Paper sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Next 10 Upcoming Appointments
        </Typography>
        <List>
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(inc => (
              <ListItem key={inc.id} divider>
                <ListItemText
                  primary={inc.title}
                  secondary={`Patient ID: ${inc.patientId} | Date: ${new Date(inc.appointmentDate).toLocaleString()}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No upcoming appointments.</Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default Dashboard;
