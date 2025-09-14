"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ExternalLink,
  Play,
  CheckCircle2,
  Circle,
} from "lucide-react";
import Image from "next/image";

import QuestionModal from "./QuestionModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompletedQuestions,
  toggleQuestion,
} from "@/lib/slices/completedQuestionsSlice";
import { useUser } from "@clerk/nextjs";
import { AppDispatch, RootState } from "@/lib/store";

const platformImg: Record<string, { url: string; name: string }> = {
  atcoder: { url: "/AtCoder.png", name: "AtCoder" },
  codeforces: { url: "/codeforces.png", name: "Codeforces" },
  codechef: { url: "/codechef.png", name: "CodeChef" },
  geeksforgeeks: { url: "/gfg.png", name: "GeeksforGeeks" },
  leetcode: { url: "/leetcode.webp", name: "LeetCode" },
  hackerrank: { url: "/hackerrank.png", name: "HackerRank" },
  interviewbit: { url: "/interviewbit.png", name: "InterviewBit" },
  codestudio: { url: "/codestudio_dark.png", name: "Codestudio Dark" },
  spoj: { url: "/spoj.png", name: "SPOJ" },
};

const difficultyColors = {
  Easy: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  Medium: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  Hard: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
};

const TopicDropdown = ({ topic, questions, index, sheetId }: any) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const { completedQuestions } = useSelector(
    (state: RootState) => state.completedQuestions
  );

  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCompletedQuestions(user.id));
    }
  }, [dispatch, user?.id]);

  const handleQuestionClick = (q: any) => {
    setSelectedQuestion(q);
    setShowModal(true);
  };

  const handleToggleCompletion = (q: any) => {
    if (!user?.id || !sheetId) return;
    const questionId = (q.questionId?._id || q.questionId)?.toString();
    if (!questionId) return;
    dispatch(
      toggleQuestion({
        userId: user.id,
        sheetId: sheetId.toString(),
        questionId,
        completed: !q.isSolved,
      })
    );
  };

  // ✅ Build a fast lookup Set of completed questionIds for this sheet
  const sheetProgress = completedQuestions.find(
    (sheet: any) => sheet.sheetId?.toString() === sheetId?.toString()
  );
  const completedIdSet = new Set(
    (sheetProgress?.questions || [])
      .filter((q: any) => q.completed)
      .map((q: any) => q.questionId?.toString())
  );

  // ✅ Count completed questions for header/progress bar
  const completedCount = questions.filter((q: any) =>
    completedIdSet.has((q.questionId?._id || q.questionId)?.toString())
  ).length;

  const progressPercentage = (completedCount / questions.length) * 100;

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        {/* Header Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-slate-400"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>

            <div className="text-left">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {topic}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {questions.length} problems
                </span>
                <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  {completedCount}/{questions.length} completed
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-[3rem]">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </motion.button>

        {/* Dropdown Questions */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-slate-200 dark:border-slate-700"
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {questions.map((q: any, qIndex: number) => {
                  const platform = q.questionId?.platform;
                  const platformData = platform && platformImg[platform];

                  // ✅ Check if solved via lookup Set
                  const isSolved = completedIdSet.has(
                    (q.questionId?._id || q.questionId)?.toString()
                  );

                  const normalizedQuestion = {
                    ...q.questionId,
                    ...q,
                    isSolved,
                    platformurl: platformData?.url,
                  };

                  return (
                    <motion.div
                      key={q._id || qIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: qIndex * 0.05 }}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200 group cursor-pointer"
                      onClick={() => handleQuestionClick(normalizedQuestion)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Completion Button */}
                          <button
                            className="text-slate-400 hover:text-indigo-500 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCompletion({ ...q, isSolved });
                            }}
                            aria-label={
                              isSolved ? "Mark incomplete" : "Mark complete"
                            }
                          >
                            {isSolved ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          {/* Platform logo */}
                          <div className="flex-shrink-0 w-6 h-6">
                            {platformData && (
                              <Image
                                width={25}
                                height={25}
                                src={platformData.url}
                                alt={platform}
                                className="hidden md:block w-6 h-6 rounded-full object-cover cursor-pointer"
                              />
                            )}
                          </div>

                          {/* Question Details */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    q?.questionId?.problemUrl || "",
                                    "_blank"
                                  );
                                }}
                              >
                                {q?.questionId?.name}
                              </h4>
                              {q.resource && (
                                <Play className="w-4 h-4 text-red-500" />
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`px-2 py-1 rounded-md text-xs font-medium ${
                                  difficultyColors[
                                    q?.questionId
                                      ?.difficulty as keyof typeof difficultyColors
                                  ] || ""
                                }`}
                              >
                                {q?.questionId?.difficulty}
                              </span>

                              <div className="flex items-center gap-1">
                                {q?.questionId?.topics
                                  ?.slice(0, 2)
                                  .map((tag: string, i: number) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-md"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                {q?.questionId?.topics?.length > 2 && (
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    +{q?.questionId?.topics.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* External Link */}
                          {q?.questionId?.problemUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  q?.questionId?.problemUrl,
                                  "_blank"
                                );
                              }}
                              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                              aria-label="Open problem in new tab"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question Modal */}
      {showModal && selectedQuestion && (
        <QuestionModal
          question={selectedQuestion}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default TopicDropdown;
