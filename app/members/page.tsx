import { Sidebar } from "@/components/Sidebar";

export default function MembersPage() {
  const mockMembers = [
    {
      id: "m_001",
      name: "Rahul Sharma",
      plan: "Annual",
      status: "Active",
      joinDate: "2026-01-18",
    },
    {
      id: "m_002",
      name: "Neha Verma",
      plan: "Monthly",
      status: "Active",
      joinDate: "2026-03-02",
    },
    {
      id: "m_003",
      name: "Arjun Mehta",
      plan: "Quarterly",
      status: "Pending",
      joinDate: "2026-04-05",
    },
    {
      id: "m_004",
      name: "Priya Nair",
      plan: "Monthly",
      status: "Expired",
      joinDate: "2025-11-21",
    },
    {
      id: "m_005",
      name: "Sanya Kapoor",
      plan: "Annual",
      status: "Active",
      joinDate: "2026-02-10",
    },
  ] as const;

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
                {mockMembers.map((m) => {
                  const statusClass =
                    m.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : m.status === "Expired"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400";

                  return (
                    <tr
                      key={m.id}
                      className="border-t border-zinc-800 [&>td]:px-4 [&>td]:py-3"
                    >
                      <td className="font-medium text-zinc-100">
                        <div className="flex flex-col">
                          <span>{m.name}</span>
                          <span className="mt-0.5 text-xs text-zinc-500">
                            Joined {m.joinDate}
                          </span>
                        </div>
                      </td>
                      <td className="text-zinc-300">{m.plan}</td>
                      <td>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
