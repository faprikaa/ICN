"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import for ReactQuill to disable SSR
const ReactQuillComponent = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 40, background: "#f5f5f5", borderRadius: 8 }} />
  ),
});

interface SimpleRichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function SimpleRichTextEditor({
  value,
  onChange,
}: SimpleRichTextEditorProps) {
  const modules = {
    toolbar: [["bold", "italic", "underline"]],
  };

  return (
    <div className="simple-rich-editor">
      <ReactQuillComponent
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
      />
      <style jsx global>{`
        .simple-rich-editor .ql-container {
          height: auto;
          min-height: 40px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          font-family: inherit;
          font-size: 16px; /* Matches standard input size */
        }
        .simple-rich-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          padding: 2px 8px;
          font-family: inherit;
        }
        .simple-rich-editor .ql-editor {
          min-height: 40px;
          padding: 8px 12px;
          line-height: 1.5;
        }
        .simple-rich-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
