// /* eslint-disable jsx-a11y/role-supports-aria-props */
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import { toast } from "react-hot-toast";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";

// import { Input } from "@/components/ui/input";
// import {
//   BookOpen,
//   Clock,
//   CheckCircle,
//   Play,
//   Code,
//   Trophy,
//   Users,
//   Search,
//   Filter,
//   Plus,
//   ArrowRight,
//   Sparkles,
//   Target,
//   BookmarkPlus,
//   Zap,
//   TrendingUp,
//   Award,
//   Rocket,
//   Shield,
//   ChevronRight,
// } from "lucide-react";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";

// import { createLesson, getLessons } from "@/lib/slices/lessonSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/lib/store";
// import axios from "axios";
// import { useUser } from "@clerk/nextjs";

// export default function LessonsPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const { user } = useUser();

//   // Redux state
//   const lessonsData = useSelector((state: RootState) => state.lessons.lessons);
//   const loadingData = useSelector((state: RootState) => state.lessons.loading);
//   const error = useSelector((state: RootState) => state.lessons.error);

//   // Local state
//   const [selectedLesson, setSelectedLesson] = useState(
//     lessonsData.length > 0 ? lessonsData[0] : null
//   );
//   const [searchTerm, setSearchTerm] = useState("");
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [animateCard, setAnimateCard] = useState(false);
//   const [filterLevel, setFilterLevel] = useState("all");

//   const [purpose, setPurpose] = useState("");
//   const [topic, setTopic] = useState("");
//   const [difficulty, setDifficulty] = useState("");

//   // Update selectedLesson when lessonsData changes
//   useEffect(() => {
//     if (lessonsData.length > 0) {
//       setSelectedLesson(lessonsData[0]);
//     }
//   }, [lessonsData, selectedLesson]);

//   // Fetch lessons on mount with animation
//   useEffect(() => {
//     dispatch(getLessons(user?.primaryEmailAddress?.emailAddress as string));
//     setTimeout(() => setAnimateCard(true), 100);
//   }, [dispatch]);

//   const hasSubscription = async (): Promise<boolean> => {
//     try {
//       const res = await axios.get("/api/check-subscription");
//       return res.data?.hasAccess ?? false;
//     } catch (error) {
//       console.error("Error checking subscription:", error);
//       return false;
//     }
//   };

//   // Color helpers with enhanced gradients
//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty?.toLowerCase()) {
//       case "easy":
//         return "bg-gradient-to-r from-emerald-200 via-green-200 to-green-300 text-emerald-800 border border-emerald-300 dark:from-emerald-900/40 dark:via-green-900/40 dark:to-green-800/40 dark:text-emerald-200 dark:border-emerald-700";

//       case "intermediate":
//       case "medium":
//         return "bg-gradient-to-r from-amber-200 via-yellow-200 to-yellow-300 text-amber-800 border border-amber-300 dark:from-amber-900/40 dark:via-yellow-900/40 dark:to-yellow-800/40 dark:text-amber-200 dark:border-amber-700";

//       case "advanced":
//         return "bg-gradient-to-r from-rose-200 via-red-200 to-red-300 text-rose-800 border border-rose-300 dark:from-rose-900/40 dark:via-red-900/40 dark:to-red-800/40 dark:text-rose-200 dark:border-rose-700";

//       default:
//         return "bg-gradient-to-r from-slate-200 via-gray-200 to-gray-300 text-gray-800 border border-gray-300 dark:from-slate-900/40 dark:via-gray-900/40 dark:to-gray-800/40 dark:text-gray-200 dark:border-gray-700";
//     }
//   };

//   // Filter lessons by search term and difficulty
//   const filteredLessons = lessonsData.filter((lesson) => {
//     const lowerTerm = searchTerm.toLowerCase();
//     const matchesSearch =
//       lesson.topic?.toLowerCase().includes(lowerTerm) ||
//       lesson.lessons?.[0]?.courseTitle?.toLowerCase().includes(lowerTerm) ||
//       lesson.lessons?.[0]?.language?.toLowerCase().includes(lowerTerm) ||
//       lesson.lessons?.[0]?.category?.toLowerCase().includes(lowerTerm);

//     const matchesFilter =
//       filterLevel === "all" ||
//       (lesson.difficulty || lesson.lessons?.[0]?.difficulty)?.toLowerCase() ===
//         filterLevel.toLowerCase();

//     return matchesSearch && matchesFilter;
//   });

