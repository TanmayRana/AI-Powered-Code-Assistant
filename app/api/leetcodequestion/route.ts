import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { dailyQuery } = await request.json(); // parse request body (was res.json())

    const dailyRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: dailyQuery }),
      cache: "no-store",
    });

    if (!dailyRes.ok) {
      return NextResponse.json(
        { error: `LeetCode HTTP error ${dailyRes.status}` },
        { status: dailyRes.status }
      );
    }

    const dailyData = await dailyRes.json();

    if (dailyData.errors) {
      return NextResponse.json({
        platform: "LeetCode",
        error: "GraphQL error",
        details: dailyData.errors,
      });
    }

    const challenge = dailyData?.data?.activeDailyCodingChallengeQuestion;

    if (!challenge) {
      return NextResponse.json({
        platform: "LeetCode",
        error: "No daily challenge found (null in response)",
      });
    }

    return NextResponse.json({
      platform: "LeetCode",
      title: challenge.question.title,
      difficulty: challenge.question.difficulty,
      url: `https://leetcode.com${challenge.link}`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { platform: "LeetCode", error: "Exception", details: String(e.message) },
      { status: 500 }
    );
  }
}
