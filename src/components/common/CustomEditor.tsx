"use client";

import React from "react";
import dynamic from "next/dynamic";

export interface EditorTextChangeEvent {
  htmlValue?: string;
  textValue?: string;
}

const CKEditorWrapper = dynamic(
  () => import("./CKEditorWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 text-sm">
        Loading Rich Text Editor...
      </div>
    ),
  }
);

export interface CustomEditorProps {
  value?: string;
  onTextChange?: (e: EditorTextChangeEvent) => void;
  onChange?: (data: string) => void;
  onSelectionChange?: (e: any) => void;
  onLoad?: (editor: any) => void;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  error?: boolean | string;
  height?: string;
  modules?: any;
  formats?: any;
  showHeader?: boolean;
  headerTemplate?: any;
}

export default function CustomEditor(props: CustomEditorProps) {
  return <CKEditorWrapper {...props} />;
}
