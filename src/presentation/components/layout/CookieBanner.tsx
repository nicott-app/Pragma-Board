import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../../application/store/useUIStore';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const setPrivacyOpen = useUIStore(s => s.setPrivacyOpen);

  useEffect(() => {
    const consent = localStorage.getItem('sprinto_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sprinto_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('sprinto_cookie_consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '600px',
      backgroundColor: 'var(--bg-s2)',
      border: '1px solid var(--bd-default)',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      zIndex: 9999,
      color: 'var(--tx-primary)'
    }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>🍪 Privacidad y Cookies</h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--tx-secondary)', lineHeight: 1.5 }}>
          Utilizamos cookies esenciales para el funcionamiento de la plataforma (como mantener tu sesión iniciada) y almacenar tus preferencias locales. No utilizamos cookies de terceros ni vendemos tus datos. 
          Puedes leer más en nuestra <button onClick={() => setPrivacyOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--ac)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Política de Privacidad</button>.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button 
          onClick={handleReject}
          style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--bd-subtle)', borderRadius: '6px', color: 'var(--tx-secondary)', cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Solo esenciales
        </button>
        <button 
          onClick={handleAccept}
          style={{ padding: '0.5rem 1rem', background: 'var(--ac)', border: '1px solid var(--ac)', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
        >
          Aceptar y continuar
        </button>
      </div>
    </div>
  );
};
