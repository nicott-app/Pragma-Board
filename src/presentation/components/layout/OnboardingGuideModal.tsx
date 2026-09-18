import React, { useState } from 'react';
import { useUIStore } from '../../../application/store/useUIStore';
import { useAuthStore } from '../../../application/store/useAuthStore';

export const OnboardingGuideModal: React.FC = () => {
  const setOnboardingOpen = useUIStore(s => s.setOnboardingOpen);
  const currentUser = useAuthStore(s => s.currentUser);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setOnboardingOpen(false);
      // Opcional: Marcar en las preferencias que ya vio el tutorial
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--tx-primary)', marginBottom: '0.75rem' }}>
              ¡Bienvenido a Sprinto{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''}!
            </h3>
            <p style={{ color: 'var(--tx-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Has entrado a tu nueva plataforma de gestión ágil. Aquí podrás organizar tus tickets, 
              controlar las iteraciones y tener total visibilidad del proyecto usando vistas de <strong>Kanban</strong>, 
              <strong> Lista</strong> y <strong>Cronograma</strong>.
            </p>
          </div>
        );
      case 2:
        return (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--tx-primary)', marginBottom: '0.75rem' }}>
              Potenciado por Inteligencia Artificial
            </h3>
            <p style={{ color: 'var(--tx-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Sprinto cuenta con herramientas de IA (SmartCreate y Daily Standup). Para usarlas, debes ir a 
              <strong> Configuración ⚙️ &gt; Integraciones</strong> y añadir tu propia <strong>API Key de Google Gemini</strong>. 
              Tus claves se cifran localmente y se guardan seguras bajo el estándar <em>BYOK (Bring Your Own Key)</em>.
            </p>
          </div>
        );
      case 3:
        return (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--tx-primary)', marginBottom: '0.75rem' }}>
              Estimador Power BI & Documentación
            </h3>
            <p style={{ color: 'var(--tx-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Si trabajas con datos, dispones de herramientas exclusivas en la barra superior. 
              El <strong>Estimador Power BI</strong> calcula tiempos de desarrollo según la complejidad del modelo, 
              y el <strong>Documentador PBIP</strong> te permite extraer la documentación de tu código arrastrando tus archivos.
            </p>
          </div>
        );
      case 4:
        return (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--tx-primary)', marginBottom: '0.75rem' }}>
              ¡Todo listo para empezar!
            </h3>
            <p style={{ color: 'var(--tx-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Usa el botón flotante <strong>✨ Nuevo Ticket</strong> para crear tu primera tarea o explora el tablero. 
              Si necesitas volver a ver esta guía, haz clic en el icono de <strong>Ayuda (?)</strong> en la barra superior.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="overlay active" style={{ zIndex: 10000 }}>
      <div className="modal" style={{ width: 'min(500px, 95vw)', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <button 
          className="modal-close" 
          onClick={() => setOnboardingOpen(false)}
        >
          ✕
        </button>

        <div style={{ minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderStep()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: s === step ? 'var(--ac)' : 'var(--bd-strong)',
                  transition: 'background-color 0.2s'
                }} 
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {step > 1 && (
              <button 
                className="btn" 
                onClick={() => setStep(step - 1)}
                style={{ background: 'transparent', color: 'var(--tx-secondary)', border: '1px solid var(--bd-subtle)' }}
              >
                Atrás
              </button>
            )}
            <button className="btn btn-primary" onClick={handleNext}>
              {step === totalSteps ? '¡Empezar!' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
