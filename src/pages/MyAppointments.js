// src/pages/MyAppointments.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { DataContext } from '../context/DataContext';
import { Container, Typography, Paper, Box, Chip, Link, Grid, Card, CardContent, CardHeader, Divider } from '@mui/material';

function MyAppointments() {
  const { currentUser } = useContext(AuthContext);
  const { incidents, patients } = useContext(DataContext);

  // Find the full patient record to get their name
  const patientDetails = currentUser && patients.find(p => p.id === currentUser.patientId);

  // Guard clause for users who are not logged in as patients
  if (!currentUser || currentUser.role !== 'Patient') {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Please log in as a patient to view your appointments.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Filter incidents for the currently logged-in patient and sort them
  const myIncidents = incidents
    .filter(inc => inc.patientId === currentUser.patientId)
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        My Appointments
      </Typography>
      <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
        Welcome, {patientDetails?.name || currentUser.email}!
      </Typography>
      
      {myIncidents.length > 0 ? (
        <Grid container spacing={3}>
          {myIncidents.map((inc) => (
            <Grid item xs={12} md={6} key={inc.id}>
              <Card raised sx={{ height: '100%' }}>
                <CardHeader
                  title={inc.title}
                  subheader={`Date: ${new Date(inc.appointmentDate).toLocaleString()}`}
                  action={
                    <Chip 
                      label={inc.status} 
                      color={
                        inc.status === 'Completed' ? 'success' : 
                        inc.status === 'Scheduled' ? 'info' :
                        inc.status === 'Cancelled' ? 'error' : 'default'
                      } 
                    />
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    <strong>Description:</strong> {inc.description || 'N/A'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Treatment / Comments:</strong> {inc.comments || 'N/A'}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    <strong>Cost:</strong> {inc.cost ? `$${Number(inc.cost).toFixed(2)}` : 'Not specified'}
                  </Typography>
                  {inc.files && inc.files.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2">Attachments:</Typography>
                      {inc.files.map((file, fileIndex) => (
                        <Link href={file.url} download={file.name} key={fileIndex} sx={{display: 'block'}}>
                          {file.name}
                        </Link>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{p: 3, textAlign: 'center'}}>
            <Typography>You have no appointments on record.</Typography>
        </Paper>
      )}
    </Container>
  );
}

export default MyAppointments;
