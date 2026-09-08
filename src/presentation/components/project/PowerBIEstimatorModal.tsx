import React from 'react';
import { useUIStore } from '../../../application/store/useUIStore';
import { useDialogStore } from '../../../application/store/useDialogStore';
import { usePowerBIEstimator } from '../../../application/hooks/usePowerBIEstimator';

export const PowerBIEstimatorModal: React.FC = () => {
  const setEstimatorOpen = useUIStore((s) => s.setEstimatorOpen);

  const {
    qtyPages,
    setQtyPages,
    qtyStdVisuals,
    setQtyStdVisuals,
    qtyCpxVisuals,
    setQtyCpxVisuals,
    qtyButtons,
    setQtyButtons,
    qtyKpis,
    setQtyKpis,
    qtyTables,
    setQtyTables,
    qtySlicers,
    setQtySlicers,
    qtyCustoms,
    setQtyCustoms,
    qtySources,
    setQtySources,
    qtyDax,
    setQtyDax,
    fAnalysis,
    setFAnalysis,
    fModeling,
    setFModeling,
    fEtl,
    setFEtl,
    fDax,
    setFDax,
    fVisuals,
    setFVisuals,
    fDesign,
    setFDesign,
    fInteractivity,
    setFInteractivity,
    fQa,
    setFQa,
    fRls,
    setFRls,
    fValidation,
    setFValidation,
    seniority,
    setSeniority,
    modelSubtotal,
    etlHours,
    daxHours,
    uiHours,
    qaHours,
    totalHours,
    handleExportExcel,
    handleCreateTicket,
  } = usePowerBIEstimator();

  const onCreateSingleTicket = async () => {
    const title = await useDialogStore
      .getState()
      .showPrompt(
        'Título del ticket',
        'Introduce el título del ticket:',
        'Desarrollo de informe PowerBI'
      );
    if (title) {
      handleCreateTicket(title);
    }
  };

  return (
    <div className="overlay active" style={{ zIndex: 100 }}>
      <div
        className="modal"
        style={{
          width: 'min(1100px, 96vw)',
          height: '85vh',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--bd-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--tx-primary)', margin: 0 }}>
                Estimador de Esfuerzo PowerBI Avanzado
              </h2>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}
              >
                <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', margin: 0 }}>
                  Calcula la estimación basada en alcance y complejidad
                </p>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEstimatorOpen(false);
                    useUIStore.getState().setPbipDocOpen(true);
                  }}
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                >
                  📄 Documentar desde .pbip
                </button>
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={() => setEstimatorOpen(false)}>
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              flex: 1,
              padding: '1.5rem',
              overflowY: 'auto',
              borderRight: '1px solid var(--bd-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--ac)' }}>
              1. Cantidades (Elementos)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Páginas de informe</label>
                <input
                  type="number"
                  className="form-input"
                  value={qtyPages}
                  onChange={(e) => setQtyPages(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Visuales Estándar</label>
                <input
                  type="number"
                  className="form-input"
                  value={qtyStdVisuals}
                  onChange={(e) => setQtyStdVisuals(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Visuales Complejos</label>
                <input
                  type="number"
                  className="form-input"
                  value={qtyCpxVisuals}
                  onChange={(e) => setQtyCpxVisuals(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Botones de Navegación</label>
                <input
                  type="number"
                  className="form-input"
                  value={qtyButtons}
                  onChange={(e) => setQtyButtons(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tarjetas KPI</label>
                <input
                  type="number"
                  className="form-input"
                  value={qtyKpis}
                  onChange={(e) => setQtyKpis(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tablas / Matrices</label>
                <input
                  type="number"
                  className="form-input"
                  value={qtyTables}
                  onChange={(e) => setQtyTables(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Slicers (Filtros)</label>
                <input
                  type="number"
                  className="form-input"
                  value={qtySlicers}
                  onChange={(e) => setQtySlicers(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Custom Visuals</label>
                <input
                  type="number"
                  className="form-input"
                  value={qtyCustoms}
                  onChange={(e) => setQtyCustoms(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Orígenes de datos</label>
                <input
                  type="number"
                  className="form-input"
                  value={qtySources}
                  onChange={(e) => setQtySources(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Medidas DAX a crear</label>
                <input
                  type="number"
                  className="form-input"
                  value={qtyDax}
                  onChange={(e) => setQtyDax(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: '1.5rem',
              overflowY: 'auto',
              borderRight: '1px solid var(--bd-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--ac)' }}>
              2. Factores de Complejidad
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Análisis previo</label>
                <select
                  className="form-select"
                  value={fAnalysis}
                  onChange={(e) => setFAnalysis(Number(e.target.value))}
                >
                  <option value={0.8}>Requisitos claros (x0.8)</option>
                  <option value={1.0}>Normal (x1.0)</option>
                  <option value={1.3}>Ambiguos (x1.3)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Modelado de datos</label>
                <select
                  className="form-select"
                  value={fModeling}
                  onChange={(e) => setFModeling(Number(e.target.value))}
                >
                  <option value={0.8}>Simple (x0.8)</option>
                  <option value={1.0}>Estrella estándar (x1.0)</option>
                  <option value={1.3}>Modelo DUAL (x1.3)</option>
                  <option value={1.5}>Copo de nieve (x1.5)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">ETL (Orígenes)</label>
                <select
                  className="form-select"
                  value={fEtl}
                  onChange={(e) => setFEtl(Number(e.target.value))}
                >
                  <option value={0.7}>1 Fuente (x0.7)</option>
                  <option value={1.0}>2-3 Fuentes (x1.0)</option>
                  <option value={1.5}>5+ Fuentes (x1.5)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">DAX</label>
                <select
                  className="form-select"
                  value={fDax}
                  onChange={(e) => setFDax(Number(e.target.value))}
                >
                  <option value={0.8}>Básicas (x0.8)</option>
                  <option value={1.0}>Normales (x1.0)</option>
                  <option value={1.5}>Complejas (x1.5)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Visualizaciones</label>
                <select
                  className="form-select"
                  value={fVisuals}
                  onChange={(e) => setFVisuals(Number(e.target.value))}
                >
                  <option value={0.8}>Estándar (x0.8)</option>
                  <option value={1.0}>Normales (x1.0)</option>
                  <option value={1.3}>Custom (x1.3)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Diseño</label>
                <select
                  className="form-select"
                  value={fDesign}
                  onChange={(e) => setFDesign(Number(e.target.value))}
                >
                  <option value={0.8}>Plantilla (x0.8)</option>
                  <option value={1.0}>Normal (x1.0)</option>
                  <option value={1.3}>Custom (x1.3)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Interactividad</label>
                <select
                  className="form-select"
                  value={fInteractivity}
                  onChange={(e) => setFInteractivity(Number(e.target.value))}
                >
                  <option value={0.8}>Simple (x0.8)</option>
                  <option value={1.0}>Normal (x1.0)</option>
                  <option value={1.5}>Drill-through (x1.5)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">QA (Pruebas)</label>
                <select
                  className="form-select"
                  value={fQa}
                  onChange={(e) => setFQa(Number(e.target.value))}
                >
                  <option value={0.8}>Conocidos (x0.8)</option>
                  <option value={1.0}>Normal (x1.0)</option>
                  <option value={1.3}>Regulados (x1.3)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Despliegue (RLS)</label>
                <select
                  className="form-select"
                  value={fRls}
                  onChange={(e) => setFRls(Number(e.target.value))}
                >
                  <option value={0.8}>Sin RLS (x0.8)</option>
                  <option value={1.0}>Básica (x1.0)</option>
                  <option value={1.5}>Dinámica (x1.5)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Validación</label>
                <select
                  className="form-select"
                  value={fValidation}
                  onChange={(e) => setFValidation(Number(e.target.value))}
                >
                  <option value={1.0}>Contra informe antiguo (x1.0)</option>
                  <option value={1.5}>Contra BBDD (x1.5)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Seniority</label>
                <select
                  className="form-select"
                  value={seniority}
                  onChange={(e) => setSeniority(Number(e.target.value))}
                >
                  <option value={1.5}>Junior (x1.5)</option>
                  <option value={1.0}>Mid (x1.0)</option>
                  <option value={0.75}>Senior (x0.75)</option>
                </select>
              </div>
            </div>
          </div>

          <div
            style={{
              width: '300px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-s2)',
            }}
          >
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--tx-secondary)',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              ESTIMACIÓN TOTAL
            </span>
            <span
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'var(--ac)',
                marginBottom: '2rem',
              }}
            >
              {totalHours} h
            </span>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.875rem',
              }}
            >
              <div className="d-flex justify-between">
                <span>Análisis y Modelado:</span> <strong>{modelSubtotal}h</strong>
              </div>
              <div className="d-flex justify-between">
                <span>ETL y Orígenes:</span> <strong>{etlHours}h</strong>
              </div>
              <div className="d-flex justify-between">
                <span>Desarrollo DAX:</span> <strong>{daxHours}h</strong>
              </div>
              <div className="d-flex justify-between">
                <span>Maquetación / UI:</span> <strong>{uiHours}h</strong>
              </div>
              <div className="d-flex justify-between">
                <span>QA y Despliegue:</span> <strong>{qaHours}h</strong>
              </div>
              <div className="d-flex justify-between">
                <span>Documentación fija:</span> <strong>+12h</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.5rem',
                  color: 'var(--tx-muted)',
                }}
              >
                <span>Factor Seniority:</span> <strong>x{seniority}</strong>
              </div>
            </div>

            <div
              style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <button className="btn btn-primary" onClick={onCreateSingleTicket}>
                ✨ Crear Ticket Único
              </button>
              <button className="btn btn-secondary" onClick={handleExportExcel}>
                📊 Exportar Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
