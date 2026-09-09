import React, { useState } from 'react';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { useUIStore } from '../../../application/store/useUIStore';
import { FiltersPanel } from './FiltersPanel';
import { useFilteredTickets } from '../../hooks/useFilteredTickets';
import { useGroupedTickets } from '../../../application/hooks/useGroupedTickets';

export const ListView: React.FC = () => {
  const activeProject = useProjectStore((s) => s.activeProject);
  const setOpenTicketId = useUIStore((s) => s.setOpenTicketId);
  const filteredTickets = useFilteredTickets();
  const [sortCol, setSortCol] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getStatusName = (statusId: string) => {
    const col = activeProject?.columns.find((c) => c.id === statusId);
    return col ? col.label : statusId;
  };

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortOrder('asc');
    }
  };

  const getStatusColorClass = (statusId: string) => {
    if (statusId === 'done') return 'var(--success)';
    if (statusId === 'in-progress') return 'var(--ac)';
    if (statusId === 'blocked') return 'var(--error)';
    if (statusId === 'in-review') return 'var(--warning)';
    return 'var(--tx-muted)';
  };

  const { groupBy } = useUIStore();
  const groupedTickets = useGroupedTickets(filteredTickets);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <FiltersPanel />
      <div style={{ padding: '1.5rem', background: 'var(--bg-s1)', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ color: 'var(--tx-primary)' }}
          >
            <line x1="8" y1="6" x2="21" y2="6" strokeLinecap="round" />
            <line x1="8" y1="12" x2="21" y2="12" strokeLinecap="round" />
            <line x1="8" y1="18" x2="21" y2="18" strokeLinecap="round" />
            <circle cx="4" cy="6" r="1.5" />
            <circle cx="4" cy="12" r="1.5" />
            <circle cx="4" cy="18" r="1.5" />
          </svg>
          <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--tx-primary)' }}>
            Vista de Lista
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {groupedTickets.map((group) => {
            const groupSorted = [...group.tickets].sort((a, b) => {
              let aVal: any = a[sortCol as keyof typeof a];
              let bVal: any = b[sortCol as keyof typeof b];

              if (sortCol === 'status') {
                aVal = activeProject?.columns.findIndex((c) => c.id === a.status) ?? 0;
                bVal = activeProject?.columns.findIndex((c) => c.id === b.status) ?? 0;
              } else if (sortCol === 'priority') {
                const pmap: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
                aVal = pmap[a.priority] || 0;
                bVal = pmap[b.priority] || 0;
              } else if (sortCol === 'rice') {
                aVal = a.rice_score?.total_score ?? -1;
                bVal = b.rice_score?.total_score ?? -1;
              } else if (sortCol === 'wsjf') {
                aVal = a.wsjf_score?.total_score ?? -1;
                bVal = b.wsjf_score?.total_score ?? -1;
              }

              if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
              if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
              return 0;
            });

            return (
              <div key={group.id} style={{ display: 'flex', flexDirection: 'column' }}>
                {groupBy !== 'none' && (
                  <h3
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'var(--tx-primary)',
                      margin: '0 0 0.75rem 0',
                    }}
                  >
                    {group.label}{' '}
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--tx-muted)',
                        marginLeft: '0.5rem',
                        fontWeight: 'normal',
                      }}
                    >
                      ({group.tickets.length})
                    </span>
                  </h3>
                )}
                <div
                  style={{
                    background: 'var(--bg-s2)',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--bd-subtle)',
                    overflow: 'hidden',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr
                        style={{
                          borderBottom: '2px solid var(--bd-default)',
                          userSelect: 'none',
                          background: 'var(--bg-s1)',
                        }}
                      >
                        <th
                          onClick={() => handleSort('id')}
                          style={{
                            padding: '0.75rem',
                            color: 'var(--tx-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          ID {sortCol === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          onClick={() => handleSort('title')}
                          style={{
                            padding: '0.75rem',
                            color: 'var(--tx-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Título {sortCol === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          onClick={() => handleSort('status')}
                          style={{
                            padding: '0.75rem',
                            color: 'var(--tx-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Estado {sortCol === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          onClick={() => handleSort('priority')}
                          style={{
                            padding: '0.75rem',
                            color: 'var(--tx-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Prioridad {sortCol === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          onClick={() => handleSort('type')}
                          style={{
                            padding: '0.75rem',
                            color: 'var(--tx-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Tipo {sortCol === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          onClick={() => handleSort('rice')}
                          style={{
                            padding: '0.75rem',
                            color: 'var(--tx-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          RICE {sortCol === 'rice' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          onClick={() => handleSort('wsjf')}
                          style={{
                            padding: '0.75rem',
                            color: 'var(--tx-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          WSJF {sortCol === 'wsjf' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupSorted.map((t) => (
                        <tr
                          key={t.id}
                          onClick={() => setOpenTicketId(t.id)}
                          style={{
                            borderBottom: '1px solid var(--bd-subtle)',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            background: 'var(--bg-s1)',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-s2)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-s1)')}
                        >
                          <td
                            style={{
                              padding: '0.75rem',
                              color: 'var(--tx-muted)',
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {t.code || `#${t.id.substring(0, 6)}`}
                          </td>
                          <td
                            style={{
                              padding: '0.75rem',
                              color: 'var(--tx-primary)',
                              fontWeight: 500,
                            }}
                          >
                            {t.title}
                            {(t.estimatedHours === null || t.estimatedHours === undefined) && (
                              <span
                                style={{
                                  marginLeft: '0.5rem',
                                  fontSize: '0.7rem',
                                  padding: '0.1rem 0.3rem',
                                  borderRadius: '4px',
                                  background: '#fef08a',
                                  color: '#854d0e',
                                  border: '1px solid #fde68a',
                                }}
                                title="Falta estimación de horas"
                              >
                                ⚠️ Sin estimar
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                background: 'var(--bg-s3)',
                                border: '1px solid',
                                borderColor: getStatusColorClass(t.status),
                                color: getStatusColorClass(t.status),
                                textTransform: 'uppercase',
                              }}
                            >
                              {getStatusName(t.status)}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span
                              className={`priority-${t.priority || 'medium'}`}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                              }}
                            >
                              {t.priority}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span className={`badge badge-${t.type || 'tarea'}`}>{t.type}</span>
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                            {t.rice_score ? (
                              <span style={{ fontWeight: 600, color: '#3730a3' }} title={t.rice_score.rationale}>
                                {t.rice_score.total_score}
                              </span>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                            {t.wsjf_score ? (
                              <span style={{ fontWeight: 600, color: '#9d174d' }} title={t.wsjf_score.rationale}>
                                {t.wsjf_score.total_score}
                              </span>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                      {groupSorted.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            style={{
                              padding: '2rem',
                              textAlign: 'center',
                              color: 'var(--tx-muted)',
                              background: 'var(--bg-s1)',
                            }}
                          >
                            No hay tickets en este grupo.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          {groupedTickets.length === 0 && (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--tx-muted)',
                background: 'var(--bg-s2)',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--bd-subtle)',
              }}
            >
              No hay tickets que coincidan con los filtros.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
