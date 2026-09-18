import React, { useEffect, useState } from 'react';
import { useUIStore } from '../../../application/store/useUIStore';

export const LandingPage: React.FC = () => {
  const setLoginOpen = useUIStore((s) => s.setLoginOpen);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-s1)',
      color: 'var(--tx-primary)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Sticky */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: scrolled ? 'var(--bg-s2)' : 'transparent',
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
        
        <nav style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="md-flex">
          <a href="#caracteristicas" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Características</a>
          <a href="#ia-byok" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Seguridad & BYOK</a>
          <a href="#herramientas" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Gantt & BI</a>
          <a href="#faq" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>FAQ</a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setLoginOpen(true)}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '8px', fontWeight: 600 }}
          >
            Acceder
          </button>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* 1. Hero Section */}
        <section style={{
          padding: '10rem 5% 6rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Ambient Glows */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '360px',
            background: 'radial-gradient(circle, var(--ac) 0%, transparent 70%)',
            opacity: 0.15,
            filter: 'blur(80px)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          {/* Pill Badge */}
          <a href="#ia-byok" style={{
            position: 'relative',
            zIndex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'var(--bg-s2)',
            border: '1px solid var(--bd-subtle)',
            borderRadius: '50px',
            marginBottom: '2rem',
            textDecoration: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ac)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              NUEVA VERSIÓN 2.0 ✨
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--tx-secondary)' }}>
              Descubre Gemini IA y BYOK →
            </span>
          </a>

          <h1 style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            maxWidth: '900px',
            lineHeight: 1.1,
            margin: '0 0 1.5rem 0',
            letterSpacing: '-0.03em',
            color: 'var(--tx-primary)'
          }}>
            La gestión ágil que tu equipo merece
          </h1>
          
          <p style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--tx-secondary)',
            maxWidth: '650px',
            lineHeight: 1.6,
            margin: '0 0 2.5rem 0'
          }}>
            Sprinto es la plataforma todo-en-uno que unifica tableros Kanban, cronogramas y analíticas de BI. 
            <strong> Trae tu propia IA (BYOK)</strong> y multiplica la productividad de tu equipo sin cuotas mensuales.
          </p>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => setLoginOpen(true)}
              style={{ padding: '0.875rem 2rem', fontSize: '1.05rem', borderRadius: '8px', fontWeight: 600, boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.25)' }}
            >
              Comenzar gratis ➔
            </button>
            <a 
              href="#herramientas"
              className="btn"
              style={{ padding: '0.875rem 2rem', fontSize: '1.05rem', borderRadius: '8px', fontWeight: 600, background: 'var(--bg-s2)', color: 'var(--tx-primary)', border: '1px solid var(--bd-strong)', textDecoration: 'none' }}
            >
              Descubrir funciones
            </a>
          </div>

          <p style={{ position: 'relative', zIndex: 1, fontSize: '0.75rem', color: 'var(--tx-muted)', display: 'flex', gap: '0.5rem', fontFamily: 'monospace' }}>
            <span>100% Gratuito</span>
            <span>·</span>
            <span>Sin tarjeta de crédito</span>
            <span>·</span>
            <span>Tus datos permanecen en tu control</span>
          </p>
        </section>

        {/* 2. Mockup Interactivo Central del Tablero */}
        <section id="caracteristicas" style={{ padding: '0 5% 6rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{
            background: 'var(--bg-s2)',
            borderRadius: '16px',
            border: '1px solid var(--bd-subtle)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '1.5rem',
            overflow: 'hidden'
          }}>
            {/* Header del Mockup */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bd-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                <div style={{ width: '1px', height: '16px', background: 'var(--bd-subtle)', margin: '0 0.5rem' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-s1)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--tx-secondary)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ac)' }} />
                  sprinto-board.web.app / Sprint 34
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-s1)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--bd-subtle)', fontSize: '0.75rem' }}>
                <span style={{ padding: '0.25rem 0.5rem', background: 'var(--ac)', color: 'white', borderRadius: '4px', fontWeight: 600 }}>Kanban</span>
                <span style={{ padding: '0.25rem 0.5rem', color: 'var(--tx-secondary)' }}>Gantt</span>
              </div>
            </div>

            {/* AI Banner Mockup */}
            <div style={{ 
              background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05))', 
              border: '1px solid var(--bd-subtle)', 
              borderRadius: '8px', 
              padding: '0.75rem 1rem', 
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.25rem', borderRadius: '4px' }}>✨</span>
                <strong style={{ color: 'var(--ac)' }}>SmartCreate IA:</strong>
                <span style={{ color: 'var(--tx-secondary)' }}>Genera criterios de aceptación y Daily Standups con Gemini con 1 clic</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>BYOK Activo</span>
                <button className="btn btn-primary btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Generar Daily</button>
              </div>
            </div>

            {/* Kanban Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {/* Columna Por Hacer */}
              <div style={{ background: 'var(--bg-s1)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--bd-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }} />
                    Por Hacer <span style={{ background: 'var(--bg-s2)', padding: '0.15rem 0.4rem', borderRadius: '10px', fontSize: '0.7rem' }}>2</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-s2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--bd-subtle)', marginBottom: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', background: 'var(--bg-s1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>SP-108</span>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>Media</span>
                  </div>
                  <h4 style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', fontWeight: 500 }}>Crear modelo semántico DAX para Power BI</h4>
                </div>
              </div>

              {/* Columna En Progreso */}
              <div style={{ background: 'var(--bg-s1)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--bd-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
                    En Progreso <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '0.15rem 0.4rem', borderRadius: '10px', fontSize: '0.7rem' }}>1</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-s2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.5)', marginBottom: '0.75rem', boxShadow: '0 2px 10px rgba(99, 102, 241, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', background: 'var(--bg-s1)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>SP-94</span>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>Alta</span>
                  </div>
                  <h4 style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', fontWeight: 500 }}>Implementar autenticación de doble factor (2FA)</h4>
                  <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.7rem', color: 'var(--tx-secondary)' }}>
                    <strong style={{ color: 'var(--ac)' }}>✨ IA Sugiere:</strong><br/>
                    - Vincular Google Auth con QR<br/>
                    - Solicitar código de 6 dígitos
                  </div>
                </div>
              </div>

              {/* Columna Hecho */}
              <div style={{ background: 'var(--bg-s1)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--bd-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    Hecho <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.15rem 0.4rem', borderRadius: '10px', fontSize: '0.7rem' }}>1</span>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-s2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--bd-subtle)', marginBottom: '0.75rem', opacity: 0.7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', textDecoration: 'line-through', color: 'var(--tx-muted)' }}>SP-81</span>
                    <span style={{ color: '#10b981', fontSize: '0.8rem' }}>✓</span>
                  </div>
                  <h4 style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', fontWeight: 500, textDecoration: 'line-through', color: 'var(--tx-muted)' }}>Módulo BYOK con encriptación local</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. IA & BYOK Sections */}
        <section id="ia-byok" style={{ padding: '6rem 5%', background: 'var(--bg-s1)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            
            {/* IA Block */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-s2)', border: '1px solid var(--bd-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>🤖</div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.2 }}>IA Integrada a tu manera</h2>
                <p style={{ color: 'var(--tx-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Automatiza la redacción de tickets con <strong>SmartCreate</strong> y genera informes diarios en un clic con nuestro <strong>Daily Standup</strong>. Todo impulsado por Gemini AI, integrado de forma nativa en tu flujo de trabajo.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--tx-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>Redacción inteligente</strong> de Acceptance Criteria</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>Detección de esfuerzo</strong> y estimación de Story Points</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>Resúmenes automáticos</strong> para tu equipo</li>
                </ul>
              </div>
              <div style={{ flex: '1 1 400px', background: 'var(--bg-s2)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--bd-subtle)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <div style={{ background: 'var(--bg-s1)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid var(--ac)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ac)', fontWeight: 600, marginBottom: '0.5rem' }}>✨ IA Sugiere:</div>
                  <div style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>Implementar autenticación de doble factor (2FA) en el panel de usuario.</div>
                </div>
                <div style={{ background: 'var(--bg-s1)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--ac)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ac)', fontWeight: 600, marginBottom: '0.5rem' }}>📋 Criterios de Aceptación:</div>
                  <ol style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--tx-secondary)', margin: 0, lineHeight: 1.6 }}>
                    <li>El usuario debe poder vincular Google Authenticator.</li>
                    <li>Solicitar código tras login con éxito.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* BYOK Block */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-s2)', border: '1px solid var(--bd-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>🔐</div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.2 }}>Máxima privacidad con BYOK</h2>
                <p style={{ color: 'var(--tx-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Sprinto no te cobra por usar la IA y tampoco almacena tus tokens. Utilizamos el modelo <strong>Bring Your Own Key (BYOK)</strong> para darte control absoluto.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--tx-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>🔒 Tus claves se cifran localmente con <strong>AES-256</strong>.</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>💸 <strong>Paga directamente a Google</strong> (o usa la capa gratuita).</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>🏢 <strong>Multitenant:</strong> cada empresa sus propios datos aislados.</li>
                </ul>
              </div>
              <div style={{ flex: '1 1 400px', background: 'var(--bg-s2)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--bd-subtle)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <div style={{ background: 'var(--bg-s1)', border: '1px solid var(--bd-subtle)', borderRadius: '12px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>API Key de Gemini</span>
                    <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>Cifrado Activo</span>
                  </div>
                  <div style={{ background: 'var(--bg-s2)', border: '1px solid var(--bd-subtle)', borderRadius: '8px', padding: '1rem', fontFamily: 'monospace', fontSize: '1.25rem', letterSpacing: '0.1rem', color: 'var(--tx-secondary)', textAlign: 'center' }}>
                    ••••••••••••••••••••••••
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--tx-muted)', fontFamily: 'monospace' }}>
                    <span>Algoritmo: AES-256</span>
                    <span style={{ color: 'var(--ac)' }}>Local-Storage seguro</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. Herramientas Grid */}
        <section id="herramientas" style={{ padding: '8rem 5%', background: 'var(--bg-s2)', borderTop: '1px solid var(--bd-subtle)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Desarrollado para la agilidad real</h2>
              <p style={{ color: 'var(--tx-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>No más herramientas dispersas. Todo el ecosistema de tu producto en una única pantalla de comandos.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {[
                { icon: '📊', title: 'Power BI Estimator', desc: 'Calcula horas de desarrollo de modelos semánticos en base a métricas DAX e importaciones de manera estandarizada.' },
                { icon: '🗺️', title: 'Diagramas de Gantt', desc: 'Vista de cronograma nativa para visualizar dependencias, cuellos de botella y rutas críticas de tu Release.' },
                { icon: '🌴', title: 'Gestor de Vacaciones', desc: 'Controla las bajas y disponibilidad del equipo para ajustar la capacidad del Sprint automáticamente.' },
                { icon: '📝', title: 'Notas Personales', desc: 'Blocs rápidos y notas privadas integradas al tablero para reuniones 1-a-1 o listas pendientes.' },
                { icon: '📋', title: 'Tableros Flexibles', desc: 'Arrastre ultra-fluido con filtros instantáneos. Diseñado para responder en milisegundos sin recargar la pantalla.' }
              ].map((f, i) => (
                <div key={i} style={{ padding: '2rem', background: 'var(--bg-s1)', borderRadius: '16px', border: '1px solid var(--bd-subtle)', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-s2)', border: '1px solid var(--bd-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>{f.icon}</div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>{f.title}</h3>
                  <p style={{ color: 'var(--tx-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Pricing CTA */}
        <section id="precio" style={{ padding: '6rem 5%', background: 'var(--ac)', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem', color: 'white' }}>100% Gratuito. Sin trucos.</h2>
            <p style={{ fontSize: '1.15rem', margin: '0 auto 2.5rem', opacity: 0.9, lineHeight: 1.6 }}>
              Sprinto es una plataforma abierta. Solo necesitas tu cuenta para empezar a gestionar tus proyectos ágiles con superpoderes de IA.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setLoginOpen(true)}
                style={{ 
                  background: 'white', 
                  color: 'var(--ac)', 
                  border: 'none', 
                  padding: '1rem 2.5rem', 
                  fontSize: '1.1rem', 
                  borderRadius: '12px', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
              >
                Crear cuenta gratuita ahora
              </button>
            </div>
            <div style={{ marginTop: '2rem', fontSize: '0.85rem', opacity: 0.8 }}>
              Sin límites artificiales · Trae tu propia clave Gemini · Exporta tus datos cuando quieras
            </div>
          </div>
        </section>

        {/* 6. FAQ Section */}
        <section id="faq" style={{ padding: '6rem 5%', background: 'var(--bg-s1)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>Preguntas Frecuentes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { q: '¿Por qué es gratuito?', a: 'Sprinto adopta la filosofía BYOK (Bring Your Own Key): no pagamos servidores de inferencia por ti, sino que tú conectas tu propia clave de Google Gemini directamente desde tu navegador.' },
                { q: '¿Están seguras mis API Keys?', a: 'Sí. Las claves nunca tocan un backend de Sprinto. Se guardan en tu navegador encriptadas localmente con AES-256 y solo se envían directamente a los endpoints oficiales de Google.' },
                { q: '¿Puedo usar Sprinto con equipos grandes?', a: 'Totalmente. Disponemos de soporte multitenant para empresas, asignación de roles, estimaciones de Story Points y tableros sincronizados en tiempo real.' }
              ].map((faq, i) => (
                <div key={i} style={{ background: 'var(--bg-s2)', border: '1px solid var(--bd-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => toggleFaq(i)}
                    style={{ width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'var(--tx-primary)', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
                  >
                    {faq.q}
                    <span style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--tx-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '4rem 5% 2rem',
        background: 'var(--bg-s2)',
        borderTop: '1px solid var(--bd-subtle)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', borderBottom: '1px solid var(--bd-subtle)', paddingBottom: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src="/sprinto-logo.svg" alt="Sprinto Logo" width="32" height="32" style={{ borderRadius: '6px' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Sprinto</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <a href="#caracteristicas" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Características</a>
              <a href="#ia-byok" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Seguridad (BYOK)</a>
              <a href="#precio" style={{ color: 'var(--tx-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Precio</a>
              <button onClick={() => {
                import('../../../application/store/useUIStore').then(({ useUIStore }) => {
                  useUIStore.getState().setPrivacyOpen(true);
                });
              }} style={{ background: 'none', border: 'none', color: 'var(--tx-secondary)', fontSize: '0.9rem', cursor: 'pointer', padding: 0 }}>
                Términos y Privacidad
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', color: 'var(--tx-muted)', fontSize: '0.85rem' }}>
            <div>&copy; {new Date().getFullYear()} Sprinto. Plataforma ágil con IA bajo modelo BYOK.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-s1)', padding: '0.4rem 1rem', borderRadius: '50px', border: '1px solid var(--bd-subtle)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              Sistemas 100% Operativos
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
