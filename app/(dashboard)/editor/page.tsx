"use client";

import React, { useState, useEffect, useCallback } from "react";
import { EditorState, TerminalEntry, CodeFile, Language } from "@/types";
import { PistonAPI } from "@/services/pistonApi";
import CodeEditor from "@/components/editor/CodeEditor";
import Terminal from "@/components/editor/Terminal";
import SettingsPanel from "@/components/editor/SettingsPanel";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Code, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface CodeAssistantResponse {
  analysis: {
    complexity: { time: string; space: string };
    correctness: string;
    readability: string;
    security: string;
    purpose: string;
  };
  debugging: {
    fix_steps: string[];
  };
  review?: {
    strengths?: string[];
    improvements?: string[];
    best_practices?: string[];
  };
  teaching?: {
    adapted_level?: string;
    explanation?: string;
    concepts?: string[];
  };
  refactoring?: {
    enhancements?: string[];
    robustness?: string[];
    refactored_code?: string;
  };
  final_code?: string;
}

const EditorPage: React.FC = () => {
  const [editorState, setEditorState] = useState<EditorState>({
    code: "",
    language: "python",
    version: "3.10.6",
    stdin: "",
    headerFiles: [],
    isRunning: false,
    terminalHistory: [],
  });

  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [codeAssistant, setCodeAssistant] =
    useState<CodeAssistantResponse | null>(null);

  const [files, setFiles] = useState<CodeFile[]>([
    { name: "main.py", content: "" },
  ]);
  const [activeFile] = useState("main.py");

  const [settings, setSettings] = useState({
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: false,
    autoSave: true,
  });

  const router = useRouter();

  const pistonApi = PistonAPI.getInstance();

  // Load languages
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setLoading(true);
        const langs = await pistonApi.getLanguages();
        setLanguages(langs);
        const defaultLang =
          langs.find((l) => l.language === "python") || langs[0];
        if (defaultLang) {
          setEditorState((prev) => ({
            ...prev,
            language: defaultLang.language,
            version: defaultLang.version,
            code: pistonApi.getDefaultCode(defaultLang.language),
          }));
        }
      } catch {
        setError("Failed to load supported languages");
      } finally {
        setLoading(false);
      }
    };
    loadLanguages();
  }, [pistonApi]);

  // Auto-save to localStorage
  useEffect(() => {
    if (editorState.code) {
      localStorage.setItem(
        "editorState",
        JSON.stringify({
          code: editorState.code,
          language: editorState.language,
          version: editorState.version,
          stdin: editorState.stdin,
          headerFiles: editorState.headerFiles,
        })
      );
    }
  }, [
    editorState.code,
    editorState.language,
    editorState.version,
    editorState.stdin,
    editorState.headerFiles,
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("editorState");
    if (saved && !loading) {
      try {
        const parsed = JSON.parse(saved);
        setEditorState((prev) => ({
          ...prev,
          code: parsed.code || prev.code,
          language: parsed.language || prev.language,
          version: parsed.version || prev.version,
          stdin: parsed.stdin || prev.stdin,
          headerFiles: parsed.headerFiles || prev.headerFiles,
        }));
      } catch {
        // ignore JSON parse errors
      }
    }
  }, [loading]);

  // Terminal entry helper
  const addTerminalEntry = useCallback(
    (entry: Omit<TerminalEntry, "id" | "timestamp">) => {
      const newEntry: TerminalEntry = {
        ...entry,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
      };
      setEditorState((prev) => ({
        ...prev,
        terminalHistory: [...prev.terminalHistory, newEntry],
      }));
    },
    []
  );

  // Code run function (simplified)
  const runCode = useCallback(async () => {
    if (!editorState.code.trim()) {
      addTerminalEntry({ type: "error", content: "No code to execute" });
      return;
    }
    setEditorState((prev) => ({ ...prev, isRunning: true }));
    addTerminalEntry({
      type: "info",
      content: `Running ${editorState.language} code...`,
    });

    try {
      const executionFiles: CodeFile[] = [
        ...files.map((file) => ({ name: file.name, content: file.content })),
        ...editorState.headerFiles,
      ];

      const isJsTs = ["javascript", "typescript"].includes(
        editorState.language.toLowerCase()
      );
      const referencesReadlineSync = /readline-sync/.test(editorState.code);
      if (isJsTs && referencesReadlineSync) {
        executionFiles.push({
          name: "node_modules/readline-sync/index.js",
          content: `const fs = require('fs');
let cached = null;
function getLines() {
  if (cached) return cached;
  const data = fs.readFileSync(0, 'utf8');
  cached = data.split(/\\r?\\n/);
  return cached;
}
let cursor = 0;
function readLine() {
  const lines = getLines();
  return lines[cursor++] ?? '';
}
function write(str) { try { process.stdout.write(String(str)); } catch (_) {} }
function question(prompt) { if (prompt) write(prompt); return readLine(); }
function questionInt(prompt) { const v = question(prompt); const n = parseInt(v, 10); return isNaN(n) ? 0 : n; }
function questionFloat(prompt) { const v = question(prompt); const n = parseFloat(v); return isNaN(n) ? 0 : n; }
function prompt() { return question(''); }
module.exports = { question, questionInt, questionFloat, prompt };`,
        });
      }

      const result = await pistonApi.executeCode({
        language: editorState.language,
        version: editorState.version,
        files: executionFiles,
        stdin: editorState.stdin,
      });

      if (result.compile?.output) {
        if (result.compile.code === 0) {
          addTerminalEntry({ type: "info", content: "Compilation successful" });
        } else {
          addTerminalEntry({
            type: "error",
            content: `Compilation failed:\n${result.compile.output}`,
          });
        }
      }

      if (result.run.output) {
        addTerminalEntry({ type: "output", content: result.run.output });
      }
      if (result.run.stderr) {
        addTerminalEntry({ type: "error", content: result.run.stderr });
      }
      if (result.run.code !== 0) {
        addTerminalEntry({
          type: "info",
          content: `Program exited with code ${result.run.code}`,
        });
      }
    } catch (err) {
      addTerminalEntry({
        type: "error",
        content: `Execution failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      });
    } finally {
      setEditorState((prev) => ({ ...prev, stdin: "", isRunning: false }));
    }
  }, [editorState, files, pistonApi, addTerminalEntry]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!editorState.isRunning) {
          runCode();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editorState.isRunning, runCode]);

  const handleCodeChange = (code: string) => {
    setEditorState((prev) => ({ ...prev, code }));
    setFiles((prev) =>
      prev.map((file) =>
        file.name === activeFile ? { ...file, content: code } : file
      )
    );
  };

  const handleLanguageChange = (language: string, version: string) => {
    setEditorState((prev) => ({ ...prev, language, version }));
  };

  // Terminal input & clear
  const handleTerminalInput = (input: string) => {
    addTerminalEntry({ type: "input", content: input });
  };

  const clearTerminal = () => {
    setEditorState((prev) => ({ ...prev, terminalHistory: [] }));
  };

  const hasSubscription = async (): Promise<boolean> => {
    try {
      const res = await axios.get("/api/check-subscription");
      return res.data?.hasAccess ?? false;
    } catch (error) {
      console.error("Error checking subscription:", error);
      return false;
    }
  };

  // AI Assist handler
  const handleAIAssist = async () => {
    if (!editorState.code || !editorState.language) {
      toast.error("Please write some code first!");
      return;
    }

    // TODO: add subscribe
    try {
      const hasSubscriptionEnabled = await hasSubscription();

      if (!hasSubscriptionEnabled) {
        toast("You've Upgrade premium access for unlimited AI analysis.");
        router.push("/subscribe");

        return;
      }

      const response = await axios.post("/api/ai-code-assistant", {
        code: editorState.code,
        language: editorState.language,
      });

      let jsonString = response.data.content.trim();
      const firstBrace = jsonString.indexOf("{");
      const lastBrace = jsonString.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON object found in AI response.");
      }
      jsonString = jsonString.slice(firstBrace, lastBrace + 1);
      const parsedContent = JSON.parse(jsonString);
      // console.log("parsedContent", parsedContent);

      setCodeAssistant(parsedContent);
      setOpen(true);
    } catch (error) {
      toast.error("AI assistant returned invalid JSON.");
      console.error("AI Assistant Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading supported languages...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Editor
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code className="text-blue-600 dark:text-blue-400" size={24} />
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Code Editor
            </h1>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Multi-language IDE with Piston API
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SettingsPanel
            fontSize={settings.fontSize}
            onFontSizeChange={(size) =>
              setSettings((prev) => ({ ...prev, fontSize: size }))
            }
            tabSize={settings.tabSize}
            onTabSizeChange={(size) =>
              setSettings((prev) => ({ ...prev, tabSize: size }))
            }
            wordWrap={settings.wordWrap}
            onWordWrapChange={(enabled) =>
              setSettings((prev) => ({ ...prev, wordWrap: enabled }))
            }
            minimap={settings.minimap}
            onMinimapChange={(enabled) =>
              setSettings((prev) => ({ ...prev, minimap: enabled }))
            }
            autoSave={settings.autoSave}
            onAutoSaveChange={(enabled) =>
              setSettings((prev) => ({ ...prev, autoSave: enabled }))
            }
            onResetSettings={() =>
              setSettings({
                fontSize: 14,
                tabSize: 2,
                wordWrap: true,
                minimap: false,
                autoSave: true,
              })
            }
          />
          <Button variant="outline" size="sm" onClick={handleAIAssist}>
            <Sparkles className="h-4 w-4 mr-2" /> AI Assist
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Code Editor */}
        <div className="md:flex-1 flex flex-col min-h-[40vh] md:min-h-0">
          <CodeEditor
            code={editorState.code}
            language={editorState.language}
            version={editorState.version}
            onChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
            languages={languages}
            isRunning={editorState.isRunning}
          />
        </div>

        {/* Terminal */}
        <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 min-h-[40vh] md:min-h-0">
          <Terminal
            entries={editorState.terminalHistory}
            onInput={handleTerminalInput}
            isRunning={editorState.isRunning}
            onRun={runCode}
            onStop={() =>
              setEditorState((prev) => ({ ...prev, isRunning: false }))
            }
            onClear={clearTerminal}
            stdin={editorState.stdin}
            onStdinChange={(value) =>
              setEditorState((prev) => ({ ...prev, stdin: value }))
            }
          />
        </div>
      </div>

      {/* Code Assistant Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-5/6">
          <SheetHeader>
            <SheetTitle>Code Assistant</SheetTitle>
          </SheetHeader>

          {codeAssistant ? (
            <div className="space-y-6 p-4 overflow-y-auto max-h-[90vh] text-sm">
              {/* Analysis Section */}
              <section>
                <h2 className="font-semibold mb-2">Analysis</h2>
                <p>
                  <strong>Time Complexity:</strong>{" "}
                  {codeAssistant.analysis.complexity.time}
                </p>
                <p>
                  <strong>Space Complexity:</strong>{" "}
                  {codeAssistant.analysis.complexity.space}
                </p>
                <p>
                  <strong>Correctness:</strong>{" "}
                  {codeAssistant.analysis.correctness}
                </p>
                <p>
                  <strong>Purpose:</strong> {codeAssistant.analysis.purpose}
                </p>
                <p>
                  <strong>Readability:</strong>{" "}
                  {codeAssistant.analysis.readability}
                </p>
                <p>
                  <strong>Security:</strong> {codeAssistant.analysis.security}
                </p>
              </section>

              {/* Debugging Section */}
              <section>
                <h2 className="font-semibold mb-2">Debugging Steps</h2>
                {codeAssistant.debugging.fix_steps.length > 0 ? (
                  codeAssistant.debugging.fix_steps.map((step, i) => (
                    <p key={i} className="pl-4 list-disc list-inside">
                      - {step}
                    </p>
                  ))
                ) : (
                  <p>No debugging steps available.</p>
                )}
              </section>

              {/* Code Review Section */}
              <section>
                <h2 className="font-semibold mb-2">Code Review</h2>
                {codeAssistant.review?.strengths?.length ? (
                  <>
                    <p className="font-semibold">Strengths:</p>
                    <ul className="list-disc list-inside mb-2">
                      {codeAssistant.review.strengths.map((point, i) => (
                        <li key={"str-" + i}>{point}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No strengths noted.</p>
                )}
                {codeAssistant.review?.improvements?.length ? (
                  <>
                    <p className="font-semibold">Improvements:</p>
                    <ul className="list-disc list-inside mb-2">
                      {codeAssistant.review.improvements.map((point, i) => (
                        <li key={"imp-" + i}>{point}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No improvements noted.</p>
                )}
                {codeAssistant.review?.best_practices?.length ? (
                  <>
                    <p className="font-semibold">Best Practices:</p>
                    <ul className="list-disc list-inside">
                      {codeAssistant.review.best_practices.map((point, i) => (
                        <li key={"bp-" + i}>{point}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No best practices noted.</p>
                )}
              </section>

              {/* Teaching and Explanation Section */}
              <section>
                <h2 className="font-semibold mb-2">Teaching & Explanation</h2>
                <p>
                  <strong>Adapted Level:</strong>{" "}
                  {codeAssistant.teaching?.adapted_level || "N/A"}
                </p>
                <p className="whitespace-pre-wrap">
                  {codeAssistant.teaching?.explanation ||
                    "No explanation available."}
                </p>
                {codeAssistant.teaching?.concepts?.length ? (
                  <>
                    <p className="font-semibold mt-2">Key Concepts:</p>
                    <ul className="list-disc list-inside">
                      {codeAssistant.teaching.concepts.map((concept, i) => (
                        <li key={"concept-" + i}>{concept}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </section>

              {/* Improvements and Refactoring Section */}
              <section>
                <h2 className="font-semibold mb-2">
                  Improvements & Refactoring
                </h2>
                {codeAssistant.refactoring?.enhancements?.length ? (
                  <>
                    <p className="font-semibold">Enhancements:</p>
                    <ul className="list-disc list-inside mb-2">
                      {codeAssistant.refactoring.enhancements.map((item, i) => (
                        <li key={"enh-" + i}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No enhancements suggested.</p>
                )}
                {codeAssistant.refactoring?.robustness?.length ? (
                  <>
                    <p className="font-semibold">Robustness:</p>
                    <ul className="list-disc list-inside">
                      {codeAssistant.refactoring.robustness.map((item, i) => (
                        <li key={"rob-" + i}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No robustness suggestions.</p>
                )}
                {codeAssistant.refactoring?.refactored_code ? (
                  <>
                    <p className="font-semibold mt-2">Refactored Code:</p>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto whitespace-pre-wrap">
                      {codeAssistant.refactoring.refactored_code}
                    </pre>
                  </>
                ) : null}
              </section>

              {/* Improved Code Output Section */}
              <section>
                <h2 className="font-semibold mb-2">Final Code Output</h2>
                {codeAssistant.final_code ? (
                  <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto whitespace-pre-wrap">
                    {codeAssistant.final_code}
                  </pre>
                ) : (
                  <p>No improved code output available.</p>
                )}
              </section>
            </div>
          ) : (
            <p className="p-4 text-center text-gray-500">
              No AI analysis available. Click AI Assist above to get
              suggestions.
            </p>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EditorPage;