//   // Add new lesson handler
//   const handleAddLesson = async () => {
//     if (!purpose || !topic || !difficulty) {
//       toast.error("Please fill all fields");
//       return;
//     }
//     // TODO: add subscribe
//     try {
//       const hasSubscriptionEnabled = await hasSubscription();

//       if (!hasSubscriptionEnabled) {
//         toast("You've Upgrade premium access for unlimited lessons.");
//         router.push("/subscribe");

//         return;
//       }

//       setLoading(true);
//       const actionResult = await dispatch(
//         createLesson({ purpose, topic, difficulty })
//       );

//       if (createLesson.fulfilled.match(actionResult)) {
//         const newLesson = actionResult.payload;
//         toast.success("✨ Lesson created successfully!");
//         if (newLesson) {
//           router.push(`/lessons/${newLesson}`);
//         }
//         setOpen(false);
//         setPurpose("");
//         setTopic("");
//         setDifficulty("");
//       } else {
//         toast.error("Failed to add lesson");
//       }
//     } catch {
//       toast.error("Error adding lesson");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
//       <div className="space-y-8 py-4 sm:p-6 lg:p-2 ">
//         {/* Enhanced Header with floating elements */}
//         <div
//           className={`transform transition-all duration-1000 ${
//             animateCard
//               ? "translate-y-0 opacity-100"
//               : "translate-y-8 opacity-0"
//           }`}
//         >
//           <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm">
//             {/* Floating decorative elements */}
//             <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"></div>
//             <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
//             <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-lg animate-pulse delay-500"></div>

//             <CardHeader className="pb-6">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//                     <BookOpen className="h-8 w-8 text-white" />
//                   </div>
//                   <div>
//                     <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                       Learning Center
//                     </CardTitle>
//                     <p className="text-gray-600 dark:text-gray-400 mt-1">
//                       Master coding skills with interactive lessons and
//                       challenges
//                     </p>
//                   </div>
//                 </div>
//                 <Button
//                   className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
//                   onClick={() => setOpen(true)}
//                 >
//                   <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
//                   Create Lesson
//                   <Sparkles className="h-4 w-4 ml-2 opacity-70" />
//                 </Button>
//               </div>
//             </CardHeader>
//           </Card>
//         </div>

//         {/* Enhanced Search and Filter */}
//         <div
//           className={`transform transition-all duration-1000 delay-200 ${
//             animateCard
//               ? "translate-y-0 opacity-100"
//               : "translate-y-8 opacity-0"
//           }`}
//         >
//           <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
//             <CardContent className="pt-6">
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="relative flex-1 group">
//                   <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
//                   <Input
//                     placeholder="Search lessons, topics, or technologies..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-12 h-14 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl text-lg bg-white dark:bg-slate-800 transition-all duration-200"
//                   />
//                 </div>
//                 <div className="">
//                   <Select value={filterLevel} onValueChange={setFilterLevel}>
//                     <SelectTrigger className="h-14 px-6 rounded-xl border-2 hover:border-blue-500 transition-all duration-200 min-w-[180px]">
//                       <Filter className="h-5 w-5 mr-2" />
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Levels</SelectItem>
//                       <SelectItem value="easy">Easy</SelectItem>
//                       <SelectItem value="medium">Medium</SelectItem>
//                       <SelectItem value="hard">Hard</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Enhanced Tabs */}
//         <div
//           className={`transform transition-all duration-1000 delay-300 ${
//             animateCard
//               ? "translate-y-0 opacity-100"
//               : "translate-y-8 opacity-0"
//           }`}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
//             {/* Enhanced Lessons List */}
//             <div className="md:col-span-1 xl:col-span-2 h-full">
//               <Card className="h-full flex flex-col border border-border bg-card">
//                 <CardHeader className="pb-0">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
//                       Your Learning Journey
//                     </h2>
//                     <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
//                       <Target className="h-4 w-4" />
//                       <span className="text-sm font-medium">
//                         {filteredLessons.length} lessons found
//                       </span>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="pt-4 flex-1 min-h-0">
//                   <div className="space-y-4 h-full overflow-y-auto md:max-h-[60vh] xl:max-h-[70vh] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent pr-2">
//                     {loadingData && (
//                       <div className="flex items-center justify-center py-12">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                         <span className="ml-3 text-slate-600 dark:text-slate-400">
//                           Loading lessons...
//                         </span>
//                       </div>
//                     )}
//                     {error && (
//                       <div className="text-center py-12">
//                         <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                           <Shield className="h-8 w-8 text-red-500" />
//                         </div>
//                         <p className="text-red-600 dark:text-red-400 font-medium">
//                           {error}
//                         </p>
//                       </div>
//                     )}
//                     {!loadingData && filteredLessons.length === 0 && (
//                       <div className="text-center py-16">
//                         <BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
//                         <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
//                           No lessons found
//                         </h3>
//                         <p className="text-slate-500 dark:text-slate-500 mb-6">
//                           Create your first lesson to get started!
//                         </p>
//                         <Button
//                           onClick={() => setOpen(true)}
//                           className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl"
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           Create Lesson
//                         </Button>
//                       </div>
//                     )}

