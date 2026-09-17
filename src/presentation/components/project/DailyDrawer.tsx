import React, { useState, useMemo } from 'react';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { useDataStore } from '../../../application/store/useDataStore';
import { useUIStore } from '../../../application/store/useUIStore';
import { useToastStore } from '../../../application/store/useToastStore';
import { Ticket } from '../../../domain/models/Ticket';
import { useDailyGeneration } from '../../../application/hooks/useDailyGeneration';
import { toTimestampMs } from '../../../lib/dateUtils';
import '../../../styles/daily.css';

export const DailyDrawer: React.FC = () => {
  const activeProject = useProjectStore(s => s.activeProject);
  const tickets = useDataStore(s => s.tickets);
  const setDailyOpen = useUIStore(s => s.setDailyOpen);
  const setOpenTicketId = useUIStore(s => s.setOpenTicketId);
  const addToast = useToastStore(s => s.addToast);
  
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [periodHours, setPeriodHours] = useState<number>(24);
  const [copied, setCopied] = useState(false);

  const { summary, isGenerating, generateDaily } = useDailyGeneration();

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => selectedMember === 'all' || t.assignees?.includes(selectedMember));
  }, [tickets, selectedMember]);

  if (!activeProject) return null;

  // ─── Column role classification ───────────────────────────────────────────
  // Columns always have an inferred `role` by the time they reach the store
  // (set by FirebaseProjectRepository.inferColumnRoles), so we can rely on it.
  const doneColumns = activeProject.columns.filter(c => c.role === 'done');
  const doneColumnIds = new Set(doneColumns.map(c => c.id));
  const activeColumns = activeProject.columns.filter(c => c.role === 'active');


  // ─── Time window ──────────────────────────────────────────────────────────
  // Use toTimestampMs so comparisons work regardless of whether updatedAt is
  // a Firebase Timestamp, a plain { seconds, nanoseconds } object, or an ISO
  // string.  The normalisation in FirebaseTicketRepository.subscribeToTickets
  // means they will normally be ISO strings, but we stay defensive here.
  const analysisMs = Date.now() - periodHours * 60 * 60 * 1000;

  // ─── Ticket buckets ───────────────────────────────────────────────────────
  const done = filteredTickets.filter(t =>
    doneColumnIds.has(t.status) &&
    toTimestampMs(t.updatedAt) >= analysisMs
  );

  // One bucket per active column, preserving board order
  const wipByColumn = activeColumns.map(col => ({
    id: col.id,
    label: col.label,
    emoji: col.emoji || '🔄',
    tickets: filteredTickets.filter(t =>
      t.status === col.id && !t.isBlocked
    ),
  }));

  // Blocked tickets are displayed separately regardless of which column they are in
  const blocked = filteredTickets.filter(t => t.isBlocked || t.status === 'blocked');

  const totalActiveTickets = wipByColumn.reduce((n, col) => n + col.tickets.length, 0);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getBlockedDurationDays = (t: Ticket) => {
    if (!t.isBlocked && t.status !== 'blocked') return 0;
    const history = t.history || [];
    const blockedEntries = history.filter(h =>
      h.action.toLowerCase().includes('blocked') ||
      h.action.toLowerCase().includes('bloqueado')
    );
    const timestamp = blockedEntries.length > 0
      ? blockedEntries[blockedEntries.length - 1].timestamp
      : t.updatedAt || t.createdAt;
    const diff = Date.now() - toTimestampMs(timestamp);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const handleGenerate = () => {
    generateDaily(periodHours, done, wipByColumn, blocked);
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    addToast('info', 'Copiado al portapapeles', 'Daily Standup');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  // ─── Ticket card renderer ─────────────────────────────────────────────────
  const renderTicket = (t: Ticket, sectionType: 'done' | 'active' | 'blocked') => {
    const ageDays = getBlockedDurationDays(t);
    const ageText = ageDays === 0 ? 'Bloqueado hoy' : `Hace ${ageDays} ${ageDays === 1 ? 'día' : 'días'}`;

    let borderColor = 'var(--bd-subtle)';
    if (sectionType === 'done') borderColor = 'var(--col-done)';
    if (sectionType === 'active') borderColor = '#3b82f6';
    if (sectionType === 'blocked') borderColor = 'var(--error)';

    return (
      <div
        key={t.id}
        onClick={() => { setOpenTicketId(t.id); setDailyOpen(false); }}
        className="print-ticket daily-ticket-card"
        style={{ borderLeftColor: borderColor }}
      >
        <div className="d-flex justify-between align-center">
          <span style={{ fontSize: '0.75rem', color: 'var(--tx-muted)', fontWeight: 600 }}>
            {t.code ? `#${t.code}` : `#${t.id.substring(0, 8)}`}
          </span>
          {t.assignees && t.assignees.length > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--tx-secondary)' }}>
              {activeProject.members.find(m => m.id === t.assignees[0])?.name}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.875rem', color: 'var(--tx-primary)', lineHeight: 1.3 }}>{t.title}</span>
        {sectionType === 'blocked' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--error)', marginTop: '0.25rem' }}>
            <span>⚠️ {t.blockerReason || 'Sin motivo'}</span>
            <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{ageText}</span>
          </div>
        )}
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="overlay active print-overlay" style={{ zIndex: 150, justifyContent: 'flex-end', alignItems: 'stretch' }}>
      <div className="drawer drawer-print-container daily-drawer">

        {/* Header */}
        <div className="daily-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="no-print" style={{ fontSize: '1.5rem' }}>☕</span>
            <div>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--tx-primary)', margin: 0 }}>Daily Standup</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', margin: 0 }}>Resumen de las últimas {periodHours}h</p>
            </div>
            <button className="btn btn-secondary btn-sm no-print" onClick={handleExportPDF} title="Exportar a PDF" style={{ padding: '0.25rem 0.5rem', marginLeft: '1rem' }}>
              🖨️ PDF
            </button>
          </div>
          <button className="modal-close no-print" onClick={() => setDailyOpen(false)}>✕</button>
        </div>

        {/* Body */}
        <div className="print-content daily-body">

          <div className="no-print daily-filters">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Periodo</label>
              <select className="form-select" value={periodHours} onChange={e => setPeriodHours(Number(e.target.value))}>
                <option value={24}>24 horas</option>
                <option value={48}>48 horas</option>
                <option value={72}>72 horas</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Filtrar por miembro</label>
              <select className="form-select" value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
                <option value="all">Todo el equipo</option>
                {activeProject.members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="no-print daily-ai-section">
            <div className="daily-ai-header">
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--tx-primary)' }}>✨ Resumen IA</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {summary && (
                  <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                    {copied ? '✓ Copiado' : '📋 Copiar'}
                  </button>
                )}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleGenerate}
                  disabled={isGenerating || (done.length === 0 && totalActiveTickets === 0 && blocked.length === 0)}
                >
                  {isGenerating ? 'Generando...' : 'Generar'}
                </button>
              </div>
            </div>
            {summary && (
              <div className="daily-ai-summary">
                {summary}
              </div>
            )}
          </div>

          {/* ── Completed ── */}
          <div className="print-category">
            <h3 style={{ fontSize: '0.875rem', color: 'var(--success)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✅</span> Completados ({done.length})
            </h3>
            {done.length > 0
              ? done.map(t => renderTicket(t, 'done'))
              : <p style={{ fontSize: '0.875rem', color: 'var(--tx-muted)' }}>No hay tickets completados en las últimas {periodHours}h.</p>
            }
          </div>

          {/* ── One section per active column ── */}
          {wipByColumn.map(col => (
            <div key={col.id} className="print-category">
              <h3 style={{ fontSize: '0.875rem', color: '#3b82f6', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{col.emoji}</span> {col.label} ({col.tickets.length})
              </h3>
              {col.tickets.length > 0
                ? col.tickets.map(t => renderTicket(t, 'active'))
                : <p style={{ fontSize: '0.875rem', color: 'var(--tx-muted)' }}>No hay tickets en esta columna.</p>
              }
            </div>
          ))}

          {/* ── Blocked ── */}
          <div className="print-category">
            <h3 style={{ fontSize: '0.875rem', color: 'var(--error)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠️</span> Impedimentos ({blocked.length})
            </h3>
            {blocked.length > 0
              ? blocked.map(t => renderTicket(t, 'blocked'))
              : <p style={{ fontSize: '0.875rem', color: 'var(--tx-muted)' }}>Sin impedimentos 🎉</p>
            }
          </div>

        </div>
      </div>
    </div>
  );
};
