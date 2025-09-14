"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, ExternalLink } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface Challenge {
  platform: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  title: string;
  url: string;
  category?: string;
  solved?: boolean;
  points?: number;
  completionTime?: string;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  solved: number;
}

const leaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Alice Chen", points: 2450, solved: 23 },
  { rank: 2, name: "Bob Wilson", points: 2200, solved: 21 },
  { rank: 3, name: "Carol Davis", points: 2100, solved: 19 },
  { rank: 4, name: "David Kim", points: 1950, solved: 18 },
  { rank: 5, name: "Eve Johnson", points: 1800, solved: 16 },
];

const platformImg = [
  {
    name: "LeetCode",
    link: "/LeetCode.png",
    color: "from-orange-400 to-orange-600",
  },
  {
    name: "GeeksforGeeks",
    link: "/GeeksforGeeks.png",
    color: "from-green-400 to-green-600",
  },
  {
    name: "Codeforces",
    link: "/Codeforces.png",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "CodeChef",
    link: "/CodeChef.png",
    color: "from-purple-400 to-purple-600",
  },
  {
    name: "HackerRank",
    link: "/HackerRank.png",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    name: "InterviewBit",
    link: "/InterviewBit.png",
    color: "from-indigo-400 to-indigo-600",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Hard":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function ChallengesPage() {
  const [challengeData, setChallengeData] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/dailyqustionfind"); // confirm endpoint correctness
        setChallengeData(res.data.results || []);
      } catch {
        setError("Failed to load challenges");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 px-6 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className={`transform transition-all duration-1000`}>
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm">
            {/* Floating decorative elements */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-lg animate-pulse delay-500"></div>

            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Trophy className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Coding Challenges
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Master coding skills with interactive lessons and
                      challenges
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Loading, error, no data messages */}
        <div className="space-y-6">
          {loading && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          )}
          {error && (
            <p className="text-center text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          {!loading && !error && challengeData.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No challenges found.
            </p>
          )}

          {/* <div className="grid gap-6 md:grid-cols-2">
            {challengeData.map((challenge, index) => {
              const platform = platformImg.find(
                (img) => img.name === challenge.platform
              );

              return (
                <Card
                  key={index}
                  className="relative group hover:shadow-2xl transition-shadow duration-300 rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-gray-800"
                >
                  <CardContent className="p-6 flex items-center gap-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                        platform?.color || "from-gray-400 to-gray-600"
                      } p-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3 flex items-center justify-center`}
                    >
                      {platform?.link ? (
                        <Image
                          src={platform.link}
                          alt={`${challenge.platform} logo`}
                          width={40}
                          height={40}
                          className="object-contain"
                          priority={false}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                        {challenge.title}
                      </p>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {challenge.platform}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <Badge
                          className={getDifficultyColor(challenge.difficulty)}
                        >
                          {challenge.difficulty}
                        </Badge>

                        {challenge.category && (
                          <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            {challenge.category}
                          </Badge>
                        )}

                        {challenge.points !== undefined && (
                          <Badge className="bg-yellow-100 text-yellow-800 font-semibold flex items-center gap-1 px-3 py-1">
                            ★ {challenge.points}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <Link
                        href={challenge.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                      >
                        Solve Challenge
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </CardContent>

                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700 w-0 group-hover:w-full transition-all duration-300" />
                </Card>
              );
            })}
          </div> */}

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 auto-rows-fr">
            {challengeData.map((challenge, index) => {
              const platform = platformImg.find(
                (img) => img.name === challenge.platform
              );

              return (
                <Card
                  key={index}
                  className="relative group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 backdrop-blur-sm"
                >
                  <CardContent className="p-4 sm:p-6 h-full flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    {/* Platform Logo Container */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${
                          platform?.color || "from-gray-400 to-gray-600"
                        } p-2.5 sm:p-3 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 flex items-center justify-center`}
                      >
                        {platform?.link ? (
                          <Image
                            src={platform.link}
                            alt={`${challenge.platform} logo`}
                            width={32}
                            height={32}
                            className="object-contain sm:w-10 sm:h-10"
                            priority={false}
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 dark:bg-gray-600 rounded-lg" />
                        )}
                      </div>
                    </div>

                    {/* Challenge Info */}
                    <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                          {challenge.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                          {challenge.platform}
                        </p>
                      </div>

                      {/* Badges Container */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Badge
                          className={`${getDifficultyColor(
                            challenge.difficulty
                          )} text-xs font-semibold px-2 py-1 transition-transform duration-300 group-hover:scale-105`}
                        >
                          {challenge.difficulty}
                        </Badge>

                        {challenge.category && (
                          <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 transition-transform duration-300 group-hover:scale-105">
                            {challenge.category}
                          </Badge>
                        )}

                        {challenge.points !== undefined && (
                          <Badge className="bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900 dark:to-yellow-800 text-yellow-800 dark:text-yellow-200 font-semibold flex items-center gap-1 px-2 py-1 text-xs transition-transform duration-300 group-hover:scale-105">
                            <span className="text-yellow-500">★</span>
                            {challenge.points}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Solve Challenge Link */}
                    <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                      <Link
                        href={challenge.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                      >
                        <span>Solve Challenge</span>
                        <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </CardContent>

                  {/* Enhanced Hover Effects */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 w-0 group-hover:w-full transition-all duration-700 ease-out" />

                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-600/0 to-blue-700/0 group-hover:from-blue-500/5 group-hover:via-blue-600/5 group-hover:to-blue-700/5 transition-all duration-500 pointer-events-none" />

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-blue-500/0 group-hover:border-r-blue-500/20 transition-all duration-500" />
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
