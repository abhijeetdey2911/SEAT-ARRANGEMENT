import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function Layout({ student }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <div className="brand-mark">VIT</div>
          <div>
            <h1 className="app-title">Exam Sitting Arrangement System</h1>
            <p className="app-subtitle">Student Portal</p>
          </div>
        </div>
        <div className="app-header-right">
          <div className="student-info">
            <span className="student-name">{student?.name}</span>
            <span className="student-roll">{student?.rollNo}</span>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link-active' : 'nav-link'
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admit-card"
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link-active' : 'nav-link'
          }
        >
          Admit Card
        </NavLink>
        <NavLink
          to="/exam-routine"
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link-active' : 'nav-link'
          }
        >
          Exam Routine
        </NavLink>
      </nav>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        © {new Date().getFullYear()} VIT College Examination Cell
      </footer>
    </div>
  );
}

export default Layout;





