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
                Tablero Kanban en Tiempo Real
              </h3>
              <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                Organiza tickets, prioridades y estados en un tablero fluido que reacciona al instante a los cambios de cualquier miembro del equipo.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md bg-surface-canvas/60 p-space-md rounded-lg">
              <div className="flex items-center justify-between font-label-code text-[12px] text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-mint-deep"></span> Firebase Realtime</span>
                <span className="text-text-muted">Latencia {"<50ms"}</span>
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
                Creación Inteligente de Tareas
              </h3>
              <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                Deja que la IA descomponga especificaciones o requerimientos en tickets accionables con formato Markdown completo en segundos.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md bg-surface-canvas/60 p-space-md rounded-lg">
              <div className="flex items-center justify-between font-label-code text-[12px] text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-mint-deep"></span> Gemini Smart Create</span>
                <span className="text-text-muted">Auto-parsing Markdown</span>
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
                Colaboración Multitenant
              </h3>
              <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                Espacios de trabajo aislados y seguros. Gestiona permisos, invita a tu equipo y mantén la privacidad absoluta de tus proyectos.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md bg-surface-canvas/60 p-space-md rounded-lg">
              <div className="flex items-center justify-between font-label-code text-[12px] text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-mint-deep"></span> Autenticación segura</span>
                <span className="text-text-muted">Roles granulares</span>
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
                Estimación con Power BI
              </h3>
              <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
                Evalúa la viabilidad técnica y genera estimaciones de esfuerzo para tus desarrollos de Business Intelligence directamente en el ticket.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md bg-surface-canvas/60 p-space-md rounded-lg">
              <div className="flex items-center justify-between font-label-code text-[12px] text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-mint-deep"></span> Analítica predictiva</span>
                <span className="text-text-muted">Integración nativa</span>
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
          Examina las interfaces diseñadas para eliminar la dispersión cognitiva de tu equipo.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center gap-space-xs mb-space-xl overflow-x-auto pb-2">
        <button className="px-space-md py-1.5 rounded-lg bg-text-primary text-on-primary font-label-code text-label-code font-medium shadow-sm transition-all">
          Editor Markdown
        </button>
        <button className="px-space-md py-1.5 rounded-lg bg-surface-card hover:bg-surface text-text-secondary font-label-code text-label-code transition-all shadow-sm">
          Módulo de Notas
        </button>
        <button className="px-space-md py-1.5 rounded-lg bg-surface-card hover:bg-surface text-text-secondary font-label-code text-label-code transition-all shadow-sm">
          Importar / Exportar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Component A */}
        <div className="bg-surface-card p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm mb-space-md">
              <span className="font-label-code text-label-code text-text-muted">Ficha de Ticket</span>
              <span className="font-label-code text-[11px] bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-medium">Core</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold text-text-primary mb-space-xs">
              Editor Markdown Nativo
            </h3>
            <p className="font-body-sm text-body-sm text-text-secondary mb-space-md">
              Tickets con soporte completo para Markdown, bloques de código, formateo avanzado y asignación rápida de prioridades (P1-P4).
            </p>
            <div className="bg-surface-canvas p-space-sm rounded mb-space-md space-y-space-xs">
              <p className="font-label-code text-[11px] text-text-secondary truncate">
                ```javascript<br/>
                const optimize = () =&gt; true;<br/>
                ```
              </p>
            </div>
            <div className="space-y-1 text-body-sm">
              <div className="flex justify-between py-1 font-label-code text-label-code">
                <span className="text-text-muted">Prioridad</span>
                <span className="text-text-primary font-medium">P1 Alta</span>
              </div>
            </div>
          </div>
          <div className="pt-space-md flex items-center justify-between text-text-muted font-label-code text-[11px]">
            <span>Atajo rápido: <kbd className="px-1 bg-surface-container rounded text-text-primary">Click</kbd> Editar</span>
          </div>
        </div>

        {/* Component B */}
        <div className="bg-surface-card p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm mb-space-md">
              <span className="font-label-code text-label-code text-text-muted">Colaboración asíncrona</span>
              <span className="font-label-code text-[11px] bg-surface-container text-text-secondary px-2 py-0.5 rounded font-medium">Accesible</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold text-text-primary mb-space-md">
              Módulo de Notas y Guías
            </h3>
            <div className="space-y-space-md">
              <p className="font-body-sm text-body-sm text-text-secondary">
                Integra ventanas flotantes de notas rápidas, normativas de proyecto o guidelines de diseño sin salir del contexto de tu tablero principal.
              </p>
            </div>
            <div className="mt-space-lg p-space-sm bg-surface-canvas rounded text-body-sm text-text-secondary">
              <p className="font-label-code text-[11px] flex items-center gap-1 text-text-primary">
                <span className="material-symbols-outlined text-[15px] text-accent-mint-deep">edit_note</span>
                Ventana flotante siempre disponible en tu interfaz.
              </p>
            </div>
          </div>
          <div className="pt-space-md flex items-center justify-between text-text-muted font-label-code text-[11px]">
            <span>No pierdas el foco</span>
          </div>
        </div>

        {/* Component C */}
        <div className="bg-surface-card p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm mb-space-md">
              <span className="font-label-code text-label-code text-text-muted">Respaldo total</span>
              <span className="font-label-code text-[11px] bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-semibold">JSON</span>
            </div>
            <h3 className="font-headline-sm text-[18px] font-semibold text-text-primary mb-1">
              Exportación Cero Lock-In
            </h3>
            <p className="font-body-sm text-body-sm text-text-secondary mb-space-md">
              Descarga una copia de seguridad local de todos tus tickets en formato estándar JSON en cualquier momento.
            </p>
            <div className="w-full bg-surface-canvas p-space-sm rounded-lg flex items-center justify-center py-8">
              <span className="material-symbols-outlined text-[40px] text-accent-mint-deep opacity-80">cloud_download</span>
            </div>
          </div>
          <div className="pt-space-md flex items-center justify-between text-text-muted font-label-code text-[11px]">
            <span>Importa y exporta masivamente</span>
          </div>
        </div>
      </div>
    </section>
  );
};
