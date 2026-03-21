import React from 'react';
import { mockExams } from '../data/mockData.js';

function AdmitCard({ student }) {
  return (
    <section className="card admit-card">
      <header className="card-header admit-card-header">
        <div>
          <h2 className="card-title">Examination Admit Card</h2>
          <p className="card-subtitle">End Semester Examinations</p>
        </div>
        <div className="admit-logo">VIT</div>
      </header>

      <div className="admit-student-details">
        <div className="detail-row">
          <span className="label">Name</span>
          <span>{student.name}</span>
        </div>
        <div className="detail-row">
          <span className="label">Roll No</span>
          <span>{student.rollNo}</span>
        </div>
        <div className="detail-row">
          <span className="label">Course</span>
          <span>{student.course}</span>
        </div>
        <div className="detail-row">
          <span className="label">Semester</span>
          <span>{student.semester}</span>
        </div>
      </div>

      <div className="admit-exams">
        <h3 className="section-title">Exam Schedule</h3>
        <div className="table-wrapper">
          <table className="exam-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Date</th>
                <th>Time</th>
                <th>Room</th>
                <th>Seat</th>
              </tr>
            </thead>
            <tbody>
              {mockExams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.subjectName}</td>
                  <td>{exam.date}</td>
                  <td>{exam.time}</td>
                  <td>{exam.roomNumber}</td>
                  <td>{exam.seatNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="admit-footer">
        <p className="admit-note">
          This is a system-generated admit card. Signature is not required.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            // Dummy action
            alert('Download started (demo only)');
          }}
        >
          Download Admit Card
        </button>
      </footer>
    </section>
  );
}

export default AdmitCard;





