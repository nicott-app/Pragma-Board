import { LoggerService } from '../services/LoggerService';
export class GeminiService {
  public static async callAPI(prompt: string, apiKey: string, model: string = 'gemini-1.5-flash'): Promise<string> {
    if (!apiKey) {
      throw new Error('API key no configurada. Ve a Ajustes -> Configuración para añadirla.');
    }

    if (model === 'gemini-1.5-flash-latest' || model === 'models/gemini-1.5-flash-latest' || model === 'gemini-1.5-flash' || model === 'gemini-3.5-flash') {
      model = 'gemini-3.5-flash-lite';
    }

    // Sanitize the model string by removing the "models/" prefix if it was included
    model = model.replace(/^models\//, '');

    if (apiKey.startsWith('gsk_')) {
      const groqUrl = import.meta.env.VITE_GROQ_API_URL;
      const groqModel = model.includes('gemini') ? 'llama-3.1-8b-instant' : model;
      
      const res = await fetch(groqUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: groqModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.65,
          max_tokens: 1024,
          top_p: 0.9
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Error de Groq: ${err.error?.message || res.statusText}`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    }

    model = model.trim();
    apiKey = apiKey.trim();

    // Default to Gemini API
    const geminiUrl = `${import.meta.env.VITE_GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.65, maxOutputTokens: 1024, topP: 0.9 }
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Error de Gemini: ${err.error?.message || res.statusText}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  public static async generateTicketJSON(prompt: string, apiKey: string): Promise<any> {
    const systemPrompt = `
Eres un asistente experto en gestión ágil de proyectos. Convierte la siguiente descripción en un JSON válido con esta estructura. No devuelvas NADA más que JSON.

REGLAS DE EXTRACCIÓN:
1. Extrae el nombre del usuario a asignar (si se menciona) en "assigneeName".
2. Estima la prioridad y el tipo.
3. Extrae las horas estimadas si se mencionan.
4. Desglosa el trabajo en subtareas lógicas (subtasks) y define criterios de aceptación profesionales.
5. Infiere el tiempo verbal ("present" si se está trabajando ya en ello o se pide hacer ahora, "future" si es para más adelante).
6. Extrae la fecha de fin estimada ("dueDate") en formato YYYY-MM-DD si se menciona.
7. La descripción debe ser clara, concisa y estructurada. Si el ticket es de tipo 'bug' o incidencia, estructura OBLIGATORIAMENTE la descripción con las secciones: "Pasos para reproducir:", "Comportamiento Actual:" y "Comportamiento Esperado:", usando saltos de línea.
8. Infiere de 2 a 4 etiquetas (tags) clave que describan el ámbito técnico o funcional (ej. Frontend, Backend, UI/UX, API, BBDD).
9. Detecta si la tarea tiene dependencias que impiden realizarla ahora (ej. "pero antes necesitamos el diseño"). Si es así, marca "isBlocked" a true y extrae la razón en "blockerReason".
10. Sugiere una estimación propia en "aiSuggestedHours" basada en la complejidad detectada, independientemente de si el usuario ha especificado horas o no.
11. Añade validaciones y tests de QA (Quality Assurance) a la lista de "acceptanceCriteria", prefijándolos OBLIGATORIAMENTE con "[QA]".

Estructura JSON:
{
  "title": "Un título corto y directo (max 60 chars)",
  "description": "Descripción clara y detallada del trabajo a realizar",
  "type": "desarrollo|tarea|bug|mejora|incidencia|analisis|entregable",
  "priority": "critical|high|medium|low",
  "estimatedHours": "Número de horas estimadas (ej: 2, 4, 8) o null si no se especifica",
  "aiSuggestedHours": "Sugerencia numérica de horas por parte de la IA (ej: 4)",
  "assigneeName": "Nombre de la persona (o null si no se especifica)",
  "dueDate": "YYYY-MM-DD o null si no se especifica",
  "timeTense": "present|future",
  "isBlocked": true o false,
  "blockerReason": "Descripción del bloqueo o null",
  "tags": ["tag1", "tag2"],
  "subtasks": ["Subtarea 1", "Subtarea 2"],
  "acceptanceCriteria": ["Criterio 1", "Criterio 2"]
}

Descripción del usuario:
"${prompt}"
`;
    const response = await this.callAPI(systemPrompt, apiKey);
    
    // Attempt to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('La IA no ha devuelto un formato JSON válido.');
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      throw new Error('Error parseando el JSON de la IA.');
    }
  }

  public static async generateDynamicExamples(tickets: any[], apiKey: string): Promise<{label: string, prompt: string}[]> {
    if (!tickets || tickets.length === 0) {
      return [];
    }
    
    // Tomamos los últimos 40 tickets para no saturar el prompt
    const recentTickets = tickets.slice(0, 40).map(t => ({ title: t.title, type: t.type, tags: t.tags }));
    const systemPrompt = `
Eres un asistente experto analizando históricos de tareas ágiles.
Analiza esta lista de tickets recientes y extrae 3 patrones de tareas que se repitan con frecuencia o que parezcan ser tareas tipo "plantilla".
Devuelve ÚNICAMENTE un JSON con un array de 3 objetos. Cada objeto debe tener:
- "label": Un texto muy corto con un emoji al inicio que describa el patrón (ej: "🐛 Bug Frontend...", "📊 Crear Modelo...").
- "prompt": La orden clara que le daría el usuario a una IA para generar este tipo de ticket, incluyendo placeholders como [NOMBRE] si aplica.

Tickets:
${JSON.stringify(recentTickets)}

Devuelve solo el array JSON, por ejemplo:
[
  {"label": "📊 Crear Informe", "prompt": "Tarea: Crear informe de [TEMA]. Genera subtareas..."},
  ...
]
`;

    try {
      const response = await this.callAPI(systemPrompt, apiKey, 'gemini-3.5-flash'); // Use the faster flash model
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      LoggerService.error("Error generando ejemplos dinámicos:", e);
    }
    return [];
  }
}
