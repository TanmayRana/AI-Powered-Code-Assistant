// export const runtime = "nodejs";

// import connectDB from "@/lib/mongodb";
// import axios from "axios";

// import { NextResponse } from "next/server";

// export async function GET() {
//   await connectDB();

//   const results: any[] = [];

//   try {
//     /** ---------------- LEETCODE ---------------- **/
//     try {
//       const res = await axios.get(
//         `${process.env.HOST_URL}/api/leetcodequestion`
//       );
//       const challenge = res.data;
//       results.push({
//         platform: challenge.platform,
//         title: challenge.title,
//         difficulty: challenge.difficulty,
//         url: challenge.url,
//       });
//     } catch (e) {
//       results.push({ platform: "LeetCode", error: "Failed to fetch" });
//     }

//     /** ---------------- GEEKSFORGEEKS ---------------- **/
//     try {
//       const gfgRes = await fetch(
//         "https://practiceapi.geeksforgeeks.org/api/v1/problems-of-day/problem/today/",
//         { cache: "no-store" }
//       );
//       const gfgData = await gfgRes.json();
//       results.push({
//         platform: "GeeksforGeeks",
//         title: gfgData.problem_name,
//         difficulty: gfgData.difficulty?.[0] || "Unknown",
//         url: gfgData?.problem_url,
//       });
//     } catch (e) {
//       results.push({ platform: "GeeksforGeeks", error: "Failed to fetch" });
//     }

//     /** ---------------- CODEFORCES ---------------- **/
//     try {
//       const cfRes = await fetch(
//         "https://codeforces.com/api/problemset.problems"
//       );
//       const cfData = await cfRes.json();
//       const problems = cfData.result.problems;
//       const todayIdx = new Date().getDate() % problems.length;
//       const problem = problems[todayIdx];
//       results.push({
//         platform: "Codeforces",
//         title: `${problem.contestId}${problem.index} - ${problem.name}`,
//         difficulty: "Unknown",
//         url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
//       });
//     } catch (e) {
//       results.push({ platform: "Codeforces", error: "Failed to fetch" });
//     }

//     /** ---------------- CODECHEF ---------------- **/
//     try {
//       const pool = ["FLOW001", "HS08TEST", "INTEST", "START01", "FLOW002"];
//       const idx = new Date().getDate() % pool.length;
//       const code = pool[idx];
//       results.push({
//         platform: "CodeChef",
//         title: `Problem ${code}`,
//         difficulty: "Beginner",
//         url: `https://www.codechef.com/problems/${code}`,
//       });
//     } catch (e) {
//       results.push({ platform: "CodeChef", error: "Failed to fetch" });
//     }

//     /** ---------------- ATCODER ---------------- **/
//     try {
//       const res = await fetch("https://atcoder.jp/contests/");
//       const text = await res.text();
//       const match = text.match(/\/contests\/([^/]+)\/tasks\/\1_[a-z]/);
//       if (match) {
//         const contest = match[1];
//         results.push({
//           platform: "AtCoder",
//           title: `First problem from ${contest}`,
//           difficulty: "Unknown",
//           url: `https://atcoder.jp/contests/${contest}/tasks/${contest}_a`,
//         });
//       }
//     } catch (e) {
//       results.push({ platform: "AtCoder", error: "Failed to fetch" });
//     }

//     /** ---------------- HACKERRANK ---------------- **/
//     try {
//       const pool = [
//         "solve-me-first",
//         "simple-array-sum",
//         "compare-the-triplets",
//       ];
//       const idx = new Date().getDate() % pool.length;
//       const slug = pool[idx];
//       results.push({
//         platform: "HackerRank",
//         title: slug.replace(/-/g, " "),
//         difficulty: "Easy",
//         url: `https://www.hackerrank.com/challenges/${slug}`,
//       });
//     } catch (e) {
//       results.push({ platform: "HackerRank", error: "Failed to fetch" });
//     }

//     /** ---------------- INTERVIEWBIT ---------------- **/
//     try {
//       const pool = [
//         "two-sum",
//         "hotel-bookings-possible",
//         "longest-substring-without-repeat",
//       ];
//       const idx = new Date().getDate() % pool.length;
//       const slug = pool[idx];
//       results.push({
//         platform: "InterviewBit",
//         title: slug.replace(/-/g, " "),
//         difficulty: "Unknown",
//         url: `https://www.interviewbit.com/problems/${slug}/`,
//       });
//     } catch (e) {
//       results.push({ platform: "InterviewBit", error: "Failed to fetch" });
//     }

//     // const today = new Date().toISOString().split("T")[0];
//     // await DailyQuestion.create({ date: today, results });

//     // const existing = await DailyQuestion.findOne({ date: today });
//     // if (existing) {
//     //   existing.results = results;
//     //   await existing.save();
//     // } else {
//     //   await DailyQuestion.create({ date: today, results });
//     // }

