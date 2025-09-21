// "use client";

// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";
// import { motion } from "framer-motion";
// import { useParams } from "next/navigation";
// import { useUser } from "@clerk/nextjs";

// import { Button } from "@/components/ui/button";
// import Dropdown from "@/components/exploresheets/Dropdown";
// import { AppDispatch, RootState } from "@/lib/store";
// import { fetchFullSheetsData } from "@/lib/slices/fullSheetsSlice";
// import { fetchCompletedQuestions } from "@/lib/slices/completedQuestionsSlice";
// import { fetchFollowingData } from "@/lib/slices/followingSlice";

// // -------------------- Types --------------------
// interface Question {
//   id: string;
//   topic: string;
//   completed: boolean;
//   title?: string;
//   difficulty?: string;
//   url?: string;
// }

// interface SheetInfo {
//   _id: string;
//   name: string;
//   description?: string;
//   isFollowing?: boolean;
// }

// interface FullSheetData {
//   sheet: SheetInfo;
//   questions: Question[];
// }

// interface SheetProgress {
//   sheetId: string;
//   questions: Array<{ id: string; completed: boolean }>;
// }

// interface FollowingData {
//   sheets: SheetInfo[];
// }

// interface CompletedQuestion {
//   id: string;
//   completed: boolean;
// }

// interface SheetProgressData {
//   sheetId: string;
//   questions: CompletedQuestion[];
// }

// // -------------------- Component --------------------
// function Sheet() {
//   const params = useParams();
//   const sheetname = params?.sheetname as string;

//   const dispatch = useDispatch<AppDispatch>();
//   const { data, isLoading, isError } = useSelector(
//     (state: RootState) => state.FullSheetsData
//   );
//   const { completedQuestions } = useSelector(
//     (state: RootState) => state.completedQuestions
//   );
//   const { data: followingData } = useSelector(
//     (state: RootState) => state.followingData
//   );

//   const [sheetData, setSheetData] = useState<FullSheetData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
//   const [questionData, setQuestionData] = useState<Question[]>([]);
//   const [questionTopics, setQuestionTopics] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const { user } = useUser();
//   const userId = user?.id;

//   // Fetch sheet data
//   useEffect(() => {
//     if (sheetname) {
//       dispatch(fetchFullSheetsData(sheetname));
//     }
//   }, [dispatch, sheetname]);

//   // Fetch user completion progress
//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchCompletedQuestions(userId));
//     }
//   }, [dispatch, userId]);

//   // Fetch following data
//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchFollowingData(userId));
//     }
//   }, [dispatch, userId]);

//   // Update state when data changes
//   useEffect(() => {
//     if (!data?.sheet) {
//       setSheetData(null);
//       setQuestionData([]);
//       setQuestionTopics([]);
//       setIsFollowing(null);
//       return;
//     }

//     setSheetData(data as FullSheetData);
//     const questions: Question[] = data.questions || [];
//     setQuestionData(questions);

//     const uniqueTopics: string[] = Array.from(
//       new Set(questions.map((q) => q.topic))
//     );
//     setQuestionTopics(uniqueTopics);

//     // Check if user is following this sheet
//     if (followingData && Array.isArray(followingData)) {
//       // followingData is the entire API response, so we need to access the sheets property
//       console.log("tr");

//       const sheets = (followingData as any).sheets;
//       if (sheets && Array.isArray(sheets)) {
//         const currentSheetId = data.sheet._id;
//         const isFollowingSheet = sheets.some((sheet: any) =>
//           sheet._id === currentSheetId
//         );
//         console.log("Current sheet ID:", currentSheetId);
//         console.log("Following sheets:", sheets.map((s: any) => s._id));
//         console.log("Is following this sheet:", isFollowingSheet);
//         setIsFollowing(isFollowingSheet);
//       } else {
//         setIsFollowing(false);
//       }
//     } else {
//       setIsFollowing(false);
//     }
//   }, [data, followingData]);

//   // Memoized progress calculation
//   const progressData = useMemo(() => {
//     const totalQuestions = questionData.length;
//     const sheetId = sheetData?.sheet._id;

