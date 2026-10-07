import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AppShell from "@/components/AppShell";

export const dynamic = "force-dynamic";
import TranscriptWorkspaceClient from "./TranscriptWorkspaceClient";
import { ShieldAlert } from "lucide-react";

export default async function CreateFromTranscriptPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    return (
      <AppShell user={user}>
        <div className="max-w-xl mx-auto mt-16 p-8 rounded-2xl bg-rose-950/20 border border-rose-800/40 text-center">
          <ShieldAlert className="h-12 w-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Access Denied (403 Forbidden)</h2>
          <p className="text-sm text-slate-400 mt-2">
            Only System Administrators have permission to create projects from meeting transcripts.
          </p>
          <div className="mt-6">
            <a
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell user={user}>
      <TranscriptWorkspaceClient />
    </AppShell>
  );
}
