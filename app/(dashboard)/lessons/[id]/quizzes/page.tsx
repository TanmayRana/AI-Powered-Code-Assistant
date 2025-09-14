/* eslint-disable react/no-unescaped-entities */
"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CircleCheck,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Trophy,
  BookOpen,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import QuizCardItem from "@/components/lessons/QuizCardItem";

const Quizzes = () => {
  const { id: courseId } = useParams();
  const router = useRouter();

  const [quizData, setQuizData] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [correctAns, setCorrectAns] = useState<null | boolean>(null);
  const [correctAnswer, setCorrectAnswer] = useState<any>(null);

  const progressPercentage =
    quizData.length > 0 ? ((currentStep + 1) / quizData.length) * 100 : 0;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentStep > 0) {
        handlePrev();
      } else if (e.key === "ArrowRight" && currentStep < quizData.length - 1) {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentStep, quizData.length]);

  useEffect(() => {
    const GetQuiz = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/study-type", {
          courseId,
          studyType: "quiz",
        });
        setQuizData(response.data[0].content || []);
      } catch (error: any) {
        console.error("Failed to fetch quiz data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) GetQuiz();
  }, [courseId]);

  const handleStepChange = (index: number) => {
    setCurrentStep(index);
    setCorrectAns(null);
    setCorrectAnswer(null);
  };

  const handleNext = () => {
    if (currentStep < quizData.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setCorrectAns(null);
      setCorrectAnswer(null);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setCorrectAns(null);
      setCorrectAnswer(null);
    }
  };

  const handleOptionChange = (selectedOption: any, item: any) => {
    const isCorrect = selectedOption.id === item.correctAnswerId;
    const correct = item.options.find(
      (opt: any) => opt.id === item.correctAnswerId
    );

    setCorrectAnswer(correct);
    setCorrectAns(isCorrect);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced header section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-500 shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Quizzes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Test your knowledge and master the concepts
              </p>
            </div>
          </div>

          {quizData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Question Progress
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {currentStep + 1} of {quizData.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3 mb-4" />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 dark:text-blue-400" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Loading your quiz...
            </p>
          </div>
        ) : quizData.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
              No quizzes found
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    Questions
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                    {quizData.map((_, index) => (
                      <Button
                        key={index}
                        variant={index === currentStep ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStepChange(index)}
                        className={`relative overflow-hidden transition-all duration-300 group ${
                          index === currentStep
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-500 text-white shadow-lg scale-105 border-0"
                            : index < currentStep
                            ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/50"
                            : "hover:scale-105 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">
                            Question {index + 1}
                          </span>
                          {index < currentStep && (
                            <CircleCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                          )}
                          {index === currentStep && (
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      </Button>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz content area */}
              <div className="space-y-6">
                <QuizCardItem
                  item={quizData[currentStep]}
                  userSelectedOption={(value: any) =>
                    handleOptionChange(value, quizData[currentStep])
                  }
                />

                {/* Enhanced navigation buttons */}
                <div className="flex justify-between items-center">
                  <Button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="flex items-center gap-2 hover:scale-105 transition-all duration-300 disabled:hover:scale-100 bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Use ← → arrow keys to navigate
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={currentStep === quizData.length - 1}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-500 hover:scale-105 transition-all duration-300 disabled:hover:scale-100"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Enhanced feedback alerts */}
                {correctAns === true && (
                  <Alert className="border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 animate-in slide-in-from-bottom-2 duration-300">
                    <CircleCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-800 dark:text-green-200 font-bold">
                      🎉 Excellent!
                    </AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      You answered the quiz question correctly. Keep up the
                      great work!
                    </AlertDescription>
                  </Alert>
                )}

                {correctAns === false && correctAnswer && (
                  <Alert className="border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 animate-in slide-in-from-bottom-2 duration-300">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <AlertTitle className="text-red-800 dark:text-red-200 font-bold">
                      Not quite right
                    </AlertTitle>
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      Don't worry, learning is a process! <br />
                      <span className="font-semibold mt-2 block p-2 rounded bg-red-100 dark:bg-red-900/30">
                        Correct answer: {correctAnswer.id}. {correctAnswer.text}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Enhanced completion message */}
            {currentStep === quizData.length - 1 && (
              <div className="flex items-center gap-6 flex-col justify-center mt-16 p-8 rounded-2xl bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-950/30 dark:via-blue-950/30 dark:to-purple-950/30 border border-green-200 dark:border-green-800">
                <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-blue-600 dark:from-green-400 dark:to-blue-500 shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Quiz Complete!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Great job completing all the questions. Ready to continue
                    your learning journey?
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="cursor-pointer hover:scale-105 transition-all duration-300 border-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
