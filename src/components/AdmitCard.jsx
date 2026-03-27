import React from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { mockExams } from '../data/mockData.js';

function AdmitCard({ student }) {
  const handleDownload = async () => {
    const cardElement = document.getElementById('admit-card-print-area');
    if (!cardElement) {
      return;
    }

    const canvas = await html2canvas(cardElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imageData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imageData, 'PNG', 0, 10, pdfWidth, pdfHeight);
    pdf.save(`${student.rollNo}-admit-card.pdf`);
  };

  return (
    <section className="card admit-card">
      <div id="admit-card-print-area">
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

        <div className="admit-center-details">
          <h3 className="section-title">Exam Center Details</h3>
          <div className="detail-row">
            <span className="label">Center Name</span>
            <span>{student.examCenter?.name}</span>
          </div>
          <div className="detail-row">
            <span className="label">Address</span>
            <span>{student.examCenter?.address}</span>
          </div>
        </div>

        <div className="admit-exams">
          <h3 className="section-title">Exam Schedule & Seating Info</h3>
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
                {mockExams.map((exam) => (
                  <tr key={exam.id}>
                    <td>{exam.subjectName}</td>
                    <td>{exam.date}</td>
                    <td>{exam.time}</td>
                    <td>{exam.roomNumber}</td>
                    <td>{exam.benchNumber}</td>
                    <td>{exam.seatNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="admit-footer">
        <p className="admit-note">
          This is a system-generated admit card. Signature is not required.
        </p>
        <button type="button" className="btn btn-primary" onClick={handleDownload}>
          Download as PDF
        </button>
      </footer>
    </section>
  );
}

export default AdmitCard;







