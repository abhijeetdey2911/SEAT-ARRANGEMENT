import React from 'react';
import AdmitCard from '../components/AdmitCard.jsx';

function AdmitCardPage({ student }) {
  return (
    <section>
      <h2 className="page-title">Admit Card</h2>
      <p className="page-subtitle">
        Review your examination details and download your admit card.
      </p>
      <AdmitCard student={student} />
    </section>
  );
}

export default AdmitCardPage;







