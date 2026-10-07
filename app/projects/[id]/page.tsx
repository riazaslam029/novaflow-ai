import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getProjectByIdForUser } from "@/lib/authorization";

export const dynamic = "force-dynamic";
import AppShell from "@/components/AppShell";
import {
  FolderKanban,
  Users,
  Calendar,
  Clock,
  ArrowLeft,
  ShieldAlert,
  CheckSquare,
  FileQuestion,
  UserCheck,
} from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const project = await getProjectByIdForUser(user, id);

  if (project === "FORBIDDEN") {
    return (
      <AppShell user={user}>
        <div className="max-w-xl mx-auto mt-16 p-8 rounded-2xl bg-rose-950/20 border border-rose-800/40 text-center">
          <ShieldAlert className="h-12 w-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Access Denied (403 Forbidden)</h2>
          <p className="text-sm text-slate-400 mt-2">
            You do not have authorization to view this project. Server-side role policies restrict access strictly to permitted personnel.
          </p>
          <div className="mt-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to My Projects</span>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell user={user}>
        <div className="max-w-xl mx-auto mt-16 p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <FileQuestion className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Project Not Found (404)</h2>
          <p className="text-sm text-slate-400 mt-2">
            The requested project identifier does not exist in the database.
          </p>
          <div className="mt-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Projects</span>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const totalHours = project.tasks.reduce(
    (sum, t) => sum + t.estimatedHours,
    0
  );

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Project Header Card */}
        <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-semibold text-blue-400 tracking-wider uppercase">
                {project.clientName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-sm text-slate-400 mt-2.5 max-w-3xl leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-start">
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-blue-950/60 text-blue-300 border border-blue-800/60">
                {project.tasks.length} {project.tasks.length === 1 ? "Task" : "Tasks"}
              </span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                {totalHours} hrs effort
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-medium">Project Manager</span>
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <Users className="h-3.5 w-3.5 text-blue-400" />
                <span>{project.manager.name}</span>
                <span className="text-[10px] text-slate-400">({project.manager.specialization})</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-medium">Project Deadline</span>
              <div className="flex items-center gap-2 text-slate-200 font-mono font-medium">
                <Calendar className="h-3.5 w-3.5 text-purple-400" />
                <span>{project.deadline}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] font-medium">Access Scope</span>
              <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{user.role === "AGENT" ? "Assigned Tasks Only" : "Full Scope"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">
                {user.role === "AGENT" ? "My Tasks in this Project" : "Project Task Breakdown"}
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {project.tasks.length}
              </span>
            </div>
          </div>

          {project.tasks.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center bg-[#0c1220]/40">
              <CheckSquare className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No tasks found for your role in this project.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {project.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="bg-[#0f172a]/90 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
                      <h3 className="text-sm font-semibold text-white">{task.title}</h3>
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