//                     {filteredLessons.map((lesson, index) => {
//                       const course = lesson.lessons?.[0] || {};
//                       const isSelected = selectedLesson?._id === lesson._id;
//                       return (
//                         <div
//                           key={lesson._id}
//                           className={`transform transition-all duration-500`}
//                           style={{ animationDelay: `${index * 100}ms` }}
//                         >
//                           <Card
//                             className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-lg backdrop-blur-sm overflow-hidden ${
//                               isSelected
//                                 ? "relative before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-600 shadow-blue-200/50 dark:shadow-blue-900/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50"
//                                 : "bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800"
//                             }`}
//                             onClick={() => setSelectedLesson(lesson)}
//                             role="button"
//                             aria-selected={isSelected}
//                           >
//                             <CardContent className="p-6">
//                               <div className="flex gap-6">
//                                 <div className="flex-shrink-0">
//                                   <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-105 transition-transform">
//                                     {course.thumbnail || "📚"}
//                                   </div>
//                                 </div>
//                                 <div className="flex-1 space-y-4">
//                                   <div className="space-y-3">
//                                     <div className="flex items-start justify-between">
//                                       <div className="flex-1">
//                                         <h3
//                                           className={`text-xl font-bold transition-colors duration-200 ${
//                                             isSelected
//                                               ? "text-blue-700 dark:text-blue-300"
//                                               : "text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
//                                           }`}
//                                           onClick={() =>
//                                             router.push(
//                                               `/lessons/${lesson._id}`
//                                             )
//                                           }
//                                         >
//                                           {/* {lesson.topic ||
//                                             course.lessons.courseTitle} */}
//                                           {course.courseTitle}
//                                         </h3>
//                                         <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm leading-relaxed">
//                                           {course.courseSummary}
//                                         </p>
//                                       </div>
//                                       {isSelected && (
//                                         <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
//                                           <CheckCircle className="h-5 w-5" />
//                                         </div>
//                                       )}
//                                     </div>
//                                     <div className="flex flex-wrap items-center gap-2">
//                                       <Badge
//                                         className={`${getDifficultyColor(
//                                           lesson.difficulty || course.difficulty
//                                         )} font-medium px-3 py-1`}
//                                       >
//                                         {lesson.difficulty || course.difficulty}
//                                       </Badge>
//                                       {course.language && (
//                                         <Badge
//                                           // className={`${getLanguageColor(
//                                           //   course.language
//                                           // )} font-medium px-3 py-1`}
//                                           variant="outline"
//                                           className="text-xs px-2 py-1 border-2"
//                                         >
//                                           <Code className="h-3 w-3 mr-1" />
//                                           {course.language}
//                                         </Badge>
//                                       )}
//                                       {course.category && (
//                                         <Badge
//                                           variant="outline"
//                                           className="text-xs px-2 py-1 border-2"
//                                         >
//                                           {course.category}
//                                         </Badge>
//                                       )}
//                                       {course.duration && (
//                                         <Badge
//                                           variant="outline"
//                                           className="text-xs px-2 py-1"
//                                         >
//                                           <Clock className="h-3 w-3 mr-1" />
//                                           {course.duration}
//                                         </Badge>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Enhanced Selected Lesson Details */}
//             <div className="h-full flex flex-col">
//               {selectedLesson ? (
//                 <div className="h-full">
//                   <Card className="h-full border border-border bg-card flex flex-col">
//                     <CardHeader className="pb-4">
//                       <CardTitle className="flex items-center gap-3 text-xl">
//                         <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
//                           Course Overview
//                         </span>
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="flex-1 min-h-0 overflow-y-auto md:max-h-[60vh] xl:max-h-[70vh] space-y-6">
//                       <div className="text-center space-y-4 flex items-center gap-3 justify-center">
//                         {/* Butter pat with subtle pulse */}
//                         <div className="relative inline-block">
//                           <div className="text-5xl transform hover:scale-110 transition-transform duration-200 cursor-pointer text-yellow-400 drop-shadow-md">
//                             {selectedLesson.lessons?.[0]?.thumbnail || "🧈"}
//                           </div>
//                         </div>
//                         {/* Title */}
//                         <h3 className="font-bold text-xl text-slate-900 dark:text-white leading-tight">
//                           {selectedLesson.topic ||
//                             selectedLesson.lessons?.[0]?.courseTitle}
//                         </h3>
//                       </div>

