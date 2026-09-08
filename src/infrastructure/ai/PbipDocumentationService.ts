import { ParsedPbip } from '../parsers/PbipParser';
import { GeminiService } from './GeminiService';

const VISUAL_LABELS: Record<string, string> = {
  barChart: 'Grafico de Barras', columnChart: 'Grafico de Columnas',
  lineChart: 'Grafico de Lineas', areaChart: 'Grafico de Area',
  pieChart: 'Grafico Circular', donutChart: 'Grafico de Dona',
  scatterChart: 'Grafico de Dispersion', tableEx: 'Tabla', pivotTable: 'Matriz',
  card: 'Tarjeta KPI', multiRowCard: 'Tarjeta Multi-fila', gauge: 'Medidor',
  slicer: 'Segmentacion', textbox: 'Cuadro de Texto', image: 'Imagen',
  kpi: 'KPI', decompositionTree: 'Arbol de Descomposicion',
  waterfallChart: 'Cascada', funnel: 'Embudo', treemap: 'Mapa de Arbol',
};

function buildSummary(data: ParsedPbip): string {
  const L: string[] = [];
  L.push('# Informe: ' + data.reportName);

  L.push('\n## Paginas (' + data.pages.length + ' total)');
  for (const page of data.pages) {
    L.push('\n### Pagina ' + (page.ordinal + 1) + ': ' + page.displayName +
      ' (' + page.width + 'x' + page.height + 'px)');
    if (page.filters.length > 0) L.push('Filtros: ' + page.filters.join(', '));
    L.push('Visuales (' + page.visuals.length + '):');
    for (const v of page.visuals) {
      const lbl = VISUAL_LABELS[v.visualType] || v.visualType;
      const t = v.title ? ' - ' + v.title : '';
      const f = v.fields.length > 0
        ? ' | Campos: ' + v.fields.slice(0, 6).join(', ') + (v.fields.length > 6 ? '...' : '')
        : '';
      L.push('  - ' + lbl + t + f);
    }
  }

  if (data.tables.length > 0) {
    const visible = data.tables.filter((t) => !t.isHidden);
    L.push('\n## Modelo de Datos (' + visible.length + ' tablas visibles)');
    for (const table of data.tables) {
      if (table.isHidden) continue;
      L.push('\n### Tabla: ' + table.name);
      if (table.description) L.push('Descripcion: ' + table.description);
      if (table.columns.length > 0) {
        const cols = table.columns.slice(0, 15)
          .map((c) => c.name + ' (' + c.dataType + ')').join(', ');
        L.push('Columnas: ' + cols +
          (table.columns.length > 15 ? ' y ' + (table.columns.length - 15) + ' mas' : ''));
      }
      if (table.measures.length > 0) {
        L.push('Medidas (' + table.measures.length + '):');
        for (const m of table.measures.slice(0, 20)) {
          const expr = m.expression.length > 120
            ? m.expression.substring(0, 120) + '...'
            : m.expression;
          L.push('  - [' + m.name + '] = ' + expr);
        }
      }
    }
  }

  if (data.relationships.length > 0) {
    L.push('\n## Relaciones (' + data.relationships.length + ')');
    for (const r of data.relationships) {
      const dir = r.crossFilteringBehavior === 'bothDirections' ? '<->' : '->';
      const inactive = r.isActive === false ? ' (inactiva)' : '';
      L.push('  - ' + r.fromTable + '[' + r.fromColumn + '] ' +
        dir + ' ' + r.toTable + '[' + r.toColumn + ']' + inactive);
    }
  }

  if (data.parameters.length > 0) {
    L.push('\n## Parametros (' + data.parameters.length + ')');
    for (const p of data.parameters) {
      L.push('  - ' + p.name + ': ' + p.expression.substring(0, 80));
    }
  }

  if (data.globalFilters.length > 0) {
    L.push('\n## Filtros Globales: ' + data.globalFilters.join(', '));
  }

  return L.join('\n');
}

export async function generatePbipDocumentation(
  data: ParsedPbip,
  apiKey: string
): Promise<string> {
  const summary = buildSummary(data);

  const instructions = [
    'Eres un experto en Power BI y documentacion tecnica.',
    'Genera documentacion tecnica y funcional profesional en Markdown en espanol.',
    '',
    'Secciones OBLIGATORIAS:',
    '1. **Resumen Ejecutivo** - Descripcion general, proposito y audiencia objetivo.',
    '2. **Inventario de Paginas** - Tabla con: Nombre | Descripcion funcional | Num visuales.',
    '3. **Detalle de Visuales por Pagina** - Cada visual: tipo, titulo, campos, proposito.',
    '4. **Modelo de Datos** - Cada tabla: proposito, columnas clave, medidas DAX con formula.',
    '5. **Relaciones entre Tablas** - Tabla: Origen | Columna | Destino | Columna | Cardinalidad.',
    '6. **Parametros y Filtros Globales** - Descripcion y uso de cada parametro y filtro.',
    '7. **Consideraciones Tecnicas** - Mejoras sugeridas, convenciones, dependencias.',
    '',
    'DATOS DEL INFORME:',
    summary,
  ].join('\n');

  return GeminiService.callAPI(instructions, apiKey, 'gemini-1.5-flash');
}
