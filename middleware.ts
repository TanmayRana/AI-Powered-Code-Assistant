// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// // Define public routes
// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/assistant",
//   "/sign-in(.*)",
//   "/sign-up(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: [
//     // Run Clerk middleware on all routes except static files
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

//     // Always run on API/trpc
//     "/(api|trpc)(.*)",
//   ],
// };

// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ✅ Only allow these public routes without login
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/inngest",
  "/api/generate-notes",
  "/api(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // If route is not public → force login
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run Clerk middleware on all routes except static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run on API/trpc
    "/(api|trpc)(.*)",
  ],
};
