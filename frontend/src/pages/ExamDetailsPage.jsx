import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClassroomSeatGrid from '../components/ClassroomSeatGrid.jsx';

function ExamDetailsPage({ currentStudent }) {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [roomSeats, setRoomSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const subjectName = useMemo(() => decodeURIComponent(subject || ''), [subject]);

  useEffect(() => {
    const loadExamDetails = async () => {
      if (!currentStudent?.rollNumber || !subjectName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const seatingRes = await fetch(
          `/api/seating/student/${encodeURIComponent(currentStudent.rollNumber)}`,
        );
        const allExams = seatingRes.ok ? await seatingRes.json() : [];
        const selected = allExams.find(
          (item) => item.subjectName.toLowerCase() === subjectName.toLowerCase(),
        );

        if (!selected) {
          setExam(null);
          return;
        }

        setExam(selected);

        const layoutRes = await fetch(
          `/api/seating/room/${encodeURIComponent(selected.roomNumber)}?subjectName=${encodeURIComponent(
            selected.subjectName,
          )}`,
        );
        const layoutData = layoutRes.ok ? await layoutRes.json() : [];
        setRoomSeats(Array.isArray(layoutData) ? layoutData : []);
      } catch (error) {
        console.error('Failed to load exam details', error);
      } finally {
        setLoading(false);
      }
    };

    loadExamDetails();
  }, [currentStudent, subjectName]);

  if (loading) {
    return <p className="page-subtitle">Loading exam details...</p>;
  }

  if (!exam) {
    return (
      <section>
        <h2 className="page-title">Exam Not Found</h2>
        <button type="button" className="btn btn-outline" onClick={() => navigate('/student/dashboard')}>
          Back to Dashboard
        </button>
      </section>
    );
  }

  return (
    <section className="exam-details">
      <button type="button" className="btn btn-outline back-button" onClick={() => navigate('/student/dashboard')}>
        ← Back to Dashboard
      </button>
      <h2 className="page-title">{exam.subjectName}</h2>
      <p className="page-subtitle">Today&apos;s exam details and room layout.</p>

      <div className="details-layout">
        <article className="card">
          <h3 className="section-title">Exam Information</h3>
          <div className="detail-row"><span className="label">Date</span><span>{exam.examDate}</span></div>
          <div className="detail-row"><span className="label">Time</span><span>{exam.examTime}</span></div>
          <div className="detail-row"><span className="label">Reporting Time</span><span>{exam.reportingTime || '-'}</span></div>
          <div className="detail-row"><span className="label">Room Number</span><span>{exam.roomNumber}</span></div>
          <div className="detail-row"><span className="label">Bench Number</span><span>{exam.benchNumber}</span></div>
          <div className="detail-row"><span className="label">Seat Number</span><span>{exam.seatNumber}</span></div>
        </article>
      </div>

      <ClassroomSeatGrid
        seats={roomSeats}
        myBench={exam.benchNumber}
        mySeat={exam.seatNumber}
        totalRows={5}
        totalColumns={6}
        roomNumber={exam.roomNumber}
      />
    </section>
  );
}

export default ExamDetailsPage;







