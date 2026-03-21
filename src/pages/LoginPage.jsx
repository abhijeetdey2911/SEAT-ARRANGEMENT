import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentId && password) {
      onLogin();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-illustration">
          <div className="auth-illustration-content">
            <div className="auth-illustration-icon">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="50" fill="#ffffff" opacity="0.15" />
                <rect x="30" y="45" width="60" height="40" rx="4" fill="#ffffff" opacity="0.95" />
                <rect x="35" y="50" width="50" height="28" rx="2" fill="#e0e7ff" opacity="0.8" />
                <path d="M45 58h30v2H45zM45 64h20v2H45z" fill="#2563eb" opacity="0.5" />
                <path d="M55 25l25 15v5H40v-5l15-15z" fill="#ffffff" opacity="0.95" />
                <path d="M60 18l-6 7h12l-6-7z" fill="#ffffff" />
                <circle cx="60" cy="15" r="5" fill="#fbbf24" opacity="0.9" />
              </svg>
            </div>
            <h2 className="auth-illustration-title">Exam Sitting Arrangement</h2>
            <p className="auth-illustration-tagline">Where Every Student Finds Their Seat</p>
          </div>
        </div>
        <div className="auth-form-panel">
          <div className="auth-brand">VIT</div>
          <div className="auth-card">
            <h1 className="auth-title">Student Login</h1>
            <p className="auth-subtitle">Hey enter your details to sign in to your account.</p>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="25mca10005"
                  required
                />
              </div>
              <div className="form-group">
                <div className="form-group-row">
                  <label htmlFor="password">Password</label>
                  <a href="#" className="auth-link" onClick={(e) => e.preventDefault()}>
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary auth-button">
                Login
              </button>
            </form>
            <p className="auth-register">
              Don&apos;t have account?{' '}
              <a href="#" className="auth-link" onClick={(e) => e.preventDefault()}>
                Create new account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;



