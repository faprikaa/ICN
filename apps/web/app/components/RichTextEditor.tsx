"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuillComponent = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 192, background: "#f5f5f5", borderRadius: 8 }} />
  ),
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  return (
    <div className="rich-text-editor">
      <ReactQuillComponent
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        placeholder="Add a description..."
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          font-family: inherit;
          font-size: 14px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          font-family: inherit;
        }
        .rich-text-editor .ql-editor {
          min-height: 150px;
        }
      `}</style>
    </div>
  );
}
