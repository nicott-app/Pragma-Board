import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escribe algo...',
  minHeight = '100px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    handleInput();
  };

  return (
    <div
      style={{
        border: '1px solid var(--bd-subtle)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
        background: 'var(--bg-s1)',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          padding: '0.5rem',
          background: 'var(--bg-s2)',
          borderBottom: '1px solid var(--bd-subtle)',
          flexWrap: 'wrap',
        }}
      >
        <button
          className="btn-icon btn-sm"
          onClick={() => execCmd('bold')}
          title="Negrita"
          type="button"
        >
          <b>B</b>
        </button>
        <button
          className="btn-icon btn-sm"
          onClick={() => execCmd('italic')}
          title="Cursiva"
          type="button"
          style={{ fontStyle: 'italic' }}
        >
          I
        </button>
        <button
          className="btn-icon btn-sm"
          onClick={() => execCmd('underline')}
          title="Subrayado"
          type="button"
          style={{ textDecoration: 'underline' }}
        >
          U
        </button>

        <div style={{ width: '1px', background: 'var(--bd-subtle)', margin: '0 0.25rem' }}></div>

        <button
          className="btn-icon btn-sm"
          onClick={() => execCmd('formatBlock', 'H3')}
          title="Título"
          type="button"
        >
          <b>H</b>
        </button>
        <button
          className="btn-icon btn-sm"
          onClick={() => execCmd('formatBlock', 'P')}
          title="Párrafo normal"
          type="button"
        >
          P
        </button>

        <div style={{ width: '1px', background: 'var(--bd-subtle)', margin: '0 0.25rem' }}></div>

        <button
          className="btn-icon btn-sm"
          onClick={() => execCmd('insertUnorderedList')}
          title="Lista viñetas"
          type="button"
        >
          •
        </button>
        <button
          className="btn-icon btn-sm"
          onClick={() => execCmd('insertOrderedList')}
          title="Lista numerada"
          type="button"
        >
          1.
        </button>

        <div style={{ width: '1px', background: 'var(--bd-subtle)', margin: '0 0.25rem' }}></div>

        <input
          type="color"
          title="Color de texto"
          onChange={(e) => execCmd('foreColor', e.target.value)}
          style={{
            width: '28px',
            height: '28px',
            padding: '0',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{
          minHeight,
          padding: '0.75rem',
          outline: 'none',
          overflowY: 'auto',
          maxHeight: '300px',
          color: 'var(--tx-primary)',
          fontSize: '0.9rem',
        }}
        data-placeholder={placeholder}
        className="rich-text-editor-content"
      />
      <style>{`
        .rich-text-editor-content:empty:before {
          content: attr(data-placeholder);
          color: var(--tx-muted);
          pointer-events: none;
          display: block; /* For Firefox */
        }
        .rich-text-editor-content ul { padding-left: 1.5rem; margin: 0.5rem 0; }
        .rich-text-editor-content ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .rich-text-editor-content h3 { margin: 0.5rem 0; font-size: 1.1rem; }
        .rich-text-editor-content p { margin: 0 0 0.5rem 0; }
      `}</style>
    </div>
  );
};
