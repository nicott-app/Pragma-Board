import { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useUIStore } from '../store/useUIStore';
import { useToastStore } from '../store/useToastStore';
import { FirebaseTicketRepository } from '../../infrastructure/firebase/FirebaseTicketRepository';

const ticketRepo = new FirebaseTicketRepository();

export const usePowerBIEstimator = () => {
  const activeProject = useProjectStore(s => s.activeProject);
  const setEstimatorOpen = useUIStore(s => s.setEstimatorOpen);
  const addToast = useToastStore(s => s.addToast);

  
  
  // Quantities
  const [qtyPages, setQtyPages] = useState(3);
  const [qtyStdVisuals, setQtyStdVisuals] = useState(10);
  const [qtyCpxVisuals, setQtyCpxVisuals] = useState(4);
  const [qtyButtons, setQtyButtons] = useState(5);
  const [qtyKpis, setQtyKpis] = useState(6);
  const [qtyTables, setQtyTables] = useState(2);
  const [qtySlicers, setQtySlicers] = useState(4);
  const [qtyCustoms, setQtyCustoms] = useState(1);
  const [qtySources, setQtySources] = useState(2);
  const [qtyDax, setQtyDax] = useState(10);

  // Factors
  const [fAnalysis, setFAnalysis] = useState(1.0);
  const [fModeling, setFModeling] = useState(1.0);
  const [fEtl, setFEtl] = useState(1.0);
  const [fDax, setFDax] = useState(1.0);
  const [fVisuals, setFVisuals] = useState(1.0);
  const [fDesign, setFDesign] = useState(1.0);
  const [fInteractivity, setFInteractivity] = useState(1.0);
  const [fQa, setFQa] = useState(1.0);
  const [fRls, setFRls] = useState(1.0);
  const [fValidation, setFValidation] = useState(1.0);
  
  // Seniority
  const [seniority, setSeniority] = useState(1.0);

  

  // Calcs
  const modelSubtotal = Math.round(8 * fAnalysis) + Math.round(8 * fModeling);
  const etlHours = Math.round((qtySources * 4) * fEtl);
  const daxHours = Math.round((qtyDax * 2) * fDax);
  const visualsBase = (qtyPages * 4) + (qtyStdVisuals * 1.5) + (qtyCpxVisuals * 4) + (qtyButtons * 0.75) + (qtyKpis * 1.0) + (qtyTables * 3.0) + (qtySlicers * 0.75) + (qtyCustoms * 5);
  const uiHours = Math.round(visualsBase * fVisuals * fDesign * fInteractivity);
  const devSubtotal = modelSubtotal + etlHours + daxHours + uiHours;
  const rlsBase = fRls !== 0.8 ? 8 : 0; 
  const rlsHours = Math.round(rlsBase * fRls);
  const qaHours = Math.round(((devSubtotal * 0.15) * fQa * fValidation) + rlsHours);
  const totalHours = Math.round((devSubtotal + qaHours + 12) * seniority);

  const handleExportExcel = () => {
    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
      <meta charset="utf-8">
      <style>
        table { border-collapse: collapse; font-family: Arial, sans-serif; }
        th { background-color: #5B54E8; color: #FFFFFF; font-weight: bold; text-align: left; }
        td, th { border: 1px solid #D1D5DB; padding: 8px 12px; font-size: 10pt; }
        .section-header { background-color: #EDF0FA; font-weight: bold; color: #1A1A2E; }
        .result-row { background-color: #F6F8FF; font-weight: bold; }
        .total-row { background-color: #5B54E8; color: #FFFFFF; font-weight: bold; font-size: 12pt; }
      </style>
      </head>
      <body>
      <table>
        <tr><th colspan="3">Estimación de Esfuerzo PowerBI Avanzado</th></tr>
        <tr class="section-header"><td colspan="3">1. Cantidades (Elementos)</td></tr>
        <tr><td>Páginas de informe</td><td>${qtyPages}</td><td></td></tr>
        <tr><td>Visuales Estándar</td><td>${qtyStdVisuals}</td><td></td></tr>
        <tr><td>Visuales Complejos</td><td>${qtyCpxVisuals}</td><td></td></tr>
        <tr><td>Botones de Navegación</td><td>${qtyButtons}</td><td></td></tr>
        <tr><td>Tarjetas KPI</td><td>${qtyKpis}</td><td></td></tr>
        <tr><td>Tablas / Matrices</td><td>${qtyTables}</td><td></td></tr>
        <tr><td>Slicers (Filtros)</td><td>${qtySlicers}</td><td></td></tr>
        <tr><td>Custom Visuals</td><td>${qtyCustoms}</td><td></td></tr>
        <tr><td>Orígenes de datos</td><td>${qtySources}</td><td></td></tr>
        <tr><td>Medidas DAX a crear</td><td>${qtyDax}</td><td></td></tr>
        <tr class="section-header"><td colspan="3">3. Desglose de Horas</td></tr>
        <tr><td>Análisis y Modelado</td><td></td><td>${modelSubtotal}h</td></tr>
        <tr><td>ETL y Orígenes</td><td></td><td>${etlHours}h</td></tr>
        <tr><td>Desarrollo DAX</td><td></td><td>${daxHours}h</td></tr>
        <tr><td>Maquetación / UI</td><td></td><td>${uiHours}h</td></tr>
        <tr><td>QA y Despliegue (RLS)</td><td></td><td>${qaHours}h</td></tr>
        <tr><td>Documentación fija</td><td></td><td>+12h</td></tr>
        <tr class="result-row"><td>Factor Seniority</td><td></td><td>x${seniority}</td></tr>
        <tr class="total-row"><td>ESTIMACIÓN TOTAL</td><td></td><td>${totalHours} horas</td></tr>
      </table>
      </body>
      </html>
    `;
    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Estimacion_PowerBI_${new Date().toISOString().slice(0,10)}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateTicket = async (title: string) => {
    if (!activeProject) {
      addToast('error', 'No hay proyecto activo', 'Error');
      return;
    }
    if (!title || !title.trim()) return;

    try {
      await ticketRepo.createTicket(activeProject.id, {
        title: title.trim(),
        description: `Estimación de esfuerzo detallada:\n- Análisis y Modelado: ${modelSubtotal}h\n- ETL y Orígenes: ${etlHours}h\n- Desarrollo DAX: ${daxHours}h\n- Maquetación / UI: ${uiHours}h\n- QA y Despliegue: ${qaHours}h\n- Documentación: 12h\n- Factor Seniority: x${seniority}`,
        type: 'desarrollo',
        priority: 'medium',
        estimatedHours: totalHours,
        status: 'backlog',
        assignees: [],
        tags: ['powerbi-estimation'],
        acceptanceCriteria: [],
        subtasks: [],
        comments: [],
        history: []
      });
      addToast('success', `Ticket creado con éxito en Backlog con ${totalHours}h estimadas`, 'Éxito');
      setEstimatorOpen(false);
    } catch (e: unknown) {
      addToast('error', "Error al crear el ticket: " + (e as Error).message, 'Error');
    }
  };

  return {
    
    qtyPages, setQtyPages,
    qtyStdVisuals, setQtyStdVisuals,
    qtyCpxVisuals, setQtyCpxVisuals,
    qtyButtons, setQtyButtons,
    qtyKpis, setQtyKpis,
    qtyTables, setQtyTables,
    qtySlicers, setQtySlicers,
    qtyCustoms, setQtyCustoms,
    qtySources, setQtySources,
    qtyDax, setQtyDax,
    fAnalysis, setFAnalysis,
    fModeling, setFModeling,
    fEtl, setFEtl,
    fDax, setFDax,
    fVisuals, setFVisuals,
    fDesign, setFDesign,
    fInteractivity, setFInteractivity,
    fQa, setFQa,
    fRls, setFRls,
    fValidation, setFValidation,
    seniority, setSeniority,
    modelSubtotal, etlHours, daxHours, uiHours, qaHours, totalHours,
    handleExportExcel, handleCreateTicket
  };
};