//     if (!sheetId || !completedQuestions) {
//       return { totalQuestions: 0, completedCount: 0, percent: 0 };
//     }

//     const sheetProgress = completedQuestions.find(
//       (s: any) => s.sheetId?.toString() === sheetId.toString()
//     );

//     const completedCount = sheetProgress?.questions?.filter(
//       (q) => q.completed
//     ).length || 0;

//     const percent = totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

//     return { totalQuestions, completedCount, percent };
//   }, [questionData.length, sheetData?.sheet._id, completedQuestions]);

//   // Toggle completion locally
//   const handleToggleCompletion = useCallback((questionId: string) => {
//     setQuestionData((prev) =>
//       prev.map((q) =>
//         q.id === questionId ? { ...q, completed: !q.completed } : q
//       )
//     );
//   }, []);

//   // Handle follow action
//   const handleFollow = useCallback(async () => {
//     if (!sheetData || !userId) return;

//     setLoading(true);
//     setError(null);

//     try {
//       await axios.post(`/api/Following`, {
//         userId,
//         followedSheetIds: [sheetData.sheet._id],
//       });
//       setIsFollowing(true);
//       // Refresh following data to keep it in sync
//       dispatch(fetchFollowingData(userId));
//     } catch (error) {
//       console.error("Error following sheet:", error);
//       setError("Failed to follow sheet. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [sheetData, userId, dispatch]);

//   // Handle unfollow action
//   const handleUnFollow = useCallback(async () => {
//     if (!sheetData || !userId) return;

//     setLoading(true);
//     setError(null);

//     try {
//       await axios.post(`/api/UnFollowing`, {
//         userId,
//         unfollowedSheetId: sheetData.sheet._id,
//       });
//       setIsFollowing(false);
//       // Refresh following data to keep it in sync
//       dispatch(fetchFollowingData(userId));
//     } catch (error) {
//       console.error("Error unfollowing sheet:", error);
//       setError("Failed to unfollow sheet. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [sheetData, userId, dispatch]);

//   // Debug logging
//   console.log("=== DEBUG INFO ===");
//   console.log("sheetData:", sheetData);
//   console.log("followingData:", followingData);
//   console.log("isFollowing state:", isFollowing);
//   console.log("userId:", userId);

//   // Loading component
//   const LoadingSpinner = () => (
//     <div className="flex items-center justify-center py-8">
//       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       <span className="ml-2 text-gray-600 dark:text-gray-300">Loading...</span>
//     </div>
//   );

//   // Error component
//   const ErrorMessage = ({ message }: { message: string }) => (
//     <div className="flex items-center justify-center py-8">
//       <div className="text-center">
//         <div className="text-red-500 text-lg mb-2">⚠️</div>
//         <p className="text-red-500 font-medium">{message}</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
//       <div className="space-y-6">
//         {/* Header Section */}
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="shadow-lg bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
//         >
//           {isLoading ? (
//             <LoadingSpinner />
//           ) : isError ? (
//             <ErrorMessage message="Failed to fetch sheet data. Please try again." />
//           ) : !sheetData ? (
//             <ErrorMessage message="No sheet found with this name." />
//           ) : (
//             <div className="flex flex-col lg:flex-row gap-6 lg:justify-between">
//               <div className="flex flex-col gap-4 lg:w-[75%] w-full">
//                 <div className="space-y-2">
//                   <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//                     {sheetData?.sheet?.name}
//                   </h1>
//                   <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
//                     {sheetData?.sheet?.description || "No description provided."}
//                   </p>
//                 </div>

//                 {/* Error message for follow/unfollow actions */}
//                 {error && (
//                   <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
//                     <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
//                   </div>
//                 )}

