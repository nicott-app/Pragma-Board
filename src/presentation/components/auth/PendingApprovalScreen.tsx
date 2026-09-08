import React from 'react';
import { FirebaseAuthService } from '../../../infrastructure/firebase/FirebaseAuthService';

const authService = new FirebaseAuthService();

export const PendingApprovalScreen: React.FC = () => {
  return (
    <div className="overlay active">
      <div className="modal" style={{ width: 'min(440px,96vw)', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem', color: 'var(--tx-secondary)' }}>
          ⏳
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--tx-primary)' }}>
          Cuenta en revisión
        </h2>
        <p style={{ color: 'var(--tx-secondary)', lineHeight: 1.5, fontSize: '0.9375rem' }}>
          Tu cuenta ha sido registrada correctamente, pero <strong>está pendiente de validación</strong> por parte del administrador.
        </p>
        <p style={{ color: 'var(--tx-secondary)', lineHeight: 1.5, fontSize: '0.9375rem' }}>
          No podrás acceder a los tableros hasta que tu acceso sea aprobado.
        </p>
        
        <button 
          className="btn btn-secondary" 
          onClick={() => authService.logout()}
          style={{ marginTop: '1rem', width: '100%' }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
