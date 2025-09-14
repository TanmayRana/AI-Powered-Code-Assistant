/* eslint-disable react/no-unescaped-entities */
// // /* eslint-disable react/no-unescaped-entities */
// // "use client";

// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Progress } from "@/components/ui/progress";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   Code,
// //   BookOpen,
// //   Trophy,
// //   MessageCircle,
// //   Play,
// //   Star,
// //   Zap,
// //   Target,
// //   ChevronRight,
// //   Activity,
// // } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useRouter } from "next/navigation";
// // import { AppDispatch, RootState } from "@/lib/store";
// // import { getLessons } from "@/lib/slices/lessonSlice";
// // import { useUser } from "@clerk/nextjs";
// // import { fetchFollowingData } from "@/lib/slices/followingSlice";
// // import { motion } from "framer-motion";

// // /* ----------------- Reusable Components ----------------- */
// // function LessonCard({ lesson }: { lesson: any }) {
// //   return (
// //     <motion.div
// //       whileHover={{ scale: 1.01 }}
// //       className="group flex justify-between items-center mb-3 shadow-md border p-4
// //                  rounded-2xl bg-gray-50 dark:bg-gray-800/50
// //                  hover:bg-gray-100 dark:hover:bg-gray-800
// //                  transition-all duration-300"
// //     >
// //       <div className="flex-col gap-3">
// //         <div className="font-medium text-gray-900 dark:text-white">
// //           {lesson.lessons[0].courseTitle}
// //         </div>
// //         <div className="text-sm text-gray-600 dark:text-gray-400">
// //           {lesson.lessons[0].courseSummary}
// //         </div>
// //       </div>
// //     </motion.div>
// //   );
// // }

// // function QuickActionCard({
// //   icon: Icon,
// //   label,
// //   color,
// //   url,
// //   router,
// // }: {
// //   icon: any;
// //   label: string;
// //   color: string;
// //   url: string;
// //   router: any;
// // }) {
// //   return (
// //     <motion.div
// //       whileHover={{ scale: 1.02 }}
// //       whileTap={{ scale: 0.98 }}
// //       onClick={() => router.push(url)}
// //       className="w-full flex justify-between items-center gap-3 p-4 cursor-pointer
// //                  border rounded-xl group hover:shadow-lg bg-white/70 dark:bg-gray-800/70
// //                  backdrop-blur-sm transition-all duration-300"
// //     >
// //       <div className="flex items-center gap-3">
// //         <div
// //           className={`w-8 h-8 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}
// //         >
// //           <Icon className="h-4 w-4 text-white" />
// //         </div>
// //         <span className="font-medium">{label}</span>
// //       </div>
// //       <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
// //     </motion.div>
// //   );
// // }

// // function SheetCard({ rec }: { rec: any }) {
// //   return (
// //     <motion.div
// //       whileHover={{ scale: 1.02 }}
// //       whileTap={{ scale: 0.98 }}
// //       className="group p-5 rounded-2xl border border-gray-200 dark:border-gray-700
// //                  hover:border-blue-400 dark:hover:border-blue-600
// //                  hover:shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm
// //                  transition-all duration-300 ease-out"
// //     >
// //       <div className="flex items-start justify-between mb-4">
// //         <div className="flex flex-col gap-1">
// //           <h3
// //             className="font-semibold text-lg text-gray-900 dark:text-white
// //                        group-hover:text-blue-600 dark:group-hover:text-blue-400
// //                        transition-colors"
// //           >
// //             {rec.name}
// //           </h3>
// //           <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
// //             {rec.description}
// //           </p>
// //         </div>
// //         <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-3">
// //           <p className="">{rec.totalQuestions}</p>

// //           <p className="">Questions</p>
// //         </div>
// //       </div>

// //       <motion.button
// //         whileHover={{ y: -2 }}
// //         whileTap={{ scale: 0.97 }}
// //         className="w-full justify-center rounded-xl
// //                    bg-gradient-to-r from-blue-600 to-purple-600
// //                    hover:from-blue-700 hover:to-purple-700
// //                    text-white font-medium shadow-md
// //                    hover:shadow-lg active:scale-[0.98]
// //                    transition-all duration-300 ease-out py-2"
// //       >
// //         Start Learning
// //       </motion.button>
// //     </motion.div>
// //   );
// // }

// // /* ----------------- Dashboard Page ----------------- */
// // export default function DashboardPage() {
// //   const { user } = useUser();

