import React, { useState } from 'react';
import { Subtask } from '../../../../domain/models/Ticket';

interface TicketSubtasksProps {
  subtasks: Subtask[];
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (id: string, completed: boolean) => void;
  onDeleteSubtask: (id: string) => void;
  onReorderSubtasks: (fromIdx: number, toIdx: number) => void;
}

export const TicketSubtasks: React.FC<TicketSubtasksProps> = ({
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onReorderSubtasks
}) => {
  const [newSubtask, setNewSubtask] = useState('');
  const [dragSubIdx, setDragSubIdx] = useState<number | null>(null);
  const [dragOverSubIdx, setDragOverSubIdx] = useState<number | null>(null);

  const totalSubtasks = subtasks?.length || 0;
  const completedSubtasks = subtasks?.filter(s => s.completed).length || 0;
  const subtasksPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleAdd = () => {
    if (!newSubtask.trim()) return;
    onAddSubtask(newSubtask.trim());
    setNewSubtask('');
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 700, letterSpacing: '0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>📋</span> SUBTAREAS
        </h3>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>
          {completedSubtasks} DE {totalSubtasks} ({subtasksPercent}%)
        </span>
      </div>
      
      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: '#f3f4f6', borderRadius: '3px', marginBottom: '1rem', overflow: 'hidden' }}>
        <div style={{ width: `${subtasksPercent}%`, height: '100%', background: '#a855f7', transition: 'width 0.3s ease' }}></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {(subtasks || []).map((sub, idx) => {
          const subId = sub.id || String(idx);
          const isCompleted = !!sub.completed;
          const titleText = sub.title || (typeof sub === 'string' ? sub : 'Sin título');
          const isDraggingThis = dragSubIdx === idx;
          const isDragOverThis = dragOverSubIdx === idx;
          return (
            <div
              key={subId}
              draggable
              onDragStart={() => setDragSubIdx(idx)}
              onDragOver={e => { e.preventDefault(); setDragOverSubIdx(idx); }}
              onDragLeave={() => setDragOverSubIdx(null)}
              onDrop={() => {
                if (dragSubIdx !== null && dragSubIdx !== idx) onReorderSubtasks(dragSubIdx, idx);
                setDragSubIdx(null);
                setDragOverSubIdx(null);
              }}
              onDragEnd={() => { setDragSubIdx(null); setDragOverSubIdx(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: isDragOverThis ? '#e0e7ff' : '#f0f9ff',
                padding: '0.35rem 0.6rem', borderRadius: '6px',
                border: isDragOverThis ? '2px solid #6366f1' : '1px solid #bae6fd',
                opacity: isDraggingThis ? 0.4 : 1,
                transition: 'all 0.15s', cursor: 'grab'
              }}
            >
              <span style={{ color: '#d1d5db', cursor: 'grab', fontSize: '1rem', flexShrink: 0 }} title="Arrastrar para reordenar">☰</span>
              <input type="checkbox" checked={isCompleted} onChange={e => onToggleSubtask(subId, e.target.checked)} style={{ transform: 'scale(1.2)', cursor: 'pointer', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '0.875rem', textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#9ca3af' : '#4b5563' }}>{titleText}</span>
              <button onClick={() => onDeleteSubtask(subId)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px', fontSize: '1rem' }}>✕</button>
            </div>
          );
        })}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', background: '#f9fafb', padding: '0.35rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
          <input
            type="text"
            value={newSubtask}
            onChange={e => setNewSubtask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', color: '#374151', padding: '0.25rem 0.5rem' }}
            placeholder="Nueva subtarea... (Enter para añadir)"
          />
          <button onClick={handleAdd} style={{ background: '#e5e7eb', color: '#374151', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>+ Añadir</button>
        </div>
      </div>
    </div>
  );
};
