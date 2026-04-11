"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { AlertTriangle, Edit, Plus, Search, Trash2, X, MessageCircle, Loader2 } from "lucide-react";
import { sendWhatsAppMessage, generateReceiptText, generateReminderText } from "@/lib/whatsapp";

export default function MembersPage() {
  type MemberStatus = "Active" | "Expired" | "Pending";
  type Member = {
    _id: string;
    name: string;
    countryCode: string;
    phone: string;
    plan: string;
    status: MemberStatus;
    joinDate: string;
  };

  const COUNTRY_CODES = [
    { code: "+61", country: "Australia" },
    { code: "+973", country: "Bahrain" },
    { code: "+880", country: "Bangladesh" },
    { code: "+32", country: "Belgium" },
    { code: "+55", country: "Brazil" },
    { code: "+1", country: "Canada" },
    { code: "+86", country: "China" },
    { code: "+20", country: "Egypt" },
    { code: "+33", country: "France" },
    { code: "+49", country: "Germany" },
    { code: "+91", country: "India" },
    { code: "+62", country: "Indonesia" },
    { code: "+353", country: "Ireland" },
    { code: "+39", country: "Italy" },
    { code: "+81", country: "Japan" },
    { code: "+965", country: "Kuwait" },
    { code: "+60", country: "Malaysia" },
    { code: "+52", country: "Mexico" },
    { code: "+31", country: "Netherlands" },
    { code: "+64", country: "New Zealand" },
    { code: "+974", country: "Qatar" },
    { code: "+966", country: "Saudi Arabia" },
    { code: "+65", country: "Singapore" },
    { code: "+27", country: "South Africa" },
    { code: "+82", country: "South Korea" },
    { code: "+34", country: "Spain" },
    { code: "+971", country: "UAE" },
    { code: "+44", country: "UK" },
    { code: "+1", country: "US" },
  ];

  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    countryCode: string;
    phone: string;
    plan: string;
    status: MemberStatus;
  }>({
    name: "",
    countryCode: "+91",
    phone: "",
    plan: "Monthly",
    status: "Active",
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      countryCode: "+91",
      phone: "",
      plan: "Monthly",
      status: "Active",
    });
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
                  setFormData({
                    name: "",
                    countryCode: "+91",
                    phone: "",
                    plan: "Monthly",
                    status: "Active",
                  });
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
                  <th scope="col">Phone</th>
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
                    <td className="text-center text-sm text-zinc-400" colSpan={5}>
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
                      <td className="text-zinc-300">{m.countryCode} {m.phone}</td>
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
                          
                          {/* NEW WHATSAPP BUTTON */}
                          <button
                            type="button"
                            onClick={() => {
                              const message = m.status === "Active" 
                                ? generateReceiptText("Titan Fitness", m.name, m.plan) 
                                : generateReminderText("Titan Fitness", m.name);
                                
                              sendWhatsAppMessage(`${m.countryCode || "+91"}${m.phone}`, message);
                            }}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/30 hover:bg-emerald-500/20"
                          >
                            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            WhatsApp
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(m._id);
                              setFormData({
                                name: m.name || "",
                                countryCode: m.countryCode || "+91",
                                phone: m.phone || "",
                                plan: m.plan || "Monthly",
                                status: (m.status || "Active") as MemberStatus,
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
                const phone = formData.phone.trim();
                if (!name) {
                  alert("Name is required");
                  return;
                }
                if (!/^\d{10}$/.test(phone)) {
                  alert("Phone number must be exactly 10 digits (0-9 only).");
                  return;
                }

                setIsSaving(true);
                try {
                  const res = await fetch(
                    editingId ? `/api/members/${editingId}` : "/api/members",
                    {
                      method: editingId ? "PUT" : "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name,
                        countryCode: formData.countryCode,
                        phone,
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
                } finally {
                  setIsSaving(false);
                }
              }}
            >
              <div>
                <label className="text-sm font-medium text-zinc-200">
                  Name
                </label>
                <input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Rohan Singh"
                  className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/40"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-200">
                  Phone
                </label>
                <div className="mt-2 flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        countryCode: e.target.value,
                      }))
                    }
                    className="w-[30%] rounded-lg border border-zinc-800 bg-zinc-950/60 px-2 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/40"
                  >
                    {COUNTRY_CODES.map((item) => (
                      <option
                        key={`${item.country}-${item.code}`}
                        value={item.code}
                      >
                        {item.country} ({item.code})
                      </option>
                    ))}
                  </select>
                  <input
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="10-digit phone number"
                    className="w-[70%] rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/40"
                  />
                </div>
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
                  disabled={isSaving}
                  className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
                >
                  <span className="inline-flex items-center gap-2">
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : null}
                    {isSaving ? "Saving..." : "Save"}
                  </span>
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

                    setIsDeleting(true);
                    try {
                      const res = await fetch(`/api/members/${id}`, {
                        method: "DELETE",
                      });
                      if (!res.ok) return;

                      setMembers((prev) => prev.filter((m) => m._id !== id));
                      setMemberToDelete(null);
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                  className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-red-400"
                >
                  <span className="inline-flex items-center gap-2">
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : null}
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}