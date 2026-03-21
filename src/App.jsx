import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdmitCardPage from './pages/AdmitCardPage.jsx';
import ExamRoutinePage from './pages/ExamRoutinePage.jsx';
import ExamDetailsPage from './pages/ExamDetailsPage.jsx';
import Layout from './components/Layout.jsx';
import { mockStudent } from './data/mockData.js';

function App() {
  const [currentStudent, setCurrentStudent] = useState(null);

  const handleLogin = () => {
    // For now we just log in the single mock student
    setCurrentStudent(mockStudent);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentStudent ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/"
        element={
          currentStudent ? (
            <Layout student={currentStudent} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route
          path="admit-card"
          element={<AdmitCardPage student={currentStudent} />}
        />
        <Route path="exam-routine" element={<ExamRoutinePage />} />
        <Route path="exam/:examId" element={<ExamDetailsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;