//                       <div className="space-y-6">
//                         {selectedLesson.lessons?.map(
//                           (course: any, idx: any) => (
//                             <div key={idx} className="space-y-4">
//                               <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
//                                 <h4 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-200">
//                                   {course.courseTitle}
//                                 </h4>
//                                 <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
//                                   {course.courseSummary}
//                                 </p>
//                               </div>

//                               <div className="grid grid-cols-2 gap-3 text-sm">
//                                 <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
//                                   <Target className="h-4 w-4 text-blue-500" />
//                                   <div>
//                                     <div className="font-semibold text-slate-800 dark:text-slate-200">
//                                       Difficulty
//                                     </div>
//                                     <div className="text-slate-600 dark:text-slate-400">
//                                       {course.difficulty}
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
//                                   <Clock className="h-4 w-4 text-emerald-500" />
//                                   <div>
//                                     <div className="font-semibold text-slate-800 dark:text-slate-200">
//                                       Duration
//                                     </div>
//                                     <div className="text-slate-600 dark:text-slate-400">
//                                       {course.duration || "Not specified"}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>

//                               {course.chapters &&
//                                 course.chapters.length > 0 && (
//                                   <div className="space-y-3">
//                                     <h5 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
//                                       <BookmarkPlus className="h-4 w-4 text-purple-500" />
//                                       Learning Path ({course.chapters.length}{" "}
//                                       chapters)
//                                     </h5>
//                                     <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
//                                       {course.chapters.map((chapter: any) => (
//                                         <div
//                                           key={chapter.chapterNumber}
//                                           className="p-4 border-l-4 border-blue-400 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 rounded-r-lg hover:from-blue-100/50 dark:hover:from-blue-950/40 transition-all duration-200 cursor-pointer"
//                                         >
//                                           <h6 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
//                                             <span className="text-lg">
//                                               {chapter.emoji}
//                                             </span>
//                                             <span>
//                                               {chapter.chapterNumber}.{" "}
//                                               {chapter.chapterTitle}
//                                             </span>
//                                             <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
//                                           </h6>
//                                           <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">
//                                             {chapter.chapterSummary}
//                                           </p>
//                                           <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
//                                             <span className="flex items-center gap-1">
//                                               <BookOpen className="h-3 w-3" />
//                                               {
//                                                 chapter.estimatedLessonCount
//                                               }{" "}
//                                               lessons
//                                             </span>
//                                             <span className="flex items-center gap-1">
//                                               <Clock className="h-3 w-3" />
//                                               {chapter.estimatedChapterDuration}
//                                             </span>
//                                           </div>
//                                           {chapter.topics &&
//                                             chapter.topics.length > 0 && (
//                                               <div className="mt-2">
//                                                 <div className="flex flex-wrap gap-1">
//                                                   {chapter.topics
//                                                     .slice(0, 3)
//                                                     .map(
//                                                       (topic: any, i: any) => (
//                                                         <span
//                                                           key={i}
//                                                           className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md"
//                                                         >
//                                                           {topic}
//                                                         </span>
//                                                       )
//                                                     )}
//                                                   {chapter.topics.length >
//                                                     3 && (
//                                                     <span className="text-xs text-slate-500 dark:text-slate-400">
//                                                       +
//                                                       {chapter.topics.length -
//                                                         3}{" "}
//                                                       more
//                                                     </span>
//                                                   )}
//                                                 </div>
//                                               </div>
//                                             )}
//                                         </div>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 )}
//                             </div>
//                           )
//                         )}
//                       </div>

