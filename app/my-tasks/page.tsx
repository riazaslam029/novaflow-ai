import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getTasksForUser } from "@/lib/authorization";

export const dynamic = "force-dynamic";
import AppShell from "@/components/AppShell";
import {
  CheckSquare,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  FolderKanban,
} from "lucide-react";

export default async function MyTasksPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const tasks = await getTasksForUser(user);
  const totalHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <CheckSquare className="h-6 w-6 text-emerald-400" />
              <span>
                {user.role === "AGENT" && "My Assigned Tasks"}
                {user.role === "MANAGER" && "Team Tasks (Managed Projects)"}
                {user.role === "ADMIN" && "All System Tasks"}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {user.role === "AGENT" && "Tasks assigned specifically to you across active client deliverables."}
              {user.role === "MANAGER" && "Tasks across projects under your management."}
              {user.role === "ADMIN" && "Company-wide task execution and delivery schedule."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
              {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-blue-950/60 text-blue-300 border border-blue-800/60">
              {totalHours} hrs effort
            </span>
          </div>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-[#0c1220]/40">
            <CheckSquare className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-200">No tasks found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              You do not have any tasks assigned in your current scope.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-[#0f172a]/90 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{task.title}</h3>
                    <Link
                      href={`/projects/${task.project.id}`}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-blue-400 hover:text-blue-300 hover:bg-slate-700/80 border border-slate-700 flex items-center gap-1 transition-colors"
                    >
                      <FolderKanban className="h-3 w-3" />
                      <span>{task.project.name}</span>
                    </Link>
                  </div>
                  {task.description && (
                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Users className="h-3.5 w-3.5 text-slate-500" />
                    <span>{task.assignee.name}</span>
                    <span className="text-[10px] text-slate-500">({task.assignee.specialization})</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{task.deadline}</span>
                  </div>

                  <div className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-semibold">
                    {task.estimatedHours} hrs
                  </div>

                  <Link
                    href={`/projects/${task.project.id}`}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="View Project"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
