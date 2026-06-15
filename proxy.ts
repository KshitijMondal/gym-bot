import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public paths that bypass auth completely
// Define public paths that bypass auth completely
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)" // <-- Add this line to let Svix through!
]);

export default clerkMiddleware(async (auth, request) => {
  // 1. Enforce authentication on all private routes first
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // 2. Retrieve session info for the onboarding validation gates
  const authObject = await auth();
  const { userId, orgId } = authObject;

  // 3. THE ONBOARDING BOUNCER: 
  // If authenticated but no active gym organization exists, force-redirect to setup
  if (userId && !orgId && request.nextUrl.pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 4. THE REVERSE BOUNCER:
  // If a gym organization is already active, block access to the setup page and return home
  if (userId && orgId && request.nextUrl.pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/", request.url));
  }
});

export const config = {
  matcher: [
    // Process all routes except Next.js internals and static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run checks for dynamic api/trpc routes
    "/(api|trpc)(.*)",
  ],
};
