import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import AppShell from "@/components/AppShell";
import { Users, Shield, Layers, Code2, Mail, Award, CheckCircle } from "lucide-react";

export default async function TeamPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const team = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      specialization: true,
      skills: true,
    },
    orderBy: [
      { role: "asc" },
      { id: "asc" },
    ],
  });

  const roleBadgeStyles: Record<string, string> = {
    ADMIN: "bg-purple-950/60 text-purple-300 border-purple-800/60",
    MANAGER: "bg-blue-950/60 text-blue-300 border-blue-800/60",
    AGENT: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
  };

  const roleIcons: Record<string, any> = {
    ADMIN: Shield,
    MANAGER: Layers,
    AGENT: Code2,
  };

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="pb-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Users className="h-6 w-6 text-blue-400" />
              <span>NovaWorks Team Directory</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Read-only directory of all 10 registered company members used by the AI engine for deterministic role and skill assignment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              10 Seeded Accounts
            </span>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => {
            const RoleIcon = roleIcons[member.role] || Shield;
            const skillsList = member.skills
              ? member.skills.split(",").map((s) => s.trim())
              : [];

            const initials = member.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={member.id}
                className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700/80 transition-colors shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-slate-200 text-xs shadow-inner">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{member.name}</h3>
                          <span className="text-[10px] font-mono text-slate-500">[{member.id}]</span>
                        </div>
                        <span className="text-xs text-slate-400">{member.specialization}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
                        roleBadgeStyles[member.role]
                      }`}
                    >
                      <RoleIcon className="h-3 w-3" />
                      <span>{member.role}</span>
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="font-mono text-slate-300 text-[11px] truncate">{member.email}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1.5">
                        Technical Skills:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {skillsList.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle className="h-3 w-3" />
                    <span>Seeded & Verified</span>
                  </span>
                  <span className="font-mono">Demo123!</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
