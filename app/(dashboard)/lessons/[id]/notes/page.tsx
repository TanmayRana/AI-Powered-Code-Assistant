/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Home,
  RotateCcw,
  Sparkles,
  Clock,
  Target,
  Zap,
  Star,
  Trophy,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
  useMemo,
} from "react";
import { useTheme } from "next-themes";

import rehypeRaw from "rehype-raw";
// import { CodeBlock } from "@/components/CodeBlockProps";
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

interface Note {
  id: string;
  notes: string;
  title?: string;
}

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

// Hoisted context
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

const ViewNotes = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [stepCount, setStepCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const router = useRouter();

  // (Removed duplicate CustomSettings and CodeThemeContext definitions)

  const { theme } = useTheme();
  const { customSettings } = useContext(CodeThemeContext);

  // Window size for confetti
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  const GetNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`/api/study-type`, {
        courseId: id,
        studyType: "notes",
      });

      if (res.data && Array.isArray(res.data)) {
        setNotes(res.data);
      } else {
        throw new Error("Invalid notes format received");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Failed to load notes. Please try again.");
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const navigateToStep = useCallback(
    (newStep: number) => {
      if (newStep >= 0 && newStep < notes.length && newStep !== stepCount) {
        setIsTransitioning(true);
        setTimeout(() => {
          setStepCount(newStep);
          setIsTransitioning(false);

          // Show confetti when reaching the last note
          if (newStep === notes.length - 1) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        }, 200);
      }
    },
    [stepCount, notes.length]
  );

  const nextStep = useCallback(() => {
    if (stepCount < notes.length - 1) {
      navigateToStep(stepCount + 1);
    }
  }, [stepCount, notes.length, navigateToStep]);

  const prevStep = useCallback(() => {
    if (stepCount > 0) {
      navigateToStep(stepCount - 1);
    }
  }, [stepCount, navigateToStep]);

  const restartNotes = () => {
    navigateToStep(0);
    toast.success("Restarted from the beginning", {
      icon: <RotateCcw className="h-4 w-4" />,
    });
  };

  useEffect(() => {
    GetNotes();
  }, [GetNotes]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "h") {
        e.preventDefault();
        prevStep();
      } else if (e.key === "ArrowRight" || e.key === "l") {
        e.preventDefault();
        nextStep();
      } else if (e.key === "Home") {
        e.preventDefault();
        navigateToStep(0);
      } else if (e.key === "End") {
        e.preventDefault();
        navigateToStep(notes.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextStep, prevStep, navigateToStep, notes.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-32" />
          </motion.div>
          <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-5/6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !notes || notes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-md mx-auto m-4 shadow-2xl border-red-200 dark:border-red-800 bg-card/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <motion.div
                className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <BookOpen className="h-8 w-8 text-red-600 dark:text-red-400" />
              </motion.div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {error || "No Notes Available"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {error
                  ? "There was an issue loading your notes."
                  : "This course doesn't have any notes yet."}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={GetNotes}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Return to Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const progressPercentage = ((stepCount + 1) / notes.length) * 100;
  const isCompleted = stepCount === notes.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-200/15 dark:bg-green-800/15 rounded-full blur-xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Confetti for completion */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header Section */}
        <motion.div
          className="mb-8 space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="h-3 w-3 text-yellow-800" />
                </motion.div>
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Study Notes
                </h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4" />
                  Interactive Learning Experience
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border-0"
              >
                <Target className="h-4 w-4 mr-2" />
                {stepCount + 1} of {notes.length}
              </Badge>
            </motion.div>
          </div>

          {/* Enhanced Progress Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Learning Progress
              </span>
              <span className="font-medium">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-muted/50 rounded-full h-4 overflow-hidden shadow-inner backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
              {/* Progress milestones */}
              <div className="absolute top-0 w-full h-4 flex justify-between items-center px-1">
                {[25, 50, 75].map((milestone) => (
                  <motion.div
                    key={milestone}
                    className={`w-2 h-2 rounded-full ${
                      progressPercentage >= milestone
                        ? "bg-white shadow-lg"
                        : "bg-white/50"
                    }`}
                    animate={
                      progressPercentage >= milestone
                        ? { scale: [1, 1.3, 1] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-8 border-border/50 shadow-xl bg-card/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="default"
                    className="flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 disabled:opacity-50 px-6 py-3"
                    onClick={prevStep}
                    disabled={stepCount === 0}
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Previous
                  </Button>
                </motion.div>

                {/* Enhanced Step Dots */}
                <div className="flex items-center gap-3 px-4 overflow-x-auto">
                  {notes.map((_, index) => (
                    <motion.button
                      key={index}
                      className={`relative cursor-pointer transition-all duration-300 flex-shrink-0 ${
                        index === stepCount ? "w-4 h-4" : "w-3 h-3"
                      }`}
                      onClick={() => navigateToStep(index)}
                      title={`Go to note ${index + 1}`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div
                        className={`w-full h-full rounded-full transition-all duration-300 ${
                          index === stepCount
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                            : index < stepCount
                            ? "bg-gradient-to-r from-green-400 to-emerald-500 shadow-md"
                            : "bg-muted hover:bg-muted-foreground/20"
                        }`}
                      />
                      {index < stepCount && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <CheckCircle className="h-2 w-2 text-white" />
                        </motion.div>
                      )}
                      {index === stepCount && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-white/50"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="default"
                    className="flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 disabled:opacity-50 px-6 py-3"
                    onClick={nextStep}
                    disabled={stepCount >= notes.length - 1}
                  >
                    Next
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-2xl border-border/50 bg-card/90 backdrop-blur-md overflow-hidden relative">
            {/* Decorative gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 p-[1px] rounded-lg">
              <div className="w-full h-full bg-card rounded-lg" />
            </div>

            <CardContent className="p-0 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepCount}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="p-8 lg:p-12"
                >
                  {/* <div
                    dangerouslySetInnerHTML={{
                      __html: notes[stepCount]?.notes,
                    }}
                    className="prose prose-xl max-w-none leading-loose
                      prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                      prose-p:text-foreground prose-p:leading-loose prose-p:text-[19px] prose-p:mb-6
                      prose-strong:text-blue-700 dark:prose-strong:text-blue-400 prose-strong:font-semibold
                      prose-code:text-purple-700 dark:prose-code:text-purple-400 prose-code:bg-purple-50 dark:prose-code:bg-purple-950/30 prose-code:px-3 prose-code:py-1 prose-code:rounded-md prose-code:font-medium
                      prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-700 dark:prose-pre:border-gray-600 prose-pre:shadow-2xl prose-pre:rounded-xl
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                      prose-ul:space-y-4 prose-ol:space-y-4 prose-ul:mb-6 prose-ol:mb-6
                      prose-li:text-foreground prose-li:leading-loose prose-li:text-[17px] prose-li:mb-2
                      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                      prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                      prose-h1:mb-10 prose-h2:mb-8 prose-h3:mb-6 prose-h1:mt-0 prose-h2:mt-8 prose-h3:mt-6
                      prose-img:rounded-xl prose-img:shadow-lg"
                  /> */}

                  {/* <div
                    dangerouslySetInnerHTML={{
                      __html: notes[stepCount]?.notes,
                    }}
                    className="prose prose-xl max-w-none leading-loose
                      prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                      prose-p:text-foreground prose-p:leading-loose prose-p:text-[19px] prose-p:mb-6
                      prose-strong:text-blue-700 dark:prose-strong:text-blue-400 prose-strong:font-semibold
                      prose-code:text-purple-700 dark:prose-code:text-purple-400 prose-code:bg-purple-50 dark:prose-code:bg-purple-950/30 prose-code:px-3 prose-code:py-1 prose-code:rounded-md prose-code:font-medium
                      prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-700 dark:prose-pre:border-gray-600 prose-pre:shadow-2xl prose-pre:rounded-xl
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                      prose-ul:space-y-4 prose-ol:space-y-4 prose-ul:mb-6 prose-ol:mb-6
                      prose-li:text-foreground prose-li:leading-loose prose-li:text-[17px] prose-li:mb-2
                      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                      prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                      prose-h1:mb-10 prose-h2:mb-8 prose-h3:mb-6 prose-h1:mt-0 prose-h2:mt-8 prose-h3:mt-6
                      prose-img:rounded-xl prose-img:shadow-lg"
                  /> */}

                  <div
                    className="prose prose-xl max-w-none leading-loose
    prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
    prose-p:text-foreground prose-p:leading-loose prose-p:text-[19px] prose-p:mb-6
    prose-strong:text-blue-700 dark:prose-strong:text-blue-400 prose-strong:font-semibold
    prose-code:font-medium
    prose-pre:shadow-2xl prose-pre:rounded-xl
    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
    prose-ul:space-y-4 prose-ol:space-y-4 prose-ul:mb-6 prose-ol:mb-6
    prose-li:text-foreground prose-li:leading-loose prose-li:text-[17px] prose-li:mb-2
    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
    prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
    prose-h1:mb-10 prose-h2:mb-8 prose-h3:mb-6 prose-h1:mt-0 prose-h2:mt-8 prose-h3:mt-6
    prose-img:rounded-xl prose-img:shadow-lg"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        // loosen typing by ignoring TS on destructure

                        // code({ inline, className, children, ...props }) {
                        //   const match = /language-(\w+)/.exec(className || "");
                        //   if (!inline && match) {
                        //     return (
                        //       <CodeBlock className={className}>
                        //         {String(children).replace(/\n$/, "")}
                        //       </CodeBlock>
                        //     );
                        //   }
                        //   return (
                        //     <code
                        //       className="px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 font-mono text-sm"
                        //       {...props}
                        //     >
                        //       {children}
                        //     </code>
                        //   );
                        // },
                        // @ts-expect-error
                        code({ inline, className, children, ...props }) {
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
                      {notes[stepCount]?.notes || ""}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Completion Celebration */}
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="px-8 pb-8 lg:px-12 lg:pb-12"
                >
                  <div className="mt-16 pt-12 border-t border-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800">
                    <div className="text-center space-y-10">
                      {/* Animated Trophy Section */}
                      <motion.div
                        className="relative"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.7,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="w-40 h-40 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full opacity-20"
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 180, 360],
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                          />
                        </div>
                        <div className="relative flex justify-center">
                          <motion.div
                            className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
                            animate={{
                              y: [0, -10, 0],
                              boxShadow: [
                                "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                "0 35px 60px -12px rgba(0, 0, 0, 0.35)",
                                "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                              ],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Trophy className="h-12 w-12 text-white" />
                          </motion.div>
                        </div>

                        {/* Floating Stars */}
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute"
                            style={{
                              top: `${20 + Math.sin(i) * 60}%`,
                              left: `${20 + Math.cos(i) * 60}%`,
                            }}
                            animate={{
                              y: [0, -20, 0],
                              rotate: [0, 360],
                              opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                              duration: 3 + i * 0.5,
                              repeat: Infinity,
                              delay: i * 0.3,
                            }}
                          >
                            <Star className="h-6 w-6 text-yellow-400 fill-current" />
                          </motion.div>
                        ))}
                      </motion.div>

                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                          Exceptional Achievement!
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                          You've masterfully completed all{" "}
                          <span className="font-bold text-foreground">
                            {notes.length}
                          </span>{" "}
                          notes for this course. Your commitment to continuous
                          learning is truly inspiring!
                        </p>
                      </motion.div>

                      <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            onClick={restartNotes}
                            className="flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 px-8 py-3 text-base"
                          >
                            <RotateCcw className="h-5 w-5" />
                            Review Again
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => router.back()}
                            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-base"
                          >
                            <Home className="h-5 w-5" />
                            Return to Course
                          </Button>
                        </motion.div>
                      </motion.div>

                      {/* Achievement Stats */}
                      <motion.div
                        className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        {[
                          {
                            label: "Notes",
                            value: notes.length,
                            icon: BookOpen,
                          },
                          { label: "Progress", value: "100%", icon: Target },
                          {
                            label: "Status",
                            value: "Complete",
                            icon: CheckCircle,
                          },
                        ].map((stat, index) => (
                          <motion.div
                            key={stat.label}
                            className="text-center p-4 rounded-xl bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm border border-border/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 + index * 0.1 }}
                            whileHover={{
                              y: -5,
                              boxShadow:
                                "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
                            }}
                          >
                            <stat.icon className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                            <div className="text-lg font-bold text-foreground">
                              {stat.value}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {stat.label}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Keyboard shortcuts hint */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 dark:bg-muted/30 rounded-full backdrop-blur-sm border border-border/30">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <p className="text-sm text-muted-foreground">
              Use{" "}
              <kbd className="px-2 py-1 bg-background rounded text-xs font-mono border">
                ←→
              </kbd>{" "}
              or{" "}
              <kbd className="px-2 py-1 bg-background rounded text-xs font-mono border">
                H/L
              </kbd>{" "}
              to navigate
            </p>
          </div>
        </motion.div>
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

const codeThemes: Record<CodeThemeType, any> = {
  prism,
  dark,
};

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

export default ViewNotes;
