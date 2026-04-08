import { Sidebar } from "@/components/Sidebar";

export default function MembersPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />

      {/* Main workspace */}
      <main className="min-w-0 flex-1 overflow-auto">
        <header className="border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-white">
            Members Directory
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Manage and review member profiles
          </p>
        </header>

        <div className="p-6">
          {/* Placeholder table */}
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-zinc-900/60 text-zinc-300">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:font-medium">
                  <th scope="col">Name</th>
                  <th scope="col">Plan</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody className="text-zinc-200">
                <tr className="border-t border-zinc-800 [&>td]:px-4 [&>td]:py-3">
                  <td className="text-zinc-400" colSpan={3}>
                    No members yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
