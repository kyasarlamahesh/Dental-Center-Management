// src/pages/PatientManagement.js
import React, { useContext, useState } from 'react';
import {
    Container, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataContext } from '../context/DataContext';
import PatientForm from '../components/PatientForm';

function PatientManagement() {
  const { patients, addPatient, updatePatient, deletePatient } = useContext(DataContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [patientToDeleteId, setPatientToDeleteId] = useState(null);

  // Open the form to add a new patient
  const handleAddClick = () => {
    setEditingPatient(null);
    setIsFormOpen(true);
  };

  // Open the form to edit an existing patient
  const handleEditClick = (patient) => {
    setEditingPatient(patient);
    setIsFormOpen(true);
  };

  // Open the delete confirmation dialog
  const handleDeleteClick = (patientId) => {
    setPatientToDeleteId(patientId);
    setOpenConfirmDialog(true);
  };

  // Confirm and execute the deletion
  const confirmDelete = () => {
    if (patientToDeleteId) {
      deletePatient(patientToDeleteId);
    }
    setOpenConfirmDialog(false);
    setPatientToDeleteId(null);
  };

  // Handle the form submission for both add and edit
  const handleFormSubmit = (formData) => {
    if (editingPatient) {
      // Pass the full patient object with its ID for updating
      updatePatient({ ...formData, id: editingPatient.id });
    } else {
      addPatient(formData);
    }
    setIsFormOpen(false);
    setEditingPatient(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPatient(null);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Patient Management
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleAddClick}>
        Add New Patient
      </Button>

      {/* The PatientForm dialog */}
      <PatientForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        patient={editingPatient}
      />

      {/* Table displaying the list of patients */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="patient table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email (Login)</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Health Info</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.contact}</TableCell>
                <TableCell>{patient.dob}</TableCell>
                <TableCell>{patient.healthInfo}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditClick(patient)} color="primary" aria-label={`edit ${patient.name}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(patient.id)} color="error" aria-label={`delete ${patient.name}`}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this patient and all their associated data, including their login account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default PatientManagement;
