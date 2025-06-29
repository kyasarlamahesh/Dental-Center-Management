// src/components/PatientForm.js
import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText } from '@mui/material';

function PatientForm({ open, onClose, onSubmit, patient }) {
  // Central state for all form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    contact: '',
    healthInfo: '',
    password: '',
  });

  // Check if the form is for editing an existing patient
  const isEditing = patient != null;

  // Effect to populate form when editing, or reset when adding
  useEffect(() => {
    if (isEditing && open) {
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
        dob: patient.dob || '',
        contact: patient.contact || '',
        healthInfo: patient.healthInfo || '',
        password: '', // Password is not pre-filled for security
      });
    } else if (!isEditing) {
      // Reset form for new patient entry
      setFormData({
        name: '', email: '', dob: '', contact: '', healthInfo: '', password: '',
      });
    }
  }, [patient, open, isEditing]);

  // Generic change handler for all form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.dob || !formData.contact) {
      alert('Please fill out Name, Email, DOB, and Contact Info.');
      return;
    }
    // Password is required for new patients
    if (!isEditing && !formData.password) {
      alert('Password is required for a new patient account.');
      return;
    }

    onSubmit(formData);
    onClose(); // Close the dialog after submission
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ component: 'form', onSubmit: (e) => { e.preventDefault(); handleSubmit(); } }}>
      <DialogTitle>{isEditing ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
      <DialogContent>
        {isEditing && (
          <DialogContentText sx={{ mb: 2 }}>
            You are editing the details for <strong>{patient.name}</strong>.
          </DialogContentText>
        )}
        <TextField autoFocus margin="dense" name="name" label="Full Name" type="text" fullWidth variant="outlined" value={formData.name} onChange={handleChange} required />
        <TextField margin="dense" name="email" label="Email Address (for login)" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleChange} required />
        <TextField margin="dense" name="password" label="Password" type="password" fullWidth variant="outlined" value={formData.password} onChange={handleChange} required={!isEditing} helperText={isEditing ? "Leave blank to keep current password" : "Required for new patient login"} />
        <TextField margin="dense" name="dob" label="Date of Birth" type="date" fullWidth variant="outlined" value={formData.dob} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
        <TextField margin="dense" name="contact" label="Contact Info" type="text" fullWidth variant="outlined" value={formData.contact} onChange={handleChange} required />
        <TextField margin="dense" name="healthInfo" label="Health Info (Allergies, etc.)" type="text" fullWidth multiline rows={3} variant="outlined" value={formData.healthInfo} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">{isEditing ? 'Save Changes' : 'Save Patient'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PatientForm;
