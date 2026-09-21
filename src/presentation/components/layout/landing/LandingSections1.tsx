import React from 'react';
import { useUIStore } from '../../../../application/store/useUIStore';

// 1. NAVBAR
export const LandingNavbar: React.FC = () => {
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-canvas/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 max-w-[1200px] mx-auto px-margin-mobile md:px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <a className="flex items-center gap-space-sm" href="#">
            <img alt="Sprinto Brand Logo" className="h-8 w-auto object-contain" src="/sprinto-logo.svg" />
            <span className="font-headline-sm text-headline-sm text-text-primary tracking-tight">Sprinto</span>
          </a>
          <nav className="hidden md:flex items-center gap-space-sm">
            <a className="px-space-sm py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Producto</a>
            <a className="px-space-sm py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Funcionalidades</a>
            <a className="px-space-sm py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">IA</a>
            <a className="px-space-sm py-space-xs font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Recursos</a>
          </nav>
        </div>
        <div className="flex items-center gap-space-md">
          <button onClick={() => setLoginOpen(true)} className="hidden sm:inline-block font-body-sm text-body-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
            Iniciar sesión
          </button>
          <button onClick={() => setLoginOpen(true)} className="h-9 px-space-md flex items-center justify-center font-body-sm text-body-sm text-on-primary bg-text-primary hover:bg-inverse-surface rounded-xl transition-all cursor-pointer">
            Empezar gratis
          </button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// 2. HERO
export const LandingHero: React.FC = () => {
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);

  return (
    <section className="w-full pt-12 pb-20 px-margin-mobile md:px-margin max-w-[1200px] mx-auto flex flex-col items-center text-center">
      {/* Refined Badge */}
      <div className="inline-flex items-center gap-space-sm px-space-md py-1 rounded-full bg-surface-card shadow-sm mb-space-lg hover:shadow transition-all cursor-default">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-mint-deep"></span>
        </span>
        <span className="font-label-code text-label-code text-text-secondary tracking-tight">
          Sprinto 2.0 <span className="text-text-muted">/</span> Diseñado para equipos de alta cadencia
        </span>
      </div>
      
      {/* Main Headline */}
      <h1 className="font-display text-headline-lg-mobile md:text-display font-semibold tracking-tight text-text-primary max-w-4xl mb-space-md">
        Del trabajo pendiente al trabajo hecho.
      </h1>
      
      {/* Subheadline */}
      <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary max-w-2xl mb-space-xl">
        Organiza proyectos, epics, tickets y el ritmo de tu equipo desde un único espacio de alta velocidad. Con inteligencia integrada donde aporta valor real, sin fricción.
      </p>
      
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-space-md mb-space-md w-full sm:w-auto">
        <button onClick={() => setLoginOpen(true)} className="w-full sm:w-auto h-10 px-space-lg bg-text-primary hover:bg-inverse-surface text-on-primary font-body-sm font-medium rounded-lg flex items-center justify-center gap-space-xs shadow-sm hover:translate-y-[-1px] transition-all cursor-pointer">
          <span>Empezar gratis</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <button className="w-full sm:w-auto h-10 px-space-lg bg-surface-card hover:bg-surface text-text-primary font-body-sm font-medium rounded-lg shadow-sm hover:translate-y-[-1px] transition-all flex items-center justify-center gap-space-xs cursor-pointer" onClick={() => {
            const el = document.getElementById('demo-section');
            if(el) el.scrollIntoView({behavior: 'smooth'});
        }}>
          <span className="material-symbols-outlined text-[18px] text-text-muted">play_circle</span>
          <span>Ver cómo funciona</span>
        </button>
      </div>
      
      {/* Meta note */}
      <p className="font-label-meta text-label-meta text-text-muted mb-16 tracking-normal">
        Prueba de 14 días sin tarjeta <span className="mx-1">·</span> Configuración en 2 minutos <span className="mx-1">·</span> Migración en 1 clic desde Jira y Linear
      </p>
      
      {/* HERO VISUAL SHOWCASE */}
      <div className="w-full rounded-xl bg-surface-card shadow-xl overflow-hidden text-left relative aspect-[1440/800] border border-border-strong/40">
        <img 
          src="/captura-app-v2.png" 
          alt="Captura real del tablero Sprinto" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden absolute inset-0 flex items-center justify-center bg-surface-canvas text-text-secondary font-body-md text-center p-4">
          Añade tu imagen en /public/captura-app-v2.png
        </div>
      </div>
    </section>
  );
};



