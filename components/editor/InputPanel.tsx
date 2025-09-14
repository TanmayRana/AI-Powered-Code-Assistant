/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { CodeFile } from "@/types";
import { Plus, X, FileText } from "lucide-react";

interface InputPanelProps {
  stdin: string;
  onStdinChange: (stdin: string) => void;
  headerFiles: CodeFile[];
  onHeaderFilesChange: (files: CodeFile[]) => void;
  language: string;
  isRunning: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  stdin,
  onStdinChange,
  headerFiles,
  onHeaderFilesChange,
  language,
  isRunning,
}) => {
  const [activeTab, setActiveTab] = useState<"stdin" | "headers">("stdin");

  const addHeaderFile = () => {
    const newFile: CodeFile = {
      name: `header.${getFileExtension()}`,
      content: getDefaultHeaderContent(),
    };
    onHeaderFilesChange([...headerFiles, newFile]);
  };

  const removeHeaderFile = (index: number) => {
    const newFiles = headerFiles.filter((_, i) => i !== index);
    onHeaderFilesChange(newFiles);
  };

  const updateHeaderFile = (
    index: number,
    field: "name" | "content",
    value: string
  ) => {
    const newFiles = [...headerFiles];
    newFiles[index] = { ...newFiles[index], [field]: value };
    onHeaderFilesChange(newFiles);
  };

  const getFileExtension = (): string => {
    const extensions: Record<string, string> = {
      cpp: "h",
      c: "h",
      java: "java",
      python: "py",
      javascript: "js",
      typescript: "ts",
    };
    return extensions[language.toLowerCase()] || "txt";
  };

  const getDefaultHeaderContent = (): string => {
    const templates: Record<string, string> = {
      cpp: `#ifndef HEADER_H
#define HEADER_H

// Your header content here

#endif`,
      c: `#ifndef HEADER_H
#define HEADER_H

// Your header content here

#endif`,
      java: `// Your Java class content here`,
      python: `# Your Python module content here`,
      javascript: `// Your JavaScript module content here`,
      typescript: `// Your TypeScript module content here`,
    };
    return templates[language.toLowerCase()] || "// Your header content here";
  };

  const needsHeaderFiles = ["cpp", "c", "java"].includes(
    language.toLowerCase()
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("stdin")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "stdin"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Standard Input
        </button>
        {needsHeaderFiles && (
          <button
            onClick={() => setActiveTab("headers")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "headers"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Header Files ({headerFiles.length})
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "stdin" ? (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Standard Input
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter input that your program will read from stdin
              </p>
            </div>
            <div className="flex-1 p-3">
              <textarea
                value={stdin}
                onChange={(e) => onStdinChange(e.target.value)}
                placeholder="Enter input for your program..."
                disabled={isRunning}
                className="w-full h-full resize-none border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Header Files
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add header files for compiled languages
                </p>
              </div>
              <button
                onClick={addHeaderFile}
                disabled={isRunning}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={12} />
                Add File
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {headerFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No header files added</p>
                  <p className="text-xs">
                    Click "Add File" to create a header file
                  </p>
                </div>
              ) : (
                headerFiles.map((file, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-600 rounded-md"
                  >
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <input
                        type="text"
                        value={file.name}
                        onChange={(e) =>
                          updateHeaderFile(index, "name", e.target.value)
                        }
                        disabled={isRunning}
                        className="flex-1 bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
                      />
                      <button
                        onClick={() => removeHeaderFile(index)}
                        disabled={isRunning}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="p-2">
                      <textarea
                        value={file.content}
                        onChange={(e) =>
                          updateHeaderFile(index, "content", e.target.value)
                        }
                        disabled={isRunning}
                        placeholder="Enter header file content..."
                        className="w-full h-32 resize-none border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputPanel;
