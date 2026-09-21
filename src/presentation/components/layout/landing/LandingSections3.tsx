import React from 'react';

// 7. IA SECTION
export const LandingIASection: React.FC = () => {
  return (
    <section className="w-full py-28 bg-surface-card">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin">
        <div className="max-w-3xl mb-space-xl">
          <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded bg-surface-canvas text-accent-mint-deep font-label-code text-label-code font-semibold mb-space-xs">
            <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
            Inteligencia nativa en el flujo de trabajo
          </div>
          <h2 className="font-headline-lg text-headline-md md:text-headline-lg font-semibold tracking-tight text-text-primary mb-space-sm">
            La IA no gestiona tu producto por ti. Te ayuda a gestionarlo mejor.
          </h2>
          <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary">
            Sin prompts complicados ni interfaces de chat invasivas. Capacidades deterministas integradas directamente en el flujo de trabajo donde ahorran fricción repetitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {/* Action 1 */}
          <div className="bg-surface-canvas p-space-lg rounded-xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-meta text-label-meta uppercase text-text-muted">Acción 01</span>
                <span className="font-label-code text-[11px] bg-surface-card px-2 py-0.5 rounded text-text-secondary">1 clic · {"<1.2s"}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-space-xs">
                Descomponer especificaciones en tareas
              </h3>
              <p className="font-body-md text-body-md text-text-secondary mb-space-md">
                Un requerimiento de 1 párrafo se transforma automáticamente en 4 subtareas técnicas con criterios de aceptación validados.
              </p>
              <div className="bg-surface-card p-space-sm rounded-lg font-label-code text-[11px] space-y-1 text-text-secondary">
                <div className="text-text-primary font-semibold">// Salida generada:</div>
                <div className="text-text-primary">✔ Migración esquema Postgres (campo deleted_at)</div>
                <div className="text-text-primary">✔ Endpoint DELETE /v1/organization/{"{id}"} con soft-delete</div>
                <div className="text-text-primary">✔ Modal de confirmación con doble autenticación</div>
                <div className="text-text-primary">✔ Test de integración Jest para retención 30 días</div>
              </div>
            </div>
          </div>

          {/* Action 2 */}
          <div className="bg-surface-canvas p-space-lg rounded-xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-meta text-label-meta uppercase text-text-muted">Acción 02</span>
                <span className="font-label-code text-[11px] bg-surface-card px-2 py-0.5 rounded text-text-secondary">Stakeholder ready</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-space-xs">
                Resumen ejecutivo de sprint para stakeholders
              </h3>
              <p className="font-body-md text-body-md text-text-secondary mb-space-md">
                Genera en 5 segundos el reporte de avance de alto nivel para negocio, eliminando reuniones de estatus redundantes.
              </p>
              <div className="bg-surface-card p-space-sm rounded-lg font-body-sm text-[12px] text-text-secondary leading-relaxed">
                <span className="font-label-code text-[11px] text-accent-mint-deep font-semibold block mb-1">Síntesis para VP of Product:</span>
                "Completamos el 91% del alcance planeado en Sprint 14. La migración de autenticación SSO está en staging sin incidentes. El feature de exportación CSV se postergó por dependencia en la API de pagos."
              </div>
            </div>
          </div>

          {/* Action 3 */}
          <div className="bg-surface-canvas p-space-lg rounded-xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-meta text-label-meta uppercase text-text-muted">Acción 03</span>
                <span className="font-label-code text-[11px] bg-error-container/30 text-error px-2 py-0.5 rounded font-semibold">Alerta Proactiva</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-space-xs">
                Detección de bloqueos y ruta crítica
              </h3>
              <p className="font-body-md text-body-md text-text-secondary mb-space-md">
                Alerta temprana cuando un Pull Request o tarea dependiente supera las 48 horas sin movimiento en el camino crítico.
              </p>
              <div className="bg-surface-card p-space-sm rounded-lg font-label-code text-[11px] text-text-secondary space-y-1">
                <div className="flex items-center gap-1.5 text-error font-semibold">
                  <span className="material-symbols-outlined text-[14px]">warning</span> SPR-109 bloquea 3 entregables clave
                </div>
                <p>Recomendación: Reasignar code review a @david_dev para desbloquear release.</p>
              </div>
            </div>
          </div>

          {/* Action 4 */}
          <div className="bg-surface-canvas p-space-lg rounded-xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-meta text-label-meta uppercase text-text-muted">Acción 04</span>
                <span className="font-label-code text-[11px] bg-surface-card px-2 py-0.5 rounded text-text-secondary">Auto-triage</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-space-xs">
                Triage y clasificación inteligente
              </h3>
              <p className="font-body-md text-body-md text-text-secondary mb-space-md">
                Asigna prioridad, severidad, equipo y componente técnico analizando el texto del ticket o reporte de error del usuario.
              </p>
              <div className="bg-surface-card p-space-sm rounded-lg font-label-code text-[11px] flex items-center justify-between text-text-primary">
                <span className="flex items-center gap-1 text-text-secondary">
                  <span>Input: "500 error en checkout Safari"</span>
                </span>
                <span className="bg-primary-container/40 text-on-primary-container px-2 py-0.5 rounded font-medium">→ Bug / P1 / Web-Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 8. WORKFLOW
export const LandingWorkflow: React.FC = () => {
  return (
    <section className="w-full py-28 px-margin-mobile md:px-margin max-w-[1200px] mx-auto">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-space-xl">
        <span className="font-label-meta text-label-meta uppercase tracking-wider text-text-muted mb-space-xs">Ciclo de vida completo</span>
        <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-text-primary font-semibold tracking-tight mb-space-sm">
          De la primera idea a producción sin pérdidas de contexto
        </h2>
        <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary">
          Un flujo continuo y sin fricción donde cada fase alimenta a la siguiente de manera determinista.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-space-sm relative">
        <div className="bg-surface-card p-space-md rounded-lg shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all">
          <div>
            <span className="font-label-code text-[11px] text-text-muted">01 / CAPTURA</span>
            <h4 className="font-headline-sm text-[16px] font-semibold text-text-primary mt-1 mb-1">Idea</h4>
            <p className="font-body-sm text-[12px] text-text-secondary">Documento rápido de specs o feedback de cliente.</p>
          </div>
          <div className="pt-space-md font-label-code text-[10px] text-text-muted">Avg: 2 horas</div>
        </div>
        <div className="bg-surface-card p-space-md rounded-lg shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all">
          <div>
            <span className="font-label-code text-[11px] text-text-muted">02 / DEFINICIÓN</span>
            <h4 className="font-headline-sm text-[16px] font-semibold text-text-primary mt-1 mb-1">Planificación</h4>
            <p className="font-body-sm text-[12px] text-text-secondary">Desglose de epics y estimación de capacidad de sprint.</p>
          </div>
          <div className="pt-space-md font-label-code text-[10px] text-text-muted">Avg: 1 día</div>
        </div>
        <div className="bg-surface-card p-space-md rounded-lg shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all">
          <div>
            <span className="font-label-code text-[11px] text-text-muted">03 / ORDEN</span>
            <h4 className="font-headline-sm text-[16px] font-semibold text-text-primary mt-1 mb-1">Priorización</h4>
            <p className="font-body-sm text-[12px] text-text-secondary">Matriz de impacto/esfuerzo y orden en backlog activo.</p>
          </div>
          <div className="pt-space-md font-label-code text-[10px] text-text-muted">Avg: 2 horas</div>
        </div>
        <div className="bg-surface-card p-space-md rounded-lg shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all ring-1 ring-border-strong">
          <div>
            <span className="font-label-code text-[11px] text-accent-mint-deep font-semibold">04 / CÓDIGO</span>
            <h4 className="font-headline-sm text-[16px] font-semibold text-text-primary mt-1 mb-1">Desarrollo</h4>
            <p className="font-body-sm text-[12px] text-text-secondary">Branches automáticos con prefijo de ticket y commits linkeados.</p>
          </div>
          <div className="pt-space-md font-label-code text-[10px] text-accent-mint-deep font-medium">Ciclo: 1.8 días</div>
        </div>
        <div className="bg-surface-card p-space-md rounded-lg shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all">
          <div>
            <span className="font-label-code text-[11px] text-text-muted">05 / REVISIÓN</span>
            <h4 className="font-headline-sm text-[16px] font-semibold text-text-primary mt-1 mb-1">Seguimiento</h4>
            <p className="font-body-sm text-[12px] text-text-secondary">Validación de QA, tests automatizados y code review.</p>
          </div>
          <div className="pt-space-md font-label-code text-[10px] text-text-muted">Avg: 4 horas</div>
        </div>
        <div className="bg-surface-card p-space-md rounded-lg shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all">
          <div>
            <span className="font-label-code text-[11px] text-accent-mint-deep font-semibold">06 / RELEASE</span>
            <h4 className="font-headline-sm text-[16px] font-semibold text-text-primary mt-1 mb-1">Entrega</h4>
            <p className="font-body-sm text-[12px] text-text-secondary">Deploy a producción, changelog automático y ticket cerrado.</p>
          </div>
          <div className="pt-space-md font-label-code text-[10px] text-accent-mint-deep font-medium">Continuo {"<10m"}</div>
        </div>
      </div>
    </section>
  );
};

// 9. COMPARISON
export const LandingComparison: React.FC = () => {
  return (
    <section className="w-full py-28 bg-surface-card">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-space-xl">
          <span className="font-label-meta text-label-meta uppercase tracking-wider text-text-muted mb-space-xs">Comparativa directa</span>
          <h2 className="font-headline-lg text-headline-md md:text-headline-lg font-semibold tracking-tight text-text-primary mb-space-sm">
            Ingeniería de alta velocidad vs. Herramientas heredadas
          </h2>
          <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary">
            Decisiones de arquitectura diseñadas para eliminar la frustración en cada interacción diaria.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm border-collapse">
            <thead>
              <tr className="font-label-code text-[11px] text-text-muted uppercase">
                <th className="py-space-md px-space-md">Dimensión técnica</th>
                <th className="py-space-md px-space-md bg-surface-canvas/80 text-text-primary font-bold">Sprinto</th>
                <th className="py-space-md px-space-md text-text-muted">Herramientas tradicionales (Jira / Legadas)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-body-md">
              <tr>
                <td className="py-space-md px-space-md font-medium text-text-primary">Velocidad de interacción</td>
                <td className="py-space-md px-space-md bg-surface-canvas/40 font-semibold text-accent-mint-deep font-label-code">
                  {"< 50ms (atención instantánea y optimista)"}
                </td>
                <td className="py-space-md px-space-md text-text-secondary font-label-code">
                  {"> 1.2s de recarga por cada cambio de pantalla"}
                </td>
              </tr>
              <tr>
                <td className="py-space-md px-space-md font-medium text-text-primary">Curva de adopción</td>
                <td className="py-space-md px-space-md bg-surface-canvas/40 font-semibold text-text-primary">
                  Menos de 1 hora para todo el equipo
                </td>
                <td className="py-space-md px-space-md text-text-secondary">
                  Semanas de capacitación, cursos y consultores certificados
                </td>
              </tr>
              <tr>
                <td className="py-space-md px-space-md font-medium text-text-primary">Automatización & IA</td>
                <td className="py-space-md px-space-md bg-surface-canvas/40 font-semibold text-text-primary">
                  Asistente contextual integrado en cada acción nativa
                </td>
                <td className="py-space-md px-space-md text-text-secondary">
                  Plugins caros de terceros y módulos desalineados
                </td>
              </tr>
              <tr>
                <td className="py-space-md px-space-md font-medium text-text-primary">Navegación por teclado</td>
                <td className="py-space-md px-space-md bg-surface-canvas/40 font-semibold text-text-primary font-label-code">
                  100% de la app controlable por comandos (⌘K, K, P, Esc)
                </td>
                <td className="py-space-md px-space-md text-text-secondary">
                  Dependencia total de clicks de ratón y menús anidados
                </td>
              </tr>
              <tr>
                <td className="py-space-md px-space-md font-medium text-text-primary">Filosofía de producto</td>
                <td className="py-space-md px-space-md bg-surface-canvas/40 font-semibold text-text-primary">
                  Hecho para que los ingenieros construyan software rápido
                </td>
                <td className="py-space-md px-space-md text-text-secondary">
                  Burocracia corporativa sobrediseñada para auditorías
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// 10. CTA FINAL
export const LandingCTA: React.FC = () => {
  return (
    <section className="w-full py-28 px-margin-mobile md:px-margin max-w-[1200px] mx-auto">
      <div className="w-full rounded-2xl bg-[#111827] text-on-primary p-space-xl md:p-20 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-primary-container to-transparent"></div>
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <span className="font-label-code text-label-code text-primary-container uppercase tracking-wider mb-space-sm font-semibold">
            Listo para el siguiente nivel de ejecución
          </span>
          <h2 className="font-headline-lg text-headline-md md:text-headline-lg font-semibold tracking-tight text-white mb-space-md">
            Deja de gestionar herramientas. Empieza a gestionar trabajo.
          </h2>
          <p className="font-body-lg text-body-md md:text-body-lg text-text-muted max-w-xl mb-space-xl">
            Únete a cientos de equipos de ingeniería que han sustituido la complejidad por claridad, cadencia y velocidad de entrega.
          </p>
          <form className="flex flex-col sm:flex-row items-center gap-space-sm w-full max-w-md mb-space-md" onSubmit={(e) => e.preventDefault()}>
            <input className="w-full h-11 px-space-md rounded-lg bg-surface-canvas text-text-primary font-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container" placeholder="tu@empresa.com" required type="email" />
            <button className="w-full sm:w-auto shrink-0 h-11 px-space-lg bg-primary-container hover:bg-[#4ade80] text-text-primary font-body-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-space-xs cursor-pointer" type="submit">
              <span>Empezar gratis</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>
          <p className="font-label-meta text-label-meta text-text-muted">
            Prueba gratuita de 14 días <span className="mx-1">·</span> Sin tarjeta de crédito requerida <span className="mx-1">·</span> Cancela cuando quieras
          </p>
        </div>
      </div>
    </section>
  );
};

// 11. FOOTER
export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full bg-surface-card py-space-xl">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin flex flex-col gap-space-xl">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-gutter">
          <div className="col-span-2 flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-xs">
              <img alt="Sprinto Brand Logo" className="h-6 w-auto object-contain" src="/sprinto-logo.svg" />
              <span className="font-headline-sm text-headline-sm text-text-primary">Sprinto</span>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary max-w-xs">Arquitectura de cumplimiento y seguridad automatizada de alto rendimiento para equipos de ingeniería modernos.</p>
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-canvas w-fit">
              <span className="w-2 h-2 rounded-full bg-accent-mint-deep"></span>
              <span className="font-label-code text-label-code text-text-primary">Sistemas operativos 99.99%</span>
            </div>
          </div>
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-meta text-label-meta uppercase text-text-muted">Producto</span>
            <a className="font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors" href="#">Overview</a>
            <a className="font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors" href="#">Integraciones</a>
            <a className="font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors" href="#">Motor IA</a>
          </div>
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-meta text-label-meta uppercase text-text-muted">Recursos</span>
            <a className="font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors" href="#">Documentación</a>
            <a className="font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors" href="#">Guías SOC2</a>
            <a className="font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors" href="#">API Specs</a>
          </div>
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-meta text-label-meta uppercase text-text-muted">Empresa</span>
            <a className="font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors" href="#">Sobre nosotros</a>
            <a className="font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors" href="#">Contacto</a>
          </div>
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-meta text-label-meta uppercase text-text-muted">Legal</span>
            <a className="font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors" href="#">Privacidad</a>
            <a className="font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors" href="#">Términos</a>
            <a className="font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors" href="#">Seguridad</a>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-meta text-label-meta text-text-muted pt-space-md border-t border-border-subtle">
          <p>© 2026 Sprinto Inc. Todos los derechos reservados.</p>
          <div className="flex items-center gap-space-md">
            <a className="hover:text-text-primary transition-colors" href="#">Privacidad</a>
            <a className="hover:text-text-primary transition-colors" href="#">Condiciones del servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