// //   // console.log("user=", user);

// //   const dispatch = useDispatch<AppDispatch>();
// //   const router = useRouter();

// //   const lessonsData = useSelector((state: RootState) => state.lessons.lessons);
// //   const loading = useSelector((state: RootState) => state.lessons.loading);
// //   const { data, isLoading } = useSelector(
// //     (state: RootState) => state.followingData
// //   );

// //   const [sheetData, setSheetData] = useState<any[]>([]);

// //   useEffect(() => {
// //     dispatch(getLessons());
// //   }, [dispatch]);

// //   useEffect(() => {
// //     if (user?.id) {
// //       dispatch(fetchFollowingData(user.id));
// //     }
// //   }, [dispatch, user?.id]);

// //   useEffect(() => {
// //     // @ts-ignore
// //     if (data?.sheets) {
// //       // @ts-ignore
// //       setSheetData(data.sheets);
// //     }
// //   }, [data]);

// //   return (
// //     <div className="space-y-6 p-4 sm:p-6">
// //       {/* Welcome Header */}
// //       <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
// //         <div className="absolute inset-0 bg-black/10"></div>
// //         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
// //         <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
// //         <div className="relative z-10">
// //           <div className="flex items-center gap-4 mb-4">
// //             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
// //               <Activity className="h-8 w-8 text-white" />
// //             </div>
// //             <div>
// //               <h1 className="text-2xl sm:text-3xl font-bold mb-2">
// //                 Welcome back, {user?.fullName} 👋
// //               </h1>
// //               <p className="text-blue-100 text-sm sm:text-base">
// //                 Ready to continue your coding journey? Let's build something
// //                 amazing today.
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
// //         {/* Learning Progress */}
// //         <Card className="xl:col-span-2 shadow-xl border-0">
// //           <CardHeader className="pb-4">
// //             <CardTitle className="flex items-center gap-3 text-xl">
// //               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
// //                 <BookOpen className="h-5 w-5 text-white" />
// //               </div>
// //               Learning Progress
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-6">
// //             {loading ? (
// //               <p className="text-gray-500 text-sm">Loading your sheets...</p>
// //             ) : lessonsData.length > 0 ? (
// //               lessonsData
// //                 .slice(0, 3)
// //                 .map((lesson, index) => (
// //                   <LessonCard key={index} lesson={lesson} />
// //                 ))
// //             ) : (
// //               <p className="text-gray-500 text-sm">
// //                 No lessons available yet. Start your first lesson!
// //               </p>
// //             )}

// //             <Button
// //               className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
// //               onClick={() => router.push("/lessons")}
// //             >
// //               <Play className="h-4 w-4 mr-2" />
// //               Continue Learning
// //             </Button>
// //           </CardContent>
// //         </Card>

// //         {/* Quick Actions */}
// //         <Card className="shadow-xl border-0">
// //           <CardHeader className="pb-4">
// //             <CardTitle className="flex items-center gap-3 text-xl">
// //               <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
// //                 <Zap className="h-5 w-5 text-white" />
// //               </div>
// //               Quick Actions
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent className="space-y-3">
// //             {[
// //               {
// //                 icon: MessageCircle,
// //                 label: "Ask AI Assistant",
// //                 color: "from-blue-500 to-blue-600",
// //                 url: "/assistant",
// //               },
// //               {
// //                 icon: Code,
// //                 label: "Start Coding",
// //                 color: "from-purple-500 to-purple-600",
// //                 url: "/editor",
// //               },
// //               {
// //                 icon: Play,
// //                 label: "Continue Lesson",
// //                 color: "from-green-500 to-green-600",
// //                 url: "/lessons",
// //               },
// //               {
// //                 icon: Trophy,
// //                 label: "Try Challenge",
// //                 color: "from-yellow-500 to-yellow-600",
// //                 url: "/challenges",
// //               },
// //             ].map((action, index) => (
// //               <QuickActionCard key={index} {...action} router={router} />
// //             ))}
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Sheets Section */}
// //       <Card className="shadow-xl border-0">
// //         <CardHeader className="pb-4">
// //           <CardTitle className="flex items-center gap-3 text-xl">
// //             <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
// //               <Star className="h-5 w-5 text-white" />
// //             </div>
// //             My Sheets
// //           </CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="space-y-4">
// //             {isLoading ? (
// //               <p className="text-gray-500 text-sm">Loading your sheets...</p>
// //             ) : sheetData.length > 0 ? (
// //               sheetData.slice(0, 3).map((rec, index) => (
// //                 <SheetCard
// //                   key={index}
// //                   rec={rec}
// //                   onClick={() => {
// //                     console.log("clicked");
// //                   }}
// //                 />
// //               ))
// //             ) : (
// //               <p className="text-gray-500 text-sm">
// //                 You don't have any sheets yet. Create one to get started!
// //               </p>
// //             )}
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }

