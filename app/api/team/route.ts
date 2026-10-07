import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
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

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Fetch team error:", error);
    return NextResponse.json(
      { error: "Failed to load team directory." },
      { status: 500 }
    );
  }
}
