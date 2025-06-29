// src/pages/IncidentManagement.js
import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { Container, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IncidentForm from '../components/IncidentForm';

function IncidentManagement() {
  const { incidents, patients, addIncident, updateIncident, deleteIncident } = useContext(DataContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);

  // A map for quick patient name lookup
  const patientMap = patients.reduce((acc, p) => {
    acc[p.id] = p.name;
    return acc;
  }, {});

  const handleOpenForm = (incident = null) => {
    setEditingIncident(incident);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setEditingIncident(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (incidentData) => {
    if (editingIncident) {
      updateIncident({ ...incidentData, id: editingIncident.id });
    } else {
      addIncident(incidentData);
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Appointment / Incident Management
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpenForm()}>
        Add New Appointment
      </Button>

      <IncidentForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        incident={editingIncident}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((inc) => (
              <TableRow key={inc.id}>
                <TableCell>{patientMap[inc.patientId] || 'Unknown Patient'}</TableCell>
                <TableCell>{inc.title}</TableCell>
                <TableCell>{new Date(inc.appointmentDate).toLocaleString()}</TableCell>
                <TableCell>{inc.status}</TableCell>
                <TableCell>${inc.cost || 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenForm(inc)}><EditIcon /></IconButton>
                  <IconButton onClick={() => deleteIncident(inc.id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

// ==================================================================
//
//      ===> !!! CRITICAL: MAKE SURE THIS LINE EXISTS AND IS CORRECT !!! <===
//
// ==================================================================
export default IncidentManagement;
