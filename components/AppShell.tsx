"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  LogOut,
  Menu,
  X,
  Shield,
  Layers,
  Code2,
} from "lucide-react";

export interface ShellUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "AGENT";
  specialization: string;
  skills: string;
}

interface AppShellProps {
  user: ShellUser;
  children: React.ReactNode;
}

export default function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      label: "Projects",
      href: "/projects",
      icon: FolderKanban,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      label: "My Tasks",
      href: "/my-tasks",
      icon: CheckSquare,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      label: "Team Directory",
      href: "/team",
      icon: Users,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      label: "Create from Transcript",
      href: "/create-from-transcript",
      icon: Sparkles,
      roles: ["ADMIN"],
      highlight: true,
    },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(user.role));

  const roleBadgeColors: Record<string, string> = {
    ADMIN: "bg-purple-950/60 text-purple-300 border-purple-800/60",
    MANAGER: "bg-blue-950/60 text-blue-300 border-blue-800/60",
    AGENT: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
  };

  const roleIcon: Record<string, any> = {
    ADMIN: Shield,
    MANAGER: Layers,
    AGENT: Code2,
  };
  const RoleIconComponent = roleIcon[user.role] || Shield;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-[#090d16]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/70 bg-[#0c1220]/80 backdrop-blur-xl">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/60">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 tracking-tight text-base">NovaFlow</span>
              <span className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Meeting to Execution</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Workspace
          </div>
          {visibleNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? item.highlight
                      ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/20 text-blue-300 border border-blue-500/40 shadow-sm"
                      : "bg-slate-800/70 text-white border border-slate-700/50"
                    : item.highlight
                    ? "text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive
                      ? item.highlight
                        ? "text-blue-400"
                        : "text-slate-200"
                      : item.highlight
                      ? "text-blue-400"
                      : "text-slate-400"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {item.highlight && (
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30 font-mono">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-800/60 bg-[#0a0f1d]/60">
          <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-800/70 bg-slate-900/60">
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold text-slate-200 text-xs shadow-inner">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-200 truncate">{user.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                roleBadgeColors[user.role]
              }`}
            >
              {user.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-md transition-colors border border-transparent hover:border-rose-900/40"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/70 bg-[#0c1220]/60 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="font-medium text-slate-200">NovaWorks Technologies</span>
              <span>/</span>
              <span className="capitalize text-slate-400">
                {pathname.replace("/", "").replace(/-/g, " ") || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <RoleIconComponent className="h-3.5 w-3.5 text-blue-400" />
              <span>Signed in as <strong className="text-white">{user.name}</strong></span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${roleBadgeColors[user.role]}`}>
                {user.role}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-[#0c1220] px-4 py-3 space-y-1">
            {visibleNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-950/20 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
