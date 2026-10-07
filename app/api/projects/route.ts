import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProjectsForUser } from "@/lib/authorization";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const projects = await getProjectsForUser(user);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json(
      { error: "Failed to load projects." },
      { status: 500 }
    );
  }
}