// 4. THE PROBLEM
export const LandingProblem: React.FC = () => {
  return (
    <section className="w-full py-28 px-margin-mobile md:px-margin max-w-[1200px] mx-auto">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-space-xl">
        <span className="font-label-meta text-label-meta uppercase tracking-wider text-text-muted mb-space-xs">Fricción operacional</span>
        <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-text-primary font-semibold tracking-tight mb-space-sm">
          ¿Por qué gestionar el trabajo se siente como otro trabajo?
        </h2>
        <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary">
          Demasiadas herramientas. Demasiado seguimiento. Demasiado tiempo gestionando el trabajo en lugar de hacerlo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* El Caos Habitual */}
        <div className="bg-surface-card p-space-lg md:p-space-xl rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-space-xs mb-space-md text-error">
              <span className="material-symbols-outlined text-[20px]">cancel</span>
              <span className="font-label-code text-label-code uppercase tracking-wider font-semibold">El caos habitual</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-medium text-text-primary mb-space-md">
              Sistemas fragmentados y burocracia paralizante
            </h3>
            <ul className="space-y-space-md text-body-md text-text-secondary">
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-text-muted shrink-0 mt-0.5">tab_unselected</span>
                <span><strong>5 aplicaciones desconectadas:</strong> Documentos en Notion, tickets lentos en Jira, chat desordenado en Slack y código en GitHub.</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-text-muted shrink-0 mt-0.5">edit_attributes</span>
                <span><strong>40 campos obligatorios:</strong> Formularios eternos para registrar un bug menor de frontend de 5 minutos.</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-text-muted shrink-0 mt-0.5">sync_problem</span>
                <span><strong>Sincronizaciones rotas:</strong> Los tickets nunca reflejan el código real desplegado en producción.</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-text-muted shrink-0 mt-0.5">groups</span>
                <span><strong>Reuniones de estatus infinitas:</strong> 45 minutos diarios de "qué hiciste ayer" que pudieron ser un log automático.</span>
              </li>
            </ul>
          </div>
          <div className="mt-space-lg p-space-md bg-surface-canvas rounded-lg">
            <div className="font-label-code text-[11px] text-text-muted uppercase mb-1">Impacto medible</div>
            <p className="font-headline-sm text-headline-sm font-semibold text-text-primary">-32% de tiempo de ingeniería efectiva al mes</p>
          </div>
        </div>

        {/* Con Sprinto */}
        <div className="bg-surface-card p-space-lg md:p-space-xl rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden ring-1 ring-border-strong">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-bl-full pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-space-xs mb-space-md text-accent-mint-deep">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span className="font-label-code text-label-code uppercase tracking-wider font-semibold">Con Sprinto</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-space-md">
              Un plano de control unificado, ágil y reactivo
            </h3>
            <ul className="space-y-space-md text-body-md text-text-primary">
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-accent-mint-deep shrink-0 mt-0.5">layers</span>
                <span><strong>Un único sistema unificado:</strong> Epics, historias, bugs e integraciones bajo un mismo canvas de baja latencia.</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-accent-mint-deep shrink-0 mt-0.5">bolt</span>
                <span><strong>Respuesta en menos de 50ms:</strong> Creación y edición con atajos de teclado instantáneos. Cero spinners de carga.</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-accent-mint-deep shrink-0 mt-0.5">cable</span>
                <span><strong>Flujo directo con Git:</strong> El estado del ticket progresa automáticamente al abrir, revisar y mergear un Pull Request.</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-accent-mint-deep shrink-0 mt-0.5">auto_awesome</span>
                <span><strong>Actualizaciones asíncronas automáticas:</strong> La IA contextual sintetiza el progreso diario sin interrumpir a los desarrolladores.</span>
              </li>
            </ul>
          </div>
          <div className="mt-space-lg p-space-md bg-surface-canvas rounded-lg">
            <div className="font-label-code text-[11px] text-accent-mint-deep uppercase mb-1 font-semibold">Cadencia acelerada</div>
            <p className="font-headline-sm text-headline-sm font-semibold text-text-primary">+4.2x velocidad de resolución de incidencias</p>
          </div>
        </div>
      </div>
    </section>
  );
};
