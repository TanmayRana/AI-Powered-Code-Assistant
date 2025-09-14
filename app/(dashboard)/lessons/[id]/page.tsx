/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Play, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { getLessonById } from "@/lib/slices/lessonSlice";
import axios from "axios";
import MaterialCardItem from "@/components/lessons/MateraialCardItem";
// import MaterialCardItem from "@/components/lessons/MaterialCardItem";

const MaterialList = [
  {
    name: "Notes/Chapters",
    desc: "Read notes to prepare it",
    icon: "book-open-fill",
    image: "/notes.png",
    link: "notes",
    type: "notes",
  },
  {
    name: "Flashcards",
    desc: "Flashcards help you memorize information",
    icon: "book-open-fill",
    image: "/flashcard.png",
    link: "flashcards",
    type: "flashcard",
  },
  {
    name: "Quizzes",
    desc: "Quizzes help you test your knowledge",
    icon: "book-open-fill",
    image: "/quiz.png",
    link: "quizzes",
    type: "quiz",
  },
];

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const lessonId = params.id as string;

  // Local state
  const [chapters, setChapters] = useState<any[]>([]);
  const [studyTypeContent, setStudyTypeContent] = useState<any | null>(null);

  // Redux state
  const lesson = useSelector((state: RootState) => state.lessons.lesson);
  const loadingData = useSelector((state: RootState) => state.lessons.loading);
  const error = useSelector((state: RootState) => state.lessons.error);

  console.log("lesson=", lesson);

  // Fetch lesson from redux
  useEffect(() => {
    if (!lesson) {
      dispatch(getLessonById(lessonId));
    } else if (lesson.lessons?.[0]?.chapters) {
      setChapters(lesson.lessons[0].chapters);
    }
  }, [dispatch, lessonId, lesson]);

  // Fetch study material
  useEffect(() => {
    if (lessonId) {
      GetStudyMaterial();
    }
  }, [lessonId]);

  const GetStudyMaterial = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: lessonId,
        studyType: "ALL",
      });
      setStudyTypeContent(result.data);
    } catch (err: any) {
      toast.error("Failed to load study materials");
      console.error("Error fetching study type content:", err);
    }
  };

  // Shortcuts for course-level data
  const course = lesson?.lessons?.[0];

  // Early returns
  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Error loading lesson</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
          <p className="text-gray-600 mb-4">
            The lesson you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  // Difficulty badge style
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const handleStartLesson = () => {
    toast.success("Starting lesson...");
    // TODO: Navigate to lesson player page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 rounded-md">
      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <CardHeader className="pb-8">
            <div className="flex items-center gap-6 mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="p-2 rounded-full transition hover:bg-blue-100 dark:hover:bg-blue-900/30"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </Button>
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center text-4xl shadow-lg">
                {course.thumbnail}
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {course.courseTitle}
                </CardTitle>
                <p className="text-gray-700 dark:text-gray-400 mt-3 leading-relaxed max-w-3xl">
                  {course.courseSummary}
                </p>
                <div className="flex flex-wrap gap-3 mt-5">
                  <Badge className={getDifficultyColor(lesson.difficulty)}>
                    {lesson.difficulty}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {course.language}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-blue-600 text-blue-700 dark:text-blue-300 dark:border-blue-300"
                  >
                    {lesson.lessons[0].category}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Study Material Section */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MaterialList.map((item, index) => (
            <MaterialCardItem
              key={index}
              item={item}
              studyTypeContent={studyTypeContent}
              course={lesson}
              refreshData={GetStudyMaterial}
            />
          ))}
        </div>

        {/* Chapters Section */}
        <Card>
          <CardContent className="py-6">
            <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {chapters?.map((topic: any, i: number) => (
                <Card
                  key={i}
                  className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900"
                >
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold dark:bg-blue-900/40 dark:text-blue-300">
                        {i + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {topic.chapterTitle}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 pl-10">
                      {topic.chapterSummary}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
