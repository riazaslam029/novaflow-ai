import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getProjectsForUser, getTasksForUser } from "@/lib/authorization";

export const dynamic = "force-dynamic";
import AppShell from "@/components/AppShell";
import {
  Sparkles,
  FolderKanban,
  CheckSquare,
  Users,
  Clock,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const projects = await getProjectsForUser(user);
  const tasks = await getTasksForUser(user);

  const totalHours = projects.reduce(
    (sum, p) => sum + p.tasks.reduce((tSum: number, t: { estimatedHours: number }) => tSum + t.estimatedHours, 0),
    0
  );

  return (
    <AppShell user={user}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {user.role === "ADMIN" && "System Administrator • NovaWorks Technologies Overview"}
              {user.role === "MANAGER" && `Project Manager • ${user.specialization} Portfolio`}
              {user.role === "AGENT" && `Developer Agent • ${user.specialization} Workspace`}
            </p>
          </div>

          {user.role === "ADMIN" && (
            <div className="flex items-center gap-3">
              <Link
                href="/create-from-transcript"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Create from Transcript</span>
              </Link>
            </div>
          )}
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">
                {user.role === "AGENT" ? "Active Projects" : "Total Projects"}
              </span>
              <FolderKanban className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">{projects.length}</div>
            <p className="text-[11px] text-slate-400 mt-1">
              {user.role === "ADMIN" ? "Company-wide active portfolios" : "Scoped to your authorization"}
            </p>
          </div>

          <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">
                {user.role === "AGENT" ? "My Tasks" : "Total Tasks"}
              </span>
              <CheckSquare className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">{tasks.length}</div>
            <p className="text-[11px] text-slate-400 mt-1">
              {user.role === "AGENT" ? "Assigned directly to you" : "Across active projects"}
            </p>
          </div>

          <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Estimated Effort</span>
              <Clock className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">{totalHours} hrs</div>
            <p className="text-[11px] text-slate-400 mt-1">Total estimated dev work</p>
          </div>

          <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Team Capacity</span>
              <Users className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">10 Members</div>
            <p className="text-[11px] text-slate-400 mt-1">1 Admin, 3 PMs, 6 Agents</p>
          </div>
        </div>

        {/* Hero AI CTA for Admin */}
        {user.role === "ADMIN" && projects.length === 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-[#0f172a] to-indigo-950/40 p-8 sm:p-10 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Zero manual data entry required
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Turn a meeting into an actionable project plan in seconds
              </h2>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Paste your meeting transcript and NovaFlow AI will automatically extract projects, assign managers, break down developer tasks, calculate estimated hours, and set deadlines with atomic database verification.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/create-from-transcript"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Open Transcript Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all"
                >
                  <Users className="h-4 w-4" />
                  <span>View Team Directory</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">
                {user.role === "ADMIN" && "All Projects"}
                {user.role === "MANAGER" && "Managed Projects"}
                {user.role === "AGENT" && "Assigned Project Context"}
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {projects.length}
              </span>
            </div>
            <Link
              href="/projects"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-2xl p-10 text-center bg-[#0c1220]/40">
              <FolderKanban className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">No projects found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {user.role === "ADMIN"
                  ? "Paste a meeting transcript to automatically extract projects and tasks."
                  : "You do not currently have any assigned projects in your scope."}
              </p>
              {user.role === "ADMIN" && (
                <Link
                  href="/create-from-transcript"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Create from Transcript</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((proj) => {
                const projHours = proj.tasks.reduce(
                  (s: number, t: { estimatedHours: number }) => s + t.estimatedHours,
                  0
                );
                return (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.id}`}
                    className="group bg-[#0f172a]/90 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-5 transition-all hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-mono font-medium text-blue-400 tracking-wide uppercase">
                            {proj.clientName}
                          </span>
                          <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors mt-0.5">
                            {proj.name}
                          </h3>
                        </div>
                        <div className="h-7 w-7 rounded-lg bg-slate-800/80 group-hover:bg-blue-600/20 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors shrink-0">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      {proj.description && (
                        <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-500" />
                          <span>Manager:</span>
                        </span>
                        <strong className="text-slate-200">{proj.manager.name}</strong>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          <span>Deadline:</span>
                        </span>
                        <span className="font-mono text-slate-200">{proj.deadline}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                          {proj._count?.tasks ?? proj.tasks.length} tasks
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/50 text-blue-300 border border-blue-800/60">
                          {projHours} hrs total
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Tasks Section for Agent or Recent Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">
                {user.role === "AGENT" ? "My Assigned Tasks" : "Task Execution Overview"}
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {tasks.length}
              </span>
            </div>
            <Link
              href="/my-tasks"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              <span>View All Tasks</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center bg-[#0c1220]/40">
              <CheckSquare className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No tasks assigned or available.</p>
            </div>
          ) : (
            <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-800/70">
              {tasks.slice(0, 6).map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{task.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {task.project.name}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-400 max-w-xl truncate">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-slate-300">{task.assignee.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      <span>{task.deadline}</span>
                    </div>

                    <div className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/60">
                      {task.estimatedHours} hrs
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
