// src/components/IncidentForm.js
import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Function to convert file to base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

function IncidentForm({ open, onClose, onSubmit, incident }) {
  const { patients } = useContext(DataContext);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Populate form if editing, else reset
    if (incident) {
      setFormData({
        patientId: incident.patientId || '',
        title: incident.title || '',
        description: incident.description || '',
        appointmentDate: incident.appointmentDate ? incident.appointmentDate.substring(0, 16) : '', // Format for datetime-local
        status: incident.status || 'Scheduled',
        cost: incident.cost || '',
        comments: incident.comments || '',
        files: incident.files || [],
      });
    } else {
      setFormData({
        patientId: '',
        title: '',
        description: '',
        appointmentDate: '',
        status: 'Scheduled',
        cost: '',
        comments: '',
        files: [],
      });
    }
  }, [incident, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64Url = await toBase64(file);
    const newFile = { name: file.name, url: base64Url };
    
    setFormData(prev => ({ ...prev, files: [...prev.files, newFile] }));
  };
  
  const removeFile = (fileName) => {
      setFormData(prev => ({...prev, files: prev.files.filter(f => f.name !== fileName)}));
  }

  const handleSubmit = () => {
    if (!formData.patientId || !formData.title || !formData.appointmentDate) {
      alert('Please select a patient and provide a title and appointment date.');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const dialogTitle = incident ? 'Edit Appointment' : 'Add New Appointment';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <TextField select label="Patient" name="patientId" value={formData.patientId} onChange={handleChange} fullWidth required margin="dense">
          {patients.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
        </TextField>
        <TextField name="title" label="Title" value={formData.title} onChange={handleChange} fullWidth required margin="dense" />
        <TextField name="description" label="Description" value={formData.description} onChange={handleChange} fullWidth multiline rows={2} margin="dense" />
        <TextField name="appointmentDate" label="Appointment Date & Time" type="datetime-local" value={formData.appointmentDate} onChange={handleChange} fullWidth required margin="dense" InputLabelProps={{ shrink: true }} />
        <TextField select label="Status" name="status" value={formData.status} onChange={handleChange} fullWidth margin="dense">
          {['Scheduled', 'Completed', 'Canceled'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField name="cost" label="Cost ($)" type="number" value={formData.cost} onChange={handleChange} fullWidth margin="dense" />
        <TextField name="comments" label="Comments / Treatment Notes" value={formData.comments} onChange={handleChange} fullWidth multiline rows={2} margin="dense" />
        
        {/* File Upload Section */}
        <Box mt={2}>
            <Typography variant="subtitle1">Attachments</Typography>
            <Button variant="contained" component="label">
                Upload File
                <input type="file" hidden onChange={handleFileChange} />
            </Button>
            <Box mt={1}>
                {formData.files?.map(file => (
                    <Box key={file.name} display="flex" alignItems="center">
                        <Typography sx={{flexGrow: 1}}>{file.name}</Typography>
                        <IconButton size="small" onClick={() => removeFile(file.name)}><CloseIcon /></IconButton>
                    </Box>
                ))}
            </Box>
        </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default IncidentForm;
