// src/components/PatientForm.js
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

function PatientForm({ open, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [contact, setContact] = useState('');
  const [healthInfo, setHealthInfo] = useState('');

  const handleSubmit = () => {
    // Basic validation
    if (!name || !dob || !contact) {
      alert('Please fill out all required fields.');
      return;
    }
    onSubmit({ name, dob, contact, healthInfo });
    onClose(); // Close the dialog after submit
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Patient</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Full Name" type="text" fullWidth variant="outlined" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField margin="dense" label="Date of Birth" type="date" fullWidth variant="outlined" value={dob} onChange={(e) => setDob(e.target.value)} InputLabelProps={{ shrink: true }} required />
        <TextField margin="dense" label="Contact Info" type="text" fullWidth variant="outlined" value={contact} onChange={(e) => setContact(e.target.value)} required />
        <TextField margin="dense" label="Health Info (Allergies, etc.)" type="text" fullWidth multiline rows={3} variant="outlined" value={healthInfo} onChange={(e) => setHealthInfo(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save Patient</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PatientForm;
