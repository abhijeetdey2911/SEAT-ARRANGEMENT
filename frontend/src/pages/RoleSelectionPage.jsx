import React from 'react';
import { useNavigate } from 'react-router-dom';

function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <section className="role-page">
      <div className="role-wrapper">
        <h1 className="role-title">Exam Sitting Arrangement System</h1>
        <p className="role-subtitle">Choose your portal to continue</p>
        <div className="role-grid">
          <article className="card role-card" onClick={() => navigate('/admin/login')}>
            <h2 className="card-title">Admin</h2>
            <p className="card-body-text">
              Upload routine, manage students, generate and review seating reports.
            </p>
            <button type="button" className="btn btn-primary">
              Continue as Admin
            </button>
          </article>
          <article className="card role-card" onClick={() => navigate('/student/login')}>
            <h2 className="card-title">Student</h2>
            <p className="card-body-text">
              Access your dashboard, admit card, exam routine, and seating details.
            </p>
            <button type="button" className="btn btn-primary">
              Continue as Student
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}

export default RoleSelectionPage;
