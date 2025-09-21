// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { useUser } from "@clerk/nextjs";
// import { AppDispatch, RootState } from "@/lib/store";
// import { ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";
// import { fetchCompletedQuestions } from "@/lib/slices/completedQuestionsSlice";
// import { fetchFollowedSheets } from "@/lib/slices/followingSlice";

// interface SheetCardProps {
//   _id: string;
//   name: string;
//   description: string;
//   followers: number;
//   totalQuestions: number;

//   slug: string;
//   category: string;
//   progress?: number; // optional progress percentage
//   index: number; // index for animation delay
// }

// const SheetCard: React.FC<SheetCardProps> = ({
//   _id,
//   name,
//   description,
//   // followers,
//   totalQuestions,

//   slug,
//   category,
//   // progress = 50, // default to 50 if not passed
//   index,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   // const [isFollowing, setIsFollowing] = useState();
//   const [loading, setLoading] = useState(false);
//   const { user } = useUser();

//   const { followingsheets,loading:isLoading, error } = useSelector(
//     (state: RootState) => state.followingData
//   );

//   const { completedQuestions } = useSelector(
//     (state: RootState) => state.completedQuestions
//   );

//   console.log("followingsheets=",followingsheets);
//   console.log("_id=",_id);

//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchFollowedSheets(user.id));
//     }
//   }, [dispatch, user?.id]);

//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchCompletedQuestions(user.id));
//     }
//   }, [dispatch, user?.id]);

//   const handleFollow = async (userId: string | undefined, sheetId: string) => {
//     // console.log("userId=", userId);

//     if (!userId) return;
//     setLoading(true);
//     try {
//       await axios.post(`/api/Following`, {
//         userId,
//         followedSheetIds: [sheetId],
//       });
//       toast.success("Followed successfully!");

//       // setIsFollowing(true);
//     } catch (error) {
//       console.error("Error following sheet:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUnFollow = async (
//     userId: string | undefined,
//     sheetId: string
//   ) => {
//     if (!userId) return;
//     setLoading(true);
//     try {
//       await axios.post(`/api/UnFollowing`, {
//         userId,
//         unfollowedSheetId: sheetId,
//       });
//       toast.success("Unfollowed successfully!");
//       dispatch(fetchCompletedQuestions(userId));
//       // setIsFollowing(false);
//     } catch (error) {
//       console.error("Error unfollowing sheet:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isFollowing=followingsheets.find(item=>item._id === _id)

//   // Compute progress for this sheet using completedQuestions from Redux
//   const sheetProgress = (completedQuestions || []).find(
//     (s: any) => s.sheetId?.toString() === _id?.toString()
//   );
//   const completedCount = (sheetProgress?.questions || []).filter(
//     (q: any) => q.completed
//   ).length;
//   const percent =
//     totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ delay: 0.3 + index * 0.1 }}
//       className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg border transition-all duration-300 cursor-pointer group overflow-hidden"
//     >
//       <div className="p-6">
//         {/* <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
//             {name}
//           </h3>
//           <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transform group-hover:translate-x-1 transition-all duration-200" />
//         </div> */}

//         <Link
//           href={`/${category}/sheet/${slug}`}
//           className="flex items-center justify-between mb-4"
//         >
//           <h3
//             className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 truncate max-w-[calc(100%-1.25rem)]"
//             title={name} // shows full name on hover
//           >
//             {name}
//           </h3>
//           <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transform group-hover:translate-x-1 transition-all duration-200" />
//         </Link>

//         <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
//           {description}
//         </p>

//         <div className="flex items-center justify-between text-sm">
//           <span className="text-slate-500 dark:text-slate-400">
//             {totalQuestions} problems
//           </span>
//         </div>

//         <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-slate-500 dark:text-slate-400">Progress</span>
//             <span className="text-indigo-600 dark:text-indigo-400 font-medium">
//               {Math.round(percent)}%
//             </span>
//           </div>
//           <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${percent}%` }}
//               transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
//               className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
//             />
//           </div>
//         </div>

