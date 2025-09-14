// "use client";
// import React, { useEffect, useState } from "react";
// import SheetCard from "@/components/exploresheets/SheetCard";
// import { Button } from "@/components/ui/button";
// import { fetchSheets } from "@/lib/slices/sheetSlice";
// import { AppDispatch, RootState } from "@/lib/store";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// // import { fetchCompletedQuestions } from "@/lib/slices/completedQuestionsSlice";
// // import { useUser } from "@clerk/nextjs";

// // Example category buttons — add more as needed
// const CategoryButton = [
//   { label: "All", tag: "all" },
//   { label: "Popular", tag: "popular" },
//   { label: "Quick Revision", tag: "quickrevision" },
//   { label: "Complete DSA", tag: "dsa" },
//   { label: "Topic Specific", tag: "topicspecific" },
//   { label: "Competitive", tag: "competitive" },
// ];

// // Local debounce hook to avoid reference errors
// function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// }

// const ExploreSheets = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const currentTab = searchParams.get("tab") || "explore";
//   const currentCategory = searchParams.get("category") || "popular";
//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     sheets: data,
//     loading,
//     error,
//   } = useSelector((state: RootState) => state.sheets);
//   const [searchTerm, setSearchTerm] = useState("");
//   const debouncedValue = useDebounce(searchTerm, 500);
//   const [tabData, setTabData] = useState<any[]>([]);
//   const [visibleCount, setVisibleCount] = useState(6);

//   // const { user } = useUser();

//   // Fetch sheets on mount
//   useEffect(() => {
//     dispatch(fetchSheets());
//   }, [dispatch]);

//   // Update filtered sheets based on search, tab, category
//   useEffect(() => {
//     if (!data || !Array.isArray(data)) {
//       setTabData([]);
//       return;
//     }

//     if (debouncedValue) {
//       router.replace(`?tab=${currentTab}`);
//       setTabData(
//         data.filter((sheet: any) =>
//           sheet.name.toLowerCase().includes(debouncedValue.toLowerCase())
//         )
//       );
//     } else {
//       router.replace(`?tab=${currentTab}&category=${currentCategory}`);
//       setTabData(
//         currentCategory === "all"
//           ? data
//           : data.filter((sheet: any) => sheet.tag?.includes(currentCategory))
//       );
//     }
//     setVisibleCount(6);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [debouncedValue, currentCategory, data, currentTab]);

//   const handleCategoryChange = (category: string) => {
//     setSearchTerm("");
//     router.push(`?tab=${currentTab}&category=${category}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6">
//       <div className="">
//         <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 drop-shadow-sm">
//           Track Coding Sheets in One Place
//         </h1>
//         <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg">
//           Choose from 30+ structured coding paths
//         </p>

//         {/* Search Bar */}
//         <div className="relative mt-8 max-w-md mx-auto sm:mx-0">
//           <Input
//             placeholder="Search any coding sheet"
//             className="w-full pl-10 pr-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 transition"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
//         </div>

//         {/* Category Buttons */}
//         <div className="mt-12 flex flex-wrap gap-4 justify-center md:justify-start">
//           {CategoryButton.map((item) => {
//             const isActive = currentCategory === item.tag;
//             return (
//               <Button
//                 key={item.tag}
//                 variant={isActive ? "default" : "outline"}
//                 onClick={() => handleCategoryChange(item.tag)}
//                 className={`w-44 py-3 rounded-xl font-semibold shadow-md transition ${
//                   isActive
//                     ? "bg-gradient-to-r from-[#f57c06] to-[#f9a851] text-white hover:brightness-110 dark:shadow-lg"
//                     : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-600"
//                 }`}
//               >
//                 {item.label}
//               </Button>
//             );
//           })}
//         </div>

//         {/* Sheets Grid */}
//         <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {loading ? (
//             <p className="text-center text-gray-500 dark:text-gray-400 italic">
//               Loading sheets...
//             </p>
//           ) : error ? (
//             <p className="text-center text-red-500">Error fetching sheets</p>
//           ) : tabData.length > 0 ? (
//             tabData
//               .slice(0, visibleCount)
//               .map((sheet: any) => (
//                 <SheetCard
//                   key={sheet._id}
//                   {...sheet}
//                   category={"explore-sheets"}
//                 />
//               ))
//           ) : (
//             <p className="text-center text-gray-500 dark:text-gray-400 italic">
//               No sheets found.
//             </p>
//           )}
//         </div>

