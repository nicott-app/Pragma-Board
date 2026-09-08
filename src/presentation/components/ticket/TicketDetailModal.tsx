import { useModalA11y } from '../../../application/hooks/useModalA11y';
import React, { useRef } from 'react';
import { BlockTicketModal } from './BlockTicketModal';
import { TicketHeader } from './detail/TicketHeader';
import { TicketDescription } from './detail/TicketDescription';
import { TicketAcceptanceCriteria } from './detail/TicketAcceptanceCriteria';
import { TicketSubtasks } from './detail/TicketSubtasks';
import { TicketTimeTracking } from './detail/TicketTimeTracking';
import { TicketSidebar } from './detail/TicketSidebar';
import { TicketTabs } from './detail/TicketTabs';
import { useTicketDetail } from '../../../application/hooks/useTicketDetail';

interface TicketDetailModalProps {
  ticketId: string;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticketId, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModalA11y(true, onClose, modalRef);

  const {
    ticket,
    activeProject,
    currentUser,
    unreviewedNotes,
    linkedNotes,
    isLoadingNotes,
    uploadProgress,
    uploadError,
    pendingBlockStatus,
    setPendingBlockStatus,
    handleUpdate,
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleReorderSubtasks,
    handleAddTimeLog,
    handleDeleteTimeLog,
    handleAddComment,
    handleDeleteComment,
    handleUploadFile,
    handleDeleteAttachment,
    handleDeleteTicket,
    handleDuplicateTicket,
    handleReviewNote,
    handleConfirmBlock,
    isMemberOnVacation,
    formatDate,
    getMemberName,
    setNotesOpen
  } = useTicketDetail(ticketId, onClose);

  if (!ticket || !activeProject || !currentUser) return null;

  const totalHoursLogged = (ticket.timeLogs || []).reduce((sum, log) => sum + log.hours, 0);
  const estimatedHours = ticket.estimatedHours || 0;
  const timePercent = estimatedHours > 0 ? Math.min(100, Math.round((totalHoursLogged / estimatedHours) * 100)) : 0;
  const unassignedMembers = activeProject.members.filter(m => !(ticket.assignees || []).includes(m.id));

  const headerStyle = { fontSize: '0.75rem', color: '#6b7280', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' };

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" tabIndex={-1} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ position: 'relative', background: 'var(--bg-s1)', width: '100%', maxWidth: '1100px', height: '90vh', borderRadius: '16px', display: 'flex', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-s1)', border: '1px solid var(--bd-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--tx-secondary)', fontSize: '1.2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 10 }}>✕</button>

        <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem', background: 'var(--bg-s1)' }}>
          <TicketHeader ticket={ticket} handleUpdate={handleUpdate} formatDate={formatDate} />
          <TicketDescription description={ticket.description} handleUpdate={handleUpdate} headerStyle={headerStyle} />
          <TicketAcceptanceCriteria criteria={ticket.acceptanceCriteria || []} handleUpdate={handleUpdate} headerStyle={headerStyle} />
          
          <TicketSubtasks 
            subtasks={ticket.subtasks || []} 
            onAddSubtask={handleAddSubtask} 
            onToggleSubtask={handleToggleSubtask} 
            onDeleteSubtask={handleDeleteSubtask} 
            onReorderSubtasks={handleReorderSubtasks} 
          />
          
          <TicketTimeTracking 
            timeLogs={ticket.timeLogs || []} 
            onAddTimeLog={handleAddTimeLog} 
            onDeleteTimeLog={handleDeleteTimeLog} 
            getMemberName={getMemberName} 
            headerStyle={headerStyle} 
          />

          <TicketTabs 
            ticket={ticket} 
            activeProject={activeProject} 
            currentUser={currentUser} 
            linkedNotes={linkedNotes} 
            isLoadingNotes={isLoadingNotes} 
            unreviewedNotes={unreviewedNotes} 
            getMemberName={getMemberName} 
            onAddComment={handleAddComment} 
            onDeleteComment={handleDeleteComment} 
            onUploadAttachment={handleUploadFile} 
            onDeleteAttachment={handleDeleteAttachment} 
            uploadProgress={uploadProgress} 
            uploadError={uploadError} 
            onReviewNote={handleReviewNote} 
            onOpenNotes={() => { onClose(); setNotesOpen(true); }} 
          />
        </div>

        <TicketSidebar 
          ticket={ticket} 
          activeProject={activeProject} 
          currentUser={currentUser} 
          isMemberOnVacation={isMemberOnVacation} 
          totalHoursLogged={totalHoursLogged} 
          estimatedHours={estimatedHours} 
          timePercent={timePercent} 
          unassignedMembers={unassignedMembers} 
          handleUpdate={handleUpdate as any} 
          handleAddAssignee={(uid) => handleUpdate('assignees', [...(ticket.assignees || []), uid])} 
          handleRemoveAssignee={(uid) => handleUpdate('assignees', (ticket.assignees || []).filter(id => id !== uid))} 
          handleDuplicateTicket={handleDuplicateTicket} 
          handleDeleteTicket={handleDeleteTicket} 
          setPendingBlockStatus={setPendingBlockStatus} 
        />

        {pendingBlockStatus && (
          <BlockTicketModal
            onConfirm={handleConfirmBlock}
            onCancel={() => setPendingBlockStatus(null)}
          />
        )}
      </div>
    </div>
  );
};
