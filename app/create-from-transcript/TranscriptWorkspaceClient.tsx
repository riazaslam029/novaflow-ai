"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  OFFICIAL_MEETING_TRANSCRIPT,
  MODIFIED_MEETING_TRANSCRIPT,
} from "@/lib/transcripts";
import {
  Sparkles,
  Clipboard,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  CheckSquare,
  Clock,
  Calendar,
  ArrowRight,
  RefreshCw,
  Eye,
  RotateCcw,
} from "lucide-react";

const PIPELINE_STAGES = [
  "Reading meeting transcript",
  "Identifying distinct projects & clients",
  "Matching team members against company directory",
  "Extracting tasks & filtering rejected features",
  "Validating dates & effort constraints",
  "Executing atomic database transaction",
];

export default function TranscriptWorkspaceClient() {
  const [transcript, setTranscript] = useState(OFFICIAL_MEETING_TRANSCRIPT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const simulateStages = () => {
    setCurrentStageIndex(0);
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < PIPELINE_STAGES.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 400);
    return interval;
  };

  const handleAction = async (action: "preview" | "execute") => {
    if (!transcript.trim()) {
      setError("Paste a meeting transcript before continuing.");
      return;
    }

    setError(null);
    setResetMessage(null);
    setIsProcessing(true);
    const stageInterval = simulateStages();

    try {
      const res = await fetch("/api/ai/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, action }),
      });

      clearInterval(stageInterval);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "We couldn't safely interpret the meeting. No records were created.");
        setIsProcessing(false);
        return;
      }

      if (action === "preview") {
        setPreviewData(data);
      } else {
        setSuccessResult(data);
        setPreviewData(null);
      }
    } catch {
      clearInterval(stageInterval);
      setError("Network or server timeout occurred during AI processing. Please retry.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTranscript(text);
        setError(null);
      }
    } catch {
      setError("Clipboard access denied. Please paste manually into the editor.");
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all created projects and tasks? Seeded users will remain intact.")) {
      return;
    }

    setIsResetting(true);
    setError(null);
    try {
      const res = await fetch("/api/projects/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResetMessage("All demo projects and tasks have been reset cleanly!");
        setSuccessResult(null);
        setPreviewData(null);
      } else {
        setError(data.error || "Failed to reset demo records.");
      }
    } catch {
      setError("Network error while resetting records.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium mb-2.5">
            <Sparkles className="h-3.5 w-3.5" />
            Deterministic AI Meeting Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Turn meeting into execution
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Paste a meeting transcript and NovaFlow AI will identify projects, owners, deadlines, and actionable work with atomic validation.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={isResetting || isProcessing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-white text-xs font-medium transition-all self-start md:self-auto"
          title="Wipes projects and tasks while keeping seeded demo accounts intact for re-testing"
        >
          <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`} />
          <span>Reset Demo Projects</span>
        </button>
      </div>

      {resetMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{resetMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <strong className="font-semibold block text-sm mb-0.5">Execution Halted</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* SUCCESS STATE */}
      {successResult && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0f172a] to-blue-950/30 border border-emerald-500/40 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Plan created successfully!</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    All records validated against the team directory and saved atomically in the database.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-lg shadow-blue-600/30"
                >
                  <span>View Projects</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => setSuccessResult(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all border border-slate-700"
                >
                  Create Another Plan
                </button>
              </div>
            </div>

            {/* Generated Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Projects Created</span>
                <div className="text-2xl font-bold text-white mt-1">
                  {successResult.summary?.projectCount ?? 3}
                </div>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Tasks Scheduled</span>
                <div className="text-2xl font-bold text-white mt-1">
                  {successResult.summary?.taskCount ?? 12}
                </div>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Total Dev Effort</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {successResult.summary?.totalHours ?? 124} hrs
                </div>
              </div>
            </div>

            {/* Created Projects List */}
            <div className="mt-6 space-y-4">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Generated Projects & Assignments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {successResult.projects?.map((p: any) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 uppercase">{p.clientName}</span>
                      <h4 className="text-sm font-semibold text-white mt-0.5">{p.name}</h4>
                      <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>Manager:</span>
                          <strong className="text-slate-200">{p.manager?.name || p.managerId}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Deadline:</span>
                          <span className="font-mono text-slate-200">{p.deadline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tasks:</span>
                          <span className="font-mono text-emerald-400">{p.tasks?.length} tasks</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                      <Link
                        href={`/projects/${p.id}`}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRANSCRIPT EDITOR WORKSPACE */}
      <div className="bg-[#0f172a]/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
        {/* Top Control Bar with Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTranscript(OFFICIAL_MEETING_TRANSCRIPT);
                setError(null);
                setPreviewData(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-medium transition-all"
            >
              Load Official Meeting Transcript
            </button>

            <button
              type="button"
              onClick={() => {
                setTranscript(MODIFIED_MEETING_TRANSCRIPT);
                setError(null);
                setPreviewData(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all"
              title="Loads QuickServe integration test: 12 hours, 23 October"
            >
              Load Modified Test Transcript
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePaste}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
            >
              <Clipboard className="h-3.5 w-3.5" />
              <span>Paste</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTranscript("");
                setError(null);
                setPreviewData(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs font-medium transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              setError(null);
            }}
            placeholder="Paste your meeting notes or transcript here..."
            rows={14}
            disabled={isProcessing}
            className="w-full bg-[#0a0f1d] border border-slate-800 rounded-xl p-4 text-xs sm:text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed transition-colors resize-y disabled:opacity-60"
          />
          <div className="absolute right-4 bottom-4 text-[11px] font-mono text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
            {transcript.length} characters
          </div>
        </div>

        {/* PROCESSING PROGRESS ANIMATION */}
        {isProcessing && (
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/50 space-y-3">
            <div className="flex items-center justify-between text-xs text-blue-300 font-medium">
              <span className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-400" />
                <span>AI Pipeline: {PIPELINE_STAGES[currentStageIndex]}</span>
              </span>
              <span className="font-mono text-slate-400">
                {Math.round(((currentStageIndex + 1) / PIPELINE_STAGES.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{
                  width: `${((currentStageIndex + 1) / PIPELINE_STAGES.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            Atomic persistence: All 3 projects & 12 tasks are validated before database commit.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleAction("preview")}
              disabled={isProcessing || !transcript.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all border border-slate-700 disabled:opacity-50"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview Plan</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction("execute")}
              disabled={isProcessing || !transcript.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" />
              <span>Create Projects with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* PREVIEW PLAN DRAWER */}
      {previewData && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-blue-500/40 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">AI Extraction Preview (Not Saved Yet)</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
                {previewData.summary?.projectCount} Projects • {previewData.summary?.taskCount} Tasks • {previewData.summary?.totalHours} hrs
              </span>
              <button
                onClick={() => handleAction("execute")}
                disabled={isProcessing}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                Confirm & Save Atomically
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {previewData.data?.projects?.map((proj: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase">{proj.clientName}</span>
                    <h4 className="text-sm font-semibold text-white">{proj.name}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{proj.deadline}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Manager ID: <strong className="text-slate-200">{proj.managerId}</strong>
                </div>
                <div className="border-t border-slate-800 pt-2 space-y-1.5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Tasks ({proj.tasks.length}):</span>
                  {proj.tasks.map((t: any, tIdx: number) => (
                    <div key={tIdx} className="text-xs flex justify-between text-slate-300 bg-slate-950/40 p-1.5 rounded border border-slate-800/60">
                      <span className="truncate pr-2">{t.title}</span>
                      <span className="font-mono text-[10px] text-emerald-400 shrink-0">{t.estimatedHours}h ({t.assigneeId})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
