// src/context/DataContext.js
import React, { createContext, useState, useEffect } from 'react';
import { initialData } from '../data/mockData';

export const DataContext = createContext();

// Helper to get data from localStorage safely
const getInitialState = (key, defaultValue) => {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  } catch (e) {
    console.error(`Failed to parse ${key} from localStorage`, e);
    return defaultValue;
  }
};

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState(() => getInitialState('users', initialData.users));
  const [patients, setPatients] = useState(() => getInitialState('patients', initialData.patients));
  const [incidents, setIncidents] = useState(() => getInitialState('incidents', initialData.incidents));

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);
  
  useEffect(() => {
    localStorage.setItem('incidents', JSON.stringify(incidents));
  }, [incidents]);

  /**
   * --- Patient & User Actions ---
   * The following functions manage both patient records and their associated user accounts.
   */

  /**
   * Adds a new patient and creates a corresponding user account for them.
   * @param {object} patientData - The patient's details from the form, including email and password.
   */
  const addPatient = (patientData) => {
    const newPatientId = `p${Date.now()}`;
    const newPatient = {
      id: newPatientId,
      name: patientData.name,
      email: patientData.email,
      dob: patientData.dob,
      contact: patientData.contact,
      healthInfo: patientData.healthInfo,
    };
    
    const newUser = {
      id: `u${Date.now()}`,
      role: 'Patient',
      email: patientData.email,
      password: patientData.password, // In a real app, this should be hashed
      patientId: newPatientId,
    };

    setPatients(prev => [...prev, newPatient]);
    setUsers(prev => [...prev, newUser]);
  };

  /**
   * Updates a patient's details and their user account information.
   * @param {object} updatedPatientData - The updated patient data.
   */
  const updatePatient = (updatedPatientData) => {
    const patientId = updatedPatientData.id;

    // Remove password from the patient object before saving it to the patients list
    const { password, ...patientDetails } = updatedPatientData;
    setPatients(prev => prev.map(p => (p.id === patientId ? patientDetails : p)));

    // Update corresponding user's details
    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.patientId === patientId) {
          const updatedUser = { ...user, email: updatedPatientData.email };
          // Only update password if a new one was provided
          if (password) {
            updatedUser.password = password;
          }
          return updatedUser;
        }
        return user;
      });
    });
  };

  /**
   * Deletes a patient, their user account, and all associated incidents.
   * @param {string} patientId - The ID of the patient to delete.
   */
  const deletePatient = (patientId) => {
    // Delete related incidents
    setIncidents(prev => prev.filter(inc => inc.patientId !== patientId));
    // Delete the user account
    setUsers(prev => prev.filter(u => u.patientId !== patientId));
    // Finally, delete the patient record
    setPatients(prev => prev.filter(p => p.id !== patientId));
  };

  // --- Incident Actions (no changes needed here) ---
  const addIncident = (incidentData) => {
    const newIncident = {
      id: `i${Date.now()}`,
      files: [],
      ...incidentData,
    };
    setIncidents(prev => [...prev, newIncident]);
  };

  const updateIncident = (updatedIncident) => {
    setIncidents(prev => prev.map(i => (i.id === updatedIncident.id ? updatedIncident : i)));
  };

  const deleteIncident = (incidentId) => {
    setIncidents(prev => prev.filter(i => i.id !== incidentId));
  };

  const value = {
    users,
    patients,
    incidents,
    addPatient,
    updatePatient,
    deletePatient,
    addIncident,
    updateIncident,
    deleteIncident,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
