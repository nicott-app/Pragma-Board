import React from 'react';
import { useUIStore } from '../../../application/store/useUIStore';

export const LandingPage: React.FC = () => {
  const setLoginOpen = useUIStore(s => s.setLoginOpen);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-s1)',
      color: 'var(--tx-primary)',
      overflowY: 'auto',
      position: 'relative'
    }}>
      {/* Navbar Minimalista */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 5%',
        borderBottom: '1px solid var(--bd-subtle)',
        background: 'var(--bg-s2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/sprinto-logo.svg" alt="Sprinto Logo" width="36" height="36" style={{ borderRadius: '6px' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Sprinto</span>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setLoginOpen(true)}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.95rem' }}
        >
          Iniciar sesión
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, var(--bg-s2), var(--bg-s1))'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          background: 'var(--ac-bg)',
          color: 'var(--ac)',
          borderRadius: '50px',
          fontWeight: 600,
          fontSize: '0.875rem',
          marginBottom: '1.5rem'
        }}>
          🚀 Ágil, Gratuito y Potenciado por IA
        </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          maxWidth: '800px',
          lineHeight: 1.1,
          margin: '0 0 1.5rem 0',
          letterSpacing: '-0.02em'
        }}>
          Organiza tus proyectos sin límites
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--tx-secondary)',
          maxWidth: '600px',
          lineHeight: 1.6,
          margin: '0 0 2.5rem 0'
        }}>
          Sprinto es una plataforma B2B Multitenant que te da el control total de tu equipo. 
          Trae tu propia IA, diseña tableros ágiles y automatiza tus reportes con Power BI sin cuotas mensuales.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => setLoginOpen(true)}
          style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '8px' }}
        >
          Empezar a organizar ✨
        </button>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '4rem 5%', background: 'var(--bg-s1)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>
          Todo lo que tu equipo necesita
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Card 1 */}
          <div style={{ padding: '2rem', background: 'var(--bg-s2)', borderRadius: '16px', border: '1px solid var(--bd-subtle)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Inteligencia Artificial BYOK</h3>
            <p style={{ color: 'var(--tx-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Usa IA para crear tickets o generar resúmenes diarios (Standups). 
              Conecta tu propia API Key de Gemini: 100% cifrada y sin sobrecostes de intermediarios.
            </p>
          </div>
          {/* Card 2 */}
          <div style={{ padding: '2rem', background: 'var(--bg-s2)', borderRadius: '16px', border: '1px solid var(--bd-subtle)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Múltiples Vistas</h3>
            <p style={{ color: 'var(--tx-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Alterna entre tableros Kanban interactivos, listas ordenadas y diagramas de Gantt para mantener siempre 
              una visión clara del progreso de cada iteración.
            </p>
          </div>
          {/* Card 3 */}
          <div style={{ padding: '2rem', background: 'var(--bg-s2)', borderRadius: '16px', border: '1px solid var(--bd-subtle)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Arquitectura B2B</h3>
            <p style={{ color: 'var(--tx-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>
              Tus datos están aislados (Multi-tenant). Configura permisos granulares, gestiona miembros 
              del equipo y controla las vacaciones sin mezclar información.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem 5%',
        borderTop: '1px solid var(--bd-subtle)',
        background: 'var(--bg-s2)',
        textAlign: 'center',
        color: 'var(--tx-secondary)',
        fontSize: '0.875rem',
        marginTop: 'auto'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          &copy; {new Date().getFullYear()} Sprinto. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};
