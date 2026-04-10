"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Activity, CreditCard, TrendingUp, Users } from "lucide-react";

type MemberStatus = "Active" | "Expired" | "Pending";
type MemberPlan = "Monthly" | "Quarterly" | "Annual";

type Member = {
  _id: string;
  name: string;
  plan: string;
  status: MemberStatus;
  joinDate: string;
};

const pricing = { Monthly: 1500, Quarterly: 4000, Annual: 12000 } as const;

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const getAmountFromPlan = (plan: string) =>
    pricing[(plan as MemberPlan) ?? "Monthly"] ?? 0;

  const { totalMembers, activeMembers, monthlyRevenue } = useMemo(() => {
    return members.reduce(
      (acc, member) => {
        if (member.status === "Active") {
          acc.activeMembers += 1;
          acc.monthlyRevenue += getAmountFromPlan(member.plan);
        }
        return acc;
      },
      {
        totalMembers: members.length,
        activeMembers: 0,
        monthlyRevenue: 0,
      }
    );
  }, [members]);

  const recentMembers = useMemo(() => {
    return [...members]
      .sort(
        (a, b) =>
          new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      )
      .slice(0, 5);
  }, [members]);

  const getStatusBadgeClass = (status: MemberStatus) => {
    if (status === "Active") return "bg-emerald-500/10 text-emerald-400";
    if (status === "Pending") return "bg-yellow-500/10 text-yellow-400";
    return "bg-red-500/10 text-red-400";
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto">
        <header className="border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Overview and quick actions
          </p>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-300">
                    Total Members
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {isLoading ? "..." : totalMembers}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                  <CreditCard className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-300">
                    Active Members
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {isLoading ? "..." : activeMembers}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
                  <TrendingUp className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-300">
                    Monthly Revenue
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {isLoading ? "..." : formatINR(monthlyRevenue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="border-b border-zinc-800 px-5 py-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-white">
                  Recent Activity
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">
                5 most recently joined members
              </p>
            </div>
            <ul className="divide-y divide-zinc-800">
              {isLoading ? (
                <li className="px-5 py-4 text-sm text-zinc-400">Loading members...</li>
              ) : recentMembers.length === 0 ? (
                <li className="px-5 py-4 text-sm text-zinc-400">No recent activity.</li>
              ) : (
                recentMembers.map((member) => (
                  <li key={member._id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm text-zinc-200">{member.name}</p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {member.plan} plan
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(member.status)}`}
                      >
                        {member.status}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}