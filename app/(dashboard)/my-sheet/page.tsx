"use client";

import SheetCard from "@/components/exploresheets/SheetCard";
import { fetchFollowingData } from "@/lib/slices/followingSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SheetsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [sheetData, setSheetData] = useState<any[]>([]);

  const { data, isLoading, isError, message } = useSelector(
    (state: RootState) => state.followingData
  );

  // Fetch data on mount if user ID is available
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFollowingData(user.id));
    }
  }, [dispatch, user?.id]);

  // Extract sheets when `data` updates
  useEffect(() => {
    // @ts-ignore
    if (data?.sheets) {
      // @ts-ignore
      setSheetData(data.sheets);
    }
  }, [data]);

  // console.log("sheetData=", sheetData);

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-white text-gray-900">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 dark:text-white text-gray-900">
              My Sheets
            </h1>
            <p className="text-sm dark:text-gray-400 text-gray-500">
              Based on your personal and followed sheets
            </p>
          </div>
        </div>
      </div>

      {/* Followed Sheets Section */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-200 text-gray-800">
          Followed Sheets
        </h2>

        {sheetData.length === 0 && (
          <div className="rounded-lg border p-6 dark:bg-gray-800 dark:border-gray-700 bg-gray-50 border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2 dark:text-gray-300 text-gray-600">
                No Sheets Followed
              </h3>
              <p className="text-sm mb-4 dark:text-gray-400 text-gray-500">
                Get Started by following a sheet
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => router.push("/explore-sheets")}
              >
                Explore
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sheetData.map((sheet: any) => (
            <SheetCard key={sheet._id} {...sheet} category="my-sheet" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SheetsPage;
