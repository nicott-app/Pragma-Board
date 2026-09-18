import React from 'react';
import { useUIStore } from '../../../application/store/useUIStore';

export const PrivacyPolicyModal: React.FC = () => {
  const setPrivacyOpen = useUIStore(s => s.setPrivacyOpen);

  return (
    <div className="overlay active" style={{ zIndex: 10000 }}>
      <div className="modal" style={{ width: 'min(800px, 95vw)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--tx-primary)' }}>Políticas de Privacidad y Términos</h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--tx-secondary)' }}>Última actualización: Septiembre 2026</p>
          </div>
          <button className="modal-close" onClick={() => setPrivacyOpen(false)}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', color: 'var(--tx-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          <h3 style={{ color: 'var(--tx-primary)', margin: '0 0 0.75rem 0' }}>1. Recopilación de Datos (GDPR)</h3>
          <p style={{ margin: '0 0 1rem 0' }}>
            En <strong>Sprinto</strong>, respetamos su privacidad. Solo recopilamos los datos estrictamente necesarios para el funcionamiento del servicio. Esto incluye:
          </p>
          <ul style={{ margin: '0 0 2rem 1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Direcciones de correo electrónico (para inicio de sesión y asignación de tareas).</li>
            <li style={{ marginBottom: '0.5rem' }}>Nombres de usuario o apodos proporcionados por el usuario.</li>
            <li>El contenido explícito introducido en la plataforma (tickets, comentarios, tableros).</li>
          </ul>
          
          <h3 style={{ color: 'var(--tx-primary)', margin: '0 0 0.75rem 0' }}>2. Uso de la Inteligencia Artificial (BYOK)</h3>
          <p style={{ margin: '0 0 2rem 0' }}>
            Nuestra plataforma utiliza integraciones con modelos de IA (Gemini). Sprinto opera bajo un modelo <em>Bring Your Own Key</em> (Trae tu propia clave).
            Las claves API que introduzcas en la plataforma se cifran en tu propio navegador usando encriptación AES-256 antes de guardarse en nuestra base de datos.
            Sprinto no tiene acceso al texto plano de tus claves y no se hace responsable del coste que se derive de su uso en Google Cloud o AI Studio.
          </p>

          <h3 style={{ color: 'var(--tx-primary)', margin: '0 0 0.75rem 0' }}>3. Uso de Cookies</h3>
          <p style={{ margin: '0 0 1rem 0' }}>
            Utilizamos <strong>exclusivamente cookies técnicas y de sesión</strong>. No utilizamos cookies de rastreo, de terceros, ni de analíticas publicitarias. Las cookies presentes sirven para:
          </p>
          <ul style={{ margin: '0 0 2rem 1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Mantener su sesión de usuario activa (Firebase Auth).</li>
            <li>Guardar sus preferencias de interfaz (modo oscuro, filtros seleccionados) a través del almacenamiento local del navegador.</li>
          </ul>

          <h3 style={{ color: 'var(--tx-primary)', margin: '0 0 0.75rem 0' }}>4. Eliminación de Datos (Derecho al olvido)</h3>
          <p style={{ margin: '0 0 2rem 0' }}>
            En cumplimiento del Reglamento General de Protección de Datos (GDPR), usted tiene derecho a la eliminación completa de sus datos. 
            Puede ejercer este derecho directamente desde la plataforma (Configuración del Perfil &gt; Eliminar mi cuenta), lo que desencadenará el borrado permanente de su usuario de nuestros sistemas de autenticación.
          </p>

          <h3 style={{ color: 'var(--tx-primary)', margin: '0 0 0.75rem 0' }}>5. Almacenamiento y Seguridad</h3>
          <p style={{ margin: '0 0 1rem 0' }}>
            Los datos se almacenan de forma segura utilizando la infraestructura de Google Cloud (Firebase). 
            La plataforma utiliza un modelo multitenant donde el acceso a la información está estrictamente limitado a los miembros autorizados por los administradores de cada proyecto mediante Reglas de Seguridad (Firestore Security Rules).
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={() => setPrivacyOpen(false)}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
