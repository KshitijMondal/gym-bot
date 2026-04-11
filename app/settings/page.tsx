"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useClerk } from "@clerk/nextjs";
import { LogOut, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { signOut } = useClerk();
  
  const [formData, setFormData] = useState({
    gymName: "",
    contactNumber: "",
    supportEmail: "",
    enableWhatsAppBot: false,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch settings when the page loads
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            setFormData({
              gymName: data.gymName || "",
              contactNumber: data.contactNumber || "",
              supportEmail: data.supportEmail || "",
              enableWhatsAppBot: data.enableWhatsAppBot || false,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Handle saving the data
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Settings saved successfully!"); // Simple feedback for V1
    } catch (error) {
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-auto">
        <header className="border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-sm">
          <h1 className="text-lg font-semibold text-white">Facility Settings</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Manage your organization's core details and system preferences
          </p>
        </header>
        
        <div className="p-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-white">Organization Details</h2>
              <p className="mb-6 mt-1 text-sm text-zinc-400">
                This information is used for member communications and receipts.
              </p>

              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSave}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-zinc-200">Organization Name</label>
                      <input
                        type="text"
                        value={formData.gymName}
                        onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                        placeholder="e.g., Titan Fitness"
                        className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/40"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-200">Contact Number</label>
                      <input
                        type="tel"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-200">Support Email</label>
                    <input
                      type="email"
                      value={formData.supportEmail}
                      onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                      placeholder="admin@titanfitness.com"
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700/40"
                    />
                  </div>

                  <div className="border-t border-zinc-800/60 pt-6">
                    <h3 className="mb-4 text-sm font-medium text-zinc-200">System Integrations</h3>
                    <div className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/30 p-4">
                      <div>
                        <label className="text-sm font-medium text-zinc-200">Enable WhatsApp Bot</label>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          Automatically send payment receipts and reminders.
                        </p>
                      </div>
                      
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input 
                          type="checkbox" 
                          className="peer sr-only" 
                          checked={formData.enableWhatsAppBot}
                          onChange={(e) => setFormData({ ...formData, enableWhatsAppBot: e.target.checked })}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-zinc-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-800/60 pt-6">
                    <button
                      type="button"
                      onClick={() => signOut({ redirectUrl: '/' })}
                      className="group flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
                    >
                      <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      Sign Out
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:opacity-70"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}