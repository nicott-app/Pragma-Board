import React, { useRef, useState } from 'react';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { useAuthStore } from '../../../application/store/useAuthStore';
import { useUIStore } from '../../../application/store/useUIStore';
import { useDataStore } from '../../../application/store/useDataStore';
import { useDialogStore } from '../../../application/store/useDialogStore';
import { FirebaseTicketRepository } from '../../../infrastructure/firebase/FirebaseTicketRepository';
import { FirebaseProjectRepository } from '../../../infrastructure/firebase/FirebaseProjectRepository';
import { Ticket, TicketType } from '../../../domain/models/Ticket';
import { Project } from '../../../domain/models/Project';

const ticketRepo = new FirebaseTicketRepository();
const projectRepo = new FirebaseProjectRepository();

export const ImportExportModal: React.FC = () => {
  const activeProject = useProjectStore(s => s.activeProject);
  const setActiveProject = useProjectStore(s => s.setActiveProject);
  const currentUser = useAuthStore(s => s.currentUser);
  const setImportExportOpen = useUIStore(s => s.setImportExportOpen);
  const tickets = useDataStore(s => s.tickets);
  const [isImporting, setIsImporting] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  if (!activeProject || !currentUser) return null;

  const handleExportJSON = () => {
    const projectData = {
      exportedAt: new Date().toISOString(),
      project: {
        name: activeProject.name,
        columns: activeProject.columns,
        members: activeProject.members,
        sprints: activeProject.sprints || [],
        currentSprintId: activeProject.currentSprintId || null,
        roles: activeProject.roles || {},
        allowedEmails: activeProject.allowedEmails || []
      },
      tickets: tickets.map(t => {
        // Strip system id and timestamps to allow clean import
        const { id, createdAt, updatedAt, ...rest } = t;
        return rest;
      }),
    };

    const filename = `${activeProject.name.toLowerCase().replace(/\s+/g, '-')}-backup-${Date.now()}.json`;
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ok = await useDialogStore.getState().showConfirm('Restaurar Proyecto', "¿Deseas restaurar este proyecto a partir del backup JSON? Esto eliminará todos los tickets actuales del tablero y sobrescribirá la configuración.");
    if (!ok) {
      if (jsonInputRef.current) jsonInputRef.current.value = '';
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data.project || !data.project.name || !Array.isArray(data.tickets)) {
          throw new Error('El archivo no tiene el formato de backup de Smartboard válido.');
        }

        // 1. Restore project metadata
        const updatedProject: Project = {
          ...activeProject,
          name: data.project.name,
          columns: data.project.columns || activeProject.columns,
          members: data.project.members || activeProject.members,
          sprints: data.project.sprints || [],
          currentSprintId: data.project.currentSprintId || null,
          roles: data.project.roles || {},
          allowedEmails: data.project.allowedEmails || []
        };

        await projectRepo.updateProject(activeProject.id, updatedProject);
        setActiveProject(updatedProject);

        // 2. Delete all existing tickets
        for (const t of tickets) {
          await ticketRepo.deleteTicket(activeProject.id, t.id);
        }

        // 3. Upload new tickets
        for (const t of data.tickets) {
          await ticketRepo.createTicket(activeProject.id, t);
        }

        await useDialogStore.getState().showAlert('Éxito', `✓ Proyecto restaurado y ${data.tickets.length} tickets importados con éxito.`);
        setImportExportOpen(false);
      } catch (err: unknown) {
        await useDialogStore.getState().showAlert('Error', `Error al restaurar JSON: ${(err as Error).message}`);
      } finally {
        setIsImporting(false);
        if (jsonInputRef.current) jsonInputRef.current.value = '';
      }
    };

    reader.onerror = async () => {
      await useDialogStore.getState().showAlert('Error', 'Error al leer el archivo JSON');
      setIsImporting(false);
    };

    reader.readAsText(file, 'utf-8');
  };

  const parseCSV = (text: string): string[][] => {
    const result: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];
      
      if (char === '"') {
        if (inQuotes && next === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(cell);
        cell = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        row.push(cell);
        if (row.length > 0 && row.some(x => x.trim())) {
          result.push(row);
        }
        row = [];
        cell = '';
        if (char === '\r' && next === '\n') i++;
      } else {
        cell += char;
      }
    }
    if (cell || row.length > 0) {
      row.push(cell);
      result.push(row);
    }
    return result;
  };

  const mapJiraRowToTicket = (row: string[], headers: string[]): Partial<Ticket> => {
    const getVal = (possibleHeaders: string[]) => {
      for (const ph of possibleHeaders) {
        const idx = headers.findIndex(h => h.toLowerCase() === ph.toLowerCase() || h.toLowerCase().startsWith(ph.toLowerCase()));
        if (idx >= 0) return row[idx] || '';
      }
      return '';
    };

    const title = getVal(['summary', 'issue summary', 'titulo', 'título', 'asunto']);
    const description = getVal(['description', 'descripción', 'descripcion']);
    const rawType = getVal(['issue type', 'tipo de incidencia', 'tipo', 'type']);
    const rawPriority = getVal(['priority', 'prioridad']);
    const rawSP = getVal(['story points', 'custom field (story points)', 'estimación', 'estimacion', 'original estimate', 'esfuerzo']);

    // Legacy Sprinto type mapping
    let type: TicketType = 'tarea';
    const typeLower = rawType.toLowerCase();
    if (typeLower.includes('bug') || typeLower.includes('error') || typeLower.includes('defecto')) type = 'bug';
    else if (typeLower.includes('story') || typeLower.includes('histor') || typeLower.includes('desarrollo') || typeLower.includes('historia')) type = 'desarrollo';
    else if (typeLower.includes('epic') || typeLower.includes('analysis') || typeLower.includes('analisis') || typeLower.includes('análisis')) type = 'analisis';
    else if (typeLower.includes('improvement') || typeLower.includes('mejora')) type = 'mejora';
    else if (typeLower.includes('incident') || typeLower.includes('incidencia') || typeLower.includes('soporte')) type = 'incidencia';
    else if (typeLower.includes('deliverable') || typeLower.includes('entregable') || typeLower.includes('document')) type = 'entregable';

    // Legacy Sprinto priority mapping
    let priority: Ticket['priority'] = 'medium';
    const prioLower = rawPriority.toLowerCase();
    if (prioLower.includes('critical') || prioLower.includes('highest') || prioLower.includes('crítica') || prioLower.includes('critica') || prioLower.includes('bloqueante')) priority = 'critical';
    else if (prioLower.includes('high') || prioLower.includes('alta') || prioLower.includes('alto')) priority = 'high';
    else if (prioLower.includes('low') || prioLower.includes('baja') || prioLower.includes('bajo')) priority = 'low';

    let estimatedHours = parseFloat(rawSP);
    
    return {
      title: title.trim() || 'Sin título (Jira)',
      description: description.trim(),
      type,
      priority,
      estimatedHours: isNaN(estimatedHours) ? undefined : estimatedHours,
      status: 'backlog',
      assignees: [],
      tags: ['jira-import'],
      comments: [],
      history: [{
        id: crypto.randomUUID(),
        action: 'Creado por importación de Jira',
        actorId: currentUser.uid,
        actorName: 'Importador de Jira',
        timestamp: new Date().toISOString()
      }]
    };
  };

  const handleCSVChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const text = reader.result as string;
        const rows = parseCSV(text);
        if (rows.length < 2) throw new Error('El archivo CSV está vacío o no contiene cabeceras.');

        const headers = rows[0];
        const ticketsToImport: Partial<Ticket>[] = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length === 0 || row.every(x => !x.trim())) continue;
          ticketsToImport.push(mapJiraRowToTicket(row, headers));
        }

        if (ticketsToImport.length === 0) throw new Error('No se encontraron registros de incidencias válidos en el CSV.');

        // Add tickets to Firestore
        for (const t of ticketsToImport) {
          await ticketRepo.createTicket(activeProject.id, t as Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'idNumber'>);
        }

        await useDialogStore.getState().showAlert('Éxito', `✓ Se importaron ${ticketsToImport.length} tickets de Jira con éxito.`);
        setImportExportOpen(false);
      } catch (err: unknown) {
        await useDialogStore.getState().showAlert('Error', `Error al importar Jira CSV: ${(err as Error).message}`);
      } finally {
        setIsImporting(false);
        if (csvInputRef.current) csvInputRef.current.value = '';
      }
    };

    reader.onerror = async () => {
      await useDialogStore.getState().showAlert('Error', 'Error al leer el archivo CSV');
      setIsImporting(false);
    };

    reader.readAsText(file, 'utf-8');
  };

  return (
    <div className="overlay active" style={{ zIndex: 100 }}>
      <div className="modal" style={{ width: 'min(500px, 96vw)', padding: '0', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--tx-primary)', margin: 0 }}>Importar / Exportar</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', margin: 0 }}>Migra datos desde Jira o crea copias de seguridad</p>
          </div>
          <button className="modal-close" onClick={() => setImportExportOpen(false)} style={{ position: 'relative' }}>✕</button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Export JSON */}
          <div style={{ background: 'var(--bg-s2)', padding: '1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--bd-subtle)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--tx-primary)', margin: '0 0 0.5rem 0' }}>Exportar Backup JSON</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', margin: '0 0 1rem 0' }}>Descarga la configuración del proyecto y todos los tickets actuales en un archivo JSON.</p>
            <button className="btn btn-secondary" onClick={handleExportJSON}>
              ⬇️ Descargar Backup JSON
            </button>
          </div>

          {/* Import JSON */}
          <div style={{ background: 'var(--bg-s2)', padding: '1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--bd-subtle)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--tx-primary)', margin: '0 0 0.5rem 0' }}>Importar Backup JSON</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', margin: '0 0 1rem 0' }}>Restaura un backup de Smartboard JSON completo. Se sobrescribirán los datos actuales.</p>
            
            <input 
              type="file" 
              accept=".json" 
              ref={jsonInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImportJSON} 
            />
            
            <button 
              className="btn btn-secondary" 
              onClick={() => jsonInputRef.current?.click()}
              disabled={isImporting}
            >
              {isImporting ? 'Procesando...' : '⬆️ Subir Backup JSON'}
            </button>
          </div>

          {/* Import Jira */}
          <div style={{ background: 'var(--bg-s2)', padding: '1rem', borderRadius: 'var(--r-md)', border: '1px solid var(--bd-subtle)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--tx-primary)', margin: '0 0 0.5rem 0' }}>Importar CSV de Jira</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', margin: '0 0 1rem 0' }}>Sube un archivo CSV exportado desde Jira. Los tickets se crearán en la columna "Backlog".</p>
            
            <input 
              type="file" 
              accept=".csv" 
              ref={csvInputRef} 
              style={{ display: 'none' }} 
              onChange={handleCSVChange} 
            />
            
            <button 
              className="btn btn-primary" 
              onClick={() => csvInputRef.current?.click()}
              disabled={isImporting}
            >
              {isImporting ? 'Importando...' : '⬆️ Subir CSV de Jira'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
