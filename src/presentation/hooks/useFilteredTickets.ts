import { useMemo } from 'react';
import { useDataStore } from '../../application/store/useDataStore';
import { useUIStore } from '../../application/store/useUIStore';
import { useProjectStore } from '../../application/store/useProjectStore';
import { Ticket } from '../../domain/models/Ticket';

export const useFilteredTickets = (): Ticket[] => {
  const tickets = useDataStore(s => s.tickets);
  const filterSearchQuery = useUIStore(s => s.filterSearchQuery);
  const filters = useUIStore(s => s.filters);
  const activeProject = useProjectStore(s => s.activeProject);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      // Search query
      if (filterSearchQuery && !t.title.toLowerCase().includes(filterSearchQuery.toLowerCase())) return false;
      
      if (filters.priority.length > 0 && !filters.priority.includes(t.priority)) return false;
      if (filters.type.length > 0 && !filters.type.includes(t.type)) return false;
      
      if (filters.assignedTo.length > 0) {
        if (filters.assignedTo.includes('unassigned') && (!t.assignees || t.assignees.length === 0)) {
          // match
        } else if (!t.assignees?.some(a => filters.assignedTo.includes(a))) {
          return false;
        }
      }
      
      if (filters.quickFilters.length > 0) {
        if (filters.quickFilters.includes('current_sprint') && t.sprintId !== activeProject?.currentSprintId) return false;
        if (filters.quickFilters.includes('blocked') && !t.isBlocked) return false;
        if (filters.quickFilters.includes('unestimated') && t.estimatedHours !== undefined && t.estimatedHours !== null && t.estimatedHours > 0) return false;
        
        const now = new Date();
        if (t.dueDate) {
          const dueDate = new Date(t.dueDate);
          const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 3600);
          if (filters.quickFilters.includes('overdue') && diffHours >= 0) return false;
          if (filters.quickFilters.includes('due_soon') && (diffHours < 0 || diffHours > 48)) return false;
        } else {
          if (filters.quickFilters.includes('overdue') || filters.quickFilters.includes('due_soon')) return false;
        }
      }
      
      return true;
    });
  }, [tickets, filterSearchQuery, filters, activeProject?.currentSprintId]);

  return filteredTickets;
};