//                 {/* Follow/Unfollow Button */}
//                 <div className="flex gap-3">
//                   {isFollowing ? (
//                     <Button
//                       onClick={handleUnFollow}
//                       variant="outline"
//                       disabled={loading}
//                       className="flex items-center gap-2 text-sm font-medium border-gray-300 dark:border-gray-600 transition-all bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 w-fit px-4 py-2"
//                     >
//                       <CiBookmarkCheck
//                         size={16}
//                         className="text-green-600 dark:text-green-400"
//                       />
//                       <span>{loading ? "Unfollowing..." : "Following"}</span>
//                     </Button>
//                   ) : (
//                     <Button
//                       onClick={handleFollow}
//                       variant="outline"
//                       disabled={loading}
//                       className="flex items-center gap-2 text-sm font-medium transition-all bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600 w-fit px-4 py-2"
//                     >
//                       <CiBookmark size={16} />
//                       <span>{loading ? "Following..." : "Follow"}</span>
//                     </Button>
//                   )}
//                 </div>

//                 {/* Debug Info - Remove in production */}
//                 {process.env.NODE_ENV === 'development' && (
//                   <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs">
//                     <p><strong>Debug Info:</strong></p>
//                     <p>Sheet ID: {sheetData?.sheet?._id}</p>
//                     <p>Is Following: {isFollowing ? 'Yes' : 'No'}</p>
//                     <p>Following Data: {followingData ? 'Loaded' : 'Not loaded'}</p>
//                     <p>Following Sheets Count: {(followingData as any)?.sheets?.length || 0}</p>
//                   </div>
//                 )}
//               </div>

//               {/* Progress Section */}
//               <div className="lg:w-[25%] w-full flex items-center justify-center">
//                 <div className="w-32 h-32">
//                   <CircularProgressbar
//                     value={progressData.percent}
//                     text={`${Math.round(progressData.percent)}%`}
//                     styles={buildStyles({
//                       pathColor: "#6366f1",
//                       trailColor: "#e5e7eb",
//                       textColor: "#374151",
//                       strokeLinecap: "round",
//                       textSize: "16px",
//                     })}
//                   />
//                   <div className="text-center mt-2">
//                     <p className="text-sm text-gray-600 dark:text-gray-300">
//                       {progressData.completedCount} of {progressData.totalQuestions} completed
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </motion.section>

//         {/* Topics Section */}
//         {questionTopics.length > 0 && (
//           <motion.section
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="space-y-4"
//           >
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
//                 Topics ({questionTopics.length})
//               </h2>
//               <div className="text-sm text-gray-500 dark:text-gray-400">
//                 {progressData.completedCount} of {progressData.totalQuestions} questions completed
//               </div>
//             </div>

//             <div className="grid gap-4">
//               {questionTopics.map((topic: string, index: number) => {
//                 const topicQuestions = questionData.filter(
//                   (q) => q.topic === topic
//                 );
//                 const completedInTopic = topicQuestions.filter(q => q.completed).length;
//                 const topicProgress = topicQuestions.length > 0 ? (completedInTopic / topicQuestions.length) * 100 : 0;

//                 return (
//                   <motion.div
//                     key={topic}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.4 + index * 0.1 }}
//                     className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
//                   >
//                     <Dropdown
//                       topic={topic}
//                       questions={topicQuestions}
//                       index={index}
//                       onToggleCompletion={handleToggleCompletion}
//                       sheetId={sheetData?.sheet._id}
//                     />

//                     {/* Topic Progress Bar */}
//                     {/* <div className="px-4 pb-3">
//                       <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
//                         <span>Progress</span>
//                         <span>{completedInTopic}/{topicQuestions.length}</span>
//                       </div>
//                       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                         <div
//                           className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//                           style={{ width: `${topicProgress}%` }}
//                         />
//                       </div>
//                     </div> */}
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </motion.section>
//         )}

//         {/* Empty State */}
//         {!isLoading && !isError && questionTopics.length === 0 && sheetData && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center py-12"
//           >
//             <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📚</div>
//             <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
//               No topics available
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400">
//               This sheet doesn't have any questions organized by topics yet.
//             </p>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Sheet;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";

// import { Button } from "@/components/ui/button";

// import { AppDispatch, RootState } from "@/lib/store";
// import { useParams } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { fetchFullSheetsData } from "@/lib/slices/fullSheetsSlice";
// // import { fetchCompletedQuestions } from "@/lib/slices/completedQuestionsSlice";
// import { motion } from "framer-motion";

