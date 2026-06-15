"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Activity, CreditCard, TrendingUp, Users } from "lucide-react";

type MemberStatus = "Active" | "Expired" | "Pending";

type RecentMember = {
  _id: string;
  name: string;
  plan: string;
  status: MemberStatus;
  joinDate: string;
};

type DashboardStats = {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  recentActivity: RecentMember[];
};

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    monthlyRevenue: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/dashboard/stats", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch dashboard statistics");

        const data = (await res.json()) as DashboardStats;
        if (isMounted) {
          setStats({
            totalMembers: data.totalMembers ?? 0,
            activeMembers: data.activeMembers ?? 0,
            monthlyRevenue: data.monthlyRevenue ?? 0,
            recentActivity: Array.isArray(data.recentActivity) ? data.recentActivity : [],
          });
        }
      } catch (err) {
        console.error("Dashboard stats loader error:", err);
        if (isMounted) {
          setStats({
            totalMembers: 0,
            activeMembers: 0,
            monthlyRevenue: 0,
            recentActivity: [],
          });
        }
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
            {/* Total Members Metric Card */}
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
                    {isLoading ? "..." : stats.totalMembers}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Members Metric Card */}
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
                    {isLoading ? "..." : stats.activeMembers}
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly Revenue Metric Card */}
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
                    {isLoading ? "..." : formatINR(stats.monthlyRevenue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
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
                <li className="px-5 py-4 text-sm text-zinc-400">Loading activity data...</li>
              ) : stats.recentActivity.length === 0 ? (
                <li className="px-5 py-4 text-sm text-zinc-400">No recent activity found.</li>
              ) : (
                stats.recentActivity.map((member) => (
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