//                       <Button
//                         className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg font-semibold rounded-xl group"
//                         onClick={() =>
//                           router.push(`/lessons/${selectedLesson._id}`)
//                         }
//                       >
//                         <Play className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
//                         Begin Journey
//                         <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 </div>
//               ) : (
//                 <Card className="h-full border border-border bg-card flex items-center justify-center">
//                   <div className="text-center space-y-4">
//                     <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto">
//                       <BookOpen className="h-8 w-8 text-slate-400" />
//                     </div>
//                     <p className="text-slate-600 dark:text-slate-400">
//                       Select a lesson to view details
//                     </p>
//                   </div>
//                 </Card>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Add Lesson Dialog */}
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogContent className="max-w-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl">
//             <DialogHeader className="text-center pb-6">
//               {/* <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
//                 <Sparkles className="h-8 w-8 text-white" />
//               </div> */}
//               <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
//                 Create Study Material
//               </DialogTitle>
//               <p className="text-slate-600 dark:text-slate-400 text-sm">
//                 Design a personalized learning experience
//               </p>
//             </DialogHeader>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                   <Target className="h-4 w-4" />
//                   Learning Purpose
//                 </label>
//                 <Select onValueChange={setPurpose} value={purpose}>
//                   {/* className="h-12 border-2 rounded-xl" */}
//                   <SelectTrigger className="h-12 border-2 rounded-xl">
//                     <SelectValue placeholder="What's your goal?" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Revision">
//                       📝 Revision & Review
//                     </SelectItem>
//                     <SelectItem value="Practice">
//                       💪 Hands-on Practice
//                     </SelectItem>
//                     <SelectItem value="Interview Prep">
//                       🎯 Interview Preparation
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                   <BookOpen className="h-4 w-4" />
//                   Topic & Content
//                 </label>
//                 <Textarea
//                   value={topic}
//                   onChange={(e) => setTopic(e.target.value)}
//                   placeholder="Describe what you'd like to learn..."
//                   className="min-h-[100px] border-2 rounded-xl resize-none"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                   <Zap className="h-4 w-4" />
//                   Difficulty Level
//                 </label>
//                 <Select onValueChange={setDifficulty} value={difficulty}>
//                   <SelectTrigger className="h-12 border-2 rounded-xl">
//                     <SelectValue placeholder="Choose your challenge level" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Easy">
//                       Easy - Just starting out
//                     </SelectItem>
//                     <SelectItem value="Medium">
//                       Medium - Ready for more
//                     </SelectItem>
//                     <SelectItem value="Hard">
//                       Hard - Bring the challenge
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <Button
//                 className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
//                 onClick={handleAddLesson}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Creating Magic...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
//                     Create Lesson
//                     <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
//                   </>
//                 )}
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Custom CSS for enhanced styling */}
//       <style jsx>{`
//         .scrollbar-thin {
//           scrollbar-width: thin;
//         }
//         .scrollbar-thin::-webkit-scrollbar {
//           width: 6px;
//         }
//         .scrollbar-thumb-slate-300::-webkit-scrollbar-thumb {
//           background-color: rgb(203 213 225);
//           border-radius: 3px;
//         }
//         .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
//           background-color: rgb(71 85 105);
//           border-radius: 3px;
//         }
//         .scrollbar-track-transparent::-webkit-scrollbar-track {
//           background-color: transparent;
//         }

//         /* Enhanced animations */
//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-10px);
//           }
//         }

//         @keyframes pulse-glow {
//           0%,
//           100% {
//             box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
//           }
//           50% {
//             box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
//           }
//         }

//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }

//         .animate-pulse-glow {
//           animation: pulse-glow 2s ease-in-out infinite;
//         }

//         /* Improved focus states */
//         .focus-visible:focus {
//           outline: 2px solid rgb(59 130 246);
//           outline-offset: 2px;
//         }

//         /* Better scrollbar for dark mode */
//         .dark .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
//           background-color: rgb(71 85 105);
//         }

//         .dark .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb:hover {
//           background-color: rgb(51 65 85);
//         }
//       `}</style>
//     </div>
//   );
// }

/* eslint-disable jsx-a11y/role-supports-aria-props */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  Code,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  Target,
  BookmarkPlus,
  Zap,
  Shield,
  ChevronRight,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { createLesson, getLessons } from "@/lib/slices/lessonSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

