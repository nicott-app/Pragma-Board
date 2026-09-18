import React, { useState } from 'react';
import { useUIStore } from '../../../application/store/useUIStore';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Botón con efecto Glassmorphism/3D
  const glassButtonClass = "inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-indigo-600/80 hover:bg-indigo-500/90 backdrop-blur-md border border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_8px_20px_rgba(99,102,241,0.4)] rounded-full transition-all active:scale-[0.98]";
  const secondaryGlassButtonClass = "inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-slate-800 dark:text-white bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 backdrop-blur-md border border-white/50 dark:border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_4px_10px_rgba(0,0,0,0.05)] rounded-full transition-all active:scale-[0.98]";

  return (
    <div className="landing-page-root bg-slate-50 dark:bg-[#0b1326] text-slate-800 dark:text-on-surface antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      
      {/* Video Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8">
          <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setShowDemo(false)}
                className="w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {/* Aquí iría el src real del vídeo DEMO */}
            <div className="aspect-video w-full bg-slate-800 flex flex-col items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">play_circle</span>
              <p className="text-lg">Vídeo Demo de Sprinto</p>
              <p className="text-sm opacity-70">(Reemplazar el archivo /demo.mp4 en la carpeta public)</p>
              {/* <video src="/demo.mp4" controls autoPlay className="w-full h-full object-cover" /> */}
            </div>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-[#0B1326]/90 backdrop-blur-xl border-b border-slate-200 dark:border-outline-variant/40 shadow-sm dark:shadow-none">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a className="flex items-center gap-2.5 group" href="#">
              <img src="/sprinto-logo.svg" alt="Sprinto Logo" width={32} height={32} className="rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              <span className="font-headline text-xl text-slate-900 dark:text-white font-bold tracking-tight">Sprinto</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-on-surface-variant font-medium">
              <a className="hover:text-indigo-600 dark:hover:text-white transition-colors" href="#caracteristicas">Características</a>
              <a className="hover:text-indigo-600 dark:hover:text-white transition-colors" href="#ia-byok">Seguridad & BYOK</a>
              <a className="hover:text-indigo-600 dark:hover:text-white transition-colors" href="#herramientas">Ecosistema</a>
              <a className="hover:text-indigo-600 dark:hover:text-white transition-colors" href="#faq">Preguntas Frecuentes</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Cambiar tema claro u oscuro" className="relative inline-flex items-center justify-between w-16 h-8 px-1 rounded-full bg-slate-200/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all shadow-inner" onClick={toggleTheme} type="button">
              <span className="sr-only">Alternar modo claro y oscuro</span>
              <span className="flex items-center justify-center w-6 h-6 text-[14px] transition-transform select-none">
                <span className="material-symbols-outlined text-[16px] text-amber-500 dark:text-slate-500">light_mode</span>
              </span>
              <span className="flex items-center justify-center w-6 h-6 text-[14px] transition-transform select-none">
                <span className="material-symbols-outlined text-[15px] text-slate-400 dark:text-indigo-300">dark_mode</span>
              </span>
              <span className="absolute top-1 left-1 dark:left-auto dark:right-1 w-6 h-6 rounded-full bg-white dark:bg-indigo-600 shadow-md transform transition-all duration-300 flex items-center justify-center pointer-events-none">
                <span className="material-symbols-outlined text-[14px] text-amber-500 dark:hidden">sunny</span>
                <span className="material-symbols-outlined text-[14px] text-white hidden dark:inline">nights_stay</span>
              </span>
            </button>
            <button className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 rounded-lg transition-all" onClick={() => setLoginOpen(true)}>
              Acceder
            </button>
            <button className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur-md border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_10px_rgba(99,102,241,0.3)] rounded-full transition-all active:scale-[0.98]" onClick={() => setLoginOpen(true)}>
              Empezar gratis
            </button>
          </div>
        </div>
      </header>

      <main className="w-full pt-16 bg-slate-50 dark:bg-[#0B1326] transition-colors duration-200">
        <div className="flex flex-col w-full">
          
          {/* 1. Hero Section */}
          <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pb-28 flex flex-col items-center text-center">
            {/* Atmospheric Ambient Glows */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-indigo-500/15 dark:from-indigo-600/25 via-purple-500/10 dark:via-purple-600/20 to-sky-400/15 dark:to-sky-500/15 blur-[120px] pointer-events-none -z-10 rounded-full"></div>
            <div className="absolute top-48 left-1/3 w-[300px] h-[250px] bg-indigo-400/15 dark:bg-indigo-500/15 blur-[90px] pointer-events-none -z-10 rounded-full"></div>
            
            {/* Pill Badge */}
            <a className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/50 dark:border-indigo-500/30 hover:border-indigo-400 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(99,102,241,0.15)] mb-8" href="#ia-byok">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                NUEVA VERSIÓN 2.0 ✨
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">Descubre Gemini IA y BYOK →</span>
            </a>
            
            {/* Main Headline */}
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] text-slate-900 dark:text-white tracking-tight leading-[1.1] font-extrabold max-w-3xl mb-6">
                La gestión ágil que tu equipo merece
              </h1>
              <p className="font-body text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-10">
                Sprinto es la plataforma todo-en-uno que unifica tableros Kanban interactivos, cronogramas y analíticas. <strong className="text-slate-800 dark:text-slate-200 font-semibold">Trae tu propia IA (BYOK)</strong> y multiplica la productividad de tu equipo.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center mb-6">
                <button className={glassButtonClass} onClick={() => setShowDemo(true)}>
                  <span className="material-symbols-outlined text-[20px]">play_circle</span>
                  <span>Ver Demo de la Herramienta</span>
                </button>
                <button className={secondaryGlassButtonClass} onClick={() => setLoginOpen(true)}>
                  <span>Empezar gratis</span>
                </button>
              </div>
              
              {/* Microcopy Guarantee */}
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wide flex items-center gap-2">
                <span>100% Gratuito</span>
                <span>·</span>
                <span>Tus datos, tu control</span>
                <span>·</span>
                <span>Open Export</span>
              </p>
            </div>
          </section>

          {/* 2. Captura Real de la Aplicación */}
          <section className="w-full px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-10 mb-28 max-w-6xl mx-auto" id="caracteristicas">
            <div className="relative rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] p-2 sm:p-4 overflow-hidden group cursor-pointer" onClick={() => setShowDemo(true)}>
              {/* Play Overlay Hover */}
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                  <span className="material-symbols-outlined text-white text-5xl">play_arrow</span>
                </div>
              </div>

              {/* Mac Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md rounded-t-xl border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm"></div>
                <div className="ml-4 text-xs font-mono text-slate-500 dark:text-slate-400">sprinto-board.web.app</div>
              </div>
              
              {/* Contenedor de la Captura Real */}
              <div className="w-full bg-slate-900 rounded-b-xl overflow-hidden aspect-[16/9] relative">
                {/* 
                  Aquí debes colocar la captura real de la herramienta.
                  Por defecto usaremos un color sólido como placeholder.
                  Añade tu imagen en /public/captura-app.png
                */}
                <img 
                  src="/captura-app.png" 
                  alt="Captura real del tablero Sprinto" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback visual si no existe la imagen aún
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* Fallback en caso de que falte la imagen */}
                <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-800">
                  <span className="material-symbols-outlined text-4xl mb-2">image</span>
                  <p>Añade la captura real en <code>/public/captura-app.png</code></p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Sección Principal de Innovación: "IA Integrada" & "BYOK" */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-6xl mx-auto" id="ia-byok">
            {/* Bloque 1: IA Integrada */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-28">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-2xl mb-6 shadow-sm dark:shadow-md">🤖</div>
                <h2 className="font-headline text-3xl sm:text-4xl text-slate-900 dark:text-white font-bold tracking-tight mb-4">
                  IA Integrada a tu manera
                </h2>
                <p className="font-body text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6">
                  Deja que <strong className="text-slate-800 dark:text-slate-200">SmartCreate</strong> redacte historias de usuario, detecte dependencias e infiera los Story Points. Todo a través de la potente inteligencia de Gemini AI y completamente adaptado a tu estilo de escritura.
                </p>
                <ul className="space-y-3 font-body text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">✅</span>
                    <span><strong>Acceptance Criteria automáticos</strong> leyendo descripciones breves.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">✅</span>
                    <span><strong>Inferencia de esfuerzo</strong> (Story Points) basada en la complejidad.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">✅</span>
                    <span><strong>Daily Standups instantáneos</strong> resumiendo tu actividad de ayer y bloqueos.</span>
                  </li>
                </ul>
              </div>
              
              {/* Preview Mockup IA */}
              <div className="bg-gradient-to-b from-white to-slate-100 dark:from-[#131d36] dark:to-[#0d1527] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 shadow-xl dark:shadow-2xl space-y-4">
                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-500/30 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
                    <span>✨ IA Generando Resumen de Bloqueos:</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                    "Ayer me bloqueé esperando credenciales de AWS. Hoy me centraré en revisar la PR del endpoint de Auth y lanzar el modelo semántico..."
                  </p>
                </div>
              </div>
            </div>

            {/* Bloque 2: Máxima privacidad con BYOK */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Mockup API Key Box */}
              <div className="order-2 lg:order-1 bg-gradient-to-b from-white to-slate-100 dark:from-[#131d36] dark:to-[#0d1527] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 shadow-xl dark:shadow-2xl">
                <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-indigo-600 dark:text-indigo-400">key</span>
                      Tu API Key de Gemini
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                      AES-256 Activo
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-3 font-mono text-sm tracking-widest text-slate-500 dark:text-slate-400 flex items-center justify-between shadow-inner">
                    <span>••••••••••••••••••••••••••••••••</span>
                    <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">lock</span>
                  </div>
                  <div className="mt-3 text-center text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    Almacenada solo en tu navegador local
                  </div>
                </div>
              </div>
              
              {/* Text content */}
              <div className="order-1 lg:order-2">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-2xl mb-6 shadow-sm dark:shadow-md">🔐</div>
                <h2 className="font-headline text-3xl sm:text-4xl text-slate-900 dark:text-white font-bold tracking-tight mb-4">
                  Privacidad Corporativa Absoluta
                </h2>
                <p className="font-body text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6">
                  Entendemos que el código de tu empresa es confidencial. Usamos el modelo <strong className="text-slate-800 dark:text-slate-200">Bring Your Own Key (BYOK)</strong>: Sprinto jamás actúa de intermediario en tus peticiones de IA.
                </p>
                <ul className="space-y-3 font-body text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-3">
                    <span className="text-amber-500 dark:text-amber-400 text-lg">🔒</span>
                    <span>Tus claves se cifran localmente y jamás viajan a nuestro backend.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 text-lg">💸</span>
                    <span><strong>Ahorro absoluto:</strong> Paga la inferencia por uso directo a Google.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-sky-600 dark:text-sky-400 text-lg">🏢</span>
                    <span>Aislamiento <strong>Multitenant</strong> seguro para empresas enteras.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Herramientas Avanzadas - Expandido */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-24 bg-slate-100 dark:bg-[#070D1A] border-y border-slate-200 dark:border-slate-900" id="herramientas">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col items-center text-center mb-16">
                <h2 className="font-headline text-3xl sm:text-4xl text-slate-900 dark:text-white font-bold tracking-tight mb-3">
                  Ecosistema Completo de Productividad
                </h2>
                <p className="font-body text-slate-600 dark:text-slate-400 text-base max-w-2xl">
                  Reemplaza el caos de múltiples suscripciones. Hemos construido desde cero todas las funcionalidades que necesita un equipo técnico maduro.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tableros */}
                <div className="group bg-white dark:bg-[#0F172A]/80 hover:bg-slate-50 dark:hover:bg-[#131d36] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md md:col-span-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">📋</div>
                  <h3 className="font-headline text-lg font-semibold text-slate-900 dark:text-white mb-2">Tableros Reactivos al Milisegundo</h3>
                  <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    El corazón de Sprinto. Mueve tickets con fluidez total, agrupa tareas por Responsable, Épica o Estado en vivo, sin molestas recargas de página ni spinners eternos gracias a nuestro motor optimizado.
                  </p>
                </div>
                {/* Gantt */}
                <div className="group bg-white dark:bg-[#0F172A]/80 hover:bg-slate-50 dark:hover:bg-[#131d36] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">🗺️</div>
                  <h3 className="font-headline text-lg font-semibold text-slate-900 dark:text-white mb-2">Roadmaps & Gantt</h3>
                  <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Analiza rutas críticas y visualiza cuellos de botella mediante diagramas de Gantt interactivos autogenerados.
                  </p>
                </div>
                {/* Power BI */}
                <div className="group bg-white dark:bg-[#0F172A]/80 hover:bg-slate-50 dark:hover:bg-[#131d36] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">📊</div>
                  <h3 className="font-headline text-lg font-semibold text-slate-900 dark:text-white mb-2">Power BI Estimator</h3>
                  <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Estandariza cotizaciones evaluando complejidad DAX, orígenes de datos y limpieza de esquemas.
                  </p>
                </div>
                {/* Vacaciones */}
                <div className="group bg-white dark:bg-[#0F172A]/80 hover:bg-slate-50 dark:hover:bg-[#131d36] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">🌴</div>
                  <h3 className="font-headline text-lg font-semibold text-slate-900 dark:text-white mb-2">Gestión de Ausencias</h3>
                  <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Registra y unifica las vacaciones de los desarrolladores para recalcular la velocidad del sprint.
                  </p>
                </div>
                {/* Filtros */}
                <div className="group bg-white dark:bg-[#0F172A]/80 hover:bg-slate-50 dark:hover:bg-[#131d36] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">🔍</div>
                  <h3 className="font-headline text-lg font-semibold text-slate-900 dark:text-white mb-2">Filtros Avanzados</h3>
                  <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Búsqueda instantánea. Visualiza únicamente los tickets asignados a ti, o filtra por prioridad, etiquetas o estado.
                  </p>
                </div>
                {/* Open Export */}
                <div className="group bg-white dark:bg-[#0F172A]/80 hover:bg-slate-50 dark:hover:bg-[#131d36] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">📦</div>
                  <h3 className="font-headline text-lg font-semibold text-slate-900 dark:text-white mb-2">Import / Export JSON</h3>
                  <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Eres dueño de tu información. Importa proyectos enteros o exporta copias de seguridad de tu Kanban con 1 clic.
                  </p>
                </div>
                {/* Notas Personales */}
                <div className="group bg-white dark:bg-[#0F172A]/80 hover:bg-slate-50 dark:hover:bg-[#131d36] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">📝</div>
                  <h3 className="font-headline text-lg font-semibold text-slate-900 dark:text-white mb-2">Notas Privadas Flotantes</h3>
                  <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Un bloc Markdown anclado a tus proyectos para borradores o reuniones 1-a-1 sin abandonar el flujo de código.
                  </p>
                </div>
                {/* Sincronización Realtime */}
                <div className="group bg-white dark:bg-[#0F172A]/80 hover:bg-slate-50 dark:hover:bg-[#131d36] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">⚡</div>
                  <h3 className="font-headline text-lg font-semibold text-slate-900 dark:text-white mb-2">Real-Time Sync</h3>
                  <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Colabora en tiempo real con todo tu equipo técnico. Los movimientos y comentarios aparecen al instante.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Pricing CTO */}
          <section className="w-full bg-[#6366F1] py-24 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden" id="precio">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500 via-indigo-600 to-indigo-700 pointer-events-none"></div>
            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
              <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                Paga $0 por usuario. Siempre.
              </h2>
              <p className="font-body text-indigo-100 text-base sm:text-xl max-w-2xl leading-relaxed mb-10">
                Sprinto es una plataforma abierta diseñada por y para desarrolladores. Sin muros de pago, sin límites de proyectos.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-indigo-700 bg-white/90 hover:bg-white backdrop-blur-md border border-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] rounded-full transition-all active:scale-[0.98]" onClick={() => setLoginOpen(true)}>
                  Crear cuenta gratis ahora
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-indigo-900/30 hover:bg-indigo-900/50 backdrop-blur-md border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-full transition-all active:scale-[0.98]" onClick={() => setShowDemo(true)}>
                  <span className="material-symbols-outlined">play_circle</span> Ver Demo
                </button>
              </div>
              <span className="text-sm text-indigo-200 mt-6 font-medium">
                Sin tarjetas de crédito · Trae tu propia clave Gemini · Datos exportables
              </span>
            </div>
          </section>

          {/* 6. FAQ Section */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-20 max-w-4xl mx-auto" id="faq">
            <h3 className="font-headline text-3xl text-slate-900 dark:text-white font-bold text-center mb-10">
              Preguntas Frecuentes
            </h3>
            <div className="space-y-4 text-sm font-body">
              {[
                { q: '¿Por qué es gratuita y no un modelo de suscripción?', a: 'Sprinto fue concebida para romper las barreras de las costosas herramientas corporativas. Al usar el modelo BYOK (Bring Your Own Key), nosotros no cubrimos costes de servidores de inteligencia artificial por ti, lo que nos permite ofrecer la aplicación gratuitamente.' },
                { q: '¿Están seguras mis API Keys de Google Gemini?', a: 'Totalmente seguras. Sprinto no recibe ni almacena tus claves en bases de datos. Se encriptan en tu propio navegador usando el algoritmo avanzado AES-256 GCM y solo viajan desde tu ordenador directamente a los servidores de Google.' },
                { q: '¿Puedo colaborar con mi equipo de trabajo o es de uso individual?', a: '¡Por supuesto! Puedes crear proyectos compartidos, invitar a miembros de tu empresa e integrarlos en un ecosistema "Multitenant". Las tareas, comentarios y prioridades se sincronizarán en tiempo real para todos gracias a la tecnología de Firebase.' },
                { q: '¿Qué ocurre si quiero llevar mis datos a otro sistema?', a: 'Garantizamos tu portabilidad. Tienes un módulo de Importación/Exportación nativo que te permite descargar todos los tickets e historia de tu proyecto en formato JSON limpio con un solo clic.' },
                { q: '¿Qué modelos de IA soporta actualmente?', a: 'Actualmente Sprinto soporta nativamente la familia de modelos de Google Gemini (gemini-1.5-flash y pro) mediante la API Key que proporciones, garantizando ventanas de contexto enormes y un razonamiento excelente para metodologías ágiles.' }
              ].map((faq, i) => (
                <div key={i} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all">
                  <button 
                    onClick={() => toggleFaq(i)}
                    className="w-full text-left px-6 py-5 font-semibold text-slate-900 dark:text-white flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-900/50 text-base"
                  >
                    {faq.q}
                    <span className="material-symbols-outlined text-slate-400 transition-transform duration-200" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      expand_more
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4 text-base">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-100 dark:bg-[#060e20] border-t border-slate-200 dark:border-slate-800/80 py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <img src="/sprinto-logo.svg" alt="Sprinto Logo" width={28} height={28} className="rounded-md" />
              <span className="font-headline text-lg font-bold text-slate-900 dark:text-white tracking-tight">Sprinto</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <a className="hover:text-indigo-600 dark:hover:text-white transition-colors" href="#caracteristicas">Características</a>
              <a className="hover:text-indigo-600 dark:hover:text-white transition-colors" href="#ia-byok">Seguridad</a>
              <button className="hover:text-indigo-600 dark:hover:text-white transition-colors" onClick={() => {
                import('../../../application/store/useUIStore').then(({ useUIStore }) => {
                  useUIStore.getState().setPrivacyOpen(true);
                });
              }}>Privacidad y Términos</button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-emerald-600 dark:text-emerald-400 font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              <span>Sistemas 100% Operativos</span>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} Sprinto. Plataforma ágil con IA bajo modelo BYOK.</p>
            <div className="flex gap-4">
              <span>Construido para el alto rendimiento</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
