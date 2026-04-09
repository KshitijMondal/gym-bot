"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Plus, Search, X } from "lucide-react";

export default function MembersPage() {
  type MemberStatus = "Active" | "Expired" | "Pending";
  type Member = {
    id: string;
    name: string;
    plan: string;
    status: MemberStatus;
    joinDate: string;
  };

  const initialMockMembers: Member[] = [
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
  ];

  const [members, setMembers] = useState<Member[]>(initialMockMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberPlan, setNewMemberPlan] = useState("Monthly");
  const [newMemberStatus, setNewMemberStatus] =
    useState<MemberStatus>("Active");

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

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
          {/* Search */}
          <div className="mb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-md">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/40"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30 hover:bg-emerald-500/15"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Member
              </button>
            </div>
          </div>

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
                {filteredMembers.map((m) => {
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

      {/* Modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Add Member
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Create a new member profile
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const name = newMemberName.trim();
                if (!name) return;

                const newMember = {
                  id: `m_${Math.random().toString(16).slice(2, 8)}`,
                  name,
                  plan: newMemberPlan,
                  status: newMemberStatus,
                  joinDate: new Date().toISOString().slice(0, 10),
                };

                setMembers((prev) => [...prev, newMember]);
                setIsModalOpen(false);
                setNewMemberName("");
                setNewMemberPlan("Monthly");
                setNewMemberStatus("Active");
              }}
            >
              <div>
                <label className="text-sm font-medium text-zinc-200">
                  Name
                </label>
                <input
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g., Rohan Singh"
                  className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/40"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-zinc-200">
                    Plan
                  </label>
                  <select
                    value={newMemberPlan}
                    onChange={(e) => setNewMemberPlan(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/40"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-200">
                    Status
                  </label>
                  <select
                    value={newMemberStatus}
                    onChange={(e) => setNewMemberStatus(e.target.value as MemberStatus)}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/40"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