// import Dropdown from "@/components/exploresheets/Dropdown";
// import { fetchCompletedQuestions } from "@/lib/slices/completedQuestionsSlice";
// import { fetchFollowedSheets } from "@/lib/slices/followingSlice";
// // import { fetchFollowingData } from "@/lib/slices/followingSlice";

// // -------------------- Types --------------------
// interface Question {
//   id: string;
//   topic: string;
//   completed: boolean;
//   [key: string]: any; // for extra unknown props
// }

// interface SheetInfo {
//   _id: string;
//   name: string;
//   description?: string;
//   isFollowing?: boolean;
// }

// interface FullSheetData {
//   sheet: SheetInfo;
//   questions: Question[];
// }

// // -------------------- Component --------------------
// function Sheet() {
//   const params = useParams();
//   const sheetname = params?.sheetname as string;

//   const dispatch = useDispatch<AppDispatch>();
//   const { data, isLoading, isError } = useSelector(
//     (state: RootState) => state.FullSheetsData
//   );
//   const { completedQuestions } = useSelector(
//     (state: RootState) => state.completedQuestions
//   );

//   const [sheetData, setSheetData] = useState<FullSheetData | null>(null);
//   const [loading, setLoading] = useState(false);
//   // const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
//   const [questionData, setQuestionData] = useState<Question[]>([]);
//   const [questionTopics, setQuestionTopics] = useState<string[]>([]);

//   const { user } = useUser();
//   const userId = user?.id;
//   // const { completedQuestions } = useSelector(
//   //   (state: RootState) => state.completedQuestions
//   // );

//   const { followingsheets } = useSelector(
//     (state: RootState) => state.followingData
//   );

//   // Fetch data on mount if user ID is available
//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchFollowedSheets(user.id));
//     }
//   }, [dispatch, user?.id]);

//   // Fetch sheet
//   useEffect(() => {
//     if (sheetname) {
//       dispatch(fetchFullSheetsData(sheetname));
//     }
//   }, [dispatch, sheetname]);

//   // Fetch user completion progress
//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchCompletedQuestions(userId));
//     }
//   }, [dispatch, userId]);

//   // Update state when data changes
//   useEffect(() => {
//     const matchedSheet = data?.sheet;

//     if (matchedSheet) {
//       setSheetData(data as FullSheetData);

//       const questions: Question[] = data.questions || [];
//       setQuestionData(questions);

//       const uniqueTopics: string[] = Array.from(
//         new Set(questions.map((q) => q.topic))
//       );
//       setQuestionTopics(uniqueTopics);

//       // if (matchedSheet.isFollowing !== undefined) {
//       //   setIsFollowing(matchedSheet.isFollowing);
//       // }
//     } else {
//       setSheetData(null);
//       setQuestionData([]);
//       setQuestionTopics([]);
//       // setIsFollowing(null);
//     }
//   }, [data, sheetname]);

//   // Toggle completion locally on sheet level
//   const handleToggleCompletion = (questionId: string) => {
//     setQuestionData((prev) =>
//       prev.map((q) =>
//         q.id === questionId ? { ...q, completed: !q.completed } : q
//       )
//     );
//   };

//   const handleFollow = async () => {
//     if (!sheetData) return;
//     const sheetId = sheetData.sheet._id;
//     setLoading(true);
//     try {
//       await axios.post(`/api/Following`, {
//         userId,
//         followedSheetIds: [sheetId],
//       });
//       // setIsFollowing(true);
//     } catch (error) {
//       console.error("Error following sheet:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUnFollow = async () => {
//     if (!sheetData) return;
//     const sheetId = sheetData.sheet._id;
//     setLoading(true);
//     try {
//       await axios.post(`/api/UnFollowing`, {
//         userId,
//         unfollowedSheetId: sheetId,
//       });
//       // setIsFollowing(false);
//     } catch (error) {
//       console.error("Error unfollowing sheet:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("sheetData=", sheetData);
//   // const isFollowing = followingsheets.some((item) => item._id === _id);

