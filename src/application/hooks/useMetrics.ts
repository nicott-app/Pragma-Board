import { useState, useMemo } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useDataStore } from '../store/useDataStore';
import { useUIStore } from '../store/useUIStore';

export const useMetrics = () => {
  const activeProject = useProjectStore(s => s.activeProject);
  const tickets = useDataStore(s => s.tickets);
  const setMetricsOpen = useUIStore(s => s.setMetricsOpen);
  
  const [view, setView] = useState<'global' | 'sprint'>('global');
  const [showOverdue, setShowOverdue] = useState(false);
  const [showReestimated, setShowReestimated] = useState(false);
  const [showBoth, setShowBoth] = useState(false);

  const hasSprints = activeProject ? activeProject.sprints.length > 0 : false;
  
  const filteredTickets = useMemo(() => {
    if (!activeProject) return [];
    if (view === 'sprint' && hasSprints && activeProject.currentSprintId) {
      return tickets.filter(t => t.sprintId === activeProject.currentSprintId);
    }
    return tickets;
  }, [tickets, view, hasSprints, activeProject?.currentSprintId, activeProject]);

  const statuses = activeProject?.columns.map(c => c.id) ?? [];
  const doneStatus = statuses[statuses.length - 1];
  
  const totalTickets = filteredTickets.length;
  const doneTickets = filteredTickets.filter(t => t.status === doneStatus).length;
  const progressPercent = totalTickets > 0 ? Math.round((doneTickets / totalTickets) * 100) : 0;

  const totalLoggedHours = filteredTickets.reduce((sum, t) => {
    return sum + (t.timeLogs || []).reduce((logSum: number, log: any) => logSum + (Number(log.hours) || 0), 0);
  }, 0);

  const blockedCount = filteredTickets.filter(t => t.isBlocked).length;

  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = filteredTickets.filter(t => t.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (statusId: string) => {
    switch (statusId) {
      case 'backlog': return 'var(--tx-muted)';
      case 'in-progress': return 'var(--col-in-progress)';
      case 'blocked': return 'var(--error)';
      case 'in-review': return 'var(--warning)';
      case 'done': return 'var(--col-done)';
      default: return 'var(--bd-strong)';
    }
  };

  const typeCounts = filteredTickets.reduce((acc, t) => {
    const type = t.type || 'tarea';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeColors: Record<string, string> = {
    'tarea': '#9ca3af',
    'desarrollo': '#3b82f6',
    'bug': '#ef4444',
    'mejora': '#10b981',
    'incidencia': '#f97316',
    'analisis': '#06b6d4',
    'entregable': '#ec4899'
  };

  const activeT = filteredTickets.filter(t => t.status !== doneStatus);
  const workloadMap = (activeProject?.members ?? []).reduce((acc, m) => {
    acc[m.id] = { name: m.name, activeTickets: 0, totalHours: 0, color: m.color || '#6366f1' };
    return acc;
  }, {} as Record<string, { name: string, activeTickets: number, totalHours: number, color: string }>);

  activeT.forEach(t => {
    if (t.assignees && t.assignees.length > 0) {
      t.assignees.forEach(uid => { if (workloadMap[uid]) workloadMap[uid].activeTickets++; });
    }
  });

  filteredTickets.forEach(t => {
    (t.timeLogs || []).forEach((log: any) => {
      if (log.authorId && workloadMap[log.authorId]) {
        workloadMap[log.authorId].totalHours += Number(log.hours) || 0;
      }
    });
  });

  const workloadArray = Object.values(workloadMap).sort((a, b) => b.totalHours - a.totalHours || b.activeTickets - a.activeTickets);

  const wipStatuses = ['in-progress', 'blocked', 'in-review'];
  const activeWipTickets = filteredTickets.filter(t => wipStatuses.includes(t.status)).length;

  const allOverdue = useMemo(() => {
    return filteredTickets.filter(t => {
      if (!wipStatuses.includes(t.status)) return false;
      if (!t.dueDate) return false;
      return new Date() > new Date(t.dueDate);
    });
  }, [filteredTickets, wipStatuses]);

  const allReestimated = useMemo(() => {
    return filteredTickets.filter(t => {
      if (!wipStatuses.includes(t.status)) return false;
      return (t.history || []).some(h => 
        h.action && (
          h.action.toLowerCase().includes('fecha límite') || 
          h.action.toLowerCase().includes('due_date_changed') ||
          h.action.toLowerCase().includes('fecha fin')
        )
      );
    });
  }, [filteredTickets, wipStatuses]);

  const bothDeviationsList = useMemo(() => {
    const overdueIds = new Set(allOverdue.map(t => t.id));
    return allReestimated.filter(t => overdueIds.has(t.id));
  }, [allOverdue, allReestimated]);

  const overdueTicketsList = useMemo(() => {
    const bothIds = new Set(bothDeviationsList.map(t => t.id));
    return allOverdue.filter(t => !bothIds.has(t.id));
  }, [allOverdue, bothDeviationsList]);

  const reestimatedTicketsList = useMemo(() => {
    const bothIds = new Set(bothDeviationsList.map(t => t.id));
    return allReestimated.filter(t => !bothIds.has(t.id));
  }, [allReestimated, bothDeviationsList]);

  const overduePct = activeWipTickets > 0 ? Math.round((overdueTicketsList.length / activeWipTickets) * 100) : 0;
  const reestimatedPct = activeWipTickets > 0 ? Math.round((reestimatedTicketsList.length / activeWipTickets) * 100) : 0;
  const bothDeviationsPct = activeWipTickets > 0 ? Math.round((bothDeviationsList.length / activeWipTickets) * 100) : 0;

  return {
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
  };
};
