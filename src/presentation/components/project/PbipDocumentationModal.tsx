import React, { useRef, useState, useCallback } from 'react';
import { useUIStore } from '../../../application/store/useUIStore';
import { useSettingsStore } from '../../../application/store/useSettingsStore';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { parsePbipFile, ParsedPbip } from '../../../infrastructure/parsers/PbipParser';
import { generatePbipDocumentation } from '../../../infrastructure/ai/PbipDocumentationService';

type Step = 'upload' | 'preview' | 'generating' | 'done' | 'error';

export const PbipDocumentationModal: React.FC = () => {
  const setPbipDocOpen = useUIStore(s => s.setPbipDocOpen);
  const geminiApiKey = useSettingsStore(s => s.geminiApiKey);
  const activeProject = useProjectStore(s => s.activeProject);

  const [step, setStep] = useState<Step>('upload');
  const [parsed, setParsed] = useState<ParsedPbip | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveKey = import.meta.env.VITE_GEMINI_API_KEY || activeProject?.geminiApiKey || geminiApiKey;

  const handleFile = useCallback(async (file: File) => {
    setError('');
    setStep('upload');
    try {
      const data = await parsePbipFile(file);
      setParsed(data);
      setStep('preview');
    } catch (e: any) {
      setError(e.message || 'Error al parsear el fichero');
      setStep('error');
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleGenerate = async () => {
    if (!parsed) return;
    if (!effectiveKey) { setError('Configura tu API Key de Gemini en Ajustes antes de continuar.'); setStep('error'); return; }
    setStep('generating');
    setError('');
    try {
      const md = await generatePbipDocumentation(parsed, effectiveKey);
      setMarkdown(md);
      setStep('done');
    } catch (e: any) {
      setError(e.message || 'Error al generar la documentacion');
      setStep('error');
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (parsed?.reportName || 'informe') + '-documentacion.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const html = markdown
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/```[\w]*([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^| (.+)$/gm, (line) => {
        const cells = line.split('|').filter(c => c.trim() !== '');
        return '<tr>' + cells.map(c => '<td>' + c.trim() + '</td>').join('') + '</tr>';
      })
      .replace(/(<tr>.*<\/tr>\n?)+/g, (block) => '<table>' + block + '</table>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    win.document.write(`\<!DOCTYPE html\><html><head><meta charset="utf-8"><title>${parsed?.reportName || 'Documentacion'}</title>
    <style>body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;color:#111;line-height:1.6}
    h1{color:#1e3a5f;border-bottom:2px solid #1e3a5f;padding-bottom:8px}
    h2{color:#1e3a5f;margin-top:32px}h3{color:#374151}
    table{border-collapse:collapse;width:100%;margin:12px 0}
    td,th{border:1px solid #d1d5db;padding:8px 12px;text-align:left}
    tr:nth-child(even){background:#f9fafb}
    pre{background:#1e1e1e;color:#d4d4d4;padding:16px;border-radius:6px;overflow:auto;font-size:12px}
    code{background:#f3f4f6;padding:2px 6px;border-radius:3px;font-family:monospace;font-size:13px}
    pre code{background:none;padding:0;color:inherit}
    @media print{body{max-width:100%}button{display:none}}
    </style></head><body><p>${html}</p>
    <script>setTimeout(()=>{window.print();},400);<\/script></body></html>`);
    win.document.close();
  };

  const totalMeasures = parsed?.tables.reduce((acc, t) => acc + t.measures.length, 0) || 0;

  return (
    <div className="overlay active" style={{ zIndex: 110 }}>
      <div className="modal" style={{ width: 'min(860px, 95vw)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: 0 }}>

        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📑</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--tx-primary)' }}>Documentador de Informes Power BR</h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--tx-secondary)' }}>Sube tu proyecto .pbip comprimido como .zip para generar documentacion automatica</p>
            </div>
          </div>
          <button className="modal-close" onClick={() => setPbipDocOpen(false)}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

          {/* UPLOAD STEP */}
          {(step === 'upload' || step === 'error') && (
            <div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed ' + (dragging ? 'var(--ac)' : 'var(--bd-default)'),
                  borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center',
                  cursor: 'pointer', background: dragging ? 'var(--bg-s2)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📦</div>
                <p style={{ margin: 0, fontSize: '1rem', color: 'var(--tx-secondary)', fontWeight: 600 }}>
                  Arrastra aqui tu proyecto .pbip comprimido (.zip)
                </p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--tx-secondary)' }}>
                  o haz clic para seleccionar el fichero
                </p>
                <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-s2)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.8rem', color: 'var(--tx-secondary)' }}>
                  <span>�D

</span> Solo se aceptan ficheros .zip (proyecto .pbip comprimido)
                </div>
                <input ref={fileInputRef} type="file" accept=".zip" style={{ display: 'none' }} onChange={onFileChange} />
              </div>
              {step === 'error' && (
                <div style={{ marginTop: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem 1rem', color: '#991b1b', fontSize: '0.875rem' }}>
                  Error: {error}
                </div>
              )}
              <div style={{ marginTop: '1.5rem', background: 'var(--bg-s2)', borderRadius: '8px', padding: '1rem', fontSize: '0.8rem', color: 'var(--tx-secondary)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--tx-primary)' }}>Como preparar el fichero:</strong><br />
                1. Abre Power BI Desktop y guarda el proyecto en formato PBIP (Archivo &gt; Guardar como &gt; Power BI Project).<br />
                2. Comprime la carpeta del proyecto (la que contiene el .pbip y las subcarpetas) en un .zip.<br />
                3. Sube el .zip aqui.
              </div>
            </div>
              )}

          {/* PREVIEW STEP */}
          {step === 'preview' && parsed && (
            <div>
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#166534' }}>Fichero analizado correctamente</span>
                  <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: '0.2rem' }}>
                    {parsed.pages.length} paginas | {parsed.tables.filter(t => !t.isHidden).length} tablas | {totalMeasures} medidas DAX | {parsed.relationships.length} relaciones
                  </div>
                </div>
                <span style={{ fontSize: '1.5rem' }}>✅</span>
              </div>

              {/* Pages summary */}
              <h3 style={{ fontSize: '1rem', color: 'var(--ac)', margin: '0 0 0.75rem' }}>Paginas del informe</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {parsed.pages.map((page, i) => (
                  <div key={page.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--bg-s2)', borderRadius: '6px', fontSize: '0.875rem' }}>
                    <span><strong>{i + 1}.</strong> {page.displayName}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ background: 'var(--bg-s3)', padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' }}>{page.visuals.length} visuales</span>
                      {page.filters.length > 0 && <span style={{ background: '#fef9c3', color: '#854d0e', padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' }}>{page.filters.length} filtros</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tables summary */}
              {parsed.tables.filter(t => !t.isHidden).length > 0 && (
                <>
                  <h3 style={{ fontSize: '1rem', color: 'var(--ac)', margin: '0 0 0.75rem' }}>Modelo de datos</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {parsed.tables.filter(t => !t.isHidden).map(table => (
                      <div key={table.name} style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-s2)', borderRadius: '6px', fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--tx-primary)', marginBottom: '0.25rem' }}>{table.name}</div>
                        <div style={{ color: 'var(--tx-secondary)' }}>{table.columns.length} col. | {table.measures.length} med.</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Relationships */}
              {parsed.relationships.length > 0 && (
                <>
                  <h3 style={{ fontSize: '1rem', color: 'var(--ac)', margin: '0 0 0.75rem' }}>Relaciones</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--tx-secondary)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {parsed.relationships.slice(0, 8).map((r, i) => (
                      <div key={i}>{r.fromTable}[{r.fromColumn}] → {r.toTable}[{r.toColumn}]{r.isActive === false ? ' (inactiva)' : ''}</div>
                    ))}
                    {parsed.relationships.length > 8 && <div style={{ color: 'var(--ac)' }}>... y {parsed.relationships.length - 8} mas</div>}
                  </div>
                </>
              )}

              {!effectiveKey && (
                <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#92400e' }}>
                  Configura tu API Key de Gemini en Ajustes para poder generar la documentacion.
                </div>
              )}
            </div>
          )}

          {/* GENERATING */}
          {step === 'generating' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', gap: '1rem' }}>
              <span className="spinner" style={{ width: '2.5rem', height: '2.5rem' }}></span>
              <p style={{ margin: 0, color: 'var(--tx-secondary)', fontSize: '0.95rem' }}>Generando documentacion con IA...</p>
              <p style={{ margin: 0, color: 'var(--tx-muted)', fontSize: '0.8rem' }}>Esto puede tardar unos segundos segun la complejidad del informe.</p>
            </div>
          )}

          {/* DONE */}
          {step === 'done' && (
            <div>
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#166534' }}>Documentacion generada correctamente</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={downloadMarkdown}>Descargar .md</button>
                  <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={downloadPdf}>Descargar PDF</button>
                </div>
              </div>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', lineHeight: 1.7, background: 'var(--bg-s2)', padding: '1.25rem', borderRadius: '8px', maxHeight: '52vh', overflowY: 'auto', color: 'var(--tx-primary)', border: '1px solid var(--bd-subtle)' }}>
                {markdown}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <button className="btn btn-secondary" onClick={() => { setStep('upload'); setParsed(null); setMarkdown(''); setError(''); }}>
            Subir otro fichero
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setPbipDocOpen(false)}>Cerrar</button>
            {step === 'preview' && (
              <button className="btn btn-primary" onClick={handleGenerate} disabled={!effectiveKey}>
                ✨ Generar documentacion
              </button>
            )}
            {step === 'done' && (
              <>
                <button className="btn btn-secondary" onClick={downloadMarkdown}>Descargar .md</button>
                <button className="btn btn-primary" onClick={downloadPdf}>Descargar PDF</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 