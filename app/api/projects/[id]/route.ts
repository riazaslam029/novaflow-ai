import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProjectByIdForUser } from "@/lib/authorization";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
  }

  try {
    const project = await getProjectByIdForUser(user, id);

    if (project === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Forbidden. You do not have permission to access this project." },
        { status: 403 }
      );
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Fetch project details error:", error);
    return NextResponse.json(
      { error: "Failed to load project details." },
      { status: 500 }
    );
  }
}
