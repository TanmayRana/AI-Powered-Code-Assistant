"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  Zap,
  Code,
  Brain,
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  Trash2,
  RotateCcw,
  Star,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import AiresponseWithTheme from "@/components/Airesponse";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AssistantPage() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! 👋 I'm your AI coding assistant. I can help you with programming questions, code reviews, debugging, and learning new concepts. What would you like to work on today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageRatings, setMessageRatings] = useState<
    Record<string, "up" | "down" | null>
  >({});
  const [favoriteMessages, setFavoriteMessages] = useState<Set<string>>(
    new Set()
  );

  const router = useRouter();

  const { user } = useUser();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const hasSubscription = async (): Promise<boolean> => {
    try {
      const res = await axios.get("/api/check-subscription");
      return res.data?.hasAccess ?? false;
    } catch (error) {
      console.error("Error checking subscription:", error);
      return false;
    }
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);
    // TODO: add subscribe
    try {
      const hasSubscriptionEnabled = await hasSubscription();

      if (!hasSubscriptionEnabled) {
        toast("You've Upgrade premium access for unlimited AI assistance.");
        router.push("/subscribe");

        return;
      }

      const response = await axios.post("/api/ai-chatagent", {
        userInput: currentInput,
      });

      if (response.data && response.data.content) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: response.data.content,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("API error:", error);

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const copyToClipboard = useCallback(async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "1",
        type: "assistant",
        content:
          "Hello! 👋 I'm your AI coding assistant. I can help you with programming questions, code reviews, debugging, and learning new concepts. What would you like to work on today?",
        timestamp: new Date(),
      },
    ]);
    setMessageRatings({});
    setFavoriteMessages(new Set());
    toast.success("Chat cleared!");
  }, []);

  const rateMessage = useCallback(
    (messageId: string, rating: "up" | "down") => {
      setMessageRatings((prev) => ({
        ...prev,
        [messageId]: prev[messageId] === rating ? null : rating,
      }));
      toast.success(`Message ${rating === "up" ? "liked" : "disliked"}!`);
    },
    []
  );

  const toggleFavorite = useCallback((messageId: string) => {
    setFavoriteMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
        toast.success("Removed from favorites");
      } else {
        newSet.add(messageId);
        toast.success("Added to favorites");
      }
      return newSet;
    });
  }, []);

  const quickPrompts = useMemo(
    () => [
      {
        icon: <Zap className="h-3 w-3" />,
        text: "Explain async/await in JavaScript",
        prompt:
          "Explain how async/await works in JavaScript with practical examples",
      },
      {
        icon: <Code className="h-3 w-3" />,
        text: "Python function example",
        prompt: "Show me a Python function example with best practices",
      },
      {
        icon: <Brain className="h-3 w-3" />,
        text: "Debug this code",
        prompt:
          "Help me debug this code and explain common debugging techniques",
      },
      {
        icon: <Lightbulb className="h-3 w-3" />,
        text: "Algorithm optimization",
        prompt: "How can I optimize this algorithm for better performance?",
      },
    ],
    []
  );

  return (
    // className="flex flex-col h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-300"
    <div>
      {/* Enhanced Header */}
      {/* <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Assistant
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your intelligent coding companion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-9 px-3 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div> */}

      <div className="flex-1 flex flex-col p-4 gap-4">
        {/* Chat Window */}
        <Card className="flex-1 flex flex-col border-2 border-gray-200 dark:border-gray-700 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="flex-1 p-0">
            <ScrollArea
              ref={scrollAreaRef}
              className="h-[calc(100vh-200px)] p-6 hide-scrollbar"
            >
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex w-full group ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type !== "user" && (
                      <div className="mr-3 flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-200 dark:ring-blue-800">
                          <Bot className="h-5 w-5" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] px-6 py-5 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                        message.type === "user"
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500 rounded-br-lg animate-in slide-in-from-right-2"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 rounded-bl-lg animate-in slide-in-from-left-2"
                      }`}
                    >
                      <div
                        className={`prose prose-lg max-w-none animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ${
                          message.type === "user"
                            ? "prose-invert prose-blue"
                            : "prose-gray dark:prose-invert dark:prose-blue"
                        }`}
                        style={
                          {
                            "--tw-prose-body":
                              message.type === "user"
                                ? "#e0e7ff"
                                : theme === "dark"
                                ? "#d1d5db"
                                : "#374151",
                            "--tw-prose-headings":
                              message.type === "user"
                                ? "#ffffff"
                                : theme === "dark"
                                ? "#ffffff"
                                : "#111827",
                            "--tw-prose-lead":
                              message.type === "user"
                                ? "#c7d2fe"
                                : theme === "dark"
                                ? "#9ca3af"
                                : "#4b5563",
                            "--tw-prose-links":
                              message.type === "user"
                                ? "#93c5fd"
                                : theme === "dark"
                                ? "#60a5fa"
                                : "#2563eb",
                            "--tw-prose-bold":
                              message.type === "user"
                                ? "#ffffff"
                                : theme === "dark"
                                ? "#ffffff"
                                : "#111827",
                            "--tw-prose-counters":
                              message.type === "user"
                                ? "#c7d2fe"
                                : theme === "dark"
                                ? "#9ca3af"
                                : "#6b7280",
                            "--tw-prose-bullets":
                              message.type === "user"
                                ? "#a5b4fc"
                                : theme === "dark"
                                ? "#6b7280"
                                : "#d1d5db",
                            "--tw-prose-hr":
                              message.type === "user"
                                ? "#4f46e5"
                                : theme === "dark"
                                ? "#4b5563"
                                : "#e5e7eb",
                            "--tw-prose-quotes":
                              message.type === "user"
                                ? "#c7d2fe"
                                : theme === "dark"
                                ? "#9ca3af"
                                : "#374151",
                            "--tw-prose-quote-borders":
                              message.type === "user"
                                ? "#6366f1"
                                : theme === "dark"
                                ? "#4b5563"
                                : "#e5e7eb",
                            "--tw-prose-captions":
                              message.type === "user"
                                ? "#a5b4fc"
                                : theme === "dark"
                                ? "#9ca3af"
                                : "#6b7280",
                            "--tw-prose-code":
                              message.type === "user"
                                ? "#fbbf24"
                                : theme === "dark"
                                ? "#fbbf24"
                                : "#d97706",
                            "--tw-prose-pre-code":
                              message.type === "user"
                                ? "#e0e7ff"
                                : theme === "dark"
                                ? "#d1d5db"
                                : "#374151",
                            "--tw-prose-pre-bg":
                              message.type === "user"
                                ? "#1e1b4b"
                                : theme === "dark"
                                ? "#1f2937"
                                : "#f9fafb",
                            "--tw-prose-th-borders":
                              message.type === "user"
                                ? "#4f46e5"
                                : theme === "dark"
                                ? "#4b5563"
                                : "#d1d5db",
                            "--tw-prose-td-borders":
                              message.type === "user"
                                ? "#6366f1"
                                : theme === "dark"
                                ? "#374151"
                                : "#e5e7eb",
                          } as React.CSSProperties
                        }
                      >
                        {/* <Markdown
                          components={{
                            code(props: any) {
                              const { className, children, ...rest } = props;
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              const isInline = !match;

                              return !isInline && match ? (
                                <div className="relative group">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                                    onClick={() => {
                                      const codeId = `${message.id}-${match[1]}`;
                                      copyToClipboard(
                                        String(children).replace(/\n$/, ""),
                                        codeId
                                      );
                                    }}
                                  >
                                    {copiedCode ===
                                    `${message.id}-${match[1]}` ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <SyntaxHighlighter
                                    PreTag="div"
                                    language={match[1]}
                                    style={
                                      theme === "dark" ? vscDarkPlus : oneLight
                                    }
                                    customStyle={{
                                      margin: 0,
                                      borderRadius: "8px",
                                      fontSize: "14px",
                                      padding: "16px",
                                      backgroundColor:
                                        theme === "dark"
                                          ? "#1e1e1e"
                                          : "#ffffff",
                                      border:
                                        theme === "dark"
                                          ? "1px solid #333"
                                          : "1px solid #e1e4e8",
                                      boxShadow:
                                        theme === "dark"
                                          ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
                                          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                      fontFamily:
                                        "'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                </div>
                              ) : (
                                <code
                                  className={`${
                                    className || ""
                                  } px-2 py-1 rounded text-sm font-mono `}
                                  style={{
                                    backgroundColor:
                                      theme === "dark" ? "#2d2d30" : "#f6f8fa",
                                    color:
                                      theme === "dark" ? "#d4d4d4" : "#24292e",
                                    border:
                                      theme === "dark"
                                        ? "1px solid #3c3c3c"
                                        : "1px solid #d0d7de",
                                    fontFamily:
                                      "'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace",
                                    fontSize: "0.875em",
                                  }}
                                  {...rest}
                                >
                                  {children}
                                </code>
                              );
                            },
                            p: ({ children }) => (
                              <p className="my-4 last:mb-0 leading-7 text-gray-700 dark:text-gray-300">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside space-y-2 mb-4 ml-6 text-gray-700 dark:text-gray-300">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside space-y-2 mb-4 ml-6 text-gray-700 dark:text-gray-300">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="leading-6 flex ">{children}</li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-gray-900 dark:text-white">
                                {children}
                              </strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic text-gray-600 dark:text-gray-400">
                                {children}
                              </em>
                            ),
                            h1: ({ children }) => (
                              <h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-2xl font-bold mb-4 mt-6 first:mt-0 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xl font-semibold mb-3 mt-5 first:mt-0 text-gray-900 dark:text-white">
                                {children}
                              </h3>
                            ),
                            h4: ({ children }) => (
                              <h4 className="text-lg font-semibold mb-2 mt-4 first:mt-0 text-gray-900 dark:text-white">
                                {children}
                              </h4>
                            ),
                            h5: ({ children }) => (
                              <h5 className="text-base font-semibold mb-2 mt-3 first:mt-0 text-gray-900 dark:text-white">
                                {children}
                              </h5>
                            ),
                            h6: ({ children }) => (
                              <h6 className="text-sm font-semibold mb-2 mt-3 first:mt-0 text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                {children}
                              </h6>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-6 py-2 my-6 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg italic text-gray-700 dark:text-gray-300">
                                {children}
                              </blockquote>
                            ),
                            a: ({ children, href }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 hover:decoration-blue-800 dark:hover:decoration-blue-300 transition-colors duration-200"
                              >
                                {children}
                              </a>
                            ),
                            hr: () => (
                              <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                            ),
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-6">
                                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-gray-50 dark:bg-gray-800">
                                {children}
                              </thead>
                            ),
                            tbody: ({ children }) => (
                              <tbody className="bg-white dark:bg-gray-900">
                                {children}
                              </tbody>
                            ),
                            tr: ({ children }) => (
                              <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                                {children}
                              </tr>
                            ),
                            th: ({ children }) => (
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                                {children}
                              </td>
                            ),
                          }}
                        >
                          {message.content}
                        </Markdown> */}

                        <AiresponseWithTheme content={message.content} />
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div
                          className={`text-xs ${
                            message.type === "user"
                              ? "text-blue-100"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </div>

                        {message.type === "assistant" && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => rateMessage(message.id, "up")}
                              className={`h-7 w-7 p-0 ${
                                messageRatings[message.id] === "up"
                                  ? "text-green-500 bg-green-100 dark:bg-green-900/20"
                                  : "hover:text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20"
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => rateMessage(message.id, "down")}
                              className={`h-7 w-7 p-0 ${
                                messageRatings[message.id] === "down"
                                  ? "text-red-500 bg-red-100 dark:bg-red-900/20"
                                  : "hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                              }`}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(message.id)}
                              className={`h-7 w-7 p-0 ${
                                favoriteMessages.has(message.id)
                                  ? "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20"
                                  : "hover:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                              }`}
                            >
                              <Star
                                className={`h-3 w-3 ${
                                  favoriteMessages.has(message.id)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {message.type === "user" && (
                      <div className="ml-3 flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-indigo-200 dark:ring-indigo-800">
                          <p className="font-medium text-lg">
                            {user?.firstName?.charAt(0).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start animate-in slide-in-from-left-2">
                    <div className="mr-3 flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-200 dark:ring-blue-800">
                        <Bot className="h-5 w-5 animate-pulse" />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-lg p-4 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Enhanced Input Box */}
        <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Input
                  placeholder="Ask me anything about coding, algorithms, debugging..."
                  aria-label="Ask me anything about coding"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="h-14 px-6 pr-12 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:shadow-xl"
                />
                {input && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInput("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    ×
                  </Button>
                )}
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    <span className="text-sm">Send</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Enhanced Quick Prompts */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Quick Prompts
                </span>
              </div>
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => setInput(prompt.prompt)}
                    className="h-12 px-4 text-sm border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 group transform hover:scale-105 shadow-sm hover:shadow-md justify-start"
                  >
                    <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 mr-3">
                      {prompt.icon}
                    </span>
                    <span className="text-left">{prompt.text}</span>
                  </Button>
                ))}
              </div> */}

              <div className="flex flex-wrap gap-3">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => setInput(prompt.prompt)}
                    className="h-10 px-4 text-sm border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 group transform hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 mr-2">
                      {prompt.icon}
                    </span>
                    {prompt.text}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
