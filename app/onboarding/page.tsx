"use client";

import { CreateOrganization } from "@clerk/nextjs";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome to FitDesk
        </h1>
        <p className="mt-2 text-zinc-400">
          Let's set up your first gym branch to get started.
        </p>
      </div>
      
      <CreateOrganization
        afterCreateOrganizationUrl="/"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-zinc-900 border border-zinc-800 shadow-xl rounded-xl",
            headerTitle: "text-white",
            headerSubtitle: "text-zinc-400",
            formFieldLabel: "text-zinc-300",
            formFieldInput: "bg-zinc-950 border-zinc-800 text-white focus:border-emerald-500 focus:ring-emerald-500/20",
            formButtonPrimary: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold",
            footer: "hidden", // Hides unnecessary Clerk branding footer
          }
        }}
      />
    </div>
  );
}