//         <div className="mt-4">
//           {!isFollowing ? (
//             <Button
//               onClick={() => handleFollow(user?.id, _id)}
//               disabled={loading}
//               className="flex items-center gap-2 text-sm font-medium transition-all bg-[#f57c06] dark:bg-[#f57c06] text-white hover:bg-[#e56b04] w-full"
//             >
//               <CiBookmark size={16} />
//               {loading ? "Following..." : "Follow"}
//             </Button>
//           ) : (
//             <Button
//               variant="outline"
//               onClick={() => handleUnFollow(user?.id, _id)}
//               disabled={loading}
//               className="flex items-center gap-2 text-sm font-medium border-gray-300 dark:border-gray-600 transition-all bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white w-full"
//             >
//               <CiBookmarkCheck
//                 size={16}
//                 className="text-green-600 dark:text-green-400"
//               />
//               {loading ? "Unfollowing..." : "Unfollow"}
//             </Button>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default SheetCard;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/nextjs";
import { AppDispatch, RootState } from "@/lib/store";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";
import { fetchCompletedQuestions } from "@/lib/slices/completedQuestionsSlice";
import { fetchFollowedSheets } from "@/lib/slices/followingSlice";

interface SheetCardProps {
  _id: string;
  name: string;
  description: string;
  totalQuestions: number;
  slug: string;
  category: string;
  index: number; // index for animation delay
}

const SheetCard: React.FC<SheetCardProps> = ({
  _id,
  name,
  description,
  totalQuestions,
  slug,
  category,
  index,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();

  const { followingsheets } = useSelector(
    (state: RootState) => state.followingData
  );

  const { completedQuestions } = useSelector(
    (state: RootState) => state.completedQuestions
  );

  // Track loading per sheet
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Fetch follow + completed data
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFollowedSheets(user.id));
      dispatch(fetchCompletedQuestions(user.id));
    }
  }, [dispatch, user?.id]);

  const handleFollow = async (userId: string | undefined, sheetId: string) => {
    if (!userId) return;
    setLoadingId(sheetId);
    try {
      await axios.post(`/api/Following`, {
        userId,
        followedSheetIds: [sheetId],
      });
      toast.success("Followed successfully!");
      dispatch(fetchFollowedSheets(userId));
    } catch (error) {
      console.error("Error following sheet:", error);
      toast.error("Failed to follow. Try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUnFollow = async (
    userId: string | undefined,
    sheetId: string
  ) => {
    if (!userId) return;
    setLoadingId(sheetId);
    try {
      await axios.post(`/api/UnFollowing`, {
        userId,
        unfollowedSheetId: sheetId,
      });
      toast.success("Unfollowed successfully!");
      dispatch(fetchFollowedSheets(userId));
      dispatch(fetchCompletedQuestions(userId));
    } catch (error) {
      console.error("Error unfollowing sheet:", error);
      toast.error("Failed to unfollow. Try again.");
    } finally {
      setLoadingId(null);
    }
  };

  // Check if sheet is followed
  const isFollowing = followingsheets?.some((item) => item._id === _id);

  // Compute progress
  const sheetProgress = (completedQuestions || []).find(
    (s: any) => s.sheetId?.toString() === _id?.toString()
  );
  const completedCount = Array.isArray(sheetProgress?.questions)
    ? sheetProgress.questions.filter((q: any) => q.completed).length
    : 0;
  const percent =
    totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg border transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      <div className="p-6">
        {/* Header with link */}
        <Link
          href={`/${category}/sheet/${slug}`}
          className="flex items-center justify-between mb-4"
        >
          <h3
            className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 truncate max-w-[calc(100%-1.25rem)]"
            title={name}
          >
            {name}
          </h3>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transform group-hover:translate-x-1 transition-all duration-200" />
        </Link>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Total Questions */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            {totalQuestions} problems
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              {Math.round(percent)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
              className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
        </div>

        {/* Follow / Unfollow Button */}
        <div className="mt-4">
          {!isFollowing ? (
            <Button
              onClick={() => handleFollow(user?.id, _id)}
              disabled={loadingId === _id}
              className="flex items-center gap-2 text-sm font-medium transition-all bg-[#f57c06] dark:bg-[#f57c06] text-white hover:bg-[#e56b04] w-full"
            >
              <CiBookmark size={16} />
              {loadingId === _id ? "Following..." : "Follow"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => handleUnFollow(user?.id, _id)}
              disabled={loadingId === _id}
              className="flex items-center gap-2 text-sm font-medium border-gray-300 dark:border-gray-600 transition-all bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white w-full"
            >
              <CiBookmarkCheck
                size={16}
                className="text-green-600 dark:text-green-400"
              />
              {loadingId === _id ? "Unfollowing..." : "Unfollow"}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SheetCard;
