import JSZip from 'jszip';

export interface PbipVisual {
  id: string;
  visualType: string;
  x: number; y: number; width: number; height: number;
  title?: string;
  fields: string[];
  filters: string[];
}
export interface PbipPage {
  id: string; displayName: string; ordinal: number;
  width: number; height: number;
  visuals: PbipVisual[]; filters: string[];
}
export interface PbipMeasure {
  name: string; expression: string; table: string;
  formatString?: string; displayFolder?: string; description?: string;
}
export interface PbipColumn {
  name: string; dataType: string; sourceColumn?: string; expression?: string;
}
export interface PbipTable {
  name: string; columns: PbipColumn[]; measures: PbipMeasure[];
  isHidden?: boolean; description?: string;
}
export interface PbipRelationship {
  fromTable: string; fromColumn: string; toTable: string; toColumn: string;
  crossFilteringBehavior?: string; isActive?: boolean; cardinality?: string;
}
export interface PbipParameter {
  name: string; expression: string; description?: string;
}
export interface ParsedPbip {
  reportName: string; pages: PbipPage[]; tables: PbipTable[];
  relationships: PbipRelationship[]; parameters: PbipParameter[]; globalFilters: string[];
}

function safeJsonParse(str: string): any {
  try { return JSON.parse(str); } catch { return null; }
}

function extractVisualFields(visualJson: any): string[] {
  const fields: string[] = [];
  try {
    const sv = visualJson?.visual?.visualContainerConfig?.singleVisual || visualJson?.singleVisual;
    if (!sv) return fields;
    const selects = sv.prototypeQuery?.Select || [];
    for (const sel of selects) {
      if (sel.Column) { const e = sel.Column.Expression?.SourceRef?.Entity || ''; const p = sel.Column.Property || ''; if (e && p) fields.push(`${e}.${p}`); }
      if (sel.Measure) { const e = sel.Measure.Expression?.SourceRef?.Entity || ''; const p = sel.Measure.Property || ''; if (e && p) fields.push(`[${p}]`); }
    }
    if (fields.length === 0 && sv.projections) {
      for (const [role, projs] of Object.entries(sv.projections as Record<string, any[]>)) {
        for (const p of projs || []) { if (p.queryRef) fields.push(`${p.queryRef} (${role})`); }
      }
    }
  } catch { /* ignore */ }
  return [...new Set(fields)];
}

function extractFilters(filtersRaw: any): string[] {
  if (!filtersRaw) return [];
  const parsed = typeof filtersRaw === 'string' ? safeJsonParse(filtersRaw) : filtersRaw;
  if (!Array.isArray(parsed)) return [];
  const result: string[] = [];
  for (const f of parsed) {
    try {
      const colRef = f?.expression?.Column || f?.expression?.Measure;
      const entity = colRef?.Expression?.SourceRef?.Entity || '';
      const prop = colRef?.Property || '';
      if (entity && prop) result.push(`${entity}.${prop}`);
      else if (f?.name) result.push(f.name);
    } catch { /* ignore */ }
  }
  return result;
}

async function parsePbipFromZip(zip: JSZip, reportName: string): Promise<ParsedPbip> {
  const result: ParsedPbip = { reportName, pages: [], tables: [], relationships: [], parameters: [], globalFilters: [] };
  const allPaths = Object.keys(zip.files);

  const reportJsonPath = allPaths.find(p => p.endsWith('definition/report.json') || p.endsWith('/report.json'));
  if (reportJsonPath) {
    const rj = safeJsonParse(await zip.files[reportJsonPath].async('text'));
    if (rj?.filters) result.globalFilters = extractFilters(rj.filters);
  }

  const pageJsonPaths = allPaths.filter(p => p.match(/definition\/pages\/[^/]+\/page\.json$/));
  for (const pagePath of pageJsonPaths) {
    const pj = safeJsonParse(await zip.files[pagePath].async('text'));
    if (!pj) continue;
    const pageId = pagePath.split('/').slice(-2)[0];
    const page: PbipPage = { id: pageId, displayName: pj.displayName || pageId, ordinal: pj.ordinal ?? 0, width: pj.width ?? 1280, height: pj.height ?? 720, visuals: [], filters: extractFilters(pj.filters) };
    const visualPaths = allPaths.filter(p => p.includes(`definition/pages/${pageId}/visuals/`) && p.endsWith('/visual.json'));
    for (const vPath of visualPaths) {
      const vj = safeJsonParse(await zip.files[vPath].async('text'));
      if (!vj) continue;
      const containerCfg = vj.visual?.visualContainerConfig || vj;
      const sv = containerCfg?.singleVisual || vj?.visual?.visualContainerConfig?.singleVisual;
      const visualType = sv?.visualType || vj?.visual?.visualType || 'unknown';
      let title: string | undefined;
      try { const t = sv?.objects?.title?.[0]?.properties?.text?.expr?.Literal?.Value; if (t) title = String(t).replace(/^'|'$/g, ''); } catch { /* ignore */ }
      page.visuals.push({ id: vPath.split('/').slice(-2)[0], visualType, x: containerCfg?.x ?? 0, y: containerCfg?.y ?? 0, width: containerCfg?.width ?? 0, height: containerCfg?.height ?? 0, title, fields: extractVisualFields(vj), filters: extractFilters(vj?.visual?.filter || vj?.filter) });
    }
    page.visuals.sort((a, b) => a.y - b.y || a.x - b.x);
    result.pages.push(page);
  }
  result.pages.sort((a, b) => a.ordinal - b.ordinal);

  const modelBimPath = allPaths.find(p => p.endsWith('model.bim'));
  if (modelBimPath) {
    const bim = safeJsonParse(await zip.files[modelBimPath].async('text'));
    const model = bim?.model || bim;
    for (const table of model?.tables || []) {
      result.tables.push({ name: table.name, isHidden: table.isHidden, description: table.description, columns: (table.columns || []).filter((c: any) => !c.isHidden).map((c: any) => ({ name: c.name, dataType: c.dataType || 'unknown', sourceColumn: c.sourceColumn, expression: c.expression })), measures: (table.measures || []).map((m: any) => ({ name: m.name, expression: Array.isArray(m.expression) ? m.expression.join('\n') : m.expression || '', table: table.name, formatString: m.formatString, displayFolder: m.displayFolder, description: m.description })) });
    }
    for (const rel of model?.relationships || []) {
      result.relationships.push({ fromTable: rel.fromTable, fromColumn: rel.fromColumn, toTable: rel.toTable, toColumn: rel.toColumn, crossFilteringBehavior: rel.crossFilteringBehavior, isActive: rel.isActive !== false, cardinality: rel.toCardinality });
    }
    for (const expr of model?.expressions || []) {
      if (expr.kind === 'm' || expr.kind === 'M') {
        result.parameters.push({ name: expr.name, expression: Array.isArray(expr.expression) ? expr.expression.join('\n') : expr.expression || '', description: expr.description });
      }
    }
  }
  return result;
}

export async function parsePbipFile(file: File): Promise<ParsedPbip> {
  if (!file.name.toLowerCase().endsWith('.zip')) {
    throw new Error('Por favor, sube el proyecto .pbip comprimido como un fichero .zip');
  }
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  return parsePbipFromZip(zip, file.name.replace(/\.(zip)$/i, ''));
}
