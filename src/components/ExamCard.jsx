import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getExamStatus } from '../data/mockData.js';

function ExamCard({ exam }) {
  const navigate = useNavigate();
  const status = getExamStatus(exam);

  const isViewMoreEnabled = status === 'Today';

  const handleViewMore = () => {
    if (isViewMoreEnabled) {
      navigate(`/exam/${exam.id}`);
    }
  };

  return (
    <article className="card exam-card">
      <header className="card-header">
        <h3 className="card-title">{exam.subjectName}</h3>
        <span
          className={`status-pill ${
            status === 'Today'
              ? 'status-today'
              : status === 'Upcoming'
              ? 'status-upcoming'
              : 'status-completed'
          }`}
        >
          {status}
        </span>
      </header>
      <div className="card-body">
        <p className="exam-date">
          <span className="label">Exam Date:</span> {exam.date}
        </p>
        <p className="exam-time">
          <span className="label">Time:</span> {exam.time}
        </p>
        {status === 'Completed' && (
          <p className="exam-attendance">
            <span className="label">Attendance:</span>{' '}
            <span className="attendance-value">
              {exam.attendanceStatus || 'Absent'}
            </span>
          </p>
        )}
      </div>
      <footer className="card-footer">
        <button
          type="button"
          className="btn btn-outline"
          disabled={!isViewMoreEnabled}
          onClick={handleViewMore}
        >
          View More
        </button>
      </footer>
    </article>
  );
}

export default ExamCard;





