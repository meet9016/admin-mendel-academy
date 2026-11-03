"use client";

import React, { useEffect, useRef, useState } from "react";
import "ckeditor5/ckeditor5.css";

export interface EditorProps {
  value?: string;
  onChange?: (data: string) => void;
  onTextChange?: (e: { htmlValue?: string; textValue?: string }) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  style?: React.CSSProperties;
  className?: string;
  error?: boolean | string;
  height?: string;
}

export default function CKEditorWrapper({
  value = "",
  onChange,
  onTextChange,
  placeholder = "Write content here...",
  disabled = false,
  readOnly = false,
  style,
  className = "",
  error,
  height = "320px",
}: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const isUpdatingRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let editorInstance: any = null;
    let isMounted = true;

    async function initEditor() {
      if (!containerRef.current) return;

      try {
        const {
          ClassicEditor,
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Subscript,
          Superscript,
          Code,
          FontFamily,
          FontSize,
          FontColor,
          FontBackgroundColor,
          Alignment,
          Link,
          List,
          TodoList,
          BlockQuote,
          CodeBlock,
          HorizontalLine,
          Table,
          TableToolbar,
          TableProperties,
          TableCellProperties,
          TableColumnResize,
          TableCaption,
          Undo,
          RemoveFormat,
          Autoformat,
        } = await import("ckeditor5");

        if (!isMounted || !containerRef.current) return;

        editorInstance = await ClassicEditor.create(containerRef.current, {
          licenseKey: "GPL",
          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            Code,
            FontFamily,
            FontSize,
            FontColor,
            FontBackgroundColor,
            Alignment,
            Link,
            List,
            TodoList,
            BlockQuote,
            CodeBlock,
            HorizontalLine,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            TableColumnResize,
            TableCaption,
            Undo,
            RemoveFormat,
            Autoformat,
          ],
          toolbar: {
            items: [
              "undo",
              "redo",
              "|",
              "heading",
              "|",
              "fontFamily",
              "fontSize",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "subscript",
              "superscript",
              "code",
              "removeFormat",
              "|",
              "alignment",
              "|",
              "bulletedList",
              "numberedList",
              "todoList",
              "|",
              "link",
              "insertTable",
              "blockQuote",
              "codeBlock",
              "horizontalLine",
            ],
            shouldNotGroupWhenFull: true,
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "tableProperties",
              "tableCellProperties",
            ],
          },
          placeholder,
          initialData: value || "",
        });

        if (!isMounted) {
          editorInstance.destroy();
          return;
        }

        editorRef.current = editorInstance;
        setIsLoaded(true);

        if (readOnly || disabled) {
          editorInstance.enableReadOnlyMode("custom-editor");
        }

        editorInstance.model.document.on("change:data", () => {
          if (isUpdatingRef.current) return;
          const data = editorInstance.getData();
          if (onChange) {
            onChange(data);
          }
          if (onTextChange) {
            onTextChange({ htmlValue: data, textValue: data });
          }
        });
      } catch (err) {
        console.error("Failed to initialize CKEditor 5:", err);
      }
    }

    initEditor();

    return () => {
      isMounted = false;
      if (editorInstance) {
        editorInstance.destroy().catch((err: any) => console.error("Error destroying CKEditor:", err));
      }
    };
  }, []);

  // Update editor data when value prop changes externally
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && isLoaded) {
      const currentData = editor.getData();
      if (value !== currentData && value !== undefined) {
        isUpdatingRef.current = true;
        editor.setData(value);
        isUpdatingRef.current = false;
      }
    }
  }, [value, isLoaded]);

  // Handle readOnly/disabled changes
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && isLoaded) {
      if (readOnly || disabled) {
        editor.enableReadOnlyMode("custom-editor");
      } else {
        editor.disableReadOnlyMode("custom-editor");
      }
    }
  }, [readOnly, disabled, isLoaded]);

  return (
    <div
      className={`ckeditor-wrapper ${error ? "has-error border border-error-500 rounded-lg overflow-hidden" : ""} ${className}`}
      style={style}
    >
      <style jsx global>{`
        .ckeditor-wrapper .ck-editor__editable_inline {
          min-height: ${height};
          max-height: 700px;
          overflow-y: auto;
        }
        .ckeditor-wrapper .ck.ck-editor__main > .ck-editor__editable {
          background-color: #ffffff;
        }
        .dark .ckeditor-wrapper .ck.ck-editor__main > .ck-editor__editable {
          background-color: #111827;
          color: #f3f4f6;
        }
        .dark .ckeditor-wrapper .ck.ck-toolbar {
          background-color: #1f2937;
          border-color: #374151;
        }
        .dark .ckeditor-wrapper .ck.ck-button {
          color: #e5e7eb;
        }
        .dark .ckeditor-wrapper .ck.ck-button:hover {
          background-color: #374151;
        }
      `}</style>
      <div ref={containerRef} />
    </div>
  );
}
