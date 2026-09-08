import React, { useState } from 'react';
import { TimeLog } from '../../../../domain/models/Ticket';

interface TicketTimeTrackingProps {
  timeLogs: TimeLog[];
  onAddTimeLog: (hours: number, description: string) => void;
  onDeleteTimeLog: (id: string) => void;
  getMemberName: (uid: string) => string;
  headerStyle: React.CSSProperties;
}

export const TicketTimeTracking: React.FC<TicketTimeTrackingProps> = ({
  timeLogs,
  onAddTimeLog,
  onDeleteTimeLog,
  getMemberName,
  headerStyle,
}) => {
  const [timeHours, setTimeHours] = useState('');
  const [timeDesc, setTimeDesc] = useState('');

  const handleAdd = () => {
    const hours = parseFloat(timeHours);
    if (isNaN(hours) || hours <= 0 || !timeDesc.trim()) return;
    onAddTimeLog(hours, timeDesc.trim());
    setTimeHours('');
    setTimeDesc('');
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '12px' }}>
      <h3 style={headerStyle}>
        <span style={{ fontSize: '1rem' }}>⏱</span> REGISTRO DE TIEMPOS
      </h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="number"
          step="0.5"
          min="0.5"
          value={timeHours}
          onChange={(e) => setTimeHours(e.target.value)}
          style={{
            width: '120px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '0.5rem',
            fontSize: '0.875rem',
            outline: 'none',
          }}
          placeholder="Horas (ej. 2.5)"
        />
        <input
          type="text"
          value={timeDesc}
          onChange={(e) => setTimeDesc(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          style={{
            flex: 1,
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '0.5rem',
            fontSize: '0.875rem',
            outline: 'none',
          }}
          placeholder="Descripción del trabajo..."
        />
        <button
          onClick={handleAdd}
          style={{
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            padding: '0 1.2rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Registrar
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {(timeLogs || []).length === 0 ? (
          <p
            style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem', padding: '1rem' }}
          >
            Sin tiempos registrados todavía.
          </p>
        ) : (
          (timeLogs || []).map((log) => {
            const dateStr = log.createdAt
              ? new Date(log.createdAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '';
            return (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: '#f0f9ff',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  border: '1px solid #bae6fd',
                }}
              >
                <strong style={{ minWidth: '50px', color: '#374151' }}>{log.hours} h</strong>
                <span style={{ flex: 1, color: '#4b5563' }}>{log.description}</span>
                <span
                  style={{
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#e0e7ff',
                      color: '#4f46e5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {getMemberName(log.authorId).charAt(0).toUpperCase()}
                  </span>
                  <span>{getMemberName(log.authorId)}</span>
                  {dateStr && (
                    <span
                      style={{
                        paddingLeft: '4px',
                        borderLeft: '1px solid #cbd5e1',
                        marginLeft: '2px',
                      }}
                    >
                      {dateStr}
                    </span>
                  )}
                </span>
                <button
                  onClick={() => onDeleteTimeLog(log.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
