import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden. Only administrators can reset demo projects." },
      { status: 403 }
    );
  }

  try {
    // Delete all tasks and projects in a transaction; keep 10 seeded users intact
    await prisma.$transaction([
      prisma.task.deleteMany({}),
      prisma.project.deleteMany({}),
    ]);

    return NextResponse.json({
      success: true,
      message: "All projects and tasks have been reset cleanly. Seeded users remain intact.",
    });
  } catch (error) {
    console.error("Reset projects error:", error);
    return NextResponse.json(
      { error: "Failed to reset demo projects." },
      { status: 500 }
    );
  }
}
