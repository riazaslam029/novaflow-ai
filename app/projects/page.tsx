import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getProjectsForUser } from "@/lib/authorization";

export const dynamic = "force-dynamic";
import AppShell from "@/components/AppShell";
import {
  FolderKanban,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const projects = await getProjectsForUser(user);

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <FolderKanban className="h-6 w-6 text-blue-400" />
              <span>
                {user.role === "ADMIN" && "All Projects"}
                {user.role === "MANAGER" && "Managed Projects"}
                {user.role === "AGENT" && "Related Projects"}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {user.role === "ADMIN" && "Company-wide project portfolios and client deliverables."}
              {user.role === "MANAGER" && "Projects under your direct management and oversight."}
              {user.role === "AGENT" && "Projects containing tasks assigned to you."}
            </p>
          </div>

          {user.role === "ADMIN" && (
            <Link
              href="/create-from-transcript"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-lg shadow-blue-500/25"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Create from Transcript</span>
            </Link>
          )}
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-[#0c1220]/40">
            <FolderKanban className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-200">No projects available</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {user.role === "ADMIN"
                ? "No projects have been generated yet. Open the Transcript Workspace to convert a meeting into projects."
                : "No projects match your current authorization scope."}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => {
              const projHours = proj.tasks.reduce(
                (s: number, t: { estimatedHours: number }) => s + t.estimatedHours,
                0
              );
              return (
                <Link
                  key={proj.id}
                  href={`/projects/${proj.id}`}
                  className="group bg-[#0f172a]/90 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono font-medium text-blue-400 uppercase tracking-wide">
                          {proj.clientName}
                        </span>
                        <h2 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mt-0.5">
                          {proj.name}
                        </h2>
                      </div>
                      <div className="h-8 w-8 rounded-lg bg-slate-800/80 group-hover:bg-blue-600/20 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors shrink-0">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>

                    {proj.description && (
                      <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2.5">
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
    </AppShell>
  );
}