//   // -------------------- Progress (sheet-level) --------------------
//   const totalQuestions = questionData.length || 0;
//   const sheetId = sheetData?.sheet._id;
//   const sheetProgress = (completedQuestions || []).find(
//     (s: any) => s.sheetId?.toString() === sheetId?.toString()
//   );
//   const completedCount = (sheetProgress?.questions || []).filter(
//     (q: any) => q.completed
//   ).length;
//   const percent =
//     totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

//   // const sheetProgress = completedQuestions.find(
//   //   (sheet: any) => sheet.sheetId?.toString() === sheetData?.sheet._id
//   // );

//   // console.log("sheetProgress=", sheetProgress);
//   const isFollowing = followingsheets.some((item) => item._id === sheetId);
//   console.log("isFollowing=",isFollowing);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
//       <div className="space-y-6">
//         <section className="shadow-md bg-white dark:bg-gray-800 rounded-lg p-4 border">
//           {isLoading ? (
//             <p>Loading...</p>
//           ) : isError ? (
//             <p className="text-red-500">Failed to fetch sheet data.</p>
//           ) : !sheetData ? (
//             <p className="text-gray-500">No sheet found with this name.</p>
//           ) : (
//             <div className="flex flex-col md:flex-row gap-4 md:justify-between">
//               <div className="flex flex-col gap-4 md:w-[80%] w-full">
//                 <h1 className="text-2xl font-bold">{sheetData.sheet.name}</h1>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   {sheetData.sheet.description || "No description provided."}
//                 </p>

//                 {isFollowing ? (
//                   <Button
//                     onClick={handleUnFollow}
//                     variant="outline"
//                     disabled={loading}
//                     className="flex items-center gap-2 text-sm font-medium border-gray-300 dark:border-gray-600 transition-all bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white w-[10rem]"
//                   >
//                     <CiBookmarkCheck
//                       size={16}
//                       className="text-green-600 dark:text-green-400"
//                     />
//                     <span>{loading ? "Unfollowing..." : "Following"}</span>
//                   </Button>
//                 ) : (
//                   <Button
//                     onClick={handleFollow}
//                     variant="outline"
//                     disabled={loading}
//                     className="flex items-center gap-2 text-sm font-medium transition-all bg-[#f57c06] dark:bg-[#f57c06] text-white hover:bg-[#e56b04] w-[10rem]"
//                   >
//                     <CiBookmark size={16} />
//                     <span>{loading ? "Following..." : "Follow"}</span>
//                   </Button>
//                 )}
//               </div>

//               <div className="md:w-[20%] w-full flex items-center justify-center">
//                 <div className="w-[30%] md:w-[70%]">
//                   <CircularProgressbar
//                     value={percent}
//                     text={`${Math.round(percent)}%`}
//                     styles={buildStyles({
//                       pathColor: "#6366f1",
//                       trailColor: "#e5e7eb",
//                       textColor: "#374151",
//                       strokeLinecap: "round",
//                     })}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         {questionTopics.length > 0 && (
//           <section className="pt-2">
//             {/* <h2 className="text-xl font-semibold mb-4">
//               Topics {questionTopics.length}
//             </h2> */}
//             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
//               Topics {questionTopics.length}
//             </h2>
//             <div>
//               {questionTopics.map((topic: string, index: number) => {
//                 const topicQuestions = questionData.filter(
//                   (q) => q.topic === topic
//                 );

//                 return (
//                   <motion.div
//                     key={topic}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 + index * 0.1 }}
//                     className="mb-4 border rounded-md dark:border-0 dark:rounded-none"
//                   >
//                     <Dropdown
//                       topic={topic}
//                       questions={topicQuestions}
//                       index={index}
//                       onToggleCompletion={handleToggleCompletion}
//                       sheetId={sheetData?.sheet._id}
//                     />
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </section>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Sheet;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";

// import { Button } from "@/components/ui/button";

