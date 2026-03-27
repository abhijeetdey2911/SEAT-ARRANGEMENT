import React from 'react';
import { mockExams } from '../data/mockData.js';
import ExamCard from '../components/ExamCard.jsx';

function ExamRoutinePage() {
  return (
    <section>
      <h2 className="page-title">Exam Routine</h2>
      <p className="page-subtitle">
        Overview of all your exams with status and quick access to details.
      </p>
      <div className="card-grid">
        {mockExams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </section>
  );
}

export default ExamRoutinePage;







