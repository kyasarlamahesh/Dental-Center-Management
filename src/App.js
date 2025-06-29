// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
// Make sure ProtectedRoute is removed from imports if it's no longer used elsewhere
// import ProtectedRoute from './components/ProtectedRoute'; 
import PatientManagement from './pages/PatientManagement';
import IncidentManagement from './pages/IncidentManagement';
import CalendarView from './pages/CalendarView';
import MyAppointments from './pages/MyAppointments';

// AppWrapper remains the same
function AppWrapper() {
  return (
    <DataProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </DataProvider>
  );
}

// REPLACE the old AppContent function with this new version
function AppContent() {
  const { currentUser } = useAuth();

  // If a user is NOT logged in, they can only access the login page.
  // Any other URL will redirect them to /login.
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If a user IS logged in, they are presented with the main application routes.
  // They can no longer access the login page.
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Admin-specific routes */}
        {currentUser.role === 'Admin' && (
          <>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<PatientManagement />} />
            <Route path="incidents" element={<IncidentManagement />} />
            <Route path="calendar" element={<CalendarView />} />
          </>
        )}

        {/* Patient-specific routes */}
        {currentUser.role === 'Patient' && (
          <>
            {/* Both the root and /my-appointments will show the patient's appointments */}
            <Route index element={<MyAppointments />} />
            <Route path="my-appointments" element={<MyAppointments />} />
          </>
        )}
        
        {/* A fallback for any invalid URL for a logged-in user, redirects to their main page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* If a logged-in user tries to go to /login, redirect them to the main app */}
      <Route path="/login" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppWrapper;
