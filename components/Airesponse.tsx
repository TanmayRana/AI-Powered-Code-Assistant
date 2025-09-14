"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import {
  LuCode,
  LuCheck,
  LuCopy,
  LuMaximize2,
  LuMinimize2,
  LuDownload,
} from "react-icons/lu";
import { useTheme } from "next-themes";

// Define strict types for custom settings
type BorderRadius = "small" | "normal" | "large" | "extra";
type BorderStyle = "solid" | "dashed" | "dotted";
type CodeThemeType = "prism" | "dark";

interface CustomSettings {
  showLineNumbers: boolean;
  codeTheme: CodeThemeType;
  borderRadius: BorderRadius;
  borderStyle: BorderStyle;
  accent: string;
  fontSize: number;
  fontFamily: string;
}

// Context with default customSettings
const CodeThemeContext = React.createContext<{
  customSettings: CustomSettings;
}>({
  customSettings: {
    showLineNumbers: true,
    codeTheme: "prism",
    borderRadius: "normal",
    borderStyle: "solid",
    accent: "primary",
    fontSize: 13,
    fontFamily: "mono",
  },
});

const codeThemes: Record<CodeThemeType, any> = {
  prism,
  dark,
};

interface AiresponseWithThemeProps {
  content: string;
}

const AiresponseWithTheme: React.FC<AiresponseWithThemeProps> = ({
  content,
}) => {
  const { theme } = useTheme();
  const { customSettings } = useContext(CodeThemeContext);

  if (!content) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-[14px] prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = (match && match[1]) || "";
              const isInline = !className;
              return !isInline ? (
                <CodeBlock
                  code={String(children).replace(/\n$/, "")}
                  language={language}
                  theme={theme}
                  customSettings={customSettings}
                />
              ) : (
                <code
                  className="px-2 py-1 bg-muted rounded-md text-sm font-mono transition-colors duration-200 hover:bg-muted/80"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            h1({ children }) {
              return (
                <h1 className="text-2xl font-bold mt-8 mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {children}
                </h1>
              );
            },
            h2({ children }) {
              return (
                <h2 className="text-xl font-bold mt-7 mb-3 text-foreground/90">
                  {children}
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="text-lg font-bold mt-6 mb-2 text-foreground/80">
                  {children}
                </h3>
              );
            },
            ul({ children }) {
              return (
                <ul className="list-disc pl-6 space-y-2 my-4 marker:text-primary/60">
                  {children}
                </ul>
              );
            },
            ol({ children }) {
              return (
                <ol className="list-decimal pl-6 space-y-2 my-4 marker:text-primary/60 marker:font-medium">
                  {children}
                </ol>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4 bg-muted/30 py-2 rounded-r-md transition-all duration-300 hover:border-primary/50 hover:bg-muted/40">
                  {children}
                </blockquote>
              );
            },
            a({ children, href }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors duration-200 underline decoration-primary/30 hover:decoration-primary/60 underline-offset-2"
                >
                  {children}
                </a>
              );
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-border rounded-lg overflow-hidden border border-border">
                    {children}
                  </table>
                </div>
              );
            },
            th({ children }) {
              return (
                <th className="px-4 py-3 bg-muted/50 text-left text-sm font-semibold text-foreground/80">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-4 py-3 text-sm border-t border-border hover:bg-muted/20 transition-colors duration-150">
                  {children}
                </td>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

interface CodeBlockProps {
  code: string;
  language: string;
  theme?: string;
  customSettings: CustomSettings;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  theme,
  customSettings,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(
    customSettings.showLineNumbers
  );
  const codeRef = useRef<HTMLDivElement>(null);
  const [isLongCode, setIsLongCode] = useState(false);

  useEffect(() => {
    const lines = code.split("\n").length;
    setIsLongCode(lines > 20);
    setShowLineNumbers(customSettings.showLineNumbers);
  }, [code, customSettings.showLineNumbers]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${language || "txt"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCodeTheme = () => {
    if (customSettings.codeTheme in codeThemes) {
      return codeThemes[customSettings.codeTheme];
    }
    return theme === "dark" ? dark : prism;
  };

  const getBorderRadius = () => {
    const radiusMap: Record<BorderRadius, string> = {
      small: "rounded-md",
      normal: "rounded-xl",
      large: "rounded-2xl",
      extra: "rounded-3xl",
    };
    return radiusMap[customSettings.borderRadius] || radiusMap.normal;
  };

  const getBorderStyle = () => {
    const styleMap: Record<BorderStyle, string> = {
      solid: "border-solid",
      dashed: "border-dashed",
      dotted: "border-dotted",
    };
    return styleMap[customSettings.borderStyle] || styleMap.solid;
  };

  const getAccentClasses = () => {
    const accent = customSettings.accent;
    return {
      primary: `text-${accent}-500`,
      primaryHover: `hover:text-${accent}-400`,
      primaryBg: `bg-${accent}-500`,
      primaryBgHover: `hover:bg-${accent}-600`,
      border: `border-${accent}-500/20`,
      borderHover: `hover:border-${accent}-500/40`,
      bg: `bg-${accent}-500/5`,
      bgHover: `hover:bg-${accent}-500/10`,
    };
  };

  const accentClasses = getAccentClasses();
  const borderRadiusClass = getBorderRadius();
  const borderStyleClass = getBorderStyle();

  const bgClass =
    theme === "dark"
      ? `bg-zinc-900/95 border-zinc-700/50 ${borderStyleClass}`
      : `bg-zinc-50/95 border-zinc-200/50 ${borderStyleClass}`;

  const headerBgClass = theme === "dark" ? "bg-zinc-800/80" : "bg-zinc-100/80";

  return (
    <div
      className={`relative my-6 overflow-hidden border-2 ${bgClass} ${borderRadiusClass} ${accentClasses.border} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 group ${accentClasses.borderHover}`}
      ref={codeRef}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 ${headerBgClass} border-b border-border/50 backdrop-blur-sm`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded ${accentClasses.bg}`}>
              <LuCode size={16} className={accentClasses.primary} />
            </div>
            <span className="text-sm font-semibold text-foreground/80 tracking-wide">
              {language || "Code"}
            </span>
          </div>
          {/* Code stats */}
          <div className="hidden sm:flex items-center space-x-3 text-xs text-muted-foreground">
            <span className={`px-2 py-1 ${accentClasses.bg} rounded-full`}>
              {code.split("\n").length} lines
            </span>
            <span className={`px-2 py-1 ${accentClasses.bg} rounded-full`}>
              {code.length} chars
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Line numbers toggle */}
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`p-2 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg ${accentClasses.bgHover}`}
            aria-label="Toggle line numbers"
            title="Toggle line numbers"
          >
            <span
              className={`text-xs font-mono ${
                showLineNumbers ? accentClasses.primary : ""
              }`}
            >
              #{showLineNumbers ? "on" : "off"}
            </span>
          </button>
          {/* Expand/Collapse for long code */}
          {isLongCode && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg ${accentClasses.bgHover}`}
              aria-label={isExpanded ? "Collapse code" : "Expand code"}
              title={isExpanded ? "Collapse code" : "Expand code"}
            >
              {isExpanded ? (
                <LuMinimize2 size={16} />
              ) : (
                <LuMaximize2 size={16} />
              )}
            </button>
          )}
          {/* Download button */}
          <button
            onClick={downloadCode}
            className={`p-2 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg ${accentClasses.bgHover}`}
            aria-label="Download code"
            title="Download code"
          >
            <LuDownload size={16} />
          </button>
          {/* Copy button */}
          <button
            onClick={copyCode}
            className={`flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg ${accentClasses.bgHover} focus:outline-none focus:ring-2 focus:ring-${customSettings.accent}-500/20`}
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <LuCheck size={16} className="text-green-500" />
                <span className="text-xs text-green-500 font-medium">
                  Copied!
                </span>
              </>
            ) : (
              <>
                <LuCopy size={16} />
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Copy
                </span>
              </>
            )}
          </button>
        </div>
      </div>
      {/* Code Block */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isLongCode && !isExpanded ? "max-h-96 overflow-hidden" : ""
        }`}
      >
        <SyntaxHighlighter
          language={language}
          style={getCodeTheme()}
          showLineNumbers={showLineNumbers}
          customStyle={{
            fontSize: customSettings.fontSize,
            margin: 0,
            padding: "1.25rem",
            lineHeight: 1.6,
            borderRadius: "inherit",
            fontFamily:
              customSettings.fontFamily === "mono"
                ? 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Liberation Mono", "Courier New", monospace'
                : 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            // backgroundColor: theme === "dark" ? "#0d1117" : "#f5f5f5", // ✅ Fix background

            // color: theme === "dark" ? "#e6edf3" : "#1e293b", // ✅ Fix text color
          }}
          codeTagProps={{
            className: "font-mono",
          }}
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "1em",
            color: theme === "dark" ? "#6b7280" : "#9ca3af",
            userSelect: "none",
            borderRight: `1px solid var(--${customSettings.accent}-200)`,
            marginRight: "1em",
          }}
        >
          {code}
        </SyntaxHighlighter>

        {/* Fade overlay for collapsed long code */}
        {isLongCode && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
        )}
      </div>
      {/* Expand button overlay for long code */}
      {isLongCode && !isExpanded && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => setIsExpanded(true)}
            className={`px-6 py-3 ${accentClasses.primaryBg} ${accentClasses.primaryBgHover} text-white rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm transform hover:scale-105 active:scale-95`}
          >
            <span className="flex items-center space-x-2">
              <LuMaximize2 size={14} />
              <span className="text-black dark:text-white">
                Show {code.split("\n").length - 20}+ more lines
              </span>
            </span>
          </button>
        </div>
      )}
      {/* Animated border effect on hover */}
      <div
        className={`absolute inset-0 ${borderRadiusClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      >
        <div
          className={`absolute inset-0 ${borderRadiusClass} bg-gradient-to-r from-${customSettings.accent}-500/10 via-transparent to-${customSettings.accent}-500/10 animate-pulse`}
        />
      </div>
    </div>
  );
};

export default AiresponseWithTheme;
