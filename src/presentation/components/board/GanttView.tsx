import React, { useMemo, useRef, useEffect } from 'react';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { useUIStore } from '../../../application/store/useUIStore';
import { useFilteredTickets } from '../../hooks/useFilteredTickets';
import { useGroupedTickets } from '../../../application/hooks/useGroupedTickets';
import { FiltersPanel } from './FiltersPanel';

export const GanttView: React.FC = () => {
  const activeProject = useProjectStore((s) => s.activeProject);
  const setOpenTicketId = useUIStore((s) => s.setOpenTicketId);
  const { groupBy } = useUIStore();
  const filteredTickets = useFilteredTickets();
  const groupedTickets = useGroupedTickets(filteredTickets);

  const parseDate = (val: any): Date => {
    if (!val) return new Date();
    if (typeof val.toDate === 'function') return val.toDate();
    if (val.seconds) return new Date(val.seconds * 1000);
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  // 1. Calculate the rolling 30-day window centered on today (7 days in the past, 23 in the future)
  const { startDate, endDate, days, today } = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);

    const start = new Date(t);
    start.setDate(t.getDate() - 7);

    const d: Date[] = [];
    for (let i = 0; i < 30; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      d.push(day);
    }

    const end = d[d.length - 1];
    return { startDate: start, endDate: end, days: d, today: t };
  }, []);

  const isToday = (d: Date) => d.getTime() === today.getTime();
  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  // Sync scroll
  useEffect(() => {
    const sidebar = sidebarScrollRef.current;
    const timeline = timelineScrollRef.current;
    if (!sidebar || !timeline) return;

    let activeScroll: 'sidebar' | 'timeline' | null = null;

    const handleSidebarScroll = () => {
      if (activeScroll !== 'timeline') {
        activeScroll = 'sidebar';
        timeline.scrollTop = sidebar.scrollTop;
        activeScroll = null;
      }
    };

    const handleTimelineScroll = () => {
      if (activeScroll !== 'sidebar') {
        activeScroll = 'timeline';
        sidebar.scrollTop = timeline.scrollTop;
        activeScroll = null;
      }
    };

    sidebar.addEventListener('scroll', handleSidebarScroll);
    timeline.addEventListener('scroll', handleTimelineScroll);

    return () => {
      sidebar.removeEventListener('scroll', handleSidebarScroll);
      timeline.removeEventListener('scroll', handleTimelineScroll);
    };
  }, [filteredTickets]);

  if (!activeProject) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--bg-s1)',
      }}
    >
      <FiltersPanel />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', width: '100%' }}>
        {/* Left Sidebar - Ticket List */}
        <div
          style={{
            width: '250px',
            flexShrink: 0,
            borderRight: '1px solid var(--bd-strong)',
            background: 'var(--bg-s1)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              height: '64px',
              borderBottom: '1px solid var(--bd-subtle)',
              background: 'var(--bg-s2)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              padding: '0 1rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--tx-muted)',
                textTransform: 'uppercase',
              }}
            >
              Ticket
            </span>
          </div>
          <div
            ref={sidebarScrollRef}
            style={{ flex: 1, overflowY: 'hidden', borderBottom: '1px solid var(--bd-subtle)' }}
          >
            {groupedTickets.map((group) => (
              <React.Fragment key={group.id}>
                {groupBy !== 'none' && (
                  <div
                    style={{
                      height: '32px',
                      background: 'var(--bg-s2)',
                      borderBottom: '1px solid var(--bd-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 1rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--tx-primary)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {group.label}
                    </span>
                  </div>
                )}
                {group.tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setOpenTicketId(t.id)}
                    style={{
                      height: '48px',
                      padding: '0 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--bd-subtle)',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      background: 'var(--bg-s1)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-s2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-s1)')}
                  >
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'var(--tx-muted)',
                        flexShrink: 0,
                      }}
                    >
                      {t.code || t.id.substring(0, 8)}
                    </span>
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--tx-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                      }}
                      title={t.title}
                    >
                      {t.title}
                    </span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Timeline (Scrollable) */}
        <div
          ref={timelineScrollRef}
          style={{ flex: 1, overflow: 'auto', position: 'relative', minWidth: 0 }}
        >
          {/* Header Month & Days */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'sticky',
              top: 0,
              zIndex: 5,
              width: '2400px',
              background: 'var(--bg-s1)',
            }}
          >
            {/* Days Header */}
            <div
              style={{
                height: '64px',
                display: 'flex',
                borderBottom: '1px solid var(--bd-subtle)',
                background: 'var(--bg-s2)',
              }}
            >
              {days.map((d, i) => {
                const active = isToday(d);
                const weekend = isWeekend(d);
                const dayName = d
                  .toLocaleDateString('es-ES', { weekday: 'short' })
                  .substring(0, 1)
                  .toUpperCase();
                const dayNum = d.getDate();
                const showMonth = d.getDate() === 1 || i === 0;

                return (
                  <div
                    key={i}
                    style={{
                      width: '80px',
                      flexShrink: 0,
                      borderRight: '1px solid var(--bd-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: active ? '#e0e7ff' : weekend ? 'var(--bg-s3)' : 'transparent',
                      position: 'relative',
                    }}
                    title={d.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  >
                    {showMonth && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: '4px',
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          color: 'var(--ac)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {d.toLocaleDateString('es-ES', { month: 'short' }).substring(0, 3)}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: '0.65rem',
                        color: active ? 'var(--ac)' : 'var(--tx-muted)',
                        fontWeight: active ? 700 : 500,
                      }}
                    >
                      {dayName}
                    </span>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: active ? 700 : 600,
                        color: active ? 'var(--ac)' : 'var(--tx-primary)',
                      }}
                    >
                      {dayNum}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid & Bars */}
          <div style={{ position: 'relative', width: '2400px' }}>
            {/* Vertical guidelines */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                pointerEvents: 'none',
              }}
            >
              {days.map((d, i) => (
                <div
                  key={i}
                  style={{
                    width: '80px',
                    borderRight: '1px solid var(--bd-subtle)',
                    height: '100%',
                    opacity: isWeekend(d) ? 0.6 : 0.2,
                    background: isToday(d)
                      ? 'rgba(99, 102, 241, 0.05)'
                      : isWeekend(d)
                        ? 'var(--bg-s3)'
                        : 'transparent',
                  }}
                />
              ))}
            </div>

            {/* Rows with bars */}
            {groupedTickets.map((group) => (
              <React.Fragment key={group.id}>
                {groupBy !== 'none' && (
                  <div
                    style={{
                      height: '32px',
                      background: 'var(--bg-s2)',
                      borderBottom: '1px solid var(--bd-subtle)',
                    }}
                  />
                )}
                {group.tickets.map((t) => {
                  const tStart = parseDate(t.createdAt);
                  tStart.setHours(0, 0, 0, 0);

                  let tEnd = t.dueDate ? new Date(t.dueDate) : null;
                  if (tEnd) tEnd.setHours(0, 0, 0, 0);

                  let colStart = 1;
                  let colEnd = 31;
                  let inRange = true;
                  let isPlaceholder = false;

                  if (!tEnd) {
                    // No due date: represent as a 2-day warning bar starting on creation (or today if created in future)
                    const relativeStart =
                      tStart.getTime() < startDate.getTime()
                        ? startDate
                        : tStart.getTime() > endDate.getTime()
                          ? endDate
                          : tStart;
                    const startIdx = days.findIndex((d) => d.getTime() === relativeStart.getTime());
                    colStart = startIdx >= 0 ? startIdx + 1 : 8; // default to today position (index 7 + 1)
                    colEnd = Math.min(colStart + 2, 31);
                    isPlaceholder = true;
                  } else {
                    if (
                      tEnd.getTime() < startDate.getTime() ||
                      tStart.getTime() > endDate.getTime()
                    ) {
                      inRange = false;
                    } else {
                      const startMs = tStart.getTime();
                      if (startMs < startDate.getTime()) {
                        colStart = 1;
                      } else {
                        const idx = days.findIndex((d) => d.getTime() === startMs);
                        colStart = idx >= 0 ? idx + 1 : 1;
                      }

                      const endMs = tEnd.getTime();
                      if (endMs > endDate.getTime()) {
                        colEnd = 31;
                      } else {
                        const idx = days.findIndex((d) => d.getTime() === endMs);
                        colEnd = idx >= 0 ? idx + 2 : 31;
                      }
                    }
                  }

                  // Color mappings by priority
                  const getPriorityColor = (p: string) => {
                    switch (p) {
                      case 'critical':
                        return { bg: '#fee2e2', border: '#ef4444', text: '#ef4444' };
                      case 'high':
                        return { bg: '#ffedd5', border: '#f97316', text: '#f97316' };
                      case 'medium':
                        return { bg: '#e0f2fe', border: '#0284c7', text: '#0284c7' };
                      case 'low':
                        return { bg: '#f3f4f6', border: '#9ca3af', text: '#6b7280' };
                      default:
                        return {
                          bg: 'var(--bg-s3)',
                          border: 'var(--bd-strong)',
                          text: 'var(--tx-secondary)',
                        };
                    }
                  };

                  const colors = getPriorityColor(t.priority);

                  // Grid positioning styles (80px width per cell)
                  const leftPx = (colStart - 1) * 80;
                  const widthPx = (colEnd - colStart) * 80;

                  return (
                    <div
                      key={t.id}
                      style={{
                        height: '48px',
                        borderBottom: '1px solid var(--bd-subtle)',
                        position: 'relative',
                      }}
                    >
                      {inRange ? (
                        <div
                          onClick={() => setOpenTicketId(t.id)}
                          title={`${t.id}: ${t.title} ${isPlaceholder ? '(Sin fecha fin)' : ''}`}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: `${leftPx + 4}px`,
                            width: `${widthPx - 8}px`,
                            height: '28px',
                            background: isPlaceholder ? '#fffbeb' : colors.bg,
                            border: isPlaceholder
                              ? '1.5px dashed #f59e0b'
                              : `1px solid ${colors.border}`,
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 0.5rem',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: isPlaceholder ? '#b45309' : colors.text,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            transition: 'transform 0.1s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scaleY(1.05)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scaleY(1)')}
                        >
                          {t.isBlocked && <span style={{ marginRight: '4px' }}>🚫</span>}
                          {isPlaceholder ? '⚠️ Establecer fecha' : t.title}
                        </div>
                      ) : (
                        <div
                          onClick={() => setOpenTicketId(t.id)}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '4px',
                            width: '2392px',
                            height: '28px',
                            background: 'var(--bg-s3)',
                            border: '1px solid var(--bd-subtle)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            color: 'var(--tx-muted)',
                            fontStyle: 'italic',
                          }}
                        >
                          {t.title} (Fuera de rango)
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
