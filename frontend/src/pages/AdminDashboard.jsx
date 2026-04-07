import React, { useEffect, useState } from 'react';

const EMPTY_STUDENT = { name: '', rollNumber: '', department: 'CSE', exam: '' };
const EMPTY_ROUTINE = {
  subjectName: '',
  examDate: '',
  examTime: '',
  reportingTime: '',
  roomNumber: '',
};
const EMPTY_SEATING = {
  subjectName: '',
  examDate: '',
  examTime: '',
  reportingTime: '',
  roomNumber: '',
  columnsPerBench: 2,
};

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT);
  const [editStudentId, setEditStudentId] = useState('');
  const [routineForm, setRoutineForm] = useState(EMPTY_ROUTINE);
  const [seatingForm, setSeatingForm] = useState(EMPTY_SEATING);
  const [message, setMessage] = useState('');
  const [activeCard, setActiveCard] = useState('routine');

  const loadData = async () => {
    const [studentRes, routineRes, seatingRes] = await Promise.all([
      fetch('/api/students'),
      fetch('/api/exam-routine'),
      fetch('/api/seating'),
    ]);
    const studentsData = studentRes.ok ? await studentRes.json() : [];
    const routinesData = routineRes.ok ? await routineRes.json() : [];
    const seatingData = seatingRes.ok ? await seatingRes.json() : [];
    setStudents(Array.isArray(studentsData) ? studentsData : []);
    setRoutines(Array.isArray(routinesData) ? routinesData : []);
    setAssignments(Array.isArray(seatingData) ? seatingData : []);
  };

  useEffect(() => {
    loadData().catch((error) => console.error('Failed to load admin dashboard data', error));
  }, []);

  const submitRoutine = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/exam-routine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routineForm),
    });
    if (!res.ok) {
      setMessage('Failed to save exam routine');
      return;
    }
    setRoutineForm(EMPTY_ROUTINE);
    setMessage('Exam routine saved');
    await loadData();
  };

  const generateSeating = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/seating/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...seatingForm,
        columnsPerBench: Number(seatingForm.columnsPerBench) || 2,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.message || 'Failed to generate seating');
      return;
    }
    setMessage(`Seating generated for ${data.count} students`);
    await loadData();
  };

  const submitStudent = async (e) => {
    e.preventDefault();
    const path = editStudentId ? `/api/students/${editStudentId}` : '/api/students';
    const method = editStudentId ? 'PUT' : 'POST';
    const res = await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.message || 'Failed to save student');
      return;
    }
    setStudentForm(EMPTY_STUDENT);
    setEditStudentId('');
    setMessage('Student saved successfully');
    await loadData();
  };

  const startEditStudent = (student) => {
    setEditStudentId(student._id);
    setStudentForm({
      name: student.name || '',
      rollNumber: student.rollNumber || '',
      department: student.department || 'CSE',
      exam: student.exam || '',
    });
  };

  const deleteStudent = async (id) => {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setMessage('Failed to delete student');
      return;
    }
    setMessage('Student deleted successfully');
    await loadData();
  };

  return (
    <section className="dashboard">
      <h2 className="page-title">Admin Dashboard</h2>
      <p className="page-subtitle">Old dashboard format with live backend updates.</p>
      {message && <p className="page-subtitle">{message}</p>}

      <div className="card-grid dashboard-theme-grid">
        <article
          className={`card dashboard-card admin-action-card theme-card ${activeCard === 'routine' ? 'theme-card-active' : ''}`}
          onClick={() => setActiveCard('routine')}
        >
          <h3 className="card-title">1. Upload Exam Routine</h3>
          <p className="card-body-text">Create routine and instantly view below.</p>
        </article>

        <article
          className={`card dashboard-card admin-action-card theme-card ${activeCard === 'seating' ? 'theme-card-active' : ''}`}
          onClick={() => setActiveCard('seating')}
        >
          <h3 className="card-title">2. Generate Seating Arrangement</h3>
          <p className="card-body-text">Generate and instantly view saved seat assignments.</p>
        </article>

        <article
          className={`card dashboard-card admin-action-card theme-card ${activeCard === 'students' ? 'theme-card-active' : ''}`}
          onClick={() => setActiveCard('students')}
        >
          <h3 className="card-title">3. Manage Students</h3>
          <p className="card-body-text">Add, edit, delete and instantly refresh student data.</p>
        </article>
      </div>

      {activeCard === 'routine' && (
        <article className="card theme-panel" style={{ marginTop: '1rem' }}>
          <h3 className="card-title">Upload Exam Routine</h3>
          <form className="auth-form" onSubmit={submitRoutine}>
            <input placeholder="Subject Name" value={routineForm.subjectName} onChange={(e) => setRoutineForm({ ...routineForm, subjectName: e.target.value })} required />
            <input type="date" value={routineForm.examDate} onChange={(e) => setRoutineForm({ ...routineForm, examDate: e.target.value })} required />
            <input placeholder="Exam Time" value={routineForm.examTime} onChange={(e) => setRoutineForm({ ...routineForm, examTime: e.target.value })} required />
            <input placeholder="Reporting Time" value={routineForm.reportingTime} onChange={(e) => setRoutineForm({ ...routineForm, reportingTime: e.target.value })} />
            <input placeholder="Room Number" value={routineForm.roomNumber} onChange={(e) => setRoutineForm({ ...routineForm, roomNumber: e.target.value })} required />
            <button className="btn btn-primary" type="submit">Save Routine</button>
          </form>
          <div className="table-wrapper" style={{ marginTop: '0.75rem' }}>
            <table className="exam-table">
              <thead>
                <tr><th>Subject</th><th>Date</th><th>Time</th><th>Room</th></tr>
              </thead>
              <tbody>
                {routines.slice(0, 6).map((r) => (
                  <tr key={r._id}>
                    <td>{r.subjectName}</td>
                    <td>{r.examDate}</td>
                    <td>{r.examTime}</td>
                    <td>{r.roomNumber}</td>
                  </tr>
                ))}
                {routines.length === 0 && <tr><td colSpan="4">No routines yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {activeCard === 'seating' && (
        <article className="card theme-panel" style={{ marginTop: '1rem' }}>
          <h3 className="card-title">Generate Seating Arrangement</h3>
          <form className="auth-form" onSubmit={generateSeating}>
            <input placeholder="Subject Name" value={seatingForm.subjectName} onChange={(e) => setSeatingForm({ ...seatingForm, subjectName: e.target.value })} required />
            <input type="date" value={seatingForm.examDate} onChange={(e) => setSeatingForm({ ...seatingForm, examDate: e.target.value })} required />
            <input placeholder="Exam Time" value={seatingForm.examTime} onChange={(e) => setSeatingForm({ ...seatingForm, examTime: e.target.value })} required />
            <input placeholder="Reporting Time" value={seatingForm.reportingTime} onChange={(e) => setSeatingForm({ ...seatingForm, reportingTime: e.target.value })} />
            <input placeholder="Room Number" value={seatingForm.roomNumber} onChange={(e) => setSeatingForm({ ...seatingForm, roomNumber: e.target.value })} required />
            <input type="number" min="1" placeholder="Columns Per Bench" value={seatingForm.columnsPerBench} onChange={(e) => setSeatingForm({ ...seatingForm, columnsPerBench: e.target.value })} required />
            <button className="btn btn-primary" type="submit">Generate Seating</button>
          </form>
          <div className="table-wrapper" style={{ marginTop: '0.75rem' }}>
            <table className="exam-table">
              <thead>
                <tr><th>Subject</th><th>Roll</th><th>Room</th><th>Seat</th></tr>
              </thead>
              <tbody>
                {assignments.slice(0, 8).map((a) => (
                  <tr key={a._id}>
                    <td>{a.subjectName}</td>
                    <td>{a.rollNumber}</td>
                    <td>{a.roomNumber}</td>
                    <td>{a.seatNumber}</td>
                  </tr>
                ))}
                {assignments.length === 0 && <tr><td colSpan="4">No seating assignments yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {activeCard === 'students' && (
        <article className="card theme-panel" style={{ marginTop: '1rem' }}>
          <h3 className="card-title">Manage Students</h3>
          <form className="auth-form" onSubmit={submitStudent}>
            <input placeholder="Name" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} required />
            <input placeholder="Roll Number" value={studentForm.rollNumber} onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })} required />
            <select value={studentForm.department} onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ME">ME</option>
              <option value="ECE">ECE</option>
            </select>
            <input placeholder="Primary Exam" value={studentForm.exam} onChange={(e) => setStudentForm({ ...studentForm, exam: e.target.value })} required />
            <button className="btn btn-primary" type="submit">{editStudentId ? 'Update Student' : 'Add Student'}</button>
          </form>

          <div className="table-wrapper" style={{ marginTop: '0.75rem' }}>
            <table className="exam-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll</th>
                  <th>Dept</th>
                  <th>Exam</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.rollNumber}</td>
                    <td>{student.department}</td>
                    <td>{student.exam}</td>
                    <td>
                      <button type="button" className="btn btn-text" onClick={() => startEditStudent(student)}>Edit</button>
                      <button type="button" className="btn btn-text" onClick={() => deleteStudent(student._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && <tr><td colSpan="5">No students available.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </section>
  );
}

export default AdminDashboard;
