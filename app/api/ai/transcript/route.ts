import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { processTranscriptWithAi, saveExtractionAtomically } from "@/server/ai-pipeline";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Only administrators can create projects from transcripts." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { transcript, action = "execute" } = body;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: "Paste a meeting transcript before continuing." },
        { status: 400 }
      );
    }

    // Step 1: AI Processing & Business Rule Validation
    const extraction = await processTranscriptWithAi(transcript);

    if (extraction.unresolved && extraction.unresolved.length > 0) {
      return NextResponse.json(
        {
          error: "Some required information could not be resolved from the transcript.",
          unresolved: extraction.unresolved,
        },
        { status: 422 }
      );
    }

    // If client requested preview only
    if (action === "preview") {
      const totalHours = extraction.projects.reduce(
        (sum, p) => sum + p.tasks.reduce((tSum, t) => tSum + t.estimatedHours, 0),
        0
      );
      const totalTasks = extraction.projects.reduce((sum, p) => sum + p.tasks.length, 0);

      return NextResponse.json({
        success: true,
        preview: true,
        data: extraction,
        summary: {
          projectCount: extraction.projects.length,
          taskCount: totalTasks,
          totalHours,
        },
      });
    }

    // Step 2: Atomic Transactional Save to PostgreSQL
    const savedProjects = await saveExtractionAtomically(extraction);

    const totalHours = savedProjects.reduce(
      (sum, p) => sum + p.tasks.reduce((tSum, t) => tSum + t.estimatedHours, 0),
      0
    );
    const totalTasks = savedProjects.reduce((sum, p) => sum + p.tasks.length, 0);

    return NextResponse.json({
      success: true,
      summary: {
        projectCount: savedProjects.length,
        taskCount: totalTasks,
        totalHours,
      },
      projects: savedProjects,
    });
  } catch (error: any) {
    console.error("AI transcript processing error:", error);

    const errorMessage = error?.message || "";
    if (errorMessage.includes("references unknown manager") || errorMessage.includes("references unknown assignee")) {
      return NextResponse.json(
        { error: "The transcript references a person who is not in the company directory. No partial records were created." },
        { status: 422 }
      );
    }

    if (errorMessage.includes("cannot be after project deadline")) {
      return NextResponse.json(
        { error: `Date validation error: ${errorMessage}. No partial records were created.` },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        error: "We couldn't safely interpret the meeting or an error occurred during atomic persistence. No partial records were created.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
