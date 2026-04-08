import { Sidebar } from "@/components/Sidebar";
import { Activity, CreditCard, TrendingUp, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />

      {/* Main workspace */}
      <main className="min-w-0 flex-1 overflow-auto">
        <header className="border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Overview and quick actions
          </p>
        </header>

        <div className="p-6">
          {/* Metrics */}
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
                  <p className="mt-1 text-2xl font-semibold text-white">248</p>
                  <p className="mt-1 text-xs text-zinc-500">+12 this month</p>
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
                    Active Subscriptions
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">193</p>
                  <p className="mt-1 text-xs text-zinc-500">78% of total</p>
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
                    ₹1,42,800
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    +9.4% vs last month
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
            <div className="border-b border-zinc-800 px-5 py-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-white">
                  Recent Activity
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-zinc-500">
                Latest member and payment updates
              </p>
            </div>
            <ul className="divide-y divide-zinc-800">
              <li className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-200">
                      Rahul joined the gym
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Today • 10:12 AM
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                    Update
                  </span>
                </div>
              </li>
              <li className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-200">
                      Payment received from Neha (₹1,999)
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Today • 9:05 AM
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                    Payment
                  </span>
                </div>
              </li>
              <li className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-200">
                      Plan renewed for Arjun (3 months)
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Yesterday • 7:40 PM
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-400">
                    Renewal
                  </span>
                </div>
              </li>
              <li className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-200">
                      Subscription expired for Priya
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Yesterday • 3:18 PM
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-zinc-700/50 px-2 py-0.5 text-xs font-medium text-zinc-300">
                    Alert
                  </span>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}