"use client";

import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
// import { useTheme } from "@/contexts/ThemeContext";
import { PistonAPI } from "@/services/pistonApi";
import { Languages as LanguagesIcon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  code: string;
  language: string;
  version: string;
  onChange: (value: string) => void;
  onLanguageChange: (language: string, version: string) => void;
  languages: Array<{ language: string; version: string; aliases: string[] }>;
  isRunning: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  version,
  onChange,
  onLanguageChange,
  languages,
  isRunning,
}) => {
  // console.log("code", code);
  // console.log("language", language);

  const { theme } = useTheme();
  type MonacoEditor = {
    updateOptions: (options: Record<string, unknown>) => void;
    addCommand: (keybinding: number, handler: () => void) => void;
  };
  type MonacoNS = {
    KeyMod: Record<string, number>;
    KeyCode: Record<string, number>;
  };
  const editorRef = useRef<MonacoEditor | null>(null);
  const pistonApi = PistonAPI.getInstance();

  const handleEditorDidMount = (editor: MonacoEditor, monaco: MonacoNS) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: "on",
      lineNumbers: "on",
      renderWhitespace: "selection",
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: true,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // This will be handled by the parent component
      const event = new CustomEvent("runCode");
      window.dispatchEvent(event);
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    const selectedLang = languages.find(
      (lang) => lang.language === newLanguage
    );
    if (selectedLang) {
      onLanguageChange(selectedLang.language, selectedLang.version);

      // Update code with default template if it's empty or just placeholder
      if (
        !code ||
        code.trim() === "" ||
        code.includes("// Write your code here")
      ) {
        const defaultCode = pistonApi.getDefaultCode(selectedLang.language);
        onChange(defaultCode);
      }
    }
  };

  const getMonacoLanguage = (language: string): string => {
    const languageMap: Record<string, string> = {
      python: "python",
      javascript: "javascript",
      typescript: "typescript",
      java: "java",
      cpp: "cpp",
      c: "c",
      go: "go",
      rust: "rust",
      php: "php",
      ruby: "ruby",
      swift: "swift",
      kotlin: "kotlin",
      html: "html",
      css: "css",
      json: "json",
      markdown: "markdown",
      sql: "sql",
      bash: "shell",
      powershell: "powershell",
    };

    return languageMap[language.toLowerCase()] || "plaintext";
  };

  const getLanguageIcon = (lang: string): string => {
    const map: Record<string, string> = {
      javascript: "🟨",
      typescript: "🔷",
      python: "🐍",
      java: "☕",
      cpp: "➕",
      c: "🇨",
      go: "🐹",
      rust: "🦀",
      php: "🐘",
      ruby: "💎",
      swift: "🐦",
      kotlin: "🟧",
      html: "🌐",
      css: "🎨",
      json: "🗂️",
      markdown: "📝",
      sql: "🗄️",
      bash: "💻",
      powershell: "⚡",
    };
    return map[lang.toLowerCase()] || "💡";
  };

  // Icons8 icon URLs (https://icons8.com/)
  const getLanguageIconUrl = (lang: string): string | null => {
    const base = "https://img.icons8.com/color/48/";
    const map: Record<string, string> = {
      javascript: `${base}javascript--v1.png`,
      typescript: `${base}typescript.png`,
      python: `${base}python--v1.png`,
      java: `${base}java-coffee-cup-logo--v1.png`,
      cpp: `${base}cpp.png`,
      c: `${base}c-programming.png`,
      go: `${base}golang.png`,
      rust: `${base}rust-programming-language.png`,
      php: `${base}php.png`,
      ruby: `${base}ruby-programming-language.png`,
      swift: `${base}swift.png`,
      kotlin: `${base}kotlin.png`,
      html: `${base}html-5--v1.png`,
      css: `${base}css3.png`,
      json: `${base}json--v1.png`,
      markdown: `${base}markdown.png`,
      sql: `${base}database.png`,
      bash: `${base}console.png`,
      powershell: `${base}powershell.png`,
    };
    return map[lang.toLowerCase()] || null;
  };

  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 p-2 sm:p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            {/* <LanguagesIcon size={14} className="opacity-80" /> */}
            Language
          </span>
          {(() => {
            const sorted = [...languages].sort((a, b) =>
              a.language.localeCompare(b.language)
            );
            const current =
              sorted.find((l) => l.language === language) || sorted[0];
            const currentIconUrl = current
              ? getLanguageIconUrl(current.language)
              : null;
            return (
              <div ref={dropdownRef} className="relative">
                <button
                  id="language-select"
                  aria-haspopup="listbox"
                  aria-expanded={isLangOpen}
                  onClick={() => !isRunning && setIsLangOpen((v) => !v)}
                  disabled={isRunning}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm disabled:opacity-60"
                >
                  {/* {currentIconUrl ? (
                    <img src={currentIconUrl} alt="" className="w-4 h-4" />
                  ) : (
                    <span className="w-4 h-4 inline-flex items-center justify-center">
                      {getLanguageIcon(language)}
                    </span>
                  )} */}
                  <span className="truncate max-w-[9rem] sm:max-w-[14rem]">
                    {current?.language} ({current?.version})
                  </span>
                  <ChevronDown size={14} className="opacity-70" />
                </button>
                {isLangOpen && (
                  <div
                    role="listbox"
                    className="absolute z-20 mt-1 w-48 sm:w-64 max-h-64 overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg"
                  >
                    {sorted.map((lang) => {
                      const url = getLanguageIconUrl(lang.language);
                      const selected = lang.language === language;
                      return (
                        <button
                          key={`${lang.language}-${lang.version}`}
                          role="option"
                          aria-selected={selected}
                          onClick={() => {
                            handleLanguageChange(lang.language);
                            setIsLangOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs sm:text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            selected ? "bg-gray-100 dark:bg-gray-700" : ""
                          }`}
                        >
                          {/* {url ? (
                            <img src={url} alt="" className="w-4 h-4" />
                          ) : (
                            <span className="w-4 h-4 inline-flex items-center justify-center">
                              {getLanguageIcon(lang.language)}
                            </span>
                          )} */}
                          <span className="truncate">{lang.language}</span>
                          <span className="ml-auto text-[10px] opacity-60">
                            {lang.version}
                          </span>
                        </button>
                      );
                    })}
                    <div className="px-2 py-1 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                      Icons by Icons8
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          <span className="hidden sm:inline-flex items-center text-[11px] px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            v{version}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
          <span className="hidden sm:inline">Tip:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            Ctrl/Cmd+Enter
            <span className="hidden sm:inline">to Run</span>
          </span>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          theme={theme === "dark" ? "vs-dark" : "vs-light"}
          value={code}
          onChange={(value) => onChange(value || "")}
          onMount={handleEditorDidMount}
          options={{
            readOnly: isRunning,
            selectOnLineNumbers: true,
            roundedSelection: false,
            cursorStyle: "line",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 20,
            wordWrap: "on",
            lineNumbers: "on",
            renderWhitespace: "selection",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            tabCompletion: "on",
            wordBasedSuggestions: "off",
            smoothScrolling: true,
            mouseWheelZoom: true,
            fontLigatures: true,
            renderLineHighlight: "all",
            matchBrackets: "always",
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            padding: { top: 10, bottom: 10 },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
