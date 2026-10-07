import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const DEMO_USERS = [
  {
    id: "ADMIN",
    name: "Admin",
    email: "admin@novaworks.example",
    role: "ADMIN",
    specialization: "Administrator",
    skills: "Company overview, transcript creation",
  },
  {
    id: "PM01",
    name: "Ayesha Khan",
    email: "ayesha@novaworks.example",
    role: "MANAGER",
    specialization: "Web PM",
    skills: "Web projects, client coordination",
  },
  {
    id: "PM02",
    name: "Bilal Ahmed",
    email: "bilal@novaworks.example",
    role: "MANAGER",
    specialization: "Mobile PM",
    skills: "Mobile projects, delivery planning",
  },
  {
    id: "PM03",
    name: "Hina Malik",
    email: "hina@novaworks.example",
    role: "MANAGER",
    specialization: "AI PM",
    skills: "AI projects, requirement review",
  },
  {
    id: "DEV01",
    name: "Ali Raza",
    email: "ali@novaworks.example",
    role: "AGENT",
    specialization: "Full-Stack",
    skills: "React, frontend integration",
  },
  {
    id: "DEV02",
    name: "Hamza Shah",
    email: "hamza@novaworks.example",
    role: "AGENT",
    specialization: "Full-Stack",
    skills: "Node.js, databases, APIs",
  },
  {
    id: "DEV03",
    name: "Sara Noor",
    email: "sara@novaworks.example",
    role: "AGENT",
    specialization: "App Developer",
    skills: "Flutter, mobile UI",
  },
  {
    id: "DEV04",
    name: "Usman Tariq",
    email: "usman@novaworks.example",
    role: "AGENT",
    specialization: "App Developer",
    skills: "Flutter, integration, testing",
  },
  {
    id: "DEV05",
    name: "Zain Abbas",
    email: "zain@novaworks.example",
    role: "AGENT",
    specialization: "AI Developer",
    skills: "LLMs, extraction, prompts",
  },
  {
    id: "DEV06",
    name: "Maryam Asif",
    email: "maryam@novaworks.example",
    role: "AGENT",
    specialization: "AI Developer",
    skills: "Retrieval, document processing",
  },
];

async function seed() {
  console.log("🌱 Starting idempotent database seed for NovaFlow AI...");
  const defaultPassword = "Demo123!";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  for (const user of DEMO_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        id: user.id,
        name: user.name,
        role: user.role,
        specialization: user.specialization,
        skills: user.skills,
        passwordHash,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        skills: user.skills,
        passwordHash,
      },
    });
    console.log(`  ✓ Upserted [${user.role}] ${user.name} (${user.email}) [ID: ${user.id}]`);
  }

  const count = await prisma.user.count();
  console.log(`\n✅ Database seed completed. Total active users: ${count}`);
}

seed()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
