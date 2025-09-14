"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";

import { Button } from "@/components/ui/button";

import { AppDispatch, RootState } from "@/lib/store";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { fetchFullSheetsData } from "@/lib/slices/fullSheetsSlice";
import { motion } from "framer-motion";

import Dropdown from "@/components/exploresheets/Dropdown";

// -------------------- Types --------------------
interface Question {
  id: string;
  topic: string;
  completed: boolean;
  [key: string]: any; // for extra unknown props
}

interface SheetInfo {
  _id: string;
  name: string;
  description?: string;
  isFollowing?: boolean;
}

interface FullSheetData {
  sheet: SheetInfo;
  questions: Question[];
}

// -------------------- Component --------------------
function Sheet() {
  const params = useParams();
  const sheetname = params?.sheetname as string;

  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, isError } = useSelector(
    (state: RootState) => state.FullSheetsData
  );

  const [sheetData, setSheetData] = useState<FullSheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [questionData, setQuestionData] = useState<Question[]>([]);
  const [questionTopics, setQuestionTopics] = useState<string[]>([]);

  const { user } = useUser();
  const userId = user?.id;

  // Fetch sheet
  useEffect(() => {
    if (sheetname) {
      dispatch(fetchFullSheetsData(sheetname));
    }
  }, [dispatch, sheetname]);

  // Update state when data changes
  useEffect(() => {
    const matchedSheet = data?.sheet;

    if (matchedSheet) {
      setSheetData(data as FullSheetData);

      const questions: Question[] = data.questions || [];
      setQuestionData(questions);

      const uniqueTopics: string[] = Array.from(
        new Set(questions.map((q) => q.topic))
      );
      setQuestionTopics(uniqueTopics);

      if (matchedSheet.isFollowing !== undefined) {
        setIsFollowing(matchedSheet.isFollowing);
      }
    } else {
      setSheetData(null);
      setQuestionData([]);
      setQuestionTopics([]);
      setIsFollowing(null);
    }
  }, [data, sheetname]);

  // Toggle completion locally on sheet level
  const handleToggleCompletion = (questionId: string) => {
    setQuestionData((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, completed: !q.completed } : q
      )
    );
  };

  const handleFollow = async () => {
    if (!sheetData) return;
    const sheetId = sheetData.sheet._id;
    setLoading(true);
    try {
      await axios.post(`/api/Following`, {
        userId,
        followedSheetIds: [sheetId],
      });
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following sheet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnFollow = async () => {
    if (!sheetData) return;
    const sheetId = sheetData.sheet._id;
    setLoading(true);
    try {
      await axios.post(`/api/UnFollowing`, {
        userId,
        unfollowedSheetId: sheetId,
      });
      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing sheet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="space-y-6">
        <section className="shadow-md bg-white dark:bg-gray-800 rounded-lg p-4 border">
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p className="text-red-500">Failed to fetch sheet data.</p>
          ) : !sheetData ? (
            <p className="text-gray-500">No sheet found with this name.</p>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 md:justify-between">
              <div className="flex flex-col gap-4 md:w-[80%] w-full">
                <h1 className="text-2xl font-bold">{sheetData.sheet.name}</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {sheetData.sheet.description || "No description provided."}
                </p>

                {isFollowing ? (
                  <Button
                    onClick={handleUnFollow}
                    variant="outline"
                    disabled={loading}
                    className="flex items-center gap-2 text-sm font-medium border-gray-300 dark:border-gray-600 transition-all bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white w-[10rem]"
                  >
                    <CiBookmarkCheck
                      size={16}
                      className="text-green-600 dark:text-green-400"
                    />
                    <span>{loading ? "Unfollowing..." : "Following"}</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleFollow}
                    variant="outline"
                    disabled={loading}
                    className="flex items-center gap-2 text-sm font-medium transition-all bg-[#f57c06] dark:bg-[#f57c06] text-white hover:bg-[#e56b04] w-[10rem]"
                  >
                    <CiBookmark size={16} />
                    <span>{loading ? "Following..." : "Follow"}</span>
                  </Button>
                )}
              </div>

              <div className="md:w-[20%] w-full flex items-center justify-center">
                <div className="w-[50%] md:w-[70%]">
                  <CircularProgressbar value={66} text={`${66}%`} />
                </div>
              </div>
            </div>
          )}
        </section>

        {questionTopics.length > 0 && (
          <section className="pt-2">
            {/* <h2 className="text-xl font-semibold mb-4">
              Topics {questionTopics.length}
            </h2> */}
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Topics {questionTopics.length}
            </h2>
            <div>
              {questionTopics.map((topic: string, index: number) => {
                const topicQuestions = questionData.filter(
                  (q) => q.topic === topic
                );

                return (
                  <motion.div
                    key={topic}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="mb-4 border rounded-md dark:border-0 dark:rounded-none"
                  >
                    <Dropdown
                      topic={topic}
                      questions={topicQuestions}
                      index={index}
                      onToggleCompletion={handleToggleCompletion}
                    />
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Sheet;
