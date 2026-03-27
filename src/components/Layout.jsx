import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function Layout({ title, subtitle, userName, userId, links, onLogout, showNav = true }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <div className="brand-mark">VIT</div>
          <div>
            <h1 className="app-title">{title}</h1>
            <p className="app-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="app-header-right">
          <div className="student-info">
            <span className="student-name">{userName}</span>
            <span className="student-roll">{userId}</span>
          </div>
          <button type="button" className="btn btn-outline header-logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {showNav && (
        <nav className="app-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}

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







