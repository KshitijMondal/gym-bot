"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { AlertTriangle, Edit, Plus, Search, Trash2, X } from "lucide-react";

export default function MembersPage() {
  type MemberStatus = "Active" | "Expired" | "Pending";
  type Member = {
    _id: string;
    name: string;
    plan: string;
    status: MemberStatus;
    joinDate: string;
  };

  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    plan: string;
    status: MemberStatus;
  }>({ name: "", plan: "Monthly", status: "Active" });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", plan: "Monthly", status: "Active" });
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/members", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch members");

        const data = (await res.json()) as Member[];
        if (isMounted) setMembers(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) setMembers([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: "", plan: "Monthly", status: "Active" });
                  setIsModalOpen(true);
                }}
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
                  <th scope="col" className="text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-zinc-200">
                {isLoading ? (
                  <tr className="border-t border-zinc-800 [&>td]:px-4 [&>td]:py-8">
                    <td className="text-center text-sm text-zinc-400" colSpan={4}>
                      Loading members...
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => {
                  const statusClass =
                    m.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : m.status === "Expired"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400";

                  return (
                    <tr
                      key={m._id}
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
                      <td className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(m._id);
                              setFormData({
                                name: m.name,
                                plan: m.plan,
                                status: m.status,
                              });
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-300 ring-1 ring-inset ring-blue-500/30 hover:bg-blue-500/15"
                          >
                            <Edit className="h-3.5 w-3.5" aria-hidden="true" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setMemberToDelete(m._id)}
                            className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-300 ring-1 ring-inset ring-red-500/30 hover:bg-red-500/15"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
                )}
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
                  {editingId ? "Edit Member" : "Add Member"}
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {editingId
                    ? "Update member details"
                    : "Create a new member profile"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const name = formData.name.trim();
                if (!name) return;

                const res = await fetch(
                  editingId ? `/api/members/${editingId}` : "/api/members",
                  {
                    method: editingId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name,
                      plan: formData.plan,
                      status: formData.status,
                    }),
                  }
                );

                if (!res.ok) return;

                const saved = (await res.json()) as Member;
                setMembers((prev) =>
                  editingId
                    ? prev.map((m) => (m._id === saved._id ? saved : m))
                    : [...prev, saved]
                );
                closeModal();
              }}
            >
              <div>
                <label className="text-sm font-medium text-zinc-200">
                  Name
                </label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
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
                    value={formData.plan}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, plan: e.target.value }))
                    }
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
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as MemberStatus,
                      }))
                    }
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
                  onClick={closeModal}
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

      {/* Delete confirmation */}
      {memberToDelete ? (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="flex h-full items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-red-500/10 p-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">
                    Delete Member
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Are you sure? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMemberToDelete(null)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800/60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const id = memberToDelete;
                    if (!id) return;

                    const res = await fetch(`/api/members/${id}`, {
                      method: "DELETE",
                    });
                    if (!res.ok) return;

                    setMembers((prev) => prev.filter((m) => m._id !== id));
                    setMemberToDelete(null);
                  }}
                  className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-red-400"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