// import { AppDispatch, RootState } from "@/lib/store";
// import { useParams } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { fetchFullSheetsData } from "@/lib/slices/fullSheetsSlice";
// import { motion } from "framer-motion";

// import Dropdown from "@/components/exploresheets/Dropdown";
// import { fetchCompletedQuestions } from "@/lib/slices/completedQuestionsSlice";
// import { fetchFollowedSheets } from "@/lib/slices/followingSlice";

// // -------------------- Types --------------------
// interface Question {
//   id: string;
//   topic: string;
//   completed: boolean;
//   [key: string]: any;
// }

// interface SheetInfo {
//   _id: string;
//   name: string;
//   description?: string;
//   isFollowing?: boolean;
// }

// interface FullSheetData {
//   sheet: SheetInfo;
//   questions: Question[];
// }

// // -------------------- Component --------------------
// function Sheet() {
//   const params = useParams();
//   const sheetname = params?.sheetname as string;

//   const dispatch = useDispatch<AppDispatch>();
//   const { data, isLoading, isError } = useSelector(
//     (state: RootState) => state.FullSheetsData
//   );
//   const { completedQuestions } = useSelector(
//     (state: RootState) => state.completedQuestions
//   );

//   const [sheetData, setSheetData] = useState<FullSheetData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [questionData, setQuestionData] = useState<Question[]>([]);
//   const [questionTopics, setQuestionTopics] = useState<string[]>([]);

//   const { user } = useUser();
//   const userId = user?.id;

//   const { followingsheets } = useSelector(
//     (state: RootState) => state.followingData
//   );

//   // Fetch followed sheets
//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchFollowedSheets(user.id));
//     }
//   }, [dispatch, user?.id]);

//   // Fetch sheet data
//   useEffect(() => {
//     if (sheetname) {
//       dispatch(fetchFullSheetsData(sheetname));
//     }
//   }, [dispatch, sheetname]);

//   // Fetch user progress
//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchCompletedQuestions(userId));
//     }
//   }, [dispatch, userId]);

//   // Update local state when sheet data changes
//   useEffect(() => {
//     const matchedSheet = data?.sheet;

//     if (matchedSheet) {
//       setSheetData(data as FullSheetData);

//       const questions: Question[] = data.questions || [];
//       setQuestionData(questions);

//       // ✅ FIXED Set iteration issue here
//       const uniqueTopics: string[] = [
//         ...new Set(questions.map((q) => q.topic)),
//       ] as string[];
//       setQuestionTopics(uniqueTopics);
//     } else {
//       setSheetData(null);
//       setQuestionData([]);
//       setQuestionTopics([]);
//     }
//   }, [data, sheetname]);

//   // Toggle completion (local only)
//   const handleToggleCompletion = (questionId: string) => {
//     setQuestionData((prev) =>
//       prev.map((q) =>
//         q.id === questionId ? { ...q, completed: !q.completed } : q
//       )
//     );
//   };

//   // Follow sheet
//   const handleFollow = async () => {
//     if (!sheetData) return;
//     const sheetId = sheetData.sheet._id;
//     setLoading(true);
//     try {
//       await axios.post(`/api/Following`, {
//         userId,
//         followedSheetIds: [sheetId],
//       });
//     } catch (error) {
//       console.error("Error following sheet:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Unfollow sheet
//   const handleUnFollow = async () => {
//     if (!sheetData) return;
//     const sheetId = sheetData.sheet._id;
//     setLoading(true);
//     try {
//       await axios.post(`/api/UnFollowing`, {
//         userId,
//         unfollowedSheetId: sheetId,
//       });
//     } catch (error) {
//       console.error("Error unfollowing sheet:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------- Progress --------------------
//   const totalQuestions = questionData.length || 0;
//   const sheetId = sheetData?.sheet._id;
//   const sheetProgress = (completedQuestions || []).find(
//     (s: any) => s.sheetId?.toString() === sheetId?.toString()
//   );
//   const completedCount = (sheetProgress?.questions || []).filter(
//     (q: any) => q.completed
//   ).length;
//   const percent =
//     totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

