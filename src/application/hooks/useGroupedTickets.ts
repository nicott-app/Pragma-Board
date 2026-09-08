import { useMemo } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useUIStore } from '../store/useUIStore';
import { Ticket } from '../../domain/models/Ticket';

export interface SwimlaneGroup {
  id: string;
  label: string;
  tickets: Ticket[];
}

export const useGroupedTickets = (filteredTickets: Ticket[]): SwimlaneGroup[] => {
  const activeProject = useProjectStore((s) => s.activeProject);
  const groupBy = useUIStore((s) => s.groupBy);

  return useMemo(() => {
    let lanes: { id: string; label: string }[] = [{ id: 'none', label: 'Tablero Principal' }];

    if (!activeProject)
      return [{ id: 'none', label: 'Tablero Principal', tickets: filteredTickets }];

    if (groupBy === 'assignee') {
      const uniqueAssignees = Array.from(
        new Set(
          filteredTickets
            .flatMap((t) => t.assignees || [])
            .filter((id) => Boolean(id) && id !== 'unassigned')
        )
      );
      lanes = [
        ...uniqueAssignees.map((id) => {
          const member = activeProject.members.find((m) => m.id === id);
          return { id, label: member ? member.name : id };
        }),
        { id: 'unassigned', label: 'Sin Asignar' },
      ];
    } else if (groupBy === 'priority') {
      lanes = [
        { id: 'critical', label: 'Crítica' },
        { id: 'high', label: 'Alta' },
        { id: 'medium', label: 'Media' },
        { id: 'low', label: 'Baja' },
      ];
    } else if (groupBy === 'type') {
      lanes = [
        { id: 'desarrollo', label: 'Desarrollo' },
        { id: 'incidencia', label: 'Incidencia' },
        { id: 'analisis', label: 'Análisis' },
        { id: 'entregable', label: 'Entregable' },
        { id: 'tarea', label: 'Tarea' },
        { id: 'bug', label: 'Bug' },
        { id: 'mejora', label: 'Mejora' },
      ];
    }

    const groups: SwimlaneGroup[] = [];

    for (const lane of lanes) {
      let laneTickets = filteredTickets;
      if (groupBy === 'assignee') {
        laneTickets =
          lane.id === 'unassigned'
            ? filteredTickets.filter((t) => !t.assignees || t.assignees.length === 0)
            : filteredTickets.filter((t) => t.assignees?.includes(lane.id));
      } else if (groupBy === 'priority') {
        laneTickets = filteredTickets.filter((t) => t.priority === lane.id);
      } else if (groupBy === 'type') {
        laneTickets = filteredTickets.filter((t) => t.type === lane.id);
      }

      if (groupBy === 'none' || laneTickets.length > 0) {
        groups.push({ ...lane, tickets: laneTickets });
      }
    }

    return groups;
  }, [activeProject, filteredTickets, groupBy]);
};
