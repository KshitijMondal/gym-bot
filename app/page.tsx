export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Left nav */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/80">
        <div className="border-b border-zinc-800 px-4 py-5">
          <p className="text-sm font-semibold tracking-tight text-white">
            Gym Management
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">Bot dashboard</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <span className="rounded-md px-3 py-2 text-sm text-zinc-400">
            Members
          </span>
          <span className="rounded-md px-3 py-2 text-sm text-zinc-400">
            Payments
          </span>
          <span className="rounded-md px-3 py-2 text-sm text-zinc-400">
            Settings
          </span>
        </nav>
      </aside>

      {/* Main workspace */}
      <main className="min-w-0 flex-1 overflow-auto">
        <header className="border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Overview and quick actions
          </p>
        </header>
        <div className="p-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-500">
            Main content area
          </div>
        </div>
      </main>
    </div>
  );
}
