import React from 'react';

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLS = [1, 2, 3, 4, 5, 6];

function SeatLayout({ yourSeatNumber }) {
  return (
    <article className="card seat-layout-card">
      <h3 className="section-title">Seat Layout (Static View)</h3>
      <div className="seat-legend">
        <span className="legend-item">
          <span className="seat-dot seat-dot-available" />
          Available
        </span>
        <span className="legend-item">
          <span className="seat-dot seat-dot-occupied" />
          Occupied
        </span>
        <span className="legend-item">
          <span className="seat-dot seat-dot-yours" />
          Your Seat
        </span>
      </div>

      <div className="seat-grid-wrapper">
        <div className="seat-header-row">
          <span className="axis-cell axis-empty">#</span>
          {COLS.map((col) => (
            <span key={`col-${col}`} className="axis-cell axis-col">
              {col}
            </span>
          ))}
        </div>

        {ROWS.map((row, rowIdx) => (
          <div key={`row-${row}`} className="seat-grid-row">
            <span className="axis-cell axis-row">{row}</span>
            {COLS.map((col, colIdx) => {
              const serial = rowIdx * COLS.length + col;
              const isYourSeat = String(serial) === String(yourSeatNumber);
              const isOccupied = serial % 2 === 0;
              const seatClass = isYourSeat
                ? 'seat-box seat-your'
                : isOccupied
                ? 'seat-box seat-occupied'
                : 'seat-box seat-available';

              return (
                <span key={`seat-${row}-${col}`} className={seatClass}>
                  {serial}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </article>
  );
}

export default SeatLayout;
