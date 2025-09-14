// import { auth } from "@clerk/nextjs/server";

// export async function GET(request: Request) {
//   try {
//     const { has } = await auth();

//     const hasProAccess = has({ plan: "pro" });
//     const hasPremiumAccess = has({ plan: "premium" });

//     const hasAccess = hasProAccess || hasPremiumAccess;

//     return new Response(JSON.stringify({ hasAccess }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Subscription check failed:", error);
//     return new Response(JSON.stringify({ hasAccess: false }), {
//       status: 200,
//     });
//   }
// }

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { has } = await auth();

    const hasAccess = has({ plan: "pro" }) || has({ plan: "premium" });

    return NextResponse.json({ hasAccess }, { status: 200 });
  } catch (error) {
    console.error("Subscription check failed:", error);
    return NextResponse.json({ hasAccess: false }, { status: 200 });
  }
}
