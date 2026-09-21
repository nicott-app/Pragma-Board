import React from 'react';

// 5. VALUE PROP
export const LandingValueProp: React.FC = () => {
  return (
    <section className="w-full py-space-xl bg-surface-canvas">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin">
        <div className="mb-space-xl">
          <span className="font-label-meta text-label-meta uppercase tracking-wider text-text-muted">Arquitectura de ejecución</span>
          <h2 className="font-headline-lg text-headline-md md:text-headline-lg font-semibold tracking-tight text-text-primary mt-space-xs">
            Diseñado para el ritmo de la ingeniería moderna
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {/* Pillar 1 */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-sm hover:shadow transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-surface-canvas flex items-center justify-center mb-space-md">
                <span className="material-symbols-outlined text-[22px] text-text-primary">space_dashboard</span>
              </div>
              <span className="font-label-meta text-label-meta uppercase text-text-muted">01 / Centralización</span>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mt-1 mb-space-sm">
                Gestiona todo el trabajo desde un único lugar
              </h3>
              <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                Epics, sprints, tareas técnicas e incidencias de clientes integradas sin cambiar de pestaña. Transita entre vista de tablero Kanban, lista compacta o timeline con una tecla.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md bg-surface-canvas/60 p-space-md rounded-lg">
              <div className="flex items-center justify-between font-label-code text-[12px] text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-mint-deep"></span> Vistas sincronizadas</span>
                <span className="text-text-muted">Atajo <kbd className="px-1 bg-surface-card rounded text-text-primary">1-4</kbd></span>
              </div>
            </div>
          </div>
          {/* Pillar 2 */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-sm hover:shadow transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-surface-canvas flex items-center justify-center mb-space-md">
                <span className="material-symbols-outlined text-[22px] text-text-primary">account_tree</span>
              </div>
              <span className="font-label-meta text-label-meta uppercase text-text-muted">02 / Ejecución</span>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mt-1 mb-space-sm">
                Convierte ideas y necesidades en trabajo accionable
              </h3>
              <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                Descompone especificaciones de producto en tareas técnicas con criterios de aceptación claros en un clic. Enlaza requerimientos con PRs de GitHub y GitLab automáticamente.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md bg-surface-canvas/60 p-space-md rounded-lg">
              <div className="flex items-center justify-between font-label-code text-[12px] text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-mint-deep"></span> Auto-parsing Markdown</span>
                <span className="text-text-muted">Subtareas automáticas</span>
              </div>
            </div>
          </div>
          {/* Pillar 3 */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-sm hover:shadow transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-surface-canvas flex items-center justify-center mb-space-md">
                <span className="material-symbols-outlined text-[22px] text-text-primary">groups_2</span>
              </div>
              <span className="font-label-meta text-label-meta uppercase text-text-muted">03 / Alineación</span>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mt-1 mb-space-sm">
                Mantén al equipo alineado en tiempo real
              </h3>
              <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                Visibilidad instantánea del ritmo de sprint sin microgestión ni reportes manuales. Los bloqueos se detectan antes de que afecten la fecha de lanzamiento.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md bg-surface-canvas/60 p-space-md rounded-lg">
              <div className="flex items-center justify-between font-label-code text-[12px] text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-mint-deep"></span> Alerta de ruta crítica</span>
                <span className="text-text-muted">Broadcast asíncrono</span>
              </div>
            </div>
          </div>
          {/* Pillar 4 */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-sm hover:shadow transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-surface-canvas flex items-center justify-center mb-space-md">
                <span className="material-symbols-outlined text-[22px] text-text-primary">smart_toy</span>
              </div>
              <span className="font-label-meta text-label-meta uppercase text-text-muted">04 / Automatización</span>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mt-1 mb-space-sm">
                IA contextual para acelerar tareas repetitivas
              </h3>
              <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                Generación de resúmenes de sprint para stakeholders, clasificación de bugs y etiquetado automático. Sin chatbots confusos: botones precisos en cada ticket.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md bg-surface-canvas/60 p-space-md rounded-lg">
              <div className="flex items-center justify-between font-label-code text-[12px] text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-mint-deep"></span> Motor heurístico nativo</span>
                <span className="text-text-muted">{"<2s por síntesis"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 6. PRODUCT SHOWCASE
export const LandingProductShowcase: React.FC = () => {
  return (
    <section className="w-full py-28 px-margin-mobile md:px-margin max-w-[1200px] mx-auto" id="demo-section">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-space-lg">
        <span className="font-label-meta text-label-meta uppercase tracking-wider text-text-muted mb-space-xs">Arquitectura visual</span>
        <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-text-primary font-semibold tracking-tight mb-space-sm">
          Construido para cómo trabaja la ingeniería hoy
        </h2>
        <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary">
          Examina las tres interfaces diseñadas para eliminar la dispersión cognitiva de tu equipo.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center gap-space-xs mb-space-xl overflow-x-auto pb-2">
        <button className="px-space-md py-1.5 rounded-lg bg-text-primary text-on-primary font-label-code text-label-code font-medium shadow-sm transition-all">
          Ficha de Ticket
        </button>
        <button className="px-space-md py-1.5 rounded-lg bg-surface-card hover:bg-surface text-text-secondary font-label-code text-label-code transition-all shadow-sm">
          Roadmap & Timeline
        </button>
        <button className="px-space-md py-1.5 rounded-lg bg-surface-card hover:bg-surface text-text-secondary font-label-code text-label-code transition-all shadow-sm">
          Métricas de Velocidad
        </button>
        <button className="px-space-md py-1.5 rounded-lg bg-surface-card hover:bg-surface text-text-secondary font-label-code text-label-code transition-all shadow-sm">
          Copiloto IA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Component A */}
        <div className="bg-surface-card p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm mb-space-md">
              <span className="font-label-code text-label-code text-text-muted">SPR-204 · Incidencia</span>
              <span className="font-label-code text-[11px] bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-medium">En revisión</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold text-text-primary mb-space-xs">
              Optimizar carga de bundle inicial en SPA
            </h3>
            <p className="font-body-sm text-body-sm text-text-secondary mb-space-md">
              Reducir el vendor chunk de 1.4MB a {"<350KB"} mediante tree-shaking dinámico e importaciones diferidas.
            </p>
            <div className="bg-surface-canvas p-space-sm rounded mb-space-md space-y-space-xs">
              <div className="flex items-center justify-between font-label-code text-[11px]">
                <span className="text-text-primary font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-accent-mint-deep">check_circle</span> PR #481 Merged
                </span>
                <span className="text-text-muted">hace 14m</span>
              </div>
              <p className="font-label-code text-[11px] text-text-secondary truncate">
                perf(core): code-splitting de módulos analíticos
              </p>
            </div>
            <div className="space-y-1 text-body-sm">
              <div className="flex justify-between py-1 font-label-code text-label-code">
                <span className="text-text-muted">Branch</span>
                <span className="text-text-primary font-medium">perf/lazy-bundle</span>
              </div>
              <div className="flex justify-between py-1 font-label-code text-label-code">
                <span className="text-text-muted">Revisor</span>
                <span className="text-text-primary font-medium">Carlos D. (Frontend Lead)</span>
              </div>
            </div>
          </div>
          <div className="pt-space-md flex items-center justify-between text-text-muted font-label-code text-[11px]">
            <span>Atajo rápido: <kbd className="px-1 bg-surface-container rounded text-text-primary">M</kbd> Asignar</span>
            <span className="text-accent-mint-deep font-semibold">Listo para QA</span>
          </div>
        </div>

        {/* Component B */}
        <div className="bg-surface-card p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm mb-space-md">
              <span className="font-label-code text-label-code text-text-muted">Q3 Timeline · Epics</span>
              <span className="font-label-code text-[11px] bg-surface-container text-text-secondary px-2 py-0.5 rounded font-medium">Semana 34 / 52</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold text-text-primary mb-space-md">
              Matriz de Priorización & Roadmap
            </h3>
            <div className="space-y-space-md">
              <div>
                <div className="flex justify-between font-label-code text-[11px] text-text-secondary mb-1">
                  <span>1. Multi-region DB Failover</span>
                  <span className="text-accent-mint-deep font-medium">92%</span>
                </div>
                <div className="w-full bg-surface-canvas rounded-full h-2">
                  <div className="bg-text-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-label-code text-[11px] text-text-secondary mb-1">
                  <span>2. API v3 Pública & SDKs</span>
                  <span className="text-accent-mint-deep font-medium">54%</span>
                </div>
                <div className="w-full bg-surface-canvas rounded-full h-2">
                  <div className="bg-accent-mint-deep h-2 rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-label-code text-[11px] text-text-secondary mb-1">
                  <span>3. Migración Billing Stripe Checkout</span>
                  <span className="text-text-muted font-medium">Pendiente</span>
                </div>
                <div className="w-full bg-surface-canvas rounded-full h-2">
                  <div className="bg-border-strong h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-space-lg p-space-sm bg-surface-canvas rounded text-body-sm text-text-secondary">
              <p className="font-label-code text-[11px] flex items-center gap-1 text-text-primary">
                <span className="material-symbols-outlined text-[15px] text-accent-mint-deep">insights</span>
                Previsión: Finalización estimada 12 de Octubre sin retrasos detectados.
              </p>
            </div>
          </div>
          <div className="pt-space-md flex items-center justify-between text-text-muted font-label-code text-[11px]">
            <span>Dependencias: 2 críticas</span>
            <span className="text-text-primary font-medium">Vista Gantt nítida</span>
          </div>
        </div>

        {/* Component C */}
        <div className="bg-surface-card p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm mb-space-md">
              <span className="font-label-code text-label-code text-text-muted">Sprint 14 Analytics</span>
              <span className="font-label-code text-[11px] bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-semibold">Saludable</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold text-text-primary mb-1">
              Velocidad & Tiempo de Ciclo
            </h3>
            <p className="font-body-sm text-body-sm text-text-secondary mb-space-md">
              Tiempo de ciclo medio de <span className="font-semibold text-text-primary">1.8 días</span> desde apertura hasta merge.
            </p>
            <div className="w-full bg-surface-canvas p-space-sm rounded-lg">
              <div className="flex justify-between font-label-code text-[10px] text-text-muted mb-2">
                <span>BURNDOWN (STORY POINTS)</span>
                <span className="text-accent-mint-deep font-semibold">Actual: 8 pts rest.</span>
              </div>
              <svg className="w-full h-32 overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 120">
                <line stroke="#CBD5E1" strokeDasharray="4 4" strokeWidth="1.5" x1="0" x2="300" y1="10" y2="110"></line>
                <polygon fill="#86EFAC" fillOpacity="0.18" points="0,10 50,22 100,35 150,58 200,62 250,88 250,110 0,110"></polygon>
                <polyline fill="none" points="0,10 50,22 100,35 150,58 200,62 250,88" stroke="#111827" strokeWidth="2"></polyline>
                <circle cx="250" cy="88" fill="#16A34A" r="4"></circle>
              </svg>
              <div className="flex justify-between font-label-code text-[10px] text-text-muted mt-2">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
              </div>
            </div>
          </div>
          <div className="pt-space-md flex items-center justify-between text-text-muted font-label-code text-[11px]">
            <span>Ratio de entrega a tiempo: <strong className="text-text-primary font-semibold">96.4%</strong></span>
            <span className="text-accent-mint-deep font-semibold">+12% vs Sprint 13</span>
          </div>
        </div>
      </div>
    </section>
  );
};
