import React from 'react';
import { adminActions } from '../data/mockData.js';

function AdminDashboard() {
  return (
    <section className="dashboard">
      <h2 className="page-title">Admin Dashboard</h2>
      <p className="page-subtitle">
        Manage routines, student records, seating layouts, and downloadable reports.
      </p>

      <div className="card-grid">
        {adminActions.map((action) => (
          <article key={action.id} className="card dashboard-card admin-action-card">
            <h3 className="card-title">{action.title}</h3>
            <p className="card-body-text">{action.description}</p>
            <button type="button" className="btn btn-text">
              Open Action →
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminDashboard;
