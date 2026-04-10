"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { AlertCircle, CheckCircle, IndianRupee } from "lucide-react";

type MemberStatus = "Active" | "Expired" | "Pending";
type MemberPlan = "Monthly" | "Quarterly" | "Annual";

type Member = {
  _id: string;
  name: string;
  plan: string;
  status: MemberStatus;
};

const pricing = { Monthly: 1500, Quarterly: 4000, Annual: 12000 } as const;

export default function PaymentsPage() {
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

  const { totalRevenue, pendingPayments, activePaidMembers } = useMemo(() => {
    return members.reduce(
      (acc, member) => {
        const amount = getAmountFromPlan(member.plan);

        if (member.status === "Active") {
          acc.totalRevenue += amount;
          acc.activePaidMembers += 1;
        } else if (member.status === "Pending") {
          acc.pendingPayments += amount;
        }

        return acc;
      },
      { totalRevenue: 0, pendingPayments: 0, activePaidMembers: 0 }
    );
  }, [members]);

  const getPaymentStatus = (status: MemberStatus) => {
    if (status === "Active") {
      return {
        label: "Paid",
        className: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
      };
    }
    if (status === "Pending") {
      return {
        label: "Unpaid",
        className: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/30",
      };
    }
    return {
      label: "Overdue",
      className: "bg-red-500/10 text-red-400 ring-red-500/30",
    };
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto">
        <header className="border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-white">Payments</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Track transactions and pending dues
          </p>
        </header>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">Total Revenue</p>
                <IndianRupee className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {isLoading ? "..." : formatINR(totalRevenue)}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">Pending Payments</p>
                <AlertCircle className="h-4 w-4 text-yellow-400" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {isLoading ? "..." : formatINR(pendingPayments)}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">Active Paid Members</p>
                <CheckCircle className="h-4 w-4 text-blue-400" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {isLoading ? "..." : activePaidMembers}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="border-b border-zinc-800 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-100">
                Payment Status
              </h2>
            </div>
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-zinc-900/60 text-zinc-300">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:font-medium">
                  <th scope="col">Name</th>
                  <th scope="col">Plan</th>
                  <th scope="col">Amount Due</th>
                  <th scope="col">Payment Status</th>
                </tr>
              </thead>
              <tbody className="text-zinc-200">
                {isLoading ? (
                  <tr className="border-t border-zinc-800 [&>td]:px-4 [&>td]:py-8">
                    <td className="text-center text-sm text-zinc-400" colSpan={4}>
                      Loading payment data...
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr className="border-t border-zinc-800 [&>td]:px-4 [&>td]:py-8">
                    <td className="text-center text-sm text-zinc-400" colSpan={4}>
                      No members found.
                    </td>
                  </tr>
                ) : (
                  members.map((member) => {
                    const amount = getAmountFromPlan(member.plan);
                    const payment = getPaymentStatus(member.status);

                    return (
                      <tr
                        key={member._id}
                        className="border-t border-zinc-800 [&>td]:px-4 [&>td]:py-3"
                      >
                        <td className="font-medium text-zinc-100">{member.name}</td>
                        <td className="text-zinc-300">{member.plan}</td>
                        <td className="text-zinc-200">{formatINR(amount)}</td>
                        <td>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${payment.className}`}
                          >
                            {payment.label}
                          </span>
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
    </div>
  );
}