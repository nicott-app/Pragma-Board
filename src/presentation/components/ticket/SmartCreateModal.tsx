import { useModalA11y } from '../../../application/hooks/useModalA11y';
import React, { useRef } from 'react';
import { TicketPriority, TicketType } from '../../../domain/models/Ticket';
import { useSmartCreate } from '../../../application/hooks/useSmartCreate';
import { useDialogStore } from '../../../application/store/useDialogStore';

interface SmartCreateModalProps {
  onClose: () => void;
}

export const SmartCreateModal: React.FC<SmartCreateModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModalA11y(true, onClose, modalRef);

  const {
    activeProject,
    prompt, setPrompt,
    loading,
    result,
    mode, setMode,
    aiAssignee, setAiAssignee,
    aiEstimatedHours, setAiEstimatedHours,
    aiWarnings,
    dynamicExamples,
    loadingExamples,
    generateDynamicExamples,
    manualTitle, setManualTitle,
    manualDesc, setManualDesc,
    manualType, setManualType,
    manualPriority, setManualPriority,
    manualestimatedHours, setManualestimatedHours,
    manualAssignee, setManualAssignee,
    manualSprintId, setManualSprintId,
    bulkReports, setBulkReports,
    bulkDesc, setBulkDesc,
    bulkCategories, setBulkCategories,
    isGeneratingBulk, handleBulkCreateTickets,
    handleGenerate,
    handleConfirm,
    handleManualCreate
  } = useSmartCreate(onClose);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" tabIndex={-1} id="smart-create-overlay" className="overlay active">
      <div id="smart-create-modal" className="modal" style={{ maxWidth: mode === 'bulk' ? '1100px' : undefined, width: mode === 'bulk' ? '95vw' : undefined, transition: 'max-width 0.3s ease, width 0.3s ease' }}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        
        <div className="smart-create-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
          <div className="smart-create-icon">{mode === 'ai' ? '✨' : '📝'}</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--tx-primary)' }}>
              {mode === 'ai' ? 'Creación Inteligente' : 'Creación Manual'}
            </h2>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--tx-secondary)' }}>
              {mode === 'ai' ? 'Describe lo que necesitas y la IA hará el resto' : 'Rellena los detalles de la nueva tarea'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', padding: '0 1.5rem 1rem', borderBottom: '1px solid var(--bd-subtle)' }}>
          <button 
            type="button" 
            className={`btn ${mode === 'ai' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setMode('ai')}
          >
            ✨ Asistente IA
          </button>
          <button 
            type="button" 
            className={`btn ${mode === 'manual' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setMode('manual')}
          >
            📝 Manual
          </button>
          <button 
            type="button" 
            className={`btn ${mode === 'bulk' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setMode('bulk')}
          >
            ⚡ Masivo
          </button>
        </div>

        <div className="smart-create-body">
          {mode === 'ai' && (
            <>
              <textarea 
            className="smart-input-area" 
            autoFocus 
            placeholder="Ej: Hay que añadir un botón de exportar a PDF en la tabla de métricas. Es de prioridad alta y estimo que tomará unas 4 horas..." 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="smart-examples" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="smart-examples-label" style={{ marginBottom: 0 }}>
                {dynamicExamples.length > 0 ? 'Ejemplos rápidos dinámicos (basados en tus tickets):' : 'Ejemplos rápidos:'}
              </span>
              <button 
                type="button"
                onClick={generateDynamicExamples}
                disabled={loadingExamples}
                style={{ background: 'transparent', border: 'none', color: 'var(--ac)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {loadingExamples ? <span className="spinner spinner-sm"></span> : '✨ Re-analizar proyecto'}
              </button>
            </div>
            
            {dynamicExamples.length > 0 ? (
              dynamicExamples.map((ex, i) => (
                <button key={i} className="smart-example" onClick={() => setPrompt(ex.prompt)}>
                  {ex.label}
                </button>
              ))
            ) : (
              <>
                <button className="smart-example" onClick={() => setPrompt('Desarrollo MS: Crear modelo semántico de [NOMBRE PROYECTO] en PowerBI. Llevará un esfuerzo de [x] horas')}>
                  📊 Desarrollo MS: Crear modelo semántico...
                </button>
                <button className="smart-example" onClick={() => setPrompt('Desarrollo IAT/IAD: Crear informe alimentado por [MODELO SEMANTICO]. Llevará un esfuerzo de [x] horas')}>
                  📈 Desarrollo IAT/IAD: Crear informe...
                </button>
                <button className="smart-example" onClick={() => setPrompt('Tarea: Validación del informe [NOMBRE DEL INFORME]. Llevará un esfuerzo de [x] horas. Genera también estas 3 subtareas: "Comprobación de datos", "Interacción correcta de marcadores", "Tooltips revisados".')}>
                  ✅ Tarea: Validación del informe...
                </button>
              </>
            )}
          </div>

          <div className="ai-disclaimer">
            <span className="ai-disc-icon">⚠️</span>
            <span>La información enviada será procesada por modelos de inteligencia artificial de terceros (Google Gemini / Groq).</span>
          </div>

          <div className={`smart-result ${result ? 'visible' : ''}`}>
            <div className="smart-result-header">
              ✨ Resultado Generado
            </div>
            {result && (
              <div className="smart-result-body">
                {aiWarnings.length > 0 && (
                  <div style={{ background: '#fef08a', color: '#854d0e', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {aiWarnings.map((w, i) => <div key={i}>⚠️ {w}</div>)}
                  </div>
                )}
                {(result.isBlocked === true || result.isBlocked === 'true') && (
                  <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center', border: '1px solid #fecaca' }}>
                    <span>⛔</span>
                    <strong>Bloqueado:</strong> {result.blockerReason || 'Por dependencias externas'}
                  </div>
                )}
                <div className="smart-result-title">{result.title}</div>
                <div className="smart-result-desc" style={{ whiteSpace: 'pre-wrap' }}>{result.description}</div>
                {/* ── Field Status Grid ───────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem', margin: '0.75rem 0' }}>

                  {/* Tipo */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'var(--bg-s2)', border: '1px solid var(--bd-subtle)' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo</span>
                    <span className={`badge type-${result.type}`} style={{ alignSelf: 'flex-start' }}>{result.type}</span>
                  </div>

                  {/* Prioridad */}
                  {(() => {
                    const priorityColors: Record<string, { bg: string; text: string; label: string }> = {
                      critical: { bg: '#fef2f2', text: '#991b1b', label: '🔴 Crítica' },
                      high:     { bg: '#fff7ed', text: '#9a3412', label: '🟠 Alta' },
                      medium:   { bg: '#fefce8', text: '#854d0e', label: '🟡 Media' },
                      low:      { bg: '#f0fdf4', text: '#166534', label: '🟢 Baja' },
                    };
                    const p = priorityColors[result.priority] || { bg: 'var(--bg-s2)', text: 'var(--tx-primary)', label: result.priority };
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.5rem 0.75rem', borderRadius: '8px', background: p.bg, border: `1px solid ${p.bg}` }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prioridad</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: p.text }}>{p.label}</span>
                      </div>
                    );
                  })()}

                  {/* Columna destino */}
                  {(() => {
                    const isPresent = result.timeTense === 'present';
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.5rem 0.75rem', borderRadius: '8px', background: isPresent ? '#eff6ff' : '#f0fdf4', border: '1px solid transparent' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Columna</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isPresent ? '#1d4ed8' : '#166534' }}>
                          {isPresent ? '⚡ En Progreso' : '📋 Backlog'}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Horas estimadas */}
                  {(() => {
                    const hasHours = aiEstimatedHours !== '';
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.5rem 0.75rem', borderRadius: '8px', background: hasHours ? '#f0fdf4' : '#fef2f2', border: `1px solid ${hasHours ? '#bbf7d0' : '#fecaca'}` }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Horas {!hasHours && <span style={{ color: '#dc2626' }}>✕ Requerido</span>}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <input
                            type="number"
                            value={aiEstimatedHours}
                            onChange={e => setAiEstimatedHours(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="—"
                            style={{ width: '52px', padding: '0.15rem 0.3rem', borderRadius: '4px', border: `1px solid ${hasHours ? '#86efac' : '#fca5a5'}`, background: 'transparent', color: 'var(--tx-primary)', fontSize: '0.8rem', fontWeight: 600 }}
                          />
                          <span style={{ fontSize: '0.75rem', color: 'var(--tx-secondary)' }}>h</span>
                          {!hasHours && result.aiSuggestedHours && !isNaN(Number(result.aiSuggestedHours)) && (
                            <button
                              className="btn btn-sm"
                              style={{ fontSize: '0.65rem', padding: '0.1rem 0.3rem', background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '4px', cursor: 'pointer' }}
                              onClick={() => setAiEstimatedHours(Number(result.aiSuggestedHours))}
                              title="Usar estimación de la IA"
                            >
                              💡 {result.aiSuggestedHours}h
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Asignado a */}
                  {(() => {
                    const hasAssignee = !!aiAssignee;
                    const assigneeName = hasAssignee ? activeProject?.members.find(m => m.id === aiAssignee)?.name : null;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.5rem 0.75rem', borderRadius: '8px', background: hasAssignee ? '#f0fdf4' : '#fefce8', border: `1px solid ${hasAssignee ? '#bbf7d0' : '#fde68a'}` }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asignado a</span>
                        <select
                          value={aiAssignee}
                          onChange={e => setAiAssignee(e.target.value)}
                          style={{ padding: '0.15rem 0.3rem', borderRadius: '4px', border: `1px solid ${hasAssignee ? '#86efac' : '#fcd34d'}`, background: 'transparent', color: 'var(--tx-primary)', fontSize: '0.78rem', fontWeight: hasAssignee ? 600 : 400 }}
                        >
                          <option value="">— Sin asignar</option>
                          {activeProject?.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        {hasAssignee && assigneeName && (
                          <span style={{ fontSize: '0.7rem', color: '#166534' }}>👤 {assigneeName}</span>
                        )}
                      </div>
                    );
                  })()}

                  {/* Fecha límite */}
                  {(() => {
                    const hasDue = !!result.dueDate;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.5rem 0.75rem', borderRadius: '8px', background: hasDue ? '#f0fdf4' : 'var(--bg-s2)', border: `1px solid ${hasDue ? '#bbf7d0' : 'var(--bd-subtle)'}` }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha límite</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: hasDue ? '#166534' : 'var(--tx-muted)' }}>
                          {hasDue ? `📅 ${result.dueDate}` : '—'}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Tags */}
                {Array.isArray(result.tags) && result.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    {result.tags.map((t: string) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                )}

                {Array.isArray(result.subtasks) && result.subtasks.length > 0 && (
                  <div className="smart-result-ac">
                    <strong>Subtareas:</strong>
                    {result.subtasks.map((ac: string, i: number) => (
                      <div key={i} className="smart-result-ac-item">☐ {ac}</div>
                    ))}
                  </div>
                )}
                {Array.isArray(result.acceptanceCriteria) && result.acceptanceCriteria.length > 0 && (
                  <div className="smart-result-ac" style={{ marginTop: '0.5rem' }}>
                    <strong>Criterios de Aceptación:</strong>
                    {result.acceptanceCriteria.map((ac: string, i: number) => (
                      <div key={i} className="smart-result-ac-item">☑ {ac}</div>
                    ))}
                  </div>
                )}
                <div className="smart-result-actions" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button className="btn btn-secondary" onClick={onClose} style={{ marginRight: 'auto' }}>Cancelar</button>
                  <button className="btn btn-secondary" onClick={handleGenerate} disabled={loading}>
                    {loading ? 'Generando...' : 'Re-generar 🔄'}
                  </button>
                  <button className="btn btn-primary" onClick={handleConfirm} disabled={loading}>
                    {loading ? 'Guardando...' : 'Confirmar y Crear ✨'}
                  </button>
                </div>
              </div>
            )}
          </div>
            </>
          )}

          {mode === 'manual' && (
            <form id="manual-ticket-form" onSubmit={handleManualCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 1.5rem', marginTop: '1rem' }}>
              <div>
                <label className="fs-sm fw-600 text-secondary mb-025" style={{ display: 'block' }}>TÍTULO *</label>
                <input type="text" required value={manualTitle} onChange={e => setManualTitle(e.target.value)} className="w-100 p-05 bg-s2 border-default rounded-sm text-primary" />
              </div>
              <div>
                <label className="fs-sm fw-600 text-secondary mb-025" style={{ display: 'block' }}>DESCRIPCIÓN</label>
                <textarea value={manualDesc} onChange={e => setManualDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-s2)', border: '1px solid var(--bd-default)', borderRadius: 'var(--r-sm)', color: 'var(--tx-primary)', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="fs-sm fw-600 text-secondary mb-025" style={{ display: 'block' }}>TIPO</label>
                  <select value={manualType} onChange={e => setManualType(e.target.value as TicketType)} className="w-100 p-05 bg-s2 border-default rounded-sm text-primary">
                    <option value="tarea">Tarea</option>
                    <option value="bug">Bug</option>
                    <option value="mejora">Mejora</option>
                    <option value="desarrollo">Desarrollo</option>
                  </select>
                </div>
                <div>
                  <label className="fs-sm fw-600 text-secondary mb-025" style={{ display: 'block' }}>PRIORIDAD</label>
                  <select value={manualPriority} onChange={e => setManualPriority(e.target.value as TicketPriority)} className="w-100 p-05 bg-s2 border-default rounded-sm text-primary">
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>
                <div>
                  <label className="fs-sm fw-600 text-secondary mb-025" style={{ display: 'block' }}>ASIGNADO A</label>
                  <select value={manualAssignee} onChange={e => setManualAssignee(e.target.value)} className="w-100 p-05 bg-s2 border-default rounded-sm text-primary">
                    <option value="">Sin Asignar</option>
                    {activeProject?.members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="fs-sm fw-600 text-secondary mb-025" style={{ display: 'block' }}>HORAS ESTIMADAS</label>
                  <input type="number" min="0" value={manualestimatedHours} onChange={e => setManualestimatedHours(e.target.value === '' ? '' : Number(e.target.value))} className="w-100 p-05 bg-s2 border-default rounded-sm text-primary" />
                </div>
                {activeProject?.sprints && activeProject.sprints.length > 0 && (
                  <div>
                    <label className="fs-sm fw-600 text-secondary mb-025" style={{ display: 'block' }}>SPRINT</label>
                    <select value={manualSprintId} onChange={e => setManualSprintId(e.target.value)} className="w-100 p-05 bg-s2 border-default rounded-sm text-primary">
                      <option value="">Sin Asignar</option>
                      {activeProject.sprints.map((s: { id: string, name: string, active?: boolean }) => (
                        <option key={s.id} value={s.id}>{s.name} {s.active ? '(Activo)' : ''}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        {mode === 'ai' && !result && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={handleGenerate} disabled={loading || !prompt.trim()}>
              {loading ? 'Generando...' : 'Generar Ticket ✨'}
            </button>
          </div>
        )}
        
        {mode === 'bulk' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 1.5rem', overflowY: 'auto', flex: 1, marginTop: '-0.5rem' }}>
            <div>
              <label className="fs-sm fw-600 text-secondary mb-025" style={{ display: 'block' }}>Nombre de tareas (uno por línea si son varios)</label>
              <textarea 
                className="w-100 p-05 bg-s2 border-default rounded-sm text-primary" 
                style={{ resize: 'vertical' }} rows={2}
                value={bulkReports} onChange={e => setBulkReports(e.target.value)}
                placeholder="Ej. Tarea A\nTarea B"
              />
            </div>
            <div>
              <label className="fs-sm fw-600 text-secondary mb-025" style={{ display: 'block' }}>DESCRIPCIÓN COMÚN (Opcional)</label>
              <textarea 
                value={bulkDesc} onChange={e => setBulkDesc(e.target.value)} 
                rows={2} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-s2)', border: '1px solid var(--bd-default)', borderRadius: 'var(--r-sm)', color: 'var(--tx-primary)', resize: 'vertical' }} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minHeight: '200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--tx-primary)' }}>Categorías de informes</h3>
                <button 
                  type="button" 
                  className="btn btn-sm btn-secondary" 
                  onClick={() => {
                    setBulkCategories([...bulkCategories, {
                      id: crypto.randomUUID(),
                      name: 'Categoría',
                      type: 'tarea',
                      priority: 'medium',
                      estimatedHours: 1,
                      assigneeId: '',
                      subtasks: '',
                      acceptanceCriteria: '',
                      isValidation: false
                    }]);
                  }}
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                >
                  ➕ Añadir Categoría
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg-s2)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead style={{ background: 'var(--bg-s3)', position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Categoría (Prefijo)</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Tipo de Tarea</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Prioridad</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Asignado A</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Horas Est.</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>Bloqueado?</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Acciones</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkCategories.map((cat, idx) => (
                      <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.5rem' }}>
                          <input type="text" className="form-input" style={{ padding: '0.25rem', fontSize: '0.8125rem', width: '100%', minWidth: '95px' }} value={cat.name} onChange={e => {
                            const newCats = [...bulkCategories];
                            newCats[idx].name = e.target.value;
                            setBulkCategories(newCats);
                          }} />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <select className="form-select" style={{ padding: '0.25rem', fontSize: '0.8125rem', width: '100%', minWidth: '95px' }} value={cat.type} onChange={e => {
                            const newCats = [...bulkCategories];
                            newCats[idx].type = e.target.value as TicketType;
                            setBulkCategories(newCats);
                          }}>
                            <option value="tarea">Tarea</option>
                            <option value="bug">Bug</option>
                            <option value="mejora">Mejora</option>
                            <option value="desarrollo">Desarrollo</option>
                          </select>
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <select className="form-select" style={{ padding: '0.25rem', fontSize: '0.8125rem', width: '100%', minWidth: '90px' }} value={cat.priority} onChange={e => {
                            const newCats = [...bulkCategories];
                            newCats[idx].priority = e.target.value as TicketPriority;
                            setBulkCategories(newCats);
                          }}>
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                            <option value="critical">Crítica</option>
                          </select>
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <select className="form-select" style={{ padding: '0.25rem', fontSize: '0.8125rem', width: '100%', minWidth: '100px' }} value={cat.assigneeId} onChange={e => {
                            const newCats = [...bulkCategories];
                            newCats[idx].assigneeId = e.target.value;
                            setBulkCategories(newCats);
                          }}>
                            <option value="">Sin asignar</option>
                            {activeProject?.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '0.5rem', width: '60px' }}>
                          <input type="number" className="form-input" style={{ padding: '0.25rem', fontSize: '0.8125rem', width: '100%' }} value={cat.estimatedHours} onChange={e => {
                            const newCats = [...bulkCategories];
                            newCats[idx].estimatedHours = e.target.value === '' ? '' : Number(e.target.value);
                            setBulkCategories(newCats);
                          }} />
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                          <input type="checkbox" title="Es fase de validación (Nace bloqueado por la fase previa)" checked={cat.isValidation} onChange={e => {
                            const newCats = [...bulkCategories];
                            newCats[idx].isValidation = e.target.checked;
                            setBulkCategories(newCats);
                          }} />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <button type="button" className="btn btn-sm btn-secondary" style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', width: '100%', justifyContent: 'flex-start' }} onClick={async () => {
                              const subtasks = await useDialogStore.getState().showPrompt('Subtareas (una por línea)', '', cat.subtasks, true);
                              if (subtasks !== null) {
                                const newCats = [...bulkCategories];
                                newCats[idx].subtasks = subtasks;
                                setBulkCategories(newCats);
                              }
                            }}>
                              {cat.subtasks ? '✏️ Editar subtareas' : '➕ Editar subtareas'}
                            </button>
                            <button type="button" className="btn btn-sm btn-secondary" style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', width: '100%', justifyContent: 'flex-start' }} onClick={async () => {
                              const ac = await useDialogStore.getState().showPrompt('Criterios de Aceptación (uno por línea)', '', cat.acceptanceCriteria, true);
                              if (ac !== null) {
                                const newCats = [...bulkCategories];
                                newCats[idx].acceptanceCriteria = ac;
                                setBulkCategories(newCats);
                              }
                            }}>
                              {cat.acceptanceCriteria ? '✏️ Editar criterios de aceptación' : '➕ Editar criterios de aceptación'}
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                          <button type="button" className="btn-icon" style={{ color: 'var(--error)', padding: '0.2rem' }} onClick={() => setBulkCategories(bulkCategories.filter(c => c.id !== cat.id))} title="Eliminar Categoría">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bulkCategories.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--tx-muted)' }}>
                    No hay categorías definidas.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {mode === 'bulk' && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-primary" disabled={isGeneratingBulk || bulkCategories.length === 0} onClick={async () => {
              handleBulkCreateTickets(async (reportsCount, ticketsCount) => {
                return await useDialogStore.getState().showConfirm(
                  'Generación Masiva', 
                  `Se van a generar ${ticketsCount} tickets (${bulkCategories.length} categorías × ${reportsCount} líneas de tareas). ¿Proceder?`
                );
              });
            }}>
              {isGeneratingBulk ? 'Generando...' : '⚡ Generar Tickets Masivos'}
            </button>
          </div>
        )}

{mode === 'manual' && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" form="manual-ticket-form" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Ticket 📝'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
