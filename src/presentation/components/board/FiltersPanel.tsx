import React from 'react';
import { useUIStore } from '../../../application/store/useUIStore';
import { useProjectStore } from '../../../application/store/useProjectStore';

export const FiltersPanel: React.FC = () => {
  const filters = useUIStore(s => s.filters);
  const setFilters = useUIStore(s => s.setFilters);
  const groupBy = useUIStore(s => s.groupBy);
  const setGroupBy = useUIStore(s => s.setGroupBy);
  const showFiltersPanel = useUIStore(s => s.showFiltersPanel);
  const setShowFiltersPanel = useUIStore(s => s.setShowFiltersPanel);
  const activeProject = useProjectStore(s => s.activeProject);

  if (!showFiltersPanel) {
    return (
      <div style={{ padding: '1rem 1.5rem 0.5rem' }}>
        <div className="filters-bar-collapsed" style={{ 
          display: 'inline-flex', gap: '1rem', alignItems: 'center', 
          padding: '0.5rem 1rem', background: 'var(--bg-s1)', 
          border: '1px solid var(--bd-subtle)', borderRadius: 'var(--r-md)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => setShowFiltersPanel(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-s2)', border: '1px solid var(--bd-default)', borderRadius: 'var(--r-full)', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ac)' }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          Filtros avanzados
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--tx-muted)' }}>
          <span>AGRUPAR POR</span>
          <select 
            value={groupBy} 
            onChange={(e) => setGroupBy(e.target.value as any)}
            style={{ background: 'var(--bg-s2)', border: '1px solid var(--bd-default)', borderRadius: 'var(--r-sm)', color: 'var(--tx-primary)', padding: '0.2rem 0.5rem', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
          >
            <option value="none">Ninguno</option>
            <option value="assignee">Asignado</option>
            <option value="priority">Prioridad</option>
            <option value="type">Tipo</option>
          </select>
        </div>
        </div>
      </div>
    );
  }

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    const current = filters[category];
    if (current.includes(value)) {
      setFilters({ ...filters, [category]: current.filter(item => item !== value) });
    } else {
      setFilters({ ...filters, [category]: [...current, value] });
    }
  };

  const isSelected = (category: keyof typeof filters, value: string) => filters[category].includes(value);

  const priorities = [
    { id: 'critica', label: 'Crítica', color: '#e11d48' },
    { id: 'alta', label: 'Alta', color: '#ea580c' },
    { id: 'media', label: 'Media', color: '#eab308' },
    { id: 'baja', label: 'Baja', color: '#22c55e' }
  ];

  const types = [
    { id: 'desarrollo', label: 'Desarrollo', icon: '💻' },
    { id: 'incidencia', label: 'Incidencia', icon: '🚨' },
    { id: 'analisis', label: 'Análisis', icon: '🔍' },
    { id: 'entregable', label: 'Entregable', icon: '📦' },
    { id: 'tarea', label: 'Tarea', icon: '✅' },
    { id: 'bug', label: 'Bug', icon: '🐛' },
    { id: 'mejora', label: 'Mejora', icon: '✨' }
  ];

  const quickFilters = [
    { id: 'current_sprint', label: 'Sprint Activo', icon: '🏃' },
    { id: 'blocked', label: 'Bloqueadas', icon: '🚫' },
    { id: 'unestimated', label: 'Sin estimar', icon: '⏳' },
    { id: 'due_soon', label: 'Vence pronto', icon: '⏳' },
    { id: 'overdue', label: 'Vencido', icon: '⚠️' },
    { id: 'archived', label: 'Archivados', icon: '📦' }
  ];

  const assignees = activeProject?.members || [];

  const FilterChip = ({ category, item, iconOrColor }: { category: keyof typeof filters, item: { id: string, label: string }, iconOrColor: React.ReactNode }) => (
    <button
      onClick={() => toggleFilter(category, item.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.35rem',
        padding: '0.25rem 0.75rem',
        background: isSelected(category, item.id) ? 'var(--ac-bg)' : 'var(--bg-s2)',
        border: `1px solid ${isSelected(category, item.id) ? 'var(--ac)' : 'var(--bd-subtle)'}`,
        borderRadius: 'var(--r-full)',
        color: isSelected(category, item.id) ? 'var(--tx-primary)' : 'var(--tx-secondary)',
        fontSize: '0.75rem',
        fontWeight: isSelected(category, item.id) ? 600 : 500,
        cursor: 'pointer',
        transition: 'all var(--t-fast)'
      }}
    >
      {iconOrColor}
      {item.label}
    </button>
  );

  return (
    <div style={{ padding: '1rem 1.5rem 0.5rem' }}>
      <div className="filters-panel-expanded" style={{ background: 'var(--bg-s1)', border: '1px solid var(--bd-subtle)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => setShowFiltersPanel(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--ac-bg)', border: '1px solid var(--ac)', borderRadius: 'var(--r-full)', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ac)' }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          Filtros avanzados
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--tx-muted)' }}>
          <span>AGRUPAR POR</span>
          <select 
            value={groupBy} 
            onChange={(e) => setGroupBy(e.target.value as any)}
            style={{ background: 'var(--bg-s2)', border: '1px solid var(--bd-default)', borderRadius: 'var(--r-sm)', color: 'var(--tx-primary)', padding: '0.2rem 0.5rem', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
          >
            <option value="none">Ninguno</option>
            <option value="assignee">Asignado</option>
            <option value="priority">Prioridad</option>
            <option value="type">Tipo</option>
          </select>
        </div>
      </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          
          {/* Prioridad */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Prioridad</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {priorities.map(p => (
                <FilterChip key={p.id} category="priority" item={p} iconOrColor={<div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />} />
              ))}
            </div>
          </div>

          {/* Tipo de Tarea */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Tipo de Tarea</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {types.map(t => (
                <FilterChip key={t.id} category="type" item={t} iconOrColor={<span style={{ fontSize: '0.8rem' }}>{t.icon}</span>} />
              ))}
            </div>
          </div>

        {/* Asignado A */}
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Asignado A</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {assignees.map(a => (
              <FilterChip key={a.id} category="assignedTo" item={{ id: a.id, label: a.name }} iconOrColor={
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: a.color, color: '#fff', fontSize: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {a.name.substring(0,2).toUpperCase()}
                </div>
              } />
            ))}
            <FilterChip category="assignedTo" item={{ id: 'unassigned', label: 'Sin asignar' }} iconOrColor={<span style={{ fontSize: '0.8rem' }}>❓</span>} />
          </div>
        </div>

        {/* Filtros Rápidos */}
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Filtros Rápidos</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {quickFilters.map(q => (
              <FilterChip key={q.id} category="quickFilters" item={q} iconOrColor={<span style={{ fontSize: '0.8rem' }}>{q.icon}</span>} />
            ))}
          </div>
          <button style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-s3)', border: '1px solid var(--ac)', borderRadius: 'var(--r-sm)', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--tx-primary)', cursor: 'pointer' }}>
            💾 Guardar filtros actuales
          </button>
        </div>

      </div>
    </div>
    </div>
  );
};