// /* eslint-disable react/no-unescaped-entities */
// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";

// import { useUser } from "@clerk/nextjs";
// import { AppDispatch, RootState } from "@/lib/store";
// import { getLessons } from "@/lib/slices/lessonSlice";
// import { fetchFollowingData } from "@/lib/slices/followingSlice";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Code,
//   BookOpen,
//   Trophy,
//   MessageCircle,
//   Play,
//   Star,
//   Zap,
//   ChevronRight,
//   Activity,
// } from "lucide-react";

// /* ----------------- Types ----------------- */
// interface Lesson {
//   lessons: {
//     courseTitle: string;
//     courseSummary: string;
//   }[];
// }

// interface Sheet {
//   id: string;
//   name: string;
//   description: string;
//   totalQuestions: number;
//   slug: string;
// }

// interface QuickActionProps {
//   icon: React.ElementType;
//   label: string;
//   color: string;
//   url: string;
//   router: ReturnType<typeof useRouter>;
// }

// /* ----------------- Reusable Components ----------------- */
// function LessonCard({ lesson }: { lesson: Lesson }) {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.01 }}
//       className="group flex justify-between items-center mb-3 shadow-md border p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
//     >
//       <div className="flex-col gap-3">
//         <div className="font-medium text-gray-900 dark:text-white">
//           {lesson.lessons[0].courseTitle}
//         </div>
//         <div className="text-sm text-gray-600 dark:text-gray-400">
//           {lesson.lessons[0].courseSummary}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// function QuickActionCard({
//   icon: Icon,
//   label,
//   color,
//   url,
//   router,
// }: QuickActionProps) {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       onClick={() => router.push(url)}
//       className="w-full flex justify-between items-center gap-3 p-4 cursor-pointer border rounded-xl group hover:shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-300"
//     >
//       <div className="flex items-center gap-3">
//         <div
//           className={`w-8 h-8 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}
//         >
//           <Icon className="h-4 w-4 text-white" />
//         </div>
//         <span className="font-medium">{label}</span>
//       </div>
//       <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
//     </motion.div>
//   );
// }

// function SheetCard({ rec, onClick }: { rec: Sheet; onClick?: () => void }) {
//   return (
//     <motion.div
//       onClick={onClick}
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       className="group p-5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 ease-out cursor-pointer"
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex flex-col gap-1">
//           <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//             {rec.name}
//           </h3>
//           <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
//             {rec.description}
//           </p>
//         </div>
//         <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-3">
//           <p>{rec.totalQuestions}</p>
//           <p>Questions</p>
//         </div>
//       </div>

//       <motion.button
//         whileHover={{ y: -2 }}
//         whileTap={{ scale: 0.97 }}
//         className="w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-300 ease-out py-2"
//       >
//         Start Learning
//       </motion.button>
//     </motion.div>
//   );
// }

// /* ----------------- Dashboard Page ----------------- */
// export default function DashboardPage() {
//   const { user } = useUser();
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();

//   const lessonsData = useSelector((state: RootState) => state.lessons.lessons);
//   const loading = useSelector((state: RootState) => state.lessons.loading);
//   const { data, isLoading } = useSelector(
//     (state: RootState) => state.followingData
//   );

//   // console.log("lessonsData:", lessonsData);

//   const [sheetData, setSheetData] = useState<Sheet[]>([]);

//   useEffect(() => {
//     dispatch(getLessons(user?.primaryEmailAddress?.emailAddress as string));
//   }, [dispatch]);

//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchFollowingData(user.id));
//     }
//   }, [dispatch, user?.id]);

//   useEffect(() => {
//     // @ts-ignore
//     if (data?.sheets) {
//       // @ts-ignore
//       setSheetData(data.sheets);
//     }
//   }, [data]);

