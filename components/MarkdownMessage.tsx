import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "next-themes";
import { Copy, Check, Code2, ExternalLink, Quote, List, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface MarkdownMessageProps {
  content: string;
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  const { theme } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-100 break-words">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            return !inline && match ? (
              <div className="group rounded-2xl overflow-hidden my-6 border border-gray-200 dark:border-gray-700 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl transition-all duration-300">
                {/* Code Block Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <Code2 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        {match[1]}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {codeString.split('\n').length} lines
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(codeString)}
                    className="h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-gray-600/50 transition-all duration-200 group-hover:scale-105"
                  >
                    {copiedCode === codeString ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                    )}
                  </Button>
                </div>
                
                {/* Code Content */}
                <div className="relative overflow-hidden">
                  <SyntaxHighlighter
                    style={theme === "dark" ? oneDark : oneLight}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      padding: "1.5rem",
                      background: "transparent",
                      fontSize: "0.875rem",
                      lineHeight: "1.7",
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace",
                      borderRadius: 0,
                    }}
                    showLineNumbers={codeString.split('\n').length > 5}
                    lineNumberStyle={{
                      minWidth: "3em",
                      paddingRight: "1em",
                      color: theme === "dark" ? "#6b7280" : "#9ca3af",
                      fontSize: "0.75rem",
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                  
                  {/* Gradient overlay for long code */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-500/5 dark:to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
            ) : (
              <code
                className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-lg text-sm font-mono border border-blue-200 dark:border-blue-700/50 shadow-sm hover:shadow-md transition-all duration-200"
                {...props}
              >
                {children}
              </code>
            );
          },
          
          p({ children }) {
            return (
              <p className="my-4 leading-relaxed text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {children}
              </p>
            );
          },
          
          strong({ children }) {
            return (
              <strong className="font-semibold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {children}
              </strong>
            );
          },
          
          a({ href, children }) {
            return (
              <a
                href={href}
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline break-all transition-colors duration-200 font-medium group"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </a>
            );
          },
          
          blockquote({ children }) {
            return (
              <div className="relative my-6 pl-6 pr-4 py-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-r-xl border-l-4 border-gradient-to-b from-blue-400 to-purple-500 shadow-sm">
                <div className="absolute top-3 left-3 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <Quote className="h-3 w-3 text-white" />
                </div>
                <blockquote className="italic text-gray-700 dark:text-gray-300 ml-4 text-sm sm:text-base">
                  {children}
                </blockquote>
              </div>
            );
          },
          
          ul({ children }) {
            return (
              <ul className="list-none ml-0 space-y-2 my-4">
                {React.Children.map(children, (child, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2.5 flex-shrink-0 shadow-sm" />
                    <div className="flex-1 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      {child}
                    </div>
                  </li>
                ))}
              </ul>
            );
          },
          
          ol({ children }) {
            return (
              <ol className="list-none ml-0 space-y-2 my-4">
                {React.Children.map(children, (child, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-gray-700 dark:text-gray-300 text-sm sm:text-base pt-0.5">
                      {child}
                    </div>
                  </li>
                ))}
              </ol>
            );
          },
          
          li({ children }) {
            return <div className="leading-relaxed">{children}</div>;
          },
          
          h1({ children }) {
            return (
              <div className="flex items-center gap-3 mt-8 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <Hash className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                  {children}
                </h1>
              </div>
            );
          },
          
          h2({ children }) {
            return (
              <div className="flex items-center gap-3 mt-6 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-md flex items-center justify-center shadow-md">
                  <Hash className="h-3 w-3 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {children}
                </h2>
              </div>
            );
          },
          
          h3({ children }) {
            return (
              <div className="flex items-center gap-2 mt-5 mb-3">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-sm shadow-sm" />
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100">
                  {children}
                </h3>
              </div>
            );
          },
          
          table({ children }) {
            return (
              <div className="my-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                <table className="w-full border-collapse bg-white dark:bg-gray-800">
                  {children}
                </table>
              </div>
            );
          },
          
          thead({ children }) {
            return (
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                {children}
              </thead>
            );
          },
          
          th({ children }) {
            return (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600">
                {children}
              </th>
            );
          },
          
          td({ children }) {
            return (
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                {children}
              </td>
            );
          },
          
          hr() {
            return (
              <div className="my-8 flex items-center">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                <div className="mx-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-sm" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}