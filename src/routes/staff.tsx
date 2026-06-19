import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard · Prabandh Q" },
      { name: "description", content: "Staff dashboard for fees collection and complaint tracking." },
    ],
  }),
  component: StaffLayout,
});

function StaffLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const staffMenuItems = [
    { label: "Overview", path: "/staff", icon: "📊" },
    { label: "Fees Counter", path: "/staff/fees", icon: "💳" },
    { label: "Complaints", path: "/staff/complaints", icon: "📋" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } border-r border-border bg-card transition-all duration-300 ease-in-out`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {sidebarOpen && <span className="font-display font-bold text-primary">Prabandh Q</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-md p-1 hover:bg-accent">
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {staffMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                sidebarOpen ? "justify-start" : "justify-center"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <Button
            onClick={() => window.location.href = "/sign-in"}
            variant="outline"
            size="sm"
            className={`w-full ${!sidebarOpen && "px-2"}`}
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Staff Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                ST
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
