import { useDataStore } from '../../../application/store/useDataStore';
import { useProjectStore } from '../../../application/store/useProjectStore';

export const RoadmapView: React.FC = () => {
  const tickets = useDataStore(s => s.tickets);
  const activeProject = useProjectStore(s => s.activeProject);

  if (!activeProject) return null;

  // Simple progress calculation based on 'done' column
  const total = tickets.length;
  const doneCol = activeProject.columns[activeProject.columns.length - 1]; // Assuming last column is "done"
  const doneTickets = tickets.filter(t => t.status === doneCol?.id).length;
  const progress = total === 0 ? 0 : Math.round((doneTickets / total) * 100);

  return (
    <div style={{ padding: '2rem', background: 'var(--bg-s1)', height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-s2)', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem' }}>🗺️</div>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--tx-primary)', margin: 0 }}>Roadmap: {activeProject.name}</h2>
            <p style={{ color: 'var(--tx-secondary)', margin: '0.25rem 0 0 0' }}>Vista general del progreso del proyecto</p>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--tx-primary)' }}>Progreso Global</span>
            <span style={{ color: 'var(--ac)' }}>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: 'var(--bg-s1)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--ac)', transition: 'width 0.5s ease' }} />
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--tx-muted)', marginTop: '0.5rem' }}>
            {doneTickets} de {total} tickets completados
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-s1)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--tx-primary)', fontWeight: 'bold' }}>{tickets.filter(t => t.priority === 'critical').length}</div>
            <div style={{ color: 'var(--tx-secondary)', fontSize: '0.875rem' }}>Críticos</div>
          </div>
          <div style={{ background: 'var(--bg-s1)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--tx-primary)', fontWeight: 'bold' }}>{tickets.filter(t => t.type === 'bug').length}</div>
            <div style={{ color: 'var(--tx-secondary)', fontSize: '0.875rem' }}>Bugs Reportados</div>
          </div>
          <div style={{ background: 'var(--bg-s1)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--tx-primary)', fontWeight: 'bold' }}>{tickets.filter(t => t.status === activeProject.columns[0]?.id).length}</div>
            <div style={{ color: 'var(--tx-secondary)', fontSize: '0.875rem' }}>En Backlog</div>
          </div>
        </div>
      </div>
    </div>
  );
};