export default function LessonsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useUser();

  // Redux state selectors
  const lessonsData = useSelector((state: RootState) => state.lessons.lessons);
  const loadingData = useSelector((state: RootState) => state.lessons.loading);
  const error = useSelector((state: RootState) => state.lessons.error);

  // Local state
  const [selectedLesson, setSelectedLesson] = useState(
    lessonsData.length > 0 ? lessonsData[0] : null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [filterLevel, setFilterLevel] = useState("all");

  const [purpose, setPurpose] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // Update selectedLesson on lessonsData change
  useEffect(() => {
    if (lessonsData.length > 0) {
      setSelectedLesson(lessonsData[0]);
    } else {
      setSelectedLesson(null);
    }
  }, [lessonsData]);

  // Fetch lessons on mount AFTER confirming user email exists
  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (email) {
      dispatch(getLessons(email));
    } else {
      console.warn("User email is not available");
    }
    setTimeout(() => setAnimateCard(true), 100);
  }, [dispatch, user]);

  // Check subscription API call helper
  const hasSubscription = async (): Promise<boolean> => {
    try {
      const res = await axios.get("/api/check-subscription");
      return res.data?.hasAccess ?? false;
    } catch (error) {
      console.error("Error checking subscription:", error);
      return false;
    }
  };

  // Difficulty badge color helper with gradients
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-gradient-to-r from-emerald-200 via-green-200 to-green-300 text-emerald-800 border border-emerald-300 dark:from-emerald-900/40 dark:via-green-900/40 dark:to-green-800/40 dark:text-emerald-200 dark:border-emerald-700";
      case "intermediate":
      case "medium":
        return "bg-gradient-to-r from-amber-200 via-yellow-200 to-yellow-300 text-amber-800 border border-amber-300 dark:from-amber-900/40 dark:via-yellow-900/40 dark:to-yellow-800/40 dark:text-amber-200 dark:border-amber-700";
      case "advanced":
        return "bg-gradient-to-r from-rose-200 via-red-200 to-red-300 text-rose-800 border border-rose-300 dark:from-rose-900/40 dark:via-red-900/40 dark:to-red-800/40 dark:text-rose-200 dark:border-rose-700";
      default:
        return "bg-gradient-to-r from-slate-200 via-gray-200 to-gray-300 text-gray-800 border border-gray-300 dark:from-slate-900/40 dark:via-gray-900/40 dark:to-gray-800/40 dark:text-gray-200 dark:border-gray-700";
    }
  };

  // Filter lessons by search and difficulty
  const filteredLessons = lessonsData.filter((lesson) => {
    const lowerTerm = searchTerm.toLowerCase();
    const matchesSearch =
      lesson.topic?.toLowerCase().includes(lowerTerm) ||
      lesson.lessons?.[0]?.courseTitle?.toLowerCase().includes(lowerTerm) ||
      lesson.lessons?.[0]?.language?.toLowerCase().includes(lowerTerm) ||
      lesson.lessons?.[0]?.category?.toLowerCase().includes(lowerTerm);

    const matchesFilter =
      filterLevel === "all" ||
      (lesson.difficulty || lesson.lessons?.[0]?.difficulty)?.toLowerCase() ===
        filterLevel.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Handler to add new lesson with subscription check
  const handleAddLesson = async () => {
    if (!purpose || !topic || !difficulty) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const hasSubscriptionEnabled = await hasSubscription();
      if (!hasSubscriptionEnabled) {
        toast("You've Upgrade premium access for unlimited lessons.");
        router.push("/subscribe");
        return;
      }
      setLoading(true);
      const actionResult = await dispatch(
        createLesson({ purpose, topic, difficulty })
      );
      if (createLesson.fulfilled.match(actionResult)) {
        const newLesson = actionResult.payload;
        toast.success("✨ Lesson created successfully!");
        if (newLesson) {
          router.push(`/lessons/${newLesson}`);
        }
        setOpen(false);
        setPurpose("");
        setTopic("");
        setDifficulty("");
      } else {
        toast.error("Failed to add lesson");
      }
    } catch {
      toast.error("Error adding lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="space-y-8 py-4 sm:p-6 lg:p-2">
        {/* Header */}
        <div
          className={`transform transition-all duration-1000 ${
            animateCard
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm">
            {/* Floating decorative elements */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-lg animate-pulse delay-500"></div>

            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Learning Center
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Master coding skills with interactive lessons and
                      challenges
                    </p>
                  </div>
                </div>
                <Button
                  className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Create Lesson
                  <Sparkles className="h-4 w-4 ml-2 opacity-70" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filter */}
        <div
          className={`transform transition-all duration-1000 delay-200 ${
            animateCard
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  <Input
                    placeholder="Search lessons, topics, or technologies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl text-lg bg-white dark:bg-slate-800 transition-all duration-200"
                  />
                </div>
                <div>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="h-14 px-6 rounded-xl border-2 hover:border-blue-500 transition-all duration-200 min-w-[180px]">
                      <Filter className="h-5 w-5 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons List */}
        <div
          className={`transform transition-all duration-1000 delay-300 ${
            animateCard
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {/* Lessons List Column */}
            <div className="md:col-span-1 xl:col-span-2 h-full">
              <Card className="h-full flex flex-col border border-border bg-card">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      Your Learning Journey
                    </h2>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Target className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {filteredLessons.length} lessons found
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1 min-h-0">
                  <div className="space-y-4 h-full overflow-y-auto md:max-h-[60vh] xl:max-h-[70vh] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent pr-2">
                    {loadingData && (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-slate-600 dark:text-slate-400">
                          Loading lessons...
                        </span>
                      </div>
                    )}
                    {error && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Shield className="h-8 w-8 text-red-500" />
                        </div>
                        <p className="text-red-600 dark:text-red-400 font-medium">
                          {typeof error === "string"
                            ? error
                            : JSON.stringify(error)}
                        </p>
                      </div>
                    )}
                    {!loadingData && filteredLessons.length === 0 && (
                      <div className="text-center py-16">
                        <BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                          No lessons found
                        </h3>
                        <p className="text-slate-500 dark:text-slate-500 mb-6">
                          Create your first lesson to get started!
                        </p>
                        <Button
                          onClick={() => setOpen(true)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Lesson
                        </Button>
                      </div>
                    )}

                    {filteredLessons.map((lesson, index) => {
                      const course = lesson.lessons?.[0] || {};
                      const isSelected = selectedLesson?._id === lesson._id;
                      return (
                        <div
                          key={lesson._id}
                          className="transform transition-all duration-500"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <Card
                            className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-lg backdrop-blur-sm overflow-hidden ${
                              isSelected
                                ? "relative before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-600 shadow-blue-200/50 dark:shadow-blue-900/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50"
                                : "bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800"
                            }`}
                            onClick={() => setSelectedLesson(lesson)}
                            role="button"
                            aria-selected={isSelected}
                          >
                            <CardContent className="p-6">
                              <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-105 transition-transform">
                                    {course.thumbnail || "📚"}
                                  </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h3
                                          className={`text-xl font-bold transition-colors duration-200 ${
                                            isSelected
                                              ? "text-blue-700 dark:text-blue-300"
                                              : "text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                          }`}
                                          onClick={() =>
                                            router.push(
                                              `/lessons/${lesson._id}`
                                            )
                                          }
                                        >
                                          {course.courseTitle}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm leading-relaxed">
                                          {course.courseSummary}
                                        </p>
                                      </div>
                                      {isSelected && (
                                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                          <CheckCircle className="h-5 w-5" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <Badge
                                        className={`${getDifficultyColor(
                                          lesson.difficulty || course.difficulty
                                        )} font-medium px-3 py-1`}
                                      >
                                        {lesson.difficulty || course.difficulty}
                                      </Badge>
                                      {course.language && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs px-2 py-1 border-2"
                                        >
                                          <Code className="h-3 w-3 mr-1" />
                                          {course.language}
                                        </Badge>
                                      )}
                                      {course.category && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs px-2 py-1 border-2"
                                        >
                                          {course.category}
                                        </Badge>
                                      )}
                                      {course.duration && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs px-2 py-1"
                                        >
                                          <Clock className="h-3 w-3 mr-1" />
                                          {course.duration}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Lesson Details */}
            <div className="h-full flex flex-col">
              {selectedLesson ? (
                <div className="h-full">
                  <Card className="h-full border border-border bg-card flex flex-col">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                          Course Overview
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 overflow-y-auto md:max-h-[60vh] xl:max-h-[70vh] space-y-6">
                      <div className="text-center space-y-4 flex items-center gap-3 justify-center">
                        <div className="relative inline-block">
                          <div className="text-5xl transform hover:scale-110 transition-transform duration-200 cursor-pointer text-yellow-400 drop-shadow-md">
                            {selectedLesson.lessons?.[0]?.thumbnail || "🧈"}
                          </div>
                        </div>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white leading-tight">
                          {selectedLesson.topic ||
                            selectedLesson.lessons?.[0]?.courseTitle}
                        </h3>
                      </div>

                      <div className="space-y-6">
                        {selectedLesson.lessons?.map(
                          (course: any, idx: any) => (
                            <div key={idx} className="space-y-4">
                              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <h4 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-200">
                                  {course.courseTitle}
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                  {course.courseSummary}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                  <Target className="h-4 w-4 text-blue-500" />
                                  <div>
                                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                                      Difficulty
                                    </div>
                                    <div className="text-slate-600 dark:text-slate-400">
                                      {course.difficulty}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                  <Clock className="h-4 w-4 text-emerald-500" />
                                  <div>
                                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                                      Duration
                                    </div>
                                    <div className="text-slate-600 dark:text-slate-400">
                                      {course.duration || "Not specified"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {course.chapters &&
                                course.chapters.length > 0 && (
                                  <div className="space-y-3">
                                    <h5 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                      <BookmarkPlus className="h-4 w-4 text-purple-500" />
                                      Learning Path ({course.chapters.length}{" "}
                                      chapters)
                                    </h5>
                                    <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                                      {course.chapters.map((chapter: any) => (
                                        <div
                                          key={chapter.chapterNumber}
                                          className="p-4 border-l-4 border-blue-400 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 rounded-r-lg hover:from-blue-100/50 dark:hover:from-blue-950/40 transition-all duration-200 cursor-pointer"
                                        >
                                          <h6 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <span className="text-lg">
                                              {chapter.emoji}
                                            </span>
                                            <span>
                                              {chapter.chapterNumber}.{" "}
                                              {chapter.chapterTitle}
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                                          </h6>
                                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">
                                            {chapter.chapterSummary}
                                          </p>
                                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1">
                                              <BookOpen className="h-3 w-3" />
                                              {
                                                chapter.estimatedLessonCount
                                              }{" "}
                                              lessons
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              {chapter.estimatedChapterDuration}
                                            </span>
                                          </div>
                                          {chapter.topics &&
                                            chapter.topics.length > 0 && (
                                              <div className="mt-2">
                                                <div className="flex flex-wrap gap-1">
                                                  {chapter.topics
                                                    .slice(0, 3)
                                                    .map(
                                                      (topic: any, i: any) => (
                                                        <span
                                                          key={i}
                                                          className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md"
                                                        >
                                                          {topic}
                                                        </span>
                                                      )
                                                    )}
                                                  {chapter.topics.length >
                                                    3 && (
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                      +
                                                      {chapter.topics.length -
                                                        3}{" "}
                                                      more
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )
                        )}
                      </div>

                      <Button
                        className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg font-semibold rounded-xl group"
                        onClick={() =>
                          router.push(`/lessons/${selectedLesson._id}`)
                        }
                      >
                        <Play className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                        Begin Journey
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-full border border-border bg-card flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto">
                      <BookOpen className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Select a lesson to view details
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Add Lesson Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl">
            <DialogHeader className="text-center pb-6">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                Create Study Material
              </DialogTitle>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Design a personalized learning experience
              </p>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Learning Purpose
                </label>
                <Select onValueChange={setPurpose} value={purpose}>
                  <SelectTrigger className="h-12 border-2 rounded-xl">
                    <SelectValue placeholder="What's your goal?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Revision">
                      📝 Revision & Review
                    </SelectItem>
                    <SelectItem value="Practice">
                      💪 Hands-on Practice
                    </SelectItem>
                    <SelectItem value="Interview Prep">
                      🎯 Interview Preparation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Topic & Content
                </label>
                <Textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Describe what you'd like to learn..."
                  className="min-h-[100px] border-2 rounded-xl resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Difficulty Level
                </label>
                <Select onValueChange={setDifficulty} value={difficulty}>
                  <SelectTrigger className="h-12 border-2 rounded-xl">
                    <SelectValue placeholder="Choose your challenge level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">
                      Easy - Just starting out
                    </SelectItem>
                    <SelectItem value="Medium">
                      Medium - Ready for more
                    </SelectItem>
                    <SelectItem value="Hard">
                      Hard - Bring the challenge
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                onClick={handleAddLesson}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    Create Lesson
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-slate-300::-webkit-scrollbar-thumb {
          background-color: rgb(203 213 225);
          border-radius: 3px;
        }
        .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
          background-color: rgb(71 85 105);
          border-radius: 3px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .focus-visible:focus {
          outline: 2px solid rgb(59 130 246);
          outline-offset: 2px;
        }
        .dark .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
          background-color: rgb(71 85 105);
        }
        .dark .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb:hover {
          background-color: rgb(51 65 85);
        }
      `}</style>
    </div>
  );
}
