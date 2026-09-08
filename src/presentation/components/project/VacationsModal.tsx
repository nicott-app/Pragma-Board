import React, { useState, useMemo } from 'react';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { useAuthStore } from '../../../application/store/useAuthStore';
import { useDataStore } from '../../../application/store/useDataStore';
import { useUIStore } from '../../../application/store/useUIStore';
import { useDialogStore } from '../../../application/store/useDialogStore';
import { FirebaseVacationRepository } from '../../../infrastructure/firebase/FirebaseVacationRepository';
import { FirebaseProjectRepository } from '../../../infrastructure/firebase/FirebaseProjectRepository';
import { Vacation } from '../../../domain/models/Vacation';

const vacationRepo = new FirebaseVacationRepository();
const projectRepo = new FirebaseProjectRepository();

export const VacationsModal: React.FC = () => {
  const activeProject = useProjectStore(s => s.activeProject);
  const currentUser = useAuthStore(s => s.currentUser);
  const vacations = useDataStore(s => s.vacations);
  const setVacationsOpen = useUIStore(s => s.setVacationsOpen);
  const [plannerDate, setPlannerDate] = useState(new Date());

  const [formMemberId, setFormMemberId] = useState(currentUser?.uid || '');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formValidated, setFormValidated] = useState(false);

  const [editingDays, setEditingDays] = useState(false);
  const [totalDaysInput, setTotalDaysInput] = useState(activeProject?.vacationDaysPerYear ?? 22);

  const isAdmin = currentUser ? ['admin', 'super-admin'].includes(currentUser.role) : false;

  const handleSaveDays = async () => {
    if (!activeProject) return;
    try {
      await projectRepo.updateProject(activeProject.id, { vacationDaysPerYear: totalDaysInput });
      setEditingDays(false);
    } catch (e) {
      await useDialogStore.getState().showAlert('Error', 'Error al guardar los días');
    }
  };

  // Calculate balances
  const balances = useMemo(() => {
    if (!activeProject) return {};
    const defaultTotal = activeProject.vacationDaysPerYear ?? 22;
    const b: Record<string, { total: number; used: number; validatedUsed: number; name: string; color: string }> = {};
    activeProject.members.forEach(m => {
      b[m.id] = { total: defaultTotal, used: 0, validatedUsed: 0, name: m.name, color: m.color || '#7C6FFF' };
    });

    const workingDays = (start: string, end: string) => {
      let count = 0;
      const cur = new Date(start);
      cur.setHours(0, 0, 0, 0);
      const endD = new Date(end);
      endD.setHours(0, 0, 0, 0);
      while (cur <= endD) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) count++;
        cur.setDate(cur.getDate() + 1);
      }
      return count;
    };

    vacations.forEach(v => {
      if (b[v.memberId]) {
        const days = workingDays(v.startDate, v.endDate);
        b[v.memberId].used += days;
        if (v.validated) {
          b[v.memberId].validatedUsed += days;
        }
      }
    });
    return b;
  }, [vacations, activeProject?.members, activeProject?.vacationDaysPerYear]);

  const handleSubmit = async () => {
    if (!formStart || !formEnd) {
      await useDialogStore.getState().showAlert('Aviso', 'Fechas requeridas');
      return;
    }
    if (new Date(formStart) > new Date(formEnd)) {
      await useDialogStore.getState().showAlert('Aviso', 'Fecha inicio posterior a fecha fin');
      return;
    }
    
    try {
      const newVacation: Vacation = {
        id: `vac-${Date.now()}`,
        memberId: formMemberId,
        startDate: formStart,
        endDate: formEnd,
        notes: formNotes || 'Vacaciones',
        type: 'vacation',
        validated: isAdmin ? formValidated : false,
        createdAt: new Date().toISOString(),
      };
      await vacationRepo.addVacation(activeProject!.id, newVacation);
      setFormStart('');
      setFormEnd('');
      setFormNotes('');
      setFormValidated(false);
      await useDialogStore.getState().showAlert('Éxito', 'Vacaciones registradas');
    } catch (e) {
      await useDialogStore.getState().showAlert('Error', 'Error al registrar vacaciones');
    }
  };

  const handleToggleValidate = async (v: Vacation) => {
    try {
      await vacationRepo.updateVacation(activeProject!.id, v.id, { validated: !v.validated });
    } catch (e) {
      await useDialogStore.getState().showAlert('Error', 'Error validando');
    }
  };

  const handleDelete = async (v: Vacation) => {
    if (!(await useDialogStore.getState().showConfirm('Confirmar', '¿Cancelar este periodo de vacaciones?'))) return;
    try {
      await vacationRepo.deleteVacation(activeProject!.id, v.id);
    } catch (e: any) {
      await useDialogStore.getState().showAlert('Error', `Error cancelando: ${e.message || String(e)}`);
    }
  };

  const currentMonth = plannerDate.getMonth();
  const currentYear = plannerDate.getFullYear();
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: numDays }, (_, i) => i + 1);

  if (!activeProject || !currentUser) return null;

  return (
    <div className="overlay active" style={{ zIndex: 100 }}>
      <div className="modal" style={{ width: 'min(900px, 96vw)', height: '95vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🌴</span>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--tx-primary)', margin: 0 }}>Registro de Vacaciones y Ausencias</h2>
              <div className="d-flex align-center gap-05">
                <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', margin: 0 }}>
                  Días disponibles por miembro: 
                </p>
                {isAdmin && editingDays ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <input type="number" min="0" max="365" className="form-input" style={{ width: '60px', padding: '2px 4px', fontSize: '0.875rem', height: '24px', minHeight: '24px' }} value={totalDaysInput} onChange={e => setTotalDaysInput(parseInt(e.target.value) || 0)} />
                    <button className="btn btn-primary" style={{ padding: '2px 6px', fontSize: '0.75rem', height: '24px' }} onClick={handleSaveDays}>Guardar</button>
                    <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.75rem', height: '24px' }} onClick={() => { setTotalDaysInput(activeProject.vacationDaysPerYear || 22); setEditingDays(false); }}>✕</button>
                  </div>
                ) : (
                  <div className="d-flex align-center gap-05">
                    <strong style={{ fontSize: '0.875rem', color: 'var(--tx-primary)' }}>{activeProject.vacationDaysPerYear || 22} días</strong>
                    {isAdmin && (
                      <button className="btn btn-link" style={{ padding: 0, fontSize: '0.75rem' }} onClick={() => setEditingDays(true)}>Editar</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={() => setVacationsOpen(false)} style={{ position: 'relative' }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', flexShrink: 0 }}>
            {activeProject.members.map(m => {
              const bal = balances[m.id];
              const rem = bal.total - bal.used;
              return (
                <div key={m.id} style={{ background: 'var(--bg-s2)', border: '1px solid var(--bd-subtle)', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: bal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>{m.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--tx-secondary)' }}>
                      Días: <strong>{bal.used}</strong> (Val: <strong>{bal.validatedUsed}</strong>) / {bal.total} (Disp: <strong>{rem}</strong>)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form */}
          <div style={{ background: 'var(--bg-s2)', borderRadius: '8px', border: '1px solid var(--bd-subtle)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Registrar Ausencia</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 1, minWidth: '220px', marginBottom: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.25rem' }}>Miembro</label>
                {isAdmin ? (
                  <select className="form-select" value={formMemberId} onChange={e => setFormMemberId(e.target.value)}>
                    {activeProject.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                ) : (
                  <div style={{ padding: '8px 12px', background: 'var(--bg-s1)', border: '1px solid var(--bd-subtle)', borderRadius: '4px', fontSize: '0.8125rem' }}>
                    {currentUser.name}
                  </div>
                )}
              </div>
              
              <div className="form-group" style={{ flex: 1, minWidth: '180px', marginBottom: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.25rem' }}>Inicio</label>
                <input type="date" className="form-input" value={formStart} onChange={e => setFormStart(e.target.value)} />
              </div>
              
              <div className="form-group" style={{ flex: 1, minWidth: '180px', marginBottom: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.25rem' }}>Fin</label>
                <input type="date" className="form-input" value={formEnd} onChange={e => setFormEnd(e.target.value)} />
              </div>
              
              <div className="form-group" style={{ flex: 2, minWidth: '200px', marginBottom: 0 }}>
                <label className="form-label" style={{ marginBottom: '0.25rem' }}>Notas</label>
                <input type="text" className="form-input" value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Ej. Vacaciones verano" />
              </div>

              {isAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.5rem' }}>
                  <input type="checkbox" id="vac-validated" checked={formValidated} onChange={e => setFormValidated(e.target.checked)} />
                  <label htmlFor="vac-validated" style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>✓ Validada</label>
                </div>
              )}

              <button className="btn btn-primary" onClick={handleSubmit} style={{ height: '38px' }}>Registrar</button>
            </div>
          </div>

          {/* Planner */}
          <div style={{ background: 'var(--bg-s2)', borderRadius: '8px', border: '1px solid var(--bd-subtle)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600' }}>{monthNames[currentMonth]} {currentYear}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setPlannerDate(new Date(currentYear, currentMonth - 1, 1))}>◀ Mes Anterior</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setPlannerDate(new Date(currentYear, currentMonth + 1, 1))}>Mes Siguiente ▶</button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.5rem', textAlign: 'left', minWidth: '100px', background: 'var(--bg-s3)', position: 'sticky', left: 0, zIndex: 2 }}>Equipo</th>
                    {daysArray.map(d => {
                      const date = new Date(currentYear, currentMonth, d);
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      const isToday = new Date().toDateString() === date.toDateString();
                      return (
                        <th key={d} style={{ padding: '0.5rem', textAlign: 'center', background: isWeekend ? 'var(--bg-s1)' : 'var(--bg-s3)', color: isToday ? 'var(--ac)' : 'inherit', borderLeft: '1px solid var(--bd-subtle)' }}>
                          {d}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {activeProject.members.map(m => (
                    <tr key={m.id} style={{ borderTop: '1px solid var(--bd-subtle)' }}>
                      <td style={{ padding: '0.5rem', position: 'sticky', left: 0, background: 'var(--bg-s2)', zIndex: 1, borderRight: '1px solid var(--bd-subtle)' }}>{m.name}</td>
                      {daysArray.map(d => {
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const v = vacations.find(vac => vac.memberId === m.id && vac.startDate <= dateStr && vac.endDate >= dateStr);
                        const isWeekend = new Date(currentYear, currentMonth, d).getDay() === 0 || new Date(currentYear, currentMonth, d).getDay() === 6;
                        
                        let bg = isWeekend ? 'var(--bg-s1)' : 'transparent';
                        if (v) {
                          bg = v.validated ? 'rgba(5,150,105,0.2)' : 'rgba(234,179,8,0.2)';
                        }
                        
                        return (
                          <td key={d} title={v ? `${v.notes} (${v.validated ? 'Validada' : 'Pendiente'})` : ''} style={{ padding: '0', height: '30px', background: bg, borderLeft: '1px solid var(--bd-subtle)' }}></td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Periodos Registrados */}
          {vacations.length > 0 && (
            <div style={{ background: 'var(--bg-s2)', borderRadius: '8px', border: '1px solid var(--bd-subtle)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--bd-subtle)' }}>
                <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>Desglose de Periodos Registrados</h4>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-s3)' }}>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: 'var(--tx-secondary)' }}>Miembro</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: 'var(--tx-secondary)' }}>Periodo</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: 'var(--tx-secondary)' }}>Estado</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600', color: 'var(--tx-secondary)' }}>Notas</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600', color: 'var(--tx-secondary)' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vacations.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map(v => {
                      const m = activeProject.members.find(x => x.id === v.memberId);
                      const canCancel = isAdmin || v.memberId === currentUser.uid;
                      
                      // Calculate days
                      let days = 0;
                      const cur = new Date(v.startDate);
                      cur.setHours(0, 0, 0, 0);
                      const endD = new Date(v.endDate);
                      endD.setHours(0, 0, 0, 0);
                      while (cur <= endD) {
                        const day = cur.getDay();
                        if (day !== 0 && day !== 6) days++;
                        cur.setDate(cur.getDate() + 1);
                      }

                      return (
                        <tr key={v.id} style={{ borderBottom: '1px solid var(--bd-subtle)', background: 'var(--bg-s1)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-s2)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-s1)'}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{m?.name || 'Desconocido'}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div className="d-flex flex-col">
                              <span>{new Date(v.startDate).toLocaleDateString()} - {new Date(v.endDate).toLocaleDateString()}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--tx-muted)' }}>{days} días laborables</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            {v.validated 
                              ? <span style={{ background: 'rgba(5, 150, 105, 0.1)', color: 'var(--success)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '600', fontSize: '0.75rem' }}>✓ Validada</span> 
                              : <span style={{ background: 'rgba(234, 179, 8, 0.1)', color: 'var(--warning)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '600', fontSize: '0.75rem' }}>⏳ Pendiente</span>
                            }
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--tx-secondary)', fontStyle: 'italic', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={v.notes}>
                            {v.notes || '-'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              {isAdmin && (
                                <button className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleToggleValidate(v)}>
                                  {v.validated ? 'Marcar Pendiente' : 'Validar'}
                                </button>
                              )}
                              {canCancel && (
                                <button className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'transparent', color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDelete(v)}>
                                  Cancelar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
