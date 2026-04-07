import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RoleSelectionPage from './pages/RoleSelectionPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdmitCardPage from './pages/AdmitCardPage.jsx';
import ExamRoutinePage from './pages/ExamRoutinePage.jsx';
import ExamDetailsPage from './pages/ExamDetailsPage.jsx';
import Layout from './components/Layout.jsx';

function App() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // Optional health check to verify backend connection
  useEffect(() => {
    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => console.log('Students Data:', data))
      .catch((err) => console.error(err));
  }, []);

  const handleStudentLogin = (studentData) => {
    setCurrentStudent(studentData);
  };

  const handleAdminLogin = (adminData) => {
    setCurrentAdmin(adminData);
  };

  const handleStudentLogout = () => setCurrentStudent(null);
  const handleAdminLogout = () => setCurrentAdmin(null);

  return (
    <Routes>
      <Route path="/" element={<RoleSelectionPage />} />

      <Route
        path="/student/login"
        element={
          currentStudent ? (
            <Navigate to="/student/dashboard" replace />
          ) : (
            <LoginPage role="student" onLogin={handleStudentLogin} backPath="/" />
          )
        }
      />

      <Route
        path="/admin/login"
        element={
          currentAdmin ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <LoginPage role="admin" onLogin={handleAdminLogin} backPath="/" />
          )
        }
      />

      <Route
        path="/admin"
        element={
          currentAdmin ? (
            <Layout
              title="Exam Sitting Arrangement System"
              subtitle="Admin Portal"
              userName={currentAdmin.name}
              userId={currentAdmin.id}
              onLogout={handleAdminLogout}
              showNav
              links={[{ to: '/admin/dashboard', label: 'Dashboard' }]}
            />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      <Route
        path="/student"
        element={
          currentStudent ? (
            <Layout
              title="Exam Sitting Arrangement System"
              subtitle="Student Portal"
              userName={currentStudent.name}
              userId={currentStudent.rollNumber}
              onLogout={handleStudentLogout}
              showNav={false}
              links={[
                { to: '/student/dashboard', label: 'Dashboard' },
                { to: '/student/admit-card', label: 'Admit Card' },
                { to: '/student/exam-routine', label: 'Exam Routine' },
              ]}
            />
          ) : (
            <Navigate to="/student/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<Dashboard currentStudent={currentStudent} />} />
        <Route path="admit-card" element={<AdmitCardPage student={currentStudent} />} />
        <Route path="exam-routine" element={<ExamRoutinePage />} />
        <Route path="exam/:subject" element={<ExamDetailsPage currentStudent={currentStudent} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