//     return NextResponse.json({ date: new Date().toISOString(), results });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: "Something went wrong", details: String(error.message) },
//       { status: 500 }
//     );
//   }
// }

export const runtime = "nodejs";

import connectDB from "@/lib/mongodb";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const results: any[] = [];

  try {
    /** ---------------- LEETCODE ---------------- **/
    try {
      const dailyQuery = `
      query questionOfToday {
        activeDailyCodingChallengeQuestion {
          date
          link
          question {
            title
            titleSlug
            difficulty
          }
        }
      }`;

      const res = await axios.post(
        `${process.env.HOST_URL}/api/leetcodequestion`,
        { dailyQuery }
      );
      const challenge = res.data;
      results.push({
        platform: challenge.platform,
        title: challenge.title,
        difficulty: challenge.difficulty,
        url: challenge.url,
      });
    } catch {
      results.push({ platform: "LeetCode", error: "Failed to fetch" });
    }

    /** ---------------- GEEKSFORGEEKS ---------------- **/
    try {
      const gfgRes = await fetch(
        "https://practiceapi.geeksforgeeks.org/api/v1/problems-of-day/problem/today/",
        { cache: "no-store" }
      );
      const gfgData = await gfgRes.json();
      results.push({
        platform: "GeeksforGeeks",
        title: gfgData.problem_name,
        difficulty: gfgData.difficulty?.[0] || "Unknown",
        url: gfgData?.problem_url,
      });
    } catch {
      results.push({ platform: "GeeksforGeeks", error: "Failed to fetch" });
    }

    /** ---------------- CODEFORCES ---------------- **/
    try {
      const cfRes = await fetch(
        "https://codeforces.com/api/problemset.problems",
        { cache: "no-store" }
      );
      const cfData = await cfRes.json();
      const problems = cfData.result.problems;
      const todayIdx = new Date().getDate() % problems.length;
      const problem = problems[todayIdx];
      results.push({
        platform: "Codeforces",
        title: `${problem.contestId}${problem.index} - ${problem.name}`,
        difficulty: "Unknown",
        url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
      });
    } catch {
      results.push({ platform: "Codeforces", error: "Failed to fetch" });
    }

    /** ---------------- CODECHEF ---------------- **/
    try {
      const pool = ["FLOW001", "HS08TEST", "INTEST", "START01", "FLOW002"];
      const idx = new Date().getDate() % pool.length;
      const code = pool[idx];
      results.push({
        platform: "CodeChef",
        title: `Problem ${code}`,
        difficulty: "Beginner",
        url: `https://www.codechef.com/problems/${code}`,
      });
    } catch {
      results.push({ platform: "CodeChef", error: "Failed to fetch" });
    }

    /** ---------------- ATCODER ---------------- **/
    try {
      const res = await fetch("https://atcoder.jp/contests/", {
        cache: "no-store",
      });
      const text = await res.text();
      const match = text.match(/\/contests\/([^/]+)\/tasks\/\1_[a-z]/);
      if (match) {
        const contest = match[1];
        results.push({
          platform: "AtCoder",
          title: `First problem from ${contest}`,
          difficulty: "Unknown",
          url: `https://atcoder.jp/contests/${contest}/tasks/${contest}_a`,
        });
      }
    } catch {
      results.push({ platform: "AtCoder", error: "Failed to fetch" });
    }

    /** ---------------- HACKERRANK ---------------- **/
    try {
      const pool = [
        "solve-me-first",
        "simple-array-sum",
        "compare-the-triplets",
      ];
      const idx = new Date().getDate() % pool.length;
      const slug = pool[idx];
      results.push({
        platform: "HackerRank",
        title: slug.replace(/-/g, " "),
        difficulty: "Easy",
        url: `https://www.hackerrank.com/challenges/${slug}`,
      });
    } catch {
      results.push({ platform: "HackerRank", error: "Failed to fetch" });
    }

    /** ---------------- INTERVIEWBIT ---------------- **/
    try {
      const pool = [
        "two-sum",
        "hotel-bookings-possible",
        "longest-substring-without-repeat",
      ];
      const idx = new Date().getDate() % pool.length;
      const slug = pool[idx];
      results.push({
        platform: "InterviewBit",
        title: slug.replace(/-/g, " "),
        difficulty: "Unknown",
        url: `https://www.interviewbit.com/problems/${slug}/`,
      });
    } catch {
      results.push({ platform: "InterviewBit", error: "Failed to fetch" });
    }

    // Optional: save in MongoDB
    // const today = new Date().toISOString().split("T")[0];
    // await DailyQuestion.create({ date: today, results });

    return NextResponse.json({ date: new Date().toISOString(), results });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong", details: String(error.message) },
      { status: 500 }
    );
  }
}
