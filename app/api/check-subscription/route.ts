import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { has } = await auth();

    const hasProAccess = has({ plan: "pro" });
    const hasPremiumAccess = has({ plan: "premium" });

    const hasAccess = hasProAccess || hasPremiumAccess;

    return new Response(JSON.stringify({ hasAccess }), {
      status: 200,
    });
  } catch (error) {
    console.error("Subscription check failed:", error);
    return new Response(JSON.stringify({ hasAccess: false }), {
      status: 200,
    });
  }
}
