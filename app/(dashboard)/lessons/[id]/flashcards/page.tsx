/* eslint-disable react/no-unescaped-entities */
"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import FlashcardItem from "@/components/lessons/FlashcardItem";

const FlashCard = () => {
  const { id: courseId } = useParams();
  const router = useRouter();

  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi | undefined>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch flashcards
  useEffect(() => {
    const GetFlashCard = async () => {
      try {
        const response = await axios.post("/api/study-type", {
          courseId,
          studyType: "flashcard",
        });
        // console.log("response=", response.data[0].content);
        setFlashcards(response?.data[0].content || []);
      } catch (error: any) {
        console.error("Failed to fetch flashcard data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) GetFlashCard();
  }, [courseId]);

  // Sync selectedIndex with carousel and reset flip on slide change
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setIsFlipped(false); // Reset card flip when slide changes
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        api?.scrollPrev();
      } else if (event.key === "ArrowRight") {
        api?.scrollNext();
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        handleFlip();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [api]);

  const handleStepClick = (index: number) => {
    api?.scrollTo(index);
  };

  const handleFlip = useCallback(() => setIsFlipped((prev) => !prev), []);

  const progressPercentage =
    flashcards.length > 0 ? ((selectedIndex + 1) / flashcards.length) * 100 : 0;

  // console.log("flashcards=", flashcards);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 
    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 
          dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2"
          >
            Flashcards
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg transition-colors duration-300">
            Master your knowledge with interactive flashcards ✨
          </p>
        </div>

        {!loading && flashcards.length > 0 && (
          <Card
            className="p-6 mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg 
          dark:shadow-slate-900/50 transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Card {selectedIndex + 1} of {flashcards.length}
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>

            <Progress value={progressPercentage} className="h-3 mb-4" />

            <div className="flex gap-2 justify-center">
              {flashcards.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                    index === selectedIndex
                      ? "bg-blue-600 dark:bg-blue-500 shadow-lg shadow-blue-300 dark:shadow-blue-500/50"
                      : index < selectedIndex
                      ? "bg-emerald-400 dark:bg-emerald-500 shadow-md dark:shadow-emerald-500/30"
                      : "bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500"
                  }`}
                  onClick={() => handleStepClick(index)}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </Card>
        )}

        {loading ? (
          <Card
            className="p-12 text-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg 
          dark:shadow-slate-900/50 transition-colors duration-300"
          >
            <div
              className="animate-spin w-8 h-8 border-4 border-blue-600 dark:border-blue-400 
            border-t-transparent rounded-full mx-auto mb-4"
            ></div>
            <p className="text-slate-600 dark:text-slate-300">
              Loading your flashcards...
            </p>
          </Card>
        ) : flashcards.length === 0 ? (
          <Card
            className="p-12 text-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg 
          dark:shadow-slate-900/50 transition-colors duration-300"
          >
            <div className="text-6xl mb-4">📚</div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              No flashcards found for this course.
            </p>
          </Card>
        ) : (
          <div className="flex items-center justify-center">
            <Carousel className="w-full max-w-2xl" setApi={setApi}>
              <CarouselContent className="-ml-4">
                {flashcards.map((item, index) => (
                  <CarouselItem key={index} className="pl-4">
                    <FlashcardItem
                      data={item}
                      isFlipped={isFlipped}
                      handleClick={handleFlip}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-slate-700 
              hover:border-blue-300 dark:hover:border-slate-600 transition-colors"
              />
              <CarouselNext
                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-slate-700 
              hover:border-blue-300 dark:hover:border-slate-600 transition-colors"
              />
            </Carousel>
          </div>
        )}

        {!loading && flashcards.length > 0 && (
          <Card
            className="mt-6 p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 shadow-md 
          dark:shadow-slate-900/30 transition-colors duration-300"
          >
            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">Keyboard shortcuts:</span>
              <span className="mx-2">←→ Navigate</span>
              <span className="mx-2">Space/Enter Flip</span>
            </div>
          </Card>
        )}

        {!loading &&
          flashcards.length > 0 &&
          selectedIndex === flashcards.length - 1 && (
            <Card
              className="mt-8 p-8 text-center bg-gradient-to-r from-emerald-50 to-blue-50 
          dark:from-emerald-900/30 dark:to-blue-900/30 border-0 shadow-lg 
          dark:shadow-slate-900/50 transition-colors duration-300"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Congratulations!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                You've completed all flashcards in this set
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.back()}
                className="cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 
              hover:border-blue-300 dark:hover:border-slate-600 transition-colors"
              >
                ← Back to Course
              </Button>
            </Card>
          )}
      </div>
    </div>
  );
};

export default FlashCard;