//   return (
//     <div className="space-y-6 p-4 sm:p-6">
//       {/* Welcome Header */}
//       <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
//         <div className="absolute inset-0 bg-black/10"></div>
//         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
//         <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
//         <div className="relative z-10">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//               <Activity className="h-8 w-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold mb-2">
//                 Welcome back, {user?.fullName} 👋
//               </h1>
//               <p className="text-blue-100 text-sm sm:text-base">
//                 Ready to continue your coding journey? Let's build something
//                 amazing today.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* Learning Progress */}
//         <Card className="xl:col-span-2 shadow-xl border-0">
//           <CardHeader className="pb-4">
//             <CardTitle className="flex items-center gap-3 text-xl">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                 <BookOpen className="h-5 w-5 text-white" />
//               </div>
//               Learning Progress
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {loading ? (
//               <p className="text-gray-500 text-sm">Loading your sheets...</p>
//             ) : lessonsData.length > 0 ? (
//               lessonsData
//                 .slice(0, 3)
//                 .map((lesson, index) => (
//                   <LessonCard key={index} lesson={lesson} />
//                 ))
//             ) : (
//               <p className="text-gray-500 text-sm">
//                 No lessons available yet. Start your first lesson!
//               </p>
//             )}

//             <Button
//               className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
//               onClick={() => router.push("/lessons")}
//             >
//               <Play className="h-4 w-4 mr-2" />
//               Continue Learning
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Quick Actions */}
//         <Card className="shadow-xl border-0">
//           <CardHeader className="pb-4">
//             <CardTitle className="flex items-center gap-3 text-xl">
//               <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
//                 <Zap className="h-5 w-5 text-white" />
//               </div>
//               Quick Actions
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {[
//               {
//                 icon: MessageCircle,
//                 label: "Ask AI Assistant",
//                 color: "from-blue-500 to-blue-600",
//                 url: "/assistant",
//               },
//               {
//                 icon: Code,
//                 label: "Start Coding",
//                 color: "from-purple-500 to-purple-600",
//                 url: "/editor",
//               },
//               {
//                 icon: Play,
//                 label: "Continue Lesson",
//                 color: "from-green-500 to-green-600",
//                 url: "/lessons",
//               },
//               {
//                 icon: Trophy,
//                 label: "Try Challenge",
//                 color: "from-yellow-500 to-yellow-600",
//                 url: "/challenges",
//               },
//             ].map((action, index) => (
//               <QuickActionCard key={index} {...action} router={router} />
//             ))}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Sheets Section */}
//       <Card className="shadow-xl border-0">
//         <CardHeader className="pb-4">
//           <CardTitle className="flex items-center gap-3 text-xl">
//             <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
//               <Star className="h-5 w-5 text-white" />
//             </div>
//             My Sheets
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {isLoading ? (
//               <p className="text-gray-500 text-sm">Loading your sheets...</p>
//             ) : sheetData.length > 0 ? (
//               sheetData.slice(0, 3).map((rec) => (
//                 <SheetCard
//                   key={rec.id}
//                   rec={rec}
//                   onClick={() => {
//                     // slug
//                     router.push(`explore-sheets/sheet/${rec.slug}`);
//                     // console.log(rec);
//                   }}
//                 />
//               ))
//             ) : (
//               <p className="text-gray-500 text-sm">
//                 You don't have any sheets yet. Create one to get started!
//               </p>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useUser } from "@clerk/nextjs";
import { AppDispatch, RootState } from "@/lib/store";
import { getLessons } from "@/lib/slices/lessonSlice";
import { fetchFollowingData } from "@/lib/slices/followingSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code,
  BookOpen,
  Trophy,
  MessageCircle,
  Play,
  Star,
  Zap,
  ChevronRight,
  Activity,
  Sparkles,
  PlusCircle,
  Rocket,
} from "lucide-react";

/* ----------------- Types ----------------- */
interface Lesson {
  lessons: {
    courseTitle: string;
    courseSummary: string;
  }[];
}

interface Sheet {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
  slug: string;
}

interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  color: string;
  url: string;
  router: ReturnType<typeof useRouter>;
}

/* ----------------- Reusable Components ----------------- */
function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="group flex justify-between items-center mb-3 shadow-md border p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
    >
      <div className="flex-col gap-3">
        <div className="font-medium text-gray-900 dark:text-white">
          {lesson.lessons[0].courseTitle}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {lesson.lessons[0].courseSummary}
        </div>
      </div>
    </motion.div>
  );
}

function QuickActionCard({
  icon: Icon,
  label,
  color,
  url,
  router,
}: QuickActionProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(url)}
      className="w-full flex justify-between items-center gap-3 p-4 cursor-pointer border rounded-xl group hover:shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </motion.div>
  );
}

