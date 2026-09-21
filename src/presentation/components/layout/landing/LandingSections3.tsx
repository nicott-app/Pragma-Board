import React from 'react';
import { useUIStore } from '../../../../application/store/useUIStore';

// 7. IA BYOK SECTION
export const LandingIASection: React.FC = () => {
  return (
    <section className="w-full py-space-xl px-margin-mobile md:px-margin max-w-[1200px] mx-auto" id="ia-byok">
      <div className="bg-[#0B0F19] rounded-2xl p-space-lg md:p-space-2xl text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-container/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-space-xl items-center">
          <div className="w-full md:w-1/2">
            <span className="font-label-code text-label-code text-accent-mint-deep border border-accent-mint-deep/30 bg-accent-mint-deep/10 px-3 py-1 rounded-full mb-space-sm inline-block">
              Inteligencia Nativa
            </span>
            <h2 className="font-headline-lg text-headline-md md:text-headline-lg font-bold tracking-tight mb-space-md">
              Tu IA. Tus reglas. Tus claves.
            </h2>
            <p className="font-body-lg text-body-md md:text-body-lg text-slate-300 mb-space-lg">
              Sprinto utiliza un modelo BYOK (Bring Your Own Key) garantizando total privacidad. Paga céntimos directamente al proveedor de IA en lugar de infladas cuotas por usuario.
            </p>
            <div className="space-y-space-md">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <span className="material-symbols-outlined text-[16px] text-white">magic_button</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm font-semibold mb-1">Descomposición automática</h4>
                  <p className="font-body-sm text-body-sm text-slate-400">Genera subtareas y requerimientos técnicos a partir de descripciones de producto en texto plano.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <span className="material-symbols-outlined text-[16px] text-white">summarize</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm font-semibold mb-1">Resumen ejecutivo</h4>
                  <p className="font-body-sm text-body-sm text-slate-400">Condensa el estado del sprint en un reporte conciso para stakeholders no técnicos.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <span className="material-symbols-outlined text-[16px] text-white">monitoring</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm font-semibold mb-1">Analítica Predictiva</h4>
                  <p className="font-body-sm text-body-sm text-slate-400">Realiza estimaciones de esfuerzo, viabilidad de negocio y modelado de datos con Power BI.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <span className="material-symbols-outlined text-[16px] text-accent-mint-deep">lock</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm font-semibold text-accent-mint-deep mb-1">Privacidad BYOK total</h4>
                  <p className="font-body-sm text-body-sm text-slate-400">Sprinto no procesa ni almacena tus claves en bases de datos. Todo viaja encriptado AES-256 GCM directo al LLM.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="bg-[#1E293B] p-space-md rounded-xl border border-slate-700 w-full max-w-md shadow-2xl relative">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-label-code text-[11px] text-slate-400 ml-2">Configuración IA - Sprinto</span>
              </div>
              <div className="space-y-4 font-label-code text-[12px]">
                <div className="text-slate-400">
                  <span className="text-pink-400">const</span> <span className="text-blue-400">aiModel</span> = <span className="text-green-400">'gemini-1.5-pro'</span>;
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 font-mono text-slate-300">
                  <span className="block text-slate-500 mb-2">{"// Configura tu clave encriptada"}</span>
                  <span className="text-purple-400">Security</span>.<span className="text-blue-300">setKey</span>(
                  <br />&nbsp;&nbsp;<span className="text-green-400">"AIzaSyC..."</span>
                  <br />);
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 font-mono">
                  <span className="text-green-400">✔ Clave válida y operativa.</span>
                  <br />
                  <span className="text-slate-400">Costo estimado mensual: ~$1.20 USD</span>
                </div>
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
    <section className="w-full py-space-xl bg-surface-canvas border-t border-border-muted overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin text-center mb-space-xl">
        <h2 className="font-headline-lg text-headline-md md:text-headline-lg font-semibold tracking-tight text-text-primary">
          El ciclo de vida de un feature
        </h2>
        <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary mt-space-sm max-w-2xl mx-auto">
          Desde la idea hasta producción, sin reuniones de seguimiento.
        </p>
      </div>

      <div className="relative max-w-[1000px] mx-auto px-margin-mobile md:px-margin">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border-strong -translate-y-1/2 hidden md:block"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-lg relative z-10">
          <div className="bg-surface-card p-space-md rounded-xl shadow-sm border border-border-muted flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-surface-canvas rounded-full flex items-center justify-center border-4 border-surface-card shadow-sm mb-space-md text-text-primary font-label-code font-bold">
              01
            </div>
            <h4 className="font-headline-sm text-[16px] font-semibold text-text-primary mb-1">Creación</h4>
            <p className="font-body-sm text-body-sm text-text-secondary">Diseña proyectos multi-tenant y añade a tu equipo en segundos.</p>
          </div>
          <div className="bg-surface-card p-space-md rounded-xl shadow-sm border border-border-muted flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-surface-canvas rounded-full flex items-center justify-center border-4 border-surface-card shadow-sm mb-space-md text-text-primary font-label-code font-bold">
              02
            </div>
            <h4 className="font-headline-sm text-[16px] font-semibold text-text-primary mb-1">Ideación</h4>
            <p className="font-body-sm text-body-sm text-text-secondary">Usa Gemini para descomponer ideas vagas en tickets técnicos.</p>
          </div>
          <div className="bg-surface-card p-space-md rounded-xl shadow-sm border border-border-muted flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-surface-canvas rounded-full flex items-center justify-center border-4 border-surface-card shadow-sm mb-space-md text-text-primary font-label-code font-bold">
              03
            </div>
            <h4 className="font-headline-sm text-[16px] font-semibold text-text-primary mb-1">Ejecución</h4>
            <p className="font-body-sm text-body-sm text-text-secondary">Sincroniza y comenta en tiempo real en la vista Kanban fluida.</p>
          </div>
          <div className="bg-surface-card p-space-md rounded-xl shadow-sm border border-border-muted flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center border-4 border-surface-card shadow-sm mb-space-md text-on-primary-container font-label-code font-bold">
              <span className="material-symbols-outlined text-[20px]">flag</span>
            </div>
            <h4 className="font-headline-sm text-[16px] font-semibold text-text-primary mb-1">Exportación</h4>
            <p className="font-body-sm text-body-sm text-text-secondary">Descarga todas tus tareas completadas localmente en JSON.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// 9. COMPARISON
export const LandingComparison: React.FC = () => {
  return (
    <section className="w-full py-28 px-margin-mobile md:px-margin max-w-[1000px] mx-auto">
      <div className="text-center mb-space-xl">
        <h2 className="font-headline-lg text-headline-md md:text-headline-lg font-semibold tracking-tight text-text-primary">
          La diferencia es estructural
        </h2>
      </div>

      <div className="bg-surface-card rounded-2xl shadow-sm border border-border-strong overflow-hidden">
        <div className="grid grid-cols-3 font-label-code text-label-code text-text-muted bg-surface-canvas border-b border-border-strong px-space-md py-space-sm">
          <div className="col-span-1">Métrica</div>
          <div className="col-span-1 text-center font-semibold text-text-primary">Sprinto</div>
          <div className="col-span-1 text-center">Software Tradicional</div>
        </div>
        
        <div className="divide-y divide-border-muted">
          <div className="grid grid-cols-3 px-space-md py-space-md items-center hover:bg-surface transition-colors">
            <div className="col-span-1 font-body-sm text-text-primary font-medium">Interacciones UI</div>
            <div className="col-span-1 text-center text-accent-mint-deep font-semibold">{"< 50ms"} (Firebase RT)</div>
            <div className="col-span-1 text-center text-text-secondary">Spinners de carga lentos</div>
          </div>
          <div className="grid grid-cols-3 px-space-md py-space-md items-center hover:bg-surface transition-colors">
            <div className="col-span-1 font-body-sm text-text-primary font-medium">Editor Nativo</div>
            <div className="col-span-1 text-center text-accent-mint-deep font-semibold">Markdown rico</div>
            <div className="col-span-1 text-center text-text-secondary">WYSIWYG limitados</div>
          </div>
          <div className="grid grid-cols-3 px-space-md py-space-md items-center hover:bg-surface transition-colors">
            <div className="col-span-1 font-body-sm text-text-primary font-medium">Gestión de IA</div>
            <div className="col-span-1 text-center text-accent-mint-deep font-semibold">Céntimos con BYOK</div>
            <div className="col-span-1 text-center text-text-secondary">+$20 USD Extras / usuario</div>
          </div>
          <div className="grid grid-cols-3 px-space-md py-space-md items-center hover:bg-surface transition-colors">
            <div className="col-span-1 font-body-sm text-text-primary font-medium">Coste Mensual Base</div>
            <div className="col-span-1 text-center text-accent-mint-deep font-semibold">$0</div>
            <div className="col-span-1 text-center text-text-secondary">$15 - $35 USD / usuario</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 10. CTA
export const LandingCTA: React.FC = () => {
  const setLoginOpen = useUIStore((state) => state.setLoginOpen);

  return (
    <section className="w-full py-24 px-margin-mobile md:px-margin text-center bg-primary-container text-on-primary-container relative overflow-hidden" id="precio">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-container/80 to-primary-container pointer-events-none"></div>
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight mb-space-md">
          Paga $0 por usuario. Siempre.
        </h2>
        <p className="font-body-lg text-[20px] max-w-2xl leading-relaxed mb-space-xl opacity-90">
          Sprinto es una plataforma abierta diseñada por y para desarrolladores. Sin muros de pago, sin límites de proyectos.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-space-md">
          <button 
            className="inline-flex items-center justify-center px-8 py-4 text-button font-button text-surface bg-text-primary hover:bg-text-secondary rounded-lg transition-all active:scale-[0.98] shadow-md"
            onClick={() => setLoginOpen(true)}
          >
            Crear cuenta gratis ahora
          </button>
        </div>
        <span className="font-label-meta text-[13px] mt-space-lg opacity-75">
          Sin tarjetas de crédito · Trae tu propia clave Gemini · Datos exportables
        </span>
      </div>
    </section>
  );
};

// 11. FOOTER
export const LandingFooter: React.FC = () => {
  const setPrivacyOpen = useUIStore((state) => state.setPrivacyOpen);

  return (
    <footer className="w-full bg-surface-canvas border-t border-border-muted py-space-xl text-text-secondary font-body-sm">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-lg">
        <div className="flex items-center gap-space-xs text-text-primary">
          <img src="/sprinto-logo.svg" alt="Sprinto Logo" width={28} height={28} className="rounded-md" />
          <span className="font-headline-sm font-bold tracking-tight">Sprinto</span>
        </div>
        <div className="flex items-center gap-space-md font-label-code text-[13px]">
          <a className="hover:text-text-primary transition-colors" href="#ia-byok">Seguridad</a>
          <button className="hover:text-text-primary transition-colors" onClick={() => setPrivacyOpen(true)}>Privacidad y Términos</button>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-surface-card border border-border-strong rounded-full font-label-code text-[11px] text-accent-mint-deep">
          <span className="w-2 h-2 rounded-full bg-accent-mint-deep animate-pulse"></span>
          <span>Sistemas 100% Operativos</span>
        </div>
      </div>
    </footer>
  );
};
