import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Column } from './Column';
import { FiltersPanel } from './FiltersPanel';
import { BlockTicketModal } from '../ticket/BlockTicketModal';
import { useBoard } from '../../../application/hooks/useBoard';

export const Board: React.FC = () => {
  const {
    activeProject,
    permissions,
    visibleColumns,
    collapsedCols,
    toggleColumnCollapse,
    handleAddColumn,
    onDragEnd,
    pendingBlock,
    handleConfirmBlock,
    handleCancelBlock,
    swimlanes,
    filteredTickets,
    groupBy
  } = useBoard();

  if (!activeProject || !permissions) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <FiltersPanel />
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
          {swimlanes.map(lane => {
            let laneTickets = filteredTickets;
            if (groupBy === 'assignee') {
              laneTickets = lane.id === 'unassigned' 
                ? filteredTickets.filter(t => !t.assignees || t.assignees.length === 0)
                : filteredTickets.filter(t => t.assignees?.includes(lane.id));
            } else if (groupBy === 'priority') {
              laneTickets = filteredTickets.filter(t => t.priority === lane.id);
            } else if (groupBy === 'type') {
              laneTickets = filteredTickets.filter(t => t.type === lane.id);
            }

            // Skip empty lanes unless it's the default 'none' view
            if (groupBy !== 'none' && laneTickets.length === 0) return null;

            return (
              <div key={lane.id} className="swimlane">
                {groupBy !== 'none' && (
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--tx-primary)', padding: '0 1.25rem', marginBottom: '0.5rem' }}>
                    {lane.label}
                  </h3>
                )}
                <Droppable droppableId={`board-columns-${lane.id}`} type="column" direction="horizontal">
                  {(provided) => (
                    <div 
                      id={`board-container-${lane.id}`} 
                      style={{ display: 'flex', gap: '1rem', padding: '0 1.25rem', overflowX: 'auto', minHeight: '300px' }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {visibleColumns.map((col, index) => (
                        <Draggable key={`${lane.id}-${col.id}`} draggableId={`${lane.id}-${col.id}`} index={index}>
                          {(providedDrag) => (
                            <div
                              ref={providedDrag.innerRef}
                              {...providedDrag.draggableProps}
                              {...providedDrag.dragHandleProps}
                              style={{
                                ...providedDrag.draggableProps.style,
                                display: 'flex',
                                flexShrink: 0
                              }}
                            >
                              <Column 
                                column={col} 
                                tickets={laneTickets.filter(t => t.status === col.id)}
                                droppableId={`${lane.id}::${col.id}`}
                                isCollapsed={!!collapsedCols[col.id]}
                                onToggleCollapse={() => toggleColumnCollapse(col.id)}
                                laneId={lane.id}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {permissions.manage_columns && (
                        <div style={{ flexShrink: 0, width: '280px', display: 'flex', paddingBottom: '1rem' }}>
                          <button 
                            onClick={handleAddColumn}
                            style={{ 
                              width: '100%', 
                              height: 'calc(100% - 1rem)',
                              minHeight: '200px', 
                              background: 'var(--bg-s2)', 
                              border: '2px dashed var(--bd-strong)', 
                              borderRadius: '8px', 
                              color: 'var(--tx-secondary)', 
                              cursor: 'pointer', 
                              fontSize: '1rem', 
                              fontWeight: 600, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              gap: '0.5rem',
                              transition: 'all 0.2s ease',
                              opacity: 0.7
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                          >
                            <span>➕</span> Añadir Columna
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      {pendingBlock && (
        <BlockTicketModal
          onConfirm={handleConfirmBlock}
          onCancel={handleCancelBlock}
        />
      )}
    </div>
  );
};
