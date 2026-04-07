import React, { useMemo } from 'react';

function ClassroomSeatGrid({ seats = [], myBench, mySeat, totalRows = 5, totalColumns = 6, roomNumber }) {
  const rowLabels = useMemo(
    () => Array.from({ length: totalRows }, (_, i) => String.fromCharCode(65 + i)),
    [totalRows],
  );

  const seatSet = useMemo(() => {
    const set = new Set();
    seats.forEach((seat) => {
      // Backend stores seatNumber as a global index (1..N). Track occupied by global seatNumber.
      set.add(String(seat.seatNumber));
    });
    return set;
  }, [seats]);

  const mySeatGlobal = useMemo(() => {
    // If myBench is a row letter (A-E) and mySeat is a column (1..totalColumns),
    // we can derive the global seat number. Otherwise assume mySeat is already global.
    const bench = String(myBench || '').trim().toUpperCase();
    const seatNum = Number(mySeat);

    if (bench.length === 1 && bench >= 'A' && bench <= 'Z' && seatNum >= 1 && seatNum <= totalColumns) {
      const rowIdx = bench.charCodeAt(0) - 65;
      return rowIdx * totalColumns + seatNum;
    }

    return Number.isFinite(seatNum) ? seatNum : null;
  }, [myBench, mySeat, totalColumns]);

  return (
    <article className="card classroom-grid-card">
      <h3 className="section-title">Seat Layout Grid</h3>
      <p className="card-subtitle"><strong>Room:</strong> {roomNumber || '-'}</p>

      <div className="classroom-grid-scroll">
        <div className="classroom-grid">
          <div className="grid-corner" />
          {Array.from({ length: totalColumns }, (_, i) => i + 1).map((col) => (
            <div key={`col-${col}`} className={`grid-col-label ${(col % 3 === 0 && col !== totalColumns) ? 'grid-aisle-gap' : ''}`}>
              {col}
            </div>
          ))}

          {rowLabels.map((row) => (
            <React.Fragment key={`row-${row}`}>
              <div className="grid-row-label">{row}</div>
              {Array.from({ length: totalColumns }, (_, i) => i + 1).map((col) => {
                const rowIdx = row.charCodeAt(0) - 65;
                const globalSeatNumber = rowIdx * totalColumns + col;

                const isMine = mySeatGlobal != null && globalSeatNumber === mySeatGlobal;
                const isOccupied = seatSet.has(String(globalSeatNumber));

                const stateClass = isMine
                  ? 'seat-cell-mine'
                  : isOccupied
                  ? 'seat-cell-occupied'
                  : 'seat-cell-available';

                return (
                  <div
                    key={`${row}-${col}`}
                    className={`seat-cell ${stateClass} ${(col % 3 === 0 && col !== totalColumns) ? 'grid-aisle-gap' : ''}`}
                  >
                    {col}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="seat-legend">
        <span className="legend-item"><span className="seat-dot seat-dot-available" /> Available</span>
        <span className="legend-item"><span className="seat-dot seat-dot-occupied" /> Occupied</span>
        <span className="legend-item"><span className="seat-dot seat-dot-yours" /> Your Seat</span>
      </div>
    </article>
  );
}

export default ClassroomSeatGrid;
