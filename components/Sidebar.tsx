import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/80">
      {/* Brand */} 
      <div className="border-b border-zinc-800 px-4 py-5">
        <p className="text-sm font-semibold tracking-tight text-white">
          Gym Management
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">Bot dashboard</p>
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

      <div className="mt-auto border-t border-zinc-800 p-3">
        <div className="flex items-center justify-center rounded-md px-2 py-2">
          <UserButton
            appearance={{
              elements: { userButtonAvatarBox: "w-8 h-8" },
            }}
          />
        </div>
      </div>
    </aside>
  );
}