function SheetCard({ rec, onClick }: { rec: Sheet; onClick?: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group p-5 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 ease-out cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {rec.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {rec.description}
          </p>
        </div>
        <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-3">
          <p>{rec.totalQuestions}</p>
          <p>Questions</p>
        </div>
      </div>

      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-300 ease-out py-2"
      >
        Start Learning
      </motion.button>
    </motion.div>
  );
}

function EmptyLessonsState({
  onStartLearning,
}: {
  onStartLearning: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
      >
        <Rocket className="h-10 w-10 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Ready to Launch Your Journey? 🚀
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
          Your coding adventure awaits! Start with your first lesson and unlock
          the power of programming. Every expert was once a beginner.
        </p>

        <motion.button
          onClick={onStartLearning}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Sparkles className="h-4 w-4" />
          Begin Your First Lesson
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function EmptySheetsState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
      >
        <PlusCircle className="h-10 w-10 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Create Your First Sheet! ✨
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
          Sheets are your personalized learning spaces. Build custom question
          sets, track progress, and master any topic at your own pace.
        </p>

        <motion.button
          // onClick={onCreateSheet}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Star className="h-4 w-4" />
          Create My First Sheet
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function LoadingState({
  message,
  color = "blue",
}: {
  message: string;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-8"
    >
      <div className="flex items-center gap-3 text-gray-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-5 h-5 border-2 border-${color}-500 border-t-transparent rounded-full`}
        />
        <span className="text-sm">{message}</span>
      </div>
    </motion.div>
  );
}

/* ----------------- Dashboard Page ----------------- */
export default function DashboardPage() {
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const lessonsData = useSelector((state: RootState) => state.lessons.lessons);
  const loading = useSelector((state: RootState) => state.lessons.loading);
  const { data, isLoading } = useSelector(
    (state: RootState) => state.followingData
  );

  const [sheetData, setSheetData] = useState<Sheet[]>([]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      dispatch(getLessons(user.primaryEmailAddress.emailAddress));
    }
  }, [dispatch, user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFollowingData(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    // @ts-ignore
    if (data?.sheets) {
      // @ts-ignore
      setSheetData(data.sheets);
    }
  }, [data]);

  const quickActions = [
    {
      icon: MessageCircle,
      label: "Ask AI Assistant",
      color: "from-blue-500 to-blue-600",
      url: "/assistant",
    },
    {
      icon: Code,
      label: "Start Coding",
      color: "from-purple-500 to-purple-600",
      url: "/editor",
    },
    {
      icon: Play,
      label: "Continue Lesson",
      color: "from-green-500 to-green-600",
      url: "/lessons",
    },
    {
      icon: Trophy,
      label: "Try Challenge",
      color: "from-yellow-500 to-yellow-600",
      url: "/challenges",
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 min-h-screen bg-gray-50/30 dark:bg-gray-900/30">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
            >
              <Activity className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl font-bold mb-2"
              >
                Welcome back, {user?.fullName || "Learner"} 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-blue-100 text-sm sm:text-base"
              >
                Ready to continue your coding journey? Let's build something
                amazing today.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="xl:col-span-2 shadow-xl border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <LoadingState message="Loading your lessons..." color="blue" />
              ) : lessonsData.length > 0 ? (
                <>
                  {lessonsData.slice(0, 3).map((lesson, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <LessonCard lesson={lesson} />
                    </motion.div>
                  ))}
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => router.push("/lessons")}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                </>
              ) : (
                <EmptyLessonsState
                  onStartLearning={() => router.push("/lessons")}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-xl border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <QuickActionCard {...action} router={router} />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sheets Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="shadow-xl border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              My Sheets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <LoadingState message="Loading your sheets..." color="pink" />
              ) : sheetData.length > 0 ? (
                sheetData.slice(0, 3).map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SheetCard
                      rec={rec}
                      onClick={() => {
                        router.push(`explore-sheets/sheet/${rec.slug}`);
                      }}
                    />
                  </motion.div>
                ))
              ) : (
                <EmptySheetsState
                // onCreateSheet={() => router.push("/sheets/create")}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
