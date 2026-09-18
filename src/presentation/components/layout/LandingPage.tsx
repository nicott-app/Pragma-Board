import React, { useEffect, useState } from 'react';
import { useUIStore } from '../../../application/store/useUIStore';

export const LandingPage: React.FC = () => {
  const setLoginOpen = useUIStore(s => s.setLoginOpen);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-s1)',
      color: 'var(--tx-primary)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header Sticky */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(15, 23, 42, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--bd-subtle)' : '1px solid transparent',
        padding: scrolled ? '0.75rem 5%' : '1.5rem 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/sprinto-logo.svg" alt="Sprinto Logo" width="32" height="32" style={{ borderRadius: '6px' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Sprinto</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Características</a>
          <a href="#security" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Seguridad (BYOK)</a>
          <a href="#pricing" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Precio</a>
          <button 
            className="btn btn-primary"
            onClick={() => setLoginOpen(true)}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '50px', fontWeight: 600 }}
          >
            Acceder
          </button>
        </nav>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Hero Section */}
        <section style={{
          padding: '10rem 5% 6rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: 'radial-gradient(ellipse at top, var(--bg-s2), var(--bg-s1) 70%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Glow */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{
            display: 'inline-block',
            padding: '0.4rem 1rem',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            color: 'var(--ac)',
            borderRadius: '50px',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginBottom: '2rem',
            letterSpacing: '0.5px'
          }}>
            NUEVA VERSIÓN 2.0 ✨
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
            fontWeight: 800,
            maxWidth: '900px',
            lineHeight: 1.1,
            margin: '0 0 1.5rem 0',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(to right, #fff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            La gestión ágil que tu equipo merece
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--tx-secondary)',
            maxWidth: '650px',
            lineHeight: 1.6,
            margin: '0 0 3rem 0',
            fontWeight: 400
          }}>
            Sprinto es la plataforma todo-en-uno que unifica tableros Kanban, cronogramas y analíticas de BI. 
            <strong> Trae tu propia IA (BYOK)</strong> y multiplica la productividad de tu equipo sin cuotas mensuales.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => setLoginOpen(true)}
              style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '8px', fontWeight: 600, boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' }}
            >
              Comenzar gratis
            </button>
            <a 
              href="#features"
              className="btn"
              style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '8px', fontWeight: 600, background: 'var(--bg-s2)', color: 'var(--tx-primary)', border: '1px solid var(--bd-subtle)', textDecoration: 'none' }}
            >
              Descubrir funciones
            </a>
          </div>

          {/* Abstract Dashboard Mockup */}
          <div style={{
            marginTop: '5rem',
            width: '100%',
            maxWidth: '1000px',
            height: '400px',
            background: 'var(--bg-s2)',
            borderRadius: '16px',
            border: '1px solid var(--bd-strong)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ height: '40px', borderBottom: '1px solid var(--bd-subtle)', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <div style={{ display: 'flex', flex: 1, padding: '1.5rem', gap: '1rem' }}>
              <div style={{ flex: 1, background: 'var(--bg-s1)', borderRadius: '8px', border: '1px solid var(--bd-subtle)', padding: '1rem' }}>
                <div style={{ width: '40%', height: '16px', background: 'var(--bd-strong)', borderRadius: '4px', marginBottom: '1rem' }} />
                <div style={{ width: '100%', height: '80px', background: 'var(--bd-subtle)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                <div style={{ width: '100%', height: '80px', background: 'var(--bd-subtle)', borderRadius: '4px' }} />
              </div>
              <div style={{ flex: 1, background: 'var(--bg-s1)', borderRadius: '8px', border: '1px solid var(--bd-subtle)', padding: '1rem' }}>
                <div style={{ width: '50%', height: '16px', background: 'var(--bd-strong)', borderRadius: '4px', marginBottom: '1rem' }} />
                <div style={{ width: '100%', height: '80px', background: 'var(--bd-subtle)', borderRadius: '4px', marginBottom: '0.5rem' }} />
              </div>
              <div style={{ flex: 1, background: 'var(--bg-s1)', borderRadius: '8px', border: '1px solid var(--bd-subtle)', padding: '1rem' }}>
                <div style={{ width: '30%', height: '16px', background: 'var(--bd-strong)', borderRadius: '4px', marginBottom: '1rem' }} />
                <div style={{ width: '100%', height: '80px', background: 'var(--bd-subtle)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                <div style={{ width: '100%', height: '80px', background: 'var(--bd-subtle)', borderRadius: '4px', marginBottom: '0.5rem' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Feature 1: Alternating Rows */}
        <section id="features" style={{ padding: '8rem 5%', background: 'var(--bg-s1)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>IA Integrada a tu manera</h2>
              <p style={{ color: 'var(--tx-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Automatiza la redacción de tickets con <strong>SmartCreate</strong> y genera informes diarios en un clic con nuestro <strong>Daily Standup</strong>. 
                Todo impulsado por Gemini AI, integrado de forma nativa en tu flujo de trabajo.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--tx-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ Redacción inteligente de Acceptance Criteria</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ Detección de esfuerzo (Story Points)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ Resúmenes automáticos para tu equipo</li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px', background: 'var(--bg-s2)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--bd-subtle)' }}>
              {/* Mockup IA */}
              <div style={{ background: 'var(--bg-s1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid var(--ac)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--ac)', fontWeight: 600, marginBottom: '0.25rem' }}>✨ IA Sugiere:</div>
                <div style={{ fontSize: '0.9rem' }}>Implementar autenticación de doble factor (2FA) en el panel de usuario.</div>
              </div>
              <div style={{ background: 'var(--bg-s1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--ac)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--ac)', fontWeight: 600, marginBottom: '0.25rem' }}>📋 Criterios de Aceptación:</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--tx-secondary)' }}>1. El usuario debe poder vincular Google Authenticator.<br/>2. Solicitar código tras login con éxito.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Reversed Row */}
        <section id="security" style={{ padding: '8rem 5%', background: 'var(--bg-s2)', borderTop: '1px solid var(--bd-subtle)', borderBottom: '1px solid var(--bd-subtle)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>Máxima privacidad con BYOK</h2>
              <p style={{ color: 'var(--tx-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Sprinto no te cobra por usar la IA y tampoco almacena tus tokens. Utilizamos el modelo <strong>Bring Your Own Key (BYOK)</strong>.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--tx-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🔒 Tus claves se cifran localmente con <strong>AES-256</strong>.</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💸 Paga directamente a Google (o usa la capa gratuita).</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🏢 Multitenant: cada empresa sus propios datos aislados.</li>
              </ul>
            </div>
            <div style={{ flex: '1 1 400px', background: 'var(--bg-s1)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--bd-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--bd-subtle)' }}>
                <span style={{ fontWeight: 600 }}>API Key de Gemini</span>
                <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Cifrado Activo</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', letterSpacing: '0.2rem', color: 'var(--tx-secondary)' }}>
                ••••••••••••••••••••••••
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section style={{ padding: '8rem 5%', background: 'var(--bg-s1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Desarrollado para la agilidad real</h2>
            <p style={{ color: 'var(--tx-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>No más herramientas dispersas. Todo el ecosistema de tu producto en una única pantalla de comandos.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
            {[
              { icon: '📊', title: 'Power BI Estimator', desc: 'Calcula horas de desarrollo de modelos semánticos en base a métricas DAX e importaciones.' },
              { icon: '🗺️', title: 'Diagramas de Gantt', desc: 'Vista de cronograma nativa para visualizar dependencias y rutas críticas de tu Release.' },
              { icon: '🌴', title: 'Gestor de Vacaciones', desc: 'Controla las bajas y disponibilidad del equipo para ajustar la capacidad del Sprint automáticamente.' },
              { icon: '📝', title: 'Notas Personales', desc: 'Un bloc de notas flotante e individual por cada proyecto. Tus pensamientos, sin salir del tablero.' }
            ].map((f, i) => (
              <div key={i} style={{ padding: '2rem', background: 'var(--bg-s2)', borderRadius: '16px', border: '1px solid var(--bd-subtle)', transition: 'transform 0.2s' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>{f.title}</h3>
                <p style={{ color: 'var(--tx-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing CTA */}
        <section id="pricing" style={{ padding: '6rem 5%', background: 'var(--ac)', color: 'white', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>100% Gratuito. Sin trucos.</h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem', opacity: 0.9 }}>
            Sprinto es una plataforma abierta. Solo necesitas tu cuenta de correo para empezar a gestionar tus proyectos ágiles.
          </p>
          <button 
            onClick={() => setLoginOpen(true)}
            style={{ 
              background: 'white', 
              color: 'var(--ac)', 
              border: 'none', 
              padding: '1rem 2.5rem', 
              fontSize: '1.1rem', 
              borderRadius: '8px', 
              fontWeight: 700, 
              cursor: 'pointer',
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)'
            }}
          >
            Crear cuenta gratuita ahora
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '3rem 5%',
        background: 'var(--bg-s2)',
        borderTop: '1px solid var(--bd-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <a href="#" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Características</a>
          <button onClick={() => {
            import('../../../application/store/useUIStore').then(({ useUIStore }) => {
              useUIStore.getState().setPrivacyOpen(true);
            });
          }} style={{ background: 'none', border: 'none', color: 'var(--tx-secondary)', fontSize: '0.9rem', cursor: 'pointer', padding: 0 }}>
            Términos y Privacidad
          </button>
          <a href="#" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Soporte</a>
        </div>
        <div style={{ color: 'var(--tx-muted)', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} Sprinto. Diseñado para equipos de alto rendimiento.
        </div>
      </footer>
    </div>
  );
};
