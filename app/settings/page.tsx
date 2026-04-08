import { Sidebar } from "@/components/Sidebar";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto">
        <header className="border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-white">Settings</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Manage gym profile and bot preferences
          </p>
        </header>
        <div className="p-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-500">
            System Configuration Options
          </div>
        </div>
      </main>
    </div>
  );
}