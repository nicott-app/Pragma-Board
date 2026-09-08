import { LoggerService } from '../../../infrastructure/services/LoggerService';
import React, { useState } from 'react';
import { FirebaseAuthService } from '../../../infrastructure/firebase/FirebaseAuthService';

const authService = new FirebaseAuthService();

export const LoginModal: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden.');
        }
        await authService.register(name, email, password);
      } else {
        await authService.login(email, password);
      }
    } catch (err: unknown) {
      LoggerService.error(err);
      setError((err as Error).message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-overlay" className="overlay active">
      <div id="auth-modal" className="modal" style={{ width: 'min(440px,96vw)', padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔐</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--tx-primary)', marginBottom: '0.25rem' }}>
            {isRegister ? 'Crear una cuenta' : 'Iniciar sesión'}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--tx-secondary)' }}>
            {isRegister ? 'Solicita acceso a Pragma Board' : 'Accede a tu tablero Pragma'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-name">Nombre completo</label>
              <input 
                id="auth-name" 
                className="form-input" 
                type="text" 
                placeholder="Ej. Juan Pérez" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isRegister}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">Correo electrónico</label>
            <input 
              id="auth-email" 
              className="form-input" 
              type="email" 
              placeholder="ejemplo@empresa.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Contraseña</label>
            <input 
              id="auth-password" 
              className="form-input" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-confirm">Confirmar Contraseña</label>
              <input 
                id="auth-confirm" 
                className="form-input" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={isRegister}
              />
            </div>
          )}

          {error && <div style={{ color: 'var(--tx-danger)', fontSize: '0.875rem' }}>{error}</div>}

          <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ height: '40px', marginTop: '0.5rem' }}>
            {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Iniciar sesión')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button 
            type="button" 
            onClick={() => { setIsRegister(!isRegister); setError(null); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Solicita acceso'}
          </button>
        </div>
      </div>
    </div>
  );
};