//   const isFollowing = followingsheets.some((item) => item._id === sheetId);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
//       <div className="space-y-6">
//         <section className="shadow-md bg-white dark:bg-gray-800 rounded-lg p-4 border">
//           {isLoading ? (
//             <p>Loading...</p>
//           ) : isError ? (
//             <p className="text-red-500">Failed to fetch sheet data.</p>
//           ) : !sheetData ? (
//             <p className="text-gray-500">No sheet found with this name.</p>
//           ) : (
//             <div className="flex flex-col md:flex-row gap-4 md:justify-between">
//               <div className="flex flex-col gap-4 md:w-[80%] w-full">
//                 <h1 className="text-2xl font-bold">{sheetData.sheet.name}</h1>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   {sheetData.sheet.description || "No description provided."}
//                 </p>

//                 {isFollowing ? (
//                   <Button
//                     onClick={handleUnFollow}
//                     variant="outline"
//                     disabled={loading}
//                     className="flex items-center gap-2 text-sm font-medium border-gray-300 dark:border-gray-600 transition-all bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white w-[10rem]"
//                   >
//                     <CiBookmarkCheck
//                       size={16}
//                       className="text-green-600 dark:text-green-400"
//                     />
//                     <span>{loading ? "Unfollowing..." : "Following"}</span>
//                   </Button>
//                 ) : (
//                   <Button
//                     onClick={handleFollow}
//                     variant="outline"
//                     disabled={loading}
//                     className="flex items-center gap-2 text-sm font-medium transition-all bg-[#f57c06] dark:bg-[#f57c06] text-white hover:bg-[#e56b04] w-[10rem]"
//                   >
//                     <CiBookmark size={16} />
//                     <span>{loading ? "Following..." : "Follow"}</span>
//                   </Button>
//                 )}
//               </div>

//               <div className="md:w-[20%] w-full flex items-center justify-center">
//                 <div className="w-[30%] md:w-[70%]">
//                   <CircularProgressbar
//                     value={percent}
//                     text={`${Math.round(percent)}%`}
//                     styles={buildStyles({
//                       pathColor: "#6366f1",
//                       trailColor: "#e5e7eb",
//                       textColor: "#374151",
//                       strokeLinecap: "round",
//                     })}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         {questionTopics.length > 0 && (
//           <section className="pt-2">
//             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
//               Topics {questionTopics.length}
//             </h2>
//             <div>
//               {questionTopics.map((topic: string, index: number) => {
//                 const topicQuestions = questionData.filter(
//                   (q) => q.topic === topic
//                 );

//                 return (
//                   <motion.div
//                     key={topic}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 + index * 0.1 }}
//                     className="mb-4 border rounded-md dark:border-0 dark:rounded-none"
//                   >
//                     <Dropdown
//                       topic={topic}
//                       questions={topicQuestions}
//                       index={index}
//                       onToggleCompletion={handleToggleCompletion}
//                       sheetId={sheetData?.sheet._id}
//                     />
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </section>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Sheet;

"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";

import { Button } from "@/components/ui/button";

import { AppDispatch, RootState } from "@/lib/store";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { fetchFullSheetsData } from "@/lib/slices/fullSheetsSlice";
import { motion } from "framer-motion";

import Dropdown from "@/components/exploresheets/Dropdown";
import { fetchCompletedQuestions } from "@/lib/slices/completedQuestionsSlice";
import { fetchFollowedSheets } from "@/lib/slices/followingSlice";

// -------------------- Types --------------------
interface Question {
  id: string;
  topic: string;
  completed: boolean;
  [key: string]: any;
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
  const { completedQuestions } = useSelector(
    (state: RootState) => state.completedQuestions
  );

  const [sheetData, setSheetData] = useState<FullSheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState<Question[]>([]);
  const [questionTopics, setQuestionTopics] = useState<string[]>([]);
  const [isFollowingLocal, setIsFollowingLocal] = useState<boolean | null>(
    null
  );

  const { user } = useUser();
  const userId = user?.id;

  const { followingsheets } = useSelector(
    (state: RootState) => state.followingData
  );

