import { useModalA11y } from '../../../application/hooks/useModalA11y';
import React, { useRef } from 'react';
import { useMetrics } from '../../../application/hooks/useMetrics';
import '../../../styles/utilities.css'; // Just in case, though it's in main.tsx

export const MetricsModal: React.FC = () => {
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    activeProject,
    setMetricsOpen,
    view, setView,
    showOverdue, setShowOverdue,
    showReestimated, setShowReestimated,
    showBoth, setShowBoth,
    hasSprints,
    totalTickets,
    doneTickets,
    progressPercent,
    totalLoggedHours,
    blockedCount,
    statusCounts,
    getStatusColor,
    typeCounts,
    typeColors,
    workloadArray,
    activeWipTickets,
    overdueTicketsList,
    reestimatedTicketsList,
    bothDeviationsList,
    overduePct,
    reestimatedPct,
    bothDeviationsPct
  } = useMetrics();

  useModalA11y(true, () => setMetricsOpen(false), modalRef);

  if (!activeProject) return null;

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" tabIndex={-1} className="overlay active" style={{ zIndex: 100 }}>
      <div className="modal d-flex flex-col p-0" style={{ width: 'min(900px, 96vw)', maxHeight: '90vh' }}>
        
        {/* Header */}
        <div className="d-flex justify-between align-center p-15 border-b-subtle" style={{ flexShrink: 0 }}>
          <div>
            <h2 className="fs-lg text-primary m-0">Dashboard de Métricas</h2>
            <p className="fs-md text-secondary m-0 mt-05">Basado en {totalTickets} tickets</p>
          </div>
          <div className="d-flex gap-1 align-center">
            {hasSprints && (
              <div className="d-flex bg-s2 rounded-sm overflow-hidden">
                <button 
                  className={`fs-md cursor-pointer border-none p-05 px-1 ${view === 'global' ? 'text-primary bg-ac' : 'text-secondary'}`}
                  style={{ background: view === 'global' ? 'var(--ac)' : 'transparent', color: view === 'global' ? '#fff' : 'var(--tx-secondary)' }}
                  onClick={() => setView('global')}
                >
                  Global
                </button>
                <button 
                  className={`fs-md cursor-pointer border-none p-05 px-1 ${view === 'sprint' ? 'text-primary bg-ac' : 'text-secondary'}`}
                  style={{ background: view === 'sprint' ? 'var(--ac)' : 'transparent', color: view === 'sprint' ? '#fff' : 'var(--tx-secondary)' }}
                  onClick={() => setView('sprint')}
                >
                  Sprint Actual
                </button>
              </div>
            )}
            <button className="modal-close relative" onClick={() => setMetricsOpen(false)}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="d-flex flex-col gap-15 p-15 overflow-y-auto">
          
          {/* KPI Grid */}
          <div className="d-grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="bg-s2 p-1 rounded-md border-subtle">
              <p className="fs-md text-secondary m-0">Progreso de Tareas</p>
              <p className="fs-xl fw-700 text-primary mb-05 mt-05">{progressPercent}%</p>
              <p className="fs-sm text-muted m-0">{doneTickets} de {totalTickets} completados</p>
              <div className="bg-s3 w-100 overflow-hidden mt-1" style={{ height: '6px', borderRadius: '3px' }}>
                <div className="h-100" style={{ width: `${progressPercent}%`, background: 'var(--ac)' }}></div>
              </div>
            </div>

            <div className="bg-s2 p-1 rounded-md border-subtle">
              <p className="fs-md text-secondary m-0">Horas Imputadas</p>
              <p className="fs-xl fw-700 text-primary mb-05 mt-05">{totalLoggedHours.toFixed(1)} <span className="fs-md text-muted">h</span></p>
              <p className="fs-sm text-muted m-0">Tiempo total invertido</p>
            </div>

            <div className="bg-s2 p-1 rounded-md" style={{ border: `1px solid ${blockedCount > 0 ? 'var(--error)' : 'var(--bd-subtle)'}` }}>
              <p className="fs-md text-secondary m-0">Cuellos de Botella</p>
              <p className="fs-xl fw-700 mb-05 mt-05" style={{ color: blockedCount > 0 ? 'var(--error)' : 'var(--tx-primary)' }}>{blockedCount}</p>
              <p className="fs-sm text-muted m-0">Tickets bloqueados activos</p>
            </div>
          </div>

          {/* Deviations & Delays Grid */}
          <div className="d-grid gap-1 align-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="p-1 rounded-md" style={{ background: '#fffbeb', border: '1px solid #fef3c7' }}>
              <p className="fs-md fw-600 m-0" style={{ color: '#b45309' }}>Fuera de Plazo</p>
              <p className="fs-xl fw-700 d-flex align-baseline gap-05 mb-05 mt-05" style={{ color: '#92400e' }}>
                {overdueTicketsList.length} <span className="fs-lg fw-600" style={{ opacity: 0.8 }}>({overduePct}%)</span>
              </p>
              <p className="fs-sm m-0" style={{ color: '#b45309' }}>Sobre {activeWipTickets} tareas activas</p>
              {overdueTicketsList.length > 0 && (
                <div className="mt-075 pt-1" style={{ borderTop: '1px solid rgba(180, 83, 9, 0.2)' }}>
                  <button className="fs-sm fw-600 cursor-pointer d-flex align-center gap-025 border-none p-0" onClick={() => setShowOverdue(!showOverdue)} style={{ background: 'none', color: '#b45309' }}>
                    {showOverdue ? '▼ Ocultar tickets' : '▶ Ver tickets'}
                  </button>
                  {showOverdue && (
                    <ul className="fs-sm overflow-y-auto pl-1 m-0 mt-05" style={{ color: '#92400e', maxHeight: '120px' }}>
                      {overdueTicketsList.map(t => <li key={t.id} className="mb-025"><strong>{t.code || t.id.substring(0,6)}</strong>: {t.title}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="p-1 rounded-md" style={{ background: '#f5f3ff', border: '1px solid #ede9fe' }}>
              <p className="fs-md fw-600 m-0" style={{ color: '#6d28d9' }}>Fechas Re-estimadas</p>
              <p className="fs-xl fw-700 d-flex align-baseline gap-05 mb-05 mt-05" style={{ color: '#5b21b6' }}>
                {reestimatedTicketsList.length} <span className="fs-lg fw-600" style={{ opacity: 0.8 }}>({reestimatedPct}%)</span>
              </p>
              <p className="fs-sm m-0" style={{ color: '#6d28d9' }}>Sobre {activeWipTickets} tareas activas</p>
              {reestimatedTicketsList.length > 0 && (
                <div className="mt-075 pt-1" style={{ borderTop: '1px solid rgba(109, 40, 217, 0.2)' }}>
                  <button className="fs-sm fw-600 cursor-pointer d-flex align-center gap-025 border-none p-0" onClick={() => setShowReestimated(!showReestimated)} style={{ background: 'none', color: '#6d28d9' }}>
                    {showReestimated ? '▼ Ocultar tickets' : '▶ Ver tickets'}
                  </button>
                  {showReestimated && (
                    <ul className="fs-sm overflow-y-auto pl-1 m-0 mt-05" style={{ color: '#5b21b6', maxHeight: '120px' }}>
                      {reestimatedTicketsList.map(t => <li key={t.id} className="mb-025"><strong>{t.code || t.id.substring(0,6)}</strong>: {t.title}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="p-1 rounded-md" style={{ background: '#fdf2f8', border: '1px solid #fce7f3' }}>
              <p className="fs-md fw-600 m-0" style={{ color: '#be185d' }}>Re-estimados y fuera de plazo</p>
              <p className="fs-xl fw-700 d-flex align-baseline gap-05 mb-05 mt-05" style={{ color: '#9d174d' }}>
                {bothDeviationsList.length} <span className="fs-lg fw-600" style={{ opacity: 0.8 }}>({bothDeviationsPct}%)</span>
              </p>
              <p className="fs-sm m-0" style={{ color: '#be185d' }}>Sobre {activeWipTickets} tareas activas</p>
              {bothDeviationsList.length > 0 && (
                <div className="mt-075 pt-1" style={{ borderTop: '1px solid rgba(190, 24, 93, 0.2)' }}>
                  <button className="fs-sm fw-600 cursor-pointer d-flex align-center gap-025 border-none p-0" onClick={() => setShowBoth(!showBoth)} style={{ background: 'none', color: '#be185d' }}>
                    {showBoth ? '▼ Ocultar tickets' : '▶ Ver tickets'}
                  </button>
                  {showBoth && (
                    <ul className="fs-sm overflow-y-auto pl-1 m-0 mt-05" style={{ color: '#9d174d', maxHeight: '120px' }}>
                      {bothDeviationsList.map(t => <li key={t.id} className="mb-025"><strong>{t.code || t.id.substring(0,6)}</strong>: {t.title}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="d-grid grid-cols-2 gap-15">
            {/* Status Dist */}
            <div className="bg-s2 p-1 rounded-md border-subtle">
              <h3 className="fs-md text-primary m-0 mb-1">Distribución de Estados</h3>
              <div className="d-flex overflow-hidden mb-1" style={{ height: '16px', borderRadius: '8px' }}>
                {activeProject.columns.map(c => {
                  const count = statusCounts[c.id];
                  if (!count) return null;
                  const pct = (count / totalTickets) * 100;
                  return <div key={c.id} style={{ width: `${pct}%`, background: getStatusColor(c.id) }} title={`${c.label}: ${count}`} />
                })}
              </div>
              <div className="d-grid grid-cols-2 gap-05">
                {activeProject.columns.map(c => (
                  <div key={c.id} className="d-flex align-center gap-05 fs-md">
                    <div className="rounded-full" style={{ width: 10, height: 10, background: getStatusColor(c.id) }}></div>
                    <span className="text-secondary">{c.label} ({statusCounts[c.id] || 0})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workload */}
            <div className="bg-s2 p-1 rounded-md border-subtle">
              <h3 className="fs-md text-primary m-0 mb-1">Carga de Trabajo</h3>
              <table className="w-100 fs-md" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="text-muted text-left border-b-strong">
                    <th className="pb-05">Miembro</th>
                    <th className="pb-05 text-center">Activos</th>
                    <th className="pb-05 text-right">Horas</th>
                  </tr>
                </thead>
                <tbody>
                  {workloadArray.map(w => (
                    <tr key={w.name} className="border-b-subtle">
                      <td className="py-05 d-flex align-center gap-05 text-primary">
                        <div className="rounded-full" style={{ width: 20, height: 20, background: w.color }}></div>
                        {w.name}
                      </td>
                      <td className="py-05 text-center text-secondary">{w.activeTickets}</td>
                      <td className="py-05 text-right text-secondary">{w.totalHours.toFixed(1)}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Type Distribution */}
            <div className="bg-s2 p-1 rounded-md border-subtle">
              <h3 className="fs-md text-primary m-0 mb-1">Distribución por Tipo</h3>
              <div className="d-flex overflow-hidden mb-1" style={{ height: '16px', borderRadius: '8px' }}>
                {Object.entries(typeCounts).map(([type, count]) => {
                  if (!count) return null;
                  const pct = (count / totalTickets) * 100;
                  return <div key={type} style={{ width: `${pct}%`, background: typeColors[type] || 'var(--tx-muted)' }} title={`${type}: ${count}`} />
                })}
              </div>
              <div className="d-grid grid-cols-2 gap-05">
                {Object.entries(typeCounts).map(([type, count]) => (
                  <div key={type} className="d-flex align-center gap-05 fs-md" style={{ textTransform: 'capitalize' }}>
                    <div className="rounded-full" style={{ width: 10, height: 10, background: typeColors[type] || 'var(--tx-muted)' }}></div>
                    <span className="text-secondary">{type} ({count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
