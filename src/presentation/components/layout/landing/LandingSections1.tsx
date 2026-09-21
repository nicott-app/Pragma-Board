import React from 'react';
import { useUIStore } from '../../../../application/store/useUIStore';

// 1. NAVBAR
export const LandingNavbar: React.FC = () => {
  const setLoginOpen = useUIStore((state) => state.setLoginOpen);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-canvas/80 backdrop-blur-md border-b border-border-muted transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-margin-mobile md:px-margin h-16 flex items-center justify-between">
        <div className="flex items-center gap-space-xs text-text-primary">
          <img src="/sprinto-logo.svg" alt="Sprinto Logo" width={32} height={32} className="rounded-md" />
          <span className="font-headline-sm font-bold tracking-tight">Sprinto</span>
        </div>
        <div className="hidden md:flex items-center gap-space-md font-body-sm font-medium">
          <button className="text-text-secondary hover:text-text-primary transition-colors px-2 py-1" onClick={() => setLoginOpen(true)}>Iniciar Sesión</button>
          <button className="btn-glass px-4 py-2 text-button font-button rounded-full" onClick={() => setLoginOpen(true)}>Empezar gratis</button>
        </div>
      </div>
    </nav>
  );
};

// 2. HERO
export const LandingHero: React.FC = () => {
  const setLoginOpen = useUIStore((state) => state.setLoginOpen);

  return (
    <section className="w-full flex flex-col items-center text-center pt-24 pb-20 px-margin-mobile md:px-margin max-w-[1200px] mx-auto">
      {/* Badge */}
      <div className="mb-space-lg flex items-center gap-2 bg-surface-card border border-border-strong px-3 py-1.5 rounded-full font-label-code text-label-code text-text-secondary shadow-sm">
        <span className="w-2 h-2 rounded-full bg-accent-mint-deep animate-pulse"></span>
        Sprinto 2.0 ya disponible
      </div>
      
      {/* Headline */}
      <h1 className="font-headline-lg text-4xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-text-primary mb-space-md max-w-4xl leading-[1.05]">
        La gestión ágil que <span className="text-text-muted">tu equipo merece.</span>
      </h1>
      
      {/* Subheadline */}
      <p className="font-body-lg text-[18px] md:text-[22px] text-text-secondary mb-space-xl max-w-2xl leading-relaxed">
        Tableros ultra rápidos, integración nativa con Gemini y cero lock-in. Todo lo que necesitas para ejecutar sprints, sin la complejidad que odias.
      </p>
      
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-space-sm mb-space-lg w-full sm:w-auto">
        <button 
          className="btn-glass px-8 py-4 text-[17px] font-button rounded-full w-full sm:w-auto"
          onClick={() => setLoginOpen(true)}>
          Empezar gratis
        </button>
        <button 
          className="btn-glass-secondary px-8 py-4 text-[17px] font-button rounded-full w-full sm:w-auto flex items-center justify-center gap-2"
          onClick={() => {
            const el = document.getElementById('demo-section');
            if(el) el.scrollIntoView({behavior: 'smooth'});
        }}>
          <span className="material-symbols-outlined text-[20px]">play_circle</span>
          <span>Ver cómo funciona</span>
        </button>
      </div>
      
      {/* Meta note */}
      <p className="font-label-meta text-label-meta text-text-muted mb-16 tracking-normal">
        Modelo BYOK sin cuotas ocultas <span className="mx-1">·</span> Configuración en 2 minutos <span className="mx-1">·</span> Exportación a JSON en 1 clic
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
        <span className="font-label-meta text-label-meta uppercase tracking-wider text-text-muted mb-space-xs">Fricción operacional vs Sprinto</span>
        <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-text-primary font-semibold tracking-tight mb-space-sm">
          ¿Por qué pagar por usuario y funcionalidades de IA bloqueadas?
        </h2>
        <p className="font-body-lg text-body-md md:text-body-lg text-text-secondary">
          Las herramientas actuales cobran por cada miembro de tu equipo y reservan sus asistentes inteligentes para los planes más costosos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* El Caos Habitual */}
        <div className="bg-surface-card p-space-lg md:p-space-xl rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-space-xs mb-space-md text-error">
              <span className="material-symbols-outlined text-[20px]">cancel</span>
              <span className="font-label-code text-label-code uppercase tracking-wider font-semibold">Herramientas corporativas</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-medium text-text-primary mb-space-md">
              Suscripciones costosas y características restringidas
            </h3>
            <ul className="space-y-space-md text-body-md text-text-secondary">
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-text-muted shrink-0 mt-0.5">payments</span>
                <span><strong>Planes por usuario:</strong> Modelos de negocio donde cada nuevo miembro del equipo engorda la factura a final de mes.</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-text-muted shrink-0 mt-0.5">lock</span>
                <span><strong>IA como un lujo:</strong> Las funcionalidades de inteligencia artificial siempre están bloqueadas en los tiers "Enterprise".</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-text-muted shrink-0 mt-0.5">speed</span>
                <span><strong>Curva de aprendizaje:</strong> Interfaces saturadas de opciones complejas y menús anidados que tu equipo casi nunca necesita usar.</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-text-muted shrink-0 mt-0.5">vpn_key_off</span>
                <span><strong>Datos secuestrados:</strong> Obstáculos constantes para exportar libremente tu información cuando decides migrar.</span>
              </li>
            </ul>
          </div>
          <div className="mt-space-lg p-space-md bg-surface-canvas rounded-lg">
            <div className="font-label-code text-[11px] text-text-muted uppercase mb-1">El resultado habitual</div>
            <p className="font-headline-sm text-headline-sm font-semibold text-text-primary">Costes recurrentes altos y adopción lenta</p>
          </div>
        </div>

        {/* Con Sprinto */}
        <div className="bg-surface-card p-space-lg md:p-space-xl rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden ring-1 ring-border-strong">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-bl-full pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-space-xs mb-space-md text-accent-mint-deep">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span className="font-label-code text-label-code uppercase tracking-wider font-semibold">El modelo Sprinto</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-space-md">
              Gestión ágil, en tiempo real y 100% libre de cuotas
            </h3>
            <ul className="space-y-space-md text-body-md text-text-primary">
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-accent-mint-deep shrink-0 mt-0.5">key</span>
                <span><strong>Modelo BYOK (Bring Your Own Key):</strong> Trae tu propia clave de Google Gemini. Paga céntimos directamente al proveedor sin recargos.</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-accent-mint-deep shrink-0 mt-0.5">bolt</span>
                <span><strong>Colaboración en vivo:</strong> Arquitectura basada en Firebase Firestore que sincroniza cada cambio de estado o texto en tiempo real para todos.</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-accent-mint-deep shrink-0 mt-0.5">code</span>
                <span><strong>Centrado en el desarrollador:</strong> Soporte Markdown avanzado y un diseño Kanban fluido que se siente ligero y extremadamente responsivo.</span>
              </li>
              <li className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-accent-mint-deep shrink-0 mt-0.5">download</span>
                <span><strong>Tus datos son tuyos:</strong> Modulo de importación y exportación de un clic. Descarga una copia de seguridad en JSON siempre que lo desees.</span>
              </li>
            </ul>
          </div>
          <div className="mt-space-lg p-space-md bg-surface-canvas rounded-lg">
            <div className="font-label-code text-[11px] text-accent-mint-deep uppercase mb-1 font-semibold">Ventaja directa</div>
            <p className="font-headline-sm text-headline-sm font-semibold text-text-primary">Adopción inmediata y $0 de coste por asiento</p>
          </div>
        </div>
      </div>
    </section>
  );
};
