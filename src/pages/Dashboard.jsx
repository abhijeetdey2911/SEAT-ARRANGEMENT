import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <section className="dashboard">
      <h2 className="page-title">Student Dashboard</h2>
      <p className="page-subtitle">
        Access your examination admit card, seating arrangement and exam
        routine from a single place.
      </p>

      <div className="dashboard-layout">
        <div className="dashboard-main">
          <div className="card-grid">
            <article
              className="card dashboard-card"
              onClick={() => navigate('/admit-card')}
            >
              <h3 className="card-title">Admit Card</h3>
              <p className="card-body-text">
                View and download your semester examination admit card with exam
                schedule and seating details.
              </p>
              <button type="button" className="btn btn-text">
                View Admit Card →
              </button>
            </article>

            <article
              className="card dashboard-card"
              onClick={() => navigate('/exam-routine')}
            >
              <h3 className="card-title">Exam Routine</h3>
              <p className="card-body-text">
                Check upcoming exams, today&apos;s exam, and completed exams
                with attendance status.
              </p>
              <button type="button" className="btn btn-text">
                View Exam Routine →
              </button>
            </article>
          </div>
        </div>

        <aside className="card dashboard-info-card">
          <h3 className="dashboard-info-title">Download via Student Login</h3>
          <ul className="dashboard-info-list">
            <li>Login using your registered Student ID and password.</li>
            <li>Open the Admit Card section from this dashboard.</li>
            <li>Verify your personal and exam details carefully.</li>
            <li>Click on “Download Admit Card” to save or print.</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

export default Dashboard;




