# Sprinto

Sprinto es una herramienta avanzada de gestión de proyectos y seguimiento de tareas diseñada para equipos ágiles. Permite organizar el trabajo mediante múltiples vistas (Kanban, Lista, Gantt), colaborar en tiempo real y acelerar rutinas diarias gracias a su integración con Inteligencia Artificial (Google Gemini).

## 🚀 Características Principales

*   **Múltiples Vistas de Trabajo:**
    *   **Tablero Kanban:** Gestiona tickets a través de columnas personalizables con límites de trabajo en curso (WIP) e indicadores visuales de bloqueo.
    *   **Vista de Lista:** Un formato tabular clásico, ideal para ordenar y revisar rápidamente métricas, prioridades y estados.
    *   **Vista de Gantt:** Cronograma temporal para visualizar de forma clara las fechas de inicio y fin de cada tarea y dependencias a lo largo del tiempo.
*   **Gestión Integral de Tickets:** Comentarios con menciones, adjuntos (arrastrar y soltar), registro de historial, control de tiempos (estimado vs real), checklist de subtareas y prioridades visuales.
*   **Filtros y Agrupaciones (Swimlanes):** Agrupa tickets por responsable, prioridad o tipo en cualquiera de las vistas, y filtra por fechas, asignados y texto libre.
*   **Cuaderno de Notas Flotante:** Un editor de texto enriquecido integrado (Rich Text) que permite tomar apuntes rápidos durante reuniones ("Dailys") y vincular esas notas directamente a tickets concretos para su revisión posterior.
*   **Asistente IA (Daily Standup):** Integración nativa con Google Gemini para redactar automáticamente los resúmenes del equipo (completados, en progreso, bloqueos) en base a los últimos movimientos del tablero.
*   **Herramientas para Power BI:** Incluye un menú opcional específico para consultores de BI:
    *   **Estimador Power BI:** Calculadora inteligente para presupuestar reportes.
    *   **Documentador PBIP:** Analizador que genera documentación técnica automática subiendo los archivos `.pbip` de Power BI.
*   **Gestión de Permisos y Preferencias:** Administración de miembros con roles (Admin/User), columnas del proyecto, vacaciones y personalización de interfaz (Modo Claro/Oscuro) guardada de forma persistente.

## 🛠️ Stack Tecnológico

El proyecto está desarrollado con una arquitectura moderna de Front-end orientada a componentes y un backend sin servidor (Serverless):

*   **Framework Core:** [React 18](https://react.dev/) con [TypeScript](https://www.typescriptlang.org/).
*   **Build Tool:** [Vite](https://vitejs.dev/) para empaquetado rápido y Hot Module Replacement (HMR).
*   **Backend & Base de Datos:** [Firebase](https://firebase.google.com/) (Cloud Firestore para la base de datos NoSQL en tiempo real, Firebase Auth para autenticación de usuarios, Firebase Storage para ficheros adjuntos y Firebase Hosting para el despliegue).
*   **Estado Global:** Zustand para la gestión reactiva del estado sin fricciones.
*   **Drag & Drop:** `@hello-pangea/dnd` para las interacciones fluidas en el tablero Kanban.
*   **IA:** `@google/genai` para la generación de resúmenes estructurados.
*   **Estilos:** CSS Modules y variables CSS personalizadas, con soporte para temas Claro y Oscuro.

## ⚙️ Instalación y Configuración Local

Si deseas ejecutar Sprinto en tu máquina local para desarrollo:

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd sprinto/v2
   ```

2. **Instalar dependencias:**
   Asegúrate de tener Node.js instalado (v18 o superior).
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Crea un archivo `.env` en la raíz de la carpeta `v2` y añade tus credenciales de Firebase y Google Gemini:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_dominio_auth
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   VITE_GEMINI_API_KEY=tu_gemini_api_key
   ```

4. **Levantar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

## 📦 Despliegue (Producción)

El proyecto está configurado para desplegarse fácilmente en **Firebase Hosting**:

1. **Compilar el proyecto:**
   ```bash
   npm run build
   ```

2. **Desplegar en Firebase:**
   ```bash
   npx firebase-tools deploy --only hosting
   ```
   *(Asegúrate de haber iniciado sesión previamente con `npx firebase-tools login` y tener seleccionado el proyecto correcto).*
