import React from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export const useMonaco = () => {
  const [monacoEl, setMonacoEl] = React.useState<HTMLDivElement | null>(null);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  const getEditorContent = React.useCallback(() => {
    return editorRef.current?.getValue() ?? "";
  }, []);

  // Initialize Monaco Editor when monacoEl is ready.
  React.useEffect(() => {
    if (monacoEl && !editorRef.current) {
      monaco.editor.setTheme("dark");
      editorRef.current = monaco.editor.create(monacoEl, {
        value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
          "\n"
        ),
        language: "typescript",
        theme: "vs-dark",
        automaticLayout: true,
      });
    }

    return () => {
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, [monacoEl]);

  const setValue = React.useCallback((value: string) => {
    editorRef.current?.setValue(value);
  }, []);

  return {
    setMonacoEl,
    getEditorContent,
    setValue,
  };
};

export type Monaco = ReturnType<typeof useMonaco>;
