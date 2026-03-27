import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockExams, getExamStatus } from '../data/mockData.js';
import SeatLayout from '../components/SeatLayout.jsx';

function ExamDetailsPage() {
  const { subject } = useParams();
  const navigate = useNavigate();

  const exam = mockExams.find((e) => e.id === subject);

  if (!exam) {
    return (
      <section>
        <h2 className="page-title">Exam Not Found</h2>
        <p className="page-subtitle">
          The exam you are looking for does not exist or has been removed.
        </p>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate('/student/exam-routine')}
        >
          Back to Exam Routine
        </button>
      </section>
    );
  }

  const status = getExamStatus(exam);
  const today = new Date();
  const examDate = new Date(exam.date);
  const isAfterExam = examDate < today;
  const attendance =
    isAfterExam && status === 'Completed'
      ? exam.attendanceStatus || 'Absent'
      : 'Not Available';

  return (
    <section className="exam-details">
      <button
        type="button"
        className="btn btn-outline back-button"
        onClick={() => navigate('/student/exam-routine')}
      >
        ← Back to Exam Routine
      </button>

      <h2 className="page-title">{exam.subjectName}</h2>
      <p className="page-subtitle">
        Detailed information about your seating arrangement and exam
        instructions.
      </p>

      <div className="details-layout">
        <article className="card details-card">
          <h3 className="section-title">Exam Information</h3>
          <div className="detail-row">
            <span className="label">Date</span>
            <span>{exam.date}</span>
          </div>
          <div className="detail-row">
            <span className="label">Time</span>
            <span>{exam.time}</span>
          </div>
          <div className="detail-row">
            <span className="label">Reporting Time</span>
            <span>{exam.reportingTime}</span>
          </div>
          <div className="detail-row">
            <span className="label">Status</span>
            <span>{status}</span>
          </div>
          <div className="detail-row">
            <span className="label">Attendance Status</span>
            <span>{attendance}</span>
          </div>
        </article>

        <article className="card details-card">
          <h3 className="section-title">Seating Arrangement</h3>
          <div className="detail-row">
            <span className="label">Room Number</span>
            <span>{exam.roomNumber}</span>
          </div>
          <div className="detail-row">
            <span className="label">Bench Number</span>
            <span>{exam.benchNumber}</span>
          </div>
          <div className="detail-row">
            <span className="label">Seat Number</span>
            <span>{exam.seatNumber}</span>
          </div>
        </article>
      </div>

      <article className="card instructions-card">
        <h3 className="section-title">Exam Instructions</h3>
        <ul className="instruction-list">
          {exam.instructions.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
          <li>Follow all additional instructions given by the invigilator.</li>
        </ul>
      </article>

      <SeatLayout yourSeatNumber={exam.seatNumber} />
    </section>
  );
}

export default ExamDetailsPage;