  // Fetch followed sheets
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFollowedSheets(user.id));
    }
  }, [dispatch, user?.id]);

  // Fetch sheet data
  useEffect(() => {
    if (sheetname) {
      dispatch(fetchFullSheetsData(sheetname));
    }
  }, [dispatch, sheetname]);

  // Fetch user progress
  useEffect(() => {
    if (userId) {
      // console.log("Fetching completed questions for user:", userId);
      dispatch(fetchCompletedQuestions(userId));
    }
  }, [dispatch, userId]);

  // Debug completed questions state
  // useEffect(() => {
  //   // console.log("Completed questions state:", completedQuestions);
  // }, [completedQuestions]);

  // Update local state when sheet data or followingsheets changes
  useEffect(() => {
    const matchedSheet = data?.sheet;

    if (matchedSheet) {
      setSheetData(data as FullSheetData);

      const questions: Question[] = data.questions || [];
      setQuestionData(questions);

      // Using reduce instead of Set for TS ES5 compatibility
      const uniqueTopics: string[] = questions.reduce((acc: string[], q) => {
        if (!acc.includes(q.topic)) acc.push(q.topic);
        return acc;
      }, []);
      setQuestionTopics(uniqueTopics);

      // Initialize local following state
      const following = followingsheets?.some(
        (item) => item._id === matchedSheet._id
      );
      setIsFollowingLocal(following);

      // console.log("Sheet data loaded:", {
      //   sheetId: matchedSheet._id,
      //   questionsCount: questions.length,
      //   topicsCount: uniqueTopics.length,
      //   isFollowing: following,
      // });
    } else {
      setSheetData(null);
      setQuestionData([]);
      setQuestionTopics([]);
      setIsFollowingLocal(false);
    }
  }, [data, followingsheets]);

  // Toggle completion - this will be handled by the Dropdown component's Redux actions
  const handleToggleCompletion = (questionId: string) => {
    // The actual completion logic is handled in the Dropdown component
    // This function is kept for compatibility but the real logic is in Dropdown.tsx
    // console.log("Toggle completion for question:", questionId);
  };

  // Follow sheet
  const handleFollow = async () => {
    if (!sheetData || !userId) return;
    const sheetId = sheetData.sheet._id;
    setLoading(true);
    setIsFollowingLocal(true); // Optimistic UI update
    try {
      await axios.post(`/api/Following`, {
        userId,
        followedSheetIds: [sheetId],
      });
      dispatch(fetchFollowedSheets(userId));
    } catch (error) {
      console.error("Error following sheet:", error);
      setIsFollowingLocal(false); // revert on error
    } finally {
      setLoading(false);
    }
  };

  // Unfollow sheet
  const handleUnFollow = async () => {
    if (!sheetData || !userId) return;
    const sheetId = sheetData.sheet._id;
    setLoading(true);
    setIsFollowingLocal(false); // Optimistic UI update
    try {
      await axios.post(`/api/UnFollowing`, {
        userId,
        unfollowedSheetId: sheetId,
      });
      dispatch(fetchFollowedSheets(userId));
    } catch (error) {
      console.error("Error unfollowing sheet:", error);
      setIsFollowingLocal(true); // revert on error
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Progress --------------------
  const totalQuestions = questionData.length || 0;
  const sheetId = sheetData?.sheet._id;
  const sheetProgress = (completedQuestions || []).find(
    (s: any) => s.sheetId?.toString() === sheetId?.toString()
  );
  const completedCount = (sheetProgress?.questions || []).filter(
    (q: any) => q.completed
  ).length;
  const percent =
    totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

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

                {isFollowingLocal ? (
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
                <div className="w-[30%] md:w-[70%]">
                  <CircularProgressbar
                    value={percent}
                    text={`${Math.round(percent)}%`}
                    styles={buildStyles({
                      pathColor: "#6366f1",
                      trailColor: "#e5e7eb",
                      textColor: "#374151",
                      strokeLinecap: "round",
                    })}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {questionTopics.length > 0 && (
          <section className="pt-2">
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
                      sheetId={sheetData?.sheet._id}
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
