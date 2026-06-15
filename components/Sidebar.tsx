import Link from "next/link";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/80">
      {/* Brand */} 
      <div className="border-b border-zinc-800 px-4 py-5">
        <p className="text-sm font-semibold tracking-tight text-white">
          FitDesk
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">Enterprise OS</p>
      </div>

      {/* Nav */} 
      <nav className="flex flex-1 flex-col gap-1 p-3">
        <Link 
          href="/" 
          className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/members"
          className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
        >
          Members
        </Link>
        <Link
          href="/payments"
          className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
        >
          Payments
        </Link>
        <Link
          href="/settings"
          className="rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
        >
          Settings
        </Link>
      </nav>

      {/* User & Organization Control */}
      {/* Replace your current bottom sidebar section with this */}
      <div className="mt-auto border-t border-zinc-800 p-4">
  <div className="flex items-center justify-between gap-3"> {/* Increased gap slightly */}
    
    {/* Organization Container - Has its own hover state */}
    <div className="flex-1 min-w-0">
      <OrganizationSwitcher 
        hidePersonal={false}
        appearance={{
          elements: {
            rootBox: "w-full min-w-0",
            organizationSwitcherTrigger: "w-full min-w-0 justify-start hover:bg-zinc-900 px-2 py-1.5 rounded-md transition-colors",
            organizationPreview: "w-full min-w-0 gap-2",
            organizationPreviewTextContainer: "min-w-0 truncate",
            organizationPreviewMainIdentifier: "block truncate max-w-[120px] text-zinc-200", 
            // This completely removes the downward arrow:
            organizationSwitcherTriggerIcon: "hidden" 
          }
        }}
      />
    </div>
    
    {/* User Profile Container - Has its own hover state (handled by Clerk) */}
    {/* The pl-3 and border-l act as the clear visual separation wall */}
    <div className="shrink-0 flex items-center justify-center pl-3 border-l border-zinc-800">
      <UserButton />
    </div>
    
  </div>
</div>
    </aside>
  );
}