//         {/* Show More Button */}
//         {tabData.length > visibleCount && (
//           <div className="flex justify-center mt-10">
//             <Button
//               variant="outline"
//               onClick={() => setVisibleCount(tabData.length)}
//               className="px-8 py-2 rounded-xl text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-700 transition"
//             >
//               Show More
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExploreSheets;

"use client";
import React, { useEffect, useState, Suspense } from "react";
import SheetCard from "@/components/exploresheets/SheetCard";
import { Button } from "@/components/ui/button";
import { fetchSheets } from "@/lib/slices/sheetSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Example category buttons — add more as needed
const CategoryButton = [
  { label: "All", tag: "all" },
  { label: "Popular", tag: "popular" },
  { label: "Quick Revision", tag: "quickrevision" },
  { label: "Complete DSA", tag: "dsa" },
  { label: "Topic Specific", tag: "topicspecific" },
  { label: "Competitive", tag: "competitive" },
];

// Local debounce hook to avoid reference errors
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ExploreSheetsInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "explore";
  const currentCategory = searchParams.get("category") || "popular";
  const dispatch = useDispatch<AppDispatch>();
  const {
    sheets: data,
    loading,
    error,
  } = useSelector((state: RootState) => state.sheets);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce(searchTerm, 500);
  const [tabData, setTabData] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch sheets on mount
  useEffect(() => {
    dispatch(fetchSheets());
  }, [dispatch]);

  // Update filtered sheets based on search, tab, category
  useEffect(() => {
    if (!data || !Array.isArray(data)) {
      setTabData([]);
      return;
    }

    if (debouncedValue) {
      router.replace(`?tab=${currentTab}`);
      setTabData(
        data.filter((sheet: any) =>
          sheet.name.toLowerCase().includes(debouncedValue.toLowerCase())
        )
      );
    } else {
      router.replace(`?tab=${currentTab}&category=${currentCategory}`);
      setTabData(
        currentCategory === "all"
          ? data
          : data.filter((sheet: any) => sheet.tag?.includes(currentCategory))
      );
    }
    setVisibleCount(6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, currentCategory, data, currentTab]);

  const handleCategoryChange = (category: string) => {
    setSearchTerm("");
    router.push(`?tab=${currentTab}&category=${category}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 drop-shadow-sm">
          Track Coding Sheets in One Place
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg">
          Choose from 30+ structured coding paths
        </p>

        {/* Search Bar */}
        <div className="relative mt-8 max-w-md mx-auto sm:mx-0">
          <Input
            placeholder="Search any coding sheet"
            className="w-full pl-10 pr-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>

        {/* Category Buttons */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center md:justify-start">
          {CategoryButton.map((item) => {
            const isActive = currentCategory === item.tag;
            return (
              <Button
                key={item.tag}
                variant={isActive ? "default" : "outline"}
                onClick={() => handleCategoryChange(item.tag)}
                className={`w-44 py-3 rounded-xl font-semibold shadow-md transition ${
                  isActive
                    ? "bg-gradient-to-r from-[#f57c06] to-[#f9a851] text-white hover:brightness-110 dark:shadow-lg"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-600"
                }`}
              >
                {item.label}
              </Button>
            );
          })}
        </div>

        {/* Sheets Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 italic">
              Loading sheets...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">Error fetching sheets</p>
          ) : tabData.length > 0 ? (
            tabData
              .slice(0, visibleCount)
              .map((sheet: any) => (
                <SheetCard
                  key={sheet._id}
                  {...sheet}
                  category={"explore-sheets"}
                />
              ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 italic">
              No sheets found.
            </p>
          )}
        </div>

        {/* Show More Button */}
        {tabData.length > visibleCount && (
          <div className="flex justify-center mt-10">
            <Button
              variant="outline"
              onClick={() => setVisibleCount(tabData.length)}
              className="px-8 py-2 rounded-xl text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-700 transition"
            >
              Show More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ExploreSheets = () => (
  <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
    <ExploreSheetsInner />
  </Suspense>
);

export default ExploreSheets;
