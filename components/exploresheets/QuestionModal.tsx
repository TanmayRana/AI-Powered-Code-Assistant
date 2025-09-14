"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Play,
  BookOpen,
  Tag,
  Users,
  CheckCircle2,
  Circle,
  Star,
  Briefcase,
} from "lucide-react";

interface Question {
  _id: string;
  name?: string;
  title?: string;
  platform?: string;
  platformurl?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  completed?: boolean;
  problemUrl?: string;
  resource?: string;
  topics?: string[];
  companyTags?: string[];
}

interface QuestionModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleCompletion?: (questionId: string) => void;
}

const difficultyColors = {
  Easy: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  Medium: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  Hard: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
};

const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  isOpen,
  onClose,
  onToggleCompletion,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "notes">("overview");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (question?._id) {
      const savedNotes = localStorage.getItem(`notes-${question._id}`) || "";
      setNotes(savedNotes);
    }
  }, [question]);

  const handleSaveNotes = () => {
    if (question?._id) {
      localStorage.setItem(`notes-${question._id}`, notes);
      alert("Notes saved!");
    }
  };

  if (!question) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                {question?.platformurl ? (
                  <img
                    src={question.platformurl}
                    alt={question.platform || "Platform Logo"}
                    className="w-8 h-8 rounded"
                  />
                ) : (
                  <span className="text-2xl">📝</span>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {question.title || question.name || "Untitled Question"}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    {question.difficulty && (
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          difficultyColors[
                            question.difficulty as keyof typeof difficultyColors
                          ] || ""
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <Star className="w-3 h-3" />
                      4.2
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {[
                { id: "overview", label: "Overview", icon: BookOpen },
                { id: "notes", label: "Notes", icon: BookOpen },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "overview" | "notes")}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        onToggleCompletion &&
                        question._id &&
                        onToggleCompletion(question._id)
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
                    >
                      {question.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {question.completed ? "Completed" : "Mark Complete"}
                      </span>
                    </button>

                    {question.problemUrl && (
                      <button
                        onClick={() =>
                          window.open(question.problemUrl, "_blank")
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Open Problem
                        </span>
                      </button>
                    )}

                    {question.resource && (
                      <button
                        onClick={() => window.open(question.resource, "_blank")}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors duration-200"
                      >
                        <Play className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Watch Solution
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Topics */}
                  {question.topics && question.topics.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          Topics
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {question.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-md"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Companies */}
                  {question.companyTags && question.companyTags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          Companies
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {question.companyTags.map((company, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-md"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Sheets */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        Popular Sheets
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Blind 75", "Grind 169", "Top Interview Questions"].map(
                        (sheet, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm rounded-md"
                          >
                            {sheet}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "notes" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Your Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your notes, approach, or solution here..."
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      rows={8}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveNotes}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Save Notes
                    </button>
                    <button
                      onClick={() => setNotes("")}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors duration-200"
                    >
                      Clear
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuestionModal;
