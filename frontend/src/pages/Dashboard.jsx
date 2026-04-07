import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ currentStudent }) {
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [examRoutine, setExamRoutine] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCard, setActiveCard] = useState('hall-ticket');
  const navigate = useNavigate();

  useEffect(() => {
    const loadStudentDashboard = async () => {
      if (!currentStudent?.rollNumber) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const [studentRes, seatingRes, routineRes, studentsRes] = await Promise.all([
          fetch(`/api/students/${encodeURIComponent(currentStudent.rollNumber)}`),
          fetch(`/api/seating/${encodeURIComponent(currentStudent.rollNumber)}`),
          fetch('/api/examRoutine'),
          fetch('/api/students'),
        ]);

        const studentData = studentRes.ok ? await studentRes.json() : currentStudent;
        const seatingData = seatingRes.ok ? await seatingRes.json() : [];
        const routineData = routineRes.ok ? await routineRes.json() : [];
        const studentsData = studentsRes.ok ? await studentsRes.json() : [];

        setStudent(studentData);
        setExams(Array.isArray(seatingData) ? seatingData : []);
        setExamRoutine(Array.isArray(routineData) ? routineData : []);
        setStudents(Array.isArray(studentsData) ? studentsData : []);
      } catch (error) {
        console.error('Failed to load student dashboard', error);
        setError('Failed to load dashboard data. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    loadStudentDashboard();
  }, [currentStudent]);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const isTodayExam = (examDate) => {
    const normalized = String(examDate || '').slice(0, 10);
    return normalized === todayISO;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <p className="page-subtitle">Loading...</p>;
  }

  return (
    <section className="dashboard">
      <h2 className="page-title">Student Dashboard</h2>
      <p className="page-subtitle">Hall ticket and seating updates from live backend data.</p>
      {error && <p className="error-text">{error}</p>}

      <div className="card-grid dashboard-theme-grid">
        <article
          className={`card dashboard-card theme-card ${activeCard === 'hall-ticket' ? 'theme-card-active' : ''}`}
          onClick={() => setActiveCard('hall-ticket')}
        >
          <h3 className="card-title">Hall Ticket (Admit Card)</h3>
          <p className="card-body-text">View details and download your admit card PDF.</p>
        </article>

        <article
          className={`card dashboard-card theme-card ${activeCard === 'seating' ? 'theme-card-active' : ''}`}
          onClick={() => setActiveCard('seating')}
        >
          <h3 className="card-title">Seating Arrangement Info</h3>
          <p className="card-body-text">Today&apos;s exam is clickable. Others are locked.</p>
        </article>
      </div>

      {activeCard === 'hall-ticket' && (
        <article className="card theme-panel" style={{ marginTop: '1rem' }}>
          <header className="card-header">
            <div>
              <h3 className="card-title">Hall Ticket (Admit Card)</h3>
              <p className="card-subtitle">Student details and assigned exam seats.</p>
            </div>
            <button type="button" className="btn btn-primary" onClick={handlePrint}>
              Download as PDF
            </button>
          </header>
          <p className="card-body-text">
            Name: {student?.name || currentStudent?.name || '-'} | Roll: {student?.rollNumber || currentStudent?.rollNumber || '-'} | Department: {student?.department || '-'}
          </p>
          <p className="card-subtitle">
            Total Students: {students.length} | Exams Scheduled: {examRoutine.length}
          </p>
          <div className="table-wrapper">
            <table className="exam-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Bench</th>
                  <th>Seat</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={`${exam.subjectName}-${exam.rollNumber}`}>
                    <td>{exam.subjectName}</td>
                    <td>{exam.examDate}</td>
                    <td>{exam.examTime}</td>
                    <td>{exam.roomNumber}</td>
                    <td>{exam.benchNumber}</td>
                    <td>{exam.seatNumber}</td>
                  </tr>
                ))}
                {exams.length === 0 && (
                  <tr>
                    <td colSpan="6">No exam assignments available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {activeCard === 'seating' && (
        <article className="card theme-panel" style={{ marginTop: '1rem' }}>
          <h3 className="card-title">Seating Arrangement Info</h3>
          <div className="student-exam-list">
            {exams.map((exam) => {
              const openable = isTodayExam(exam.examDate);
              return (
                <button
                  key={`seat-${exam.subjectName}`}
                  type="button"
                  className={`student-exam-item ${openable ? 'student-exam-open' : 'student-exam-locked'}`}
                  onClick={() => openable && navigate(`/student/exam/${encodeURIComponent(exam.subjectName)}`)}
                  disabled={!openable}
                >
                  <span>{exam.subjectName} - {exam.examDate}</span>
                  <span>{openable ? 'Open' : 'Locked 🔒'}</span>
                </button>
              );
            })}
            {exams.length === 0 && <p className="page-subtitle">No exams assigned yet.</p>}
          </div>
        </article>
      )}
    </section>
  );
}

export default Dashboard;