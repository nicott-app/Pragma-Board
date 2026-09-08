import React from 'react';
import { BoardColumn } from '../../../domain/models/Project';
import { Ticket } from '../../../domain/models/Ticket';
import { TicketCard } from './TicketCard';
import { Droppable } from '@hello-pangea/dnd';

interface ColumnProps {
  column: BoardColumn;
  tickets: Ticket[];
  droppableId: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  laneId: string;
}

export const Column: React.FC<ColumnProps> = ({ column, tickets, droppableId, isCollapsed, onToggleCollapse, laneId }) => {
  return (
    <div className={`kanban-col ${isCollapsed ? 'collapsed' : ''}`} data-col={column.id} data-status={column.id}>
      <div className="col-header">
        <button 
          className="col-collapse-btn" 
          onClick={onToggleCollapse} 
          title={isCollapsed ? "Expandir columna" : "Contraer columna"}
        >
          {isCollapsed ? '▶' : '▼'}
        </button>
        <h3 className="col-title">
          {column.emoji} {column.label}
        </h3>
        <span className="col-count">{tickets.length}</span>
        {column.wip !== null && (
          <span className={`col-wip-limit ${tickets.length > column.wip ? 'exceeded' : ''}`} title={`WIP Limit: ${column.wip}`}>
            / {column.wip}
          </span>
        )}
      </div>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            className={`col-body ${snapshot.isDraggingOver ? 'drag-over-body' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tickets.map((ticket, index) => (
              <TicketCard key={`${ticket.id}::${laneId}`} ticket={ticket} index={index} laneId={laneId} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
