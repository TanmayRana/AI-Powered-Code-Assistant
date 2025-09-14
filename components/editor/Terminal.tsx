"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { TerminalEntry } from "@/types";
import { Play, Square, Trash2, Copy, Download } from "lucide-react";

interface TerminalProps {
  entries: TerminalEntry[];
  onInput: (input: string) => void;
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
  stdin?: string;
  onStdinChange?: (value: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({
  entries,
  onInput,
  isRunning,
  onRun,
  onStop,
  onClear,
  stdin,
  onStdinChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [entries]);

  useEffect(() => {
    if (!isRunning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRunning]);

  const [activeTab, setActiveTab] = useState<"output" | "input">("output");
  // Switch to Output whenever a run starts (covers keyboard shortcut triggers)
  useEffect(() => {
    if (isRunning) {
      setActiveTab("output");
    }
  }, [isRunning]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        onInput(inputValue);
        if (onStdinChange) {
          onStdinChange((stdin || "") + inputValue + "\n");
        }
        setInputValue("");
      }
    }
  };

  const handleRunClick = () => {
    if (isRunning) {
      onStop();
    } else {
      onRun();
    }
  };

  const copyOutput = () => {
    const output = entries
      .filter((entry) => entry.type === "output" || entry.type === "error")
      .map((entry) => entry.content)
      .join("\n");

    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const downloadOutput = () => {
    const output = entries
      .filter((entry) => entry.type === "output" || entry.type === "error")
      .map((entry) => entry.content)
      .join("\n");

    if (output) {
      const blob = new Blob([output], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getEntryIcon = (type: TerminalEntry["type"]) => {
    switch (type) {
      case "input":
        return "> ";
      case "output":
        return "";
      case "error":
        return "✗ ";
      case "info":
        return "ℹ ";
      default:
        return "";
    }
  };

  const getEntryColor = (type: TerminalEntry["type"]) => {
    switch (type) {
      case "input":
        return "text-blue-400";
      case "output":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "info":
        return "text-yellow-400";
      default:
        return "text-gray-300";
    }
  };

  const tabbedEntries = useMemo(() => {
    if (activeTab === "output") {
      return entries.filter((e) => e.type !== "input");
    }
    return [];
  }, [entries, activeTab]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100 font-mono text-sm rounded-none md:rounded-l-md">
      {/* Terminal Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 bg-gray-800/95 border-b border-gray-700 backdrop-blur-sm">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="hidden sm:flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-300 whitespace-nowrap">
            Terminal
          </span>
          <div className="ml-2 flex items-center rounded-md bg-gray-700/60 p-1">
            <button
              onClick={() => setActiveTab("output")}
              className={`px-3 py-1 text-xs rounded ${
                activeTab === "output"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Output
            </button>
            <button
              onClick={() => setActiveTab("input")}
              className={`px-3 py-1 text-xs rounded ${
                activeTab === "input"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Input
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 justify-end">
          <button
            onClick={copyOutput}
            className="p-1 hover:bg-gray-700 rounded-md transition-colors"
            title="Copy output"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={downloadOutput}
            className="p-1 hover:bg-gray-700 rounded-md transition-colors"
            title="Download output"
          >
            <Download size={14} />
          </button>
          <button
            onClick={onClear}
            className="p-1 hover:bg-gray-700 rounded-md transition-colors"
            title="Clear terminal"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={handleRunClick}
            disabled={isRunning && !onStop}
            className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
              isRunning
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRunning ? (
              <>
                <Square size={12} />
                Stop
              </>
            ) : (
              <>
                <Play size={12} />
                Run
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1"
        style={{ minHeight: "200px" }}
      >
        {activeTab === "input" ? (
          <div className="h-full">
            <div className="text-xs text-gray-400 mb-2">
              Provide program input (stdin). Node.js readline and other stdin
              consumers will read from this.
            </div>
            <textarea
              value={typeof stdin === "string" ? stdin : ""}
              onChange={(e) => onStdinChange && onStdinChange(e.target.value)}
              disabled={isRunning}
              placeholder="Type input that your program will read from stdin..."
              className="w-full h-48 resize-none border border-gray-700 rounded-md p-3 bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        ) : tabbedEntries.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <div className="text-lg mb-2">🚀</div>
            <div>
              {entries.length === 0
                ? "Ready to run your code!"
                : "No output yet."}
            </div>
            <div className="text-xs mt-1">
              Press Ctrl+Enter or click Run to execute
            </div>
          </div>
        ) : (
          tabbedEntries.map((entry) => (
            <div key={entry.id} className="flex items-start gap-2">
              <span className={`${getEntryColor(entry.type)} flex-shrink-0`}>
                {getEntryIcon(entry.type)}
              </span>
              <span
                className={`${getEntryColor(
                  entry.type
                )} whitespace-pre-wrap break-words`}
              >
                {entry.content}
              </span>
            </div>
          ))
        )}

        {/* Input Prompt */}
        {isRunning && activeTab === "output" && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-blue-400"> </span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter input..."
              className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-500"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-1 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        {isRunning ? (
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Running...
          </span>
        ) : (
          <span>Ready</span>
        )}
      </div>
    </div>
  );
};

export default Terminal;
